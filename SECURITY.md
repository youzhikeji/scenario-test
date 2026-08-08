# scenario-test 安全指南

## ⚠️ 重要安全警告

### 场景文件是可执行代码

**风险**: 场景配置文件和场景定义文件使用 `vm.runInContext` 在 Node.js 中执行。虽然有上下文隔离，但**不是安全沙箱**。

**影响**:
- 场景文件可以访问文件系统（读写任意文件）
- 场景文件可以发起网络请求
- 场景文件可以访问环境变量（包括敏感凭据）

**最佳实践**:
1. ✅ **只加载信任的场景文件**
2. ✅ **审查所有场景文件的来源**
3. ✅ **使用代码审查流程验证新场景**
4. ❌ **不要从公共来源直接下载未审查的场景**
5. ❌ **不要让终端用户上传场景文件**

---

## 🔒 安全改进 (v0.3.0)

### 1. 路径遍历防护

**问题**: 旧版本允许通过 `..` 访问工作区外的文件。

**修复**: 所有文件操作现在都经过路径验证。

```javascript
// ❌ 旧版本 - 不安全
{
  prepareXlsx: {
    template: "../../../etc/passwd"  // 可以读取系统文件
  }
}

// ✅ 新版本 - 安全
// 抛出错误: "Excel 模板路径不安全: ../../../etc/passwd"
```

### 2. 环境变量授权

**问题**: `--authorization` 参数在进程列表中可见。

**修复**: 推荐使用环境变量。

```bash
# ❌ 旧方式（不推荐，但仍可用）
node scenario-test-cli.cjs --authorization "Bearer token"

# ✅ 新方式（推荐）
export SCENARIO_AUTH="Bearer token"
node scenario-test-cli.cjs --config scenario.config.js
```

### 3. 插件路径限制

**问题**: 可以加载任意路径的插件。

**修复**: 插件必须在配置目录内，或明确允许外部插件。

```javascript
// ✅ 安全：相对路径
{
  plugins: ["./plugins/custom-adapter.js"]
}

// ❌ 需要标志：外部路径
// 需要 --allow-external-plugins
{
  plugins: ["/tmp/external-plugin.js"]
}
```

### 4. 环境变量名遮蔽

**问题**: 错误消息泄露环境变量名。

**修复**: 生产模式不显示环境变量名。

```javascript
// ❌ 旧版本
// 错误: "缺少场景变量 PROD_API_SECRET（映射到 vars.apiSecret）"

// ✅ 新版本（生产模式）
// 错误: "缺少必需的场景变量: vars.apiSecret"
```

开发模式可设置 `SCENARIO_VERBOSE_ERRORS=true` 查看详细信息。

### 5. 不可变 Runtime Vars

**问题**: vars 可能被意外修改。

**修复**: vars 对象现在被冻结。

```javascript
// ✅ 修改会失败
runtime.vars.apiKey = "hacked";  // TypeError in strict mode
```

### 6. 重试超时保护

**问题**: 无限重试可能消耗资源。

**修复**: 添加默认 5 分钟超时和最小间隔。

```javascript
{
  retryUntil: {
    maxAttempts: 10,
    intervalMs: 2000,
    maxElapsedMs: 300000  // 5 分钟（可选）
  }
}
```

---

## 🛡️ 安全最佳实践

### 凭据管理

#### ❌ 不要硬编码凭据

```javascript
// ❌ 危险
{
  vars: {
    apiKey: "AK_1234567890",  // 会提交到 Git
    apiSecret: "SK_9876543210"
  }
}
```

#### ✅ 使用环境变量

```javascript
// ✅ 安全
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

### 文件操作

所有文件路径必须在工作区内：

```javascript
// ✅ 安全
{
  prepareXlsx: {
    template: "templates/report.xlsx",  // 相对路径
    output: "output/result.xlsx"
  }
}

// ❌ 会被拒绝
{
  prepareXlsx: {
    template: "/etc/passwd",           // 绝对路径
    output: "../../../tmp/file.xlsx"   // 路径遍历
  }
}
```

### 插件使用

仅使用可信插件：

```bash
# ✅ 项目内插件
node scenario-test-cli.cjs --config scenario.config.js

# ⚠️ 外部插件（需要明确允许）
node scenario-test-cli.cjs --config scenario.config.js --allow-external-plugins
```

---

## 📝 安全审计清单

在发布/部署前检查：

- [ ] 配置文件中没有硬编码凭据
- [ ] 所有文件路径都是相对路径
- [ ] 使用环境变量传递敏感信息
- [ ] 场景文件已经过代码审查
- [ ] 插件来源可信
- [ ] 示例代码中没有真实的 API 密钥
- [ ] `.env` 文件已加入 `.gitignore`

---

## 🔍 漏洞报告

如果发现安全漏洞，请通过以下方式报告：

1. **不要**在公开 issue 中披露
2. 发送邮件到项目维护者
3. 包含详细的重现步骤
4. 我们会在 48 小时内响应

---

## 📚 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
