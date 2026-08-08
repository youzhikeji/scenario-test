# scenario-test 入口设计分析

## 📊 入口设计复杂度评价：⭐⭐⭐ (5/10) - 中等

**结论**: 入口清晰但有多个，符合多平台库的设计模式。

---

## 🎯 入口点全景图

### 1. 源码层（开发视角）

```
src/
├── index.js          ⭐ 浏览器主入口
├── node.js           ⭐ Node.js 主入口
└── cli.js            ⭐ CLI 工具入口
```

### 2. 构建产物层（用户视角）

```
dist/
├── scenario-test.umd.js      ⭐ 浏览器 IIFE（HTML 直接引用）
├── scenario-test.esm.js      ⭐ 浏览器 ES Module
├── scenario-test.cjs         ⭐ Node.js CommonJS
├── scenario-test-cli.cjs     ⭐ CLI 可执行文件
└── adapters/
    └── xlsx.cjs              # XLSX 适配器（独立打包）
```

### 3. package.json 声明

```json
{
  "main": "dist/scenario-test.cjs",       // Node.js require() 入口
  "module": "dist/scenario-test.esm.js",  // ES Module import 入口
  "browser": "dist/scenario-test.umd.js"  // 浏览器打包工具入口
}
```

---

## 🔍 详细分析

### 入口 1: src/index.js - 浏览器库入口

```javascript
export * from "./core.js";           // 核心工具（fetch, delay 等）
export * from "./registry.js";       // 配置和场景注册
export * from "./engine.js";         // 执行引擎
export * from "./adapter-types.js";  // 适配器类型定义
export { createApp } from "./browser/app.js";  // ⭐ 浏览器应用
```

**导出的 API**:
```javascript
// 从 registry.js
- defineConfig()
- defineScenario()
- registerConfig()
- registerScenario()
- getConfig()
- getScenario()

// 从 engine.js
- runScenario()
- runScenarios()

// 从 browser/app.js
- createApp()  // ⭐ 浏览器专用
```

**使用方式**:
```html
<script src="/__scenario-test__/scenario-test.umd.js"></script>
<script>
    // 全局变量 ScenarioTest 包含所有导出
    ScenarioTest.createApp({ mount: "#app", config: ScenarioTest.getConfig() });
</script>
```

**评价**:
- ✅ **清晰**: 重新导出，扁平化 API
- ✅ **完整**: 包含所有核心功能
- ⚠️ **混合**: 浏览器和通用 API 混在一起

---

### 入口 2: src/node.js - Node.js 库入口

```javascript
export * from "./index.js";  // 继承浏览器所有 API

// Node.js 特有功能
export { createNodeIo } from "./node/io.js";
export { 
    executeDefinitionFile, 
    loadConfigFile, 
    loadScenarioFile 
} from "./node/loader.js";
```

**额外的 Node.js API**:
```javascript
- createNodeIo()           // 文件上传/下载
- executeDefinitionFile()  // 执行 JS 文件
- loadConfigFile()         // 加载配置文件
- loadScenarioFile()       // 加载场景文件
```

**使用方式**:
```javascript
// CommonJS
const ScenarioTest = require('scenario-test');

// ES Module
import * as ScenarioTest from 'scenario-test';

// 使用
ScenarioTest.runScenario(scenario, options);
```

**评价**:
- ✅ **继承**: 复用浏览器 API
- ✅ **扩展**: 添加 Node.js 特有功能
- ✅ **清晰**: 职责分离

---

### 入口 3: src/cli.js - CLI 工具入口

```javascript
import * as ScenarioTest from "./node.js";  // 使用 Node.js API
import { createXlsxAdapter, readWorkbookRows } from "./adapters/xlsx.js";
import { VERSION } from "./version.generated.js";
import { validatePath } from "./utils/path-validator.js";

// CLI 命令解析
function parseArgs(argv) { ... }

// 主函数
async function main() {
    const args = parseArgs(process.argv.slice(2));
    
    if (args.command === "run") {
        // 运行场景
    } else if (args.command === "serve") {
        // 启动开发服务器
    } else if (args.command === "init") {
        // 初始化项目
    }
}

main().catch(error => { ... });
```

**提供的命令**:
```bash
node scenario-test-cli.cjs run --config config.js --all
node scenario-test-cli.cjs serve --config config.js --port 4300
node scenario-test-cli.cjs init --project my-project
```

**使用方式**:
```bash
# 直接运行
node dist/scenario-test-cli.cjs --config scenario.config.js --all

# 或者通过 npm scripts
npm run scenario-test
```

**评价**:
- ✅ **独立**: 完整的 CLI 工具
- ✅ **功能丰富**: run/serve/init 三个命令
- ✅ **友好**: 清晰的参数和帮助信息
- ⚠️ **体积大**: 2.8MB（打包了所有依赖）

---

## 📊 入口对比

| 入口 | 平台 | 格式 | 体积 | 使用场景 |
|------|------|------|------|----------|
| **scenario-test.umd.js** | 浏览器 | IIFE | 231 KB | HTML 直接引用 |
| **scenario-test.esm.js** | 浏览器 | ES Module | 224 KB | 打包工具（Vite、Webpack） |
| **scenario-test.cjs** | Node.js | CommonJS | 231 KB | require() |
| **scenario-test-cli.cjs** | Node.js | CommonJS | 2.8 MB | 命令行工具 |

---

## 🎯 使用场景映射

### 场景 1: 浏览器直接使用
```html
<!-- 入口：scenario-test.umd.js -->
<script src="/__scenario-test__/scenario-test.umd.js"></script>
<script>
    ScenarioTest.createApp({ ... });
</script>
```

### 场景 2: 打包工具（Vite/Webpack）
```javascript
// 入口：scenario-test.esm.js（自动选择）
import * as ScenarioTest from 'scenario-test';
ScenarioTest.createApp({ ... });
```

### 场景 3: Node.js 脚本
```javascript
// 入口：scenario-test.cjs
const ScenarioTest = require('scenario-test');
await ScenarioTest.runScenario(scenario, options);
```

### 场景 4: 命令行运行
```bash
# 入口：scenario-test-cli.cjs
node dist/scenario-test-cli.cjs --config scenario.config.js --all
```

---

## 🤔 入口设计是否复杂？

### ✅ 优点

1. **多平台支持** ⭐⭐⭐⭐⭐
   - 浏览器 ✅
   - Node.js ✅
   - CLI ✅

2. **清晰的职责分离**
   ```
   index.js  → 浏览器核心
   node.js   → Node.js 扩展
   cli.js    → CLI 工具
   ```

3. **标准的包格式**
   ```json
   {
     "main": "cjs 格式",
     "module": "esm 格式",
     "browser": "umd 格式"
   }
   ```
   符合 npm 包标准

4. **渐进式复杂度**
   ```
   浏览器用户 → 只需知道 scenario-test.umd.js
   Node.js 用户 → 只需知道 scenario-test.cjs
   CLI 用户 → 只需知道 scenario-test-cli.cjs
   ```

### ⚠️ 潜在问题

1. **入口较多**（4 个）
   - 用户需要理解不同场景用哪个
   - 但这是多平台库的标准做法

2. **CLI 体积大**（2.8MB）
   - 打包了所有依赖（ExcelJS 等）
   - 但这是单文件 CLI 的必然代价

3. **API 混合**
   - `index.js` 包含浏览器特有的 `createApp()`
   - 但通过 `node.js` 继承，保持了一致性

---

## 📊 与其他库对比

### Lodash（简单）
```javascript
// 只有 1 个入口
import _ from 'lodash';
```
**复杂度**: ⭐ (1/10)

### Axios（中等）
```javascript
// 2 个入口
import axios from 'axios';           // 浏览器/Node.js 通用
import axios from 'axios/dist/axios.min.js';  // 浏览器专用
```
**复杂度**: ⭐⭐ (2/10)

### scenario-test（中等）
```javascript
// 4 个入口
scenario-test.umd.js    // 浏览器 IIFE
scenario-test.esm.js    // 浏览器 ES Module
scenario-test.cjs       // Node.js
scenario-test-cli.cjs   // CLI
```
**复杂度**: ⭐⭐⭐ (5/10)

### Playwright（复杂）
```javascript
// 多个入口 + 多个子包
@playwright/test
playwright-core
playwright-chromium
playwright-firefox
playwright-webkit
```
**复杂度**: ⭐⭐⭐⭐⭐ (9/10)

---

## 💡 改进建议

### 当前设计：7/10（良好）

**可选改进**：

#### 1. 文档优化
```markdown
# README.md 添加入口说明

## 安装和使用

### 浏览器
\`\`\`html
<script src="dist/scenario-test.umd.js"></script>
\`\`\`

### Node.js
\`\`\`javascript
const ScenarioTest = require('scenario-test');
\`\`\`

### CLI
\`\`\`bash
node dist/scenario-test-cli.cjs --help
\`\`\`
```

#### 2. 提供统一入口（可选）
```javascript
// scenario-test.js（新文件）
// 自动检测环境
if (typeof window !== 'undefined') {
    // 浏览器环境
    export * from './index.js';
} else {
    // Node.js 环境
    export * from './node.js';
}
```

**但不推荐**：
- 增加复杂度
- 打包工具已经能自动选择

#### 3. 分离 CLI（可选）
```bash
# 独立的包
npm install -g @scenario-test/cli

# 使用
scenario-test --config config.js --all
```

**但不推荐**：
- 增加维护成本
- 当前单文件 CLI 更简单

---

## 🎯 最终评价

### 入口设计：⭐⭐⭐⭐ (8/10)

**优点**:
- ✅ 清晰的职责分离
- ✅ 标准的包格式
- ✅ 支持多平台
- ✅ 渐进式复杂度

**缺点**:
- ⚠️ 入口稍多（4 个）
- ⚠️ CLI 体积大
- ⚠️ 文档可以更详细

**结论**: 
**不算复杂**，这是多平台库的标准设计。对于用户来说：
- 浏览器用户：只需关注 `scenario-test.umd.js`
- Node.js 用户：只需关注 `scenario-test.cjs`
- CLI 用户：只需关注 `scenario-test-cli.cjs`

每类用户只需要知道 1 个入口，实际使用很简单！

---

## 📝 推荐的文档改进

在 README.md 添加清晰的入口说明：

```markdown
## 📦 安装和使用

### 浏览器环境

**直接引用**:
\`\`\`html
<script src="dist/scenario-test.umd.js"></script>
<script>
    ScenarioTest.createApp({ mount: "#app" });
</script>
\`\`\`

**使用构建工具**:
\`\`\`javascript
import * as ScenarioTest from 'scenario-test';
\`\`\`

### Node.js 环境

\`\`\`javascript
const ScenarioTest = require('scenario-test');
await ScenarioTest.runScenario(scenario, options);
\`\`\`

### 命令行工具

\`\`\`bash
node dist/scenario-test-cli.cjs --config scenario.config.js --all
\`\`\`

详细文档见 [使用指南](docs/USAGE.md)
```

这样用户一看就知道用哪个入口！
