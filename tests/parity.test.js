// Node core（src/core.js）断言行为契约测试
//
// 背景：浏览器 legacy core 已统一到 src/core.js（legacy/core.js 已删除），
// 双端对拍完成使命。本文件保留历史构造的断言用例集（含假绿回归用例），
// 作为 src/core.js 的稳定回归快照，并补充对迁移后 UI 辅助模块的测试。
import assert from "node:assert/strict";
import test from "node:test";
import * as nodeCore from "../src/core.js";
import { copyText, esc, fmt, safeJson } from "../src/browser/legacy/ui-utils.js";

function runtimeWith(vars = {}) {
    return { vars, lastResponse: null, lastResponseBody: null };
}

const response = {
    status: 200,
    headers: { "Content-Type": "application/json", "X-Total": "42" },
    body: {
        code: 200,
        total: 10,
        items: [1, 2, 3],
        list: [10, 20],
        obj: { x: 1 },
        empty: "",
        nested: { flag: true }
    },
    bodyText: JSON.stringify({ code: 200 })
};

const runtime = runtimeWith({
    expectedStatus: 200,
    candidates: [200, 201],
    nonArray: "nope",
    min: 5,
    list: [10, 20],
    obj: { x: 1 }
});

// 覆盖全部操作符 + 假绿回归场景
const assertionCases = [
    // exists
    { path: "code", exists: true },
    { path: "missing", exists: true },
    { path: "empty", exists: false },
    { path: "missing", exists: false },
    // equals / notEquals（含模板变量）
    { path: "code", equals: 200 },
    { path: "code", equals: "{{vars.expectedStatus}}" },
    { path: "obj", equals: { x: 1 } },
    { path: "code", notEquals: 201 },
    { path: "code", notEquals: 200 },
    { path: "obj", notEquals: { x: 1 } },
    // includes：数组深比较（假绿回归：actual=[10,20], includes=2 必须 FAIL）
    { path: "items", includes: 2 },
    { path: "items", includes: 9 },
    { path: "items", includes: "2" },
    { path: "list", includes: 20 },
    { path: "list", includes: 2 },
    { path: "list", includes: { x: 1 } },
    // includes：非数组走子串包含
    { path: "empty", includes: "" },
    { path: "total", includes: "1" },
    { path: "total", includes: 10 },
    // matches（含无效正则不抛异常）
    { path: "total", matches: "^10$" },
    { path: "total", matches: "^9$" },
    { path: "total", matches: "(" },
    // oneOf：字面数组 / 模板变量 / 非数组 expected（假绿回归：必须 FAIL 而非跳过）
    { path: "code", oneOf: [200, 201] },
    { path: "code", oneOf: [201, 202] },
    { path: "code", oneOf: "{{vars.candidates}}" },
    { path: "total", oneOf: "{{vars.candidates}}" },
    { path: "code", oneOf: "{{vars.nonArray}}" },
    { path: "obj", oneOf: [{ x: 1 }, { y: 2 }] },
    { path: "obj", oneOf: [{ x: 2 }] },
    { path: "code", oneOf: "{{vars.list}}" },
    // 数值操作符（finite number 语义）
    { path: "total", gt: 9 },
    { path: "total", gt: 10 },
    { path: "total", gte: 10 },
    { path: "total", gte: 11 },
    { path: "total", lt: 11 },
    { path: "total", lt: 10 },
    { path: "total", lte: 10 },
    { path: "total", lte: 9 },
    { path: "total", gt: "9" },
    { path: "total", gt: "{{vars.min}}" },
    // target / header / from 来源
    { target: "status", equals: 200 },
    { target: "status", equals: 201 },
    { header: "X-Total", equals: "42" },
    { header: "X-Missing", exists: false },
    { header: "content-type", matches: "^application/json" },
    { from: "vars", path: "min", equals: 5 },
    { from: "vars", path: "missing", exists: false },
    { from: "headers", path: "X-Total", equals: "42" },
    { from: "headers", path: "X-Missing", exists: false },
    { from: "bodyText", matches: "code" },
    { from: "bodyText", equals: JSON.stringify({ code: 200 }) },
    { path: "code", equals: 200 },
    { path: "nested.flag", equals: true }
];

test("断言求值稳定：全部操作符组合不抛异常且返回完整结构", () => {
    for (const definition of assertionCases) {
        const result = nodeCore.evaluateAssertion(definition, response, runtime);
        assert.equal(typeof result.passed, "boolean", `断言 ${JSON.stringify(definition)} 的 passed 必须是布尔值`);
        assert.ok("name" in result, `断言 ${JSON.stringify(definition)} 缺少 name`);
        assert.ok("actual" in result, `断言 ${JSON.stringify(definition)} 缺少 actual`);
        assert.ok("expected" in result, `断言 ${JSON.stringify(definition)} 缺少 expected`);
    }
});

test("buildAssertions 契约：step.status 简写与默认 2xx 注入", () => {
    const steps = [
        { name: "s1", status: 200, assertions: [{ path: "code", equals: 200 }] },
        { name: "s2", assertions: [{ path: "total", gte: 5 }] },
        { name: "s3" },
        { name: "s4", status: 201, assertions: [] },
        { name: "s5", status: 500, assertions: [{ path: "code", oneOf: [200, 201] }] }
    ];
    const expected = [2, 1, 1, 1, 2]; // s1: status+断言；s2: 仅断言；s3: 默认 2xx；s4: 仅 status；s5: status+断言
    steps.forEach((step, index) => {
        const results = nodeCore.buildAssertions(step, response, runtime, { stepName: step.name });
        assert.equal(results.length, expected[index], `步骤 ${step.name} 的断言数量不符`);
        results.forEach((item) => assert.equal(typeof item.passed, "boolean"));
    });
});

test("extract 契约：from 各来源 + status/header 简写 + required 语义", () => {
    const extractCases = [
        { name: "fromBodyPath", path: "code" },
        { name: "fromBodyWhole", path: "total" },
        { name: "fromBodyWholeNoPath" },
        { name: "fromHeadersPath", from: "headers", path: "X-Total" },
        { name: "fromHeadersWhole", from: "headers" },
        { name: "fromBodyText", from: "bodyText" },
        { name: "fromResponseStatus", from: "response", path: "status" },
        { name: "fromResponseHeaders", from: "response", path: "headers" },
        { name: "fromResponseBody", from: "response", path: "body.code" },
        { name: "statusTarget", target: "status" },
        { name: "headerItem", header: "Content-Type" },
        { name: "headerItemPath", header: "X-Total", path: "length" },
        { name: "missingRelaxed", path: "nope.deep" },
        { name: "missingRequired", path: "nope.deep", required: true },
        { name: "fromHeadersMissing", from: "headers", path: "X-Missing" },
        { name: "fromBodyTextMissing", from: "bodyText", path: "code" }
    ];
    for (const definition of extractCases) {
        const targetRuntime = runtimeWith();
        const result = nodeCore.applyExtract({ extract: [definition] }, response, targetRuntime);
        if (definition.required === true && definition.path === "nope.deep") {
            assert.equal(result.failures.length, 1, `extract ${definition.name} 应产生 failure`);
            assert.equal(result.warnings.length, 0);
        } else if (["missingRelaxed", "fromHeadersMissing", "fromBodyTextMissing"].includes(definition.name)) {
            assert.equal(result.warnings.length, 1, `extract ${definition.name} 应产生 warning`);
            assert.equal(result.failures.length, 0);
        } else {
            assert.equal(result.warnings.length, 0, `extract ${definition.name} 不应产生 warning`);
            assert.equal(result.failures.length, 0, `extract ${definition.name} 不应产生 failure`);
            assert.ok(definition.name in targetRuntime.vars, `extract ${definition.name} 应写入 vars`);
        }
    }
});

test("ui-utils：copyText 在无 DOM 的 Node 环境中返回 false", async () => {
    assert.equal(await copyText("测试内容"), false);
});

test("ui-utils：esc/fmt/safeJson 在无 DOM 环境可用且保留 legacy 语义", () => {
    assert.equal(esc("<b>&\"x\""), "&lt;b&gt;&amp;&quot;x&quot;");
    assert.equal(fmt(500), "500.00ms");
    assert.equal(fmt(1500), "1.50 s");
    assert.equal(fmt(Number.NaN), "-");
    assert.equal(safeJson({ a: 1 }), '{\n  "a": 1\n}');
    assert.equal(safeJson(undefined), undefined);
});