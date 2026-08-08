import assert from "node:assert/strict";
import test from "node:test";
import {
    applyExtract,
    buildAssertions,
    defineConfig,
    generateSignature,
    joinUrl,
    resolve,
    sanitizeSensitive
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
});
