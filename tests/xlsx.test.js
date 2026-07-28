import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import ExcelJS from "exceljs";
import { createXlsxAdapter, readWorkbookRows } from "../src/adapters/xlsx.js";

test("Excel 适配器按单元格写入模板并可读取", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-xlsx-"));
    try {
        const template = path.join(directory, "template.xlsx");
        const output = path.join(directory, "output.xlsx");
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Sheet1");
        sheet.getCell("A1").value = "name";
        sheet.getCell("B1").value = "value";
        await workbook.xlsx.writeFile(template);

        const adapter = createXlsxAdapter({ workspace: directory });
        const result = await adapter.execute({ step: { prepareXlsx: { template: "template.xlsx", output: "output.xlsx", cells: [{ cell: "A2", value: "demo" }, { cell: "B2", value: 7 }] } } });
        assert.equal(result.response.status, "LOCAL");
        const rows = await readWorkbookRows(output);
        assert.equal(rows[0].record.name, "demo");
        assert.equal(rows[0].record.value, 7);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});
