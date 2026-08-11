import fs from "node:fs";
import path from "node:path";

export const INTERNAL_DIRECTORY = ".scenario-test";

export const FRAMEWORK_FILES = Object.freeze({
    cli: "scenario-test-cli.cjs",
    umd: "scenario-test.umd.js",
    dts: "scenario-test.d.ts",
    capabilities: "scenario-test-capabilities.json",
    versionLock: ".scenario-test-version.json",
    authoringPrompt: "AI_SCENARIO_PROMPT.md",
    patterns: "SCENARIO_PATTERNS.md"
});

function toRelativePath(...segments) {
    return path.join(...segments).replace(/\\/g, "/");
}

export function createProjectLayout(projectRoot, directory, legacy = false) {
    const publicDir = path.resolve(projectRoot, directory);
    const frameworkDir = legacy ? publicDir : path.join(publicDir, INTERNAL_DIRECTORY);
    const frameworkRelativeDir = legacy ? directory : toRelativePath(directory, INTERNAL_DIRECTORY);
    return Object.freeze({
        legacy,
        publicDir,
        frameworkDir,
        frameworkRelativeDir,
        publicRelativePath: (fileName) => toRelativePath(directory, fileName),
        frameworkRelativePath: (fileName) => toRelativePath(frameworkRelativeDir, fileName),
        frameworkPath: (fileName) => path.join(frameworkDir, fileName)
    });
}

function detectIndexLayout(publicDir) {
    const indexPath = path.join(publicDir, "index.html");
    if (!fs.existsSync(indexPath) || !fs.statSync(indexPath).isFile()) return null;
    try {
        const html = fs.readFileSync(indexPath, "utf8");
        if (/["']\.\/\.scenario-test\/scenario-test\.umd\.js["']/.test(html)) return "modern";
        if (/["']\.\/scenario-test\.umd\.js["']/.test(html)) return "legacy";
        return null;
    } catch {
        return null;
    }
}

function isDirectory(target) {
    return fs.existsSync(target) && fs.statSync(target).isDirectory();
}

export function resolveProjectLayout(projectRoot, directory) {
    const modern = createProjectLayout(projectRoot, directory, false);
    const legacy = createProjectLayout(projectRoot, directory, true);
    if (fs.existsSync(modern.frameworkDir)) {
        if (!isDirectory(modern.frameworkDir)) {
            throw new Error(`${modern.frameworkDir} 必须是目录；请移走同名文件后重试`);
        }
        return modern;
    }
    const indexLayout = detectIndexLayout(legacy.publicDir);
    if (indexLayout === "modern") return modern;
    if (indexLayout === "legacy") return legacy;
    const legacyMarkers = [
        FRAMEWORK_FILES.versionLock,
        FRAMEWORK_FILES.cli,
        FRAMEWORK_FILES.umd,
        FRAMEWORK_FILES.dts,
        FRAMEWORK_FILES.capabilities,
        FRAMEWORK_FILES.authoringPrompt,
        FRAMEWORK_FILES.patterns
    ];
    if (legacyMarkers.some((fileName) => fs.existsSync(legacy.frameworkPath(fileName)))) {
        return legacy;
    }
    return modern;
}

export function resolveLayoutFromConfigDir(configDir) {
    return resolveProjectLayout(path.dirname(configDir), path.basename(configDir));
}