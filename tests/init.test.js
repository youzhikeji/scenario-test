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
        const publicDir = path.join(project, "scenario-test");
        const indexPath = path.join(publicDir, "index.html");
        const configPath = path.join(publicDir, "scenario.config.js");
        const frameworkDir = path.join(publicDir, ".scenario-test");
        assert.deepEqual(fs.readdirSync(publicDir).sort(), [".scenario-test", "README.md", "index.html", "scenario.config.js"]);
        assert.match(fs.readFileSync(indexPath, "utf8"), /\.\/\.scenario-test\/scenario-test\.umd\.js/);
        assert.match(fs.readFileSync(configPath, "utf8"), /ScenarioTest\.registerConfig/);
        assert.match(fs.readFileSync(configPath, "utf8"), /reference path="\.\/\.scenario-test\/scenario-test\.d\.ts"/);
        assert.match(fs.readFileSync(configPath, "utf8"), /storagePrefix: "scenario-test\.scenario-test-init-/);
        assert.match(fs.readFileSync(configPath, "utf8"), /scenarios: \[]/);
        assert.equal(fs.existsSync(path.join(project, "scenario-test", "scenarios", "health.js")), false);
        assert.match(fs.readFileSync(path.join(frameworkDir, "scenario-test.umd.js"), "utf8"), /ScenarioTest/);
        // 框架管理产物统一放入隐藏内部目录
        const dts = fs.readFileSync(path.join(frameworkDir, "scenario-test.d.ts"), "utf8");
        assert.match(dts, /export as namespace ScenarioTest;/);
        assert.match(dts, /AssertionOperator/);
        const capabilities = JSON.parse(fs.readFileSync(path.join(frameworkDir, "scenario-test-capabilities.json"), "utf8"));
        assert.equal(capabilities.schema, "scenario-test-capabilities");
        assert.equal(capabilities.version, VERSION);
        assert.equal(capabilities.contractVersion, CONTRACT_VERSION);
        const versionLockPath = path.join(frameworkDir, ".scenario-test-version.json");
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
        const aiPrompt = fs.readFileSync(path.join(frameworkDir, "AI_SCENARIO_PROMPT.md"), "utf8");
        assert.match(aiPrompt, /AI 业务功能场景生成规则/);
        assert.match(aiPrompt, /用户不需要复制或粘贴本文件/);
        assert.match(aiPrompt, /安装和 doctor/);
        assert.doesNotMatch(aiPrompt, /第一阶段|将本文件完整交给/);
        assert.match(aiPrompt, /required: true/);
        assert.match(aiPrompt, /禁止配合 `retryUntil`/);
        assert.match(aiPrompt, /只断言已确认的 HTTP status/);
        assert.match(aiPrompt, /逐文件自检/);
        assert.match(aiPrompt, /只处理本次指定的一个业务功能/);
        assert.match(aiPrompt, /功能卡片/);
        assert.match(aiPrompt, /场景矩阵/);
        assert.match(aiPrompt, /不把多个业务功能串成一个大场景/);
        assert.doesNotMatch(aiPrompt, /一条场景对应一条完整业务流/);
        const patterns = fs.readFileSync(path.join(frameworkDir, "SCENARIO_PATTERNS.md"), "utf8");
        assert.match(patterns, /创建、查询、精确清理/);
        assert.match(patterns, /业务功能是边界，场景是该功能下的一条独立验证路径/);
        assert.match(patterns, /scenarios\/.*功能标识.*验证路径.*\.js/);
        assert.match(patterns, /不同验证路径使用独立场景/);
        for (const fileName of [
            "AI_SCENARIO_PROMPT.md",
            "SCENARIO_PATTERNS.md",
            "scenario-test.umd.js",
            "scenario-test.d.ts",
            "scenario-test-capabilities.json",
            ".scenario-test-version.json"
        ]) {
            assert.equal(fs.existsSync(path.join(project, "scenario-test", fileName)), false, `${fileName} 不应平铺在业务目录`);
        }
        const readme = fs.readFileSync(path.join(project, "scenario-test", "README.md"), "utf8");
        assert.match(readme, /不需要再次复制任何 Prompt/);
        assert.match(readme, /\.scenario-test\/AI_SCENARIO_PROMPT\.md/);
        assert.match(readme, /node scenario-test\/\.scenario-test\/scenario-test-cli\.cjs/);
        assert.match(readme, /AI 负责维护 `scenario\.config\.js` 和 `scenarios\/`/);
        assert.match(readme, /一次只处理一个业务功能/);
        assert.match(readme, /场景矩阵/);
        assert.match(readme, /scenarios\/.*功能标识.*验证路径.*\.js/);
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

test("init 在 .scenario-test 被同名文件占用时给出明确错误", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-internal-file-"));
    try {
        const dir = path.join(project, "scenario-test");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, ".scenario-test"), "occupied\n", "utf8");

        const result = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(result.status, 1);
        assert.match(result.stderr, /\.scenario-test 必须是目录/);
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 通过旧 index.html 引用识别平铺布局", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-legacy-index-"));
    try {
        const dir = path.join(project, "scenario-test");
        fs.mkdirSync(dir, { recursive: true });
        const legacyIndex = '<script src="./scenario-test.umd.js"></script>\n';
        fs.writeFileSync(path.join(dir, "index.html"), legacyIndex, "utf8");

        const result = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, /兼容旧版平铺布局/);
        assert.equal(fs.existsSync(path.join(dir, ".scenario-test")), false);
        assert.equal(fs.existsSync(path.join(dir, "scenario-test.umd.js")), true);
        assert.equal(fs.readFileSync(path.join(dir, "index.html"), "utf8"), legacyIndex);
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 检测到旧平铺文件时保持旧布局，不混用隐藏目录", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-legacy-"));
    try {
        const dir = path.join(project, "scenario-test");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "AI_SCENARIO_PROMPT.md"), "# 用户保留的旧版 Prompt\n", "utf8");

        const result = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, /兼容旧版平铺布局/);
        assert.equal(fs.existsSync(path.join(dir, ".scenario-test")), false);
        assert.equal(fs.existsSync(path.join(dir, "scenario-test.umd.js")), true);
        assert.equal(fs.existsSync(path.join(dir, "scenario-test.d.ts")), true);
        assert.equal(fs.existsSync(path.join(dir, ".scenario-test-version.json")), true);
        assert.match(fs.readFileSync(path.join(dir, "scenario.config.js"), "utf8"), /reference path="\.\/scenario-test\.d\.ts"/);
        assert.equal(fs.readFileSync(path.join(dir, "AI_SCENARIO_PROMPT.md"), "utf8"), "# 用户保留的旧版 Prompt\n");

        const doctor = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "doctor", "--config", path.join(dir, "scenario.config.js")], { encoding: "utf8" });
        assert.equal(doctor.status, 0, doctor.stdout + doctor.stderr);
        assert.match(doctor.stdout, /\[PASS\] version-lock/);
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
        const lockPath = path.join(dir, ".scenario-test", ".scenario-test-version.json");
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

test("init 重跑：同版本手工替换框架文件后，重新 init 刷新版本锁 SHA256，doctor 恢复健康", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-resha-"));
    try {
        const first = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(first.status, 0, first.stderr);
        const dir = path.join(project, "scenario-test");
        const configPath = path.join(dir, "scenario.config.js");
        const lockPath = path.join(dir, ".scenario-test", ".scenario-test-version.json");
        // 手工替换 UMD（保留版本 banner，仅追加内容改变哈希）
        const umdPath = path.join(dir, ".scenario-test", "scenario-test.umd.js");
        fs.writeFileSync(umdPath, `${fs.readFileSync(umdPath, "utf8")}\n// user-patch\n`, "utf8");
        // 替换后 doctor 报 WARN（SHA256 与版本锁不一致），退出码仍为 0
        const warn = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "doctor", "--config", configPath], { encoding: "utf8" });
        assert.equal(warn.status, 0, warn.stdout + warn.stderr);
        assert.match(warn.stdout, /SHA256 与版本锁记录不一致/);
        // 重跑 init：版本号一致但哈希变化 → 版本锁必须刷新
        const lockBefore = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        const second = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(second.status, 0, second.stderr);
        const lockAfter = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        assert.notEqual(
            lockAfter.sha256["scenario-test.umd.js"],
            lockBefore.sha256["scenario-test.umd.js"],
            "同版本替换后 init 必须重算 SHA256 刷新版本锁"
        );
        assert.equal(lockAfter.runtimeVersion, VERSION);
        // doctor 恢复健康：版本锁 PASS，无 SHA256 WARN
        const healthy = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "doctor", "--config", configPath], { encoding: "utf8" });
        assert.equal(healthy.status, 0, healthy.stdout + healthy.stderr);
        assert.match(healthy.stdout, /\[PASS\] version-lock/);
        assert.doesNotMatch(healthy.stdout, /SHA256 与版本锁记录不一致/);
        // 项目配置仍未被覆盖
        assert.equal(fs.existsSync(configPath), true);
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
        const lockPath = path.join(dir, ".scenario-test", ".scenario-test-version.json");
        const frameworkDir = path.dirname(lockPath);
        const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        lock.runtimeVersion = "0.4.0";
        fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2), "utf8");
        fs.writeFileSync(path.join(frameworkDir, "scenario-test.umd.js"), "/*! scenario-test v0.4.0 */\n", "utf8");
        fs.writeFileSync(path.join(frameworkDir, "AI_SCENARIO_PROMPT.md"), "# 旧框架 Prompt\n", "utf8");
        const configPath = path.join(dir, "scenario.config.js");
        const userConfig = `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
            envs: [{ key: "local", name: "本地", baseUrl: "http://127.0.0.1:1" }],
            defaultEnvKey: "local",
            scenarios: []
        }));\n`;
        fs.writeFileSync(configPath, userConfig, "utf8");
        const second = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(second.status, 0, second.stderr);
        const updated = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        assert.equal(updated.runtimeVersion, VERSION);
        assert.equal(updated.contractVersion, CONTRACT_VERSION);
        assert.match(fs.readFileSync(path.join(frameworkDir, "scenario-test.umd.js"), "utf8"), new RegExp(`scenario-test v${VERSION.replaceAll(".", "\\.")}`));
        assert.match(fs.readFileSync(path.join(frameworkDir, "AI_SCENARIO_PROMPT.md"), "utf8"), /AI 业务功能场景生成规则/);
        assert.equal(fs.readFileSync(configPath, "utf8"), userConfig, "项目配置不得被覆盖");
        const doctor = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "doctor", "--config", configPath], { encoding: "utf8" });
        assert.equal(doctor.status, 0, doctor.stdout + doctor.stderr);
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
        assert.deepEqual(fs.readdirSync(target).sort(), [".scenario-test", "README.md", "index.html", "scenario.config.js"]);
        const frameworkDir = path.join(target, ".scenario-test");
        assert.deepEqual(fs.readdirSync(frameworkDir).sort(), [
            ".scenario-test-version.json",
            "AI_SCENARIO_PROMPT.md",
            "SCENARIO_PATTERNS.md",
            "scenario-test-capabilities.json",
            "scenario-test-cli.cjs",
            "scenario-test.d.ts",
            "scenario-test.umd.js"
        ]);
        assert.match(fs.readFileSync(path.join(frameworkDir, "scenario-test.umd.js"), "utf8"), /ScenarioTest/);
        assert.equal(fs.existsSync(path.join(frameworkDir, "scenario-test-cli.cjs")), true);
        assert.match(fs.readFileSync(path.join(target, "scenario.config.js"), "utf8"), /scenarios: \[]/);
        const generatedPrompt = fs.readFileSync(path.join(frameworkDir, "AI_SCENARIO_PROMPT.md"), "utf8");
        assert.match(generatedPrompt, /AI 业务功能场景生成规则/);
        assert.match(generatedPrompt, /用户不需要复制或粘贴本文件/);
        assert.match(generatedPrompt, /只处理本次指定的一个业务功能/);
        const generatedReadme = fs.readFileSync(path.join(target, "README.md"), "utf8");
        assert.match(generatedReadme, /不需要再次复制任何 Prompt/);
        assert.match(generatedReadme, /AI 负责维护 `scenario\.config\.js` 和 `scenarios\/`/);
    } finally {
        fs.rmSync(rootDir, { recursive: true, force: true });
    }
});
