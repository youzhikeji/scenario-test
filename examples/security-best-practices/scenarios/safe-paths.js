ScenarioTest.registerScenario("safe-paths", ScenarioTest.defineScenario({
    name: "安全的文件路径使用",
    vars: {
        reportDate: "2026-08-08"
    },
    steps: [
        {
            name: "✅ 安全：使用相对路径",
            prepareXlsx: {
                template: "templates/report.xlsx",  // ✅ 相对路径
                output: "output/result.xlsx",        // ✅ 相对路径
                sheet: "Sheet1",
                cells: [
                    { cell: "A1", value: "安全的路径示例" },
                    { cell: "A2", value: "{{vars.reportDate}}" }
                ]
            }
        },

        {
            name: "✅ 安全：项目内的子目录",
            prepareXlsx: {
                template: "templates/subfolder/report.xlsx",  // ✅ 允许
                output: "output/reports/result.xlsx",          // ✅ 允许
                sheet: "Sheet1",
                cells: [
                    { cell: "A1", value: "子目录也是安全的" }
                ]
            }
        }

        // ❌ 以下路径会被 v0.3.0 拒绝（演示用，实际运行会失败）

        // {
        //     name: "❌ 不安全：绝对路径",
        //     prepareXlsx: {
        //         template: "/etc/passwd",           // ❌ 绝对路径
        //         output: "output/result.xlsx"
        //     }
        // },

        // {
        //     name: "❌ 不安全：路径遍历",
        //     prepareXlsx: {
        //         template: "../../../tmp/evil.xlsx",  // ❌ 路径遍历
        //         output: "output/result.xlsx"
        //     }
        // },

        // {
        //     name: "❌ 不安全：访问系统文件",
        //     prepareXlsx: {
        //         template: "templates/report.xlsx",
        //         output: "C:\\Windows\\System32\\evil.xlsx"  // ❌ 系统路径
        //     }
        // }
    ]
}));

// 💡 v0.3.0 路径验证规则：
//
// ✅ 允许：
// - 相对路径（templates/file.xlsx）
// - 子目录（templates/sub/file.xlsx）
// - 当前目录（./file.xlsx）
//
// ❌ 拒绝：
// - 绝对路径（/etc/passwd, C:\Windows\...）
// - 路径遍历（../../../tmp/file）
// - 父目录访问（在配置目录外）
//
// 🔒 安全保障：
// 所有文件操作都必须在配置文件所在目录内
// 防止读取/写入系统文件
// 防止覆盖重要文件

// 📝 错误示例：
//
// 如果尝试使用不安全的路径，会看到如下错误：
//
// Excel 模板路径不安全: /etc/passwd
// 原因: 不允许使用绝对路径: /etc/passwd
// 提示: 请使用配置目录内的相对路径
//
// Excel 输出路径不安全: ../../../tmp/evil.xlsx
// 原因: 路径越界: ../../../tmp/evil.xlsx
// 提示: 文件必须在配置目录内: /path/to/config
