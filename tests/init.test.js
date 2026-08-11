import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { CONTRACT_VERSION } from "../src/index.js";
import { VERSION } from "../src/version.generated.js";

const root = path.resolve(import.meta.dirname, "..");
const cli = path.join(root, "src/cli.js");

function runInit(project, ...args) {
    return spawnSync(process.execPath, [cli, "init", "--project", project, ...args], { encoding: "utf8" });
}

function assertGeneratedLayout(project, directory = "scenario-test") {
    const publicDir = path.join(project, ...directory.split("/"));
    const frameworkDir = path.join(publicDir, ".scenario-test");
    assert.deepEqual(fs.readdirSync(publicDir).sort(), [".scenario-test", "README.md", "index.html", "scenario.config.js", "start-scenario-test.cmd"]);
    // src 环境运行 init：无发行版 CLI（.cjs）可复制，其余运行时副本与版本锁落盘
    assert.deepEqual(fs.readdirSync(frameworkDir).sort(), [
        ".scenario-test-version.json",
        "AI_SCENARIO_PROMPT.md",
        "SCENARIO_PATTERNS.md",
        "scenario-test-capabilities.json",
        "scenario-test.d.ts",
        "scenario-test.umd.js"
    ]);
    assert.match(
        fs.readFileSync(path.join(publicDir, "index.html"), "utf8"),
        /src="\.\/\.scenario-test\/scenario-test\.umd\.js"/
    );
    const startScript = fs.readFileSync(path.join(publicDir, "start-scenario-test.cmd"), "utf8");
    assert.ok(startScript.includes('"%~dp0.scenario-test\\scenario-test-cli.cjs" serve'), "cmd 应调用 .scenario-test 内 CLI 副本");
    assert.match(startScript, /scenario\.config\.js/);
    assert.match(startScript, /Start-Process/);
    assert.match(
        fs.readFileSync(path.join(publicDir, "scenario.config.js"), "utf8"),
        /reference types="@yc_yzkj\/scenario-test"/
    );
    const lock = JSON.parse(fs.readFileSync(path.join(frameworkDir, ".scenario-test-version.json"), "utf8"));
    assert.equal(lock.runtimeVersion, VERSION);
    assert.equal(lock.contractVersion, CONTRACT_VERSION);
    assert.ok(lock.files.umd && lock.files.dts && lock.files.capabilities);
    return { publicDir, frameworkDir };
}

test("init 创建 npm-only 项目入口，且默认不覆盖项目文件", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-"));
    try {
        const first = runInit(project);
        assert.equal(first.status, 0, first.stderr);
        const { publicDir, frameworkDir } = assertGeneratedLayout(project);
        const configPath = path.join(publicDir, "scenario.config.js");
        assert.match(fs.readFileSync(configPath, "utf8"), /ScenarioTest\.registerConfig/);
        assert.match(fs.readFileSync(configPath, "utf8"), /storagePrefix: "scenario-test\.scenario-test-init-/);
        assert.match(fs.readFileSync(configPath, "utf8"), /scenarios: \[]/);
        assert.equal(fs.existsSync(path.join(publicDir, "scenarios", "health.js")), false);

        const aiPrompt = fs.readFileSync(path.join(frameworkDir, "AI_SCENARIO_PROMPT.md"), "utf8");
        assert.match(aiPrompt, /AI 业务功能场景生成规则/);
        assert.match(aiPrompt, /用户不需要复制或粘贴本文件/);
        assert.match(aiPrompt, /只处理本次指定的一个业务功能/);
        assert.match(aiPrompt, /功能卡片/);
        assert.match(aiPrompt, /场景矩阵/);
        assert.match(aiPrompt, /不把多个业务功能串成一个大场景/);
        assert.match(aiPrompt, /required: true/);
        assert.match(aiPrompt, /逐文件自检/);

        const patterns = fs.readFileSync(path.join(frameworkDir, "SCENARIO_PATTERNS.md"), "utf8");
        assert.match(patterns, /创建、查询、精确清理/);
        assert.match(patterns, /业务功能是边界，场景是该功能下的一条独立验证路径/);
        assert.match(patterns, /不同验证路径使用独立场景/);

        const readme = fs.readFileSync(path.join(publicDir, "README.md"), "utf8");
        assert.match(readme, /不需要再次复制任何 Prompt/);
        assert.match(readme, /npx @yc_yzkj\/scenario-test/);
        assert.match(readme, /AI 负责维护 `scenario\.config\.js` 和 `scenarios\/`/);
        assert.match(readme, /一次只处理一个业务功能/);

        fs.writeFileSync(configPath, "// 用户配置\n", "utf8");
        const scenarioDir = path.join(publicDir, "scenarios");
        fs.mkdirSync(scenarioDir);
        fs.writeFileSync(path.join(scenarioDir, "user.js"), "// 用户场景\n", "utf8");
        const second = runInit(project);
        assert.equal(second.status, 0, second.stderr);
        assert.equal(fs.readFileSync(configPath, "utf8"), "// 用户配置\n");
        assert.equal(fs.readFileSync(path.join(scenarioDir, "user.js"), "utf8"), "// 用户场景\n");
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 重跑刷新 AI 规则与模式库，不覆盖项目配置", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-refresh-"));
    try {
        const first = runInit(project);
        assert.equal(first.status, 0, first.stderr);
        const publicDir = path.join(project, "scenario-test");
        const frameworkDir = path.join(publicDir, ".scenario-test");
        const configPath = path.join(publicDir, "scenario.config.js");
        fs.writeFileSync(path.join(frameworkDir, "AI_SCENARIO_PROMPT.md"), "# 旧规则\n", "utf8");
        fs.writeFileSync(path.join(frameworkDir, "SCENARIO_PATTERNS.md"), "# 旧模式\n", "utf8");
        fs.writeFileSync(configPath, "// 用户配置\n", "utf8");

        const second = runInit(project);
        assert.equal(second.status, 0, second.stderr);
        assert.match(fs.readFileSync(path.join(frameworkDir, "AI_SCENARIO_PROMPT.md"), "utf8"), /AI 业务功能场景生成规则/);
        assert.match(fs.readFileSync(path.join(frameworkDir, "SCENARIO_PATTERNS.md"), "utf8"), /业务功能场景模式库/);
        assert.equal(fs.readFileSync(configPath, "utf8"), "// 用户配置\n");
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 为不同项目生成独立浏览器存储前缀", () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-prefix-"));
    try {
        const firstProject = path.join(rootDir, "project-a");
        const secondProject = path.join(rootDir, "project-b");
        fs.mkdirSync(firstProject);
        fs.mkdirSync(secondProject);
        for (const project of [firstProject, secondProject]) {
            const result = runInit(project);
            assert.equal(result.status, 0, result.stderr);
        }
        const firstConfig = fs.readFileSync(path.join(firstProject, "scenario-test", "scenario.config.js"), "utf8");
        const secondConfig = fs.readFileSync(path.join(secondProject, "scenario-test", "scenario.config.js"), "utf8");
        assert.match(firstConfig, /storagePrefix: "scenario-test\.project-a"/);
        assert.match(secondConfig, /storagePrefix: "scenario-test\.project-b"/);
        assert.notEqual(firstConfig, secondConfig);
    } finally {
        fs.rmSync(rootDir, { recursive: true, force: true });
    }
});

test("init 支持嵌套项目内场景目录，浏览器 UMD 使用根路径", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-dir-"));
    try {
        const result = runInit(project, "--dir", "dev/场景测试");
        assert.equal(result.status, 0, result.stderr);
        const { publicDir } = assertGeneratedLayout(project, "dev/场景测试");
        const index = fs.readFileSync(path.join(publicDir, "index.html"), "utf8");
        assert.match(index, /src="\.\/\.scenario-test\/scenario-test\.umd\.js"/);
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 统一迁移到 .scenario-test，不再采用旧平铺布局", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-legacy-"));
    try {
        const publicDir = path.join(project, "scenario-test");
        fs.mkdirSync(publicDir, { recursive: true });
        fs.writeFileSync(path.join(publicDir, "AI_SCENARIO_PROMPT.md"), "# 旧平铺规则\n", "utf8");
        fs.writeFileSync(path.join(publicDir, "index.html"), '<script src="./scenario-test.umd.js"></script>\n', "utf8");

        const result = runInit(project);
        assert.equal(result.status, 0, result.stderr);
        assert.equal(fs.existsSync(path.join(publicDir, ".scenario-test", "AI_SCENARIO_PROMPT.md")), true);
        assert.equal(fs.readFileSync(path.join(publicDir, "AI_SCENARIO_PROMPT.md"), "utf8"), "# 旧平铺规则\n");
        assert.equal(fs.readFileSync(path.join(publicDir, "index.html"), "utf8"), '<script src="./scenario-test.umd.js"></script>\n');
        // 运行时副本仍按当前版本落盘到 .scenario-test/（平铺旧文件不删除，由用户决定清理）
        assert.equal(fs.existsSync(path.join(publicDir, ".scenario-test", "scenario-test.umd.js")), true);
        assert.equal(fs.existsSync(path.join(publicDir, ".scenario-test", ".scenario-test-version.json")), true);
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 在 .scenario-test 被同名文件占用时给出明确错误", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-internal-file-"));
    try {
        const dir = path.join(project, "scenario-test");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, ".scenario-test"), "occupied\n", "utf8");
        const result = runInit(project);
        assert.equal(result.status, 1);
        assert.match(result.stderr, /\.scenario-test 必须是目录/);
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});
