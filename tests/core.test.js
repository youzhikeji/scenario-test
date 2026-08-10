import assert from "node:assert/strict";
import test from "node:test";
import {
    applyExtract,
    buildAssertions,
    defineConfig,
    evaluateAssertion,
    generateSignature,
    joinUrl,
    resolve,
    sanitizeSensitive,
    validateAssertion
} from "../src/index.js";

test("模板插值保留完整表达式的原始类型和长整型字符串", () => {
    const runtime = {
        vars: {
            id: "2070168391735058434",
            count: 3,
            payload: { ok: true },
            runNo: "123456",
            recordName: "scenario-{{vars.runNo}}",
            self: "{{vars.self}}"
        }
    };
    assert.equal(resolve("id={{vars.id}}", runtime), "id=2070168391735058434");
    assert.equal(resolve("{{vars.count}}", runtime), 3);
    assert.deepEqual(resolve("{{vars.payload}}", runtime), { ok: true });
    assert.equal(resolve("{{vars.recordName}}", runtime), "scenario-123456");
    assert.equal(resolve("name={{vars.recordName}}", runtime), "name=scenario-123456");
    assert.equal(resolve("{{vars.self}}", runtime), "{{vars.self}}");
});

test("断言、响应提取和 URL 拼接", () => {
    const runtime = { vars: {}, lastResponse: null, lastResponseBody: null };
    const step = {
        status: 200,
        extract: [{ name: "createdId", path: "data.id" }],
        assertions: [{ name: "成功", path: "code", equals: 200 }]
    };
    const response = { status: 200, headers: {}, body: { code: 200, data: { id: "9007199254740993" } }, bodyText: "" };
    applyExtract(step, response, runtime);
    assert.equal(runtime.vars.createdId, "9007199254740993");
    assert.ok(buildAssertions(step, response, runtime).every((item) => item.passed));
    assert.equal(joinUrl("http://localhost:8080/", "/health"), "http://localhost:8080/health");
});

test("未声明断言时默认要求 HTTP 2xx", () => {
    const runtime = { vars: {}, lastResponse: null, lastResponseBody: null };
    const success = buildAssertions({}, { status: 204, headers: {}, body: null, bodyText: "" }, runtime);
    const failure = buildAssertions({}, { status: 500, headers: {}, body: null, bodyText: "" }, runtime);
    assert.equal(success.length, 1);
    assert.equal(success[0].passed, true);
    assert.equal(failure[0].passed, false);
});

test("默认 2xx 断言不误伤本地适配器（status 为 LOCAL 字符串）", () => {
    const runtime = { vars: {}, lastResponse: null, lastResponseBody: null };
    const local = buildAssertions({}, { status: "LOCAL", headers: {}, body: { savedTo: "/tmp/a.xlsx" }, bodyText: null }, runtime);
    assert.equal(local.length, 1);
    assert.equal(local[0].name, "返回 HTTP 2xx");
    assert.equal(local[0].passed, true);
    assert.equal(local[0].actual, "LOCAL");
});

test("签名稳定且调试数据保留原始值", () => {
    const first = generateSignature({ timestamp: 1, apiKey: "demo", nonce: "n" }, "secret");
    const second = generateSignature({ nonce: "n", apiKey: "demo", timestamp: 1 }, "secret");
    assert.equal(first, second);
    assert.match(first, /^[A-F0-9]{32}$/);
    assert.deepEqual(sanitizeSensitive({ apiKey: "abcdefghijklm", nested: { accessToken: "123456789012345" } }), {
        apiKey: "abcdefghijklm",
        nested: { accessToken: "123456789012345" }
    });
});

test("配置规范化并拒绝缺少环境标识", () => {
    const config = defineConfig({ envs: [{ key: "local", name: "本地", baseUrl: "http://localhost" }], scenarios: ["scenarios/a.js"] });
    assert.equal(config.scenarios[0].url, "scenarios/a.js");
    assert.throws(() => defineConfig({ envs: [{ name: "无 key" }] }), /key/);
    assert.throws(() => defineConfig({ envs: [{ key: "same", name: "一" }, { key: "same", name: "二" }] }), /重复/);
    assert.throws(() => defineConfig({ envs: [{ key: "local", name: "本地" }], defaultEnvKey: "missing" }), /defaultEnvKey/);
    assert.throws(() => defineConfig({ scenarios: [{ id: "empty", name: "空场景" }] }), /url/);
    assert.throws(() => defineConfig({ scenarios: [""] }), /不能为空/);
    assert.throws(() => defineConfig({ variables: [{ name: "token" }, { name: "token" }] }), /重复/);
    assert.throws(() => defineConfig({ requestTimeoutMs: 0 }), /正数/);
    assert.throws(() => defineConfig({ scenarios: [{ id: "m", url: "s.js", manual: "yes" }] }), /manual 必须是布尔值/);
});

function runtimeWith(vars = {}) {
    return { vars, lastResponse: null, lastResponseBody: null };
}

function responseWith(body, status = 200) {
    return { status, headers: {}, body, bodyText: typeof body === "string" ? body : "" };
}

test("断言 schema：未知键与缺少操作符立即抛错，错误含定位信息", () => {
    const context = { scenarioName: "S1", stepNo: 2, stepName: "步骤B", assertionNo: 3 };
    assert.throws(() => validateAssertion({ path: "x", unknownKey: 1 }, context), /场景 S1 第 2 步 步骤 步骤B 第 3 条断言无效.*未知键 "unknownKey"/);
    assert.throws(() => validateAssertion({ path: "x" }, context), /必须至少包含一个操作符/);
    assert.throws(() => validateAssertion({ name: "n", path: "x", foo: 1, equals: 2 }, context), /未知键 "foo"/);
    assert.throws(() => validateAssertion(null, context), /必须是对象/);
    // 合法断言不抛
    validateAssertion({ name: "ok", path: "data.total", gte: 5, implicit: false }, context);
});

test("五个新增操作符 pass/fail", () => {
    const runtime = runtimeWith();
    const response = responseWith({ total: 10, items: ["a", "b"], obj: { x: 1 } });

    const notEqualsPass = evaluateAssertion({ path: "total", notEquals: 11 }, response, runtime);
    assert.equal(notEqualsPass.passed, true);
    const notEqualsFail = evaluateAssertion({ path: "total", notEquals: 10 }, response, runtime);
    assert.equal(notEqualsFail.passed, false);
    assert.equal(notEqualsFail.actual, 10);
    assert.equal(notEqualsFail.expected, 10);
    // 深比较取反：对象相等应失败
    assert.equal(evaluateAssertion({ path: "obj", notEquals: { x: 1 } }, response, runtime).passed, false);
    assert.equal(evaluateAssertion({ path: "obj", notEquals: { x: 2 } }, response, runtime).passed, true);

    assert.equal(evaluateAssertion({ path: "total", gt: 9 }, response, runtime).passed, true);
    assert.equal(evaluateAssertion({ path: "total", gt: 10 }, response, runtime).passed, false);
    assert.equal(evaluateAssertion({ path: "total", gte: 10 }, response, runtime).passed, true);
    assert.equal(evaluateAssertion({ path: "total", gte: 11 }, response, runtime).passed, false);
    assert.equal(evaluateAssertion({ path: "total", lt: 11 }, response, runtime).passed, true);
    assert.equal(evaluateAssertion({ path: "total", lt: 10 }, response, runtime).passed, false);
    assert.equal(evaluateAssertion({ path: "total", lte: 10 }, response, runtime).passed, true);
    assert.equal(evaluateAssertion({ path: "total", lte: 9 }, response, runtime).passed, false);
});

test("数字比较断言：类型不符合时断言失败而非抛异常，并保留 actual/expected", () => {
    const runtime = runtimeWith();
    const stringBody = responseWith({ total: "10" });
    // actual 是字符串：不隐式转换，断言失败
    const result = evaluateAssertion({ path: "total", gte: 5 }, stringBody, runtime);
    assert.equal(result.passed, false);
    assert.equal(result.actual, "10");
    assert.equal(result.expected, 5);
    // expected 是字面字符串 "5"：不做隐式转换，断言失败
    assert.equal(evaluateAssertion({ path: "total", gte: "5" }, responseWith({ total: 10 }), runtime).passed, false);
    // expected 是整段模板且变量为数字时保留数字类型，断言通过
    const templated = evaluateAssertion({ path: "total", gte: "{{vars.min}}" }, responseWith({ total: 10 }), runtimeWith({ min: 5 }));
    assert.equal(templated.passed, true);
    // 非有限数字（NaN/Infinity）断言失败而非抛异常
    assert.equal(evaluateAssertion({ path: "total", gte: NaN }, responseWith({ total: 10 }), runtime).passed, false);
    assert.equal(evaluateAssertion({ path: "total", lte: Infinity }, responseWith({ total: 10 }), runtime).passed, false);
});

test("运行时非法断言被 evaluateAssertion 拒绝（防止插件绕过）", () => {
    const runtime = runtimeWith();
    const response = responseWith({ total: 10 });
    assert.throws(() => evaluateAssertion({ path: "total", gte: 5, bogus: 1 }, response, runtime), /未知键 "bogus"/);
    assert.throws(() => evaluateAssertion({ path: "total" }, response, runtime), /必须至少包含一个操作符/);
});

test("extract required:true 路径不存在时返回 failures；默认产生 warning 且不含响应内容", () => {
    const runtime = runtimeWith({});
    const response = responseWith({ code: 200 });
    const required = applyExtract({ extract: [{ name: "missingId", path: "data.id", required: true }] }, response, runtime);
    assert.equal(required.failures.length, 1);
    assert.equal(required.failures[0].passed, false);
    assert.match(required.failures[0].name, /missingId/);
    assert.equal(required.warnings.length, 0);
    assert.equal(runtime.vars.missingId, undefined);

    const relaxed = applyExtract({ extract: [{ name: "relaxedId", path: "data.id" }] }, response, runtime);
    assert.equal(relaxed.failures.length, 0);
    assert.equal(relaxed.warnings.length, 1);
    assert.match(relaxed.warnings[0], /relaxedId/);
    assert.doesNotMatch(relaxed.warnings[0], /secret|token/i);
    assert.equal(runtime.vars.relaxedId, undefined);

    // 正常路径无 warning 无 failure
    const ok = applyExtract({ extract: [{ name: "code", path: "code" }] }, response, runtime);
    assert.equal(ok.failures.length, 0);
    assert.equal(ok.warnings.length, 0);
    assert.equal(runtime.vars.code, 200);
});

test("extract 不允许覆盖保留变量 runId/runNo", () => {
    const runtime = runtimeWith({});
    const response = responseWith({ id: "1" });
    assert.throws(() => applyExtract({ extract: [{ name: "runId", path: "id" }] }, response, runtime), /保留变量/);
    assert.throws(() => applyExtract({ extract: [{ name: "runNo", path: "id" }] }, response, runtime), /保留变量/);
});
