import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as ScenarioTest from "./node.js";
import { createProjectFiles } from "./init-templates.js";
import { contract } from "./contract.js";
import { buildCapabilities, renderCapabilitiesText } from "./capabilities.js";
import { buildDoctorReport, renderDoctorText } from "./doctor.js";
import { VERSION } from "./version.generated.js";
import { validatePath } from "./utils/path-validator.js";
import { mergeGlobals } from "./core.js";
import { FRAMEWORK_FILES, resolveProjectLayout } from "./project-layout.js";

function argumentValue(argv, index, option) {
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${option} 缺少参数值`);
    return value;
}

// 选项名单来自 contract.cli.options（唯一真相），避免 cli.js 手写第二份名单
const FLAG_OPTIONS = new Map();
const VALUE_OPTIONS = new Map();
for (const [name, spec] of Object.entries(contract.cli.options)) {
    const target = `--${name}`;
    if (spec.kind === "flag") {
        FLAG_OPTIONS.set(target, spec.prop);
    } else {
        VALUE_OPTIONS.set(target, { prop: spec.prop, spec });
        for (const alias of spec.aliases || []) VALUE_OPTIONS.set(`--${alias}`, { prop: spec.prop, spec });
    }
}

function parseArgs(argv) {
    const args = { command: "run", all: false, config: "", scenario: "", env: "", baseUrl: "", authorization: "", port: 4300, project: "", dir: "", force: false, allowExternalPlugins: false, failOnSkip: false, json: false, help: false };
    let start = 0;
    // 命令名单来自 contract.cli.commands
    if (contract.cli.commands.includes(argv[0])) { args.command = argv[0]; start = 1; }
    let deprecatedAuthUsed = false;
    for (let index = start; index < argv.length; index += 1) {
        const item = argv[index];
        if (item === "--help" || item === "-h") { args.help = true; continue; }
        const valueOption = VALUE_OPTIONS.get(item);
        if (valueOption) {
            const raw = argumentValue(argv, index++, item);
            args[valueOption.prop] = valueOption.spec.parse === "number" ? Number(raw) : raw;
            if (item === "--token" || item === "--authorization") deprecatedAuthUsed = true;
            continue;
        }
        const flagProp = FLAG_OPTIONS.get(item);
        if (flagProp) { args[flagProp] = true; continue; }
        if (item.startsWith("-")) throw new Error(`未知参数: ${item}`);
        else if (!args.scenario && args.command === "run") args.scenario = item;
        else throw new Error(`无法识别的参数: ${item}`);
    }
    if (args.all && args.scenario) throw new Error("--all 与 --scenario 不能同时使用");
    if (!Number.isInteger(args.port) || args.port < 1 || args.port > 65535) throw new Error("--port 必须是 1-65535 的整数");

    // ✅ 环境变量优先于命令行参数
    if (process.env.SCENARIO_AUTH) {
        args.authorization = process.env.SCENARIO_AUTH;
        if (deprecatedAuthUsed) {
            console.warn(
                "\n⚠️  警告: 同时检测到 SCENARIO_AUTH 环境变量和 --authorization 参数\n" +
                "   环境变量优先级更高，--authorization 参数将被忽略\n"
            );
        }
    } else if (deprecatedAuthUsed) {
        console.warn(
            "\n⚠️  弃用警告: --authorization 参数将在未来版本中移除\n" +
            "   推荐使用环境变量: export SCENARIO_AUTH=\"Bearer your-token\"\n" +
            "   原因: 命令行参数在进程列表中可见，存在安全风险\n"
        );
    }

    return args;
}

function parseGlobalsEnv() {
    const raw = process.env.SCENARIO_GLOBALS;
    if (!raw) return [];
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error("SCENARIO_GLOBALS 必须是合法的 JSON 数组，例如 [{\"type\":\"header\",\"name\":\"X-Token\",\"value\":\"abc\"}]");
    }
    if (!Array.isArray(parsed)) throw new Error("SCENARIO_GLOBALS 必须是 JSON 数组");
    const types = contract.globals.types;
    return parsed.map((item, index) => {
        if (!item || typeof item !== "object" || !types.includes(item.type)
            || typeof item.name !== "string" || !item.name.trim()) {
            throw new Error(`SCENARIO_GLOBALS 第 ${index + 1} 项无效，格式应为 { type: "${types.join("|")}", name, value }`);
        }
        return { type: item.type, name: item.name, value: item.value == null ? "" : String(item.value) };
    });
}

function printHelp() {
    console.log(`scenario-test ${VERSION}

Usage:
  node scenario-test-cli.cjs --config ./scenario.config.js --env local --all
  node scenario-test-cli.cjs run --config ./scenario.config.js --scenario health
  node scenario-test-cli.cjs serve --config ./scenario.config.js --port 4300
  node scenario-test-cli.cjs init --project D:\\project
  node scenario-test-cli.cjs capabilities [--json]
  node scenario-test-cli.cjs doctor --config ./scenario.config.js [--json]

Options:
  --config <file>       场景配置文件
  --env <key>           配置中的环境 key
  --base-url <url>      临时覆盖 Base URL
  --scenario <id>       执行指定场景（可执行 manual:true 场景）
  --all                 执行配置中的全部自动场景（默认排除 manual:true）
  --fail-on-skip        存在任何 SKIP 步骤时最终退出码为 1（默认 false）
  --port <number>       浏览器服务端口，默认 4300
  --allow-external-plugins  允许加载外部插件（有安全风险）
  --json                capabilities/doctor 输出机器可读 JSON（stdout 纯净）

能力发现命令:
  capabilities          输出 DSL 能力清单（人类文本；--json 输出机器可读 JSON，
                        内容与 dist/scenario-test-capabilities.json 一致）
  doctor                项目静态体检：Node 版本、配置/场景加载、DSL 校验
                        与 AI 规则就绪检查；有 FAIL 时退出码 1

认证选项:
  环境变量 SCENARIO_AUTH       推荐方式，设置授权令牌
  --authorization <v>          （已弃用，仍兼容）命令行传递令牌

全局参数选项（追加到每个请求）:
  环境变量 SCENARIO_GLOBALS    JSON 数组，如 [{"type":"header","name":"X-Token","value":"abc"}]
                               支持 header / cookie / query 三种类型，覆盖配置中的同名参数

初始化选项:
  --project <path>      项目根目录
  --dir <name>          场景测试目录名
  --force               强制覆盖已有文件

示例:
  # 推荐: 使用环境变量
  export SCENARIO_AUTH="Bearer your-token"
  node scenario-test-cli.cjs --config scenario.config.js --all

  # 或从 .env 文件加载
  export $(cat .env | xargs)
  node scenario-test-cli.cjs --config scenario.config.js --all`);
}

function writeProjectFile(projectRoot, relativePath, content, force) {
    const target = path.resolve(projectRoot, relativePath);
    if (fs.existsSync(target) && !force) return false;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
    return true;
}

function resolveInitDirectory(projectRoot, value) {
    const directory = String(value || "scenario-test").trim().replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/\/+$/, "");
    const target = path.resolve(projectRoot, directory);
    const relative = path.relative(projectRoot, target);
    if (!directory || path.isAbsolute(directory) || relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error("--dir 必须是项目内的相对目录");
    }
    return directory;
}

async function initCommand(args) {
    const projectRoot = path.resolve(args.project || process.cwd());
    const directory = resolveInitDirectory(projectRoot, args.dir);
    const projectName = path.basename(projectRoot).trim() || "project";
    const storagePrefix = `scenario-test.${projectName.replace(/[^\p{L}\p{N}._-]+/gu, "-")}`;
    const layout = resolveProjectLayout(projectRoot, directory);
    const frameworkDirectory = ".scenario-test";
    // AI 规则/模式库是项目专属文件：重跑 init 时刷新（不覆盖用户项目配置与场景）
    const frameworkTemplatePaths = new Set([
        layout.frameworkRelativePath(FRAMEWORK_FILES.authoringPrompt),
        layout.frameworkRelativePath(FRAMEWORK_FILES.patterns)
    ]);
    const created = [];
    const skipped = [];
    for (const [relativePath, content] of Object.entries(createProjectFiles(directory, { storagePrefix, frameworkDirectory }))) {
        const overwrite = args.force || frameworkTemplatePaths.has(relativePath);
        (writeProjectFile(projectRoot, relativePath, content, overwrite) ? created : skipped).push(relativePath);
    }
    console.log(`已初始化项目: ${projectRoot}`);
    console.log(`项目布局: 内部文件位于 ${layout.frameworkRelativeDir}`);
    if (created.length) console.log(`已创建: ${created.join(", ")}`);
    if (skipped.length) console.log(`已保留现有文件: ${skipped.join(", ")}`);
    console.log(`浏览器工作台: ${path.join(projectRoot, directory, "index.html")}`);
    console.log("提示: 运行时由 npm 包提供（@youzhikeji/scenario-test），使用 npx @youzhikeji/scenario-test 执行命令。");
}

function resolveConfigPath(value) {
    const candidate = path.resolve(value || "scenario.config.js");
    if (!fs.existsSync(candidate)) throw new Error(`配置文件不存在: ${candidate}`);
    return candidate;
}

async function loadPlugins(config, configDir, options = {}) {
    const plugins = [];
    for (const pluginPath of config.nodePlugins || []) {
        // ✅ 验证插件路径
        let absolutePath;
        try {
            absolutePath = validatePath(configDir, pluginPath);
        } catch (error) {
            if (options.allowExternalPlugins) {
                // 明确允许外部插件
                console.warn(`⚠️  加载外部插件: ${pluginPath}`);
                absolutePath = path.resolve(pluginPath);
            } else {
                throw new Error(
                    `插件路径不安全: ${pluginPath}\n` +
                    `原因: ${error.message}\n` +
                    `提示: 插件必须在配置目录内 (${configDir})，或使用 --allow-external-plugins 标志`
                );
            }
        }

        const imported = await import(pathToFileURL(absolutePath).href);
        const factory = imported.default || imported;
        const pluginApi = { ...ScenarioTest };
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
    const envGlobals = parseGlobalsEnv();
    const environment = selectEnvironment(config, args.env);
    const entries = args.all
        ? config.scenarios.filter((item) => !item.manual)
        : config.scenarios.filter((item) => [item.id, item.name, item.url].includes(args.scenario || config.scenarios[0]?.id));
    if (!entries.length) {
        if (args.all && config.scenarios.length > 0 && config.scenarios.every((item) => item.manual)) {
            throw new Error("配置中的场景全部标记为 manual:true，--all 默认排除手动场景；请使用 --scenario <id> 显式执行");
        }
        throw new Error(args.scenario ? `未找到场景: ${args.scenario}` : "配置中没有可自动执行的场景");
    }
    const plugins = await loadPlugins(config, configDir, { allowExternalPlugins: args.allowExternalPlugins });
    const adapters = {};
    for (const plugin of plugins) Object.assign(adapters, plugin?.adapters || {});
    const baseOptions = {
        config,
        baseUrl: String(args.baseUrl || environment.baseUrl || config.baseUrl || "").replace(/\/+$/, ""),
        authorization: args.authorization || environment.authorization || config.authorization || "",
        globals: mergeGlobals(config.globals, environment.globals, envGlobals),
        requestTimeoutMs: config.requestTimeoutMs,
        vars: configVariables(config),
        environmentVariables: process.env,
        io: ScenarioTest.createNodeIo(configDir),
        adapters
    };
    if (!baseOptions.baseUrl) throw new Error("缺少 Base URL，请配置环境或传入 --base-url");
    let total = 0;
    let passedTotal = 0;
    let failedTotal = 0;
    let skippedTotal = 0;
    for (const entry of entries) {
        if (!entry.url) throw new Error(`场景 ${entry.id} 缺少 url`);
        const scenarioPath = path.isAbsolute(entry.url) ? entry.url : path.resolve(configDir, entry.url);
        let scenario = ScenarioTest.loadScenarioFile(scenarioPath, entry.id, ScenarioTest);
        scenario = await transformScenario(scenario, { config, configDir, entry, environment }, plugins);
        console.log(`\n# ${scenario.name} (${entry.id})`);
        const report = await ScenarioTest.createEngine(baseOptions).runScenario(scenario, {
            ...baseOptions,
            async onStep(result) {
                const mark = result.skipped ? "SKIP" : (result.passed ? "PASS" : "FAIL");
                console.log(`[${mark}] ${result.name} ${result.method} ${result.path} -> ${result.status} (${ScenarioTest.formatDuration(result.duration)})`);
                for (const warning of result.warnings || []) {
                    console.log(`  [WARN] ${warning}`);
                }
                for (const assertion of result.assertions.filter((item) => !item.passed)) {
                    console.log(`  - ${assertion.name}: expected=${JSON.stringify(assertion.expected)} actual=${JSON.stringify(assertion.actual)}`);
                }
            }
        });
        for (const plugin of plugins) {
            await plugin?.afterScenario?.(report, { config, configDir, entry, environment, scenario });
        }
        total += report.planned;
        passedTotal += report.passedSteps;
        // 因 failurePolicy:stop 未执行到位的步骤按失败统计；SKIP 步骤单独计数不并入失败
        failedTotal += report.failed + (report.planned - report.executed - report.skipped);
        skippedTotal += report.skipped;
        console.log(`Summary: passed=${report.passedSteps} failed=${report.failed} skipped=${report.skipped} executed=${report.executed}/${report.planned} planned (状态 ${report.status})`);
    }
    console.log(`\nOverall: ${passedTotal}/${total} passed`);
    if (failedTotal) process.exitCode = 1;
    if (args.failOnSkip && skippedTotal > 0) {
        console.log(`\n--fail-on-skip 已开启，存在 ${skippedTotal} 个 SKIP 步骤，退出码置为 1`);
        process.exitCode = 1;
    }
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
            else if (pathname === "/dist/scenario-test.umd.js") {
                // 仓库内示例的 index.html 引用 ../../dist/scenario-test.umd.js（浏览器规范化为 /dist/...）
                filePath = path.join(libraryDist, "scenario-test.umd.js");
            }
            else if (pathname === "/node_modules/@youzhikeji/scenario-test/dist/scenario-test.umd.js") {
                // 业务项目 index.html 引用 ../node_modules/@youzhikeji/scenario-test/dist/scenario-test.umd.js
                // （浏览器规范化为 /node_modules/...）；运行时只存在于 npm 包，从 CLI 所在 dist 提供
                filePath = path.join(libraryDist, "scenario-test.umd.js");
            }
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

function capabilitiesCommand(args) {
    const capabilities = buildCapabilities(contract);
    if (args.json) {
        // JSON 模式 stdout 纯净：只输出合法 JSON，不混入任何日志
        process.stdout.write(`${JSON.stringify(capabilities, null, 2)}\n`);
    } else {
        console.log(renderCapabilitiesText(capabilities));
    }
}

function doctorCommand(args) {
    // 配置缺失不提前抛错：把（可能不存在的）配置路径交给 doctor 汇总报告，
    // config 检查 FAIL 但版本/文件握手等其他检查继续执行，--json 仍输出结构化 JSON
    let configPath;
    let configDir;
    try {
        configPath = resolveConfigPath(args.config);
        configDir = path.dirname(configPath);
    } catch (error) {
        configPath = path.resolve(args.config || "scenario.config.js");
        configDir = path.dirname(configPath);
    }
    const report = buildDoctorReport({ configPath, api: ScenarioTest, configDir });
    if (args.json) {
        // JSON 模式 stdout 纯净：只输出合法 JSON
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else {
        console.log(renderDoctorText(report));
    }
    process.exitCode = report.exitCode;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) { printHelp(); return; }
    if (args.command === "init") await initCommand(args);
    else if (args.command === "serve") await serveCommand(args);
    else if (args.command === "capabilities") capabilitiesCommand(args);
    else if (args.command === "doctor") doctorCommand(args);
    else await runCommand(args);
}

main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
});
