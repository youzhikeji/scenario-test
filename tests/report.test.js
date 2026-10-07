import assert from "node:assert/strict";
import test from "node:test";
import { buildMarkdownReport } from "../src/browser/ui/ui-view.js";

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
