import {
    applyExtract,
    buildAssertions,
    buildUrl,
    clone,
    generateSignature,
    hasHeader,
    headersToObject,
    joinUrl,
    md5,
    parseBody,
    evaluateAssertion,
    resolve,
    resolveString,
    sanitizeSensitive
} from "./core.js";
import { defineScenario, listAdapters } from "./registry.js";

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
                reject(signal.reason || new Error("执行已取消"));
            }, { once: true });
        }
    });
}

function createRequestSignal(parentSignal, timeoutMs) {
    const controller = new AbortController();
    const abort = () => controller.abort(parentSignal?.reason || new Error("执行已取消"));
    if (parentSignal?.aborted) abort();
    else parentSignal?.addEventListener("abort", abort, { once: true });
    const timer = timeoutMs > 0
        ? setTimeout(() => controller.abort(new Error(`请求超时（${timeoutMs}ms）`)), timeoutMs)
        : null;
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
    const vars = { ...(scenario.vars || {}), ...(baseVars || {}), runId, runNo: runId.slice(-6) };
    for (const [name, environmentName] of Object.entries(scenario.envVars || {})) {
        const value = environmentVariables?.[environmentName] ?? vars[name];
        if (value === undefined || value === null || value === "") {
            throw new Error(`缺少场景变量 ${environmentName}（映射到 vars.${name}）`);
        }
        vars[name] = value;
    }
    for (const definition of scenario.generatedVars || []) {
        if (!definition?.name) continue;
        if (definition.type === "timestamp") vars[definition.name] = Date.now();
        else if (definition.type === "uuidHex") {
            if (!globalThis.crypto?.randomUUID) throw new Error("当前环境不支持 crypto.randomUUID");
            vars[definition.name] = globalThis.crypto.randomUUID().replace(/-/g, "");
        } else if (definition.type === "md5") {
            const source = (definition.parts || []).map((name) => vars[name] == null ? "" : String(vars[name])).join("");
            vars[definition.name] = md5(source);
        } else if (definition.type === "signature") {
            const params = Object.fromEntries(Object.entries(definition.params || {})
                .map(([key, variableName]) => [key, vars[variableName]]));
            vars[definition.name] = generateSignature(params, vars[definition.secretVar || "apiSecret"]);
        } else {
            throw new Error(`不支持的 generatedVars 类型: ${definition.type}`);
        }
    }
    return vars;
}

function resolveSensitiveNames(config) {
    return (config.variables || []).filter((item) => item.sensitive).map((item) => item.name);
}

export function createRuntime(scenario, options = {}) {
    const config = options.config || {};
    return {
        vars: buildGeneratedVars(
            scenario,
            { ...(config.vars || {}), ...(options.vars || {}) },
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
    const headers = { ...(request.headers || {}) };
    const absoluteUrl = /^https?:\/\//i.test(requestPath);
    if (options.authorization && (!absoluteUrl || request.useEnvironmentAuthorization === true)
        && !hasHeader(headers, "Authorization")) {
        headers.Authorization = options.authorization;
    }
    const fetchOptions = { method, headers };
    if (request.fileUpload) {
        if (!options.io?.createUploadBody) throw new Error("当前运行环境不支持 fileUpload");
        const upload = await options.io.createUploadBody(resolve(request.fileUpload, runtime), runtime);
        fetchOptions.body = upload.body;
        for (const [name, value] of Object.entries(upload.headers || {})) headers[name] = value;
        for (const key of Object.keys(headers)) {
            if (key.toLowerCase() === "content-type" && upload.omitContentType) delete headers[key];
        }
    } else if (request.body !== undefined && request.body !== null && !["GET", "HEAD"].includes(method)) {
        if (typeof request.body === "string") fetchOptions.body = request.body;
        else {
            if (!hasHeader(headers, "Content-Type")) headers["Content-Type"] = "application/json";
            fetchOptions.body = JSON.stringify(request.body);
        }
    }
    const timeoutMs = Number(step.timeoutMs || options.requestTimeoutMs || 30000);
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
    if (!adapter) throw new Error(`未注册步骤适配器: ${step.adapter || "unknown"}`);
    const output = await adapter.execute({ step: resolve(clone(step), runtime), runtime, options });
    const response = output?.response || output;
    if (!response || response.status === undefined) throw new Error("适配器必须返回 response 或响应对象");
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

export function createEngine(engineOptions = {}) {
    const adapters = new Map([...listAdapters(), ...Object.entries(engineOptions.adapters || {})]);
    const fetchImpl = engineOptions.fetch || (typeof globalThis.fetch === "function"
        ? (...args) => globalThis.fetch(...args)
        : null);
    if (typeof fetchImpl !== "function") throw new Error("缺少 fetch 实现");

    async function runStep(step, runtime, runOptions = {}) {
        const startedAt = now();
        const options = {
            ...engineOptions,
            ...runOptions,
            fetch: fetchImpl,
            adapters,
            requestTimeoutMs: runOptions.requestTimeoutMs || engineOptions.requestTimeoutMs || 30000
        };
        const sensitiveNames = resolveSensitiveNames(options.config || {});
        if (step.when !== undefined) {
            const shouldRun = typeof step.when === "object"
                ? evaluateAssertion(step.when, { status: 0, headers: {}, body: null, bodyText: "" }, runtime).passed
                : Boolean(resolve(step.when, runtime));
            if (!shouldRun) {
                return {
                    name: step.name || "未命名步骤",
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
                if (options.signal?.aborted) throw options.signal.reason || new Error("执行已取消");
                const adapter = chooseAdapter(step, adapters);
                lastExecution = adapter
                    ? await executeAdapter(adapter, step, runtime, options)
                    : await executeHttp(step, runtime, options);
                runtime.lastResponse = lastExecution.response;
                runtime.lastResponseBody = lastExecution.response.body;
                applyExtract(step, lastExecution.response, runtime);
                assertions = buildAssertions(step, lastExecution.response, runtime);
                if (assertions.every((item) => item.passed) || attempt === totalAttempts) break;
                await delay(Number(retry.intervalMs || 2000), options.signal);
            }
            const failed = assertions.find((item) => !item.passed);
            return {
                name: step.name || "未命名步骤",
                method: lastExecution.method,
                path: lastExecution.path,
                status: lastExecution.response.status,
                duration: now() - startedAt,
                passed: !failed,
                error: failed?.name || "",
                assertions: sanitizeSensitive(assertions, "", sensitiveNames),
                request: sanitizeSensitive(lastExecution.request, "", sensitiveNames),
                response: sanitizeSensitive(lastExecution.response, "", sensitiveNames)
            };
        } catch (error) {
            return {
                name: step.name || "未命名步骤",
                method: String(step.method || "ERROR").toUpperCase(),
                path: resolveString(step.path || "", runtime),
                status: options.signal?.aborted ? "CANCELLED" : "ERROR",
                duration: now() - startedAt,
                passed: false,
                error: error?.message || String(error),
                assertions: [{ name: "步骤执行成功", passed: false, actual: error?.message || String(error), expected: "无异常" }],
                request: null,
                response: null
            };
        }
    }

    async function runScenario(input, runOptions = {}) {
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
            vars: sanitizeSensitive(runtime.vars, "", resolveSensitiveNames(config))
        };
    }

    return { runStep, runScenario, createRuntime };
}

export async function runScenario(scenario, options = {}) {
    return createEngine(options).runScenario(scenario, options);
}
