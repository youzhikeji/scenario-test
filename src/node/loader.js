import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {
    getConfig,
    getScenario,
    normalizeLegacyConfig,
    normalizeLegacyScenario,
    registerScenario
} from "../registry.js";

export function executeDefinitionFile(filePath, api) {
    const absolutePath = path.resolve(filePath);
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
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(absolutePath, "utf8"), context, { filename: absolutePath });
    return { context, window: windowObject, exports: moduleObject.exports };
}

export function loadConfigFile(filePath, api) {
    const previousConfig = getConfig();
    const loaded = executeDefinitionFile(filePath, api);
    const exported = loaded.exports?.default || loaded.exports;
    const registeredConfig = getConfig();
    const config = (registeredConfig !== previousConfig ? registeredConfig : null)
        || loaded.window.ProjectScenarioConfig
        || loaded.window.GlobalConfig
        || (exported && Object.keys(exported).length ? exported : null);
    if (!config) throw new Error(`配置文件未注册配置: ${filePath}`);
    return loaded.window.GlobalConfig === config ? normalizeLegacyConfig(config) : api.defineConfig(config);
}

export function loadScenarioFile(filePath, id, api) {
    const existing = getScenario(id);
    if (existing) return existing;
    const loaded = executeDefinitionFile(filePath, api);
    let scenario = getScenario(id);
    if (!scenario && loaded.window.ScenarioData) {
        scenario = normalizeLegacyScenario(loaded.window.ScenarioData);
        registerScenario(id, scenario);
    }
    const exported = loaded.exports?.default || loaded.exports;
    if (!scenario && exported && Array.isArray(exported.steps)) scenario = registerScenario(id, exported);
    if (!scenario) throw new Error(`场景文件未注册 ${id}: ${filePath}`);
    return scenario;
}
