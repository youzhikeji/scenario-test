# NEXT_STEPS — 优化迭代交接点

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
