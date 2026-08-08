# scenario-test 示例完整性分析与补充方案

## 📊 现有示例分析

### 当前示例结构

```
examples/
├── basic/                          # 基础示例
│   ├── scenarios/
│   │   ├── health.js              # 健康检查
│   │   ├── slow.js                # 慢响应
│   │   └── cleanup.js             # 清理
│   ├── scenario.config.js
│   └── index.html
│
└── complete/                       # 完整示例
    ├── scenarios/
    │   ├── manual-login.js        # 登录和认证
    │   └── retry-and-condition.js # 重试和条件
    ├── mock-server.cjs            # Mock API 服务器
    ├── scenario.config.js
    ├── index.html
    └── README.md
```

### 已覆盖的功能

| 功能 | 示例文件 | 覆盖程度 |
|------|----------|----------|
| **基础请求** | health.js | ✅ 完整 |
| **认证流程** | manual-login.js | ✅ 完整 |
| **数据提取** | manual-login.js | ✅ 完整 |
| **变量引用** | manual-login.js | ✅ 完整 |
| **重试机制** | retry-and-condition.js | ✅ 完整 |
| **条件跳过** | retry-and-condition.js | ✅ 完整 |
| **失败策略** | retry-and-condition.js | ✅ 完整 |
| **环境变量** | manual-login.js | ✅ 完整 |

---

## ❌ 缺失的重要示例

### 1. **XLSX 适配器** ⭐⭐⭐ (最重要)
**当前**: 无示例
**重要性**: 这是唯一的内置适配器，但没有示例！

### 2. **文件上传** ⭐⭐⭐
**当前**: 无示例
**重要性**: Node.js 特有功能，常用场景

### 3. **文件下载/保存响应** ⭐⭐
**当前**: 无示例
**重要性**: Node.js 特有功能

### 4. **自定义插件** ⭐⭐⭐
**当前**: 无示例
**重要性**: 扩展能力的核心

### 5. **错误处理** ⭐⭐
**当前**: 只有 retry-and-condition.js 的简单演示
**重要性**: 实际使用必需

### 6. **安全最佳实践** ⭐⭐⭐ (v0.3.0 新增)
**当前**: 无示例
**重要性**: v0.3.0 的核心改进

### 7. **数据驱动测试** ⭐
**当前**: 无示例
**重要性**: 高级用法

### 8. **复杂断言** ⭐
**当前**: 只有简单的 equals, exists
**重要性**: 实际场景需要

---

## 🎯 补充示例方案

### 优先级 1: 必须补充（适配器和安全）

#### 1. `examples/xlsx-adapter/` - Excel 操作示例

```javascript
// scenarios/excel-export.js
ScenarioTest.registerScenario("excel-export", ScenarioTest.defineScenario({
    name: "Excel 报表生成",
    steps: [
        {
            name: "准备 Excel 报表",
            prepareXlsx: {
                template: "templates/report.xlsx",
                output: "output/monthly-report.xlsx",
                sheet: "Sheet1",
                cells: [
                    { cell: "A1", value: "月度报表" },
                    { cell: "A2", value: "{{vars.reportMonth}}" },
                    { cell: "B2", value: "{{lastResponseBody.totalSales}}" }
                ]
            }
        },
        {
            name: "验证生成的文件",
            method: "GET",
            path: "verify-excel",
            // ... 验证逻辑
        }
    ]
}));
```

**包含**:
- Excel 模板使用
- 数据填充
- 变量插值
- 路径安全验证

#### 2. `examples/security-best-practices/` - v0.3.0 安全示例

```javascript
// scenarios/secure-auth.js - 安全认证示例
ScenarioTest.registerScenario("secure-auth", ScenarioTest.defineScenario({
    name: "安全认证最佳实践",
    // ✅ 好的做法：使用环境变量
    envVars: {
        apiKey: "API_KEY",
        apiSecret: "API_SECRET"
    },
    // ❌ 不要硬编码！
    // vars: { apiKey: "AK_123456" }
    
    steps: [...]
}));
```

```javascript
// scenarios/safe-file-paths.js - 安全路径示例
ScenarioTest.registerScenario("safe-paths", ScenarioTest.defineScenario({
    name: "安全的文件路径使用",
    steps: [
        {
            name: "✅ 安全：相对路径",
            prepareXlsx: {
                template: "templates/report.xlsx",  // ✅ 相对路径
                output: "output/result.xlsx"
            }
        },
        // 以下会失败（演示）
        // {
        //     name: "❌ 不安全：绝对路径",
        //     prepareXlsx: {
        //         template: "/etc/passwd",  // ❌ 会被拒绝
        //         output: "output.xlsx"
        //     }
        // }
    ]
}));
```

#### 3. `examples/file-operations/` - 文件操作示例

```javascript
// scenarios/file-upload.js
ScenarioTest.registerScenario("file-upload", ScenarioTest.defineScenario({
    name: "文件上传",
    steps: [
        {
            name: "上传头像",
            method: "POST",
            path: "users/avatar",
            request: {
                fileUpload: {
                    field: "avatar",
                    path: "fixtures/avatar.jpg",  // 相对于配置目录
                    mimeType: "image/jpeg"
                }
            },
            status: 200
        }
    ]
}));
```

```javascript
// scenarios/download-response.js
ScenarioTest.registerScenario("download", ScenarioTest.defineScenario({
    name: "下载文件",
    steps: [
        {
            name: "下载报表",
            method: "GET",
            path: "reports/monthly",
            saveResponseAs: "downloads/report.pdf",  // 保存响应到文件
            status: 200
        }
    ]
}));
```

---

### 优先级 2: 推荐补充（插件和高级用法）

#### 4. `examples/custom-plugin/` - 自定义插件示例

```javascript
// plugins/custom-logger.js - 简单插件
export default function createLoggerPlugin(api) {
    console.log('Logger plugin initialized');
    
    return {
        // 场景转换：为所有步骤添加日志
        transformScenario(scenario, context) {
            console.log(`Running scenario: ${scenario.name}`);
            return scenario;
        }
    };
}
```

```javascript
// plugins/pdf-adapter.js - 适配器插件
export default function createPdfAdapter(options) {
    return {
        adapters: {
            pdf: {
                matches(step) {
                    return Boolean(step.generatePdf);
                },
                async execute({ step, runtime }) {
                    const { template, output, data } = step.generatePdf;
                    // PDF 生成逻辑...
                    return {
                        method: "PDF",
                        path: output,
                        response: { status: "LOCAL", body: { saved: output } }
                    };
                }
            }
        }
    };
}
```

#### 5. `examples/advanced-assertions/` - 高级断言示例

```javascript
// scenarios/complex-assertions.js
ScenarioTest.registerScenario("assertions", ScenarioTest.defineScenario({
    name: "复杂断言示例",
    steps: [
        {
            name: "多种断言类型",
            method: "GET",
            path: "users",
            assertions: [
                // 存在性检查
                { name: "数据存在", path: "data", exists: true },
                
                // 相等性检查
                { name: "状态码", path: "code", equals: 200 },
                
                // 包含检查
                { name: "包含用户", path: "data[0].name", includes: "张" },
                
                // 正则匹配
                { name: "邮箱格式", path: "data[0].email", matches: "^[\\w.-]+@[\\w.-]+\\.\\w+$" },
                
                // 枚举检查
                { name: "状态枚举", path: "data[0].status", oneOf: ["active", "inactive"] }
            ]
        }
    ]
}));
```

#### 6. `examples/error-handling/` - 错误处理示例

```javascript
// scenarios/error-recovery.js
ScenarioTest.registerScenario("error-recovery", ScenarioTest.defineScenario({
    name: "错误处理和恢复",
    failurePolicy: "continue",  // 继续执行收集所有错误
    steps: [
        {
            name: "可能失败的步骤",
            method: "GET",
            path: "unstable-api",
            retryUntil: { 
                maxAttempts: 3, 
                intervalMs: 1000,
                maxElapsedMs: 5000  // v0.3.0 新增：总超时
            },
            status: 200
        },
        {
            name: "失败后的清理",
            method: "DELETE",
            path: "cleanup",
            // 即使前面失败，这步也会执行
        }
    ]
}));
```

---

### 优先级 3: 可选补充（特殊场景）

#### 7. `examples/data-driven/` - 数据驱动测试

```javascript
// scenarios/bulk-users.js
ScenarioTest.registerScenario("bulk-users", ScenarioTest.defineScenario({
    name: "批量用户创建",
    vars: {
        users: [
            { name: "用户1", email: "user1@example.com" },
            { name: "用户2", email: "user2@example.com" },
            { name: "用户3", email: "user3@example.com" }
        ]
    },
    steps: [
        // 实际中可能需要循环逻辑或使用插件
        {
            name: "创建用户1",
            method: "POST",
            path: "users",
            request: { body: "{{vars.users[0]}}" }
        }
        // ... 更多步骤
    ]
}));
```

#### 8. `examples/integration/` - 集成测试场景

```javascript
// scenarios/e2e-order-flow.js
ScenarioTest.registerScenario("e2e-order", ScenarioTest.defineScenario({
    name: "端到端订单流程",
    steps: [
        { name: "1. 用户注册", ... },
        { name: "2. 登录", ... },
        { name: "3. 浏览商品", ... },
        { name: "4. 加入购物车", ... },
        { name: "5. 结账", ... },
        { name: "6. 支付", ... },
        { name: "7. 查看订单状态", retryUntil: ... },
        { name: "8. 清理测试数据", when: ... }
    ]
}));
```

---

## 📝 推荐的新增示例目录结构

```
examples/
├── basic/                          # 现有：基础示例
├── complete/                       # 现有：完整示例
│
├── xlsx-adapter/                   # 新增 ⭐⭐⭐ 必须
│   ├── templates/
│   │   └── report.xlsx
│   ├── scenarios/
│   │   ├── excel-export.js
│   │   └── excel-import.js
│   ├── scenario.config.js
│   └── README.md
│
├── security-best-practices/        # 新增 ⭐⭐⭐ 必须（v0.3.0）
│   ├── scenarios/
│   │   ├── secure-auth.js         # 环境变量使用
│   │   ├── safe-file-paths.js     # 路径安全
│   │   └── plugin-security.js     # 插件安全
│   ├── scenario.config.js
│   └── README.md
│
├── file-operations/                # 新增 ⭐⭐⭐ 必须
│   ├── fixtures/
│   │   └── avatar.jpg
│   ├── scenarios/
│   │   ├── file-upload.js
│   │   └── download-response.js
│   ├── scenario.config.js
│   └── README.md
│
├── custom-plugin/                  # 新增 ⭐⭐ 推荐
│   ├── plugins/
│   │   ├── custom-logger.js
│   │   └── pdf-adapter.js
│   ├── scenarios/
│   │   └── use-custom-plugin.js
│   ├── scenario.config.js
│   └── README.md
│
├── advanced-assertions/            # 新增 ⭐⭐ 推荐
│   ├── scenarios/
│   │   └── complex-assertions.js
│   ├── scenario.config.js
│   └── README.md
│
└── error-handling/                 # 新增 ⭐ 可选
    ├── scenarios/
    │   └── error-recovery.js
    ├── scenario.config.js
    └── README.md
```

---

## 🎯 实施建议

### 立即补充（v0.3.1）

**必须补充的 3 个示例**：
1. ✅ `xlsx-adapter/` - 唯一内置适配器没有示例
2. ✅ `security-best-practices/` - v0.3.0 核心改进需要示例
3. ✅ `file-operations/` - Node.js 特有功能

**预计工作量**: 4-6 小时

### 中期补充（v0.4.0）

4. `custom-plugin/` - 扩展能力演示
5. `advanced-assertions/` - 高级用法
6. `error-handling/` - 完善错误处理

**预计工作量**: 4-6 小时

### 长期补充（v0.5.0）

7. `data-driven/` - 数据驱动测试
8. `integration/` - 端到端场景

---

## 📊 补充后的覆盖率

| 功能类别 | 当前 | 补充后 |
|---------|------|--------|
| 基础功能 | 80% | 100% |
| 适配器 | 0% | 100% ⭐ |
| 安全功能 | 0% | 100% ⭐ |
| 文件操作 | 0% | 100% ⭐ |
| 插件系统 | 0% | 80% |
| 高级断言 | 40% | 100% |
| 错误处理 | 30% | 90% |

---

## 💡 每个示例应包含

### 标准结构
```
example-name/
├── README.md              # 说明文档
├── scenario.config.js     # 配置文件
├── scenarios/             # 场景定义
│   └── *.js
├── fixtures/              # 测试数据（如果需要）
├── templates/             # 模板文件（如果需要）
└── mock-server.cjs       # Mock 服务（如果需要）
```

### README.md 模板
```markdown
# 示例名称

## 功能演示

- 功能1
- 功能2

## 如何运行

### 启动 Mock 服务（如果有）
\`\`\`bash
node mock-server.cjs
\`\`\`

### CLI 运行
\`\`\`bash
node ../../dist/scenario-test-cli.cjs --config scenario.config.js --all
\`\`\`

### 浏览器运行
打开 index.html

## 学习要点

- 要点1
- 要点2

## 相关文档

- [功能文档链接]
```

---

## ✅ 行动计划

### Phase 1: 立即补充（本周）
- [ ] 创建 `examples/xlsx-adapter/`
- [ ] 创建 `examples/security-best-practices/`
- [ ] 创建 `examples/file-operations/`
- [ ] 更新主 README.md 添加新示例索引

### Phase 2: 中期补充（下周）
- [ ] 创建 `examples/custom-plugin/`
- [ ] 创建 `examples/advanced-assertions/`
- [ ] 创建 `examples/error-handling/`

### Phase 3: 文档完善
- [ ] 为每个示例添加详细 README
- [ ] 添加示例索引页面
- [ ] 更新主文档引用示例

---

## 📈 预期效果

补充这些示例后：
1. ✅ 用户能快速上手所有核心功能
2. ✅ v0.3.0 安全改进有清晰示例
3. ✅ XLSX 适配器使用率提升
4. ✅ 降低学习曲线
5. ✅ 减少支持工作量

---

**结论**: 当前示例覆盖了基础功能，但**缺少关键特性的示例**（适配器、安全、文件操作、插件）。建议优先补充这 3 个核心示例。
