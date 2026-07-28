# AI 安装 Prompt

在目标项目根目录打开 AI 助手，将下面内容完整粘贴。它不要求克隆公共库源码，也不安装 npm 依赖。

```text
请在当前项目中安装 scenario-test v0.1.4，不要克隆或下载公共库源码，也不要修改业务代码。

在项目根目录执行以下 PowerShell 逻辑：
1. 从 http://192.168.1.239/zhangqianfeng/scenario-test/-/raw/v0.1.4/dist/scenario-test-cli.cjs 下载 CLI 到系统临时目录的 scenario-test-bootstrap.cjs。
2. 使用 node <临时 CLI 路径> init --project . 初始化当前项目。
3. 确认生成 dev/场景测试/index.html、dev/场景测试/scenario.config.js、dev/场景测试/scenarios/health.js 和 dev/场景测试/scenario-test-cli.cjs。
4. 不覆盖任何已有的项目文件；不要启动服务、调用业务接口或写入真实密钥。
5. 最后只报告生成的文件和后续运行命令。
```

安装完成后，项目内 CLI 的使用方式为：

```powershell
node dev/场景测试/scenario-test-cli.cjs --config dev/场景测试/scenario.config.js --env local --all
```
