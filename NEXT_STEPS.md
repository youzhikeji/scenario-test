# NEXT_STEPS — 优化迭代交接点

## 第 3 轮（2026-10-06）

### 本轮完成

- **选题**：候选 B——失败诊断增强（采纳第 2 轮交接的首选建议）：`each` 断言失败时透出失败元素索引与该元素子断言结果。
- **实现**：
  - `src/core.js` `evaluateAssertion` 的 each 分支由「短路 every」改为「全量遍历收集失败元素」：结果对象仅在**确有失败元素**时挂 `detail` 字段（`[{ index, actual, assertions }]`，index 为 0 基下标，assertions 为该元素上**全部**子断言求值结果、含通过项）；通过时保持既有四字段形状（键都不存在）。嵌套 each 的子结果递归求值、自带各自 detail。非数组/期望值形状非法的失败不产生元素级明细（actual/expected 自身可定位）。passed 语义与旧实现逐点等价（空数组通过、every 语义、非数组 FAIL 不抛异常）。
  - `scripts/generate-dts.mjs`：`AssertionResult` 新增 `detail?: AssertionEachFailure[]`，新增 `AssertionEachFailure` 接口（`{ index, actual?, assertions: AssertionResult[] }`）。接口体内无花括号字面量（注：第 3 轮审查勘误——dts.test.js 的 `[^}]*` 正则只扫 Assertion/WhenDefinition 两接口，并不扫本接口，此约束实际未生效；保留无花括号写法作习惯性防御，勿再作为理由引用）。**contract.js 未动**（断言结果形状不是 DSL 输入，不在契约投射范围），contractVersion 保持 4。
  - 引擎/CLI 零改动：`engine.js:549` 原样引用 `buildAssertions` 结果，`detail` 随 `stepResult.assertions` 流入场景报告 JSON（CLI `run` 输出、工作台导出摘要 `assertions: item.assertions || []` 均直接引用原数组）。
  - 工作台 `src/browser/ui/ui-view.js` 两处：断言表格失败行下方插入明细子行（「↳ 第 N 项」1 基展示，与 validateAssertion 报错口径一致 + 失败子断言 expected/actual，四列对齐）；Markdown 报告导出在失败断言下逐行「第 N 项失败: 期望 X，实得 Y」。
- **测试**：`tests/parity.test.js` 新增独立测试块锁形状与极性——失败时 detail 存在且 `{index/actual/assertions}` 形状完整（仅失败元素计入、0 基、含通过子断言、可 JSON 序列化）；**通过时 `!("detail" in ok)` 且 `Object.keys` 恰为四字段**；非数组失败不挂 detail；嵌套 each 外层 detail 指向外层元素下标、内层失败由子结果自身 detail 描述；`buildAssertions` 透传。
- **验证**：`npm run check` 全绿，**182/182**（181 基线 + 本轮 1 块）。

### 本轮遗留事项

1. **取证 17 次，超软闸 2 次，自报**：git log/定位消费方/测试风格等取证 15 次后，追加 `npm run check`（构建+全量测试为验收必需）与 CHANGELOG 头部格式确认各 1 次。无冗余复跑（check 一次通过）。另有 2 次 PowerShell/Bash 权限审批失败重试（沙箱放行方式切换，非取证内容）。
2. 工作台明细行为无浏览器自动化覆盖（browser.test.mjs 不渲染断言表失败明细）：ui-view 改动为纯字符串拼接，已由 check 的 esbuild 打包验证语法。下轮若做 UI 线可补 Playwright 用例。
3. 组合断言中 each **之前**的操作符已失败时，each 明细不收集（与旧实现的 `&&` 短路口径一致）；each 通常独用，未视为缺陷。
4. CLI 人类可读输出（非 JSON）未单列 detail 行：报告 JSON 已透出，文本格式化留待「CLI 失败 diff 视图」整体做更有价值。
5. 全绿基线现为 **182/182**。shell 权限沿用旧结论：`git` 直接放行；`node`/`npm` 需 `dangerouslyDisableSandbox`（PowerShell 管道形式会被权限层拆分拦截，用 Bash + tail）。

### 下一轮建议

**首选：候选 A 提取线——`from: "headers"` 配 `path` 大小写不敏感取值**（第 2 轮已论证的真实踩坑点：HTTP/2 响应头全小写，`{ from: "headers", path: "X-Total" }` 取不到值）

理由：
1. 线索已探明：`extract.header` 经 `headerValue()` 已忽略大小写，而 `from: "headers"` 断言/提取走 `getByPath` 精确匹配——两者口径不一致是真缺陷。改前先写判别测试锁口径（headers 对象按 RFC 大小写不敏感）。
2. 改动面小（`core.js` 的 `assertionActual`/`applyExtract` 中 from:headers 分支），风险低。
3. 备选：候选 B 收尾——CLI 文本输出/`doctor` 消费 detail 做结构化失败 diff（引擎侧数据已就绪）；或造数线 UUID/时间戳偏移（`now + 8d`）。
4. 若做 headers 口径修正：涉及既有语义变化（原先精确匹配的行为改变），须在 CHANGELOG 显著说明并在 dts/文档同步，评估是否递增 contractVersion（倾向递增：契约描述的行为口径变化）。

### 硬边界提醒（对下一轮）

- `dist/` 与 `*.generated.js` 勿手改，改契约后必须 `npm run build`（`npm run check` 已含 build）。
- contract 操作符 description 不能含 `}` 字符；d.ts 接口体内同样避免嵌套花括号（`[^}]*` 正则扫描雷，第 2、3 轮均按此规避成功）。
- 版本号不动，CHANGELOG 只用 `## [Unreleased]`；所有提交留本地，不 push。
