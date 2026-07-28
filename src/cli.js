#!/usr/bin/env node
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as ScenarioTest from "./node.js";
import { createXlsxAdapter, readWorkbookRows } from "./adapters/xlsx.js";
import { DEFAULT_LIBRARY_URL, createProjectFiles } from "./init-templates.js";

function parseArgs(argv) {
    const args = { command: "run", all: false, config: "", scenario: "", env: "", baseUrl: "", authorization: "", port: 4300, project: "", libraryUrl: "", force: false };
    let start = 0;
    if (["run", "serve", "init"].includes(argv[0])) { args.command = argv[0]; start = 1; }
    for (let index = start; index < argv.length; index += 1) {
        const item = argv[index];
        if (item === "--config") args.config = argv[++index] || "";
        else if (item === "--scenario") args.scenario = argv[++index] || "";
        else if (item === "--env") args.env = argv[++index] || "";
        else if (item === "--base-url") args.baseUrl = argv[++index] || "";
        else if (["--token", "--authorization"].includes(item)) args.authorization = argv[++index] || "";
        else if (item === "--port") args.port = Number(argv[++index] || 4300);
        else if (item === "--project") args.project = argv[++index] || "";
        else if (item === "--library-url") args.libraryUrl = argv[++index] || "";
        else if (item === "--force") args.force = true;
        else if (item === "--all") args.all = true;
        else if (["--help", "-h"].includes(item)) args.help = true;
        else if (!args.scenario && args.command === "run") args.scenario = item;
    }
    return args;
}

function printHelp() {
    console.log(`scenario-test 0.1.1

Usage:
  node scenario-test-cli.cjs --config ./scenario.config.js --env local --all
  node scenario-test-cli.cjs run --config ./scenario.config.js --scenario health
  node scenario-test-cli.cjs serve --config ./scenario.config.js --port 4300
  node scenario-test-cli.cjs init --project D:\\project

Options:
  --config <file>       场景配置文件
  --env <key>           配置中的环境 key
  --base-url <url>      临时覆盖 Base URL
  --scenario <id>       执行指定场景
  --all                 执行配置中的全部场景
  --authorization <v>   临时设置 Authorization
  --port <number>       浏览器服务端口，默认 4300
  --project <dir>       初始化业务项目的目标目录
  --library-url <url>   初始化时写入的 UMD Release 地址
  --force               覆盖 init 已生成的同名文件`);
}

function writeProjectFile(projectRoot, relativePath, content, force) {
    const target = path.resolve(projectRoot, relativePath);
    if (fs.existsSync(target) && !force) return false;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
    return true;
}

function initCommand(args) {
    const projectRoot = path.resolve(args.project || process.cwd());
    const libraryUrl = args.libraryUrl || DEFAULT_LIBRARY_URL;
    const created = [];
    const skipped = [];
    for (const [relativePath, content] of Object.entries(createProjectFiles(libraryUrl))) {
        (writeProjectFile(projectRoot, relativePath, content, args.force) ? created : skipped).push(relativePath);
    }
    console.log(`已初始化项目: ${projectRoot}`);
    if (created.length) console.log(`已创建: ${created.join(", ")}`);
    if (skipped.length) console.log(`已保留现有文件: ${skipped.join(", ")}`);
    console.log(`浏览器工作台: ${path.join(projectRoot, "dev", "场景测试", "index.html")}`);
}

function resolveConfigPath(value) {
    const candidate = path.resolve(value || "scenario.config.js");
    if (!fs.existsSync(candidate)) throw new Error(`配置文件不存在: ${candidate}`);
    return candidate;
}

async function loadPlugins(config, configDir) {
    const plugins = [];
    for (const pluginPath of config.nodePlugins || []) {
        const absolutePath = path.isAbsolute(pluginPath) ? pluginPath : path.resolve(configDir, pluginPath);
        const imported = await import(pathToFileURL(absolutePath).href);
        const factory = imported.default || imported;
        const pluginApi = { ...ScenarioTest, readWorkbookRows };
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
    if (!config.envs.length) return { key: "default", name: "默认", baseUrl: config.baseUrl || "" };
    const selectedKey = key || config.defaultEnvKey;
    const environment = config.envs.find((item) => item.key === selectedKey);
    if (!environment) throw new Error(`未找到环境 ${selectedKey}，可用值: ${config.envs.map((item) => item.key).join(", ")}`);
    return environment;
}

function configVariables(config) {
    const values = { ...(config.vars || {}) };
    for (const definition of config.variables || []) {
        const environmentName = definition.env;
        const value = environmentName ? process.env[environmentName] : undefined;
        if (value !== undefined) values[definition.name] = value;
        else if (values[definition.name] === undefined && definition.defaultValue !== undefined) values[definition.name] = definition.defaultValue;
        if (definition.required && (values[definition.name] === undefined || values[definition.name] === "")) {
            throw new Error(`缺少变量 ${definition.name}${environmentName ? `，请设置环境变量 ${environmentName}` : ""}`);
        }
    }
    return values;
}

async function runCommand(args) {
    const configPath = resolveConfigPath(args.config);
    const configDir = path.dirname(configPath);
    const config = ScenarioTest.loadConfigFile(configPath, ScenarioTest);
    const environment = selectEnvironment(config, args.env);
    const entries = args.all
        ? config.scenarios
        : config.scenarios.filter((item) => [item.id, item.name, item.url].includes(args.scenario || config.scenarios[0]?.id));
    if (!entries.length) throw new Error(args.scenario ? `未找到场景: ${args.scenario}` : "配置中没有场景");
    const plugins = await loadPlugins(config, configDir);
    const adapters = { xlsx: createXlsxAdapter({ workspace: configDir }) };
    for (const plugin of plugins) Object.assign(adapters, plugin?.adapters || {});
    const baseOptions = {
        config,
        baseUrl: String(args.baseUrl || environment.baseUrl || config.baseUrl || "").replace(/\/+$/, ""),
        authorization: args.authorization || environment.authorization || config.authorization || "",
        requestTimeoutMs: config.requestTimeoutMs,
        vars: configVariables(config),
        environmentVariables: process.env,
        io: ScenarioTest.createNodeIo(configDir),
        adapters
    };
    if (!baseOptions.baseUrl) throw new Error("缺少 Base URL，请配置环境或传入 --base-url");
    let total = 0;
    let failed = 0;
    for (const entry of entries) {
        if (!entry.url) throw new Error(`场景 ${entry.id} 缺少 url`);
        const scenarioPath = path.isAbsolute(entry.url) ? entry.url : path.resolve(configDir, entry.url);
        let scenario = ScenarioTest.loadScenarioFile(scenarioPath, entry.id, ScenarioTest);
        scenario = await transformScenario(scenario, { config, configDir, entry, environment }, plugins);
        console.log(`\n# ${scenario.name} (${entry.id})`);
        const report = await ScenarioTest.createEngine(baseOptions).runScenario(scenario, {
            ...baseOptions,
            async onStep(result) {
                const mark = result.passed ? "PASS" : "FAIL";
                console.log(`[${mark}] ${result.name} ${result.method} ${result.path} -> ${result.status} (${ScenarioTest.formatDuration(result.duration)})`);
                for (const assertion of result.assertions.filter((item) => !item.passed)) {
                    console.log(`  - ${assertion.name}: expected=${JSON.stringify(assertion.expected)} actual=${JSON.stringify(assertion.actual)}`);
                }
            }
        });
        for (const plugin of plugins) {
            await plugin?.afterScenario?.(report, { config, configDir, entry, environment, scenario });
        }
        total += report.executed;
        failed += report.failed + (report.executed < report.planned ? 1 : 0);
        console.log(`Summary: ${report.executed - report.failed}/${report.executed} executed steps passed (${report.executed}/${report.planned} executed)`);
    }
    console.log(`\nOverall: ${total - failed}/${total} passed`);
    if (failed) process.exitCode = 1;
}

function safeFile(root, relativePath) {
    const candidate = path.resolve(root, relativePath);
    const relative = path.relative(root, candidate);
    return relative && (relative.startsWith("..") || path.isAbsolute(relative)) ? null : candidate;
}

function contentType(filePath) {
    return ({
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".svg": "image/svg+xml",
        ".txt": "text/plain; charset=utf-8"
    })[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

async function serveCommand(args) {
    const configPath = resolveConfigPath(args.config);
    const workspace = path.dirname(configPath);
    const libraryDist = path.dirname(path.resolve(process.argv[1]));
    const server = http.createServer((request, response) => {
        try {
            const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
            let filePath;
            if (pathname === "/__scenario-test__/scenario-test.umd.js") filePath = path.join(libraryDist, "scenario-test.umd.js");
            else {
                const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
                filePath = safeFile(workspace, relativePath);
            }
            if (!filePath) { response.writeHead(403); response.end("Forbidden"); return; }
            fs.stat(filePath, (error, stat) => {
                if (error || !stat.isFile()) { response.writeHead(404); response.end("Not Found"); return; }
                response.writeHead(200, { "Cache-Control": "no-store", "Content-Type": contentType(filePath) });
                fs.createReadStream(filePath).pipe(response);
            });
        } catch {
            response.writeHead(400);
            response.end("Bad Request");
        }
    });
    server.listen(args.port, "127.0.0.1", () => {
        console.log(`场景测试工作台: http://127.0.0.1:${args.port}/`);
        console.log(`配置目录: ${workspace}`);
    });
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) { printHelp(); return; }
    if (args.command === "init") initCommand(args);
    else if (args.command === "serve") await serveCommand(args);
    else await runCommand(args);
}

main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
});
