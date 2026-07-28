export const DEFAULT_LIBRARY_URL = "http://192.168.1.239/zhangqianfeng/scenario-test/-/raw/v0.2.8/dist/scenario-test.umd.js";

export function createProjectFiles(directory = "scenario-test") {
    return {
        [`${directory}/index.html`]: `<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>场景测试</title>
</head>
<body style="margin:0">
    <div id="scenario-test" style="height:100vh"></div>
    <script src="./scenario-test.umd.js"></script>
    <script src="./scenario.config.js"></script>
    <script>
        ScenarioTest.createApp({ mount: "#scenario-test", config: ScenarioTest.getConfig() });
    </script>
</body>
</html>
`,
        [`${directory}/scenario.config.js`]: `ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    envs: [
        { key: "local", name: "本地开发", baseUrl: "http://localhost:8080" }
    ],
    defaultEnvKey: "local",
    requestTimeoutMs: 30000,
    vars: {},
    variables: [],
    scenarios: [
        { id: "health", name: "健康检查", url: "scenarios/health.js" }
    ]
}));
`,
        [`${directory}/scenarios/health.js`]: `ScenarioTest.registerScenario("health", ScenarioTest.defineScenario({
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
        [`${directory}/README.md`]: `# 场景测试

本目录保存当前项目的环境配置、场景、项目插件和固定版本运行时。\`scenario-test.umd.js\` 用于浏览器，\`scenario-test-cli.cjs\` 用于 CLI。

浏览器入口为 \`index.html\`。CLI 使用发布的 \`scenario-test-cli.cjs\`：

\`\`\`powershell
node ${directory}/scenario-test-cli.cjs --config ${directory}/scenario.config.js --env local --all
\`\`\`

私有项目可在 \`vars\` 设置启动初始凭据，浏览器设置可按环境覆盖；公共仓库、示例和运行时不得写入真实业务凭据。
`
    };
}
