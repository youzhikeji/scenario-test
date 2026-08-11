# scenario-test

`scenario-test` 是一个可直接引用的场景测试公共 JavaScript 库。它提供同一套 DSL、浏览器工作台和 Node.js CLI，不依赖业务项目、前端框架或公网 CDN。

## 给业务同事：复制一次即可

不需要克隆本仓库或学习 DSL。在**业务项目根目录**打开 AI 助手，把下面 Prompt 全文复制给 AI（内容与 [AI 接入 Prompt](docs/AI_INSTALL_PROMPT.md) 同源）。AI 会优先通过 npm 安装并完成初始化、体检，然后主动询问要测试的业务功能：

```text
请在当前项目根目录安装 @yc_yzkj/scenario-test。目标目录为 scenario-test。

执行要求：
1. 先确认当前目录是项目根目录，且 Node.js 版本不低于 18；不满足时停止并说明原因。
2. 不克隆公共库源码，不修改业务代码、构建配置或已有场景文件；不启动服务、不调用业务接口、不写入 Token、Secret 或真实测试数据。
3. 通过 npm 安装并初始化：
   a. 在项目根目录执行 npm install -D @yc_yzkj/scenario-test。
   b. 执行 npx @yc_yzkj/scenario-test init --project . --dir "scenario-test" 完成初始化；若提示目标目录已存在，选择保留（默认回车）。
4. 运行项目体检确认安装完整：
   npx @yc_yzkj/scenario-test doctor --config scenario-test/scenario.config.js
   有 FAIL 时停止并报告，不继续后续步骤。
5. doctor 通过后，读取刚生成的 scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md，将其作为后续场景设计规则，不要要求用户复制或粘贴。
6. 最后报告安装和 doctor 结果，然后只询问：“你要测试哪个业务功能？请提供功能名称，以及页面、Controller、接口或已有测试中的任一入口。”此时不要扫描整个项目、生成场景、启动服务或调用业务接口。
7. 用户回答业务功能后，严格按第 5 步找到的 AI_SCENARIO_PROMPT.md 执行：一次只处理这一个功能；需要环境地址、测试账号、Token、枚举值或测试数据时再集中询问；由你维护 scenario.config.js 和场景文件，最后给出逐个场景的运行命令，但不要实际运行。

如果 npm、Node.js 检查、初始化或 doctor 任一失败，停止并报告具体原因，不尝试替代安装方式。
```

如果不使用 AI，也可以手动安装：

```powershell
# 在业务项目根目录
npm install -D @yc_yzkj/scenario-test
npx @yc_yzkj/scenario-test init --project . --dir "scenario-test"   # 若目标目录已存在会询问：k 保留（默认）/ o 覆盖 / c 取消
```

### 安装之后

1. AI 会主动询问要测试哪个业务功能；回答功能名称，并提供页面、Controller、接口或已有测试中的任一入口。环境地址、测试账号或 Token 等信息仅在 AI 询问时提供。
2. AI 生成该功能的场景并给出命令后，双击 `scenario-test/start-scenario-test.cmd`。脚本用项目内运行时副本启动工作台并把接口请求代理到所选环境（`baseUrl` 留空即走代理），无需后端放行 CORS。

整个会话只需复制一次上面的 Prompt。`scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md` 是 init 生成给 AI 使用的内部规则，用户不需要再次复制。若安装会话已经关闭，在业务项目的新会话中直接输入：

```text
请读取 scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md，为“<业务功能名称>”设计场景测试。入口：<页面、Controller、接口或已有测试路径>。
```

每次只处理一个业务功能。业务功能是设计边界，场景是该功能下的一条独立验证路径，例如成功、校验、权限、边界或状态流转；不要让 AI 扫描整个项目批量生成，也不要把多个业务功能串成一个大场景。

> 团队使用其他相对目录时，将 `scenario-test` 替换为约定目录，例如 `dev/场景测试`。安装和场景生成阶段都不会启动服务或调用业务接口。

---

> 普通业务使用到这里即可。以下内容面向公共库维护者，或需要手工接入浏览器、CLI、插件和 CI 的开发人员。

## 运行要求

- 消费端：Node.js 18+ 或现代 Chromium 浏览器。通过 npm 安装 `@yc_yzkj/scenario-test`，使用 `npx @yc_yzkj/scenario-test` 执行命令。
- 构建端：Node.js 18+ 与 npm。

## 维护者构建

```powershell
npm install
npm run build
npm test
npm run test:browser
npm publish --access public   # 发布到 npm（scoped 包需 public 或私有 org）
```

构建产物：

| 文件 | 用途 |
| --- | --- |
| `dist/scenario-test.umd.js` | 浏览器单 JS 引用，包含工作台和样式 |
| `dist/scenario-test.esm.js` | 前端 ESM 引用 |
| `dist/scenario-test.cjs` | Node.js 程序调用 |
| `dist/scenario-test-cli.cjs` | CLI 与本地浏览器服务 |
| `dist/scenario-test.d.ts` | 类型声明（零安装：纯 JS 项目用 JSDoc/IDE 补全） |
| `dist/scenario-test-capabilities.json` | 机器可读 DSL 能力清单（与 `capabilities --json` 同源） |
| `scripts/start-scenario-test.ps1` | Windows HTTP Server 启动脚本，默认服务 `scenario-test/scenario.config.js` |
## 三方能力发现

三方（或 AI）不应靠猜或手工比对多份文档。本项目以 `src/contract.js` 的不可变 DSL Contract 为唯一能力真相，投影到以下入口：

- **`capabilities` 命令**：`npx @yc_yzkj/scenario-test capabilities` 输出人类可读能力清单（版本、contractVersion、断言操作符及简述、when、extract、保留变量、manual、CLI 命令与参数）；`capabilities --json` 输出机器可读 JSON，内容与 `dist/scenario-test-capabilities.json` 完全一致。
- **`doctor` 命令**：`npx @yc_yzkj/scenario-test doctor --config scenario.config.js [--json]` 对项目做静态体检（Node 版本、配置/场景加载、DSL 校验、manual 提示、`.scenario-test/` AI 规则就绪与运行时副本版本握手），汇总所有可继续检查的错误；有 FAIL 退出码 1。
- **`scenario-test.d.ts`**：随 npm 包发布（`package.json` 的 `types` 指向 `dist/scenario-test.d.ts`），init 生成的 `scenario.config.js` 通过 `/// <reference types="@yc_yzkj/scenario-test" />` 引用；纯 JS 项目仍可获得全局 `ScenarioTest` 类型提示，无需额外安装类型包。
- **版本一致性由 npm 保证，项目内副本由 init 落盘并校验**：init 会把 CLI、UMD、d.ts 与能力清单复制到 `scenario-test/.scenario-test/`，写入 `.scenario-test-version.json`（版本 + SHA256）；doctor 校验副本版本与文件指纹。升级时用新版 CLI 重新执行 `init`（刷新副本与 AI 规则），随后运行 `doctor` 验证。

npm（`@yc_yzkj/scenario-test`）是对外正式安装渠道；GitHub Release 与仓库内 GitLab 相关文档仅用于源码维护与历史参考，不作为对外安装指引。

## 浏览器接入

```html
<div id="scenario-test" style="height: 100vh"></div>
<!-- 运行时副本由 init 落盘到 .scenario-test/ -->
<script src="./.scenario-test/scenario-test.umd.js"></script>
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

业务项目由 init 生成 `index.html`，引用项目内运行时副本：

```html
<script src="./.scenario-test/scenario-test.umd.js"></script>
```

人工场景测试双击 `scenario-test/start-scenario-test.cmd`：脚本使用副本 CLI 启动本地 HTTP Server 并自动打开浏览器；`serve` 会把非静态请求代理到配置中当前环境的 `baseUrl`（页面 `baseUrl` 留空即走代理），因此后端无需放行 CORS。不要从 `file://` 直接打开 `index.html`，页面虽可加载但接口请求会被浏览器 CORS 拦截。

## 初始化项目

CLI 可创建业务项目所需的最小目录、浏览器入口、配置、运行时副本和空场景清单：

```powershell
npx @yc_yzkj/scenario-test init --project D:\project --dir "scenario-test"
```

`--dir` 决定场景测试在项目中的目录，默认是 `scenario-test`。现有项目可继续显式使用 `--dir "dev/场景测试"`。新项目创建 `README.md`、`index.html` 和 `scenario.config.js`，`.scenario-test/` 保存 AI 规则、模式库与运行时副本（CLI、UMD、d.ts、能力清单、版本锁）。副本优先从本机 npm 包 `dist/` 拷贝，CLI 不在本机时可用 `--library-url <url>` 指定 UMD 下载地址（默认 GitHub Release）。目标目录已存在时，`init` 会询问：`o` 覆盖已有文件（等价 `--force`）、`k` 保留现有文件（默认：刷新 AI 规则与运行时副本，不覆盖项目配置与场景）、`c` 取消；CI 等非交互环境自动采用默认保留。

## CLI

```powershell
npx @yc_yzkj/scenario-test `
  --config D:\project\dev\场景测试\scenario.config.js `
  --env local --all
```

启动浏览器工作台：

```powershell
npx @yc_yzkj/scenario-test serve `
  --config D:\project\dev\场景测试\scenario.config.js `
  --port 4300
```

CLI 从变量定义的 `env` 字段读取环境变量。私有项目可将联调凭据直接写入 `vars`。`failurePolicy` 默认为 `stop`；只有同一验证路径确实需要继续收集后续步骤结果时才设置 `continue`。

`--all` 默认排除配置中 `manual: true` 的场景（需要人工准备数据的写数据场景），`--scenario <id>` 可显式执行任意场景包括 manual。`--fail-on-skip` 开启后任何 SKIP 步骤都会让最终退出码变为 1（默认 SKIP 不视为失败）。

## 完整示例

[`examples/complete`](examples/complete) 提供可独立运行的 Mock API、浏览器入口、CLI 命令和两组场景，覆盖：

- 用户自定义登录步骤、Token 提取和后续 `Authorization` Header 引用。
- 环境变量覆盖、场景变量、请求体与路径模板。
- `retryUntil`、`when` 跳过、`failurePolicy: "continue"`。

示例与源码同仓，未包含在 npm 包内，需要先克隆本仓库再查看。先运行 `node .\\examples\\complete\\mock-server.cjs`，再按 [完整示例说明](examples/complete/README.md) 启动工作台或 CLI。

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

## 安全

请阅读 [SECURITY.md](SECURITY.md) 了解安全最佳实践和安全漏洞报告流程。

**重要提示**:
- 场景文件是可执行代码，只加载信任的来源
- 不要在配置文件中硬编码凭据
- 使用环境变量传递敏感信息

## 升级指南

历史版本变更与迁移说明见 [CHANGELOG.md](CHANGELOG.md)。升级到最新版本：在项目根目录执行 `npm install -D @yc_yzkj/scenario-test`，重跑 `npx @yc_yzkj/scenario-test init --project . --dir "scenario-test"`（默认保留现有配置与场景，刷新 AI 规则与运行时副本），再运行 `doctor` 验证。

公共库不得包含项目地址、真实机构或个人数据、API Key、Secret，以及任何项目专属接口清理逻辑。

发布约定见 [docs/RELEASING.md](docs/RELEASING.md)。
