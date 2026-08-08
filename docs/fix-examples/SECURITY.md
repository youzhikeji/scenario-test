# scenario-test 安全指南

## 概述

`scenario-test` 是一个强大的场景测试库，但在使用时需要注意安全风险。本文档说明了安全考虑事项和最佳实践。

## ⚠️ 重要安全警告

### 1. 场景文件是可执行代码

**风险**: 场景配置文件和场景定义文件使用 `vm.runInContext` 在 Node.js 中执行。虽然有上下文隔离，但**不是安全沙箱**。

**影响**:
- 场景文件可以访问文件系统（读写任意文件）
- 场景文件可以发起网络请求
- 场景文件可以执行系统命令（通过 Node.js API）
- 场景文件可以访问环境变量（包括敏感凭据）

**攻击示例**:
```javascript
// 恶意场景文件
ScenarioTest.registerScenario("malicious", {
    name: "恶意场景",
    steps: []
});

// 场景文件加载时执行（不需要运行步骤）
const fs = require("fs");
fs.writeFileSync("/tmp/pwned", "攻击者控制的内容");
```

**最佳实践**:
1. ✅ **只加载信任的场景文件**
2. ✅ **审查所有场景文件的来源**
3. ✅ **不要从公共仓库直接下载未审查的场景**
4. ✅ **使用代码审查流程验证新场景**
5. ✅ **限制场景目录的写入权限**
6. ❌ **不要让终端用户上传场景文件**

### 2. 插件系统安全

**风险**: `--plugin` 标志允许加载外部 JavaScript 模块。

**当前实现**: 
```javascript
// src/cli.js - 插件加载
const absolutePath = path.isAbsolute(pluginPath) 
    ? pluginPath 
    : path.resolve(configDir, pluginPath);
const imported = await import(pathToFileURL(absolutePath).href);
```

**已知问题**:
- ❌ 可以加载工作区外的任意 JavaScript 文件
- ❌ 没有权限验证或签名检查
- ❌ 插件拥有与主进程相同的权限

**推荐配置**:
```javascript
// scenario.config.js - 安全插件配置
{
    // ✅ 好：相对路径，在项目内
    plugins: ["./plugins/custom-adapter.js"],
    
    // ❌ 危险：绝对路径
    plugins: ["/tmp/malicious-plugin.js"],
    
    // ❌ 危险：路径遍历
    plugins: ["../../../malicious.js"]
}
```

**未来改进** (TODO):
- [ ] 添加插件白名单机制
- [ ] 要求外部插件使用 `--allow-external-plugins` 标志
- [ ] 插件签名验证
- [ ] 限制插件可访问的 API

### 3. 凭据管理

#### 3.1 环境变量暴露

**风险**: 错误消息可能泄露环境变量名称。

**当前问题**:
```javascript
// src/engine.js:69 - 错误消息泄露环境变量名
throw new Error(`缺少场景变量 ${environmentName}（映射到 vars.${name}）`);
// 输出示例: "缺少场景变量 PROD_API_SECRET（映射到 vars.apiSecret）"
```

**修复后**:
```javascript
// 仅显示变量名，不显示环境变量名
throw new Error(`缺少场景变量: vars.${name}`);
```

#### 3.2 命令行参数中的凭据

**风险**: `--authorization` 标志在进程列表中可见。

**问题示例**:
```bash
# ❌ 危险：Token 在进程列表中可见
node scenario-test-cli.cjs --authorization "Bearer secret-token-123"

# 攻击者可以通过 ps 看到
ps aux | grep scenario-test
# 输出: ... --authorization Bearer secret-token-123 ...
```

**修复方案**:
```bash
# ✅ 安全：使用环境变量
export SCENARIO_AUTH="Bearer secret-token-123"
node scenario-test-cli.cjs --config scenario.config.js

# ✅ 安全：从文件读取（.env 文件不应提交到版本控制）
export $(cat .env | xargs)
node scenario-test-cli.cjs --config scenario.config.js
```

#### 3.3 配置文件中的凭据

**风险**: 在 `scenario.config.js` 的 `vars` 中硬编码凭据。

```javascript
// ❌ 危险：硬编码在配置文件中
{
    vars: {
        apiKey: "AK_1234567890abcdef",  // 会提交到 Git
        apiSecret: "SK_9876543210fedcba"
    }
}

// ✅ 安全：从环境变量读取
{
    vars: {
        apiKey: process.env.API_KEY || "",
        apiSecret: process.env.API_SECRET || ""
    },
    variables: [
        { name: "apiKey", label: "API Key", env: "API_KEY", required: true },
        { name: "apiSecret", label: "API Secret", env: "API_SECRET", required: true }
    ]
}
```

## 🛡️ 安全最佳实践

### 1. 路径操作安全

所有文件操作都应该验证路径边界：

```javascript
// ❌ 不安全的文件操作
const filePath = path.resolve(workspace, userInput);
fs.readFileSync(filePath);

// ✅ 安全的文件操作
import { validatePath } from "./utils/path-validator.js";
const filePath = validatePath(workspace, userInput);
fs.readFileSync(filePath);
```

### 2. 输入验证

所有用户输入必须验证：

```javascript
// ✅ 验证场景步骤定义
function validateStep(step) {
    if (step.path && /[\x00-\x1f]/.test(step.path)) {
        throw new Error("路径包含非法控制字符");
    }
    if (step.method && !["GET", "POST", "PUT", "DELETE", "PATCH"].includes(step.method)) {
        throw new Error("无效的 HTTP 方法");
    }
}
```

### 3. 不可变数据结构

防止意外修改共享状态：

```javascript
// ✅ 冻结运行时变量
const runtime = {
    vars: Object.freeze({ ...config.vars, ...options.vars }),
    // ...
};
```

### 4. 错误处理

不要在错误消息中泄露敏感信息：

```javascript
// ❌ 泄露敏感路径
throw new Error(`文件不存在: /home/user/.ssh/id_rsa`);

// ✅ 通用错误消息
throw new Error(`文件不存在: ${path.basename(filePath)}`);
```

## 🔍 安全审计清单

在发布前检查：

- [ ] 所有文件操作都经过路径验证
- [ ] 配置文件中没有硬编码凭据
- [ ] 示例代码中没有真实的 API 密钥
- [ ] 错误消息不泄露敏感信息
- [ ] 依赖项已更新到最新的安全版本
- [ ] 测试覆盖率包括安全测试用例

## 📝 漏洞报告

如果发现安全漏洞，请通过以下方式报告：

1. **不要**在公开 issue 中披露安全漏洞
2. 发送邮件到 [security@example.com]（待更新）
3. 包含详细的重现步骤和影响评估
4. 我们会在 48 小时内响应

## 🔄 安全更新

- **v0.3.0** (计划中): 路径验证、环境变量授权、插件限制
- **v0.2.x**: 基础安全检查（硬编码凭据扫描）

## 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)
- [CWE-78: OS Command Injection](https://cwe.mitre.org/data/definitions/78.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
