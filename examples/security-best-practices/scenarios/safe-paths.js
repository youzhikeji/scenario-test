ScenarioTest.registerScenario("safe-paths", ScenarioTest.defineScenario({
    name: "安全的文件保存路径使用",
    vars: {
        reportDate: "2026-08-08"
    },
    steps: [
        {
            name: "✅ 安全：使用相对路径保存响应",
            method: "GET",
            path: "https://mock.local/report?date={{vars.reportDate}}",
            status: 200,
            saveResponseAs: "output/report.txt"  // ✅ 相对路径
        },

        {
            name: "✅ 安全：保存到项目内的子目录",
            method: "GET",
            path: "https://mock.local/report?date={{vars.reportDate}}",
            status: 200,
            saveResponseAs: "output/reports/result.txt"  // ✅ 允许
        }

        // ❌ 以下路径会被路径验证拒绝（演示用，实际运行会失败）

        // {
        //     name: "❌ 不安全：绝对路径",
        //     method: "GET",
        //     path: "https://mock.local/report",
        //     status: 200,
        //     saveResponseAs: "/etc/passwd"  // ❌ 绝对路径
        // },

        // {
        //     name: "❌ 不安全：路径遍历",
        //     method: "GET",
        //     path: "https://mock.local/report",
        //     status: 200,
        //     saveResponseAs: "../../../tmp/evil.txt"  // ❌ 路径遍历
        // },

        // {
        //     name: "❌ 不安全：访问系统文件",
        //     method: "GET",
        //     path: "https://mock.local/report",
        //     status: 200,
        //     saveResponseAs: "C:\\Windows\\System32\\evil.txt"  // ❌ 系统路径
        // }
    ]
}));

// 💡 v0.3.0 路径验证规则：
//
// ✅ 允许：
// - 相对路径（output/file.txt）
// - 子目录（output/sub/file.txt）
// - 当前目录（./file.txt）
//
// ❌ 拒绝：
// - 绝对路径（/etc/passwd, C:\Windows\...）
// - 路径遍历（../../../tmp/file）
// - 父目录访问（在配置目录外）
//
// 🔒 安全保障：
// 所有文件操作（响应保存 saveResponseAs、文件上传 request.fileUpload）都必须
// 在配置文件所在目录内，防止读取/写出系统文件，防止覆盖重要文件。

// 📝 错误示例：
//
// 如果尝试使用不安全的路径，会看到如下错误：
//
// 响应保存路径不安全: /etc/passwd
// 原因: 不允许使用绝对路径: /etc/passwd
// 提示: 保存路径必须在工作区内
//
// 响应保存路径不安全: ../../../tmp/evil.txt
// 原因: 路径越界: ../../../tmp/evil.txt
// 提示: 保存路径必须在工作区内
