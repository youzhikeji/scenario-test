# Excel 模板说明

本目录包含 scenario-test XLSX 适配器使用的 Excel 模板文件。

## 模板文件

### sales-template.xlsx - 销售报表模板

**结构**:
```
Sheet: 销售数据
+------------------+------------------+
| A1: (标题)       |                  |
+------------------+------------------+
| A3: 总销售额     | B3: (数据)       |
| A4: 订单数量     | B4: (数据)       |
| A5: 平均订单金额 | B5: (数据)       |
| A6: 生成时间     | B6: (数据)       |
+------------------+------------------+
```

**格式**:
- 标题行：字体加粗、居中、背景色
- 数据行：边框、数字格式

### user-list-template.xlsx - 用户列表模板

**结构**:
```
Sheet: 用户列表
+--------+--------+----------------------+--------+--------------+
| A1: ID | B1: 姓名 | C1: 邮箱              | D1: 状态 | E1: 导出日期 |
+--------+--------+----------------------+--------+--------------+
| A2:    | B2:    | C2:                  | D2:    | E2:          |
| A3:    | B3:    | C3:                  | D3:    | E3:          |
| ...    | ...    | ...                  | ...    | ...          |
+--------+--------+----------------------+--------+--------------+
```

**格式**:
- 表头：加粗、背景色、边框
- 数据区：边框、自动换行

## 如何创建模板

### 方法 1: 使用现有 Excel 文件

1. 打开 Microsoft Excel 或 WPS
2. 设计表格结构和格式
3. 另存为 `.xlsx` 格式
4. 放到此目录

### 方法 2: 使用代码生成（推荐用于简单模板）

```javascript
// 使用 ExcelJS 创建模板
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('销售数据');

// 设置列宽
sheet.getColumn('A').width = 20;
sheet.getColumn('B').width = 15;

// 设置表头样式
sheet.getCell('A1').font = { bold: true, size: 14 };
sheet.getCell('A1').alignment = { horizontal: 'center' };

// 保存
await workbook.xlsx.writeFile('sales-template.xlsx');
```

### 方法 3: 从现有报表提取

如果已有报表：
1. 复制一份
2. 清空数据单元格（保留格式）
3. 重命名为模板

## 注意事项

### ✅ 推荐做法

1. **预设格式**
   - 设置好列宽、行高
   - 应用单元格格式（边框、背景色）
   - 设置数字格式（货币、日期）

2. **使用公式**
   - 模板中可以包含公式
   - 填充数据后公式会自动计算

3. **多个 Sheet**
   - 一个模板可以包含多个 Sheet
   - 通过 `sheet` 参数指定使用哪个

4. **命名规范**
   - 使用英文或拼音
   - 添加 `-template` 后缀
   - 描述性名称

### ❌ 避免的问题

1. **不要使用外部链接**
   - 避免引用其他 Excel 文件
   - 避免超链接到外部资源

2. **不要使用宏**
   - `.xlsx` 格式不支持宏
   - 使用 `.xlsm` 格式（但 scenario-test 可能不支持）

3. **不要使用复杂的数据验证**
   - 下拉列表、条件格式可能导致问题

## 示例模板内容

### sales-template.xlsx 应该包含

```
Sheet: 销售数据

  A                 B
1 (标题占位)
2
3 总销售额
4 订单数量
5 平均订单金额
6 生成时间

（应用格式：表头加粗、数据区边框）
```

### user-list-template.xlsx 应该包含

```
Sheet: 用户列表

  A      B      C              D      E
1 用户ID  姓名   邮箱           状态   导出日期
2
3
4

（应用格式：表头行背景色、所有单元格边框）
```

## 测试模板

创建模板后，建议测试：

```bash
# 运行场景测试模板
node ../../dist/scenario-test-cli.cjs \
  --config scenario.config.js \
  --scenario sales-report

# 检查生成的文件
ls ../output/
```

## 如果没有模板文件

示例可以在没有实际模板的情况下运行，但会报错：

```
Excel 模板不存在: templates/sales-template.xlsx
```

**解决方案**:

1. **创建空白模板**（最简单）
   - 创建一个空白 Excel 文件
   - 保存为对应的文件名

2. **使用其他文件作为模板**
   - 修改 `scenario.config.js` 中的路径
   - 指向已存在的 Excel 文件

3. **修改场景不使用模板**
   - 修改为创建新文件而不是基于模板

## 相关文档

- [XLSX 适配器文档](../README.md)
- [ExcelJS 文档](https://github.com/exceljs/exceljs)
