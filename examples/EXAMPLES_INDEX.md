# scenario-test 示例索引

本目录提供可独立阅读和运行的场景示例。业务项目接入请从根目录 [README](../README.md) 的“快速接入”开始，不需要复制示例目录。

## 业务项目快速开始

默认采用免 npm 接入，不修改业务项目依赖：

1. 在业务项目根目录打开 AI，将根目录 [README](../README.md) “快速接入”中的 AI 接入 Prompt 全文复制给它。
2. AI 运行官方安装脚本，完成运行时下载、`init` 和 `doctor` 体检。
3. 回答 AI 提出的业务功能问题，并提供页面、Controller、接口或已有测试入口。
4. AI 生成场景后，双击 `scenario-test/start-scenario-test.cmd` 调试。

项目内生成的 `scenario-test/.scenario-test/AI_SCENARIO_PROMPT.md` 是后续场景设计规则，用户不需要再次复制。npm 仅在用户明确要求时作为可选安装方式；两种方式不混用、不自动切换。

## 示例列表

### Basic：基础请求

路径：[`examples/basic/`](basic/)

覆盖：

- 健康检查；
- 慢响应处理；
- 清理操作；
- 最小 `scenario.config.js` 与浏览器入口。

适合首次了解配置、场景注册和基础断言。

### Complete：完整流程

路径：[`examples/complete/`](complete/)

覆盖：

- 本地 Mock API；
- 手动登录、Token 提取与后续认证；
- 重试和条件跳过；
- 浏览器工作台与 CLI 共用配置。

详细步骤见 [完整示例说明](complete/README.md)。

### Security Best Practices：安全实践

路径：[`examples/security-best-practices/`](security-best-practices/)

覆盖：

- 使用环境变量提供凭据；
- 路径安全校验；
- 错误信息遮蔽；
- 重试超时保护。

使用前请阅读 [安全指南](../SECURITY.md)。

## 运行仓库内示例

仓库示例使用本地构建产物，适合公共库维护者。先按 [发布与构建说明](../docs/RELEASING.md) 完成依赖安装和构建。

```powershell
# Basic
node .\dist\scenario-test-cli.cjs `
  --config .\examples\basic\scenario.config.js --all

# Complete：先在一个终端启动 Mock API
node .\examples\complete\mock-server.cjs

# 再在另一个终端执行场景
node .\dist\scenario-test-cli.cjs `
  --config .\examples\complete\scenario.config.js --all
```

安全示例需要先提供演示环境变量，禁止填入生产凭据：

```powershell
$env:SCENARIO_AUTH = "Bearer demo-token"
$env:DEMO_API_KEY = "demo-key"
$env:DEMO_API_SECRET = "demo-secret"
node .\dist\scenario-test-cli.cjs `
  --config .\examples\security-best-practices\scenario.config.js --all
```

## 如何选择

| 目标 | 示例 |
| --- | --- |
| 了解最小配置和基础请求 | Basic |
| 查看认证、多步骤编排和重试 | Complete |
| 检查凭据、路径与错误处理 | Security Best Practices |

示例仅用于学习，不能直接作为生产测试配置。复制到业务项目后，需要重新确认环境地址、认证方式、请求字段、响应结构、测试数据和清理条件。

## 贡献示例

新增示例应满足：

- 可以独立运行；
- 不依赖生产服务或真实凭据；
- 提供最小 README 和明确运行命令；
- 场景、配置和注册 id 保持一致；
- 遵循 [安全指南](../SECURITY.md)；
- 不增加“即将支持”但没有实现的占位内容。

## 相关文档

- [主文档（含 AI 接入 Prompt）](../README.md)
- [场景规则预览](../docs/AI_SCENARIO_PROMPT.md)
- [安全指南](../SECURITY.md)
- [变更日志](../CHANGELOG.md)
- [发布流程](../docs/RELEASING.md)

当前版本：v0.5.17