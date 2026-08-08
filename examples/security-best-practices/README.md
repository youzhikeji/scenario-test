# 安全最佳实践示例

本示例展示 scenario-test v0.3.0 的安全改进和最佳实践。

## 🔒 v0.3.0 安全改进

- ✅ 环境变量授权（`SCENARIO_AUTH`）
- ✅ 路径遍历防护
- ✅ 插件路径验证
- ✅ 环境变量名遮蔽
- ✅ 重试超时保护

## 快速开始

### 1. 配置环境变量

```bash
# 创建 .env 文件（不要提交到 Git）
cat > .env << EOF
SCENARIO_AUTH="Bearer your-token-here"
DEMO_API_KEY="ak_demo123456"
DEMO_API_SECRET="sk_demo987654"
EOF

# 加载环境变量
export $(cat .env | xargs)
```

### 2. 运行示例

**方式 1: CLI 运行（推荐）**

```bash
node ../../dist/scenario-test-cli.cjs \
  --config scenario.config.js \
  --all
```

**方式 2: 浏览器运行**

```bash
# 1. 启动开发服务器
node ../../dist/scenario-test-cli.cjs serve \
  --config scenario.config.js \
  --port 4300

# 2. 打开浏览器访问
# http://127.0.0.1:4300/
```

或者直接打开 `index.html` 文件。

**注意**: 浏览器环境无法读取系统环境变量，需要在配置中直接设置 `vars`（仅用于开发测试）。

## 场景说明

### 场景 1: 安全的认证方式 ✅

**推荐做法**：使用环境变量

```javascript
envVars: {
    apiKey: "API_KEY",        // 从环境变量 API_KEY 读取
    apiSecret: "API_SECRET"
}
```

**对比不安全的做法**：

```javascript
// ❌ 不要这样做！
vars: {
    apiKey: "AK_1234567890",     // 硬编码
    apiSecret: "SK_0987654321"   // 会提交到 Git
}
```

### 场景 2: 安全的文件路径 ✅

**v0.3.0 新增路径验证**：

```javascript
// ✅ 安全：相对路径
prepareXlsx: {
    template: "templates/report.xlsx",
    output: "output/result.xlsx"
}

// ❌ 危险：会被拒绝
prepareXlsx: {
    template: "/etc/passwd",           // 绝对路径
    output: "../../../tmp/file.xlsx"   // 路径遍历
}
```

### 场景 3: 插件安全 ✅

**默认行为**：只允许项目内插件

```javascript
nodePlugins: [
    "./plugins/custom.js"   // ✅ 项目内
]
```

**外部插件需要标志**：

```bash
# ❌ 会失败
node cli.cjs --config config.js

# ✅ 需要明确允许
node cli.cjs --config config.js --allow-external-plugins
```

## 安全检查清单

### ✅ 配置文件安全

- [ ] 不要硬编码 API Key
- [ ] 不要硬编码密码
- [ ] 使用 `envVars` 映射环境变量
- [ ] 将 `.env` 加入 `.gitignore`

### ✅ 认证安全

- [ ] 使用 `SCENARIO_AUTH` 环境变量
- [ ] 不要使用 `--authorization` 参数（会暴露在进程列表）
- [ ] Token 应该定期轮换
- [ ] 生产环境使用不同的凭据

### ✅ 文件路径安全

- [ ] 只使用相对路径
- [ ] 不要使用 `../` 遍历
- [ ] 不要使用绝对路径
- [ ] 验证用户输入的路径

### ✅ 插件安全

- [ ] 只使用可信的插件
- [ ] 插件放在项目目录内
- [ ] 审查外部插件代码
- [ ] 使用 `--allow-external-plugins` 时要小心

### ✅ 错误处理安全

- [ ] 生产环境不显示详细错误
- [ ] 不在错误消息中暴露敏感信息
- [ ] 日志中脱敏敏感数据

## 常见安全问题

### ❌ 问题 1: 硬编码凭据

```javascript
// ❌ 不安全
{
    vars: {
        apiKey: "AK_deb71f1234567890",
        apiSecret: "SK_W6HL9876543210"
    }
}
```

**风险**：
- 凭据会提交到 Git
- 所有能访问代码的人都能看到
- 无法轮换（改代码很麻烦）

**修复**：

```javascript
// ✅ 安全
{
    envVars: {
        apiKey: "PROD_API_KEY",
        apiSecret: "PROD_API_SECRET"
    }
}
```

### ❌ 问题 2: 命令行传递 Token

```bash
# ❌ 不安全：Token 会出现在进程列表中
node cli.cjs --authorization "Bearer secret-token-here"
```

**风险**：
- `ps aux` 可以看到
- 命令历史会记录
- 日志可能记录

**修复**：

```bash
# ✅ 安全
export SCENARIO_AUTH="Bearer secret-token-here"
node cli.cjs --config scenario.config.js
```

### ❌ 问题 3: 路径遍历

```javascript
// ❌ 不安全：可以访问系统文件
{
    prepareXlsx: {
        template: "../../../etc/passwd",
        output: "output.xlsx"
    }
}
```

**风险**：
- 读取敏感文件
- 覆盖系统文件
- 权限提升

**修复**：

```javascript
// ✅ 安全：v0.3.0 会自动拒绝
// 只使用项目内的相对路径
{
    prepareXlsx: {
        template: "templates/report.xlsx",
        output: "output/result.xlsx"
    }
}
```

### ❌ 问题 4: 不可信插件

```javascript
// ❌ 危险：加载外部插件
{
    nodePlugins: ["/tmp/downloaded-plugin.js"]
}
```

**风险**：
- 恶意代码执行
- 数据泄露
- 系统被攻击

**修复**：

```javascript
// ✅ 安全方案 1：复制到项目内
// 1. 审查插件代码
// 2. 复制到项目内
{
    nodePlugins: ["./plugins/trusted-plugin.js"]
}

// ✅ 安全方案 2：明确允许外部插件
// 使用 --allow-external-plugins 标志
```

## 环境变量最佳实践

### 1. 创建 .env 文件

```bash
# .env
SCENARIO_AUTH="Bearer prod-token-12345"
PROD_API_KEY="ak_prod_key"
PROD_API_SECRET="sk_prod_secret"
PROD_DATABASE_URL="postgresql://..."
```

### 2. 添加到 .gitignore

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 3. 提供示例文件

```bash
# .env.example
SCENARIO_AUTH="Bearer your-token-here"
PROD_API_KEY="your-api-key"
PROD_API_SECRET="your-api-secret"
```

### 4. 在代码中使用

```javascript
ScenarioTest.defineScenario({
    envVars: {
        authToken: "SCENARIO_AUTH",
        apiKey: "PROD_API_KEY",
        apiSecret: "PROD_API_SECRET"
    }
});
```

## 不同环境的配置

### 开发环境

```javascript
// scenario.config.dev.js
ScenarioTest.defineConfig({
    envs: [
        {
            key: "dev",
            name: "开发环境",
            baseUrl: "http://localhost:3000"
        }
    ],
    envVars: {
        apiKey: "DEV_API_KEY",      // 开发环境变量
        apiSecret: "DEV_API_SECRET"
    }
});
```

### 生产环境

```javascript
// scenario.config.prod.js
ScenarioTest.defineConfig({
    envs: [
        {
            key: "prod",
            name: "生产环境",
            baseUrl: "https://api.example.com"
        }
    ],
    envVars: {
        apiKey: "PROD_API_KEY",      // 生产环境变量
        apiSecret: "PROD_API_SECRET"
    }
});
```

### 使用

```bash
# 开发环境
export DEV_API_KEY="dev_key"
export DEV_API_SECRET="dev_secret"
node cli.cjs --config scenario.config.dev.js --env dev

# 生产环境
export PROD_API_KEY="prod_key"
export PROD_API_SECRET="prod_secret"
node cli.cjs --config scenario.config.prod.js --env prod
```

## CI/CD 集成

### GitHub Actions

```yaml
name: API Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Run Tests
        env:
          SCENARIO_AUTH: ${{ secrets.API_TOKEN }}
          PROD_API_KEY: ${{ secrets.API_KEY }}
          PROD_API_SECRET: ${{ secrets.API_SECRET }}
        run: |
          npm install
          node dist/scenario-test-cli.cjs \
            --config examples/security-best-practices/scenario.config.js \
            --all
```

### GitLab CI

```yaml
test:
  stage: test
  script:
    - npm install
    - |
      node dist/scenario-test-cli.cjs \
        --config examples/security-best-practices/scenario.config.js \
        --all
  variables:
    SCENARIO_AUTH: $API_TOKEN
    PROD_API_KEY: $API_KEY
    PROD_API_SECRET: $API_SECRET
```

## 相关文档

- [SECURITY.md](../../SECURITY.md) - 完整安全指南
- [CHANGELOG.md](../../CHANGELOG.md) - v0.3.0 变更日志
- [路径验证器源码](../../src/utils/path-validator.js)

## 审计和监控

### 定期审查

- [ ] 检查配置文件是否有硬编码凭据
- [ ] 审查插件代码
- [ ] 更新依赖到最新版本
- [ ] 检查 Git 历史是否泄露敏感信息

### 监控建议

- 监控异常的 API 调用
- 记录文件操作日志
- 定期轮换凭据
- 启用访问审计

## 总结

v0.3.0 的安全改进让 scenario-test 更安全：

1. ✅ **环境变量授权** - 不再暴露在命令行
2. ✅ **路径验证** - 防止路径遍历攻击
3. ✅ **插件安全** - 外部插件需要明确允许
4. ✅ **错误遮蔽** - 生产模式不泄露敏感信息

遵循本指南，可以安全地使用 scenario-test！
