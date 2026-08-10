// doctor —— 项目静态体检（三方能力发现闭环的一部分）
//
// 原则：
//   - 复用现有 loader/defineConfig/defineScenario/path validation，不另写一套 DSL 校验器
//   - 汇总所有可继续检查的错误，不第一个错误就退出（config 无法加载等不能安全继续时除外）
//   - 有 FAIL 时退出码 1；只有 WARN/INFO 时退出码 0
//   - 版本握手只校验当前本地固定版本，不联网检查最新版本
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { contract, CONTRACT_VERSION } from "./contract.js";
import { VERSION } from "./version.generated.js";
import { validatePath } from "./utils/path-validator.js";
import { loadConfigFile, loadScenarioFile } from "./node/loader.js";

const UMD_VERSION_PATTERN = /\/\*! scenario-test v(\d+\.\d+\.\d+) \*\//;
const DTS_VERSION_PATTERN = /scenario-test v(\d+\.\d+\.\d+)/;

function satisfiesNodeEngine(version, range) {
    const match = /^>=\s*(\d+)(?:\.(\d+)(?:\.(\d+))?)?/.exec(String(range || "").trim());
    if (!match) return false;
    const [major, minor = 0, patch = 0] = match.slice(1).map(Number);
    const [curMajor, curMinor = 0, curPatch = 0] = String(version).replace(/^v/, "").split(".").map(Number);
    if (curMajor !== major) return curMajor > major;
    if (curMinor !== minor) return curMinor > minor;
    return curPatch >= patch;
}

function readVersionLock(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("版本锁必须是 JSON 对象");
    return parsed;
}

function sha256Of(filePath) {
    return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function extractUmdVersion(filePath) {
    const head = fs.readFileSync(filePath, "utf8").slice(0, 4096);
    const match = UMD_VERSION_PATTERN.exec(head);
    return match ? match[1] : null;
}

function extractDtsVersion(filePath) {
    const head = fs.readFileSync(filePath, "utf8").slice(0, 4096);
    const match = DTS_VERSION_PATTERN.exec(head);
    return match ? match[1] : null;
}

function checkArtifact(filePath, label, extractVersion) {
    if (!fs.existsSync(filePath)) {
        return {
            name: label,
            status: "WARN",
            message: `缺少框架管理文件 ${label}（${path.basename(filePath)}）`,
            fix: `运行 init 补齐：node scenario-test-cli.cjs init --project <项目根目录> --dir <场景测试目录>`
        };
    }
    const artifactVersion = extractVersion(filePath);
    if (artifactVersion === null) {
        return {
            name: label,
            status: "FAIL",
            message: `文件 ${path.basename(filePath)} 中找不到版本标记，无法确认与当前 CLI 版本一致`,
            fix: `重新生成该文件（init 或重新构建），确保其版本标记为 v${VERSION}`
        };
    }
    if (artifactVersion !== VERSION) {
        return {
            name: label,
            status: "FAIL",
            message: `版本不一致：${path.basename(filePath)} 是 v${artifactVersion}，当前 CLI 是 v${VERSION}`,
            fix: `使用 v${VERSION} 的 CLI 重新 init，或从 v${VERSION} Release 重新下载 ${path.basename(filePath)}`
        };
    }
    return { name: label, status: "PASS", message: `版本一致（v${artifactVersion}）`, fix: "" };
}

function checkCapabilitiesFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return {
            name: "capabilities",
            status: "WARN",
            message: "缺少框架管理文件 scenario-test-capabilities.json",
            fix: "运行 init 补齐（不传 --force 不会覆盖项目文件）"
        };
    }
    try {
        const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
        if (parsed.schema !== "scenario-test-capabilities") {
            return {
                name: "capabilities",
                status: "FAIL",
                message: "scenario-test-capabilities.json 不是合法的能力清单（schema 不匹配）",
                fix: "用当前版本 CLI 重新 init 生成"
            };
        }
        if (parsed.version !== VERSION || parsed.contractVersion !== CONTRACT_VERSION) {
            return {
                name: "capabilities",
                status: "FAIL",
                message: `版本不一致：capabilities.json 是 v${parsed.version}（contract v${parsed.contractVersion}），当前 CLI 是 v${VERSION}（contract v${CONTRACT_VERSION}）`,
                fix: `用 v${VERSION} 的 CLI 重新 init 生成 scenario-test-capabilities.json`
            };
        }
        return { name: "capabilities", status: "PASS", message: `版本一致（v${parsed.version}，contract v${parsed.contractVersion}）`, fix: "" };
    } catch (error) {
        return {
            name: "capabilities",
            status: "FAIL",
            message: `scenario-test-capabilities.json 解析失败: ${error.message}`,
            fix: "用当前版本 CLI 重新 init 生成"
        };
    }
}

function checkVersionLock(filePath) {
    if (!fs.existsSync(filePath)) {
        return {
            name: "version-lock",
            status: "WARN",
            message: "缺少框架管理文件 .scenario-test-version.json（项目版本锁）",
            fix: `运行 init 写入版本锁（不会覆盖项目文件）：node scenario-test-cli.cjs init --project <项目根目录> --dir <场景测试目录>`
        };
    }
    let lock;
    try {
        lock = readVersionLock(filePath);
    } catch (error) {
        return {
            name: "version-lock",
            status: "FAIL",
            message: `.scenario-test-version.json 解析失败: ${error.message}`,
            fix: "修复或删除版本锁后用当前版本 CLI 重新 init 生成"
        };
    }
    if (lock.runtimeVersion !== VERSION || lock.contractVersion !== CONTRACT_VERSION) {
        return {
            name: "version-lock",
            status: "FAIL",
            message: `版本不一致：版本锁记录 v${lock.runtimeVersion}（contract v${lock.contractVersion}），当前 CLI 是 v${VERSION}（contract v${CONTRACT_VERSION}）`,
            fix: `使用 v${VERSION} 的 CLI 重新 init（init 会自动更新框架管理文件 .scenario-test-version.json，不覆盖项目配置/场景）`
        };
    }
    const fileWarnings = [];
    const files = lock.files && typeof lock.files === "object" ? lock.files : null;
    if (!files) {
        fileWarnings.push({
            name: "version-lock",
            status: "WARN",
            message: "版本锁缺少 files 字段（预期文件名清单）",
            fix: "用当前版本 CLI 重新 init 刷新版本锁"
        });
    } else {
        for (const [kind, fileName] of Object.entries(files)) {
            if (typeof fileName !== "string" || !fileName) {
                fileWarnings.push({
                    name: "version-lock",
                    status: "WARN",
                    message: `版本锁 files.${kind} 无效`,
                    fix: "用当前版本 CLI 重新 init 刷新版本锁"
                });
                continue;
            }
            const target = path.join(path.dirname(filePath), fileName);
            if (!fs.existsSync(target)) {
                fileWarnings.push({
                    name: "version-lock",
                    status: "WARN",
                    message: `版本锁声明 ${kind} 文件 ${fileName} 不存在`,
                    fix: `运行 init 补齐 ${fileName}（不传 --force 不会覆盖项目文件）`
                });
            }
        }
    }
    const shaWarnings = [];
    const sha256 = lock.sha256 && typeof lock.sha256 === "object" ? lock.sha256 : null;
    if (sha256) {
        for (const [fileName, expected] of Object.entries(sha256)) {
            if (typeof expected !== "string" || !expected) continue;
            const target = path.join(path.dirname(filePath), fileName);
            if (!fs.existsSync(target)) continue;
            const actual = sha256Of(target);
            if (actual !== expected) {
                shaWarnings.push({
                    name: "version-lock",
                    status: "WARN",
                    message: `${fileName} 的 SHA256 与版本锁记录不一致（可能被合法替换）`,
                    fix: "若是有意替换运行时文件，用当前版本 CLI 重新 init 刷新版本锁；否则检查文件来源"
                });
            }
        }
    }
    return {
        name: "version-lock",
        status: "PASS",
        message: `版本一致（v${lock.runtimeVersion}，contract v${lock.contractVersion}）`,
        fix: "",
        extra: [...fileWarnings, ...shaWarnings]
    };
}

export function buildDoctorReport(options) {
    const { configPath, api, configDir } = options;
    const checks = [];
    const info = [];

    // 1. Node 版本满足 package engines
    const engineRange = contract.engines?.node || ">=18";
    checks.push(satisfiesNodeEngine(process.version, engineRange)
        ? { name: "node-version", status: "PASS", message: `Node ${process.version} 满足 engines.node ${engineRange}`, fix: "" }
        : {
            name: "node-version",
            status: "FAIL",
            message: `Node ${process.version} 不满足 engines.node ${engineRange}`,
            fix: "升级 Node.js 到满足 engines 的版本后重试"
        });

    // 2. config 可加载（复用 loader/defineConfig）
    //    配置文件不存在时输出 name: "config" 的 FAIL（--json 结构化输出兼容），
    //    存在但加载失败时输出 name: "config-load"
    let config = null;
    if (!fs.existsSync(configPath)) {
        checks.push({
            name: "config",
            status: "FAIL",
            message: `配置文件不存在: ${configPath}`,
            fix: "创建 scenario.config.js（可用 init 生成模板），或通过 --config 指定正确的配置文件"
        });
    } else {
        try {
            config = loadConfigFile(configPath, api);
            checks.push({ name: "config-load", status: "PASS", message: `配置可加载: ${configPath}`, fix: "" });
        } catch (error) {
            checks.push({
                name: "config-load",
                status: "FAIL",
                message: `配置文件加载失败: ${configPath}（原因: ${error.message}）`,
                fix: "检查配置语法与 defineConfig 调用；修复后重新运行 doctor"
            });
        }
    }

    // 3/4/5. 场景清单与文件（config 加载成功才可安全继续）
    if (config) {
        const entries = config.scenarios || [];
        if (entries.length === 0) {
            checks.push({ name: "scenario-list", status: "PASS", message: "配置中暂无可检查的场景（scenarios 为空）", fix: "" });
        } else {
            let listOk = true;
            for (const entry of entries) {
                if (!entry.id || !entry.url) {
                    listOk = false;
                    checks.push({
                        name: "scenario-list",
                        status: "FAIL",
                        message: `场景清单项缺少 id 或 url（${JSON.stringify(entry)}）`,
                        fix: "在 scenario.config.js 中为每个场景项提供 id、name、url"
                    });
                    continue;
                }
                if (entry.manual === true) {
                    info.push({
                        name: "manual-scenario",
                        scenarioId: entry.id,
                        message: `场景 ${entry.id} 标记为 manual:true（需要人工准备数据或写数据），--all 默认排除，请用 --scenario ${entry.id} 显式执行`
                    });
                }
                let scenarioPath;
                try {
                    // 与 run 命令保持一致：绝对路径直接接受（不禁止），仅提示建议使用相对路径；
                    // 相对路径仍做配置目录内越界校验（防路径遍历）
                    scenarioPath = path.isAbsolute(entry.url) ? entry.url : validatePath(configDir, entry.url);
                } catch (error) {
                    listOk = false;
                    checks.push({
                        name: "scenario-list",
                        status: "FAIL",
                        message: `场景 ${entry.id} 的 url 不安全: ${entry.url}（原因: ${error.message}）`,
                        fix: "url 必须是配置目录内的相对路径"
                    });
                    continue;
                }
                if (path.isAbsolute(entry.url)) {
                    checks.push({
                        name: "absolute-scenario-path",
                        status: "WARN",
                        message: `场景 ${entry.id} 使用绝对路径: ${entry.url}（run 可正常执行，但建议使用配置目录内相对路径，便于项目迁移）`,
                        fix: "将 scenario.config.js 中该场景的 url 改为相对路径"
                    });
                }
                if (!fs.existsSync(scenarioPath)) {
                    listOk = false;
                    checks.push({
                        name: "scenario-list",
                        status: "FAIL",
                        message: `场景文件不存在: ${scenarioPath}（场景 ${entry.id}）`,
                        fix: `创建该文件，或在 scenario.config.js 中修正 url`
                    });
                    continue;
                }
                try {
                    const scenario = loadScenarioFile(scenarioPath, entry.id, api);
                    if (scenario.name) {
                        checks.push({
                            name: "scenario-register",
                            status: "PASS",
                            message: `场景 ${entry.id} 加载并注册成功（${scenarioPath}）`,
                            fix: ""
                        });
                    }
                } catch (error) {
                    listOk = false;
                    checks.push({
                        name: "scenario-register",
                        status: "FAIL",
                        message: `场景 ${entry.id} 加载/注册失败: ${scenarioPath}（原因: ${error.message}）`,
                        fix: "检查场景文件：registerScenario(id, ...) 的 id 必须与 scenario.config.js 清单 id 一致；断言/when/保留变量须通过 defineScenario 校验"
                    });
                }
            }
            if (listOk) {
                checks.push({ name: "scenario-list", status: "PASS", message: `场景清单合法（${entries.length} 项，文件均存在）`, fix: "" });
            }
        }
    }

    // 6. 版本一致性（不依赖 config，可继续检查）
    const dir = configDir;
    const umdPath = path.join(dir, "scenario-test.umd.js");
    const dtsPath = path.join(dir, "scenario-test.d.ts");
    const capabilitiesPath = path.join(dir, "scenario-test-capabilities.json");
    const lockPath = path.join(dir, ".scenario-test-version.json");

    checks.push({
        name: "cli",
        status: "PASS",
        message: `CLI 版本 v${VERSION}（contract v${CONTRACT_VERSION}）`,
        fix: ""
    });
    checks.push(checkArtifact(umdPath, "umd", extractUmdVersion));
    checks.push(checkArtifact(dtsPath, "dts", extractDtsVersion));
    checks.push(checkCapabilitiesFile(capabilitiesPath));

    const lockResult = checkVersionLock(lockPath);
    checks.push({ name: lockResult.name, status: lockResult.status, message: lockResult.message, fix: lockResult.fix });
    if (lockResult.extra) checks.push(...lockResult.extra);

    const summary = { passed: 0, warned: 0, failed: 0, info: info.length };
    for (const check of checks) {
        if (check.status === "PASS") summary.passed += 1;
        else if (check.status === "WARN") summary.warned += 1;
        else summary.failed += 1;
    }
    const exitCode = summary.failed > 0 ? 1 : 0;
    return {
        tool: "scenario-test doctor",
        runtimeVersion: VERSION,
        contractVersion: CONTRACT_VERSION,
        status: exitCode === 0 ? "OK" : "FAILED",
        checks,
        info,
        summary,
        exitCode
    };
}

const STATUS_MARK = { PASS: "[PASS]", WARN: "[WARN]", FAIL: "[FAIL]", INFO: "[INFO]" };

export function renderDoctorText(report) {
    const lines = [];
    lines.push(`场景测试 Doctor`);
    lines.push(`版本: v${report.runtimeVersion}（contract v${report.contractVersion}）`);
    lines.push("");
    for (const check of report.checks) {
        lines.push(`${STATUS_MARK[check.status] || check.status} ${check.name}: ${check.message}`);
        if (check.fix) lines.push(`       如何修: ${check.fix}`);
    }
    for (const item of report.info) {
        lines.push(`[INFO] ${item.name}: ${item.message}`);
    }
    lines.push("");
    lines.push(`摘要: ${report.summary.passed} PASS, ${report.summary.warned} WARN, ${report.summary.failed} FAIL, ${report.summary.info} INFO`);
    lines.push(report.exitCode === 0 ? "结果: OK（退出码 0）" : "结果: FAILED（退出码 1）");
    return lines.join("\n");
}