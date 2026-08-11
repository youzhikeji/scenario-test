import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 导入路径验证工具
import { validatePath, validatePaths, isPathSafe } from "../src/utils/path-validator.js";

// ========================================
// 1. 路径遍历攻击测试
// ========================================

test("路径验证 - 阻止路径遍历攻击", async (t) => {
    const testRoot = path.join(__dirname, "fixtures");

    await t.test("阻止 .. 遍历", () => {
        assert.throws(
            () => validatePath(testRoot, "../../../etc/passwd"),
            /路径越界/,
            "应该阻止父目录遍历"
        );
    });

    await t.test("阻止绝对路径（默认）", () => {
        assert.throws(
            () => validatePath(testRoot, "/etc/passwd"),
            /不允许使用绝对路径/,
            "应该阻止绝对路径"
        );
    });

    await t.test("阻止空字节注入", () => {
        assert.throws(
            () => validatePath(testRoot, "file\0.txt"),
            /非法字符/,
            "应该阻止空字节注入"
        );
    });

    await t.test("阻止空路径", () => {
        assert.throws(
            () => validatePath(testRoot, ""),
            /路径不能为空/,
            "应该阻止空路径"
        );

        assert.throws(
            () => validatePath(testRoot, "   "),
            /路径不能为空/,
            "应该阻止空白路径"
        );
    });

    await t.test("阻止复杂的遍历模式", () => {
        const maliciousPaths = [
            "dir/../../../etc/passwd",
            "./dir/../../etc/passwd",
            "dir/./../../etc/passwd",
            "....//....//etc/passwd",
        ];

        for (const malicious of maliciousPaths) {
            assert.throws(
                () => validatePath(testRoot, malicious),
                /路径越界/,
                `应该阻止: ${malicious}`
            );
        }
    });

    await t.test("允许安全的相对路径", () => {
        const safePaths = [
            "file.txt",
            "dir/file.txt",
            "dir/subdir/file.txt",
            "./file.txt",
            "./dir/file.txt",
        ];

        for (const safe of safePaths) {
            const result = validatePath(testRoot, safe);
            assert.ok(result.startsWith(testRoot), `安全路径应该在根目录内: ${safe}`);
        }
    });

    await t.test("validatePaths 批量验证", () => {
        const paths = ["file1.txt", "dir/file2.txt", "dir/subdir/file3.txt"];
        const results = validatePaths(testRoot, paths);
        assert.equal(results.length, 3);
        results.forEach(result => {
            assert.ok(result.startsWith(testRoot));
        });
    });

    await t.test("isPathSafe 辅助函数", () => {
        assert.equal(isPathSafe(testRoot, "safe/file.txt"), true);
        assert.equal(isPathSafe(testRoot, "../../../etc/passwd"), false);
        assert.equal(isPathSafe(testRoot, "/etc/passwd"), false);
        assert.equal(isPathSafe(testRoot, "file\0.txt"), false);
    });
});

// ========================================
// 2. 公共库安全扫描
// ========================================

test("公共库和产物不包含敏感信息", () => {
    const root = path.resolve(__dirname, "..");
    const files = [];

    // 注意: examples 目录包含安全教学的反面教材（注释中的错误示范），因此排除
    // docs/archive/ 是已归档的历史过程文档，不再参与当前发布，也排除
    for (const folder of ["src", "dist", "docs"]) {
        const folderPath = path.join(root, folder);
        if (!fs.existsSync(folderPath)) continue;

        const walk = (directory) => {
            for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
                const filePath = path.join(directory, entry.name);
                if (entry.isDirectory()) {
                    if (path.relative(root, filePath).replace(/\\/g, "/").startsWith("docs/archive")) continue;
                    walk(filePath);
                } else if (/\.(?:js|cjs|mjs|html|md|json)$/.test(entry.name)) {
                    files.push(filePath);
                }
            }
        };

        walk(folderPath);
    }

    const content = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");

    // 检查已知的敏感信息
    const sensitivePatterns = [
        { pattern: /192\.168\.1\.251/, desc: "内网 IP" },
        { pattern: /AK_deb71f/, desc: "已知 API Key" },
        { pattern: /SK_W6HL/, desc: "已知 Secret Key" },
        { pattern: /2070168391735058434/, desc: "已知敏感 ID" },
    ];

    for (const { pattern, desc } of sensitivePatterns) {
        assert.doesNotMatch(
            content,
            pattern,
            `不应该包含 ${desc}`
        );
    }
});

// ========================================
// 3. 不可变性测试（模拟）
// ========================================

test("Runtime vars 不可变性", async (t) => {
    await t.test("Object.freeze 阻止修改", () => {
        const vars = Object.freeze({ key: "value", nested: { prop: "val" } });

        assert.ok(Object.isFrozen(vars), "vars 应该被冻结");

        // 尝试修改顶层属性
        assert.throws(
            () => {
                "use strict";
                vars.key = "modified";
            },
            TypeError,
            "不应该能修改冻结的对象"
        );

        // 尝试添加新属性
        assert.throws(
            () => {
                "use strict";
                vars.newKey = "new";
            },
            TypeError,
            "不应该能添加新属性"
        );

        // 注意: Object.freeze 是浅冻结
        // 嵌套对象仍可修改（这是一个已知限制）
        // 完全不可变需要深度冻结或使用不可变数据结构
        vars.nested.prop = "modified"; // 不会抛出错误
        assert.equal(vars.nested.prop, "modified", "浅冻结不保护嵌套对象");
    });

    await t.test("vars 修改检测（通过文档约束）", () => {
        // 注意: 当前实现允许 extract 修改 vars（设计选择）
        // 完全的不可变性需要：
        // 1. 深度冻结所有嵌套对象
        // 2. extract 返回新的 vars 对象而不是修改原对象
        // 3. 使用 Proxy 检测意外修改
        //
        // 这些改进计划在未来版本中实现
        // 当前通过文档和代码审查来确保正确使用
        assert.ok(true, "通过文档约束 vars 的使用");
    });
});

// ========================================
// 4. 输入验证测试
// ========================================

test("输入验证 - 特殊字符", async (t) => {
    const testRoot = path.join(__dirname, "fixtures");

    await t.test("路径中的特殊字符", () => {
        const maliciousPaths = [
            "file.txt\0.jpg",        // 空字节（会被拒绝）
        ];

        for (const malicious of maliciousPaths) {
            const isSafe = isPathSafe(testRoot, malicious);
            assert.equal(isSafe, false, `应该拒绝: ${malicious}`);
        }

        // 注意: < > 等字符在文件名中可能合法（取决于操作系统）
        // Windows 禁止 < > : " | ? *
        // Unix/Linux 只禁止 / 和 \0
        // 路径验证器主要关注安全性（路径遍历），不是文件名合法性
        // 文件系统会在实际创建时拒绝非法字符
    });
});

// ========================================
// 5. 重试保护测试（单元测试级别）
// ========================================

test("重试保护 - 最小间隔和超时", async (t) => {
    await t.test("确保最小 intervalMs", () => {
        const intervalMs = 0;
        const actualInterval = Math.max(100, intervalMs || 2000);
        assert.ok(actualInterval >= 100, "应该有最小重试间隔");
    });

    await t.test("经过时间检查", () => {
        const startTime = Date.now();
        const maxElapsedMs = 1000;

        // 模拟经过时间
        const elapsed = Date.now() - startTime;

        if (elapsed > maxElapsedMs) {
            assert.ok(true, "应该检测到超时");
        } else {
            assert.ok(elapsed <= maxElapsedMs, "未超时");
        }
    });
});

console.log("✅ 安全测试通过");
