import { contract } from "./contract.js";
import { VERSION } from "./version.generated.js";

// 能力名单从 contract 投影：AI Prompt / Patterns / README 禁止手抄操作符名单
const OPERATOR_NAMES = Object.keys(contract.assertions.operators);
const OPERATORS_TEXT = OPERATOR_NAMES.join("、");
const OPERATORS_BACKTICK = OPERATOR_NAMES.map((name) => `\`${name}\``).join("、");
const GLOBALS_TYPES_BACKTICK = contract.globals.types.map((type) => `\`${type}\``).join(" / ");

export const DEFAULT_LIBRARY_URL = `https://github.com/youzhikeji/scenario-test/releases/download/v${VERSION}/scenario-test.umd.js`;

const AUTHORING_PROMPT = `# AI 场景生成 Prompt

请为当前项目生成 scenario-test 场景用例。先阅读本目录的 \`README.md\`、\`SCENARIO_PATTERNS.md\`、\`scenario.config.js\` 和已有 \`scenarios/\`，再分析项目 Controller、OpenAPI/Swagger、前端 API 调用、接口文档和已有自动化测试。

不要猜测接口路径、字段、认证方式、响应结构、状态枚举、请求枚举或错误响应字段；没有代码或文档依据时列为待确认项。示例中的 SUCCESS、PDF、pdf、错误码等都只是占位结构，不是可直接采用的默认值，也不能改成另一种大小写后使用。

## 实施要求

1. 先给出场景清单：业务目标、前置条件、接口流和是否写数据；然后直接创建或修改场景文件，不启动服务、不调用接口。
2. 一条场景对应一条完整业务流，而不是一个接口文件。纯查询接口可以组成独立只读场景。
3. 在 \`scenario.config.js\` 维护 \`envs\`、\`vars\`、\`variables\` 和 \`scenarios\`。私有项目可在 \`vars\` 保存联调凭据；\`variables\` 只声明标签、\`required\` 与可选 \`env\` 映射。源码能确认请求字段但不能确认必填取值时，在配置 \`vars\` 中留空，并在 \`variables\` 中声明为 \`required: true\`；场景只引用该变量，禁止填入猜测值或测试标记。
4. 先参照 \`SCENARIO_PATTERNS.md\` 的完整模式，再按本项目证据替换路径、字段和响应断言；模式中的尖括号占位内容不得直接写入场景。场景必须使用 \`ScenarioTest.registerScenario(id, ScenarioTest.defineScenario({...}))\`，配置中的场景 id、文件注册 id 必须一致。
5. 每一步写 \`name\`、\`method\`、\`path\`、\`status\`，并为关键业务结果写 \`assertions\`。Query 参数只能写在步骤顶层 \`params\`，不能写成 \`request.params\`。用 \`extract\` 保存响应 ID、Token 或状态，再用 \`{{vars.name}}\` 串联后续步骤。断言操作符：${OPERATORS_BACKTICK}；数值比较（如条数不少于 5）用 \`gte: 5\`（仅数字不做字符串转换），"非负整数"这类格式校验用 \`matches: "^\\\\d+$"\`。\`extract\` 项可加 \`required: true\`，路径不存在时该步骤失败。\`when\` 对象形式只允许 \`{ from: "vars", ... }\`，不能基于响应体判断条件。
6. 认证是普通项目步骤：确认登录接口时先登录并提取 Token；无法确认时仅声明变量并在具体 Header、Query 或 Body 中引用，不虚构框架级认证。浏览器 Cookie 会话必须有项目证据并显式设置 request.credentials 为 include；Node CLI 当前不提供自动 Cookie Jar。
7. \`runId\` 和 \`runNo\` 是每次执行自动生成的内置变量，禁止在配置 vars、场景 vars、envVars、generatedVars 或 extract 中重新定义或覆盖。写入场景使用 \`scenario-{{vars.runNo}}\` 等测试标记。清理只能按刚提取的 ID 或测试标记精确定位，并用 \`when\` 防止空值删除；无法确认安全清理条件时不生成删除步骤。
8. 默认保持 \`failurePolicy: "stop"\`。只有在完成状态字段和终态值都有证据时才使用 \`retryUntil\`，且 assertions 必须断言该终态值；只断言字段存在会立即通过，禁止配合 \`retryUntil\`。完成状态未知时最多生成一次状态查询。不要写固定 sleep。
9. 错误响应体没有代码、文档或既有测试依据时，只断言已确认的 HTTP status，不能猜测或断言 code、message、error 等字段存在。
10. 不修改业务代码、构建配置或公共运行时；不写入生产地址、个人数据、固定 Token 或非测试凭据。
11. 落盘后逐文件自检：不得出现无证据的 SUCCESS、PDF、pdf、错误字段断言或 \`retryUntil + exists\`；所有外部输入变量必须在配置中声明，场景 vars 只保存测试标记、提取结果或内部状态。发现违规必须先修正再报告。
12. 最后说明新增/修改文件、覆盖流程、待确认项和本地运行命令；不要实际执行场景。
`;

const SCENARIO_PATTERNS = [
    "# 场景模式库",
    "",
    "本文件提供完整的场景骨架，而不是接口文档。所有 <占位内容> 必须先从当前项目的 Controller、OpenAPI、前端 API 调用、接口文档或既有测试中确认后再替换，不能原样执行。",
    "",
    "## 生成前检查",
    "",
    "1. 确认每个接口的方法、路径、认证位置、请求字段、响应结构、是否写数据和安全清理方式。",
    "2. 在 scenario.config.js 增加稳定的场景 id、名称和文件地址；场景文件注册的 id 必须一致。",
    "3. 每条场景独立运行：自己获取认证变量或读取配置变量，自己提取 ID，不能依赖上次运行留下的数据。",
    "4. 每一步都写 name、method、path、status；关键业务结果写 assertions；跨步骤数据通过 extract 保存。Query 参数写在步骤顶层 params，不写 request.params。",
    "5. runId 和 runNo 由运行时自动生成，不要在 vars、variables、envVars、generatedVars 或 extract 中定义。模式中的状态、格式、错误码和响应字段都是结构占位，必须有项目证据才能采用。",
    "6. 无法确认的必填请求值放入配置 vars 留空，并在 variables 声明 required: true；不得用 PDF、pdf、SUCCESS 或 scenario-{{vars.runNo}} 充当未知枚举。",
    `7. 断言操作符：${OPERATORS_TEXT}；数值比较（条数不少于 N）用 gte: N，格式校验（非负整数）用 matches: '^\\\\d+$'。when 对象形式只允许 from: 'vars'。extract 可加 required: true 强制路径存在。`,
    "",
    "## 模式一：登录、提取 Token、后续请求引用",
    "",
    "适用：登录接口和 Token 响应路径已在项目中确认。认证是普通场景步骤，不是框架配置。",
    "",
    "    ScenarioTest.registerScenario(\"login-and-profile\", ScenarioTest.defineScenario({",
    "        name: \"登录并查询当前用户\", vars: { accessToken: \"\" }, steps: [",
    "            { name: \"登录获取令牌\", method: \"POST\", path: \"<登录路径>\",",
    "              request: { body: { username: \"{{vars.username}}\", password: \"{{vars.password}}\" } }, status: 200,",
    "              assertions: [{ name: \"令牌存在\", path: \"data.accessToken\", exists: true }],",
    "              extract: [{ name: \"accessToken\", path: \"data.accessToken\" }] },",
    "            { name: \"查询当前用户\", method: \"GET\", path: \"<当前用户路径>\",",
    "              request: { headers: { Authorization: \"Bearer {{vars.accessToken}}\" } }, status: 200,",
    "              assertions: [{ name: \"用户 ID 存在\", path: \"data.id\", exists: true }] }",
    "        ]",
    "    }));",
    "",
    "认证位于 Query、Header 或 Body 时，直接在 params、request.headers 或 request.body 引用变量。浏览器 Cookie 会话必须有代码依据并显式设置 request.credentials: \"include\"；Node CLI 当前不提供自动 Cookie Jar。没有可确认登录接口时，只在 vars 和 variables 中声明已有凭据，不能虚构登录流程。",
    "",
    "## 模式二：只读列表、提取 ID、详情校验",
    "",
    "    ScenarioTest.registerScenario(\"record-list-detail\", ScenarioTest.defineScenario({",
    "        name: \"查询记录列表和详情\", vars: { recordId: \"\" }, steps: [",
    "            { name: \"查询第一页记录\", method: \"GET\", path: \"<列表路径>\",",
    "              params: { pageNo: 1, pageSize: 10, keyword: \"{{vars.keyword}}\" }, status: 200,",
    "              assertions: [{ name: \"列表存在\", path: \"data.records\", exists: true }],",
    "              extract: [{ name: \"recordId\", path: \"data.records[0].id\" }] },",
    "            { name: \"查询第一条记录详情\", when: { from: \"vars\", path: \"recordId\", exists: true },",
    "              method: \"GET\", path: \"<详情路径>/{{vars.recordId}}\", status: 200,",
    "              assertions: [{ name: \"详情 ID 匹配\", path: \"data.id\", equals: \"{{vars.recordId}}\" }] }",
    "        ]",
    "    }));",
    "",
    "列表允许为空时保留 when 让详情跳过，或在确认安全前置条件后先创建专属测试数据；不要假定任何环境一定有数据。",
    "",
    "## 模式三：创建、查询、精确清理",
    "",
    "    ScenarioTest.registerScenario(\"record-create-query-cleanup\", ScenarioTest.defineScenario({",
    "        name: \"创建、查询并清理测试记录\",",
    "        vars: { recordId: \"\", recordName: \"scenario-{{vars.runNo}}\" }, steps: [",
    "            { name: \"创建测试记录\", method: \"POST\", path: \"<创建路径>\", request: { body: { name: \"{{vars.recordName}}\" } }, status: 201, extract: [{ name: \"recordId\", path: \"data.id\" }] },",
    "            { name: \"查询刚创建的记录\", method: \"GET\", path: \"<详情路径>/{{vars.recordId}}\", status: 200, assertions: [{ name: \"名称匹配本次标记\", path: \"data.name\", equals: \"{{vars.recordName}}\" }] },",
    "            { name: \"删除本次创建的记录\", when: { from: \"vars\", path: \"recordId\", exists: true }, method: \"DELETE\", path: \"<删除路径>/{{vars.recordId}}\", status: 204 }",
    "        ]",
    "    }));",
    "",
    "数据名必须有 scenario-{{vars.runNo}} 一类测试标记。只有删除接口、权限和条件均已确认时才加入清理；严禁按名称模糊匹配或删除未带场景标记的数据。",
    "",
    "## 模式四：提交异步任务并轮询",
    "",
    "    ScenarioTest.registerScenario(\"task-submit-poll\", ScenarioTest.defineScenario({",
    "        name: \"提交任务并等待完成\", vars: { taskId: \"\" }, steps: [",
    "            { name: \"提交任务\", method: \"POST\", path: \"<提交路径>\", status: 202, extract: [{ name: \"taskId\", path: \"data.taskId\" }] },",
    "            { name: \"轮询直到任务成功\", method: \"GET\", path: \"<任务详情路径>/{{vars.taskId}}\", status: 200, retryUntil: { maxAttempts: 10, intervalMs: 1000 }, assertions: [{ name: \"任务成功\", path: \"<状态字段>\", equals: \"<已确认的完成状态>\" }] }",
    "        ]",
    "    }));",
    "",
    "禁止固定 sleep，使用 retryUntil。重试次数、间隔、状态字段和完成状态必须从项目实现、枚举、文档或既有测试确认；无法确认终态时最多生成一次状态查询，不生成 retryUntil。retryUntil 的断言必须比较已确认终态，不能只检查 exists。",
    "",
    "## 模式五：参数校验与权限拒绝",
    "",
    "    ScenarioTest.registerScenario(\"request-validation\", ScenarioTest.defineScenario({",
    "        name: \"参数校验和未认证访问\", failurePolicy: \"continue\", steps: [",
    "            { name: \"缺少必填字段被拒绝\", method: \"POST\", path: \"<创建路径>\", request: { body: {} }, status: 400, assertions: [{ name: \"返回已确认错误码\", path: \"code\", equals: \"<错误码>\" }] },",
    "            { name: \"未认证访问被拒绝\", method: \"GET\", path: \"<受保护路径>\", status: 401 }",
    "        ]",
    "    }));",
    "",
    "状态码和业务错误码必须来自真实代码或文档。错误响应体没有证据时只断言 HTTP status，不断言 code、message、error 等字段。仅在需要收集多个独立校验失败时使用 failurePolicy: continue。",
    "",
    "## 给 AI 的最小输入",
    "",
    "AI 无法定位接口时，提供 Controller 文件路径、OpenAPI 导出、前端 API 模块路径、已有请求响应样例、认证接口样例或测试变量名中的任一项。不要提供生产凭据或个人数据。"
].join("\n");

export function createProjectFiles(directory = "scenario-test", options = {}) {
    const storagePrefix = options.storagePrefix || "scenario-test.project";
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
        {
            key: "local",
            name: "本地开发",
            baseUrl: "http://localhost:8080",
            // 全局参数：追加到本环境每个请求，支持 header / cookie / query
            globals: [
                { type: "header", name: "X-Project", value: "my-project" }
            ]
        }
    ],
    defaultEnvKey: "local",
    storagePrefix: ${JSON.stringify(storagePrefix)},
    requestTimeoutMs: 30000,
    vars: {},
    variables: [],
    scenarios: []
}));
`,
        [`${directory}/AI_SCENARIO_PROMPT.md`]: AUTHORING_PROMPT,
        [`${directory}/SCENARIO_PATTERNS.md`]: SCENARIO_PATTERNS,
        [`${directory}/README.md`]: `# 场景测试

本目录是当前项目的场景测试入口。它与业务代码同仓维护：环境地址、测试变量、场景文件和项目专属插件放在这里；浏览器工作台与 CLI 固定为已下载的同一版本运行时。

不需要克隆公共库源码、不需要 \`npm install\`，也不要让浏览器直接引用 GitLab Raw 地址。页面始终加载本目录的 \`scenario-test.umd.js\`。

## 先做什么

1. 打开 \`scenario.config.js\`，填写当前项目的环境和启动变量。
2. 将 \`AI_SCENARIO_PROMPT.md\` 完整交给 AI 助手，并让它先阅读 \`SCENARIO_PATTERNS.md\`。初始场景清单为空，避免默认猜测项目存在健康检查或其他接口。
3. 检查 AI 生成的路径、字段、状态枚举和测试数据条件是否都有项目代码或文档依据。
4. 使用浏览器工作台调试单个场景，使用 CLI 批量执行或接入本项目的脚本。

## 目录说明

| 路径 | 作用 | 是否应修改 |
| --- | --- | --- |
| \`index.html\` | 浏览器工作台入口，只加载本地 UMD、配置和挂载容器 | 通常不需要 |
| \`scenario.config.js\` | 环境、初始变量、页面变量定义与场景清单 | 是 |
| \`scenarios/\` | 一个文件一个完整业务场景 | 是 |
| \`plugins/\` | 仅当前项目需要的文件、Excel 或业务扩展 | 按需新建 |
| \`AI_SCENARIO_PROMPT.md\` | 交给 AI 生成或维护场景的操作约束 | 阅读并使用 |
| \`SCENARIO_PATTERNS.md\` | 登录、查询、创建清理、异步和错误分支的完整可套改模式 | 阅读并按项目证据替换 |
| \`scenario-test.umd.js\` | 浏览器运行时 | 仅升级时替换 |
| \`scenario-test-cli.cjs\` | CLI 与本地工作台服务 | 仅升级时替换 |

## 配置环境和变量

\`scenario.config.js\` 只有五个核心概念：

- \`envs\`：环境名称和接口基础地址。每个环境必须有唯一的 \`key\`。
- \`globals\`：全局参数，追加到每个请求。支持 ${GLOBALS_TYPES_BACKTICK} 三种类型，可配置在顶层（所有环境生效）或单个环境内。值支持 \`{{vars.xxx}}\` 模板；步骤显式声明的同名参数优先于全局参数。CLI 可用 \`SCENARIO_GLOBALS\` 环境变量（JSON 数组）覆盖，如 \`[{"type":"header","name":"Authorization","value":"Bearer x"}]\`。
- \`vars\`：本项目启动时使用的默认变量。私有项目可在这里保存团队联调 Key、Secret、Token、测试账号等。
- \`variables\`：页面上需要展示或允许覆盖的变量元数据，包括标签、是否必填，以及可选的 CLI 环境变量名。实际默认值优先写在 \`vars\`，不要重复维护。
- \`scenarios\`：场景 id、名称和对应 JS 文件地址。需要人工前置条件或写数据的场景可加 \`manual: true\`：\`--all\` 默认排除，\`--scenario <id>\` 可显式执行。

最小配置示例：

\`\`\`js
ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    globals: [
        { type: "header", name: "X-Project", value: "project-test" }
    ],
    envs: [
        { key: "local", name: "本地开发", baseUrl: "http://localhost:8080" },
        { key: "test", name: "测试环境", baseUrl: "https://test.example.com" }
    ],
    defaultEnvKey: "local",
    requestTimeoutMs: 30000,
    vars: {
        clientId: "project-test-client",
        clientSecret: "replace-with-private-value"
    },
    variables: [
        { name: "clientId", label: "客户端 ID", required: true },
        { name: "clientSecret", label: "客户端密钥", required: true, env: "SCENARIO_CLIENT_SECRET" }
    ],
    scenarios: [
        { id: "order-create-query", name: "创建并查询订单", url: "scenarios/order-create-query.js" }
    ]
}));
\`\`\`

变量优先级固定如下：

\`CLI 环境变量 / 浏览器页面覆盖 > scenario.config.js 的 vars > 场景 vars > variables[].defaultValue\`

浏览器中保存的变量会按项目 \`storagePrefix\` 和环境保存到 LocalStorage；点击清除当前环境覆盖后，立即回退到 \`vars\`。CLI 只读取系统环境变量和配置文件，不读取浏览器 LocalStorage。 \`init\` 会根据项目目录名生成隔离前缀。

## 编写场景

场景文件必须注册与配置相同的 id。一个场景应是一条完整业务流，不是把每个接口机械地拆成一个文件。读操作可以单独形成查询场景；写操作要使用可识别的测试标记，并只按本场景刚创建或提取到的 ID 清理数据。

\`\`\`js
ScenarioTest.registerScenario("create-order", ScenarioTest.defineScenario({
    name: "创建并查询测试订单",
    vars: { orderName: "scenario-{{vars.runNo}}" },
    steps: [
        {
            name: "创建订单",
            method: "POST",
            path: "api/orders",
            request: {
                headers: { Authorization: "Bearer {{vars.token}}" },
                body: { name: "{{vars.orderName}}" }
            },
            status: 201,
            extract: [{ name: "orderId", path: "data.id" }]
        },
        {
            name: "查询刚创建的订单",
            method: "GET",
            path: "api/orders/{{vars.orderId}}",
            status: 200,
            assertions: [
                { path: "data.name", equals: "{{vars.orderName}}" }
            ]
        }
    ]
}));
\`\`\`

常用能力：

- 用 \`{{vars.name}}\` 在 path、Query、Header、Body 中引用变量。
- 用 \`extract\` 从响应提取 ID、Token 或状态，再供后续步骤使用；路径必填时加 \`required: true\`，缺失会失败，默认缺失只产生 warning。
- 断言操作符：${OPERATORS_BACKTICK}；数值比较用 \`gte: 5\`，非负整数等格式校验用 \`matches: "^\\\\d+$"\`。
- 登录、换 Token、签名都按普通步骤和变量实现；浏览器 Cookie 会话显式使用 \`request.credentials: "include"\`，Node CLI 当前不提供自动 Cookie Jar。
- 每一步至少写 \`name\`、\`method\`、\`path\`、\`status\`；关键结果补充 \`assertions\`。
- 未写 \`status\` 和 \`assertions\` 时运行时默认要求 HTTP 2xx，不能把异常响应当成功。
- 最终一致性使用 \`retryUntil\`，避免固定等待；前置变量可能为空的删除操作使用 \`when\` 保护（\`when\` 对象形式只允许 \`from: "vars"\`）。
- \`runId\` / \`runNo\` 是运行时保留变量，禁止在配置或场景中声明或覆盖。
- 默认失败即停止；只有需要收集多个失败时才在场景上设 \`failurePolicy: "continue"\`。
- SKIP 步骤不计入通过/执行统计，全跳过时场景状态为 SKIPPED；写数据类场景在配置清单中加 \`manual: true\`，\`--all\` 会默认排除，需用 \`--scenario <id>\` 显式执行。

完整 DSL 与示例见公共库 README；项目内新增用例优先遵循 \`AI_SCENARIO_PROMPT.md\` 和 \`SCENARIO_PATTERNS.md\`。

## 浏览器工作台

在本目录启动本地服务，再打开终端输出的地址：

\`\`\`powershell
node ${directory}/scenario-test-cli.cjs serve --config ${directory}/scenario.config.js --port 4300
\`\`\`

浏览器页面可切换环境和场景，填写并保存当前环境的变量覆盖，单步执行、全量执行、取消执行，并查看实际请求、响应和变量。不要双击直接打开 \`index.html\`：浏览器对本地文件加载场景 JS 有限制，应通过 \`serve\` 启动。

## CLI 执行

执行配置中全部场景：

\`\`\`powershell
node ${directory}/scenario-test-cli.cjs --config ${directory}/scenario.config.js --env local --all
\`\`\`

执行单个场景时，使用配置中的场景 id：

\`\`\`powershell
node ${directory}/scenario-test-cli.cjs --config ${directory}/scenario.config.js --env local --scenario order-create-query
\`\`\`

在 PowerShell 中为一次执行临时覆盖凭据：

\`\`\`powershell
$env:SCENARIO_CLIENT_SECRET = "temporary-value"
node ${directory}/scenario-test-cli.cjs --config ${directory}/scenario.config.js --env local --all
Remove-Item Env:SCENARIO_CLIENT_SECRET
\`\`\`

前提是变量定义中声明了 \`env: "SCENARIO_CLIENT_SECRET"\`。CLI 参数以当前版本的 \`--help\` 输出为准。

## 常见问题

### 页面提示 ScenarioTest 未定义或脚本加载失败

确认 \`index.html\` 中使用的是 \`<script src="./scenario-test.umd.js"></script>\`，且本目录存在该文件。不要把 GitLab Raw URL 直接写进 \`script src\`，它可能以浏览器拒绝的 MIME 类型返回。

### 页面能打开但场景没有加载

使用上面的 \`serve\` 命令启动，不要从 \`file:///\` 直接打开页面；再检查 \`scenario.config.js\` 的场景 \`id\`、\`url\` 与场景文件里的 \`registerScenario(id, ...)\` 是否一致。

### CLI 的变量和页面不一致

这是预期行为：页面读取浏览器当前环境的 LocalStorage 覆盖；CLI 不读取它。需要在 CLI 临时替换值时，为 \`variables\` 配置 \`env\` 并设置对应系统环境变量。

### 新接口不知道如何写用例

不要猜。将 \`AI_SCENARIO_PROMPT.md\` 和 \`SCENARIO_PATTERNS.md\` 交给 AI，并让它先检索项目的 Controller、OpenAPI、前端 API 调用、接口文档和既有测试；没有依据的接口和字段应先列为待确认项。

## 升级运行时

场景、配置和项目插件属于本项目，升级时不要覆盖它们。使用新版 CLI 对当前目录执行 \`init\` 且不传 \`--force\`，然后只确认或替换运行时文件：\`scenario-test.umd.js\` 与 \`scenario-test-cli.cjs\`。升级后先运行健康检查和一个代表性业务场景，再提交本项目改动。

公共运行时不保存业务地址、账号、Token、Secret 或测试数据；这些仅能放在当前私有项目的配置和受控环境变量中。
`
    };
}
