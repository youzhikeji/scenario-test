export const DEFAULT_LIBRARY_URL = "http://192.168.1.239/zhangqianfeng/scenario-test/-/raw/v0.1.4/dist/scenario-test.umd.js";

export function createProjectFiles(libraryUrl) {
    return {
        "dev/场景测试/index.html": `<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>场景测试</title>
</head>
<body style="margin:0">
    <div id="scenario-test" style="height:100vh"></div>
    <script src="${libraryUrl}"></script>
    <script src="./scenario.config.js"></script>
    <script>
        ScenarioTest.createApp({ mount: "#scenario-test", config: ScenarioTest.getConfig() });
    </script>
</body>
</html>
`,
        "dev/场景测试/scenario.config.js": `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    envs: [
        { key: "local", name: "本地开发", baseUrl: "http://localhost:8080" }
    ],
    defaultEnvKey: "local",
    requestTimeoutMs: 30000,
    variables: [],
    scenarios: [
        { id: "health", name: "健康检查", url: "scenarios/health.js" }
    ]
}));
`,
        "dev/场景测试/scenarios/health.js": `ScenarioTest.registerScenario("health", ScenarioTest.defineScenario({
    name: "健康检查",
    steps: [
        {
            name: "服务可用",
            method: "GET",
            path: "actuator/health",
            status: 200
        }
    ]
}));
`,
        "dev/场景测试/README.md": `# 场景测试

本目录保存当前项目的环境配置、场景、项目插件和固定版本的 CLI 运行时。浏览器运行时由 GitLab Release 提供。

浏览器入口为 \`index.html\`。CLI 使用发布的 \`scenario-test-cli.cjs\`：

\`\`\`powershell
node dev/场景测试/scenario-test-cli.cjs --config dev/场景测试/scenario.config.js --env local --all
\`\`\`

不要在配置或场景中写入真实 Token、Secret、个人信息或生产地址。敏感变量通过环境变量或浏览器环境配置输入。
`
    };
}
