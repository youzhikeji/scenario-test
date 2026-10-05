const http = require("node:http");
const { randomUUID } = require("node:crypto");

// 端口可用 MOCK_PORT 覆盖；dev.mjs 会在 4310 被占用时自动挑选空闲端口并经环境变量传入
const PORT = Number(process.env.MOCK_PORT || 4310);

const orders = new Map();
const tasks = new Map();

function send(response, status, body) {
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Scenario-Env"
    });
    response.end(JSON.stringify(body));
}

function readJson(request) {
    return new Promise((resolve, reject) => {
        let text = "";
        request.on("data", (chunk) => { text += chunk; });
        request.on("end", () => {
            try { resolve(text ? JSON.parse(text) : {}); }
            catch (error) { reject(error); }
        });
    });
}

function hasDemoToken(request) {
    return request.headers.authorization === "Bearer demo-token";
}

const server = http.createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
        send(response, 204, {});
        return;
    }
    const url = new URL(request.url, `http://127.0.0.1:${PORT}`);
    try {
        if (request.method === "GET" && url.pathname === "/health") {
            send(response, 200, { status: "UP" });
            return;
        }
        if (request.method === "POST" && url.pathname === "/login") {
            const body = await readJson(request);
            if (body.account !== "demo" || body.password !== "demo-password") {
                send(response, 401, { message: "invalid credentials" });
                return;
            }
            send(response, 200, { data: { token: "demo-token" } });
            return;
        }
        if (request.method === "POST" && url.pathname === "/orders") {
            if (!hasDemoToken(request)) { send(response, 401, { message: "unauthorized" }); return; }
            const body = await readJson(request);
            const id = randomUUID();
            orders.set(id, { id, product: body.product, quantity: body.quantity });
            send(response, 201, { data: orders.get(id) });
            return;
        }
        if (request.method === "GET" && url.pathname.startsWith("/orders/")) {
            if (!hasDemoToken(request)) { send(response, 401, { message: "unauthorized" }); return; }
            const order = orders.get(url.pathname.slice("/orders/".length));
            send(response, order ? 200 : 404, order ? { data: order } : { message: "not found" });
            return;
        }
        if (request.method === "POST" && url.pathname === "/tasks") {
            const id = randomUUID();
            tasks.set(id, 0);
            send(response, 202, { data: { id } });
            return;
        }
        if (request.method === "GET" && url.pathname.startsWith("/tasks/")) {
            const id = url.pathname.slice("/tasks/".length);
            const checks = (tasks.get(id) || 0) + 1;
            tasks.set(id, checks);
            send(response, 200, { data: { id, status: checks >= 2 ? "READY" : "PENDING" } });
            return;
        }
        if (request.method === "GET" && url.pathname === "/optional") {
            send(response, 200, { status: "UP" });
            return;
        }
        // basic 示例的 slow/timeout 场景依赖：响应延迟需大于步骤 timeoutMs（500ms）
        if (request.method === "GET" && url.pathname === "/slow") {
            const startedAt = Date.now();
            setTimeout(() => {
                send(response, 200, { status: "SLOW_OK", elapsedMs: Date.now() - startedAt });
            }, 3000);
            return;
        }
        send(response, 404, { message: "not found" });
    } catch (error) {
        send(response, 400, { message: error.message });
    }
});

server.listen(PORT, "127.0.0.1", () => {
    console.log(`Complete example Mock API: http://127.0.0.1:${PORT}`);
});
