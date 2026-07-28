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
    const runtime = { vars: { id: "2070168391735058434", count: 3, payload: { ok: true } } };
    assert.equal(resolve("id={{vars.id}}", runtime), "id=2070168391735058434");
    assert.equal(resolve("{{vars.count}}", runtime), 3);
    assert.deepEqual(resolve("{{vars.payload}}", runtime), { ok: true });
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

test("签名稳定且敏感字段脱敏", () => {
    const first = generateSignature({ timestamp: 1, apiKey: "demo", nonce: "n" }, "secret");
    const second = generateSignature({ nonce: "n", apiKey: "demo", timestamp: 1 }, "secret");
    assert.equal(first, second);
    assert.match(first, /^[A-F0-9]{32}$/);
    assert.deepEqual(sanitizeSensitive({ apiKey: "abcdefghijklm", nested: { accessToken: "123456789012345" } }), {
        apiKey: "abcd...jklm",
        nested: { accessToken: "1234...2345" }
    });
});

test("配置规范化并拒绝缺少环境标识", () => {
    const config = defineConfig({ envs: [{ key: "local", name: "本地", baseUrl: "http://localhost" }], scenarios: ["scenarios/a.js"] });
    assert.equal(config.scenarios[0].url, "scenarios/a.js");
    assert.throws(() => defineConfig({ envs: [{ name: "无 key" }] }), /key/);
});
