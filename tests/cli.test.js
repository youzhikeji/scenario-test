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
