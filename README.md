# scenario-test

`scenario-test` 是一个可直接引用的场景测试公共 JavaScript 库。它提供同一套 DSL、浏览器工作台和 Node.js CLI，不依赖业务项目、前端框架或公网 CDN。

## AI 安装 Prompt

将下列 Prompt 粘贴给当前项目的 AI 助手，即可安装到默认的 `scenario-test` 目录。将 `scenario-test` 替换为团队约定的项目内相对目录，例如 `dev/场景测试`；不要使用绝对路径。

```text
请在当前项目根目录安装 scenario-test v0.4.0，目标目录为 scenario-test。

1. 确认 Node.js 版本不低于 18；不满足时停止并说明原因。
2. 不克隆公共库源码，不执行 npm install，不修改业务代码、构建配置或已有场景文件。
3. 仅从以下固定版本地址下载 CLI 到系统临时目录：
   https://github.com/youzhikeji/scenario-test/releases/download/v0.4.0/scenario-test-cli.cjs
4. 使用 node <临时 CLI 路径> init --project . --dir "scenario-test" 执行初始化；不要传 --force。
5. 检查并报告 scenario-test/index.html、scenario-test/scenario.config.js、scenario-test/AI_SCENARIO_PROMPT.md、scenario-test/SCENARIO_PATTERNS.md、scenario-test/scenario-test.umd.js 和 scenario-test/scenario-test-cli.cjs 是已创建还是已保留。初始场景清单应为空，由 AI 根据当前项目真实接口生成。
6. 不启动服务、不调用任何业务接口、不写入 Token、Secret 或真实测试数据。
7. 最后只给出安装结果，以及后续运行命令：
   node scenario-test/scenario-test-cli.cjs --config scenario-test/scenario.config.js --env local --all

如果下载、Node.js 检查或初始化失败，停止后报告具体失败原因，不尝试替代安装方式。
```

完整独立版本见 [AI 安装 Prompt](docs/AI_INSTALL_PROMPT.md)。

安装完成后，使用 [AI 场景生成 Prompt](docs/AI_SCENARIO_PROMPT.md) 让 AI 从项目接口与既有代码生成场景；初始化目录会同时提供登录认证、查询详情、创建清理、异步轮询和错误分支的可套改模式库。安装 Prompt 只负责初始化，不会自动猜测业务用例。

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
    vars: {
        apiKey: ""
    },
    variables: [
        { name: "apiKey", label: "API Key", env: "SCENARIO_API_KEY", required: true }
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

工作台只操作传入的挂载容器。配置、环境、Token 和场景变量按环境保存在浏览器本地；页面、调试请求和报告均显示原始值，适合项目内快速联调。

`vars` 是启动初始值。私有项目可在此保存团队测试凭据，浏览器页面中的变量可按项目 `storagePrefix` 和环境覆盖它，覆盖值保存在浏览器 LocalStorage。不同项目必须使用不同的 `storagePrefix`，`init` 会自动生成。CLI/CI 中同名 `variables[].env` 环境变量优先于 `vars`；其后依次是 `vars`、场景 `vars` 和 `variables[].defaultValue`。公共库、示例和构建产物不得写入真实业务凭据。

业务项目应将 Release 的 UMD 下载并固定在项目目录中，再由页面引用本地文件：

```html
<script src="./scenario-test.umd.js"></script>
```

GitLab Raw 用于下载而不是浏览器直接加载，因为其响应 MIME 类型可能被浏览器拒绝。不要引用 `master`，应固定使用已发布的 Tag。

## 初始化项目

CLI 可创建业务项目所需的最小目录、浏览器入口、配置、示例场景，并把当前版本 CLI 写入项目：

```powershell
node scenario-test-cli.cjs init --project D:\project --dir "scenario-test"
```

`--dir` 决定场景测试在项目中的目录，默认是 `scenario-test`。现有项目可继续显式使用 `--dir "dev/场景测试"`。`init` 会将 CLI 和浏览器 UMD 写入指定目录；需要私有镜像或其他版本时指定 `--library-url <url>`。已有文件默认保留，只有传入 `--force` 才覆盖。

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

CLI 从变量定义的 `env` 字段读取环境变量。私有项目可将联调凭据直接写入 `vars`。`failurePolicy` 默认为 `stop`；需要收集全部失败时在场景上设置 `failurePolicy: "continue"`。

`--all` 默认排除配置中 `manual: true` 的场景（需要人工准备数据的写数据场景），`--scenario <id>` 可显式执行任意场景包括 manual。`--fail-on-skip` 开启后任何 SKIP 步骤都会让最终退出码变为 1（默认 SKIP 不视为失败）。

## 完整示例

[`examples/complete`](examples/complete) 提供可独立运行的 Mock API、浏览器入口、CLI 命令和两组场景，覆盖：

- 用户自定义登录步骤、Token 提取和后续 `Authorization` Header 引用。
- 环境变量覆盖、场景变量、请求体与路径模板。
- `retryUntil`、`when` 跳过、`failurePolicy: "continue"`。

先运行 `node .\\examples\\complete\\mock-server.cjs`，再按 [完整示例说明](examples/complete/README.md) 启动工作台或 CLI。

## DSL

公共步骤支持：

- `method`、`path`、`params`、`request.headers`、`request.body`。
- 未配置 `status` 和 `assertions` 时默认要求 HTTP 2xx，避免异常响应被误判为成功。
- 浏览器 Cookie 会话可设置 `request.credentials: "include"`；Node CLI 当前不提供自动 Cookie Jar。
- 断言操作符：`exists`、`equals`、`notEquals`、`includes`、`matches`、`oneOf`、`gt`、`gte`、`lt`、`lte`。断言对象只允许元数据键 `name / path / from / target / header / implicit` 与操作符键，每条断言至少一个操作符，未知键在定义期与执行期都会报错。
- `gt/gte/lt/lte` 只接受 actual 与 expected 均为有限 number，不做字符串隐式转换；类型不符时断言失败而非抛异常，并保留 actual/expected 用于报告。整段模板 `{{vars.x}}` 解析出数字时可参与比较。
- `extract` 与 `{{vars.name}}`、`{{lastResponseBody.data}}` 模板插值；`extract` 项加 `required: true` 时路径不存在会使当前步骤失败，默认缺失只产生 warning（不含响应内容），变量为 undefined 保持兼容。
- `runId / runNo` 是每次执行自动生成的内置变量，禁止在 `vars`、`envVars`、`generatedVars`、`extract` 中声明或覆盖，冲突会尽早报错。
- `timeoutMs`、`retryUntil`、执行取消。
- `when` 条件：对象形式只允许 `{ from: "vars", ... }`（不支持 body/status/header 条件），非对象形式（模板字符串/布尔）保持真值语义；条件不满足时步骤标记为 `SKIPPED`，不计入通过/执行统计，全场景跳过时场景状态为 `SKIPPED`。
- Node 下的 `request.fileUpload`、`saveResponseAs`。
- `generatedVars`：`timestamp`、`uuidHex`、`md5`、`signature`。
- `prepareXlsx` 由官方 Excel 适配器执行。

## 安全

请阅读 [SECURITY.md](SECURITY.md) 了解安全最佳实践和安全漏洞报告流程。

**重要提示**:
- 场景文件是可执行代码，只加载信任的来源
- 不要在配置文件中硬编码凭据
- 使用环境变量传递敏感信息

## 升级指南

### 升级到 v0.4.0

v0.4.0 强化断言可信性、SKIP 可观测性与 manual 场景隔离。请参考 [CHANGELOG.md](CHANGELOG.md) 中的迁移指南。

**主要变更**:
- 断言 schema 严格化：未知键立即报错，每条断言至少一个操作符
- 新增数值比较操作符 `gt / gte / lt / lte` 与 `notEquals`
- `when` 对象形式只允许 `from: "vars"`
- `runId / runNo` 保留变量禁止声明或覆盖
- `extract` 支持 `required: true`，缺失路径产生 warning
- SKIP 不计入通过/执行统计；`--fail-on-skip` 让 SKIP 影响退出码
- `--all` 默认排除 `manual: true` 场景

### 升级到 v0.3.0

v0.3.0 包含重要的安全修复和一些 breaking changes。请参考 [CHANGELOG.md](CHANGELOG.md) 中的详细迁移指南。

**主要变更**:
- 推荐使用 `SCENARIO_AUTH` 环境变量代替 `--authorization` 参数
- 文件路径必须在工作区内，不允许绝对路径和路径遍历
- 外部插件需要 `--allow-external-plugins` 标志

## 迁移说明

`v0.2.0` 起不再支持 `window.GlobalConfig` 和 `window.ScenarioData`。配置必须使用 `ScenarioTest.registerConfig(ScenarioTest.defineConfig(...))`，场景必须使用 `ScenarioTest.registerScenario(id, ScenarioTest.defineScenario(...))`。

公共库不得包含项目地址、真实机构或个人数据、API Key、Secret，以及任何项目专属接口清理逻辑。

发布约定见 [docs/RELEASING.md](docs/RELEASING.md)。
