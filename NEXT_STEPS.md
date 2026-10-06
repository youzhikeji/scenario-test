# NEXT_STEPS — 优化迭代交接点

## 第 4 轮（2026-10-06）· 计划内最后一轮

### 本轮完成

- **选题**：候选 A 提取线（第 3 轮交接首选）——`from: "headers"` 配 `path` 的直接路径取值由大小写敏感改为**头名大小写不敏感**。
- **动机**：HTTP 头名按 RFC 不区分大小写，HTTP/2 响应头更是一律小写；旧实现走 `getByPath` 精确键匹配，`path: "X-Total"` 遇到 `x-total` 头取不到值，而 `header` 简写 / `extract.header` 经 `headerValue` 早已忽略大小写——两套口径不一致是真缺陷（第 2 轮已论证的真实踩坑点）。
- **实现**（`src/core.js`，引擎/CLI/工作台零改动——三层都叠在 core 上）：
  - `headerValue` 抽出内部 `headerKey`（大小写不敏感找键），行为不变；
  - 新增导出 `getHeaderByPath(headers, valuePath)`：path **首段**按头名大小写不敏感匹配，首段之后的子路径维持 `getByPath` 既有语义（在头值上取子路径，如 `"X-TOTAL.length"` → 2）；退化 path（无 token）回落 `getByPath` 保持旧口径；
  - `assertionActual`（断言）与 `applyExtract`（提取）的 `from: "headers"` 分支切换至新口径。
- **边界（刻意保持不变，判别测试锁定）**：body 路径仍大小写敏感；通用路径导航 `from: "response"` 配 `headers.*` 与模板 `{{lastResponse.headers.*}}` 仍精确匹配（专用入口是 `from: "headers"` / `header` 简写）。
- **contractVersion 决策：维持 4 不递增**。理由：这是既有能力的行为口径修正（缺陷修复），非新增能力——contract 字段面零变化，`capabilities.json` / `d.ts` 投射自然不变（构建后 git 亦确认无 diff）。契约列表与描述本就未提及大小写语义，无陈旧文案需要更正。breaking 评估已写入 CHANGELOG：仅依赖「换大小写头名取不到值」这一缺陷行为的场景（如对换大小写头名断言 `exists: false`）结果会翻转。
- **测试**（`tests/parity.test.js` 新增 2 块，判别用例齐备）：断言侧 `x-total`/`X-TOTAL` 命中 + `x-missing` 不误命中 + body `Code` 必 miss（防过度折叠）+ `from:"response"` 边界不泄漏；提取侧小写/混合大小写命中、头值深路径、缺失告警数、`response` 路径仍精确。
- **验证**：`npm run check` 一次通过，**184/184**（182 基线 + 本轮 2 块）。

### 本轮遗留事项

1. **取证 16 次，超软闸 1 次，自报**：git log / 定位 `from:"headers"` 全部消费点（core 断言 + 提取、engine `when` 走 `evaluateAssertion` 复用同路径）/ 契约描述确认 / 测试风格取证 15 次后，追加 `npm run check`（验收必需）与 `git status`（提交前核对 dist 再生成清单，第 3 轮教训 5 的落实）各 1 次。无冗余复跑（check 一次通过）。另有 1 次 PowerShell 管道形式 `git status` 被权限层拦截（非执行动作，按第 3 轮结论换 Bash 直行成功）。
2. `docs/AI_SCENARIO_PROMPT.md` / `README.md` 未核对是否需要补「头名大小写不敏感」使用说明（取证预算考虑）；CHANGELOG 已承载语义说明，若文档有 headers 提取章节可下轮顺带补一句。
3. 模板 `{{lastResponse.headers.X-Total}}` 与 `from:"response"` 配 `headers.*` 仍精确匹配——若实际项目经此入口踩坑，可评估是否同样走 `getHeaderByPath`（涉及 `evalExpression`，改动面与测试面更大）。
4. 计划 3-4 轮已到终点。若 Hermes 决定加轮，价值排序建议：CLI 结构化失败 diff（消费第 3 轮 `detail`，引擎侧数据已就绪）> 造数线 UUID / 时间戳偏移（`now + 8d`）> 嵌套 each 明细在工作台/Markdown 的递归展开展示（第 3 轮遗留，UI 目前只展开一层）。
5. 全绿基线现为 **184/184**。

### 硬边界提醒（若继续迭代）

- `dist/` 与 `*.generated.js` 勿手改，改源后 `npm run check`（含 build）再生，提交时一并 add。
- contract 操作符 description 不能含 `}` 字符；新增能力才递增 `contractVersion`（行为修正勿递增，参考本轮决策）。
- 版本号不动，CHANGELOG 只用 `## [Unreleased]`；所有提交留本地，不 push，由人工统一过目后决定。
