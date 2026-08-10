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

function initProject() {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-doctor-"));
    const result = spawnSync(process.execPath, [cli, "init", "--project", project, "--dir", "scenario-test"], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const dir = path.join(project, "scenario-test");
    fs.writeFileSync(path.join(dir, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
        envs: [{ key: "local", name: "本地", baseUrl: "http://127.0.0.1:1" }],
        defaultEnvKey: "local",
        scenarios: [
            { id: "health", name: "Health", url: "scenarios/health.js" },
            { id: "seed", name: "Seed", url: "scenarios/seed.js", manual: true }
        ]
    }));`, "utf8");
    fs.mkdirSync(path.join(dir, "scenarios"), { recursive: true });
    fs.writeFileSync(path.join(dir, "scenarios/health.js"), `ScenarioTest.registerScenario("health", ScenarioTest.defineScenario({
        name: "Health",
        steps: [{ name: "healthy", path: "health", status: 200 }]
    }));`, "utf8");
    fs.writeFileSync(path.join(dir, "scenarios/seed.js"), `ScenarioTest.registerScenario("seed", ScenarioTest.defineScenario({
        name: "Seed",
        steps: [{ name: "seed-data", path: "seed", status: 201 }]
    }));`, "utf8");
    return { project, dir };
}

function runDoctor(dir, extra = []) {
    return spawnSync(process.execPath, [cli, "doctor", "--config", path.join(dir, "scenario.config.js"), ...extra], { encoding: "utf8" });
}

function cleanup(project) {
    fs.rmSync(project, { recursive: true, force: true });
}

test("doctor：健康项目全 PASS + manual INFO，退出码 0", () => {
    const { project, dir } = initProject();
    try {
        const result = runDoctor(dir);
        assert.equal(result.status, 0, result.stdout + result.stderr);
        assert.match(result.stdout, /\[PASS\] node-version/);
        assert.match(result.stdout, /\[PASS\] config-load/);
        assert.match(result.stdout, /\[PASS\] scenario-register/);
        assert.match(result.stdout, /\[PASS\] cli/);
        assert.match(result.stdout, /\[PASS\] umd/);
        assert.match(result.stdout, /\[PASS\] dts/);
        assert.match(result.stdout, /\[PASS\] capabilities/);
        assert.match(result.stdout, /\[PASS\] version-lock/);
        assert.match(result.stdout, /\[INFO\] manual-scenario/);
        assert.match(result.stdout, /seed/);
        assert.doesNotMatch(result.stdout, /\[FAIL\]/);
        assert.match(result.stdout, /结果: OK（退出码 0）/);
    } finally {
        cleanup(project);
    }
});

test("doctor：未知操作符场景 FAIL，且不中断其余检查（汇总）", () => {
    const { project, dir } = initProject();
    try {
        fs.writeFileSync(path.join(dir, "scenarios/health.js"), `ScenarioTest.registerScenario("health", ScenarioTest.defineScenario({
            name: "Health",
            steps: [{ name: "healthy", path: "health", status: 200, assertions: [{ path: "code", bogusOp: 1 }] }]
        }));`, "utf8");
        const result = runDoctor(dir);
        assert.equal(result.status, 1);
        assert.match(result.stdout, /\[PASS\] config-load/);
        assert.match(result.stdout, /\[FAIL\] scenario-register/);
        assert.match(result.stdout, /未知键 "bogusOp"/);
        assert.match(result.stdout, /如何修/);
        // manual 场景仍给出 INFO
        assert.match(result.stdout, /\[INFO\] manual-scenario/);
        assert.match(result.stdout, /结果: FAILED（退出码 1）/);
    } finally {
        cleanup(project);
    }
});

test("doctor：多文件错误汇总（文件缺失 + 未知操作符同时报告）", () => {
    const { project, dir } = initProject();
    try {
        fs.rmSync(path.join(dir, "scenarios/seed.js"));
        fs.writeFileSync(path.join(dir, "scenarios/health.js"), `ScenarioTest.registerScenario("health", ScenarioTest.defineScenario({
            name: "Health",
            steps: [{ name: "healthy", path: "health", status: 200, assertions: [{ path: "code", nope: 1 }] }]
        }));`, "utf8");
        const result = runDoctor(dir);
        assert.equal(result.status, 1);
        assert.match(result.stdout, /\[FAIL\] scenario-list/);
        assert.match(result.stdout, /场景文件不存在/);
        assert.match(result.stdout, /\[FAIL\] scenario-register/);
        assert.match(result.stdout, /未知键 "nope"/);
        // 汇总摘要显示 2 个 FAIL
        assert.match(result.stdout, /摘要: .*2 FAIL/);
    } finally {
        cleanup(project);
    }
});

test("doctor：缺少版本锁只 WARN 不失败，并给出补齐提示", () => {
    const { project, dir } = initProject();
    try {
        fs.rmSync(path.join(dir, ".scenario-test-version.json"));
        const result = runDoctor(dir);
        assert.equal(result.status, 0, result.stdout + result.stderr);
        assert.match(result.stdout, /\[WARN\] version-lock/);
        assert.match(result.stdout, /缺少框架管理文件 \.scenario-test-version\.json/);
        assert.match(result.stdout, /如何修/);
        assert.doesNotMatch(result.stdout, /\[FAIL\] version-lock/);
    } finally {
        cleanup(project);
    }
});

test("doctor：版本锁版本不一致为 error（退出码 1）", () => {
    const { project, dir } = initProject();
    try {
        const lockPath = path.join(dir, ".scenario-test-version.json");
        const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        lock.runtimeVersion = "0.4.0";
        fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2), "utf8");
        const result = runDoctor(dir);
        assert.equal(result.status, 1);
        assert.match(result.stdout, /\[FAIL\] version-lock/);
        assert.match(result.stdout, /版本不一致/);
        assert.match(result.stdout, /重新 init/);
    } finally {
        cleanup(project);
    }
});

test("doctor --json：stdout 纯净可解析，含 checks/exitCode 与 manual info", () => {
    const { project, dir } = initProject();
    try {
        const result = runDoctor(dir, ["--json"]);
        assert.equal(result.status, 0, result.stdout + result.stderr);
        const parsed = JSON.parse(result.stdout);
        assert.equal(parsed.tool, "scenario-test doctor");
        assert.equal(parsed.runtimeVersion, VERSION);
        assert.equal(parsed.contractVersion, CONTRACT_VERSION);
        assert.ok(Array.isArray(parsed.checks));
        assert.ok(parsed.checks.some((check) => check.name === "node-version" && check.status === "PASS"));
        assert.equal(parsed.exitCode, 0);
        assert.equal(parsed.summary.failed, 0);
        assert.ok(parsed.info.some((item) => item.name === "manual-scenario"));
    } finally {
        cleanup(project);
    }
});