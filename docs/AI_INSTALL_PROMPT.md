# AI 接入 Prompt（只需复制一次）

在目标业务项目根目录打开 AI 助手，将下面内容完整粘贴。AI 会完成安装和体检，然后主动询问要测试的业务功能；用户不需要克隆公共库、安装 npm 依赖、学习 DSL 或再次复制场景 Prompt。

```text
请在当前项目根目录安装 scenario-test v0.5.3。目标目录为 scenario-test。

执行要求：
1. 先确认当前目录是项目根目录，且 Node.js 版本不低于 18；不满足时停止并说明原因。
2. 不克隆公共库源码，不执行 npm install，不修改业务代码、构建配置或已有场景文件。
3. 仅从以下固定版本地址下载 CLI 到系统临时目录：
   https://github.com/youzhikeji/scenario-test/releases/download/v0.5.3/scenario-test-cli.cjs
4. 使用 node <临时 CLI 路径> init --project . --dir "scenario-test" 执行初始化；不要传 --force。
5. init 会保留已有文件。检查并报告：
   - scenario-test/README.md
   - scenario-test/index.html
   - scenario-test/scenario.config.js
   - scenario-test/.scenario-test/ 内部目录
   新项目根层只保留以上三个入口文件；CLI、浏览器运行时、AI 规则、类型声明、能力清单和版本锁都在内部目录。初始 scenarios 清单为空，避免猜测项目存在健康检查接口。
6. 运行项目体检确认安装完整。新布局使用：
   node scenario-test/.scenario-test/scenario-test-cli.cjs doctor --config scenario-test/scenario.config.js
   如果 init 明确报告“兼容旧版平铺布局”，则使用：
   node scenario-test/scenario-test-cli.cjs doctor --config scenario-test/scenario.config.js
   有 FAIL 时停止并报告，不继续后续步骤。
7. 不启动服务、不调用任何业务接口、不写入 Token、Secret 或真实测试数据。
8. doctor 通过后，读取刚生成的 scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md；兼容旧版平铺布局时读取 scenario-test/AI_SCENARIO_PROMPT.md。将找到的文件作为后续场景设计规则，不要要求用户复制或粘贴。
9. 最后报告安装和 doctor 结果，然后只询问：“你要测试哪个业务功能？请提供功能名称，以及页面、Controller、接口或已有测试中的任一入口。”此时不要扫描整个项目、生成场景、启动服务或调用业务接口。
10. 用户回答业务功能后，严格按第 8 步找到的 AI_SCENARIO_PROMPT.md 执行：一次只处理这一个功能；需要环境地址、测试账号、Token、枚举值或测试数据时再集中询问；由你维护 scenario.config.js 和场景文件，最后给出逐个场景的运行命令，但不要实际运行。

如果下载、Node.js 检查、初始化或 doctor 失败，停止并报告具体原因，不尝试替代安装方式。
```

正常情况下，用户只需复制上面的接入 Prompt，然后回答 AI 提出的业务功能和待确认项。若安装会话已关闭，可在业务项目的新会话中直接输入：

```text
请读取 scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md，为“<业务功能名称>”设计场景测试。入口：<页面、Controller、接口或已有测试路径>。
```

团队使用其他目录时，只需在接入 Prompt 中统一替换 `scenario-test` 和 `--dir`，例如 `dev/场景测试`；不要使用绝对路径或包含 `..` 的路径。只有完成某个业务功能的场景生成并配置安全测试数据后，才执行 AI 给出的运行命令。
