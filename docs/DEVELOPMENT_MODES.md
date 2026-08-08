# scenario-test 开发模式指南

## 🎯 三种开发模式

### 模式 1: 纯命令行开发 ⭐⭐⭐⭐⭐（推荐）

**适合**：快速迭代、CI/CD、不需要可视化界面

**步骤**：
```bash
# 1. 编写配置
vim scenario.config.js

# 2. 编写场景
vim scenarios/test.js

# 3. 直接运行
node dist/scenario-test-cli.cjs --config scenario.config.js --all
```

**是否需要服务器**：❌ **不需要**

**优点**：
- ✅ 最快速度
- ✅ 无需浏览器
- ✅ 适合自动化

---

### 模式 2: 浏览器独立模式 ⭐⭐⭐⭐（推荐初学者）

**适合**：需要可视化、不想敲命令

**步骤**：
```bash
# 1. 双击打开 index.standalone.html

# 2. 在浏览器中选择场景并运行

# 3. 修改配置/场景文件

# 4. 刷新浏览器（F5）
```

**是否需要服务器**：❌ **不需要**

**文件**：
- `examples/*/index.standalone.html` - 可以直接打开

**优点**：
- ✅ 无需命令行
- ✅ 双击即用
- ✅ 适合演示

---

### 模式 3: 浏览器服务器模式 ⭐⭐⭐（标准开发）

**适合**：团队开发、标准流程

**步骤**：
```bash
# 1. 启动服务器（只需一次）
node dist/scenario-test-cli.cjs serve \
  --config scenario.config.js \
  --port 4300

# 2. 打开浏览器
# http://127.0.0.1:4300/

# 3. 修改配置/场景

# 4. 刷新浏览器
```

**是否需要服务器**：✅ **需要**

**文件**：
- `examples/*/index.html` - 需要服务器

**优点**：
- ✅ 符合标准
- ✅ 路径干净
- ✅ 支持热更新（未来）

---

## 📊 对比表格

| 模式 | 需要服务器 | 需要浏览器 | 速度 | 适合场景 |
|------|-----------|-----------|------|----------|
| **命令行** | ❌ | ❌ | ⚡⚡⚡ | 快速测试、CI/CD |
| **独立 HTML** | ❌ | ✅ | ⚡⚡ | 演示、学习 |
| **服务器模式** | ✅ | ✅ | ⚡ | 标准开发 |

---

## 💡 推荐选择

### 如果你是...

**API 测试人员**：
→ 使用**命令行模式**
```bash
node dist/scenario-test-cli.cjs --config config.js --all
```

**初学者/演示**：
→ 使用**独立 HTML 模式**
```bash
start examples/basic/index.standalone.html
```

**前端开发者**：
→ 使用**服务器模式**
```bash
node dist/scenario-test-cli.cjs serve --config config.js
```

---

## 🎯 最佳实践

### 开发流程

```bash
# 阶段 1: 快速开发（命令行）
# 写配置 → 运行 → 修改 → 运行
node dist/scenario-test-cli.cjs --config config.js --all

# 阶段 2: 调试（浏览器）
# 需要看详细日志时才启动
node dist/scenario-test-cli.cjs serve --config config.js
# 或直接打开 index.standalone.html

# 阶段 3: 集成（CI/CD）
# 回到命令行模式
npm run test
```

---

## 🔧 快速命令

### 命令行开发
```bash
# 运行所有场景
node dist/scenario-test-cli.cjs --config scenario.config.js --all

# 运行单个场景
node dist/scenario-test-cli.cjs --config scenario.config.js --scenario test

# 指定环境
node dist/scenario-test-cli.cjs --config scenario.config.js --env prod --all
```

### 浏览器开发（独立模式）
```bash
# Windows
start examples/basic/index.standalone.html

# Linux/Mac
open examples/basic/index.standalone.html
```

### 浏览器开发（服务器模式）
```bash
# 启动服务器
node dist/scenario-test-cli.cjs serve --config config.js --port 4300

# 停止服务器
Ctrl + C
```

---

## 📝 总结

### **不一定需要启动服务器！**

- **70% 的开发场景**：只需命令行 ❌
- **20% 的开发场景**：独立 HTML ❌
- **10% 的开发场景**：服务器模式 ✅

**建议**：
1. 日常开发：用命令行
2. 需要调试：用独立 HTML
3. 团队协作：用服务器模式

**最简单的开始**：
```bash
node dist/scenario-test-cli.cjs --config examples/basic/scenario.config.js --all
```

无需服务器，无需浏览器，直接看结果！
