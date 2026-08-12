import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const cli = path.join(root, "src/cli.js");

function startMockBackend() {
    const received = [];
    const server = http.createServer((request, response) => {
        received.push({ method: request.method, url: request.url, headers: request.headers });
        let body = "";
        request.on("data", (chunk) => { body += chunk; });
        request.on("end", () => {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ method: request.method, url: request.url, body }));
        });
    });
    return new Promise((resolve) => {
        server.listen(0, "127.0.0.1", () => resolve({ server, received, port: server.address().port }));
    });
}

function waitForOutput(child, pattern) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("serve 启动超时")), 10000);
        child.stdout.on("data", (chunk) => {
            if (String(chunk).includes(pattern)) {
                clearTimeout(timer);
                resolve();
            }
        });
        child.on("exit", (code) => reject(new Error(`serve 提前退出: ${code}`)));
    });
}

async function freePort() {
    const server = http.createServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = server.address().port;
    await new Promise((resolve) => server.close(resolve));
    return port;
}

test("serve 同源代理：非静态请求转发到环境 baseUrl，静态文件优先", async () => {
    const { server: mock, received, port: mockPort } = await startMockBackend();
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-serve-"));
    const dir = path.join(project, "scenario-test");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
        envs: [{ key: "local", name: "本地", baseUrl: "http://127.0.0.1:${mockPort}" }],
        defaultEnvKey: "local",
        scenarios: []
    }));`, "utf8");
    fs.writeFileSync(path.join(dir, "index.html"), "<!doctype html><title>scenario</title>", "utf8");

    const servePort = await freePort();
    const child = spawn(process.execPath, [cli, "serve", "--config", path.join(dir, "scenario.config.js"), "--port", String(servePort)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    try {
        await waitForOutput(child, "场景测试工作台");
        await waitForOutput(child, "接口代理");

        const proxyResponse = await fetch(`http://127.0.0.1:${servePort}/api/health`, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: "ping"
        });
        assert.equal(proxyResponse.status, 200);
        const payload = await proxyResponse.json();
        assert.equal(payload.method, "POST");
        assert.equal(payload.url, "/api/health");
        assert.equal(payload.body, "ping");
        assert.equal(received.length, 1, "mock 后端应收到代理请求");
        assert.equal(received[0].method, "POST");

        // 静态文件优先：根路径返回 index.html 而非代理
        const pageResponse = await fetch(`http://127.0.0.1:${servePort}/`);
        assert.equal(pageResponse.status, 200);
        const page = await pageResponse.text();
        assert.match(page, /<title>scenario<\/title>/);
        assert.match(page, /window\.__SCENARIO_TEST_SERVE_PROXY__ = true/, "serve 页面应注入同源代理模式标记");
        assert.equal(received.length, 1, "静态请求不应转发到 mock 后端");

        // 静态文件未命中时按同源请求代理转发（路径原样传给后端）
        const proxied = await fetch(`http://127.0.0.1:${servePort}/api/orders/42`);
        assert.equal(proxied.status, 200);
        const proxiedPayload = await proxied.json();
        assert.equal(proxiedPayload.url, "/api/orders/42");
        assert.equal(received.length, 2, "未命中静态文件时应代理转发");
    } finally {
        child.kill();
        mock.close();
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("serve：端口占用时友好退出，不输出未处理异常", async () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-serve-port-"));
    const configPath = path.join(project, "scenario.config.js");
    fs.writeFileSync(configPath, `ScenarioTest.registerConfig(ScenarioTest.defineConfig({baseUrl:"http://127.0.0.1:1",scenarios:[]}));`, "utf8");
    const occupied = http.createServer();
    await new Promise((resolve) => occupied.listen(0, "127.0.0.1", resolve));
    const port = occupied.address().port;
    try {
        const result = await new Promise((resolve, reject) => {
            const child = spawn(process.execPath, [cli, "serve", "--config", configPath, "--port", String(port)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
            let stderr = "";
            child.stderr.on("data", (chunk) => { stderr += chunk; });
            child.on("error", reject);
            child.on("close", (code) => resolve({ code, stderr }));
        });
        assert.equal(result.code, 1);
        assert.match(result.stderr, new RegExp(`端口 ${port} 已被占用`));
        assert.doesNotMatch(result.stderr, /Unhandled 'error' event/);
    } finally {
        await new Promise((resolve) => occupied.close(resolve));
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("serve：代理目标不可达时返回 502", async () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-serve-down-"));
    const dir = path.join(project, "scenario-test");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
        envs: [{ key: "local", name: "本地", baseUrl: "http://127.0.0.1:1" }],
        defaultEnvKey: "local",
        scenarios: []
    }));`, "utf8");

    const servePort = await freePort();
    const child = spawn(process.execPath, [cli, "serve", "--config", path.join(dir, "scenario.config.js"), "--port", String(servePort)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    try {
        await waitForOutput(child, "场景测试工作台");
        const response = await fetch(`http://127.0.0.1:${servePort}/api/anything`);
        assert.equal(response.status, 502);
    } finally {
        child.kill();
        fs.rmSync(project, { recursive: true, force: true });
    }
});