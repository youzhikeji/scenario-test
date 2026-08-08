# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2026-08-08

### 🔒 Security Fixes (BREAKING CHANGES)

#### CRITICAL
- **路径遍历防护**: 所有文件操作（XLSX 适配器、文件上传、响应保存）现在都验证路径边界，阻止访问工作区外的文件
- **插件路径限制**: 插件必须在配置目录内，外部插件需要 `--allow-external-plugins` 标志
- **vm.runInContext 文档**: 添加安全警告，说明场景文件的执行权限

#### HIGH
- **环境变量授权**: 推荐使用 `SCENARIO_AUTH` 环境变量代替 `--authorization` 参数（命令行参数在进程列表中可见）
- **环境变量名遮蔽**: 生产模式下错误消息不再显示环境变量名，防止信息泄露
- **路径验证工具**: 新增 `src/utils/path-validator.js` 统一路径安全验证

#### MEDIUM
- **不可变 Runtime Vars**: `runtime.vars` 现在被 `Object.freeze()` 冻结，防止意外修改
- **重试超时保护**: 添加默认 5 分钟总超时（`maxElapsedMs`）和最小 100ms 重试间隔

### ⚠️ Breaking Changes

1. **授权方式变更**
   ```bash
   # ❌ 旧方式（已弃用，但仍可用）
   node scenario-test-cli.cjs --authorization "Bearer token"
   
   # ✅ 新方式（推荐）
   export SCENARIO_AUTH="Bearer token"
   node scenario-test-cli.cjs --config scenario.config.js
   ```

2. **插件路径限制**
   ```javascript
   // ✅ 安全：项目内插件
   { plugins: ["./plugins/custom.js"] }
   
   // ❌ 需要标志：外部插件
   // 运行时需要: --allow-external-plugins
   { plugins: ["/tmp/plugin.js"] }
   ```

3. **文件路径验证**
   - 绝对路径现在会被拒绝
   - `..` 路径遍历会被拒绝
   - 所有路径必须在工作区内

### 📝 New Features

- 新增 `--allow-external-plugins` 标志允许加载外部插件
- 环境变量 `SCENARIO_VERBOSE_ERRORS=true` 启用详细错误消息（开发模式）
- 新增 `SECURITY.md` 安全指南文档
- 新增路径验证工具 API: `validatePath()`, `validatePaths()`, `isPathSafe()`

### 🐛 Bug Fixes

- 修复路径遍历安全漏洞（CVE-待分配）
- 修复环境变量名泄露问题
- 修复无限重试可能性

### 📚 Documentation

- 添加 `SECURITY.md` 安全最佳实践
- 更新 CLI 帮助文档
- 更新 README.md 安全章节

### 🧪 Tests

- 新增 `tests/security-fixes.test.js` 安全测试套件
- 路径遍历攻击测试
- 不可变性测试
- 输入验证测试

---

## [0.2.13] - 2026-07-XX

### Features
- 浏览器工作台和 Node.js CLI 双模式
- 声明式 DSL
- AI 安装 Prompt

### Improvements
- 零依赖部署
- 单文件引入

---

## Migration Guide: v0.2.x → v0.3.0

### 1. 授权方式迁移

**影响**: 所有使用 `--authorization` 的脚本

**迁移步骤**:
```bash
# 步骤 1: 创建 .env 文件（不要提交到 Git）
cat > .env << EOF
SCENARIO_AUTH="Bearer your-token-here"
EOF

# 步骤 2: 加入 .gitignore
echo ".env" >> .gitignore

# 步骤 3: 更新运行脚本
# 旧脚本
node scenario-test-cli.cjs --authorization "Bearer token" --all

# 新脚本
export $(cat .env | xargs)
node scenario-test-cli.cjs --all
```

**向后兼容**: `--authorization` 仍然可用，但会显示弃用警告。计划在 v0.4.0 移除。

### 2. 插件路径迁移

**影响**: 使用 `nodePlugins` 的配置

**迁移步骤**:

如果插件已经在项目内：
```javascript
// ✅ 无需修改
{
  nodePlugins: ["./plugins/custom-adapter.js"]
}
```

如果使用外部插件：
```bash
# 选项 1: 复制插件到项目内（推荐）
cp /external/plugin.js ./plugins/

# 选项 2: 使用 --allow-external-plugins 标志
node scenario-test-cli.cjs --allow-external-plugins --all
```

### 3. 文件路径迁移

**影响**: 使用绝对路径或路径遍历的场景

**迁移步骤**:
```javascript
// ❌ 旧方式 - 会报错
{
  prepareXlsx: {
    template: "/absolute/path/template.xlsx",
    output: "../output/result.xlsx"
  }
}

// ✅ 新方式 - 使用相对路径
{
  prepareXlsx: {
    template: "templates/template.xlsx",
    output: "output/result.xlsx"
  }
}
```

### 4. 错误处理更新

**影响**: 解析错误消息的代码

生产环境错误消息格式已更改：
```javascript
// 旧格式
"缺少场景变量 PROD_API_SECRET（映射到 vars.apiSecret）"

// 新格式
"缺少必需的场景变量: vars.apiSecret
提示: 请在配置文件的 vars 中设置该变量，或通过环境变量提供"
```

开发环境可设置 `SCENARIO_VERBOSE_ERRORS=true` 查看详细信息。

---

## Testing the Migration

测试迁移是否成功：

```bash
# 1. 运行安全测试
npm test
node --test tests/security-fixes.test.js

# 2. 测试现有场景
export SCENARIO_AUTH="your-token"
node scenario-test-cli.cjs --config scenario.config.js --all

# 3. 检查是否有弃用警告
# 如果看到警告，按照上述步骤迁移
```

---

## Support

如有迁移问题，请：
1. 查看 `SECURITY.md` 安全指南
2. 提交 GitHub Issue
3. 联系项目维护者
