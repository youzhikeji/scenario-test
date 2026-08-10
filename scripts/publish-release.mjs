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
    "adapters/xlsx.cjs"
];
const assets = files.map((filePath) => ({
    name: filePath.split("/").at(-1),
    // dist is committed with the tag, so this URL is immutable and does not depend on CI artifacts.
    url: `${projectUrl}/-/raw/${encodeURIComponent(tag)}/dist/${filePath}`,
    filepath: `/${filePath}`,
    link_type: "other"
}));

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
        description: "浏览器、Node.js、CLI、Excel 适配器、类型声明与能力清单构建产物。",
        assets: { links: assets }
    })
});

if (!response.ok) {
    throw new Error(`GitLab Release 创建失败 (${response.status}): ${await response.text()}`);
}

console.log(`已创建 GitLab Release: ${tag}`);
