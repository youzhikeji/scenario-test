import fs from "node:fs";
import path from "node:path";

export function createNodeIo(workspace = process.cwd()) {
    const root = path.resolve(workspace);
    return {
        async createUploadBody(definition) {
            const filePath = typeof definition === "string" ? definition : definition.filePath;
            const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(root, filePath);
            if (!fs.existsSync(absolutePath)) throw new Error(`上传文件不存在: ${absolutePath}`);
            const fieldName = definition.fieldName || "file";
            const filename = definition.filename || path.basename(absolutePath);
            const form = new FormData();
            form.append(fieldName, new Blob([fs.readFileSync(absolutePath)]), filename);
            for (const [name, value] of Object.entries(definition.fields || {})) form.append(name, String(value));
            return { body: form, omitContentType: true };
        },
        async saveResponse(relativePath, data, metadata = {}) {
            const absolutePath = path.isAbsolute(relativePath) ? relativePath : path.resolve(root, relativePath);
            fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
            fs.writeFileSync(absolutePath, data);
            return { savedTo: absolutePath, size: data.byteLength, contentType: metadata.contentType || "" };
        }
    };
}
