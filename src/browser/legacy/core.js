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
        var current = value;
        var seen = new Set();
        for (var depth = 0; depth < 10; depth += 1) {
            if (seen.has(current)) return current;
            seen.add(current);
            var whole = current.match(/^\s*\{\{\s*(.+?)\s*\}\}\s*$/);
            if (whole) {
                var direct = evalExpr(whole[1], runtime);
                if (direct === undefined) return '';
                if (typeof direct !== 'string') return direct;
                current = direct;
                continue;
            }
            var replaced = current.replace(/\{\{\s*(.+?)\s*\}\}/g, function (_, innerExpr) {
                var resolved = evalExpr(innerExpr, runtime);
                if (resolved === undefined || resolved === null) return '';
                return typeof resolved === 'object' ? JSON.stringify(resolved) : String(resolved);
            });
            if (replaced === current || !/\{\{\s*.+?\s*\}\}/.test(replaced)) return replaced;
            current = replaced;
        }
        return current;
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
    //   判定:   exists / equals / notEquals / includes / matches / oneOf / gt / gte / lt / lte
    //   元数据: name / path / from / target / header / implicit
    // 操作符名单与 Node src/core.js 保持语义一致，禁止单端新增操作符。

    var ASSERTION_OPERATORS = ['exists', 'equals', 'includes', 'matches', 'oneOf', 'notEquals', 'gt', 'gte', 'lt', 'lte'];
    var ASSERTION_META_KEYS = ['name', 'path', 'from', 'target', 'header', 'implicit'];

    function validateAssertion(def, context) {
        var where = context || '';
        var prefix = where ? where + '断言无效' : '断言无效';
        if (!isPlainObject(def)) throw new TypeError(prefix + ': 断言必须是对象');
        var keys = Object.keys(def);
        var operators = keys.filter(function (key) { return ASSERTION_OPERATORS.indexOf(key) >= 0; });
        var unknown = keys.filter(function (key) {
            return ASSERTION_OPERATORS.indexOf(key) < 0 && ASSERTION_META_KEYS.indexOf(key) < 0;
        });
        if (unknown.length) {
            throw new TypeError(prefix + ': 包含未知键 ' + unknown.map(function (key) { return '"' + key + '"'; }).join(', ') +
                '，允许的元数据键为 ' + ASSERTION_META_KEYS.join('/') + '，操作符为 ' + ASSERTION_OPERATORS.join('/'));
        }
        if (!operators.length) {
            throw new TypeError(prefix + ': 必须至少包含一个操作符（' + ASSERTION_OPERATORS.join('/') + '）');
        }
        return def;
    }

    function assertionActual(def, response, runtime) {
        if (def.target === 'status') return response.status;
        if (def.header) return headerValue(response.headers, def.header);
        if (def.from === 'vars') return def.path ? getByPath(runtime.vars, def.path) : runtime.vars;
        if (def.from === 'headers') return def.path ? getByPath(response.headers, def.path) : response.headers;
        if (def.from === 'bodyText') return response.bodyText;
        return def.path ? getByPath(response.body, def.path) : response.body;
    }

    function evaluateAssertion(def, response, runtime, context) {
        // 执行期也校验：防止插件 transform 之后产生非法断言定义
        validateAssertion(def, context);
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
        if (def.notEquals !== undefined) {
            expected = resolve(clone(def.notEquals), runtime);
            passed = passed && !deepEqual(actual, expected);
        }
        if (def.includes !== undefined) {
            expected = resolve(def.includes, runtime);
            // 与 Node src/core.js 完全同语义：数组用 JSON 深比较 some，非数组用子串包含
            // （防止 actual=[10,20], includes=2 时数组被字符串化导致假阳性）
            passed = passed && (Array.isArray(actual)
                ? actual.some(function (item) { return deepEqual(item, expected); })
                : String(actual == null ? '' : actual).indexOf(String(expected)) >= 0);
        }
        if (def.matches !== undefined) {
            expected = resolve(def.matches, runtime);
            // 隐式默认断言（无显式 status/assertions 时追加的 HTTP 2xx 检查）仅对数字
            // HTTP 状态码生效；本地适配器（返回 status: 'LOCAL'）不参与匹配
            if (!(def.implicit === true && typeof actual !== 'number')) {
                try {
                    passed = passed && new RegExp(String(expected)).test(String(actual == null ? '' : actual));
                } catch (e) {
                    // 无效正则：断言失败而非抛异常（与 Node 一致）
                    passed = false;
                }
            }
        }
        if (def.oneOf !== undefined) {
            expected = resolve(clone(def.oneOf), runtime);
            // 与 Node 完全同语义：expected 必须是数组（含模板变量解析后），否则断言失败；
            // 用 JSON 深比较判断实际值是否属于候选之一
            passed = passed && Array.isArray(expected)
                && expected.some(function (item) { return deepEqual(actual, item); });
        }
        ['gt', 'gte', 'lt', 'lte'].forEach(function (op) {
            if (!Object.prototype.hasOwnProperty.call(def, op)) return;
            expected = resolve(def[op], runtime);
            // 只接受有限 number，不做字符串隐式转换；类型不符时断言失败而非抛异常
            var comparable = typeof actual === 'number' && Number.isFinite(actual)
                && typeof expected === 'number' && Number.isFinite(expected);
            if (!comparable) { passed = false; return; }
            if (op === 'gt') passed = passed && actual > expected;
            else if (op === 'gte') passed = passed && actual >= expected;
            else if (op === 'lt') passed = passed && actual < expected;
            else passed = passed && actual <= expected;
        });

        return {
            name: def.name || def.path || '断言',
            passed: !!passed,
            actual: actual,
            expected: expected
        };
    }

    function buildAssertions(step, response, runtime, context) {
        var defs = Array.isArray(step.assertions) ? step.assertions.slice() : [];
        // step.status 是简写：等价于一条 target=status 的断言
        if (step.status !== undefined && !defs.some(function (item) {
            return item && item.target === 'status';
        })) {
            defs.unshift({ name: '返回 HTTP ' + step.status, target: 'status', equals: step.status });
        } else if (step.status === undefined && defs.length === 0) {
            defs.push({ name: '返回 HTTP 2xx', target: 'status', matches: '^2\\d\\d$', implicit: true });
        }
        return defs.map(function (def, index) {
            var stepContext = context || {};
            return evaluateAssertion(def, response, runtime, {
                stepName: stepContext.stepName,
                assertionNo: index + 1
            });
        });
    }

    // ===== 提取 =====
    //
    // 将响应中的字段写入 runtime.vars，供后续步骤通过 {{vars.xxx}} 引用
    // 提取定义（extract 数组元素）支持：
    //   target: 'status' | header: 'X-Foo' | path: 'data.id'（默认从 body 提取）
    //   required: true 且路径不存在时当前步骤失败（failures 由调用方并入步骤断言）
    //   required 默认 false：路径不存在保持兼容（变量为 undefined），产生 warning

    var RESERVED_VARS = ['runId', 'runNo'];

    function assertNotReservedVar(name, label) {
        if (RESERVED_VARS.indexOf(name) >= 0) {
            throw new Error((label || '变量') + ' "' + name + '" 是运行时自动生成的保留变量，禁止声明或覆盖');
        }
    }

    function assertNoReservedVars(source, label) {
        Object.keys(source || {}).forEach(function (name) {
            assertNotReservedVar(name, label);
        });
    }

    function applyExtract(step, response, runtime) {
        var warnings = [];
        var failures = [];
        (step.extract || []).forEach(function (item) {
            if (!item || !item.name) return;
            assertNotReservedVar(item.name, 'extract 变量');
            // 与 Node src/core.js 完全同语义的提取来源解析：
            //   target:'status' / header 为简写（优先级最高，保留 legacy 行为）
            //   from: 'headers' | 'bodyText' | 'response'（默认 body）
            var source;
            if (item.target === 'status') {
                source = response.status;
            } else if (item.header) {
                source = headerValue(response.headers, item.header);
            } else if (item.from === 'headers') {
                source = response.headers;
            } else if (item.from === 'bodyText') {
                source = response.bodyText;
            } else if (item.from === 'response') {
                source = response;
            } else {
                source = response.body;
            }
            var value = item.path ? getByPath(source, item.path) : source;
            if (value === undefined) {
                if (item.required === true) {
                    failures.push({
                        name: '提取 ' + item.name + '（路径不存在）',
                        passed: false,
                        actual: undefined,
                        expected: '路径 ' + (item.path || '(整个响应)') + ' 存在'
                    });
                } else {
                    warnings.push('提取变量 ' + item.name + '：路径 ' + (item.path || '(整个响应)') + ' 不存在，变量值为 undefined（required 未开启，不影响执行）');
                }
            }
            runtime.vars[item.name] = value;
        });
        return { warnings: warnings, failures: failures };
    }

    // ===== MD5 哈希 =====
    //
    // 使用 blueimp-md5（构建时内联），与 Node src/core.js 同一实现；两端输出一致。
    // 若 blueimp-md5 不可用（如浏览器 standalone 未打包），md5 会抛出明确错误，
    // 提示先加载 vendor/blueimp-md5.js。

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
        validateAssertion: validateAssertion,
        evaluateAssertion: evaluateAssertion,
        buildAssertions: buildAssertions,
        applyExtract: applyExtract,
        // 暴露名单供一致性测试：browser legacy 与 Node contract 的操作符/元数据键/保留变量
        // 必须完全一致，禁止单端新增
        ASSERTION_OPERATORS: ASSERTION_OPERATORS,
        ASSERTION_META_KEYS: ASSERTION_META_KEYS,
        RESERVED_VARS: RESERVED_VARS,
        assertNotReservedVar: assertNotReservedVar,
        assertNoReservedVars: assertNoReservedVars,
        esc: esc,
        fmt: fmt,
        safeJson: safeJson,
        sanitizeSensitive: sanitizeSensitive
    };
})(typeof window !== 'undefined' ? window : globalThis);

export default legacyCore;
