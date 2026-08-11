import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
    ASSERTION_META_KEYS,
    ASSERTION_OPERATORS,
    CONTRACT_VERSION,
    GLOBAL_TYPES,
    RESERVED_VARS,
    contract
} from "../src/index.js";
import { VERSION } from "../src/version.generated.js";
import legacyCore from "../src/browser/legacy/core.js";

test("contract 元信息：contractVersion 从 1 开始，runtimeVersion 复用 VERSION", () => {
    assert.equal(CONTRACT_VERSION, 1);
    assert.equal(contract.contractVersion, CONTRACT_VERSION);
    assert.equal(contract.runtimeVersion, VERSION);
});

test("contract 与 core 导出名单一致（同一份名单）", () => {
    assert.deepEqual(ASSERTION_OPERATORS, Object.keys(contract.assertions.operators));
    assert.deepEqual(ASSERTION_META_KEYS, [...contract.assertions.metaKeys]);
    assert.deepEqual(RESERVED_VARS, [...contract.reservedVars]);
    assert.deepEqual(GLOBAL_TYPES, [...contract.globals.types]);
});

test("browser legacy 名单与 contract 一致（禁止静默漂移）", () => {
    assert.deepEqual([...legacyCore.ASSERTION_OPERATORS].sort(), Object.keys(contract.assertions.operators).sort());
    assert.deepEqual([...legacyCore.ASSERTION_META_KEYS].sort(), [...contract.assertions.metaKeys].sort());
    assert.deepEqual([...legacyCore.RESERVED_VARS].sort(), [...contract.reservedVars].sort());
});

test("每个操作符含说明；数值比较操作符标注有限 number 约束", () => {
    for (const [name, meta] of Object.entries(contract.assertions.operators)) {
        assert.equal(typeof meta.description, "string");
        assert.ok(meta.description.length > 0, `操作符 ${name} 缺少说明`);
        assert.equal(typeof meta.valueType, "string");
    }
    assert.equal(contract.assertions.numericOperators.length, 4);
    for (const op of contract.assertions.numericOperators) {
        assert.equal(contract.assertions.operators[op].valueType, "finiteNumber");
    }
});

test("when 来源仅 vars；extract 来源与 required 语义；保留变量；generatedVars 类型", () => {
    assert.deepEqual(contract.when.sources, ["vars"]);
    assert.deepEqual(contract.extract.from, ["body", "headers", "bodyText", "response"]);
    assert.equal(contract.extract.required, "boolean");
    assert.deepEqual(contract.reservedVars, ["runId", "runNo"]);
    assert.deepEqual(contract.generatedVars.types, ["timestamp", "uuidHex", "md5", "signature"]);
});

test("config/scenario 关键字段含 manual；CLI 命令与参数含 capabilities/doctor/fail-on-skip", () => {
    assert.ok(contract.config.scenarioItemKeys.includes("id"));
    assert.ok(contract.config.scenarioItemKeys.includes("url"));
    assert.ok(contract.config.scenarioItemKeys.includes("manual"));
    assert.equal(contract.config.manual.type, "boolean");
    assert.ok(contract.scenario.keys.includes("steps"));
    assert.ok(contract.scenario.stepKeys.includes("assertions"));
    assert.ok(contract.scenario.stepKeys.includes("when"));
    assert.ok(contract.scenario.stepKeys.includes("retryUntil"));
    assert.deepEqual(contract.scenario.failurePolicies, ["stop", "continue"]);
    for (const command of ["run", "serve", "init", "capabilities", "doctor"]) {
        assert.ok(contract.cli.commands.includes(command), `CLI 命令缺少 ${command}`);
    }
    assert.equal(contract.cli.options["fail-on-skip"].kind, "flag");
    assert.equal(contract.cli.options.json.kind, "flag");
    assert.deepEqual(contract.cli.options.token.aliases, ["authorization"]);
    assert.equal(contract.cli.options.config.kind, "value");
});

test("contract.engines 与 package.json engines 一致", () => {
    const packageInfo = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "../package.json"), "utf8"));
    assert.equal(contract.engines.node, packageInfo.engines.node);
});

test("init 模板（AI Prompt/Patterns/README）能力名单从 contract 投影，无手抄名单", async () => {
    const { createProjectFiles } = await import("../src/init-templates.js");
    const files = createProjectFiles("scenario-test");
    const prompt = files["scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md"];
    const patterns = files["scenario-test/.scenario-test/SCENARIO_PATTERNS.md"];
    const readme = files["scenario-test/README.md"];
    const operators = Object.keys(contract.assertions.operators);
    for (const op of operators) {
        assert.ok(prompt.includes(op), `AI Prompt 缺少操作符 ${op}`);
        assert.ok(patterns.includes(op), `SCENARIO_PATTERNS 缺少操作符 ${op}`);
        assert.ok(readme.includes(op), `README 模板缺少操作符 ${op}`);
    }
    // globals 类型投影
    for (const type of contract.globals.types) {
        assert.ok(readme.includes(`\`${type}\``), `README 模板缺少 globals 类型 ${type}`);
    }
    // when 来源投影
    assert.ok(prompt.includes('from: "vars"'));
    assert.ok(patterns.includes("from: 'vars'"));
});

test("对外接入文档使用当前版本且只要求复制一次 Prompt", () => {
    const installPrompt = fs.readFileSync(path.resolve(import.meta.dirname, "../docs/AI_INSTALL_PROMPT.md"), "utf8");
    const scenarioPrompt = fs.readFileSync(path.resolve(import.meta.dirname, "../docs/AI_SCENARIO_PROMPT.md"), "utf8");
    const examplesIndex = fs.readFileSync(path.resolve(import.meta.dirname, "../examples/EXAMPLES_INDEX.md"), "utf8");
    assert.match(installPrompt, /npm install -D @youzhikeji\/scenario-test/);
    assert.match(installPrompt, /npx @youzhikeji\/scenario-test init/);
    assert.doesNotMatch(installPrompt, /releases\/download|临时 CLI/);
    assert.match(installPrompt, /AI 接入 Prompt（只需复制一次）/);
    assert.match(installPrompt, /不要要求用户复制或粘贴/);
    assert.match(installPrompt, /npx @youzhikeji\/scenario-test doctor --config/);
    assert.match(installPrompt, /scenario-test\/\.scenario-test\/AI_SCENARIO_PROMPT\.md/);
    assert.match(installPrompt, /你要测试哪个业务功能/);
    assert.match(scenarioPrompt, /仓库预览/);
    assert.match(scenarioPrompt, /业务用户不要直接复制本文件/);
    // README 内联与 docs 同源的接入 Prompt：只允许 npm 安装，禁止残留 Release 下载兜底。
    const readme = fs.readFileSync(path.resolve(import.meta.dirname, "../README.md"), "utf8");
    assert.match(readme, /复制一次即可/);
    assert.match(readme, /AI_INSTALL_PROMPT\.md/);
    assert.match(readme, /用户不需要再次复制/);
    assert.match(readme, /npm install -D @youzhikeji\/scenario-test/);
    assert.doesNotMatch(readme, /releases\/download/);

    const quickStart = examplesIndex.match(/^##\s+[^\n]*快速开始[^\n]*\n[\s\S]*?(?=^##\s|$(?![\s\S]))/mi)?.[0] ?? "";
    assert.ok(quickStart, "示例索引缺少业务接入快速开始章节");
    // npm 已是主安装路径，允许 npm install；仍禁止克隆源码或从源码构建
    assert.doesNotMatch(quickStart, /\bgit\s+clone\b|\bnpm\s+run\s+build\b/);
    assert.match(quickStart, /AI_INSTALL_PROMPT\.md|AI 接入 Prompt/);
    assert.match(quickStart, /AI_SCENARIO_PROMPT\.md/);
    assert.match(quickStart, /用户不需要再次复制/);
    assert.doesNotMatch(examplesIndex, /两次 Prompt/);

    // 一键安装脚本必须使用 npm 包与 npx，不得保留 Release CLI 下载路径。
    const installSh = fs.readFileSync(path.resolve(import.meta.dirname, "../scripts/install.sh"), "utf8");
    const installPs1 = fs.readFileSync(path.resolve(import.meta.dirname, "../scripts/install.ps1"), "utf8");
    for (const script of [installSh, installPs1]) {
        assert.match(script, /npm install/);
        assert.match(script, /@youzhikeji\/scenario-test/);
        assert.match(script, /npx @youzhikeji\/scenario-test init/);
        assert.match(script, /npx @youzhikeji\/scenario-test doctor/);
        assert.doesNotMatch(script, /releases\/download|scenario-test-cli\.cjs/);
    }
});