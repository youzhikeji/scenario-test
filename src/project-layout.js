import fs from "node:fs";
import path from "node:path";

export const INTERNAL_DIRECTORY = ".scenario-test";

// 运行时（CLI/UMD/d.ts/capabilities）只存在于 node_modules 的 npm 包；
// 项目 .scenario-test/ 仅保留项目专属的 AI 规则与模式库（随项目提交，AI 工作流依赖）。
export const FRAMEWORK_FILES = Object.freeze({
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

function isDirectory(target) {
    return fs.existsSync(target) && fs.statSync(target).isDirectory();
}

// 统一使用 .scenario-test/ 内部目录放置 AI 规则与模式库，不保留旧版平铺布局兼容。
// 运行时不在项目内，因此不再需要 index.html 引用探测 / 平铺标记检测。
export function resolveProjectLayout(projectRoot, directory) {
    const modern = createProjectLayout(projectRoot, directory, false);
    if (fs.existsSync(modern.frameworkDir)) {
        if (!isDirectory(modern.frameworkDir)) {
            throw new Error(`${modern.frameworkDir} 必须是目录；请移走同名文件后重试`);
        }
        return modern;
    }
    return modern;
}

export function resolveLayoutFromConfigDir(configDir) {
    return resolveProjectLayout(path.dirname(configDir), path.basename(configDir));
}
