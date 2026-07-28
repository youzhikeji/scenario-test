import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("CLI 从公共 JS 配置执行场景", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-cli-"));
    const server = http.createServer((request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "UP" }));
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
        const port = server.address().port;
        fs.mkdirSync(path.join(directory, "scenarios"));
        fs.writeFileSync(path.join(directory, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({envs:[{key:"mock",name:"Mock",baseUrl:"http://127.0.0.1:${port}"}],scenarios:[{id:"health",name:"Health",url:"scenarios/health.js"}]}));`, "utf8");
        fs.writeFileSync(path.join(directory, "scenarios/health.js"), `ScenarioTest.registerScenario("health",ScenarioTest.defineScenario({name:"Health",steps:[{name:"healthy",path:"health",status:200,assertions:[{path:"status",equals:"UP"}]}]}));`, "utf8");
        const cli = path.resolve(import.meta.dirname, "../dist/scenario-test-cli.cjs");
        const result = await new Promise((resolve) => {
            const child = spawn(process.execPath, [cli, "--config", path.join(directory, "scenario.config.js"), "--all"], { stdio: ["ignore", "pipe", "pipe"] });
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
