import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

test("init 创建项目入口，且默认不覆盖现有文件", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-"));
    try {
        const first = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(first.status, 0, first.stderr);
        const indexPath = path.join(project, "scenario-test", "index.html");
        const configPath = path.join(project, "scenario-test", "scenario.config.js");
        assert.match(fs.readFileSync(indexPath, "utf8"), /\.\/scenario-test\.umd\.js/);
        assert.match(fs.readFileSync(configPath, "utf8"), /ScenarioTest\.registerConfig/);
        assert.match(fs.readFileSync(path.join(project, "scenario-test", "scenario-test.umd.js"), "utf8"), /ScenarioTest/);
        assert.equal(fs.existsSync(path.join(project, ".codex", "skills", "scenario-test", "SKILL.md")), false);

        fs.writeFileSync(configPath, "// 用户配置\n", "utf8");
        const second = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(second.status, 0, second.stderr);
        assert.equal(fs.readFileSync(configPath, "utf8"), "// 用户配置\n");
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});

test("init 支持自定义项目内场景目录", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-dir-"));
    try {
        const result = spawnSync(process.execPath, [
            path.join(root, "src/cli.js"), "init", "--project", project, "--dir", "scenario-test"
        ], { encoding: "utf8" });
        assert.equal(result.status, 0, result.stderr);
        assert.equal(fs.existsSync(path.join(project, "scenario-test", "index.html")), true);
        assert.equal(fs.existsSync(path.join(project, "dev", "场景测试", "index.html")), false);
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});
