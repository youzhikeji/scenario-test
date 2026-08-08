ScenarioTest.registerScenario("sales-report", ScenarioTest.defineScenario({
    name: "生成销售报表",
    vars: {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0
    },
    steps: [
        {
            name: "获取本月销售数据（模拟）",
            method: "GET",
            path: "api/sales/summary",
            // 模拟响应数据
            status: 200,
            extract: [
                { name: "totalSales", path: "data.totalSales" },
                { name: "totalOrders", path: "data.totalOrders" },
                { name: "avgOrderValue", path: "data.avgOrderValue" }
            ]
        },
        {
            name: "生成 Excel 销售报表",
            prepareXlsx: {
                template: "templates/sales-template.xlsx",
                output: "output/sales-report-{{vars.reportMonth}}.xlsx",
                sheet: "销售数据",
                cells: [
                    // 报表标题
                    { cell: "A1", value: "{{vars.reportYear}}年{{vars.reportMonth}}月销售报表" },

                    // 数据标签
                    { cell: "A3", value: "总销售额" },
                    { cell: "A4", value: "订单数量" },
                    { cell: "A5", value: "平均订单金额" },
                    { cell: "A6", value: "生成时间" },

                    // 动态数据
                    { cell: "B3", value: "{{vars.totalSales}}" },
                    { cell: "B4", value: "{{vars.totalOrders}}" },
                    { cell: "B5", value: "{{vars.avgOrderValue}}" },
                    { cell: "B6", value: "{{vars.reportMonth}}" }
                ]
            }
        }
    ]
}));

// ⚠️ 注意：实际运行时需要真实的 API 或 Mock 服务器
// 本示例展示了数据流：API → extract → Excel
//
// 如果没有 API，可以直接使用 vars 中的数据：
// vars: { totalSales: 125000, totalOrders: 450, avgOrderValue: 278 }
