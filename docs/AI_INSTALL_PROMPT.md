# AI 安装 Prompt

在目标项目根目录打开 AI 助手，将下面内容完整粘贴。它不要求克隆公共库源码，也不安装 npm 依赖或生成 AI Skill。

```text
请在当前项目根目录安装 scenario-test v0.2.11。目标目录为 scenario-test。

执行要求：
1. 先确认当前目录是项目根目录，且 Node.js 版本不低于 18；不满足时停止并说明原因。
2. 不克隆公共库源码，不执行 npm install，不修改业务代码、构建配置或已有场景文件。
3. 仅从以下固定版本地址下载 CLI 到系统临时目录：
   https://github.com/youzhikeji/scenario-test/releases/download/v0.2.11/scenario-test-cli.cjs
4. 使用 node <临时 CLI 路径> init --project . --dir "scenario-test" 执行初始化；不要传 --force。
5. init 会保留已有文件。检查并报告以下文件是否已创建或已保留：
   - scenario-test/index.html
   - scenario-test/scenario.config.js
   - scenario-test/AI_SCENARIO_PROMPT.md
   - scenario-test/SCENARIO_PATTERNS.md
   - scenario-test/scenario-test.umd.js
   - scenario-test/scenario-test-cli.cjs
   初始 scenarios 清单为空，这是为了避免猜测项目存在健康检查接口。
6. 不启动服务、不调用任何业务接口、不写入 Token、Secret 或真实测试数据。
7. 最后只给出安装结果，以及后续运行命令：
   node scenario-test/scenario-test-cli.cjs --config scenario-test/scenario.config.js --env local --all

如果下载、Node.js 检查或初始化失败，停止后报告具体失败原因，不尝试替代安装方式。
```

安装完成后，项目内 CLI 的使用方式为：

```powershell
node scenario-test/scenario-test-cli.cjs --config scenario-test/scenario.config.js --env local --all
```

将 Prompt 和 `--dir` 中的 `scenario-test` 替换为团队约定的项目内相对目录即可，例如 `dev/场景测试`。不要使用绝对路径或包含 `..` 的路径。

安装完成后，继续使用 [AI 场景生成 Prompt](AI_SCENARIO_PROMPT.md) 生成项目业务用例。
