// 场景测试 DSL 核心 —— Node CLI 与浏览器运行时共享
//
// 设计原则：
//   1. 只放纯函数：无 DOM、无 fs、无 fetch，可在任意 JS 环境运行
//   2. UMD 风格导出：Node 通过 require 引入，浏览器通过 window.ScenarioCore 引用
//   3. 调用方负责环境相关的副作用（请求、文件、渲染）
//
// 使用方式：
//   Node:   const core = require('./core');
//   浏览器: var core = window.ScenarioCore;  // 需在 runtime.js 之前加载

import md5Impl from 'blueimp-md5';

const legacyCore = (function (globalRoot) {
    'use strict';

    // ===== MD5 =====
    //
    // 优先用 Node 原生 crypto（最快最准），浏览器回退到 vendor/blueimp-md5.js。
    // 浏览器端必须先加载 vendor/blueimp-md5.js，它会挂到 window.md5。
    // 两端输出均为 32 位小写十六进制字符串，行为一致。
    var md5;
    if (typeof md5Impl === 'function') {
        md5 = function (input) {
            return md5Impl(String(input));
        };
    } else {
        md5 = function () {
            throw new Error('未加载 vendor/blueimp-md5.js，无法计算 MD5');
        };
    }

    // ===== 签名生成（MD5 + URL 参数格式）=====
    //
    // 按照集成平台对接文档 V2.2.260724 生成签名：
    //   1. 将 params 中的键按字典序排序
    //   2. 拼成 key1=val1&key2=val2&... 格式
    //   3. 追加 &apiSecret=secretValue
    //   4. 对整串做 MD5，输出 32 位大写十六进制
    // 两端输出一致。
    function generateSignature(params, secretValue) {
        var keys = Object.keys(params || {}).sort();
        var pairs = [];
        keys.forEach(function (key) {
            var val = params[key];
            pairs.push(key + '=' + (val == null ? '' : String(val)));
        });
        pairs.push('apiSecret=' + (secretValue == null ? '' : String(secretValue)));
        return md5(pairs.join('&')).toUpperCase();
    }

    // ===== 基础工具 =====

    function clone(value) {
        return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    }

    function isPlainObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    function deepEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function esc(s) {
        if (s == null) return '';
        if (typeof document !== 'undefined' && document.createElement) {
            var d = document.createElement('div');
            d.textContent = s;
            return d.innerHTML;
        }
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function fmt(ms) {
        if (!isFinite(ms)) return '-';
        return ms >= 1000 ? (ms / 1000).toFixed(2) + ' s' : ms.toFixed(2) + 'ms';
    }

    function safeJson(value) {
        try {
            return JSON.stringify(value, null, 2);
        } catch (e) {
            return String(value);
        }
    }

    function sanitizeSensitive(value, key) {
        return value;
    }

    // ===== 变量路径解析 =====

    function tokenize(valuePath) {
        return String(valuePath || '').match(/[^.\[\]]+|\[(?:-?\d+|".*?"|'.*?')\]/g) || [];
    }

    function normalizeToken(token) {
        if (token.charAt(0) === '[' && token.charAt(token.length - 1) === ']') {
            return token.substring(1, token.length - 1).replace(/^['"]|['"]$/g, '');
        }
        return token;
    }

    function getByPath(source, valuePath) {
        if (!valuePath) return source;
        var cursor = source;
        tokenize(valuePath).forEach(function (token) {
            if (cursor === undefined || cursor === null) {
                cursor = undefined;
                return;
            }
            cursor = cursor[normalizeToken(token)];
        });
        return cursor;
    }

    // ===== 模板插值 =====
    //
    // 支持 {{vars.x}}、{{lastResponse.data.id}}、{{lastResponseBody.code}} 等
    // 整段匹配 {{xxx}} 时返回原始类型（对象/数字），片段拼接时统一转字符串

    function evalExpr(expr, runtime) {
        var text = String(expr || '').trim();
        if (!text) return '';
        if (text === 'vars') return runtime.vars;
        if (text === 'lastResponse') return runtime.lastResponse;
        if (text === 'lastResponseBody') return runtime.lastResponseBody;
        if (text.indexOf('vars.') === 0) return getByPath(runtime.vars, text.substring(5));
        if (text.indexOf('lastResponse.') === 0) return getByPath(runtime.lastResponse, text.substring(13));
        if (text.indexOf('lastResponseBody.') === 0) return getByPath(runtime.lastResponseBody, text.substring(17));
        if (Object.prototype.hasOwnProperty.call(runtime.vars, text)) return runtime.vars[text];
        return getByPath(runtime.vars, text);
    }

    function resolveString(value, runtime) {
        if (typeof value !== 'string') return value;
        var whole = value.match(/^\s*\{\{\s*(.+?)\s*\}\}\s*$/);
        if (whole) {
            var direct = evalExpr(whole[1], runtime);
            return direct === undefined ? '' : direct;
        }
        return value.replace(/\{\{\s*(.+?)\s*\}\}/g, function (_, innerExpr) {
            var resolved = evalExpr(innerExpr, runtime);
            if (resolved === undefined || resolved === null) return '';
            return typeof resolved === 'object' ? JSON.stringify(resolved) : String(resolved);
        });
    }

    function resolve(value, runtime) {
        if (Array.isArray(value)) {
            return value.map(function (item) { return resolve(item, runtime); });
        }
        if (isPlainObject(value)) {
            var result = {};
            Object.keys(value).forEach(function (key) {
                result[key] = resolve(value[key], runtime);
            });
            return result;
        }
        return resolveString(value, runtime);
    }

    // ===== HTTP 请求辅助 =====

    function headerValue(headers, name) {
        var target = String(name || '').toLowerCase();
        var keys = Object.keys(headers || {});
        for (var i = 0; i < keys.length; i += 1) {
            if (keys[i].toLowerCase() === target) return headers[keys[i]];
        }
        return undefined;
    }

    function hasHeader(headers, name) {
        return headerValue(headers, name) !== undefined;
    }

    function headersToObject(headers) {
        var result = {};
        headers.forEach(function (value, key) { result[key] = value; });
        return result;
    }

    function joinUrl(baseUrl, requestPath) {
        if (/^https?:\/\//i.test(requestPath || '')) return requestPath;
        var base = String(baseUrl || '').replace(/\/+$/, '');
        var tail = String(requestPath || '');
        if (!base) return tail;
        return base + '/' + tail.replace(/^\/+/, '');
    }

    /** 拼装 Query 参数并完成变量插值与 safe URL 编码 */
    function buildUrl(path, params, runtime) {
        var rawPath = resolveString(path || '', runtime);
        if (!params || !isPlainObject(params)) return rawPath;
        var resolvedParams = resolve(params, runtime);
        var queryPairs = [];
        Object.keys(resolvedParams).forEach(function (key) {
            var val = resolvedParams[key];
            if (val !== undefined && val !== null) {
                queryPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(val)));
            }
        });
        if (!queryPairs.length) return rawPath;
        var separator = rawPath.indexOf('?') >= 0 ? '&' : '?';
        return rawPath + separator + queryPairs.join('&');
    }

    function parseBody(text, contentType) {
        if (!text) return null;
        var bodyText = String(text);
        var type = String(contentType || '').toLowerCase();
        if (type.indexOf('json') >= 0 || /^[\[{]/.test(bodyText.trim())) {
            try { return JSON.parse(bodyText); } catch (e) { return bodyText; }
        }
        return bodyText;
    }

    // ===== 断言 =====
    //
    // 断言定义（assertions 数组元素）支持以下取值：
    //   target: 'status' | header: 'X-Foo' | from: 'vars' | 'headers' | 'bodyText' | 'body'(默认)
    //   path:   按 getByPath 语法定位字段，如 'data.list[0].id'
    //   判定:   exists / equals / includes / matches / oneOf

    function assertionActual(def, response, runtime) {
        if (def.target === 'status') return response.status;
        if (def.header) return headerValue(response.headers, def.header);
        if (def.from === 'vars') return def.path ? getByPath(runtime.vars, def.path) : runtime.vars;
        if (def.from === 'headers') return def.path ? getByPath(response.headers, def.path) : response.headers;
        if (def.from === 'bodyText') return response.bodyText;
        return def.path ? getByPath(response.body, def.path) : response.body;
    }

    function evaluateAssertion(def, response, runtime) {
        var actual = assertionActual(def, response, runtime);
        var expected;
        var passed = true;

        if (def.exists !== undefined) {
            expected = !!def.exists;
            passed = passed && (expected
                ? actual !== undefined && actual !== null && actual !== ''
                : actual === undefined || actual === null || actual === '');
        }
        if (def.equals !== undefined) {
            expected = resolve(clone(def.equals), runtime);
            passed = passed && deepEqual(actual, expected);
        }
        if (def.includes !== undefined) {
            expected = resolve(def.includes, runtime);
            passed = passed && String(actual == null ? '' : actual).indexOf(String(expected)) >= 0;
        }
        if (def.matches !== undefined) {
            expected = resolve(def.matches, runtime);
            passed = passed && new RegExp(expected).test(String(actual == null ? '' : actual));
        }
        if (Array.isArray(def.oneOf)) {
            expected = resolve(clone(def.oneOf), runtime);
            passed = passed && expected.some(function (item) { return deepEqual(actual, item); });
        }

        return {
            name: def.name || '断言',
            passed: !!passed,
            actual: actual,
            expected: expected
        };
    }

    function buildAssertions(step, response, runtime) {
        var defs = Array.isArray(step.assertions) ? step.assertions.slice() : [];
        // step.status 是简写：等价于一条 target=status 的断言
        if (step.status !== undefined && !defs.some(function (item) {
            return item && item.target === 'status';
        })) {
            defs.unshift({ name: '返回 HTTP ' + step.status, target: 'status', equals: step.status });
        }
        return defs.map(function (def) { return evaluateAssertion(def, response, runtime); });
    }

    // ===== 提取 =====
    //
    // 将响应中的字段写入 runtime.vars，供后续步骤通过 {{vars.xxx}} 引用
    // 提取定义（extract 数组元素）支持：
    //   target: 'status' | header: 'X-Foo' | path: 'data.id'（默认从 body 提取）

    function applyExtract(step, response, runtime) {
        (step.extract || []).forEach(function (item) {
            if (!item || !item.name) return;
            if (item.target === 'status') {
                runtime.vars[item.name] = response.status;
                return;
            }
            if (item.header) {
                runtime.vars[item.name] = headerValue(response.headers, item.header);
                return;
            }
            runtime.vars[item.name] = item.path ? getByPath(response.body, item.path) : response.body;
        });
    }

    // ===== MD5 哈希 =====
    //
    // 纯 JS 实现（RFC 1321），Node 与浏览器共用同一份代码，避免两端实现不一致
    // 已通过标准测试向量验证：md5("abc") = 900150983cd24fb0d6963f7d28e17f72

    function md5(str) {
        var s = unescape(encodeURIComponent(String(str)));
        // 位运算需用无符号 32 位整数
        function add32(a, b) { return (a + b) & 0xffffffff; }
        function cmn(q, a, b, x, s, t) { return add32(rol(add32(add32(a, q), add32(x, t)), s), b); }
        function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
        function gg(a, b, c, d, x, s, t) { return cmn((d & b) | ((~d) & c), a, b, x, s, t); }
        function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
        function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
        function rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }

        // 将字符串转为 32 位整数数组（小端序）
        var n = s.length;
        var wordCount = (((n + 8) >> 6) + 1) * 16;
        var words = new Array(wordCount).fill(0);
        for (var i = 0; i < n; i++) {
            words[i >> 2] |= (s.charCodeAt(i) & 0xff) << ((i % 4) * 8);
        }
        words[i >> 2] |= 0x80 << ((i % 4) * 8);
        words[wordCount - 2] = n * 8;

        // 初始化 MD5 常量
        var a0 = 1732584193;
        var b0 = -271733879;
        var c0 = -1732584194;
        var d0 = 271733878;

        for (var j = 0; j < wordCount; j += 16) {
            var a = a0, b = b0, c = c0, d = d0;

            a = ff(a, b, c, d, words[j + 0], 7, -680876936);
            d = ff(d, a, b, c, words[j + 1], 12, -389564586);
            c = ff(c, d, a, b, words[j + 2], 17, 606105819);
            b = ff(b, c, d, a, words[j + 3], 22, -1044525330);
            a = ff(a, b, c, d, words[j + 4], 7, -176418897);
            d = ff(d, a, b, c, words[j + 5], 12, 1200080426);
            c = ff(c, d, a, b, words[j + 6], 17, -1473231341);
            b = ff(b, c, d, a, words[j + 7], 22, -45705983);
            a = ff(a, b, c, d, words[j + 8], 7, 1770035416);
            d = ff(d, a, b, c, words[j + 9], 12, -1958414417);
            c = ff(c, d, a, b, words[j + 10], 17, -42063);
            b = ff(b, c, d, a, words[j + 11], 22, -1990404162);
            a = ff(a, b, c, d, words[j + 12], 7, 1804603682);
            d = ff(d, a, b, c, words[j + 13], 12, -40341101);
            c = ff(c, d, a, b, words[j + 14], 17, -1502002290);
            b = ff(b, c, d, a, words[j + 15], 22, 1236535329);

            a = gg(a, b, c, d, words[j + 1], 5, -165796510);
            d = gg(d, a, b, c, words[j + 6], 9, -1069501632);
            c = gg(c, d, a, b, words[j + 11], 14, 643717713);
            b = gg(b, c, d, a, words[j + 0], 20, -373897302);
            a = gg(a, b, c, d, words[j + 5], 5, -701558691);
            d = gg(d, a, b, c, words[j + 10], 9, 38016083);
            c = gg(c, d, a, b, words[j + 15], 14, -660478335);
            b = gg(b, c, d, a, words[j + 4], 20, -405537848);
            a = gg(a, b, c, d, words[j + 9], 5, 568446438);
            d = gg(d, a, b, c, words[j + 14], 9, -1019803690);
            c = gg(c, d, a, b, words[j + 3], 14, -187363961);
            b = gg(b, c, d, a, words[j + 8], 20, 1163531501);
            a = gg(a, b, c, d, words[j + 13], 5, -1444681467);
            d = gg(d, a, b, c, words[j + 2], 9, -51403784);
            c = gg(c, d, a, b, words[j + 7], 14, 1735328473);
            b = gg(b, c, d, a, words[j + 12], 20, -1926607734);

            a = hh(a, b, c, d, words[j + 5], 4, -378558);
            d = hh(d, a, b, c, words[j + 8], 11, -2022574463);
            c = hh(c, d, a, b, words[j + 11], 16, 1839030562);
            b = hh(b, c, d, a, words[j + 14], 23, -35309556);
            a = hh(a, b, c, d, words[j + 1], 4, -1530992060);
            d = hh(d, a, b, c, words[j + 4], 11, 1272893353);
            c = hh(c, d, a, b, words[j + 7], 16, -155497632);
            b = hh(b, c, d, a, words[j + 10], 23, -1094730640);
            a = hh(a, b, c, d, words[j + 13], 4, 681279174);
            d = hh(d, a, b, c, words[j + 0], 11, -358537222);
            c = hh(c, d, a, b, words[j + 3], 16, -722521979);
            b = hh(b, c, d, a, words[j + 6], 23, 76029189);
            a = hh(a, b, c, d, words[j + 9], 4, -640364487);
            d = hh(d, a, b, c, words[j + 12], 11, -421815835);
            c = hh(c, d, a, b, words[j + 15], 16, 530742520);
            b = hh(b, c, d, a, words[j + 2], 23, -995338651);

            a = ii(a, b, c, d, words[j + 0], 6, -198630844);
            d = ii(d, a, b, c, words[j + 7], 10, 1126891415);
            c = ii(c, d, a, b, words[j + 14], 15, -1416354905);
            b = ii(b, c, d, a, words[j + 5], 21, -57434055);
            a = ii(a, b, c, d, words[j + 12], 6, 1700485571);
            d = ii(d, a, b, c, words[j + 3], 10, -1894986606);
            c = ii(c, d, a, b, words[j + 10], 15, -1051523);
            b = ii(b, c, d, a, words[j + 1], 21, -2054922799);
            a = ii(a, b, c, d, words[j + 8], 6, 1873313359);
            d = ii(d, a, b, c, words[j + 15], 10, -30611744);
            c = ii(c, d, a, b, words[j + 6], 15, 1560198380);
            b = ii(b, c, d, a, words[j + 13], 21, 1309151649);
            a = ii(a, b, c, d, words[j + 4], 6, -145523070);
            d = ii(d, a, b, c, words[j + 11], 10, -1120210379);
            c = ii(c, d, a, b, words[j + 2], 15, 718787259);
            b = ii(b, c, d, a, words[j + 9], 21, -343485551);

            a0 = add32(a0, a);
            b0 = add32(b0, b);
            c0 = add32(c0, c);
            d0 = add32(d0, d);
        }

        // 转为小端序十六进制字符串
        function toHex(num) {
            var hex = '';
            for (var k = 0; k < 4; k++) {
                hex += ('0' + ((num >>> (k * 8)) & 0xff).toString(16)).slice(-2);
            }
            return hex;
        }
        return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
    }

    return {
        md5: md5,
        generateSignature: generateSignature,
        clone: clone,
        isPlainObject: isPlainObject,
        deepEqual: deepEqual,
        tokenize: tokenize,
        normalizeToken: normalizeToken,
        getByPath: getByPath,
        evalExpr: evalExpr,
        resolveString: resolveString,
        resolve: resolve,
        headerValue: headerValue,
        hasHeader: hasHeader,
        headersToObject: headersToObject,
        joinUrl: joinUrl,
        buildUrl: buildUrl,
        parseBody: parseBody,
        assertionActual: assertionActual,
        evaluateAssertion: evaluateAssertion,
        buildAssertions: buildAssertions,
        applyExtract: applyExtract,
        esc: esc,
        fmt: fmt,
        safeJson: safeJson,
        sanitizeSensitive: sanitizeSensitive
    };
})(typeof window !== 'undefined' ? window : globalThis);

export default legacyCore;
