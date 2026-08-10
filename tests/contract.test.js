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
    const prompt = files["scenario-test/AI_SCENARIO_PROMPT.md"];
    const patterns = files["scenario-test/SCENARIO_PATTERNS.md"];
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

test("docs 安装 Prompt 已更新到当前版本 URL，不残留旧版本", () => {
    const installPrompt = fs.readFileSync(path.resolve(import.meta.dirname, "../docs/AI_INSTALL_PROMPT.md"), "utf8");
    assert.match(installPrompt, new RegExp(`releases/download/v${contract.runtimeVersion}/scenario-test-cli\\.cjs`));
    assert.doesNotMatch(installPrompt, /v0\.2\.13|v0\.3\.0|v0\.4\.0/);
    // README 顶部 AI 安装 Prompt 同步
    const readme = fs.readFileSync(path.resolve(import.meta.dirname, "../README.md"), "utf8");
    assert.match(readme, new RegExp(`安装 scenario-test v${contract.runtimeVersion}`));
    assert.doesNotMatch(readme, /releases\/download\/v0\.[234]\.0\//);
});