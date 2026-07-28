import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("公共库和产物不包含业务环境与已知密钥", () => {
    const root = path.resolve(import.meta.dirname, "..");
    const files = [];
    for (const folder of ["src", "dist", "examples"]) {
        const walk = (directory) => {
            for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
                const filePath = path.join(directory, entry.name);
                if (entry.isDirectory()) walk(filePath);
                else if (/\.(?:js|cjs|html|md)$/.test(entry.name)) files.push(filePath);
            }
        };
        if (fs.existsSync(path.join(root, folder))) walk(path.join(root, folder));
    }
    const content = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
    assert.doesNotMatch(content, /192\.168\.1\.251|AK_deb71f|SK_W6HL|2070168391735058434/);
});
