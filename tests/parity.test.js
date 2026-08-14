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

// 每个用例的期望 passed（与 assertionCases 顺序一一对应）。
// 逐条锁定极性，防止 includes 数组深比较 / oneOf 非数组 / exists 缺失路径等假绿回归。
const expectedPassed = [
    true,  // exists: code 存在
    false, // exists: missing 不存在
    true,  // exists:false 且 empty=""（空串视为不存在）
    true,  // exists:false 且 missing 不存在
    true,  // equals 200
    true,  // equals {{expectedStatus}}
    true,  // equals 对象深比较
    true,  // notEquals 201
    false, // notEquals 200
    false, // notEquals 对象深比较
    true,  // includes: items=[1,2,3] 含 2
    false, // includes: items 不含 9
    false, // includes: "2" 与数字 2 类型不同（深比较）
    true,  // includes: list=[10,20] 含 20
    false, // includes: list 含 2（假绿回归：数组不得字符串化）
    false, // includes: list 不含 {x:1}
    true,  // includes: 非数组 empty="" 含 ""
    true,  // includes: 非数组 10 含 "1"
    true,  // includes: 非数组 10 含 10
    true,  // matches ^10$
    false, // matches ^9$
    false, // matches "(" 无效正则 → 失败而非抛异常
    true,  // oneOf [200,201]
    false, // oneOf [201,202]
    true,  // oneOf {{candidates}}
    false, // oneOf {{candidates}} 对 total
    false, // oneOf {{nonArray}}（假绿回归：必须 FAIL 而非跳过）
    true,  // oneOf [{x:1},{y:2}]
    false, // oneOf [{x:2}]
    false, // oneOf {{list}} 对 code
    true,  // gt 9
    false, // gt 10
    true,  // gte 10
    false, // gte 11
    true,  // lt 11
    false, // lt 10
    true,  // lte 10
    false, // lte 9
    false, // gt "9" 字符串不参与数值比较
    true,  // gt {{min}}
    true,  // target:status equals 200
    false, // target:status equals 201
    true,  // header X-Total equals "42"
    true,  // header X-Missing exists:false
    true,  // header content-type matches
    true,  // from:vars min equals 5
    true,  // from:vars missing exists:false
    true,  // from:headers X-Total equals "42"
    true,  // from:headers X-Missing exists:false
    true,  // from:bodyText matches code
    true,  // from:bodyText equals 原始 JSON
    true,  // path code equals 200
    true   // path nested.flag equals true
];

test("断言求值极性：全部操作符逐条锁定 passed（含 includes/oneOf/exists 假绿回归）", () => {
    assert.equal(assertionCases.length, expectedPassed.length, "用例与期望值数量必须一致");
    assertionCases.forEach((definition, index) => {
        const result = nodeCore.evaluateAssertion(definition, response, runtime);
        assert.equal(
            result.passed,
            expectedPassed[index],
            `断言 ${JSON.stringify(definition)} 的 passed 应为 ${expectedPassed[index]}`
        );
    });
});

test("断言求值深比较语义：includes 数组不字符串化、oneOf 非数组必须失败、exists 空串为不存在", () => {
    // includes 数组深比较：actual=[10,20] 与 expected=2 类型/值均不匹配（历史假绿回归）
    const listIncludes = nodeCore.evaluateAssertion({ path: "list", includes: 2 }, response, runtime);
    assert.equal(listIncludes.passed, false);
    assert.deepEqual(listIncludes.actual, [10, 20]);

    // oneOf 非数组 expected：必须 FAIL 而非被跳过（historical 假绿）
    const oneOfNonArray = nodeCore.evaluateAssertion({ path: "code", oneOf: "{{vars.nonArray}}" }, response, runtime);
    assert.equal(oneOfNonArray.passed, false);
    assert.equal(oneOfNonArray.expected, "nope");

    // exists 空串视为不存在：actual="" 且 exists:false → 通过
    const existsEmpty = nodeCore.evaluateAssertion({ path: "empty", exists: false }, response, runtime);
    assert.equal(existsEmpty.passed, true);
    assert.equal(existsEmpty.actual, "");
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