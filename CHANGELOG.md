# Changelog

All notable changes to this project will be documented in this file.

## [0.5.13] - 2026-08-13

### 🐛 Bug Fixes

1. **工作台复制能力补全**
   - 待执行、已执行和跳过步骤统一提供复制按钮，可复制步骤标题、请求方法与接口路径。
   - 报告 Markdown、JSON 与步骤复制统一展示成功或失败反馈，并在短暂提示后恢复按钮文案。
2. **剪贴板异常与兼容性修复**
   - Clipboard API 同步抛错或异步拒绝时可靠回退到 `execCommand`，回退失败不再产生未处理 Promise rejection。
   - 无 DOM 环境安全返回失败；回退流程始终清理临时元素并恢复此前焦点。
3. **复制回归测试补充**
   - 覆盖待执行/跳过步骤、同步异常、异步拒绝、失败反馈、文案恢复及无 DOM 环境。

## [0.5.12] - 2026-08-12

### 🐛 Bug Fixes

1. **接入 Prompt 精简**
   - 安装接入 Prompt 由 8 条精简为 6 条：删除已被机制兜底的防御条款（命令格式由 CLI 守卫纠错、固定版本 URL 由 doctor 校验），只保留核心流程（安装 → doctor 体检 → 读取项目内规则 → 询问业务功能）。

## [0.5.11] - 2026-08-12

### 🐛 Bug Fixes

1. **CLI 命令位置纠错**
   - 命令（run/serve/doctor/init/capabilities）出现在参数位置时，明确报错并给出正确写法，不再静默当成 run 的场景名报「未找到场景」。
2. **文档与实现一致化**
   - 安装接入 Prompt 统一收口到根目录 README「快速接入」（删除 docs/AI_INSTALL_PROMPT.md，消除两份 Prompt 分叉）。
   - README 执行场景示例补 `run` 命令（命令统一紧跟脚本名）；`--library-url` 文件清单补全 AI 规则两个文件；目录树标注 init 生成与 AI 维护的边界。
   - init 生成的项目内 README 同步补 `run` 命令。

## [0.5.10] - 2026-08-12

### 🐛 Bug Fixes

1. **init --no-input：脚本安装不再卡死**
   - `init` 新增 `--no-input`，目标目录已存在时按 keep（保留配置与场景，仅刷新 AI 规则和运行时副本），不进入交互确认。
   - `install.ps1` / 安装流程对 init 传 `--no-input` 并实时回显输出，修复"目标目录已存在时 init 的交互提示被捕获输出吞掉、用户看不到任何提示而静默卡住"的问题。
2. **运行时副本刷新兜底**
   - `init` 在版本锁 sha256 与磁盘实际不符（副本被篡改/损坏/手工替换）时也刷新运行时副本，保证副本可信。

## [0.5.9] - 2026-08-12

### 🐛 Bug Fixes

1. **serve 自动强制浏览器使用同源代理**
   - `serve` 返回 HTML 时注入代理模式标记；浏览器继续展示和维护环境 `baseUrl`，仅在实际发送请求时改用当前工作台同源地址，再由服务端转发到所选环境，修复页面直连后端导致 CORS 的问题。
2. **工作台启动脚本使用随机空闲端口**
   - 生成的 `start-scenario-test.cmd` 不再固定占用 4300，改为向系统申请随机空闲端口，浏览器 URL 与 `--port` 使用同一端口，支持多项目同时启动互不冲突。
3. **端口被占用时友好提示**
   - `serve` 捕获 `EADDRINUSE`，输出「端口已被占用，请重新启动以获取新的随机端口」并退出码 1，不再输出未处理异常堆栈。
4. **免 npm 接入提示与文档对齐**
   - `init` 提示语、项目内 README 与安装脚本统一为「serve 自动启用同源接口代理」，不再要求手工清空页面 baseUrl。

## [0.5.8] - 2026-03-15

### ✨ Integration Experience

1. **快速接入 Prompt 直接给固定脚本地址，禁止 AI 搜索安装地址**
   - README 快速接入与 AI 接入 Prompt 补全固定版本脚本 URL（Windows `install.ps1`、macOS/Linux `install.sh`），并明确禁止 AI 搜索安装地址、GitHub Release 或 npm 最新版本，安装脚本与示例 URL 同步固定为 `v0.5.8`。

## [0.5.7] - 2026-03-15

### 🐛 Bug Fixes

1. **免 npm 下载不再依赖 GitHub API或 Node fetch**
   - 默认从 npm Registry 下载一次固定版本 tarball，在临时目录解压后由本地 `dist/` 初始化，避免 GitHub API共享出口限流以及 Node `fetch` 不继承系统代理的问题。
   - `Source` / `SCENARIO_TEST_SOURCE` 仍可指定内网 GitLab Raw 或制品目录；安装脚本会自行下载并校验全部 4 个运行时文件。

## [0.5.6] - 2026-03-15

### ✨ Integration Experience

1. **默认免 npm 接入，npm 降为显式可选**
   - 官方 `install.ps1` / `install.sh` 反转默认：无开关时直接从固定版本 GitHub Tag 的 `dist/` Raw 目录下载 CLI 并执行 `init --library-url`，业务项目不执行 `npm install`、不改 `package.json` / `package-lock.json`；`Source` / `SCENARIO_TEST_SOURCE` 可覆盖为内网 GitLab Raw 或制品目录（默认固定 `v0.5.6/dist/`）。
   - npm 变为显式可选：PowerShell `-UseNpm`、shell `SCENARIO_TEST_USE_NPM=true`，只有显式开启才执行 npm 安装；失败即退出，不静默切换。AI 接入 Prompt 默认指示免 npm，仅当用户明确要求 npm 时才切换；两种方式不混用、不自动兜底。
   - `init` 在无本机 dist/npm 包时，从 `--library-url` 指定目录下载全部 4 个运行时文件（CLI/UMD/d.ts/能力清单）；运行时副本任一缺失时明确失败（退出码 1）且不写版本锁，不再出现下载失败仍假成功的不完整安装。
   - 安装脚本生成文件校验覆盖全部运行时副本（CLI/UMD/d.ts/能力清单/版本锁），不再只检查 AI 规则文件。
   - `scenario.config.js` 三斜线引用改为项目内相对路径（`/// <reference path="./.scenario-test/scenario-test.d.ts" />`），免 npm 项目无 npm 包时类型提示仍可用；项目内生成的 README 以 `start-scenario-test.cmd` 与 `.scenario-test/scenario-test-cli.cjs` 为主命令，不再把 npx 写成默认。

## [0.5.5] - 2026-03-15

### ✨ Integration Experience

1. **运行时副本随 init 落盘，离线双击可用**
   - `init` 把 CLI、UMD、d.ts、能力清单复制到项目 `.scenario-test/`，写入 `.scenario-test-version.json`（版本 + SHA256 版本锁）；副本优先从本机 npm 包 `dist/` 拷贝，`--library-url` 可指定远程下载地址（默认 GitHub Release）。
   - `index.html` 改为引用 `./.scenario-test/scenario-test.umd.js`；`start-scenario-test.cmd` 使用副本 CLI 启动工作台，不依赖 npx 与网络。
   - `doctor` 恢复运行时握手：UMD/d.ts 版本一致、能力清单 schema/版本、版本锁文件存在性与 SHA256 指纹。

2. **serve 新增同源接口代理，绕开浏览器 CORS**
   - `serve` 对非静态请求按当前环境 `baseUrl` 服务端转发（页面 `baseUrl` 留空即走代理），后端无需放行 CORS；静态文件优先，代理目标不可达返回 502。
   - 启动日志打印代理目标：`接口代理: <envKey> -> <baseUrl>`。

## [0.5.4] - 2026-03-14

### ✨ Distribution

1. **Windows HTTP Server 启动脚本随发行版提供**
   - 新增 `scripts/start-scenario-test.ps1`，支持 `-Project`、`-Config`、`-Port` 与可选 `-OpenBrowser`；默认读取 `scenario-test/scenario.config.js`。
   - npm 包通过 `files` 包含该脚本；GitLab Release 新增同名下载资产，并按其仓库 `scripts/` 路径生成链接。

### ⚠️ Breaking Changes

1. **运行时统一由 npm 包提供**
   - CLI、浏览器 UMD、d.ts 和能力清单不再复制到业务项目的 `.scenario-test/`；运行时唯一来源改为 `node_modules/@yc_yzkj/scenario-test/dist/`。
   - init 生成的 `index.html` 直接引用 `../node_modules/@yc_yzkj/scenario-test/dist/scenario-test.umd.js`，`serve` 新增对应路由并从 CLI 所在 npm 包的 `dist/` 提供文件。
   - 业务项目必须先执行 `npm install -D @yc_yzkj/scenario-test`，不再支持下载单文件 CLI 兜底或克隆即用。

2. **移除项目版本锁与旧平铺布局兼容**
   - 删除 `.scenario-test-version.json`、运行时 SHA256/版本握手以及 `--library-url`；npm 包版本天然保证 CLI、UMD 与 d.ts 一致。
   - `.scenario-test/` 仅保存 `AI_SCENARIO_PROMPT.md` 和 `SCENARIO_PATTERNS.md`；doctor 改为检查配置、场景、DSL 与 AI 规则就绪。
   - init 与 doctor 统一使用 `.scenario-test/` 布局，不再探测或维护旧版平铺框架文件。

### ✨ Integration Experience

1. **npm-only 一键安装与运行命令**
   - `scripts/install.sh` / `scripts/install.ps1` 改为执行 `npm install -D @yc_yzkj/scenario-test`、`npx ... init` 和 `npx ... doctor`，不再下载 Release CLI。
   - README、AI 接入 Prompt、项目初始化模板与内部指南统一使用 `npx @yc_yzkj/scenario-test`。
   - 项目 `scenario.config.js` 通过 `/// <reference types="@yc_yzkj/scenario-test" />` 使用 npm 包内类型声明。

### Migration Guide

1. 在业务项目根目录执行 `npm install -D @yc_yzkj/scenario-test`。
2. 执行 `npx @yc_yzkj/scenario-test init --project . --dir "scenario-test"`，刷新 `.scenario-test/` 中的 AI 规则。
3. 执行 `npx @yc_yzkj/scenario-test doctor --config scenario-test/scenario.config.js`。
4. 可手动删除旧 `.scenario-test/` 中的 `scenario-test-cli.cjs`、`scenario-test.umd.js`、`scenario-test.d.ts`、`scenario-test-capabilities.json` 和 `.scenario-test-version.json`；不要删除 AI 规则、配置或场景文件。

### ✨ Integration Experience

1. **一键安装脚本成为 README 主路径**
   - `scripts/install.sh` / `scripts/install.ps1` 首次纳入版本管理并对外指引：README「给业务同事」章节新增「方式一：一键安装脚本（推荐，最快）」，Windows 用 `irm ... install.ps1 | iex`、macOS/Linux 用 `curl ... install.sh | bash`，脚本自动完成 Node 检查、下载固定版本 CLI、`init` 与 `doctor` 体检并打印使用引导。
   - AI 接入 Prompt 精简为「脚本优先 + 手动兜底」：AI 优先运行官方安装脚本；脚本不可用（如内网受限）时自主下载 CLI 完成 `init` 和 `doctor`。`docs/AI_INSTALL_PROMPT.md` 与 README 内联 Prompt 同步更新。
   - `tests/contract.test.js` 新增一键脚本默认版本断言，锁住 `install.sh` / `install.ps1` 的默认版本与 `package.json` 一致，防升级时静默漂移。

2. **npm 发布：`@yc_yzkj/scenario-test`**
   - `package.json` 改为 scoped 包名 `@yc_yzkj/scenario-test`，去除 `private`，新增 `files: ["dist"]`、`bin: { "scenario-test": "dist/scenario-test-cli.cjs" }` 与 `license`。
   - CLI 产物增加 shebang（`#!/usr/bin/env node`），支持 `npx @yc_yzkj/scenario-test` 直接执行。
   - README、`docs/AI_INSTALL_PROMPT.md`、`examples/EXAMPLES_INDEX.md` 改为以 npm 安装为主路径（`npm install -D @yc_yzkj/scenario-test` + `npx @yc_yzkj/scenario-test init`），GitHub Release 下载降为 npm 不可用时的兜底。
   - `tests/contract.test.js` quick-start 断言允许 `npm install`（仍禁止 `git clone` / `npm run build`）。
   - `docs/RELEASING.md` 补充 `npm publish --access public` 发布步骤。

3. **init 目标目录已存在时交互确认**
   - 目标目录已存在且未传 `--force` 时，`init` 交互询问：`o` 覆盖已有文件（等价 `--force`）、`k` 保留现有文件（默认：刷新 `.scenario-test/` 内 AI 规则，不覆盖项目配置与场景）、`c` 取消。
   - stdin 非 TTY（CI、安装脚本、管道）时自动采用默认保留，不阻塞自动化流程。
   - README 与 `docs/AI_INSTALL_PROMPT.md` 同步补充交互说明。

---

## [0.5.3] - 2026-03-14

### 🗑️ Removed

1. **移除 xlsx 适配器（重大瘦身）**
   - 删除 `src/adapters/xlsx.js`、`tests/xlsx.test.js`、`examples/xlsx-adapter/`（含 README、index.html、index.standalone.html、scenario.config.js、scenarios/*、templates/README.md）及 `dist/adapters/xlsx.cjs`。
   - 从 `package.json` 移除 `exceljs` 依赖，传递依赖减少约 95 个；CLI 产物从约 3.0MB 降至约 953KB。
   - `scripts/build.mjs` 移除 xlsx 构建步骤；`scripts/publish-release.mjs` 发布资产从 7 个减至 6 个（移除 `adapters/xlsx.cjs`）。
   - `src/core.js` / `src/browser/legacy/core.js` 移除 xlsx 相关注释；`README.md`、`docs/ADAPTER_GUIDE.md`、`examples/EXAMPLES_INDEX.md` 同步移除 xlsx 引用。

### ⚠️ Breaking Changes

1. **xlsx 适配器被移除**
   - v0.5.3 起不再内置 xlsx 适配器，发布资产中也不再提供 `adapters/xlsx.cjs`；依赖 `prepareXlsx` 等 xlsx 能力的场景将无法再开箱即用。

### 🐛 Bug Fixes

1. **修复版本锁缺失/损坏时的升级死锁**
   - `init` 的 `shouldRefreshFramework` 在版本锁缺失或损坏时不再静默跳过刷新，改为复用 `doctor` 的 UMD/DTS 版本探测逻辑，版本锁异常时可自愈（涉及 `src/cli.js`、`src/doctor.js`）。

### 🔒 Security

1. **升级 postcss 至 8.5.26 修复 CVE**
   - `package.json` 新增 `npm overrides` 将 `postcss` 强制升级到 `8.5.26`，并重建 `package-lock.json`，消除已知漏洞。

### 📚 Documentation

1. **v0.3 历史资料归档**
   - 8 个 v0.3 历史文档迁移至 `docs/archive/`（FINAL_REVIEW、GITLAB_RELEASE_GUIDE、HOW_TO_VIEW_EXAMPLES、READINESS_ASSESSMENT、RELEASE_GUIDE/RELEASE_NOTES/RELEASE_SUMMARY_v0.3.0、SECURITY_FIX_PLAN），新增 `docs/archive/README.md` 说明仅作历史参考、不再维护；删除整个 `docs/fix-examples/` 目录（11 个 v0.3 时期代码示例与评估文档）。

2. **文档内容收敛与示例流程统一**
   - `docs/INTERNAL_USAGE_GUIDE.md` 与 `docs/ADAPTER_GUIDE.md` 将断言语法从 v0.3 旧形式更新为操作符键形式。
   - `docs/INTERNAL_USAGE_GUIDE.md` 6 处及 `examples/complete/README.md`、`examples/security-best-practices/README.md`、`examples/EXAMPLES_INDEX.md` 共 8 处「直接打开 index.html」统一为「必须 serve 启动」。
   - `docs/AI_INSTALL_PROMPT.md` 版本号及安装命令中的 release 资产下载链接同步到 v0.5.3。

### Migration Guide: v0.5.2 → v0.5.3

1. **使用 xlsx 适配器的用户**：升级前请自行导出/保存 xlsx 适配器实现，或继续使用 v0.5.2。
2. 其余用户无 breaking change；若此前遇到过版本锁缺失/损坏，升级后重新执行 `init`（不传 `--force`）即可自愈版本锁。

---

## [0.5.2] - 2026-08-10

### ✨ Integration Experience

1. **业务项目只需复制一次接入 Prompt**
   - AI 自动完成固定版本安装、`init`、`doctor`，随后读取项目内生成的 `AI_SCENARIO_PROMPT.md` 并询问目标业务功能。
   - 用户不再需要理解两阶段流程、复制第二份 Prompt、学习 DSL 或手工维护 `scenario.config.js`。
   - 新 AI 会话可用一句短命令读取项目内规则并继续设计场景。

2. **按单个业务功能设计场景矩阵**
   - 业务功能作为设计和目录边界，场景作为成功、校验、权限、边界、幂等或状态流转等独立验证路径。
   - 禁止扫描整个项目批量生成，或把多个业务功能串成一个大场景。
   - 推荐使用 `scenarios/<功能标识>/<验证路径>.js` 和 `<功能标识>-<验证路径>` 场景 id。

3. **更安全、更精简的初始化目录**
   - 新项目根层只保留 `README.md`、`index.html` 和 `scenario.config.js`；CLI、浏览器运行时、AI 规则、类型声明、能力清单和版本锁集中到 `.scenario-test/`。
   - 默认 `globals` 改为空，避免项目未配置时发送占位请求头。
   - 失败分支默认拆为独立场景；`failurePolicy: "continue"` 仅用于同一验证路径内继续收集步骤结果。
   - README、接入 Prompt、示例索引和 init 生成文档统一为同一使用流程。

4. **旧项目布局兼容**
   - init 检测到旧平铺框架文件或旧版 `index.html` 引用时继续原位更新，不强制迁移，不生成新旧混合布局。
   - 版本锁与当前 CLI 版本不一致时，仅刷新框架管理文件；`scenario.config.js`、`scenarios/` 和项目 README 保持不变。
   - doctor 与 init 共用同一布局判定，一次只选择 `.scenario-test/` 新布局或旧平铺布局。

### Migration Guide: v0.5.1 → v0.5.2

1. 无 DSL 或 CLI breaking changes。
2. 新项目直接使用 v0.5.2 AI 接入 Prompt。
3. 既有平铺项目重跑 v0.5.2 `init` 时继续使用原布局，不需要迁移；如需采用隐藏目录，只能在备份并确认项目差异后人工迁移，不能直接使用 `init --force`。

---

## [0.5.1] - 2026-08-10

### 🐛 Bug Fixes

1. **浏览器 legacy includes/oneOf/extract 与 Node 同语义**
   - `includes`：actual 为数组时改用 JSON 深比较 `some`（修复 `[10,20]` 被字符串化导致 `includes: 2` 假阳性）；非数组保持子串包含。
   - `matches`：无效正则时断言失败而非抛异常（与 Node 一致）。
   - `oneOf`：expected 必须为数组（含模板变量解析后），否则断言失败而非抛异常。
   - `extract`：来源解析与 Node `src/core.js` 完全同语义（`target:'status'`/`header` 简写优先，`from: headers/bodyText/response`，默认 body）；路径取值改为基于解析后的 source。
   - 新增 `tests/parity.test.js`：浏览器 legacy 与 Node 断言语义一致性测试，禁止静默漂移。

2. **版本锁 SHA256 同版本替换后可刷新**
   - `init` 的 `writeVersionLock` 在版本号一致时也校验框架管理文件（CLI/UMD/d.ts/capabilities）SHA256：任一文件被手工替换/缺失即重算哈希刷新锁，保证 doctor 版本握手恢复健康。

3. **d.ts VERSION 正式导出**
   - `src/index.js` 正式导出 `VERSION`（来自 `version.generated.js`），`tests/dts.test.js` 新增导出一致性测试（d.ts 声明与运行期值一致）。

4. **createApp 返回类型**
   - `scenario-test.d.ts` 新增 `ScenarioApp` 接口，`createApp` 返回类型由 `void` 修正为 `ScenarioApp`（覆盖三方常用入口 loadScenario/runAll/runNext/reset/cancel/rewindToStep/rerunStep/destroy/getState）。

5. **doctor 绝对路径判断与 run 一致**
   - `doctor` 不再拒绝场景清单中的绝对路径（与 `run` 一致可正常执行），改为 WARN 提示建议使用配置目录内相对路径；相对路径仍保留配置目录内越界校验（防路径遍历）。

6. **doctor 缺配置时输出 JSON 报告**
   - 配置文件缺失不再提前抛错：输出 `config` FAIL 检查项，版本/文件握手等其他检查继续执行，`--json` 仍输出结构化 JSON（新增顶层 `status` 字段，`OK`/`FAILED`）。

### Migration Guide: v0.5.0 → v0.5.1

1. 无 breaking changes；DSL 与 CLI 行为保持不变。
2. 既有项目升级：使用新版 CLI 执行 `init`（不传 `--force`，刷新版本锁 SHA256），再运行 `doctor` 验证。
3. `doctor --json` 报告新增顶层 `status` 字段；配置文件缺失时输出名为 `config` 的 FAIL 检查项（原行为为直接抛错退出）。

---

## [0.5.0] - 2026-08-10

### ✨ 三方能力发现闭环

1. **DSL Contract 单一真相（`src/contract.js`）**
   - 新增不可变机器可读 `contract`（contractVersion 从 1 开始；runtimeVersion 复用 `version.generated.js` 的 VERSION）。
   - 断言元数据键与操作符（含说明与类型约束，数值比较操作符 `gt/gte/lt/lte` 标注 `finiteNumber`）、when 来源（仅 vars）、extract 字段/来源/required 语义、保留变量 `runId/runNo`、generatedVars 类型、config/scenario 关键字段（含 manual）、CLI 命令与参数均收敛到 contract。
   - `core.js` / `registry.js` / `engine.js` / `cli.js` 改为消费 contract，不再手写操作符、保留变量、when 来源等名单。
   - `defineScenario` 新增 generatedVars 类型定义期校验（原为运行期报错，合法场景行为不变）。
   - browser legacy 因架构自包含无法直接共享名单，已暴露 `ASSERTION_OPERATORS / ASSERTION_META_KEYS / RESERVED_VARS` 并新增一致性测试，禁止静默漂移。
   - 不引入 JSON Schema（本项目配置/场景是可执行 JS）。

2. **CLI `capabilities` 命令**
   - `node scenario-test-cli.cjs capabilities` 输出人类文本能力清单；`capabilities --json` stdout 纯净输出合法 JSON。
   - 构建产物 `dist/scenario-test-capabilities.json` 与 `capabilities --json` 同源（同一份 contract 投影），不维护第二套 JSON 源。
   - `--help` 更新展示 capabilities 与 doctor。

3. **CLI `doctor` 命令 + 项目版本锁**
   - `node scenario-test-cli.cjs doctor --config scenario.config.js [--json]`：复用现有 loader/defineConfig/defineScenario/path validation，不另写 DSL 校验器。
   - 检查 Node 版本（engines）、配置加载、场景清单 id/url 与文件存在性、场景文件加载与注册 id 匹配、manual 信息提示、CLI/UMD/d.ts/capabilities/版本锁版本一致性。
   - 汇总所有可继续检查的错误；有 FAIL 退出码 1，仅 WARN/INFO 退出码 0；每条 FAIL/WARN 给出“在哪里、为什么、如何修”。
   - init 新增框架管理文件 `.scenario-test-version.json`：记录 runtimeVersion、contractVersion、CLI/UMD/d.ts/capabilities 预期文件名、产物 SHA256、source/release 信息（不写本机路径）。
   - 新项目 init 写入版本锁；既有项目缺版本锁时 doctor 仅 WARN 并给出补齐提示；doctor 只校验本地固定版本，不联网检查最新版本。
   - 不实现 upgrade 命令，仅建立所有权与版本锁基础。

4. **`scenario-test.d.ts` 零安装类型声明**
   - 从 contract 投影生成 `dist/scenario-test.d.ts`（操作符/保留变量/类型名单由脚本生成，禁止手工复制漂移；构建/测试校验一致）。
   - 覆盖 ScenarioConfig / Environment / ScenarioListItem(manual) / ScenarioDefinition / Step / RetryUntil / Assertion / ExtractDefinition / WhenDefinition 与 createApp / createEngine / defineConfig / defineScenario / registerConfig / registerScenario 等公共导出；UMD 全局通过 `export as namespace ScenarioTest` 声明。
   - init 复制 d.ts 到项目场景测试目录，纯 JS 项目可通过 `// @ts-check` + `/** @type {import('./scenario-test').ScenarioDefinition} */` 获得 IDE 提示；消费者无需 npm install。
   - package.json 增加 `types` 指向 dist，不新增破坏深层导入的 `exports` 字段。

5. **文档与 init 投影**
   - `docs/AI_INSTALL_PROMPT.md` 更新到 v0.5.0 固定版本 URL；examples 索引版本标记同步；GitLab 文档标注内部/历史，明确 GitHub Release 是对外正式渠道。
   - 澄清 `--authorization` 仍兼容但已弃用（不宣称 0.4.0 已移除）。
   - init 生成 AI_SCENARIO_PROMPT.md / SCENARIO_PATTERNS.md / README.md 的能力名单从 contract 投影，不再手抄操作符名单。
   - 文件所有权：runtime / d.ts / capabilities / 版本锁 / AI Prompt / Patterns 属框架管理；scenario.config.js、scenarios/*.js 属项目管理（init 默认不覆盖，本轮不新增覆盖升级行为）。

6. **发布资产**
   - 未来 Release 文件清单新增 `scenario-test.d.ts` 与 `scenario-test-capabilities.json`（共 7 个产物；版本锁由 init 生成，非独立发布产物）。

### 🧪 Tests

- `tests/contract.test.js`：contract 与 core/legacy 操作符、保留变量、元数据键一致；contract.engines 与 package.json engines 一致。
- `tests/capabilities.test.js`：capabilities 文本与 JSON 输出；`--json` stdout 可解析且纯净；与 build 产物 `dist/scenario-test-capabilities.json` 一致。
- `tests/doctor.test.js`：健康项目全 PASS；未知操作符场景 FAIL；多文件错误汇总；无版本锁 WARN；版本不一致 FAIL；manual INFO；退出码语义。
- `tests/dts.test.js`：d.ts 包含 contract 全部操作符/保留变量/类型名单；用全局 `tsc --noEmit` 验证最小 JS/TS 用例（不新增 devDependency）。
- `tests/init.test.js`：init 写入 d.ts/capabilities/版本锁；重跑默认不覆盖项目配置/场景；版本锁在版本一致时保留、不一致时更新。

### Migration Guide: v0.4.x → v0.5.0

1. 无 breaking changes；0.4.0 的 DSL 与 CLI 行为保持不变（`--authorization` 仍兼容）。
2. 新项目 init 会自动写入 d.ts / capabilities.json / `.scenario-test-version.json`。
3. 既有项目升级：使用新版 CLI 对项目执行 `init`（不传 `--force`，不会覆盖项目文件），再运行 `doctor` 验证；缺少版本锁时 doctor 会 WARN 并提示补齐。
4. `defineScenario` 对 generatedVars 的未知 type 报错时机从运行期提前到定义期（非法配置更早暴露）。

---

## [0.4.0] - 2026-08-10

### ⚠️ Breaking Changes

1. **断言 schema 严格化（BREAKING）**
   - 断言定义只允许元数据键 `name / path / from / target / header / implicit` 与操作符键，未知键在定义期（`defineScenario`）与执行期（`evaluateAssertion`）立即抛错，错误包含场景名、步骤名/序号、断言序号定位信息。
   - 每条断言必须至少包含一个操作符；`assertions: []` 或空对象不再合法。
   - 无显式断言的步骤仍自动追加 HTTP 2xx 隐式断言，不受影响。

2. **新增数值比较操作符 `gt / gte / lt / lte` 与 `notEquals`**
   - `notEquals` 与 `equals` 一样采用 JSON 深比较后取反。
   - `gt/gte/lt/lte` 只接受 actual 与 expected 均为有限 number，不做字符串隐式转换；类型不符时断言失败（不是抛执行异常），并保留 actual/expected 用于报告。整段模板 `{{vars.x}}` 解析出数字时正常参与比较。
   - 此前用 `matches` 模拟数值比较的断言可迁移为 `gte: 5` 等；若业务语义要求"整数"（如返回条数必须为非负整数），请继续使用 `matches: "^\\d+$"`，不要用 `gte: 0` 代替（`gte: 0` 允许 1.5）。

3. **`when` 对象形式只允许 `from: "vars"`**
   - 对象形式条件（如 `{ from: "vars", path: "id", exists: true }`）不允许 `from: "body"/"status"/"header"` 与 `target/header` 键，定义期明确报错；非对象形式（模板字符串/布尔）真值语义保持不变。未引入 `and/or/not` 与 `lastResponse` 条件。

4. **保留变量保护：`runId / runNo` 禁止声明或覆盖**
   - `scenario.vars`（定义期）、config/options vars、`scenario.envVars`、`generatedVars`、`extract` 均不得声明或覆盖 `runId / runNo`，冲突在使用前尽早报错。

5. **extract 增强**
   - `required: true` 且路径不存在时当前步骤失败（可配合 `retryUntil` 轮询直到字段出现）。
   - `required` 默认 `false`：路径不存在保持兼容（变量为 undefined），但产生 warning；warning 进入步骤结果并由 CLI（`[WARN]`）与浏览器 UI（报告"警告"行）展示，不含响应敏感值。

6. **SKIP 可观测性（行为变更）**
   - SKIP 步骤仍返回 `skipped: true`（步骤对象保留 `passed: true` 以兼容既有调用），但聚合统计不再把 SKIP 计入通过/执行数。
   - 场景报告新增 `status`（`PASSED / FAILED / SKIPPED`）与 `passedSteps / failed / skipped / executed`；`executed` 只统计实际执行请求/适配器的步骤。
   - 部分 PASS + 部分 SKIP 且无失败时场景状态为 `PASSED`，SKIP 单独计数。
   - CLI 输出 `[SKIP]` 标记，摘要分别显示 passed/failed/skipped/executed/planned；新增 `--fail-on-skip`（默认 false），开启后任何 skip 导致最终退出码 1。
   - 浏览器工作台同步显示跳过统计（统计面板、过滤按钮、AI 报告）。

7. **manual 场景隔离**
   - 配置场景项支持 `manual: boolean`（严格校验类型）。
   - `--all` 默认排除 `manual: true` 场景；`--scenario <id>` 可显式执行；全部为 manual 时 `--all` 报错并提示使用 `--scenario`。
   - 未实现 tags、多值/前缀匹配、文件直跑。

### 🐛 Bug Fixes

- 修复 `runtime.vars` 被冻结时 extract 写入失败的问题（保留变量改为定向保护，不再冻结整个 vars）。
- 修复 `when` 对象形式在校验前即可绕过断言名单的问题（定义期与执行期双重校验）。

### 🧪 Tests

- `tests/core.test.js`：五个新增操作符 pass/fail、数字类型边界、未知操作符、无操作符、执行期非法断言。
- `tests/engine.test.js`：when 校验、保留变量冲突、extract required/warning、SKIP 聚合（全跳过/部分跳过）。
- `tests/cli.test.js`：`--all` 排除 manual、显式场景执行、`--fail-on-skip` 退出码、`[SKIP]` 与摘要格式。
- `tests/browser.test.mjs`：浏览器 UI SKIP 统计显示。

### Migration Guide: v0.3.x → v0.4.0

1. 若断言对象含非名单键（如自定义备注字段），请删除或移入 `name`。
2. `matches: "^[5-9]|[1-9]\\d+$"` 类数值断言可替换为 `gte: 5`；纯非负整数断言保留 `matches: "^\\d+$"`。
3. `when: { path: "code", equals: 200 }`（无 `from`）需改为 `when: { from: "vars", path: "code", equals: 200 }`；基于响应体的条件不被支持，请改为 extract 后基于 vars 判断。
4. 不要在任何变量源声明 `runId / runNo`。
5. 全场景 SKIP 时 CLI 退出码仍为 0（除非 `--fail-on-skip`），但报告状态为 `SKIPPED`，与 FAILED 明确区分。

---

## [0.3.0] - 2026-08-08

### 🔒 Security Fixes (BREAKING CHANGES)

#### CRITICAL
- **路径遍历防护**: 所有文件操作（XLSX 适配器、文件上传、响应保存）现在都验证路径边界，阻止访问工作区外的文件
- **插件路径限制**: 插件必须在配置目录内，外部插件需要 `--allow-external-plugins` 标志
- **vm.runInContext 文档**: 添加安全警告，说明场景文件的执行权限

#### HIGH
- **环境变量授权**: 推荐使用 `SCENARIO_AUTH` 环境变量代替 `--authorization` 参数（命令行参数在进程列表中可见）
- **环境变量名遮蔽**: 生产模式下错误消息不再显示环境变量名，防止信息泄露
- **路径验证工具**: 新增 `src/utils/path-validator.js` 统一路径安全验证

#### MEDIUM
- **不可变 Runtime Vars**: `runtime.vars` 现在被 `Object.freeze()` 冻结，防止意外修改
- **重试超时保护**: 添加默认 5 分钟总超时（`maxElapsedMs`）和最小 100ms 重试间隔

### ⚠️ Breaking Changes

1. **授权方式变更**
   ```bash
   # ❌ 旧方式（已弃用，但仍可用）
   node scenario-test-cli.cjs --authorization "Bearer token"
   
   # ✅ 新方式（推荐）
   export SCENARIO_AUTH="Bearer token"
   node scenario-test-cli.cjs --config scenario.config.js
   ```

2. **插件路径限制**
   ```javascript
   // ✅ 安全：项目内插件
   { plugins: ["./plugins/custom.js"] }
   
   // ❌ 需要标志：外部插件
   // 运行时需要: --allow-external-plugins
   { plugins: ["/tmp/plugin.js"] }
   ```

3. **文件路径验证**
   - 绝对路径现在会被拒绝
   - `..` 路径遍历会被拒绝
   - 所有路径必须在工作区内

### 📝 New Features

- 新增 `--allow-external-plugins` 标志允许加载外部插件
- 环境变量 `SCENARIO_VERBOSE_ERRORS=true` 启用详细错误消息（开发模式）
- 新增 `SECURITY.md` 安全指南文档
- 新增路径验证工具 API: `validatePath()`, `validatePaths()`, `isPathSafe()`

### 🐛 Bug Fixes

- 修复路径遍历安全漏洞（CVE-待分配）
- 修复环境变量名泄露问题
- 修复无限重试可能性

### 📚 Documentation

- 添加 `SECURITY.md` 安全最佳实践
- 更新 CLI 帮助文档
- 更新 README.md 安全章节

### 🧪 Tests

- 新增 `tests/security-fixes.test.js` 安全测试套件
- 路径遍历攻击测试
- 不可变性测试
- 输入验证测试

---

## [0.2.13] - 2026-07-XX

### Features
- 浏览器工作台和 Node.js CLI 双模式
- 声明式 DSL
- AI 安装 Prompt

### Improvements
- 零依赖部署
- 单文件引入

---

## Migration Guide: v0.2.x → v0.3.0

### 1. 授权方式迁移

**影响**: 所有使用 `--authorization` 的脚本

**迁移步骤**:
```bash
# 步骤 1: 创建 .env 文件（不要提交到 Git）
cat > .env << EOF
SCENARIO_AUTH="Bearer your-token-here"
EOF

# 步骤 2: 加入 .gitignore
echo ".env" >> .gitignore

# 步骤 3: 更新运行脚本
# 旧脚本
node scenario-test-cli.cjs --authorization "Bearer token" --all

# 新脚本
export $(cat .env | xargs)
node scenario-test-cli.cjs --all
```

**向后兼容**: `--authorization` 仍然可用，但会显示弃用警告。计划在 v0.4.0 移除。

### 2. 插件路径迁移

**影响**: 使用 `nodePlugins` 的配置

**迁移步骤**:

如果插件已经在项目内：
```javascript
// ✅ 无需修改
{
  nodePlugins: ["./plugins/custom-adapter.js"]
}
```

如果使用外部插件：
```bash
# 选项 1: 复制插件到项目内（推荐）
cp /external/plugin.js ./plugins/

# 选项 2: 使用 --allow-external-plugins 标志
node scenario-test-cli.cjs --allow-external-plugins --all
```

### 3. 文件路径迁移

**影响**: 使用绝对路径或路径遍历的场景

**迁移步骤**:
```javascript
// ❌ 旧方式 - 会报错
{
  prepareXlsx: {
    template: "/absolute/path/template.xlsx",
    output: "../output/result.xlsx"
  }
}

// ✅ 新方式 - 使用相对路径
{
  prepareXlsx: {
    template: "templates/template.xlsx",
    output: "output/result.xlsx"
  }
}
```

### 4. 错误处理更新

**影响**: 解析错误消息的代码

生产环境错误消息格式已更改：
```javascript
// 旧格式
"缺少场景变量 PROD_API_SECRET（映射到 vars.apiSecret）"

// 新格式
"缺少必需的场景变量: vars.apiSecret
提示: 请在配置文件的 vars 中设置该变量，或通过环境变量提供"
```

开发环境可设置 `SCENARIO_VERBOSE_ERRORS=true` 查看详细信息。

---

## Testing the Migration

测试迁移是否成功：

```bash
# 1. 运行安全测试
npm test
node --test tests/security-fixes.test.js

# 2. 测试现有场景
export SCENARIO_AUTH="your-token"
node scenario-test-cli.cjs --config scenario.config.js --all

# 3. 检查是否有弃用警告
# 如果看到警告，按照上述步骤迁移
```

---

## Support

如有迁移问题，请：
1. 查看 `SECURITY.md` 安全指南
2. 提交 GitHub Issue
3. 联系项目维护者
