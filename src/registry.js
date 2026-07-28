import { isPlainObject } from "./core.js";

const scenarioRegistry = new Map();
const adapterRegistry = new Map();
let currentConfig = null;

function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
}

export function defineScenario(input) {
    invariant(isPlainObject(input), "场景必须是对象");
    invariant(typeof input.name === "string" && input.name.trim(), "场景缺少 name");
    invariant(Array.isArray(input.steps), `场景 ${input.name} 缺少 steps 数组`);
    const failurePolicy = input.failurePolicy || "stop";
    invariant(["stop", "continue"].includes(failurePolicy), "failurePolicy 只能是 stop 或 continue");
    return { ...input, failurePolicy, steps: [...input.steps] };
}

export function defineConfig(input) {
    invariant(isPlainObject(input), "配置必须是对象");
    const envs = Array.isArray(input.envs) ? input.envs.map((env) => ({ ...env })) : [];
    for (const env of envs) {
        invariant(env.key && env.name, "每个环境必须包含 key 和 name");
    }
    const scenarios = (Array.isArray(input.scenarios) ? input.scenarios : []).map((entry, index) => {
        if (typeof entry === "string") return { id: entry, name: entry, url: entry };
        invariant(isPlainObject(entry), `第 ${index + 1} 个场景清单项无效`);
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
        requestTimeoutMs: Number(input.requestTimeoutMs || 30000),
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
