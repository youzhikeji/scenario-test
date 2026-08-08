ScenarioTest.registerScenario("user-list", ScenarioTest.defineScenario({
    name: "导出用户列表",
    vars: {
        exportDate: "2026-08-08",
        users: [
            { id: "U001", name: "张三", email: "zhangsan@example.com", status: "活跃" },
            { id: "U002", name: "李四", email: "lisi@example.com", status: "活跃" },
            { id: "U003", name: "王五", email: "wangwu@example.com", status: "停用" }
        ]
    },
    steps: [
        {
            name: "生成用户列表 Excel",
            prepareXlsx: {
                template: "templates/user-list-template.xlsx",
                output: "output/user-list-{{vars.exportDate}}.xlsx",
                sheet: "用户列表",
                cells: [
                    // 表头
                    { cell: "A1", value: "用户ID" },
                    { cell: "B1", value: "姓名" },
                    { cell: "C1", value: "邮箱" },
                    { cell: "D1", value: "状态" },
                    { cell: "E1", value: "导出日期" },

                    // 用户1
                    { cell: "A2", value: "{{vars.users[0].id}}" },
                    { cell: "B2", value: "{{vars.users[0].name}}" },
                    { cell: "C2", value: "{{vars.users[0].email}}" },
                    { cell: "D2", value: "{{vars.users[0].status}}" },
                    { cell: "E2", value: "{{vars.exportDate}}" },

                    // 用户2
                    { cell: "A3", value: "{{vars.users[1].id}}" },
                    { cell: "B3", value: "{{vars.users[1].name}}" },
                    { cell: "C3", value: "{{vars.users[1].email}}" },
                    { cell: "D3", value: "{{vars.users[1].status}}" },
                    { cell: "E3", value: "{{vars.exportDate}}" },

                    // 用户3
                    { cell: "A4", value: "{{vars.users[2].id}}" },
                    { cell: "B4", value: "{{vars.users[2].name}}" },
                    { cell: "C4", value: "{{vars.users[2].email}}" },
                    { cell: "D4", value: "{{vars.users[2].status}}" },
                    { cell: "E4", value: "{{vars.exportDate}}" },

                    // 统计信息
                    { cell: "A6", value: "总用户数" },
                    { cell: "B6", value: "3" }
                ]
            }
        }
    ]
}));

// 💡 提示：
// 1. 这个示例展示了如何从 vars 数组中提取数据填充到 Excel
// 2. 实际项目中，users 数组通常来自 API 响应的 extract
// 3. 对于大量数据，可以考虑：
//    - 使用循环生成 cells（需要在配置阶段处理）
//    - 使用自定义插件批量处理
//    - 直接使用 ExcelJS API（如果 scenario-test 的 DSL 不够用）
