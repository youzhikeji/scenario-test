# 完整示例

此示例展示浏览器工作台和 CLI 共用一套配置、场景与步骤 DSL。认证保持为普通步骤：登录响应提取到 `vars.sessionToken`，后续业务请求显式引用该变量。

## 启动 Mock API

```powershell
node .\examples\complete\mock-server.cjs
```

Mock API 监听 `http://127.0.0.1:4310`，不访问外网或业务系统。

## 浏览器工作台

另开一个终端：

```powershell
node .\dist\scenario-test-cli.cjs serve `
  --config .\examples\complete\scenario.config.js `
  --port 4300
```

访问 `http://127.0.0.1:4300/`。浏览器工作台必须通过上面的 `serve` 命令启动，请勿直接打开 `index.html`。

## CLI

```powershell
node .\dist\scenario-test-cli.cjs `
  --config .\examples\complete\scenario.config.js `
  --env mock --all
```

`manual-login.js` 演示用户自定义登录步骤；它不是框架内置认证能力。登录后提取的变量只在本次场景运行中有效，避免把示例凭据写入本地配置。

## 给 AI 一键安装

在**业务项目根目录**打开 AI 助手，将根目录 [README](../../README.md) “快速接入”中的 AI 接入 Prompt 全文复制给 AI，AI 会自动完成 CLI 下载、`init` 初始化与 `doctor` 体检，然后只询问你要测试的业务功能。全程不需要克隆本仓库、执行 `npm install` 或学习 DSL。
