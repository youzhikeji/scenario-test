# scenario-test

`scenario-test` 是面向业务项目的 HTTP 场景测试工具，提供统一 DSL、浏览器工作台和 Node.js CLI。默认采用免 npm 接入，不修改业务项目依赖，也不要求克隆本仓库。

## 快速接入

要求：Node.js 18+。

在**业务项目根目录**打开 AI 助手，复制下面这段内容：

```text
请在当前项目根目录接入 @yc_yzkj/scenario-test，目标目录为 scenario-test。

默认使用免 npm 方式：Windows 执行官方 install.ps1，macOS/Linux 执行官方 install.sh。不要克隆公共库源码，不执行 npm install，不修改业务代码、构建配置或已有场景文件，不启动服务、不调用业务接口。

安装后运行 doctor；有 FAIL 时停止并报告。doctor 通过后，读取 scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md，并只询问：“你要测试哪个业务功能？请提供功能名称，以及页面、Controller、接口或已有测试中的任一入口。”得到答复前不要扫描整个项目或生成场景。

只有我明确要求使用 npm 时，才改用 npm install -D @yc_yzkj/scenario-test 和 npx @yc_yzkj/scenario-test init；两种方式不混用、不自动切换。
```

完整规则见 [AI 接入 Prompt](docs/AI_INSTALL_PROMPT.md)。安装成功后，AI 会直接读取项目内规则，用户不需要再次复制。

### 不使用 AI

默认免 npm，不修改 `package.json` 或 `package-lock.json`：

```powershell
# Windows PowerShell
irm https://cdn.jsdelivr.net/gh/youzhikeji/scenario-test@v0.5.7/scripts/install.ps1 | iex
```

```bash
# macOS / Linux
curl -fsSL https://cdn.jsdelivr.net/gh/youzhikeji/scenario-test@v0.5.7/scripts/install.sh | bash -s -- . scenario-test
```

默认情况下，安装脚本只从 npm Registry 下载一次固定版本 tarball，在临时目录解压后从本地 `dist/` 初始化；不会执行 `npm install`、访问 GitHub API 或修改业务项目依赖。脚本会把 CLI、浏览器运行时、类型声明、能力清单和版本锁写入 `scenario-test/.scenario-test/`，并自动执行 doctor。内网下载源的指定方式：PowerShell 使用 `-Source <目录>`；macOS/Linux 使用第三个位置参数或 `SCENARIO_TEST_SOURCE`。内网目录需要包含完整的 `dist` 运行时文件。

### 安装完成后

1. 告诉 AI 要测试的一个业务功能，并提供页面、Controller、接口或已有测试入口。
2. AI 维护 `scenario.config.js` 和 `scenarios/`，但不会实际调用业务接口。
3. 双击 `scenario-test/start-scenario-test.cmd` 启动工作台。
4. 工作台通过本地 `serve` 代理访问所选环境，无需后端额外放行 CORS。

新 AI 会话可以直接输入：

```text
请读取 scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md，为“<业务功能名称>”设计场景测试。入口：<页面、Controller、接口或已有测试路径>。
```

每次只处理一个业务功能，不要扫描整个项目批量生成。

## 可选：npm 接入

npm 适合 CI、公共库开发或偏好包管理的团队，不是默认业务接入方式。

```powershell
npm install -D @yc_yzkj/scenario-test
npx @yc_yzkj/scenario-test init --project . --dir "scenario-test"
npx @yc_yzkj/scenario-test doctor --config scenario-test/scenario.config.js
```

安装脚本也支持显式 npm 模式：

- Windows：本地执行 `install.ps1 -UseNpm`。
- macOS/Linux：设置 `SCENARIO_TEST_USE_NPM=true` 后执行 `install.sh`。

npm 与免 npm 最终生成相同的项目运行时副本；两种方式不混用，失败后不自动切换。

## 常用操作

### 启动浏览器工作台

推荐双击：

```text
scenario-test/start-scenario-test.cmd
```

也可以手动执行：

```powershell
node .\scenario-test\.scenario-test\scenario-test-cli.cjs serve `
  --config .\scenario-test\scenario.config.js `
  --port 4300
```

### 执行场景

```powershell
# 全部非 manual 场景
node .\scenario-test\.scenario-test\scenario-test-cli.cjs `
  --config .\scenario-test\scenario.config.js --env local --all

# 指定场景
node .\scenario-test\.scenario-test\scenario-test-cli.cjs `
  --config .\scenario-test\scenario.config.js --env local --scenario <场景ID>
```

### 体检

```powershell
node .\scenario-test\.scenario-test\scenario-test-cli.cjs doctor `
  --config .\scenario-test\scenario.config.js
```

### 自定义下载源

`init` 的 `--library-url <目录>` 指向包含以下文件的目录：

- `scenario-test-cli.cjs`
- `scenario-test.umd.js`
- `scenario-test.d.ts`
- `scenario-test-capabilities.json`

## 项目目录

```text
scenario-test/
├─ .scenario-test/                 # AI 规则与固定版本运行时副本
├─ scenarios/                      # 按业务功能组织的场景
├─ plugins/                        # 可选：项目专属 Node 插件
├─ scenario.config.js              # 环境、变量和场景清单
├─ index.html                      # 浏览器工作台入口
└─ start-scenario-test.cmd         # Windows 双击启动入口
```

初始化配置使用项目内类型声明，npm 与免 npm 均可获得提示：

```js
/// <reference path="./.scenario-test/scenario-test.d.ts" />
```

## 核心能力

- 声明式 HTTP 场景 DSL，支持变量、提取、断言、条件和重试。
- 浏览器工作台与 Node.js CLI 使用同一套场景。
- `serve` 提供静态服务和同源接口代理。
- `doctor` 校验配置、场景、运行时版本和 SHA256 指纹。
- `capabilities --json` 输出机器可读能力清单。
- `manual: true` 场景默认不参与 `--all`。
- 支持 `--fail-on-skip`、文件上传、响应保存及自定义 Node 插件。

完整示例见 [`examples/complete`](examples/complete)，DSL 能力以 `src/contract.js` 和 `scenario-test-capabilities.json` 为准。

## 安全

- 场景文件是可执行代码，只加载可信来源。
- 不要提交生产凭据、个人数据或真实 Token。
- CLI/CI 优先通过环境变量提供敏感值。
- 浏览器本地存储适合受控联调环境，不应保存生产凭据。

详细说明见 [SECURITY.md](SECURITY.md)。

## 升级

- 免 npm：重新执行官方安装脚本，刷新运行时副本与 AI 规则。
- npm：升级包后重新执行 `init`。
- 两种方式升级后都运行 `doctor`，默认保留现有配置和场景。

历史变更见 [CHANGELOG.md](CHANGELOG.md)。

## 维护者

```powershell
npm install
npm run build
npm test
npm run test:browser
```

发布流程见 [docs/RELEASING.md](docs/RELEASING.md)。