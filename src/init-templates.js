export const DEFAULT_LIBRARY_URL = "http://192.168.1.239/zhangqianfeng/scenario-test/-/raw/v0.1.2/dist/scenario-test.umd.js";

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

本目录保存当前项目的环境配置、场景、项目插件和运行产物。公共运行时由 GitLab Release 提供，不复制到本项目。

浏览器入口为 \`index.html\`。CLI 使用发布的 \`scenario-test-cli.cjs\`：

\`\`\`powershell
node scenario-test-cli.cjs --config dev/场景测试/scenario.config.js --env local --all
\`\`\`

不要在配置或场景中写入真实 Token、Secret、个人信息或生产地址。敏感变量通过环境变量或浏览器环境配置输入。
`,
        ".codex/skills/scenario-test/SKILL.md": `---
name: scenario-test
description: 在当前项目中创建、维护或审查 scenario-test 场景、配置和项目插件时使用。
---

# 场景测试规则

## 文件边界

- 环境、变量声明和场景清单放在 \`dev/场景测试/scenario.config.js\`。
- 长期回归场景放在 \`dev/场景测试/scenarios/\`。
- 项目专属 Node 扩展放在 \`dev/场景测试/plugins/\`。
- 不复制公共运行时、\`dist/\` 或 vendor 文件到业务项目。

## 场景 DSL

- 场景通过 \`ScenarioTest.registerScenario(id, ScenarioTest.defineScenario({...}))\` 注册。
- 步骤支持 \`method\`、\`path\`、\`params\`、\`request.headers\`、\`request.body\`、\`status\`、\`assertions\`、\`extract\`、\`when\`、\`retryUntil\`。
- 使用 \`{{vars.name}}\` 和 \`{{lastResponseBody.data}}\` 引用变量。
- 默认 \`failurePolicy\` 为 \`stop\`；只有需要收集多个失败时设置为 \`continue\`。
- 登录和非标准认证可保留为用户定义的普通步骤，提取 Token 后由后续步骤显式引用。

## 安全

- 不写入 API Key、Secret、Authorization、Cookie、身份证号、手机号或真实测试数据。
- 敏感变量在 \`variables\` 中标记 \`sensitive: true\`，CLI 使用 \`env\` 读取环境变量。
- 删除或清理步骤必须限定场景专用标识、隔离数据和明确条件，并通过 \`when\` 防止误删。
- 不要执行本地、测试或生产业务服务，除非用户明确要求。

## 验证

- 新增场景先检查变量、清理范围和断言是否覆盖预期。
- 公共库问题在公共仓库验证；业务项目只验证其自身配置和场景。
`
    };
}
