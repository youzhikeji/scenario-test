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

test("本地适配器返回 status=LOCAL 时默认 2xx 断言不误判失败", async () => {
    const localAdapter = {
        matches: (step) => Boolean(step.prepareLocal),
        async execute() {
            return {
                method: "LOCAL",
                path: "local-step",
                response: { status: "LOCAL", headers: {}, body: { ok: true }, bodyText: null }
            };
        }
    };
    const scenario = defineScenario({
        name: "本地适配器步骤",
        steps: [{ name: "本地准备", prepareLocal: { marker: true } }]
    });
    const report = await createEngine({
        baseUrl: "https://mock.local",
        fetch: async () => { throw new Error("不应发起 HTTP 请求"); },
        adapters: { local: localAdapter }
    }).runScenario(scenario);
    assert.equal(report.executed, 1);
    assert.equal(report.failed, 0);
    assert.equal(report.passed, true);
    assert.equal(report.results[0].assertions[0].name, "返回 HTTP 2xx");
    assert.equal(report.results[0].assertions[0].passed, true);
    assert.equal(report.results[0].assertions[0].actual, "LOCAL");
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

test("全局参数注入 header/query/cookie", async () => {
    let captured;
    const engine = createEngine({
        baseUrl: "https://mock.local",
        globals: [
            { type: "header", name: "X-Trace", value: "trace-1" },
            { type: "query", name: "source", value: "scenario-test" },
            { type: "cookie", name: "sid", value: "abc-123" }
        ],
        fetch: async (url, options) => {
            captured = { url, headers: options.headers };
            return jsonResponse({ ok: true });
        }
    });
    await engine.runScenario(defineScenario({ name: "全局参数", steps: [{ name: "g", path: "api/list" }] }));
    assert.equal(captured.headers["X-Trace"], "trace-1");
    assert.equal(captured.headers.Cookie, "sid=abc-123");
    assert.match(captured.url, /[?&]source=scenario-test$/);
});

test("全局参数值支持 vars 模板且同名参数步骤优先", async () => {
    let captured;
    const engine = createEngine({
        baseUrl: "https://mock.local",
        vars: { traceId: "vars-trace" },
        globals: [
            { type: "header", name: "X-Trace", value: "{{vars.traceId}}" },
            { type: "header", name: "X-Override", value: "global" },
            { type: "query", name: "page", value: "global-page" }
        ],
        fetch: async (url, options) => {
            captured = { url, headers: options.headers };
            return jsonResponse({ ok: true });
        }
    });
    await engine.runScenario(defineScenario({
        name: "模板与覆盖",
        steps: [{
            name: "g",
            path: "api/list",
            params: { page: 2 },
            request: { headers: { "X-Override": "step" } }
        }]
    }));
    assert.equal(captured.headers["X-Trace"], "vars-trace");
    assert.equal(captured.headers["X-Override"], "step");
    assert.match(captured.url, /[?&]page=2$/);
    assert.doesNotMatch(captured.url, /global-page/);
});

test("cookie 全局参数追加到已有 Cookie 头", async () => {
    let captured;
    const engine = createEngine({
        baseUrl: "https://mock.local",
        globals: [{ type: "cookie", name: "sid", value: "abc" }],
        fetch: async (url, options) => {
            captured = options.headers;
            return jsonResponse({ ok: true });
        }
    });
    await engine.runScenario(defineScenario({
        name: "Cookie 合并",
        steps: [{ name: "g", path: "api", request: { headers: { Cookie: "a=1" } } }]
    }));
    assert.equal(captured.Cookie, "a=1; sid=abc");
});

test("绝对 URL 不注入全局参数与 authorization", async () => {
    let captured;
    const engine = createEngine({
        baseUrl: "https://mock.local",
        authorization: "Bearer env-token",
        globals: [{ type: "header", name: "X-Trace", value: "t" }],
        fetch: async (url, options) => {
            captured = { url, headers: options.headers };
            return jsonResponse({ ok: true });
        }
    });
    await engine.runScenario(defineScenario({
        name: "外部地址",
        steps: [{ name: "g", path: "https://external.example.com/api" }]
    }));
    assert.equal(captured.headers["X-Trace"], undefined);
    assert.equal(captured.headers.Authorization, undefined);
});

test("旧 authorization 配置兜底注入且全局 header 优先", async () => {
    let captured;
    const engine = createEngine({
        baseUrl: "https://mock.local",
        authorization: "Bearer legacy-token",
        fetch: async (url, options) => {
            captured = options.headers;
            return jsonResponse({ ok: true });
        }
    });
    await engine.runScenario(defineScenario({ name: "兼容", steps: [{ name: "g", path: "api" }] }));
    assert.equal(captured.Authorization, "Bearer legacy-token");

    const engine2 = createEngine({
        baseUrl: "https://mock.local",
        authorization: "Bearer legacy-token",
        globals: [{ type: "header", name: "Authorization", value: "Bearer global-token" }],
        fetch: async (url, options) => {
            captured = options.headers;
            return jsonResponse({ ok: true });
        }
    });
    await engine2.runScenario(defineScenario({ name: "兼容2", steps: [{ name: "g", path: "api" }] }));
    assert.equal(captured.Authorization, "Bearer global-token");
});

test("defineConfig 拒绝非法全局参数", async () => {
    const { defineConfig } = await import("../src/index.js");
    assert.throws(() => defineConfig({ envs: [{ key: "a", name: "A" }], globals: [{ type: "body", name: "x", value: "1" }] }), /type 必须是 header\/cookie\/query/);
    assert.throws(() => defineConfig({ globals: [{ type: "header", name: "" }] }), /缺少 name/);
    assert.throws(() => defineConfig({ globals: [{ type: "header", name: "X", value: "1" }, { type: "header", name: "X", value: "2" }] }), /全局参数重复/);
    const config = defineConfig({
        globals: [{ type: "header", name: "X-G", value: "g" }],
        envs: [{ key: "a", name: "A", globals: [{ type: "query", name: "q", value: 1 }] }]
    });
    assert.deepEqual(config.globals, [{ type: "header", name: "X-G", value: "g" }]);
    assert.deepEqual(config.envs[0].globals, [{ type: "query", name: "q", value: "1" }]);
});

test("when 对象形式定义期校验：只允许 from vars，禁止 target/header 与未知断言键", () => {
    const base = { name: "W", steps: [{ name: "s", path: "x" }] };
    assert.throws(() => defineScenario({ ...base, steps: [{ name: "s", path: "x", when: { path: "code", equals: 200 } }] }), /when 对象形式只允许 from: "vars"/);
    assert.throws(() => defineScenario({ ...base, steps: [{ name: "s", path: "x", when: { from: "body", path: "code", equals: 200 } }] }), /只允许 from: "vars"/);
    assert.throws(() => defineScenario({ ...base, steps: [{ name: "s", path: "x", when: { from: "vars", target: "status", equals: 200 } }] }), /不允许使用 target\/header/);
    assert.throws(() => defineScenario({ ...base, steps: [{ name: "s", path: "x", when: { from: "vars", path: "code", bogus: 1 } }] }), /未知键 "bogus"/);
    assert.throws(() => defineScenario({ ...base, steps: [{ name: "s", path: "x", when: { from: "vars", path: "code" } }] }), /必须至少包含一个操作符/);
    // 合法 when 与模板真值形式不抛
    defineScenario({ ...base, steps: [{ name: "s", path: "x", when: { from: "vars", path: "cleanupId", exists: true } }] });
    defineScenario({ ...base, steps: [{ name: "s", path: "x", when: "{{vars.flag}}" }] });
    defineScenario({ ...base, steps: [{ name: "s", path: "x", when: false }] });
});

test("定义期拒绝非法断言（含 retryUntil 防御性 assertions）", () => {
    const base = { name: "A", steps: [{ name: "s", path: "x", assertions: [{ path: "code", equals: 200 }] }] };
    assert.throws(() => defineScenario({ name: "A", steps: [{ name: "s", path: "x", assertions: [{ path: "code" }] }] }), /必须至少包含一个操作符/);
    assert.throws(() => defineScenario({ name: "A", steps: [{ name: "s", path: "x", assertions: [{ path: "code", equals: 200, foo: 1 }] }] }), /未知键 "foo"/);
    assert.throws(() => defineScenario({
        name: "A",
        steps: [{ name: "s", path: "x", retryUntil: { maxAttempts: 3, assertions: [{ path: "code" }] } }]
    }), /必须至少包含一个操作符/);
    // 真实协议：retryUntil 本身不含断言，带合法 maxAttempts/intervalMs 不抛
    defineScenario({ name: "A", steps: [{ name: "s", path: "x", retryUntil: { maxAttempts: 3, intervalMs: 100 }, assertions: [{ path: "code", equals: 200 }] }] });
});

test("保留变量 runId/runNo 禁止在 config vars、generatedVars、envVars 中声明", async () => {
    const ok = async (vars) => {
        const report = await createEngine({ baseUrl: "https://mock.local", fetch: async () => jsonResponse({}) }).runScenario(
            defineScenario({ name: "R", steps: [{ name: "s", path: "x" }] }),
            { vars }
        );
        return report;
    };
    await ok({ token: "t" });
    const engineFor = (opts = {}) => createEngine({ baseUrl: "https://mock.local", fetch: async () => jsonResponse({}), ...opts });
    await assert.rejects(engineFor({ vars: { runId: "x" } }).runScenario(defineScenario({ name: "R", steps: [{ name: "s", path: "x" }] })), /保留变量/);
    // scenario.vars 定义期拒绝
    assert.throws(() => defineScenario({ name: "R", vars: { runNo: "x" }, steps: [{ name: "s", path: "x" }] }), /保留变量/);
    // envVars / generatedVars 运行期拒绝
    await assert.rejects(engineFor().runScenario(defineScenario({ name: "R", envVars: { runId: "ENV_X" }, steps: [{ name: "s", path: "x" }] })), /保留变量/);
    await assert.rejects(engineFor().runScenario(defineScenario({ name: "R", generatedVars: [{ name: "runNo", type: "timestamp" }], steps: [{ name: "s", path: "x" }] })), /保留变量/);
});

test("extract required:true 路径不存在时步骤失败；默认路径缺失产生 warning 并保持兼容", async () => {
    const engine = createEngine({ baseUrl: "https://mock.local", fetch: async () => jsonResponse({ code: 200 }) });
    const requiredScenario = defineScenario({
        name: "强制提取",
        steps: [{ name: "提取缺失字段", path: "x", extract: [{ name: "missing", path: "data.id", required: true }], assertions: [{ path: "code", equals: 200 }] }]
    });
    const requiredReport = await engine.runScenario(requiredScenario);
    assert.equal(requiredReport.failed, 1);
    assert.equal(requiredReport.results[0].passed, false);
    assert.match(requiredReport.results[0].error, /提取 missing/);

    const relaxedScenario = defineScenario({
        name: "宽松提取",
        steps: [{ name: "提取缺失字段", path: "x", extract: [{ name: "missing", path: "data.id" }], assertions: [{ path: "code", equals: 200 }] }]
    });
    const relaxedReport = await engine.runScenario(relaxedScenario);
    assert.equal(relaxedReport.failed, 0);
    assert.equal(relaxedReport.results[0].warnings.length, 1);
    assert.match(relaxedReport.results[0].warnings[0], /missing/);
    assert.equal(relaxedReport.results[0].passed, true);
});

test("SKIP 统计：全跳过为 SKIPPED，部分跳过保持 PASSED，SKIP 不计 executed/passedSteps", async () => {
    const engine = createEngine({
        baseUrl: "https://mock.local",
        fetch: async () => jsonResponse({ ok: true })
    });
    const allSkipped = await engine.runScenario(defineScenario({
        name: "全跳过",
        steps: [
            { name: "a", path: "a", when: { from: "vars", path: "missing", exists: true } },
            { name: "b", path: "b", when: { from: "vars", path: "missing", exists: true } }
        ]
    }));
    assert.equal(allSkipped.status, "SKIPPED");
    assert.equal(allSkipped.skipped, 2);
    assert.equal(allSkipped.executed, 0);
    assert.equal(allSkipped.passedSteps, 0);
    assert.equal(allSkipped.failed, 0);
    assert.equal(allSkipped.passed, true);
    assert.ok(allSkipped.results.every((item) => item.skipped && item.passed === true));

    const partial = await engine.runScenario(defineScenario({
        name: "部分跳过",
        steps: [
            { name: "执行", path: "a" },
            { name: "跳过", path: "b", when: { from: "vars", path: "missing", exists: true } }
        ]
    }));
    assert.equal(partial.status, "PASSED");
    assert.equal(partial.skipped, 1);
    assert.equal(partial.executed, 1);
    assert.equal(partial.passedSteps, 1);
    assert.equal(partial.failed, 0);
    assert.equal(partial.passed, true);
    assert.equal(partial.results.filter((item) => item.skipped).length, 1);
});

