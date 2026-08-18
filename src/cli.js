import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import crypto from "node:crypto";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";
import * as ScenarioTest from "./node.js";
import { createProjectFiles, DEFAULT_LIBRARY_URL } from "./init-templates.js";
import { contract, CONTRACT_VERSION } from "./contract.js";
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
    const args = { command: "run", all: false, config: "", scenario: "", env: "", baseUrl: "", authorization: "", port: 4300, project: "", dir: "", force: false, noInput: false, allowExternalPlugins: false, failOnSkip: false, json: false, help: false };
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
        else if (start === 0 && contract.cli.commands.includes(item)) {
            // 命令必须紧跟脚本名；命令出现在参数位置（argv[0] 非命令）时是写反了，
            // 与其静默当成 run 的场景名报"未找到场景"，不如直接给出正确写法
            throw new Error(
                `命令 ${item} 必须放在第一个参数位置，正确示例: ${item} --config scenario.config.js\n` +
                `若确需执行同名场景，请使用 --scenario ${item}`
            );
        }
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
  --all                 执行配置中的全部自动场景（默认排除 manual:true；
                        未指定 --all/--scenario 时仅执行清单第一个场景）
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
  --no-input            非交互：目标目录已存在时保留配置与场景，仅刷新 AI 规则和运行时副本
  --library-url <url>   init 运行时副本下载目录（CLI/UMD/d.ts/capabilities，默认 GitHub Tag dist）

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

// 目标目录已存在时询问覆盖方式；非交互环境（CI、脚本、管道）自动采用默认保留行为，避免卡住
async function askInitMode(directory) {
    if (!process.stdin.isTTY) return "keep";
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    try {
        const answer = await rl.question(
            `目标目录 ${directory} 已存在。\n` +
                `  [o] 覆盖已有文件（等价 --force）\n` +
                `  [k] 保留现有文件，仅刷新 AI 规则（默认）\n` +
                `  [c] 取消\n` +
                `请选择 (k): `
        );
        const choice = answer.trim().toLowerCase();
        if (choice === "o") return "overwrite";
        if (choice === "c") return "cancel";
        return "keep";
    } finally {
        rl.close();
    }
}

function sha256File(filePath) {
    return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function runtimeSourceCandidates(fileName) {
    return [
        path.resolve(path.dirname(process.argv[1]), fileName),
        path.resolve(path.dirname(process.argv[1]), "../dist", fileName)
    ];
}

// 把当前 CLI 自身复制为项目运行时副本（npx 与本地 CLI 均可用，source 以 .cjs 结尾为准）
function copyRuntimeCli(layout, force) {
    const target = layout.frameworkPath(FRAMEWORK_FILES.cli);
    if (fs.existsSync(target) && !force) return false;
    const source = path.resolve(process.argv[1]);
    if (!source.endsWith(".cjs")) return null;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    return true;
}

// 运行时副本统一入口：本机 dist 拷贝优先，--library-url 远程下载兜底（CLI/UMD/d.ts/capabilities 通用）
async function ensureRuntimeFile(layout, fileName, libraryUrl, force) {
    const target = layout.frameworkPath(fileName);
    if (fs.existsSync(target) && !force) return false;
    const source = runtimeSourceCandidates(fileName).find((candidate) => fs.existsSync(candidate));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (source) {
        fs.copyFileSync(source, target);
        return true;
    }
    if (!libraryUrl) return null;
    const base = libraryUrl.replace(/\/+$/, "") + "/";
    try {
        const response = await fetch(`${base}${fileName}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
        return true;
    } catch (error) {
        console.warn(`警告: ${fileName} 下载失败（${error.message}）`);
        return null;
    }
}

// 版本锁：记录 runtimeVersion/contractVersion 与各运行时文件 SHA256，doctor 据此握手
function writeVersionLock(layout) {
    const target = layout.frameworkPath(FRAMEWORK_FILES.versionLock);
    const fileNames = [FRAMEWORK_FILES.cli, FRAMEWORK_FILES.umd, FRAMEWORK_FILES.dts, FRAMEWORK_FILES.capabilities];
    const sha256 = {};
    for (const fileName of fileNames) {
        const filePath = layout.frameworkPath(fileName);
        if (fs.existsSync(filePath)) sha256[fileName] = sha256File(filePath);
    }
    const lock = {
        runtimeVersion: VERSION,
        contractVersion: CONTRACT_VERSION,
        files: {
            cli: FRAMEWORK_FILES.cli,
            umd: FRAMEWORK_FILES.umd,
            dts: FRAMEWORK_FILES.dts,
            capabilities: FRAMEWORK_FILES.capabilities
        },
        sha256
    };
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
    return true;
}

// 锁缺失/损坏/版本不一致或任一运行时文件缺失时刷新副本
function shouldRefreshFramework(layout, force) {
    if (force) return true;
    const runtimeFileNames = [FRAMEWORK_FILES.cli, FRAMEWORK_FILES.umd, FRAMEWORK_FILES.dts, FRAMEWORK_FILES.capabilities];
    // 任一运行时文件缺失即刷新（覆盖"锁缺失"与"副本不完整"两种情况）
    if (runtimeFileNames.some((fileName) => !fs.existsSync(layout.frameworkPath(fileName)))) return true;
    const lockPath = layout.frameworkPath(FRAMEWORK_FILES.versionLock);
    if (!fs.existsSync(lockPath)) return true;
    let lock;
    try {
        lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    } catch {
        return true;
    }
    if (lock.runtimeVersion !== VERSION || lock.contractVersion !== CONTRACT_VERSION) return true;
    // 版本锁声明的 sha256 与磁盘实际不符（文件被篡改/损坏/手工替换）时也刷新，保证副本可信。
    // 仅校验"锁里登记过的文件"：跳过锁未登记的文件，避免升级期间 lock 尚未更新的新版副本被误刷。
    return runtimeFileNames.some((fileName) => {
        const expected = lock.sha256?.[fileName];
        return !!expected && sha256File(layout.frameworkPath(fileName)) !== expected;
    });
}

function recordRuntimeResult(created, skipped, relativePath, status) {
    if (status === true) created.push(relativePath);
    else if (status === false) skipped.push(relativePath);
}

async function initCommand(args) {
    const projectRoot = path.resolve(args.project || process.cwd());
    const directory = resolveInitDirectory(projectRoot, args.dir);
    const projectName = path.basename(projectRoot).trim() || "project";
    const storagePrefix = `scenario-test.${projectName.replace(/[^\p{L}\p{N}._-]+/gu, "-")}`;
    const layout = resolveProjectLayout(projectRoot, directory);
    const frameworkDirectory = ".scenario-test";
    // 目标目录已存在且未显式 --force 时，由用户选择覆盖方式；
    // --no-input 或非交互环境（CI、脚本、管道）自动采用默认保留行为，避免卡住
    let force = args.force;
    if (!force && fs.existsSync(path.join(projectRoot, directory)) && !args.noInput) {
        const mode = await askInitMode(directory);
        if (mode === "cancel") {
            console.log("已取消初始化。");
            return;
        }
        force = mode === "overwrite";
    }
    // 运行时副本在锁缺失/版本不一致/sha256 失配/文件缺失时刷新（升级旧副本的关键路径）。
    // 仅影响运行时副本与版本锁的刷新，不改变模板文件的 keep 语义。
    const refreshFramework = shouldRefreshFramework(layout, force);
    // AI 规则/模式库随每次 init 刷新（keep 语义：不覆盖项目配置与场景）；
    // 运行时副本的刷新决策已并入上方 refreshFramework
    const frameworkTemplatePaths = new Set([
        layout.frameworkRelativePath(FRAMEWORK_FILES.authoringPrompt),
        layout.frameworkRelativePath(FRAMEWORK_FILES.patterns)
    ]);
    const created = [];
    const skipped = [];
    for (const [relativePath, content] of Object.entries(createProjectFiles(directory, { storagePrefix, frameworkDirectory }))) {
        const overwrite = force || frameworkTemplatePaths.has(relativePath);
        (writeProjectFile(projectRoot, relativePath, content, overwrite) ? created : skipped).push(relativePath);
    }
    const libraryUrl = args.libraryUrl || DEFAULT_LIBRARY_URL;
    recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.cli), copyRuntimeCli(layout, refreshFramework) ?? await ensureRuntimeFile(layout, FRAMEWORK_FILES.cli, libraryUrl, refreshFramework));
    recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.umd), await ensureRuntimeFile(layout, FRAMEWORK_FILES.umd, libraryUrl, refreshFramework));
    recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.dts), await ensureRuntimeFile(layout, FRAMEWORK_FILES.dts, libraryUrl, refreshFramework));
    recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.capabilities), await ensureRuntimeFile(layout, FRAMEWORK_FILES.capabilities, libraryUrl, refreshFramework));
    // 运行时副本必须齐全才能写版本锁：任一文件缺失即明确失败（退出码 1），
    // 避免下载失败后仍落锁、init 假成功导致不完整安装
    const runtimeFileNames = [FRAMEWORK_FILES.cli, FRAMEWORK_FILES.umd, FRAMEWORK_FILES.dts, FRAMEWORK_FILES.capabilities];
    const missingRuntimeFiles = runtimeFileNames.filter((fileName) => !fs.existsSync(layout.frameworkPath(fileName)));
    if (missingRuntimeFiles.length) {
        throw new Error(
            `运行时副本不完整，缺少: ${missingRuntimeFiles.join(", ")}\n` +
            `请检查 --library-url（${libraryUrl}）指向的目录是否包含全部 4 个文件，` +
            "或确认本机 dist 可用后重跑 init"
        );
    }
    recordRuntimeResult(created, skipped, layout.frameworkRelativePath(FRAMEWORK_FILES.versionLock), writeVersionLock(layout));
    console.log(`已初始化项目: ${projectRoot}`);
    console.log(`项目布局: 内部文件位于 ${layout.frameworkRelativeDir}`);
    if (created.length) console.log(`已创建: ${created.join(", ")}`);
    if (skipped.length) console.log(`已保留现有文件: ${skipped.join(", ")}`);
    console.log(`浏览器工作台: ${path.join(projectRoot, directory, "index.html")}`);
    console.log("提示: 双击 start-scenario-test.cmd 启动工作台；serve 会自动启用同源接口代理，绕开浏览器 CORS。");
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
        // 与 doctor 一致：相对路径必须位于配置目录内（防路径遍历），绝对路径保持兼容
        let scenarioPath;
        if (path.isAbsolute(entry.url)) scenarioPath = entry.url;
        else {
            try {
                scenarioPath = validatePath(configDir, entry.url);
            } catch (error) {
                throw new Error(
                    `场景 ${entry.id} 的 url 不安全: ${entry.url}\n` +
                    `原因: ${error.message}\n` +
                    "url 必须是配置目录内的相对路径"
                );
            }
        }
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

function serveStaticFile(response, filePath) {
    const headers = { "Cache-Control": "no-store", "Content-Type": contentType(filePath) };
    if (path.extname(filePath).toLowerCase() !== ".html") {
        const stream = fs.createReadStream(filePath);
        stream.on("error", () => {
            if (response.headersSent) { response.destroy(); return; }
            response.writeHead(500);
            response.end("Internal Server Error");
        });
        stream.on("open", () => {
            response.writeHead(200, headers);
            stream.pipe(response);
        });
        return;
    }
    fs.readFile(filePath, "utf8", function (error, html) {
        if (error) {
            response.writeHead(500);
            response.end("Internal Server Error");
            return;
        }
        const marker = "<script>window.__SCENARIO_TEST_SERVE_PROXY__ = true;</script>";
        const headPattern = /<head(?:\s[^>]*)?>/i;
        const content = headPattern.test(html)
            ? html.replace(headPattern, function (head) { return head + marker; })
            : marker + html;
        response.writeHead(200, headers);
        response.end(content);
    });
}

function resolveServeProxyTarget(config, envKey) {
    // serve 保留环境 baseUrl 作为上游目标，并在返回的 HTML 中注入代理模式标记让浏览器强制使用当前同源地址
    if (config.envs?.length) {
        // 与 run 的 selectEnvironment 一致：环境不存在时报错退出。
        // 静默回退 envs[0] 会把请求代理到错误后端（可能是生产），且日志仍显示用户输入的环境名
        const environment = selectEnvironment(config, envKey);
        return { key: environment.key, target: String(environment.baseUrl || "").replace(/\/+$/, "") };
    }
    return { key: config.defaultEnvKey || "default", target: String(config.baseUrl || "").replace(/\/+$/, "") };
}

// 转发时剔除 hop-by-hop 头（RFC 7230 §6.1），避免把客户端连接语义泄漏给上游；
// Node 会按 targetUrl 重建 host/connection，显式删除可防止冲突。
const HOP_BY_HOP_HEADERS = new Set([
    "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
    "te", "trailer", "transfer-encoding", "upgrade", "host"
]);

function respondProxyError(response, message) {
    if (response.headersSent) { response.destroy(); return; }
    response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(message);
}

// 按代理目标协议选择转发模块；无法识别（缺 http(s):// 前缀或非法 URL）时返回 null，
// 由调用方降级为 502 提示——代理目标错误属于配置问题，不应让 serve 进程退出。
function proxyTransport(targetUrl) {
    try {
        const protocol = new URL(targetUrl).protocol;
        if (protocol === "https:") return https;
        if (protocol === "http:") return http;
    } catch {
        return null;
    }
    return null;
}

function proxyRequest(request, response, targetUrl) {
    const transport = proxyTransport(targetUrl);
    if (!transport) {
        respondProxyError(
            response,
            `Bad Gateway: 接口代理目标无效: ${targetUrl}\n` +
            "请检查环境 baseUrl，必须带协议前缀（http:// 或 https://）"
        );
        return;
    }
    const headers = {};
    for (const [name, value] of Object.entries(request.headers)) {
        if (!HOP_BY_HOP_HEADERS.has(String(name).toLowerCase())) headers[name] = value;
    }
    let upstream;
    try {
        // 保持原拼接语义：targetUrl 已去尾部斜杠，若带路径前缀则原样保留
        upstream = transport.request(targetUrl + request.url, {
            method: request.method,
            headers,
            // serve 是本地联调代理，内网 https 后端普遍使用自签证书；
            // 与 vite/webpack-dev-server 的 proxy secure:false 同语义，放宽上游证书校验
            ...(transport === https ? { rejectUnauthorized: false } : {})
        }, (upstreamResponse) => {
            // 响应方向同样剔除 hop-by-hop 头，避免把上游连接语义（transfer-encoding/keep-alive 等）透传给浏览器
            const responseHeaders = {};
            for (const [name, value] of Object.entries(upstreamResponse.headers)) {
                if (!HOP_BY_HOP_HEADERS.has(String(name).toLowerCase())) responseHeaders[name] = value;
            }
            response.writeHead(upstreamResponse.statusCode || 502, responseHeaders);
            upstreamResponse.pipe(response);
        });
    } catch (error) {
        // 请求构造阶段（非法 URL 等）可能同步抛错，此处兜底为 502
        respondProxyError(response, `Bad Gateway: 接口代理请求构造失败: ${error.message}`);
        return;
    }
    upstream.setTimeout(30000, () => {
        upstream.destroy(new Error("接口代理超时"));
    });
    upstream.on("error", () => {
        respondProxyError(response, "Bad Gateway: 无法连接接口代理目标或代理超时");
    });
    request.pipe(upstream);
}

// Host 白名单：serve 绑定 127.0.0.1 仅供本机回环访问。校验 Host 头可阻断 DNS rebinding 等
// 跨源读取（攻击域名解析到 127.0.0.1 后，浏览器请求仍会携带攻击者的 Host），
// 与 vite/webpack-dev-server 的 host 校验同类加固
function isAllowedServeHost(hostHeader, port) {
    const host = String(hostHeader || "").trim().toLowerCase();
    return [`127.0.0.1:${port}`, `localhost:${port}`, `[::1]:${port}`, "127.0.0.1", "localhost", "[::1]"].includes(host);
}

async function serveCommand(args) {
    const configPath = resolveConfigPath(args.config);
    const workspace = path.dirname(configPath);
    const libraryDist = path.dirname(path.resolve(process.argv[1]));
    const config = ScenarioTest.loadConfigFile(configPath, ScenarioTest);
    const { key: proxyEnvKey, target: proxyTarget } = resolveServeProxyTarget(config, args.env);
    const server = http.createServer((request, response) => {
        try {
            if (!isAllowedServeHost(request.headers.host, args.port)) {
                response.writeHead(403);
                response.end("Forbidden");
                return;
            }
            const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
            let filePath;
            if (pathname === "/__scenario-test__/scenario-test.umd.js") filePath = path.join(libraryDist, "scenario-test.umd.js");
            else if (pathname === "/dist/scenario-test.umd.js") {
                // 仓库内示例的 index.html 引用 ../../dist/scenario-test.umd.js（浏览器规范化为 /dist/...）
                filePath = path.join(libraryDist, "scenario-test.umd.js");
            }
            else if (pathname === "/node_modules/@yc_yzkj/scenario-test/dist/scenario-test.umd.js") {
                // 兼容 npm 包路径引用；运行时副本优先由项目 .scenario-test/ 提供
                filePath = path.join(libraryDist, "scenario-test.umd.js");
            }
            else {
                const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
                filePath = safeFile(workspace, relativePath);
            }
            if (!filePath) { response.writeHead(403); response.end("Forbidden"); return; }
            fs.stat(filePath, (error, stat) => {
                if (error || !stat.isFile()) {
                    // 静态文件未命中且配置了接口代理时，按同源请求转发到后端，绕开浏览器 CORS
                    if (proxyTarget) { proxyRequest(request, response, proxyTarget); return; }
                    response.writeHead(404); response.end("Not Found"); return;
                }
                serveStaticFile(response, filePath);
            });
        } catch {
            response.writeHead(400);
            response.end("Bad Request");
        }
    });
    server.on("error", (error) => {
        if (error?.code === "EADDRINUSE") {
            console.error(`端口 ${args.port} 已被占用，请重新启动以获取新的随机端口`);
            process.exitCode = 1;
            return;
        }
        console.error(`场景测试工作台启动失败: ${error?.message || String(error)}`);
        process.exitCode = 1;
    });
    server.listen(args.port, "127.0.0.1", () => {
        console.log(`场景测试工作台: http://127.0.0.1:${args.port}/`);
        console.log(`配置目录: ${workspace}`);
        if (proxyTarget) console.log(`接口代理: ${proxyEnvKey} -> ${proxyTarget}`);
        console.log("提示: serve 已自动启用同源接口代理；浏览器请求会先到当前工作台地址。双击项目内 start-scenario-test.cmd 可一键启动。");
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
