import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";

export function createXlsxAdapter(options = {}) {
    const workspace = path.resolve(options.workspace || process.cwd());
    return {
        matches(step) {
            return Boolean(step.prepareXlsx);
        },
        async execute({ step }) {
            const definition = step.prepareXlsx;
            const templatePath = path.isAbsolute(definition.template)
                ? definition.template
                : path.resolve(workspace, definition.template);
            const outputPath = path.isAbsolute(definition.output)
                ? definition.output
                : path.resolve(workspace, definition.output);
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
