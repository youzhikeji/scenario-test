# AI 业务功能场景生成规则（仓库预览）

本文件是场景生成规则的仓库预览，供维护者评审。业务用户不要直接复制本文件：先使用 [AI 接入 Prompt](AI_INSTALL_PROMPT.md)，新项目会在 `scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md` 生成与安装版本匹配的规则。安装会话中的 AI 会自动读取实际生成的文件。

如果安装会话已经关闭，只需在业务项目的新会话中要求 AI 读取项目内的 Prompt，并提供一个明确业务功能及其页面、Controller、接口或已有测试入口。下面内容不负责安装、升级、构建、启动服务或调用业务接口。

```text
请针对用户本次指定的一个业务功能生成 scenario-test 场景用例，场景目录为 scenario-test。若用户尚未明确业务功能，先询问功能名称及可定位的代码、页面或接口入口；得到答复前不扫描整个项目、不创建场景文件。

先阅读 scenario-test/README.md、scenario-test/.scenario-test/SCENARIO_PATTERNS.md、scenario-test/scenario.config.js、已有 scenarios/，再分析与目标功能直接相关的 Controller、OpenAPI/Swagger、前端 API 调用、接口文档和已有自动化测试。不要猜测接口路径、字段、认证方式、响应结构、状态枚举、请求枚举或错误响应字段；找不到依据时列出待确认项。场景模式库只提供步骤组合，SUCCESS、PDF、pdf、错误码等示例值都不能作为项目默认值，也不能改一种大小写后使用。

按以下要求实施：

1. 只处理本次指定的一个业务功能。先给出功能卡片：功能目标、参与角色、触发入口、前置条件、关键业务规则、状态变化、直接相关接口、测试数据与清理条件；再给出该功能的场景矩阵，列明每个场景的验证目标、前置条件、步骤、预期结果和是否写数据。无法确认的内容列为待确认项，不得扩展到相邻功能。
2. 业务功能是设计边界，场景是该功能下的一条独立验证路径。按证据覆盖成功路径、业务规则/参数校验、权限、边界值、重复操作或幂等、合法与非法状态流转；没有证据的类别不生成。一个场景可以包含准备、执行、查询验证和精确清理等多个 HTTP 步骤，但这些步骤只服务于目标功能，不把多个业务功能串成一个大场景。认证等公共前置只作为准备步骤，不改变场景归属。
3. 在 scenario-test/scenario.config.js 维护 envs、vars、variables 和 scenarios：
   - 私有项目允许在 vars 放默认联调凭据。
   - variables 只声明页面标签、required 和可选 env 映射，不重复写 vars 值。
   - 每个 scenarios 条目必须有稳定 id、name、url，并与 registerScenario 的 id 一致。建议按 `scenarios/<功能标识>/<验证路径>.js` 组织文件，id 使用 `<功能标识>-<验证路径>`，name 使用 `功能名 / 验证路径`；运行时仍保持扁平场景清单。
   - 源码能确认请求字段但不能确认必填取值时，在 vars 中留空并在 variables 中声明 required: true；场景引用该变量，禁止写猜测值或测试标记。
4. 场景文件必须使用以下格式，不使用 window 全局格式：

   ScenarioTest.registerScenario("order-create-success", ScenarioTest.defineScenario({
       name: "订单创建 / 成功",
       vars: { orderId: "" },
       steps: []
   }));

5. 每一步都写 name、method、path、status，并为关键业务结果添加 assertions。需要将响应供后续步骤使用时，通过 extract 写入 vars，并用 {{vars.name}} 引用。不要把上一步返回的 ID、Token 或时间戳写死。
6. 认证是项目自己的普通步骤：
   - 已能从代码或文档确定登录接口时，先请求登录、extract Token，再在后续步骤的 request.headers 或 request.body 中显式引用。
   - 无法确定认证方式时，只在 variables 中声明所需变量，并在场景步骤中引用；不要虚构登录流程或框架级认证配置。
   - 浏览器 Cookie 会话必须有项目证据并显式使用 `request.credentials: "include"`；Node CLI 当前不提供自动 Cookie Jar。
7. 写入类场景必须使用可识别测试标记，例如 scenario-{{vars.runNo}}。如果能从代码确认安全的清理条件，则在最后添加清理步骤；清理必须按测试标记或刚 extract 的 ID 精确定位，并使用 when 防止空值删除。无法确认安全清理方式时，不生成删除步骤，明确标记待人工确认。
8. 默认 failurePolicy 保持 stop。不同验证目标拆成独立场景；只有同一验证路径确实需要继续收集后续步骤结果时才显式设置 continue。只有完成状态字段和终态值都有证据时才使用 retryUntil，且 assertions 必须比较该终态；禁止 retryUntil 只配 exists。完成状态未知时最多生成一次状态查询。不要用固定 sleep。
9. 错误响应体没有代码、文档或既有测试依据时，只断言已确认的 HTTP status，不猜测或断言 code、message、error 等字段存在。
10. 不把真实生产地址、真实个人数据、非测试凭据、固定 Token 或项目外部依赖写入公共示例。不要修改业务代码、构建配置、公共 scenario-test 运行时或已有场景的语义。
11. 落盘后逐文件自检：不得出现无证据的 SUCCESS、PDF、pdf、错误字段断言或 retryUntil + exists；所有外部输入变量必须在配置中声明，场景 vars 只保存测试标记、提取结果或内部状态。发现违规必须先修正再报告。
12. 最后输出：本次目标业务功能、新增/修改的场景文件、场景矩阵、仍待确认的业务规则、接口或测试数据条件，以及每个场景的本地运行命令。不要实际执行场景。
```

## 生成标准

- 一次只针对一个业务功能设计场景，不按整个项目或 Controller 批量铺开。
- 先基于真实业务规则形成该功能的场景矩阵，再分别覆盖有证据的成功、校验、权限、边界、幂等和状态流转路径。
- 每个场景应可独立运行，不能依赖同功能下其他场景或上一次运行留下的 ID、Token 或数据。
- 场景内可用 `extract` 串联准备、执行与验证步骤，用 `when` 保护可选清理，用 `retryUntil` 等待最终一致性；这些步骤都必须服务于同一目标功能。
- 接口存在不同认证方式时，分别在对应步骤里写 Header、Query 或 Body 引用，不要抽象成框架内置登录能力。

## 能力真相

本文件与 `SCENARIO_PATTERNS.md`、README 中的 DSL 能力名单由 `src/contract.js` 投影生成。
需要核对操作符、when 来源、保留变量、extract 语义时，以当前版本 CLI 的实际输出为准：

```powershell
npx @youzhikeji/scenario-test capabilities          # 人类文本
npx @youzhikeji/scenario-test capabilities --json   # 机器可读
```

不要依据旧版本文档或记忆手抄操作符名单。
