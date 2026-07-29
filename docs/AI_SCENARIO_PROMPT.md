# AI 场景生成 Prompt

完成 `scenario-test` 安装后，将下面 Prompt 粘贴给项目 AI 助手。将目录替换为项目实际目录，例如 `dev/场景测试`。

```text
请为当前项目生成 scenario-test 场景用例，场景目录为 scenario-test。

先阅读 scenario-test/README.md、scenario-test/SCENARIO_PATTERNS.md、scenario-test/scenario.config.js、已有 scenarios/，再分析当前项目的 Controller、OpenAPI/Swagger、前端 API 调用、接口文档和已有自动化测试。不要猜测接口路径、字段、认证方式、响应结构、状态枚举、请求枚举或错误响应字段；找不到依据时列出待确认项。场景模式库只提供结构，SUCCESS、PDF、pdf、错误码等示例值都不能作为项目默认值，也不能改一种大小写后使用。

按以下要求实施：

1. 先在回复中给出精简的场景清单：每个场景的业务目标、前置条件、覆盖的接口流和是否写数据。然后直接创建或修改场景文件，不启动服务、不调用接口。
2. 一条场景对应一条完整业务流，而不是一个接口文件。例如“登录后创建并查询订单”“提交后审核并查询状态”。纯查询接口可单独组成只读场景。
3. 在 scenario-test/scenario.config.js 维护 envs、vars、variables 和 scenarios：
   - 私有项目允许在 vars 放默认联调凭据。
   - variables 只声明页面标签、required 和可选 env 映射，不重复写 vars 值。
   - 每个 scenarios 条目必须有稳定 id、name、url，并与 registerScenario 的 id 一致。
   - 源码能确认请求字段但不能确认必填取值时，在 vars 中留空并在 variables 中声明 required: true；场景引用该变量，禁止写猜测值或测试标记。
4. 场景文件必须使用以下格式，不使用 window 全局格式：

   ScenarioTest.registerScenario("order-create-query", ScenarioTest.defineScenario({
       name: "创建并查询订单",
       vars: { orderId: "" },
       steps: []
   }));

5. 每一步都写 name、method、path、status，并为关键业务结果添加 assertions。需要将响应供后续步骤使用时，通过 extract 写入 vars，并用 {{vars.name}} 引用。不要把上一步返回的 ID、Token 或时间戳写死。
6. 认证是项目自己的普通步骤：
   - 已能从代码或文档确定登录接口时，先请求登录、extract Token，再在后续步骤的 request.headers 或 request.body 中显式引用。
   - 无法确定认证方式时，只在 variables 中声明所需变量，并在场景步骤中引用；不要虚构登录流程或框架级认证配置。
7. 写入类场景必须使用可识别测试标记，例如 scenario-{{vars.runNo}}。如果能从代码确认安全的清理条件，则在最后添加清理步骤；清理必须按测试标记或刚 extract 的 ID 精确定位，并使用 when 防止空值删除。无法确认安全清理方式时，不生成删除步骤，明确标记待人工确认。
8. 默认 failurePolicy 保持 stop。只有需要收集多个独立校验失败时才显式设置 continue。只有完成状态字段和终态值都有证据时才使用 retryUntil，且 assertions 必须比较该终态；禁止 retryUntil 只配 exists。完成状态未知时最多生成一次状态查询。不要用固定 sleep。
9. 错误响应体没有代码、文档或既有测试依据时，只断言已确认的 HTTP status，不猜测或断言 code、message、error 等字段存在。
10. 不把真实生产地址、真实个人数据、非测试凭据、固定 Token 或项目外部依赖写入公共示例。不要修改业务代码、构建配置、公共 scenario-test 运行时或已有场景的语义。
11. 落盘后逐文件自检：不得出现无证据的 SUCCESS、PDF、pdf、错误字段断言或 retryUntil + exists；所有外部输入变量必须在配置中声明，场景 vars 只保存测试标记、提取结果或内部状态。发现违规必须先修正再报告。
12. 最后输出：新增/修改的场景文件、每个场景覆盖的流程、仍待确认的接口或测试数据条件，以及本地运行命令。不要实际执行场景。
```

## 生成标准

- 优先覆盖关键只读查询、核心写入业务流、状态流转和失败返回。
- 每个场景应可独立运行，不能依赖上一次场景留下的 ID、Token 或数据。
- 用 `extract` 串联步骤，用 `when` 保护可选清理，用 `retryUntil` 等待最终一致性。
- 接口存在不同认证方式时，分别在对应步骤里写 Header、Query 或 Body 引用，不要抽象成框架内置登录能力。
