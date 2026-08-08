import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { validatePath } from "../utils/path-validator.js";

export function createXlsxAdapter(options = {}) {
    const workspace = path.resolve(options.workspace || process.cwd());
    return {
        matches(step) {
            return Boolean(step.prepareXlsx);
        },
        async execute({ step }) {
            const definition = step.prepareXlsx;

            // ✅ 验证模板路径在工作区内
            let templatePath;
            try {
                templatePath = validatePath(workspace, definition.template);
            } catch (error) {
                throw new Error(
                    `Excel 模板路径不安全: ${definition.template}\n` +
                    `原因: ${error.message}\n` +
                    `提示: 模板必须在工作区内 (${workspace})`
                );
            }

            // ✅ 验证输出路径在工作区内
            let outputPath;
            try {
                outputPath = validatePath(workspace, definition.output);
            } catch (error) {
                throw new Error(
                    `Excel 输出路径不安全: ${definition.output}\n` +
                    `原因: ${error.message}\n` +
                    `提示: 输出路径必须在工作区内 (${workspace})`
                );
            }

            if (!fs.existsSync(templatePath)) throw new Error(`Excel 模板不存在: ${templatePath}`);
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(templatePath);
            const worksheet = definition.sheet
                ? workbook.getWorksheet(definition.sheet)
                : workbook.worksheets[0];
            if (!worksheet) throw new Error("Excel 模板没有可用工作表");
            for (const item of definition.cells || []) worksheet.getCell(item.cell).value = item.value;
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            await workbook.xlsx.writeFile(outputPath);
            return {
                method: "XLSX",
                path: outputPath,
                response: { status: "LOCAL", headers: {}, body: { savedTo: outputPath }, bodyText: null }
            };
        }
    };
}

export async function readWorkbookRows(filePath, options = {}) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = options.sheet ? workbook.getWorksheet(options.sheet) : workbook.worksheets[0];
    if (!worksheet) return [];
    const headerRow = worksheet.getRow(options.headerRow || 1);
    const headers = headerRow.values.slice(1).map((value) => String(value ?? ""));
    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber <= (options.headerRow || 1)) return;
        const record = {};
        headers.forEach((header, index) => { record[header] = row.getCell(index + 1).value; });
        rows.push({ rowNumber, record });
    });
    return rows;
}

export default createXlsxAdapter;
