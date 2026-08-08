# 如何在浏览器中查看 scenario-test 示例

## ✅ 当前状态

服务器已启动！可以直接访问了。

---

## 🌐 访问方式

### 方式 1: XLSX 适配器示例（已启动）

**访问地址**:
```
http://127.0.0.1:4300/
```

**在浏览器中打开**：
1. 按 `Ctrl + 点击` 上面的链接
2. 或复制到浏览器地址栏

**你会看到**:
- 场景列表（销售报表、用户列表）
- 可以选择并运行
- 查看执行结果

---

## 📂 查看其他示例

### 1. Basic 示例
```bash
# 停止当前服务器（Ctrl+C）
# 启动 basic 示例
node dist/scenario-test-cli.cjs serve \
  --config examples/basic/scenario.config.js \
  --port 4300

# 访问 http://127.0.0.1:4300/
```

### 2. Complete 示例（需要 Mock 服务器）
```bash
# 终端 1: 启动 Mock API
node examples/complete/mock-server.cjs

# 终端 2: 启动示例服务器
node dist/scenario-test-cli.cjs serve \
  --config examples/complete/scenario.config.js \
  --port 4300

# 访问 http://127.0.0.1:4300/
```

### 3. 安全最佳实践示例
```bash
# 设置环境变量
export SCENARIO_AUTH="Bearer demo-token"
export DEMO_API_KEY="demo-key"
export DEMO_API_SECRET="demo-secret"

# 启动服务器
node dist/scenario-test-cli.cjs serve \
  --config examples/security-best-practices/scenario.config.js \
  --port 4300

# 访问 http://127.0.0.1:4300/
```

---

## 🎮 浏览器操作指南

### 界面说明

当你打开浏览器后，会看到：

```
┌─────────────────────────────────────┐
│  scenario-test                      │
├─────────────────────────────────────┤
│  场景列表:                           │
│  □ 生成销售报表                      │
│  □ 导出用户列表                      │
│                                     │
│  [运行选中的场景]                    │
└─────────────────────────────────────┘
```

### 操作步骤

1. **选择场景**
   - 勾选想要运行的场景

2. **点击运行**
   - 点击"运行选中的场景"按钮

3. **查看结果**
   - 实时显示执行进度
   - 成功/失败状态
   - 响应数据

4. **查看详情**
   - 展开每个步骤
   - 查看请求/响应
   - 查看断言结果

---

## 🔧 常用命令

### 启动服务器
```bash
cd /d/workspace/git/scenario-test

# XLSX 示例
node dist/scenario-test-cli.cjs serve --config examples/xlsx-adapter/scenario.config.js --port 4300

# Basic 示例
node dist/scenario-test-cli.cjs serve --config examples/basic/scenario.config.js --port 4300

# Complete 示例
node dist/scenario-test-cli.cjs serve --config examples/complete/scenario.config.js --port 4300

# 安全示例
node dist/scenario-test-cli.cjs serve --config examples/security-best-practices/scenario.config.js --port 4300
```

### 停止服务器
```bash
# 方法 1: 在终端按 Ctrl+C

# 方法 2: 查找并结束进程
tasklist | findstr node
taskkill /PID <进程ID> /F
```

### 更改端口
```bash
# 使用不同端口
node dist/scenario-test-cli.cjs serve --config examples/basic/scenario.config.js --port 8080

# 访问 http://127.0.0.1:8080/
```

---

## 📁 直接打开 HTML 文件（不推荐）

### 方式 2: 直接打开文件

**Windows 资源管理器**:
1. 打开目录：`d:\workspace\git\scenario-test\examples\xlsx-adapter\`
2. 双击 `index.html`

**命令行打开**:
```bash
# Windows
start examples/xlsx-adapter/index.html

# 或使用默认浏览器
explorer examples/xlsx-adapter/index.html
```

**⚠️ 限制**:
- 可能遇到 CORS 问题
- 无法加载 `/__scenario-test__/scenario-test.umd.js`
- **不推荐这种方式**

---

## 🐛 常见问题

### Q1: 访问 http://127.0.0.1:4300/ 显示"无法访问"

**A**: 检查服务器是否启动成功
```bash
# 检查端口占用
netstat -ano | findstr :4300

# 查看服务器日志
# 如果是后台启动，查看输出文件
```

### Q2: 页面空白

**A**: 打开浏览器开发者工具（F12）查看错误
```
常见错误:
- 404: scenario-test.umd.js 未找到
- CORS: 跨域问题
- JS 错误: 配置文件问题
```

### Q3: 场景运行失败

**A**: 检查：
1. 是否需要 Mock 服务器（Complete 示例）
2. 环境变量是否设置（安全示例）
3. 网络连接是否正常

### Q4: 如何停止后台服务器？

**A**: 
```bash
# 查找 node 进程
tasklist | findstr node

# 结束进程
taskkill /PID <PID> /F

# 或者重启终端
```

---

## 🎯 快速开始（推荐流程）

### 第一次使用

```bash
# 1. 进入项目目录
cd d:\workspace\git\scenario-test

# 2. 确认构建完成
ls dist/scenario-test-cli.cjs

# 3. 启动 Basic 示例（最简单）
node dist/scenario-test-cli.cjs serve \
  --config examples/basic/scenario.config.js \
  --port 4300

# 4. 打开浏览器
# http://127.0.0.1:4300/

# 5. 选择场景并运行
# 6. 查看结果

# 7. 停止服务器（Ctrl+C）
```

### 体验完整功能

```bash
# 1. 启动 Complete 示例（带 Mock API）

# 终端 1: Mock API
node examples/complete/mock-server.cjs

# 终端 2: 示例服务器
node dist/scenario-test-cli.cjs serve \
  --config examples/complete/scenario.config.js \
  --port 4300

# 2. 打开浏览器
# http://127.0.0.1:4300/

# 3. 运行"手动登录与受保护请求"场景
# 4. 运行"重试、提取和条件跳过"场景
```

---

## 📊 示例对比

| 示例 | 需要 Mock API | 难度 | 推荐顺序 |
|------|--------------|------|---------|
| **Basic** | ❌ | ⭐ | 第 1 个看 |
| **Complete** | ✅ | ⭐⭐ | 第 2 个看 |
| **XLSX Adapter** | ❌ | ⭐⭐ | 第 3 个看 |
| **Security** | ❌ | ⭐⭐⭐ | 第 4 个看 |

---

## 🎉 当前可访问

**XLSX 适配器示例已启动**:
- 地址: http://127.0.0.1:4300/
- 端口: 4300
- 状态: ✅ 运行中

**立即访问**：
1. 在浏览器打开: `http://127.0.0.1:4300/`
2. 选择场景并运行
3. 查看 Excel 生成示例

---

需要我帮您：
1. 打开浏览器访问？
2. 启动其他示例？
3. 解决遇到的问题？

告诉我！😊
