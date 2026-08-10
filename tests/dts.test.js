import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { contract } from "../src/index.js";

const root = path.resolve(import.meta.dirname, "..");
const dtsPath = path.join(root, "dist", "scenario-test.d.ts");

function parseUnion(dts, typeName) {
    const match = new RegExp(`export type ${typeName} = (.+);`).exec(dts);
    assert.ok(match, `d.ts 缺少 ${typeName} 联合类型`);
    return match[1].split("|").map((item) => item.trim().replace(/^"|"$/g, "")).sort();
}

test("d.ts 由 contract 投影：操作符/保留变量/类型名单与 contract 完全一致", () => {
    assert.equal(fs.existsSync(dtsPath), true, "请先执行 npm run build 生成 dist/scenario-test.d.ts");
    const dts = fs.readFileSync(dtsPath, "utf8");
    // 版本标记（doctor 版本握手依赖）
    assert.match(dts, new RegExp(`scenario-test v${contract.runtimeVersion}`));
    assert.match(dts, new RegExp(`contract v${contract.contractVersion}`));

    assert.deepEqual(parseUnion(dts, "AssertionOperator"), Object.keys(contract.assertions.operators).sort());
    assert.deepEqual(parseUnion(dts, "NumericAssertionOperator"), [...contract.assertions.numericOperators].sort());
    assert.deepEqual(parseUnion(dts, "AssertionMetaKey"), [...contract.assertions.metaKeys].sort());
    assert.deepEqual(parseUnion(dts, "ReservedVar"), [...contract.reservedVars].sort());
    assert.deepEqual(parseUnion(dts, "GeneratedVarType"), [...contract.generatedVars.types].sort());
    assert.deepEqual(parseUnion(dts, "GlobalParamType"), [...contract.globals.types].sort());
    assert.deepEqual(parseUnion(dts, "WhenSource"), [...contract.when.sources].sort());
    assert.deepEqual(parseUnion(dts, "ExtractSource"), [...contract.extract.from].sort());
    assert.deepEqual(parseUnion(dts, "FailurePolicy"), [...contract.scenario.failurePolicies].sort());
});

test("d.ts 覆盖公共 API 与 UMD 全局声明", () => {
    const dts = fs.readFileSync(dtsPath, "utf8");
    for (const symbol of [
        "export interface ScenarioConfig",
        "export interface Environment",
        "export interface ScenarioListItem",
        "export interface ScenarioDefinition",
        "export interface Step",
        "export interface RetryUntil",
        "export interface Assertion",
        "export interface ExtractDefinition",
        "export interface WhenDefinition",
        "export function createApp",
        "export function createEngine",
        "export function defineConfig",
        "export function defineScenario",
        "export function registerConfig",
        "export function registerScenario",
        "export as namespace ScenarioTest"
    ]) {
        assert.ok(dts.includes(symbol), `d.ts 缺少 ${symbol}`);
    }
    // WhenDefinition.from 只能 vars（与 contract 一致）
    assert.match(dts, /from: WhenSource/);
});

function runTsc(args) {
    // Windows 上 tsc 是 .cmd 包装，需要 shell 执行
    return process.platform === "win32"
        ? spawnSync("tsc", args, { encoding: "utf8", shell: true })
        : spawnSync("tsc", args, { encoding: "utf8" });
}

test("tsc --noEmit 验证最小 JS 用例（全局 tsc 可用时）", (t) => {
    const check = runTsc(["--version"]);
    if (check.status !== 0) {
        t.skip("未找到全局 tsc，跳过类型验证（d.ts 文本一致性测试仍然有效）");
        return;
    }
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-test-dts-"));
    try {
        const typesDir = path.join(dir, "types");
        fs.mkdirSync(typesDir);
        fs.copyFileSync(dtsPath, path.join(typesDir, "scenario-test.d.ts"));
        // 合法用例：应无错误
        fs.writeFileSync(path.join(dir, "ok.js"), `// @ts-check
/** @type {import('./types/scenario-test').ScenarioDefinition} */
const scenario = { name: "示例", steps: [{ name: "请求", method: "GET", path: "api/x", status: 200, assertions: [{ path: "data.total", gte: 5 }], extract: [{ name: "id", path: "data.id", required: true }], when: { from: "vars", path: "id", exists: true } }], failurePolicy: "stop" };
/** @type {import('./types/scenario-test').ScenarioListItem} */
const entry = { id: "health", url: "scenarios/health.js", manual: true };
/** @type {import('./types/scenario-test').Assertion} */
const assertion = { path: "code", oneOf: [200, 201] };
`, "utf8");
        // 非法用例：未知断言键应报错
        fs.writeFileSync(path.join(dir, "bad.js"), `// @ts-check
/** @type {import('./types/scenario-test').Assertion} */
const bad = { path: "code", unknownOperator: 1 };
`, "utf8");
        fs.writeFileSync(path.join(dir, "tsconfig.json"), JSON.stringify({
            compilerOptions: {
                noEmit: true,
                strict: true,
                checkJs: true,
                allowJs: true,
                target: "es2020",
                module: "esnext",
                moduleResolution: "bundler",
                lib: ["es2020", "dom"],
                types: []
            },
            include: ["ok.js", "bad.js"]
        }));
        const result = runTsc(["-p", dir]);
        const output = `${result.stdout}\n${result.stderr}`;
        // TS 退出码非 0 即代表类型错误（不同 TS 版本可能用 1 或 2）
        assert.notEqual(result.status, 0, `tsc 应因 bad.js 报错: ${output}`);
        assert.match(output, /unknownOperator/);
        assert.doesNotMatch(output, /ok\.js/);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});