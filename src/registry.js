import { isPlainObject } from "./core.js";

const scenarioRegistry = new Map();
const adapterRegistry = new Map();
let currentConfig = null;

function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
}

function nonEmptyString(value) {
    return typeof value === "string" && Boolean(value.trim());
}

function assertUnique(items, field, label) {
    const seen = new Set();
    for (const item of items) {
        const value = item[field];
        invariant(!seen.has(value), `${label}重复: ${value}`);
        seen.add(value);
    }
}

export function defineScenario(input) {
    invariant(isPlainObject(input), "场景必须是对象");
    invariant(typeof input.name === "string" && input.name.trim(), "场景缺少 name");
    invariant(Array.isArray(input.steps), `场景 ${input.name} 缺少 steps 数组`);
    input.steps.forEach((step, index) => {
        invariant(isPlainObject(step), `场景 ${input.name} 第 ${index + 1} 步必须是对象`);
        invariant(nonEmptyString(step.name), `场景 ${input.name} 第 ${index + 1} 步缺少 name`);
        if (step.method !== undefined) invariant(nonEmptyString(step.method), `步骤 ${step.name} 的 method 无效`);
        if (step.retryUntil !== undefined) {
            invariant(isPlainObject(step.retryUntil), `步骤 ${step.name} 的 retryUntil 必须是对象`);
            const maxAttempts = Number(step.retryUntil.maxAttempts ?? 10);
            const intervalMs = Number(step.retryUntil.intervalMs ?? 2000);
            invariant(Number.isInteger(maxAttempts) && maxAttempts >= 1, `步骤 ${step.name} 的 maxAttempts 必须是正整数`);
            invariant(Number.isFinite(intervalMs) && intervalMs >= 0, `步骤 ${step.name} 的 intervalMs 不能为负数`);
        }
    });
    const failurePolicy = input.failurePolicy || "stop";
    invariant(["stop", "continue"].includes(failurePolicy), "failurePolicy 只能是 stop 或 continue");
    return { ...input, failurePolicy, steps: [...input.steps] };
}

export function defineConfig(input) {
    invariant(isPlainObject(input), "配置必须是对象");
    const envs = Array.isArray(input.envs) ? input.envs.map((env) => ({ ...env })) : [];
    for (const env of envs) {
        invariant(nonEmptyString(env.key) && nonEmptyString(env.name), "每个环境必须包含非空 key 和 name");
    }
    assertUnique(envs, "key", "环境 key");
    const scenarios = (Array.isArray(input.scenarios) ? input.scenarios : []).map((entry, index) => {
        if (typeof entry === "string") {
            invariant(nonEmptyString(entry), `第 ${index + 1} 个场景地址不能为空`);
            return { id: entry, name: entry, url: entry };
        }
        invariant(isPlainObject(entry), `第 ${index + 1} 个场景清单项无效`);
        const url = entry.url || entry.file || entry.path || "";
        const id = entry.id || url || `scenario-${index + 1}`;
        invariant(nonEmptyString(id), `第 ${index + 1} 个场景缺少 id`);
        invariant(nonEmptyString(url), `场景 ${id} 缺少 url`);
        return { ...entry, id, name: entry.name || id, url };
    });
    assertUnique(scenarios, "id", "场景 id");
    const variables = Array.isArray(input.variables) ? input.variables.map((item, index) => {
        invariant(isPlainObject(item), `第 ${index + 1} 个变量定义无效`);
        invariant(nonEmptyString(item.name), `第 ${index + 1} 个变量缺少 name`);
        if (item.env !== undefined) invariant(nonEmptyString(item.env), `变量 ${item.name} 的 env 无效`);
        return { ...item };
    }) : [];
    assertUnique(variables, "name", "变量 name");
    const defaultEnvKey = input.defaultEnvKey || envs[0]?.key || "";
    invariant(!defaultEnvKey || envs.some((env) => env.key === defaultEnvKey), `defaultEnvKey 不存在: ${defaultEnvKey}`);
    const requestTimeoutMs = Number(input.requestTimeoutMs ?? 30000);
    invariant(Number.isFinite(requestTimeoutMs) && requestTimeoutMs > 0, "requestTimeoutMs 必须是正数");
    return {
        ...input,
        envs,
        scenarios,
        variables,
        defaultEnvKey,
        requestTimeoutMs,
        vars: { ...(input.scenarioVars || {}), ...(input.vars || {}) },
        storagePrefix: input.storagePrefix || "scenario-test"
    };
}

export function registerConfig(config) {
    currentConfig = defineConfig(config);
    return currentConfig;
}

export function getConfig() {
    return currentConfig;
}

export function registerScenario(id, scenario) {
    invariant(typeof id === "string" && id.trim(), "场景 id 不能为空");
    const normalized = defineScenario(scenario);
    scenarioRegistry.set(id, normalized);
    return normalized;
}

export function getScenario(id) {
    return scenarioRegistry.get(id);
}

export function clearScenarios() {
    scenarioRegistry.clear();
}

export function registerAdapter(name, adapter) {
    invariant(typeof name === "string" && name.trim(), "适配器名称不能为空");
    invariant(adapter && typeof adapter.execute === "function", `适配器 ${name} 缺少 execute`);
    adapterRegistry.set(name, adapter);
    return adapter;
}

export function getAdapter(name) {
    return adapterRegistry.get(name);
}

export function listAdapters() {
    return new Map(adapterRegistry);
}
