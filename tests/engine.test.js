import assert from "node:assert/strict";
import test from "node:test";
import { createEngine, defineScenario } from "../src/index.js";

function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

test("默认失败停止并保留提取变量", async () => {
    let calls = 0;
    const engine = createEngine({
        baseUrl: "https://mock.local",
        fetch: async () => {
            calls += 1;
            return jsonResponse(calls === 1 ? { code: 200, data: { id: "42" } } : { code: 500 });
        }
    });
    const scenario = defineScenario({
        name: "停止策略",
        steps: [
            { name: "提取", path: "one", extract: [{ name: "id", path: "data.id" }], assertions: [{ path: "code", equals: 200 }] },
            { name: "失败", path: "two", assertions: [{ path: "code", equals: 200 }] },
            { name: "不应执行", path: "three", assertions: [{ path: "code", equals: 200 }] }
        ]
    });
    const report = await engine.runScenario(scenario);
    assert.equal(report.executed, 2);
    assert.equal(report.vars.id, "42");
    assert.equal(calls, 2);
});

test("continue 策略收集全部失败", async () => {
    const scenario = defineScenario({
        name: "继续策略",
        failurePolicy: "continue",
        steps: [
            { name: "失败一", path: "one", assertions: [{ path: "code", equals: 200 }] },
            { name: "失败二", path: "two", assertions: [{ path: "code", equals: 200 }] }
        ]
    });
    const report = await createEngine({ baseUrl: "https://mock.local", fetch: async () => jsonResponse({ code: 500 }) }).runScenario(scenario);
    assert.equal(report.executed, 2);
    assert.equal(report.failed, 2);
});

test("无显式断言的 HTTP 500 不得通过", async () => {
    const scenario = defineScenario({
        name: "默认状态校验",
        steps: [{ name: "服务异常", path: "failure" }]
    });
    const report = await createEngine({
        baseUrl: "https://mock.local",
        fetch: async () => jsonResponse({ message: "failed" }, 500)
    }).runScenario(scenario);
    assert.equal(report.passed, false);
    assert.equal(report.failed, 1);
    assert.equal(report.results[0].assertions[0].name, "返回 HTTP 2xx");
});

test("配置变量覆盖场景变量且每次执行生成唯一标识", async () => {
    const seen = [];
    const engine = createEngine({
        baseUrl: "https://mock.local",
        vars: { token: "config-token" },
        fetch: async (_url, options) => {
            seen.push(options.headers["X-Token"]);
            return jsonResponse({ ok: true });
        }
    });
    const scenario = defineScenario({
        name: "变量优先级",
        vars: { token: "scenario-token" },
        steps: [{ name: "读取变量", path: "vars", request: { headers: { "X-Token": "{{vars.token}}" } } }]
    });
    const first = await engine.runScenario(scenario);
    const second = await engine.runScenario(scenario);
    assert.deepEqual(seen, ["config-token", "config-token"]);
    assert.notEqual(first.vars.runId, second.vars.runId);
    assert.match(first.vars.runNo, /^\d{6}-[a-f0-9]{4}$/);
});

test("请求透传浏览器凭据和重定向策略", async () => {
    let captured;
    const scenario = defineScenario({
        name: "Cookie 会话",
        steps: [{
            name: "携带浏览器会话",
            path: "session",
            request: { credentials: "include", redirect: "manual" }
        }]
    });
    await createEngine({
        baseUrl: "https://mock.local",
        fetch: async (_url, options) => {
            captured = options;
            return jsonResponse({ ok: true });
        }
    }).runScenario(scenario);
    assert.equal(captured.credentials, "include");
    assert.equal(captured.redirect, "manual");
});

test("retryUntil 成功、耗尽和取消", async () => {
    let calls = 0;
    const engine = createEngine({ baseUrl: "https://mock.local", fetch: async () => jsonResponse({ ready: ++calls >= 3 }) });
    const retryScenario = defineScenario({
        name: "重试",
        steps: [{ name: "等待", path: "job", retryUntil: { maxAttempts: 3, intervalMs: 1 }, assertions: [{ path: "ready", equals: true }] }]
    });
    const success = await engine.runScenario(retryScenario);
    assert.equal(success.failed, 0);
    assert.equal(calls, 3);

    const controller = new AbortController();
    controller.abort(new Error("cancel test"));
    const cancelled = await engine.runScenario(retryScenario, { signal: controller.signal });
    assert.equal(cancelled.results[0].status, "CANCELLED");
});

test("when 条件不满足时安全跳过步骤", async () => {
    let calls = 0;
    const scenario = defineScenario({
        name: "条件步骤",
        vars: { cleanupId: "" },
        steps: [{
            name: "仅有目标时删除",
            method: "DELETE",
            path: "items/{{vars.cleanupId}}",
            when: { from: "vars", path: "cleanupId", exists: true }
        }]
    });
    const report = await createEngine({ baseUrl: "https://mock.local", fetch: async () => { calls += 1; return jsonResponse({}); } }).runScenario(scenario);
    assert.equal(calls, 0);
    assert.equal(report.results[0].status, "SKIPPED");
    assert.equal(report.results[0].passed, true);
});
