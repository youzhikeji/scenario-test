#!/usr/bin/env node
/*! scenario-test v0.5.5 */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/blueimp-md5/js/md5.js
var require_md5 = __commonJS({
  "node_modules/blueimp-md5/js/md5.js"(exports2, module2) {
    (function($) {
      "use strict";
      function safeAdd(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 65535;
      }
      function bitRotateLeft(num, cnt) {
        return num << cnt | num >>> 32 - cnt;
      }
      function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
      }
      function md5ff(a, b, c, d, x, s, t) {
        return md5cmn(b & c | ~b & d, a, b, x, s, t);
      }
      function md5gg(a, b, c, d, x, s, t) {
        return md5cmn(b & d | c & ~d, a, b, x, s, t);
      }
      function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t);
      }
      function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t);
      }
      function binlMD5(x, len) {
        x[len >> 5] |= 128 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;
        var i;
        var olda;
        var oldb;
        var oldc;
        var oldd;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;
          a = md5ff(a, b, c, d, x[i], 7, -680876936);
          d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
          a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5gg(b, c, d, a, x[i], 20, -373897302);
          a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
          a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5hh(d, a, b, c, x[i], 11, -358537222);
          c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
          a = md5ii(a, b, c, d, x[i], 6, -198630844);
          d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
          a = safeAdd(a, olda);
          b = safeAdd(b, oldb);
          c = safeAdd(c, oldc);
          d = safeAdd(d, oldd);
        }
        return [a, b, c, d];
      }
      function binl2rstr(input) {
        var i;
        var output = "";
        var length32 = input.length * 32;
        for (i = 0; i < length32; i += 8) {
          output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);
        }
        return output;
      }
      function rstr2binl(input) {
        var i;
        var output = [];
        output[(input.length >> 2) - 1] = void 0;
        for (i = 0; i < output.length; i += 1) {
          output[i] = 0;
        }
        var length8 = input.length * 8;
        for (i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
        }
        return output;
      }
      function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
      }
      function rstrHMACMD5(key, data) {
        var i;
        var bkey = rstr2binl(key);
        var ipad = [];
        var opad = [];
        var hash;
        ipad[15] = opad[15] = void 0;
        if (bkey.length > 16) {
          bkey = binlMD5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 909522486;
          opad[i] = bkey[i] ^ 1549556828;
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
      }
      function rstr2hex(input) {
        var hexTab = "0123456789abcdef";
        var output = "";
        var x;
        var i;
        for (i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i);
          output += hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15);
        }
        return output;
      }
      function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input));
      }
      function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s));
      }
      function hexMD5(s) {
        return rstr2hex(rawMD5(s));
      }
      function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
      }
      function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d));
      }
      function md52(string, key, raw) {
        if (!key) {
          if (!raw) {
            return hexMD5(string);
          }
          return rawMD5(string);
        }
        if (!raw) {
          return hexHMACMD5(key, string);
        }
        return rawHMACMD5(key, string);
      }
      if (typeof define === "function" && define.amd) {
        define(function() {
          return md52;
        });
      } else if (typeof module2 === "object" && module2.exports) {
        module2.exports = md52;
      } else {
        $.md5 = md52;
      }
    })(exports2);
  }
});

// src/cli.js
var import_node_fs5 = __toESM(require("node:fs"), 1);
var import_node_http = __toESM(require("node:http"), 1);
var import_node_path6 = __toESM(require("node:path"), 1);
var import_node_crypto2 = __toESM(require("node:crypto"), 1);
var import_promises = require("node:readline/promises");
var import_node_url = require("node:url");

// src/node.js
var node_exports = {};
__export(node_exports, {
  ASSERTION_META_KEYS: () => ASSERTION_META_KEYS,
  ASSERTION_OPERATORS: () => ASSERTION_OPERATORS,
  CONTRACT_VERSION: () => CONTRACT_VERSION,
  GLOBAL_TYPES: () => GLOBAL_TYPES,
  RESERVED_VARS: () => RESERVED_VARS,
  VERSION: () => VERSION,
  applyExtract: () => applyExtract,
  assertNoReservedVars: () => assertNoReservedVars,
  assertNotReservedVar: () => assertNotReservedVar,
  buildAssertions: () => buildAssertions,
  buildCapabilities: () => buildCapabilities,
  buildUrl: () => buildUrl,
  clearAdapters: () => clearAdapters,
  clearScenarios: () => clearScenarios,
  clone: () => clone,
  contract: () => contract,
  createApp: () => createApp,
  createEngine: () => createEngine,
  createNodeIo: () => createNodeIo,
  createRuntime: () => createRuntime,
  defineConfig: () => defineConfig,
  defineScenario: () => defineScenario,
  evalExpression: () => evalExpression,
  evaluateAssertion: () => evaluateAssertion,
  executeDefinitionFile: () => executeDefinitionFile,
  formatAssertionContext: () => formatAssertionContext,
  formatDuration: () => formatDuration,
  generateSignature: () => generateSignature,
  getAdapter: () => getAdapter,
  getByPath: () => getByPath,
  getConfig: () => getConfig,
  getScenario: () => getScenario,
  hasHeader: () => hasHeader,
  headerValue: () => headerValue,
  headersToObject: () => headersToObject,
  isGlobalParam: () => isGlobalParam,
  isPlainObject: () => isPlainObject,
  joinUrl: () => joinUrl,
  listAdapters: () => listAdapters,
  loadConfigFile: () => loadConfigFile,
  loadScenarioFile: () => loadScenarioFile,
  maskSecret: () => maskSecret,
  md5: () => md5,
  mergeGlobals: () => mergeGlobals,
  normalizeGlobalParam: () => normalizeGlobalParam,
  parseBody: () => parseBody,
  registerAdapter: () => registerAdapter,
  registerConfig: () => registerConfig,
  registerScenario: () => registerScenario,
  renderCapabilitiesText: () => renderCapabilitiesText,
  resolve: () => resolve,
  resolveString: () => resolveString,
  runScenario: () => runScenario,
  sanitizeSensitive: () => sanitizeSensitive,
  unregisterAdapter: () => unregisterAdapter,
  validateAdapter: () => validateAdapter,
  validateAdapterResponse: () => validateAdapterResponse,
  validateAssertion: () => validateAssertion
});

// src/core.js
var import_blueimp_md5 = __toESM(require_md5(), 1);

// src/version.generated.js
var VERSION = "0.5.5";

// src/contract.js
var CONTRACT_VERSION = 1;
var contract = Object.freeze({
  contractVersion: CONTRACT_VERSION,
  runtimeVersion: VERSION,
  // 运行时要求（与 package.json engines 保持一致，doctor 据此校验 Node 版本）
  engines: Object.freeze({ node: ">=18" }),
  assertions: Object.freeze({
    // 断言对象允许的元数据键（非操作符键）
    metaKeys: Object.freeze(["name", "path", "from", "target", "header", "implicit"]),
    // 断言操作符：键为操作符名；valueType 描述期望值类型约束，
    // finiteNumber 表示实际值与期望值都必须是有限 number（不做字符串隐式转换）
    operators: Object.freeze({
      exists: Object.freeze({
        description: "\u5B57\u6BB5\u5B58\u5728\u4E14\u975E null/\u7A7A\u4E32\uFF08exists: true\uFF09\uFF0C\u6216\u4E0D\u5B58\u5728\uFF08exists: false\uFF09",
        valueType: "boolean"
      }),
      equals: Object.freeze({
        description: "\u5B9E\u9645\u503C\u4E0E\u671F\u671B\u503C JSON \u6DF1\u6BD4\u8F83\u76F8\u7B49",
        valueType: "any"
      }),
      notEquals: Object.freeze({
        description: "\u5B9E\u9645\u503C\u4E0E\u671F\u671B\u503C JSON \u6DF1\u6BD4\u8F83\u540E\u53D6\u53CD",
        valueType: "any"
      }),
      includes: Object.freeze({
        description: "\u6570\u7EC4\u5305\u542B\u671F\u671B\u9879\uFF0C\u6216\u5B57\u7B26\u4E32\u5305\u542B\u671F\u671B\u5B50\u4E32",
        valueType: "any"
      }),
      matches: Object.freeze({
        description: "\u6B63\u5219\u8868\u8FBE\u5F0F\u5339\u914D\u5B57\u7B26\u4E32\u5316\u540E\u7684\u5B9E\u9645\u503C",
        valueType: "string"
      }),
      oneOf: Object.freeze({
        description: "\u5B9E\u9645\u503C\u5C5E\u4E8E\u671F\u671B\u5019\u9009\u6570\u7EC4\u4E4B\u4E00\uFF08\u6DF1\u6BD4\u8F83\uFF09",
        valueType: "array"
      }),
      gt: Object.freeze({
        description: "\u5B9E\u9645\u503C\u5927\u4E8E\u671F\u671B\u503C",
        valueType: "finiteNumber"
      }),
      gte: Object.freeze({
        description: "\u5B9E\u9645\u503C\u5927\u4E8E\u7B49\u4E8E\u671F\u671B\u503C",
        valueType: "finiteNumber"
      }),
      lt: Object.freeze({
        description: "\u5B9E\u9645\u503C\u5C0F\u4E8E\u671F\u671B\u503C",
        valueType: "finiteNumber"
      }),
      lte: Object.freeze({
        description: "\u5B9E\u9645\u503C\u5C0F\u4E8E\u7B49\u4E8E\u671F\u671B\u503C",
        valueType: "finiteNumber"
      })
    }),
    // 只接受有限 number 的操作符（与 operators 中 valueType: "finiteNumber" 一致）
    numericOperators: Object.freeze(["gt", "gte", "lt", "lte"])
  }),
  when: Object.freeze({
    // when 对象形式支持的来源：仅 vars；不允许 body/status/header 条件
    sources: Object.freeze(["vars"]),
    note: 'when \u5BF9\u8C61\u5F62\u5F0F\u53EA\u5141\u8BB8 from: "vars"\uFF1B\u975E\u5BF9\u8C61\u5F62\u5F0F\uFF08\u6A21\u677F\u5B57\u7B26\u4E32/\u5E03\u5C14\uFF09\u4FDD\u6301\u771F\u503C\u8BED\u4E49'
  }),
  extract: Object.freeze({
    // extract 支持的来源（默认 body）
    from: Object.freeze(["body", "headers", "bodyText", "response"]),
    // required 语义：路径不存在时 required: true 使当前步骤失败，默认缺失产生 warning
    required: "boolean",
    note: "required: true \u4E14\u8DEF\u5F84\u4E0D\u5B58\u5728\u65F6\u5F53\u524D\u6B65\u9AA4\u5931\u8D25\uFF1B\u9ED8\u8BA4\u7F3A\u5931\u4EA7\u751F warning\uFF08\u4E0D\u542B\u54CD\u5E94\u5185\u5BB9\uFF09\uFF0C\u53D8\u91CF\u4E3A undefined"
  }),
  // 运行时自动生成的保留变量：禁止在 vars/envVars/generatedVars/extract 中声明或覆盖
  reservedVars: Object.freeze(["runId", "runNo"]),
  generatedVars: Object.freeze({
    types: Object.freeze(["timestamp", "uuidHex", "md5", "signature"])
  }),
  globals: Object.freeze({
    // 全局参数类型：追加到每个请求的 header / cookie / query
    types: Object.freeze(["header", "cookie", "query"]),
    note: "\u5168\u5C40\u53C2\u6570\u652F\u6301 header / cookie / query \u4E09\u79CD\u7C7B\u578B\uFF0C\u6B65\u9AA4\u663E\u5F0F\u58F0\u660E\u6216 URL \u5DF2\u6709\u540C\u540D\u53C2\u6570\u4F18\u5148"
  }),
  config: Object.freeze({
    // 配置中 scenarios 清单项的字段（file/path 为 url 的兼容回退，不写入契约字段）
    scenarioItemKeys: Object.freeze(["id", "name", "url", "manual"]),
    environmentKeys: Object.freeze(["key", "name", "baseUrl", "globals"]),
    variableKeys: Object.freeze(["name", "label", "env", "required", "defaultValue"]),
    manual: Object.freeze({
      type: "boolean",
      note: "manual: true \u8868\u793A\u573A\u666F\u9700\u8981\u4EBA\u5DE5\u51C6\u5907\u6570\u636E\u6216\u5199\u6570\u636E\uFF0C--all \u9ED8\u8BA4\u6392\u9664\uFF0C--scenario <id> \u53EF\u663E\u5F0F\u6267\u884C"
    })
  }),
  scenario: Object.freeze({
    keys: Object.freeze(["name", "steps", "vars", "envVars", "generatedVars", "failurePolicy"]),
    stepKeys: Object.freeze([
      "name",
      "method",
      "path",
      "params",
      "request",
      "status",
      "assertions",
      "extract",
      "when",
      "retryUntil",
      "timeoutMs",
      "saveResponseAs",
      "adapter"
    ]),
    failurePolicies: Object.freeze(["stop", "continue"])
  }),
  cli: Object.freeze({
    commands: Object.freeze(["run", "serve", "init", "capabilities", "doctor"]),
    options: Object.freeze({
      config: { kind: "value", prop: "config", description: "\u573A\u666F\u914D\u7F6E\u6587\u4EF6" },
      env: { kind: "value", prop: "env", description: "\u914D\u7F6E\u4E2D\u7684\u73AF\u5883 key" },
      "base-url": { kind: "value", prop: "baseUrl", description: "\u4E34\u65F6\u8986\u76D6 Base URL" },
      scenario: { kind: "value", prop: "scenario", description: "\u6267\u884C\u6307\u5B9A\u573A\u666F\uFF08\u53EF\u6267\u884C manual:true \u573A\u666F\uFF09" },
      port: { kind: "value", prop: "port", parse: "number", description: "\u6D4F\u89C8\u5668\u670D\u52A1\u7AEF\u53E3\uFF0C\u9ED8\u8BA4 4300" },
      project: { kind: "value", prop: "project", description: "init \u76EE\u6807\u9879\u76EE\u6839\u76EE\u5F55" },
      dir: { kind: "value", prop: "dir", description: "init \u573A\u666F\u6D4B\u8BD5\u76EE\u5F55\u540D" },
      "library-url": { kind: "value", prop: "libraryUrl", description: "init \u65F6 UMD \u4E0B\u8F7D\u5730\u5740\uFF08\u9ED8\u8BA4 GitHub Release\uFF09" },
      all: { kind: "flag", prop: "all", description: "\u6267\u884C\u914D\u7F6E\u4E2D\u7684\u5168\u90E8\u81EA\u52A8\u573A\u666F\uFF08\u9ED8\u8BA4\u6392\u9664 manual:true\uFF09" },
      force: { kind: "flag", prop: "force", description: "init \u8986\u76D6\u5DF2\u6709\u6587\u4EF6\uFF08\u76EE\u6807\u76EE\u5F55\u5DF2\u5B58\u5728\u65F6\u53EF\u4EA4\u4E92\u9009\u62E9\uFF09" },
      "fail-on-skip": { kind: "flag", prop: "failOnSkip", description: "\u5B58\u5728\u4EFB\u4F55 SKIP \u6B65\u9AA4\u65F6\u6700\u7EC8\u9000\u51FA\u7801\u4E3A 1" },
      "allow-external-plugins": { kind: "flag", prop: "allowExternalPlugins", description: "\u5141\u8BB8\u52A0\u8F7D\u5916\u90E8\u63D2\u4EF6\uFF08\u6709\u5B89\u5168\u98CE\u9669\uFF09" },
      json: { kind: "flag", prop: "json", description: "capabilities/doctor \u8F93\u51FA\u673A\u5668\u53EF\u8BFB JSON\uFF08stdout \u7EAF\u51C0\uFF09" },
      token: {
        kind: "value",
        prop: "authorization",
        aliases: ["authorization"],
        description: "\uFF08\u5DF2\u5F03\u7528\uFF09\u547D\u4EE4\u884C\u4F20\u9012\u6388\u6743\u4EE4\u724C\uFF1B\u63A8\u8350 SCENARIO_AUTH \u73AF\u5883\u53D8\u91CF"
      }
    })
  })
});

// src/core.js
var GLOBAL_TYPES = [...contract.globals.types];
function isGlobalParam(item) {
  return Boolean(item && GLOBAL_TYPES.includes(item.type) && typeof item.name === "string" && item.name.trim());
}
function normalizeGlobalParam(item) {
  return { type: item.type, name: item.name, value: item.value == null ? "" : String(item.value) };
}
function mergeGlobals(...lists) {
  const merged = /* @__PURE__ */ new Map();
  for (const list of lists) {
    for (const item of list || []) {
      if (!isGlobalParam(item)) continue;
      merged.set(`${item.type}:${item.name}`, normalizeGlobalParam(item));
    }
  }
  return [...merged.values()];
}
function clone(value) {
  return value === void 0 ? void 0 : JSON.parse(JSON.stringify(value));
}
function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
function getByPath(source, valuePath) {
  if (!valuePath) return source;
  const tokens = String(valuePath).match(/[^.\[\]]+|\[(?:-?\d+|".*?"|'.*?')\]/g) || [];
  let cursor = source;
  for (const token of tokens) {
    if (cursor === void 0 || cursor === null) return void 0;
    const key = token.startsWith("[") ? token.slice(1, -1).replace(/^['"]|['"]$/g, "") : token;
    cursor = cursor[key];
  }
  return cursor;
}
function evalExpression(expression, runtime) {
  const text = String(expression || "").trim();
  if (!text) return "";
  if (text === "vars") return runtime.vars;
  if (text === "lastResponse") return runtime.lastResponse;
  if (text === "lastResponseBody") return runtime.lastResponseBody;
  if (text.startsWith("vars.")) return getByPath(runtime.vars, text.slice(5));
  if (text.startsWith("lastResponse.")) return getByPath(runtime.lastResponse, text.slice(13));
  if (text.startsWith("lastResponseBody.")) return getByPath(runtime.lastResponseBody, text.slice(17));
  if (Object.prototype.hasOwnProperty.call(runtime.vars || {}, text)) return runtime.vars[text];
  return getByPath(runtime.vars, text);
}
function resolveString(value, runtime) {
  if (typeof value !== "string") return value;
  let current = value;
  const seen = /* @__PURE__ */ new Set();
  for (let depth = 0; depth < 10; depth += 1) {
    if (seen.has(current)) return current;
    seen.add(current);
    const whole = current.match(/^\s*\{\{\s*(.+?)\s*\}\}\s*$/);
    if (whole) {
      const direct = evalExpression(whole[1], runtime);
      if (direct === void 0) return "";
      if (typeof direct !== "string") return direct;
      current = direct;
      continue;
    }
    const replaced = current.replace(/\{\{\s*(.+?)\s*\}\}/g, (_, expression) => {
      const resolved = evalExpression(expression, runtime);
      if (resolved === void 0 || resolved === null) return "";
      return typeof resolved === "object" ? JSON.stringify(resolved) : String(resolved);
    });
    if (replaced === current || !/\{\{\s*.+?\s*\}\}/.test(replaced)) return replaced;
    current = replaced;
  }
  return current;
}
function resolve(value, runtime) {
  if (Array.isArray(value)) return value.map((item) => resolve(item, runtime));
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item, runtime)]));
  }
  return resolveString(value, runtime);
}
function headerValue(headers, name) {
  const target = String(name || "").toLowerCase();
  const key = Object.keys(headers || {}).find((item) => item.toLowerCase() === target);
  return key === void 0 ? void 0 : headers[key];
}
function hasHeader(headers, name) {
  return headerValue(headers, name) !== void 0;
}
function headersToObject(headers) {
  const result = {};
  if (headers && typeof headers.forEach === "function") {
    headers.forEach((value, key) => {
      result[key] = value;
    });
  }
  return result;
}
function joinUrl(baseUrl, requestPath) {
  if (/^https?:\/\//i.test(requestPath || "")) return requestPath;
  const base = String(baseUrl || "").replace(/\/+$/, "");
  const tail = String(requestPath || "").replace(/^\/+/, "");
  return base ? `${base}/${tail}` : tail;
}
function buildUrl(requestPath, params, runtime) {
  const rawPath = resolveString(requestPath || "", runtime);
  if (!params || !isPlainObject(params)) return rawPath;
  const resolved = resolve(params, runtime);
  const query = Object.entries(resolved).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join("&");
  if (!query) return rawPath;
  return `${rawPath}${rawPath.includes("?") ? "&" : "?"}${query}`;
}
function parseBody(text, contentType2) {
  if (!text) return null;
  const value = String(text);
  if (String(contentType2 || "").toLowerCase().includes("json") || /^[\[{]/.test(value.trim())) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}
var ASSERTION_OPERATORS = Object.keys(contract.assertions.operators);
var ASSERTION_META_KEYS = [...contract.assertions.metaKeys];
function formatAssertionContext(context) {
  if (!context) return "";
  if (typeof context === "string") return context;
  const parts = [];
  if (context.scenarioName) parts.push(`\u573A\u666F ${context.scenarioName}`);
  if (context.stepNo !== void 0) parts.push(`\u7B2C ${context.stepNo} \u6B65`);
  if (context.stepName) parts.push(`\u6B65\u9AA4 ${context.stepName}`);
  if (context.assertionNo !== void 0) parts.push(`\u7B2C ${context.assertionNo} \u6761`);
  return parts.join(" ");
}
function validateAssertion(definition, context) {
  const where = formatAssertionContext(context);
  const prefix = where ? `${where}\u65AD\u8A00\u65E0\u6548` : "\u65AD\u8A00\u65E0\u6548";
  if (!isPlainObject(definition)) throw new TypeError(`${prefix}: \u65AD\u8A00\u5FC5\u987B\u662F\u5BF9\u8C61`);
  const keys = Object.keys(definition);
  const operators = keys.filter((key) => ASSERTION_OPERATORS.includes(key));
  const unknown = keys.filter((key) => !ASSERTION_OPERATORS.includes(key) && !ASSERTION_META_KEYS.includes(key));
  if (unknown.length) {
    throw new TypeError(
      `${prefix}: \u5305\u542B\u672A\u77E5\u952E ${unknown.map((key) => `"${key}"`).join(", ")}\uFF0C\u5141\u8BB8\u7684\u5143\u6570\u636E\u952E\u4E3A ${ASSERTION_META_KEYS.join("/")}\uFF0C\u64CD\u4F5C\u7B26\u4E3A ${ASSERTION_OPERATORS.join("/")}`
    );
  }
  if (!operators.length) {
    throw new TypeError(`${prefix}: \u5FC5\u987B\u81F3\u5C11\u5305\u542B\u4E00\u4E2A\u64CD\u4F5C\u7B26\uFF08${ASSERTION_OPERATORS.join("/")}\uFF09`);
  }
  return definition;
}
function assertionActual(definition, response, runtime) {
  if (definition.target === "status") return response.status;
  if (definition.header) return headerValue(response.headers, definition.header);
  if (definition.from === "vars") return definition.path ? getByPath(runtime.vars, definition.path) : runtime.vars;
  if (definition.from === "headers") return definition.path ? getByPath(response.headers, definition.path) : response.headers;
  if (definition.from === "bodyText") return response.bodyText;
  return definition.path ? getByPath(response.body, definition.path) : response.body;
}
function evaluateAssertion(definition, response, runtime, context) {
  validateAssertion(definition, context);
  const actual = assertionActual(definition, response, runtime);
  let expected;
  let passed = true;
  if (definition.exists !== void 0) {
    expected = Boolean(definition.exists);
    const exists = actual !== void 0 && actual !== null && actual !== "";
    passed = passed && exists === expected;
  }
  if (Object.prototype.hasOwnProperty.call(definition, "equals")) {
    expected = resolve(definition.equals, runtime);
    passed = passed && JSON.stringify(actual) === JSON.stringify(expected);
  }
  if (Object.prototype.hasOwnProperty.call(definition, "notEquals")) {
    expected = resolve(definition.notEquals, runtime);
    passed = passed && JSON.stringify(actual) !== JSON.stringify(expected);
  }
  if (Object.prototype.hasOwnProperty.call(definition, "includes")) {
    expected = resolve(definition.includes, runtime);
    passed = passed && (Array.isArray(actual) ? actual.some((item) => JSON.stringify(item) === JSON.stringify(expected)) : String(actual == null ? "" : actual).includes(String(expected)));
  }
  if (definition.matches !== void 0) {
    expected = resolve(definition.matches, runtime);
    if (!(definition.implicit === true && typeof actual !== "number")) {
      try {
        passed = passed && new RegExp(String(expected)).test(String(actual == null ? "" : actual));
      } catch {
        passed = false;
      }
    }
  }
  if (definition.oneOf !== void 0) {
    expected = resolve(definition.oneOf, runtime);
    passed = passed && Array.isArray(expected) && expected.some((item) => JSON.stringify(item) === JSON.stringify(actual));
  }
  for (const op of ["gt", "gte", "lt", "lte"]) {
    if (!Object.prototype.hasOwnProperty.call(definition, op)) continue;
    expected = resolve(definition[op], runtime);
    const comparable = typeof actual === "number" && Number.isFinite(actual) && typeof expected === "number" && Number.isFinite(expected);
    if (!comparable) {
      passed = false;
      continue;
    }
    if (op === "gt") passed = passed && actual > expected;
    else if (op === "gte") passed = passed && actual >= expected;
    else if (op === "lt") passed = passed && actual < expected;
    else passed = passed && actual <= expected;
  }
  return {
    name: definition.name || definition.path || "\u65AD\u8A00",
    passed,
    actual,
    expected
  };
}
function buildAssertions(step, response, runtime, context) {
  const definitions = Array.isArray(step.assertions) ? [...step.assertions] : [];
  if (step.status !== void 0 && !definitions.some((item) => item.target === "status")) {
    definitions.unshift({ name: `\u8FD4\u56DE HTTP ${step.status}`, target: "status", equals: step.status });
  } else if (step.status === void 0 && definitions.length === 0) {
    definitions.push({ name: "\u8FD4\u56DE HTTP 2xx", target: "status", matches: "^2\\d\\d$", implicit: true });
  }
  return definitions.map((definition, index) => evaluateAssertion(definition, response, runtime, { ...context || {}, assertionNo: index + 1 }));
}
var RESERVED_VARS = [...contract.reservedVars];
function assertNotReservedVar(name, label) {
  if (RESERVED_VARS.includes(name)) {
    throw new Error(`${label || "\u53D8\u91CF"} "${name}" \u662F\u8FD0\u884C\u65F6\u81EA\u52A8\u751F\u6210\u7684\u4FDD\u7559\u53D8\u91CF\uFF0C\u7981\u6B62\u58F0\u660E\u6216\u8986\u76D6`);
  }
}
function assertNoReservedVars(source, label) {
  for (const name of Object.keys(source || {})) {
    assertNotReservedVar(name, label);
  }
}
function applyExtract(step, response, runtime) {
  const warnings = [];
  const failures = [];
  for (const definition of step.extract || []) {
    if (!definition || !definition.name) continue;
    assertNotReservedVar(definition.name, "extract \u53D8\u91CF");
    let source = response.body;
    if (definition.target === "status") source = response.status;
    else if (definition.header) source = headerValue(response.headers, definition.header);
    else if (definition.from === "headers") source = response.headers;
    else if (definition.from === "bodyText") source = response.bodyText;
    else if (definition.from === "response") source = response;
    const value = definition.path ? getByPath(source, definition.path) : source;
    if (value === void 0) {
      if (definition.required === true) {
        failures.push({
          name: `\u63D0\u53D6 ${definition.name}\uFF08\u8DEF\u5F84\u4E0D\u5B58\u5728\uFF09`,
          passed: false,
          actual: void 0,
          expected: `\u8DEF\u5F84 ${definition.path || "(\u6574\u4E2A\u54CD\u5E94)"} \u5B58\u5728`
        });
      } else {
        warnings.push(`\u63D0\u53D6\u53D8\u91CF ${definition.name}\uFF1A\u8DEF\u5F84 ${definition.path || "(\u6574\u4E2A\u54CD\u5E94)"} \u4E0D\u5B58\u5728\uFF0C\u53D8\u91CF\u503C\u4E3A undefined\uFF08required \u672A\u5F00\u542F\uFF0C\u4E0D\u5F71\u54CD\u6267\u884C\uFF09`);
      }
    }
    runtime.vars[definition.name] = value;
  }
  return { warnings, failures };
}
function md5(value) {
  return (0, import_blueimp_md5.default)(String(value));
}
function generateSignature(params, secretValue) {
  const pairs = Object.keys(params || {}).sort().map((key) => `${key}=${params[key] == null ? "" : params[key]}`);
  pairs.push(`apiSecret=${secretValue == null ? "" : secretValue}`);
  return md5(pairs.join("&")).toUpperCase();
}
function maskSecret(value) {
  if (value === void 0 || value === null || value === "") return "";
  const text = String(value);
  return text.length > 12 ? `${text.slice(0, 4)}...${text.slice(-4)}` : "***";
}
function sanitizeSensitive(value, key = "", sensitiveNames = []) {
  return value;
}
function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds)) return "-";
  return milliseconds >= 1e3 ? `${(milliseconds / 1e3).toFixed(2)} s` : `${milliseconds.toFixed(0)} ms`;
}

// src/adapter-types.js
function validateAdapter(adapter, name = "unknown") {
  const errors = [];
  if (!adapter || typeof adapter !== "object") {
    errors.push("\u9002\u914D\u5668\u5FC5\u987B\u662F\u5BF9\u8C61");
  } else {
    if (typeof adapter.execute !== "function") {
      errors.push("\u7F3A\u5C11\u5FC5\u9700\u7684 execute \u65B9\u6CD5");
    }
    const optionalMethods = ["initialize", "matches", "beforeExecute", "afterExecute", "onError", "dispose"];
    for (const method of optionalMethods) {
      if (adapter[method] !== void 0 && typeof adapter[method] !== "function") {
        errors.push(`${method} \u5FC5\u987B\u662F\u51FD\u6570`);
      }
    }
  }
  if (errors.length > 0) {
    throw new TypeError(`\u9002\u914D\u5668 ${name} \u9A8C\u8BC1\u5931\u8D25:
${errors.map((e) => `  - ${e}`).join("\n")}`);
  }
}
function validateAdapterResponse(response, adapterName = "unknown") {
  if (!response || typeof response !== "object") {
    throw new TypeError(`\u9002\u914D\u5668 ${adapterName} \u8FD4\u56DE\u503C\u5FC5\u987B\u662F\u5BF9\u8C61`);
  }
  const actualResponse = response.response || response;
  if (actualResponse.status === void 0 || actualResponse.status === null) {
    throw new TypeError(`\u9002\u914D\u5668 ${adapterName} \u54CD\u5E94\u7F3A\u5C11 status \u5B57\u6BB5`);
  }
  if (actualResponse.headers !== void 0 && typeof actualResponse.headers !== "object") {
    throw new TypeError(`\u9002\u914D\u5668 ${adapterName} \u54CD\u5E94\u7684 headers \u5FC5\u987B\u662F\u5BF9\u8C61`);
  }
  return true;
}

// src/registry.js
var scenarioRegistry = /* @__PURE__ */ new Map();
var adapterRegistry = /* @__PURE__ */ new Map();
var currentConfig = null;
function invariant(condition, message) {
  if (!condition) throw new TypeError(message);
}
function nonEmptyString(value) {
  return typeof value === "string" && Boolean(value.trim());
}
function assertUnique(items, field, label) {
  const seen = /* @__PURE__ */ new Set();
  for (const item of items) {
    const value = item[field];
    invariant(!seen.has(value), `${label}\u91CD\u590D: ${value}`);
    seen.add(value);
  }
}
function normalizeGlobals(globals, label) {
  const types = contract.globals.types;
  const result = Array.isArray(globals) ? globals.map((item, index) => {
    invariant(isPlainObject(item), `${label}\u7B2C ${index + 1} \u4E2A\u5168\u5C40\u53C2\u6570\u5FC5\u987B\u662F\u5BF9\u8C61`);
    invariant(types.includes(item.type), `${label}\u7B2C ${index + 1} \u4E2A\u5168\u5C40\u53C2\u6570 type \u5FC5\u987B\u662F ${types.join("/")}`);
    invariant(nonEmptyString(item.name), `${label}\u7B2C ${index + 1} \u4E2A\u5168\u5C40\u53C2\u6570\u7F3A\u5C11 name`);
    return { type: item.type, name: item.name, value: item.value == null ? "" : String(item.value) };
  }) : [];
  const seen = /* @__PURE__ */ new Set();
  for (const item of result) {
    const key = `${item.type}:${item.name}`;
    invariant(!seen.has(key), `${label}\u5168\u5C40\u53C2\u6570\u91CD\u590D: ${key}`);
    seen.add(key);
  }
  return result;
}
function defineScenario(input) {
  invariant(isPlainObject(input), "\u573A\u666F\u5FC5\u987B\u662F\u5BF9\u8C61");
  invariant(typeof input.name === "string" && input.name.trim(), "\u573A\u666F\u7F3A\u5C11 name");
  invariant(Array.isArray(input.steps), `\u573A\u666F ${input.name} \u7F3A\u5C11 steps \u6570\u7EC4`);
  assertNoReservedVars(input.vars, `\u573A\u666F ${input.name} \u7684 vars`);
  for (const definition of input.generatedVars || []) {
    invariant(isPlainObject(definition), `\u573A\u666F ${input.name} \u7684 generatedVars \u9879\u5FC5\u987B\u662F\u5BF9\u8C61`);
    invariant(nonEmptyString(definition.name), `\u573A\u666F ${input.name} \u7684 generatedVars \u9879\u7F3A\u5C11 name`);
    invariant(
      contract.generatedVars.types.includes(definition.type),
      `\u573A\u666F ${input.name} \u7684 generatedVars \u7C7B\u578B\u4E0D\u652F\u6301: ${definition.type}\uFF08\u652F\u6301 ${contract.generatedVars.types.join("/")}\uFF09`
    );
  }
  input.steps.forEach((step, index) => {
    invariant(isPlainObject(step), `\u573A\u666F ${input.name} \u7B2C ${index + 1} \u6B65\u5FC5\u987B\u662F\u5BF9\u8C61`);
    invariant(nonEmptyString(step.name), `\u573A\u666F ${input.name} \u7B2C ${index + 1} \u6B65\u7F3A\u5C11 name`);
    if (step.method !== void 0) invariant(nonEmptyString(step.method), `\u6B65\u9AA4 ${step.name} \u7684 method \u65E0\u6548`);
    const stepContext = { scenarioName: input.name, stepNo: index + 1, stepName: step.name };
    if (step.assertions !== void 0) {
      invariant(Array.isArray(step.assertions), `\u6B65\u9AA4 ${step.name} \u7684 assertions \u5FC5\u987B\u662F\u6570\u7EC4`);
      step.assertions.forEach((definition, assertionIndex) => {
        validateAssertion(definition, { ...stepContext, assertionNo: assertionIndex + 1 });
      });
    }
    if (step.retryUntil !== void 0) {
      invariant(isPlainObject(step.retryUntil), `\u6B65\u9AA4 ${step.name} \u7684 retryUntil \u5FC5\u987B\u662F\u5BF9\u8C61`);
      if (step.retryUntil.assertions !== void 0) {
        invariant(Array.isArray(step.retryUntil.assertions), `\u6B65\u9AA4 ${step.name} \u7684 retryUntil.assertions \u5FC5\u987B\u662F\u6570\u7EC4`);
        step.retryUntil.assertions.forEach((definition, assertionIndex) => {
          validateAssertion(definition, { ...stepContext, assertionNo: assertionIndex + 1 });
        });
      }
      const maxAttempts = Number(step.retryUntil.maxAttempts ?? 10);
      const intervalMs = Number(step.retryUntil.intervalMs ?? 2e3);
      invariant(Number.isInteger(maxAttempts) && maxAttempts >= 1, `\u6B65\u9AA4 ${step.name} \u7684 maxAttempts \u5FC5\u987B\u662F\u6B63\u6574\u6570`);
      invariant(Number.isFinite(intervalMs) && intervalMs >= 0, `\u6B65\u9AA4 ${step.name} \u7684 intervalMs \u4E0D\u80FD\u4E3A\u8D1F\u6570`);
    }
    if (step.when !== void 0 && isPlainObject(step.when)) {
      if (!contract.when.sources.includes(step.when.from)) {
        throw new TypeError(
          `\u6B65\u9AA4 ${step.name} \u7684 when \u5BF9\u8C61\u5F62\u5F0F\u53EA\u5141\u8BB8 from: "vars"\uFF08\u5F53\u524D\u4E3A ${JSON.stringify(step.when.from)}\uFF09\uFF0C\u4E0D\u5141\u8BB8\u4ECE\u54CD\u5E94 body/status/header \u53D6\u6761\u4EF6`
        );
      }
      if (step.when.target !== void 0 || step.when.header !== void 0) {
        throw new TypeError(`\u6B65\u9AA4 ${step.name} \u7684 when \u5BF9\u8C61\u5F62\u5F0F\u4E0D\u5141\u8BB8\u4F7F\u7528 target/header \u6761\u4EF6`);
      }
      validateAssertion(step.when, stepContext);
    }
  });
  const failurePolicy = input.failurePolicy || "stop";
  invariant(contract.scenario.failurePolicies.includes(failurePolicy), "failurePolicy \u53EA\u80FD\u662F stop \u6216 continue");
  return { ...input, failurePolicy, steps: [...input.steps] };
}
function defineConfig(input) {
  invariant(isPlainObject(input), "\u914D\u7F6E\u5FC5\u987B\u662F\u5BF9\u8C61");
  const globals = normalizeGlobals(input.globals, "\u5168\u5C40");
  const envs = Array.isArray(input.envs) ? input.envs.map((env) => ({
    ...env,
    globals: normalizeGlobals(env.globals, `\u73AF\u5883 ${env.key} \u7684`)
  })) : [];
  for (const env of envs) {
    invariant(nonEmptyString(env.key) && nonEmptyString(env.name), "\u6BCF\u4E2A\u73AF\u5883\u5FC5\u987B\u5305\u542B\u975E\u7A7A key \u548C name");
  }
  assertUnique(envs, "key", "\u73AF\u5883 key");
  const scenarios = (Array.isArray(input.scenarios) ? input.scenarios : []).map((entry, index) => {
    if (typeof entry === "string") {
      invariant(nonEmptyString(entry), `\u7B2C ${index + 1} \u4E2A\u573A\u666F\u5730\u5740\u4E0D\u80FD\u4E3A\u7A7A`);
      return { id: entry, name: entry, url: entry };
    }
    invariant(isPlainObject(entry), `\u7B2C ${index + 1} \u4E2A\u573A\u666F\u6E05\u5355\u9879\u65E0\u6548`);
    const url = entry.url || entry.file || entry.path || "";
    const id = entry.id || url || `scenario-${index + 1}`;
    invariant(nonEmptyString(id), `\u7B2C ${index + 1} \u4E2A\u573A\u666F\u7F3A\u5C11 id`);
    invariant(nonEmptyString(url), `\u573A\u666F ${id} \u7F3A\u5C11 url`);
    if (entry.manual !== void 0) {
      invariant(typeof entry.manual === "boolean", `\u573A\u666F ${id} \u7684 manual \u5FC5\u987B\u662F\u5E03\u5C14\u503C`);
    }
    return { ...entry, id, name: entry.name || id, url };
  });
  assertUnique(scenarios, "id", "\u573A\u666F id");
  const variables = Array.isArray(input.variables) ? input.variables.map((item, index) => {
    invariant(isPlainObject(item), `\u7B2C ${index + 1} \u4E2A\u53D8\u91CF\u5B9A\u4E49\u65E0\u6548`);
    invariant(nonEmptyString(item.name), `\u7B2C ${index + 1} \u4E2A\u53D8\u91CF\u7F3A\u5C11 name`);
    if (item.env !== void 0) invariant(nonEmptyString(item.env), `\u53D8\u91CF ${item.name} \u7684 env \u65E0\u6548`);
    return { ...item };
  }) : [];
  assertUnique(variables, "name", "\u53D8\u91CF name");
  const defaultEnvKey = input.defaultEnvKey || envs[0]?.key || "";
  invariant(!defaultEnvKey || envs.some((env) => env.key === defaultEnvKey), `defaultEnvKey \u4E0D\u5B58\u5728: ${defaultEnvKey}`);
  const requestTimeoutMs = Number(input.requestTimeoutMs ?? 3e4);
  invariant(Number.isFinite(requestTimeoutMs) && requestTimeoutMs > 0, "requestTimeoutMs \u5FC5\u987B\u662F\u6B63\u6570");
  return {
    ...input,
    globals,
    envs,
    scenarios,
    variables,
    defaultEnvKey,
    requestTimeoutMs,
    vars: { ...input.scenarioVars || {}, ...input.vars || {} },
    storagePrefix: input.storagePrefix || "scenario-test"
  };
}
function registerConfig(config) {
  currentConfig = defineConfig(config);
  return currentConfig;
}
function getConfig() {
  return currentConfig;
}
function registerScenario(id, scenario) {
  invariant(typeof id === "string" && id.trim(), "\u573A\u666F id \u4E0D\u80FD\u4E3A\u7A7A");
  const normalized = defineScenario(scenario);
  scenarioRegistry.set(id, normalized);
  return normalized;
}
function getScenario(id) {
  return scenarioRegistry.get(id);
}
function clearScenarios() {
  scenarioRegistry.clear();
}
function registerAdapter(name, adapter) {
  invariant(typeof name === "string" && name.trim(), "\u9002\u914D\u5668\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
  validateAdapter(adapter, name);
  if (typeof adapter.initialize === "function") {
    try {
      adapter.initialize();
    } catch (error) {
      throw new TypeError(`\u9002\u914D\u5668 ${name} \u521D\u59CB\u5316\u5931\u8D25: ${error.message}`);
    }
  }
  adapterRegistry.set(name, adapter);
  return adapter;
}
function getAdapter(name) {
  return adapterRegistry.get(name);
}
function listAdapters() {
  return new Map(adapterRegistry);
}
function unregisterAdapter(name) {
  const adapter = adapterRegistry.get(name);
  if (adapter && typeof adapter.dispose === "function") {
    try {
      adapter.dispose();
    } catch (error) {
      console.warn(`\u9002\u914D\u5668 ${name} \u6E05\u7406\u5931\u8D25:`, error);
    }
  }
  return adapterRegistry.delete(name);
}
function clearAdapters() {
  for (const [name, adapter] of adapterRegistry.entries()) {
    if (typeof adapter.dispose === "function") {
      try {
        adapter.dispose();
      } catch (error) {
        console.warn(`\u9002\u914D\u5668 ${name} \u6E05\u7406\u5931\u8D25:`, error);
      }
    }
  }
  adapterRegistry.clear();
}

// src/engine.js
function now() {
  return globalThis.performance?.now ? globalThis.performance.now() : Date.now();
}
function delay(milliseconds, signal) {
  if (!milliseconds) return Promise.resolve();
  return new Promise((resolveDelay, reject) => {
    const timer = setTimeout(resolveDelay, milliseconds);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(signal.reason || new Error("\u6267\u884C\u5DF2\u53D6\u6D88"));
      }, { once: true });
    }
  });
}
function createRequestSignal(parentSignal, timeoutMs) {
  const controller = new AbortController();
  const abort = () => controller.abort(parentSignal?.reason || new Error("\u6267\u884C\u5DF2\u53D6\u6D88"));
  if (parentSignal?.aborted) abort();
  else parentSignal?.addEventListener("abort", abort, { once: true });
  const timer = timeoutMs > 0 ? setTimeout(() => controller.abort(new Error(`\u8BF7\u6C42\u8D85\u65F6\uFF08${timeoutMs}ms\uFF09`)), timeoutMs) : null;
  return {
    signal: controller.signal,
    dispose() {
      if (timer) clearTimeout(timer);
      parentSignal?.removeEventListener("abort", abort);
    }
  };
}
function createRunIdentifiers() {
  const timestamp = String(Date.now());
  const random = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 8) : Math.random().toString(16).slice(2, 10).padEnd(8, "0");
  return {
    runId: `${timestamp}-${random}`,
    runNo: `${timestamp.slice(-6)}-${random.slice(0, 4)}`
  };
}
function buildGeneratedVars(scenario, baseVars, environmentVariables, options = {}) {
  const identifiers = createRunIdentifiers();
  assertNoReservedVars(scenario.vars, "\u573A\u666F vars");
  assertNoReservedVars(baseVars, "\u914D\u7F6E/\u9009\u9879 vars");
  const vars = { ...scenario.vars || {}, ...baseVars || {}, ...identifiers };
  const verboseErrors = options.verboseErrors || process.env.SCENARIO_VERBOSE_ERRORS === "true";
  for (const [name, environmentName] of Object.entries(scenario.envVars || {})) {
    assertNotReservedVar(name, `\u573A\u666F envVars`);
    const value = environmentVariables?.[environmentName] ?? vars[name];
    if (value === void 0 || value === null || value === "") {
      if (verboseErrors) {
        throw new Error(
          `\u7F3A\u5C11\u573A\u666F\u53D8\u91CF: vars.${name}
\u73AF\u5883\u53D8\u91CF\u6620\u5C04: ${environmentName}
\u63D0\u793A: \u5728\u914D\u7F6E\u4E2D\u8BBE\u7F6E vars.${name} \u6216\u8BBE\u7F6E\u73AF\u5883\u53D8\u91CF ${environmentName}`
        );
      } else {
        throw new Error(
          `\u7F3A\u5C11\u5FC5\u9700\u7684\u573A\u666F\u53D8\u91CF: vars.${name}
\u63D0\u793A: \u8BF7\u5728\u914D\u7F6E\u6587\u4EF6\u7684 vars \u4E2D\u8BBE\u7F6E\u8BE5\u53D8\u91CF\uFF0C\u6216\u901A\u8FC7\u73AF\u5883\u53D8\u91CF\u63D0\u4F9B
\u8BE6\u7EC6\u4FE1\u606F\u53EF\u901A\u8FC7\u8BBE\u7F6E SCENARIO_VERBOSE_ERRORS=true \u67E5\u770B`
        );
      }
    }
    vars[name] = value;
  }
  for (const definition of scenario.generatedVars || []) {
    if (!definition?.name) continue;
    assertNotReservedVar(definition.name, "generatedVars");
    if (!contract.generatedVars.types.includes(definition.type)) {
      throw new Error(`\u4E0D\u652F\u6301\u7684 generatedVars \u7C7B\u578B: ${definition.type}`);
    }
    if (definition.type === "timestamp") vars[definition.name] = Date.now();
    else if (definition.type === "uuidHex") {
      if (!globalThis.crypto?.randomUUID) throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301 crypto.randomUUID");
      vars[definition.name] = globalThis.crypto.randomUUID().replace(/-/g, "");
    } else if (definition.type === "md5") {
      const source = (definition.parts || []).map((name) => vars[name] == null ? "" : String(vars[name])).join("");
      vars[definition.name] = md5(source);
    } else if (definition.type === "signature") {
      const params = Object.fromEntries(Object.entries(definition.params || {}).map(([key, variableName]) => [key, vars[variableName]]));
      const secret = vars[definition.secretVar || "apiSecret"];
      if (!secret) {
        throw new Error(`\u7B7E\u540D\u751F\u6210\u5931\u8D25: \u7F3A\u5C11\u5BC6\u94A5\u53D8\u91CF vars.${definition.secretVar || "apiSecret"}`);
      }
      vars[definition.name] = generateSignature(params, secret);
    } else {
      throw new Error(`\u4E0D\u652F\u6301\u7684 generatedVars \u7C7B\u578B: ${definition.type}`);
    }
  }
  return vars;
}
function createRuntime(scenario, options = {}) {
  const config = options.config || {};
  return {
    vars: buildGeneratedVars(
      scenario,
      { ...config.vars || {}, ...options.vars || {} },
      options.environmentVariables || {}
    ),
    lastResponse: null,
    lastResponseBody: null
  };
}
function chooseAdapter(step, adapters) {
  if (step.adapter) return adapters.get(step.adapter);
  for (const adapter of adapters.values()) {
    if (typeof adapter.matches === "function" && adapter.matches(step)) return adapter;
  }
  return null;
}
async function readResponse(response, step, io, runtime) {
  const headers = headersToObject(response.headers);
  const contentType2 = String(headers["content-type"] || "");
  if (step.saveResponseAs && io?.saveResponse) {
    const data = new Uint8Array(await response.arrayBuffer());
    const saved = await io.saveResponse(resolveString(step.saveResponseAs, runtime), data, { contentType: contentType2, headers });
    return { status: response.status, headers, body: saved, bodyText: null };
  }
  const bodyText = await response.text();
  return { status: response.status, headers, body: parseBody(bodyText, contentType2), bodyText };
}
async function executeHttp(step, runtime, options) {
  const request = resolve(clone(step.request || {}), runtime) || {};
  const method = String(step.method || request.method || "GET").toUpperCase();
  let requestPath = buildUrl(step.path || request.path || "", step.params || request.params, runtime);
  const headers = { ...request.headers || {} };
  const absoluteUrl = /^https?:\/\//i.test(requestPath);
  const allowEnvironmentAuthorization = !absoluteUrl || request.useEnvironmentAuthorization === true;
  const globals = options.globals || [];
  if (allowEnvironmentAuthorization && globals.length) {
    const existingKeys = /* @__PURE__ */ new Set();
    const queryIndex = requestPath.indexOf("?");
    if (queryIndex >= 0) {
      for (const pair of requestPath.slice(queryIndex + 1).split("&")) {
        const key = pair.split("=")[0];
        if (key) existingKeys.add(decodeURIComponent(key));
      }
    }
    const queryPairs = [];
    for (const global of globals) {
      if (global.type !== "query" || existingKeys.has(global.name)) continue;
      queryPairs.push(`${encodeURIComponent(global.name)}=${encodeURIComponent(String(resolveString(global.value, runtime)))}`);
    }
    if (queryPairs.length) requestPath = `${requestPath}${queryIndex >= 0 ? "&" : "?"}${queryPairs.join("&")}`;
    const cookieParts = globals.filter((global) => global.type === "cookie").map((global) => `${global.name}=${resolveString(global.value, runtime)}`);
    if (cookieParts.length) {
      const cookieKey = Object.keys(headers).find((key) => key.toLowerCase() === "cookie");
      const mergedCookie = cookieKey ? `${headers[cookieKey]}; ${cookieParts.join("; ")}` : cookieParts.join("; ");
      if (cookieKey) headers[cookieKey] = mergedCookie;
      else headers.Cookie = mergedCookie;
    }
    for (const global of globals) {
      if (global.type !== "header" || hasHeader(headers, global.name)) continue;
      headers[global.name] = resolveString(global.value, runtime);
    }
  }
  if (options.authorization && allowEnvironmentAuthorization && !hasHeader(headers, "Authorization")) {
    headers.Authorization = options.authorization;
  }
  const fetchOptions = { method, headers };
  if (request.credentials !== void 0) fetchOptions.credentials = request.credentials;
  if (request.redirect !== void 0) fetchOptions.redirect = request.redirect;
  if (request.fileUpload) {
    if (!options.io?.createUploadBody) throw new Error("\u5F53\u524D\u8FD0\u884C\u73AF\u5883\u4E0D\u652F\u6301 fileUpload");
    const upload = await options.io.createUploadBody(resolve(request.fileUpload, runtime), runtime);
    fetchOptions.body = upload.body;
    for (const [name, value] of Object.entries(upload.headers || {})) headers[name] = value;
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === "content-type" && upload.omitContentType) delete headers[key];
    }
  } else if (request.body !== void 0 && request.body !== null && !["GET", "HEAD"].includes(method)) {
    if (typeof request.body === "string") fetchOptions.body = request.body;
    else {
      if (!hasHeader(headers, "Content-Type")) headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(request.body);
    }
  }
  const timeoutMs = Number(step.timeoutMs || options.requestTimeoutMs || 3e4);
  const requestSignal = createRequestSignal(options.signal, timeoutMs);
  fetchOptions.signal = requestSignal.signal;
  try {
    const response = await options.fetch(joinUrl(options.baseUrl, requestPath), fetchOptions);
    const responseData = await readResponse(response, step, options.io, runtime);
    return { method, path: requestPath, request: { headers, body: request.body }, response: responseData };
  } finally {
    requestSignal.dispose();
  }
}
var AdapterExecutionError = class extends Error {
  constructor(adapterName, originalError, step) {
    const message = `\u9002\u914D\u5668 ${adapterName} \u6267\u884C\u5931\u8D25: ${originalError.message}`;
    super(message);
    this.name = "AdapterExecutionError";
    this.adapterName = adapterName;
    this.originalError = originalError;
    this.stepName = step?.name || "\u672A\u547D\u540D\u6B65\u9AA4";
  }
};
async function executeAdapter(adapter, step, runtime, options) {
  if (!adapter) throw new Error(`\u672A\u6CE8\u518C\u6B65\u9AA4\u9002\u914D\u5668: ${step.adapter || "unknown"}`);
  const adapterName = step.adapter || adapter.constructor?.name || "unknown";
  let output;
  try {
    if (typeof adapter.beforeExecute === "function") {
      await adapter.beforeExecute({ step, runtime, options });
    }
    output = await adapter.execute({ step: resolve(clone(step), runtime), runtime, options });
    if (typeof adapter.afterExecute === "function") {
      output = await adapter.afterExecute({ step, runtime, options, output }) || output;
    }
  } catch (error) {
    if (typeof adapter.onError === "function") {
      try {
        await adapter.onError({ step, runtime, options, error });
      } catch (hookError) {
        console.warn(`\u9002\u914D\u5668 ${adapterName} \u9519\u8BEF\u94A9\u5B50\u5931\u8D25:`, hookError);
      }
    }
    throw new AdapterExecutionError(adapterName, error, step);
  }
  const response = output?.response || output;
  if (!response || response.status === void 0) {
    throw new Error(`\u9002\u914D\u5668 ${adapterName} \u5FC5\u987B\u8FD4\u56DE\u5305\u542B status \u7684 response \u5BF9\u8C61`);
  }
  return {
    method: output.method || "ADAPTER",
    path: output.path || step.adapter || "adapter",
    request: output.request || null,
    response: {
      status: response.status,
      headers: response.headers || {},
      body: response.body ?? null,
      bodyText: response.bodyText ?? null
    }
  };
}
function createEngine(engineOptions = {}) {
  const scopedAdapters = engineOptions.isolateAdapters !== false ? new Map([...listAdapters()]) : listAdapters();
  if (engineOptions.adapters) {
    for (const [name, adapter] of Object.entries(engineOptions.adapters)) {
      if (adapter && typeof adapter.execute === "function") {
        scopedAdapters.set(name, adapter);
      }
    }
  }
  const adapters = scopedAdapters;
  const fetchImpl = engineOptions.fetch || (typeof globalThis.fetch === "function" ? (...args) => globalThis.fetch(...args) : null);
  if (typeof fetchImpl !== "function") throw new Error("\u7F3A\u5C11 fetch \u5B9E\u73B0");
  async function runStep(step, runtime, runOptions = {}) {
    const startedAt = now();
    const options = {
      ...engineOptions,
      ...runOptions,
      fetch: fetchImpl,
      adapters,
      requestTimeoutMs: runOptions.requestTimeoutMs || engineOptions.requestTimeoutMs || 3e4
    };
    if (step.when !== void 0) {
      const shouldRun = typeof step.when === "object" ? evaluateAssertion(step.when, { status: 0, headers: {}, body: null, bodyText: "" }, runtime, { stepName: step.name }).passed : Boolean(resolve(step.when, runtime));
      if (!shouldRun) {
        return {
          name: step.name || "\u672A\u547D\u540D\u6B65\u9AA4",
          method: "SKIP",
          path: resolveString(step.path || "", runtime),
          status: "SKIPPED",
          duration: now() - startedAt,
          passed: true,
          skipped: true,
          error: "",
          warnings: [],
          assertions: [],
          request: null,
          response: null
        };
      }
    }
    let lastExecution;
    let assertions = [];
    let stepWarnings = [];
    const retry = step.retryUntil || null;
    const totalAttempts = retry ? Number(retry.maxAttempts || 10) + 1 : 1;
    const retryStartTime = now();
    const maxElapsedMs = retry?.maxElapsedMs || 3e5;
    try {
      for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
        if (options.signal?.aborted) throw options.signal.reason || new Error("\u6267\u884C\u5DF2\u53D6\u6D88");
        if (retry && now() - retryStartTime > maxElapsedMs) {
          throw new Error(
            `\u91CD\u8BD5\u8D85\u65F6: \u5DF2\u5C1D\u8BD5 ${attempt - 1} \u6B21\uFF0C\u8017\u65F6\u8D85\u8FC7 ${maxElapsedMs}ms
\u63D0\u793A: \u8003\u8651\u8C03\u6574 retryUntil.maxElapsedMs \u6216\u68C0\u67E5\u63A5\u53E3\u54CD\u5E94`
          );
        }
        const adapter = chooseAdapter(step, adapters);
        lastExecution = adapter ? await executeAdapter(adapter, step, runtime, options) : await executeHttp(step, runtime, options);
        runtime.lastResponse = lastExecution.response;
        runtime.lastResponseBody = lastExecution.response.body;
        const extractResult = applyExtract(step, lastExecution.response, runtime);
        stepWarnings = extractResult.warnings;
        assertions = buildAssertions(step, lastExecution.response, runtime, { stepName: step.name });
        if (extractResult.failures.length) assertions.push(...extractResult.failures);
        if (assertions.every((item) => item.passed) || attempt === totalAttempts) break;
        const intervalMs = Math.max(100, Number(retry.intervalMs || 2e3));
        await delay(intervalMs, options.signal);
      }
      const failed = assertions.find((item) => !item.passed);
      return {
        name: step.name || "\u672A\u547D\u540D\u6B65\u9AA4",
        method: lastExecution.method,
        path: lastExecution.path,
        status: lastExecution.response.status,
        duration: now() - startedAt,
        passed: !failed,
        error: failed?.name || "",
        warnings: stepWarnings,
        assertions,
        request: lastExecution.request,
        response: lastExecution.response
      };
    } catch (error) {
      return {
        name: step.name || "\u672A\u547D\u540D\u6B65\u9AA4",
        method: String(step.method || "ERROR").toUpperCase(),
        path: resolveString(step.path || "", runtime),
        status: options.signal?.aborted ? "CANCELLED" : "ERROR",
        duration: now() - startedAt,
        passed: false,
        error: error?.message || String(error),
        warnings: [],
        assertions: [{ name: "\u6B65\u9AA4\u6267\u884C\u6210\u529F", passed: false, actual: error?.message || String(error), expected: "\u65E0\u5F02\u5E38" }],
        request: null,
        response: null
      };
    }
  }
  async function runScenario2(input, runOptions = {}) {
    const scenario = defineScenario(input);
    const config = runOptions.config || engineOptions.config || {};
    const runtime = createRuntime(scenario, {
      config,
      vars: { ...engineOptions.vars || {}, ...runOptions.vars || {} },
      environmentVariables: runOptions.environmentVariables || engineOptions.environmentVariables
    });
    const results = [];
    for (let index = 0; index < scenario.steps.length; index += 1) {
      const result = await runStep(scenario.steps[index], runtime, { ...runOptions, config });
      result.stepNo = index + 1;
      results.push(result);
      await runOptions.onStep?.(result, index, runtime);
      if (!result.passed && scenario.failurePolicy !== "continue") break;
      if (runOptions.signal?.aborted) break;
    }
    const skipped = results.filter((item) => item.skipped).length;
    const executed = results.length - skipped;
    const failed = results.filter((item) => !item.skipped && !item.passed).length;
    const passedSteps = results.filter((item) => !item.skipped && item.passed).length;
    const status = failed > 0 ? "FAILED" : executed === 0 ? "SKIPPED" : "PASSED";
    return {
      scenarioName: scenario.name,
      passed: failed === 0 && results.length === scenario.steps.length,
      status,
      planned: scenario.steps.length,
      executed,
      passedSteps,
      failed,
      skipped,
      results,
      vars: runtime.vars
    };
  }
  return { runStep, runScenario: runScenario2, createRuntime };
}
async function runScenario(scenario, options = {}) {
  return createEngine(options).runScenario(scenario, options);
}

// src/capabilities.js
function buildCapabilities(inputContract = contract) {
  const { assertions, when, extract, reservedVars, generatedVars, globals, config, scenario, cli } = inputContract;
  return {
    schema: "scenario-test-capabilities",
    version: inputContract.runtimeVersion,
    contractVersion: inputContract.contractVersion,
    assertions: {
      operators: Object.fromEntries(
        Object.entries(assertions.operators).map(([name, meta]) => [name, { description: meta.description, valueType: meta.valueType }])
      ),
      metaKeys: [...assertions.metaKeys],
      numericOperators: [...assertions.numericOperators]
    },
    when: {
      sources: [...when.sources],
      note: when.note
    },
    extract: {
      from: [...extract.from],
      required: extract.required,
      note: extract.note
    },
    reservedVars: [...reservedVars],
    generatedVars: {
      types: [...generatedVars.types]
    },
    globals: {
      types: [...globals.types],
      note: globals.note
    },
    config: {
      scenarioItemKeys: [...config.scenarioItemKeys],
      environmentKeys: [...config.environmentKeys],
      variableKeys: [...config.variableKeys],
      manual: { ...config.manual }
    },
    scenario: {
      keys: [...scenario.keys],
      stepKeys: [...scenario.stepKeys],
      failurePolicies: [...scenario.failurePolicies]
    },
    cli: {
      commands: [...cli.commands],
      options: Object.fromEntries(
        Object.entries(cli.options).map(([name, spec]) => [
          name,
          { kind: spec.kind, description: spec.description, ...spec.aliases ? { aliases: [...spec.aliases] } : {} }
        ])
      )
    }
  };
}
function operatorLine(name, meta) {
  const typeHint = meta.valueType === "finiteNumber" ? "\uFF08\u4EC5\u6709\u9650 number\uFF09" : meta.valueType === "any" ? "" : `\uFF08${meta.valueType}\uFF09`;
  return `  ${name.padEnd(10)}${meta.description}${typeHint}`;
}
function renderCapabilitiesText(capabilities) {
  const lines = [];
  lines.push(`scenario-test v${capabilities.version} \u2014 \u80FD\u529B\u6E05\u5355\uFF08contract v${capabilities.contractVersion}\uFF09`);
  lines.push("");
  lines.push("\u65AD\u8A00\u64CD\u4F5C\u7B26\uFF08assertions.operators\uFF09:");
  for (const [name, meta] of Object.entries(capabilities.assertions.operators)) {
    lines.push(operatorLine(name, meta));
  }
  lines.push(`  \u5143\u6570\u636E\u952E: ${capabilities.assertions.metaKeys.join(" / ")}`);
  lines.push("");
  lines.push(`when \u6761\u4EF6\u6765\u6E90: ${capabilities.when.sources.join(" / ")}`);
  lines.push(`  ${capabilities.when.note}`);
  lines.push("");
  lines.push(`extract: from = ${capabilities.extract.from.join(" | ")}\uFF08\u9ED8\u8BA4 body\uFF09, required: ${capabilities.extract.required}`);
  lines.push(`  ${capabilities.extract.note}`);
  lines.push("");
  lines.push(`\u4FDD\u7559\u53D8\u91CF: ${capabilities.reservedVars.join(" / ")}`);
  lines.push("");
  lines.push(`generatedVars \u7C7B\u578B: ${capabilities.generatedVars.types.join(" / ")}`);
  lines.push("");
  lines.push(`globals \u7C7B\u578B: ${capabilities.globals.types.join(" / ")}`);
  lines.push("");
  lines.push(`config.scenarios \u9879\u5B57\u6BB5: ${capabilities.config.scenarioItemKeys.join(" / ")}`);
  lines.push(`  manual\uFF08${capabilities.config.manual.type}\uFF09: ${capabilities.config.manual.note}`);
  lines.push("");
  lines.push(`\u573A\u666F\u7ED3\u6784: ${capabilities.scenario.keys.join(" / ")}\uFF1B\u6B65\u9AA4\u5B57\u6BB5: ${capabilities.scenario.stepKeys.join(" / ")}`);
  lines.push(`failurePolicy: ${capabilities.scenario.failurePolicies.join(" / ")}`);
  lines.push("");
  lines.push("CLI \u547D\u4EE4:");
  for (const command of capabilities.cli.commands) {
    lines.push(`  node scenario-test-cli.cjs ${command}`);
  }
  lines.push("\u5173\u952E\u9009\u9879:");
  for (const [name, spec] of Object.entries(capabilities.cli.options)) {
    const flags = [`--${name}`, ...(spec.aliases || []).map((alias) => `--${alias}`)].join(" / ");
    lines.push(`  ${flags.padEnd(36)}${spec.description}`);
  }
  return lines.join("\n");
}

// src/browser/legacy/core.js
var import_blueimp_md52 = __toESM(require_md5(), 1);
var legacyCore = function(globalRoot) {
  "use strict";
  var md52;
  if (typeof import_blueimp_md52.default === "function") {
    md52 = function(input) {
      return (0, import_blueimp_md52.default)(String(input));
    };
  } else {
    md52 = function() {
      throw new Error("\u672A\u52A0\u8F7D vendor/blueimp-md5.js\uFF0C\u65E0\u6CD5\u8BA1\u7B97 MD5");
    };
  }
  function generateSignature2(params, secretValue) {
    var keys = Object.keys(params || {}).sort();
    var pairs = [];
    keys.forEach(function(key) {
      var val = params[key];
      pairs.push(key + "=" + (val == null ? "" : String(val)));
    });
    pairs.push("apiSecret=" + (secretValue == null ? "" : String(secretValue)));
    return md52(pairs.join("&")).toUpperCase();
  }
  function clone2(value) {
    return value === void 0 ? void 0 : JSON.parse(JSON.stringify(value));
  }
  function isPlainObject2(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  function esc(s) {
    if (s == null) return "";
    if (typeof document !== "undefined" && document.createElement) {
      var d = document.createElement("div");
      d.textContent = s;
      return d.innerHTML;
    }
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fmt(ms) {
    if (!isFinite(ms)) return "-";
    return ms >= 1e3 ? (ms / 1e3).toFixed(2) + " s" : ms.toFixed(2) + "ms";
  }
  function safeJson(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }
  function sanitizeSensitive2(value, key) {
    return value;
  }
  function tokenize(valuePath) {
    return String(valuePath || "").match(/[^.\[\]]+|\[(?:-?\d+|".*?"|'.*?')\]/g) || [];
  }
  function normalizeToken(token) {
    if (token.charAt(0) === "[" && token.charAt(token.length - 1) === "]") {
      return token.substring(1, token.length - 1).replace(/^['"]|['"]$/g, "");
    }
    return token;
  }
  function getByPath2(source, valuePath) {
    if (!valuePath) return source;
    var cursor = source;
    tokenize(valuePath).forEach(function(token) {
      if (cursor === void 0 || cursor === null) {
        cursor = void 0;
        return;
      }
      cursor = cursor[normalizeToken(token)];
    });
    return cursor;
  }
  function evalExpr(expr, runtime) {
    var text = String(expr || "").trim();
    if (!text) return "";
    if (text === "vars") return runtime.vars;
    if (text === "lastResponse") return runtime.lastResponse;
    if (text === "lastResponseBody") return runtime.lastResponseBody;
    if (text.indexOf("vars.") === 0) return getByPath2(runtime.vars, text.substring(5));
    if (text.indexOf("lastResponse.") === 0) return getByPath2(runtime.lastResponse, text.substring(13));
    if (text.indexOf("lastResponseBody.") === 0) return getByPath2(runtime.lastResponseBody, text.substring(17));
    if (Object.prototype.hasOwnProperty.call(runtime.vars, text)) return runtime.vars[text];
    return getByPath2(runtime.vars, text);
  }
  function resolveString2(value, runtime) {
    if (typeof value !== "string") return value;
    var current = value;
    var seen = /* @__PURE__ */ new Set();
    for (var depth = 0; depth < 10; depth += 1) {
      if (seen.has(current)) return current;
      seen.add(current);
      var whole = current.match(/^\s*\{\{\s*(.+?)\s*\}\}\s*$/);
      if (whole) {
        var direct = evalExpr(whole[1], runtime);
        if (direct === void 0) return "";
        if (typeof direct !== "string") return direct;
        current = direct;
        continue;
      }
      var replaced = current.replace(/\{\{\s*(.+?)\s*\}\}/g, function(_, innerExpr) {
        var resolved = evalExpr(innerExpr, runtime);
        if (resolved === void 0 || resolved === null) return "";
        return typeof resolved === "object" ? JSON.stringify(resolved) : String(resolved);
      });
      if (replaced === current || !/\{\{\s*.+?\s*\}\}/.test(replaced)) return replaced;
      current = replaced;
    }
    return current;
  }
  function resolve2(value, runtime) {
    if (Array.isArray(value)) {
      return value.map(function(item) {
        return resolve2(item, runtime);
      });
    }
    if (isPlainObject2(value)) {
      var result = {};
      Object.keys(value).forEach(function(key) {
        result[key] = resolve2(value[key], runtime);
      });
      return result;
    }
    return resolveString2(value, runtime);
  }
  function headerValue2(headers, name) {
    var target = String(name || "").toLowerCase();
    var keys = Object.keys(headers || {});
    for (var i = 0; i < keys.length; i += 1) {
      if (keys[i].toLowerCase() === target) return headers[keys[i]];
    }
    return void 0;
  }
  function hasHeader2(headers, name) {
    return headerValue2(headers, name) !== void 0;
  }
  function headersToObject2(headers) {
    var result = {};
    headers.forEach(function(value, key) {
      result[key] = value;
    });
    return result;
  }
  function joinUrl2(baseUrl, requestPath) {
    if (/^https?:\/\//i.test(requestPath || "")) return requestPath;
    var base = String(baseUrl || "").replace(/\/+$/, "");
    var tail = String(requestPath || "");
    if (!base) return tail;
    return base + "/" + tail.replace(/^\/+/, "");
  }
  function buildUrl2(path7, params, runtime) {
    var rawPath = resolveString2(path7 || "", runtime);
    if (!params || !isPlainObject2(params)) return rawPath;
    var resolvedParams = resolve2(params, runtime);
    var queryPairs = [];
    Object.keys(resolvedParams).forEach(function(key) {
      var val = resolvedParams[key];
      if (val !== void 0 && val !== null) {
        queryPairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(val)));
      }
    });
    if (!queryPairs.length) return rawPath;
    var separator = rawPath.indexOf("?") >= 0 ? "&" : "?";
    return rawPath + separator + queryPairs.join("&");
  }
  function parseBody2(text, contentType2) {
    if (!text) return null;
    var bodyText = String(text);
    var type = String(contentType2 || "").toLowerCase();
    if (type.indexOf("json") >= 0 || /^[\[{]/.test(bodyText.trim())) {
      try {
        return JSON.parse(bodyText);
      } catch (e) {
        return bodyText;
      }
    }
    return bodyText;
  }
  var ASSERTION_OPERATORS2 = ["exists", "equals", "includes", "matches", "oneOf", "notEquals", "gt", "gte", "lt", "lte"];
  var ASSERTION_META_KEYS2 = ["name", "path", "from", "target", "header", "implicit"];
  function validateAssertion2(def, context) {
    var where = context || "";
    var prefix = where ? where + "\u65AD\u8A00\u65E0\u6548" : "\u65AD\u8A00\u65E0\u6548";
    if (!isPlainObject2(def)) throw new TypeError(prefix + ": \u65AD\u8A00\u5FC5\u987B\u662F\u5BF9\u8C61");
    var keys = Object.keys(def);
    var operators = keys.filter(function(key) {
      return ASSERTION_OPERATORS2.indexOf(key) >= 0;
    });
    var unknown = keys.filter(function(key) {
      return ASSERTION_OPERATORS2.indexOf(key) < 0 && ASSERTION_META_KEYS2.indexOf(key) < 0;
    });
    if (unknown.length) {
      throw new TypeError(prefix + ": \u5305\u542B\u672A\u77E5\u952E " + unknown.map(function(key) {
        return '"' + key + '"';
      }).join(", ") + "\uFF0C\u5141\u8BB8\u7684\u5143\u6570\u636E\u952E\u4E3A " + ASSERTION_META_KEYS2.join("/") + "\uFF0C\u64CD\u4F5C\u7B26\u4E3A " + ASSERTION_OPERATORS2.join("/"));
    }
    if (!operators.length) {
      throw new TypeError(prefix + ": \u5FC5\u987B\u81F3\u5C11\u5305\u542B\u4E00\u4E2A\u64CD\u4F5C\u7B26\uFF08" + ASSERTION_OPERATORS2.join("/") + "\uFF09");
    }
    return def;
  }
  function assertionActual2(def, response, runtime) {
    if (def.target === "status") return response.status;
    if (def.header) return headerValue2(response.headers, def.header);
    if (def.from === "vars") return def.path ? getByPath2(runtime.vars, def.path) : runtime.vars;
    if (def.from === "headers") return def.path ? getByPath2(response.headers, def.path) : response.headers;
    if (def.from === "bodyText") return response.bodyText;
    return def.path ? getByPath2(response.body, def.path) : response.body;
  }
  function evaluateAssertion2(def, response, runtime, context) {
    validateAssertion2(def, context);
    var actual = assertionActual2(def, response, runtime);
    var expected;
    var passed = true;
    if (def.exists !== void 0) {
      expected = !!def.exists;
      passed = passed && (expected ? actual !== void 0 && actual !== null && actual !== "" : actual === void 0 || actual === null || actual === "");
    }
    if (def.equals !== void 0) {
      expected = resolve2(clone2(def.equals), runtime);
      passed = passed && deepEqual(actual, expected);
    }
    if (def.notEquals !== void 0) {
      expected = resolve2(clone2(def.notEquals), runtime);
      passed = passed && !deepEqual(actual, expected);
    }
    if (def.includes !== void 0) {
      expected = resolve2(def.includes, runtime);
      passed = passed && (Array.isArray(actual) ? actual.some(function(item) {
        return deepEqual(item, expected);
      }) : String(actual == null ? "" : actual).indexOf(String(expected)) >= 0);
    }
    if (def.matches !== void 0) {
      expected = resolve2(def.matches, runtime);
      if (!(def.implicit === true && typeof actual !== "number")) {
        try {
          passed = passed && new RegExp(String(expected)).test(String(actual == null ? "" : actual));
        } catch (e) {
          passed = false;
        }
      }
    }
    if (def.oneOf !== void 0) {
      expected = resolve2(clone2(def.oneOf), runtime);
      passed = passed && Array.isArray(expected) && expected.some(function(item) {
        return deepEqual(actual, item);
      });
    }
    ["gt", "gte", "lt", "lte"].forEach(function(op) {
      if (!Object.prototype.hasOwnProperty.call(def, op)) return;
      expected = resolve2(def[op], runtime);
      var comparable = typeof actual === "number" && Number.isFinite(actual) && typeof expected === "number" && Number.isFinite(expected);
      if (!comparable) {
        passed = false;
        return;
      }
      if (op === "gt") passed = passed && actual > expected;
      else if (op === "gte") passed = passed && actual >= expected;
      else if (op === "lt") passed = passed && actual < expected;
      else passed = passed && actual <= expected;
    });
    return {
      name: def.name || def.path || "\u65AD\u8A00",
      passed: !!passed,
      actual,
      expected
    };
  }
  function buildAssertions2(step, response, runtime, context) {
    var defs = Array.isArray(step.assertions) ? step.assertions.slice() : [];
    if (step.status !== void 0 && !defs.some(function(item) {
      return item && item.target === "status";
    })) {
      defs.unshift({ name: "\u8FD4\u56DE HTTP " + step.status, target: "status", equals: step.status });
    } else if (step.status === void 0 && defs.length === 0) {
      defs.push({ name: "\u8FD4\u56DE HTTP 2xx", target: "status", matches: "^2\\d\\d$", implicit: true });
    }
    return defs.map(function(def, index) {
      var stepContext = context || {};
      return evaluateAssertion2(def, response, runtime, {
        stepName: stepContext.stepName,
        assertionNo: index + 1
      });
    });
  }
  var RESERVED_VARS2 = ["runId", "runNo"];
  function assertNotReservedVar2(name, label) {
    if (RESERVED_VARS2.indexOf(name) >= 0) {
      throw new Error((label || "\u53D8\u91CF") + ' "' + name + '" \u662F\u8FD0\u884C\u65F6\u81EA\u52A8\u751F\u6210\u7684\u4FDD\u7559\u53D8\u91CF\uFF0C\u7981\u6B62\u58F0\u660E\u6216\u8986\u76D6');
    }
  }
  function assertNoReservedVars2(source, label) {
    Object.keys(source || {}).forEach(function(name) {
      assertNotReservedVar2(name, label);
    });
  }
  function applyExtract2(step, response, runtime) {
    var warnings = [];
    var failures = [];
    (step.extract || []).forEach(function(item) {
      if (!item || !item.name) return;
      assertNotReservedVar2(item.name, "extract \u53D8\u91CF");
      var source;
      if (item.target === "status") {
        source = response.status;
      } else if (item.header) {
        source = headerValue2(response.headers, item.header);
      } else if (item.from === "headers") {
        source = response.headers;
      } else if (item.from === "bodyText") {
        source = response.bodyText;
      } else if (item.from === "response") {
        source = response;
      } else {
        source = response.body;
      }
      var value = item.path ? getByPath2(source, item.path) : source;
      if (value === void 0) {
        if (item.required === true) {
          failures.push({
            name: "\u63D0\u53D6 " + item.name + "\uFF08\u8DEF\u5F84\u4E0D\u5B58\u5728\uFF09",
            passed: false,
            actual: void 0,
            expected: "\u8DEF\u5F84 " + (item.path || "(\u6574\u4E2A\u54CD\u5E94)") + " \u5B58\u5728"
          });
        } else {
          warnings.push("\u63D0\u53D6\u53D8\u91CF " + item.name + "\uFF1A\u8DEF\u5F84 " + (item.path || "(\u6574\u4E2A\u54CD\u5E94)") + " \u4E0D\u5B58\u5728\uFF0C\u53D8\u91CF\u503C\u4E3A undefined\uFF08required \u672A\u5F00\u542F\uFF0C\u4E0D\u5F71\u54CD\u6267\u884C\uFF09");
        }
      }
      runtime.vars[item.name] = value;
    });
    return { warnings, failures };
  }
  return {
    md5: md52,
    generateSignature: generateSignature2,
    clone: clone2,
    isPlainObject: isPlainObject2,
    deepEqual,
    tokenize,
    normalizeToken,
    getByPath: getByPath2,
    evalExpr,
    resolveString: resolveString2,
    resolve: resolve2,
    headerValue: headerValue2,
    hasHeader: hasHeader2,
    headersToObject: headersToObject2,
    joinUrl: joinUrl2,
    buildUrl: buildUrl2,
    parseBody: parseBody2,
    assertionActual: assertionActual2,
    validateAssertion: validateAssertion2,
    evaluateAssertion: evaluateAssertion2,
    buildAssertions: buildAssertions2,
    applyExtract: applyExtract2,
    // 暴露名单供一致性测试：browser legacy 与 Node contract 的操作符/元数据键/保留变量
    // 必须完全一致，禁止单端新增
    ASSERTION_OPERATORS: ASSERTION_OPERATORS2,
    ASSERTION_META_KEYS: ASSERTION_META_KEYS2,
    RESERVED_VARS: RESERVED_VARS2,
    assertNotReservedVar: assertNotReservedVar2,
    assertNoReservedVars: assertNoReservedVars2,
    esc,
    fmt,
    safeJson,
    sanitizeSensitive: sanitizeSensitive2
  };
}(typeof window !== "undefined" ? window : globalThis);
var core_default = legacyCore;

// src/browser/legacy/ui-style.js
var legacyStyle = function() {
  "use strict";
  function getWorkspaceStyleBlock() {
    return `
            :root {
                --workspace-bg: #f8fafc;
                --workspace-surface: #ffffff;
                --workspace-text: #1e293b;
                --workspace-muted: #64748b;
                --workspace-line: #e2e8f0;
                --workspace-hover: #f8fafc;
                --workspace-selected: #f1f5f9;
                --workspace-selected-line: #cbd5e1;
                --workspace-primary: #0f172a;
                --workspace-danger: #e11d48;
                --workspace-code: #1e293b;
            }

            #scenario-test-root { height: 100%; }

            #scenario-test-root {
                min-width: 1024px;
                overflow: hidden;
                background: var(--workspace-bg) !important;
                color: var(--workspace-text) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
            }

            #scenario-test-root > header {
                min-height: 46px;
                padding: 7px 16px !important;
                background: var(--workspace-surface) !important;
                border-color: var(--workspace-line) !important;
                box-shadow: 0 1px 3px rgba(15, 23, 42, .05) !important;
            }

            #scenario-test-root > header #envNameLabel { color: var(--workspace-muted) !important; }
            #scenario-test-root > header #scenarioTitle { color: var(--workspace-text) !important; font-size: 13px !important; }

            #scenario-test-root.theme-claude-code {
                --workspace-bg: #f1ebe3;
                --workspace-surface: #fffcf8;
                --workspace-text: #302b27;
                --workspace-muted: #786d63;
                --workspace-line: #e5d1c0;
                --workspace-hover: #f8e9dc;
                --workspace-selected: #f0dac7;
                --workspace-selected-line: #d9af8d;
                --workspace-primary: #285a4c;
                --workspace-danger: #b94c4a;
                --workspace-code: #2d2925;
            }

            #scenario-test-root.theme-claude-code > header {
                background: #fcf3ea !important;
                box-shadow: 0 1px 5px rgba(91, 67, 49, .08) !important;
            }

            .scenario-workspace { height: calc(100vh - 46px); padding: 8px !important; }
            .scenario-grid { height: 100%; gap: 8px !important; margin: 0 !important; }
            .scenario-pane {
                min-height: 0;
                background: var(--workspace-surface) !important;
                border: 1px solid var(--workspace-line) !important;
                border-radius: 5px !important;
                box-shadow: 0 1px 5px rgba(15, 23, 42, .04) !important;
            }
            .scenario-pane > div:first-child,
            #scenarioList,
            #stepsList,
            #reportPanel { background: var(--workspace-surface) !important; }

            .scenario-header-actions { display: flex; align-items: center; gap: 6px !important; flex-wrap: nowrap !important; }
            .scenario-header-select,
            .scenario-header-step,
            .scenario-header-button {
                height: 32px;
                border: 1px solid var(--workspace-line);
                border-radius: 5px;
                background: var(--workspace-surface);
                box-shadow: none !important;
            }
            .scenario-header-select { display: flex; align-items: center; padding: 0 8px; color: var(--workspace-muted); transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease; }
            .scenario-header-select__label { font-size: 11px; font-weight: 700; white-space: nowrap; }
            .scenario-header-select select { min-width: 78px; min-height: 30px; padding-left: 4px !important; color: var(--workspace-text) !important; font-size: 12px !important; font-weight: 600; }
            .scenario-header-select select option { background: var(--workspace-surface); color: var(--workspace-text); }
            .scenario-header-select:focus-within { border-color: var(--workspace-primary); box-shadow: 0 0 0 3px rgba(40, 90, 76, .12) !important; }
            .scenario-header-select__arrow { position: absolute; top: 9px; right: 7px; width: 12px; height: 12px; color: var(--workspace-muted); pointer-events: none; }
            .scenario-header-step { display: flex; align-items: stretch; overflow: hidden; }
            .scenario-header-button { display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 0 11px; font-size: 12px !important; font-weight: 700; color: var(--workspace-text); }
            .scenario-header-button--secondary { border: 0; border-radius: 0; }
            .scenario-header-step__arrow { display: inline-flex; align-items: center; justify-content: center; width: 24px; border-left: 1px solid var(--workspace-line); color: var(--workspace-muted); }
            .scenario-header-button--primary { border-color: var(--workspace-primary) !important; background: var(--workspace-primary) !important; color: #ffffff !important; }
            .scenario-header-button--primary:disabled { cursor: wait; opacity: .78; }
            .scenario-header-button--running { background: #334155 !important; }
            .scenario-header-button--config { padding: 0 9px; }
            .scenario-header-text-action { height: 32px; padding: 0 5px; border: 0; background: transparent; color: var(--workspace-muted); font-size: 12px !important; font-weight: 700; }
            .scenario-header-text-action--danger { color: var(--workspace-danger); }
            .scenario-header-text-action:disabled { opacity: .42; cursor: not-allowed; }
            .scenario-header-actions button:hover:not(:disabled), .scenario-header-select:hover { background: var(--workspace-hover); }
            .scenario-header-button--primary:hover:not(:disabled) { background: #1c453a !important; }
            #scenario-test-root.theme-claude-code .scenario-header-select { background: #fff4e9; }
            #scenario-test-root.theme-claude-code .scenario-header-button--config { background: #fff4e9; border-color: #dfc9b6; }

            .scenario-pane--scenarios > div:first-child { padding: 14px 12px !important; border-color: #f0ece6 !important; }
            .scenario-pane--scenarios > div:first-child > div:first-child { font-size: 15px !important; }
            .scenario-pane--scenarios > div:first-child > div:nth-child(2) { font-size: 12px !important; }
            #scenarioSearchInput { margin-top: 10px !important; padding: 8px 10px !important; border-color: var(--workspace-line) !important; border-radius: 3px !important; font-size: 13px !important; }
            #scenarioList { padding: 7px !important; gap: 4px !important; }
            #scenarioList > div { border-radius: 4px !important; border-color: transparent !important; box-shadow: none !important; }
            #scenarioList > div:hover { background: var(--workspace-hover) !important; }
            #scenarioList > div.bg-slate-100 { background: var(--workspace-selected) !important; border-color: var(--workspace-selected-line) !important; }
            #scenarioList > div:has([data-scenario-file]) { min-height: 60px; }
            #scenarioList [data-scenario-file] { padding: 10px 11px !important; }
            #scenarioList [data-scenario-file] > div:first-child { font-size: 13px !important; font-weight: 600 !important; line-height: 1.35 !important; }
            #scenarioList [data-scenario-file] > div:last-child { margin-top: 5px !important; font-size: 11px !important; line-height: 1.3 !important; }
            #scenarioList .scenario-pin-control { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; align-self: center; width: 26px; height: 26px; margin-right: 8px; border: 0; border-radius: 3px; background: transparent; color: #94a3b8; opacity: 0; transition: background-color .15s ease, color .15s ease, opacity .15s ease; }
            #scenarioList .scenario-pin-control svg { width: 14px; height: 14px; }
            #scenarioList > div:hover .scenario-pin-control, #scenarioList .scenario-pin-control--active { opacity: 1; }
            #scenarioList .scenario-pin-control:hover { background: #f1f5f9; color: #475569; }
            #scenarioList .scenario-pin-control--active { color: #0f766e; }
            #scenarioList .scenario-pin-control--active:hover { background: #f0fdfa; color: #0f766e; }

            .circle-chart {
                width: 96px;
                height: 96px;
                flex: 0 0 96px;
                border-radius: 9999px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 0 1px 3px rgba(15, 23, 42, .08);
            }
            .circle-inner {
                width: 70px;
                height: 70px;
                border-radius: 9999px;
                background: var(--workspace-surface);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 2px rgba(15, 23, 42, .06);
            }

            .scenario-pane--steps #statsPanel { min-height: 57px; padding: 13px 14px !important; border-color: #f0ece6 !important; }
            .scenario-pane--steps #statsPanel > div { font-size: 14px !important; padding: 0 !important; }
            .scenario-pane--steps #filterBar { min-height: 38px; padding: 6px 14px !important; background: var(--workspace-surface) !important; border-color: #f0ece6 !important; }
            .scenario-pane--steps #filterBar > div { font-size: 12px !important; }
            #stepsList > li { border-color: #f0ece6 !important; }
            #stepsList > li:hover { background: var(--workspace-hover) !important; }
            #stepsList > li > div:first-child { min-height: 42px; padding: 8px 14px !important; }
            #stepsList .w-5.h-5 { width: 20px !important; height: 20px !important; font-size: 11px !important; }
            #stepsList .text-sm { font-size: 13px !important; }
            #stepsList .text-\\[10px\\], #stepsList .text-\\[11px\\], #stepsList .text-\\[12px\\] { font-size: 11px !important; }
            #stepsList [data-adhoc-step] { border-radius: 3px !important; padding: 4px 8px !important; font-size: 11px !important; box-shadow: none !important; }
            .step-run-actions { display: inline-flex; align-items: center; overflow: hidden; border: 1px solid #cbd5e1; border-radius: 3px; background: #ffffff; }
            .step-run-actions button { padding: 4px 7px; border: 0; border-right: 1px solid #e2e8f0; background: transparent; color: #475569; font-size: 11px; font-weight: 700; line-height: 1; }
            .step-run-actions button:last-child { border-right: 0; color: #0f766e; }
            .step-run-actions button:hover { background: #f8fafc; }
            .details-panel { max-height: 0; opacity: 0; overflow: hidden; transition: max-height .25s ease, opacity .2s ease, padding .25s ease; }
            .details-panel.open { max-height: 2000px; opacity: 1; padding-top: 1rem; padding-bottom: 1rem; overflow-y: auto; }
            #stepsList .details-panel { background: var(--workspace-hover) !important; border-color: var(--workspace-line) !important; }

            pre { background: var(--workspace-code) !important; border: 1px solid #334155 !important; border-radius: 5px !important; color: #e2e8f0 !important; font-family: "SFMono-Regular", Consolas, monospace; }
            .font-mono { font-family: "SFMono-Regular", Consolas, monospace; }

            .scenario-pane--report > div:first-child { min-height: 57px; padding: 13px 14px !important; border-color: #f0ece6 !important; }
            .scenario-pane--report > div:first-child .text-sm { font-size: 14px !important; }
            .scenario-pane--report > div:first-child .text-\\[10px\\] { font-size: 11px !important; }
            .scenario-pane--report > div:first-child button { min-height: 26px; padding: 4px 8px !important; border-radius: 3px !important; font-size: 11px !important; }
            #reportPanel { display: block; padding: 14px !important; color: var(--workspace-muted) !important; }
            .report-content { display: flex; flex-direction: column; gap: 12px; width: 100%; }
            .report-overview { padding: 14px; border: 1px solid var(--workspace-line); border-radius: 6px; background: linear-gradient(135deg, #f8fafc, #ffffff); }
            .report-overview__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
            .report-overview__eyebrow { color: #94a3b8; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
            .report-overview__title { margin-top: 4px; overflow: hidden; color: #1e293b; font-size: 14px; font-weight: 700; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
            .report-overview__meta { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 12px; }
            .report-overview__meta span { padding: 3px 6px; border-radius: 3px; background: #ffffff; border: 1px solid #e2e8f0; color: #64748b; font-size: 10px; font-weight: 600; }
            .report-status { flex: 0 0 auto; padding: 4px 7px; border-radius: 999px; font-size: 10px; font-weight: 700; }
            .report-status--passed { background: #ecfdf5; color: #047857; }
            .report-status--failed { background: #fff1f2; color: #be123c; }
            .report-status--running { background: #eff6ff; color: #2563eb; }
            .report-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: hidden; border: 1px solid var(--workspace-line); border-radius: 6px; background: #ffffff; }
            .report-metric { min-width: 0; padding: 11px 10px; border-right: 1px solid var(--workspace-line); }
            .report-metric:last-child { border-right: 0; }
            .report-metric__label { display: block; color: #94a3b8; font-size: 10px; font-weight: 600; }
            .report-metric__value { display: block; margin-top: 4px; overflow: hidden; color: #334155; font-size: 16px; font-weight: 700; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; }
            .report-metric__value--passed { color: #059669; }
            .report-metric__value--failed { color: #e11d48; }
            .report-metric__duration { color: #475569; font-size: 13px; }
            .report-progress { padding: 0 2px; }
            .report-progress__labels { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; color: #94a3b8; font-size: 10px; font-weight: 600; }
            .report-progress__labels strong { color: #475569; font-weight: 700; }
            .report-progress__track { height: 5px; overflow: hidden; border-radius: 999px; background: #e2e8f0; }
            .report-progress__track span { display: block; height: 100%; border-radius: inherit; background: #0f766e; transition: width .2s ease; }
            .report-progress__track--failed span { background: #e11d48; }
            .report-steps { border-top: 1px solid var(--workspace-line); padding-top: 12px; }
            .report-steps__title { margin-bottom: 8px; color: #475569; font-size: 11px; font-weight: 700; }
            .report-healthy { padding: 12px; border: 1px solid #d1fae5; border-radius: 6px; background: #f0fdf4; }
            .report-healthy__title { color: #047857; font-size: 12px; font-weight: 700; }
            .report-healthy__hint { margin-top: 5px; color: #64748b; font-size: 10px; line-height: 1.5; }
            .report-step { position: relative; display: flex; gap: 9px; padding: 9px 0; border-bottom: 1px solid #f1f5f9; }
            .report-step:last-child { border-bottom: 0; }
            .report-step__marker { display: flex; flex: 0 0 18px; align-items: center; justify-content: center; width: 18px; height: 18px; margin-top: 1px; border-radius: 999px; font-size: 11px; font-weight: 800; }
            .report-step--passed .report-step__marker { background: #ecfdf5; color: #059669; }
            .report-step--failed .report-step__marker { background: #fff1f2; color: #e11d48; }
            .report-step__content { min-width: 0; flex: 1; }
            .report-step__heading { display: flex; min-width: 0; align-items: baseline; gap: 5px; }
            .report-step__number { flex: 0 0 auto; color: #94a3b8; font-size: 10px; font-weight: 600; }
            .report-step__name { overflow: hidden; color: #334155; font-size: 11px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
            .report-step__request { display: flex; min-width: 0; align-items: center; gap: 5px; margin-top: 5px; }
            .report-method { flex: 0 0 auto; font-family: "SFMono-Regular", Consolas, monospace; font-size: 9px; font-weight: 800; }
            .report-method--get { color: #059669; }
            .report-method--post { color: #d97706; }
            .report-method--put { color: #a16207; }
            .report-method--delete { color: #e11d48; }
            .report-method--patch { color: #7c3aed; }
            .report-step__path { overflow: hidden; color: #64748b; font-family: "SFMono-Regular", Consolas, monospace; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
            .report-step__issue { margin-top: 5px; color: #e11d48; font-size: 10px; line-height: 1.45; }
            .report-step__response { margin-top: 9px; }
            .report-step__response summary { cursor: pointer; color: #0f766e; font-size: 10px; font-weight: 700; }
            .report-step__response-section { margin-top: 8px; color: #94a3b8; font-size: 10px; font-weight: 600; }
            .report-step__response pre { max-height: 280px; margin-top: 4px; overflow: auto; padding: 9px; background: #1e293b; border: 0; border-radius: 4px; color: #e2e8f0; font-size: 10px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
            .report-step__result { display: flex; flex: 0 0 auto; flex-direction: column; align-items: flex-end; gap: 4px; padding-top: 1px; }
            .report-step__code { color: #64748b; font-family: "SFMono-Regular", Consolas, monospace; font-size: 10px; font-weight: 700; }
            .report-step__duration { color: #94a3b8; font-family: "SFMono-Regular", Consolas, monospace; font-size: 10px; }
            .report-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 240px; text-align: center; color: #64748b; }
            .report-empty svg { display: block; width: 68px; height: 68px; margin: 0 auto 14px; color: #64748b; }
            .report-empty__title { color: #334155; font-size: 14px; font-weight: 700; }
            .report-empty__hint { margin-top: 8px; font-size: 12px; }

            #configModal > div { background: #1e293b !important; border-color: #334155 !important; border-radius: 5px !important; }
            #configModal input, #configModal select { border-radius: 3px !important; }
            #adhocModal > div { background: var(--workspace-surface) !important; border: 1px solid var(--workspace-line); border-radius: 5px !important; }
            .scenario-step-loading { display: none; position: fixed; z-index: 40; top: 54px; right: 16px; pointer-events: none; }
            .scenario-step-loading--visible { display: block; }
            .scenario-step-loading__content { display: flex; align-items: center; gap: 10px; min-width: 240px; max-width: 420px; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 5px; background: #ffffff; box-shadow: 0 8px 20px rgba(15, 23, 42, .16); }
            .scenario-step-loading__spinner { width: 18px; height: 18px; border: 2px solid #cbd5e1; border-top-color: #0f766e; border-radius: 50%; animation: scenario-step-loading-spin .75s linear infinite; }
            .scenario-step-loading__title { color: #1e293b; font-size: 12px; font-weight: 700; }
            .scenario-step-loading__text { margin-top: 2px; overflow: hidden; color: #64748b; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
            @keyframes scenario-step-loading-spin { to { transform: rotate(360deg); } }

            ::-webkit-scrollbar { width: 7px; height: 7px; }
            ::-webkit-scrollbar-track { background: #f1f5f9; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `;
  }
  function getClaudeStyleBlock() {
    return "";
  }
  function injectStyles() {
    var existing = document.getElementById("scenarioDynamicStyles");
    if (existing) return;
    var style = document.createElement("style");
    style.id = "scenarioDynamicStyles";
    style.textContent = getWorkspaceStyleBlock();
    document.head.appendChild(style);
  }
  function applyTheme(theme) {
    var selectedTheme = theme === "claude-code" ? "claude-code" : "default";
    var root = document.getElementById("scenario-test-root");
    if (root) root.classList.toggle("theme-claude-code", selectedTheme === "claude-code");
    document.body.classList.toggle("theme-claude-code", selectedTheme === "claude-code");
    var select = document.getElementById("themeSelect");
    if (select) select.value = selectedTheme;
    injectStyles();
  }
  return {
    getClaudeStyleBlock,
    injectStyles,
    applyTheme
  };
}();
var ui_style_default = legacyStyle;

// src/browser/legacy/ui-view.js
var legacyView = function() {
  "use strict";
  var core = core_default || {};
  var esc = core.esc || function(s) {
    return s == null ? "" : String(s);
  };
  var fmt = core.fmt || function(ms) {
    return String(ms);
  };
  var safeJson = core.safeJson || function(v) {
    return JSON.stringify(v, null, 2);
  };
  function stringify(value) {
    if (value === void 0 || value === null || value === "") return "";
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  }
  function formatReportPayload(value) {
    var text = stringify(value);
    return text || "(\u7A7A)";
  }
  function setRunState(type, text) {
    var node = document.getElementById("runState");
    if (!node) return;
    node.className = "sr-only";
    node.setAttribute("aria-live", "polite");
    node.textContent = text;
  }
  function setStepLoading(visible, text) {
    var modal = document.getElementById("stepLoadingModal");
    if (!modal) return;
    var message = document.getElementById("stepLoadingText");
    if (message && text) message.textContent = text;
    modal.classList.toggle("scenario-step-loading--visible", Boolean(visible));
    modal.setAttribute("aria-hidden", visible ? "false" : "true");
  }
  function buildSkeleton(mount) {
    (mount || document.body).innerHTML = `
        <header class="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap gap-3 justify-between items-center sticky top-0 z-10 shadow-sm">
            <div class="flex items-center gap-2 min-w-0">
                <span id="envNameLabel" class="text-[10px] font-medium text-slate-400 whitespace-nowrap"></span>
                <span class="text-slate-300" aria-hidden="true">\u203A</span>
                <h1 id="scenarioTitle" class="text-xs font-bold text-slate-800 truncate max-w-[280px] sm:max-w-xl">\u672A\u52A0\u8F7D\u573A\u666F</h1>
            </div>
            <div class="scenario-header-actions flex items-center">
                <div class="scenario-header-select relative">
                    <span class="scenario-header-select__label">\u73AF\u5883\uFF1A</span>
                    <select id="environmentSelect" aria-label="\u5FEB\u901F\u5207\u6362\u73AF\u5883" class="appearance-none bg-transparent py-1 pr-5 text-[10px] font-medium text-slate-700 outline-none cursor-pointer"></select>
                    <svg class="scenario-header-select__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div class="scenario-header-select relative">
                    <span class="scenario-header-select__label">\u98CE\u683C\uFF1A</span>
                    <select id="themeSelect" aria-label="\u5207\u6362\u754C\u9762\u98CE\u683C" class="appearance-none bg-transparent py-1 pl-2 pr-5 text-[10px] font-medium text-slate-700 outline-none cursor-pointer">
                        <option value="default">\u672C\u5730\u5F00\u53D1</option>
                        <option value="claude-code">\u6696\u8C03\u98CE\u683C</option>
                    </select>
                    <svg class="scenario-header-select__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div class="scenario-header-step relative">
                    <button id="stepBtn" class="scenario-header-button scenario-header-button--secondary">\u6267\u884C\u4E0B\u4E00\u6B65</button>
                    <span class="scenario-header-step__arrow" aria-hidden="true"><svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></span>
                </div>
                <button id="runBtn" class="scenario-header-button scenario-header-button--primary">\u6267\u884C\u5168\u90E8</button>
                <button id="cancelBtn" disabled class="scenario-header-text-action scenario-header-text-action--danger">\u505C\u6B62</button>
                <button id="resetBtn" class="scenario-header-text-action">\u6E05\u9664\u884C</button>
                <button id="configToggleBtn" class="scenario-header-button scenario-header-button--config">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>\u914D\u7F6E\u53C2\u6570</span>
                </button>
                <span id="runState" aria-live="polite" class="sr-only">\u5F85\u6267\u884C</span>
            </div>
        </header>
        <main class="scenario-workspace max-w-full mx-auto px-2 py-2">
            <datalist id="globalHeaderNameList">
                <option value="Accept"></option>
                <option value="Accept-Charset"></option>
                <option value="Accept-Encoding"></option>
                <option value="Accept-Language"></option>
                <option value="Authorization"></option>
                <option value="Cache-Control"></option>
                <option value="Connection"></option>
                <option value="Content-Encoding"></option>
                <option value="Content-Length"></option>
                <option value="Content-Type"></option>
                <option value="Cookie"></option>
                <option value="Host"></option>
                <option value="Origin"></option>
                <option value="Referer"></option>
                <option value="User-Agent"></option>
                <option value="X-Client-Id"></option>
                <option value="X-Project"></option>
                <option value="X-Request-Id"></option>
                <option value="X-Token"></option>
            </datalist>
            <div class="scenario-grid grid grid-cols-1 xl:grid-cols-[minmax(164px,1fr)_minmax(500px,3.18fr)_minmax(280px,1.75fr)] gap-2 mb-2">
                <aside class="scenario-pane scenario-pane--scenarios bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden xl:max-h-[calc(100vh-52px)] flex flex-col">
                    <div class="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                        <div class="text-sm font-bold text-slate-800">\u573A\u666F\u5217\u8868</div>
                        <div class="text-[10px] text-slate-400 mt-0.5">\u5207\u6362\u4EC5\u52A0\u8F7D\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u6267\u884C</div>
                        <input id="scenarioSearchInput" type="search" placeholder="\u641C\u7D22\u573A\u666F\u540D\u79F0\u6216\u8DEF\u5F84" class="mt-3 w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                    </div>
                    <div id="scenarioList" class="p-2 space-y-1 overflow-y-auto flex-1"></div>
                </aside>
                <div class="scenario-pane scenario-pane--steps bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden xl:max-h-[calc(100vh-52px)]">
                    <div id="statsPanel" class="p-4 flex flex-wrap justify-between items-center border-b border-slate-100 bg-white flex-shrink-0">
                        <div class="text-sm text-slate-500">\u573A\u666F\u672A\u52A0\u8F7D\u6216\u672A\u6267\u884C</div>
                    </div>
                    <div id="filterBar" class="flex items-center justify-between bg-slate-50/50 px-3 py-2 border-b border-slate-100 flex-shrink-0">
                        <div class="text-xs text-slate-400 py-1">\u7B49\u5F85\u52A0\u8F7D...</div>
                    </div>
                    <ul id="stepsList" class="divide-y divide-slate-100 bg-white flex-1 overflow-y-auto"></ul>
                </div>
                <div class="scenario-pane scenario-pane--report bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden xl:max-h-[calc(100vh-52px)]">
                    <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                        <div>
                            <div class="text-sm font-bold text-slate-800 flex items-center space-x-1.5"><svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>AI \u6D4B\u8BD5\u62A5\u544A</span></div>
                            <div class="text-[10px] text-slate-400 mt-0.5">\u7ED3\u6784\u5316\u8F93\u51FA\uFF0C\u9002\u5408 AI \u667A\u80FD\u5206\u6790</div>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <button id="copyReportMarkdownBtn" class="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>\u590D\u5236 MD</button>
                            <button id="copyReportJsonBtn" class="px-2.5 py-1 rounded bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-bold hover:bg-slate-100 transition-colors flex items-center justify-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>\u590D\u5236 JSON</button>
                        </div>
                    </div>
                    <div id="reportPanel" class="p-4 text-sm text-slate-500 overflow-y-auto flex-1 bg-slate-50/30"><div class="report-empty"><svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="16" y="14" width="40" height="50" rx="5" fill="#fff6eb" stroke="currentColor" stroke-width="2"></rect><path d="M27 29h18M27 39h18M27 49h12" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path><circle cx="58" cy="56" r="11" fill="currentColor"></circle><path d="M58 50v12M52 56h12" stroke="#fffdfa" stroke-width="2" stroke-linecap="round"></path></svg><div class="report-empty__title">\u6267\u884C\u573A\u666F\u540E\u5C06\u5728\u8FD9\u91CC\u751F\u6210\u6574\u4F53\u62A5\u544A\u3002</div><div class="report-empty__hint">\u70B9\u51FB\u300C\u6267\u884C\u5168\u90E8\u300D\uFF0C\u5F00\u59CB\u8FDB\u884C</div></div></div>
                </div>
            </div>
        </main>
        <div id="configModal" class="hidden fixed inset-0 z-40 bg-slate-950/20 p-4 flex items-center justify-center">
            <div class="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-lg bg-slate-800 shadow-xl border border-slate-700 text-slate-200">
                <div class="flex items-center justify-between border-b border-slate-700 px-5 py-4">
                    <div>
                        <div class="text-sm font-bold text-white">\u73AF\u5883\u53C2\u6570\u914D\u7F6E</div>
                        <div class="mt-1 text-[11px] text-slate-400">\u6D4B\u8BD5\u73AF\u5883\u3001\u5168\u5C40\u53C2\u6570\u4E0E\u573A\u666F\u53D8\u91CF\uFF0C\u4FDD\u5B58\u540E\u6309\u73AF\u5883\u751F\u6548\u3002</div>
                    </div>
                    <button id="configCloseBtn" type="button" class="rounded px-2 py-1 text-slate-400 hover:bg-slate-700 hover:text-white">\u5173\u95ED</button>
                </div>
                <div class="space-y-4 p-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="flex flex-col gap-1.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">\u6D4B\u8BD5\u73AF\u5883</span>
                            <select id="environmentInput" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"></select>
                        </label>
                        <label class="flex flex-col gap-1.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">\u63A5\u53E3\u57FA\u7840\u5730\u5740</span>
                            <input id="baseUrlInput" type="text" placeholder="\u7559\u7A7A\u9ED8\u8BA4\u4F7F\u7528\u5F53\u524D\u9875\u9762\u670D\u52A1\u5730\u5740" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                        </label>
                    </div>
                    <div class="border-t border-slate-700 pt-4">
                        <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">\u5168\u5C40\u53C2\u6570 <span class="normal-case font-normal text-slate-500">\uFF08\u8FFD\u52A0\u5230\u6BCF\u4E2A\u8BF7\u6C42\uFF0C\u652F\u6301 header / cookie / query\uFF09</span></div>
                        <div id="globalsInput" class="space-y-2"></div>
                        <button type="button" id="addGlobalBtn" class="mt-2 px-3 py-1.5 rounded-md bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors">+ \u6DFB\u52A0\u5168\u5C40\u53C2\u6570</button>
                    </div>
                    <div class="border-t border-slate-700 pt-4">
                        <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">\u573A\u666F\u53D8\u91CF</div>
                        <div id="scenarioVarsInput" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between border-t border-slate-700 pt-4">
                        <div class="text-[11px] text-slate-400 flex items-center gap-2"><span>\u5F53\u524D\u751F\u6548\u63A5\u53E3\u5730\u5740:</span> <span id="baseUrlLabel" class="font-mono text-emerald-400"></span><span id="authLabel" class="font-mono text-amber-400 border-l border-slate-600 pl-2" style="display:none">\u5168\u5C40\u53C2\u6570: <span id="authValue"></span></span></div>
                        <div class="flex flex-wrap items-center justify-end gap-2 mt-2 sm:mt-0">
                            <span id="settingsNotice" role="status" aria-live="polite" class="hidden text-xs font-medium text-emerald-400"></span>
                            <button id="saveSettingsBtn" class="px-4 py-1.5 rounded-md bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm">\u4FDD\u5B58\u5E76\u751F\u6548</button>
                            <button id="clearSettingsBtn" class="px-4 py-1.5 rounded-md bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors">\u6E05\u9664\u5F53\u524D\u73AF\u5883\u8986\u76D6</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="adhocModal" class="hidden fixed inset-0 z-30 bg-slate-950/40 p-4 overflow-y-auto">
            <div class="mx-auto my-8 max-w-3xl rounded-lg bg-white shadow-xl">
                <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <div class="text-sm font-bold text-slate-800">\u4E34\u65F6\u8BF7\u6C42\u8C03\u8BD5</div>
                        <div class="mt-1 text-[11px] text-slate-400">\u4EC5\u6267\u884C\u5F53\u524D\u7F16\u8F91\u5185\u5BB9\uFF0C\u4E0D\u4FDD\u5B58\u4E5F\u4E0D\u5F71\u54CD\u573A\u666F\u8FDB\u5EA6\u3002</div>
                    </div>
                    <button id="adhocCloseBtn" type="button" class="rounded px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">\u5173\u95ED</button>
                </div>
                <div class="space-y-4 p-5">
                    <div id="adhocError" class="hidden rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"></div>
                    <label class="block"><span class="text-xs font-bold text-slate-600">\u8BF7\u6C42\u540D\u79F0</span><input id="adhocNameInput" class="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm" type="text"></label>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                        <label class="block"><span class="text-xs font-bold text-slate-600">\u65B9\u6CD5</span><select id="adhocMethodInput" class="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select></label>
                        <label class="block"><span class="text-xs font-bold text-slate-600">\u8BF7\u6C42\u8DEF\u5F84</span><input id="adhocPathInput" class="mt-1 w-full rounded border border-slate-200 px-3 py-2 font-mono text-sm" type="text"></label>
                    </div>
                    <div class="block">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-600">\u67E5\u8BE2\u53C2\u6570</span>
                            <button id="adhocAddParamBtn" type="button" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">+ \u6DFB\u52A0\u53C2\u6570</button>
                        </div>
                        <div id="adhocParamsContainer" class="mt-2 space-y-2 max-h-48 overflow-y-auto rounded border border-slate-200 bg-slate-50/50 p-2"></div>
                    </div>
                    <label class="block"><span class="text-xs font-bold text-slate-600">\u8BF7\u6C42\u5934 JSON</span><textarea id="adhocHeadersInput" class="mt-1 h-28 w-full rounded border border-slate-200 p-3 font-mono text-xs" spellcheck="false"></textarea></label>
                    <label class="block"><span class="text-xs font-bold text-slate-600">\u8BF7\u6C42\u4F53 JSON</span><textarea id="adhocBodyInput" class="mt-1 h-40 w-full rounded border border-slate-200 p-3 font-mono text-xs" spellcheck="false"></textarea></label>
                    <div class="flex justify-end gap-2"><button id="adhocCancelBtn" type="button" class="rounded border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">\u53D6\u6D88</button><button id="adhocExecuteBtn" type="button" class="rounded bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">\u6267\u884C\u4E00\u6B21</button></div>
                    <div id="adhocResult" class="hidden rounded border border-slate-200 bg-slate-50 p-4"></div>
                </div>
            </div>
        </div>
        <div id="stepLoadingModal" class="scenario-step-loading" role="status" aria-live="assertive" aria-hidden="true">
            <div class="scenario-step-loading__content">
                <span class="scenario-step-loading__spinner" aria-hidden="true"></span>
                <div>
                    <div class="scenario-step-loading__title">\u6B63\u5728\u6267\u884C\u5355\u6B65\u8BF7\u6C42</div>
                    <div id="stepLoadingText" class="scenario-step-loading__text">\u8BF7\u7A0D\u5019\u2026</div>
                </div>
            </div>
        </div>`;
  }
  function renderScenarioSelect(discoveredFiles, scenarioFile, scenarioSearch, pins) {
    var list = document.getElementById("scenarioList");
    if (!list) return;
    var keyword = String(scenarioSearch || "").trim().toLowerCase();
    var pinOrder = (pins || []).reduce(function(result, file, index) {
      result[file] = index;
      return result;
    }, {});
    var items = (discoveredFiles || []).filter(function(item) {
      var text = ((item.name || "") + " " + (item.file || "")).toLowerCase();
      return !keyword || text.indexOf(keyword) >= 0;
    }).sort(function(left, right) {
      var leftOrder = Object.prototype.hasOwnProperty.call(pinOrder, left.file) ? pinOrder[left.file] : Number.MAX_SAFE_INTEGER;
      var rightOrder = Object.prototype.hasOwnProperty.call(pinOrder, right.file) ? pinOrder[right.file] : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });
    if (!items.length) {
      list.innerHTML = '<div class="p-3 text-xs text-slate-400">' + (keyword ? "\u672A\u627E\u5230\u5339\u914D\u573A\u666F" : "\u6682\u65E0\u53EF\u7528\u573A\u666F") + "</div>";
      return;
    }
    list.innerHTML = items.map(function(item) {
      var name = item.name || item.file;
      var active = scenarioFile === item.file;
      var pinned = Object.prototype.hasOwnProperty.call(pinOrder, item.file);
      var classes = active ? "bg-slate-100 border-slate-200 text-slate-900 shadow-sm" : "bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200";
      var pinLabel = pinned ? "\u53D6\u6D88\u7F6E\u9876" : "\u7F6E\u9876";
      return '<div class="flex items-start gap-1 rounded-lg border transition-colors ' + classes + '"><button type="button" data-scenario-file="' + esc(item.file) + '" title="' + esc(item.file) + '" class="min-w-0 flex-1 text-left px-3 py-2.5"><div class="text-xs font-bold truncate">' + esc(name) + '</div><div class="mt-1 text-[10px] font-mono truncate ' + (active ? "text-slate-500" : "text-slate-400") + '">' + esc(item.file) + '</div></button><button type="button" data-pin-file="' + esc(item.file) + '" title="' + pinLabel + '" aria-label="' + pinLabel + '" class="scenario-pin-control' + (pinned ? " scenario-pin-control--active" : "") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3z" fill="' + (pinned ? "currentColor" : "none") + '" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path></svg></button></div>';
    }).join("");
  }
  function renderStatsAll(steps, iterations) {
    steps = steps || [];
    var statsPanel = document.getElementById("statsPanel");
    if (!statsPanel) return;
    if (!steps.length) {
      statsPanel.innerHTML = '<div class="text-sm text-slate-500 p-4">\u6CA1\u6709\u5DF2\u6267\u884C\u7684\u6B65\u9AA4</div>';
      return;
    }
    var total = steps.length;
    var skipped = steps.filter(function(s) {
      return s.skipped;
    }).length;
    var executed = total - skipped;
    var passed = steps.filter(function(s) {
      return !s.skipped && s.passed;
    }).length;
    var failed = steps.filter(function(s) {
      return !s.skipped && !s.passed;
    }).length;
    var passRate = executed ? (passed / executed * 100).toFixed(2) : 0;
    var failRate = executed ? (failed / executed * 100).toFixed(2) : 0;
    var totalMs = steps.reduce(function(a, s) {
      return a + (s.duration || 0);
    }, 0);
    var avgMs = executed ? totalMs / executed : 0;
    var assertTotal = steps.reduce(function(a, s) {
      return a + (s.assertions ? s.assertions.length : 0);
    }, 0);
    var assertFailed = steps.reduce(function(a, s) {
      return a + (s.assertions ? s.assertions.filter(function(x) {
        return !x.passed;
      }).length : 0);
    }, 0);
    var iter = iterations || { run: 1, failed: 0 };
    var chart = '<div class="flex items-center space-x-6 w-full md:w-auto"><div class="circle-chart scale-90" style="background:conic-gradient(#10b981 0% ' + passRate + "%, #f43f5e " + passRate + '% 100%)"><div class="circle-inner"><span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">\u5DF2\u5B8C\u6210</span><span class="text-xl font-bold text-slate-800 mt-0.5">' + total + '</span></div></div><div class="flex space-x-3"><div class="flex items-center space-x-2 px-2 py-1 rounded bg-emerald-50 border border-emerald-100/50"><span class="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></span><span class="text-xs font-bold text-emerald-700">' + passed + ' <span class="text-emerald-600/70 font-medium text-[10px] ml-0.5">(' + passRate + '%)</span></span></div><div class="flex items-center space-x-2 px-2 py-1 rounded bg-rose-50 border border-rose-100/50"><span class="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></span><span class="text-xs font-bold text-rose-600">' + failed + ' <span class="text-rose-500/70 font-medium text-[10px] ml-0.5">(' + failRate + "%)</span></span></div>" + (skipped ? '<div class="flex items-center space-x-2 px-2 py-1 rounded bg-slate-100 border border-slate-200/60"><span class="w-2 h-2 rounded-full bg-slate-400 shadow-sm"></span><span class="text-xs font-bold text-slate-600">' + skipped + ' <span class="text-slate-400/80 font-medium text-[10px] ml-0.5">\u8DF3\u8FC7</span></span></div>' : "") + "</div></div>";
    var metrics = '<div class="flex space-x-8 mt-4 md:mt-0 pl-6 border-l border-slate-100"><div class="space-y-0.5"><div class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">\u8017\u65F6(\u603B/\u5747)</div><div class="text-emerald-500 font-bold text-sm tracking-tight">' + fmt(totalMs) + " / " + fmt(avgMs) + '</div></div><div class="space-y-0.5"><div class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">\u5FAA\u73AF(\u6267\u884C/\u5931\u8D25)</div><div class="text-xs font-medium text-slate-700"><span class="font-bold text-slate-900">' + (iter.run || 1) + '</span> <span class="mx-1 text-slate-300">/</span> <span class="text-rose-500 font-bold">' + (iter.failed || 0) + '</span></div></div><div class="space-y-0.5"><div class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">\u65AD\u8A00(\u6267\u884C/\u5931\u8D25)</div><div class="text-xs font-medium text-slate-700"><span class="font-bold text-slate-900">' + assertTotal + '</span> <span class="mx-1 text-slate-300">/</span> <span class="text-rose-500 font-bold">' + assertFailed + "</span></div></div></div>";
    statsPanel.innerHTML = chart + metrics;
  }
  function renderFilterAll(steps) {
    steps = steps || [];
    var filterBar = document.getElementById("filterBar");
    if (!filterBar) return;
    if (!steps.length) {
      filterBar.innerHTML = '<div class="text-xs text-slate-400 py-1">\u7B49\u5F85\u52A0\u8F7D...</div>';
      return;
    }
    var total = steps.length;
    var skipped = steps.filter(function(s) {
      return s.skipped;
    }).length;
    var passed = steps.filter(function(s) {
      return !s.skipped && s.passed;
    }).length;
    var failed = steps.filter(function(s) {
      return !s.skipped && !s.passed;
    }).length;
    filterBar.innerHTML = `
            <div class="flex items-center space-x-1 bg-slate-200/60 p-1 rounded-md">
                <button data-f="all" onclick="window.__R.filter('all')" class="filter-btn px-3 py-1 text-xs font-bold text-blue-700 bg-white border border-blue-200 rounded shadow-sm">\u5168\u90E8 (${total})</button>
                <button data-f="pass" onclick="window.__R.filter('pass')" class="filter-btn px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded">\u6210\u529F (${passed})</button>
                <button data-f="fail" onclick="window.__R.filter('fail')" class="filter-btn px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded">\u5931\u8D25 (${failed})</button>
                ${skipped ? `<button data-f="skip" onclick="window.__R.filter('skip')" class="filter-btn px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded">\u8DF3\u8FC7 (${skipped})</button>` : ""}
            </div>
            <div class="flex items-center space-x-2">
                <input type="search" placeholder="\u641C\u7D22\u6B65\u9AA4/\u5730\u5740..." oninput="window.__R.search(this.value)" class="px-2.5 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-500 w-44">
            </div>
        `;
  }
  function renderPendingSteps(scenarioSteps, startIndex) {
    if (!Array.isArray(scenarioSteps) || startIndex >= scenarioSteps.length) return "";
    return scenarioSteps.slice(startIndex).map(function(step, idx) {
      var seqNum = startIndex + idx + 1;
      var method = String(step.method || "GET").toUpperCase();
      var stepPath = step.path || "";
      var methodColor = { GET: "text-emerald-600", POST: "text-orange-500", PUT: "text-amber-600", DELETE: "text-rose-600", PATCH: "text-purple-600" }[method] || "text-slate-600";
      var assertCount = Array.isArray(step.assertions) ? step.assertions.length : 0;
      var extractCount = Array.isArray(step.extract) ? step.extract.length : 0;
      var tags = "";
      if (assertCount) tags += '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold"> ' + assertCount + " \u65AD\u8A00</span>";
      if (extractCount) tags += '<span class="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 text-[10px] font-bold ml-1">' + extractCount + " \u63D0\u53D6</span>";
      var reqBody = step.request && step.request.body ? esc(typeof step.request.body === "string" ? step.request.body : JSON.stringify(step.request.body, null, 2)) : "";
      return '<li class="hover:bg-slate-50/60 group transition-all duration-150 border-b border-slate-100/80" data-passed="pending" data-search="' + esc(((step.name || "") + " " + method + " " + stepPath).toLowerCase()) + '"><div class="px-4 py-3 flex items-center justify-between cursor-pointer select-none" onclick="window.__R.toggle(this, event)"><div class="flex items-center space-x-3 min-w-0 flex-1 pr-4"><div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[11px] font-bold bg-slate-200 text-slate-600 shadow-inner">' + seqNum + '</div><span class="text-sm text-slate-800 font-semibold truncate group-hover:text-slate-950" title="' + esc(step.name || "") + '">' + esc(step.name || "\u672A\u547D\u540D\u6B65\u9AA4") + '</span><div class="hidden sm:flex items-center space-x-1.5 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/60 flex-shrink-0 max-w-[55%]"><span class="text-[10px] font-extrabold ' + methodColor + ' uppercase tracking-wider">' + method + '</span><span class="text-slate-300">|</span><span class="text-[11px] text-slate-600 font-mono truncate" title="' + esc(stepPath) + '">' + esc(stepPath) + '</span></div></div><div class="flex items-center space-x-2.5 flex-shrink-0">' + tags + '<button type="button" data-adhoc-step="' + (seqNum - 1) + '" class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm">\u8C03\u8BD5</button><span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">\u5F85\u6267\u884C</span><svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div><div class="details-panel px-5 bg-slate-50/70 border-t border-slate-200/60 text-[13px]"><div class="py-4 space-y-3">' + (reqBody ? '<div><div class="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1.5"><span class="flex items-center"><div class="w-1.5 h-1.5 bg-slate-400 mr-2 rounded-full"></div>\u8BF7\u6C42\u4F53</span><span class="text-slate-400 font-mono font-normal">JSON</span></div><pre class="bg-[#1e293b] p-3.5 rounded-xl text-slate-200 overflow-x-auto font-mono text-[12px] leading-relaxed shadow-sm border border-slate-700/50">' + reqBody + "</pre></div>" : '<div class="text-xs text-slate-400 py-1">\u65E0\u8BF7\u6C42\u4F53\u53C2\u6570</div>') + "</div></div></li>";
    }).join("");
  }
  function renderStepsAll(steps, scenarioSteps, executionMode) {
    var ul = document.getElementById("stepsList");
    if (!ul) return;
    steps = steps || [];
    scenarioSteps = scenarioSteps || [];
    if (!steps.length && !scenarioSteps.length) {
      ul.innerHTML = '<li class="p-8 text-center text-slate-400 text-sm">\u70B9\u51FB\u6267\u884C\u573A\u666F\u5F00\u59CB\u8BF7\u6C42</li>';
      return;
    }
    ul.innerHTML = steps.map(function(s, i) {
      var ok = s.passed;
      var skipped = s.skipped;
      var seqNum = i + 1;
      var seqCls = skipped ? "bg-slate-400 text-white" : ok ? "bg-emerald-500 text-white" : "bg-rose-500 text-white";
      var nameCls = ok ? "text-slate-700 group-hover:text-emerald-700" : "text-rose-800";
      var statusCls = skipped ? "text-slate-600 bg-slate-100 border-slate-200" : ok ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-100 border-rose-200 shadow-sm";
      var timeCls = ok ? "text-slate-400" : "text-rose-400";
      var bgCls = ok ? "hover:bg-slate-50/50" : "bg-rose-50/20";
      var methodColor = { GET: "text-emerald-600", POST: "text-orange-500", PUT: "text-amber-600", DELETE: "text-rose-600", PATCH: "text-purple-600" }[s.method] || "text-slate-600";
      var reqHeaders = s.request && s.request.headers ? esc(typeof s.request.headers === "string" ? s.request.headers : JSON.stringify(s.request.headers, null, 2)) : "";
      var reqBody = s.request && s.request.body ? esc(typeof s.request.body === "string" ? s.request.body : JSON.stringify(s.request.body, null, 2)) : "";
      var resHeaders = s.response && s.response.headers ? esc(typeof s.response.headers === "string" ? s.response.headers : JSON.stringify(s.response.headers, null, 2)) : "";
      var resBody = s.response && s.response.body ? esc(typeof s.response.body === "string" ? s.response.body : JSON.stringify(s.response.body, null, 2)) : "";
      var errorHtml = "";
      if (!ok && s.error) {
        errorHtml = '<div class="my-2 p-2 bg-rose-50 rounded border border-rose-200 flex items-center space-x-2"><svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-rose-800 font-bold text-[12px]">\u65AD\u8A00\u5931\u8D25:</span><span class="text-rose-600 text-[12px] font-mono break-all">' + esc(s.error) + "</span></div>";
      }
      var assertHtml = "";
      if (s.assertions && s.assertions.length) {
        assertHtml = '<div class="py-3 border-t border-slate-200 mt-2"><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-2">\u65AD\u8A00\u7ED3\u679C</div><div class="flex flex-wrap gap-2">' + s.assertions.map(function(a) {
          var ac = a.passed ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100";
          var ap = a.passed ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12";
          return '<div class="flex items-center px-2 py-1 ' + ac + ' rounded border text-[12px] font-medium" title="Expected: ' + esc(stringify(a.expected)) + " \nActual: " + esc(stringify(a.actual)) + '"><svg class="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="' + ap + '"></path></svg>' + esc(a.name) + "</div>";
        }).join("") + "</div></div>";
      }
      var bodyColor = ok ? "text-emerald-400" : "text-rose-400";
      var detailPanelCls = ok ? "details-panel px-4 bg-slate-50/30 border-t border-slate-100 text-[13px]" : "details-panel px-4 bg-white border-t border-rose-100 text-[13px] shadow-inner";
      var stepActions = executionMode === "step" ? '<span class="step-run-actions"><button type="button" data-step-action="rewind" data-step-index="' + i + '" title="\u4EC5\u56DE\u9000\u6D4B\u8BD5\u8FD0\u884C\u65F6\u4E0E\u62A5\u544A\uFF0C\u4E0D\u64A4\u9500\u5DF2\u53D1\u51FA\u7684\u4E1A\u52A1\u8BF7\u6C42">\u56DE\u9000</button><button type="button" data-step-action="rerun" data-step-index="' + i + '" title="\u4ECE\u672C\u6B65\u9AA4\u6267\u884C\u524D\u7684\u53D8\u91CF\u5FEB\u7167\u91CD\u65B0\u6267\u884C">\u91CD\u8DD1</button></span>' : "";
      return '<li class="' + bgCls + ' group transition-colors" data-passed="' + ok + '" data-skipped="' + skipped + '" data-search="' + esc((s.name + " " + s.method + " " + s.path).toLowerCase()) + '"><div class="px-4 py-2.5 flex items-center justify-between cursor-pointer" onclick="window.__R.toggle(this, event)"><div class="flex items-center space-x-3 w-[70%] lg:w-[80%]"><div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[11px] font-bold shadow-sm ' + seqCls + '">' + seqNum + '</div><span class="select-text text-sm ' + nameCls + ' font-semibold truncate transition-colors" title="' + esc(s.name) + '">' + esc(s.name) + '</span><div class="hidden sm:flex items-center space-x-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 flex-shrink-0 max-w-[50%]"><span class="text-[10px] font-bold ' + methodColor + ' uppercase tracking-wider">' + s.method + '</span><span class="text-slate-300">|</span><span class="select-text text-[12px] text-slate-500 font-mono truncate" title="' + esc(s.path) + '">' + esc(s.path) + '</span></div></div><div class="flex items-center space-x-4 flex-shrink-0"><button type="button" data-adhoc-step="' + i + '" class="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700">\u8C03\u8BD5</button>' + stepActions + '<span class="text-[12px] font-bold font-mono ' + statusCls + ' px-1.5 py-0.5 rounded border">' + s.status + '</span><span class="' + timeCls + ' text-[12px] font-mono w-16 text-right">' + fmt(s.duration) + '</span><svg class="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div><div class="' + detailPanelCls + '"><div class="sm:hidden mb-3 pb-3 border-b border-slate-200"><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">\u63A5\u53E3\u5730\u5740</div><div class="flex items-center space-x-2"><span class="text-xs font-bold ' + methodColor + '">' + s.method + '</span><span class="text-xs font-mono break-all">' + esc(s.path) + "</span></div></div>" + errorHtml + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 md:divide-x divide-slate-200 py-3"><div class="md:pr-6 space-y-3">' + (reqHeaders ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>\u8BF7\u6C42\u5934</div><pre class="bg-slate-800 p-2.5 rounded text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner">' + reqHeaders + "</pre></div>" : "") + (reqBody ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-emerald-400 mr-2 rounded-full"></div>\u8BF7\u6C42\u4F53</div><pre class="bg-slate-800 p-2.5 rounded ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner">' + reqBody + "</pre></div>" : "") + '</div><div class="md:pl-6 space-y-3">' + (resHeaders ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>\u54CD\u5E94\u5934</div><pre class="bg-slate-800 p-2.5 rounded text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner">' + resHeaders + "</pre></div>" : "") + (resBody ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 ' + (ok ? "bg-emerald-400" : "bg-rose-400") + ' mr-2 rounded-full"></div>\u54CD\u5E94\u4F53</div><pre class="bg-slate-800 p-2.5 rounded ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner">' + resBody + "</pre></div>" : "") + "</div></div>" + assertHtml + "</div></li>";
    }).join("") + renderPendingSteps(scenarioSteps, steps.length);
  }
  function buildOverallReport(steps, scenario, scenarioFile, executionMode, environment) {
    steps = steps || [];
    var total = steps.length;
    var skipped = steps.filter(function(item) {
      return item.skipped;
    }).length;
    var executed = total - skipped;
    var passed = steps.filter(function(item) {
      return !item.skipped && item.passed;
    }).length;
    var failed = steps.filter(function(item) {
      return !item.skipped && !item.passed;
    }).length;
    var duration = steps.reduce(function(sum, item) {
      return sum + (item.duration || 0);
    }, 0);
    var status = failed > 0 ? "FAILED" : executed === 0 ? "SKIPPED" : "PASSED";
    return {
      title: scenario && scenario.name || scenarioFile || "\u6D4B\u8BD5\u62A5\u544A",
      scenarioFile: scenarioFile || "",
      executionMode: executionMode || "full",
      environment: environment ? environment.name || environment.key : "\u9ED8\u8BA4",
      status,
      summary: {
        totalSteps: scenario && scenario.steps && scenario.steps.length || total,
        plannedSteps: scenario && scenario.steps && scenario.steps.length || total,
        executedSteps: executed,
        passedSteps: passed,
        failedSteps: failed,
        skippedSteps: skipped,
        passRate: executed ? (passed / executed * 100).toFixed(2) + "%" : "0.00%",
        totalDurationMs: duration,
        totalDurationFmt: fmt(duration)
      },
      steps: steps.map(function(item, index) {
        return {
          stepNo: item.stepNo || index + 1,
          name: item.name,
          method: item.method,
          path: item.path,
          status: item.status,
          passed: item.passed,
          skipped: Boolean(item.skipped),
          durationMs: item.duration,
          durationFmt: fmt(item.duration),
          error: item.error || "",
          warnings: item.warnings || [],
          request: item.request,
          response: item.response,
          assertions: item.assertions || []
        };
      })
    };
  }
  function buildMarkdownReport(report) {
    if (!report) return "";
    var summary = report.summary || {};
    var lines = [];
    lines.push("# " + (report.title || "\u6D4B\u8BD5\u62A5\u544A"));
    lines.push("");
    lines.push("- **\u573A\u666F\u6587\u4EF6**: `" + (report.scenarioFile || "-") + "`");
    lines.push("- **\u6D4B\u8BD5\u73AF\u5883**: " + (report.environment || "-"));
    lines.push("- **\u6267\u884C\u6A21\u5F0F**: " + (report.executionMode || "-"));
    var resultText = summary.failedSteps ? "\u274C \u5B58\u5728\u5931\u8D25" : summary.skippedSteps && summary.executedSteps === 0 ? "\u23ED\uFE0F \u5168\u90E8\u8DF3\u8FC7" : "\u2705 \u5168\u90E8\u901A\u8FC7";
    lines.push("- **\u7ED3\u679C**: " + resultText + " (" + summary.passedSteps + "/" + summary.executedSteps + ")");
    lines.push("- **\u901A\u8FC7\u7387**: " + summary.passRate);
    lines.push("- **\u7EDF\u8BA1**: \u901A\u8FC7 " + summary.passedSteps + " / \u5931\u8D25 " + summary.failedSteps + " / \u8DF3\u8FC7 " + summary.skippedSteps + " / \u6267\u884C " + summary.executedSteps + " / \u8BA1\u5212 " + summary.plannedSteps);
    lines.push("- **\u603B\u8017\u65F6**: " + summary.totalDurationFmt);
    lines.push("");
    lines.push("## \u6B65\u9AA4\u660E\u7EC6");
    lines.push("");
    (report.steps || []).forEach(function(step) {
      var icon = step.skipped ? "\u23ED\uFE0F" : step.passed ? "\u2705" : "\u274C";
      lines.push("### " + icon + " \u6B65\u9AA4 " + step.stepNo + ": " + step.name);
      lines.push("- **\u8BF7\u6C42**: `" + step.method + " " + step.path + "`");
      lines.push("- **\u72B6\u6001**: " + step.status + " | **\u8017\u65F6**: " + step.durationFmt);
      if (step.error) lines.push("- **\u5931\u8D25\u539F\u56E0**: " + step.error);
      (step.warnings || []).forEach(function(warning) {
        lines.push("- **\u8B66\u544A**: " + warning);
      });
      if (step.assertions && step.assertions.length) {
        lines.push("- **\u65AD\u8A00\u7ED3\u679C**:");
        step.assertions.forEach(function(a) {
          lines.push("  - [" + (a.passed ? "x" : " ") + "] " + a.name);
        });
      }
      var response = step.response || {};
      lines.push("- **\u5B8C\u6574\u54CD\u5E94**:");
      lines.push("  - **\u54CD\u5E94\u5934**:");
      lines.push("```json");
      lines.push(formatReportPayload(response.headers || {}));
      lines.push("```");
      lines.push("  - **\u54CD\u5E94\u4F53**:");
      lines.push("```");
      lines.push(formatReportPayload(response.bodyText !== void 0 ? response.bodyText : response.body));
      lines.push("```");
      lines.push("");
    });
    return lines.join("\n");
  }
  function renderReportPanel(steps, scenario, scenarioFile, executionMode, environment) {
    var node = document.getElementById("reportPanel");
    if (!node) return null;
    steps = steps || [];
    if (!steps.length) {
      node.innerHTML = '<div class="report-empty"><svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="16" y="14" width="40" height="50" rx="5" fill="#fff6eb" stroke="currentColor" stroke-width="2"></rect><path d="M27 29h18M27 39h18M27 49h12" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path><circle cx="58" cy="56" r="11" fill="currentColor"></circle><path d="M58 50v12M52 56h12" stroke="#fffdfa" stroke-width="2" stroke-linecap="round"></path></svg><div class="report-empty__title">\u6267\u884C\u573A\u666F\u540E\u5C06\u5728\u8FD9\u91CC\u751F\u6210\u6574\u4F53\u62A5\u544A\u3002</div><div class="report-empty__hint">\u70B9\u51FB\u300C\u6267\u884C\u5168\u90E8\u300D\uFF0C\u5F00\u59CB\u8FDB\u884C</div></div>';
      return null;
    }
    var report = buildOverallReport(steps, scenario, scenarioFile, executionMode, environment);
    var summary = report.summary;
    var pending = summary.totalSteps - summary.executedSteps;
    var hasFailure = summary.failedSteps > 0;
    var allSkipped = !hasFailure && summary.executedSteps === 0 && summary.skippedSteps > 0;
    var completed = pending <= 0;
    var statusClass = hasFailure ? "report-status--failed" : allSkipped ? "report-status--skipped" : completed ? "report-status--passed" : "report-status--running";
    var statusText = hasFailure ? "\u5B58\u5728\u5931\u8D25" : allSkipped ? "\u5168\u90E8\u8DF3\u8FC7" : completed ? "\u5168\u90E8\u901A\u8FC7" : "\u6267\u884C\u4E2D";
    var modeText = report.executionMode === "step" ? "\u5355\u6B65\u6267\u884C" : "\u5168\u91CF\u6267\u884C";
    var progressText = summary.executedSteps + " / " + summary.totalSteps;
    var reportSteps = hasFailure ? report.steps.filter(function(step) {
      return !step.passed;
    }) : [];
    var stepHtml = reportSteps.map(function(step) {
      var method = String(step.method || "GET").toUpperCase();
      var methodClass = "report-method--" + method.toLowerCase();
      var failedAssertions = (step.assertions || []).filter(function(assertion) {
        return !assertion.passed;
      });
      var issue = step.error || failedAssertions[0] && failedAssertions[0].name || "";
      var response = step.response || {};
      var responseBody = response.bodyText !== void 0 ? response.bodyText : response.body;
      var responseHtml = '<details class="report-step__response"><summary>\u5B8C\u6574\u54CD\u5E94</summary><div class="report-step__response-section">\u54CD\u5E94\u5934</div><pre>' + esc(formatReportPayload(response.headers || {})) + '</pre><div class="report-step__response-section">\u54CD\u5E94\u4F53</div><pre>' + esc(formatReportPayload(responseBody)) + "</pre></details>";
      return '<div class="report-step ' + (step.passed ? "report-step--passed" : "report-step--failed") + '"><div class="report-step__marker" aria-hidden="true">' + (step.passed ? "\u2713" : "!") + '</div><div class="report-step__content"><div class="report-step__heading"><span class="report-step__number">\u6B65\u9AA4 ' + step.stepNo + '</span><span class="report-step__name" title="' + esc(step.name || "") + '">' + esc(step.name || "\u672A\u547D\u540D\u6B65\u9AA4") + '</span></div><div class="report-step__request"><span class="report-method ' + methodClass + '">' + esc(method) + '</span><span class="report-step__path" title="' + esc(step.path || "") + '">' + esc(step.path || "-") + "</span></div>" + (issue ? '<div class="report-step__issue">' + esc(issue) + "</div>" : "") + responseHtml + '</div><div class="report-step__result"><span class="report-step__code">' + esc(String(step.status || "-")) + '</span><span class="report-step__duration">' + esc(step.durationFmt || "-") + "</span></div></div>";
    }).join("");
    var diagnosisHtml = hasFailure ? '<div class="report-steps"><div class="report-steps__title">\u5931\u8D25\u6B65\u9AA4</div>' + stepHtml + "</div>" : allSkipped ? '<div class="report-healthy"><div class="report-healthy__title">\u6240\u6709\u6B65\u9AA4\u5747\u56E0\u6761\u4EF6\u4E0D\u6EE1\u8DB3\u800C\u8DF3\u8FC7</div><div class="report-healthy__hint">\u672C\u6B21\u6267\u884C\u672A\u53D1\u8D77\u4EFB\u4F55\u8BF7\u6C42\uFF0C\u8BE6\u7EC6\u8DF3\u8FC7\u539F\u56E0\u8BF7\u5728\u5DE6\u4FA7\u6B65\u9AA4\u5217\u8868\u67E5\u770B\u3002</div></div>' : '<div class="report-healthy"><div class="report-healthy__title">' + (completed ? "\u6240\u6709\u6B65\u9AA4\u5747\u5DF2\u901A\u8FC7" : "\u5F53\u524D\u5DF2\u6267\u884C\u6B65\u9AA4\u5747\u901A\u8FC7") + '</div><div class="report-healthy__hint">\u8BE6\u7EC6\u8BF7\u6C42\u4E0E\u54CD\u5E94\u8BF7\u5728\u5DE6\u4FA7\u6B65\u9AA4\u5217\u8868\u67E5\u770B\uFF1B\u5B8C\u6574\u62A5\u544A\u53EF\u901A\u8FC7\u9876\u90E8\u6309\u94AE\u590D\u5236\u3002</div></div>';
    node.innerHTML = '<div class="report-content"><div class="report-overview"><div class="report-overview__top"><div><div class="report-overview__eyebrow">\u5F53\u524D\u6267\u884C\u6982\u89C8</div><div class="report-overview__title">' + esc(report.title || "\u6D4B\u8BD5\u62A5\u544A") + '</div></div><span class="report-status ' + statusClass + '">' + statusText + '</span></div><div class="report-overview__meta"><span>' + esc(report.environment || "\u9ED8\u8BA4\u73AF\u5883") + "</span><span>" + modeText + "</span><span>\u5DF2\u6267\u884C " + progressText + '</span></div></div><div class="report-metrics"><div class="report-metric"><span class="report-metric__label">\u901A\u8FC7</span><strong class="report-metric__value report-metric__value--passed">' + summary.passedSteps + '</strong></div><div class="report-metric"><span class="report-metric__label">\u5931\u8D25</span><strong class="report-metric__value ' + (hasFailure ? "report-metric__value--failed" : "") + '">' + summary.failedSteps + "</strong></div>" + (summary.skippedSteps > 0 ? '<div class="report-metric"><span class="report-metric__label">\u8DF3\u8FC7</span><strong class="report-metric__value">' + summary.skippedSteps + "</strong></div>" : "") + '<div class="report-metric"><span class="report-metric__label">\u603B\u8017\u65F6</span><strong class="report-metric__value report-metric__duration">' + esc(summary.totalDurationFmt) + '</strong></div></div><div class="report-progress"><div class="report-progress__labels"><span>\u6267\u884C\u8FDB\u5EA6</span><strong>' + progressText + " \xB7 " + esc(summary.passRate) + '</strong></div><div class="report-progress__track' + (hasFailure ? " report-progress__track--failed" : "") + '"><span style="width:' + (summary.totalSteps ? summary.executedSteps / summary.totalSteps * 100 : 0) + '%"></span></div></div>' + diagnosisHtml + "</div>";
    return report;
  }
  return {
    setRunState,
    setStepLoading,
    buildSkeleton,
    renderScenarioSelect,
    renderStatsAll,
    renderFilterAll,
    renderPendingSteps,
    renderStepsAll,
    buildOverallReport,
    buildMarkdownReport,
    renderReportPanel
  };
}();
var ui_view_default = legacyView;

// src/browser/legacy/ui-adhoc.js
var legacyAdhoc = function() {
  "use strict";
  var core = core_default || {};
  var esc = core.esc || function(s) {
    return s == null ? "" : String(s);
  };
  var fmt = core.fmt || function(ms) {
    return String(ms);
  };
  var safeJson = core.safeJson || function(v) {
    return JSON.stringify(v, null, 2);
  };
  var sanitizeSensitive2 = core.sanitizeSensitive || function(v) {
    return v;
  };
  var clone2 = core.clone || function(v) {
    return JSON.parse(JSON.stringify(v));
  };
  var isPlainObject2 = core.isPlainObject || function(v) {
    return Object.prototype.toString.call(v) === "[object Object]";
  };
  var appConfig = {};
  var adhocState = {
    request: null,
    result: null,
    running: false
  };
  function parseJsonEditor(value, fieldName) {
    var text = String(value || "").trim();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(fieldName + " \u5FC5\u987B\u662F\u5408\u6CD5 JSON");
    }
  }
  function resolveAdhocValue(value, runtime) {
    if (Array.isArray(value)) return value.map(function(item) {
      return resolveAdhocValue(item, runtime);
    });
    if (isPlainObject2(value)) {
      return Object.keys(value).reduce(function(result, key) {
        result[key] = resolveAdhocValue(value[key], runtime);
        return result;
      }, {});
    }
    if (typeof value !== "string") return value;
    return value.replace(/\{\{\s*(.+?)\s*\}\}/g, function(template, expr) {
      var resolved = core.evalExpr ? core.evalExpr(expr, runtime) : void 0;
      if (resolved === void 0 || resolved === null || resolved === "") return template;
      return typeof resolved === "object" ? JSON.stringify(resolved) : String(resolved);
    });
  }
  function hasAdhocTemplate(value) {
    if (typeof value === "string") return /\{\{\s*.+?\s*\}\}/.test(value);
    if (Array.isArray(value)) return value.some(hasAdhocTemplate);
    if (isPlainObject2(value)) return Object.keys(value).some(function(key) {
      return hasAdhocTemplate(value[key]);
    });
    return false;
  }
  function parseQueryParamsFromUrl(fullPath) {
    var pathStr = String(fullPath || "");
    var qIdx = pathStr.indexOf("?");
    if (qIdx < 0) return { basePath: pathStr, params: {} };
    var basePath = pathStr.substring(0, qIdx);
    var searchStr = pathStr.substring(qIdx + 1);
    var params = {};
    if (searchStr) {
      searchStr.split("&").forEach(function(pair) {
        if (!pair) return;
        var parts = pair.split("=");
        var key = decodeURIComponent(parts[0] || "");
        var val = decodeURIComponent(parts.slice(1).join("=") || "");
        if (key) params[key] = val;
      });
    }
    return { basePath, params };
  }
  function buildAdhocRequest(step, activeRuntime, currentScenario) {
    var runtime = activeRuntime || {
      vars: Object.assign({}, (currentScenario || {}).vars || {}, appConfig.vars || {}),
      lastResponse: null,
      lastResponseBody: null
    };
    var request = resolveAdhocValue(clone2(step.request || {}), runtime) || {};
    var resolvedPath = resolveAdhocValue(step.path || request.path || "", runtime);
    var parsed = parseQueryParamsFromUrl(resolvedPath);
    var rawParams = step.params || request.params;
    var resolvedParams = rawParams ? resolveAdhocValue(rawParams, runtime) : {};
    var mergedParams = Object.assign({}, parsed.params, isPlainObject2(resolvedParams) ? resolvedParams : {});
    return {
      name: (step.name || "\u672A\u547D\u540D\u6B65\u9AA4") + "\uFF08\u4E34\u65F6\u8C03\u8BD5\uFF09",
      method: String(step.method || request.method || "GET").toUpperCase(),
      path: parsed.basePath,
      params: Object.keys(mergedParams).length > 0 ? mergedParams : null,
      headers: request.headers && isPlainObject2(request.headers) ? request.headers : {},
      body: request.body === void 0 ? null : request.body
    };
  }
  function buildAdhocStep(values) {
    var path7 = String(values.path || "").trim();
    if (!path7) throw new Error("\u8BF7\u6C42\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A");
    var params = values.params;
    var headers = parseJsonEditor(values.headers, "\u8BF7\u6C42\u5934");
    var bodyText = String(values.body || "").trim();
    var body = bodyText ? parseJsonEditor(bodyText, "\u8BF7\u6C42\u4F53") : void 0;
    if (params && !isPlainObject2(params)) throw new Error("Query \u53C2\u6570\u5FC5\u987B\u662F Key-Value \u5BF9\u8C61");
    if (!isPlainObject2(headers)) throw new Error("\u8BF7\u6C42\u5934\u5FC5\u987B\u662F JSON \u5BF9\u8C61");
    if (hasAdhocTemplate(path7) || hasAdhocTemplate(params) || hasAdhocTemplate(headers) || hasAdhocTemplate(body)) {
      throw new Error("\u4ECD\u6709\u672A\u89E3\u6790\u7684 {{vars.xxx}} \u53C2\u6570\uFF0C\u8BF7\u586B\u5199\u5B9E\u9645\u503C\u540E\u518D\u6267\u884C");
    }
    return {
      name: values.name || "\u4E34\u65F6\u8BF7\u6C42",
      method: String(values.method || "GET").toUpperCase(),
      path: path7,
      params,
      request: { headers, body },
      timeoutMs: Number(appConfig.requestTimeoutMs || 3e4)
    };
  }
  function showAdhocError(message) {
    var node = document.getElementById("adhocError");
    if (!node) return;
    node.textContent = message || "";
    node.classList.toggle("hidden", !message);
  }
  function renderAdhocResult(result) {
    var node = document.getElementById("adhocResult");
    if (!node) return;
    if (!result) {
      node.classList.add("hidden");
      node.innerHTML = "";
      return;
    }
    var statusClass = result.passed ? "text-emerald-700" : "text-rose-700";
    var response = result.response || { headers: {}, body: null };
    node.classList.remove("hidden");
    node.innerHTML = '<div class="flex items-center justify-between"><div class="text-sm font-bold ' + statusClass + '">' + (result.passed ? "\u8BF7\u6C42\u5B8C\u6210" : "\u8BF7\u6C42\u5931\u8D25") + '</div><div class="text-xs text-slate-500">\u72B6\u6001\uFF1A' + esc(result.status) + " \uFF5C \u8017\u65F6\uFF1A" + esc(fmt(result.duration)) + "</div></div>" + (result.error ? '<div class="mt-3 rounded border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">' + esc(result.error) + "</div>" : "") + '<div class="mt-3 grid gap-3 md:grid-cols-2"><div><div class="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">\u54CD\u5E94\u5934</div><pre class="overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-tight text-slate-300">' + esc(safeJson(sanitizeSensitive2(response.headers, ""))) + '</pre></div><div><div class="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">\u54CD\u5E94\u4F53</div><pre class="overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-tight text-slate-300">' + esc(safeJson(sanitizeSensitive2(response.body, ""))) + "</pre></div></div>";
  }
  function syncAdhocFormDisabled(disabled) {
    ["adhocNameInput", "adhocMethodInput", "adhocPathInput", "adhocAddParamBtn", "adhocHeadersInput", "adhocBodyInput", "adhocExecuteBtn"].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.disabled = disabled;
    });
    var container = document.getElementById("adhocParamsContainer");
    if (container) {
      container.querySelectorAll("input, button").forEach(function(el) {
        el.disabled = disabled;
      });
    }
    var execBtn = document.getElementById("adhocExecuteBtn");
    if (execBtn) execBtn.textContent = disabled ? "\u6267\u884C\u4E2D..." : "\u6267\u884C\u4E00\u6B21";
  }
  function renderAdhocParamsRows(paramsObj) {
    var container = document.getElementById("adhocParamsContainer");
    if (!container) return;
    container.innerHTML = "";
    var keys = paramsObj && isPlainObject2(paramsObj) ? Object.keys(paramsObj) : [];
    if (keys.length === 0) {
      addAdhocParamRow("", "");
      return;
    }
    keys.forEach(function(k) {
      addAdhocParamRow(k, paramsObj[k]);
    });
  }
  function addAdhocParamRow(key, value) {
    var container = document.getElementById("adhocParamsContainer");
    if (!container) return;
    var row = document.createElement("div");
    row.className = "flex items-center gap-2 adhoc-param-row";
    row.innerHTML = '<input type="checkbox" checked class="param-enable rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" title="\u662F\u5426\u542F\u7528"><input type="text" class="param-key w-1/3 rounded border border-slate-200 px-2 py-1 font-mono text-xs placeholder:text-slate-300" placeholder="\u53C2\u6570\u540D (Key)" value="' + esc(key || "") + '"><input type="text" class="param-value flex-1 rounded border border-slate-200 px-2 py-1 font-mono text-xs placeholder:text-slate-300" placeholder="\u53C2\u6570\u503C (Value)" value="' + esc(value !== void 0 && value !== null ? String(value) : "") + '"><button type="button" class="param-remove text-slate-400 hover:text-rose-600 px-1 text-xs" title="\u5220\u9664\u884C">\u2715</button>';
    row.querySelector(".param-remove").addEventListener("click", function() {
      row.remove();
      if (container.querySelectorAll(".adhoc-param-row").length === 0) {
        addAdhocParamRow("", "");
      }
    });
    container.appendChild(row);
  }
  function collectAdhocParams() {
    var container = document.getElementById("adhocParamsContainer");
    if (!container) return void 0;
    var result = {};
    var count = 0;
    container.querySelectorAll(".adhoc-param-row").forEach(function(row) {
      var enable = row.querySelector(".param-enable").checked;
      var key = row.querySelector(".param-key").value.trim();
      var val = row.querySelector(".param-value").value;
      if (enable && key) {
        result[key] = val;
        count++;
      }
    });
    return count > 0 ? result : void 0;
  }
  function openAdhocModal(step, activeRuntime, currentScenario) {
    if (!step) return;
    var request = buildAdhocRequest(step, activeRuntime, currentScenario);
    adhocState.request = request;
    adhocState.result = null;
    adhocState.running = false;
    document.getElementById("adhocNameInput").value = request.name;
    document.getElementById("adhocMethodInput").value = request.method;
    document.getElementById("adhocPathInput").value = request.path;
    renderAdhocParamsRows(request.params);
    document.getElementById("adhocHeadersInput").value = safeJson(request.headers);
    document.getElementById("adhocBodyInput").value = request.body === null ? "" : safeJson(request.body);
    showAdhocError("");
    renderAdhocResult(null);
    syncAdhocFormDisabled(false);
    document.getElementById("adhocModal").classList.remove("hidden");
  }
  function closeAdhocModal() {
    if (adhocState.running) return;
    adhocState.request = null;
    document.getElementById("adhocModal").classList.add("hidden");
  }
  async function executeAdhocRequest(executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn, getGlobalsFn) {
    if (adhocState.running) return;
    try {
      var step = buildAdhocStep({
        name: document.getElementById("adhocNameInput").value,
        method: document.getElementById("adhocMethodInput").value,
        path: document.getElementById("adhocPathInput").value,
        params: collectAdhocParams(),
        headers: document.getElementById("adhocHeadersInput").value,
        body: document.getElementById("adhocBodyInput").value
      });
      var environment = getEnvFn ? getEnvFn() : null;
      var runtime = {
        vars: {},
        lastResponse: null,
        lastResponseBody: null,
        baseUrl: getBaseUrlFn ? getBaseUrlFn() : "",
        authorization: getAuthFn ? getAuthFn() : "",
        globals: getGlobalsFn ? getGlobalsFn() : [],
        environment: environment ? clone2(environment) : null,
        startedAt: Date.now(),
        abortController: new AbortController(),
        cancelled: false
      };
      adhocState.running = true;
      showAdhocError("");
      syncAdhocFormDisabled(true);
      var result = await executeStepFn(step, runtime, appConfig);
      adhocState.result = result;
      renderAdhocResult(result);
    } catch (error) {
      showAdhocError(error && error.message ? error.message : "\u4E34\u65F6\u8BF7\u6C42\u6267\u884C\u5931\u8D25");
    } finally {
      adhocState.running = false;
      syncAdhocFormDisabled(false);
    }
  }
  function bindAdhocRequestEvents(getStepByIdxFn, getRuntimeByIdxFn, executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn, getGlobalsFn) {
    document.getElementById("stepsList").addEventListener("click", function(event) {
      var button = event.target.closest("[data-adhoc-step]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      var index = Number(button.dataset.adhocStep);
      var step = getStepByIdxFn ? getStepByIdxFn(index) : null;
      var runtime = getRuntimeByIdxFn ? getRuntimeByIdxFn(index) : null;
      openAdhocModal(step, runtime);
    });
    document.getElementById("adhocCloseBtn").addEventListener("click", closeAdhocModal);
    document.getElementById("adhocCancelBtn").addEventListener("click", closeAdhocModal);
    document.getElementById("adhocExecuteBtn").addEventListener("click", function() {
      executeAdhocRequest(executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn, getGlobalsFn);
    });
    var addBtn = document.getElementById("adhocAddParamBtn");
    if (addBtn) {
      addBtn.addEventListener("click", function() {
        addAdhocParamRow("", "");
      });
    }
  }
  return {
    setConfig: function(config) {
      appConfig = config || {};
    },
    buildAdhocRequest,
    buildAdhocStep,
    openAdhocModal,
    closeAdhocModal,
    executeAdhocRequest,
    bindAdhocRequestEvents
  };
}();
var ui_adhoc_default = legacyAdhoc;

// src/browser/legacy/runtime.js
function createLegacyRuntime(options) {
  "use strict";
  var core = core_default;
  var uiStyle = ui_style_default;
  var uiView = ui_view_default;
  var uiAdhoc = ui_adhoc_default;
  var clone2 = core.clone;
  var isPlainObject2 = core.isPlainObject;
  var resolveString2 = core.resolveString;
  var resolve2 = core.resolve;
  var headerValue2 = core.headerValue;
  var hasHeader2 = core.hasHeader;
  var headersToObject2 = core.headersToObject;
  var joinUrl2 = core.joinUrl;
  var buildUrl2 = core.buildUrl;
  var parseBody2 = core.parseBody;
  var evaluateAssertion2 = core.evaluateAssertion;
  var buildAssertions2 = core.buildAssertions;
  var applyExtract2 = core.applyExtract;
  var assertNotReservedVar2 = core.assertNotReservedVar;
  var assertNoReservedVars2 = core.assertNoReservedVars;
  var md52 = core.md5;
  var esc = core.esc;
  var fmt = core.fmt;
  var safeJson = core.safeJson;
  var GLOBAL_TYPES2 = ["header", "cookie", "query"];
  var HEADER_VALUE_OPTIONS = {
    "Authorization": ["Bearer {{vars.token}}", "Token {{vars.token}}", "Basic dXNlcjpwYXNz"],
    "Content-Type": ["application/json", "application/x-www-form-urlencoded", "multipart/form-data", "text/plain", "application/xml"],
    "Accept": ["application/json", "text/plain", "*/*", "application/xml"],
    "Accept-Language": ["zh-CN", "zh-CN,zh;q=0.9", "en-US", "en"],
    "Cache-Control": ["no-cache", "no-store", "max-age=0"],
    "X-Request-Id": ["{{vars.runId}}", "{{vars.runNo}}"]
  };
  var globalValueListSeq = 0;
  function mergeGlobals2() {
    var lists = Array.prototype.slice.call(arguments);
    var merged = {};
    for (var i = 0; i < lists.length; i += 1) {
      var list = lists[i];
      if (!Array.isArray(list)) continue;
      for (var j = 0; j < list.length; j += 1) {
        var item = list[j];
        if (!item || GLOBAL_TYPES2.indexOf(item.type) < 0 || typeof item.name !== "string" || !item.name.trim()) continue;
        merged[item.type + ":" + item.name] = {
          type: item.type,
          name: item.name,
          value: item.value == null ? "" : String(item.value)
        };
      }
    }
    return Object.keys(merged).map(function(key) {
      return merged[key];
    });
  }
  var appConfig = options.config || {};
  var getRegisteredScenario = options.getScenario || function() {
    return null;
  };
  if (uiAdhoc.setConfig) uiAdhoc.setConfig(appConfig);
  window.__R = {
    toggle: function(el, event) {
      if (event && event.target.closest("button")) return;
      var selection = window.getSelection && window.getSelection();
      if (selection && !selection.isCollapsed && selection.toString().trim()) return;
      var panel = el.nextElementSibling;
      var chevron = el.querySelector(".chevron");
      if (panel.classList.contains("open")) {
        panel.classList.remove("open");
        if (chevron) chevron.classList.remove("rotate-180");
      } else {
        panel.classList.add("open");
        if (chevron) chevron.classList.add("rotate-180");
      }
    },
    filter: function(type) {
      document.querySelectorAll(".filter-btn").forEach(function(b) {
        var active = b.dataset.f === type;
        var activeCls = "";
        if (type === "all") activeCls = "font-bold text-blue-700 bg-white border border-blue-200 rounded shadow-sm";
        else if (type === "pass") activeCls = "font-bold text-emerald-700 bg-white border border-emerald-200 rounded shadow-sm";
        else if (type === "fail") activeCls = "font-bold text-rose-700 bg-white border border-rose-200 rounded shadow-sm";
        else if (type === "skip") activeCls = "font-bold text-slate-700 bg-white border border-slate-300 rounded shadow-sm";
        b.className = "filter-btn px-3 py-1 text-xs " + (active ? activeCls : "font-medium text-slate-600 hover:bg-white rounded");
      });
      document.querySelectorAll("#stepsList li").forEach(function(li) {
        var passed = li.dataset.passed === "true";
        var skipped = li.dataset.skipped === "true";
        var visible = type === "all" || type === "pass" && passed && !skipped || type === "fail" && !passed || type === "skip" && skipped;
        li.style.display = visible ? "" : "none";
      });
    },
    search: function(q) {
      var lower = q.toLowerCase();
      document.querySelectorAll("#stepsList li").forEach(function(li) {
        li.style.display = li.dataset.search.includes(lower) ? "" : "none";
      });
    }
  };
  var state = {
    scenario: null,
    scenarioFile: "",
    scenarioScript: null,
    steps: [],
    running: false,
    activeRuntime: null,
    executionMode: "idle",
    stepRuntime: null,
    stepCheckpoints: [],
    debugRuntimes: [],
    nextStepIndex: 0,
    scenarioSearch: "",
    discoveredFiles: [],
    lastReport: null
  };
  function getStorageKeys() {
    var cfg = appConfig;
    var keys = cfg.storageKeys || {};
    return {
      baseUrl: keys.baseUrl || "scenario.testing.baseUrl",
      authorization: keys.authorization || "scenario.testing.authorization",
      globals: keys.globals || "scenario.testing.globals",
      environment: keys.environment || "scenario.testing.environment",
      theme: keys.theme || "scenario.testing.theme",
      scenarioVars: keys.scenarioVars || "scenario.testing.scenarioVars",
      pinnedScenarios: keys.pinnedScenarios || "scenario.testing.pinnedScenarios"
    };
  }
  function getEnvironments() {
    var cfg = appConfig;
    return (Array.isArray(cfg.envs) ? cfg.envs : []).filter(function(env) {
      return env && env.key;
    });
  }
  function getDefaultEnvironment() {
    var cfg = appConfig;
    var environments = getEnvironments();
    var defaultKey = cfg.defaultEnvKey;
    return environments.filter(function(env) {
      return env.key === defaultKey;
    })[0] || environments[0] || null;
  }
  function getSelectedEnvironment() {
    var keys = getStorageKeys();
    var environments = getEnvironments();
    var selectedKey = "";
    try {
      selectedKey = window.localStorage.getItem(keys.environment) || "";
    } catch (e) {
      selectedKey = "";
    }
    return environments.filter(function(env) {
      return env.key === selectedKey;
    })[0] || getDefaultEnvironment();
  }
  function getEnvironmentStorageKey(key, environment) {
    return key + "." + (environment ? environment.key : "default");
  }
  function getPinnedScenarioFiles() {
    try {
      var value = JSON.parse(window.localStorage.getItem(getStorageKeys().pinnedScenarios) || "[]");
      return Array.isArray(value) ? value.filter(function(file) {
        return typeof file === "string";
      }) : [];
    } catch (e) {
      return [];
    }
  }
  function toggleScenarioPin(file) {
    var pins = getPinnedScenarioFiles();
    var index = pins.indexOf(file);
    if (index >= 0) pins.splice(index, 1);
    else pins.unshift(file);
    persistSetting(getStorageKeys().pinnedScenarios, JSON.stringify(pins));
    renderScenarioSelect();
  }
  function getScenarioVariableDefinitions() {
    var definitions = {};
    (Array.isArray(appConfig.variables) ? appConfig.variables : []).forEach(function(definition) {
      if (!definition || !definition.name) return;
      definitions[definition.name] = {
        name: definition.name,
        label: definition.label || definition.name,
        required: Boolean(definition.required)
      };
    });
    if (state.scenario && isPlainObject2(state.scenario.envVars)) {
      Object.keys(state.scenario.envVars).forEach(function(name) {
        definitions[name] = Object.assign({}, definitions[name] || {}, {
          name,
          label: state.scenario.envVars[name] || name,
          required: true
        });
      });
    }
    return Object.keys(definitions).map(function(name) {
      return definitions[name];
    });
  }
  function getScenarioVariableStorageKey(name, environment) {
    var keys = getStorageKeys();
    return getEnvironmentStorageKey(keys.scenarioVars + "." + name, environment);
  }
  function getConfiguredScenarioVariables() {
    var config = appConfig;
    return isPlainObject2(config.scenarioVars) ? config.scenarioVars : {};
  }
  function getStoredScenarioVariables() {
    var environment = getSelectedEnvironment();
    var configuredVariables = getConfiguredScenarioVariables();
    return getScenarioVariableDefinitions().reduce(function(vars, def) {
      try {
        vars[def.name] = window.localStorage.getItem(getScenarioVariableStorageKey(def.name, environment)) || configuredVariables[def.name] || "";
      } catch (e) {
        vars[def.name] = configuredVariables[def.name] || "";
      }
      return vars;
    }, {});
  }
  function persistScenarioVariables() {
    var environment = getSelectedEnvironment();
    getScenarioVariableDefinitions().forEach(function(def) {
      var input = document.getElementById("scenarioVar_" + def.name);
      persistSetting(getScenarioVariableStorageKey(def.name, environment), input ? String(input.value || "").trim() : "");
    });
  }
  function getScenarioVariableValues() {
    var stored = getStoredScenarioVariables();
    getScenarioVariableDefinitions().forEach(function(def) {
      var input = document.getElementById("scenarioVar_" + def.name);
      if (input) stored[def.name] = String(input.value || "").trim();
    });
    return stored;
  }
  function getEffectiveBaseUrl() {
    var cfg = appConfig;
    var keys = getStorageKeys();
    var environment = getSelectedEnvironment();
    var stored = "";
    try {
      stored = window.localStorage.getItem(getEnvironmentStorageKey(keys.baseUrl, environment)) || "";
    } catch (e) {
      stored = "";
    }
    return String(stored || environment && environment.baseUrl || cfg.baseUrl || window.location.origin || "").replace(/\/+$/, "");
  }
  function getEffectiveAuthorization() {
    var cfg = appConfig;
    var keys = getStorageKeys();
    var environment = getSelectedEnvironment();
    try {
      return window.localStorage.getItem(getEnvironmentStorageKey(keys.authorization, environment)) || environment && environment.authorization || cfg.authorization || "";
    } catch (e) {
      return environment && environment.authorization || cfg.authorization || "";
    }
  }
  function getEffectiveGlobals() {
    var cfg = appConfig;
    var keys = getStorageKeys();
    var environment = getSelectedEnvironment();
    var stored = [];
    try {
      var raw = window.localStorage.getItem(getEnvironmentStorageKey(keys.globals, environment));
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) stored = parsed;
      }
    } catch (e) {
      stored = [];
    }
    var merged = mergeGlobals2(cfg.globals, environment && environment.globals, stored);
    var authorization = getEffectiveAuthorization();
    if (authorization && !merged.some(function(g) {
      return g.type === "header" && g.name.toLowerCase() === "authorization";
    })) {
      merged = merged.concat([{ type: "header", name: "Authorization", value: authorization }]);
    }
    return merged;
  }
  function persistSetting(key, value) {
    try {
      if (!value) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25", e);
    }
  }
  function getEffectiveTheme() {
    try {
      return window.localStorage.getItem(getStorageKeys().theme) || "default";
    } catch (e) {
      return "default";
    }
  }
  function createUuidHex() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID().replace(/-/g, "");
    if (window.crypto && window.crypto.getRandomValues) {
      var values = new Uint32Array(4);
      window.crypto.getRandomValues(values);
      return Array.prototype.map.call(values, function(value) {
        return ("00000000" + value.toString(16)).slice(-8);
      }).join("");
    }
    return String(Date.now()) + String(Math.random()).slice(2);
  }
  function createRunIdentifiers2() {
    var timestamp = String(Date.now());
    var random = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID().replace(/-/g, "").slice(0, 8) : Math.random().toString(16).slice(2, 10).padEnd(8, "0");
    return {
      runId: timestamp + "-" + random,
      runNo: timestamp.slice(-6) + "-" + random.slice(0, 4)
    };
  }
  function buildScenarioRuntimeVars() {
    var cfg = appConfig;
    var scenario = state.scenario || {};
    var scenarioVars = getScenarioVariableValues();
    var missing = getScenarioVariableDefinitions().filter(function(def) {
      return def.required && !scenarioVars[def.name];
    });
    if (missing.length) {
      throw new Error("\u7F3A\u5C11\u573A\u666F\u51ED\u636E\uFF1A" + missing.map(function(def) {
        return def.label;
      }).join("\u3001") + "\u3002\u8BF7\u5728\u201C\u914D\u7F6E\u53C2\u6570 \u2192 \u5F53\u524D\u573A\u666F\u51ED\u636E\u201D\u4E2D\u586B\u5199\u5E76\u4FDD\u5B58\u3002");
    }
    var identifiers = createRunIdentifiers2();
    assertNoReservedVars2(scenario.vars, "\u573A\u666F vars");
    assertNoReservedVars2(cfg.vars, "\u914D\u7F6E vars");
    assertNoReservedVars2(scenarioVars, "\u9875\u9762\u573A\u666F\u53D8\u91CF");
    var vars = Object.assign({}, scenario.vars || {}, cfg.vars || {}, scenarioVars, identifiers);
    (scenario.generatedVars || []).forEach(function(def) {
      if (!def || !def.name) return;
      assertNotReservedVar2(def.name, "generatedVars");
      if (def.type === "timestamp") {
        vars[def.name] = Date.now();
        return;
      }
      if (def.type === "uuidHex") {
        vars[def.name] = createUuidHex();
        return;
      }
      if (def.type === "md5") {
        var source = (def.parts || []).map(function(name) {
          return vars[name] == null ? "" : String(vars[name]);
        }).join("");
        vars[def.name] = md52(source);
        return;
      }
      if (def.type === "signature") {
        var params = {};
        var paramKeys = Object.keys(def.params || {});
        paramKeys.forEach(function(key) {
          var varName = def.params[key];
          params[key] = vars[varName];
        });
        var secretVal = vars[def.secretVar || "apiSecret"];
        vars[def.name] = core.generateSignature(params, secretVal);
        return;
      }
      throw new Error("\u4E0D\u652F\u6301\u7684 generatedVars \u7C7B\u578B: " + def.type);
    });
    return vars;
  }
  function renderScenarioSelect() {
    uiView.renderScenarioSelect(state.discoveredFiles, state.scenarioFile, state.scenarioSearch, getPinnedScenarioFiles());
  }
  function renderStepsAll() {
    uiView.renderStepsAll(state.steps, state.scenario && state.scenario.steps ? state.scenario.steps : [], state.executionMode);
  }
  function renderStatsAll(iterations) {
    uiView.renderStatsAll(state.steps, iterations);
  }
  function renderFilterAll() {
    uiView.renderFilterAll(state.steps);
  }
  function renderReportPanel() {
    state.lastReport = uiView.renderReportPanel(state.steps, state.scenario, state.scenarioFile, state.executionMode, getSelectedEnvironment());
  }
  function expandStepDetails(stepIndex) {
    var items = document.querySelectorAll("#stepsList li");
    var item = items[stepIndex];
    if (!item) return;
    var panel = item.querySelector(".details-panel");
    var chevron = item.querySelector(".chevron");
    if (panel) panel.classList.add("open");
    if (chevron) chevron.classList.add("rotate-180");
  }
  async function withRuntimeTimeout(operation, runtime, timeoutMs) {
    var timedOut = false;
    var timer = setTimeout(function() {
      timedOut = true;
      runtime.abortController.abort();
    }, timeoutMs);
    try {
      return await operation();
    } catch (error) {
      var executionError = new Error(error && error.message ? error.message : "\u8BF7\u6C42\u6267\u884C\u5931\u8D25");
      executionError.scenarioTimedOut = timedOut;
      executionError.originalError = error;
      throw executionError;
    } finally {
      clearTimeout(timer);
    }
  }
  function waitForRetry(intervalMs, runtime) {
    return new Promise(function(resolveWait, rejectWait) {
      if (runtime.abortController.signal.aborted) {
        rejectWait(new Error("\u6267\u884C\u5DF2\u53D6\u6D88"));
        return;
      }
      var timer = setTimeout(function() {
        runtime.abortController.signal.removeEventListener("abort", onAbort);
        resolveWait();
      }, intervalMs);
      function onAbort() {
        clearTimeout(timer);
        rejectWait(new Error("\u6267\u884C\u5DF2\u53D6\u6D88"));
      }
      runtime.abortController.signal.addEventListener("abort", onAbort, { once: true });
    });
  }
  async function executeStep(step, runtime, cfg) {
    if (step.when !== void 0) {
      var shouldRun = typeof step.when === "object" ? evaluateAssertion2(step.when, { status: 0, headers: {}, body: null, bodyText: "" }, runtime, { stepName: step.name }).passed : Boolean(resolve2(step.when, runtime));
      if (!shouldRun) {
        return {
          name: step.name || "\u672A\u547D\u540D\u6B65\u9AA4",
          method: "SKIP",
          path: resolveString2(step.path || "", runtime) || "",
          status: "SKIPPED",
          duration: 0,
          passed: true,
          skipped: true,
          error: "",
          warnings: [],
          assertions: [],
          request: null,
          response: null
        };
      }
    }
    var request = resolve2(clone2(step.request || {}), runtime) || {};
    var method = String(step.method || request.method || "GET").toUpperCase();
    var rawPath = step.path || request.path || "";
    var rawParams = step.params || request.params;
    var path7 = buildUrl2(rawPath, rawParams, runtime);
    var headers = request.headers && isPlainObject2(request.headers) ? request.headers : {};
    var absoluteUrl = /^https?:\/\//i.test(path7);
    var allowEnvironmentAuthorization = !absoluteUrl || request.useEnvironmentAuthorization === true;
    var globals = runtime.globals || [];
    if (allowEnvironmentAuthorization && globals.length) {
      var existingKeys = {};
      var queryIndex = path7.indexOf("?");
      if (queryIndex >= 0) {
        path7.slice(queryIndex + 1).split("&").forEach(function(pair) {
          var key = pair.split("=")[0];
          if (key) existingKeys[decodeURIComponent(key)] = true;
        });
      }
      var queryPairs = [];
      globals.forEach(function(g) {
        if (g.type !== "query" || existingKeys[g.name]) return;
        queryPairs.push(encodeURIComponent(g.name) + "=" + encodeURIComponent(String(resolveString2(g.value, runtime))));
      });
      if (queryPairs.length) path7 = path7 + (queryIndex >= 0 ? "&" : "?") + queryPairs.join("&");
      var cookieParts = globals.filter(function(g) {
        return g.type === "cookie";
      }).map(function(g) {
        return g.name + "=" + resolveString2(g.value, runtime);
      });
      if (cookieParts.length) {
        var cookieKey = null;
        Object.keys(headers).forEach(function(key) {
          if (key.toLowerCase() === "cookie") cookieKey = key;
        });
        if (cookieKey) headers[cookieKey] = headers[cookieKey] + "; " + cookieParts.join("; ");
        else headers.Cookie = cookieParts.join("; ");
      }
      globals.forEach(function(g) {
        if (g.type !== "header" || hasHeader2(headers, g.name)) return;
        headers[g.name] = resolveString2(g.value, runtime);
      });
    }
    var authorization = runtime.authorization;
    if (authorization && allowEnvironmentAuthorization && !hasHeader2(headers, "Authorization")) {
      headers.Authorization = authorization;
    }
    var bodyData = request.body;
    var fetchOptions = { method, headers, signal: runtime.abortController.signal };
    if (request.credentials !== void 0) fetchOptions.credentials = request.credentials;
    if (request.redirect !== void 0) fetchOptions.redirect = request.redirect;
    if (bodyData !== void 0 && bodyData !== null && method !== "GET" && method !== "HEAD") {
      if (typeof bodyData === "string") {
        fetchOptions.body = bodyData;
      } else {
        if (!hasHeader2(headers, "Content-Type")) {
          headers["Content-Type"] = "application/json";
        }
        fetchOptions.body = JSON.stringify(bodyData);
      }
    }
    var startedAt = performance.now();
    var timeoutMs = Number(step.timeoutMs || request.timeoutMs || cfg.requestTimeoutMs || 3e4);
    if (!isFinite(timeoutMs) || timeoutMs <= 0) timeoutMs = 3e4;
    async function sendRequest() {
      var fetchResult = await withRuntimeTimeout(async function() {
        var response2 = await fetch(joinUrl2(runtime.baseUrl, path7), fetchOptions);
        return { response: response2, text: await response2.text() };
      }, runtime, timeoutMs);
      var response = fetchResult.response;
      var responseHeaders = headersToObject2(response.headers);
      return {
        status: response.status,
        headers: responseHeaders,
        body: parseBody2(fetchResult.text, headerValue2(responseHeaders, "content-type")),
        bodyText: fetchResult.text
      };
    }
    try {
      var responseData = await sendRequest();
      var headerObj = responseData.headers;
      var body = responseData.body;
      var stepWarnings = [];
      runtime.lastResponse = responseData;
      runtime.lastResponseBody = body;
      var extractResult = applyExtract2(step, responseData, runtime);
      stepWarnings = extractResult.warnings;
      var assertions = buildAssertions2(step, responseData, runtime, { stepName: step.name });
      if (extractResult.failures.length) assertions.push.apply(assertions, extractResult.failures);
      var failedAssertion = assertions.find(function(item) {
        return !item.passed;
      });
      var requestAttempts = 1;
      if (failedAssertion && step.retryUntil) {
        var maxAttempts = Number(step.retryUntil.maxAttempts || 10);
        var intervalMs = Number(step.retryUntil.intervalMs || 2e3);
        if (!isFinite(maxAttempts) || maxAttempts < 1) maxAttempts = 10;
        if (!isFinite(intervalMs) || intervalMs < 0) intervalMs = 2e3;
        for (var retryIndex = 1; retryIndex <= maxAttempts; retryIndex += 1) {
          await waitForRetry(intervalMs, runtime);
          responseData = await sendRequest();
          requestAttempts = retryIndex + 1;
          headerObj = responseData.headers;
          body = responseData.body;
          runtime.lastResponse = responseData;
          runtime.lastResponseBody = body;
          extractResult = applyExtract2(step, responseData, runtime);
          stepWarnings = extractResult.warnings;
          assertions = buildAssertions2(step, responseData, runtime, { stepName: step.name });
          if (extractResult.failures.length) assertions.push.apply(assertions, extractResult.failures);
          failedAssertion = assertions.find(function(item) {
            return !item.passed;
          });
          if (!failedAssertion) {
            return {
              name: step.name,
              method,
              path: path7,
              status: responseData.status,
              duration: performance.now() - startedAt,
              attempts: requestAttempts,
              passed: true,
              error: "",
              warnings: stepWarnings,
              request: { headers, body: bodyData },
              response: { headers: headerObj, body, bodyText: responseData.bodyText },
              assertions
            };
          }
        }
      }
      return {
        name: step.name,
        method,
        path: path7,
        status: responseData.status,
        duration: performance.now() - startedAt,
        attempts: requestAttempts,
        passed: !failedAssertion,
        error: failedAssertion ? failedAssertion.name : "",
        warnings: stepWarnings,
        request: { headers, body: bodyData },
        response: { headers: headerObj, body, bodyText: responseData.bodyText },
        assertions
      };
    } catch (error) {
      var cancelled = runtime.cancelled;
      var timedOut = error && error.scenarioTimedOut;
      var errorMessage = cancelled ? "\u7528\u6237\u5DF2\u53D6\u6D88\u6267\u884C" : timedOut ? "\u8BF7\u6C42\u8D85\u65F6\uFF08" + timeoutMs + "ms\uFF09" : error && error.message ? error.message : "\u8BF7\u6C42\u6267\u884C\u5931\u8D25";
      return {
        name: step.name,
        method,
        path: path7,
        status: cancelled ? "CANCELLED" : timedOut ? "TIMEOUT" : "ERROR",
        duration: performance.now() - startedAt,
        attempts: requestAttempts || 1,
        passed: false,
        cancelled,
        timedOut,
        error: errorMessage,
        warnings: [],
        request: { headers, body: bodyData },
        response: { headers: {}, body: null },
        assertions: [{ name: cancelled ? "\u6267\u884C\u672A\u53D6\u6D88" : timedOut ? "\u8BF7\u6C42\u672A\u8D85\u65F6" : "\u8BF7\u6C42\u6267\u884C\u6210\u529F", passed: false, actual: errorMessage, expected: "\u65E0\u5F02\u5E38" }]
      };
    }
  }
  function createExecutionRuntime() {
    var environment = getSelectedEnvironment();
    var runtime = {
      vars: buildScenarioRuntimeVars(),
      lastResponse: null,
      lastResponseBody: null,
      baseUrl: getEffectiveBaseUrl(),
      authorization: getEffectiveAuthorization(),
      globals: getEffectiveGlobals(),
      environment: environment ? clone2(environment) : null,
      startedAt: Date.now(),
      abortController: new AbortController(),
      cancelled: false
    };
    persistScenarioVariables();
    return runtime;
  }
  function snapshotStepRuntime(runtime) {
    return {
      vars: clone2(runtime.vars),
      lastResponse: clone2(runtime.lastResponse),
      lastResponseBody: clone2(runtime.lastResponseBody)
    };
  }
  function rememberDebugRuntime(stepIndex, runtime) {
    state.debugRuntimes[stepIndex] = snapshotStepRuntime(runtime);
  }
  function getDebugRuntime(stepIndex) {
    var snapshot = state.debugRuntimes[stepIndex];
    if (!snapshot) return null;
    return {
      vars: clone2(snapshot.vars),
      lastResponse: clone2(snapshot.lastResponse),
      lastResponseBody: clone2(snapshot.lastResponseBody)
    };
  }
  function restoreStepRuntime(runtime, snapshot) {
    runtime.vars = clone2(snapshot.vars);
    runtime.lastResponse = clone2(snapshot.lastResponse);
    runtime.lastResponseBody = clone2(snapshot.lastResponseBody);
    runtime.abortController = new AbortController();
    runtime.cancelled = false;
  }
  function refreshStepSessionView() {
    renderStatsAll(state.scenario && state.scenario.iterations || { run: 1, failed: 0 });
    renderFilterAll();
    renderStepsAll();
    renderReportPanel();
  }
  function rewindToStep(stepIndex) {
    if (state.running || state.executionMode !== "step" || !state.stepRuntime || !state.stepCheckpoints[stepIndex]) return false;
    restoreStepRuntime(state.stepRuntime, state.stepCheckpoints[stepIndex]);
    state.steps = state.steps.slice(0, stepIndex);
    state.stepCheckpoints = state.stepCheckpoints.slice(0, stepIndex + 1);
    state.debugRuntimes = state.debugRuntimes.slice(0, stepIndex);
    state.nextStepIndex = stepIndex;
    state.lastReport = null;
    refreshStepSessionView();
    uiView.setRunState("idle", "\u5DF2\u56DE\u9000\u5230\u7B2C " + (stepIndex + 1) + " \u6B65");
    return true;
  }
  function rerunStep(stepIndex) {
    if (rewindToStep(stepIndex)) runNextStep();
  }
  function setExecutionButtonsDisabled(disabled) {
    var runBtn = document.getElementById("runBtn");
    var fullRunActive = disabled && state.executionMode === "full";
    runBtn.disabled = disabled;
    runBtn.textContent = fullRunActive ? "\u6267\u884C\u4E2D\u2026" : "\u6267\u884C\u5168\u90E8";
    runBtn.classList.toggle("scenario-header-button--running", fullRunActive);
    runBtn.setAttribute("aria-busy", fullRunActive ? "true" : "false");
    document.getElementById("stepBtn").disabled = disabled;
    var resetBtn = document.getElementById("resetBtn");
    if (resetBtn) resetBtn.disabled = disabled;
    document.getElementById("cancelBtn").disabled = !disabled;
    ["environmentSelect", "configToggleBtn"].forEach(function(id) {
      var element = document.getElementById(id);
      if (element) element.disabled = disabled;
    });
    document.querySelectorAll("#configModal input, #configModal select, #configModal button").forEach(function(element) {
      element.disabled = disabled;
    });
  }
  function cancelExecution() {
    var runtime = state.activeRuntime || state.stepRuntime;
    if (!state.running || !runtime || !runtime.abortController) return;
    runtime.cancelled = true;
    runtime.abortController.abort();
    uiView.setRunState("cancelled", "\u6B63\u5728\u53D6\u6D88");
  }
  function resetExecution() {
    if (state.running) return;
    state.steps = [];
    state.stepRuntime = null;
    state.stepCheckpoints = [];
    state.debugRuntimes = [];
    state.activeRuntime = null;
    state.nextStepIndex = 0;
    state.lastReport = null;
    state.executionMode = "full";
    renderStatsAll(state.scenario && state.scenario.iterations || { run: 1, failed: 0 });
    renderFilterAll();
    renderStepsAll();
    renderReportPanel();
    uiView.setRunState("idle", "\u5F85\u6267\u884C");
  }
  function showExecutionConfigError(error) {
    var message = error && error.message ? String(error.message) : "\u6267\u884C\u524D\u68C0\u67E5\u5931\u8D25";
    var runState = /缺少场景凭据|配置/.test(message) ? "\u914D\u7F6E\u7F3A\u5931" : "\u6267\u884C\u524D\u5931\u8D25";
    uiView.setRunState("failed", runState);
    document.getElementById("reportPanel").innerHTML = '<div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">' + esc(message) + "</div>";
  }
  function finishExecutionState(runtime) {
    if (runtime && runtime.cancelled) {
      uiView.setRunState("cancelled", "\u5DF2\u53D6\u6D88");
      renderReportPanel();
      return;
    }
    var skipped = state.steps.filter(function(item) {
      return item.skipped;
    }).length;
    var failed = state.steps.filter(function(item) {
      return !item.skipped && !item.passed;
    }).length;
    var executed = state.steps.length - skipped;
    uiView.setRunState(failed ? "failed" : executed === 0 ? "skipped" : "success", failed ? "\u5B58\u5728\u5931\u8D25" : executed === 0 ? "\u5168\u90E8\u8DF3\u8FC7" : "\u6267\u884C\u6210\u529F");
    renderReportPanel();
  }
  async function runScenario2() {
    if (!state.scenario || state.running) return;
    var cfg = appConfig;
    var runtime;
    try {
      runtime = createExecutionRuntime();
    } catch (error) {
      showExecutionConfigError(error);
      return;
    }
    var list = Array.isArray(state.scenario.steps) ? state.scenario.steps : [];
    var iterations = state.scenario.iterations || { run: 1, failed: 0 };
    var failurePolicy = state.scenario.failurePolicy || "stop";
    state.running = true;
    state.activeRuntime = runtime;
    state.executionMode = "full";
    state.stepRuntime = null;
    state.stepCheckpoints = [];
    state.debugRuntimes = [];
    state.nextStepIndex = 0;
    state.steps = [];
    state.lastReport = null;
    setExecutionButtonsDisabled(true);
    uiView.setRunState("running", "\u6267\u884C\u4E2D");
    try {
      for (var i = 0; i < list.length; i += 1) {
        rememberDebugRuntime(i, runtime);
        var result = await executeStep(list[i], runtime, cfg);
        result.stepNo = i + 1;
        state.steps.push(result);
        renderStatsAll(iterations);
        renderFilterAll();
        renderStepsAll();
        renderReportPanel();
        if (!result.passed && (failurePolicy !== "continue" || runtime.abortController.signal.aborted)) break;
      }
      finishExecutionState(runtime);
    } catch (error) {
      uiView.setRunState("failed", "\u6267\u884C\u5F02\u5E38");
      document.getElementById("reportPanel").innerHTML = '<div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">' + esc(error.message || error) + "</div>";
    } finally {
      state.running = false;
      state.activeRuntime = null;
      setExecutionButtonsDisabled(false);
    }
  }
  async function runNextStep() {
    if (!state.scenario || state.running) return;
    var cfg = appConfig;
    var list = Array.isArray(state.scenario.steps) ? state.scenario.steps : [];
    if (!list.length) return;
    if (!state.stepRuntime || state.nextStepIndex >= list.length) {
      try {
        state.stepRuntime = createExecutionRuntime();
      } catch (error) {
        showExecutionConfigError(error);
        return;
      }
      state.nextStepIndex = 0;
      state.steps = [];
      state.stepCheckpoints = [snapshotStepRuntime(state.stepRuntime)];
      state.debugRuntimes = [];
      state.lastReport = null;
    }
    var runtime = state.stepRuntime;
    var stepIndex = state.nextStepIndex;
    state.running = true;
    state.activeRuntime = runtime;
    state.executionMode = "step";
    setExecutionButtonsDisabled(true);
    uiView.setRunState("running", "\u6267\u884C\u7B2C " + (stepIndex + 1) + " \u6B65");
    uiView.setStepLoading(true, "\u6B63\u5728\u6267\u884C\u7B2C " + (stepIndex + 1) + " \u6B65\uFF1A" + (list[stepIndex].name || "\u672A\u547D\u540D\u6B65\u9AA4"));
    try {
      rememberDebugRuntime(stepIndex, runtime);
      var result = await executeStep(list[stepIndex], runtime, cfg);
      result.stepNo = stepIndex + 1;
      state.steps.push(result);
      state.nextStepIndex += 1;
      state.stepCheckpoints[state.nextStepIndex] = snapshotStepRuntime(runtime);
      renderStatsAll(state.scenario.iterations || { run: 1, failed: 0 });
      renderFilterAll();
      renderStepsAll();
      expandStepDetails(stepIndex);
      renderReportPanel();
      if (runtime.cancelled || result.timedOut) {
        state.stepRuntime = null;
        finishExecutionState(runtime);
      } else if (state.nextStepIndex >= list.length) {
        finishExecutionState(runtime);
      } else {
        uiView.setRunState(result.passed ? "idle" : "failed", (result.passed ? "\u5F85\u6267\u884C\u7B2C " : "\u7B2C " + (stepIndex + 1) + " \u6B65\u5931\u8D25\uFF0C\u4E0B\u4E00\u6B65\u4E3A\u7B2C ") + (state.nextStepIndex + 1) + " \u6B65");
      }
    } catch (error) {
      state.stepRuntime = null;
      uiView.setRunState("failed", "\u6267\u884C\u5F02\u5E38");
      document.getElementById("reportPanel").innerHTML = '<div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">' + esc(error.message || error) + "</div>";
    } finally {
      uiView.setStepLoading(false);
      state.running = false;
      state.activeRuntime = null;
      setExecutionButtonsDisabled(false);
    }
  }
  function renderEnvironmentSelects() {
    var environments = getEnvironments();
    var selectedEnv = getSelectedEnvironment();
    var selectedKey = selectedEnv ? selectedEnv.key : "";
    ["environmentSelect", "environmentInput"].forEach(function(id) {
      var select = document.getElementById(id);
      if (!select) return;
      select.innerHTML = environments.map(function(env) {
        var selectedAttr = env.key === selectedKey ? " selected" : "";
        return '<option value="' + esc(env.key) + '"' + selectedAttr + ">" + esc(env.name || env.key) + "</option>";
      }).join("");
    });
  }
  function renderScenarioVariableInputs() {
    var container = document.getElementById("scenarioVarsInput");
    if (!container) return;
    var defs = getScenarioVariableDefinitions();
    if (!defs.length) {
      container.innerHTML = '<div class="text-xs text-slate-400 col-span-2">\u672A\u58F0\u660E\u53EF\u914D\u7F6E\u53D8\u91CF</div>';
      return;
    }
    var stored = getStoredScenarioVariables();
    container.innerHTML = defs.map(function(def) {
      var value = stored[def.name] || "";
      return '<label class="flex flex-col gap-1.5"><span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">' + esc(def.label) + " (" + esc(def.name) + ')</span><input id="scenarioVar_' + esc(def.name) + '" type="text" value="' + esc(value) + '" placeholder="\u8BF7\u8F93\u5165 ' + esc(def.label) + '" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"></label>';
    }).join("");
  }
  function buildGlobalInputAttrs(g, index) {
    if (g.type !== "header") return { nameList: "", valueList: "", valueDatalist: "" };
    var valueOptions = HEADER_VALUE_OPTIONS[g.name];
    var nameList = ' list="globalHeaderNameList"';
    if (!valueOptions || !valueOptions.length) return { nameList, valueList: "", valueDatalist: "" };
    var listId = "globalValueList_" + ++globalValueListSeq;
    var valueDatalist = '<datalist id="' + listId + '">' + valueOptions.map(function(value) {
      return '<option value="' + esc(value) + '"></option>';
    }).join("") + "</datalist>";
    return { nameList, valueList: ' list="' + listId + '"', valueDatalist };
  }
  function refreshHeaderValueDatalist(row, name) {
    var valueInput = row.querySelector(".global-value");
    var existing = row.querySelector(".global-value-datalist");
    var options2 = HEADER_VALUE_OPTIONS[name] || [];
    if (!options2.length) {
      if (existing) existing.remove();
      if (valueInput) valueInput.removeAttribute("list");
      return;
    }
    var listId = "globalValueList_" + ++globalValueListSeq;
    if (!existing) {
      existing = document.createElement("datalist");
      existing.className = "global-value-datalist";
      row.appendChild(existing);
    }
    existing.id = listId;
    existing.innerHTML = options2.map(function(value) {
      return '<option value="' + esc(value) + '"></option>';
    }).join("");
    if (valueInput) valueInput.setAttribute("list", listId);
  }
  function renderGlobalsInput() {
    var container = document.getElementById("globalsInput");
    if (!container) return;
    var globals = getEffectiveGlobals();
    container.innerHTML = globals.map(function(g, index) {
      var typeOptions = GLOBAL_TYPES2.map(function(type) {
        return '<option value="' + type + '"' + (g.type === type ? " selected" : "") + ">" + type + "</option>";
      }).join("");
      var attrs = buildGlobalInputAttrs(g, index);
      return '<div class="global-param-row flex items-center gap-2" data-index="' + index + '"><select class="global-type flex-shrink-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">' + typeOptions + '</select><input class="global-name flex-1 min-w-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"' + attrs.nameList + ' placeholder="\u53C2\u6570\u540D" value="' + esc(g.name) + '" /><input class="global-value flex-1 min-w-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"' + attrs.valueList + ' placeholder="\u53C2\u6570\u503C\uFF0C\u652F\u6301 {{vars.xxx}}" value="' + esc(g.value) + '" /><button type="button" class="global-remove flex-shrink-0 px-2.5 py-2 rounded-md bg-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors" title="\u5220\u9664\u8BE5\u53C2\u6570">\u2715</button>' + attrs.valueDatalist + "</div>";
    }).join("");
  }
  function collectGlobalsFromInput() {
    var list = [];
    var rows = document.querySelectorAll("#globalsInput .global-param-row");
    rows.forEach(function(row) {
      var type = row.querySelector(".global-type").value;
      var name = String(row.querySelector(".global-name").value || "").trim();
      if (!name) return;
      list.push({ type, name, value: row.querySelector(".global-value").value });
    });
    return list;
  }
  function bindGlobalsEvents() {
    var addBtn = document.getElementById("addGlobalBtn");
    if (!addBtn) return;
    addBtn.addEventListener("click", function() {
      var container = document.getElementById("globalsInput");
      if (!container) return;
      var row = document.createElement("div");
      row.className = "global-param-row flex items-center gap-2";
      row.innerHTML = '<select class="global-type flex-shrink-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">' + GLOBAL_TYPES2.map(function(type) {
        return '<option value="' + type + '">' + type + "</option>";
      }).join("") + '</select><input class="global-name flex-1 min-w-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" list="globalHeaderNameList" placeholder="\u53C2\u6570\u540D" /><input class="global-value flex-1 min-w-0 px-2 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" placeholder="\u53C2\u6570\u503C\uFF0C\u652F\u6301 {{vars.xxx}}" /><button type="button" class="global-remove flex-shrink-0 px-2.5 py-2 rounded-md bg-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors" title="\u5220\u9664\u8BE5\u53C2\u6570">\u2715</button>';
      container.appendChild(row);
    });
    document.addEventListener("click", function(event) {
      var target = event.target;
      if (!target || !target.classList || !target.classList.contains("global-remove")) return;
      var row = target.closest(".global-param-row");
      if (row) row.parentNode.removeChild(row);
    });
    document.addEventListener("input", function(event) {
      var target = event.target;
      if (!target || !target.classList || !target.classList.contains("global-name")) return;
      var row = target.closest(".global-param-row");
      if (!row || row.querySelector(".global-type").value !== "header") return;
      refreshHeaderValueDatalist(row, String(target.value || "").trim());
    });
    document.addEventListener("change", function(event) {
      var target = event.target;
      if (!target || !target.classList || !target.classList.contains("global-type")) return;
      var row = target.closest(".global-param-row");
      if (!row) return;
      var nameInput = row.querySelector(".global-name");
      var valueInput = row.querySelector(".global-value");
      var existing = row.querySelector(".global-value-datalist");
      if (target.value === "header") {
        if (nameInput) nameInput.setAttribute("list", "globalHeaderNameList");
        if (valueInput) refreshHeaderValueDatalist(row, String(nameInput ? nameInput.value : "").trim());
      } else {
        if (nameInput) nameInput.removeAttribute("list");
        if (existing) existing.remove();
        if (valueInput) valueInput.removeAttribute("list");
      }
    });
  }
  function syncSettingsInputs() {
    var keys = getStorageKeys();
    var environment = getSelectedEnvironment();
    renderEnvironmentSelects();
    renderScenarioVariableInputs();
    renderGlobalsInput();
    var baseUrlInput = document.getElementById("baseUrlInput");
    try {
      if (baseUrlInput) baseUrlInput.value = window.localStorage.getItem(getEnvironmentStorageKey(keys.baseUrl, environment)) || "";
    } catch (e) {
      if (baseUrlInput) baseUrlInput.value = "";
    }
  }
  function updateHeader() {
    var titleNode = document.getElementById("scenarioTitle");
    var envNode = document.getElementById("envNameLabel");
    var baseLabel = document.getElementById("baseUrlLabel");
    var authLabel = document.getElementById("authLabel");
    var authValue = document.getElementById("authValue");
    var environment = getSelectedEnvironment();
    var title = state.scenario ? state.scenario.name || state.scenarioFile : "\u672A\u52A0\u8F7D\u573A\u666F";
    if (titleNode) titleNode.textContent = title;
    if (envNode) envNode.textContent = environment ? environment.name || environment.key : "\u9ED8\u8BA4\u73AF\u5883";
    var effectiveBaseUrl = getEffectiveBaseUrl();
    var globals = getEffectiveGlobals();
    if (baseLabel) baseLabel.textContent = effectiveBaseUrl || "(\u672A\u914D\u7F6E)";
    if (authLabel && authValue) {
      if (globals.length) {
        authLabel.style.display = "inline";
        var summary = globals.slice(0, 3).map(function(g) {
          return g.type + ":" + g.name;
        }).join(", ");
        authValue.textContent = summary + (globals.length > 3 ? " \u7B49 " + globals.length + " \u9879" : "");
        authLabel.title = safeJson(globals);
      } else {
        authLabel.style.display = "none";
        authValue.textContent = "";
        authLabel.title = "";
      }
    }
  }
  function bindThemeEvents() {
    var select = document.getElementById("themeSelect");
    if (!select) return;
    select.addEventListener("change", function(event) {
      persistSetting(getStorageKeys().theme, event.target.value);
      uiStyle.applyTheme(event.target.value);
      renderScenarioSelect();
    });
  }
  function bindSettingsEvents() {
    var envSelectHeader = document.getElementById("environmentSelect");
    var envSelectPanel = document.getElementById("environmentInput");
    var saveBtn = document.getElementById("saveSettingsBtn");
    var clearBtn = document.getElementById("clearSettingsBtn");
    var configToggleBtn = document.getElementById("configToggleBtn");
    var configCloseBtn = document.getElementById("configCloseBtn");
    var keys = getStorageKeys();
    var noticeTimer = null;
    function showSettingsNotice(message) {
      var notice = document.getElementById("settingsNotice");
      if (!notice) return;
      if (noticeTimer) window.clearTimeout(noticeTimer);
      notice.textContent = message;
      notice.classList.remove("hidden");
      noticeTimer = window.setTimeout(function() {
        notice.textContent = "";
        notice.classList.add("hidden");
      }, 2500);
    }
    function openConfigModal() {
      var modal = document.getElementById("configModal");
      if (!modal) return;
      syncSettingsInputs();
      modal.classList.remove("hidden");
    }
    function closeConfigModal() {
      var modal = document.getElementById("configModal");
      if (modal) modal.classList.add("hidden");
    }
    if (configToggleBtn) {
      configToggleBtn.addEventListener("click", openConfigModal);
    }
    if (configCloseBtn) {
      configCloseBtn.addEventListener("click", closeConfigModal);
    }
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") closeConfigModal();
    });
    document.getElementById("configModal").addEventListener("click", function(event) {
      if (event.target === document.getElementById("configModal")) closeConfigModal();
    });
    function selectEnvironment2(envKey) {
      persistSetting(keys.environment, envKey);
      syncSettingsInputs();
      updateHeader();
      renderStatsAll(state.scenario ? state.scenario.iterations : { run: 1, failed: 0 });
      renderFilterAll();
      renderStepsAll();
    }
    if (envSelectHeader) {
      envSelectHeader.addEventListener("change", function(e) {
        selectEnvironment2(e.target.value);
      });
    }
    if (envSelectPanel) {
      envSelectPanel.addEventListener("change", function(e) {
        selectEnvironment2(e.target.value);
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener("click", function() {
        var environment = getSelectedEnvironment();
        var baseUrlInput = document.getElementById("baseUrlInput");
        var baseUrl = String(baseUrlInput.value || "").trim().replace(/\/+$/, "");
        var globals = collectGlobalsFromInput();
        persistSetting(getEnvironmentStorageKey(keys.baseUrl, environment), baseUrl);
        persistSetting(getEnvironmentStorageKey(keys.globals, environment), globals.length ? JSON.stringify(globals) : "");
        persistScenarioVariables();
        updateHeader();
        showSettingsNotice("\u5F53\u524D\u73AF\u5883\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\u5E76\u751F\u6548");
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function() {
        var environment = getSelectedEnvironment();
        persistSetting(getEnvironmentStorageKey(keys.baseUrl, environment), "");
        persistSetting(getEnvironmentStorageKey(keys.globals, environment), "");
        getScenarioVariableDefinitions().forEach(function(def) {
          persistSetting(getScenarioVariableStorageKey(def.name, environment), "");
        });
        syncSettingsInputs();
        updateHeader();
        showSettingsNotice("\u5F53\u524D\u73AF\u5883\u8986\u76D6\u5DF2\u6E05\u9664\uFF0C\u5DF2\u6062\u590D\u914D\u7F6E\u503C");
      });
    }
  }
  function bindReportActions() {
    var copyMdBtn = document.getElementById("copyReportMarkdownBtn");
    var copyJsonBtn = document.getElementById("copyReportJsonBtn");
    if (copyMdBtn) {
      copyMdBtn.addEventListener("click", function() {
        if (!state.lastReport) return;
        var text = uiView.buildMarkdownReport(state.lastReport);
        core.copyText ? core.copyText(text) : navigator.clipboard.writeText(text);
      });
    }
    if (copyJsonBtn) {
      copyJsonBtn.addEventListener("click", function() {
        if (!state.lastReport) return;
        var text = safeJson(state.lastReport);
        core.copyText ? core.copyText(text) : navigator.clipboard.writeText(text);
      });
    }
  }
  function extractScenarioDisplayName(sourceText) {
    var text = String(sourceText || "");
    var head = text;
    var stepsAt = text.search(/\n\s*steps\s*:/);
    if (stepsAt >= 0) head = text.slice(0, stepsAt);
    var m = head.match(/\bname\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (m) return m[1].replace(/\\"/g, '"');
    m = head.match(/\bname\s*:\s*'((?:[^'\\]|\\.)*)'/);
    if (m) return m[1].replace(/\\'/g, "'");
    return null;
  }
  async function enrichDiscoveredScenarioNames() {
    var list = state.discoveredFiles;
    if (!list || !list.length) return;
    if (window.location.protocol === "file:") return;
    var results = await Promise.all(
      list.map(async function(item, i) {
        var path7 = String(item.file || "").replace(/^\.\//, "");
        if (!path7) return { i, displayName: null };
        var url = "./" + path7 + (path7.indexOf("?") >= 0 ? "&" : "?") + "ts=" + Date.now();
        try {
          var response = await fetch(url);
          if (!response.ok) throw new Error("fetch " + path7);
          var text = await response.text();
          return { i, displayName: extractScenarioDisplayName(text) };
        } catch (error) {
          return { i, displayName: null };
        }
      })
    );
    results.forEach(function(r) {
      var row = list[r.i];
      if (!row) return;
      if (r.displayName) {
        row.name = r.displayName;
      } else if (!row.name) {
        row.name = row.file;
      }
    });
  }
  async function fetchDiscoveredScenarios() {
    var cfg = appConfig;
    if (!Array.isArray(cfg.scenarios) || cfg.scenarios.length === 0) {
      return;
    }
    state.discoveredFiles = cfg.scenarios.map(function(entry) {
      if (typeof entry === "string") {
        return { name: entry, file: entry };
      }
      return {
        name: entry.name || entry.file || "",
        file: entry.file || entry.path || entry.url || ""
      };
    });
    await enrichDiscoveredScenarioNames();
    renderScenarioSelect();
  }
  function setScenarioQuery(file) {
    var url = new URL(window.location.href);
    url.searchParams.set("scenario", file);
    window.history.replaceState({}, "", url.toString());
  }
  function loadScenario(file) {
    return new Promise(function(resolveLoad, rejectLoad) {
      if (!file) {
        rejectLoad(new Error("\u672A\u6307\u5B9A\u6587\u4EF6"));
        return;
      }
      if (state.scenarioScript) {
        state.scenarioScript.remove();
        state.scenarioScript = null;
      }
      var script = document.createElement("script");
      script.src = "./" + file + "?ts=" + Date.now();
      script.onload = function() {
        state.scenarioScript = script;
        state.scenarioFile = file;
        var entry = (appConfig.scenarios || []).filter(function(item) {
          return (item.url || item.file || item.path) === file;
        })[0];
        var scenario = getRegisteredScenario(entry && entry.id);
        if (!scenario) {
          rejectLoad(new Error("\u573A\u666F\u6587\u4EF6\u5FC5\u987B\u901A\u8FC7 ScenarioTest.registerScenario \u6CE8\u518C: " + file));
          return;
        }
        state.scenario = clone2(scenario);
        state.steps = [];
        state.stepRuntime = null;
        state.stepCheckpoints = [];
        state.debugRuntimes = [];
        state.nextStepIndex = 0;
        state.lastReport = null;
        syncSettingsInputs();
        updateHeader();
        renderScenarioSelect();
        renderStatsAll(state.scenario.iterations || { run: 1, failed: 0 });
        renderFilterAll();
        renderStepsAll();
        uiView.setRunState("idle", "\u5F85\u6267\u884C");
        setScenarioQuery(file);
        resolveLoad(state.scenario);
      };
      script.onerror = function() {
        rejectLoad(new Error("\u573A\u666F\u6587\u4EF6\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u8DEF\u5F84\u662F\u5426\u6B63\u786E: " + file));
      };
      document.head.appendChild(script);
    });
  }
  function init() {
    uiStyle.injectStyles();
    uiView.buildSkeleton(options.mount);
    uiStyle.applyTheme(getEffectiveTheme());
    bindThemeEvents();
    syncSettingsInputs();
    bindSettingsEvents();
    bindGlobalsEvents();
    bindReportActions();
    uiAdhoc.bindAdhocRequestEvents(
      function(idx) {
        return state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[idx] : null;
      },
      getDebugRuntime,
      executeStep,
      getSelectedEnvironment,
      getEffectiveBaseUrl,
      getEffectiveAuthorization,
      getEffectiveGlobals
    );
    updateHeader();
    renderScenarioSelect();
    var stepsList = document.getElementById("stepsList");
    stepsList.addEventListener("click", function(event) {
      var target = event.target.closest("[data-step-action]");
      if (!target) return;
      var stepIndex = Number(target.dataset.stepIndex);
      if (!isFinite(stepIndex) || stepIndex < 0) return;
      if (target.dataset.stepAction === "rewind") rewindToStep(stepIndex);
      if (target.dataset.stepAction === "rerun") rerunStep(stepIndex);
    });
    var scenarioList = document.getElementById("scenarioList");
    scenarioList.addEventListener("click", function(event) {
      var pinTarget = event.target.closest("[data-pin-file]");
      if (pinTarget) {
        toggleScenarioPin(pinTarget.dataset.pinFile);
        return;
      }
      var target = event.target.closest("[data-scenario-file]");
      var file = target && target.dataset.scenarioFile;
      if (!file || state.running || file === state.scenarioFile) return;
      loadScenario(file).catch(function(error) {
        uiView.setRunState("failed", "\u52A0\u8F7D\u5931\u8D25");
        document.getElementById("statsPanel").innerHTML = '<div class="text-sm text-rose-500 p-4">' + esc(error.message) + "</div>";
      });
    });
    document.getElementById("scenarioSearchInput").addEventListener("input", function(event) {
      state.scenarioSearch = event.target.value;
      renderScenarioSelect();
    });
    document.getElementById("runBtn").addEventListener("click", runScenario2);
    document.getElementById("stepBtn").addEventListener("click", runNextStep);
    document.getElementById("resetBtn").addEventListener("click", resetExecution);
    document.getElementById("cancelBtn").addEventListener("click", cancelExecution);
    function tryLoadInitial() {
      var initial = new URLSearchParams(window.location.search).get("scenario");
      if (!initial && state.discoveredFiles && state.discoveredFiles.length > 0) {
        initial = state.discoveredFiles[0].file;
      }
      if (!initial) {
        document.getElementById("statsPanel").innerHTML = '<div class="text-sm text-slate-500 p-4">\u8BF7\u5728 URL \u4E2D\u63D0\u4F9B ?scenario=scenarios/xxx.js \u8BBF\u95EE\uFF0C\u6216\u8005\u5728\u4E0A\u65B9\u9009\u62E9\u52A0\u8F7D\u3002</div>';
        return;
      }
      loadScenario(initial).catch(function(error) {
        uiView.setRunState("failed", "\u52A0\u8F7D\u5931\u8D25");
        document.getElementById("statsPanel").innerHTML = '<div class="text-sm text-rose-500 p-4">' + esc(error.message) + "</div>";
      });
    }
    fetchDiscoveredScenarios().then(tryLoadInitial).catch(function(e) {
      console.warn(e);
      tryLoadInitial();
    });
  }
  init();
  return {
    loadScenario,
    runAll: runScenario2,
    runNext: runNextStep,
    reset: resetExecution,
    cancel: cancelExecution,
    rewindToStep,
    rerunStep,
    getState: function() {
      return state;
    }
  };
}

// src/browser/tailwind.generated.js
var TAILWIND_CSS = '*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}/*\n! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n5. Use the user\'s configured `sans` font-feature-settings by default.\n6. Use the user\'s configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font-family by default.\n2. Use the user\'s configured `mono` font-feature-settings by default.\n3. Use the user\'s configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type=\'button\']),\ninput:where([type=\'reset\']),\ninput:where([type=\'submit\']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden]:where(:not([hidden="until-found"])) {\n  display: none;\n} .\\!container {\n  width: 100% !important;\n} .container {\n  width: 100%;\n} @media (min-width: 640px) {\n\n  .\\!container {\n    max-width: 640px !important;\n  }\n\n  .container {\n    max-width: 640px;\n  }\n} @media (min-width: 768px) {\n\n  .\\!container {\n    max-width: 768px !important;\n  }\n\n  .container {\n    max-width: 768px;\n  }\n} @media (min-width: 1024px) {\n\n  .\\!container {\n    max-width: 1024px !important;\n  }\n\n  .container {\n    max-width: 1024px;\n  }\n} @media (min-width: 1280px) {\n\n  .\\!container {\n    max-width: 1280px !important;\n  }\n\n  .container {\n    max-width: 1280px;\n  }\n} @media (min-width: 1536px) {\n\n  .\\!container {\n    max-width: 1536px !important;\n  }\n\n  .container {\n    max-width: 1536px;\n  }\n} #scenario-test-root .sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n} #scenario-test-root .visible {\n  visibility: visible;\n} #scenario-test-root .fixed {\n  position: fixed;\n} #scenario-test-root .relative {\n  position: relative;\n} #scenario-test-root .sticky {\n  position: sticky;\n} #scenario-test-root .inset-0 {\n  inset: 0px;\n} #scenario-test-root .top-0 {\n  top: 0px;\n} #scenario-test-root .z-10 {\n  z-index: 10;\n} #scenario-test-root .z-30 {\n  z-index: 30;\n} #scenario-test-root .z-40 {\n  z-index: 40;\n} #scenario-test-root .col-span-2 {\n  grid-column: span 2 / span 2;\n} #scenario-test-root .mx-1 {\n  margin-left: 0.25rem;\n  margin-right: 0.25rem;\n} #scenario-test-root .mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n} #scenario-test-root .my-2 {\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem;\n} #scenario-test-root .my-8 {\n  margin-top: 2rem;\n  margin-bottom: 2rem;\n} #scenario-test-root .mb-1 {\n  margin-bottom: 0.25rem;\n} #scenario-test-root .mb-1\\.5 {\n  margin-bottom: 0.375rem;\n} #scenario-test-root .mb-2 {\n  margin-bottom: 0.5rem;\n} #scenario-test-root .mb-3 {\n  margin-bottom: 0.75rem;\n} #scenario-test-root .ml-0\\.5 {\n  margin-left: 0.125rem;\n} #scenario-test-root .ml-1 {\n  margin-left: 0.25rem;\n} #scenario-test-root .mr-1 {\n  margin-right: 0.25rem;\n} #scenario-test-root .mr-1\\.5 {\n  margin-right: 0.375rem;\n} #scenario-test-root .mr-2 {\n  margin-right: 0.5rem;\n} #scenario-test-root .mt-0\\.5 {\n  margin-top: 0.125rem;\n} #scenario-test-root .mt-1 {\n  margin-top: 0.25rem;\n} #scenario-test-root .mt-2 {\n  margin-top: 0.5rem;\n} #scenario-test-root .mt-3 {\n  margin-top: 0.75rem;\n} #scenario-test-root .mt-4 {\n  margin-top: 1rem;\n} #scenario-test-root .block {\n  display: block;\n} #scenario-test-root .inline {\n  display: inline;\n} #scenario-test-root .flex {\n  display: flex;\n} #scenario-test-root .grid {\n  display: grid;\n} #scenario-test-root .hidden {\n  display: none;\n} #scenario-test-root .h-1\\.5 {\n  height: 0.375rem;\n} #scenario-test-root .h-2 {\n  height: 0.5rem;\n} #scenario-test-root .h-28 {\n  height: 7rem;\n} #scenario-test-root .h-3 {\n  height: 0.75rem;\n} #scenario-test-root .h-3\\.5 {\n  height: 0.875rem;\n} #scenario-test-root .h-4 {\n  height: 1rem;\n} #scenario-test-root .h-40 {\n  height: 10rem;\n} #scenario-test-root .h-5 {\n  height: 1.25rem;\n} #scenario-test-root .max-h-48 {\n  max-height: 12rem;\n} #scenario-test-root .max-h-\\[85vh\\] {\n  max-height: 85vh;\n} #scenario-test-root .w-1 {\n  width: 0.25rem;\n} #scenario-test-root .w-1\\.5 {\n  width: 0.375rem;\n} #scenario-test-root .w-1\\/3 {\n  width: 33.333333%;\n} #scenario-test-root .w-16 {\n  width: 4rem;\n} #scenario-test-root .w-2 {\n  width: 0.5rem;\n} #scenario-test-root .w-3 {\n  width: 0.75rem;\n} #scenario-test-root .w-3\\.5 {\n  width: 0.875rem;\n} #scenario-test-root .w-4 {\n  width: 1rem;\n} #scenario-test-root .w-44 {\n  width: 11rem;\n} #scenario-test-root .w-5 {\n  width: 1.25rem;\n} #scenario-test-root .w-\\[70\\%\\] {\n  width: 70%;\n} #scenario-test-root .w-full {\n  width: 100%;\n} #scenario-test-root .min-w-0 {\n  min-width: 0px;\n} #scenario-test-root .max-w-3xl {\n  max-width: 48rem;\n} #scenario-test-root .max-w-\\[280px\\] {\n  max-width: 280px;\n} #scenario-test-root .max-w-\\[50\\%\\] {\n  max-width: 50%;\n} #scenario-test-root .max-w-\\[55\\%\\] {\n  max-width: 55%;\n} #scenario-test-root .max-w-full {\n  max-width: 100%;\n} #scenario-test-root .flex-1 {\n  flex: 1 1 0%;\n} #scenario-test-root .flex-shrink-0 {\n  flex-shrink: 0;\n} #scenario-test-root .rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n} #scenario-test-root .scale-90 {\n  --tw-scale-x: .9;\n  --tw-scale-y: .9;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n} #scenario-test-root .cursor-pointer {\n  cursor: pointer;\n} #scenario-test-root .select-none {\n  user-select: none;\n} #scenario-test-root .select-text {\n  user-select: text;\n} #scenario-test-root .appearance-none {\n  appearance: none;\n} #scenario-test-root .grid-cols-1 {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n} #scenario-test-root .flex-col {\n  flex-direction: column;\n} #scenario-test-root .flex-wrap {\n  flex-wrap: wrap;\n} #scenario-test-root .items-start {\n  align-items: flex-start;\n} #scenario-test-root .items-center {\n  align-items: center;\n} #scenario-test-root .justify-end {\n  justify-content: flex-end;\n} #scenario-test-root .justify-center {\n  justify-content: center;\n} #scenario-test-root .justify-between {\n  justify-content: space-between;\n} #scenario-test-root .gap-1 {\n  gap: 0.25rem;\n} #scenario-test-root .gap-1\\.5 {\n  gap: 0.375rem;\n} #scenario-test-root .gap-2 {\n  gap: 0.5rem;\n} #scenario-test-root .gap-3 {\n  gap: 0.75rem;\n} #scenario-test-root .gap-4 {\n  gap: 1rem;\n} #scenario-test-root :is(.space-x-1 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-1\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.375rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.375rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-2 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-2\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.625rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.625rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-3 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-4 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1rem * var(--tw-space-x-reverse));\n  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-6 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-8 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(2rem * var(--tw-space-x-reverse));\n  margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-y-0\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-1 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-2 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-3 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-4 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.divide-y > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-y-reverse: 0;\n  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));\n  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));\n} #scenario-test-root :is(.divide-slate-100 > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(241 245 249 / var(--tw-divide-opacity, 1));\n} #scenario-test-root :is(.divide-slate-200 > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-divide-opacity, 1));\n} #scenario-test-root .overflow-hidden {\n  overflow: hidden;\n} #scenario-test-root .overflow-x-auto {\n  overflow-x: auto;\n} #scenario-test-root .overflow-y-auto {\n  overflow-y: auto;\n} #scenario-test-root .truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n} #scenario-test-root .whitespace-nowrap {\n  white-space: nowrap;\n} #scenario-test-root .break-all {\n  word-break: break-all;\n} #scenario-test-root .rounded {\n  border-radius: 0.25rem;\n} #scenario-test-root .rounded-full {\n  border-radius: 9999px;\n} #scenario-test-root .rounded-lg {\n  border-radius: 0.5rem;\n} #scenario-test-root .rounded-md {\n  border-radius: 0.375rem;\n} #scenario-test-root .rounded-xl {\n  border-radius: 0.75rem;\n} #scenario-test-root .border {\n  border-width: 1px;\n} #scenario-test-root .border-b {\n  border-bottom-width: 1px;\n} #scenario-test-root .border-l {\n  border-left-width: 1px;\n} #scenario-test-root .border-t {\n  border-top-width: 1px;\n} #scenario-test-root .border-blue-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(191 219 254 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-emerald-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 250 229 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-emerald-100\\/50 {\n  border-color: rgb(209 250 229 / 0.5);\n} #scenario-test-root .border-emerald-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(167 243 208 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-indigo-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(224 231 255 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-rose-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(255 228 230 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-rose-100\\/50 {\n  border-color: rgb(255 228 230 / 0.5);\n} #scenario-test-root .border-rose-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(254 205 211 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(241 245 249 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-100\\/80 {\n  border-color: rgb(241 245 249 / 0.8);\n} #scenario-test-root .border-slate-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-200\\/50 {\n  border-color: rgb(226 232 240 / 0.5);\n} #scenario-test-root .border-slate-200\\/60 {\n  border-color: rgb(226 232 240 / 0.6);\n} #scenario-test-root .border-slate-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(203 213 225 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(71 85 105 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(51 65 85 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-700\\/50 {\n  border-color: rgb(51 65 85 / 0.5);\n} #scenario-test-root .border-transparent {\n  border-color: transparent;\n} #scenario-test-root .border-zinc-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(228 228 231 / var(--tw-border-opacity, 1));\n} #scenario-test-root .bg-\\[\\#1e293b\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 41 59 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(52 211 153 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 253 245 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(16 185 129 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 150 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-indigo-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(238 242 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 228 230 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 113 133 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 241 242 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-50\\/20 {\n  background-color: rgb(255 241 242 / 0.2);\n} #scenario-test-root .bg-rose-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(244 63 94 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-100\\/70 {\n  background-color: rgb(241 245 249 / 0.7);\n} #scenario-test-root .bg-slate-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(226 232 240 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-200\\/60 {\n  background-color: rgb(226 232 240 / 0.6);\n} #scenario-test-root .bg-slate-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(203 213 225 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(148 163 184 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-50\\/30 {\n  background-color: rgb(248 250 252 / 0.3);\n} #scenario-test-root .bg-slate-50\\/50 {\n  background-color: rgb(248 250 252 / 0.5);\n} #scenario-test-root .bg-slate-50\\/70 {\n  background-color: rgb(248 250 252 / 0.7);\n} #scenario-test-root .bg-slate-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 41 59 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(15 23 42 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-950\\/20 {\n  background-color: rgb(2 6 23 / 0.2);\n} #scenario-test-root .bg-slate-950\\/40 {\n  background-color: rgb(2 6 23 / 0.4);\n} #scenario-test-root .bg-transparent {\n  background-color: transparent;\n} #scenario-test-root .bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-zinc-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(244 244 245 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .p-1 {\n  padding: 0.25rem;\n} #scenario-test-root .p-2 {\n  padding: 0.5rem;\n} #scenario-test-root .p-2\\.5 {\n  padding: 0.625rem;\n} #scenario-test-root .p-3 {\n  padding: 0.75rem;\n} #scenario-test-root .p-3\\.5 {\n  padding: 0.875rem;\n} #scenario-test-root .p-4 {\n  padding: 1rem;\n} #scenario-test-root .p-5 {\n  padding: 1.25rem;\n} #scenario-test-root .p-8 {\n  padding: 2rem;\n} #scenario-test-root .px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n} #scenario-test-root .px-1\\.5 {\n  padding-left: 0.375rem;\n  padding-right: 0.375rem;\n} #scenario-test-root .px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n} #scenario-test-root .px-2\\.5 {\n  padding-left: 0.625rem;\n  padding-right: 0.625rem;\n} #scenario-test-root .px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n} #scenario-test-root .px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n} #scenario-test-root .px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n} #scenario-test-root .py-0\\.5 {\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem;\n} #scenario-test-root .py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n} #scenario-test-root .py-1\\.5 {\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n} #scenario-test-root .py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n} #scenario-test-root .py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n} #scenario-test-root .py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n} #scenario-test-root .py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n} #scenario-test-root .pb-3 {\n  padding-bottom: 0.75rem;\n} #scenario-test-root .pl-2 {\n  padding-left: 0.5rem;\n} #scenario-test-root .pl-6 {\n  padding-left: 1.5rem;\n} #scenario-test-root .pr-4 {\n  padding-right: 1rem;\n} #scenario-test-root .pr-5 {\n  padding-right: 1.25rem;\n} #scenario-test-root .pt-4 {\n  padding-top: 1rem;\n} #scenario-test-root .text-left {\n  text-align: left;\n} #scenario-test-root .text-center {\n  text-align: center;\n} #scenario-test-root .text-right {\n  text-align: right;\n} #scenario-test-root .font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n} #scenario-test-root .text-\\[10px\\] {\n  font-size: 10px;\n} #scenario-test-root .text-\\[11px\\] {\n  font-size: 11px;\n} #scenario-test-root .text-\\[12px\\] {\n  font-size: 12px;\n} #scenario-test-root .text-\\[13px\\] {\n  font-size: 13px;\n} #scenario-test-root .text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n} #scenario-test-root .text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n} #scenario-test-root .text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n} #scenario-test-root .font-bold {\n  font-weight: 700;\n} #scenario-test-root .font-extrabold {\n  font-weight: 800;\n} #scenario-test-root .font-medium {\n  font-weight: 500;\n} #scenario-test-root .font-normal {\n  font-weight: 400;\n} #scenario-test-root .font-semibold {\n  font-weight: 600;\n} #scenario-test-root .uppercase {\n  text-transform: uppercase;\n} #scenario-test-root .normal-case {\n  text-transform: none;\n} #scenario-test-root .leading-relaxed {\n  line-height: 1.625;\n} #scenario-test-root .leading-tight {\n  line-height: 1.25;\n} #scenario-test-root .tracking-tight {\n  letter-spacing: -0.025em;\n} #scenario-test-root .tracking-wider {\n  letter-spacing: 0.05em;\n} #scenario-test-root .text-amber-400 {\n  --tw-text-opacity: 1;\n  color: rgb(251 191 36 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-amber-600 {\n  --tw-text-opacity: 1;\n  color: rgb(217 119 6 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(29 78 216 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-400 {\n  --tw-text-opacity: 1;\n  color: rgb(52 211 153 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-500 {\n  --tw-text-opacity: 1;\n  color: rgb(16 185 129 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-600 {\n  --tw-text-opacity: 1;\n  color: rgb(5 150 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-600\\/70 {\n  color: rgb(5 150 105 / 0.7);\n} #scenario-test-root .text-emerald-700 {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-indigo-500 {\n  --tw-text-opacity: 1;\n  color: rgb(99 102 241 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-indigo-700 {\n  --tw-text-opacity: 1;\n  color: rgb(67 56 202 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-orange-500 {\n  --tw-text-opacity: 1;\n  color: rgb(249 115 22 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-purple-600 {\n  --tw-text-opacity: 1;\n  color: rgb(147 51 234 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-400 {\n  --tw-text-opacity: 1;\n  color: rgb(251 113 133 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-500 {\n  --tw-text-opacity: 1;\n  color: rgb(244 63 94 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-500\\/70 {\n  color: rgb(244 63 94 / 0.7);\n} #scenario-test-root .text-rose-600 {\n  --tw-text-opacity: 1;\n  color: rgb(225 29 72 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-700 {\n  --tw-text-opacity: 1;\n  color: rgb(190 18 60 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-800 {\n  --tw-text-opacity: 1;\n  color: rgb(159 18 57 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-200 {\n  --tw-text-opacity: 1;\n  color: rgb(226 232 240 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-300 {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-400 {\n  --tw-text-opacity: 1;\n  color: rgb(148 163 184 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-400\\/80 {\n  color: rgb(148 163 184 / 0.8);\n} #scenario-test-root .text-slate-500 {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-600 {\n  --tw-text-opacity: 1;\n  color: rgb(71 85 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-700 {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 41 59 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-900 {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-zinc-700 {\n  --tw-text-opacity: 1;\n  color: rgb(63 63 70 / var(--tw-text-opacity, 1));\n} #scenario-test-root .placeholder-slate-400::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(148 163 184 / var(--tw-placeholder-opacity, 1));\n} #scenario-test-root .placeholder-slate-500::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-placeholder-opacity, 1));\n} #scenario-test-root .shadow-inner {\n  --tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n} #scenario-test-root .filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n} #scenario-test-root .transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .transition-transform {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .duration-150 {\n  transition-duration: 150ms;\n} #scenario-test-root .duration-200 {\n  transition-duration: 200ms;\n} #scenario-test-root .placeholder\\:text-slate-300::placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:border-emerald-300:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(110 231 183 / var(--tw-border-opacity, 1));\n} #scenario-test-root .hover\\:border-slate-200:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-border-opacity, 1));\n} #scenario-test-root .hover\\:bg-emerald-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 150 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-emerald-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 120 87 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-indigo-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 231 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-50\\/50:hover {\n  background-color: rgb(248 250 252 / 0.5);\n} #scenario-test-root .hover\\:bg-slate-50\\/60:hover {\n  background-color: rgb(248 250 252 / 0.6);\n} #scenario-test-root .hover\\:bg-slate-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(71 85 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-white:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:text-emerald-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-rose-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(225 29 72 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-slate-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-slate-900:hover {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n} #scenario-test-root .focus\\:border-emerald-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(16 185 129 / var(--tw-border-opacity, 1));\n} #scenario-test-root .focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n} #scenario-test-root .focus\\:ring-1:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n} #scenario-test-root .focus\\:ring-emerald-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(16 185 129 / var(--tw-ring-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-emerald-700) {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-500) {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-600) {\n  --tw-text-opacity: 1;\n  color: rgb(71 85 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-950) {\n  --tw-text-opacity: 1;\n  color: rgb(2 6 23 / var(--tw-text-opacity, 1));\n} @media (min-width: 640px) {\n\n  #scenario-test-root .sm\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  #scenario-test-root .sm\\:flex {\n    display: flex;\n  }\n\n  #scenario-test-root .sm\\:hidden {\n    display: none;\n  }\n\n  #scenario-test-root .sm\\:max-w-xl {\n    max-width: 36rem;\n  }\n\n  #scenario-test-root .sm\\:grid-cols-\\[120px_1fr\\] {\n    grid-template-columns: 120px 1fr;\n  }\n} @media (min-width: 768px) {\n\n  #scenario-test-root .md\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  #scenario-test-root .md\\:w-auto {\n    width: auto;\n  }\n\n  #scenario-test-root .md\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  #scenario-test-root .md\\:gap-0 {\n    gap: 0px;\n  }\n\n  #scenario-test-root :is(.md\\:divide-x > :not([hidden]) ~ :not([hidden])) {\n    --tw-divide-x-reverse: 0;\n    border-right-width: calc(1px * var(--tw-divide-x-reverse));\n    border-left-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));\n  }\n\n  #scenario-test-root .md\\:pl-6 {\n    padding-left: 1.5rem;\n  }\n\n  #scenario-test-root .md\\:pr-6 {\n    padding-right: 1.5rem;\n  }\n} @media (min-width: 1024px) {\n\n  #scenario-test-root .lg\\:w-\\[80\\%\\] {\n    width: 80%;\n  }\n} @media (min-width: 1280px) {\n\n  #scenario-test-root .xl\\:max-h-\\[calc\\(100vh-52px\\)\\] {\n    max-height: calc(100vh - 52px);\n  }\n\n  #scenario-test-root .xl\\:grid-cols-\\[minmax\\(164px\\2c 1fr\\)_minmax\\(500px\\2c 3\\.18fr\\)_minmax\\(280px\\2c 1\\.75fr\\)\\] {\n    grid-template-columns: minmax(164px,1fr) minmax(500px,3.18fr) minmax(280px,1.75fr);\n  }\n}';

// src/browser/app.js
function resolveMount(mount) {
  return typeof mount === "string" ? document.querySelector(mount) : mount;
}
function toRuntimeConfig(config) {
  const prefix = config.storagePrefix || "scenario-test";
  const scenarioVars = { ...config.vars || {} };
  for (const definition of config.variables || []) {
    if (scenarioVars[definition.name] === void 0 && definition.defaultValue !== void 0) {
      scenarioVars[definition.name] = definition.defaultValue;
    }
  }
  return {
    ...config,
    scenarioVars,
    scenarios: config.scenarios.map((entry) => ({
      ...entry,
      file: entry.url || entry.file || entry.path || ""
    })),
    storageKeys: {
      baseUrl: `${prefix}.baseUrl`,
      authorization: `${prefix}.authorization`,
      globals: `${prefix}.globals`,
      environment: `${prefix}.environment`,
      theme: `${prefix}.theme`,
      scenarioVars: `${prefix}.scenarioVars`,
      pinnedScenarios: `${prefix}.pinnedScenarios`,
      ...config.storageKeys || {}
    }
  };
}
function ensureTailwindStyles() {
  let style = document.getElementById("scenarioTailwindStyles");
  if (!style) {
    style = document.createElement("style");
    style.id = "scenarioTailwindStyles";
    style.textContent = TAILWIND_CSS;
    document.head.appendChild(style);
  }
  return style;
}
function createApp(options = {}) {
  const mount = resolveMount(options.mount);
  if (!mount) throw new Error("createApp \u7F3A\u5C11\u6709\u6548\u7684 mount \u5BB9\u5668");
  if (document.getElementById("scenario-test-root") && mount.id !== "scenario-test-root") {
    throw new Error("\u5F53\u524D\u9875\u9762\u53EA\u80FD\u6302\u8F7D\u4E00\u4E2A\u573A\u666F\u6D4B\u8BD5\u5DE5\u4F5C\u53F0");
  }
  const config = defineConfig(options.config || getConfig() || {});
  const previousId = mount.id;
  mount.id = "scenario-test-root";
  mount.classList.add("scenario-test-root");
  ensureTailwindStyles();
  const runtime = createLegacyRuntime({ mount, config: toRuntimeConfig(config), getScenario });
  let destroyed = false;
  function loadScenario(idOrUrl) {
    const entry = config.scenarios.find((item) => item.id === idOrUrl || item.url === idOrUrl || item.file === idOrUrl);
    return runtime.loadScenario(entry ? entry.url || entry.file : idOrUrl);
  }
  function destroy() {
    if (destroyed) return;
    runtime.cancel();
    mount.replaceChildren();
    mount.classList.remove("scenario-test-root");
    mount.id = previousId;
    destroyed = true;
  }
  return {
    loadScenario,
    runAll: runtime.runAll,
    runNext: runtime.runNext,
    reset: runtime.reset,
    cancel: runtime.cancel,
    rewindToStep: runtime.rewindToStep,
    rerunStep: runtime.rerunStep,
    destroy,
    getState: runtime.getState
  };
}

// src/node/io.js
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_path2 = __toESM(require("node:path"), 1);

// src/utils/path-validator.js
var import_node_path = __toESM(require("node:path"), 1);
function validatePath(root, userPath, options = {}) {
  if (typeof userPath !== "string" || !userPath.trim()) {
    throw new Error("\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A");
  }
  if (userPath.includes("\0")) {
    throw new Error(`\u8DEF\u5F84\u5305\u542B\u975E\u6CD5\u5B57\u7B26: ${userPath}`);
  }
  if (import_node_path.default.isAbsolute(userPath)) {
    if (!options.allowAbsolute) {
      throw new Error(`\u4E0D\u5141\u8BB8\u4F7F\u7528\u7EDD\u5BF9\u8DEF\u5F84: ${userPath}`);
    }
    const relative2 = import_node_path.default.relative(root, userPath);
    if (relative2.startsWith("..") || import_node_path.default.isAbsolute(relative2)) {
      throw new Error(`\u7EDD\u5BF9\u8DEF\u5F84\u8D8A\u754C: ${userPath}`);
    }
    return userPath;
  }
  const resolved = import_node_path.default.resolve(root, userPath);
  const relative = import_node_path.default.relative(root, resolved);
  if (!relative || relative.startsWith("..") || import_node_path.default.isAbsolute(relative)) {
    throw new Error(`\u8DEF\u5F84\u8D8A\u754C: ${userPath}`);
  }
  return resolved;
}

// src/node/io.js
function createNodeIo(workspace = process.cwd()) {
  const root = import_node_path2.default.resolve(workspace);
  return {
    async createUploadBody(definition) {
      const filePath = typeof definition === "string" ? definition : definition.filePath;
      let absolutePath;
      try {
        absolutePath = validatePath(root, filePath);
      } catch (error) {
        throw new Error(
          `\u6587\u4EF6\u4E0A\u4F20\u8DEF\u5F84\u4E0D\u5B89\u5168: ${filePath}
\u539F\u56E0: ${error.message}
\u63D0\u793A: \u4E0A\u4F20\u6587\u4EF6\u5FC5\u987B\u5728\u5DE5\u4F5C\u533A\u5185 (${root})`
        );
      }
      if (!import_node_fs.default.existsSync(absolutePath)) throw new Error(`\u4E0A\u4F20\u6587\u4EF6\u4E0D\u5B58\u5728: ${absolutePath}`);
      const fieldName = definition.fieldName || "file";
      const filename = definition.filename || import_node_path2.default.basename(absolutePath);
      const form = new FormData();
      form.append(fieldName, new Blob([import_node_fs.default.readFileSync(absolutePath)]), filename);
      for (const [name, value] of Object.entries(definition.fields || {})) form.append(name, String(value));
      return { body: form, omitContentType: true };
    },
    async saveResponse(relativePath, data, metadata = {}) {
      let absolutePath;
      try {
        absolutePath = validatePath(root, relativePath);
      } catch (error) {
        throw new Error(
          `\u54CD\u5E94\u4FDD\u5B58\u8DEF\u5F84\u4E0D\u5B89\u5168: ${relativePath}
\u539F\u56E0: ${error.message}
\u63D0\u793A: \u4FDD\u5B58\u8DEF\u5F84\u5FC5\u987B\u5728\u5DE5\u4F5C\u533A\u5185 (${root})`
        );
      }
      import_node_fs.default.mkdirSync(import_node_path2.default.dirname(absolutePath), { recursive: true });
      import_node_fs.default.writeFileSync(absolutePath, data);
      return { savedTo: absolutePath, size: data.byteLength, contentType: metadata.contentType || "" };
    }
  };
}

// src/node/loader.js
var import_node_fs2 = __toESM(require("node:fs"), 1);
var import_node_path3 = __toESM(require("node:path"), 1);
var import_node_vm = __toESM(require("node:vm"), 1);
function executeDefinitionFile(filePath, api) {
  const absolutePath = import_node_path3.default.resolve(filePath);
  const moduleObject = { exports: {} };
  const windowObject = { ScenarioTest: api };
  const context = {
    ScenarioTest: api,
    window: windowObject,
    module: moduleObject,
    exports: moduleObject.exports,
    console,
    URL,
    URLSearchParams,
    setTimeout,
    clearTimeout
  };
  context.global = context;
  context.globalThis = context;
  import_node_vm.default.createContext(context);
  import_node_vm.default.runInContext(import_node_fs2.default.readFileSync(absolutePath, "utf8"), context, { filename: absolutePath });
  return { context, window: windowObject, exports: moduleObject.exports };
}
function loadConfigFile(filePath, api) {
  const previousConfig = getConfig();
  const loaded = executeDefinitionFile(filePath, api);
  const exported = loaded.exports?.default || loaded.exports;
  const registeredConfig = getConfig();
  const config = (registeredConfig !== previousConfig ? registeredConfig : null) || (exported && Object.keys(exported).length ? exported : null);
  if (!config) throw new Error(`\u914D\u7F6E\u6587\u4EF6\u672A\u6CE8\u518C\u914D\u7F6E: ${filePath}`);
  return api.defineConfig(config);
}
function loadScenarioFile(filePath, id, api) {
  const existing = getScenario(id);
  if (existing) return existing;
  const loaded = executeDefinitionFile(filePath, api);
  let scenario = getScenario(id);
  const exported = loaded.exports?.default || loaded.exports;
  if (!scenario && exported && Array.isArray(exported.steps)) scenario = registerScenario(id, exported);
  if (!scenario) throw new Error(`\u573A\u666F\u6587\u4EF6\u672A\u6CE8\u518C ${id}: ${filePath}`);
  return scenario;
}

// src/init-templates.js
var DEFAULT_LIBRARY_URL = `https://github.com/youzhikeji/scenario-test/releases/download/v${VERSION}/scenario-test.umd.js`;
var OPERATOR_NAMES = Object.keys(contract.assertions.operators);
var OPERATORS_TEXT = OPERATOR_NAMES.join("\u3001");
var OPERATORS_BACKTICK = OPERATOR_NAMES.map((name) => `\`${name}\``).join("\u3001");
var GLOBALS_TYPES_BACKTICK = contract.globals.types.map((type) => `\`${type}\``).join(" / ");
var AUTHORING_PROMPT = `# AI \u4E1A\u52A1\u529F\u80FD\u573A\u666F\u751F\u6210\u89C4\u5219

\u672C\u6587\u4EF6\u7531\u5B89\u88C5\u4F1A\u8BDD\u4E2D\u7684 AI \u81EA\u52A8\u8BFB\u53D6\uFF1B\u65B0\u4F1A\u8BDD\u4E2D\u7684 AI \u5E94\u6309\u7528\u6237\u8981\u6C42\u4ECE\u9879\u76EE\u76EE\u5F55\u76F4\u63A5\u8BFB\u53D6\u3002\u7528\u6237\u4E0D\u9700\u8981\u590D\u5236\u6216\u7C98\u8D34\u672C\u6587\u4EF6\u3002\u5F00\u59CB\u524D\u5FC5\u987B\u5DF2\u5B8C\u6210 npm \u5B89\u88C5\u548C doctor\u3002

\u672C\u9636\u6BB5\u53EA\u6839\u636E\u5F53\u524D\u9879\u76EE\u4E2D\u4E0E\u76EE\u6807\u4E1A\u52A1\u529F\u80FD\u76F4\u63A5\u76F8\u5173\u7684\u771F\u5B9E\u8BC1\u636E\u751F\u6210\u6216\u7EF4\u62A4 HTTP \u573A\u666F\uFF0C\u4E0D\u8D1F\u8D23\u5B89\u88C5\u3001\u5347\u7EA7\u6216\u6784\u5EFA scenario-test\uFF0C\u4E0D\u542F\u52A8\u670D\u52A1\uFF0C\u4E5F\u4E0D\u5B9E\u9645\u8C03\u7528\u4E1A\u52A1\u63A5\u53E3\u3002

\u8BF7\u9488\u5BF9\u7528\u6237\u672C\u6B21\u6307\u5B9A\u7684\u4E00\u4E2A\u4E1A\u52A1\u529F\u80FD\u751F\u6210 scenario-test \u573A\u666F\u7528\u4F8B\u3002\u672C\u6587\u4EF6\u4F4D\u4E8E\u9879\u76EE\u573A\u666F\u6D4B\u8BD5\u6839\u76EE\u5F55\u7684 \`.scenario-test/\`\uFF0C\u6839\u76EE\u5F55\u662F\u4E0A\u4E00\u7EA7\u3002\u968F\u540E\u8BFB\u53D6\u6839\u76EE\u5F55\u7684 \`README.md\`\u3001\`scenario.config.js\` \u548C\u5DF2\u6709 \`scenarios/\`\uFF0C\u5E76\u8BFB\u53D6\u672C\u6587\u4EF6\u540C\u76EE\u5F55\u7684 \`SCENARIO_PATTERNS.md\`\uFF0C\u518D\u5206\u6790\u4E0E\u76EE\u6807\u529F\u80FD\u76F4\u63A5\u76F8\u5173\u7684 Controller\u3001OpenAPI/Swagger\u3001\u524D\u7AEF API \u8C03\u7528\u3001\u63A5\u53E3\u6587\u6863\u548C\u5DF2\u6709\u81EA\u52A8\u5316\u6D4B\u8BD5\u3002\u82E5\u7528\u6237\u5C1A\u672A\u660E\u786E\u6307\u5B9A\u4E1A\u52A1\u529F\u80FD\uFF0C\u5148\u8BE2\u95EE\u529F\u80FD\u540D\u79F0\u53CA\u53EF\u5B9A\u4F4D\u7684\u4EE3\u7801\u3001\u9875\u9762\u6216\u63A5\u53E3\u5165\u53E3\uFF1B\u5F97\u5230\u7B54\u590D\u524D\u4E0D\u626B\u63CF\u6574\u4E2A\u9879\u76EE\u3001\u4E0D\u521B\u5EFA\u573A\u666F\u6587\u4EF6\u3002

\u4E0D\u8981\u731C\u6D4B\u63A5\u53E3\u8DEF\u5F84\u3001\u5B57\u6BB5\u3001\u8BA4\u8BC1\u65B9\u5F0F\u3001\u54CD\u5E94\u7ED3\u6784\u3001\u72B6\u6001\u679A\u4E3E\u3001\u8BF7\u6C42\u679A\u4E3E\u6216\u9519\u8BEF\u54CD\u5E94\u5B57\u6BB5\uFF1B\u6CA1\u6709\u4EE3\u7801\u6216\u6587\u6863\u4F9D\u636E\u65F6\u5217\u4E3A\u5F85\u786E\u8BA4\u9879\u3002\u793A\u4F8B\u4E2D\u7684 SUCCESS\u3001PDF\u3001pdf\u3001\u9519\u8BEF\u7801\u7B49\u90FD\u53EA\u662F\u5360\u4F4D\u7ED3\u6784\uFF0C\u4E0D\u662F\u53EF\u76F4\u63A5\u91C7\u7528\u7684\u9ED8\u8BA4\u503C\uFF0C\u4E5F\u4E0D\u80FD\u6539\u6210\u53E6\u4E00\u79CD\u5927\u5C0F\u5199\u540E\u4F7F\u7528\u3002

## \u5B9E\u65BD\u8981\u6C42

1. \u53EA\u5904\u7406\u672C\u6B21\u6307\u5B9A\u7684\u4E00\u4E2A\u4E1A\u52A1\u529F\u80FD\u3002\u5148\u7ED9\u51FA\u529F\u80FD\u5361\u7247\uFF1A\u529F\u80FD\u76EE\u6807\u3001\u53C2\u4E0E\u89D2\u8272\u3001\u89E6\u53D1\u5165\u53E3\u3001\u524D\u7F6E\u6761\u4EF6\u3001\u5173\u952E\u4E1A\u52A1\u89C4\u5219\u3001\u72B6\u6001\u53D8\u5316\u3001\u76F4\u63A5\u76F8\u5173\u63A5\u53E3\u3001\u6D4B\u8BD5\u6570\u636E\u4E0E\u6E05\u7406\u6761\u4EF6\uFF1B\u518D\u7ED9\u51FA\u8BE5\u529F\u80FD\u7684\u573A\u666F\u77E9\u9635\uFF0C\u5217\u660E\u6BCF\u4E2A\u573A\u666F\u7684\u9A8C\u8BC1\u76EE\u6807\u3001\u524D\u7F6E\u6761\u4EF6\u3001\u6B65\u9AA4\u3001\u9884\u671F\u7ED3\u679C\u548C\u662F\u5426\u5199\u6570\u636E\u3002\u65E0\u6CD5\u786E\u8BA4\u7684\u5185\u5BB9\u5217\u4E3A\u5F85\u786E\u8BA4\u9879\uFF0C\u4E0D\u5F97\u628A\u8303\u56F4\u6269\u5C55\u5230\u76F8\u90BB\u529F\u80FD\u3002
2. \u4E1A\u52A1\u529F\u80FD\u662F\u8BBE\u8BA1\u8FB9\u754C\uFF0C\u573A\u666F\u662F\u8BE5\u529F\u80FD\u4E0B\u7684\u4E00\u6761\u72EC\u7ACB\u9A8C\u8BC1\u8DEF\u5F84\u3002\u6309\u8BC1\u636E\u8986\u76D6\u6210\u529F\u8DEF\u5F84\u3001\u4E1A\u52A1\u89C4\u5219/\u53C2\u6570\u6821\u9A8C\u3001\u6743\u9650\u3001\u8FB9\u754C\u503C\u3001\u91CD\u590D\u64CD\u4F5C\u6216\u5E42\u7B49\u3001\u5408\u6CD5\u4E0E\u975E\u6CD5\u72B6\u6001\u6D41\u8F6C\uFF1B\u6CA1\u6709\u8BC1\u636E\u7684\u7C7B\u522B\u4E0D\u751F\u6210\u3002\u4E00\u4E2A\u573A\u666F\u53EF\u4EE5\u5305\u542B\u51C6\u5907\u3001\u6267\u884C\u3001\u67E5\u8BE2\u9A8C\u8BC1\u548C\u7CBE\u786E\u6E05\u7406\u7B49\u591A\u4E2A HTTP \u6B65\u9AA4\uFF0C\u4F46\u8FD9\u4E9B\u6B65\u9AA4\u53EA\u670D\u52A1\u4E8E\u76EE\u6807\u529F\u80FD\uFF0C\u4E0D\u628A\u591A\u4E2A\u4E1A\u52A1\u529F\u80FD\u4E32\u6210\u4E00\u4E2A\u5927\u573A\u666F\u3002\u8BA4\u8BC1\u7B49\u516C\u5171\u524D\u7F6E\u53EA\u4F5C\u4E3A\u51C6\u5907\u6B65\u9AA4\uFF0C\u4E0D\u6539\u53D8\u573A\u666F\u5F52\u5C5E\u3002
3. \u5728 \`scenario.config.js\` \u7EF4\u62A4 \`envs\`\u3001\`vars\`\u3001\`variables\` \u548C \`scenarios\`\u3002\u79C1\u6709\u9879\u76EE\u53EF\u5728 \`vars\` \u4FDD\u5B58\u8054\u8C03\u51ED\u636E\uFF1B\`variables\` \u53EA\u58F0\u660E\u6807\u7B7E\u3001\`required\` \u4E0E\u53EF\u9009 \`env\` \u6620\u5C04\u3002\u6E90\u7801\u80FD\u786E\u8BA4\u8BF7\u6C42\u5B57\u6BB5\u4F46\u4E0D\u80FD\u786E\u8BA4\u5FC5\u586B\u53D6\u503C\u65F6\uFF0C\u5728\u914D\u7F6E \`vars\` \u4E2D\u7559\u7A7A\uFF0C\u5E76\u5728 \`variables\` \u4E2D\u58F0\u660E\u4E3A \`required: true\`\uFF1B\u573A\u666F\u53EA\u5F15\u7528\u8BE5\u53D8\u91CF\uFF0C\u7981\u6B62\u586B\u5165\u731C\u6D4B\u503C\u6216\u6D4B\u8BD5\u6807\u8BB0\u3002
4. \u5148\u53C2\u7167 \`SCENARIO_PATTERNS.md\` \u7684\u6B65\u9AA4\u7EC4\u5408\u6A21\u5F0F\uFF0C\u518D\u6309\u672C\u9879\u76EE\u8BC1\u636E\u66FF\u6362\u8DEF\u5F84\u3001\u5B57\u6BB5\u548C\u54CD\u5E94\u65AD\u8A00\uFF1B\u6A21\u5F0F\u4E2D\u7684\u5C16\u62EC\u53F7\u5360\u4F4D\u5185\u5BB9\u4E0D\u5F97\u76F4\u63A5\u5199\u5165\u573A\u666F\u3002\u573A\u666F\u5FC5\u987B\u4F7F\u7528 \`ScenarioTest.registerScenario(id, ScenarioTest.defineScenario({...}))\`\uFF0C\u914D\u7F6E\u4E2D\u7684\u573A\u666F id\u3001\u6587\u4EF6\u6CE8\u518C id \u5FC5\u987B\u4E00\u81F4\u3002
5. \u6BCF\u4E00\u6B65\u5199 \`name\`\u3001\`method\`\u3001\`path\`\u3001\`status\`\uFF0C\u5E76\u4E3A\u5173\u952E\u4E1A\u52A1\u7ED3\u679C\u5199 \`assertions\`\u3002Query \u53C2\u6570\u53EA\u80FD\u5199\u5728\u6B65\u9AA4\u9876\u5C42 \`params\`\uFF0C\u4E0D\u80FD\u5199\u6210 \`request.params\`\u3002\u7528 \`extract\` \u4FDD\u5B58\u54CD\u5E94 ID\u3001Token \u6216\u72B6\u6001\uFF0C\u518D\u7528 \`{{vars.name}}\` \u4E32\u8054\u540E\u7EED\u6B65\u9AA4\u3002\u65AD\u8A00\u64CD\u4F5C\u7B26\uFF1A${OPERATORS_BACKTICK}\uFF1B\u6570\u503C\u6BD4\u8F83\uFF08\u5982\u6761\u6570\u4E0D\u5C11\u4E8E 5\uFF09\u7528 \`gte: 5\`\uFF08\u4EC5\u6570\u5B57\u4E0D\u505A\u5B57\u7B26\u4E32\u8F6C\u6362\uFF09\uFF0C"\u975E\u8D1F\u6574\u6570"\u8FD9\u7C7B\u683C\u5F0F\u6821\u9A8C\u7528 \`matches: "^\\\\d+$"\`\u3002\`extract\` \u9879\u53EF\u52A0 \`required: true\`\uFF0C\u8DEF\u5F84\u4E0D\u5B58\u5728\u65F6\u8BE5\u6B65\u9AA4\u5931\u8D25\u3002\`when\` \u5BF9\u8C61\u5F62\u5F0F\u53EA\u5141\u8BB8 \`{ from: "vars", ... }\`\uFF0C\u4E0D\u80FD\u57FA\u4E8E\u54CD\u5E94\u4F53\u5224\u65AD\u6761\u4EF6\u3002
6. \u8BA4\u8BC1\u662F\u666E\u901A\u9879\u76EE\u6B65\u9AA4\uFF1A\u786E\u8BA4\u767B\u5F55\u63A5\u53E3\u65F6\u5148\u767B\u5F55\u5E76\u63D0\u53D6 Token\uFF1B\u65E0\u6CD5\u786E\u8BA4\u65F6\u4EC5\u58F0\u660E\u53D8\u91CF\u5E76\u5728\u5177\u4F53 Header\u3001Query \u6216 Body \u4E2D\u5F15\u7528\uFF0C\u4E0D\u865A\u6784\u6846\u67B6\u7EA7\u8BA4\u8BC1\u3002\u6D4F\u89C8\u5668 Cookie \u4F1A\u8BDD\u5FC5\u987B\u6709\u9879\u76EE\u8BC1\u636E\u5E76\u663E\u5F0F\u8BBE\u7F6E request.credentials \u4E3A include\uFF1BNode CLI \u5F53\u524D\u4E0D\u63D0\u4F9B\u81EA\u52A8 Cookie Jar\u3002
7. \`runId\` \u548C \`runNo\` \u662F\u6BCF\u6B21\u6267\u884C\u81EA\u52A8\u751F\u6210\u7684\u5185\u7F6E\u53D8\u91CF\uFF0C\u7981\u6B62\u5728\u914D\u7F6E vars\u3001\u573A\u666F vars\u3001envVars\u3001generatedVars \u6216 extract \u4E2D\u91CD\u65B0\u5B9A\u4E49\u6216\u8986\u76D6\u3002\u5199\u5165\u573A\u666F\u4F7F\u7528 \`scenario-{{vars.runNo}}\` \u7B49\u6D4B\u8BD5\u6807\u8BB0\u3002\u6E05\u7406\u53EA\u80FD\u6309\u521A\u63D0\u53D6\u7684 ID \u6216\u6D4B\u8BD5\u6807\u8BB0\u7CBE\u786E\u5B9A\u4F4D\uFF0C\u5E76\u7528 \`when\` \u9632\u6B62\u7A7A\u503C\u5220\u9664\uFF1B\u65E0\u6CD5\u786E\u8BA4\u5B89\u5168\u6E05\u7406\u6761\u4EF6\u65F6\u4E0D\u751F\u6210\u5220\u9664\u6B65\u9AA4\u3002
8. \u9ED8\u8BA4\u4FDD\u6301 \`failurePolicy: "stop"\`\u3002\u4E0D\u540C\u9A8C\u8BC1\u76EE\u6807\u62C6\u6210\u72EC\u7ACB\u573A\u666F\uFF1B\u53EA\u6709\u540C\u4E00\u9A8C\u8BC1\u8DEF\u5F84\u786E\u5B9E\u9700\u8981\u7EE7\u7EED\u6536\u96C6\u540E\u7EED\u6B65\u9AA4\u7ED3\u679C\u65F6\u624D\u8BBE\u7F6E \`failurePolicy: "continue"\`\u3002\u53EA\u6709\u5728\u5B8C\u6210\u72B6\u6001\u5B57\u6BB5\u548C\u7EC8\u6001\u503C\u90FD\u6709\u8BC1\u636E\u65F6\u624D\u4F7F\u7528 \`retryUntil\`\uFF0C\u4E14 assertions \u5FC5\u987B\u65AD\u8A00\u8BE5\u7EC8\u6001\u503C\uFF1B\u53EA\u65AD\u8A00\u5B57\u6BB5\u5B58\u5728\u4F1A\u7ACB\u5373\u901A\u8FC7\uFF0C\u7981\u6B62\u914D\u5408 \`retryUntil\`\u3002\u5B8C\u6210\u72B6\u6001\u672A\u77E5\u65F6\u6700\u591A\u751F\u6210\u4E00\u6B21\u72B6\u6001\u67E5\u8BE2\u3002\u4E0D\u8981\u5199\u56FA\u5B9A sleep\u3002
9. \u9519\u8BEF\u54CD\u5E94\u4F53\u6CA1\u6709\u4EE3\u7801\u3001\u6587\u6863\u6216\u65E2\u6709\u6D4B\u8BD5\u4F9D\u636E\u65F6\uFF0C\u53EA\u65AD\u8A00\u5DF2\u786E\u8BA4\u7684 HTTP status\uFF0C\u4E0D\u80FD\u731C\u6D4B\u6216\u65AD\u8A00 code\u3001message\u3001error \u7B49\u5B57\u6BB5\u5B58\u5728\u3002
10. \u4E0D\u4FEE\u6539\u4E1A\u52A1\u4EE3\u7801\u3001\u6784\u5EFA\u914D\u7F6E\u6216\u516C\u5171\u8FD0\u884C\u65F6\uFF1B\u4E0D\u5199\u5165\u751F\u4EA7\u5730\u5740\u3001\u4E2A\u4EBA\u6570\u636E\u3001\u56FA\u5B9A Token \u6216\u975E\u6D4B\u8BD5\u51ED\u636E\u3002
11. \u843D\u76D8\u540E\u9010\u6587\u4EF6\u81EA\u68C0\uFF1A\u4E0D\u5F97\u51FA\u73B0\u65E0\u8BC1\u636E\u7684 SUCCESS\u3001PDF\u3001pdf\u3001\u9519\u8BEF\u5B57\u6BB5\u65AD\u8A00\u6216 \`retryUntil + exists\`\uFF1B\u6240\u6709\u5916\u90E8\u8F93\u5165\u53D8\u91CF\u5FC5\u987B\u5728\u914D\u7F6E\u4E2D\u58F0\u660E\uFF0C\u573A\u666F vars \u53EA\u4FDD\u5B58\u6D4B\u8BD5\u6807\u8BB0\u3001\u63D0\u53D6\u7ED3\u679C\u6216\u5185\u90E8\u72B6\u6001\u3002\u53D1\u73B0\u8FDD\u89C4\u5FC5\u987B\u5148\u4FEE\u6B63\u518D\u62A5\u544A\u3002
12. \u6700\u540E\u8BF4\u660E\u672C\u6B21\u76EE\u6807\u4E1A\u52A1\u529F\u80FD\u3001\u65B0\u589E/\u4FEE\u6539\u6587\u4EF6\u3001\u573A\u666F\u77E9\u9635\u3001\u5F85\u786E\u8BA4\u9879\u548C\u6BCF\u4E2A\u573A\u666F\u7684\u672C\u5730\u8FD0\u884C\u547D\u4EE4\uFF1B\u4E0D\u8981\u5B9E\u9645\u6267\u884C\u573A\u666F\u3002
`;
var SCENARIO_PATTERNS = [
  "# \u4E1A\u52A1\u529F\u80FD\u573A\u666F\u6A21\u5F0F\u5E93",
  "",
  "\u672C\u6587\u4EF6\u63D0\u4F9B\u4E3A\u5355\u4E2A\u4E1A\u52A1\u529F\u80FD\u7F16\u6392\u573A\u666F\u65F6\u53EF\u590D\u7528\u7684\u6B65\u9AA4\u7EC4\u5408\uFF0C\u4E0D\u662F\u8DE8\u529F\u80FD\u7AEF\u5230\u7AEF\u6D41\u7A0B\u6216\u63A5\u53E3\u6587\u6863\u3002\u6BCF\u6B21\u5148\u9009\u5B9A\u4E00\u4E2A\u660E\u786E\u4E1A\u52A1\u529F\u80FD\uFF0C\u518D\u6309\u771F\u5B9E\u4E1A\u52A1\u89C4\u5219\u7EC4\u5408\u8BE5\u529F\u80FD\u4E0B\u7684\u573A\u666F\u3002\u6240\u6709 <\u5360\u4F4D\u5185\u5BB9> \u5FC5\u987B\u4ECE\u5F53\u524D\u9879\u76EE\u4E2D\u4E0E\u8BE5\u529F\u80FD\u76F4\u63A5\u76F8\u5173\u7684 Controller\u3001OpenAPI\u3001\u524D\u7AEF API \u8C03\u7528\u3001\u63A5\u53E3\u6587\u6863\u6216\u65E2\u6709\u6D4B\u8BD5\u786E\u8BA4\u540E\u518D\u66FF\u6362\uFF0C\u4E0D\u80FD\u539F\u6837\u6267\u884C\u3002",
  "",
  "## \u4F7F\u7528\u65B9\u5F0F\uFF1A\u5148\u5B9A\u529F\u80FD\uFF0C\u518D\u8BBE\u8BA1\u573A\u666F\u77E9\u9635",
  "",
  "1. \u4E00\u6B21\u53EA\u5904\u7406\u4E00\u4E2A\u4E1A\u52A1\u529F\u80FD\uFF0C\u5148\u660E\u786E\u529F\u80FD\u76EE\u6807\u3001\u53C2\u4E0E\u89D2\u8272\u3001\u89E6\u53D1\u5165\u53E3\u3001\u524D\u7F6E\u6761\u4EF6\u3001\u4E1A\u52A1\u89C4\u5219\u3001\u72B6\u6001\u53D8\u5316\uFF0C\u4EE5\u53CA\u76F4\u63A5\u76F8\u5173\u7684\u63A5\u53E3\uFF1B\u8303\u56F4\u4E0D\u6E05\u65F6\u5148\u8BE2\u95EE\uFF0C\u4E0D\u626B\u63CF\u6574\u4E2A\u9879\u76EE\u6279\u91CF\u751F\u6210\u3002",
  "2. \u4E1A\u52A1\u529F\u80FD\u662F\u8FB9\u754C\uFF0C\u573A\u666F\u662F\u8BE5\u529F\u80FD\u4E0B\u7684\u4E00\u6761\u72EC\u7ACB\u9A8C\u8BC1\u8DEF\u5F84\u3002\u6309\u8BC1\u636E\u8003\u8651\u6210\u529F\u8DEF\u5F84\u3001\u4E1A\u52A1\u89C4\u5219/\u53C2\u6570\u6821\u9A8C\u3001\u6743\u9650\u3001\u8FB9\u754C\u503C\u3001\u91CD\u590D\u64CD\u4F5C\u6216\u5E42\u7B49\u3001\u5408\u6CD5\u4E0E\u975E\u6CD5\u72B6\u6001\u6D41\u8F6C\uFF1B\u6CA1\u6709\u4F9D\u636E\u7684\u7C7B\u522B\u4E0D\u751F\u6210\u3002",
  "3. \u4E00\u4E2A\u573A\u666F\u53EF\u4EE5\u5305\u542B\u51C6\u5907\u3001\u6267\u884C\u3001\u67E5\u8BE2\u9A8C\u8BC1\u548C\u7CBE\u786E\u6E05\u7406\u7B49\u591A\u4E2A\u6B65\u9AA4\uFF0C\u4F46\u6240\u6709\u6B65\u9AA4\u53EA\u670D\u52A1\u4E8E\u76EE\u6807\u529F\u80FD\u3002\u4E0D\u8981\u4E3A\u4E86\u8FFD\u6C42\u201C\u5B8C\u6574\u6D41\u7A0B\u201D\u628A\u76F8\u90BB\u4E1A\u52A1\u529F\u80FD\u4E32\u5165\u540C\u4E00\u573A\u666F\u3002\u8BA4\u8BC1\u7B49\u516C\u5171\u524D\u7F6E\u53EF\u4EE5\u4F5C\u4E3A\u51C6\u5907\u6B65\u9AA4\u3002",
  "4. \u5EFA\u8BAE\u4F7F\u7528 scenarios/<\u529F\u80FD\u6807\u8BC6>/<\u9A8C\u8BC1\u8DEF\u5F84>.js \u7EC4\u7EC7\u6587\u4EF6\uFF0C\u5E76\u4F7F\u7528 <\u529F\u80FD\u6807\u8BC6>-<\u9A8C\u8BC1\u8DEF\u5F84> \u4F5C\u4E3A\u7A33\u5B9A\u573A\u666F id\uFF0C\u4F8B\u5982 order-review-success\u3001order-review-forbidden\uFF1B\u8FD0\u884C\u65F6\u4ECD\u4F7F\u7528\u6241\u5E73 scenarios \u6E05\u5355\uFF0C\u4E0D\u9700\u8981\u65B0\u589E\u529F\u80FD\u5206\u7EC4\u5B57\u6BB5\u3002",
  "5. \u6BCF\u4E2A\u573A\u666F\u72EC\u7ACB\u8FD0\u884C\uFF1A\u81EA\u5DF1\u6EE1\u8DB3\u524D\u7F6E\u6761\u4EF6\u6216\u8BFB\u53D6\u914D\u7F6E\u53D8\u91CF\uFF0C\u81EA\u5DF1\u63D0\u53D6 ID\uFF0C\u4E0D\u80FD\u4F9D\u8D56\u5176\u4ED6\u573A\u666F\u6216\u4E0A\u6B21\u8FD0\u884C\u7559\u4E0B\u7684\u6570\u636E\u3002",
  "6. \u786E\u8BA4\u573A\u666F\u5185\u6BCF\u4E2A\u63A5\u53E3\u7684\u65B9\u6CD5\u3001\u8DEF\u5F84\u3001\u8BA4\u8BC1\u4F4D\u7F6E\u3001\u8BF7\u6C42\u5B57\u6BB5\u3001\u54CD\u5E94\u7ED3\u6784\u3001\u662F\u5426\u5199\u6570\u636E\u548C\u5B89\u5168\u6E05\u7406\u65B9\u5F0F\u3002\u5728 scenario.config.js \u6CE8\u518C\u573A\u666F id\u3001\u540D\u79F0\u548C\u6587\u4EF6\u5730\u5740\uFF1B\u6587\u4EF6\u6CE8\u518C id \u5FC5\u987B\u4E00\u81F4\u3002",
  "7. \u6BCF\u4E00\u6B65\u90FD\u5199 name\u3001method\u3001path\u3001status\uFF1B\u5173\u952E\u4E1A\u52A1\u7ED3\u679C\u5199 assertions\uFF1B\u8DE8\u6B65\u9AA4\u6570\u636E\u901A\u8FC7 extract \u4FDD\u5B58\u3002Query \u53C2\u6570\u5199\u5728\u6B65\u9AA4\u9876\u5C42 params\uFF0C\u4E0D\u5199 request.params\u3002",
  "8. runId \u548C runNo \u7531\u8FD0\u884C\u65F6\u81EA\u52A8\u751F\u6210\uFF0C\u4E0D\u8981\u5728 vars\u3001variables\u3001envVars\u3001generatedVars \u6216 extract \u4E2D\u5B9A\u4E49\u3002\u6A21\u5F0F\u4E2D\u7684\u72B6\u6001\u3001\u683C\u5F0F\u3001\u9519\u8BEF\u7801\u548C\u54CD\u5E94\u5B57\u6BB5\u90FD\u662F\u7ED3\u6784\u5360\u4F4D\uFF0C\u5FC5\u987B\u6709\u9879\u76EE\u8BC1\u636E\u624D\u80FD\u91C7\u7528\u3002",
  "9. \u65E0\u6CD5\u786E\u8BA4\u7684\u5FC5\u586B\u8BF7\u6C42\u503C\u653E\u5165\u914D\u7F6E vars \u7559\u7A7A\uFF0C\u5E76\u5728 variables \u58F0\u660E required: true\uFF1B\u4E0D\u5F97\u7528 PDF\u3001pdf\u3001SUCCESS \u6216 scenario-{{vars.runNo}} \u5145\u5F53\u672A\u77E5\u679A\u4E3E\u3002",
  `10. \u65AD\u8A00\u64CD\u4F5C\u7B26\uFF1A${OPERATORS_TEXT}\uFF1B\u6570\u503C\u6BD4\u8F83\uFF08\u6761\u6570\u4E0D\u5C11\u4E8E N\uFF09\u7528 gte: N\uFF0C\u683C\u5F0F\u6821\u9A8C\uFF08\u975E\u8D1F\u6574\u6570\uFF09\u7528 matches: '^\\\\d+$'\u3002when \u5BF9\u8C61\u5F62\u5F0F\u53EA\u5141\u8BB8 from: 'vars'\u3002extract \u53EF\u52A0 required: true \u5F3A\u5236\u8DEF\u5F84\u5B58\u5728\u3002`,
  "",
  "\u4EE5\u4E0B\u6A21\u5F0F\u662F\u529F\u80FD\u573A\u666F\u5185\u90E8\u7684\u6B65\u9AA4\u7EC4\u5408\u3002\u6309\u76EE\u6807\u529F\u80FD\u6240\u9700\u9009\u7528\uFF0C\u4E0D\u8981\u6C42\u5168\u90E8\u4F7F\u7528\uFF0C\u4E5F\u4E0D\u8981\u628A\u6240\u6709\u6A21\u5F0F\u62FC\u6210\u4E00\u4E2A\u5927\u573A\u666F\u3002",
  "",
  "## \u6A21\u5F0F\u4E00\uFF1A\u767B\u5F55\u3001\u63D0\u53D6 Token\u3001\u540E\u7EED\u8BF7\u6C42\u5F15\u7528",
  "",
  "\u9002\u7528\uFF1A\u767B\u5F55\u63A5\u53E3\u548C Token \u54CD\u5E94\u8DEF\u5F84\u5DF2\u5728\u9879\u76EE\u4E2D\u786E\u8BA4\u3002\u8BA4\u8BC1\u662F\u666E\u901A\u573A\u666F\u6B65\u9AA4\uFF0C\u4E0D\u662F\u6846\u67B6\u914D\u7F6E\u3002",
  "",
  '    ScenarioTest.registerScenario("login-and-profile", ScenarioTest.defineScenario({',
  '        name: "\u767B\u5F55\u5E76\u67E5\u8BE2\u5F53\u524D\u7528\u6237", vars: { accessToken: "" }, steps: [',
  '            { name: "\u767B\u5F55\u83B7\u53D6\u4EE4\u724C", method: "POST", path: "<\u767B\u5F55\u8DEF\u5F84>",',
  '              request: { body: { username: "{{vars.username}}", password: "{{vars.password}}" } }, status: 200,',
  '              assertions: [{ name: "\u4EE4\u724C\u5B58\u5728", path: "data.accessToken", exists: true }],',
  '              extract: [{ name: "accessToken", path: "data.accessToken" }] },',
  '            { name: "\u67E5\u8BE2\u5F53\u524D\u7528\u6237", method: "GET", path: "<\u5F53\u524D\u7528\u6237\u8DEF\u5F84>",',
  '              request: { headers: { Authorization: "Bearer {{vars.accessToken}}" } }, status: 200,',
  '              assertions: [{ name: "\u7528\u6237 ID \u5B58\u5728", path: "data.id", exists: true }] }',
  "        ]",
  "    }));",
  "",
  '\u8BA4\u8BC1\u4F4D\u4E8E Query\u3001Header \u6216 Body \u65F6\uFF0C\u76F4\u63A5\u5728 params\u3001request.headers \u6216 request.body \u5F15\u7528\u53D8\u91CF\u3002\u6D4F\u89C8\u5668 Cookie \u4F1A\u8BDD\u5FC5\u987B\u6709\u4EE3\u7801\u4F9D\u636E\u5E76\u663E\u5F0F\u8BBE\u7F6E request.credentials: "include"\uFF1BNode CLI \u5F53\u524D\u4E0D\u63D0\u4F9B\u81EA\u52A8 Cookie Jar\u3002\u6CA1\u6709\u53EF\u786E\u8BA4\u767B\u5F55\u63A5\u53E3\u65F6\uFF0C\u53EA\u5728 vars \u548C variables \u4E2D\u58F0\u660E\u5DF2\u6709\u51ED\u636E\uFF0C\u4E0D\u80FD\u865A\u6784\u767B\u5F55\u6D41\u7A0B\u3002',
  "",
  "## \u6A21\u5F0F\u4E8C\uFF1A\u53EA\u8BFB\u5217\u8868\u3001\u63D0\u53D6 ID\u3001\u8BE6\u60C5\u6821\u9A8C",
  "",
  '    ScenarioTest.registerScenario("record-list-detail", ScenarioTest.defineScenario({',
  '        name: "\u67E5\u8BE2\u8BB0\u5F55\u5217\u8868\u548C\u8BE6\u60C5", vars: { recordId: "" }, steps: [',
  '            { name: "\u67E5\u8BE2\u7B2C\u4E00\u9875\u8BB0\u5F55", method: "GET", path: "<\u5217\u8868\u8DEF\u5F84>",',
  '              params: { pageNo: 1, pageSize: 10, keyword: "{{vars.keyword}}" }, status: 200,',
  '              assertions: [{ name: "\u5217\u8868\u5B58\u5728", path: "data.records", exists: true }],',
  '              extract: [{ name: "recordId", path: "data.records[0].id" }] },',
  '            { name: "\u67E5\u8BE2\u7B2C\u4E00\u6761\u8BB0\u5F55\u8BE6\u60C5", when: { from: "vars", path: "recordId", exists: true },',
  '              method: "GET", path: "<\u8BE6\u60C5\u8DEF\u5F84>/{{vars.recordId}}", status: 200,',
  '              assertions: [{ name: "\u8BE6\u60C5 ID \u5339\u914D", path: "data.id", equals: "{{vars.recordId}}" }] }',
  "        ]",
  "    }));",
  "",
  "\u5217\u8868\u5141\u8BB8\u4E3A\u7A7A\u65F6\u4FDD\u7559 when \u8BA9\u8BE6\u60C5\u8DF3\u8FC7\uFF0C\u6216\u5728\u786E\u8BA4\u5B89\u5168\u524D\u7F6E\u6761\u4EF6\u540E\u5148\u521B\u5EFA\u4E13\u5C5E\u6D4B\u8BD5\u6570\u636E\uFF1B\u4E0D\u8981\u5047\u5B9A\u4EFB\u4F55\u73AF\u5883\u4E00\u5B9A\u6709\u6570\u636E\u3002",
  "",
  "## \u6A21\u5F0F\u4E09\uFF1A\u521B\u5EFA\u3001\u67E5\u8BE2\u3001\u7CBE\u786E\u6E05\u7406",
  "",
  '    ScenarioTest.registerScenario("record-create-query-cleanup", ScenarioTest.defineScenario({',
  '        name: "\u521B\u5EFA\u3001\u67E5\u8BE2\u5E76\u6E05\u7406\u6D4B\u8BD5\u8BB0\u5F55",',
  '        vars: { recordId: "", recordName: "scenario-{{vars.runNo}}" }, steps: [',
  '            { name: "\u521B\u5EFA\u6D4B\u8BD5\u8BB0\u5F55", method: "POST", path: "<\u521B\u5EFA\u8DEF\u5F84>", request: { body: { name: "{{vars.recordName}}" } }, status: 201, extract: [{ name: "recordId", path: "data.id" }] },',
  '            { name: "\u67E5\u8BE2\u521A\u521B\u5EFA\u7684\u8BB0\u5F55", method: "GET", path: "<\u8BE6\u60C5\u8DEF\u5F84>/{{vars.recordId}}", status: 200, assertions: [{ name: "\u540D\u79F0\u5339\u914D\u672C\u6B21\u6807\u8BB0", path: "data.name", equals: "{{vars.recordName}}" }] },',
  '            { name: "\u5220\u9664\u672C\u6B21\u521B\u5EFA\u7684\u8BB0\u5F55", when: { from: "vars", path: "recordId", exists: true }, method: "DELETE", path: "<\u5220\u9664\u8DEF\u5F84>/{{vars.recordId}}", status: 204 }',
  "        ]",
  "    }));",
  "",
  "\u6570\u636E\u540D\u5FC5\u987B\u6709 scenario-{{vars.runNo}} \u4E00\u7C7B\u6D4B\u8BD5\u6807\u8BB0\u3002\u53EA\u6709\u5220\u9664\u63A5\u53E3\u3001\u6743\u9650\u548C\u6761\u4EF6\u5747\u5DF2\u786E\u8BA4\u65F6\u624D\u52A0\u5165\u6E05\u7406\uFF1B\u4E25\u7981\u6309\u540D\u79F0\u6A21\u7CCA\u5339\u914D\u6216\u5220\u9664\u672A\u5E26\u573A\u666F\u6807\u8BB0\u7684\u6570\u636E\u3002",
  "",
  "## \u6A21\u5F0F\u56DB\uFF1A\u63D0\u4EA4\u5F02\u6B65\u4EFB\u52A1\u5E76\u8F6E\u8BE2",
  "",
  '    ScenarioTest.registerScenario("task-submit-poll", ScenarioTest.defineScenario({',
  '        name: "\u63D0\u4EA4\u4EFB\u52A1\u5E76\u7B49\u5F85\u5B8C\u6210", vars: { taskId: "" }, steps: [',
  '            { name: "\u63D0\u4EA4\u4EFB\u52A1", method: "POST", path: "<\u63D0\u4EA4\u8DEF\u5F84>", status: 202, extract: [{ name: "taskId", path: "data.taskId" }] },',
  '            { name: "\u8F6E\u8BE2\u76F4\u5230\u4EFB\u52A1\u6210\u529F", method: "GET", path: "<\u4EFB\u52A1\u8BE6\u60C5\u8DEF\u5F84>/{{vars.taskId}}", status: 200, retryUntil: { maxAttempts: 10, intervalMs: 1000 }, assertions: [{ name: "\u4EFB\u52A1\u6210\u529F", path: "<\u72B6\u6001\u5B57\u6BB5>", equals: "<\u5DF2\u786E\u8BA4\u7684\u5B8C\u6210\u72B6\u6001>" }] }',
  "        ]",
  "    }));",
  "",
  "\u7981\u6B62\u56FA\u5B9A sleep\uFF0C\u4F7F\u7528 retryUntil\u3002\u91CD\u8BD5\u6B21\u6570\u3001\u95F4\u9694\u3001\u72B6\u6001\u5B57\u6BB5\u548C\u5B8C\u6210\u72B6\u6001\u5FC5\u987B\u4ECE\u9879\u76EE\u5B9E\u73B0\u3001\u679A\u4E3E\u3001\u6587\u6863\u6216\u65E2\u6709\u6D4B\u8BD5\u786E\u8BA4\uFF1B\u65E0\u6CD5\u786E\u8BA4\u7EC8\u6001\u65F6\u6700\u591A\u751F\u6210\u4E00\u6B21\u72B6\u6001\u67E5\u8BE2\uFF0C\u4E0D\u751F\u6210 retryUntil\u3002retryUntil \u7684\u65AD\u8A00\u5FC5\u987B\u6BD4\u8F83\u5DF2\u786E\u8BA4\u7EC8\u6001\uFF0C\u4E0D\u80FD\u53EA\u68C0\u67E5 exists\u3002",
  "",
  "## \u6A21\u5F0F\u4E94\uFF1A\u4E3A\u6821\u9A8C\u5931\u8D25\u4E0E\u6743\u9650\u62D2\u7EDD\u5206\u522B\u5EFA\u573A\u666F",
  "",
  "\u540C\u4E00\u4E1A\u52A1\u529F\u80FD\u7684\u4E0D\u540C\u9A8C\u8BC1\u8DEF\u5F84\u4F7F\u7528\u72EC\u7ACB\u573A\u666F\uFF0C\u4E0D\u628A\u53C2\u6570\u6821\u9A8C\u3001\u6743\u9650\u3001\u8FB9\u754C\u503C\u7B49\u4E92\u4E0D\u4F9D\u8D56\u7684\u5931\u8D25\u5206\u652F\u585E\u8FDB\u4E00\u4E2A failurePolicy: continue \u573A\u666F\u3002\u793A\u4F8B\uFF1A",
  "",
  '    ScenarioTest.registerScenario("record-create-required-field", ScenarioTest.defineScenario({',
  '        name: "\u8BB0\u5F55\u521B\u5EFA / \u7F3A\u5C11\u5FC5\u586B\u5B57\u6BB5", steps: [',
  '            { name: "\u7F3A\u5C11\u5FC5\u586B\u5B57\u6BB5\u65F6\u521B\u5EFA\u88AB\u62D2\u7EDD", method: "POST", path: "<\u521B\u5EFA\u8DEF\u5F84>", request: { body: {} }, status: 400, assertions: [{ name: "\u8FD4\u56DE\u5DF2\u786E\u8BA4\u9519\u8BEF\u7801", path: "code", equals: "<\u9519\u8BEF\u7801>" }] }',
  "        ]",
  "    }));",
  "",
  '    ScenarioTest.registerScenario("record-create-unauthorized", ScenarioTest.defineScenario({',
  '        name: "\u8BB0\u5F55\u521B\u5EFA / \u672A\u8BA4\u8BC1\u62D2\u7EDD", steps: [',
  '            { name: "\u672A\u8BA4\u8BC1\u65F6\u521B\u5EFA\u88AB\u62D2\u7EDD", method: "POST", path: "<\u521B\u5EFA\u8DEF\u5F84>", request: { body: { "<\u5DF2\u786E\u8BA4\u5B57\u6BB5\u540D>": "<\u5DF2\u786E\u8BA4\u5408\u6CD5\u503C>" } }, status: 401 }',
  "        ]",
  "    }));",
  "",
  "\u72B6\u6001\u7801\u548C\u4E1A\u52A1\u9519\u8BEF\u7801\u5FC5\u987B\u6765\u81EA\u771F\u5B9E\u4EE3\u7801\u6216\u6587\u6863\u3002\u9519\u8BEF\u54CD\u5E94\u4F53\u6CA1\u6709\u8BC1\u636E\u65F6\u53EA\u65AD\u8A00 HTTP status\uFF0C\u4E0D\u65AD\u8A00 code\u3001message\u3001error \u7B49\u5B57\u6BB5\u3002failurePolicy: continue \u53EA\u7528\u4E8E\u540C\u4E00\u9A8C\u8BC1\u8DEF\u5F84\u4E2D\u9700\u8981\u7EE7\u7EED\u6536\u96C6\u7684\u6B65\u9AA4\u5931\u8D25\uFF0C\u4E0D\u80FD\u7528\u6765\u5408\u5E76\u4E0D\u540C\u573A\u666F\u3002",
  "",
  "## \u7ED9 AI \u7684\u6700\u5C0F\u8F93\u5165",
  "",
  "AI \u65E0\u6CD5\u5B9A\u4F4D\u63A5\u53E3\u65F6\uFF0C\u63D0\u4F9B Controller \u6587\u4EF6\u8DEF\u5F84\u3001OpenAPI \u5BFC\u51FA\u3001\u524D\u7AEF API \u6A21\u5757\u8DEF\u5F84\u3001\u5DF2\u6709\u8BF7\u6C42\u54CD\u5E94\u6837\u4F8B\u3001\u8BA4\u8BC1\u63A5\u53E3\u6837\u4F8B\u6216\u6D4B\u8BD5\u53D8\u91CF\u540D\u4E2D\u7684\u4EFB\u4E00\u9879\u3002\u4E0D\u8981\u63D0\u4F9B\u751F\u4EA7\u51ED\u636E\u6216\u4E2A\u4EBA\u6570\u636E\u3002"
].join("\n");
function createProjectFiles(directory = "scenario-test", options = {}) {
  const storagePrefix = options.storagePrefix || "scenario-test.project";
  const frameworkPrefix = `${directory}/.scenario-test`;
  const frameworkDisplay = `.scenario-test/`;
  const authoringPromptPath = `${frameworkPrefix}/AI_SCENARIO_PROMPT.md`;
  return {
    [`${directory}/index.html`]: `<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>\u573A\u666F\u6D4B\u8BD5</title>
</head>
<body style="margin:0">
    <div id="scenario-test" style="height:100vh"></div>
    <!-- \u8FD0\u884C\u65F6\u4E3A\u9879\u76EE\u5185\u526F\u672C .scenario-test/scenario-test.umd.js\uFF08init \u843D\u76D8\uFF0C\u79BB\u7EBF\u53EF\u7528\uFF09\uFF1B\u63A5\u53E3\u901A\u8FC7 serve \u4EE3\u7406\u8BBF\u95EE -->
    <script src="./.scenario-test/scenario-test.umd.js"></script>
    <script src="./scenario.config.js"></script>
    <script>
        ScenarioTest.createApp({ mount: "#scenario-test", config: ScenarioTest.getConfig() });
    </script>
</body>
</html>
`,
    [`${directory}/start-scenario-test.cmd`]: `@echo off
setlocal
cd /d "%~dp0"

set "SCENARIO_TEST_URL=http://127.0.0.1:4300/"
start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Milliseconds 700; Start-Process '%SCENARIO_TEST_URL%'"
call node "%~dp0.scenario-test\\scenario-test-cli.cjs" serve --config "%~dp0scenario.config.js" --port 4300

if errorlevel 1 (
    echo.
    echo Scenario Test failed to start. Run init first to generate runtime files.
    pause
)
`,
    [`${directory}/scenario.config.js`]: `/// <reference types="@yc_yzkj/scenario-test" />
ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    envs: [
        {
            key: "local",
            name: "\u672C\u5730\u5F00\u53D1",
            baseUrl: "http://localhost:8080",
            // \u672A\u786E\u8BA4\u524D\u4FDD\u6301\u4E3A\u7A7A\uFF1B\u6309\u771F\u5B9E\u9879\u76EE\u9700\u8981\u6DFB\u52A0 header / cookie / query
            globals: []
        }
    ],
    defaultEnvKey: "local",
    storagePrefix: ${JSON.stringify(storagePrefix)},
    requestTimeoutMs: 30000,
    vars: {},
    variables: [],
    scenarios: []
}));
`,
    [`${frameworkPrefix}/AI_SCENARIO_PROMPT.md`]: AUTHORING_PROMPT,
    [`${frameworkPrefix}/SCENARIO_PATTERNS.md`]: SCENARIO_PATTERNS,
    [`${directory}/README.md`]: `# \u573A\u666F\u6D4B\u8BD5

\u672C\u76EE\u5F55\u662F\u5F53\u524D\u9879\u76EE\u7684\u573A\u666F\u6D4B\u8BD5\u5165\u53E3\u3002\u5B83\u4E0E\u4E1A\u52A1\u4EE3\u7801\u540C\u4ED3\u7EF4\u62A4\uFF1A\u73AF\u5883\u5730\u5740\u3001\u6D4B\u8BD5\u53D8\u91CF\u3001\u573A\u666F\u6587\u4EF6\u548C\u9879\u76EE\u4E13\u5C5E\u63D2\u4EF6\u653E\u5728\u8FD9\u91CC\uFF1B\u6D4F\u89C8\u5668\u5DE5\u4F5C\u53F0\u4E0E CLI \u7531 npm \u5305 @yc_yzkj/scenario-test \u63D0\u4F9B\u3002

\u8FD0\u884C\u65F6\u901A\u8FC7 npm \u5B89\u88C5\uFF08\`npm install -D @yc_yzkj/scenario-test\`\uFF09\u540E\u7531 \`npx @yc_yzkj/scenario-test\` \u8C03\u7528\uFF1B\u9879\u76EE\u5185 \`${frameworkDisplay}\` \u53EA\u4FDD\u5B58 AI \u89C4\u5219\u4E0E\u6A21\u5F0F\u5E93\uFF0C\u4E1A\u52A1\u4EBA\u5458\u901A\u5E38\u4E0D\u9700\u8981\u6253\u5F00\u6216\u4FEE\u6539\u3002

## \u5F00\u59CB\u4F7F\u7528

\u5982\u679C\u5B89\u88C5\u4F1A\u8BDD\u8FD8\u5728\u7EE7\u7EED\uFF0C\u76F4\u63A5\u56DE\u7B54 AI \u63D0\u51FA\u7684\u4E1A\u52A1\u529F\u80FD\u95EE\u9898\u5373\u53EF\uFF1BAI \u5DF2\u8BFB\u53D6\u672C\u76EE\u5F55\u7684\u89C4\u5219\uFF0C\u4E0D\u9700\u8981\u518D\u6B21\u590D\u5236\u4EFB\u4F55 Prompt\u3002

\u5982\u679C\u65B0\u5F00\u4E86 AI \u4F1A\u8BDD\uFF0C\u53EA\u9700\u8F93\u5165\uFF1A

\`\`\`text
\u8BF7\u8BFB\u53D6 ${authoringPromptPath}\uFF0C\u4E3A\u201C<\u4E1A\u52A1\u529F\u80FD\u540D\u79F0>\u201D\u8BBE\u8BA1\u573A\u666F\u6D4B\u8BD5\u3002\u5165\u53E3\uFF1A<\u9875\u9762\u3001Controller\u3001\u63A5\u53E3\u6216\u5DF2\u6709\u6D4B\u8BD5\u8DEF\u5F84>\u3002
\`\`\`

\u63A5\u4E0B\u6765\uFF1A

1. AI \u5148\u8F93\u51FA\u529F\u80FD\u5361\u7247\u548C\u573A\u666F\u77E9\u9635\uFF1B\u7528\u6237\u53EA\u9700\u786E\u8BA4\u4E1A\u52A1\u89C4\u5219\uFF0C\u5E76\u5728 AI \u8BE2\u95EE\u65F6\u63D0\u4F9B\u73AF\u5883\u5730\u5740\u3001\u5B89\u5168\u6D4B\u8BD5\u8D26\u53F7\u3001Token\u3001\u679A\u4E3E\u503C\u6216\u6D4B\u8BD5\u6570\u636E\u3002
2. AI \u8D1F\u8D23\u7EF4\u62A4 \`scenario.config.js\` \u548C \`scenarios/\`\u3002\u4E00\u6B21\u53EA\u5904\u7406\u4E00\u4E2A\u4E1A\u52A1\u529F\u80FD\uFF0C\u4E0D\u626B\u63CF\u6574\u4E2A\u9879\u76EE\u6279\u91CF\u751F\u6210\u3002
3. AI \u7ED9\u51FA\u547D\u4EE4\u540E\uFF0C\u518D\u9010\u4E2A\u8C03\u8BD5\u8BE5\u529F\u80FD\u4E0B\u7684\u573A\u666F\u3002\u521D\u59CB\u573A\u666F\u6E05\u5355\u4E3A\u7A7A\u65F6\u4E0D\u8981\u8FD0\u884C \`--all\`\u3002

## \u76EE\u5F55\u8BF4\u660E

| \u8DEF\u5F84 | \u4F5C\u7528 | \u662F\u5426\u5E94\u4FEE\u6539 |
| --- | --- | --- |
| \`index.html\` | \u6D4F\u89C8\u5668\u5DE5\u4F5C\u53F0\u5165\u53E3 | \u901A\u5E38\u4E0D\u9700\u8981 |
| \`start-scenario-test.cmd\` | Windows \u4EBA\u5DE5\u6D4B\u8BD5\u5165\u53E3\uFF1B\u53CC\u51FB\u540E\u542F\u52A8 HTTP Server \u5E76\u6253\u5F00\u5DE5\u4F5C\u53F0 | \u901A\u5E38\u4E0D\u9700\u8981 |
| \`scenario.config.js\` | \u73AF\u5883\u3001\u6D4B\u8BD5\u53D8\u91CF\u548C\u573A\u666F\u6E05\u5355\uFF1B\u901A\u5E38\u7531 AI \u6309\u7528\u6237\u63D0\u4F9B\u7684\u4FE1\u606F\u7EF4\u62A4 | \u6309\u9700 |
| \`scenarios/\` | \u6309\u4E1A\u52A1\u529F\u80FD\u5EFA\u5B50\u76EE\u5F55\uFF1B\u76EE\u5F55\u5185\u4E00\u4E2A\u6587\u4EF6\u5BF9\u5E94\u8BE5\u529F\u80FD\u7684\u4E00\u6761\u72EC\u7ACB\u9A8C\u8BC1\u8DEF\u5F84 | \u7531 AI \u7EF4\u62A4 |
| \`plugins/\` | \u4EC5\u5F53\u524D\u9879\u76EE\u9700\u8981\u7684\u6587\u4EF6\u3001Excel \u6216\u4E1A\u52A1\u6269\u5C55 | \u6309\u9700\u65B0\u5EFA |
| \`${frameworkDisplay}\` | AI \u89C4\u5219\u4E0E\u6A21\u5F0F\u5E93\uFF08\u8FD0\u884C\u65F6\u5728 npm \u5305\u4E2D\uFF09 | \u4E0D\u9700\u8981\u7528\u6237\u4FEE\u6539 |

## \u914D\u7F6E\u73AF\u5883\u548C\u53D8\u91CF

\`scenario.config.js\` \u53EA\u6709\u4E94\u4E2A\u6838\u5FC3\u6982\u5FF5\uFF1A

- \`envs\`\uFF1A\u73AF\u5883\u540D\u79F0\u548C\u63A5\u53E3\u57FA\u7840\u5730\u5740\u3002\u6BCF\u4E2A\u73AF\u5883\u5FC5\u987B\u6709\u552F\u4E00\u7684 \`key\`\u3002
- \`globals\`\uFF1A\u5168\u5C40\u53C2\u6570\uFF0C\u8FFD\u52A0\u5230\u6BCF\u4E2A\u8BF7\u6C42\u3002\u652F\u6301 ${GLOBALS_TYPES_BACKTICK} \u4E09\u79CD\u7C7B\u578B\uFF0C\u53EF\u914D\u7F6E\u5728\u9876\u5C42\uFF08\u6240\u6709\u73AF\u5883\u751F\u6548\uFF09\u6216\u5355\u4E2A\u73AF\u5883\u5185\u3002\u503C\u652F\u6301 \`{{vars.xxx}}\` \u6A21\u677F\uFF1B\u6B65\u9AA4\u663E\u5F0F\u58F0\u660E\u7684\u540C\u540D\u53C2\u6570\u4F18\u5148\u4E8E\u5168\u5C40\u53C2\u6570\u3002CLI \u53EF\u7528 \`SCENARIO_GLOBALS\` \u73AF\u5883\u53D8\u91CF\uFF08JSON \u6570\u7EC4\uFF09\u8986\u76D6\uFF0C\u5982 \`[{"type":"header","name":"Authorization","value":"Bearer x"}]\`\u3002
- \`vars\`\uFF1A\u672C\u9879\u76EE\u542F\u52A8\u65F6\u4F7F\u7528\u7684\u9ED8\u8BA4\u53D8\u91CF\u3002\u79C1\u6709\u9879\u76EE\u53EF\u5728\u8FD9\u91CC\u4FDD\u5B58\u56E2\u961F\u8054\u8C03 Key\u3001Secret\u3001Token\u3001\u6D4B\u8BD5\u8D26\u53F7\u7B49\u3002
- \`variables\`\uFF1A\u9875\u9762\u4E0A\u9700\u8981\u5C55\u793A\u6216\u5141\u8BB8\u8986\u76D6\u7684\u53D8\u91CF\u5143\u6570\u636E\uFF0C\u5305\u62EC\u6807\u7B7E\u3001\u662F\u5426\u5FC5\u586B\uFF0C\u4EE5\u53CA\u53EF\u9009\u7684 CLI \u73AF\u5883\u53D8\u91CF\u540D\u3002\u5B9E\u9645\u9ED8\u8BA4\u503C\u4F18\u5148\u5199\u5728 \`vars\`\uFF0C\u4E0D\u8981\u91CD\u590D\u7EF4\u62A4\u3002
- \`scenarios\`\uFF1A\u573A\u666F id\u3001\u540D\u79F0\u548C\u5BF9\u5E94 JS \u6587\u4EF6\u5730\u5740\u3002\u9700\u8981\u4EBA\u5DE5\u524D\u7F6E\u6761\u4EF6\u6216\u5199\u6570\u636E\u7684\u573A\u666F\u53EF\u52A0 \`manual: true\`\uFF1A\`--all\` \u9ED8\u8BA4\u6392\u9664\uFF0C\`--scenario <id>\` \u53EF\u663E\u5F0F\u6267\u884C\u3002

\u6700\u5C0F\u914D\u7F6E\u793A\u4F8B\uFF1A

\`\`\`js
ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    globals: [
        { type: "header", name: "X-Project", value: "project-test" }
    ],
    envs: [
        { key: "local", name: "\u672C\u5730\u5F00\u53D1", baseUrl: "http://localhost:8080" },
        { key: "test", name: "\u6D4B\u8BD5\u73AF\u5883", baseUrl: "https://test.example.com" }
    ],
    defaultEnvKey: "local",
    requestTimeoutMs: 30000,
    vars: {
        clientId: "project-test-client",
        clientSecret: "replace-with-private-value"
    },
    variables: [
        { name: "clientId", label: "\u5BA2\u6237\u7AEF ID", required: true },
        { name: "clientSecret", label: "\u5BA2\u6237\u7AEF\u5BC6\u94A5", required: true, env: "SCENARIO_CLIENT_SECRET" }
    ],
    scenarios: [
        { id: "order-create-success", name: "\u8BA2\u5355\u521B\u5EFA / \u6210\u529F", url: "scenarios/order-create/success.js" },
        { id: "order-create-required-field", name: "\u8BA2\u5355\u521B\u5EFA / \u7F3A\u5C11\u5FC5\u586B\u5B57\u6BB5", url: "scenarios/order-create/required-field.js" }
    ]
}));
\`\`\`

\u53D8\u91CF\u4F18\u5148\u7EA7\u56FA\u5B9A\u5982\u4E0B\uFF1A

\`CLI \u73AF\u5883\u53D8\u91CF / \u6D4F\u89C8\u5668\u9875\u9762\u8986\u76D6 > scenario.config.js \u7684 vars > \u573A\u666F vars > variables[].defaultValue\`

\u6D4F\u89C8\u5668\u4E2D\u4FDD\u5B58\u7684\u53D8\u91CF\u4F1A\u6309\u9879\u76EE \`storagePrefix\` \u548C\u73AF\u5883\u4FDD\u5B58\u5230 LocalStorage\uFF1B\u70B9\u51FB\u6E05\u9664\u5F53\u524D\u73AF\u5883\u8986\u76D6\u540E\uFF0C\u7ACB\u5373\u56DE\u9000\u5230 \`vars\`\u3002CLI \u53EA\u8BFB\u53D6\u7CFB\u7EDF\u73AF\u5883\u53D8\u91CF\u548C\u914D\u7F6E\u6587\u4EF6\uFF0C\u4E0D\u8BFB\u53D6\u6D4F\u89C8\u5668 LocalStorage\u3002 \`init\` \u4F1A\u6839\u636E\u9879\u76EE\u76EE\u5F55\u540D\u751F\u6210\u9694\u79BB\u524D\u7F00\u3002

## \u7F16\u5199\u573A\u666F

\u5148\u786E\u5B9A\u4E00\u4E2A\u4E1A\u52A1\u529F\u80FD\uFF0C\u518D\u4E3A\u5B83\u8BBE\u8BA1\u573A\u666F\u77E9\u9635\u3002\u4E1A\u52A1\u529F\u80FD\u662F\u8BBE\u8BA1\u4E0E\u76EE\u5F55\u8FB9\u754C\uFF0C\u573A\u666F\u662F\u8BE5\u529F\u80FD\u4E0B\u7684\u4E00\u6761\u72EC\u7ACB\u9A8C\u8BC1\u8DEF\u5F84\uFF0C\u4F8B\u5982\u6210\u529F\u3001\u4E1A\u52A1\u89C4\u5219\u6821\u9A8C\u3001\u6743\u9650\u62D2\u7EDD\u3001\u8FB9\u754C\u503C\u3001\u91CD\u590D\u64CD\u4F5C\u6216\u72B6\u6001\u6D41\u8F6C\u3002\u53EA\u751F\u6210\u6709\u4EE3\u7801\u6216\u6587\u6863\u4F9D\u636E\u7684\u8DEF\u5F84\u3002

\u5EFA\u8BAE\u4F7F\u7528 \`scenarios/<\u529F\u80FD\u6807\u8BC6>/<\u9A8C\u8BC1\u8DEF\u5F84>.js\`\uFF0C\u573A\u666F id \u4F7F\u7528 \`<\u529F\u80FD\u6807\u8BC6>-<\u9A8C\u8BC1\u8DEF\u5F84>\`\uFF0C\u540D\u79F0\u4F7F\u7528 \`\u529F\u80FD\u540D / \u9A8C\u8BC1\u8DEF\u5F84\`\u3002\u8FD0\u884C\u65F6\u4ECD\u4F7F\u7528\u6241\u5E73\u7684 \`scenarios\` \u6E05\u5355\uFF0C\u4E0D\u9700\u8981\u65B0\u589E\u529F\u80FD\u5206\u7EC4\u5B57\u6BB5\u3002\u4E00\u4E2A\u573A\u666F\u53EF\u4EE5\u5305\u542B\u51C6\u5907\u6570\u636E\u3001\u6267\u884C\u76EE\u6807\u64CD\u4F5C\u3001\u67E5\u8BE2\u7ED3\u679C\u548C\u7CBE\u786E\u6E05\u7406\u7B49\u591A\u4E2A\u6B65\u9AA4\uFF0C\u4F46\u8FD9\u4E9B\u6B65\u9AA4\u5FC5\u987B\u53EA\u670D\u52A1\u4E8E\u76EE\u6807\u529F\u80FD\uFF0C\u4E0D\u80FD\u628A\u76F8\u90BB\u4E1A\u52A1\u529F\u80FD\u4E32\u6210\u4E00\u4E2A\u5927\u573A\u666F\u3002\u6BCF\u4E2A\u573A\u666F\u5FC5\u987B\u72EC\u7ACB\u8FD0\u884C\uFF0C\u6587\u4EF6\u6CE8\u518C id \u4E0E\u914D\u7F6E id \u4FDD\u6301\u4E00\u81F4\u3002

\u4E0B\u9762\u662F\u201C\u8BA2\u5355\u521B\u5EFA\u201D\u529F\u80FD\u7684\u6210\u529F\u573A\u666F\uFF1B\u201C\u7F3A\u5C11\u5FC5\u586B\u5B57\u6BB5\u201D\u201C\u672A\u8BA4\u8BC1\u62D2\u7EDD\u201D\u7B49\u5E94\u5206\u522B\u5EFA\u7ACB\u540C\u529F\u80FD\u4E0B\u7684\u5176\u4ED6\u573A\u666F\u6587\u4EF6\uFF1A

\`\`\`js
ScenarioTest.registerScenario("order-create-success", ScenarioTest.defineScenario({
    name: "\u8BA2\u5355\u521B\u5EFA / \u6210\u529F",
    vars: { orderName: "scenario-{{vars.runNo}}" },
    steps: [
        {
            name: "\u521B\u5EFA\u8BA2\u5355",
            method: "POST",
            path: "api/orders",
            request: {
                headers: { Authorization: "Bearer {{vars.token}}" },
                body: { name: "{{vars.orderName}}" }
            },
            status: 201,
            extract: [{ name: "orderId", path: "data.id" }]
        },
        {
            name: "\u67E5\u8BE2\u521A\u521B\u5EFA\u7684\u8BA2\u5355",
            method: "GET",
            path: "api/orders/{{vars.orderId}}",
            status: 200,
            assertions: [
                { path: "data.name", equals: "{{vars.orderName}}" }
            ]
        }
    ]
}));
\`\`\`

\u5199\u64CD\u4F5C\u4F7F\u7528\u53EF\u8BC6\u522B\u7684\u6D4B\u8BD5\u6807\u8BB0\uFF0C\u5E76\u53EA\u6309\u672C\u573A\u666F\u521A\u521B\u5EFA\u6216\u63D0\u53D6\u5230\u7684 ID \u7CBE\u786E\u6E05\u7406\u3002\u4E0D\u540C\u9A8C\u8BC1\u76EE\u6807\u5E94\u62C6\u6210\u540C\u4E00\u529F\u80FD\u4E0B\u7684\u72EC\u7ACB\u573A\u666F\uFF0C\u4E0D\u901A\u8FC7 \`failurePolicy: "continue"\` \u628A\u65E0\u5173\u5931\u8D25\u5206\u652F\u5408\u5E76\u8D77\u6765\u3002

\u5E38\u7528\u80FD\u529B\uFF1A

- \u7528 \`{{vars.name}}\` \u5728 path\u3001Query\u3001Header\u3001Body \u4E2D\u5F15\u7528\u53D8\u91CF\u3002
- \u7528 \`extract\` \u4ECE\u54CD\u5E94\u63D0\u53D6 ID\u3001Token \u6216\u72B6\u6001\uFF0C\u518D\u4F9B\u540E\u7EED\u6B65\u9AA4\u4F7F\u7528\uFF1B\u8DEF\u5F84\u5FC5\u586B\u65F6\u52A0 \`required: true\`\uFF0C\u7F3A\u5931\u4F1A\u5931\u8D25\uFF0C\u9ED8\u8BA4\u7F3A\u5931\u53EA\u4EA7\u751F warning\u3002
- \u65AD\u8A00\u64CD\u4F5C\u7B26\uFF1A${OPERATORS_BACKTICK}\uFF1B\u6570\u503C\u6BD4\u8F83\u7528 \`gte: 5\`\uFF0C\u975E\u8D1F\u6574\u6570\u7B49\u683C\u5F0F\u6821\u9A8C\u7528 \`matches: "^\\\\d+$"\`\u3002
- \u767B\u5F55\u3001\u6362 Token\u3001\u7B7E\u540D\u90FD\u6309\u666E\u901A\u6B65\u9AA4\u548C\u53D8\u91CF\u5B9E\u73B0\uFF1B\u6D4F\u89C8\u5668 Cookie \u4F1A\u8BDD\u663E\u5F0F\u4F7F\u7528 \`request.credentials: "include"\`\uFF0CNode CLI \u5F53\u524D\u4E0D\u63D0\u4F9B\u81EA\u52A8 Cookie Jar\u3002
- \u6BCF\u4E00\u6B65\u81F3\u5C11\u5199 \`name\`\u3001\`method\`\u3001\`path\`\u3001\`status\`\uFF1B\u5173\u952E\u7ED3\u679C\u8865\u5145 \`assertions\`\u3002
- \u672A\u5199 \`status\` \u548C \`assertions\` \u65F6\u8FD0\u884C\u65F6\u9ED8\u8BA4\u8981\u6C42 HTTP 2xx\uFF0C\u4E0D\u80FD\u628A\u5F02\u5E38\u54CD\u5E94\u5F53\u6210\u529F\u3002
- \u6700\u7EC8\u4E00\u81F4\u6027\u4F7F\u7528 \`retryUntil\`\uFF0C\u907F\u514D\u56FA\u5B9A\u7B49\u5F85\uFF1B\u524D\u7F6E\u53D8\u91CF\u53EF\u80FD\u4E3A\u7A7A\u7684\u5220\u9664\u64CD\u4F5C\u4F7F\u7528 \`when\` \u4FDD\u62A4\uFF08\`when\` \u5BF9\u8C61\u5F62\u5F0F\u53EA\u5141\u8BB8 \`from: "vars"\`\uFF09\u3002
- \`runId\` / \`runNo\` \u662F\u8FD0\u884C\u65F6\u4FDD\u7559\u53D8\u91CF\uFF0C\u7981\u6B62\u5728\u914D\u7F6E\u6216\u573A\u666F\u4E2D\u58F0\u660E\u6216\u8986\u76D6\u3002
- \u9ED8\u8BA4\u5931\u8D25\u5373\u505C\u6B62\uFF1B\u53EA\u6709\u540C\u4E00\u9A8C\u8BC1\u8DEF\u5F84\u786E\u5B9E\u9700\u8981\u7EE7\u7EED\u6536\u96C6\u540E\u7EED\u6B65\u9AA4\u7ED3\u679C\u65F6\uFF0C\u624D\u5728\u573A\u666F\u4E0A\u8BBE \`failurePolicy: "continue"\`\u3002
- SKIP \u6B65\u9AA4\u4E0D\u8BA1\u5165\u901A\u8FC7/\u6267\u884C\u7EDF\u8BA1\uFF0C\u5168\u8DF3\u8FC7\u65F6\u573A\u666F\u72B6\u6001\u4E3A SKIPPED\uFF1B\u5199\u6570\u636E\u7C7B\u573A\u666F\u5728\u914D\u7F6E\u6E05\u5355\u4E2D\u52A0 \`manual: true\`\uFF0C\`--all\` \u4F1A\u9ED8\u8BA4\u6392\u9664\uFF0C\u9700\u7528 \`--scenario <id>\` \u663E\u5F0F\u6267\u884C\u3002

\u5B8C\u6574 DSL \u4E0E\u793A\u4F8B\u89C1\u516C\u5171\u5E93 README\uFF1B\u9879\u76EE\u5185\u65B0\u589E\u7528\u4F8B\u7531 AI \u8BFB\u53D6 \`${frameworkDisplay}AI_SCENARIO_PROMPT.md\` \u548C\u540C\u76EE\u5F55\u7684\u6A21\u5F0F\u5E93\u540E\u751F\u6210\u3002

## \u6D4F\u89C8\u5668\u5DE5\u4F5C\u53F0

\u53CC\u51FB\u672C\u76EE\u5F55\u4E2D\u7684 \`start-scenario-test.cmd\` \u542F\u52A8\u5DE5\u4F5C\u53F0\uFF1A\u811A\u672C\u4F7F\u7528\u9879\u76EE\u5185\u8FD0\u884C\u65F6\u526F\u672C\u542F\u52A8\u672C\u5730 HTTP Server\uFF0C\u81EA\u52A8\u6253\u5F00 \`index.html\`\uFF0C\u5E76\u628A\u63A5\u53E3\u8BF7\u6C42\u4EE3\u7406\u5230\u6240\u9009\u73AF\u5883\u7684 \`baseUrl\`\uFF08\u9875\u9762 \`baseUrl\` \u7559\u7A7A\u5373\u8D70\u4EE3\u7406\uFF09\uFF0C\u65E0\u9700\u540E\u7AEF\u653E\u884C CORS\u3002\u4EBA\u5DE5\u6D4B\u8BD5\u7ED3\u675F\u540E\u6309 \`Ctrl+C\` \u505C\u6B62\u670D\u52A1\u3002

\u4E5F\u53EF\u4EE5\u5728\u9879\u76EE\u6839\u76EE\u5F55\u6267\u884C\uFF1A

\`\`\`powershell
.\\scenario-test\\start-scenario-test.cmd
\`\`\`

\u4E0D\u8981\u76F4\u63A5\u53CC\u51FB \`index.html\`\uFF1A\u9875\u9762\u867D\u53EF\u52A0\u8F7D\uFF0C\u4F46\u63A5\u53E3\u8BF7\u6C42\u4F1A\u88AB\u6D4F\u89C8\u5668 CORS \u62E6\u622A\uFF0C\u5FC5\u987B\u901A\u8FC7 \`serve\` \u7684\u540C\u6E90\u4EE3\u7406\u6267\u884C\u3002

## CLI \u6267\u884C

\u6267\u884C\u914D\u7F6E\u4E2D\u5168\u90E8\u573A\u666F\uFF1A

\`\`\`powershell
npx @yc_yzkj/scenario-test --config ${directory}/scenario.config.js --env local --all
\`\`\`

\u6267\u884C\u5355\u4E2A\u573A\u666F\u65F6\uFF0C\u4F7F\u7528\u914D\u7F6E\u4E2D\u7684\u573A\u666F id\uFF1A

\`\`\`powershell
npx @yc_yzkj/scenario-test --config ${directory}/scenario.config.js --env local --scenario order-create-success
\`\`\`

\u5728 PowerShell \u4E2D\u4E3A\u4E00\u6B21\u6267\u884C\u4E34\u65F6\u8986\u76D6\u51ED\u636E\uFF1A

\`\`\`powershell
$env:SCENARIO_CLIENT_SECRET = "temporary-value"
npx @yc_yzkj/scenario-test --config ${directory}/scenario.config.js --env local --all
Remove-Item Env:SCENARIO_CLIENT_SECRET
\`\`\`

\u524D\u63D0\u662F\u53D8\u91CF\u5B9A\u4E49\u4E2D\u58F0\u660E\u4E86 \`env: "SCENARIO_CLIENT_SECRET"\`\u3002CLI \u53C2\u6570\u4EE5\u5F53\u524D\u7248\u672C\u7684 \`--help\` \u8F93\u51FA\u4E3A\u51C6\u3002

## \u5E38\u89C1\u95EE\u9898

### \u9875\u9762\u63D0\u793A ScenarioTest \u672A\u5B9A\u4E49\u6216\u811A\u672C\u52A0\u8F7D\u5931\u8D25

\u786E\u8BA4\u9879\u76EE \`${frameworkDisplay}\` \u4E2D\u5B58\u5728 \`scenario-test.umd.js\`\uFF08\u8FD0\u884C\u65F6\u526F\u672C\uFF0C\u7531 init \u843D\u76D8\uFF09\uFF1B\`index.html\` \u52A0\u8F7D\u7684\u662F \`./.scenario-test/scenario-test.umd.js\`\u3002\u6587\u4EF6\u7F3A\u5931\u65F6\u8FD0\u884C \`npx @yc_yzkj/scenario-test init\` \u8865\u9F50\uFF0C\u518D\u901A\u8FC7 \`start-scenario-test.cmd\` \u542F\u52A8\u5DE5\u4F5C\u53F0\u3002

### \u9875\u9762\u80FD\u6253\u5F00\u4F46\u573A\u666F\u6CA1\u6709\u52A0\u8F7D

\u901A\u8FC7 \`start-scenario-test.cmd\` \u542F\u52A8\u5DE5\u4F5C\u53F0\uFF0C\u4E0D\u8981\u4ECE \`file:///\` \u76F4\u63A5\u6253\u5F00\u9875\u9762\uFF1B\u518D\u68C0\u67E5 \`scenario.config.js\` \u7684\u573A\u666F \`id\`\u3001\`url\` \u4E0E\u573A\u666F\u6587\u4EF6\u91CC\u7684 \`registerScenario(id, ...)\` \u662F\u5426\u4E00\u81F4\u3002

### CLI \u7684\u53D8\u91CF\u548C\u9875\u9762\u4E0D\u4E00\u81F4

\u8FD9\u662F\u9884\u671F\u884C\u4E3A\uFF1A\u9875\u9762\u8BFB\u53D6\u6D4F\u89C8\u5668\u5F53\u524D\u73AF\u5883\u7684 LocalStorage \u8986\u76D6\uFF1BCLI \u4E0D\u8BFB\u53D6\u5B83\u3002\u9700\u8981\u5728 CLI \u4E34\u65F6\u66FF\u6362\u503C\u65F6\uFF0C\u4E3A \`variables\` \u914D\u7F6E \`env\` \u5E76\u8BBE\u7F6E\u5BF9\u5E94\u7CFB\u7EDF\u73AF\u5883\u53D8\u91CF\u3002

### \u65B0\u4E1A\u52A1\u529F\u80FD\u4E0D\u77E5\u9053\u5982\u4F55\u8BBE\u8BA1\u573A\u666F

\u4E0D\u8981\u5148\u626B\u63CF\u6574\u4E2A\u9879\u76EE\u6216\u6309\u63A5\u53E3\u6279\u91CF\u5EFA\u6587\u4EF6\u3002\u5148\u9009\u5B9A\u4E00\u4E2A\u4E1A\u52A1\u529F\u80FD\uFF0C\u5E76\u628A\u529F\u80FD\u540D\u79F0\u53CA\u53EF\u5B9A\u4F4D\u7684\u9875\u9762\u3001Controller\u3001OpenAPI \u8282\u70B9\u3001\u524D\u7AEF API \u6A21\u5757\u6216\u5DF2\u6709\u6D4B\u8BD5\u5165\u53E3\u4EA4\u7ED9 AI\uFF1BAI \u4F1A\u8BFB\u53D6 \`${frameworkDisplay}\` \u4E2D\u7684\u9879\u76EE\u89C4\u5219\uFF0C\u5148\u8F93\u51FA\u529F\u80FD\u5361\u7247\u548C\u573A\u666F\u77E9\u9635\u3002\u6CA1\u6709\u4F9D\u636E\u7684\u4E1A\u52A1\u89C4\u5219\u3001\u63A5\u53E3\u548C\u5B57\u6BB5\u5217\u4E3A\u5F85\u786E\u8BA4\u9879\u3002

## \u5347\u7EA7\u8FD0\u884C\u65F6

\u573A\u666F\u3001\u914D\u7F6E\u548C\u9879\u76EE\u63D2\u4EF6\u5C5E\u4E8E\u672C\u9879\u76EE\uFF0C\u5347\u7EA7\u65F6\u4E0D\u8981\u8986\u76D6\u5B83\u4EEC\u3002\u4F7F\u7528\u65B0\u7248 CLI \u5BF9\u5F53\u524D\u76EE\u5F55\u6267\u884C \`init\`\uFF1BCLI \u53EA\u4F1A\u5237\u65B0 \`${frameworkDisplay}\` \u4E2D\u7684 AI \u89C4\u5219\u4E0E\u6A21\u5F0F\u5E93\u3002\u5347\u7EA7\u540E\u5148\u8FD0\u884C doctor \u548C\u4E00\u4E2A\u4EE3\u8868\u6027\u4E1A\u52A1\u573A\u666F\uFF0C\u518D\u63D0\u4EA4\u672C\u9879\u76EE\u6539\u52A8\u3002

\u516C\u5171\u8FD0\u884C\u65F6\u4E0D\u4FDD\u5B58\u4E1A\u52A1\u5730\u5740\u3001\u8D26\u53F7\u3001Token\u3001Secret \u6216\u6D4B\u8BD5\u6570\u636E\uFF1B\u8FD9\u4E9B\u4EC5\u80FD\u653E\u5728\u5F53\u524D\u79C1\u6709\u9879\u76EE\u7684\u914D\u7F6E\u548C\u53D7\u63A7\u73AF\u5883\u53D8\u91CF\u4E2D\u3002
`
  };
}

// src/doctor.js
var import_node_fs4 = __toESM(require("node:fs"), 1);
var import_node_path5 = __toESM(require("node:path"), 1);
var import_node_crypto = __toESM(require("node:crypto"), 1);

// src/project-layout.js
var import_node_fs3 = __toESM(require("node:fs"), 1);
var import_node_path4 = __toESM(require("node:path"), 1);
var INTERNAL_DIRECTORY = ".scenario-test";
var FRAMEWORK_FILES = Object.freeze({
  authoringPrompt: "AI_SCENARIO_PROMPT.md",
  patterns: "SCENARIO_PATTERNS.md",
  cli: "scenario-test-cli.cjs",
  umd: "scenario-test.umd.js",
  dts: "scenario-test.d.ts",
  capabilities: "scenario-test-capabilities.json",
  versionLock: ".scenario-test-version.json"
});
function toRelativePath(...segments) {
  return import_node_path4.default.join(...segments).replace(/\\/g, "/");
}
function createProjectLayout(projectRoot, directory, legacy = false) {
  const publicDir = import_node_path4.default.resolve(projectRoot, directory);
  const frameworkDir = legacy ? publicDir : import_node_path4.default.join(publicDir, INTERNAL_DIRECTORY);
  const frameworkRelativeDir = legacy ? directory : toRelativePath(directory, INTERNAL_DIRECTORY);
  return Object.freeze({
    legacy,
    publicDir,
    frameworkDir,
    frameworkRelativeDir,
    publicRelativePath: (fileName) => toRelativePath(directory, fileName),
    frameworkRelativePath: (fileName) => toRelativePath(frameworkRelativeDir, fileName),
    frameworkPath: (fileName) => import_node_path4.default.join(frameworkDir, fileName)
  });
}
function isDirectory(target) {
  return import_node_fs3.default.existsSync(target) && import_node_fs3.default.statSync(target).isDirectory();
}
function resolveProjectLayout(projectRoot, directory) {
  const modern = createProjectLayout(projectRoot, directory, false);
  if (import_node_fs3.default.existsSync(modern.frameworkDir)) {
    if (!isDirectory(modern.frameworkDir)) {
      throw new Error(`${modern.frameworkDir} \u5FC5\u987B\u662F\u76EE\u5F55\uFF1B\u8BF7\u79FB\u8D70\u540C\u540D\u6587\u4EF6\u540E\u91CD\u8BD5`);
    }
    return modern;
  }
  return modern;
}
function resolveLayoutFromConfigDir(configDir) {
  return resolveProjectLayout(import_node_path4.default.dirname(configDir), import_node_path4.default.basename(configDir));
}

// src/doctor.js
var UMD_VERSION_PATTERN = /\/\*! scenario-test v(\d+\.\d+\.\d+) \*\//;
var DTS_VERSION_PATTERN = /scenario-test v(\d+\.\d+\.\d+)/;
function extractArtifactVersion(filePath, pattern) {
  const head = import_node_fs4.default.readFileSync(filePath, "utf8").slice(0, 4096);
  const match = pattern.exec(head);
  return match ? match[1] : null;
}
function sha256Of(filePath) {
  return import_node_crypto.default.createHash("sha256").update(import_node_fs4.default.readFileSync(filePath)).digest("hex");
}
function checkRuntimeArtifact(filePath, fileName, key, pattern) {
  if (!import_node_fs4.default.existsSync(filePath)) {
    return {
      name: key,
      status: "WARN",
      message: `\u7F3A\u5C11\u8FD0\u884C\u65F6\u526F\u672C ${fileName}\uFF08${filePath}\uFF09`,
      fix: "\u8FD0\u884C init \u8865\u9F50\uFF08\u4E0D\u4F20 --force \u4E0D\u4F1A\u8986\u76D6\u9879\u76EE\u6587\u4EF6\uFF09"
    };
  }
  const version = pattern ? extractArtifactVersion(filePath, pattern) : null;
  if (version !== null && version !== VERSION) {
    return {
      name: key,
      status: "FAIL",
      message: `\u7248\u672C\u4E0D\u4E00\u81F4\uFF1A${fileName} \u662F v${version}\uFF0C\u5F53\u524D CLI \u662F v${VERSION}`,
      fix: `\u7528 v${VERSION} \u7684 CLI \u91CD\u65B0 init \u5237\u65B0\u8FD0\u884C\u65F6\u526F\u672C`
    };
  }
  return {
    name: key,
    status: "PASS",
    message: `\u8FD0\u884C\u65F6\u526F\u672C\u5C31\u7EEA: ${fileName}${version ? `\uFF08v${version}\uFF09` : ""}`,
    fix: ""
  };
}
function checkCapabilitiesFile(filePath) {
  if (!import_node_fs4.default.existsSync(filePath)) {
    return {
      name: "capabilities",
      status: "WARN",
      message: "\u7F3A\u5C11\u8FD0\u884C\u65F6\u526F\u672C scenario-test-capabilities.json",
      fix: "\u8FD0\u884C init \u8865\u9F50\uFF08\u4E0D\u4F20 --force \u4E0D\u4F1A\u8986\u76D6\u9879\u76EE\u6587\u4EF6\uFF09"
    };
  }
  try {
    const parsed = JSON.parse(import_node_fs4.default.readFileSync(filePath, "utf8"));
    if (parsed.schema !== "scenario-test-capabilities") {
      return {
        name: "capabilities",
        status: "FAIL",
        message: "scenario-test-capabilities.json \u4E0D\u662F\u5408\u6CD5\u7684\u80FD\u529B\u6E05\u5355\uFF08schema \u4E0D\u5339\u914D\uFF09",
        fix: "\u7528\u5F53\u524D\u7248\u672C CLI \u91CD\u65B0 init \u751F\u6210"
      };
    }
    if (parsed.version !== VERSION || parsed.contractVersion !== CONTRACT_VERSION) {
      return {
        name: "capabilities",
        status: "FAIL",
        message: `\u7248\u672C\u4E0D\u4E00\u81F4\uFF1Acapabilities.json \u662F v${parsed.version}\uFF08contract v${parsed.contractVersion}\uFF09\uFF0C\u5F53\u524D CLI \u662F v${VERSION}\uFF08contract v${CONTRACT_VERSION}\uFF09`,
        fix: `\u7528 v${VERSION} \u7684 CLI \u91CD\u65B0 init \u751F\u6210 scenario-test-capabilities.json`
      };
    }
    return { name: "capabilities", status: "PASS", message: `\u7248\u672C\u4E00\u81F4\uFF08v${parsed.version}\uFF0Ccontract v${parsed.contractVersion}\uFF09`, fix: "" };
  } catch (error) {
    return {
      name: "capabilities",
      status: "FAIL",
      message: `scenario-test-capabilities.json \u89E3\u6790\u5931\u8D25: ${error.message}`,
      fix: "\u7528\u5F53\u524D\u7248\u672C CLI \u91CD\u65B0 init \u751F\u6210"
    };
  }
}
function checkVersionLock(filePath) {
  if (!import_node_fs4.default.existsSync(filePath)) {
    return {
      name: "version-lock",
      status: "WARN",
      message: "\u7F3A\u5C11\u9879\u76EE\u7248\u672C\u9501 .scenario-test-version.json",
      fix: "\u8FD0\u884C init \u5199\u5165\u7248\u672C\u9501\uFF08\u4E0D\u4F20 --force \u4E0D\u4F1A\u8986\u76D6\u9879\u76EE\u6587\u4EF6\uFF09"
    };
  }
  let lock;
  try {
    lock = JSON.parse(import_node_fs4.default.readFileSync(filePath, "utf8"));
  } catch (error) {
    return {
      name: "version-lock",
      status: "FAIL",
      message: `.scenario-test-version.json \u89E3\u6790\u5931\u8D25: ${error.message}`,
      fix: "\u4FEE\u590D\u6216\u5220\u9664\u7248\u672C\u9501\u540E\u7528\u5F53\u524D\u7248\u672C CLI \u91CD\u65B0 init \u751F\u6210"
    };
  }
  if (lock.runtimeVersion !== VERSION || lock.contractVersion !== CONTRACT_VERSION) {
    return {
      name: "version-lock",
      status: "FAIL",
      message: `\u7248\u672C\u4E0D\u4E00\u81F4\uFF1A\u7248\u672C\u9501\u8BB0\u5F55 v${lock.runtimeVersion}\uFF08contract v${lock.contractVersion}\uFF09\uFF0C\u5F53\u524D CLI \u662F v${VERSION}\uFF08contract v${CONTRACT_VERSION}\uFF09`,
      fix: `\u4F7F\u7528 v${VERSION} \u7684 CLI \u91CD\u65B0 init\uFF08\u81EA\u52A8\u5237\u65B0\u8FD0\u884C\u65F6\u526F\u672C\u4E0E\u7248\u672C\u9501\uFF0C\u4E0D\u8986\u76D6\u9879\u76EE\u914D\u7F6E/\u573A\u666F\uFF09`
    };
  }
  const extras = [];
  const files = lock.files && typeof lock.files === "object" ? lock.files : null;
  if (!files) {
    extras.push({
      name: "version-lock",
      status: "WARN",
      message: "\u7248\u672C\u9501\u7F3A\u5C11 files \u5B57\u6BB5\uFF08\u9884\u671F\u6587\u4EF6\u540D\u6E05\u5355\uFF09",
      fix: "\u7528\u5F53\u524D\u7248\u672C CLI \u91CD\u65B0 init \u5237\u65B0\u7248\u672C\u9501"
    });
  } else {
    for (const [kind, fileName] of Object.entries(files)) {
      const target = import_node_path5.default.join(import_node_path5.default.dirname(filePath), String(fileName));
      if (!import_node_fs4.default.existsSync(target)) {
        extras.push({
          name: "version-lock",
          status: "WARN",
          message: `\u7248\u672C\u9501\u58F0\u660E ${kind} \u6587\u4EF6 ${fileName} \u4E0D\u5B58\u5728`,
          fix: `\u8FD0\u884C init \u8865\u9F50 ${fileName}\uFF08\u4E0D\u4F20 --force \u4E0D\u4F1A\u8986\u76D6\u9879\u76EE\u6587\u4EF6\uFF09`
        });
      }
    }
  }
  const sha256 = lock.sha256 && typeof lock.sha256 === "object" ? lock.sha256 : null;
  if (sha256) {
    for (const [fileName, expected] of Object.entries(sha256)) {
      const target = import_node_path5.default.join(import_node_path5.default.dirname(filePath), fileName);
      if (!import_node_fs4.default.existsSync(target)) continue;
      if (sha256Of(target) !== expected) {
        extras.push({
          name: "version-lock",
          status: "WARN",
          message: `${fileName} \u7684 SHA256 \u4E0E\u7248\u672C\u9501\u8BB0\u5F55\u4E0D\u4E00\u81F4\uFF08\u53EF\u80FD\u88AB\u66FF\u6362\uFF09`,
          fix: "\u82E5\u662F\u6709\u610F\u66FF\u6362\u8FD0\u884C\u65F6\u6587\u4EF6\uFF0C\u7528\u5F53\u524D\u7248\u672C CLI \u91CD\u65B0 init \u5237\u65B0\u7248\u672C\u9501\uFF1B\u5426\u5219\u68C0\u67E5\u6587\u4EF6\u6765\u6E90"
        });
      }
    }
  }
  return {
    name: "version-lock",
    status: "PASS",
    message: `\u7248\u672C\u4E00\u81F4\uFF08v${lock.runtimeVersion}\uFF0Ccontract v${lock.contractVersion}\uFF09`,
    fix: "",
    extra: extras
  };
}
function satisfiesNodeEngine(version, range) {
  const match = /^>=\s*(\d+)(?:\.(\d+)(?:\.(\d+))?)?/.exec(String(range || "").trim());
  if (!match) return false;
  const [major, minor = 0, patch = 0] = match.slice(1).map(Number);
  const [curMajor, curMinor = 0, curPatch = 0] = String(version).replace(/^v/, "").split(".").map(Number);
  if (curMajor !== major) return curMajor > major;
  if (curMinor !== minor) return curMinor > minor;
  return curPatch >= patch;
}
function checkReadableFile(filePath, key, fileName) {
  if (!import_node_fs4.default.existsSync(filePath)) {
    return {
      name: key,
      status: "FAIL",
      message: `\u7F3A\u5C11 AI \u89C4\u5219\u6587\u4EF6 ${fileName}\uFF08${filePath}\uFF09`,
      fix: "\u8FD0\u884C init \u8865\u9F50\uFF08\u4E0D\u4F1A\u8986\u76D6\u9879\u76EE\u914D\u7F6E/\u573A\u666F\uFF09"
    };
  }
  try {
    const stat = import_node_fs4.default.statSync(filePath);
    if (!stat.isFile()) throw new Error("\u8DEF\u5F84\u4E0D\u662F\u666E\u901A\u6587\u4EF6");
    import_node_fs4.default.readFileSync(filePath, "utf8");
    return { name: key, status: "PASS", message: `AI \u89C4\u5219\u5C31\u7EEA: ${fileName}`, fix: "" };
  } catch (error) {
    return {
      name: key,
      status: "FAIL",
      message: `AI \u89C4\u5219\u6587\u4EF6\u4E0D\u53EF\u8BFB\u53D6: ${fileName}\uFF08\u539F\u56E0: ${error.message}\uFF09`,
      fix: "\u79FB\u8D70\u65E0\u6548\u8DEF\u5F84\u540E\u91CD\u65B0\u8FD0\u884C init"
    };
  }
}
function buildDoctorReport(options) {
  const { configPath, api, configDir } = options;
  const checks = [];
  const info = [];
  const engineRange = contract.engines?.node || ">=18";
  checks.push(satisfiesNodeEngine(process.version, engineRange) ? { name: "node-version", status: "PASS", message: `Node ${process.version} \u6EE1\u8DB3 engines.node ${engineRange}`, fix: "" } : {
    name: "node-version",
    status: "FAIL",
    message: `Node ${process.version} \u4E0D\u6EE1\u8DB3 engines.node ${engineRange}`,
    fix: "\u5347\u7EA7 Node.js \u5230\u6EE1\u8DB3 engines \u7684\u7248\u672C\u540E\u91CD\u8BD5"
  });
  let config = null;
  if (!import_node_fs4.default.existsSync(configPath)) {
    checks.push({
      name: "config",
      status: "FAIL",
      message: `\u914D\u7F6E\u6587\u4EF6\u4E0D\u5B58\u5728: ${configPath}`,
      fix: "\u521B\u5EFA scenario.config.js\uFF08\u53EF\u7528 init \u751F\u6210\u6A21\u677F\uFF09\uFF0C\u6216\u901A\u8FC7 --config \u6307\u5B9A\u6B63\u786E\u7684\u914D\u7F6E\u6587\u4EF6"
    });
  } else {
    try {
      config = loadConfigFile(configPath, api);
      checks.push({ name: "config-load", status: "PASS", message: `\u914D\u7F6E\u53EF\u52A0\u8F7D: ${configPath}`, fix: "" });
    } catch (error) {
      checks.push({
        name: "config-load",
        status: "FAIL",
        message: `\u914D\u7F6E\u6587\u4EF6\u52A0\u8F7D\u5931\u8D25: ${configPath}\uFF08\u539F\u56E0: ${error.message}\uFF09`,
        fix: "\u68C0\u67E5\u914D\u7F6E\u8BED\u6CD5\u4E0E defineConfig \u8C03\u7528\uFF1B\u4FEE\u590D\u540E\u91CD\u65B0\u8FD0\u884C doctor"
      });
    }
  }
  if (config) {
    const entries = config.scenarios || [];
    if (entries.length === 0) {
      checks.push({ name: "scenario-list", status: "PASS", message: "\u914D\u7F6E\u4E2D\u6682\u65E0\u53EF\u68C0\u67E5\u7684\u573A\u666F\uFF08scenarios \u4E3A\u7A7A\uFF09", fix: "" });
    } else {
      let listOk = true;
      for (const entry of entries) {
        if (!entry.id || !entry.url) {
          listOk = false;
          checks.push({
            name: "scenario-list",
            status: "FAIL",
            message: `\u573A\u666F\u6E05\u5355\u9879\u7F3A\u5C11 id \u6216 url\uFF08${JSON.stringify(entry)}\uFF09`,
            fix: "\u5728 scenario.config.js \u4E2D\u4E3A\u6BCF\u4E2A\u573A\u666F\u9879\u63D0\u4F9B id\u3001name\u3001url"
          });
          continue;
        }
        if (entry.manual === true) {
          info.push({
            name: "manual-scenario",
            scenarioId: entry.id,
            message: `\u573A\u666F ${entry.id} \u6807\u8BB0\u4E3A manual:true\uFF08\u9700\u8981\u4EBA\u5DE5\u51C6\u5907\u6570\u636E\u6216\u5199\u6570\u636E\uFF09\uFF0C--all \u9ED8\u8BA4\u6392\u9664\uFF0C\u8BF7\u7528 --scenario ${entry.id} \u663E\u5F0F\u6267\u884C`
          });
        }
        let scenarioPath;
        try {
          scenarioPath = import_node_path5.default.isAbsolute(entry.url) ? entry.url : validatePath(configDir, entry.url);
        } catch (error) {
          listOk = false;
          checks.push({
            name: "scenario-list",
            status: "FAIL",
            message: `\u573A\u666F ${entry.id} \u7684 url \u4E0D\u5B89\u5168: ${entry.url}\uFF08\u539F\u56E0: ${error.message}\uFF09`,
            fix: "url \u5FC5\u987B\u662F\u914D\u7F6E\u76EE\u5F55\u5185\u7684\u76F8\u5BF9\u8DEF\u5F84"
          });
          continue;
        }
        if (import_node_path5.default.isAbsolute(entry.url)) {
          checks.push({
            name: "absolute-scenario-path",
            status: "WARN",
            message: `\u573A\u666F ${entry.id} \u4F7F\u7528\u7EDD\u5BF9\u8DEF\u5F84: ${entry.url}\uFF08run \u53EF\u6B63\u5E38\u6267\u884C\uFF0C\u4F46\u5EFA\u8BAE\u4F7F\u7528\u914D\u7F6E\u76EE\u5F55\u5185\u76F8\u5BF9\u8DEF\u5F84\uFF0C\u4FBF\u4E8E\u9879\u76EE\u8FC1\u79FB\uFF09`,
            fix: "\u5C06 scenario.config.js \u4E2D\u8BE5\u573A\u666F\u7684 url \u6539\u4E3A\u76F8\u5BF9\u8DEF\u5F84"
          });
        }
        if (!import_node_fs4.default.existsSync(scenarioPath)) {
          listOk = false;
          checks.push({
            name: "scenario-list",
            status: "FAIL",
            message: `\u573A\u666F\u6587\u4EF6\u4E0D\u5B58\u5728: ${scenarioPath}\uFF08\u573A\u666F ${entry.id}\uFF09`,
            fix: `\u521B\u5EFA\u8BE5\u6587\u4EF6\uFF0C\u6216\u5728 scenario.config.js \u4E2D\u4FEE\u6B63 url`
          });
          continue;
        }
        try {
          const scenario = loadScenarioFile(scenarioPath, entry.id, api);
          if (scenario.name) {
            checks.push({
              name: "scenario-register",
              status: "PASS",
              message: `\u573A\u666F ${entry.id} \u52A0\u8F7D\u5E76\u6CE8\u518C\u6210\u529F\uFF08${scenarioPath}\uFF09`,
              fix: ""
            });
          }
        } catch (error) {
          listOk = false;
          checks.push({
            name: "scenario-register",
            status: "FAIL",
            message: `\u573A\u666F ${entry.id} \u52A0\u8F7D/\u6CE8\u518C\u5931\u8D25: ${scenarioPath}\uFF08\u539F\u56E0: ${error.message}\uFF09`,
            fix: "\u68C0\u67E5\u573A\u666F\u6587\u4EF6\uFF1AregisterScenario(id, ...) \u7684 id \u5FC5\u987B\u4E0E scenario.config.js \u6E05\u5355 id \u4E00\u81F4\uFF1B\u65AD\u8A00/when/\u4FDD\u7559\u53D8\u91CF\u987B\u901A\u8FC7 defineScenario \u6821\u9A8C"
          });
        }
      }
      if (listOk) {
        checks.push({ name: "scenario-list", status: "PASS", message: `\u573A\u666F\u6E05\u5355\u5408\u6CD5\uFF08${entries.length} \u9879\uFF0C\u6587\u4EF6\u5747\u5B58\u5728\uFF09`, fix: "" });
      }
    }
  }
  const layout = resolveLayoutFromConfigDir(configDir);
  checks.push({
    name: "cli",
    status: "PASS",
    message: `CLI \u7248\u672C v${VERSION}\uFF08contract v${CONTRACT_VERSION}\uFF09`,
    fix: ""
  });
  for (const [key, fileName] of Object.entries({ authoringPrompt: FRAMEWORK_FILES.authoringPrompt, patterns: FRAMEWORK_FILES.patterns })) {
    checks.push(checkReadableFile(layout.frameworkPath(fileName), key, fileName));
  }
  checks.push(checkRuntimeArtifact(layout.frameworkPath(FRAMEWORK_FILES.cli), FRAMEWORK_FILES.cli, "runtime-cli", null));
  checks.push(checkRuntimeArtifact(layout.frameworkPath(FRAMEWORK_FILES.umd), FRAMEWORK_FILES.umd, "umd", UMD_VERSION_PATTERN));
  checks.push(checkRuntimeArtifact(layout.frameworkPath(FRAMEWORK_FILES.dts), FRAMEWORK_FILES.dts, "dts", DTS_VERSION_PATTERN));
  checks.push(checkCapabilitiesFile(layout.frameworkPath(FRAMEWORK_FILES.capabilities)));
  const lockResult = checkVersionLock(layout.frameworkPath(FRAMEWORK_FILES.versionLock));
  checks.push({ name: lockResult.name, status: lockResult.status, message: lockResult.message, fix: lockResult.fix });
  if (lockResult.extra) checks.push(...lockResult.extra);
  const summary = { passed: 0, warned: 0, failed: 0, info: info.length };
  for (const check of checks) {
    if (check.status === "PASS") summary.passed += 1;
    else if (check.status === "WARN") summary.warned += 1;
    else summary.failed += 1;
  }
  const exitCode = summary.failed > 0 ? 1 : 0;
  return {
    tool: "scenario-test doctor",
    runtimeVersion: VERSION,
    contractVersion: CONTRACT_VERSION,
    status: exitCode === 0 ? "OK" : "FAILED",
    checks,
    info,
    summary,
    exitCode
  };
}
var STATUS_MARK = { PASS: "[PASS]", WARN: "[WARN]", FAIL: "[FAIL]", INFO: "[INFO]" };
function renderDoctorText(report) {
  const lines = [];
  lines.push(`\u573A\u666F\u6D4B\u8BD5 Doctor`);
  lines.push(`\u7248\u672C: v${report.runtimeVersion}\uFF08contract v${report.contractVersion}\uFF09`);
  lines.push("");
  for (const check of report.checks) {
    lines.push(`${STATUS_MARK[check.status] || check.status} ${check.name}: ${check.message}`);
    if (check.fix) lines.push(`       \u5982\u4F55\u4FEE: ${check.fix}`);
  }
  for (const item of report.info) {
    lines.push(`[INFO] ${item.name}: ${item.message}`);
  }
  lines.push("");
  lines.push(`\u6458\u8981: ${report.summary.passed} PASS, ${report.summary.warned} WARN, ${report.summary.failed} FAIL, ${report.summary.info} INFO`);
  lines.push(report.exitCode === 0 ? "\u7ED3\u679C: OK\uFF08\u9000\u51FA\u7801 0\uFF09" : "\u7ED3\u679C: FAILED\uFF08\u9000\u51FA\u7801 1\uFF09");
  return lines.join("\n");
}

// src/cli.js
function argumentValue(argv, index, option) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${option} \u7F3A\u5C11\u53C2\u6570\u503C`);
  return value;
}
var FLAG_OPTIONS = /* @__PURE__ */ new Map();
var VALUE_OPTIONS = /* @__PURE__ */ new Map();
for (const [name, spec] of Object.entries(contract.cli.options)) {
  const target = `--${name}`;
  if (spec.kind === "flag") {
    FLAG_OPTIONS.set(target, spec.prop);
  } else {
    VALUE_OPTIONS.set(target, { prop: spec.prop, spec });
    for (const alias of spec.aliases || []) VALUE_OPTIONS.set(`--${alias}`, { prop: spec.prop, spec });
  }
}
function parseArgs(argv) {
  const args = { command: "run", all: false, config: "", scenario: "", env: "", baseUrl: "", authorization: "", port: 4300, project: "", dir: "", force: false, allowExternalPlugins: false, failOnSkip: false, json: false, help: false };
  let start = 0;
  if (contract.cli.commands.includes(argv[0])) {
    args.command = argv[0];
    start = 1;
  }
  let deprecatedAuthUsed = false;
  for (let index = start; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--help" || item === "-h") {
      args.help = true;
      continue;
    }
    const valueOption = VALUE_OPTIONS.get(item);
    if (valueOption) {
      const raw = argumentValue(argv, index++, item);
      args[valueOption.prop] = valueOption.spec.parse === "number" ? Number(raw) : raw;
      if (item === "--token" || item === "--authorization") deprecatedAuthUsed = true;
      continue;
    }
    const flagProp = FLAG_OPTIONS.get(item);
    if (flagProp) {
      args[flagProp] = true;
      continue;
    }
    if (item.startsWith("-")) throw new Error(`\u672A\u77E5\u53C2\u6570: ${item}`);
    else if (!args.scenario && args.command === "run") args.scenario = item;
    else throw new Error(`\u65E0\u6CD5\u8BC6\u522B\u7684\u53C2\u6570: ${item}`);
  }
  if (args.all && args.scenario) throw new Error("--all \u4E0E --scenario \u4E0D\u80FD\u540C\u65F6\u4F7F\u7528");
  if (!Number.isInteger(args.port) || args.port < 1 || args.port > 65535) throw new Error("--port \u5FC5\u987B\u662F 1-65535 \u7684\u6574\u6570");
  if (process.env.SCENARIO_AUTH) {
    args.authorization = process.env.SCENARIO_AUTH;
    if (deprecatedAuthUsed) {
      console.warn(
        "\n\u26A0\uFE0F  \u8B66\u544A: \u540C\u65F6\u68C0\u6D4B\u5230 SCENARIO_AUTH \u73AF\u5883\u53D8\u91CF\u548C --authorization \u53C2\u6570\n   \u73AF\u5883\u53D8\u91CF\u4F18\u5148\u7EA7\u66F4\u9AD8\uFF0C--authorization \u53C2\u6570\u5C06\u88AB\u5FFD\u7565\n"
      );
    }
  } else if (deprecatedAuthUsed) {
    console.warn(
      '\n\u26A0\uFE0F  \u5F03\u7528\u8B66\u544A: --authorization \u53C2\u6570\u5C06\u5728\u672A\u6765\u7248\u672C\u4E2D\u79FB\u9664\n   \u63A8\u8350\u4F7F\u7528\u73AF\u5883\u53D8\u91CF: export SCENARIO_AUTH="Bearer your-token"\n   \u539F\u56E0: \u547D\u4EE4\u884C\u53C2\u6570\u5728\u8FDB\u7A0B\u5217\u8868\u4E2D\u53EF\u89C1\uFF0C\u5B58\u5728\u5B89\u5168\u98CE\u9669\n'
    );
  }
  return args;
}
function parseGlobalsEnv() {
  const raw = process.env.SCENARIO_GLOBALS;
  if (!raw) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('SCENARIO_GLOBALS \u5FC5\u987B\u662F\u5408\u6CD5\u7684 JSON \u6570\u7EC4\uFF0C\u4F8B\u5982 [{"type":"header","name":"X-Token","value":"abc"}]');
  }
  if (!Array.isArray(parsed)) throw new Error("SCENARIO_GLOBALS \u5FC5\u987B\u662F JSON \u6570\u7EC4");
  const types = contract.globals.types;
  return parsed.map((item, index) => {
    if (!item || typeof item !== "object" || !types.includes(item.type) || typeof item.name !== "string" || !item.name.trim()) {
      throw new Error(`SCENARIO_GLOBALS \u7B2C ${index + 1} \u9879\u65E0\u6548\uFF0C\u683C\u5F0F\u5E94\u4E3A { type: "${types.join("|")}", name, value }`);
    }
    return { type: item.type, name: item.name, value: item.value == null ? "" : String(item.value) };
  });
}
function printHelp() {
  console.log(`scenario-test ${VERSION}

Usage:
  node scenario-test-cli.cjs --config ./scenario.config.js --env local --all
  node scenario-test-cli.cjs run --config ./scenario.config.js --scenario health
  node scenario-test-cli.cjs serve --config ./scenario.config.js --port 4300
  node scenario-test-cli.cjs init --project D:\\project
  node scenario-test-cli.cjs capabilities [--json]
  node scenario-test-cli.cjs doctor --config ./scenario.config.js [--json]

Options:
  --config <file>       \u573A\u666F\u914D\u7F6E\u6587\u4EF6
  --env <key>           \u914D\u7F6E\u4E2D\u7684\u73AF\u5883 key
  --base-url <url>      \u4E34\u65F6\u8986\u76D6 Base URL
  --scenario <id>       \u6267\u884C\u6307\u5B9A\u573A\u666F\uFF08\u53EF\u6267\u884C manual:true \u573A\u666F\uFF09
  --all                 \u6267\u884C\u914D\u7F6E\u4E2D\u7684\u5168\u90E8\u81EA\u52A8\u573A\u666F\uFF08\u9ED8\u8BA4\u6392\u9664 manual:true\uFF09
  --fail-on-skip        \u5B58\u5728\u4EFB\u4F55 SKIP \u6B65\u9AA4\u65F6\u6700\u7EC8\u9000\u51FA\u7801\u4E3A 1\uFF08\u9ED8\u8BA4 false\uFF09
  --port <number>       \u6D4F\u89C8\u5668\u670D\u52A1\u7AEF\u53E3\uFF0C\u9ED8\u8BA4 4300
  --allow-external-plugins  \u5141\u8BB8\u52A0\u8F7D\u5916\u90E8\u63D2\u4EF6\uFF08\u6709\u5B89\u5168\u98CE\u9669\uFF09
  --json                capabilities/doctor \u8F93\u51FA\u673A\u5668\u53EF\u8BFB JSON\uFF08stdout \u7EAF\u51C0\uFF09

\u80FD\u529B\u53D1\u73B0\u547D\u4EE4:
  capabilities          \u8F93\u51FA DSL \u80FD\u529B\u6E05\u5355\uFF08\u4EBA\u7C7B\u6587\u672C\uFF1B--json \u8F93\u51FA\u673A\u5668\u53EF\u8BFB JSON\uFF0C
                        \u5185\u5BB9\u4E0E dist/scenario-test-capabilities.json \u4E00\u81F4\uFF09
  doctor                \u9879\u76EE\u9759\u6001\u4F53\u68C0\uFF1ANode \u7248\u672C\u3001\u914D\u7F6E/\u573A\u666F\u52A0\u8F7D\u3001DSL \u6821\u9A8C
                        \u4E0E AI \u89C4\u5219\u5C31\u7EEA\u68C0\u67E5\uFF1B\u6709 FAIL \u65F6\u9000\u51FA\u7801 1

\u8BA4\u8BC1\u9009\u9879:
  \u73AF\u5883\u53D8\u91CF SCENARIO_AUTH       \u63A8\u8350\u65B9\u5F0F\uFF0C\u8BBE\u7F6E\u6388\u6743\u4EE4\u724C
  --authorization <v>          \uFF08\u5DF2\u5F03\u7528\uFF0C\u4ECD\u517C\u5BB9\uFF09\u547D\u4EE4\u884C\u4F20\u9012\u4EE4\u724C

\u5168\u5C40\u53C2\u6570\u9009\u9879\uFF08\u8FFD\u52A0\u5230\u6BCF\u4E2A\u8BF7\u6C42\uFF09:
  \u73AF\u5883\u53D8\u91CF SCENARIO_GLOBALS    JSON \u6570\u7EC4\uFF0C\u5982 [{"type":"header","name":"X-Token","value":"abc"}]
                               \u652F\u6301 header / cookie / query \u4E09\u79CD\u7C7B\u578B\uFF0C\u8986\u76D6\u914D\u7F6E\u4E2D\u7684\u540C\u540D\u53C2\u6570

\u521D\u59CB\u5316\u9009\u9879:
  --project <path>      \u9879\u76EE\u6839\u76EE\u5F55
  --dir <name>          \u573A\u666F\u6D4B\u8BD5\u76EE\u5F55\u540D
  --force               \u5F3A\u5236\u8986\u76D6\u5DF2\u6709\u6587\u4EF6

\u793A\u4F8B:
  # \u63A8\u8350: \u4F7F\u7528\u73AF\u5883\u53D8\u91CF
  export SCENARIO_AUTH="Bearer your-token"
  node scenario-test-cli.cjs --config scenario.config.js --all

  # \u6216\u4ECE .env \u6587\u4EF6\u52A0\u8F7D
  export $(cat .env | xargs)
  node scenario-test-cli.cjs --config scenario.config.js --all`);
}
function writeProjectFile(projectRoot, relativePath, content, force) {
  const target = import_node_path6.default.resolve(projectRoot, relativePath);
  if (import_node_fs5.default.existsSync(target) && !force) return false;
  import_node_fs5.default.mkdirSync(import_node_path6.default.dirname(target), { recursive: true });
  import_node_fs5.default.writeFileSync(target, content, "utf8");
  return true;
}
function resolveInitDirectory(projectRoot, value) {
  const directory = String(value || "scenario-test").trim().replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/\/+$/, "");
  const target = import_node_path6.default.resolve(projectRoot, directory);
  const relative = import_node_path6.default.relative(projectRoot, target);
  if (!directory || import_node_path6.default.isAbsolute(directory) || relative.startsWith("..") || import_node_path6.default.isAbsolute(relative)) {
    throw new Error("--dir \u5FC5\u987B\u662F\u9879\u76EE\u5185\u7684\u76F8\u5BF9\u76EE\u5F55");
  }
  return directory;
}
async function askInitMode(directory) {
  if (!process.stdin.isTTY) return "keep";
  const rl = (0, import_promises.createInterface)({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(
      `\u76EE\u6807\u76EE\u5F55 ${directory} \u5DF2\u5B58\u5728\u3002
  [o] \u8986\u76D6\u5DF2\u6709\u6587\u4EF6\uFF08\u7B49\u4EF7 --force\uFF09
  [k] \u4FDD\u7559\u73B0\u6709\u6587\u4EF6\uFF0C\u4EC5\u5237\u65B0 AI \u89C4\u5219\uFF08\u9ED8\u8BA4\uFF09
  [c] \u53D6\u6D88
\u8BF7\u9009\u62E9 (k): `
    );
    const choice = answer.trim().toLowerCase();
    if (choice === "o") return "overwrite";
    if (choice === "c") return "cancel";
    return "keep";
  } finally {
    rl.close();
  }
}
function sha256File(filePath) {
  return import_node_crypto2.default.createHash("sha256").update(import_node_fs5.default.readFileSync(filePath)).digest("hex");
}
function runtimeSourceCandidates(fileName) {
  return [
    import_node_path6.default.resolve(import_node_path6.default.dirname(process.argv[1]), fileName),
    import_node_path6.default.resolve(import_node_path6.default.dirname(process.argv[1]), "../dist", fileName)
  ];
}
function copyRuntimeCli(layout, force) {
  const target = layout.frameworkPath(FRAMEWORK_FILES.cli);
  if (import_node_fs5.default.existsSync(target) && !force) return false;
  const source = import_node_path6.default.resolve(process.argv[1]);
  if (!source.endsWith(".cjs")) return null;
  import_node_fs5.default.mkdirSync(import_node_path6.default.dirname(target), { recursive: true });
  import_node_fs5.default.copyFileSync(source, target);
  return true;
}
async function copyRuntimeBrowser(layout, libraryUrl, force) {
  const target = layout.frameworkPath(FRAMEWORK_FILES.umd);
  if (import_node_fs5.default.existsSync(target) && !force) return false;
  const source = runtimeSourceCandidates("scenario-test.umd.js").find((candidate) => import_node_fs5.default.existsSync(candidate));
  import_node_fs5.default.mkdirSync(import_node_path6.default.dirname(target), { recursive: true });
  if (source) {
    import_node_fs5.default.copyFileSync(source, target);
    return true;
  }
  if (!libraryUrl) return null;
  try {
    const response = await fetch(libraryUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    import_node_fs5.default.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
    return true;
  } catch (error) {
    console.warn(`\u8B66\u544A: UMD \u8FD0\u884C\u65F6\u4E0B\u8F7D\u5931\u8D25\uFF08${error.message}\uFF09\uFF0C\u53EF\u7A0D\u540E\u91CD\u8DD1 init \u8865\u9F50`);
    return null;
  }
}
function copyRuntimeTextFile(layout, fileName, force) {
  const target = layout.frameworkPath(fileName);
  if (import_node_fs5.default.existsSync(target) && !force) return false;
  const source = runtimeSourceCandidates(fileName).find((candidate) => import_node_fs5.default.existsSync(candidate));
  if (!source) return null;
  import_node_fs5.default.mkdirSync(import_node_path6.default.dirname(target), { recursive: true });
  import_node_fs5.default.copyFileSync(source, target);
  return true;
}
function writeVersionLock(layout) {
  const target = layout.frameworkPath(FRAMEWORK_FILES.versionLock);
  const fileNames = [FRAMEWORK_FILES.cli, FRAMEWORK_FILES.umd, FRAMEWORK_FILES.dts, FRAMEWORK_FILES.capabilities];
  const sha256 = {};
  for (const fileName of fileNames) {
    const filePath = layout.frameworkPath(fileName);
    if (import_node_fs5.default.existsSync(filePath)) sha256[fileName] = sha256File(filePath);
  }
  const lock = {
    runtimeVersion: VERSION,
    contractVersion: CONTRACT_VERSION,
    files: {
      cli: FRAMEWORK_FILES.cli,
      umd: FRAMEWORK_FILES.umd,
      dts: FRAMEWORK_FILES.dts,
      capabilities: FRAMEWORK_FILES.capabilities
    },
    sha256
  };
  import_node_fs5.default.mkdirSync(import_node_path6.default.dirname(target), { recursive: true });
  import_node_fs5.default.writeFileSync(target, `${JSON.stringify(lock, null, 2)}
`, "utf8");
  return true;
}
function shouldRefreshFramework(layout, force) {
  if (force) return true;
  const runtimeFileNames = [FRAMEWORK_FILES.cli, FRAMEWORK_FILES.umd, FRAMEWORK_FILES.dts, FRAMEWORK_FILES.capabilities];
  const lockPath = layout.frameworkPath(FRAMEWORK_FILES.versionLock);
  if (!import_node_fs5.default.existsSync(lockPath)) {
    return runtimeFileNames.some((fileName) => !import_node_fs5.default.existsSync(layout.frameworkPath(fileName)));
  }
  let lock;
  try {
    lock = JSON.parse(import_node_fs5.default.readFileSync(lockPath, "utf8"));
  } catch {
    return true;
  }
  if (lock.runtimeVersion !== VERSION || lock.contractVersion !== CONTRACT_VERSION) return true;
  return runtimeFileNames.some((fileName) => !import_node_fs5.default.existsSync(layout.frameworkPath(fileName)));
}
function recordRuntimeResult(created, skipped, relativePath, status) {
  if (status === true) created.push(relativePath);
  else if (status === false) skipped.push(relativePath);
}
async function initCommand(args) {
  const projectRoot = import_node_path6.default.resolve(args.project || process.cwd());
  const directory = resolveInitDirectory(projectRoot, args.dir);
  const projectName = import_node_path6.default.basename(projectRoot).trim() || "project";
  const storagePrefix = `scenario-test.${projectName.replace(/[^\p{L}\p{N}._-]+/gu, "-")}`;
  const layout = resolveProjectLayout(projectRoot, directory);
  const frameworkDirectory = ".scenario-test";
  let force = args.force;
  if (!force && import_node_fs5.default.existsSync(import_node_path6.default.join(projectRoot, directory))) {
    const mode = await askInitMode(directory);
    if (mode === "cancel") {
      console.log("\u5DF2\u53D6\u6D88\u521D\u59CB\u5316\u3002");
      return;
    }
    force = mode === "overwrite";
  }
  const refreshFramework = shouldRefreshFramework(layout, force);
  const frameworkTemplatePaths = /* @__PURE__ */ new Set([
    layout.frameworkRelativePath(FRAMEWORK_FILES.authoringPrompt),
    layout.frameworkRelativePath(FRAMEWORK_FILES.patterns)
  ]);
  const created = [];
  const skipped = [];
  for (const [relativePath, content] of Object.entries(createProjectFiles(directory, { storagePrefix, frameworkDirectory }))) {
    const overwrite = force || refreshFramework && frameworkTemplatePaths.has(relativePath);
    (writeProjectFile(projectRoot, relativePath, content, overwrite) ? created : skipped).push(relativePath);
  }
  const libraryUrl = args.libraryUrl || DEFAULT_LIBRARY_URL;
  recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.cli), copyRuntimeCli(layout, refreshFramework));
  recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.umd), await copyRuntimeBrowser(layout, libraryUrl, refreshFramework));
  recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.dts), copyRuntimeTextFile(layout, FRAMEWORK_FILES.dts, refreshFramework));
  recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.capabilities), copyRuntimeTextFile(layout, FRAMEWORK_FILES.capabilities, refreshFramework));
  recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.versionLock), writeVersionLock(layout));
  console.log(`\u5DF2\u521D\u59CB\u5316\u9879\u76EE: ${projectRoot}`);
  console.log(`\u9879\u76EE\u5E03\u5C40: \u5185\u90E8\u6587\u4EF6\u4F4D\u4E8E ${layout.frameworkRelativeDir}`);
  if (created.length) console.log(`\u5DF2\u521B\u5EFA: ${created.join(", ")}`);
  if (skipped.length) console.log(`\u5DF2\u4FDD\u7559\u73B0\u6709\u6587\u4EF6: ${skipped.join(", ")}`);
  console.log(`\u6D4F\u89C8\u5668\u5DE5\u4F5C\u53F0: ${import_node_path6.default.join(projectRoot, directory, "index.html")}`);
  console.log("\u63D0\u793A: \u53CC\u51FB start-scenario-test.cmd \u542F\u52A8\u5DE5\u4F5C\u53F0\uFF08\u542B\u63A5\u53E3\u4EE3\u7406\uFF09\uFF1B\u63A5\u53E3 baseUrl \u7559\u7A7A\u5373\u8D70\u4EE3\u7406\uFF0C\u7ED5\u5F00\u6D4F\u89C8\u5668 CORS\u3002");
}
function resolveConfigPath(value) {
  const candidate = import_node_path6.default.resolve(value || "scenario.config.js");
  if (!import_node_fs5.default.existsSync(candidate)) throw new Error(`\u914D\u7F6E\u6587\u4EF6\u4E0D\u5B58\u5728: ${candidate}`);
  return candidate;
}
async function loadPlugins(config, configDir, options = {}) {
  const plugins = [];
  for (const pluginPath of config.nodePlugins || []) {
    let absolutePath;
    try {
      absolutePath = validatePath(configDir, pluginPath);
    } catch (error) {
      if (options.allowExternalPlugins) {
        console.warn(`\u26A0\uFE0F  \u52A0\u8F7D\u5916\u90E8\u63D2\u4EF6: ${pluginPath}`);
        absolutePath = import_node_path6.default.resolve(pluginPath);
      } else {
        throw new Error(
          `\u63D2\u4EF6\u8DEF\u5F84\u4E0D\u5B89\u5168: ${pluginPath}
\u539F\u56E0: ${error.message}
\u63D0\u793A: \u63D2\u4EF6\u5FC5\u987B\u5728\u914D\u7F6E\u76EE\u5F55\u5185 (${configDir})\uFF0C\u6216\u4F7F\u7528 --allow-external-plugins \u6807\u5FD7`
        );
      }
    }
    const imported = await import((0, import_node_url.pathToFileURL)(absolutePath).href);
    const factory = imported.default || imported;
    const pluginApi = { ...node_exports };
    const plugin = typeof factory === "function" ? await factory(pluginApi) : factory;
    plugins.push(plugin);
  }
  return plugins;
}
async function transformScenario(scenario, context, plugins) {
  let transformed = scenario;
  for (const plugin of plugins) {
    if (typeof plugin?.transformScenario === "function") transformed = await plugin.transformScenario(transformed, context);
  }
  return transformed;
}
function selectEnvironment(config, key) {
  if (!config.envs.length) return { key: "default", name: "\u9ED8\u8BA4", baseUrl: config.baseUrl || "" };
  const selectedKey = key || config.defaultEnvKey;
  const environment = config.envs.find((item) => item.key === selectedKey);
  if (!environment) throw new Error(`\u672A\u627E\u5230\u73AF\u5883 ${selectedKey}\uFF0C\u53EF\u7528\u503C: ${config.envs.map((item) => item.key).join(", ")}`);
  return environment;
}
function configVariables(config) {
  const values = { ...config.vars || {} };
  for (const definition of config.variables || []) {
    const environmentName = definition.env;
    const value = environmentName ? process.env[environmentName] : void 0;
    if (value !== void 0) values[definition.name] = value;
    else if (values[definition.name] === void 0 && definition.defaultValue !== void 0) values[definition.name] = definition.defaultValue;
    if (definition.required && (values[definition.name] === void 0 || values[definition.name] === "")) {
      throw new Error(`\u7F3A\u5C11\u53D8\u91CF ${definition.name}${environmentName ? `\uFF0C\u8BF7\u8BBE\u7F6E\u73AF\u5883\u53D8\u91CF ${environmentName}` : ""}`);
    }
  }
  return values;
}
async function runCommand(args) {
  const configPath = resolveConfigPath(args.config);
  const configDir = import_node_path6.default.dirname(configPath);
  const config = loadConfigFile(configPath, node_exports);
  const envGlobals = parseGlobalsEnv();
  const environment = selectEnvironment(config, args.env);
  const entries = args.all ? config.scenarios.filter((item) => !item.manual) : config.scenarios.filter((item) => [item.id, item.name, item.url].includes(args.scenario || config.scenarios[0]?.id));
  if (!entries.length) {
    if (args.all && config.scenarios.length > 0 && config.scenarios.every((item) => item.manual)) {
      throw new Error("\u914D\u7F6E\u4E2D\u7684\u573A\u666F\u5168\u90E8\u6807\u8BB0\u4E3A manual:true\uFF0C--all \u9ED8\u8BA4\u6392\u9664\u624B\u52A8\u573A\u666F\uFF1B\u8BF7\u4F7F\u7528 --scenario <id> \u663E\u5F0F\u6267\u884C");
    }
    throw new Error(args.scenario ? `\u672A\u627E\u5230\u573A\u666F: ${args.scenario}` : "\u914D\u7F6E\u4E2D\u6CA1\u6709\u53EF\u81EA\u52A8\u6267\u884C\u7684\u573A\u666F");
  }
  const plugins = await loadPlugins(config, configDir, { allowExternalPlugins: args.allowExternalPlugins });
  const adapters = {};
  for (const plugin of plugins) Object.assign(adapters, plugin?.adapters || {});
  const baseOptions = {
    config,
    baseUrl: String(args.baseUrl || environment.baseUrl || config.baseUrl || "").replace(/\/+$/, ""),
    authorization: args.authorization || environment.authorization || config.authorization || "",
    globals: mergeGlobals(config.globals, environment.globals, envGlobals),
    requestTimeoutMs: config.requestTimeoutMs,
    vars: configVariables(config),
    environmentVariables: process.env,
    io: createNodeIo(configDir),
    adapters
  };
  if (!baseOptions.baseUrl) throw new Error("\u7F3A\u5C11 Base URL\uFF0C\u8BF7\u914D\u7F6E\u73AF\u5883\u6216\u4F20\u5165 --base-url");
  let total = 0;
  let passedTotal = 0;
  let failedTotal = 0;
  let skippedTotal = 0;
  for (const entry of entries) {
    if (!entry.url) throw new Error(`\u573A\u666F ${entry.id} \u7F3A\u5C11 url`);
    const scenarioPath = import_node_path6.default.isAbsolute(entry.url) ? entry.url : import_node_path6.default.resolve(configDir, entry.url);
    let scenario = loadScenarioFile(scenarioPath, entry.id, node_exports);
    scenario = await transformScenario(scenario, { config, configDir, entry, environment }, plugins);
    console.log(`
# ${scenario.name} (${entry.id})`);
    const report = await createEngine(baseOptions).runScenario(scenario, {
      ...baseOptions,
      async onStep(result) {
        const mark = result.skipped ? "SKIP" : result.passed ? "PASS" : "FAIL";
        console.log(`[${mark}] ${result.name} ${result.method} ${result.path} -> ${result.status} (${formatDuration(result.duration)})`);
        for (const warning of result.warnings || []) {
          console.log(`  [WARN] ${warning}`);
        }
        for (const assertion of result.assertions.filter((item) => !item.passed)) {
          console.log(`  - ${assertion.name}: expected=${JSON.stringify(assertion.expected)} actual=${JSON.stringify(assertion.actual)}`);
        }
      }
    });
    for (const plugin of plugins) {
      await plugin?.afterScenario?.(report, { config, configDir, entry, environment, scenario });
    }
    total += report.planned;
    passedTotal += report.passedSteps;
    failedTotal += report.failed + (report.planned - report.executed - report.skipped);
    skippedTotal += report.skipped;
    console.log(`Summary: passed=${report.passedSteps} failed=${report.failed} skipped=${report.skipped} executed=${report.executed}/${report.planned} planned (\u72B6\u6001 ${report.status})`);
  }
  console.log(`
Overall: ${passedTotal}/${total} passed`);
  if (failedTotal) process.exitCode = 1;
  if (args.failOnSkip && skippedTotal > 0) {
    console.log(`
--fail-on-skip \u5DF2\u5F00\u542F\uFF0C\u5B58\u5728 ${skippedTotal} \u4E2A SKIP \u6B65\u9AA4\uFF0C\u9000\u51FA\u7801\u7F6E\u4E3A 1`);
    process.exitCode = 1;
  }
}
function safeFile(root, relativePath) {
  const candidate = import_node_path6.default.resolve(root, relativePath);
  const relative = import_node_path6.default.relative(root, candidate);
  return relative && (relative.startsWith("..") || import_node_path6.default.isAbsolute(relative)) ? null : candidate;
}
function contentType(filePath) {
  return {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8"
  }[import_node_path6.default.extname(filePath).toLowerCase()] || "application/octet-stream";
}
function resolveServeProxyTarget(config, envKey) {
  if (config.envs?.length) {
    const environment = config.envs.find((item) => item.key === (envKey || config.defaultEnvKey)) || config.envs[0];
    return String(environment.baseUrl || "").replace(/\/+$/, "");
  }
  return String(config.baseUrl || "").replace(/\/+$/, "");
}
function proxyRequest(request, response, targetUrl) {
  const headers = { ...request.headers };
  delete headers.host;
  delete headers.connection;
  const upstream = import_node_http.default.request(targetUrl + request.url, {
    method: request.method,
    headers
  }, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
    upstreamResponse.pipe(response);
  });
  upstream.on("error", () => {
    response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad Gateway: \u65E0\u6CD5\u8FDE\u63A5\u63A5\u53E3\u4EE3\u7406\u76EE\u6807");
  });
  request.pipe(upstream);
}
async function serveCommand(args) {
  const configPath = resolveConfigPath(args.config);
  const workspace = import_node_path6.default.dirname(configPath);
  const libraryDist = import_node_path6.default.dirname(import_node_path6.default.resolve(process.argv[1]));
  const config = loadConfigFile(configPath, node_exports);
  const proxyTarget = resolveServeProxyTarget(config, args.env);
  const server = import_node_http.default.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
      let filePath;
      if (pathname === "/__scenario-test__/scenario-test.umd.js") filePath = import_node_path6.default.join(libraryDist, "scenario-test.umd.js");
      else if (pathname === "/dist/scenario-test.umd.js") {
        filePath = import_node_path6.default.join(libraryDist, "scenario-test.umd.js");
      } else if (pathname === "/node_modules/@yc_yzkj/scenario-test/dist/scenario-test.umd.js") {
        filePath = import_node_path6.default.join(libraryDist, "scenario-test.umd.js");
      } else {
        const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
        filePath = safeFile(workspace, relativePath);
      }
      if (!filePath) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      import_node_fs5.default.stat(filePath, (error, stat) => {
        if (error || !stat.isFile()) {
          if (proxyTarget) {
            proxyRequest(request, response, proxyTarget);
            return;
          }
          response.writeHead(404);
          response.end("Not Found");
          return;
        }
        response.writeHead(200, { "Cache-Control": "no-store", "Content-Type": contentType(filePath) });
        import_node_fs5.default.createReadStream(filePath).pipe(response);
      });
    } catch {
      response.writeHead(400);
      response.end("Bad Request");
    }
  });
  server.listen(args.port, "127.0.0.1", () => {
    console.log(`\u573A\u666F\u6D4B\u8BD5\u5DE5\u4F5C\u53F0: http://127.0.0.1:${args.port}/`);
    console.log(`\u914D\u7F6E\u76EE\u5F55: ${workspace}`);
    if (proxyTarget) console.log(`\u63A5\u53E3\u4EE3\u7406: ${args.env || config.defaultEnvKey || "default"} -> ${proxyTarget}`);
    console.log("\u63D0\u793A: \u6D4F\u89C8\u5668 baseUrl \u7559\u7A7A\u5373\u8D70\u63A5\u53E3\u4EE3\u7406\uFF1B\u53CC\u51FB\u9879\u76EE\u5185 start-scenario-test.cmd \u53EF\u4E00\u952E\u542F\u52A8\u3002");
  });
}
function capabilitiesCommand(args) {
  const capabilities = buildCapabilities(contract);
  if (args.json) {
    process.stdout.write(`${JSON.stringify(capabilities, null, 2)}
`);
  } else {
    console.log(renderCapabilitiesText(capabilities));
  }
}
function doctorCommand(args) {
  let configPath;
  let configDir;
  try {
    configPath = resolveConfigPath(args.config);
    configDir = import_node_path6.default.dirname(configPath);
  } catch (error) {
    configPath = import_node_path6.default.resolve(args.config || "scenario.config.js");
    configDir = import_node_path6.default.dirname(configPath);
  }
  const report = buildDoctorReport({ configPath, api: node_exports, configDir });
  if (args.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}
`);
  } else {
    console.log(renderDoctorText(report));
  }
  process.exitCode = report.exitCode;
}
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.command === "init") await initCommand(args);
  else if (args.command === "serve") await serveCommand(args);
  else if (args.command === "capabilities") capabilitiesCommand(args);
  else if (args.command === "doctor") doctorCommand(args);
  else await runCommand(args);
}
main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
//# sourceMappingURL=scenario-test-cli.cjs.map
