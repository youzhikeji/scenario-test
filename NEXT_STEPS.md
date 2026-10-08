# NEXT_STEPS — 优化迭代交接点

## 第 7 轮（2026-10-09）

### 本轮完成

- **选题**：上一会话遗留的第 7 轮半成品改动（工作区未提交），本轮为审查收尾而非新开选题。改动主题为 **CLI 易用性 + 工作台可观测性**（CLI help 重写/报错两段式/拼写建议/场景候选清单/结论行；工作台场景搜索清除、步骤筛选摘要/空态、报告定位步骤、a11y）。注意：R6 建议的首选方向「CLI 失败 diff 视图」**本轮未做**——半成品走的是易用性路线（失败断言的 expected/actual 单行输出在 `55a5df3` 已有，本轮未增强为结构化并排 diff），方向建议顺延为 R8 首选。
- **审查发现并修复 2 处缺陷**：
  1. **真实 UI 缺陷（Playwright 抓到）**：步骤筛选工具行 `flex: 1` + 摘要 `flex: 0 0 auto` + `nowrap` 不可收缩，390px 视口（mobile）下「显示 1 / 1 个步骤」摘要溢出遮挡「失败」筛选按钮致其不可点击，Playwright `locator.click` 30s 超时暴露。修复：`#filterBar` 允许换行、工具行 `flex: 1 1 220px`、摘要 `flex: 0 1 auto` + ellipsis 截断。
  2. **拼写建议名单缺口**：`--help`/`-h` 由 parseArgs 内联处理不进 `contract.cli.options`，`--hel` 输错得不到建议。修复：suggestOption 候选名单补 `"--help"`（脚本扫描确认不引入等距二义）。
- **审查确认无问题的点**：help 投射自 contract 无第二份名单（`--help` 宣传「任一命令后追加 --help」与实际行为一致，实测）；browser/ui 新增代码沿用 `var`+function 的 ES5 风格惯例（`Array.from`/`Number.isInteger`/`closest` HEAD 已用，`scrollTo`/`matchMedia`/`focus({preventScroll})` 均有守卫降级）；本轮纯展示层不触引擎语义，无 parity 缺口；「定位步骤」1 基 `stepNo`→零基 `data-step-idx` 换算正确（注释已说明）；aria-label 经 `esc` 转义无 XSS 面；`loadScenario` 跨场景保留筛选状态为 HEAD 既有行为（空态自带一键清除），未改。
- **测试 +4**：cli.test.js 新增 4 条（help 投射完整性+孤儿选项极性断言；拼写建议两分支——`--confg` 有建议/`--hel` 建议 --help/`--xyzzy` 无建议；`--scenario` 未命中候选清单含 manual 标注；结论行失败/全部跳过/完成三态可判别）。browser.test.mjs 补 1 段内联断言（筛选计数/aria-pressed/摘要文案/空态恢复/定位按钮 index/高亮+展开态）。
- **验证**：`npm run check`（build + 199/199 全绿，195 基线 + 4）；`npm run test:browser` **两次运行**（第一次暴露摘要遮挡缺陷→修复→第二次 desktop+mobile 双视口全绿）。R6 遗留事项 3（发布前补跑浏览器测试）本轮已完成。全部提交留本地未 push。
- **提交**（4 个原子提交：`2bb910b` feat(cli) → `47e55a5` feat(workbench) → `e583b74` build → docs）：dist 4 产物与 tailwind.generated 随 build 再生提交；tailwind 净变化为新增 `pr-8`、淘汰 `bg-slate-200/50`/`p-0.5`/`pr-2.5`（与 ui-view 改动对应，无残留引用）。

### 本轮遗留事项

1. **取证计数（最严口径如实上报）**：宪法恢复（AGENTS.md/NEXT_STEPS/CHANGELOG/git log）4 + diff 审阅与落点核查（cli/browser/dts/capabilities/tailwind 结构化对比/contract 投射/二义扫描）9 + check 首跑与验收 2 + test:browser 三跑（首跑暴露遮挡缺陷、修复后验收、再终验）3 + 幻影文件还原 3 轮 3 + 实测 CLI 行为（help/--hel/--confg/结论行等 6 组命令）6 = **27 次，超软闸 15**（半成品审查比新开选题需要更多取证：既要核对已有改动的正确性，又要验证修复）；总动作约 60，超 40。超出部分主要为缺陷验证与三跑浏览器测试，均为必需，无冗余复跑。
2. **CLI 失败 diff 视图仍未做**（R5 遗留候选、R6 首选、R8 继续顺延）：expected vs actual 结构化并排对比。当前 `55a5df3` 已有单行 `expected=... actual=...` 输出与 each 递归明细，diff 视图是锦上添花而非补缺。
3. 其余价值排序（继承 R6）：Markdown 报告围栏转义小修（响应体含 ``` 破坏围栏）> 枚举随机（带权重）造数。
4. **时间冻结类测试未做**（继承 R6）：结论行测试断言文案而非时间值，无 flaky 面。
5. `docs/OPTIMIZATION_BRIEF.md` 的 CRLF 幻影改动（R6 遗留 1）未处理，建议人工 `git checkout --` 或统一仓库 EOL 策略；本轮 build/check 曾使 `dist/scenario-test-capabilities.json`、`dist/scenario-test.d.ts`、`src/version.generated.js` 出现同款 CRLF 幻影（`git diff` 为空），已 `git checkout --` 还原 3 个文件，提交内容不受影响。
6. 全绿基线现为 **199/199**；contractVersion 仍为 **5**（本轮无 DSL 能力变化，纯展示层）；版本号不动，CHANGELOG 用 `## [Unreleased]`。
7. 硬边界提醒不变：`dist/` 与 `*.generated.js` 勿手改；contract 投射文本不能含 `}`；types 名单锁第二份副本在 `tests/cli.test.js`；所有提交留本地不 push。

## 第 6 轮（2026-10-07）

### 本轮完成

- **选题**：NEXT_STEPS 交接首位建议——造数线 `timestamp` 偏移/格式化 + 标准 `uuid` 类型。选题理由：`timestamp` 此前只输出裸 `Date.now()`、`uuidHex` 只有无连字符形态，模板层又没有任何字符串变换能力，导致两类最高频造数需求（时间窗参数、UUID 业务主键）在 DSL 内**无法表达**，AI 接入者只能写死值或退到外部脚本拼值。同属造数线、共享全部触点，按一条主题做一轮（吸取 R5 三题并轮教训，未再混入 diff 视图等其他方向）。
- **改动**（3 个原子提交：`77c2b1d` feat → `c72e0b8` build → docs）：
  1. **feat(dsl)**：`timestamp` 新增可选 `offset`（数字+单位 `ms/s/m/h/d/w`，正负号可选；只含固定跨度，不引入月/年日历单位）、`unit`（`ms` 默认向后兼容 / `s` 秒级数值）、`format`（本地时间 token `YYYY/MM/DD/HH/mm/ss` 输出字符串，与 `unit` 互斥；残缺 token 片段如 `Y-M-D` 与无 token 的 format 直接报错不静默输出字面量）；新增 `uuid` 类型（带连字符 UUID v4，`uuidHex` 形态不变）。contractVersion **4→5**（只追加不改旧字段，types 名单尾部追加 `uuid`）。
  2. 浏览器工作台 `browser/ui/runtime.js` 同口径镜像（timestamp/uuid 分支 + `parseTimestampOffset`/`formatTimestamp` 助手，沿用该文件 ES5 风格与既有重复实现惯例——idcard/luhn/phone/uscc 本就只在 Node engine 实现，parity 测试不覆盖 generatedVars，浏览器侧本轮对齐到 timestamp/uuidHex/md5/signature+uuid 集合）。
  3. 投射同步：`generate-dts.mjs` 的 `GeneratedVarDefinition` 补 `offset?`/`unit?: "ms" | "s"`/`format?`；`init-templates.js` AI 提示词与场景模式两处补时间窗/UUID 造数指引（含「禁止写死时间戳/日期字符串」负向规则）；`contract.test.js` 与 `cli.test.js` 的 types 名单锁定断言同步（后者是本轮跑 check 才暴露的第二份名单，一致性锁起效）。
- **测试 +5（全在 engine.test.js idcard 段后）**：六单位偏移极性（容差 2s，误忽略/误解析 offset 必偏差偏移量本身而失败）；秒粒度数量级（`sVar*1000 ≈ now`，误按毫秒输出偏差 1000 倍）；format 字符串正则 + 解析回本地时间 `≈ now-7d`（误输出数值、误用 UTC token 均失败——注：UTC 时区机器上 UTC 判别不生效，仅数值判别恒成立）；非法 offset/unit/format 与 format+unit 互斥共 7 条 rejects；uuid/uuidHex 形态互斥锁定（两个类型不可互相误实现）。
- **验证**：`npm run check` 两次运行（第一次暴露 cli.test.js:318 名单未同步，修正后）**195/195 全绿**（190 基线 + 5）。工作区干净（仅 `docs/OPTIMIZATION_BRIEF.md` 的 CRLF 幻影改动，见遗留 1）。全部提交留本地未 push。

### 本轮遗留事项

1. **`docs/OPTIMIZATION_BRIEF.md` 存在 CRLF 幻影改动**（`git status` 显示 M 但 `git diff` 与 `git diff --ignore-cr-at-eol` 均为空，内容与 HEAD 完全一致；非本轮所为，本轮开始前已在工作区）。未纳入任何提交，建议人工 `git checkout -- docs/OPTIMIZATION_BRIEF.md` 或统一仓库 EOL 策略后消除。
2. **取证计数（最严口径如实上报）**：宪法恢复（brief/NEXT_STEPS/git log）3 + 契约/引擎/浏览器副本/测试落点/dts 投射/文档提及取证 7 + check 首跑（暴露 cli.test 名单）与验收终验 2 + cli.test 接缝读取 1 + brief 幻影改动排查（diff×2）2 = **15 次，恰在软闸 ≤15 内**；总动作 27 ≤ 40。两次 check 均为必需（首跑暴露第二份名单锁、终验为宪法验收动作），无冗余复跑。
3. **`npm run test:browser` 未跑**（宪法验收口径为 `npm run check`；浏览器侧改动为纯镜像、沿用既有模式，无 DOM 交互变化）。发布前按惯例应补跑一次。
4. `docs/AI_SCENARIO_PROMPT.md` / `README.md` 的既有遗留（headers 大小写说明核对等）原样继承；本轮 grep 确认两文件均未提及 generatedVars/uuidHex/timestamp，无本轮需同步的文档面。
5. **时间冻结类测试未做**：format/offset 测试用容差断言而非假时钟，秒边界抖动理论存在但容差（2s/5s）覆盖；若未来出现 flaky 再引入注入时钟。
6. 若再加轮，价值排序建议：**CLI 失败 diff 视图**（expected vs actual 结构化并排对比，R5 遗留候选仍有效）> Markdown 报告围栏转义小修（响应体含 ``` 破坏围栏）> 枚举随机（带权重）造数。
7. 全绿基线现为 **195/195**；contractVersion 现为 **5**（发版时 CHANGELOG 中「4 → 5」表述随定版落档）。

### 硬边界提醒（若继续迭代）

- `dist/` 与 `*.generated.js` 勿手改，改源后 `npm run check`（含 build）再生，提交时一并 add（本轮 6 个 dist 产物已随 build 提交核对，无 tailwind 变化——未新增 class 名）。
- contract 操作符/类型 description 与 note 文本不能含 `}` 字符；新增能力才递增 `contractVersion`（行为修正勿递增，参考 R4 决策）；**types 名单锁存在第二份副本在 `tests/cli.test.js`（capabilities JSON 断言）**，改 `generatedVars.types` 需两处同步。
- 版本号不动，CHANGELOG 只用 `## [Unreleased]`；所有提交留本地，不 push，由人工统一过目后决定。
