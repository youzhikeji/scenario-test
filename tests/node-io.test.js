import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createNodeIo } from "../src/node.js";

function makeWorkspace() {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-io-"));
    fs.writeFileSync(path.join(workspace, "sample.txt"), "upload-payload", "utf8");
    return workspace;
}

test("createUploadBody：对象定义映射 fieldName/filename/fields 并构造 FormData", async () => {
    const workspace = makeWorkspace();
    try {
        const io = createNodeIo(workspace);
        const upload = await io.createUploadBody({
            filePath: "sample.txt",
            fieldName: "attachment",
            filename: "renamed.txt",
            fields: { note: "hello", count: 3 }
        });
        assert.equal(upload.omitContentType, true);
        assert.ok(upload.body instanceof FormData);
        const file = upload.body.get("attachment");
        assert.ok(file instanceof File, "字段应是 File");
        assert.equal(file.name, "renamed.txt");
        assert.equal(await file.text(), "upload-payload");
        // 附加字段值统一转字符串
        assert.equal(upload.body.get("note"), "hello");
        assert.equal(upload.body.get("count"), "3");
    } finally {
        fs.rmSync(workspace, { recursive: true, force: true });
    }
});

test("createUploadBody：字符串定义回退 file 字段与 basename 文件名", async () => {
    const workspace = makeWorkspace();
    try {
        const io = createNodeIo(workspace);
        const upload = await io.createUploadBody("sample.txt");
        const file = upload.body.get("file");
        assert.ok(file instanceof File);
        assert.equal(file.name, "sample.txt");
        assert.equal(await file.text(), "upload-payload");
    } finally {
        fs.rmSync(workspace, { recursive: true, force: true });
    }
});

test("createUploadBody：路径穿越与空路径拒绝", async () => {
    const workspace = makeWorkspace();
    try {
        const io = createNodeIo(workspace);
        await assert.rejects(
            () => io.createUploadBody("../outside.txt"),
            /文件上传路径不安全[\s\S]*路径越界/
        );
        await assert.rejects(
            () => io.createUploadBody("/etc/passwd"),
            /文件上传路径不安全[\s\S]*不允许使用绝对路径/
        );
        await assert.rejects(() => io.createUploadBody(""), /文件上传路径不安全/);
    } finally {
        fs.rmSync(workspace, { recursive: true, force: true });
    }
});

test("createUploadBody：工作区内不存在的文件报错", async () => {
    const workspace = makeWorkspace();
    try {
        const io = createNodeIo(workspace);
        await assert.rejects(() => io.createUploadBody("missing.txt"), /上传文件不存在/);
    } finally {
        fs.rmSync(workspace, { recursive: true, force: true });
    }
});

test("saveResponse：递归建目录写入并返回 savedTo/size/contentType", async () => {
    const workspace = makeWorkspace();
    try {
        const io = createNodeIo(workspace);
        const data = new TextEncoder().encode('{"ok":true}');
        const saved = await io.saveResponse("responses/run-1/detail.json", data, { contentType: "application/json" });
        assert.equal(saved.size, data.byteLength);
        assert.equal(saved.contentType, "application/json");
        assert.equal(path.dirname(saved.savedTo), path.join(workspace, "responses", "run-1"));
        assert.deepEqual(fs.readFileSync(saved.savedTo), Buffer.from(data));
    } finally {
        fs.rmSync(workspace, { recursive: true, force: true });
    }
});

test("saveResponse：路径穿越拒绝，工作区外不可写", async () => {
    const workspace = makeWorkspace();
    try {
        const io = createNodeIo(workspace);
        const data = new TextEncoder().encode("x");
        await assert.rejects(
            () => io.saveResponse("../escape.json", data),
            /响应保存路径不安全[\s\S]*路径越界/
        );
        await assert.rejects(
            () => io.saveResponse("sub/../../escape.json", data),
            /响应保存路径不安全/
        );
        assert.equal(fs.existsSync(path.join(path.dirname(workspace), "escape.json")), false);
    } finally {
        fs.rmSync(workspace, { recursive: true, force: true });
    }
});
