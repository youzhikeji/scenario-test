// Node core（src/core.js）与浏览器 legacy core（src/browser/legacy/core.js）
// 的语义一致性契约测试：
//   - 不只比操作符名单，还要对同一组断言定义 + 响应 + runtime 分别求值，
//     逐条比对 passed / actual / expected
//   - 覆盖 includes 数组深比较、oneOf 模板变量、extract 各 from 来源、
//     target:'status' / header 提取，以及已知假绿回归用例
import assert from "node:assert/strict";
import test from "node:test";
import * as nodeCore from "../src/core.js";
import legacyCore from "../src/browser/legacy/core.js";

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

test("断言求值结果：browser legacy core 与 Node core 完全一致（passed/actual/expected）", () => {
    for (const definition of assertionCases) {
        const nodeResult = nodeCore.evaluateAssertion(definition, response, runtime);
        const legacyResult = legacyCore.evaluateAssertion(definition, response, runtime);
        assert.deepEqual(
            { passed: legacyResult.passed, actual: legacyResult.actual, expected: legacyResult.expected },
            { passed: nodeResult.passed, actual: nodeResult.actual, expected: nodeResult.expected },
            `断言 ${JSON.stringify(definition)} 两端求值不一致\nNode:   ${JSON.stringify(nodeResult)}\nLegacy: ${JSON.stringify(legacyResult)}`
        );
        assert.equal(legacyResult.name, nodeResult.name, `断言 ${JSON.stringify(definition)} 的 name 不一致`);
    }
});

test("buildAssertions 结果：legacy 与 Node 一致（含 step.status 简写与默认 2xx）", () => {
    const steps = [
        { name: "s1", status: 200, assertions: [{ path: "code", equals: 200 }] },
        { name: "s2", assertions: [{ path: "total", gte: 5 }] },
        { name: "s3" },
        { name: "s4", status: 201, assertions: [] },
        { name: "s5", status: 500, assertions: [{ path: "code", oneOf: [200, 201] }] }
    ];
    for (const step of steps) {
        const nodeResults = nodeCore.buildAssertions(step, response, runtime, { stepName: step.name });
        const legacyResults = legacyCore.buildAssertions(step, response, runtime, { stepName: step.name });
        assert.deepEqual(
            legacyResults.map((item) => ({ passed: item.passed, actual: item.actual, expected: item.expected })),
            nodeResults.map((item) => ({ passed: item.passed, actual: item.actual, expected: item.expected })),
            `步骤 ${JSON.stringify(step)} 的 buildAssertions 两端不一致`
        );
    }
});

test("extract 求值结果：legacy 与 Node 一致（from 各来源 + status/header + required 语义）", () => {
    const extractCases = [
        // from 各来源
        { name: "fromBodyPath", path: "code" },
        { name: "fromBodyWhole", path: "total" },
        { name: "fromBodyWholeNoPath" },
        { name: "fromHeadersPath", from: "headers", path: "X-Total" },
        { name: "fromHeadersWhole", from: "headers" },
        { name: "fromBodyText", from: "bodyText" },
        { name: "fromResponseStatus", from: "response", path: "status" },
        { name: "fromResponseHeaders", from: "response", path: "headers" },
        { name: "fromResponseBody", from: "response", path: "body.code" },
        // target / header 简写（legacy 保留路径，Node 同步支持）
        { name: "statusTarget", target: "status" },
        { name: "headerItem", header: "Content-Type" },
        { name: "headerItemPath", header: "X-Total", path: "length" },
        // 缺失语义：required true 失败 / 默认 warning
        { name: "missingRelaxed", path: "nope.deep" },
        { name: "missingRequired", path: "nope.deep", required: true },
        { name: "fromHeadersMissing", from: "headers", path: "X-Missing" },
        { name: "fromBodyTextMissing", from: "bodyText", path: "code" }
    ];
    for (const definition of extractCases) {
        const nodeRuntime = runtimeWith();
        const legacyRuntime = runtimeWith();
        const nodeResult = nodeCore.applyExtract({ extract: [definition] }, response, nodeRuntime);
        const legacyResult = legacyCore.applyExtract({ extract: [definition] }, response, legacyRuntime);
        assert.deepEqual(legacyResult, nodeResult, `extract ${JSON.stringify(definition)} 的 warnings/failures 两端不一致`);
        assert.deepEqual(legacyRuntime.vars, nodeRuntime.vars, `extract ${JSON.stringify(definition)} 的 vars 两端不一致`);
    }
});

test("legacy copyText 在无 DOM 的 Node 环境中返回 false", async () => {
    assert.equal(await legacyCore.copyText("测试内容"), false);
});
