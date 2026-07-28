export const DEFAULT_LIBRARY_URL = "http://192.168.1.239/zhangqianfeng/scenario-test/-/raw/v0.2.9/dist/scenario-test.umd.js";

const AUTHORING_PROMPT = `# AI 场景生成 Prompt

请为当前项目生成 scenario-test 场景用例。先阅读本目录的 \`README.md\`、\`scenario.config.js\` 和已有 \`scenarios/\`，再分析项目 Controller、OpenAPI/Swagger、前端 API 调用、接口文档和已有自动化测试。

不要猜测接口路径、字段、认证方式或响应结构；没有代码或文档依据时列为待确认项，不生成该步骤。

## 实施要求

1. 先给出场景清单：业务目标、前置条件、接口流和是否写数据；然后直接创建或修改场景文件，不启动服务、不调用接口。
2. 一条场景对应一条完整业务流，而不是一个接口文件。纯查询接口可以组成独立只读场景。
3. 在 \`scenario.config.js\` 维护 \`envs\`、\`vars\`、\`variables\` 和 \`scenarios\`。私有项目可在 \`vars\` 保存联调凭据；\`variables\` 只声明标签、\`required\` 与可选 \`env\` 映射。
4. 场景必须使用 \`ScenarioTest.registerScenario(id, ScenarioTest.defineScenario({...}))\`。配置中的场景 id、文件注册 id 必须一致。
5. 每一步写 \`name\`、\`method\`、\`path\`、\`status\`，并为关键业务结果写 \`assertions\`。用 \`extract\` 保存响应 ID、Token 或状态，再用 \`{{vars.name}}\` 串联后续步骤。
6. 认证是普通项目步骤：确认登录接口时先登录并提取 Token；无法确认时仅声明变量并在具体 Header、Query 或 Body 中引用，不虚构框架级认证。
7. 写入场景使用 \`scenario-{{vars.runNo}}\` 等测试标记。清理只能按刚提取的 ID 或测试标记精确定位，并用 \`when\` 防止空值删除；无法确认安全清理条件时不生成删除步骤。
8. 默认保持 \`failurePolicy: "stop"\`。最终一致性用 \`retryUntil\`，不要写固定 sleep。
9. 不修改业务代码、构建配置或公共运行时；不写入生产地址、个人数据、固定 Token 或非测试凭据。
10. 最后说明新增/修改文件、覆盖流程、待确认项和本地运行命令；不要实际执行场景。
`;

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
        [`${directory}/AI_SCENARIO_PROMPT.md`]: AUTHORING_PROMPT,
        [`${directory}/README.md`]: `# 场景测试

本目录保存当前项目的环境配置、场景、项目插件和固定版本运行时。\`scenario-test.umd.js\` 用于浏览器，\`scenario-test-cli.cjs\` 用于 CLI。

浏览器入口为 \`index.html\`。CLI 使用发布的 \`scenario-test-cli.cjs\`：

\`\`\`powershell
node ${directory}/scenario-test-cli.cjs --config ${directory}/scenario.config.js --env local --all
\`\`\`

私有项目可在 \`vars\` 设置启动初始凭据，浏览器设置可按环境覆盖；公共仓库、示例和运行时不得写入真实业务凭据。

使用 \`AI_SCENARIO_PROMPT.md\` 让项目 AI 助手从业务代码和接口文档生成场景用例。
`
    };
}
