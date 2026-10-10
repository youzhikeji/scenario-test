import assert from "node:assert/strict";
import test from "node:test";
import { buildMarkdownReport, eachDetailRows } from "../src/browser/ui/ui-view.js";

// 最小失败步骤形状（buildMarkdownReport 只读这些字段；summary 省略时仅影响概览行）
function failedStep(overrides) {
    return Object.assign({
        stepNo: 1,
        name: "查列表",
        method: "GET",
        path: "/list",
        status: 200,
        passed: false,
        durationFmt: "1ms",
        error: "",
        warnings: [],
        assertions: [],
        response: {}
    }, overrides);
}

test("Markdown 报告值拼接转义：换行折叠为字面量，防拆行/伪列表", () => {
    const multiLine = "第一行\n- 伪列表项";
    const report = {
        steps: [failedStep({
            error: "错误A\n- 伪列表项",
            warnings: ["警告B\n- 伪列表项"],
            assertions: [{
                name: "note",
                passed: false,
                expected: "ok",
                actual: multiLine,
                detail: [{ index: 0, actual: multiLine, assertions: [{ name: "eq", passed: false, expected: "ok", actual: multiLine }] }]
            }]
        })]
    };
    const md = buildMarkdownReport(report);
    // 换行折叠为字面量 \n：明细/失败原因/警告三类拼接点都透出字面量而非真实换行
    assert.ok(md.includes("期望 ok,实得 第一行\\n- 伪列表项"), "明细行应含字面量 \\n");
    assert.ok(md.includes("失败原因**: 错误A\\n- 伪列表项"), "失败原因应含字面量 \\n");
    assert.ok(md.includes("警告**: 警告B\\n- 伪列表项"), "警告应含字面量 \\n");
    // 判别用例：未转义的实现会以真实换行拆行（值首换行/错误/警告三处任一漏转义即失败）
    assert.ok(!md.includes("第一行\n"), "明细值不得包含真实换行");
    assert.ok(!md.includes("错误A\n"), "失败原因不得包含真实换行");
    assert.ok(!md.includes("警告B\n"), "警告不得包含真实换行");
});

test("Markdown 报告值拼接转义：反斜杠先行转义，字面量与转义标记不混淆", () => {
    const report = {
        steps: [failedStep({
            assertions: [{
                name: "path",
                passed: false,
                expected: "C:\\dir",
                actual: "x",
                detail: [{ index: 0, actual: "x", assertions: [{ name: "eq", passed: false, expected: "C:\\dir", actual: "x" }] }]
            }]
        })]
    };
    const md = buildMarkdownReport(report);
    // 值内字面反斜杠翻倍为 \\，与换行标记 \n 区分，避免「值以反斜杠结尾 + 换行」歧义
    assert.ok(md.includes("期望 C:\\\\dir,实得 x"), "字面反斜杠应翻倍");
});

// 嵌套 each 失败明细的最小形状（引擎 evaluateAssertion 对子断言递归求值产出，
// 子 each 断言自带各自的 detail）：list[0].items[1].qty = 9 违反 lte 5
function nestedDetail() {
    return [{
        index: 0,
        actual: { items: [{ qty: 1 }, { qty: 9 }] },
        assertions: [{
            name: "items",
            passed: false,
            expected: { path: "qty", lte: 5 },
            actual: [{ qty: 1 }, { qty: 9 }],
            detail: [{
                index: 1,
                actual: { qty: 9 },
                assertions: [{ name: "qty", passed: false, expected: 5, actual: 9 }]
            }]
        }]
    }];
}

test("Markdown 报告递归展开嵌套 each 明细（路径 › 串联，缩进逐层加深）", () => {
    const report = {
        steps: [failedStep({
            assertions: [{ name: "list 逐项校验", passed: false, expected: { path: "items", each: { path: "qty", lte: 5 } }, actual: [], detail: nestedDetail() }]
        })]
    };
    const md = buildMarkdownReport(report);
    // 第一层明细保持既有格式（4 空格缩进），扁平场景输出不变
    assert.match(md, /^    - 第 1 项失败: 期望 \{"path":"qty","lte":5\},实得 /m);
    // 嵌套层：外层第 1 项的内层第 2 项（1 基序号），8 空格缩进
    assert.match(md, /^        - 第 1 项 › 第 2 项失败: 期望 5,实得 9$/m);
});

test("Markdown 报告明细行极性：失败断言透出、通过断言不透出", () => {
    const failed = buildMarkdownReport({ steps: [failedStep({ assertions: [{ name: "a", passed: false, expected: 1, actual: 2, detail: nestedDetail() }] })] });
    assert.match(failed, /- 第 1 项失败: /);
    // 引擎契约：通过断言不挂 detail；此处同时锁定渲染端不凭空产出明细行
    const passed = buildMarkdownReport({ steps: [failedStep({ passed: true, assertions: [{ name: "a", passed: true, expected: 1, actual: 1 }] })] });
    assert.doesNotMatch(passed, /项失败: /);
});

test("断言表明细行 eachDetailRows 递归展开且只含失败子断言", () => {
    const html = eachDetailRows(nestedDetail(), "");
    assert.ok(html.includes("↳ 第 1 项</td>"), "应有一层明细行");
    assert.ok(html.includes("↳ 第 1 项 › 第 2 项</td>"), "应有嵌套明细行");
    assert.ok(html.includes("text-rose-900\">9</td>"), "内层实际值应出现");
    // 通过的子断言不产生行（判别用例：只过滤一层的实现会多出行）
    const mixed = [{
        index: 0,
        actual: 1,
        assertions: [
            { name: "pass", passed: true, expected: 1, actual: 1 },
            { name: "fail", passed: false, expected: 2, actual: 3 }
        ]
    }];
    const mixedHtml = eachDetailRows(mixed, "");
    assert.equal(mixedHtml.split("<tr").length - 1, 1, "通过子断言不产生明细行");
    // 无明细时输出空串（通过断言路径）
    assert.equal(eachDetailRows(undefined, ""), "");
});

test("Markdown 报告代码围栏自适应：内容无反引号时保持三反引号（既有格式不变）", () => {
    const report = {
        steps: [failedStep({
            response: { headers: { "content-type": "application/json" }, bodyText: "{\"ok\":true}" }
        })]
    };
    const md = buildMarkdownReport(report);
    assert.ok(md.includes("```json\n{\n  \"content-type\": \"application/json\"\n}\n```"), "响应头围栏保持 3 个反引号");
    assert.ok(md.includes("```\n{\"ok\":true}\n```"), "响应体围栏保持 3 个反引号");
});

test("Markdown 报告代码围栏自适应：响应体含反引号序列时围栏加长且内容原样保留", () => {
    const body = "示例\n```\ncode\n```\n结束";
    const md = buildMarkdownReport({ steps: [failedStep({ response: { bodyText: body } })] });
    // 最长反引号序列 3 → 围栏升级为 4；内容原样（不转义/不改写，复制用途保留完整内容）
    assert.ok(md.includes("````\n" + body + "\n````"), "围栏应升级为 4 个反引号且响应体原样");
    // 更长序列：5 个反引号 → 围栏 6（判别用例：固定 3 或固定 4 的实现均失败）
    const longBody = "`````\n五连反引号\n`````";
    const md2 = buildMarkdownReport({ steps: [failedStep({ response: { bodyText: longBody } })] });
    assert.ok(md2.includes("``````\n" + longBody + "\n``````"), "围栏应随最长序列升级为 6 个反引号");
});

test("Markdown 报告代码围栏自适应：响应头含反引号时 json 围栏同样加长", () => {
    const md = buildMarkdownReport({ steps: [failedStep({ response: { headers: { "x-note": "```" } } })] });
    assert.ok(md.includes("````json\n"), "带 json 标记的围栏应升级为 4 个反引号");
    assert.ok(md.includes("\n````\n"), "闭合围栏同为 4 个反引号");
});
