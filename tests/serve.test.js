import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import https from "node:https";
import { spawn, spawnSync } from "node:child_process";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const cli = path.join(root, "src/cli.js");

// openssl 能力探测：仅用于可选的 https 端到端转发用例
function hasOpenSsl() {
    try {
        const probe = spawnSync("openssl", ["version"], { stdio: "ignore", timeout: 5000 });
        return probe.status === 0;
    } catch {
        return false;
    }
}

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

test("serve 代理响应方向剔除 hop-by-hop 头", async () => {
    const mock = http.createServer((request, response) => {
        response.writeHead(200, {
            "Content-Type": "application/json",
            "Keep-Alive": "timeout=99",
            "Proxy-Authenticate": 'Basic realm="scenario"',
            "Upgrade": "websocket"
        });
        response.end(JSON.stringify({ ok: true }));
    });
    await new Promise((resolve) => mock.listen(0, "127.0.0.1", resolve));
    const mockPort = mock.address().port;

    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-serve-hop-"));
    const dir = path.join(project, "scenario-test");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
        envs: [{ key: "local", name: "本地", baseUrl: "http://127.0.0.1:${mockPort}" }],
        defaultEnvKey: "local",
        scenarios: []
    }));`, "utf8");

    const servePort = await freePort();
    const child = spawn(process.execPath, [cli, "serve", "--config", path.join(dir, "scenario.config.js"), "--port", String(servePort)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    try {
        await waitForOutput(child, "场景测试工作台");
        const response = await fetch(`http://127.0.0.1:${servePort}/api/hop`);
        assert.equal(response.status, 200);
        // 上游返回的 hop-by-hop 头不得透传给浏览器（Keep-Alive 除外：
        // 它是 Node 服务器对 keep-alive 连接自行追加的连接管理头，非上游透传，值恒为 timeout=5）
        assert.equal(response.headers.get("proxy-authenticate"), null, "Proxy-Authenticate 是 hop-by-hop 头，不应透传");
        assert.equal(response.headers.get("upgrade"), null, "Upgrade 是 hop-by-hop 头，不应透传");
        // 普通实体头正常透传
        assert.match(response.headers.get("content-type"), /application\/json/);
        const payload = await response.json();
        assert.equal(payload.ok, true);
    } finally {
        child.kill();
        mock.close();
        fs.rmSync(project, { recursive: true, force: true });
    }
});

// 崩溃回归：历史上 proxyRequest 用 http.request 转发 https 目标会在 fs.stat 回调里
// 同步抛 ERR_INVALID_PROTOCOL（uncaughtException），serve 进程整体退出、浏览器侧 ECONNRESET。
// 现在必须：识别 https 协议、失败降级 502、进程保持存活。
test("serve：https 上游不再崩溃，连接失败返回 502 且进程存活", async () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-serve-https-"));
    const dir = path.join(project, "scenario-test");
    fs.mkdirSync(dir, { recursive: true });
    // https 指向无监听端口：协议可识别但连接被拒，应走 upstream error 分支返回 502
    fs.writeFileSync(path.join(dir, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
        envs: [{ key: "cloud", name: "云端", baseUrl: "https://127.0.0.1:1" }],
        defaultEnvKey: "cloud",
        scenarios: []
    }));`, "utf8");
    fs.writeFileSync(path.join(dir, "index.html"), "<!doctype html><title>scenario</title>", "utf8");

    const servePort = await freePort();
    const child = spawn(process.execPath, [cli, "serve", "--config", path.join(dir, "scenario.config.js"), "--port", String(servePort)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let exited = null;
    child.on("exit", (code) => { exited = code; });
    try {
        await waitForOutput(child, "场景测试工作台");
        const response = await fetch(`http://127.0.0.1:${servePort}/api/health`);
        assert.equal(response.status, 502, "https 上游连接失败应返回 502 而非连接重置");
        await new Promise((resolve) => setTimeout(resolve, 200));
        assert.equal(exited, null, `serve 进程不应退出（实际退出码 ${exited}）`);
        // 进程存活验证：静态页面仍可访问
        const stillAlive = await fetch(`http://127.0.0.1:${servePort}/index.html`);
        assert.equal(stillAlive.status, 200, "代理失败后 serve 应继续提供静态页面");
    } finally {
        child.kill();
        fs.rmSync(project, { recursive: true, force: true });
    }
});

// 崩溃回归：无协议 baseUrl（如内网手滑写 "192.168.1.5:8080"）历史上同步抛
// ERR_INVALID_URL 导致 serve 进程退出。现在必须降级 502 并保持存活。
test("serve：无协议 baseUrl 不再崩溃，返回 502 且进程存活", async () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-serve-noproto-"));
    const dir = path.join(project, "scenario-test");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
        envs: [{ key: "lan", name: "内网", baseUrl: "192.168.1.5:8080" }],
        defaultEnvKey: "lan",
        scenarios: []
    }));`, "utf8");
    fs.writeFileSync(path.join(dir, "index.html"), "<!doctype html><title>scenario</title>", "utf8");

    const servePort = await freePort();
    const child = spawn(process.execPath, [cli, "serve", "--config", path.join(dir, "scenario.config.js"), "--port", String(servePort)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let exited = null;
    child.on("exit", (code) => { exited = code; });
    try {
        await waitForOutput(child, "场景测试工作台");
        const response = await fetch(`http://127.0.0.1:${servePort}/api/health`);
        assert.equal(response.status, 502, "无协议 baseUrl 应返回 502 而非连接重置");
        const body = await response.text();
        assert.match(body, /baseUrl/, "502 提示应指向 baseUrl 配置问题");
        await new Promise((resolve) => setTimeout(resolve, 200));
        assert.equal(exited, null, `serve 进程不应退出（实际退出码 ${exited}）`);
    } finally {
        child.kill();
        fs.rmSync(project, { recursive: true, force: true });
    }
});

// 端到端 https 转发：依赖本机 openssl 生成自签证书，无 openssl 时跳过（不崩溃回归已由上一条覆盖）
test("serve：https 上游端到端转发（需 openssl，自签证书容忍）", { skip: !hasOpenSsl() }, async () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-serve-tls-"));
    try {
        const keyFile = path.join(project, "key.pem");
        const certFile = path.join(project, "cert.pem");
        // Windows 发行版 openssl 常缺失默认 openssl.cnf；空配置可绕过（自签参数全在命令行）
        const emptyConf = path.join(project, "openssl-empty.cnf");
        fs.writeFileSync(emptyConf, "", "utf8");
        const openssl = spawnSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes",
            "-keyout", keyFile, "-out", certFile, "-days", "1", "-subj", "/CN=127.0.0.1"], {
            stdio: "ignore",
            env: { ...process.env, OPENSSL_CONF: emptyConf }
        });
        assert.equal(openssl.status, 0, "openssl 生成自签证书失败");

        const received = [];
        const mock = https.createServer({ key: fs.readFileSync(keyFile), cert: fs.readFileSync(certFile) }, (request, response) => {
            received.push(request.url);
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ url: request.url, tls: true }));
        });
        await new Promise((resolve) => mock.listen(0, "127.0.0.1", resolve));
        const mockPort = mock.address().port;

        const dir = path.join(project, "scenario-test");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "scenario.config.js"), `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
            envs: [{ key: "cloud", name: "云端", baseUrl: "https://127.0.0.1:${mockPort}" }],
            defaultEnvKey: "cloud",
            scenarios: []
        }));`, "utf8");

        const servePort = await freePort();
        const child = spawn(process.execPath, [cli, "serve", "--config", path.join(dir, "scenario.config.js"), "--port", String(servePort)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
        try {
            await waitForOutput(child, "场景测试工作台");
            const response = await fetch(`http://127.0.0.1:${servePort}/api/tls-check`);
            const responseText = await response.text();
            assert.equal(response.status, 200, `https 端到端转发应成功: ${responseText}`);
            const payload = JSON.parse(responseText);
            assert.equal(payload.url, "/api/tls-check");
            assert.equal(payload.tls, true);
            assert.equal(received.length, 1, "https mock 后端应收到代理请求");
        } finally {
            child.kill();
            await new Promise((resolve) => mock.close(resolve));
        }
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});