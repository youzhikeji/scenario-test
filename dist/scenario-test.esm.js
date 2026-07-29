/*! scenario-test v0.2.10 */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
  "node_modules/blueimp-md5/js/md5.js"(exports, module) {
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
      } else if (typeof module === "object" && module.exports) {
        module.exports = md52;
      } else {
        $.md5 = md52;
      }
    })(exports);
  }
});

// src/core.js
var import_blueimp_md5 = __toESM(require_md5(), 1);
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
  const whole = value.match(/^\s*\{\{\s*(.+?)\s*\}\}\s*$/);
  if (whole) {
    const direct = evalExpression(whole[1], runtime);
    return direct === void 0 ? "" : direct;
  }
  return value.replace(/\{\{\s*(.+?)\s*\}\}/g, (_, expression) => {
    const resolved = evalExpression(expression, runtime);
    if (resolved === void 0 || resolved === null) return "";
    return typeof resolved === "object" ? JSON.stringify(resolved) : String(resolved);
  });
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
function assertionActual(definition, response, runtime) {
  if (definition.target === "status") return response.status;
  if (definition.header) return headerValue(response.headers, definition.header);
  if (definition.from === "vars") return definition.path ? getByPath(runtime.vars, definition.path) : runtime.vars;
  if (definition.from === "headers") return definition.path ? getByPath(response.headers, definition.path) : response.headers;
  if (definition.from === "bodyText") return response.bodyText;
  return definition.path ? getByPath(response.body, definition.path) : response.body;
}
function evaluateAssertion(definition, response, runtime) {
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
  if (Object.prototype.hasOwnProperty.call(definition, "includes")) {
    expected = resolve(definition.includes, runtime);
    passed = passed && (Array.isArray(actual) ? actual.some((item) => JSON.stringify(item) === JSON.stringify(expected)) : String(actual == null ? "" : actual).includes(String(expected)));
  }
  if (definition.matches !== void 0) {
    expected = resolve(definition.matches, runtime);
    try {
      passed = passed && new RegExp(String(expected)).test(String(actual == null ? "" : actual));
    } catch {
      passed = false;
    }
  }
  if (definition.oneOf !== void 0) {
    expected = resolve(definition.oneOf, runtime);
    passed = passed && Array.isArray(expected) && expected.some((item) => JSON.stringify(item) === JSON.stringify(actual));
  }
  return {
    name: definition.name || definition.path || "\u65AD\u8A00",
    passed,
    actual,
    expected
  };
}
function buildAssertions(step, response, runtime) {
  const definitions = Array.isArray(step.assertions) ? [...step.assertions] : [];
  if (step.status !== void 0 && !definitions.some((item) => item.target === "status")) {
    definitions.unshift({ name: `\u8FD4\u56DE HTTP ${step.status}`, target: "status", equals: step.status });
  }
  return definitions.map((definition) => evaluateAssertion(definition, response, runtime));
}
function applyExtract(step, response, runtime) {
  for (const definition of step.extract || []) {
    if (!definition || !definition.name) continue;
    let source = response.body;
    if (definition.from === "headers") source = response.headers;
    else if (definition.from === "bodyText") source = response.bodyText;
    else if (definition.from === "response") source = response;
    runtime.vars[definition.name] = definition.path ? getByPath(source, definition.path) : source;
  }
  return runtime.vars;
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

// src/registry.js
var scenarioRegistry = /* @__PURE__ */ new Map();
var adapterRegistry = /* @__PURE__ */ new Map();
var currentConfig = null;
function invariant(condition, message) {
  if (!condition) throw new TypeError(message);
}
function defineScenario(input) {
  invariant(isPlainObject(input), "\u573A\u666F\u5FC5\u987B\u662F\u5BF9\u8C61");
  invariant(typeof input.name === "string" && input.name.trim(), "\u573A\u666F\u7F3A\u5C11 name");
  invariant(Array.isArray(input.steps), `\u573A\u666F ${input.name} \u7F3A\u5C11 steps \u6570\u7EC4`);
  const failurePolicy = input.failurePolicy || "stop";
  invariant(["stop", "continue"].includes(failurePolicy), "failurePolicy \u53EA\u80FD\u662F stop \u6216 continue");
  return { ...input, failurePolicy, steps: [...input.steps] };
}
function defineConfig(input) {
  invariant(isPlainObject(input), "\u914D\u7F6E\u5FC5\u987B\u662F\u5BF9\u8C61");
  const envs = Array.isArray(input.envs) ? input.envs.map((env) => ({ ...env })) : [];
  for (const env of envs) {
    invariant(env.key && env.name, "\u6BCF\u4E2A\u73AF\u5883\u5FC5\u987B\u5305\u542B key \u548C name");
  }
  const scenarios = (Array.isArray(input.scenarios) ? input.scenarios : []).map((entry, index) => {
    if (typeof entry === "string") return { id: entry, name: entry, url: entry };
    invariant(isPlainObject(entry), `\u7B2C ${index + 1} \u4E2A\u573A\u666F\u6E05\u5355\u9879\u65E0\u6548`);
    const url = entry.url || entry.file || entry.path || "";
    const id = entry.id || url || `scenario-${index + 1}`;
    return { ...entry, id, name: entry.name || id, url };
  });
  const variables = Array.isArray(input.variables) ? input.variables.map((item) => ({ ...item })) : [];
  return {
    ...input,
    envs,
    scenarios,
    variables,
    defaultEnvKey: input.defaultEnvKey || envs[0]?.key || "",
    requestTimeoutMs: Number(input.requestTimeoutMs || 3e4),
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
  invariant(adapter && typeof adapter.execute === "function", `\u9002\u914D\u5668 ${name} \u7F3A\u5C11 execute`);
  adapterRegistry.set(name, adapter);
  return adapter;
}
function getAdapter(name) {
  return adapterRegistry.get(name);
}
function listAdapters() {
  return new Map(adapterRegistry);
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
function buildGeneratedVars(scenario, baseVars, environmentVariables) {
  const runId = String(Date.now());
  const vars = { ...scenario.vars || {}, ...baseVars || {}, runId, runNo: runId.slice(-6) };
  for (const [name, environmentName] of Object.entries(scenario.envVars || {})) {
    const value = environmentVariables?.[environmentName] ?? vars[name];
    if (value === void 0 || value === null || value === "") {
      throw new Error(`\u7F3A\u5C11\u573A\u666F\u53D8\u91CF ${environmentName}\uFF08\u6620\u5C04\u5230 vars.${name}\uFF09`);
    }
    vars[name] = value;
  }
  for (const definition of scenario.generatedVars || []) {
    if (!definition?.name) continue;
    if (definition.type === "timestamp") vars[definition.name] = Date.now();
    else if (definition.type === "uuidHex") {
      if (!globalThis.crypto?.randomUUID) throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301 crypto.randomUUID");
      vars[definition.name] = globalThis.crypto.randomUUID().replace(/-/g, "");
    } else if (definition.type === "md5") {
      const source = (definition.parts || []).map((name) => vars[name] == null ? "" : String(vars[name])).join("");
      vars[definition.name] = md5(source);
    } else if (definition.type === "signature") {
      const params = Object.fromEntries(Object.entries(definition.params || {}).map(([key, variableName]) => [key, vars[variableName]]));
      vars[definition.name] = generateSignature(params, vars[definition.secretVar || "apiSecret"]);
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
  const contentType = String(headers["content-type"] || "");
  if (step.saveResponseAs && io?.saveResponse) {
    const data = new Uint8Array(await response.arrayBuffer());
    const saved = await io.saveResponse(resolveString(step.saveResponseAs, runtime), data, { contentType, headers });
    return { status: response.status, headers, body: saved, bodyText: null };
  }
  const bodyText = await response.text();
  return { status: response.status, headers, body: parseBody(bodyText, contentType), bodyText };
}
async function executeHttp(step, runtime, options) {
  const request = resolve(clone(step.request || {}), runtime) || {};
  const method = String(step.method || request.method || "GET").toUpperCase();
  const requestPath = buildUrl(step.path || request.path || "", step.params || request.params, runtime);
  const headers = { ...request.headers || {} };
  const absoluteUrl = /^https?:\/\//i.test(requestPath);
  if (options.authorization && (!absoluteUrl || request.useEnvironmentAuthorization === true) && !hasHeader(headers, "Authorization")) {
    headers.Authorization = options.authorization;
  }
  const fetchOptions = { method, headers };
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
async function executeAdapter(adapter, step, runtime, options) {
  if (!adapter) throw new Error(`\u672A\u6CE8\u518C\u6B65\u9AA4\u9002\u914D\u5668: ${step.adapter || "unknown"}`);
  const output = await adapter.execute({ step: resolve(clone(step), runtime), runtime, options });
  const response = output?.response || output;
  if (!response || response.status === void 0) throw new Error("\u9002\u914D\u5668\u5FC5\u987B\u8FD4\u56DE response \u6216\u54CD\u5E94\u5BF9\u8C61");
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
  const adapters = new Map([...listAdapters(), ...Object.entries(engineOptions.adapters || {})]);
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
      const shouldRun = typeof step.when === "object" ? evaluateAssertion(step.when, { status: 0, headers: {}, body: null, bodyText: "" }, runtime).passed : Boolean(resolve(step.when, runtime));
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
          assertions: [],
          request: null,
          response: null
        };
      }
    }
    let lastExecution;
    let assertions = [];
    const retry = step.retryUntil || null;
    const totalAttempts = retry ? Number(retry.maxAttempts || 10) + 1 : 1;
    try {
      for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
        if (options.signal?.aborted) throw options.signal.reason || new Error("\u6267\u884C\u5DF2\u53D6\u6D88");
        const adapter = chooseAdapter(step, adapters);
        lastExecution = adapter ? await executeAdapter(adapter, step, runtime, options) : await executeHttp(step, runtime, options);
        runtime.lastResponse = lastExecution.response;
        runtime.lastResponseBody = lastExecution.response.body;
        applyExtract(step, lastExecution.response, runtime);
        assertions = buildAssertions(step, lastExecution.response, runtime);
        if (assertions.every((item) => item.passed) || attempt === totalAttempts) break;
        await delay(Number(retry.intervalMs || 2e3), options.signal);
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
      vars: runOptions.vars,
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
    const failed = results.filter((item) => !item.passed).length;
    return {
      scenarioName: scenario.name,
      passed: failed === 0 && results.length === scenario.steps.length,
      planned: scenario.steps.length,
      executed: results.length,
      failed,
      results,
      vars: runtime.vars
    };
  }
  return { runStep, runScenario: runScenario2, createRuntime };
}
async function runScenario(scenario, options = {}) {
  return createEngine(options).runScenario(scenario, options);
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
    var whole = value.match(/^\s*\{\{\s*(.+?)\s*\}\}\s*$/);
    if (whole) {
      var direct = evalExpr(whole[1], runtime);
      return direct === void 0 ? "" : direct;
    }
    return value.replace(/\{\{\s*(.+?)\s*\}\}/g, function(_, innerExpr) {
      var resolved = evalExpr(innerExpr, runtime);
      if (resolved === void 0 || resolved === null) return "";
      return typeof resolved === "object" ? JSON.stringify(resolved) : String(resolved);
    });
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
  function buildUrl2(path, params, runtime) {
    var rawPath = resolveString2(path || "", runtime);
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
  function parseBody2(text, contentType) {
    if (!text) return null;
    var bodyText = String(text);
    var type = String(contentType || "").toLowerCase();
    if (type.indexOf("json") >= 0 || /^[\[{]/.test(bodyText.trim())) {
      try {
        return JSON.parse(bodyText);
      } catch (e) {
        return bodyText;
      }
    }
    return bodyText;
  }
  function assertionActual2(def, response, runtime) {
    if (def.target === "status") return response.status;
    if (def.header) return headerValue2(response.headers, def.header);
    if (def.from === "vars") return def.path ? getByPath2(runtime.vars, def.path) : runtime.vars;
    if (def.from === "headers") return def.path ? getByPath2(response.headers, def.path) : response.headers;
    if (def.from === "bodyText") return response.bodyText;
    return def.path ? getByPath2(response.body, def.path) : response.body;
  }
  function evaluateAssertion2(def, response, runtime) {
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
    if (def.includes !== void 0) {
      expected = resolve2(def.includes, runtime);
      passed = passed && String(actual == null ? "" : actual).indexOf(String(expected)) >= 0;
    }
    if (def.matches !== void 0) {
      expected = resolve2(def.matches, runtime);
      passed = passed && new RegExp(expected).test(String(actual == null ? "" : actual));
    }
    if (Array.isArray(def.oneOf)) {
      expected = resolve2(clone2(def.oneOf), runtime);
      passed = passed && expected.some(function(item) {
        return deepEqual(actual, item);
      });
    }
    return {
      name: def.name || "\u65AD\u8A00",
      passed: !!passed,
      actual,
      expected
    };
  }
  function buildAssertions2(step, response, runtime) {
    var defs = Array.isArray(step.assertions) ? step.assertions.slice() : [];
    if (step.status !== void 0 && !defs.some(function(item) {
      return item && item.target === "status";
    })) {
      defs.unshift({ name: "\u8FD4\u56DE HTTP " + step.status, target: "status", equals: step.status });
    }
    return defs.map(function(def) {
      return evaluateAssertion2(def, response, runtime);
    });
  }
  function applyExtract2(step, response, runtime) {
    (step.extract || []).forEach(function(item) {
      if (!item || !item.name) return;
      if (item.target === "status") {
        runtime.vars[item.name] = response.status;
        return;
      }
      if (item.header) {
        runtime.vars[item.name] = headerValue2(response.headers, item.header);
        return;
      }
      runtime.vars[item.name] = item.path ? getByPath2(response.body, item.path) : response.body;
    });
  }
  function md52(str) {
    var s = unescape(encodeURIComponent(String(str)));
    function add32(a2, b2) {
      return a2 + b2 & 4294967295;
    }
    function cmn(q, a2, b2, x, s2, t) {
      return add32(rol(add32(add32(a2, q), add32(x, t)), s2), b2);
    }
    function ff(a2, b2, c2, d2, x, s2, t) {
      return cmn(b2 & c2 | ~b2 & d2, a2, b2, x, s2, t);
    }
    function gg(a2, b2, c2, d2, x, s2, t) {
      return cmn(d2 & b2 | ~d2 & c2, a2, b2, x, s2, t);
    }
    function hh(a2, b2, c2, d2, x, s2, t) {
      return cmn(b2 ^ c2 ^ d2, a2, b2, x, s2, t);
    }
    function ii(a2, b2, c2, d2, x, s2, t) {
      return cmn(c2 ^ (b2 | ~d2), a2, b2, x, s2, t);
    }
    function rol(num, cnt) {
      return num << cnt | num >>> 32 - cnt;
    }
    var n = s.length;
    var wordCount = ((n + 8 >> 6) + 1) * 16;
    var words = new Array(wordCount).fill(0);
    for (var i = 0; i < n; i++) {
      words[i >> 2] |= (s.charCodeAt(i) & 255) << i % 4 * 8;
    }
    words[i >> 2] |= 128 << i % 4 * 8;
    words[wordCount - 2] = n * 8;
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
    function toHex(num) {
      var hex = "";
      for (var k = 0; k < 4; k++) {
        hex += ("0" + (num >>> k * 8 & 255).toString(16)).slice(-2);
      }
      return hex;
    }
    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
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
    evaluateAssertion: evaluateAssertion2,
    buildAssertions: buildAssertions2,
    applyExtract: applyExtract2,
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

            #configPanel { background: #1e293b !important; border-color: #334155 !important; border-radius: 5px !important; }
            #configPanel input, #configPanel select { border-radius: 3px !important; }
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
                <button id="configToggleBtn" onclick="document.getElementById('configPanel').classList.toggle('hidden')" class="scenario-header-button scenario-header-button--config">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>\u914D\u7F6E\u53C2\u6570</span>
                </button>
                <span id="runState" aria-live="polite" class="sr-only">\u5F85\u6267\u884C</span>
            </div>
        </header>
        <main class="scenario-workspace max-w-full mx-auto px-2 py-2">
            <div id="configPanel" class="hidden bg-slate-800 rounded-lg shadow-md border border-slate-700 p-4 mb-4 text-slate-200">
                <div class="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
                    <div class="text-sm font-bold text-white flex items-center space-x-2">
                        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <span>\u73AF\u5883\u53C2\u6570\u914D\u7F6E</span>
                    </div>
                    <button onclick="document.getElementById('configPanel').classList.add('hidden')" class="text-slate-400 hover:text-white transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="flex flex-col gap-1.5">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">\u6D4B\u8BD5\u73AF\u5883</span>
                        <select id="environmentInput" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"></select>
                    </label>
                    <label class="flex flex-col gap-1.5">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Base URL</span>
                        <input id="baseUrlInput" type="text" placeholder="\u7559\u7A7A\u9ED8\u8BA4\u4F7F\u7528\u5F53\u524D\u9875\u9762\u670D\u52A1\u5730\u5740" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                    </label>
                    <label class="flex flex-col gap-1.5">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Authorization Token</span>
                        <input id="authorizationInput" type="text" placeholder="\u7559\u7A7A\u5219\u8BF7\u6C42\u4E0D\u5E26 Authorization" class="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
                    </label>
                </div>
                <div class="mt-4 border-t border-slate-700 pt-3">
                    <div class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">\u573A\u666F\u53D8\u91CF</div>
                    <div id="scenarioVarsInput" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                </div>
                <div class="mt-4 flex flex-wrap items-center justify-between border-t border-slate-700 pt-3">
                    <div class="text-[11px] text-slate-400 flex items-center gap-2"><span>\u5F53\u524D\u751F\u6548 Base URL:</span> <span id="baseUrlLabel" class="font-mono text-emerald-400"></span><span id="authLabel" class="font-mono text-amber-400 border-l border-slate-600 pl-2" style="display:none">Token: <span id="authValue"></span></span></div>
                    <div class="flex flex-wrap items-center justify-end gap-2 mt-2 sm:mt-0">
                        <span id="settingsNotice" role="status" aria-live="polite" class="hidden text-xs font-medium text-emerald-400"></span>
                        <button id="saveSettingsBtn" class="px-4 py-1.5 rounded-md bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm">\u4FDD\u5B58\u5E76\u751F\u6548</button>
                        <button id="clearSettingsBtn" class="px-4 py-1.5 rounded-md bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-600 transition-colors">\u6E05\u9664\u5F53\u524D\u73AF\u5883\u8986\u76D6</button>
                    </div>
                </div>
            </div>
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
                            <span class="text-xs font-bold text-slate-600">Query \u53C2\u6570 (Params)</span>
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
    var passed = steps.filter(function(s) {
      return s.passed;
    }).length;
    var failed = total - passed;
    var passRate = total ? (passed / total * 100).toFixed(2) : 0;
    var failRate = total ? (failed / total * 100).toFixed(2) : 0;
    var totalMs = steps.reduce(function(a, s) {
      return a + (s.duration || 0);
    }, 0);
    var avgMs = total ? totalMs / total : 0;
    var assertTotal = steps.reduce(function(a, s) {
      return a + (s.assertions ? s.assertions.length : 0);
    }, 0);
    var assertFailed = steps.reduce(function(a, s) {
      return a + (s.assertions ? s.assertions.filter(function(x) {
        return !x.passed;
      }).length : 0);
    }, 0);
    var iter = iterations || { run: 1, failed: 0 };
    var chart = '<div class="flex items-center space-x-6 w-full md:w-auto"><div class="circle-chart scale-90" style="background:conic-gradient(#10b981 0% ' + passRate + "%, #f43f5e " + passRate + '% 100%)"><div class="circle-inner"><span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">\u5DF2\u5B8C\u6210</span><span class="text-xl font-bold text-slate-800 mt-0.5">' + total + '</span></div></div><div class="flex space-x-3"><div class="flex items-center space-x-2 px-2 py-1 rounded bg-emerald-50 border border-emerald-100/50"><span class="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></span><span class="text-xs font-bold text-emerald-700">' + passed + ' <span class="text-emerald-600/70 font-medium text-[10px] ml-0.5">(' + passRate + '%)</span></span></div><div class="flex items-center space-x-2 px-2 py-1 rounded bg-rose-50 border border-rose-100/50"><span class="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></span><span class="text-xs font-bold text-rose-600">' + failed + ' <span class="text-rose-500/70 font-medium text-[10px] ml-0.5">(' + failRate + "%)</span></span></div></div></div>";
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
    var passed = steps.filter(function(s) {
      return s.passed;
    }).length;
    var failed = total - passed;
    filterBar.innerHTML = `
            <div class="flex items-center space-x-1 bg-slate-200/60 p-1 rounded-md">
                <button data-f="all" onclick="window.__R.filter('all')" class="filter-btn px-3 py-1 text-xs font-bold text-blue-700 bg-white border border-blue-200 rounded shadow-sm">\u5168\u90E8 (${total})</button>
                <button data-f="pass" onclick="window.__R.filter('pass')" class="filter-btn px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded">\u6210\u529F (${passed})</button>
                <button data-f="fail" onclick="window.__R.filter('fail')" class="filter-btn px-3 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded">\u5931\u8D25 (${failed})</button>
            </div>
            <div class="flex items-center space-x-2">
                <input type="search" placeholder="\u641C\u7D22\u6B65\u9AA4/URL..." oninput="window.__R.search(this.value)" class="px-2.5 py-1 rounded border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-500 w-44">
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
      return '<li class="hover:bg-slate-50/60 group transition-all duration-150 border-b border-slate-100/80" data-passed="pending" data-search="' + esc(((step.name || "") + " " + method + " " + stepPath).toLowerCase()) + '"><div class="px-4 py-3 flex items-center justify-between cursor-pointer select-none" onclick="window.__R.toggle(this, event)"><div class="flex items-center space-x-3 min-w-0 flex-1 pr-4"><div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[11px] font-bold bg-slate-200 text-slate-600 shadow-inner">' + seqNum + '</div><span class="text-sm text-slate-800 font-semibold truncate group-hover:text-slate-950" title="' + esc(step.name || "") + '">' + esc(step.name || "\u672A\u547D\u540D\u6B65\u9AA4") + '</span><div class="hidden sm:flex items-center space-x-1.5 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/60 flex-shrink-0 max-w-[55%]"><span class="text-[10px] font-extrabold ' + methodColor + ' uppercase tracking-wider">' + method + '</span><span class="text-slate-300">|</span><span class="text-[11px] text-slate-600 font-mono truncate" title="' + esc(stepPath) + '">' + esc(stepPath) + '</span></div></div><div class="flex items-center space-x-2.5 flex-shrink-0">' + tags + '<button type="button" data-adhoc-step="' + (seqNum - 1) + '" class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm">\u8C03\u8BD5</button><span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">\u5F85\u6267\u884C</span><svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div><div class="details-panel px-5 bg-slate-50/70 border-t border-slate-200/60 text-[13px]"><div class="py-4 space-y-3">' + (reqBody ? '<div><div class="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1.5"><span class="flex items-center"><div class="w-1.5 h-1.5 bg-slate-400 mr-2 rounded-full"></div>REQUEST BODY</span><span class="text-slate-400 font-mono font-normal">JSON</span></div><pre class="bg-[#1e293b] p-3.5 rounded-xl text-slate-200 overflow-x-auto font-mono text-[12px] leading-relaxed shadow-sm border border-slate-700/50">' + reqBody + "</pre></div>" : '<div class="text-xs text-slate-400 py-1">\u65E0\u8BF7\u6C42\u4F53\u53C2\u6570</div>') + "</div></div></li>";
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
      var seqNum = i + 1;
      var seqCls = ok ? "bg-emerald-500 text-white" : "bg-rose-500 text-white";
      var nameCls = ok ? "text-slate-700 group-hover:text-emerald-700" : "text-rose-800";
      var statusCls = ok ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-100 border-rose-200 shadow-sm";
      var timeCls = ok ? "text-slate-400" : "text-rose-400";
      var bgCls = ok ? "hover:bg-slate-50/50" : "bg-rose-50/20";
      var methodColor = { GET: "text-emerald-600", POST: "text-orange-500", PUT: "text-amber-600", DELETE: "text-rose-600", PATCH: "text-purple-600" }[s.method] || "text-slate-600";
      var reqHeaders = s.request && s.request.headers ? esc(typeof s.request.headers === "string" ? s.request.headers : JSON.stringify(s.request.headers, null, 2)) : "";
      var reqBody = s.request && s.request.body ? esc(typeof s.request.body === "string" ? s.request.body : JSON.stringify(s.request.body, null, 2)) : "";
      var resHeaders = s.response && s.response.headers ? esc(typeof s.response.headers === "string" ? s.response.headers : JSON.stringify(s.response.headers, null, 2)) : "";
      var resBody = s.response && s.response.body ? esc(typeof s.response.body === "string" ? s.response.body : JSON.stringify(s.response.body, null, 2)) : "";
      var errorHtml = "";
      if (!ok && s.error) {
        errorHtml = '<div class="my-2 p-2 bg-rose-50 rounded border border-rose-200 flex items-center space-x-2"><svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-rose-800 font-bold text-[12px]">Assertion Failed:</span><span class="text-rose-600 text-[12px] font-mono break-all">' + esc(s.error) + "</span></div>";
      }
      var assertHtml = "";
      if (s.assertions && s.assertions.length) {
        assertHtml = '<div class="py-3 border-t border-slate-200 mt-2"><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-2">Assertions</div><div class="flex flex-wrap gap-2">' + s.assertions.map(function(a) {
          var ac = a.passed ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100";
          var ap = a.passed ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12";
          return '<div class="flex items-center px-2 py-1 ' + ac + ' rounded border text-[12px] font-medium" title="Expected: ' + esc(stringify(a.expected)) + " \nActual: " + esc(stringify(a.actual)) + '"><svg class="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="' + ap + '"></path></svg>' + esc(a.name) + "</div>";
        }).join("") + "</div></div>";
      }
      var bodyColor = ok ? "text-emerald-400" : "text-rose-400";
      var detailPanelCls = ok ? "details-panel px-4 bg-slate-50/30 border-t border-slate-100 text-[13px]" : "details-panel px-4 bg-white border-t border-rose-100 text-[13px] shadow-inner";
      var stepActions = executionMode === "step" ? '<span class="step-run-actions"><button type="button" data-step-action="rewind" data-step-index="' + i + '" title="\u4EC5\u56DE\u9000\u6D4B\u8BD5\u8FD0\u884C\u65F6\u4E0E\u62A5\u544A\uFF0C\u4E0D\u64A4\u9500\u5DF2\u53D1\u51FA\u7684\u4E1A\u52A1\u8BF7\u6C42">\u56DE\u9000</button><button type="button" data-step-action="rerun" data-step-index="' + i + '" title="\u4ECE\u672C\u6B65\u9AA4\u6267\u884C\u524D\u7684\u53D8\u91CF\u5FEB\u7167\u91CD\u65B0\u6267\u884C">\u91CD\u8DD1</button></span>' : "";
      return '<li class="' + bgCls + ' group transition-colors" data-passed="' + ok + '" data-search="' + esc((s.name + " " + s.method + " " + s.path).toLowerCase()) + '"><div class="px-4 py-2.5 flex items-center justify-between cursor-pointer" onclick="window.__R.toggle(this, event)"><div class="flex items-center space-x-3 w-[70%] lg:w-[80%]"><div class="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[11px] font-bold shadow-sm ' + seqCls + '">' + seqNum + '</div><span class="select-text text-sm ' + nameCls + ' font-semibold truncate transition-colors" title="' + esc(s.name) + '">' + esc(s.name) + '</span><div class="hidden sm:flex items-center space-x-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 flex-shrink-0 max-w-[50%]"><span class="text-[10px] font-bold ' + methodColor + ' uppercase tracking-wider">' + s.method + '</span><span class="text-slate-300">|</span><span class="select-text text-[12px] text-slate-500 font-mono truncate" title="' + esc(s.path) + '">' + esc(s.path) + '</span></div></div><div class="flex items-center space-x-4 flex-shrink-0"><button type="button" data-adhoc-step="' + i + '" class="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700">\u8C03\u8BD5</button>' + stepActions + '<span class="text-[12px] font-bold font-mono ' + statusCls + ' px-1.5 py-0.5 rounded border">' + s.status + '</span><span class="' + timeCls + ' text-[12px] font-mono w-16 text-right">' + fmt(s.duration) + '</span><svg class="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform duration-200 chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div><div class="' + detailPanelCls + '"><div class="sm:hidden mb-3 pb-3 border-b border-slate-200"><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">API Endpoint</div><div class="flex items-center space-x-2"><span class="text-xs font-bold ' + methodColor + '">' + s.method + '</span><span class="text-xs font-mono break-all">' + esc(s.path) + "</span></div></div>" + errorHtml + '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 md:divide-x divide-slate-200 py-3"><div class="md:pr-6 space-y-3">' + (reqHeaders ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>Request Headers</div><pre class="bg-slate-800 p-2.5 rounded text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner">' + reqHeaders + "</pre></div>" : "") + (reqBody ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-emerald-400 mr-2 rounded-full"></div>Request Body</div><pre class="bg-slate-800 p-2.5 rounded ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner">' + reqBody + "</pre></div>" : "") + '</div><div class="md:pl-6 space-y-3">' + (resHeaders ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 bg-slate-300 mr-2 rounded-full"></div>Response Headers</div><pre class="bg-slate-800 p-2.5 rounded text-slate-300 overflow-x-auto font-mono leading-tight shadow-inner">' + resHeaders + "</pre></div>" : "") + (resBody ? '<div><div class="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center"><div class="w-1 h-3 ' + (ok ? "bg-emerald-400" : "bg-rose-400") + ' mr-2 rounded-full"></div>Response Body</div><pre class="bg-slate-800 p-2.5 rounded ' + bodyColor + ' overflow-x-auto font-mono leading-tight shadow-inner">' + resBody + "</pre></div>" : "") + "</div></div>" + assertHtml + "</div></li>";
    }).join("") + renderPendingSteps(scenarioSteps, steps.length);
  }
  function buildOverallReport(steps, scenario, scenarioFile, executionMode, environment) {
    steps = steps || [];
    var total = steps.length;
    var passed = steps.filter(function(item) {
      return item.passed;
    }).length;
    var failed = total - passed;
    var duration = steps.reduce(function(sum, item) {
      return sum + (item.duration || 0);
    }, 0);
    return {
      title: scenario && scenario.name || scenarioFile || "\u6D4B\u8BD5\u62A5\u544A",
      scenarioFile: scenarioFile || "",
      executionMode: executionMode || "full",
      environment: environment ? environment.name || environment.key : "\u9ED8\u8BA4",
      summary: {
        totalSteps: scenario && scenario.steps && scenario.steps.length || total,
        executedSteps: total,
        passedSteps: passed,
        failedSteps: failed,
        passRate: total ? (passed / total * 100).toFixed(2) + "%" : "0.00%",
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
          durationMs: item.duration,
          durationFmt: fmt(item.duration),
          error: item.error || "",
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
    lines.push("- **\u7ED3\u679C**: " + (summary.failedSteps ? "\u274C \u5B58\u5728\u5931\u8D25" : "\u2705 \u5168\u90E8\u901A\u8FC7") + " (" + summary.passedSteps + "/" + summary.executedSteps + ")");
    lines.push("- **\u901A\u8FC7\u7387**: " + summary.passRate);
    lines.push("- **\u603B\u8017\u65F6**: " + summary.totalDurationFmt);
    lines.push("");
    lines.push("## \u6B65\u9AA4\u660E\u7EC6");
    lines.push("");
    (report.steps || []).forEach(function(step) {
      var icon = step.passed ? "\u2705" : "\u274C";
      lines.push("### " + icon + " \u6B65\u9AA4 " + step.stepNo + ": " + step.name);
      lines.push("- **\u8BF7\u6C42**: `" + step.method + " " + step.path + "`");
      lines.push("- **\u72B6\u6001**: " + step.status + " | **\u8017\u65F6**: " + step.durationFmt);
      if (step.error) lines.push("- **\u5931\u8D25\u539F\u56E0**: " + step.error);
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
    var completed = pending <= 0;
    var statusClass = hasFailure ? "report-status--failed" : completed ? "report-status--passed" : "report-status--running";
    var statusText = hasFailure ? "\u5B58\u5728\u5931\u8D25" : completed ? "\u5168\u90E8\u901A\u8FC7" : "\u6267\u884C\u4E2D";
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
    var diagnosisHtml = hasFailure ? '<div class="report-steps"><div class="report-steps__title">\u5931\u8D25\u6B65\u9AA4</div>' + stepHtml + "</div>" : '<div class="report-healthy"><div class="report-healthy__title">' + (completed ? "\u6240\u6709\u6B65\u9AA4\u5747\u5DF2\u901A\u8FC7" : "\u5F53\u524D\u5DF2\u6267\u884C\u6B65\u9AA4\u5747\u901A\u8FC7") + '</div><div class="report-healthy__hint">\u8BE6\u7EC6\u8BF7\u6C42\u4E0E\u54CD\u5E94\u8BF7\u5728\u5DE6\u4FA7\u6B65\u9AA4\u5217\u8868\u67E5\u770B\uFF1B\u5B8C\u6574\u62A5\u544A\u53EF\u901A\u8FC7\u9876\u90E8\u6309\u94AE\u590D\u5236\u3002</div></div>';
    node.innerHTML = '<div class="report-content"><div class="report-overview"><div class="report-overview__top"><div><div class="report-overview__eyebrow">\u5F53\u524D\u6267\u884C\u6982\u89C8</div><div class="report-overview__title">' + esc(report.title || "\u6D4B\u8BD5\u62A5\u544A") + '</div></div><span class="report-status ' + statusClass + '">' + statusText + '</span></div><div class="report-overview__meta"><span>' + esc(report.environment || "\u9ED8\u8BA4\u73AF\u5883") + "</span><span>" + modeText + "</span><span>\u5DF2\u6267\u884C " + progressText + '</span></div></div><div class="report-metrics"><div class="report-metric"><span class="report-metric__label">\u901A\u8FC7</span><strong class="report-metric__value report-metric__value--passed">' + summary.passedSteps + '</strong></div><div class="report-metric"><span class="report-metric__label">\u5931\u8D25</span><strong class="report-metric__value ' + (hasFailure ? "report-metric__value--failed" : "") + '">' + summary.failedSteps + '</strong></div><div class="report-metric"><span class="report-metric__label">\u603B\u8017\u65F6</span><strong class="report-metric__value report-metric__duration">' + esc(summary.totalDurationFmt) + '</strong></div></div><div class="report-progress"><div class="report-progress__labels"><span>\u6267\u884C\u8FDB\u5EA6</span><strong>' + progressText + " \xB7 " + esc(summary.passRate) + '</strong></div><div class="report-progress__track' + (hasFailure ? " report-progress__track--failed" : "") + '"><span style="width:' + (summary.totalSteps ? summary.executedSteps / summary.totalSteps * 100 : 0) + '%"></span></div></div>' + diagnosisHtml + "</div>";
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
    var path = String(values.path || "").trim();
    if (!path) throw new Error("\u8BF7\u6C42\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A");
    var params = values.params;
    var headers = parseJsonEditor(values.headers, "\u8BF7\u6C42\u5934");
    var bodyText = String(values.body || "").trim();
    var body = bodyText ? parseJsonEditor(bodyText, "\u8BF7\u6C42\u4F53") : void 0;
    if (params && !isPlainObject2(params)) throw new Error("Query \u53C2\u6570\u5FC5\u987B\u662F Key-Value \u5BF9\u8C61");
    if (!isPlainObject2(headers)) throw new Error("\u8BF7\u6C42\u5934\u5FC5\u987B\u662F JSON \u5BF9\u8C61");
    if (hasAdhocTemplate(path) || hasAdhocTemplate(params) || hasAdhocTemplate(headers) || hasAdhocTemplate(body)) {
      throw new Error("\u4ECD\u6709\u672A\u89E3\u6790\u7684 {{vars.xxx}} \u53C2\u6570\uFF0C\u8BF7\u586B\u5199\u5B9E\u9645\u503C\u540E\u518D\u6267\u884C");
    }
    return {
      name: values.name || "\u4E34\u65F6\u8BF7\u6C42",
      method: String(values.method || "GET").toUpperCase(),
      path,
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
    node.innerHTML = '<div class="flex items-center justify-between"><div class="text-sm font-bold ' + statusClass + '">' + (result.passed ? "\u8BF7\u6C42\u5B8C\u6210" : "\u8BF7\u6C42\u5931\u8D25") + '</div><div class="text-xs text-slate-500">\u72B6\u6001\uFF1A' + esc(result.status) + " \uFF5C \u8017\u65F6\uFF1A" + esc(fmt(result.duration)) + "</div></div>" + (result.error ? '<div class="mt-3 rounded border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">' + esc(result.error) + "</div>" : "") + '<div class="mt-3 grid gap-3 md:grid-cols-2"><div><div class="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Response Headers</div><pre class="overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-tight text-slate-300">' + esc(safeJson(sanitizeSensitive2(response.headers, ""))) + '</pre></div><div><div class="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Response Body</div><pre class="overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-tight text-slate-300">' + esc(safeJson(sanitizeSensitive2(response.body, ""))) + "</pre></div></div>";
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
  async function executeAdhocRequest(executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn) {
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
  function bindAdhocRequestEvents(getStepByIdxFn, getRuntimeByIdxFn, executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn) {
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
      executeAdhocRequest(executeStepFn, getEnvFn, getBaseUrlFn, getAuthFn);
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
  var md52 = core.md5;
  var esc = core.esc;
  var fmt = core.fmt;
  var safeJson = core.safeJson;
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
        b.className = "filter-btn px-3 py-1 text-xs " + (active ? activeCls : "font-medium text-slate-600 hover:bg-white rounded");
      });
      document.querySelectorAll("#stepsList li").forEach(function(li) {
        var status = li.dataset.passed;
        li.style.display = type === "all" || type === "pass" && status === "true" || type === "fail" && status === "false" ? "" : "none";
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
    var runSeed = String(Date.now());
    var vars = Object.assign({}, cfg.vars || {}, scenario.vars || {}, scenarioVars, {
      runId: runSeed,
      runNo: runSeed.slice(-6)
    });
    (scenario.generatedVars || []).forEach(function(def) {
      if (!def || !def.name) return;
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
  async function clearSmsRateLimit(runtime, phone, hospitalCode) {
    var baseUrl = runtime.baseUrl;
    var query = "phone=" + encodeURIComponent(phone);
    if (hospitalCode) {
      query += "&hospitalCode=" + encodeURIComponent(hospitalCode);
    }
    var url = joinUrl2(baseUrl, "mobile/auth/clearSmsRateLimit?" + query);
    try {
      await withRuntimeTimeout(function() {
        return fetch(url, { method: "POST", signal: runtime.abortController.signal });
      }, runtime, 5e3);
    } catch (e) {
      if (runtime.abortController.signal.aborted) throw e;
    }
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
    var request = resolve2(clone2(step.request || {}), runtime) || {};
    var method = String(step.method || request.method || "GET").toUpperCase();
    var rawPath = step.path || request.path || "";
    var rawParams = step.params || request.params;
    var path = buildUrl2(rawPath, rawParams, runtime);
    var headers = request.headers && isPlainObject2(request.headers) ? request.headers : {};
    var absoluteUrl = /^https?:\/\//i.test(path);
    var authorization = runtime.authorization;
    var allowEnvironmentAuthorization = !absoluteUrl || request.useEnvironmentAuthorization === true;
    if (authorization && allowEnvironmentAuthorization && !hasHeader2(headers, "Authorization")) {
      headers.Authorization = authorization;
    }
    var bodyData = request.body;
    var fetchOptions = { method, headers, signal: runtime.abortController.signal };
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
        var response2 = await fetch(joinUrl2(runtime.baseUrl, path), fetchOptions);
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
    var MAX_RETRIES = 2;
    for (var attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        var responseData = await sendRequest();
        var headerObj = responseData.headers;
        var body = responseData.body;
        if (step.autoClearSmsRateLimit !== false && body && body.code === 40004 && path.indexOf("sendSmsCode") >= 0 && attempt < MAX_RETRIES) {
          var phone = bodyData && bodyData.phone;
          var hospitalCode = bodyData && bodyData.hospitalCode;
          if (phone) {
            console.log("[\u81EA\u52A8\u6E05\u9664\u9650\u6D41] phone=" + phone + (hospitalCode ? ", hospitalCode=" + hospitalCode : "") + " (attempt " + (attempt + 1) + ")");
            await clearSmsRateLimit(runtime, phone, hospitalCode);
            await new Promise(function(r) {
              setTimeout(r, 500);
            });
            continue;
          }
        }
        runtime.lastResponse = responseData;
        runtime.lastResponseBody = body;
        applyExtract2(step, responseData, runtime);
        var assertions = buildAssertions2(step, responseData, runtime);
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
            applyExtract2(step, responseData, runtime);
            assertions = buildAssertions2(step, responseData, runtime);
            failedAssertion = assertions.find(function(item) {
              return !item.passed;
            });
            if (!failedAssertion) {
              return {
                name: step.name,
                method,
                path,
                status: responseData.status,
                duration: performance.now() - startedAt,
                attempts: requestAttempts,
                passed: true,
                error: "",
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
          path,
          status: responseData.status,
          duration: performance.now() - startedAt,
          attempts: requestAttempts,
          passed: !failedAssertion,
          error: failedAssertion ? failedAssertion.name : "",
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
          path,
          status: cancelled ? "CANCELLED" : timedOut ? "TIMEOUT" : "ERROR",
          duration: performance.now() - startedAt,
          attempts: requestAttempts || attempt + 1,
          passed: false,
          cancelled,
          timedOut,
          error: errorMessage,
          request: { headers, body: bodyData },
          response: { headers: {}, body: null },
          assertions: [{ name: cancelled ? "\u6267\u884C\u672A\u53D6\u6D88" : timedOut ? "\u8BF7\u6C42\u672A\u8D85\u65F6" : "\u8BF7\u6C42\u6267\u884C\u6210\u529F", passed: false, actual: errorMessage, expected: "\u65E0\u5F02\u5E38" }]
        };
      }
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
    document.querySelectorAll("#configPanel input, #configPanel select, #configPanel button").forEach(function(element) {
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
    var failed = state.steps.filter(function(item) {
      return !item.passed;
    }).length;
    uiView.setRunState(failed ? "failed" : "success", failed ? "\u5B58\u5728\u5931\u8D25" : "\u6267\u884C\u6210\u529F");
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
  function syncSettingsInputs() {
    var keys = getStorageKeys();
    var environment = getSelectedEnvironment();
    renderEnvironmentSelects();
    renderScenarioVariableInputs();
    var baseUrlInput = document.getElementById("baseUrlInput");
    var authorizationInput = document.getElementById("authorizationInput");
    try {
      if (baseUrlInput) baseUrlInput.value = window.localStorage.getItem(getEnvironmentStorageKey(keys.baseUrl, environment)) || "";
      if (authorizationInput) authorizationInput.value = window.localStorage.getItem(getEnvironmentStorageKey(keys.authorization, environment)) || "";
    } catch (e) {
      if (baseUrlInput) baseUrlInput.value = "";
      if (authorizationInput) authorizationInput.value = "";
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
    var effectiveAuth = getEffectiveAuthorization();
    if (baseLabel) baseLabel.textContent = effectiveBaseUrl || "(\u672A\u914D\u7F6E)";
    if (authLabel && authValue) {
      if (effectiveAuth) {
        authLabel.style.display = "inline";
        authValue.textContent = effectiveAuth;
      } else {
        authLabel.style.display = "none";
        authValue.textContent = "";
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
        var authorizationInput = document.getElementById("authorizationInput");
        var baseUrl = String(baseUrlInput.value || "").trim().replace(/\/+$/, "");
        var authorization = String(authorizationInput.value || "").trim();
        persistSetting(getEnvironmentStorageKey(keys.baseUrl, environment), baseUrl);
        persistSetting(getEnvironmentStorageKey(keys.authorization, environment), authorization);
        persistScenarioVariables();
        updateHeader();
        showSettingsNotice("\u5F53\u524D\u73AF\u5883\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\u5E76\u751F\u6548");
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function() {
        var environment = getSelectedEnvironment();
        persistSetting(getEnvironmentStorageKey(keys.baseUrl, environment), "");
        persistSetting(getEnvironmentStorageKey(keys.authorization, environment), "");
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
        var path = String(item.file || "").replace(/^\.\//, "");
        if (!path) return { i, displayName: null };
        var url = "./" + path + (path.indexOf("?") >= 0 ? "&" : "?") + "ts=" + Date.now();
        try {
          var response = await fetch(url);
          if (!response.ok) throw new Error("fetch " + path);
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
    bindReportActions();
    uiAdhoc.bindAdhocRequestEvents(
      function(idx) {
        return state.scenario && Array.isArray(state.scenario.steps) ? state.scenario.steps[idx] : null;
      },
      getDebugRuntime,
      executeStep,
      getSelectedEnvironment,
      getEffectiveBaseUrl,
      getEffectiveAuthorization
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
var TAILWIND_CSS = '*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}/*\n! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n5. Use the user\'s configured `sans` font-feature-settings by default.\n6. Use the user\'s configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font-family by default.\n2. Use the user\'s configured `mono` font-feature-settings by default.\n3. Use the user\'s configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type=\'button\']),\ninput:where([type=\'reset\']),\ninput:where([type=\'submit\']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden]:where(:not([hidden="until-found"])) {\n  display: none;\n} .\\!container {\n  width: 100% !important;\n} .container {\n  width: 100%;\n} @media (min-width: 640px) {\n\n  .\\!container {\n    max-width: 640px !important;\n  }\n\n  .container {\n    max-width: 640px;\n  }\n} @media (min-width: 768px) {\n\n  .\\!container {\n    max-width: 768px !important;\n  }\n\n  .container {\n    max-width: 768px;\n  }\n} @media (min-width: 1024px) {\n\n  .\\!container {\n    max-width: 1024px !important;\n  }\n\n  .container {\n    max-width: 1024px;\n  }\n} @media (min-width: 1280px) {\n\n  .\\!container {\n    max-width: 1280px !important;\n  }\n\n  .container {\n    max-width: 1280px;\n  }\n} @media (min-width: 1536px) {\n\n  .\\!container {\n    max-width: 1536px !important;\n  }\n\n  .container {\n    max-width: 1536px;\n  }\n} #scenario-test-root .sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n} #scenario-test-root .visible {\n  visibility: visible;\n} #scenario-test-root .fixed {\n  position: fixed;\n} #scenario-test-root .relative {\n  position: relative;\n} #scenario-test-root .sticky {\n  position: sticky;\n} #scenario-test-root .inset-0 {\n  inset: 0px;\n} #scenario-test-root .top-0 {\n  top: 0px;\n} #scenario-test-root .z-10 {\n  z-index: 10;\n} #scenario-test-root .z-30 {\n  z-index: 30;\n} #scenario-test-root .col-span-2 {\n  grid-column: span 2 / span 2;\n} #scenario-test-root .mx-1 {\n  margin-left: 0.25rem;\n  margin-right: 0.25rem;\n} #scenario-test-root .mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n} #scenario-test-root .my-2 {\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem;\n} #scenario-test-root .my-8 {\n  margin-top: 2rem;\n  margin-bottom: 2rem;\n} #scenario-test-root .mb-1 {\n  margin-bottom: 0.25rem;\n} #scenario-test-root .mb-1\\.5 {\n  margin-bottom: 0.375rem;\n} #scenario-test-root .mb-2 {\n  margin-bottom: 0.5rem;\n} #scenario-test-root .mb-3 {\n  margin-bottom: 0.75rem;\n} #scenario-test-root .mb-4 {\n  margin-bottom: 1rem;\n} #scenario-test-root .ml-0\\.5 {\n  margin-left: 0.125rem;\n} #scenario-test-root .ml-1 {\n  margin-left: 0.25rem;\n} #scenario-test-root .mr-1 {\n  margin-right: 0.25rem;\n} #scenario-test-root .mr-1\\.5 {\n  margin-right: 0.375rem;\n} #scenario-test-root .mr-2 {\n  margin-right: 0.5rem;\n} #scenario-test-root .mt-0\\.5 {\n  margin-top: 0.125rem;\n} #scenario-test-root .mt-1 {\n  margin-top: 0.25rem;\n} #scenario-test-root .mt-2 {\n  margin-top: 0.5rem;\n} #scenario-test-root .mt-3 {\n  margin-top: 0.75rem;\n} #scenario-test-root .mt-4 {\n  margin-top: 1rem;\n} #scenario-test-root .block {\n  display: block;\n} #scenario-test-root .inline {\n  display: inline;\n} #scenario-test-root .flex {\n  display: flex;\n} #scenario-test-root .grid {\n  display: grid;\n} #scenario-test-root .hidden {\n  display: none;\n} #scenario-test-root .h-1\\.5 {\n  height: 0.375rem;\n} #scenario-test-root .h-2 {\n  height: 0.5rem;\n} #scenario-test-root .h-28 {\n  height: 7rem;\n} #scenario-test-root .h-3 {\n  height: 0.75rem;\n} #scenario-test-root .h-3\\.5 {\n  height: 0.875rem;\n} #scenario-test-root .h-4 {\n  height: 1rem;\n} #scenario-test-root .h-40 {\n  height: 10rem;\n} #scenario-test-root .h-5 {\n  height: 1.25rem;\n} #scenario-test-root .max-h-48 {\n  max-height: 12rem;\n} #scenario-test-root .w-1 {\n  width: 0.25rem;\n} #scenario-test-root .w-1\\.5 {\n  width: 0.375rem;\n} #scenario-test-root .w-1\\/3 {\n  width: 33.333333%;\n} #scenario-test-root .w-16 {\n  width: 4rem;\n} #scenario-test-root .w-2 {\n  width: 0.5rem;\n} #scenario-test-root .w-3 {\n  width: 0.75rem;\n} #scenario-test-root .w-3\\.5 {\n  width: 0.875rem;\n} #scenario-test-root .w-4 {\n  width: 1rem;\n} #scenario-test-root .w-44 {\n  width: 11rem;\n} #scenario-test-root .w-5 {\n  width: 1.25rem;\n} #scenario-test-root .w-\\[70\\%\\] {\n  width: 70%;\n} #scenario-test-root .w-full {\n  width: 100%;\n} #scenario-test-root .min-w-0 {\n  min-width: 0px;\n} #scenario-test-root .max-w-3xl {\n  max-width: 48rem;\n} #scenario-test-root .max-w-\\[280px\\] {\n  max-width: 280px;\n} #scenario-test-root .max-w-\\[50\\%\\] {\n  max-width: 50%;\n} #scenario-test-root .max-w-\\[55\\%\\] {\n  max-width: 55%;\n} #scenario-test-root .max-w-full {\n  max-width: 100%;\n} #scenario-test-root .flex-1 {\n  flex: 1 1 0%;\n} #scenario-test-root .flex-shrink-0 {\n  flex-shrink: 0;\n} #scenario-test-root .rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n} #scenario-test-root .scale-90 {\n  --tw-scale-x: .9;\n  --tw-scale-y: .9;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n} #scenario-test-root .cursor-pointer {\n  cursor: pointer;\n} #scenario-test-root .select-none {\n  user-select: none;\n} #scenario-test-root .select-text {\n  user-select: text;\n} #scenario-test-root .appearance-none {\n  appearance: none;\n} #scenario-test-root .grid-cols-1 {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n} #scenario-test-root .flex-col {\n  flex-direction: column;\n} #scenario-test-root .flex-wrap {\n  flex-wrap: wrap;\n} #scenario-test-root .items-start {\n  align-items: flex-start;\n} #scenario-test-root .items-center {\n  align-items: center;\n} #scenario-test-root .justify-end {\n  justify-content: flex-end;\n} #scenario-test-root .justify-center {\n  justify-content: center;\n} #scenario-test-root .justify-between {\n  justify-content: space-between;\n} #scenario-test-root .gap-1 {\n  gap: 0.25rem;\n} #scenario-test-root .gap-1\\.5 {\n  gap: 0.375rem;\n} #scenario-test-root .gap-2 {\n  gap: 0.5rem;\n} #scenario-test-root .gap-3 {\n  gap: 0.75rem;\n} #scenario-test-root .gap-4 {\n  gap: 1rem;\n} #scenario-test-root :is(.space-x-1 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-1\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.375rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.375rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-2 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-2\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.625rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.625rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-3 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-4 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1rem * var(--tw-space-x-reverse));\n  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-6 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-x-8 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(2rem * var(--tw-space-x-reverse));\n  margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));\n} #scenario-test-root :is(.space-y-0\\.5 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-1 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-2 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-3 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.space-y-4 > :not([hidden]) ~ :not([hidden])) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n} #scenario-test-root :is(.divide-y > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-y-reverse: 0;\n  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));\n  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));\n} #scenario-test-root :is(.divide-slate-100 > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(241 245 249 / var(--tw-divide-opacity, 1));\n} #scenario-test-root :is(.divide-slate-200 > :not([hidden]) ~ :not([hidden])) {\n  --tw-divide-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-divide-opacity, 1));\n} #scenario-test-root .overflow-hidden {\n  overflow: hidden;\n} #scenario-test-root .overflow-x-auto {\n  overflow-x: auto;\n} #scenario-test-root .overflow-y-auto {\n  overflow-y: auto;\n} #scenario-test-root .truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n} #scenario-test-root .whitespace-nowrap {\n  white-space: nowrap;\n} #scenario-test-root .break-all {\n  word-break: break-all;\n} #scenario-test-root .rounded {\n  border-radius: 0.25rem;\n} #scenario-test-root .rounded-full {\n  border-radius: 9999px;\n} #scenario-test-root .rounded-lg {\n  border-radius: 0.5rem;\n} #scenario-test-root .rounded-md {\n  border-radius: 0.375rem;\n} #scenario-test-root .rounded-xl {\n  border-radius: 0.75rem;\n} #scenario-test-root .border {\n  border-width: 1px;\n} #scenario-test-root .border-b {\n  border-bottom-width: 1px;\n} #scenario-test-root .border-l {\n  border-left-width: 1px;\n} #scenario-test-root .border-t {\n  border-top-width: 1px;\n} #scenario-test-root .border-blue-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(191 219 254 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-emerald-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 250 229 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-emerald-100\\/50 {\n  border-color: rgb(209 250 229 / 0.5);\n} #scenario-test-root .border-emerald-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(167 243 208 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-indigo-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(224 231 255 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-rose-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(255 228 230 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-rose-100\\/50 {\n  border-color: rgb(255 228 230 / 0.5);\n} #scenario-test-root .border-rose-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(254 205 211 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(241 245 249 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-100\\/80 {\n  border-color: rgb(241 245 249 / 0.8);\n} #scenario-test-root .border-slate-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-200\\/50 {\n  border-color: rgb(226 232 240 / 0.5);\n} #scenario-test-root .border-slate-200\\/60 {\n  border-color: rgb(226 232 240 / 0.6);\n} #scenario-test-root .border-slate-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(203 213 225 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(71 85 105 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(51 65 85 / var(--tw-border-opacity, 1));\n} #scenario-test-root .border-slate-700\\/50 {\n  border-color: rgb(51 65 85 / 0.5);\n} #scenario-test-root .border-transparent {\n  border-color: transparent;\n} #scenario-test-root .border-zinc-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(228 228 231 / var(--tw-border-opacity, 1));\n} #scenario-test-root .bg-\\[\\#1e293b\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 41 59 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(52 211 153 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 253 245 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(16 185 129 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-emerald-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 150 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-indigo-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(238 242 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 228 230 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(251 113 133 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 241 242 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-rose-50\\/20 {\n  background-color: rgb(255 241 242 / 0.2);\n} #scenario-test-root .bg-rose-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(244 63 94 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-100\\/70 {\n  background-color: rgb(241 245 249 / 0.7);\n} #scenario-test-root .bg-slate-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(226 232 240 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-200\\/60 {\n  background-color: rgb(226 232 240 / 0.6);\n} #scenario-test-root .bg-slate-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(203 213 225 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(148 163 184 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-50\\/30 {\n  background-color: rgb(248 250 252 / 0.3);\n} #scenario-test-root .bg-slate-50\\/50 {\n  background-color: rgb(248 250 252 / 0.5);\n} #scenario-test-root .bg-slate-50\\/70 {\n  background-color: rgb(248 250 252 / 0.7);\n} #scenario-test-root .bg-slate-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 41 59 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(15 23 42 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-slate-950\\/40 {\n  background-color: rgb(2 6 23 / 0.4);\n} #scenario-test-root .bg-transparent {\n  background-color: transparent;\n} #scenario-test-root .bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .bg-zinc-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(244 244 245 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .p-1 {\n  padding: 0.25rem;\n} #scenario-test-root .p-2 {\n  padding: 0.5rem;\n} #scenario-test-root .p-2\\.5 {\n  padding: 0.625rem;\n} #scenario-test-root .p-3 {\n  padding: 0.75rem;\n} #scenario-test-root .p-3\\.5 {\n  padding: 0.875rem;\n} #scenario-test-root .p-4 {\n  padding: 1rem;\n} #scenario-test-root .p-5 {\n  padding: 1.25rem;\n} #scenario-test-root .p-8 {\n  padding: 2rem;\n} #scenario-test-root .px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n} #scenario-test-root .px-1\\.5 {\n  padding-left: 0.375rem;\n  padding-right: 0.375rem;\n} #scenario-test-root .px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n} #scenario-test-root .px-2\\.5 {\n  padding-left: 0.625rem;\n  padding-right: 0.625rem;\n} #scenario-test-root .px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n} #scenario-test-root .px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n} #scenario-test-root .px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n} #scenario-test-root .py-0\\.5 {\n  padding-top: 0.125rem;\n  padding-bottom: 0.125rem;\n} #scenario-test-root .py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n} #scenario-test-root .py-1\\.5 {\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n} #scenario-test-root .py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n} #scenario-test-root .py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n} #scenario-test-root .py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n} #scenario-test-root .py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n} #scenario-test-root .pb-2 {\n  padding-bottom: 0.5rem;\n} #scenario-test-root .pb-3 {\n  padding-bottom: 0.75rem;\n} #scenario-test-root .pl-2 {\n  padding-left: 0.5rem;\n} #scenario-test-root .pl-6 {\n  padding-left: 1.5rem;\n} #scenario-test-root .pr-4 {\n  padding-right: 1rem;\n} #scenario-test-root .pr-5 {\n  padding-right: 1.25rem;\n} #scenario-test-root .pt-3 {\n  padding-top: 0.75rem;\n} #scenario-test-root .text-left {\n  text-align: left;\n} #scenario-test-root .text-center {\n  text-align: center;\n} #scenario-test-root .text-right {\n  text-align: right;\n} #scenario-test-root .font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n} #scenario-test-root .text-\\[10px\\] {\n  font-size: 10px;\n} #scenario-test-root .text-\\[11px\\] {\n  font-size: 11px;\n} #scenario-test-root .text-\\[12px\\] {\n  font-size: 12px;\n} #scenario-test-root .text-\\[13px\\] {\n  font-size: 13px;\n} #scenario-test-root .text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n} #scenario-test-root .text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n} #scenario-test-root .text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n} #scenario-test-root .font-bold {\n  font-weight: 700;\n} #scenario-test-root .font-extrabold {\n  font-weight: 800;\n} #scenario-test-root .font-medium {\n  font-weight: 500;\n} #scenario-test-root .font-normal {\n  font-weight: 400;\n} #scenario-test-root .font-semibold {\n  font-weight: 600;\n} #scenario-test-root .uppercase {\n  text-transform: uppercase;\n} #scenario-test-root .leading-relaxed {\n  line-height: 1.625;\n} #scenario-test-root .leading-tight {\n  line-height: 1.25;\n} #scenario-test-root .tracking-tight {\n  letter-spacing: -0.025em;\n} #scenario-test-root .tracking-wider {\n  letter-spacing: 0.05em;\n} #scenario-test-root .text-amber-400 {\n  --tw-text-opacity: 1;\n  color: rgb(251 191 36 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-amber-600 {\n  --tw-text-opacity: 1;\n  color: rgb(217 119 6 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(29 78 216 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-400 {\n  --tw-text-opacity: 1;\n  color: rgb(52 211 153 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-500 {\n  --tw-text-opacity: 1;\n  color: rgb(16 185 129 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-600 {\n  --tw-text-opacity: 1;\n  color: rgb(5 150 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-emerald-600\\/70 {\n  color: rgb(5 150 105 / 0.7);\n} #scenario-test-root .text-emerald-700 {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-indigo-500 {\n  --tw-text-opacity: 1;\n  color: rgb(99 102 241 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-indigo-700 {\n  --tw-text-opacity: 1;\n  color: rgb(67 56 202 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-orange-500 {\n  --tw-text-opacity: 1;\n  color: rgb(249 115 22 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-purple-600 {\n  --tw-text-opacity: 1;\n  color: rgb(147 51 234 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-400 {\n  --tw-text-opacity: 1;\n  color: rgb(251 113 133 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-500 {\n  --tw-text-opacity: 1;\n  color: rgb(244 63 94 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-500\\/70 {\n  color: rgb(244 63 94 / 0.7);\n} #scenario-test-root .text-rose-600 {\n  --tw-text-opacity: 1;\n  color: rgb(225 29 72 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-700 {\n  --tw-text-opacity: 1;\n  color: rgb(190 18 60 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-rose-800 {\n  --tw-text-opacity: 1;\n  color: rgb(159 18 57 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-200 {\n  --tw-text-opacity: 1;\n  color: rgb(226 232 240 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-300 {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-400 {\n  --tw-text-opacity: 1;\n  color: rgb(148 163 184 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-500 {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-600 {\n  --tw-text-opacity: 1;\n  color: rgb(71 85 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-700 {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 41 59 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-slate-900 {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n} #scenario-test-root .text-zinc-700 {\n  --tw-text-opacity: 1;\n  color: rgb(63 63 70 / var(--tw-text-opacity, 1));\n} #scenario-test-root .placeholder-slate-400::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(148 163 184 / var(--tw-placeholder-opacity, 1));\n} #scenario-test-root .placeholder-slate-500::placeholder {\n  --tw-placeholder-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-placeholder-opacity, 1));\n} #scenario-test-root .shadow-inner {\n  --tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} #scenario-test-root .outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n} #scenario-test-root .filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n} #scenario-test-root .transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .transition-transform {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} #scenario-test-root .duration-150 {\n  transition-duration: 150ms;\n} #scenario-test-root .duration-200 {\n  transition-duration: 200ms;\n} #scenario-test-root .placeholder\\:text-slate-300::placeholder {\n  --tw-text-opacity: 1;\n  color: rgb(203 213 225 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:border-emerald-300:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(110 231 183 / var(--tw-border-opacity, 1));\n} #scenario-test-root .hover\\:border-slate-200:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(226 232 240 / var(--tw-border-opacity, 1));\n} #scenario-test-root .hover\\:bg-emerald-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(5 150 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-emerald-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(4 120 87 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-indigo-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 231 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(248 250 252 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-slate-50\\/50:hover {\n  background-color: rgb(248 250 252 / 0.5);\n} #scenario-test-root .hover\\:bg-slate-50\\/60:hover {\n  background-color: rgb(248 250 252 / 0.6);\n} #scenario-test-root .hover\\:bg-slate-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(71 85 105 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:bg-white:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n} #scenario-test-root .hover\\:text-emerald-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-rose-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(225 29 72 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-slate-700:hover {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-slate-900:hover {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity, 1));\n} #scenario-test-root .hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n} #scenario-test-root .focus\\:border-emerald-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(16 185 129 / var(--tw-border-opacity, 1));\n} #scenario-test-root .focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n} #scenario-test-root .focus\\:ring-1:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n} #scenario-test-root .focus\\:ring-emerald-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(16 185 129 / var(--tw-ring-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-emerald-700) {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-500) {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-600) {\n  --tw-text-opacity: 1;\n  color: rgb(71 85 105 / var(--tw-text-opacity, 1));\n} #scenario-test-root :is(.group:hover .group-hover\\:text-slate-950) {\n  --tw-text-opacity: 1;\n  color: rgb(2 6 23 / var(--tw-text-opacity, 1));\n} @media (min-width: 640px) {\n\n  #scenario-test-root .sm\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  #scenario-test-root .sm\\:flex {\n    display: flex;\n  }\n\n  #scenario-test-root .sm\\:hidden {\n    display: none;\n  }\n\n  #scenario-test-root .sm\\:max-w-xl {\n    max-width: 36rem;\n  }\n\n  #scenario-test-root .sm\\:grid-cols-\\[120px_1fr\\] {\n    grid-template-columns: 120px 1fr;\n  }\n} @media (min-width: 768px) {\n\n  #scenario-test-root .md\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  #scenario-test-root .md\\:w-auto {\n    width: auto;\n  }\n\n  #scenario-test-root .md\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  #scenario-test-root .md\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  #scenario-test-root .md\\:gap-0 {\n    gap: 0px;\n  }\n\n  #scenario-test-root :is(.md\\:divide-x > :not([hidden]) ~ :not([hidden])) {\n    --tw-divide-x-reverse: 0;\n    border-right-width: calc(1px * var(--tw-divide-x-reverse));\n    border-left-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));\n  }\n\n  #scenario-test-root .md\\:pl-6 {\n    padding-left: 1.5rem;\n  }\n\n  #scenario-test-root .md\\:pr-6 {\n    padding-right: 1.5rem;\n  }\n} @media (min-width: 1024px) {\n\n  #scenario-test-root .lg\\:w-\\[80\\%\\] {\n    width: 80%;\n  }\n} @media (min-width: 1280px) {\n\n  #scenario-test-root .xl\\:max-h-\\[calc\\(100vh-52px\\)\\] {\n    max-height: calc(100vh - 52px);\n  }\n\n  #scenario-test-root .xl\\:grid-cols-\\[minmax\\(164px\\2c 1fr\\)_minmax\\(500px\\2c 3\\.18fr\\)_minmax\\(280px\\2c 1\\.75fr\\)\\] {\n    grid-template-columns: minmax(164px,1fr) minmax(500px,3.18fr) minmax(280px,1.75fr);\n  }\n}';

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
export {
  applyExtract,
  buildAssertions,
  buildUrl,
  clearScenarios,
  clone,
  createApp,
  createEngine,
  createRuntime,
  defineConfig,
  defineScenario,
  evalExpression,
  evaluateAssertion,
  formatDuration,
  generateSignature,
  getAdapter,
  getByPath,
  getConfig,
  getScenario,
  hasHeader,
  headerValue,
  headersToObject,
  isPlainObject,
  joinUrl,
  listAdapters,
  maskSecret,
  md5,
  parseBody,
  registerAdapter,
  registerConfig,
  registerScenario,
  resolve,
  resolveString,
  runScenario,
  sanitizeSensitive
};
//# sourceMappingURL=scenario-test.esm.js.map
