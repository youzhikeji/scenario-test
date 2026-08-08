# Excel 适配器示例

本示例展示如何使用 scenario-test 的内置 XLSX 适配器处理 Excel 文件。

## 功能演示

- ✅ 使用 Excel 模板生成报表
- ✅ 填充动态数据到指定单元格
- ✅ 使用变量和响应数据
- ✅ 安全的文件路径处理（v0.3.0）

## 快速开始

### 方式 1: CLI 运行（推荐）

```bash
# 从项目根目录运行
node dist/scenario-test-cli.cjs \
  --config examples/xlsx-adapter/scenario.config.js \
  --all
```

### 方式 2: 浏览器运行

```bash
# 1. 启动开发服务器
node dist/scenario-test-cli.cjs serve \
  --config examples/xlsx-adapter/scenario.config.js \
  --port 4300

# 2. 打开浏览器访问
# http://127.0.0.1:4300/
```

或者直接打开 `index.html` 文件（需要支持 ES 模块的现代浏览器）。

### 查看生成的文件

```bash
# 查看输出目录
ls examples/xlsx-adapter/output/

# 应该看到生成的 Excel 文件：
# - sales-report-2026-08.xlsx
# - user-list-2026-08-08.xlsx
```

## 场景说明

### 场景 1: 销售报表生成

从 API 获取销售数据，填充到 Excel 模板中。

**流程**:
1. 调用 API 获取销售数据
2. 提取数据到变量
3. 使用模板生成 Excel 报表
4. 填充动态数据（标题、日期、金额）

**关键代码**:
```javascript
{
    name: "生成销售报表",
    prepareXlsx: {
        template: "templates/sales-template.xlsx",  // ✅ 相对路径
        output: "output/sales-report.xlsx",
        sheet: "销售数据",
        cells: [
            { cell: "A1", value: "月度销售报表" },
            { cell: "B2", value: "{{vars.reportMonth}}" },
            { cell: "B3", value: "{{vars.totalSales}}" }
        ]
    }
}
```

### 场景 2: 用户列表导出

动态生成用户列表，展示多行数据填充。

**关键点**:
- 多个单元格批量填充
- 使用 API 响应数据
- 数组数据展示

## 学习要点

### 1. Excel 模板准备

在 `templates/` 目录放置 Excel 模板文件：
```
templates/
├── sales-template.xlsx      # 销售报表模板
└── user-list-template.xlsx  # 用户列表模板
```

**模板建议**:
- 预设表头和格式
- 预留数据单元格
- 设置好列宽、样式

### 2. 路径安全（v0.3.0 新增）

✅ **安全的路径**:
```javascript
{
    template: "templates/report.xlsx",    // ✅ 相对路径
    output: "output/result.xlsx"
}
```

❌ **不安全的路径**（会被拒绝）:
```javascript
{
    template: "/etc/passwd",              // ❌ 绝对路径
    output: "../../../tmp/file.xlsx"      // ❌ 路径遍历
}
```

### 3. 变量使用

**从场景变量**:
```javascript
vars: { reportMonth: "2026-08" }
// 使用
cells: [{ cell: "A1", value: "{{vars.reportMonth}}" }]
```

**从 API 响应**:
```javascript
// 前一步提取
extract: [{ name: "totalSales", path: "data.total" }]
// 使用
cells: [{ cell: "B3", value: "{{vars.totalSales}}" }]
```

**从最后一次响应**:
```javascript
cells: [{ cell: "B4", value: "{{lastResponseBody.data.count}}" }]
```

### 4. 单元格引用

支持标准 Excel 单元格引用：
- `A1` - 第一列第一行
- `B2` - 第二列第二行
- `Z10` - 第26列第10行
- `AA1` - 第27列第一行

## 实际应用场景

### 场景 1: 自动化月报

```javascript
{
    name: "月度运营报表",
    steps: [
        { name: "获取销售数据", path: "api/sales/monthly", extract: [...] },
        { name: "获取用户增长", path: "api/users/growth", extract: [...] },
        { name: "获取活跃度", path: "api/analytics/active", extract: [...] },
        {
            name: "生成月报",
            prepareXlsx: {
                template: "templates/monthly-report.xlsx",
                output: "reports/{{vars.year}}-{{vars.month}}.xlsx",
                cells: [
                    { cell: "B2", value: "{{vars.totalSales}}" },
                    { cell: "B3", value: "{{vars.newUsers}}" },
                    { cell: "B4", value: "{{vars.activeRate}}" }
                ]
            }
        }
    ]
}
```

### 场景 2: 测试数据导出

```javascript
{
    name: "导出测试结果",
    steps: [
        { name: "运行测试", path: "api/tests/run", extract: [...] },
        {
            name: "导出结果",
            prepareXlsx: {
                template: "templates/test-report.xlsx",
                output: "test-results/{{vars.testRunId}}.xlsx",
                cells: [
                    { cell: "A2", value: "{{vars.totalTests}}" },
                    { cell: "B2", value: "{{vars.passed}}" },
                    { cell: "C2", value: "{{vars.failed}}" }
                ]
            }
        }
    ]
}
```

### 场景 3: 批量数据填充

```javascript
{
    name: "批量导出用户数据",
    prepareXlsx: {
        template: "templates/users.xlsx",
        output: "output/users-{{vars.date}}.xlsx",
        sheet: "用户列表",
        cells: [
            // 表头
            { cell: "A1", value: "用户ID" },
            { cell: "B1", value: "姓名" },
            { cell: "C1", value: "邮箱" },
            // 数据行（实际中可能需要循环）
            { cell: "A2", value: "{{vars.users[0].id}}" },
            { cell: "B2", value: "{{vars.users[0].name}}" },
            { cell: "C2", value: "{{vars.users[0].email}}" }
        ]
    }
}
```

## 常见问题

### Q1: 如何创建 Excel 模板？

**A**: 使用 Microsoft Excel 或 WPS 创建：
1. 设计表头和格式
2. 预留数据单元格为空或填充示例数据
3. 保存为 `.xlsx` 格式
4. 放到 `templates/` 目录

### Q2: 可以修改已存在的 Excel 吗？

**A**: 可以！`template` 和 `output` 可以是同一个文件，会在原文件基础上修改。但建议使用模板+输出的方式，更安全。

### Q3: 支持公式吗？

**A**: 支持！在 Excel 模板中设置公式，生成时公式会保留并自动计算。

```javascript
// 模板中 D2 单元格有公式: =B2*C2
cells: [
    { cell: "B2", value: 100 },    // 数量
    { cell: "C2", value: 25.5 }    // 单价
    // D2 会自动计算为 2550
]
```

### Q4: 可以操作多个 sheet 吗？

**A**: 可以！多次调用 `prepareXlsx` 指定不同的 `sheet`：

```javascript
steps: [
    {
        name: "填充销售数据",
        prepareXlsx: {
            template: "report.xlsx",
            output: "report.xlsx",
            sheet: "销售",
            cells: [...]
        }
    },
    {
        name: "填充费用数据",
        prepareXlsx: {
            template: "report.xlsx",  // 同一个文件
            output: "report.xlsx",
            sheet: "费用",            // 不同的 sheet
            cells: [...]
        }
    }
]
```

### Q5: 文件路径错误怎么办？

**A**: v0.3.0 加强了路径验证：
- ✅ 确保使用相对路径
- ✅ 文件必须在配置目录内
- ❌ 不要使用 `../` 或绝对路径

错误信息会明确指出问题：
```
Excel 模板路径不安全: ../../../etc/passwd
原因: 路径越界
提示: 请使用配置目录内的相对路径
```

## 相关文档

- [XLSX 适配器源码](../../src/adapters/xlsx.js)
- [路径安全指南](../../SECURITY.md)
- [完整 API 文档](../../README.md)

## 技术细节

**底层库**: [ExcelJS](https://github.com/exceljs/exceljs)
**支持格式**: `.xlsx` (Office Open XML)
**Node.js 版本**: 18+

## 下一步

- 查看 [安全最佳实践示例](../security-best-practices/)
- 查看 [文件操作示例](../file-operations/)
- 查看 [自定义插件示例](../custom-plugin/)
