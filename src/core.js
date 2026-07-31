import md5Impl from "blueimp-md5";

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

function assertionActual(definition, response, runtime) {
    if (definition.target === "status") return response.status;
    if (definition.header) return headerValue(response.headers, definition.header);
    if (definition.from === "vars") return definition.path ? getByPath(runtime.vars, definition.path) : runtime.vars;
    if (definition.from === "headers") return definition.path ? getByPath(response.headers, definition.path) : response.headers;
    if (definition.from === "bodyText") return response.bodyText;
    return definition.path ? getByPath(response.body, definition.path) : response.body;
}

export function evaluateAssertion(definition, response, runtime) {
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
    if (Object.prototype.hasOwnProperty.call(definition, "includes")) {
        expected = resolve(definition.includes, runtime);
        passed = passed && (Array.isArray(actual)
            ? actual.some((item) => JSON.stringify(item) === JSON.stringify(expected))
            : String(actual == null ? "" : actual).includes(String(expected)));
    }
    if (definition.matches !== undefined) {
        expected = resolve(definition.matches, runtime);
        try { passed = passed && new RegExp(String(expected)).test(String(actual == null ? "" : actual)); }
        catch { passed = false; }
    }
    if (definition.oneOf !== undefined) {
        expected = resolve(definition.oneOf, runtime);
        passed = passed && Array.isArray(expected)
            && expected.some((item) => JSON.stringify(item) === JSON.stringify(actual));
    }
    return {
        name: definition.name || definition.path || "断言",
        passed,
        actual,
        expected
    };
}

export function buildAssertions(step, response, runtime) {
    const definitions = Array.isArray(step.assertions) ? [...step.assertions] : [];
    if (step.status !== undefined && !definitions.some((item) => item.target === "status")) {
        definitions.unshift({ name: `返回 HTTP ${step.status}`, target: "status", equals: step.status });
    } else if (step.status === undefined && definitions.length === 0) {
        definitions.push({ name: "返回 HTTP 2xx", target: "status", matches: "^2\\d\\d$" });
    }
    return definitions.map((definition) => evaluateAssertion(definition, response, runtime));
}

export function applyExtract(step, response, runtime) {
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
