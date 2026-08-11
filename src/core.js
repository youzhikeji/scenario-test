import md5Impl from "blueimp-md5";
import { contract } from "./contract.js";

export { contract, CONTRACT_VERSION } from "./contract.js";

// 全局参数支持的类型：追加到每个请求的 header / cookie / query（来自 contract）
export const GLOBAL_TYPES = [...contract.globals.types];

export function isGlobalParam(item) {
    return Boolean(item && GLOBAL_TYPES.includes(item.type) && typeof item.name === "string" && item.name.trim());
}

export function normalizeGlobalParam(item) {
    return { type: item.type, name: item.name, value: item.value == null ? "" : String(item.value) };
}

// 合并多组全局参数：按 type:name 去重，后合并的覆盖先合并的
export function mergeGlobals(...lists) {
    const merged = new Map();
    for (const list of lists) {
        for (const item of list || []) {
            if (!isGlobalParam(item)) continue;
            merged.set(`${item.type}:${item.name}`, normalizeGlobalParam(item));
        }
    }
    return [...merged.values()];
}

export function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

export function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

export function getByPath(source, valuePath) {
    if (!valuePath) return source;
    const tokens = String(valuePath).match(/[^.\[\]]+|\[(?:-?\d+|".*?"|'.*?')\]/g) || [];
    let cursor = source;
    for (const token of tokens) {
        if (cursor === undefined || cursor === null) return undefined;
        const key = token.startsWith("[")
            ? token.slice(1, -1).replace(/^['"]|['"]$/g, "")
            : token;
        cursor = cursor[key];
    }
    return cursor;
}

export function evalExpression(expression, runtime) {
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

export function resolveString(value, runtime) {
    if (typeof value !== "string") return value;
    let current = value;
    const seen = new Set();
    for (let depth = 0; depth < 10; depth += 1) {
        if (seen.has(current)) return current;
        seen.add(current);
        const whole = current.match(/^\s*\{\{\s*(.+?)\s*\}\}\s*$/);
        if (whole) {
            const direct = evalExpression(whole[1], runtime);
            if (direct === undefined) return "";
            if (typeof direct !== "string") return direct;
            current = direct;
            continue;
        }
        const replaced = current.replace(/\{\{\s*(.+?)\s*\}\}/g, (_, expression) => {
            const resolved = evalExpression(expression, runtime);
            if (resolved === undefined || resolved === null) return "";
            return typeof resolved === "object" ? JSON.stringify(resolved) : String(resolved);
        });
        if (replaced === current || !/\{\{\s*.+?\s*\}\}/.test(replaced)) return replaced;
        current = replaced;
    }
    return current;
}

export function resolve(value, runtime) {
    if (Array.isArray(value)) return value.map((item) => resolve(item, runtime));
    if (isPlainObject(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item, runtime)]));
    }
    return resolveString(value, runtime);
}

export function headerValue(headers, name) {
    const target = String(name || "").toLowerCase();
    const key = Object.keys(headers || {}).find((item) => item.toLowerCase() === target);
    return key === undefined ? undefined : headers[key];
}

export function hasHeader(headers, name) {
    return headerValue(headers, name) !== undefined;
}

export function headersToObject(headers) {
    const result = {};
    if (headers && typeof headers.forEach === "function") {
        headers.forEach((value, key) => { result[key] = value; });
    }
    return result;
}

export function joinUrl(baseUrl, requestPath) {
    if (/^https?:\/\//i.test(requestPath || "")) return requestPath;
    const base = String(baseUrl || "").replace(/\/+$/, "");
    const tail = String(requestPath || "").replace(/^\/+/, "");
    return base ? `${base}/${tail}` : tail;
}

export function buildUrl(requestPath, params, runtime) {
    const rawPath = resolveString(requestPath || "", runtime);
    if (!params || !isPlainObject(params)) return rawPath;
    const resolved = resolve(params, runtime);
    const query = Object.entries(resolved)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join("&");
    if (!query) return rawPath;
    return `${rawPath}${rawPath.includes("?") ? "&" : "?"}${query}`;
}

export function parseBody(text, contentType) {
    if (!text) return null;
    const value = String(text);
    if (String(contentType || "").toLowerCase().includes("json") || /^[\[{]/.test(value.trim())) {
        try { return JSON.parse(value); } catch { return value; }
    }
    return value;
}

// ===== 断言 schema（唯一操作符名单来自 contract，registry 定义期与执行期共用）=====
export const ASSERTION_OPERATORS = Object.keys(contract.assertions.operators);
export const ASSERTION_META_KEYS = [...contract.assertions.metaKeys];

export function formatAssertionContext(context) {
    if (!context) return "";
    if (typeof context === "string") return context;
    const parts = [];
    if (context.scenarioName) parts.push(`场景 ${context.scenarioName}`);
    if (context.stepNo !== undefined) parts.push(`第 ${context.stepNo} 步`);
    if (context.stepName) parts.push(`步骤 ${context.stepName}`);
    if (context.assertionNo !== undefined) parts.push(`第 ${context.assertionNo} 条`);
    return parts.join(" ");
}

export function validateAssertion(definition, context) {
    const where = formatAssertionContext(context);
    const prefix = where ? `${where}断言无效` : "断言无效";
    if (!isPlainObject(definition)) throw new TypeError(`${prefix}: 断言必须是对象`);
    const keys = Object.keys(definition);
    const operators = keys.filter((key) => ASSERTION_OPERATORS.includes(key));
    const unknown = keys.filter((key) => !ASSERTION_OPERATORS.includes(key) && !ASSERTION_META_KEYS.includes(key));
    if (unknown.length) {
        throw new TypeError(
            `${prefix}: 包含未知键 ${unknown.map((key) => `"${key}"`).join(", ")}，` +
            `允许的元数据键为 ${ASSERTION_META_KEYS.join("/")}，操作符为 ${ASSERTION_OPERATORS.join("/")}`
        );
    }
    if (!operators.length) {
        throw new TypeError(`${prefix}: 必须至少包含一个操作符（${ASSERTION_OPERATORS.join("/")}）`);
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

export function evaluateAssertion(definition, response, runtime, context) {
    // 执行期也校验：防止插件 transform 之后产生非法断言定义
    validateAssertion(definition, context);
    const actual = assertionActual(definition, response, runtime);
    let expected;
    let passed = true;
    if (definition.exists !== undefined) {
        expected = Boolean(definition.exists);
        const exists = actual !== undefined && actual !== null && actual !== "";
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
        passed = passed && (Array.isArray(actual)
            ? actual.some((item) => JSON.stringify(item) === JSON.stringify(expected))
            : String(actual == null ? "" : actual).includes(String(expected)));
    }
    if (definition.matches !== undefined) {
        expected = resolve(definition.matches, runtime);
        // 隐式默认断言（无显式 status/assertions 时追加的 HTTP 2xx 检查）仅对数字
        // HTTP 状态码生效；本地适配器（返回 status: "LOCAL"）不参与匹配
        if (!(definition.implicit === true && typeof actual !== "number")) {
            try { passed = passed && new RegExp(String(expected)).test(String(actual == null ? "" : actual)); }
            catch { passed = false; }
        }
    }
    if (definition.oneOf !== undefined) {
        expected = resolve(definition.oneOf, runtime);
        passed = passed && Array.isArray(expected)
            && expected.some((item) => JSON.stringify(item) === JSON.stringify(actual));
    }
    for (const op of ["gt", "gte", "lt", "lte"]) {
        if (!Object.prototype.hasOwnProperty.call(definition, op)) continue;
        expected = resolve(definition[op], runtime);
        // 只接受有限 number，不做字符串隐式转换；类型不符时断言失败而非抛异常
        const comparable = typeof actual === "number" && Number.isFinite(actual)
            && typeof expected === "number" && Number.isFinite(expected);
        if (!comparable) { passed = false; continue; }
        if (op === "gt") passed = passed && actual > expected;
        else if (op === "gte") passed = passed && actual >= expected;
        else if (op === "lt") passed = passed && actual < expected;
        else passed = passed && actual <= expected;
    }
    return {
        name: definition.name || definition.path || "断言",
        passed,
        actual,
        expected
    };
}

export function buildAssertions(step, response, runtime, context) {
    const definitions = Array.isArray(step.assertions) ? [...step.assertions] : [];
    if (step.status !== undefined && !definitions.some((item) => item.target === "status")) {
        definitions.unshift({ name: `返回 HTTP ${step.status}`, target: "status", equals: step.status });
    } else if (step.status === undefined && definitions.length === 0) {
        definitions.push({ name: "返回 HTTP 2xx", target: "status", matches: "^2\\d\\d$", implicit: true });
    }
    return definitions.map((definition, index) => evaluateAssertion(definition, response, runtime, { ...(context || {}), assertionNo: index + 1 }));
}

// ===== 保留变量（来自 contract）=====
export const RESERVED_VARS = [...contract.reservedVars];

export function assertNotReservedVar(name, label) {
    if (RESERVED_VARS.includes(name)) {
        throw new Error(`${label || "变量"} "${name}" 是运行时自动生成的保留变量，禁止声明或覆盖`);
    }
}

export function assertNoReservedVars(source, label) {
    for (const name of Object.keys(source || {})) {
        assertNotReservedVar(name, label);
    }
}

export function applyExtract(step, response, runtime) {
    const warnings = [];
    const failures = [];
    for (const definition of step.extract || []) {
        if (!definition || !definition.name) continue;
        assertNotReservedVar(definition.name, "extract 变量");
        // 与 browser legacy core 完全同语义的提取来源解析：
        //   target:'status' / header 为简写（优先级最高）
        //   from: 'headers' | 'bodyText' | 'response'（默认 body）
        let source = response.body;
        if (definition.target === "status") source = response.status;
        else if (definition.header) source = headerValue(response.headers, definition.header);
        else if (definition.from === "headers") source = response.headers;
        else if (definition.from === "bodyText") source = response.bodyText;
        else if (definition.from === "response") source = response;
        const value = definition.path ? getByPath(source, definition.path) : source;
        if (value === undefined) {
            if (definition.required === true) {
                failures.push({
                    name: `提取 ${definition.name}（路径不存在）`,
                    passed: false,
                    actual: undefined,
                    expected: `路径 ${definition.path || "(整个响应)"} 存在`
                });
            } else {
                warnings.push(`提取变量 ${definition.name}：路径 ${definition.path || "(整个响应)"} 不存在，变量值为 undefined（required 未开启，不影响执行）`);
            }
        }
        runtime.vars[definition.name] = value;
    }
    return { warnings, failures };
}

export function md5(value) {
    return md5Impl(String(value));
}

export function generateSignature(params, secretValue) {
    const pairs = Object.keys(params || {}).sort().map((key) => `${key}=${params[key] == null ? "" : params[key]}`);
    pairs.push(`apiSecret=${secretValue == null ? "" : secretValue}`);
    return md5(pairs.join("&")).toUpperCase();
}

export function maskSecret(value) {
    if (value === undefined || value === null || value === "") return "";
    const text = String(value);
    return text.length > 12 ? `${text.slice(0, 4)}...${text.slice(-4)}` : "***";
}

export function sanitizeSensitive(value, key = "", sensitiveNames = []) {
    // 场景测试用于项目内联调，执行上下文和调试数据应保留原始值。
    // 保留该导出仅为兼容旧项目调用。
    return value;
}

export function formatDuration(milliseconds) {
    if (!Number.isFinite(milliseconds)) return "-";
    return milliseconds >= 1000 ? `${(milliseconds / 1000).toFixed(2)} s` : `${milliseconds.toFixed(0)} ms`;
}
