import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("CLI 从公共 JS 配置执行场景", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-cli-"));
    const server = http.createServer((request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "UP", token: request.headers["x-token"] }));
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
        const port = server.address().port;
        fs.mkdirSync(path.join(directory, "scenarios"));
        fs.writeFileSync(path.join(directory, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({envs:[{key:"mock",name:"Mock",baseUrl:"http://127.0.0.1:${port}"}],vars:{expectedStatus:"UP",token:"config-token"},variables:[{name:"token",env:"SCENARIO_TEST_TOKEN"}],scenarios:[{id:"health",name:"Health",url:"scenarios/health.js"}]}));`, "utf8");
        fs.writeFileSync(path.join(directory, "scenarios/health.js"), `ScenarioTest.registerScenario("health",ScenarioTest.defineScenario({name:"Health",vars:{expectedStatus:"DOWN",token:"scenario-token"},steps:[{name:"healthy",path:"health",status:200,request:{headers:{"X-Token":"{{vars.token}}"}},assertions:[{path:"status",equals:"{{vars.expectedStatus}}"},{path:"token",equals:"cli-token"}]}]}));`, "utf8");
        const cli = path.resolve(import.meta.dirname, "../dist/scenario-test-cli.cjs");
        const result = await new Promise((resolve) => {
            const child = spawn(process.execPath, [cli, "--config", path.join(directory, "scenario.config.js"), "--all"], { env: { ...process.env, SCENARIO_TEST_TOKEN: "cli-token" }, stdio: ["ignore", "pipe", "pipe"] });
            let stdout = "";
            let stderr = "";
            child.stdout.on("data", (chunk) => { stdout += chunk; });
            child.stderr.on("data", (chunk) => { stderr += chunk; });
            child.on("close", (code) => resolve({ code, stdout, stderr }));
        });
        assert.equal(result.code, 0, result.stderr);
        assert.match(result.stdout, /\[PASS\] healthy/);
        assert.match(result.stdout, /Overall: 1\/1 passed/);
    } finally {
        server.close();
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("CLI 拒绝旧 window 全局配置与场景格式", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-legacy-"));
    const cli = path.resolve(import.meta.dirname, "../dist/scenario-test-cli.cjs");
    try {
        fs.mkdirSync(path.join(directory, "scenarios"));
        fs.writeFileSync(path.join(directory, "scenario.config.js"), `window.GlobalConfig={envs:[{key:"mock",name:"Mock",baseUrl:"http://127.0.0.1"}],scenarios:[{id:"health",url:"scenarios/health.js"}]};`, "utf8");
        fs.writeFileSync(path.join(directory, "scenarios/health.js"), `window.ScenarioData={name:"Health",steps:[]};`, "utf8");
        const result = await new Promise((resolve) => {
            const child = spawn(process.execPath, [cli, "--config", path.join(directory, "scenario.config.js"), "--all"], { stdio: ["ignore", "pipe", "pipe"] });
            let stderr = "";
            child.stderr.on("data", (chunk) => { stderr += chunk; });
            child.on("close", (code) => resolve({ code, stderr }));
        });
        assert.notEqual(result.code, 0);
        assert.match(result.stderr, /配置文件未注册配置/);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("CLI 拒绝未知参数、缺失参数值和冲突选择", () => {
    const cli = path.resolve(import.meta.dirname, "../src/cli.js");
    for (const args of [
        ["--unknown"],
        ["--config", "--all"],
        ["--all", "--scenario", "health"],
        ["serve", "--port", "70000"]
    ]) {
        const result = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
        assert.notEqual(result.status, 0, `参数应失败: ${args.join(" ")}`);
    }
});

test("CLI Overall 统计按计划步骤数计算", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-stats-"));
    const server = http.createServer((request, response) => {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "server error" }));
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
        const port = server.address().port;
        fs.mkdirSync(path.join(directory, "scenarios"));
        fs.writeFileSync(path.join(directory, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({envs:[{key:"mock",name:"Mock",baseUrl:"http://127.0.0.1:${port}"}],scenarios:[{id:"health",name:"Health",url:"scenarios/health.js"}]}));`, "utf8");
        fs.writeFileSync(path.join(directory, "scenarios/health.js"), `ScenarioTest.registerScenario("health",ScenarioTest.defineScenario({name:"Health",steps:[{name:"step1",path:"a"},{name:"step2",path:"b"}]}));`, "utf8");
        const cli = path.resolve(import.meta.dirname, "../dist/scenario-test-cli.cjs");
        const result = await new Promise((resolve) => {
            const child = spawn(process.execPath, [cli, "--config", path.join(directory, "scenario.config.js"), "--all"], { stdio: ["ignore", "pipe", "pipe"] });
            let stdout = "";
            let stderr = "";
            child.stdout.on("data", (chunk) => { stdout += chunk; });
            child.stderr.on("data", (chunk) => { stderr += chunk; });
            child.on("close", (code) => resolve({ code, stdout, stderr }));
        });
        assert.equal(result.code, 1, result.stderr);
        assert.match(result.stdout, /Overall: 0\/2 passed/);
    } finally {
        server.close();
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("CLI SCENARIO_GLOBALS 环境变量注入全局参数", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-globals-"));
    const server = http.createServer((request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({
            url: request.url,
            header: request.headers["x-trace"],
            cookie: request.headers.cookie
        }));
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
        const port = server.address().port;
        fs.mkdirSync(path.join(directory, "scenarios"));
        fs.writeFileSync(path.join(directory, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({envs:[{key:"mock",name:"Mock",baseUrl:"http://127.0.0.1:${port}"}],scenarios:[{id:"echo",name:"Echo",url:"scenarios/echo.js"}]}));`, "utf8");
        fs.writeFileSync(path.join(directory, "scenarios/echo.js"), `ScenarioTest.registerScenario("echo",ScenarioTest.defineScenario({name:"Echo",steps:[{name:"echo",path:"api",status:200,assertions:[{path:"header",equals:"cli-trace"},{path:"cookie",includes:"sid=cli-123"},{path:"url",includes:"source=cli"}]}]}));`, "utf8");
        const cli = path.resolve(import.meta.dirname, "../dist/scenario-test-cli.cjs");
        const globals = JSON.stringify([
            { type: "header", name: "X-Trace", value: "cli-trace" },
            { type: "cookie", name: "sid", value: "cli-123" },
            { type: "query", name: "source", value: "cli" }
        ]);
        const result = await new Promise((resolve) => {
            const child = spawn(process.execPath, [cli, "--config", path.join(directory, "scenario.config.js"), "--all"], { env: { ...process.env, SCENARIO_GLOBALS: globals }, stdio: ["ignore", "pipe", "pipe"] });
            let stdout = "";
            let stderr = "";
            child.stdout.on("data", (chunk) => { stdout += chunk; });
            child.stderr.on("data", (chunk) => { stderr += chunk; });
            child.on("close", (code) => resolve({ code, stdout, stderr }));
        });
        assert.equal(result.code, 0, result.stderr);
        assert.match(result.stdout, /\[PASS\] echo/);
        assert.match(result.stdout, /Overall: 1\/1 passed/);
    } finally {
        server.close();
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("CLI SCENARIO_GLOBALS 非法 JSON 时报错", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-badglobals-"));
    try {
        fs.writeFileSync(path.join(directory, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({envs:[{key:"mock",name:"Mock",baseUrl:"http://127.0.0.1"}],scenarios:[]}));`, "utf8");
        const cli = path.resolve(import.meta.dirname, "../src/cli.js");
        const result = spawnSync(process.execPath, [cli, "--config", path.join(directory, "scenario.config.js")], {
            encoding: "utf8",
            env: { ...process.env, SCENARIO_GLOBALS: "not-json" }
        });
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /SCENARIO_GLOBALS 必须是合法的 JSON 数组/);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("CLI --all 排除 manual 场景，显式 --scenario 可执行，SKIP 输出与 fail-on-skip", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-manual-"));
    const server = http.createServer((request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "UP" }));
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
        const port = server.address().port;
        fs.mkdirSync(path.join(directory, "scenarios"));
        fs.writeFileSync(path.join(directory, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({envs:[{key:"mock",name:"Mock",baseUrl:"http://127.0.0.1:${port}"}],scenarios:[
            {id:"auto",name:"Auto",url:"scenarios/auto.js"},
            {id:"manual",name:"ManualOnly",url:"scenarios/manual.js",manual:true},
            {id:"skippable",name:"Skippable",url:"scenarios/skippable.js"}
        ]}));`, "utf8");
        fs.writeFileSync(path.join(directory, "scenarios/auto.js"), `ScenarioTest.registerScenario("auto",ScenarioTest.defineScenario({name:"Auto",steps:[{name:"auto-step",path:"health",status:200}]}));`, "utf8");
        fs.writeFileSync(path.join(directory, "scenarios/manual.js"), `ScenarioTest.registerScenario("manual",ScenarioTest.defineScenario({name:"ManualOnly",steps:[{name:"manual-step",path:"health",status:200}]}));`, "utf8");
        fs.writeFileSync(path.join(directory, "scenarios/skippable.js"), `ScenarioTest.registerScenario("skippable",ScenarioTest.defineScenario({name:"Skippable",steps:[{name:"skip-step",path:"health",status:200,when:{from:"vars",path:"missing",exists:true}}]}));`, "utf8");
        const cli = path.resolve(import.meta.dirname, "../dist/scenario-test-cli.cjs");

        const run = (extraArgs, env) => new Promise((resolve) => {
            const child = spawn(process.execPath, [cli, "--config", path.join(directory, "scenario.config.js"), ...extraArgs], { env: { ...process.env, ...(env || {}) }, stdio: ["ignore", "pipe", "pipe"] });
            let stdout = "";
            let stderr = "";
            child.stdout.on("data", (chunk) => { stdout += chunk; });
            child.stderr.on("data", (chunk) => { stderr += chunk; });
            child.on("close", (code) => resolve({ code, stdout, stderr }));
        });

        // --all：manual 被排除，SKIP 输出与摘要展示
        const allResult = await run(["--all"]);
        assert.equal(allResult.code, 0, allResult.stderr);
        assert.match(allResult.stdout, /\[PASS\] auto-step/);
        assert.match(allResult.stdout, /\[SKIP\] skip-step/);
        assert.doesNotMatch(allResult.stdout, /ManualOnly|manual-step/);
        assert.match(allResult.stdout, /Summary: passed=1 failed=0 skipped=0 executed=1\/1 planned \(状态 PASSED\)/);
        assert.match(allResult.stdout, /Summary: passed=0 failed=0 skipped=1 executed=0\/1 planned \(状态 SKIPPED\)/);
        assert.match(allResult.stdout, /Overall: 1\/2 passed/);

        // --all --fail-on-skip：任何 skip 导致退出码 1
        const failOnSkip = await run(["--all", "--fail-on-skip"]);
        assert.equal(failOnSkip.code, 1);
        assert.match(failOnSkip.stdout, /fail-on-skip 已开启，存在 1 个 SKIP 步骤/);

        // 显式 --scenario 可执行 manual 场景
        const manualResult = await run(["--scenario", "manual"]);
        assert.equal(manualResult.code, 0, manualResult.stderr);
        assert.match(manualResult.stdout, /\[PASS\] manual-step/);
        assert.match(manualResult.stdout, /Overall: 1\/1 passed/);
    } finally {
        server.close();
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("CLI 配置全部为 manual 时 --all 报明确错误", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-allmanual-"));
    try {
        fs.writeFileSync(path.join(directory, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({envs:[{key:"mock",name:"Mock",baseUrl:"http://127.0.0.1"}],scenarios:[{id:"m1",name:"M1",url:"s1.js",manual:true}]}));`, "utf8");
        const cli = path.resolve(import.meta.dirname, "../src/cli.js");
        const result = spawnSync(process.execPath, [cli, "--config", path.join(directory, "scenario.config.js"), "--all"], { encoding: "utf8" });
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /全部标记为 manual:true/);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});
