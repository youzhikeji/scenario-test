import {
    applyExtract,
    assertNoReservedVars,
    assertNotReservedVar,
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
    resolveString
} from "./core.js";
import { contract } from "./contract.js";
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

function createRunIdentifiers() {
    const timestamp = String(Date.now());
    const random = globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 8)
        : Math.random().toString(16).slice(2, 10).padEnd(8, "0");
    return {
        runId: `${timestamp}-${random}`,
        runNo: `${timestamp.slice(-6)}-${random.slice(0, 4)}`
    };
}

function buildGeneratedVars(scenario, baseVars, environmentVariables, options = {}) {
    const identifiers = createRunIdentifiers();
    // 保留变量冲突在使用前尽早报错：config/options vars 不得声明 runId/runNo
    assertNoReservedVars(scenario.vars, "场景 vars");
    assertNoReservedVars(baseVars, "配置/选项 vars");
    const vars = { ...(scenario.vars || {}), ...(baseVars || {}), ...identifiers };

    // ✅ 是否在错误消息中显示详细信息（仅开发模式）
    const verboseErrors = options.verboseErrors || process.env.SCENARIO_VERBOSE_ERRORS === "true";

    for (const [name, environmentName] of Object.entries(scenario.envVars || {})) {
        assertNotReservedVar(name, `场景 envVars`);
        const value = environmentVariables?.[environmentName] ?? vars[name];
        if (value === undefined || value === null || value === "") {
            // ✅ 生产模式不泄露环境变量名
            if (verboseErrors) {
                throw new Error(
                    `缺少场景变量: vars.${name}\n` +
                    `环境变量映射: ${environmentName}\n` +
                    `提示: 在配置中设置 vars.${name} 或设置环境变量 ${environmentName}`
                );
            } else {
                throw new Error(
                    `缺少必需的场景变量: vars.${name}\n` +
                    `提示: 请在配置文件的 vars 中设置该变量，或通过环境变量提供\n` +
                    `详细信息可通过设置 SCENARIO_VERBOSE_ERRORS=true 查看`
                );
            }
        }
        vars[name] = value;
    }
    for (const definition of scenario.generatedVars || []) {
        if (!definition?.name) continue;
        assertNotReservedVar(definition.name, "generatedVars");
        // 定义期（defineScenario）已校验类型枚举；这里防御性复查，防止插件 transform 后漂移
        if (!contract.generatedVars.types.includes(definition.type)) {
            throw new Error(`不支持的 generatedVars 类型: ${definition.type}`);
        }
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
            // ✅ 从 vars 中获取密钥但不在错误消息中暴露
            const secret = vars[definition.secretVar || "apiSecret"];
            if (!secret) {
                throw new Error(`签名生成失败: 缺少密钥变量 vars.${definition.secretVar || "apiSecret"}`);
            }
            vars[definition.name] = generateSignature(params, secret);
        } else {
            throw new Error(`不支持的 generatedVars 类型: ${definition.type}`);
        }
    }
    // ✅ 不在这里冻结，因为 extract 需要修改 vars
    // 冻结在外层处理
    return vars;
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
    let requestPath = buildUrl(step.path || request.path || "", step.params || request.params, runtime);
    const headers = { ...(request.headers || {}) };
    const absoluteUrl = /^https?:\/\//i.test(requestPath);
    const allowEnvironmentAuthorization = !absoluteUrl || request.useEnvironmentAuthorization === true;
    const globals = options.globals || [];
    if (allowEnvironmentAuthorization && globals.length) {
        // query：追加 URL 参数，跳过步骤参数已存在的 key
        const existingKeys = new Set();
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
        // cookie：多个全局 cookie 合并为一个 Cookie 头，追加到已有 Cookie 之后
        const cookieParts = globals
            .filter((global) => global.type === "cookie")
            .map((global) => `${global.name}=${resolveString(global.value, runtime)}`);
        if (cookieParts.length) {
            const cookieKey = Object.keys(headers).find((key) => key.toLowerCase() === "cookie");
            const mergedCookie = cookieKey
                ? `${headers[cookieKey]}; ${cookieParts.join("; ")}`
                : cookieParts.join("; ");
            if (cookieKey) headers[cookieKey] = mergedCookie;
            else headers.Cookie = mergedCookie;
        }
        // header：步骤显式声明同名头时全局参数不覆盖
        for (const global of globals) {
            if (global.type !== "header" || hasHeader(headers, global.name)) continue;
            headers[global.name] = resolveString(global.value, runtime);
        }
    }
    if (options.authorization && allowEnvironmentAuthorization && !hasHeader(headers, "Authorization")) {
        headers.Authorization = options.authorization;
    }
    const fetchOptions = { method, headers };
    if (request.credentials !== undefined) fetchOptions.credentials = request.credentials;
    if (request.redirect !== undefined) fetchOptions.redirect = request.redirect;
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

class AdapterExecutionError extends Error {
    constructor(adapterName, originalError, step) {
        const message = `适配器 ${adapterName} 执行失败: ${originalError.message}`;
        super(message);
        this.name = "AdapterExecutionError";
        this.adapterName = adapterName;
        this.originalError = originalError;
        this.stepName = step?.name || "未命名步骤";
    }
}

async function executeAdapter(adapter, step, runtime, options) {
    if (!adapter) throw new Error(`未注册步骤适配器: ${step.adapter || "unknown"}`);
    
    const adapterName = step.adapter || adapter.constructor?.name || "unknown";
    let output;
    
    try {
        // 前置钩子
        if (typeof adapter.beforeExecute === "function") {
            await adapter.beforeExecute({ step, runtime, options });
        }
        
        // 执行主逻辑
        output = await adapter.execute({ step: resolve(clone(step), runtime), runtime, options });
        
        // 后置钩子
        if (typeof adapter.afterExecute === "function") {
            output = await adapter.afterExecute({ step, runtime, options, output }) || output;
        }
    } catch (error) {
        // 错误钩子
        if (typeof adapter.onError === "function") {
            try {
                await adapter.onError({ step, runtime, options, error });
            } catch (hookError) {
                console.warn(`适配器 ${adapterName} 错误钩子失败:`, hookError);
            }
        }
        throw new AdapterExecutionError(adapterName, error, step);
    }
    
    const response = output?.response || output;
    if (!response || response.status === undefined) {
        throw new Error(`适配器 ${adapterName} 必须返回包含 status 的 response 对象`);
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

export function createEngine(engineOptions = {}) {
    // 作用域隔离：每个引擎实例有独立的适配器注册表
    const scopedAdapters = engineOptions.isolateAdapters !== false
        ? new Map([...listAdapters()])
        : listAdapters();
    
    // 注册实例级适配器
    if (engineOptions.adapters) {
        for (const [name, adapter] of Object.entries(engineOptions.adapters)) {
            if (adapter && typeof adapter.execute === "function") {
                scopedAdapters.set(name, adapter);
            }
        }
    }
    
    const adapters = scopedAdapters;
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
        if (step.when !== undefined) {
            const shouldRun = typeof step.when === "object"
                ? evaluateAssertion(step.when, { status: 0, headers: {}, body: null, bodyText: "" }, runtime, { stepName: step.name }).passed
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
        // ✅ 添加重试超时保护
        const retryStartTime = now();
        const maxElapsedMs = retry?.maxElapsedMs || 300000; // 默认 5 分钟
        try {
            for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
                if (options.signal?.aborted) throw options.signal.reason || new Error("执行已取消");

                // ✅ 检查总耗时
                if (retry && (now() - retryStartTime) > maxElapsedMs) {
                    throw new Error(
                        `重试超时: 已尝试 ${attempt - 1} 次，耗时超过 ${maxElapsedMs}ms\n` +
                        `提示: 考虑调整 retryUntil.maxElapsedMs 或检查接口响应`
                    );
                }

                const adapter = chooseAdapter(step, adapters);
                lastExecution = adapter
                    ? await executeAdapter(adapter, step, runtime, options)
                    : await executeHttp(step, runtime, options);
                runtime.lastResponse = lastExecution.response;
                runtime.lastResponseBody = lastExecution.response.body;
                const extractResult = applyExtract(step, lastExecution.response, runtime);
                stepWarnings = extractResult.warnings;
                assertions = buildAssertions(step, lastExecution.response, runtime, { stepName: step.name });
                // required: true 且路径不存在 → 当前步骤失败
                if (extractResult.failures.length) assertions.push(...extractResult.failures);
                if (assertions.every((item) => item.passed) || attempt === totalAttempts) break;

                // ✅ 确保最小重试间隔
                const intervalMs = Math.max(100, Number(retry.intervalMs || 2000));
                await delay(intervalMs, options.signal);
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
                warnings: stepWarnings,
                assertions,
                request: lastExecution.request,
                response: lastExecution.response
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
                warnings: [],
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
            vars: { ...(engineOptions.vars || {}), ...(runOptions.vars || {}) },
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
        // SKIP 可观测性：skipped 优先于 passed，绝不把 SKIP 计入 passedSteps/executed
        const skipped = results.filter((item) => item.skipped).length;
        const executed = results.length - skipped;
        const failed = results.filter((item) => !item.skipped && !item.passed).length;
        const passedSteps = results.filter((item) => !item.skipped && item.passed).length;
        const status = failed > 0 ? "FAILED" : (executed === 0 ? "SKIPPED" : "PASSED");
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

    return { runStep, runScenario, createRuntime };
}

export async function runScenario(scenario, options = {}) {
    return createEngine(options).runScenario(scenario, options);
}
