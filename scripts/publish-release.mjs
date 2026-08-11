const required = ["CI_API_V4_URL", "CI_PROJECT_ID", "CI_COMMIT_TAG", "CI_PROJECT_URL", "GITLAB_RELEASE_TOKEN"];
for (const name of required) {
    if (!process.env[name]) throw new Error(`发布缺少 CI 变量 ${name}`);
}

const {
    CI_API_V4_URL: apiUrl,
    CI_PROJECT_ID: projectId,
    CI_COMMIT_TAG: tag,
    CI_PROJECT_URL: projectUrl,
    GITLAB_RELEASE_TOKEN: token
} = process.env;

const files = [
    "scenario-test.umd.js",
    "scenario-test.esm.js",
    "scenario-test.cjs",
    "scenario-test-cli.cjs",
    "scenario-test.d.ts",
    "scenario-test-capabilities.json",
    "start-scenario-test.ps1"
];
const assets = files.map((filePath) => {
    const sourcePath = filePath === "start-scenario-test.ps1"
        ? `scripts/${filePath}`
        : `dist/${filePath}`;
    return {
        name: filePath.split("/").at(-1),
        // 发行文件随 Tag 提交，链接不依赖 CI artifacts。
        url: `${projectUrl}/-/raw/${encodeURIComponent(tag)}/${sourcePath}`,
        filepath: `/${filePath}`,
        link_type: "other"
    };
});

const releaseUrl = `${apiUrl}/projects/${encodeURIComponent(projectId)}/releases/${encodeURIComponent(tag)}`;
const existing = await fetch(releaseUrl, { headers: { "PRIVATE-TOKEN": token } });
if (existing.ok) {
    console.log(`GitLab Release 已存在: ${tag}`);
    process.exit(0);
}
if (existing.status !== 404) {
    throw new Error(`GitLab Release 查询失败 (${existing.status}): ${await existing.text()}`);
}

const response = await fetch(`${apiUrl}/projects/${encodeURIComponent(projectId)}/releases`, {
    method: "POST",
    headers: {
        "PRIVATE-TOKEN": token,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: `Scenario Test ${tag}`,
        tag_name: tag,
        description: "浏览器、Node.js、CLI、类型声明、能力清单与 Windows HTTP Server 启动脚本。",
        assets: { links: assets }
    })
});

if (!response.ok) {
    throw new Error(`GitLab Release 创建失败 (${response.status}): ${await response.text()}`);
}

console.log(`已创建 GitLab Release: ${tag}`);
