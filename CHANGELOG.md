# Changelog

All notable changes to this project will be documented in this file.

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
