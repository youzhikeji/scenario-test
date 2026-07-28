# scenario-test

`scenario-test` 是一个可直接引用的场景测试公共 JavaScript 库。它提供同一套 DSL、浏览器工作台和 Node.js CLI，不依赖业务项目、前端框架或公网 CDN。

## 运行要求

- 消费端：Node.js 18+ 或现代 Chromium 浏览器。
- 构建端：Node.js 18+ 与 npm。
- 消费者只需要 `dist/`，无需安装 npm 依赖。

## 构建

```powershell
npm install
npm run build
npm test
npm run test:browser
```

构建产物：

| 文件 | 用途 |
| --- | --- |
| `dist/scenario-test.umd.js` | 浏览器单 JS 引用，包含工作台和样式 |
| `dist/scenario-test.esm.js` | 前端 ESM 引用 |
| `dist/scenario-test.cjs` | Node.js 程序调用 |
| `dist/scenario-test-cli.cjs` | CLI 与本地浏览器服务 |
| `dist/adapters/xlsx.cjs` | 可选 Excel 适配器 |

## 浏览器接入

```html
<div id="scenario-test" style="height: 100vh"></div>
<script src="/libs/scenario-test.umd.js"></script>
<script src="./scenario.config.js"></script>
<script>
    ScenarioTest.createApp({
        mount: "#scenario-test",
        config: ScenarioTest.getConfig()
    });
</script>
```

配置文件：

```js
ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    envs: [
        { key: "local", name: "本地", baseUrl: "http://localhost:8080" }
    ],
    defaultEnvKey: "local",
    variables: [
        { name: "apiKey", label: "API Key", env: "SCENARIO_API_KEY", sensitive: true, required: true }
    ],
    scenarios: [
        { id: "health", name: "健康检查", url: "scenarios/health.js" }
    ]
}));
```

场景文件：

```js
ScenarioTest.registerScenario("health", ScenarioTest.defineScenario({
    name: "健康检查",
    steps: [
        {
            name: "服务可用",
            method: "GET",
            path: "actuator/health",
            status: 200,
            assertions: [{ path: "status", equals: "UP" }]
        }
    ]
}));
```

工作台只操作传入的挂载容器。配置、环境、Token 和敏感变量按环境保存在浏览器本地；报告会自动脱敏。

业务项目可固定引用 GitLab Release 的单文件产物，无需拉取源码：

```html
<script src="http://192.168.1.239/zhangqianfeng/scenario-test/-/raw/v0.1.3/dist/scenario-test.umd.js"></script>
```

不要引用 `master`，应固定使用已发布的 Tag。

## 初始化项目

CLI 可创建业务项目所需的最小目录、浏览器入口、配置、示例场景、项目级 Codex Skill，并把当前版本 CLI 写入项目：

```powershell
node scenario-test-cli.cjs init --project D:\project
```

首次使用先下载 Release 的 `scenario-test-cli.cjs` 并用它运行 `init`；`init` 会将它复制为 `dev/场景测试/scenario-test-cli.cjs`。默认写入当前 Release 的 UMD 地址；需要私有镜像或其他版本时指定 `--library-url <url>`。已有文件默认保留，只有传入 `--force` 才覆盖。生成的 `.codex/skills/scenario-test/SKILL.md` 让 Codex 在该项目内处理场景测试时自动获得 DSL、安全和目录规则。

## CLI

```powershell
node D:\path\to\scenario-test\dist\scenario-test-cli.cjs `
  --config D:\project\dev\场景测试\scenario.config.js `
  --env local --all
```

启动浏览器工作台：

```powershell
node D:\path\to\scenario-test\dist\scenario-test-cli.cjs serve `
  --config D:\project\dev\场景测试\scenario.config.js `
  --port 4300
```

CLI 从变量定义的 `env` 字段读取环境变量，敏感值不应写入配置文件。`failurePolicy` 默认为 `stop`；需要收集全部失败时在场景上设置 `failurePolicy: "continue"`。

## 完整示例

[`examples/complete`](examples/complete) 提供可独立运行的 Mock API、浏览器入口、CLI 命令和两组场景，覆盖：

- 用户自定义登录步骤、Token 提取和后续 `Authorization` Header 引用。
- 环境变量覆盖、敏感变量、请求体与路径模板。
- `retryUntil`、`when` 跳过、`failurePolicy: "continue"`。

先运行 `node .\\examples\\complete\\mock-server.cjs`，再按 [完整示例说明](examples/complete/README.md) 启动工作台或 CLI。

## DSL

公共步骤支持：

- `method`、`path`、`params`、`request.headers`、`request.body`。
- `status` 和 `assertions`：`exists`、`equals`、`includes`、`matches`、`oneOf`。
- `extract` 与 `{{vars.name}}`、`{{lastResponseBody.data}}` 模板插值。
- `timeoutMs`、`retryUntil`、执行取消。
- `when` 条件断言；条件不满足时步骤标记为 `SKIPPED`。
- Node 下的 `request.fileUpload`、`saveResponseAs`。
- `generatedVars`：`timestamp`、`uuidHex`、`md5`、`signature`。
- `prepareXlsx` 由官方 Excel 适配器执行。

## 兼容说明

`0.x` 版本仍可加载 `window.GlobalConfig` 和 `window.ScenarioData`，运行时会输出废弃提示。新场景应使用 `registerConfig` 和 `registerScenario`；下一主版本将移除旧全局格式适配器。

公共库不得包含项目地址、真实机构或个人数据、API Key、Secret，以及任何项目专属接口清理逻辑。

发布约定见 [docs/RELEASING.md](docs/RELEASING.md)。
