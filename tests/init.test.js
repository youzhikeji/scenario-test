import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { CONTRACT_VERSION } from "../src/index.js";
import { VERSION } from "../src/version.generated.js";

const root = path.resolve(import.meta.dirname, "..");

test("init 创建项目入口，且默认不覆盖现有文件", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-"));
    try {
        const first = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(first.status, 0, first.stderr);
        const indexPath = path.join(project, "scenario-test", "index.html");
        const configPath = path.join(project, "scenario-test", "scenario.config.js");
        assert.match(fs.readFileSync(indexPath, "utf8"), /\.\/scenario-test\.umd\.js/);
        assert.match(fs.readFileSync(configPath, "utf8"), /ScenarioTest\.registerConfig/);
        assert.match(fs.readFileSync(configPath, "utf8"), /storagePrefix: "scenario-test\.scenario-test-init-/);
        assert.match(fs.readFileSync(configPath, "utf8"), /scenarios: \[]/);
        assert.equal(fs.existsSync(path.join(project, "scenario-test", "scenarios", "health.js")), false);
        assert.match(fs.readFileSync(path.join(project, "scenario-test", "scenario-test.umd.js"), "utf8"), /ScenarioTest/);
        // 框架管理产物：d.ts、能力清单、版本锁
        const dts = fs.readFileSync(path.join(project, "scenario-test", "scenario-test.d.ts"), "utf8");
        assert.match(dts, /export as namespace ScenarioTest;/);
        assert.match(dts, /AssertionOperator/);
        const capabilities = JSON.parse(fs.readFileSync(path.join(project, "scenario-test", "scenario-test-capabilities.json"), "utf8"));
        assert.equal(capabilities.schema, "scenario-test-capabilities");
        assert.equal(capabilities.version, VERSION);
        assert.equal(capabilities.contractVersion, CONTRACT_VERSION);
        const versionLockPath = path.join(project, "scenario-test", ".scenario-test-version.json");
        const versionLock = JSON.parse(fs.readFileSync(versionLockPath, "utf8"));
        assert.equal(typeof versionLock.runtimeVersion, "string");
        assert.equal(typeof versionLock.contractVersion, "number");
        assert.deepEqual(Object.keys(versionLock.files).sort(), ["capabilities", "cli", "dts", "umd"]);
        // src/cli.js 直跑时 CLI 不复制到项目（需 dist CLI），因此 cli 的 SHA256 可能缺失；
        // 实际写入的产物（umd/dts/capabilities）必须全部记录 SHA256
        for (const name of ["scenario-test.umd.js", "scenario-test.d.ts", "scenario-test-capabilities.json"]) {
            assert.equal(typeof versionLock.sha256[name], "string", `版本锁缺少 ${name} 的 SHA256`);
        }
        assert.equal(versionLock.source.type, "github-release");
        assert.equal(versionLock.source.repository, "youzhikeji/scenario-test");
        assert.doesNotMatch(JSON.stringify(versionLock.source), /^[A-Za-z]:[\\/]|[\\/]workspace[\\/]/, "版本锁 source 不得包含本机路径");
        const aiPrompt = fs.readFileSync(path.join(project, "scenario-test", "AI_SCENARIO_PROMPT.md"), "utf8");
        assert.match(aiPrompt, /AI 场景生成 Prompt/);
        assert.match(aiPrompt, /required: true/);
        assert.match(aiPrompt, /禁止配合 `retryUntil`/);
        assert.match(aiPrompt, /只断言已确认的 HTTP status/);
        assert.match(aiPrompt, /逐文件自检/);
        assert.match(fs.readFileSync(path.join(project, "scenario-test", "SCENARIO_PATTERNS.md"), "utf8"), /创建、查询、精确清理/);
        const readme = fs.readFileSync(path.join(project, "scenario-test", "README.md"), "utf8");
        assert.match(readme, /目录说明/);
        assert.match(readme, /配置环境和变量/);
        assert.match(readme, /浏览器工作台/);
        assert.match(readme, /常见问题/);
        assert.match(readme, /升级运行时/);
        assert.match(readme, /extract: \[\{ name: "orderId", path: "data\.id" \}\]/);
        assert.match(readme, /初始场景清单为空/);
        assert.equal(fs.existsSync(path.join(project, ".codex", "skills", "scenario-test", "SKILL.md")), false);

        fs.writeFileSync(configPath, "// 用户配置\n", "utf8");
        const second = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(second.status, 0, second.stderr);
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
            const result = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
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

test("init 支持自定义项目内场景目录", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-dir-"));
    try {
        const result = spawnSync(process.execPath, [
            path.join(root, "src/cli.js"), "init", "--project", project, "--dir", "scenario-test"
        ], { encoding: "utf8" });
        assert.equal(result.status, 0, result.stderr);
        assert.equal(fs.existsSync(path.join(project, "scenario-test", "index.html")), true);
        assert.equal(fs.existsSync(path.join(project, "dev", "场景测试", "index.html")), false);
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 重跑：版本锁版本一致时保留，不覆盖项目配置/场景", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-lock-"));
    try {
        const first = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(first.status, 0, first.stderr);
        const dir = path.join(project, "scenario-test");
        const lockPath = path.join(dir, ".scenario-test-version.json");
        const lockBefore = fs.readFileSync(lockPath, "utf8");
        const configPath = path.join(dir, "scenario.config.js");
        fs.writeFileSync(configPath, "// 用户配置\n", "utf8");
        fs.mkdirSync(path.join(dir, "scenarios"), { recursive: true });
        fs.writeFileSync(path.join(dir, "scenarios/user.js"), "// 用户场景\n", "utf8");
        const second = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(second.status, 0, second.stderr);
        assert.equal(fs.readFileSync(lockPath, "utf8"), lockBefore, "版本一致时版本锁不应被重写");
        assert.equal(fs.readFileSync(configPath, "utf8"), "// 用户配置\n", "项目配置不得被覆盖");
        assert.equal(fs.readFileSync(path.join(dir, "scenarios/user.js"), "utf8"), "// 用户场景\n", "项目场景不得被覆盖");
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 重跑：版本锁版本不一致时更新（框架管理文件），项目文件仍保留", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-lockup-"));
    try {
        const first = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(first.status, 0, first.stderr);
        const dir = path.join(project, "scenario-test");
        const lockPath = path.join(dir, ".scenario-test-version.json");
        const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        lock.runtimeVersion = "0.4.0";
        fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2), "utf8");
        const configPath = path.join(dir, "scenario.config.js");
        fs.writeFileSync(configPath, "// 用户配置\n", "utf8");
        const second = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(second.status, 0, second.stderr);
        const updated = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        assert.equal(updated.runtimeVersion, VERSION);
        assert.equal(updated.contractVersion, CONTRACT_VERSION);
        assert.equal(fs.readFileSync(configPath, "utf8"), "// 用户配置\n", "项目配置不得被覆盖");
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("构建后的单个 CLI 可在无相邻 UMD 且下载地址不可用时初始化", () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-offline-init-"));
    try {
        const downloadDir = path.join(rootDir, "download");
        const project = path.join(rootDir, "project");
        fs.mkdirSync(downloadDir, { recursive: true });
        fs.mkdirSync(project, { recursive: true });
        const cli = path.join(downloadDir, "scenario-test-cli.cjs");
        fs.copyFileSync(path.join(root, "dist", "scenario-test-cli.cjs"), cli);
        assert.equal(fs.existsSync(path.join(downloadDir, "scenario-test.umd.js")), false);

        const result = spawnSync(process.execPath, [
            cli,
            "init",
            "--project", project,
            "--library-url", "http://127.0.0.1:1/unreachable.js"
        ], { encoding: "utf8", timeout: 10000 });

        assert.equal(result.status, 0, result.stderr || result.error?.message);
        const target = path.join(project, "scenario-test");
        assert.match(fs.readFileSync(path.join(target, "scenario-test.umd.js"), "utf8"), /ScenarioTest/);
        assert.equal(fs.existsSync(path.join(target, "scenario-test-cli.cjs")), true);
        assert.match(fs.readFileSync(path.join(target, "scenario.config.js"), "utf8"), /scenarios: \[]/);
    } finally {
        fs.rmSync(rootDir, { recursive: true, force: true });
    }
});
