import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

test("init 创建项目入口和 Codex 场景测试 Skill，且默认不覆盖现有文件", () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-init-"));
    try {
        const first = spawnSync(process.execPath, [
            path.join(root, "src/cli.js"),
            "init",
            "--project", project,
            "--library-url", "https://releases.example.test/scenario-test.umd.js"
        ], { encoding: "utf8" });
        assert.equal(first.status, 0, first.stderr);
        const indexPath = path.join(project, "dev", "场景测试", "index.html");
        const configPath = path.join(project, "dev", "场景测试", "scenario.config.js");
        const skillPath = path.join(project, ".codex", "skills", "scenario-test", "SKILL.md");
        assert.match(fs.readFileSync(indexPath, "utf8"), /releases\.example\.test/);
        assert.match(fs.readFileSync(configPath, "utf8"), /ScenarioTest\.registerConfig/);
        assert.match(fs.readFileSync(skillPath, "utf8"), /场景测试规则/);

        fs.writeFileSync(configPath, "// 用户配置\n", "utf8");
        const second = spawnSync(process.execPath, [path.join(root, "src/cli.js"), "init", "--project", project], { encoding: "utf8" });
        assert.equal(second.status, 0, second.stderr);
        assert.equal(fs.readFileSync(configPath, "utf8"), "// 用户配置\n");
    } finally {
        fs.rmSync(project, { recursive: true, force: true });
    }
});
