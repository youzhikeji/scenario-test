# AI 接入 Prompt（只需复制一次）

在目标业务项目根目录打开 AI 助手，将下面内容完整粘贴。默认走**免 npm**：官方安装脚本直接从固定版本下载运行时副本，不修改业务项目依赖；只有用户明确要求使用 npm 时才切换 npm 方式。AI 会完成接入、初始化与体检，然后主动询问要测试的业务功能。用户不需要克隆公共库、学习 DSL 或再次复制场景 Prompt。

```text
请在当前项目根目录接入 @yc_yzkj/scenario-test。目标目录为 scenario-test。

执行要求：
1. 先确认当前目录是项目根目录，且 Node.js 版本不低于 18；不满足时停止并说明原因。
2. 不克隆公共库源码，不修改业务代码、构建配置或已有场景文件；不启动服务、不调用业务接口、不写入 Token、Secret 或真实测试数据。
3. 默认使用免 npm 安装：不要搜索安装地址、GitHub Release 或 npm 最新版本，直接执行官方固定版本脚本（Windows: irm https://cdn.jsdelivr.net/gh/youzhikeji/scenario-test@v0.5.9/scripts/install.ps1 | iex；macOS/Linux: curl -fsSL https://cdn.jsdelivr.net/gh/youzhikeji/scenario-test@v0.5.9/scripts/install.sh | bash -s -- . scenario-test）。脚本从 npm Registry 下载一次固定版本 tarball，在本地解压并初始化；不调用 GitHub API、不执行 npm install、不修改 package.json。
4. 只有用户明确要求使用 npm 时，才切换到 npm 方式：npm install -D @yc_yzkj/scenario-test，再执行 npx @yc_yzkj/scenario-test init --project . --dir "scenario-test"。两种方式不混用、不自动兜底。
   目标目录已存在时选择保留（默认回车）。
5. 运行项目体检确认安装完整：免 npm 模式使用 node scenario-test/.scenario-test/scenario-test-cli.cjs doctor --config scenario-test/scenario.config.js；npm 模式使用 npx @yc_yzkj/scenario-test doctor --config scenario-test/scenario.config.js。有 FAIL 时停止并报告，不继续后续步骤。
6. doctor 通过后，读取刚生成的 scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md，将其作为后续场景设计规则，不要要求用户复制或粘贴。
7. 最后报告采用的安装方式和 doctor 结果，然后只询问：“你要测试哪个业务功能？请提供功能名称，以及页面、Controller、接口或已有测试中的任一入口。”此时不要扫描整个项目、生成场景、启动服务或调用业务接口。
8. 用户回答业务功能后，严格按第 6 步找到的 AI_SCENARIO_PROMPT.md 执行：一次只处理这一个功能；需要环境地址、测试账号、Token、枚举值或测试数据时再集中询问；由你维护 scenario.config.js 和场景文件，最后给出逐个场景的运行命令，但不要实际运行。

如果 Node.js 检查、选定安装方式、初始化或 doctor 任一失败，停止并报告具体原因，不静默切换另一种安装方式。
```

正常情况下，用户只需复制上面的接入 Prompt，然后回答 AI 提出的业务功能和待确认项。若安装会话已关闭，可在业务项目的新会话中直接输入：

```text
请读取 scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md，为“<业务功能名称>”设计场景测试。入口：<页面、Controller、接口或已有测试路径>。
```

团队使用其他目录时，只需在接入 Prompt 中统一替换 `scenario-test` 和 `--dir`，例如 `dev/场景测试`；不要使用绝对路径或包含 `..` 的路径。只有完成某个业务功能的场景生成并配置安全测试数据后，才执行 AI 给出的运行命令。