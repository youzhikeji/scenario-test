# scenario-test 示例索引

scenario-test 提供了多个示例帮助您快速上手。

## 📚 示例列表

### 1. Basic - 基础示例
**路径**: `examples/basic/`

**适合**: 初学者

**内容**:
- 健康检查 (health.js)
- 慢响应处理 (slow.js)
- 清理操作 (cleanup.js)

**学习时间**: 10 分钟

---

### 2. Complete - 完整示例 ⭐
**路径**: `examples/complete/`

**适合**: 需要完整功能演示的用户

**内容**:
- 手动登录与认证 (manual-login.js)
- 重试和条件跳过 (retry-and-condition.js)
- Mock API 服务器 (mock-server.cjs)

**特色**:
- ✅ 浏览器和 CLI 共用配置
- ✅ 完整的 Mock API
- ✅ 认证流程演示

**学习时间**: 30 分钟

---

### 3. XLSX Adapter - Excel 操作示例 ⭐⭐⭐
**路径**: `examples/xlsx-adapter/`

**适合**: 需要生成 Excel 报表的用户

**内容**:
- 销售报表生成 (sales-report.js)
- 用户列表导出 (user-list.js)
- Excel 模板使用

**功能**:
- ✅ 使用模板生成报表
- ✅ 动态数据填充
- ✅ 变量和响应数据引用
- ✅ 安全路径验证（v0.3.0）

**学习时间**: 20 分钟

**相关文档**: [XLSX 适配器 README](xlsx-adapter/README.md)

---

### 4. Security Best Practices - 安全最佳实践 ⭐⭐⭐
**路径**: `examples/security-best-practices/`

**适合**: 所有用户（必读）

**内容**:
- 安全的认证方式 (secure-auth.js)
- 安全的文件路径 (safe-paths.js)
- 错误处理 (error-handling.js)

**功能**:
- ✅ 环境变量使用
- ✅ 路径安全验证
- ✅ 错误信息遮蔽
- ✅ 重试超时保护

**重要性**: ⭐⭐⭐⭐⭐ v0.3.0 核心改进

**学习时间**: 15 分钟

**相关文档**: [安全指南](../SECURITY.md)

---

## 🎯 按使用场景选择示例

### 我想快速上手
→ 查看 **Basic** 示例

### 我需要了解完整功能
→ 查看 **Complete** 示例

### 我需要生成 Excel 报表
→ 查看 **XLSX Adapter** 示例

### 我想了解安全最佳实践
→ 查看 **Security Best Practices** 示例（推荐所有用户阅读）

### 我想了解文件上传/下载
→ 查看 **File Operations** 示例（即将添加）

### 我想编写自定义插件
→ 查看 **Custom Plugin** 示例（即将添加）

---

## 🚀 快速开始

### 1. 克隆项目
```bash
# 内部开发仓库（GitLab）；对外用户无需克隆源码，直接走 AI 安装 Prompt / GitHub Release
git clone http://192.168.1.239/zhangqianfeng/scenario-test.git
cd scenario-test
```

### 2. 安装依赖
```bash
npm install
```

### 3. 构建项目
```bash
npm run build
```

### 4. 运行示例

**运行所有示例**:
```bash
# Basic 示例
node dist/scenario-test-cli.cjs --config examples/basic/scenario.config.js --all

# Complete 示例（需要先启动 Mock 服务器）
node examples/complete/mock-server.cjs
# 新终端
node dist/scenario-test-cli.cjs --config examples/complete/scenario.config.js --all

# XLSX 示例
node dist/scenario-test-cli.cjs --config examples/xlsx-adapter/scenario.config.js --all

# 安全示例
export SCENARIO_AUTH="Bearer demo-token"
export DEMO_API_KEY="demo-key"
export DEMO_API_SECRET="demo-secret"
node dist/scenario-test-cli.cjs --config examples/security-best-practices/scenario.config.js --all
```

---

## 📖 学习路径

### 初级（1 小时）
1. ✅ Basic 示例 - 了解基础概念
2. ✅ Complete 示例 - 理解完整流程
3. ✅ Security 示例 - 学习安全实践

### 中级（2 小时）
4. ✅ XLSX Adapter - 掌握 Excel 操作
5. ✅ 阅读 [README.md](../README.md) - 完整 API 文档
6. ✅ 阅读 [CHANGELOG.md](../CHANGELOG.md) - 了解版本变化

### 高级（3+ 小时）
7. ✅ 编写自定义场景
8. ✅ 开发自定义插件
9. ✅ 集成到 CI/CD

---

## 🆕 v0.3.0 新增内容

### 示例更新
- ✅ **XLSX Adapter** 示例（新增）
- ✅ **Security Best Practices** 示例（新增）

### 安全改进
- ✅ 环境变量授权（`SCENARIO_AUTH`）
- ✅ 路径遍历防护
- ✅ 插件安全验证
- ✅ 错误信息遮蔽

### 文档更新
- ✅ [SECURITY.md](../SECURITY.md) - 安全指南
- ✅ [CHANGELOG.md](../CHANGELOG.md) - 变更日志

---

## 📂 示例目录结构

```
examples/
├── basic/                          # 基础示例
│   ├── scenarios/
│   ├── scenario.config.js
│   └── index.html
│
├── complete/                       # 完整示例
│   ├── scenarios/
│   ├── mock-server.cjs
│   ├── scenario.config.js
│   ├── index.html
│   └── README.md
│
├── xlsx-adapter/                   # Excel 操作（新增 v0.3.0）
│   ├── templates/
│   ├── scenarios/
│   ├── scenario.config.js
│   └── README.md
│
├── security-best-practices/        # 安全实践（新增 v0.3.0）
│   ├── scenarios/
│   ├── scenario.config.js
│   ├── .env.example
│   └── README.md
│
└── EXAMPLES_INDEX.md              # 本文件
```

---

## 💡 常见问题

### Q: 示例需要外网访问吗？
**A**: 不需要。`complete` 示例提供了本地 Mock 服务器，其他示例也可以离线运行。

### Q: 示例可以直接用于生产吗？
**A**: 示例仅供学习参考。生产环境需要：
- 替换真实的 API 地址
- 使用真实的凭据（通过环境变量）
- 增加错误处理
- 添加监控和日志

### Q: 如何修改示例？
**A**: 
1. 复制示例到新目录
2. 修改配置文件和场景
3. 根据需要调整

### Q: 示例运行失败怎么办？
**A**: 
1. 检查是否已执行 `npm install` 和 `npm run build`
2. 查看错误消息中的提示
3. 检查环境变量是否设置正确
4. 参考示例的 README.md

---

## 🔗 相关链接

- [主文档](../README.md)
- [安全指南](../SECURITY.md)
- [变更日志](../CHANGELOG.md)
- [API 文档](../docs/)

---

## 🤝 贡献示例

欢迎贡献新的示例！

**建议的示例主题**:
- 文件上传/下载
- 自定义插件开发
- 高级断言
- 数据驱动测试
- 错误处理模式
- CI/CD 集成

**示例要求**:
- 完整可运行
- 有详细的 README.md
- 代码注释清晰
- 遵循安全最佳实践

---

## 📊 示例完整度

| 功能 | 示例覆盖 | 状态 |
|------|----------|------|
| 基础请求 | ✅ Basic | 完成 |
| 认证流程 | ✅ Complete | 完成 |
| 重试机制 | ✅ Complete | 完成 |
| 条件跳过 | ✅ Complete | 完成 |
| Excel 操作 | ✅ XLSX Adapter | 完成 |
| 安全实践 | ✅ Security | 完成 |
| 文件上传 | ⏳ 计划中 | 待补充 |
| 自定义插件 | ⏳ 计划中 | 待补充 |
| 高级断言 | ⏳ 计划中 | 待补充 |

---

**更新时间**: 2026-08-10  
**版本**: v0.5.0

> 内部说明：上文的 `git clone http://192.168.1.239/...` 是团队内网 GitLab 地址，仅适用于内部开发；对外正式安装渠道是 GitHub Release（https://github.com/youzhikeji/scenario-test/releases），见 [README](../README.md) 的“AI 安装 Prompt”。
