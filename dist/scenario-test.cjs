/*! scenario-test v0.5.19 */
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

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
module.exports = __toCommonJS(node_exports);

// src/core.js
var import_blueimp_md5 = __toESM(require_md5(), 1);

// src/version.generated.js
var VERSION = "0.5.19";

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
      "library-url": { kind: "value", prop: "libraryUrl", description: "init \u8FD0\u884C\u65F6\u526F\u672C\u4E0B\u8F7D\u76EE\u5F55\uFF08CLI/UMD/d.ts/capabilities\uFF0C\u9ED8\u8BA4 GitHub Tag dist\uFF09" },
      all: { kind: "flag", prop: "all", description: "\u6267\u884C\u914D\u7F6E\u4E2D\u7684\u5168\u90E8\u81EA\u52A8\u573A\u666F\uFF08\u9ED8\u8BA4\u6392\u9664 manual:true\uFF09" },
      force: { kind: "flag", prop: "force", description: "init \u8986\u76D6\u5DF2\u6709\u6587\u4EF6\uFF08\u76EE\u6807\u76EE\u5F55\u5DF2\u5B58\u5728\u65F6\u53EF\u4EA4\u4E92\u9009\u62E9\uFF09" },
      "no-input": { kind: "flag", prop: "noInput", description: "init \u975E\u4EA4\u4E92\uFF1A\u76EE\u5F55\u5DF2\u5B58\u5728\u65F6\u6309 keep\uFF08\u4FDD\u7559\u914D\u7F6E\u4E0E\u573A\u666F\uFF0C\u4EC5\u5237\u65B0 AI \u89C4\u5219\u548C\u8FD0\u884C\u65F6\u526F\u672C\uFF09" },
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
function parseBody(text, contentType) {
  if (!text) return null;
  const value = String(text);
  if (String(contentType || "").toLowerCase().includes("json") || /^[\[{]/.test(value.trim())) {
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
      const maxElapsedMs = Number(step.retryUntil.maxElapsedMs ?? 3e5);
      invariant(Number.isInteger(maxAttempts) && maxAttempts >= 1, `\u6B65\u9AA4 ${step.name} \u7684 maxAttempts \u5FC5\u987B\u662F\u6B63\u6574\u6570`);
      invariant(Number.isFinite(intervalMs) && intervalMs >= 0, `\u6B65\u9AA4 ${step.name} \u7684 intervalMs \u4E0D\u80FD\u4E3A\u8D1F\u6570`);
      invariant(Number.isFinite(maxElapsedMs) && maxElapsedMs > 0, `\u6B65\u9AA4 ${step.name} \u7684 maxElapsedMs \u5FC5\u987B\u662F\u6B63\u6570`);
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
function abortReason(signal) {
  return signal?.reason || new Error("\u6267\u884C\u5DF2\u53D6\u6D88");
}
function timeoutErrorMessage(timeoutMs) {
  return `\u8BF7\u6C42\u8D85\u65F6\uFF08${timeoutMs}ms\uFF09`;
}
function delay(milliseconds, signal) {
  if (!milliseconds) return Promise.resolve();
  if (signal?.aborted) return Promise.reject(abortReason(signal));
  return new Promise((resolveDelay, reject) => {
    const timer = setTimeout(resolveDelay, milliseconds);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(abortReason(signal));
      }, { once: true });
    }
  });
}
function createTimeoutError(timeoutMs, message) {
  const error = new Error(message || timeoutErrorMessage(timeoutMs));
  error.scenarioTimedOut = true;
  return error;
}
function createRequestSignal(parentSignal, timeoutMs) {
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort(abortReason(parentSignal));
  if (parentSignal?.aborted) abort();
  else parentSignal?.addEventListener("abort", abort, { once: true });
  const timer = timeoutMs > 0 ? setTimeout(() => {
    timedOut = true;
    controller.abort(createTimeoutError(timeoutMs));
  }, timeoutMs) : null;
  return {
    signal: controller.signal,
    timedOut() {
      return timedOut;
    },
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
  const verboseErrors = options.verboseErrors || typeof process !== "undefined" && process.env?.SCENARIO_VERBOSE_ERRORS === "true";
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
  if (step.adapter) return { name: step.adapter, adapter: adapters.get(step.adapter) };
  for (const [name, adapter] of adapters.entries()) {
    if (typeof adapter.matches === "function" && adapter.matches(step)) return { name, adapter };
  }
  return null;
}
function readBodyChunks(response, signal) {
  if (!response.body) return Promise.resolve([]);
  const reader = response.body.getReader();
  const chunks = [];
  return new Promise((resolve2, reject) => {
    const onAbort = () => {
      reader.cancel().catch(() => {
      });
      reject(abortReason(signal));
    };
    if (signal) {
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        resolve2(chunks);
      } catch (error) {
        reject(error);
      } finally {
        if (signal) signal.removeEventListener("abort", onAbort);
      }
    })();
  });
}
function decoderForContentType(contentType) {
  const match = /charset\s*=\s*"?([^;"\s]+)"?/i.exec(String(contentType || ""));
  if (!match) return new TextDecoder();
  try {
    return new TextDecoder(match[1]);
  } catch {
    return new TextDecoder();
  }
}
async function readResponse(response, step, io, runtime, signal) {
  const headers = headersToObject(response.headers);
  const contentType = String(headers["content-type"] || "");
  const chunks = await readBodyChunks(response, signal);
  if (step.saveResponseAs && io?.saveResponse) {
    const data = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    const saved = await io.saveResponse(resolveString(step.saveResponseAs, runtime), data, { contentType, headers });
    return { status: response.status, headers, body: saved, bodyText: null };
  }
  const decoder = decoderForContentType(contentType);
  const bodyText = chunks.map((chunk) => decoder.decode(chunk, { stream: true })).join("") + decoder.decode();
  return { status: response.status, headers, body: parseBody(bodyText, contentType), bodyText };
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
  const rawTimeoutMs = Number(step.timeoutMs || request.timeoutMs || options.requestTimeoutMs || 3e4);
  const timeoutMs = Number.isFinite(rawTimeoutMs) && rawTimeoutMs > 0 ? rawTimeoutMs : 3e4;
  const requestSignal = createRequestSignal(options.signal, timeoutMs);
  fetchOptions.signal = requestSignal.signal;
  try {
    const response = await options.fetch(joinUrl(options.baseUrl, requestPath), fetchOptions);
    const responseData = await readResponse(response, step, options.io, runtime, requestSignal.signal);
    return { method, path: requestPath, request: { headers, body: request.body }, response: responseData };
  } catch (error) {
    if (error && typeof error === "object" && !error.scenarioContext) {
      error.scenarioContext = {
        method,
        path: requestPath,
        request: { headers, body: request.body },
        timedOut: requestSignal.timedOut(),
        timeoutMs
      };
    }
    throw error;
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
async function executeAdapter(adapter, adapterName, step, runtime, options) {
  if (!adapter) throw new Error(`\u672A\u6CE8\u518C\u6B65\u9AA4\u9002\u914D\u5668: ${adapterName || "unknown"}`);
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
  validateAdapterResponse(output, adapterName);
  const response = output?.response || output;
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
    const totalAttempts = retry ? Math.max(1, Number(retry.maxAttempts || 10)) : 1;
    const retryStartTime = now();
    const maxElapsedMs = retry?.maxElapsedMs || 3e5;
    try {
      for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
        if (options.signal?.aborted) throw abortReason(options.signal);
        if (retry && now() - retryStartTime > maxElapsedMs) {
          throw createTimeoutError(
            maxElapsedMs,
            `\u91CD\u8BD5\u8D85\u65F6: \u5DF2\u5C1D\u8BD5 ${attempt - 1} \u6B21\uFF0C\u8017\u65F6\u8D85\u8FC7 ${maxElapsedMs}ms
\u63D0\u793A: \u8003\u8651\u8C03\u6574 retryUntil.maxElapsedMs \u6216\u68C0\u67E5\u63A5\u53E3\u54CD\u5E94`
          );
        }
        const selection = chooseAdapter(step, adapters);
        lastExecution = selection ? await executeAdapter(selection.adapter, selection.name, step, runtime, options) : await executeHttp(step, runtime, options);
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
      const context = error?.scenarioContext || null;
      const cancelled = Boolean(options.signal?.aborted);
      const timedOut = !cancelled && Boolean(error?.scenarioTimedOut || context?.timedOut);
      const errorMessage = cancelled ? "\u7528\u6237\u5DF2\u53D6\u6D88\u6267\u884C" : timedOut ? error?.message?.includes("\u8D85\u65F6") ? error.message : context?.timeoutMs ? timeoutErrorMessage(context.timeoutMs) : "\u8BF7\u6C42\u8D85\u65F6" : error?.message || "\u8BF7\u6C42\u6267\u884C\u5931\u8D25";
      const method = context && context.method || String(step.method || step.request && step.request.method || "GET").toUpperCase();
      const path4 = context && context.path || resolveString(step.path || "", runtime);
      return {
        name: step.name || "\u672A\u547D\u540D\u6B65\u9AA4",
        method,
        path: path4,
        status: cancelled ? "CANCELLED" : timedOut ? "TIMEOUT" : "ERROR",
        duration: now() - startedAt,
        passed: false,
        cancelled,
        timedOut,
        error: errorMessage,
        warnings: [],
        assertions: [{ name: cancelled ? "\u6267\u884C\u672A\u53D6\u6D88" : timedOut ? "\u8BF7\u6C42\u672A\u8D85\u65F6" : "\u8BF7\u6C42\u6267\u884C\u6210\u529F", passed: false, actual: errorMessage, expected: "\u65E0\u5F02\u5E38" }],
        request: context && context.request || null,
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
    const cancelled = results.some((item) => item.cancelled) || Boolean(runOptions.signal?.aborted) && results.length < scenario.steps.length;
    const status = cancelled ? "CANCELLED" : failed > 0 ? "FAILED" : executed === 0 ? "SKIPPED" : "PASSED";
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

// src/browser/ui/ui-utils.js
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
function sanitizeSensitive2(value) {
  return value;
}
function copyTextFallback(text) {
  if (typeof document === "undefined" || !document.body || typeof document.createElement !== "function") return false;
  var textarea;
  var activeElement = document.activeElement;
  try {
    textarea = document.createElement("textarea");
    textarea.value = String(text);
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    return typeof document.execCommand === "function" && document.execCommand("copy") === true;
  } catch (error) {
    return false;
  } finally {
    if (textarea && textarea.parentNode) textarea.parentNode.removeChild(textarea);
    if (activeElement && typeof activeElement.focus === "function") {
      try {
        activeElement.focus();
      } catch (error) {
      }
    }
  }
}
function copyText(text) {
  var value = String(text == null ? "" : text);
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    return Promise.resolve().then(function() {
      return navigator.clipboard.writeText(value);
    }).then(function() {
      return true;
    }).catch(function() {
      return copyTextFallback(value);
    });
  }
  return Promise.resolve().then(function() {
    return copyTextFallback(value);
  });
}

// src/browser/ui/ui-style.js
var workbenchStyle = function() {
  "use strict";
  function getWorkspaceStyleBlock() {
    return `
            :root {
                --workspace-bg: #f8fafc;
                --workspace-surface: #ffffff;
                --workspace-text: #0f172a;
                --workspace-muted: #64748b;
                --workspace-line: #e2e8f0;
                --workspace-hover: #f1f5f9;
                --workspace-selected: #e2e8f0;
                --workspace-selected-line: #cbd5e1;
                --workspace-primary: #0f172a;
                --workspace-primary-hover: #1e293b;
                --workspace-danger: #e11d48;
                --workspace-success: #10b981;
                --workspace-code: #0f172a;
                --workspace-radius: 8px;
            }

            #scenario-test-root { height: 100%; }

            #scenario-test-root {
                min-width: 1024px;
                overflow: hidden;
                background: var(--workspace-bg) !important;
                color: var(--workspace-text) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            #scenario-test-root > header {
                min-height: 48px;
                padding: 6px 16px !important;
                background: var(--workspace-surface) !important;
                border-bottom: 1px solid var(--workspace-line) !important;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02) !important;
            }

            #scenario-test-root > header #envNameLabel { color: var(--workspace-muted) !important; font-size: 11px !important; font-weight: 600; }
            #scenario-test-root > header #scenarioTitle { color: var(--workspace-text) !important; font-size: 13px !important; font-weight: 700; }

            #scenario-test-root.theme-claude-code {
                --workspace-bg: #f5f0ea;
                --workspace-surface: #fbf8f4;
                --workspace-text: #2c2520;
                --workspace-muted: #7c7066;
                --workspace-line: #e8dacf;
                --workspace-hover: #efe5dc;
                --workspace-selected: #e5d5c6;
                --workspace-selected-line: #d4bfad;
                --workspace-primary: #245244;
                --workspace-primary-hover: #1b3e33;
                --workspace-danger: #b94c4a;
                --workspace-success: #245244;
                --workspace-code: #2c2520;
                --workspace-radius: 8px;
            }

            #scenario-test-root.theme-claude-code > header {
                background: #fdfaf6 !important;
                box-shadow: 0 1px 3px rgba(91, 67, 49, .06) !important;
                border-bottom-color: var(--workspace-line) !important;
            }

            .scenario-workspace { height: calc(100vh - 48px); padding: 8px !important; }
            .scenario-grid { height: 100%; gap: 8px !important; margin: 0 !important; }
            .scenario-pane {
                min-height: 0;
                background: var(--workspace-surface) !important;
                border: 1px solid var(--workspace-line) !important;
                border-radius: var(--workspace-radius) !important;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.03) !important;
                transition: border-color 0.15s ease, box-shadow 0.15s ease;
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
                border-radius: 7px;
                background: var(--workspace-surface);
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02) !important;
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .scenario-header-select {
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 0 8px 0 10px;
                background: var(--workspace-hover) !important;
                border: 1px solid var(--workspace-line) !important;
                color: var(--workspace-muted);
                cursor: pointer;
            }
            .scenario-header-select:hover {
                background: var(--workspace-selected) !important;
                border-color: var(--workspace-selected-line) !important;
            }
            .scenario-header-select__icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: var(--workspace-muted);
            }
            .scenario-header-select__label {
                font-size: 11px;
                font-weight: 700;
                color: var(--workspace-muted);
                white-space: nowrap;
                user-select: none;
            }
            .scenario-header-select select {
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
                background: transparent !important;
                border: 0 !important;
                outline: none !important;
                box-shadow: none !important;
                min-width: 60px;
                height: 100% !important;
                padding: 0 16px 0 2px !important;
                color: var(--workspace-text) !important;
                font-size: 11.5px !important;
                font-weight: 700 !important;
                cursor: pointer !important;
            }
            .scenario-header-select select option {
                background: var(--workspace-surface) !important;
                color: var(--workspace-text) !important;
                padding: 6px 10px !important;
                font-size: 12px !important;
                font-weight: 500 !important;
            }
            .scenario-header-select:focus-within {
                border-color: var(--workspace-primary) !important;
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.12) !important;
                background: var(--workspace-surface) !important;
            }
            .scenario-header-select__arrow {
                position: absolute;
                top: 50%;
                right: 7px;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                color: var(--workspace-muted);
                pointer-events: none;
                transition: transform 0.15s ease;
            }
            .scenario-header-select:focus-within .scenario-header-select__arrow {
                color: var(--workspace-text);
                transform: translateY(-50%) rotate(180deg);
            }
            
            /* \u81EA\u5B9A\u4E49 Shadcn \u98CE\u683C Dropdown Menu */
            .custom-dropdown {
                position: relative;
                display: inline-flex;
            }
            .custom-dropdown__trigger {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                height: 32px;
                padding: 0 10px 0 8px;
                border: 1px solid var(--workspace-line);
                border-radius: 7px;
                background: var(--workspace-hover);
                color: var(--workspace-text);
                font-size: 11.5px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                user-select: none;
            }
            .custom-dropdown__trigger:hover {
                background: var(--workspace-selected);
                border-color: var(--workspace-selected-line);
            }
            .custom-dropdown__trigger:active {
                transform: scale(0.98);
            }
            .custom-dropdown.open .custom-dropdown__trigger {
                border-color: var(--workspace-primary);
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.12);
                background: var(--workspace-surface);
            }
            .custom-dropdown.open .custom-dropdown__arrow {
                transform: rotate(180deg);
                color: var(--workspace-text);
            }
            .custom-dropdown__arrow {
                width: 12px;
                height: 12px;
                color: var(--workspace-muted);
                transition: transform 0.15s ease, color 0.15s ease;
                margin-left: 2px;
            }
            .custom-dropdown__menu {
                display: none;
                position: absolute;
                top: calc(100% + 5px);
                left: 0;
                min-width: 130px;
                z-index: 50;
                padding: 4px;
                background: var(--workspace-surface);
                border: 1px solid var(--workspace-line);
                border-radius: 8px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
                backdrop-filter: blur(8px);
                animation: custom-dropdown-in 0.15s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .custom-dropdown.open .custom-dropdown__menu {
                display: block;
            }
            .custom-dropdown__item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                width: 100%;
                padding: 6px 9px;
                border-radius: 6px;
                font-size: 11.5px;
                font-weight: 500;
                color: var(--workspace-text);
                cursor: pointer;
                transition: background-color 0.12s ease, color 0.12s ease;
                text-align: left;
                border: 0;
                background: transparent;
                white-space: nowrap;
            }
            .custom-dropdown__item:hover {
                background: var(--workspace-hover);
                color: var(--workspace-text);
            }
            .custom-dropdown__item.active {
                font-weight: 700;
                background: var(--workspace-selected);
            }
            .custom-dropdown__check {
                width: 13px;
                height: 13px;
                color: var(--workspace-primary);
                flex-shrink: 0;
            }
            @keyframes custom-dropdown-in {
                from { opacity: 0; transform: translateY(-4px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            #scenario-test-root.theme-claude-code .custom-dropdown__trigger {
                background: #f1e4d8 !important;
                border-color: #dfcebf !important;
            }
            #scenario-test-root.theme-claude-code .custom-dropdown__trigger:hover {
                background: #ebdbce !important;
            }
            #scenario-test-root.theme-claude-code .custom-dropdown.open .custom-dropdown__trigger {
                background: #fcf8f3 !important;
                border-color: var(--workspace-primary) !important;
                box-shadow: 0 0 0 2px rgba(36, 82, 68, 0.15) !important;
            }
            
            .scenario-header-step { display: flex; align-items: stretch; overflow: hidden; }
            .scenario-header-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                padding: 0 12px;
                font-size: 12px !important;
                font-weight: 600;
                color: var(--workspace-text);
                cursor: pointer;
            }
            .scenario-header-button:active:not(:disabled) { transform: scale(0.98); }
            .scenario-header-button--secondary { border: 0; border-radius: 0; }
            .scenario-header-step__arrow { display: inline-flex; align-items: center; justify-content: center; width: 24px; border-left: 1px solid var(--workspace-line); color: var(--workspace-muted); }
            .scenario-header-button--primary {
                border-color: var(--workspace-primary) !important;
                background: var(--workspace-primary) !important;
                color: #ffffff !important;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.15) !important;
            }
            .scenario-header-button--primary:disabled { cursor: wait; opacity: .78; }
            .scenario-header-button--running { background: #334155 !important; border-color: #334155 !important; }
            .scenario-header-button--config { padding: 0 10px; }
            .scenario-header-text-action {
                height: 32px;
                padding: 0 6px;
                border: 0;
                background: transparent;
                color: var(--workspace-muted);
                font-size: 12px !important;
                font-weight: 600;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.15s ease;
            }
            .scenario-header-text-action:active:not(:disabled) { transform: scale(0.96); }
            .scenario-header-text-action--danger { color: var(--workspace-danger); }
            .scenario-header-text-action:disabled { opacity: .4; cursor: not-allowed; }
            .scenario-header-actions button:hover:not(:disabled), .scenario-header-select:hover { background: var(--workspace-hover); }
            .scenario-header-button--primary:hover:not(:disabled) { background: var(--workspace-primary-hover) !important; border-color: var(--workspace-primary-hover) !important; }
            
            #scenario-test-root.theme-claude-code .scenario-header-select { background: #fdfaf6; }
            #scenario-test-root.theme-claude-code .scenario-header-button--config { background: #fdfaf6; border-color: var(--workspace-line); }

            .scenario-pane--scenarios > div:first-child { padding: 12px 14px !important; border-bottom: 1px solid var(--workspace-line) !important; }
            .scenario-pane--scenarios > div:first-child > div:first-child { font-size: 14px !important; font-weight: 700; }
            .scenario-pane--scenarios > div:first-child > div:nth-child(2) { font-size: 11px !important; color: var(--workspace-muted); }
            #scenarioSearchInput {
                margin-top: 8px !important;
                padding: 6px 10px !important;
                border: 1px solid var(--workspace-line) !important;
                border-radius: 6px !important;
                font-size: 12px !important;
                transition: all 0.15s ease;
            }
            #scenarioSearchInput:focus {
                border-color: var(--workspace-primary) !important;
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.06) !important;
            }
            #scenarioList { padding: 6px !important; gap: 4px !important; }
            #scenarioList > div {
                border-radius: 6px !important;
                border: 1px solid transparent !important;
                box-shadow: none !important;
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
            #scenarioList > div:hover { background: var(--workspace-hover) !important; border-color: var(--workspace-line) !important; }
            #scenarioList > div.bg-slate-100 {
                background: var(--workspace-selected) !important;
                border-color: var(--workspace-selected-line) !important;
            }
            #scenarioList > div:has([data-scenario-file]) { min-height: 56px; }
            #scenarioList [data-scenario-file] { padding: 8px 10px !important; }
            #scenarioList [data-scenario-file] > div:first-child { font-size: 12.5px !important; font-weight: 600 !important; line-height: 1.35 !important; color: var(--workspace-text); }
            #scenarioList [data-scenario-file] > div:last-child { margin-top: 3px !important; font-size: 10.5px !important; line-height: 1.3 !important; }
            #scenarioList .scenario-pin-control {
                display: inline-flex;
                flex: 0 0 auto;
                align-items: center;
                justify-content: center;
                align-self: center;
                width: 24px;
                height: 24px;
                margin-right: 6px;
                border: 0;
                border-radius: 4px;
                background: transparent;
                color: #94a3b8;
                opacity: 0;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            #scenarioList .scenario-pin-control svg { width: 13px; height: 13px; }
            #scenarioList > div:hover .scenario-pin-control, #scenarioList .scenario-pin-control--active { opacity: 1; }
            #scenarioList .scenario-pin-control:hover { background: var(--workspace-hover); color: var(--workspace-text); }
            #scenarioList .scenario-pin-control--active { color: #0d9488; }
            #scenarioList .scenario-pin-control--active:hover { background: rgba(13, 148, 136, 0.1); color: #0f766e; }

            .circle-chart {
                width: 88px;
                height: 88px;
                flex: 0 0 88px;
                border-radius: 9999px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 0 1px 3px rgba(15, 23, 42, .06);
            }
            .circle-inner {
                width: 66px;
                height: 66px;
                border-radius: 9999px;
                background: var(--workspace-surface);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 3px rgba(15, 23, 42, .06);
            }

            .scenario-pane--steps #statsPanel {
                min-height: 56px;
                padding: 10px 14px !important;
                border-bottom: 1px solid var(--workspace-line) !important;
            }
            .scenario-pane--steps #filterBar {
                min-height: 36px;
                padding: 5px 12px !important;
                background: var(--workspace-surface) !important;
                border-bottom: 1px solid var(--workspace-line) !important;
            }
            #stepsList > li {
                border-bottom: 1px solid var(--workspace-line) !important;
                transition: background-color 0.15s ease;
            }
            #stepsList > li:hover { background: var(--workspace-hover) !important; }
            #stepsList > li > div:first-child { min-height: 40px; padding: 7px 14px !important; }
            #stepsList .w-5.h-5 { width: 20px !important; height: 20px !important; font-size: 11px !important; }
            #stepsList .text-sm { font-size: 13px !important; }
            #stepsList .text-\\[10px\\], #stepsList .text-\\[11px\\], #stepsList .text-\\[12px\\] { font-size: 11px !important; }
            #stepsList [data-adhoc-step] { border-radius: 4px !important; padding: 3px 7px !important; font-size: 11px !important; box-shadow: none !important; }
            .step-run-actions {
                display: inline-flex;
                align-items: center;
                overflow: hidden;
                border: 1px solid var(--workspace-line);
                border-radius: 4px;
                background: var(--workspace-surface);
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .step-run-actions button {
                padding: 3px 7px;
                border: 0;
                border-right: 1px solid var(--workspace-line);
                background: transparent;
                color: var(--workspace-muted);
                font-size: 11px;
                font-weight: 700;
                line-height: 1;
                cursor: pointer;
                transition: color 0.15s ease, background-color 0.15s ease;
            }
            .step-run-actions button:last-child { border-right: 0; color: #0d9488; }
            .step-run-actions button:hover { background: var(--workspace-hover); color: var(--workspace-text); }
            
            .details-panel {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                transition: max-height .25s cubic-bezier(0.4, 0, 0.2, 1), opacity .2s ease, padding .25s ease;
            }
            .details-panel.open {
                max-height: 2000px;
                opacity: 1;
                padding-top: 0.85rem;
                padding-bottom: 0.85rem;
                overflow-y: auto;
            }
            #stepsList .details-panel { background: var(--workspace-hover) !important; border-color: var(--workspace-line) !important; }

            pre {
                background: var(--workspace-code) !important;
                border: 1px solid #1e293b !important;
                border-radius: 6px !important;
                color: #e2e8f0 !important;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }
            .font-mono {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-variant-numeric: tabular-nums;
            }

            .scenario-pane--report > div:first-child {
                min-height: 56px;
                padding: 10px 14px !important;
                border-bottom: 1px solid var(--workspace-line) !important;
            }
            #reportPanel { display: block; padding: 12px !important; color: var(--workspace-muted) !important; }
            .report-content { display: flex; flex-direction: column; gap: 10px; width: 100%; }
            .report-overview {
                padding: 12px 14px;
                border: 1px solid var(--workspace-line);
                border-radius: 8px;
                background: linear-gradient(135deg, var(--workspace-hover), var(--workspace-surface));
                box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            }
            .report-overview__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
            .report-overview__eyebrow { color: var(--workspace-muted); font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
            .report-overview__title { margin-top: 3px; overflow: hidden; color: var(--workspace-text); font-size: 13.5px; font-weight: 700; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
            .report-overview__meta { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px; }
            .report-overview__meta span { padding: 2px 6px; border-radius: 4px; background: var(--workspace-surface); border: 1px solid var(--workspace-line); color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-status { flex: 0 0 auto; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; letter-spacing: 0.02em; }
            .report-status--passed { background: #ecfdf5; color: #047857; border: 1px solid rgba(16, 185, 129, 0.2); }
            .report-status--failed { background: #fff1f2; color: #be123c; border: 1px solid rgba(244, 63, 94, 0.2); }
            .report-status--cancelled { background: #fffbeb; color: #b45309; border: 1px solid rgba(245, 158, 11, 0.2); }
            .report-status--running { background: #eff6ff; color: #2563eb; border: 1px solid rgba(59, 130, 246, 0.2); }
            .report-metrics {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                overflow: hidden;
                border: 1px solid var(--workspace-line);
                border-radius: 8px;
                background: var(--workspace-surface);
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
            }
            .report-metric { min-width: 0; padding: 10px; border-right: 1px solid var(--workspace-line); }
            .report-metric:last-child { border-right: 0; }
            .report-metric__label { display: block; color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-metric__value { display: block; margin-top: 3px; overflow: hidden; color: var(--workspace-text); font-size: 15px; font-weight: 700; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
            .report-metric__value--passed { color: #059669; }
            .report-metric__value--failed { color: #e11d48; }
            .report-metric__duration { color: var(--workspace-text); font-size: 13px; }
            
            .report-progress { padding: 0 2px; }
            .report-progress__labels { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-progress__labels strong { color: var(--workspace-text); font-weight: 700; font-variant-numeric: tabular-nums; }
            .report-progress__track { height: 6px; overflow: hidden; border-radius: 999px; background: var(--workspace-line); }
            .report-progress__track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #0d9488 0%, #10b981 100%); transition: width .25s ease-out; }
            .report-progress__track--failed span { background: linear-gradient(90deg, #e11d48 0%, #f43f5e 100%); }

            .report-steps { border-top: 1px solid var(--workspace-line); padding-top: 10px; }
            .report-steps__title { margin-bottom: 6px; color: var(--workspace-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
            .report-healthy { padding: 10px 12px; border: 1px solid #d1fae5; border-radius: 6px; background: #f0fdf4; }
            .report-healthy__title { color: #047857; font-size: 12px; font-weight: 700; }
            .report-healthy__hint { margin-top: 4px; color: #065f46; font-size: 10px; line-height: 1.45; }
            
            .report-step { position: relative; display: flex; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--workspace-line); }
            .report-step:last-child { border-bottom: 0; }
            .report-step__marker { display: flex; flex: 0 0 16px; align-items: center; justify-content: center; width: 16px; height: 16px; margin-top: 1px; border-radius: 999px; font-size: 10px; font-weight: 800; }
            .report-step--passed .report-step__marker { background: #ecfdf5; color: #059669; }
            .report-step--failed .report-step__marker { background: #fff1f2; color: #e11d48; }
            .report-step__content { min-width: 0; flex: 1; }
            .report-step__heading { display: flex; min-width: 0; align-items: baseline; gap: 5px; }
            .report-step__number { flex: 0 0 auto; color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-step__name { overflow: hidden; color: var(--workspace-text); font-size: 11.5px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
            .report-step__request { display: flex; min-width: 0; align-items: center; gap: 5px; margin-top: 3px; }
            .report-method { flex: 0 0 auto; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 9px; font-weight: 800; }
            .report-method--get { color: #059669; }
            .report-method--post { color: #d97706; }
            .report-method--put { color: #a16207; }
            .report-method--delete { color: #e11d48; }
            .report-method--patch { color: #7c3aed; }
            .report-step__path { overflow: hidden; color: var(--workspace-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
            .report-step__issue { margin-top: 4px; color: #e11d48; font-size: 10.5px; line-height: 1.4; }
            .report-step__response { margin-top: 6px; }
            .report-step__response summary { cursor: pointer; color: #0d9488; font-size: 10px; font-weight: 700; }
            .report-step__response-section { margin-top: 6px; color: var(--workspace-muted); font-size: 10px; font-weight: 600; }
            .report-step__response pre { max-height: 260px; margin-top: 4px; overflow: auto; padding: 8px; background: #0f172a; border: 0; border-radius: 6px; color: #e2e8f0; font-size: 10px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
            .report-step__result { display: flex; flex: 0 0 auto; flex-direction: column; align-items: flex-end; gap: 3px; padding-top: 1px; }
            .report-step__code { color: var(--workspace-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; font-weight: 700; }
            .report-step__duration { color: var(--workspace-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; }
            
            .report-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 220px; text-align: center; color: var(--workspace-muted); }
            .report-empty svg { display: block; width: 60px; height: 60px; margin: 0 auto 12px; color: var(--workspace-muted); opacity: 0.6; }
            .report-empty__title { color: var(--workspace-text); font-size: 13.5px; font-weight: 700; }
            .report-empty__hint { margin-top: 6px; font-size: 11px; }

            #configModal { backdrop-filter: blur(4px); }
            #configModal > div {
                background: #0f172a !important;
                border: 1px solid #1e293b !important;
                border-radius: 12px !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3) !important;
            }
            #configModal input, #configModal select {
                border-radius: 6px !important;
                transition: all 0.15s ease;
            }
            #configModal input:focus, #configModal select:focus {
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3) !important;
            }

            #adhocModal { backdrop-filter: blur(4px); }
            #adhocModal > div {
                background: var(--workspace-surface) !important;
                border: 1px solid var(--workspace-line) !important;
                border-radius: 12px !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.15) !important;
            }
            #adhocModal input, #adhocModal select, #adhocModal textarea {
                border-radius: 6px !important;
                transition: all 0.15s ease;
            }
            #adhocModal input:focus, #adhocModal select:focus, #adhocModal textarea:focus {
                border-color: var(--workspace-primary) !important;
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08) !important;
            }

            .scenario-step-loading { display: none; position: fixed; z-index: 40; top: 54px; right: 16px; pointer-events: none; }
            .scenario-step-loading--visible { display: block; }
            .scenario-step-loading__content {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 240px;
                max-width: 420px;
                padding: 10px 14px;
                border: 1px solid var(--workspace-line);
                border-radius: 8px;
                background: var(--workspace-surface);
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            }
            .scenario-step-loading__spinner { width: 16px; height: 16px; border: 2px solid #cbd5e1; border-top-color: #0d9488; border-radius: 50%; animation: scenario-step-loading-spin .7s linear infinite; }
            .scenario-step-loading__title { color: var(--workspace-text); font-size: 12px; font-weight: 700; }
            .scenario-step-loading__text { margin-top: 1px; overflow: hidden; color: var(--workspace-muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
            @keyframes scenario-step-loading-spin { to { transform: rotate(360deg); } }

            .code-copy-btn {
                border: 1px solid #334155;
                background: #1e293b;
                color: #94a3b8;
                border-radius: 4px;
                padding: 2px 7px;
                font-size: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all .15s ease;
            }
            .code-copy-btn:hover { color: #ffffff; background: #334155; }
            .code-copy-btn--success { color: #34d399 !important; border-color: #059669 !important; }

            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            #scenario-test-root.theme-claude-code ::-webkit-scrollbar-thumb { background: #d9af8d; }
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
var ui_style_default = workbenchStyle;

// src/browser/ui/ui-view.js
var workbenchView = function() {
  "use strict";
  function stringify(value) {
    if (value === void 0 || value === null || value === "") return "";
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  }
  function formatReportPayload(value, options) {
    var text = stringify(value);
    if (!text) return "(\u7A7A)";
    return options && options.full ? text : truncateForDisplay(text);
  }
  var DISPLAY_PAYLOAD_LIMIT = 65536;
  function truncateForDisplay(text) {
    var value = String(text);
    if (value.length <= DISPLAY_PAYLOAD_LIMIT) return value;
    return value.slice(0, DISPLAY_PAYLOAD_LIMIT) + "\n\u2026\uFF08\u5C55\u793A\u5DF2\u622A\u65AD\uFF0C\u5171 " + value.length + " \u5B57\u7B26\uFF1B\u5B8C\u6574\u5185\u5BB9\u8BF7\u7528 saveResponseAs \u4FDD\u5B58\u540E\u67E5\u770B\uFF09";
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
        <header class="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap gap-3 justify-between items-center sticky top-0 z-10 shadow-xs">
            <div class="flex items-center gap-2 min-w-0">
                <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100/80 border border-slate-200/60">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span id="envNameLabel" class="text-[11px] font-semibold text-slate-500 whitespace-nowrap"></span>
                </div>
                <span class="text-slate-300 select-none" aria-hidden="true">\u203A</span>
                <h1 id="scenarioTitle" class="text-xs font-bold text-slate-800 tracking-tight truncate max-w-[280px] sm:max-w-xl">\u672A\u52A0\u8F7D\u573A\u666F</h1>
            </div>
            <div class="scenario-header-actions flex items-center">
                <div class="custom-dropdown" id="envDropdown" title="\u5FEB\u901F\u5207\u6362\u8FD0\u884C\u73AF\u5883">
                    <button type="button" class="custom-dropdown__trigger" id="envDropdownTrigger" aria-haspopup="listbox" aria-expanded="false">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                        <span class="text-slate-400 text-[10.5px] font-semibold">\u73AF\u5883</span>
                        <span class="custom-dropdown__label font-bold text-slate-800" id="envDropdownLabel">-</span>
                        <svg class="custom-dropdown__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="custom-dropdown__menu" id="envDropdownMenu" role="listbox"></div>
                    <select id="environmentSelect" class="sr-only" aria-label="\u5FEB\u901F\u5207\u6362\u73AF\u5883" tabindex="-1"></select>
                </div>
                <div class="custom-dropdown" id="themeDropdown" title="\u5207\u6362\u754C\u9762\u89C6\u89C9\u98CE\u683C">
                    <button type="button" class="custom-dropdown__trigger" id="themeDropdownTrigger" aria-haspopup="listbox" aria-expanded="false">
                        <svg class="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h4l4-4a2.828 2.828 0 114 4l-4 4v4a5 5 0 01-5 5H7z"></path></svg>
                        <span class="text-slate-400 text-[10.5px] font-semibold">\u98CE\u683C</span>
                        <span class="custom-dropdown__label font-bold text-slate-800" id="themeDropdownLabel">\u73B0\u4EE3\u7B80\u7EA6</span>
                        <svg class="custom-dropdown__arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="custom-dropdown__menu" id="themeDropdownMenu" role="listbox"></div>
                    <select id="themeSelect" class="sr-only" aria-label="\u5207\u6362\u754C\u9762\u98CE\u683C" tabindex="-1">
                        <option value="default" selected>\u73B0\u4EE3\u7B80\u7EA6</option>
                        <option value="claude-code">\u6E29\u6696\u7EB8\u97F5</option>
                    </select>
                </div>
                <div class="scenario-header-step relative">
                    <button id="stepBtn" class="scenario-header-button scenario-header-button--secondary" title="\u5355\u6B65\u6267\u884C\u4E0B\u4E00\u6761\u7528\u4F8B">\u6267\u884C\u4E0B\u4E00\u6B65</button>
                    <span class="scenario-header-step__arrow" aria-hidden="true"><svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></span>
                </div>
                <button id="runBtn" class="scenario-header-button scenario-header-button--primary">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>\u6267\u884C\u5168\u90E8</span>
                </button>
                <button id="cancelBtn" disabled class="scenario-header-text-action scenario-header-text-action--danger">\u505C\u6B62</button>
                <button id="resetBtn" class="scenario-header-text-action">\u6E05\u9664\u884C</button>
                <button id="configToggleBtn" class="scenario-header-button scenario-header-button--config" title="\u914D\u7F6E\u73AF\u5883\u53C2\u6570\u4E0E\u5168\u5C40\u53D8\u91CF">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
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
                <aside class="scenario-pane scenario-pane--scenarios bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden xl:max-h-[calc(100vh-52px)] flex flex-col">
                    <div class="px-3.5 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                        <div class="flex items-center justify-between">
                            <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                <span>\u573A\u666F\u5217\u8868</span>
                            </div>
                            <span class="text-[10px] text-slate-400">\u70B9\u51FB\u5373\u52A0\u8F7D</span>
                        </div>
                        <div class="relative mt-2">
                            <svg class="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input id="scenarioSearchInput" type="search" placeholder="\u641C\u7D22\u7528\u4F8B\u540D\u79F0\u6216\u8DEF\u5F84..." class="w-full pl-8 pr-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-slate-800 focus:ring-1 focus:ring-slate-800">
                        </div>
                    </div>
                    <div id="scenarioList" class="p-2 space-y-1 overflow-y-auto flex-1"></div>
                </aside>
                <div class="scenario-pane scenario-pane--steps bg-white rounded-lg shadow-xs border border-slate-200 flex flex-col overflow-hidden xl:max-h-[calc(100vh-52px)]">
                    <div id="statsPanel" class="p-3 flex flex-wrap justify-between items-center border-b border-slate-100 bg-white flex-shrink-0">
                        <div class="text-xs text-slate-400">\u573A\u666F\u672A\u52A0\u8F7D\u6216\u672A\u6267\u884C</div>
                    </div>
                    <div id="filterBar" class="flex items-center justify-between bg-slate-50/50 px-3 py-1.5 border-b border-slate-100 flex-shrink-0">
                        <div class="text-xs text-slate-400 py-1">\u672A\u52A0\u8F7D\u573A\u666F</div>
                    </div>
                    <ul id="stepsList" class="divide-y divide-slate-100 bg-white flex-1 overflow-y-auto"></ul>
                </div>
                <div class="scenario-pane scenario-pane--report bg-white rounded-lg shadow-xs border border-slate-200 flex flex-col overflow-hidden xl:max-h-[calc(100vh-52px)]">
                    <div class="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                        <div>
                            <div class="text-xs font-bold text-slate-800 flex items-center space-x-1.5"><svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>AI \u6D4B\u8BD5\u62A5\u544A</span></div>
                            <div class="text-[10px] text-slate-400 mt-0.5">\u7ED3\u6784\u5316\u603B\u7ED3\uFF0C\u652F\u6301\u5FEB\u901F\u5BFC\u51FA</div>
                        </div>
                        <div class="flex items-center gap-1">
                            <button id="copyReportMarkdownBtn" class="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/80 text-[10.5px] font-bold hover:bg-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center shadow-2xs"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>\u590D\u5236 MD</button>
                            <button id="copyReportJsonBtn" class="px-2 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200 text-[10.5px] font-bold hover:bg-slate-100 transition-all active:scale-[0.98] flex items-center justify-center shadow-2xs"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>JSON</button>
                        </div>
                    </div>
                    <div id="reportPanel" class="p-3 text-sm text-slate-500 overflow-y-auto flex-1 bg-slate-50/20"><div class="report-empty"><svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="16" y="14" width="40" height="50" rx="5" fill="#fff6eb" stroke="currentColor" stroke-width="2"></rect><path d="M27 29h18M27 39h18M27 49h12" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path><circle cx="58" cy="56" r="11" fill="currentColor"></circle><path d="M58 50v12M52 56h12" stroke="#fffdfa" stroke-width="2" stroke-linecap="round"></path></svg><div class="report-empty__title">\u6267\u884C\u573A\u666F\u540E\u5C06\u5728\u8FD9\u91CC\u751F\u6210\u6574\u4F53\u62A5\u544A\u3002</div><div class="report-empty__hint">\u70B9\u51FB\u300C\u6267\u884C\u5168\u90E8\u300D\uFF0C\u5F00\u59CB\u8FDB\u884C</div></div></div>
                </div>
            </div>
        </main>
        <div id="configModal" class="hidden fixed inset-0 z-40 bg-slate-950/30 p-4 flex items-center justify-center">
            <div class="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl bg-slate-900 shadow-2xl border border-slate-700/80 text-slate-200">
                <div class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                    <div>
                        <div class="text-sm font-bold text-white tracking-tight">\u73AF\u5883\u53C2\u6570\u914D\u7F6E</div>
                        <div class="mt-0.5 text-[11px] text-slate-400">\u6D4B\u8BD5\u73AF\u5883\u3001\u5168\u5C40\u53C2\u6570\u4E0E\u573A\u666F\u53D8\u91CF\uFF0C\u4FDD\u5B58\u540E\u6309\u73AF\u5883\u81EA\u52A8\u751F\u6548\u3002</div>
                    </div>
                    <button id="configCloseBtn" type="button" class="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">\u5173\u95ED</button>
                </div>
                <div class="space-y-4 p-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="flex flex-col gap-1.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">\u6D4B\u8BD5\u73AF\u5883</span>
                            <select id="environmentInput" class="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"></select>
                        </label>
                        <label class="flex flex-col gap-1.5">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">\u63A5\u53E3\u57FA\u7840\u5730\u5740</span>
                            <input id="baseUrlInput" type="text" placeholder="\u7559\u7A7A\u9ED8\u8BA4\u4F7F\u7528\u5F53\u524D\u9875\u9762\u670D\u52A1\u5730\u5740" class="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                        </label>
                    </div>
                    <div class="border-t border-slate-800 pt-4">
                        <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">\u5168\u5C40\u53C2\u6570 <span class="normal-case font-normal text-slate-500">\uFF08\u8FFD\u52A0\u5230\u6BCF\u4E2A\u8BF7\u6C42\uFF0C\u652F\u6301 header / cookie / query\uFF09</span></div>
                        <div id="globalsInput" class="space-y-2"></div>
                        <button type="button" id="addGlobalBtn" class="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all active:scale-[0.98]">+ \u6DFB\u52A0\u5168\u5C40\u53C2\u6570</button>
                    </div>
                    <div class="border-t border-slate-800 pt-4">
                        <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">\u573A\u666F\u53D8\u91CF</div>
                        <div id="scenarioVarsInput" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between border-t border-slate-800 pt-4">
                        <div class="text-[11px] text-slate-400 flex items-center gap-2"><span>\u5F53\u524D\u751F\u6548\u63A5\u53E3\u5730\u5740:</span> <span id="baseUrlLabel" class="font-mono text-emerald-400 font-semibold"></span><span id="authLabel" class="font-mono text-amber-400 border-l border-slate-700 pl-2" style="display:none">\u5168\u5C40\u53C2\u6570: <span id="authValue"></span></span></div>
                        <div class="flex flex-wrap items-center justify-end gap-2 mt-2 sm:mt-0">
                            <span id="settingsNotice" role="status" aria-live="polite" class="hidden text-xs font-medium text-emerald-400"></span>
                            <button id="saveSettingsBtn" class="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm active:scale-[0.98]">\u4FDD\u5B58\u5E76\u751F\u6548</button>
                            <button id="clearSettingsBtn" class="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all active:scale-[0.98]">\u6E05\u9664\u5F53\u524D\u73AF\u5883\u8986\u76D6</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="adhocModal" class="hidden fixed inset-0 z-30 bg-slate-950/40 p-4 overflow-y-auto">
            <div class="mx-auto my-8 max-w-3xl rounded-xl bg-white shadow-2xl border border-slate-200">
                <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <div class="text-sm font-bold text-slate-800">\u4E34\u65F6\u8BF7\u6C42\u8C03\u8BD5</div>
                        <div class="mt-0.5 text-[11px] text-slate-400">\u4EC5\u6267\u884C\u5F53\u524D\u7F16\u8F91\u5185\u5BB9\uFF0C\u4E0D\u4FDD\u5B58\u4E5F\u4E0D\u5F71\u54CD\u573A\u666F\u8FDB\u5EA6\u3002</div>
                    </div>
                    <button id="adhocCloseBtn" type="button" class="rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">\u5173\u95ED</button>
                </div>
                <div class="space-y-4 p-5">
                    <div id="adhocError" class="hidden rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"></div>
                    <label class="block"><span class="text-xs font-bold text-slate-600">\u8BF7\u6C42\u540D\u79F0</span><input id="adhocNameInput" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all" type="text"></label>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                        <label class="block"><span class="text-xs font-bold text-slate-600">\u65B9\u6CD5</span><select id="adhocMethodInput" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select></label>
                        <label class="block"><span class="text-xs font-bold text-slate-600">\u8BF7\u6C42\u8DEF\u5F84</span><input id="adhocPathInput" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all" type="text"></label>
                    </div>
                    <div class="block">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-600">\u67E5\u8BE2\u53C2\u6570</span>
                            <button id="adhocAddParamBtn" type="button" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">+ \u6DFB\u52A0\u53C2\u6570</button>
                        </div>
                        <div id="adhocParamsContainer" class="mt-2 space-y-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/50 p-2"></div>
                    </div>
                    <label class="block"><span class="text-xs font-bold text-slate-600">\u8BF7\u6C42\u5934 JSON</span><textarea id="adhocHeadersInput" class="mt-1 h-28 w-full rounded-lg border border-slate-200 p-3 font-mono text-xs outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all" spellcheck="false"></textarea></label>
                    <label class="block"><span class="text-xs font-bold text-slate-600">\u8BF7\u6C42\u4F53 JSON</span><textarea id="adhocBodyInput" class="mt-1 h-40 w-full rounded-lg border border-slate-200 p-3 font-mono text-xs outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all" spellcheck="false"></textarea></label>
                    <div class="flex justify-end gap-2"><button id="adhocCancelBtn" type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]">\u53D6\u6D88</button><button id="adhocExecuteBtn" type="button" class="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all active:scale-[0.98]">\u6267\u884C\u4E00\u6B21</button></div>
                    <div id="adhocResult" class="hidden rounded-lg border border-slate-200 bg-slate-50 p-4"></div>
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
    setupCustomDropdowns();
  }
  function setupCustomDropdowns() {
    var configs = [
      {
        dropdownId: "envDropdown",
        triggerId: "envDropdownTrigger",
        labelId: "envDropdownLabel",
        menuId: "envDropdownMenu",
        selectId: "environmentSelect"
      },
      {
        dropdownId: "themeDropdown",
        triggerId: "themeDropdownTrigger",
        labelId: "themeDropdownLabel",
        menuId: "themeDropdownMenu",
        selectId: "themeSelect"
      }
    ];
    configs.forEach(function(cfg) {
      var dropdown = document.getElementById(cfg.dropdownId);
      var trigger = document.getElementById(cfg.triggerId);
      var label = document.getElementById(cfg.labelId);
      var menu = document.getElementById(cfg.menuId);
      var select = document.getElementById(cfg.selectId);
      if (!dropdown || !trigger || !label || !menu || !select) return;
      function syncFromSelect() {
        var val = select.value;
        var options = Array.from(select.options || []);
        if (!options.length) {
          menu.innerHTML = '<div class="px-3 py-1.5 text-[11px] text-slate-400">\u6682\u65E0\u53EF\u7528\u9879</div>';
          label.textContent = "-";
          return;
        }
        var activeOpt = options.find(function(o) {
          return o.value === val;
        }) || options[0];
        label.textContent = activeOpt ? activeOpt.textContent : "-";
        menu.innerHTML = options.map(function(opt) {
          var isActive = opt.value === val;
          return '<button type="button" class="custom-dropdown__item' + (isActive ? " active" : "") + '" data-value="' + esc(opt.value) + '"><span>' + esc(opt.textContent) + '</span><svg class="custom-dropdown__check' + (isActive ? "" : " hidden") + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg></button>';
        }).join("");
      }
      trigger.addEventListener("click", function(e) {
        if (trigger.disabled || trigger.getAttribute("aria-disabled") === "true") return;
        e.stopPropagation();
        var isOpen = dropdown.classList.contains("open");
        document.querySelectorAll(".custom-dropdown.open").forEach(function(d) {
          d.classList.remove("open");
        });
        if (!isOpen) {
          syncFromSelect();
          dropdown.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        } else {
          trigger.setAttribute("aria-expanded", "false");
        }
      });
      menu.addEventListener("click", function(e) {
        var item = e.target.closest(".custom-dropdown__item");
        if (!item) return;
        var val = item.dataset.value;
        select.value = val;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        dropdown.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        syncFromSelect();
      });
      select.addEventListener("change", syncFromSelect);
      if (typeof MutationObserver !== "undefined") {
        var observer = new MutationObserver(function() {
          syncFromSelect();
        });
        observer.observe(select, { childList: true, subtree: true, attributes: true });
      }
      syncFromSelect();
    });
    if (!window.__customDropdownGlobalInit) {
      window.__customDropdownGlobalInit = true;
      document.addEventListener("click", function(e) {
        if (!e.target.closest(".custom-dropdown")) {
          document.querySelectorAll(".custom-dropdown.open").forEach(function(d) {
            d.classList.remove("open");
            var trg = d.querySelector(".custom-dropdown__trigger");
            if (trg) trg.setAttribute("aria-expanded", "false");
          });
        }
      });
    }
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
      list.innerHTML = '<div class="p-3 text-xs text-slate-400 text-center">' + (keyword ? "\u672A\u627E\u5230\u5339\u914D\u573A\u666F" : "\u6682\u65E0\u53EF\u7528\u573A\u666F") + "</div>";
      return;
    }
    list.innerHTML = items.map(function(item) {
      var name = item.name || item.file;
      var active = scenarioFile === item.file;
      var pinned = Object.prototype.hasOwnProperty.call(pinOrder, item.file);
      var classes = active ? "bg-slate-100 border-slate-200/80 text-slate-900 shadow-2xs font-semibold" : "bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200/60";
      var pinLabel = pinned ? "\u53D6\u6D88\u7F6E\u9876" : "\u7F6E\u9876";
      return '<div class="flex items-start gap-1 rounded-lg border transition-all ' + classes + '"><button type="button" data-scenario-file="' + esc(item.file) + '" title="' + esc(item.file) + '" class="min-w-0 flex-1 text-left px-2.5 py-2"><div class="text-xs font-semibold truncate leading-snug">' + esc(name) + '</div><div class="mt-0.5 text-[10px] font-mono truncate ' + (active ? "text-slate-500" : "text-slate-400") + '">' + esc(item.file) + '</div></button><button type="button" data-pin-file="' + esc(item.file) + '" title="' + pinLabel + '" aria-label="' + pinLabel + '" class="scenario-pin-control' + (pinned ? " scenario-pin-control--active" : "") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3z" fill="' + (pinned ? "currentColor" : "none") + '" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path></svg></button></div>';
    }).join("");
  }
  function renderStatsAll(steps, iterations) {
    steps = steps || [];
    var statsPanel = document.getElementById("statsPanel");
    if (!statsPanel) return;
    if (!steps.length) {
      statsPanel.innerHTML = '<div class="text-xs text-slate-400 p-2">\u6CA1\u6709\u5DF2\u6267\u884C\u7684\u6B65\u9AA4</div>';
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
    var passRate = executed ? (passed / executed * 100).toFixed(1) : 0;
    var failRate = executed ? (failed / executed * 100).toFixed(1) : 0;
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
    var chart = '<div class="flex items-center gap-4 w-full md:w-auto"><div class="circle-chart scale-90" style="background:conic-gradient(#10b981 0% ' + passRate + "%, #f43f5e " + passRate + '% 100%)"><div class="circle-inner"><span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">\u5DF2\u6267\u884C</span><span class="text-lg font-bold text-slate-800 tabular-nums leading-none mt-0.5">' + total + '</span></div></div><div class="flex flex-wrap gap-2"><div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span class="text-xs font-bold text-emerald-700 tabular-nums">' + passed + ' <span class="text-emerald-600/70 font-medium text-[10px] ml-0.5">(' + passRate + '%)</span></span></div><div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span><span class="text-xs font-bold text-rose-600 tabular-nums">' + failed + ' <span class="text-rose-500/70 font-medium text-[10px] ml-0.5">(' + failRate + "%)</span></span></div>" + (skipped ? '<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span><span class="text-xs font-bold text-slate-600 tabular-nums">' + skipped + ' <span class="text-slate-400 font-medium text-[10px] ml-0.5">\u8DF3\u8FC7</span></span></div>' : "") + "</div></div>";
    var metrics = '<div class="flex items-center gap-6 mt-3 md:mt-0 pl-4 border-l border-slate-100"><div class="space-y-0.5"><div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">\u8017\u65F6(\u603B/\u5747)</div><div class="text-emerald-600 font-bold text-xs tracking-tight font-mono tabular-nums">' + fmt(totalMs) + " / " + fmt(avgMs) + '</div></div><div class="space-y-0.5"><div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">\u5FAA\u73AF(\u6267\u884C/\u5931\u8D25)</div><div class="text-xs font-semibold text-slate-700 font-mono tabular-nums"><span class="text-slate-900">' + (iter.run || 1) + '</span> <span class="text-slate-300">/</span> <span class="text-rose-500">' + (iter.failed || 0) + '</span></div></div><div class="space-y-0.5"><div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">\u65AD\u8A00(\u6267\u884C/\u5931\u8D25)</div><div class="text-xs font-semibold text-slate-700 font-mono tabular-nums"><span class="text-slate-900">' + assertTotal + '</span> <span class="text-slate-300">/</span> <span class="text-rose-500">' + assertFailed + "</span></div></div></div>";
    statsPanel.innerHTML = chart + metrics;
  }
  function renderFilterAll(steps, scenarioSteps) {
    steps = steps || [];
    scenarioSteps = scenarioSteps || [];
    var filterBar = document.getElementById("filterBar");
    if (!filterBar) return;
    if (!steps.length && !scenarioSteps.length) {
      filterBar.innerHTML = '<div class="text-xs text-slate-400 py-1">\u672A\u52A0\u8F7D\u573A\u666F</div>';
      return;
    }
    var filterState = window.__R && window.__R.getFilterState ? window.__R.getFilterState() : { type: "all", keyword: "" };
    var total = scenarioSteps.length || steps.length;
    var skipped = steps.filter(function(s) {
      return s.skipped;
    }).length;
    var passed = steps.filter(function(s) {
      return !s.skipped && s.passed;
    }).length;
    var failed = steps.filter(function(s) {
      return !s.skipped && !s.passed;
    }).length;
    var curType = filterState.type || "all";
    var curKw = filterState.keyword || "";
    function btnCls(type) {
      return curType === type ? "filter-btn px-2.5 py-1 text-xs font-bold text-slate-900 bg-white rounded-md shadow-2xs transition-all" : "filter-btn px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-md transition-all";
    }
    filterBar.innerHTML = `
            <div class="flex items-center gap-1 bg-slate-200/50 p-0.5 rounded-lg border border-slate-200/60">
                <button data-f="all" onclick="window.__R.filter('all')" class="${btnCls("all")}">\u5168\u90E8 (${total})</button>
                <button data-f="pass" onclick="window.__R.filter('pass')" class="${btnCls("pass")}">\u6210\u529F (${passed})</button>
                <button data-f="fail" onclick="window.__R.filter('fail')" class="${btnCls("fail")}">\u5931\u8D25 (${failed})</button>
                ${skipped ? `<button data-f="skip" onclick="window.__R.filter('skip')" class="${btnCls("skip")}">\u8DF3\u8FC7 (${skipped})</button>` : ""}
            </div>
            <div class="flex items-center space-x-2">
                <input type="search" value="${esc(curKw)}" placeholder="\u641C\u7D22\u6B65\u9AA4/\u8DEF\u5F84..." oninput="window.__R.search(this.value)" class="px-2.5 py-1 rounded-md border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all w-40">
            </div>
        `;
    if (window.__R && window.__R.applyFilter) {
      window.__R.applyFilter();
    }
  }
  function renderPendingSteps(scenarioSteps, startIndex) {
    if (!Array.isArray(scenarioSteps) || startIndex >= scenarioSteps.length) return "";
    return scenarioSteps.slice(startIndex).map(function(step, idx) {
      var stepIndex = startIndex + idx;
      var seqNum = stepIndex + 1;
      var method = String(step.method || "GET").toUpperCase();
      var stepPath = step.path || "";
      var methodColor = { GET: "text-emerald-600", POST: "text-amber-600", PUT: "text-yellow-600", DELETE: "text-rose-600", PATCH: "text-indigo-600" }[method] || "text-slate-600";
      var assertCount = Array.isArray(step.assertions) ? step.assertions.length : 0;
      var extractCount = Array.isArray(step.extract) ? step.extract.length : 0;
      var tags = "";
      if (assertCount) tags += '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 text-[10px] font-semibold"> ' + assertCount + " \u65AD\u8A00</span>";
      if (extractCount) tags += '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 text-[10px] font-semibold ml-1">' + extractCount + " \u63D0\u53D6</span>";
      var reqBody = step.request && step.request.body ? esc(typeof step.request.body === "string" ? step.request.body : JSON.stringify(step.request.body, null, 2)) : "";
      return '<li class="hover:bg-slate-50/70 group transition-all duration-150 border-b border-slate-100" data-passed="pending" data-step-idx="' + stepIndex + '" data-search="' + esc(((step.name || "") + " " + method + " " + stepPath).toLowerCase()) + '"><div class="px-3.5 py-2 flex items-center justify-between cursor-pointer select-none" onclick="window.__R.toggle(this, event)"><div class="flex items-center space-x-2.5 min-w-0 flex-1 pr-3"><div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[10.5px] font-bold bg-slate-100 border border-slate-200 text-slate-500 tabular-nums">' + seqNum + '</div><span class="text-xs text-slate-700 font-medium truncate group-hover:text-slate-900" title="' + esc(step.name || "") + '">' + esc(step.name || "\u672A\u547D\u540D\u6B65\u9AA4") + '</span><div class="hidden sm:flex items-center space-x-1.5 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/60 flex-shrink-0 max-w-[55%]"><span class="text-[10px] font-extrabold ' + methodColor + ' uppercase tracking-wider font-mono">' + method + '</span><span class="text-slate-300">|</span><span class="text-[11px] text-slate-600 font-mono truncate" title="' + esc(stepPath) + '">' + esc(stepPath) + '</span></div></div><div class="flex items-center space-x-1.5 flex-shrink-0">' + tags + '<button type="button" data-copy-step="' + stepIndex + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]" title="\u590D\u5236\u6B65\u9AA4\u6807\u9898\u4E0E\u63A5\u53E3\u8DEF\u5F84">\u590D\u5236</button><button type="button" data-curl-step="' + stepIndex + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]" title="\u590D\u5236\u4E3A cURL \u547D\u4EE4\u884C">cURL</button><button type="button" data-adhoc-step="' + stepIndex + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.96]">\u8C03\u8BD5</button><span class="text-[10.5px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">\u5F85\u6267\u884C</span><svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div><div class="details-panel px-4 bg-slate-50/70 border-t border-slate-200/60 text-[13px]"><div class="py-2.5 space-y-2.5">' + (reqBody ? '<div><div class="flex items-center justify-between text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1.5"><span class="flex items-center"><div class="w-1.5 h-1.5 bg-slate-400 mr-2 rounded-full"></div>\u8BF7\u6C42\u4F53</span><div class="flex items-center gap-2"><span class="text-slate-400 font-mono font-normal">JSON</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="pending-req-body-' + stepIndex + '">\u590D\u5236</button></div></div><pre id="pending-req-body-' + stepIndex + '" class="bg-slate-900 p-2.5 rounded-lg text-slate-200 overflow-x-auto font-mono text-[11px] leading-relaxed shadow-inner border border-slate-800">' + reqBody + "</pre></div>" : '<div class="text-xs text-slate-400 py-1">\u65E0\u8BF7\u6C42\u4F53\u53C2\u6570</div>') + "</div></div></li>";
    }).join("");
  }
  function renderStepItem(s, i, executionMode) {
    var ok = s.passed;
    var skipped = s.skipped;
    var seqNum = i + 1;
    var seqCls = skipped ? "bg-slate-400 text-white" : ok ? "bg-emerald-500 text-white" : "bg-rose-500 text-white";
    var nameCls = ok ? "text-slate-800 group-hover:text-slate-950 font-medium" : "text-rose-800 font-bold";
    var statusCls = skipped ? "text-slate-600 bg-slate-100 border-slate-200" : ok ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/20" : "text-rose-700 bg-rose-500/10 border-rose-500/20 shadow-2xs";
    var timeCls = ok ? "text-slate-400 font-mono" : "text-rose-500 font-mono font-bold";
    var bgCls = ok ? "hover:bg-slate-50/60" : "bg-rose-50/20 hover:bg-rose-50/40";
    var methodColor = { GET: "text-emerald-600", POST: "text-amber-600", PUT: "text-yellow-600", DELETE: "text-rose-600", PATCH: "text-indigo-600" }[s.method] || "text-slate-600";
    var reqHeaders = s.request && s.request.headers ? esc(truncateForDisplay(typeof s.request.headers === "string" ? s.request.headers : JSON.stringify(s.request.headers, null, 2))) : "";
    var reqBody = s.request && s.request.body ? esc(truncateForDisplay(typeof s.request.body === "string" ? s.request.body : JSON.stringify(s.request.body, null, 2))) : "";
    var resHeaders = s.response && s.response.headers ? esc(truncateForDisplay(typeof s.response.headers === "string" ? s.response.headers : JSON.stringify(s.response.headers, null, 2))) : "";
    var resBody = s.response && s.response.body ? esc(truncateForDisplay(typeof s.response.body === "string" ? s.response.body : JSON.stringify(s.response.body, null, 2))) : "";
    var errorHtml = "";
    if (!ok && s.error) {
      var isNetworkErr = /Failed to fetch|NetworkError|ECONNREFUSED|ENOTFOUND/i.test(s.error);
      if (isNetworkErr) {
        errorHtml = '<div class="my-2 p-2.5 bg-rose-50 rounded-lg border border-rose-200 flex items-start space-x-2.5"><svg class="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><div class="text-xs text-rose-800"><div class="font-bold">\u7F51\u7EDC\u8FDE\u63A5\u5931\u8D25 (Failed to fetch)</div><div class="text-rose-600 mt-0.5">\u76EE\u6807\u670D\u52A1\u672A\u54CD\u5E94\u3002\u8BF7\u68C0\u67E5\u672C\u5730\u63A5\u53E3\u670D\u52A1\uFF08\u5982 ' + esc(s.path) + "\uFF09\u662F\u5426\u5DF2\u542F\u52A8\uFF0C\u6216\u70B9\u51FB\u53F3\u4E0A\u89D2\u300C\u914D\u7F6E\u53C2\u6570\u300D\u8C03\u6574\u5730\u5740\u3002</div></div></div>";
      } else {
        errorHtml = '<div class="my-2 p-2 bg-rose-50 rounded-lg border border-rose-200 flex items-center space-x-2"><svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-rose-800 font-bold text-[12px]">\u5931\u8D25:</span><span class="text-rose-600 text-[12px] font-mono break-all">' + esc(s.error) + "</span></div>";
      }
    }
    var assertHtml = "";
    if (s.assertions && s.assertions.length) {
      var failedList = s.assertions.filter(function(a) {
        return !a.passed;
      });
      var diffHtml = "";
      if (failedList.length > 0) {
        diffHtml = '<div class="mt-2 space-y-1.5">' + failedList.map(function(a) {
          return '<div class="p-2 rounded-lg bg-rose-50/70 border border-rose-200 text-xs"><div class="font-bold text-rose-700">' + esc(a.name) + '</div><div class="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]"><div class="p-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800"><span class="font-bold text-[10px] uppercase block mb-0.5">\u9884\u671F\u503C (Expected)</span>' + esc(stringify(a.expected)) + '</div><div class="p-1.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800"><span class="font-bold text-[10px] uppercase block mb-0.5">\u5B9E\u9645\u503C (Actual)</span>' + esc(stringify(a.actual)) + "</div></div></div>";
        }).join("") + "</div>";
      }
      assertHtml = '<div class="py-2.5 border-t border-slate-200 mt-2"><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-2">\u65AD\u8A00\u7ED3\u679C (' + (s.assertions.length - failedList.length) + "/" + s.assertions.length + ')</div><div class="flex flex-wrap gap-1.5">' + s.assertions.map(function(a) {
        var ac = a.passed ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-rose-500/10 text-rose-700 border-rose-500/20";
        var ap = a.passed ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12";
        return '<div class="flex items-center px-2 py-0.5 ' + ac + ' rounded-md border text-[11px] font-medium" title="Expected: ' + esc(stringify(a.expected)) + " \nActual: " + esc(stringify(a.actual)) + '"><svg class="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="' + ap + '"></path></svg>' + esc(a.name) + "</div>";
      }).join("") + "</div>" + diffHtml + "</div>";
    }
    var bodyColor = ok ? "text-emerald-400" : "text-rose-400";
    var detailPanelCls = ok ? "details-panel px-4 bg-slate-50/40 border-t border-slate-100 text-[13px]" : "details-panel px-4 bg-white border-t border-rose-100 text-[13px] shadow-inner";
    var stepActions = executionMode === "step" ? '<span class="step-run-actions"><button type="button" data-step-action="rewind" data-step-index="' + i + '" title="\u4EC5\u56DE\u9000\u6D4B\u8BD5\u8FD0\u884C\u65F6\u4E0E\u62A5\u544A\uFF0C\u4E0D\u64A4\u9500\u5DF2\u53D1\u51FA\u7684\u4E1A\u52A1\u8BF7\u6C42">\u56DE\u9000</button><button type="button" data-step-action="rerun" data-step-index="' + i + '" title="\u4ECE\u672C\u6B65\u9AA4\u6267\u884C\u524D\u7684\u53D8\u91CF\u5FEB\u7167\u91CD\u65B0\u6267\u884C">\u91CD\u8DD1</button></span>' : "";
    return '<li class="' + bgCls + ' group transition-colors border-b border-slate-100" data-passed="' + ok + '" data-skipped="' + skipped + '" data-step-idx="' + i + '" data-search="' + esc((s.name + " " + s.method + " " + s.path).toLowerCase()) + '"><div class="px-3.5 py-2 flex items-center justify-between cursor-pointer" onclick="window.__R.toggle(this, event)"><div class="flex items-center space-x-2.5 w-[70%] lg:w-[80%]"><div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[10.5px] font-bold shadow-2xs ' + seqCls + ' tabular-nums">' + seqNum + '</div><span class="select-text text-xs ' + nameCls + ' truncate transition-colors" title="' + esc(s.name) + '">' + esc(s.name) + '</span><div class="hidden sm:flex items-center space-x-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 flex-shrink-0 max-w-[50%]"><span class="text-[10px] font-bold ' + methodColor + ' uppercase tracking-wider font-mono">' + esc(String(s.method)) + '</span><span class="text-slate-300">|</span><span class="select-text text-[11px] text-slate-500 font-mono truncate" title="' + esc(s.path) + '">' + esc(s.path) + '</span></div></div><div class="flex items-center space-x-1.5 flex-shrink-0"><button type="button" data-copy-step="' + i + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]" title="\u590D\u5236\u6B65\u9AA4\u6807\u9898\u4E0E\u63A5\u53E3\u8DEF\u5F84">\u590D\u5236</button><button type="button" data-curl-step="' + i + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]" title="\u590D\u5236\u4E3A cURL \u547D\u4EE4\u884C">cURL</button><button type="button" data-adhoc-step="' + i + '" class="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-[0.96]">\u8C03\u8BD5</button>' + stepActions + '<span class="text-[11px] font-bold font-mono ' + statusCls + ' px-2 py-0.5 rounded-md border tabular-nums">' + esc(String(s.status)) + '</span><span class="' + timeCls + ' text-[11px] font-mono w-16 text-right tabular-nums">' + fmt(s.duration) + '</span><svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div><div class="' + detailPanelCls + '"><div class="sm:hidden mb-3 pb-3 border-b border-slate-200"><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1">\u63A5\u53E3\u5730\u5740</div><div class="flex items-center space-x-2"><span class="text-xs font-bold ' + methodColor + '">' + esc(String(s.method)) + '</span><span class="text-xs font-mono break-all">' + esc(s.path) + "</span></div></div>" + errorHtml + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 md:divide-x divide-slate-200 py-2.5"><div class="md:pr-5 space-y-2.5">' + (reqHeaders ? '<div><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"><span class="flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>\u8BF7\u6C42\u5934</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="step-' + i + '-req-headers">\u590D\u5236</button></div><pre id="step-' + i + '-req-headers" class="bg-slate-900 p-2.5 rounded-lg text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner text-[11px] border border-slate-800">' + reqHeaders + "</pre></div>" : "") + (reqBody ? '<div><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"><span class="flex items-center"><div class="w-1 h-3 bg-emerald-400 mr-2 rounded-full"></div>\u8BF7\u6C42\u4F53</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="step-' + i + '-req-body">\u590D\u5236</button></div><pre id="step-' + i + '-req-body" class="bg-slate-900 p-2.5 rounded-lg ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner text-[11px] border border-slate-800">' + reqBody + "</pre></div>" : "") + '</div><div class="md:pl-5 space-y-2.5">' + (resHeaders ? '<div><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"><span class="flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>\u54CD\u5E94\u5934</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="step-' + i + '-res-headers">\u590D\u5236</button></div><pre id="step-' + i + '-res-headers" class="bg-slate-900 p-2.5 rounded-lg text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner text-[11px] border border-slate-800">' + resHeaders + "</pre></div>" : "") + (resBody ? '<div><div class="text-slate-500 text-[10.5px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between"><span class="flex items-center"><div class="w-1 h-3 ' + (ok ? "bg-emerald-400" : "bg-rose-400") + ' mr-2 rounded-full"></div>\u54CD\u5E94\u4F53</span><button type="button" class="code-copy-btn text-[10px] text-slate-400 hover:text-slate-200" data-code-copy="step-' + i + '-res-body">\u590D\u5236</button></div><pre id="step-' + i + '-res-body" class="bg-slate-900 p-2.5 rounded-lg ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner text-[11px] border border-slate-800">' + resBody + "</pre></div>" : "") + "</div></div>" + assertHtml + "</div></li>";
  }
  function renderStepsAll(steps, scenarioSteps, executionMode) {
    var ul = document.getElementById("stepsList");
    if (!ul) return;
    steps = steps || [];
    scenarioSteps = scenarioSteps || [];
    if (!steps.length && !scenarioSteps.length) {
      ul.innerHTML = '<li class="p-8 text-center text-slate-400 text-xs">\u70B9\u51FB\u300C\u6267\u884C\u5168\u90E8\u300D\u5F00\u59CB\u53D1\u8D77\u8BF7\u6C42</li>';
      return;
    }
    ul.innerHTML = steps.map(function(s, i) {
      return renderStepItem(s, i, executionMode);
    }).join("") + renderPendingSteps(scenarioSteps, steps.length);
    if (window.__R && window.__R.applyFilter) {
      window.__R.applyFilter();
    }
  }
  function appendStepResult(result, index, scenarioSteps, executionMode) {
    var ul = document.getElementById("stepsList");
    if (!ul) return;
    ul.querySelectorAll('li[data-passed="pending"]').forEach(function(node) {
      node.remove();
    });
    var template = document.createElement("template");
    template.innerHTML = renderStepItem(result, index, executionMode) + renderPendingSteps(scenarioSteps, index + 1);
    ul.appendChild(template.content);
    if (window.__R && window.__R.applyFilter) {
      window.__R.applyFilter();
    }
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
    var cancelled = steps.some(function(item) {
      return item.cancelled;
    });
    var status = cancelled ? "CANCELLED" : failed > 0 ? "FAILED" : executed === 0 ? "SKIPPED" : "PASSED";
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
        passRate: executed ? (passed / executed * 100).toFixed(1) + "%" : "0.0%",
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
    var resultText = report.status === "CANCELLED" ? "\u{1F6AB} \u5DF2\u53D6\u6D88" : summary.failedSteps ? "\u274C \u5B58\u5728\u5931\u8D25" : summary.skippedSteps && summary.executedSteps === 0 ? "\u23ED\uFE0F \u5168\u90E8\u8DF3\u8FC7" : "\u2705 \u5168\u90E8\u901A\u8FC7";
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
      lines.push(formatReportPayload(response.headers || {}, { full: true }));
      lines.push("```");
      lines.push("  - **\u54CD\u5E94\u4F53**:");
      lines.push("```");
      lines.push(formatReportPayload(response.bodyText !== void 0 ? response.bodyText : response.body, { full: true }));
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
    var cancelled = report.status === "CANCELLED";
    var hasFailure = summary.failedSteps > 0;
    var allSkipped = !hasFailure && summary.executedSteps === 0 && summary.skippedSteps > 0;
    var completed = pending <= 0;
    var statusClass = cancelled ? "report-status--cancelled" : hasFailure ? "report-status--failed" : allSkipped ? "report-status--skipped" : completed ? "report-status--passed" : "report-status--running";
    var statusText = cancelled ? "\u5DF2\u53D6\u6D88" : hasFailure ? "\u5B58\u5728\u5931\u8D25" : allSkipped ? "\u5168\u90E8\u8DF3\u8FC7" : completed ? "\u5168\u90E8\u901A\u8FC7" : "\u6267\u884C\u4E2D";
    var modeText = report.executionMode === "step" ? "\u5355\u6B65\u6267\u884C" : "\u5168\u91CF\u6267\u884C";
    var progressText = summary.executedSteps + " / " + summary.totalSteps;
    var reportSteps = report.steps.filter(function(step) {
      return !step.passed && !step.cancelled;
    });
    var hasRealFailure = reportSteps.length > 0;
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
    var diagnosisHtml = hasRealFailure ? '<div class="report-steps"><div class="report-steps__title">\u5931\u8D25\u6B65\u9AA4</div>' + stepHtml + "</div>" : cancelled ? '<div class="report-healthy"><div class="report-healthy__title">\u6267\u884C\u5DF2\u53D6\u6D88</div><div class="report-healthy__hint">\u53D6\u6D88\u7684\u6B65\u9AA4\u4E0D\u8BA1\u5165\u5931\u8D25\uFF1B\u8BE6\u7EC6\u8BF7\u6C42\u4E0E\u54CD\u5E94\u8BF7\u5728\u5DE6\u4FA7\u6B65\u9AA4\u5217\u8868\u67E5\u770B\u3002</div></div>' : allSkipped ? '<div class="report-healthy"><div class="report-healthy__title">\u6240\u6709\u6B65\u9AA4\u5747\u56E0\u6761\u4EF6\u4E0D\u6EE1\u8DB3\u800C\u8DF3\u8FC7</div><div class="report-healthy__hint">\u672C\u6B21\u6267\u884C\u672A\u53D1\u8D77\u4EFB\u4F55\u8BF7\u6C42\uFF0C\u8BE6\u7EC6\u8DF3\u8FC7\u539F\u56E0\u8BF7\u5728\u5DE6\u4FA7\u6B65\u9AA4\u5217\u8868\u67E5\u770B\u3002</div></div>' : '<div class="report-healthy"><div class="report-healthy__title">' + (completed ? "\u6240\u6709\u6B65\u9AA4\u5747\u5DF2\u901A\u8FC7" : "\u5F53\u524D\u5DF2\u6267\u884C\u6B65\u9AA4\u5747\u901A\u8FC7") + '</div><div class="report-healthy__hint">\u8BE6\u7EC6\u8BF7\u6C42\u4E0E\u54CD\u5E94\u8BF7\u5728\u5DE6\u4FA7\u6B65\u9AA4\u5217\u8868\u67E5\u770B\uFF1B\u5B8C\u6574\u62A5\u544A\u53EF\u901A\u8FC7\u9876\u90E8\u6309\u94AE\u590D\u5236\u3002</div></div>';
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
    appendStepResult,
    buildOverallReport,
    buildMarkdownReport,
    renderReportPanel
  };
}();
var ui_view_default = workbenchView;

// src/browser/ui/ui-adhoc.js
var workbenchAdhoc = function() {
  "use strict";
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
    if (isPlainObject(value)) {
      return Object.keys(value).reduce(function(result, key) {
        result[key] = resolveAdhocValue(value[key], runtime);
        return result;
      }, {});
    }
    if (typeof value !== "string") return value;
    return value.replace(/\{\{\s*(.+?)\s*\}\}/g, function(template, expr) {
      var resolved = evalExpression(expr, runtime);
      if (resolved === void 0 || resolved === null || resolved === "") return template;
      return typeof resolved === "object" ? JSON.stringify(resolved) : String(resolved);
    });
  }
  function hasAdhocTemplate(value) {
    if (typeof value === "string") return /\{\{\s*.+?\s*\}\}/.test(value);
    if (Array.isArray(value)) return value.some(hasAdhocTemplate);
    if (isPlainObject(value)) return Object.keys(value).some(function(key) {
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
    var request = resolveAdhocValue(clone(step.request || {}), runtime) || {};
    var resolvedPath = resolveAdhocValue(step.path || request.path || "", runtime);
    var parsed = parseQueryParamsFromUrl(resolvedPath);
    var rawParams = step.params || request.params;
    var resolvedParams = rawParams ? resolveAdhocValue(rawParams, runtime) : {};
    var mergedParams = Object.assign({}, parsed.params, isPlainObject(resolvedParams) ? resolvedParams : {});
    return {
      name: (step.name || "\u672A\u547D\u540D\u6B65\u9AA4") + "\uFF08\u4E34\u65F6\u8C03\u8BD5\uFF09",
      method: String(step.method || request.method || "GET").toUpperCase(),
      path: parsed.basePath,
      params: Object.keys(mergedParams).length > 0 ? mergedParams : null,
      headers: request.headers && isPlainObject(request.headers) ? request.headers : {},
      body: request.body === void 0 ? null : request.body
    };
  }
  function buildAdhocStep(values) {
    var path4 = String(values.path || "").trim();
    if (!path4) throw new Error("\u8BF7\u6C42\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A");
    var params = values.params;
    var headers = parseJsonEditor(values.headers, "\u8BF7\u6C42\u5934");
    var bodyText = String(values.body || "").trim();
    var body = bodyText ? parseJsonEditor(bodyText, "\u8BF7\u6C42\u4F53") : void 0;
    if (params && !isPlainObject(params)) throw new Error("Query \u53C2\u6570\u5FC5\u987B\u662F Key-Value \u5BF9\u8C61");
    if (!isPlainObject(headers)) throw new Error("\u8BF7\u6C42\u5934\u5FC5\u987B\u662F JSON \u5BF9\u8C61");
    if (hasAdhocTemplate(path4) || hasAdhocTemplate(params) || hasAdhocTemplate(headers) || hasAdhocTemplate(body)) {
      throw new Error("\u4ECD\u6709\u672A\u89E3\u6790\u7684 {{vars.xxx}} \u53C2\u6570\uFF0C\u8BF7\u586B\u5199\u5B9E\u9645\u503C\u540E\u518D\u6267\u884C");
    }
    return {
      name: values.name || "\u4E34\u65F6\u8BF7\u6C42",
      method: String(values.method || "GET").toUpperCase(),
      path: path4,
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
    var keys = paramsObj && isPlainObject(paramsObj) ? Object.keys(paramsObj) : [];
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
  async function executeAdhocRequest(executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn, getGlobalsFn, getVarsFn) {
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
      var runtimeVars = getVarsFn ? getVarsFn() : {};
      var runtime = {
        vars: clone(runtimeVars),
        lastResponse: null,
        lastResponseBody: null,
        baseUrl: getBaseUrlFn ? getBaseUrlFn() : "",
        authorization: getAuthFn ? getAuthFn() : "",
        globals: getGlobalsFn ? getGlobalsFn() : [],
        environment: environment ? clone(environment) : null,
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
  function bindAdhocRequestEvents(getStepByIdxFn, getRuntimeByIdxFn, executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn, getGlobalsFn, getVarsFn) {
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
    var modal = document.getElementById("adhocModal");
    if (modal) {
      modal.addEventListener("click", function(event) {
        if (event.target === modal) closeAdhocModal();
      });
    }
    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        closeAdhocModal();
      }
    });
    document.getElementById("adhocExecuteBtn").addEventListener("click", function() {
      executeAdhocRequest(executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn, getGlobalsFn, getVarsFn);
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
var ui_adhoc_default = workbenchAdhoc;

// src/browser/ui/runtime.js
function createWorkbenchRuntime(options) {
  "use strict";
  var uiStyle = ui_style_default;
  var uiView = ui_view_default;
  var uiAdhoc = ui_adhoc_default;
  var clone2 = clone;
  var isPlainObject2 = isPlainObject;
  var assertNotReservedVar2 = assertNotReservedVar;
  var assertNoReservedVars2 = assertNoReservedVars;
  var md52 = md5;
  var mergeGlobals2 = mergeGlobals;
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
  var appConfig = options.config || {};
  var getRegisteredScenario = options.getScenario || function() {
    return null;
  };
  if (uiAdhoc.setConfig) uiAdhoc.setConfig(appConfig);
  var stepsFilterState = {
    type: "all",
    keyword: ""
  };
  function applyStepsFilter() {
    var type = stepsFilterState.type || "all";
    var keyword = String(stepsFilterState.keyword || "").trim().toLowerCase();
    document.querySelectorAll(".filter-btn").forEach(function(b) {
      var active = b.dataset.f === type;
      if (active) {
        b.className = "filter-btn px-2.5 py-1 text-xs font-bold text-slate-900 bg-white rounded-md shadow-2xs transition-all";
      } else {
        b.className = "filter-btn px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-md transition-all";
      }
    });
    document.querySelectorAll("#stepsList li").forEach(function(li) {
      var searchData = String(li.dataset.search || "").toLowerCase();
      var matchSearch = !keyword || searchData.indexOf(keyword) >= 0;
      var passedAttr = li.dataset.passed;
      var skipped = li.dataset.skipped === "true";
      var matchFilter = false;
      if (type === "all") {
        matchFilter = true;
      } else if (type === "pass") {
        matchFilter = passedAttr === "true" && !skipped;
      } else if (type === "fail") {
        matchFilter = passedAttr === "false" && !skipped;
      } else if (type === "skip") {
        matchFilter = skipped;
      }
      li.style.display = matchSearch && matchFilter ? "" : "none";
    });
  }
  window.__R = {
    toggle: function(el, event) {
      if (event && event.target.closest("button, input, textarea, select, a")) return;
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
      stepsFilterState.type = type;
      applyStepsFilter();
    },
    search: function(q) {
      stepsFilterState.keyword = q;
      applyStepsFilter();
    },
    getFilterState: function() {
      return stepsFilterState;
    },
    applyFilter: applyStepsFilter
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
  function getRequestBaseUrl() {
    if (window.__SCENARIO_TEST_SERVE_PROXY__) {
      return String(window.location.origin || "").replace(/\/+$/, "");
    }
    return getEffectiveBaseUrl();
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
        var secretVar = def.secretVar || "apiSecret";
        var secretVal = vars[secretVar];
        if (!secretVal) {
          throw new Error("\u7B7E\u540D\u751F\u6210\u5931\u8D25: \u7F3A\u5C11\u5BC6\u94A5\u53D8\u91CF vars." + secretVar);
        }
        vars[def.name] = generateSignature(params, secretVal);
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
    uiView.renderFilterAll(state.steps, state.scenario && state.scenario.steps ? state.scenario.steps : []);
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
  var engine = createEngine({ config: appConfig });
  async function executeStep(step, runtime, cfg) {
    var request = step.request || {};
    return await engine.runStep(step, runtime, {
      signal: runtime.abortController.signal,
      baseUrl: runtime.baseUrl,
      authorization: runtime.authorization,
      globals: runtime.globals,
      requestTimeoutMs: Number(step.timeoutMs || request.timeoutMs || cfg.requestTimeoutMs || 3e4)
    });
  }
  function createExecutionRuntime() {
    var environment = getSelectedEnvironment();
    var runtime = {
      vars: buildScenarioRuntimeVars(),
      lastResponse: null,
      lastResponseBody: null,
      baseUrl: getRequestBaseUrl(),
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
    ["environmentSelect", "configToggleBtn", "envDropdownTrigger", "themeDropdownTrigger"].forEach(function(id) {
      var element = document.getElementById(id);
      if (element) {
        element.disabled = disabled;
        element.setAttribute("aria-disabled", disabled ? "true" : "false");
        element.classList.toggle("opacity-50", disabled);
        element.classList.toggle("pointer-events-none", disabled);
      }
    });
    document.querySelectorAll("#configModal input, #configModal select, #configModal button").forEach(function(element) {
      element.disabled = disabled;
    });
  }
  function cancelExecution() {
    var runtime = state.activeRuntime || state.stepRuntime;
    if (!state.running || !runtime || !runtime.abortController) return;
    runtime.cancelled = true;
    runtime.abortController.abort(new Error("\u7528\u6237\u5DF2\u53D6\u6D88\u6267\u884C"));
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
    stepsFilterState.type = "all";
    stepsFilterState.keyword = "";
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
  function highlightActiveStep(stepIndex) {
    var ul = document.getElementById("stepsList");
    if (!ul) return;
    ul.querySelectorAll(".scenario-step--running").forEach(function(node) {
      node.classList.remove("scenario-step--running");
    });
    var stepNode = ul.querySelector('li[data-step-idx="' + stepIndex + '"]') || ul.children[stepIndex];
    if (stepNode) {
      stepNode.classList.add("scenario-step--running");
      if (typeof stepNode.scrollIntoView === "function") {
        stepNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }
  function clearActiveStepHighlight() {
    var ul = document.getElementById("stepsList");
    if (!ul) return;
    ul.querySelectorAll(".scenario-step--running").forEach(function(node) {
      node.classList.remove("scenario-step--running");
    });
  }
  function expandStepDetails(stepIndex) {
    var ul = document.getElementById("stepsList");
    if (!ul) return;
    var stepNode = ul.querySelector('li[data-step-idx="' + stepIndex + '"]') || ul.children[stepIndex];
    if (!stepNode) return;
    var panel = stepNode.querySelector(".details-panel");
    var chevron = stepNode.querySelector(".chevron");
    if (panel) panel.classList.add("open");
    if (chevron) chevron.classList.add("rotate-180");
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
    renderStepsAll();
    try {
      for (var i = 0; i < list.length; i += 1) {
        highlightActiveStep(i);
        rememberDebugRuntime(i, runtime);
        var result = await executeStep(list[i], runtime, cfg);
        result.stepNo = i + 1;
        state.steps.push(result);
        renderStatsAll(iterations);
        renderFilterAll();
        uiView.appendStepResult(result, i, list, state.executionMode);
        renderReportPanel();
        if (!result.passed && (failurePolicy !== "continue" || runtime.abortController.signal.aborted)) break;
      }
      clearActiveStepHighlight();
      finishExecutionState(runtime);
    } catch (error) {
      clearActiveStepHighlight();
      uiView.setRunState("failed", "\u6267\u884C\u5F02\u5E38");
      document.getElementById("reportPanel").innerHTML = '<div class="rounded border border-rose-200 bg-rose-50 p-3 text-rose-700">' + esc(error.message || error) + "</div>";
    } finally {
      clearActiveStepHighlight();
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
      renderStepsAll();
    }
    var runtime = state.stepRuntime;
    var stepIndex = state.nextStepIndex;
    state.running = true;
    state.activeRuntime = runtime;
    state.executionMode = "step";
    setExecutionButtonsDisabled(true);
    highlightActiveStep(stepIndex);
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
      uiView.appendStepResult(result, stepIndex, list, state.executionMode);
      expandStepDetails(stepIndex);
      renderReportPanel();
      if (runtime.cancelled || result.cancelled || result.timedOut) {
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
      clearActiveStepHighlight();
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
  var SECRET_VAR_PATTERN = /(token|secret|password|passwd|auth|credential|api[-_]?key)/i;
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
      var isSecret = SECRET_VAR_PATTERN.test(def.name);
      return '<label class="flex flex-col gap-1.5"><span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">' + esc(def.label) + " (" + esc(def.name) + ")" + (isSecret ? ' <button type="button" data-toggle-var="' + esc(def.name) + '" class="font-normal normal-case tracking-normal text-emerald-500 hover:text-emerald-400">\u663E\u793A</button>' : "") + '</span><input id="scenarioVar_' + esc(def.name) + '" type="' + (isSecret ? "password" : "text") + '" value="' + esc(value) + '" placeholder="\u8BF7\u8F93\u5165 ' + esc(def.label) + '" autocomplete="off" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"></label>';
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
    function selectEnvironment(envKey) {
      persistSetting(keys.environment, envKey);
      syncSettingsInputs();
      updateHeader();
      renderStatsAll(state.scenario ? state.scenario.iterations : { run: 1, failed: 0 });
      renderFilterAll();
      renderStepsAll();
    }
    if (envSelectHeader) {
      envSelectHeader.addEventListener("change", function(e) {
        selectEnvironment(e.target.value);
      });
    }
    if (envSelectPanel) {
      envSelectPanel.addEventListener("change", function(e) {
        selectEnvironment(e.target.value);
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
    function flashCopyFeedback(btn, ok) {
      if (!btn) return;
      if (btn.__copyFeedbackTimer) window.clearTimeout(btn.__copyFeedbackTimer);
      if (btn.__copyOriginalHtml == null) btn.__copyOriginalHtml = btn.innerHTML;
      var label = ok ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u5931\u8D25";
      btn.innerHTML = '<span style="color:' + (ok ? "#059669" : "#dc2626") + ';font-weight:700">' + label + "</span>";
      btn.__copyFeedbackTimer = window.setTimeout(function() {
        btn.innerHTML = btn.__copyOriginalHtml;
        btn.__copyFeedbackTimer = null;
      }, 1500);
    }
    function handleCopy(btn, getText) {
      if (!state.lastReport) return;
      Promise.resolve().then(getText).then(copyText).then(function(ok) {
        flashCopyFeedback(btn, ok);
      }).catch(function() {
        flashCopyFeedback(btn, false);
      });
    }
    if (copyMdBtn) {
      copyMdBtn.addEventListener("click", function() {
        handleCopy(copyMdBtn, function() {
          return uiView.buildMarkdownReport(state.lastReport);
        });
      });
    }
    if (copyJsonBtn) {
      copyJsonBtn.addEventListener("click", function() {
        handleCopy(copyJsonBtn, function() {
          return safeJson(state.lastReport);
        });
      });
    }
  }
  function bindStepCopyActions() {
    var ul = document.getElementById("stepsList");
    if (!ul) return;
    ul.addEventListener("click", function(event) {
      var button = event.target && event.target.closest ? event.target.closest("[data-copy-step]") : null;
      if (!button) return;
      var index = Number(button.getAttribute("data-copy-step"));
      if (!Number.isInteger(index)) return;
      var step = state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[index] : null;
      if (!step) return;
      var text = (step.name ? step.name : "\u6B65\u9AA4 " + (index + 1)) + "\n" + String(step.method || "GET").toUpperCase() + " " + (step.path || "");
      Promise.resolve().then(function() {
        return copyText(text);
      }).then(function(ok) {
        showStepCopyFeedback(button, ok);
      }).catch(function() {
        showStepCopyFeedback(button, false);
      });
    });
    function showStepCopyFeedback(button, ok) {
      if (button.__copyFeedbackTimer) window.clearTimeout(button.__copyFeedbackTimer);
      if (button.__copyOriginalText == null) button.__copyOriginalText = button.textContent;
      button.textContent = ok ? "\u5DF2\u590D\u5236" : "\u5931\u8D25";
      button.__copyFeedbackTimer = window.setTimeout(function() {
        button.textContent = button.__copyOriginalText;
        button.__copyFeedbackTimer = null;
      }, 1500);
    }
  }
  function generateStepCurl(step, stepIndex) {
    if (!step) return "";
    var method = String(step.method || step.request && step.request.method || "GET").toUpperCase();
    var baseUrl = getRequestBaseUrl();
    var rawVars = Object.assign({}, getConfiguredScenarioVariables(), getStoredScenarioVariables());
    var resolvedVars = clone2(rawVars);
    if (state.activeRuntime && state.activeRuntime.vars) {
      Object.assign(resolvedVars, state.activeRuntime.vars);
    } else if (state.stepRuntime && state.stepRuntime.vars) {
      Object.assign(resolvedVars, state.stepRuntime.vars);
    }
    var runtime = { vars: resolvedVars };
    var stepPath = step.path || step.request && step.request.path || "";
    var stepParams = step.params || step.request && step.request.params;
    var requestPath = buildUrl(stepPath, stepParams, runtime);
    var globals = getEffectiveGlobals();
    var headers = {};
    var queryIndex = requestPath.indexOf("?");
    var existingKeys = /* @__PURE__ */ new Set();
    if (queryIndex >= 0) {
      requestPath.slice(queryIndex + 1).split("&").forEach(function(pair) {
        var key = pair.split("=")[0];
        if (key) existingKeys.add(decodeURIComponent(key));
      });
    }
    var queryPairs = [];
    globals.forEach(function(global) {
      if (global.type !== "query" || existingKeys.has(global.name)) return;
      queryPairs.push(encodeURIComponent(global.name) + "=" + encodeURIComponent(String(resolveString(global.value, runtime))));
    });
    if (queryPairs.length) {
      requestPath += (queryIndex >= 0 ? "&" : "?") + queryPairs.join("&");
    }
    var cookieParts = globals.filter(function(global) {
      return global.type === "cookie";
    }).map(function(global) {
      return global.name + "=" + resolveString(global.value, runtime);
    });
    globals.forEach(function(g) {
      if (g.type === "header" && g.name) {
        headers[g.name] = resolveString(g.value || "", runtime);
      }
    });
    if (step.request && step.request.headers) {
      var reqHeaders = step.request.headers;
      if (typeof reqHeaders === "object" && reqHeaders !== null) {
        Object.keys(reqHeaders).forEach(function(k) {
          headers[k] = resolveString(String(reqHeaders[k]), runtime);
        });
      }
    }
    if (cookieParts.length) {
      var cookieKey = Object.keys(headers).find(function(key) {
        return key.toLowerCase() === "cookie";
      });
      var mergedCookie = cookieKey ? headers[cookieKey] + "; " + cookieParts.join("; ") : cookieParts.join("; ");
      if (cookieKey) headers[cookieKey] = mergedCookie;
      else headers.Cookie = mergedCookie;
    }
    var fullUrl = joinUrl(baseUrl, requestPath);
    var parts = ["curl -X " + method + ' "' + fullUrl + '"'];
    Object.keys(headers).forEach(function(key) {
      parts.push('-H "' + key + ": " + String(headers[key]).replace(/"/g, '\\"') + '"');
    });
    if (step.request && step.request.body != null) {
      var bodyVal = step.request.body;
      var bodyStr = typeof bodyVal === "string" ? bodyVal : JSON.stringify(bodyVal);
      bodyStr = resolveString(bodyStr, runtime);
      parts.push("-d '" + bodyStr.replace(/'/g, "'\\''") + "'");
    }
    return parts.join(" \\\n  ");
  }
  function bindStepCurlActions() {
    var ul = document.getElementById("stepsList");
    if (!ul) return;
    ul.addEventListener("click", function(event) {
      var button = event.target && event.target.closest ? event.target.closest("[data-curl-step]") : null;
      if (!button) return;
      var index = Number(button.getAttribute("data-curl-step"));
      if (!Number.isInteger(index)) return;
      var step = state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[index] : null;
      if (!step) return;
      var curlCmd = generateStepCurl(step, index);
      Promise.resolve().then(function() {
        return copyText(curlCmd);
      }).then(function(ok) {
        if (button.__copyFeedbackTimer) window.clearTimeout(button.__copyFeedbackTimer);
        if (button.__copyOriginalText == null) button.__copyOriginalText = button.textContent;
        button.textContent = ok ? "\u5DF2\u590D\u5236" : "\u5931\u8D25";
        button.__copyFeedbackTimer = window.setTimeout(function() {
          button.textContent = button.__copyOriginalText;
          button.__copyFeedbackTimer = null;
        }, 1500);
      }).catch(function() {
        button.textContent = "\u5931\u8D25";
      });
    });
  }
  function bindCodeCopyActions() {
    document.addEventListener("click", function(event) {
      var button = event.target && event.target.closest ? event.target.closest("[data-code-copy]") : null;
      if (!button) return;
      var targetId = button.getAttribute("data-code-copy");
      var targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      var text = targetEl.textContent || "";
      Promise.resolve().then(function() {
        return copyText(text);
      }).then(function(ok) {
        if (button.__copyFeedbackTimer) window.clearTimeout(button.__copyFeedbackTimer);
        if (button.__copyOriginalText == null) button.__copyOriginalText = button.textContent;
        button.textContent = ok ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u5931\u8D25";
        button.classList.toggle("code-copy-btn--success", ok);
        button.__copyFeedbackTimer = window.setTimeout(function() {
          button.textContent = button.__copyOriginalText;
          button.classList.remove("code-copy-btn--success");
          button.__copyFeedbackTimer = null;
        }, 1500);
      }).catch(function() {
        button.textContent = "\u590D\u5236\u5931\u8D25";
      });
    });
  }
  function bindGlobalShortcuts() {
    document.addEventListener("keydown", function(event) {
      var activeEl = document.activeElement;
      var isEditing = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.tagName === "SELECT" || activeEl.tagName === "BUTTON" || activeEl.isContentEditable);
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        var runBtn = document.getElementById("runBtn");
        if (runBtn && !runBtn.disabled) runBtn.click();
        return;
      }
      if (event.key === "Enter" && event.altKey) {
        event.preventDefault();
        var stepBtn = document.getElementById("stepBtn");
        if (stepBtn && !stepBtn.disabled) stepBtn.click();
        return;
      }
      if ((event.key === "r" || event.key === "R") && event.altKey) {
        event.preventDefault();
        var resetBtn = document.getElementById("resetBtn");
        if (resetBtn && !resetBtn.disabled) resetBtn.click();
        return;
      }
      if (!isEditing) {
        if (event.key === " " || event.code === "Space") {
          var configModal = document.getElementById("configModal");
          var adhocModal = document.getElementById("adhocModal");
          var isModalOpen = configModal && !configModal.classList.contains("hidden") || adhocModal && !adhocModal.classList.contains("hidden");
          if (!isModalOpen) {
            event.preventDefault();
            var stepBtn2 = document.getElementById("stepBtn");
            if (stepBtn2 && !stepBtn2.disabled) stepBtn2.click();
            return;
          }
        }
        if (event.key === "/" || (event.ctrlKey || event.metaKey) && (event.key === "k" || event.key === "K")) {
          event.preventDefault();
          var searchInput = document.getElementById("scenarioSearchInput");
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
          return;
        }
      }
    });
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
        var path4 = String(item.file || "").replace(/^\.\//, "");
        if (!path4) return { i, displayName: null };
        var url = "./" + path4 + (path4.indexOf("?") >= 0 ? "&" : "?") + "ts=" + Date.now();
        try {
          var response = await fetch(url);
          if (!response.ok) throw new Error("fetch " + path4);
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
      var known = (appConfig.scenarios || []).some(function(entry) {
        return entry && ["url", "file", "path"].some(function(key) {
          return entry[key] === file;
        });
      });
      if (!known) {
        rejectLoad(new Error("\u573A\u666F\u6587\u4EF6\u4E0D\u5728\u914D\u7F6E\u6E05\u5355\u4E2D\uFF0C\u5DF2\u62D2\u7EDD\u52A0\u8F7D: " + file));
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
    bindStepCopyActions();
    bindStepCurlActions();
    bindCodeCopyActions();
    bindGlobalShortcuts();
    uiAdhoc.bindAdhocRequestEvents(
      function(idx) {
        return state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[idx] : null;
      },
      function(idx) {
        var debugRt = getDebugRuntime(idx);
        if (debugRt) return debugRt;
        var rawVars = Object.assign({}, getConfiguredScenarioVariables(), getStoredScenarioVariables(), state.scenario && state.scenario.vars || {});
        return { vars: rawVars, lastResponse: null, lastResponseBody: null };
      },
      executeStep,
      getSelectedEnvironment,
      getRequestBaseUrl,
      getEffectiveAuthorization,
      getEffectiveGlobals,
      function() {
        var rawVars = Object.assign({}, getConfiguredScenarioVariables(), getStoredScenarioVariables(), state.scenario && state.scenario.vars || {});
        if (state.activeRuntime && state.activeRuntime.vars) {
          Object.assign(rawVars, state.activeRuntime.vars);
        } else if (state.stepRuntime && state.stepRuntime.vars) {
          Object.assign(rawVars, state.stepRuntime.vars);
        }
        return rawVars;
      }
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
    var varsInputContainer = document.getElementById("scenarioVarsInput");
    if (varsInputContainer) {
      varsInputContainer.addEventListener("click", function(event) {
        var toggleButton = event.target.closest("[data-toggle-var]");
        if (!toggleButton) return;
        var input = document.getElementById("scenarioVar_" + toggleButton.dataset.toggleVar);
        if (!input) return;
        var reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        toggleButton.textContent = reveal ? "\u9690\u85CF" : "\u663E\u793A";
      });
    }
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
var TAILWIND_CSS = '*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}/*\n! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n5. Use the user\'s configured `sans` font-feature-settings by default.\n6. Use the user\'s configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font-family by default.\n2. Use the user\'s configured `mono` font-feature-settings by default.\n3. Use the user\'s configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type=\'button\']),\ninput:where([type=\'reset\']),\ninput:where([type=\'submit\']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden]:where(:not([hidden="until-found"])) {\n  display: none;\n} .\\!container {\n  width: 100% !important;\n} .container {\n  width: 100%;\n} @media (min-width: 640px) {\n\n  .\\!container {\n    max-width: 640px !important;\n  }\n\n  .container {\n    max-width: 640px;\n  }\n} @media (min-width: 768px) {\n\n  .\\!container {\n    max-width: 768px !important;\n  }\n\n  .container {\n    max-width: 768px;\n  }\n} @media (min-width: 1024px) {\n\n  .\\!container {\n    max-width: 1024px !important;\n  }\n\n  .container {\n    max-width: 1024px;\n  }\n} @media (min-width: 1280px) {\n\n  .\\!container {\n    max-width: 1280px !important;\n  }\n\n  .container {\n    max-width: 1280px;\n  }\n} @media (min-width: 1536px) {\n\n  .\\!container {\n    max-width: 1536px !important;\n  }\n\n  .container {\n    max-width: 1536px;\n  }\n} #scenario-test-root .sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n} #scenario-test-root .pointer-events-none {\n  pointer-events: none;\n} #scenario-test-root .visible {\n  visibility: visible;\n} #scenario-test-root .fixed {\n  position: fixed;\n} #scenario-test-root .absolute {\n  position: absolute;\n} #scenario-test-root .relative {\n  position: relative;\n} #scenario-test-root .sticky {\n  position: sticky;\n} #scenario-test-root .inset-0 {\n  inset: 0px;\n} #scenario-test-root .left-2\\.5 {\n  left: 0.625rem;\n} #scenario-test-root .top-0 {\n  top: 0px;\n} #scenario-test-root .top-2\\.5 {\n  top: 0.625rem;\n} #scenario-test-root .z-10 {\n  z-index: 10;\n} #scenario-test-root .z-30 {\n  z-index: 30;\n} #scenario-test-root .z-40 {\n  z-index: 40;\n} #scenario-test-root .col-span-2 {\n  grid-column: span 2 / span 2;\n} #scenario-test-root .mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n} #scenario-test-root .my-2 {\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem;\n} #scenario-test-root .my-8 {\n  margin-top: 2rem;\n  margin-bottom: 2rem;\n} #scenario-test-root .mb-0\\.5 {\n  margin-bottom: 0.125rem;\n} #scenario-test-root .mb-1 {\n  margin-bottom: 0.25rem;\n} #scenario-test-root .mb-1\\.5 {\n  margin-bottom: 0.375rem;\n} #scenario-test-root .mb-2 {\n  margin-bottom: 0.5rem;\n} #scenario-test-root .mb-3 {\n  margin-bottom: 0.75rem;\n} #scenario-test-root .ml-0\\.5 {\n  margin-left: 0.125rem;\n} #scenario-test-root .ml-1 {\n  margin-left: 0.25rem;\n} #scenario-test-root .mr-1 {\n  margin-right: 0.25rem;\n} #scenario-test-root .mr-2 {\n  margin-right: 0.5rem;\n} #scenario-test-root .mt-0\\.5 {\n  margin-top: 0.125rem;\n} #scenario-test-root .mt-1 {\n  margin-top: 0.25rem;\n} #scenario-test-root .mt-1\\.5 {\n  margin-top: 0.375rem;\n} #scenario-test-root .mt-2 {\n  margin-top: 0.5rem;\n} #scenario-test-root .mt-3 {\n  margin-top: 0.75rem;\n} #scenario-test-root .block {\n  display: block;\n} #scenario-test-root .inline {\n  display: inline;\n} #scenario-test-root .flex {\n  display: flex;\n} #scenario-test-root .grid {\n  display: grid;\n} #scenario-test-root .hidden {\n  display: none;\n} #scenario-test-root .h-1\\.5 {\n  height: 0.375rem;\n} #scenario-test-root .h-28 {\n  height: 7rem;\n} #scenario-test-root .h-3 {\n  height: 0.75rem;\n} #scenario-test-root .h-3\\.5 {\n  height: 0.875rem;\n} #scenario-test-root .h-4 {\n  height: 1rem;\n} #scenario-test-root .h-40 {\n  height: 10rem;\n} #scenario-test-root .h-5 {\n  height: 1.25rem;\n} #scenario-test-root .max-h-48 {\n  max-height: 12rem;\n} #scenario-test-root .max-h-\\[85vh\\] {\n  max-height: 85vh;\n} #scenario-test-root .w-1 {\n  width: 0.25rem;\n} #scenario-test-root .w-1\\.5 {\n  width: 0.375rem;\n} #scenario-test-root .w-1\\/3 {\n  width: 33.333333%;\n} #scenario-test-root .w-16 {\n  width: 4rem;\n} #scenario-test-root .w-3 {\n  width: 0.75rem;\n} #scenario-test-root .w-3\\.5 {\n  width: 0.875rem;\n} #scenario-test-root .w-4 {\n  width: 1rem;\n} #scenario-test-root .w-40 {\n  width: 10rem;\n} #scenario-test-root .w-5 {\n  width: 1.25rem;\n} #scenario-test-root .w-\\[70\\%\\] {\n  width: 70%;\n} #scenario-test-root .w-full {\n  width: 100%;\n} #scenario-test-root .min-w-0 {\n  min-width: 0px;\n} #scenario-test-root .max-w-3xl {\n  max-width: 48rem;\n} #scenario-test-root .max-w-\\[280px\\] {\n  max-width: 280px;\n} #scenario-test-root .max-w-\\[50\\%\\] {\n  max-width: 50%;\n} #scenario-test-root .max-w-\\[55\\%\\] {\n  max-width: 55%;\n} #scenario-test-root .max-w-full {\n  max-width: 100%;\n} #scenario-test-root .flex-1 {\n  flex: 1 1 0%;\n} #scenario-test-root .flex-shrink-0 {\n  flex-shrink: 0;\n} #scenario-test-root .rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n} #scenario-test-root .scale-90 {\n  --tw-scale-x: .9;\n  --tw-scale-y: .9;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n} #scenario-test-root .cursor-pointer {\n  cursor: pointer;\n} #scenario-test-root .select-none {\n  user-select: none;\n} #scenario-test-root .select-text {\n  user-select: text;\n} #scenario-test-root .grid-cols-1 {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n} #scenario-test-root .flex-col {\n  flex-direction: column;\n} #scenario-test-root .flex-wrap {\n  flex-wrap: wrap;\n} #scenario-test-root .items-start {\n  align-items: flex-start;\n} #scenario-test-root .items-center {\n  align-items: center;\n} #scenario-test-root .justify-end {\n  justify-content: flex-end;\n} #scenario-test-root .justify-center {\n  justify-content: center;\n} #scenario-test-root .justify-between {\n  justify-content: space-between;\n} #scenario-test-root .gap-1 {\n  gap: 0.25rem;\n} #scenario-test-root .gap-1\\.5 {\n  gap: 0.375rem;\n} #scenario-test-root .gap-2 {\n  gap: 0.5rem;\n} #scenario-test-root .gap-3 {\n  gap: 0.75rem;\n} #scenario-test-root .gap-4 {\n  gap: 1rem;\n} #scenario-test-root .gap-6 {\n  gap: 1.5rem;\n} #scenario-test-root :is(.space-x-1\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.375rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.375rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-2 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-2\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.625rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.625rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-y-0\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-1 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-1\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-2 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-2\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.625rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-4 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.divide-y > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-y-reverse: 0;\n  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));\n  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));\n} #scenario-test-root :is(.divide-slate-100 > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(241 245 249 / var(--tw-divide-opacity, 1));\n} #scenario-test-root :is(.divide-slate-200 > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-divide-opacity, 1));\n} #scenario-test-root .overflow-hidden {\n  overflow: hidden;\n} #scenario-test-root .overflow-x-auto {\n  overflow-x: auto;\n} #scenario-test-root .overflow-y-auto {\n  overflow-y: auto;\n} #scenario-test-root .truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n} #scenario-test-root .whitespace-nowrap {\n  white-space: nowrap;\n} #scenario-test-root .break-all {\n  word-break: break-all;\n} #scenario-test-root .rounded {\n  border-radius: 0.25rem;\n} #scenario-test-root .rounded-full {\n  border-radius: 9999px;\n} #scenario-test-root .rounded-lg {\n  border-radius: 0.5rem;\n} #scenario-test-root .rounded-md {\n  border-radius: 0.375rem;\n} #scenario-test-root .rounded-xl {\n  border-radius: 0.75rem;\n} #scenario-test-root .border {\n  border-width: 1px;\n} #scenario-test-root .border-b {\n  border-bottom-width: 1px;\n} #scenario-test-root .border-l {\n  border-left-width: 1px;\n} #scenario-test-root .border-t {\n  border-top-width: 1px;\n} #scenario-test-root .border-emerald-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(167 243 208 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-emerald-500\\/20 {\n  border-color: rgb(16 185 129 / 0.2);\n} #scenario-test-root .border-indigo-100\\/80 {\n  border-color: rgb(224 231 255 / 0.8);\n} #scenario-test-root .border-rose-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(255 228 230 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-rose-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(254 205 211 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-rose-500\\/20 {\n  border-color: rgb(244 63 94 / 0.2);\n} #scenario-test-root .border-slate-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(241 245 249 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-200\\/50 {\n  border-color: rgb(226 232 240 / 0.5);\n} #scenario-test-root .border-slate-200\\/60 {\n  border-color: rgb(226 232 240 / 0.6);\n} #scenario-test-root .border-slate-200\\/80 {\n  border-color: rgb(226 232 240 / 0.8);\n} #scenario-test-root .border-slate-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(203 213 225 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(71 85 105 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(51 65 85 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-700\\/80 {\n  border-color: rgb(51 65 85 / 0.8);\n} #scenario-test-root .border-slate-800 {\n  --tw-border-opacity: 1;\n  border-color: rgb(30 41 59 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-transparent {\n  border-color: transparent;\n} #scenario-test-root .bg-emerald-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(52 211 153 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 253 245 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(16 185 129 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-500\\/10 {\n  background-color: rgb(16 185 129 / 0.1);\n} #scenario-test-root .bg-emerald-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 150 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-indigo-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(238 242 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 113 133 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 241 242 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-50\\/20 {\n  background-color: rgb(255 241 242 / 0.2);\n} #scenario-test-root .bg-rose-50\\/70 {\n  background-color: rgb(255 241 242 / 0.7);\n} #scenario-test-root .bg-rose-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(244 63 94 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-500\\/10 {\n  background-color: rgb(244 63 94 / 0.1);\n} #scenario-test-root .bg-slate-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-100\\/70 {\n  background-color: rgb(241 245 249 / 0.7);\n} #scenario-test-root .bg-slate-100\\/80 {\n  background-color: rgb(241 245 249 / 0.8);\n} #scenario-test-root .bg-slate-200\\/50 {\n  background-color: rgb(226 232 240 / 0.5);\n} #scenario-test-root .bg-slate-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(203 213 225 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(148 163 184 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-50\\/20 {\n  background-color: rgb(248 250 252 / 0.2);\n} #scenario-test-root .bg-slate-50\\/40 {\n  background-color: rgb(248 250 252 / 0.4);\n} #scenario-test-root .bg-slate-50\\/50 {\n  background-color: rgb(248 250 252 / 0.5);\n} #scenario-test-root .bg-slate-50\\/70 {\n  background-color: rgb(248 250 252 / 0.7);\n} #scenario-test-root .bg-slate-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 41 59 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(15 23 42 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-950 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(2 6 23 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-950\\/30 {\n  background-color: rgb(2 6 23 / 0.3);\n} #scenario-test-root .bg-slate-950\\/40 {\n  background-color: rgb(2 6 23 / 0.4);\n} #scenario-test-root .bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .p-0\\.5 {\n  padding: 0.125rem;\n} #scenario-test-root .p-1\\.5 {\n  padding: 0.375rem;\n} #scenario-test-root .p-2 {\n  padding: 0.5rem;\n} #scenario-test-root .p-2\\.5 {\n  padding: 0.625rem;\n} #scenario-test-root .p-3 {\n  padding: 0.75rem;\n} #scenario-test-root .p-4 {\n  padding: 1rem;\n} #scenario-test-root .p-5 {\n  padding: 1.25rem;\n} #scenario-test-root .p-8 {\n  padding: 2rem;\n} #scenario-test-root .px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n} #scenario-test-root .px-1\\.5 {\n  padding-left: 0.375rem;\n  padding-right: 0.375rem;\n} #scenario-test-root .px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n} #scenario-test-root .px-2\\.5 {\n  padding-left: 0.625rem;\n  padding-right: 0.625rem;\n} #scenario-test-root .px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n} #scenario-test-root .px-3\\.5 {\n  padding-left: 0.875rem;\n  padding-right: 0.875rem;\n} #scenario-test-root .px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n} #scenario-test-root .px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n} #scenario-test-root .py-0\\.5 {\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem;\n} #scenario-test-root .py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n} #scenario-test-root .py-1\\.5 {\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n} #scenario-test-root .py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n} #scenario-test-root .py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n} #scenario-test-root .py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n} #scenario-test-root .py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n} #scenario-test-root .pb-3 {\n  padding-bottom: 0.75rem;\n} #scenario-test-root .pl-2 {\n  padding-left: 0.5rem;\n} #scenario-test-root .pl-4 {\n  padding-left: 1rem;\n} #scenario-test-root .pl-8 {\n  padding-left: 2rem;\n} #scenario-test-root .pr-2\\.5 {\n  padding-right: 0.625rem;\n} #scenario-test-root .pr-3 {\n  padding-right: 0.75rem;\n} #scenario-test-root .pt-4 {\n  padding-top: 1rem;\n} #scenario-test-root .text-left {\n  text-align: left;\n} #scenario-test-root .text-center {\n  text-align: center;\n} #scenario-test-root .text-right {\n  text-align: right;\n} #scenario-test-root .font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n} #scenario-test-root .text-\\[10\\.5px\\] {\n  font-size: 10.5px;\n} #scenario-test-root .text-\\[10px\\] {\n  font-size: 10px;\n} #scenario-test-root .text-\\[11px\\] {\n  font-size: 11px;\n} #scenario-test-root .text-\\[12px\\] {\n  font-size: 12px;\n} #scenario-test-root .text-\\[13px\\] {\n  font-size: 13px;\n} #scenario-test-root .text-\\[9px\\] {\n  font-size: 9px;\n} #scenario-test-root .text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n} #scenario-test-root .text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n} #scenario-test-root .text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n} #scenario-test-root .font-bold {\n  font-weight: 700;\n} #scenario-test-root .font-extrabold {\n  font-weight: 800;\n} #scenario-test-root .font-medium {\n  font-weight: 500;\n} #scenario-test-root .font-normal {\n  font-weight: 400;\n} #scenario-test-root .font-semibold {\n  font-weight: 600;\n} #scenario-test-root .uppercase {\n  text-transform: uppercase;\n} #scenario-test-root .normal-case {\n  text-transform: none;\n} #scenario-test-root .tabular-nums {\n  --tw-numeric-spacing: tabular-nums;\n  font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction);\n} #scenario-test-root .leading-none {\n  line-height: 1;\n} #scenario-test-root .leading-relaxed {\n  line-height: 1.625;\n} #scenario-test-root .leading-snug {\n  line-height: 1.375;\n} #scenario-test-root .leading-tight {\n  line-height: 1.25;\n} #scenario-test-root .tracking-normal {\n  letter-spacing: 0em;\n} #scenario-test-root .tracking-tight {\n  letter-spacing: -0.025em;\n} #scenario-test-root .tracking-wider {\n  letter-spacing: 0.05em;\n} #scenario-test-root .text-amber-400 {\n  --tw-text-opacity: 1;\n  color: rgb(251 191 36 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-amber-600 {\n  --tw-text-opacity: 1;\n  color: rgb(217 119 6 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-400 {\n  --tw-text-opacity: 1;\n  color: rgb(52 211 153 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-500 {\n  --tw-text-opacity: 1;\n  color: rgb(16 185 129 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-600 {\n  --tw-text-opacity: 1;\n  color: rgb(5 150 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-600\\/70 {\n  color: rgb(5 150 105 / 0.7);\n} #scenario-test-root .text-emerald-700 {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-800 {\n  --tw-text-opacity: 1;\n  color: rgb(6 95 70 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-indigo-500 {\n  --tw-text-opacity: 1;\n  color: rgb(99 102 241 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-indigo-600 {\n  --tw-text-opacity: 1;\n  color: rgb(79 70 229 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-indigo-700 {\n  --tw-text-opacity: 1;\n  color: rgb(67 56 202 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-400 {\n  --tw-text-opacity: 1;\n  color: rgb(251 113 133 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-500 {\n  --tw-text-opacity: 1;\n  color: rgb(244 63 94 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-500\\/70 {\n  color: rgb(244 63 94 / 0.7);\n} #scenario-test-root .text-rose-600 {\n  --tw-text-opacity: 1;\n  color: rgb(225 29 72 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-700 {\n  --tw-text-opacity: 1;\n  color: rgb(190 18 60 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-800 {\n  --tw-text-opacity: 1;\n  color: rgb(159 18 57 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-200 {\n  --tw-text-opacity: 1;\n  color: rgb(226 232 240 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-300 {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-400 {\n  --tw-text-opacity: 1;\n  color: rgb(148 163 184 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-500 {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-600 {\n  --tw-text-opacity: 1;\n  color: rgb(71 85 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-700 {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 41 59 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-900 {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-yellow-600 {\n  --tw-text-opacity: 1;\n  color: rgb(202 138 4 / var(--tw-text-opacity, 1));\n} #scenario-test-root .placeholder-slate-400::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(148 163 184 / var(--tw-placeholder-opacity, 1));\n} #scenario-test-root .placeholder-slate-500::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-placeholder-opacity, 1));\n} #scenario-test-root .opacity-50 {\n  opacity: 0.5;\n} #scenario-test-root .shadow-2xl {\n  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);\n  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .shadow-inner {\n  --tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n} #scenario-test-root .ring-2 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n} #scenario-test-root .ring-emerald-500\\/20 {\n  --tw-ring-color: rgb(16 185 129 / 0.2);\n} #scenario-test-root .filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n} #scenario-test-root .transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .transition-transform {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .duration-150 {\n  transition-duration: 150ms;\n} #scenario-test-root .duration-200 {\n  transition-duration: 200ms;\n} #scenario-test-root .placeholder\\:text-slate-300::placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:border-slate-200\\/60:hover {\n  border-color: rgb(226 232 240 / 0.6);\n} #scenario-test-root .hover\\:border-slate-300:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(203 213 225 / var(--tw-border-opacity, 1));\n} #scenario-test-root .hover\\:bg-emerald-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 150 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-emerald-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 120 87 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-indigo-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 231 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-rose-50\\/40:hover {\n  background-color: rgb(255 241 242 / 0.4);\n} #scenario-test-root .hover\\:bg-slate-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-50\\/60:hover {\n  background-color: rgb(248 250 252 / 0.6);\n} #scenario-test-root .hover\\:bg-slate-50\\/70:hover {\n  background-color: rgb(248 250 252 / 0.7);\n} #scenario-test-root .hover\\:bg-slate-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(71 85 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-800:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 41 59 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-white\\/60:hover {\n  background-color: rgb(255 255 255 / 0.6);\n} #scenario-test-root .hover\\:text-emerald-400:hover {\n  --tw-text-opacity: 1;\n  color: rgb(52 211 153 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-emerald-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-rose-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(225 29 72 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-slate-200:hover {\n  --tw-text-opacity: 1;\n  color: rgb(226 232 240 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-slate-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-slate-900:hover {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n} #scenario-test-root .focus\\:border-emerald-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(16 185 129 / var(--tw-border-opacity, 1));\n} #scenario-test-root .focus\\:border-slate-800:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(30 41 59 / var(--tw-border-opacity, 1));\n} #scenario-test-root .focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n} #scenario-test-root .focus\\:ring-1:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n} #scenario-test-root .focus\\:ring-emerald-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(16 185 129 / var(--tw-ring-opacity, 1));\n} #scenario-test-root .focus\\:ring-slate-800:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(30 41 59 / var(--tw-ring-opacity, 1));\n} #scenario-test-root .active\\:scale-\\[0\\.96\\]:active {\n  --tw-scale-x: 0.96;\n  --tw-scale-y: 0.96;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n} #scenario-test-root .active\\:scale-\\[0\\.98\\]:active {\n  --tw-scale-x: 0.98;\n  --tw-scale-y: 0.98;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-500) {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-600) {\n  --tw-text-opacity: 1;\n  color: rgb(71 85 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-900) {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-950) {\n  --tw-text-opacity: 1;\n  color: rgb(2 6 23 / var(--tw-text-opacity, 1));\n} @media (min-width: 640px) {\n\n  #scenario-test-root .sm\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  #scenario-test-root .sm\\:flex {\n    display: flex;\n  }\n\n  #scenario-test-root .sm\\:hidden {\n    display: none;\n  }\n\n  #scenario-test-root .sm\\:max-w-xl {\n    max-width: 36rem;\n  }\n\n  #scenario-test-root .sm\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  #scenario-test-root .sm\\:grid-cols-\\[120px_1fr\\] {\n    grid-template-columns: 120px 1fr;\n  }\n} @media (min-width: 768px) {\n\n  #scenario-test-root .md\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  #scenario-test-root .md\\:w-auto {\n    width: auto;\n  }\n\n  #scenario-test-root .md\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  #scenario-test-root .md\\:gap-0 {\n    gap: 0px;\n  }\n\n  #scenario-test-root :is(.md\\:divide-x > :not([hidden]) ~ :not([hidden])) {\n    --tw-divide-x-reverse: 0;\n    border-right-width: calc(1px * var(--tw-divide-x-reverse));\n    border-left-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));\n  }\n\n  #scenario-test-root .md\\:pl-5 {\n    padding-left: 1.25rem;\n  }\n\n  #scenario-test-root .md\\:pr-5 {\n    padding-right: 1.25rem;\n  }\n} @media (min-width: 1024px) {\n\n  #scenario-test-root .lg\\:w-\\[80\\%\\] {\n    width: 80%;\n  }\n} @media (min-width: 1280px) {\n\n  #scenario-test-root .xl\\:max-h-\\[calc\\(100vh-52px\\)\\] {\n    max-height: calc(100vh - 52px);\n  }\n\n  #scenario-test-root .xl\\:grid-cols-\\[minmax\\(164px\\2c 1fr\\)_minmax\\(500px\\2c 3\\.18fr\\)_minmax\\(280px\\2c 1\\.75fr\\)\\] {\n    grid-template-columns: minmax(164px,1fr) minmax(500px,3.18fr) minmax(280px,1.75fr);\n  }\n}';

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
  const runtime = createWorkbenchRuntime({ mount, config: toRuntimeConfig(config), getScenario });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ASSERTION_META_KEYS,
  ASSERTION_OPERATORS,
  CONTRACT_VERSION,
  GLOBAL_TYPES,
  RESERVED_VARS,
  VERSION,
  applyExtract,
  assertNoReservedVars,
  assertNotReservedVar,
  buildAssertions,
  buildCapabilities,
  buildUrl,
  clearAdapters,
  clearScenarios,
  clone,
  contract,
  createApp,
  createEngine,
  createNodeIo,
  createRuntime,
  defineConfig,
  defineScenario,
  evalExpression,
  evaluateAssertion,
  executeDefinitionFile,
  formatAssertionContext,
  formatDuration,
  generateSignature,
  getAdapter,
  getByPath,
  getConfig,
  getScenario,
  hasHeader,
  headerValue,
  headersToObject,
  isGlobalParam,
  isPlainObject,
  joinUrl,
  listAdapters,
  loadConfigFile,
  loadScenarioFile,
  maskSecret,
  md5,
  mergeGlobals,
  normalizeGlobalParam,
  parseBody,
  registerAdapter,
  registerConfig,
  registerScenario,
  renderCapabilitiesText,
  resolve,
  resolveString,
  runScenario,
  sanitizeSensitive,
  unregisterAdapter,
  validateAdapter,
  validateAdapterResponse,
  validateAssertion
});
//# sourceMappingURL=scenario-test.cjs.map
