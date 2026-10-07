# NEXT_STEPS — 优化迭代交接点

## 第 5 轮（2026-10-07）· 计划外加轮（用户要求继续）

### 本轮完成

- **选题**：R3 遗留清单三项一次收口——同属「R3 each 元素级明细（`detail`）消费补全」一条线，互不重叠、单轮可完成；R4 交接的价值排序也将「CLI 消费 detail」列为首位。按主题拆 3 个原子提交：
  1. **fix(report)**：Markdown 诊断报告值拼接补转义（R3 审查建议）。`mdInline` 助手：反斜杠先行转义、换行折叠为字面量 `\n`、非字符串值紧凑 JSON 单行；覆盖明细行/失败原因/警告三类拼接点。含换行/列表标记的响应值不再拆行、伪造嵌套列表。
  2. **feat(diag)**：工作台断言表与 Markdown 报告**递归展开**嵌套 each 明细（R3 遗留：引擎数据已递归、展示只一层）。抽出递归助手 `eachDetailRows`（HTML 表）/ `pushEachDetailLines`（Markdown），路径「 › 」串联（「第 1 项 › 第 2 项」），Markdown 缩进逐层加深；通过的子断言不产生行；扁平场景输出不变。
  3. **feat(cli)**：CLI `run` 失败输出单列 detail 行（R3 遗留：JSON 已透出、文本输出未展示）。失败断言行下 `      ↳ 第 N 项 <子断言名>: expected=… actual=…`，嵌套递归同口径；值走 `JSON.stringify` 换行天然转义。
- **测试接缝**（新开 `tests/report.test.js`）：`buildMarkdownReport` / `eachDetailRows` 自 ui-view.js 具名导出（浏览器默认导出形状不变），Node 侧直接消费——ui-view.js 模块级无 DOM 触碰，可直接 import。CLI 测试沿用 spawn `src/cli.js` 先例（三场景：each 失败/单值失败/each 通过，避开「默认失败停止」截断后续步骤）。
- **判别用例齐备**（教训 3）：转义「未实现必以真实换行出现」反断言 + 反斜杠翻倍锁歧义修复；明细「失败时存在/通过时无」极性；`eachDetailRows` 通过子断言行数计数 + undefined 空串；CLI `↳` 总行数锁定为 2（通过 each 与非 each 失败均不产生）。
- **contractVersion 决策：无涉及**——纯展示/输出层改动，契约零变化；`capabilities.json`/`d.ts` 无 diff（构建后 git status 确认仅 4 个 dist bundle 变化，无 tailwind（未新增 class 名））。
- **验证**：`npm run check` 一次通过，**190/190**（184 基线 + 本轮 6：report 5 + cli 1）。提交序列：8ec5da6（转义）→ dbc2dab（递归展示）→ 55a5df3（CLI 明细行）→ 3f33800（dist 再生成），全部留本地未 push。

### 本轮遗留事项

1. **取证 19 次，超软闸 4 次，自报**：宪法恢复（brief/NEXT_STEPS/git log）3 次 + 三候选的代码定位与渲染现状取证 9 次 + 测试接缝确认（cli.test spawn 模式、ui-view 模块头/导出、断言块精确文本）4 次 + CHANGELOG 头部读取（Edit 前置必需）1 次 + 2 次分主题定点测试复跑（report/cli 各 1，提交前快反馈）——按 R4 口径计入取证 19。无冗余复跑（`npm run check` 终验一次通过）。理由：三项并一轮，每处读取均为编辑锚点或测试接缝的必需确认，砍任何一处都会以盲改风险换预算。
2. `docs/AI_SCENARIO_PROMPT.md` / `README.md` 的 headers 大小写说明仍未核对（R4 遗留 2 原样继承）；本轮 CLI/工作台明细行属输出层，文档无对应章节需要补。
3. Markdown 报告的响应代码块（\`\`\` 围栏）若响应体本身含 \`\`\` 仍会破坏围栏——本轮只修了值拼接点（R3 审查建议范围），围栏转义可作后续小修。
4. 若再加轮，价值排序建议：造数线 UUID / 时间戳偏移（`now + 8d`）> 断言失败 diff 视图（工作台 expected vs actual 结构化对比）> 上条围栏转义小修。
5. 全绿基线现为 **190/190**。

### 硬边界提醒（若继续迭代）

- `dist/` 与 `*.generated.js` 勿手改，改源后 `npm run check`（含 build）再生，提交时一并 add（本轮 4 个 bundle 已随 build 提交核对）。
- contract 操作符 description 不能含 `}` 字符；新增能力才递增 `contractVersion`（行为修正勿递增，参考 R4 决策）。
- 版本号不动，CHANGELOG 只用 `## [Unreleased]`；所有提交留本地，不 push，由人工统一过目后决定。
