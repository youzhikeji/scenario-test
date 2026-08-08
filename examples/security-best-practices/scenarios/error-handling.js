ScenarioTest.registerScenario("error-handling", ScenarioTest.defineScenario({
    name: "安全的错误处理",

    // ✅ 推荐：生产模式不显示详细信息
    // 设置环境变量：SCENARIO_VERBOSE_ERRORS=false（默认）

    envVars: {
        apiKey: "DEMO_API_KEY",
        apiSecret: "DEMO_API_SECRET"
    },

    steps: [
        {
            name: "✅ 缺少环境变量时的错误处理",
            method: "POST",
            path: "api/secure-endpoint",
            request: {
                headers: {
                    "X-API-Key": "{{vars.apiKey}}",
                    "X-API-Secret": "{{vars.apiSecret}}"
                }
            },
            status: 200
        },

        {
            name: "✅ 带超时保护的重试（v0.3.0）",
            method: "GET",
            path: "api/unstable-endpoint",
            retryUntil: {
                maxAttempts: 5,
                intervalMs: 1000,
                maxElapsedMs: 10000  // ✅ 总超时 10 秒（v0.3.0 新增）
            },
            status: 200
        }
    ]
}));

// 💡 v0.3.0 错误处理改进：
//
// 1. 环境变量名遮蔽
//    生产模式下，错误消息不会暴露环境变量名
//
//    开发模式（SCENARIO_VERBOSE_ERRORS=true）：
//    ❌ 缺少场景变量: vars.apiKey
//       环境变量映射: PROD_API_KEY
//       提示: 在配置中设置 vars.apiKey 或设置环境变量 PROD_API_KEY
//
//    生产模式（默认）：
//    ✅ 缺少必需的场景变量: vars.apiKey
//       提示: 请在配置文件的 vars 中设置该变量，或通过环境变量提供
//       详细信息可通过设置 SCENARIO_VERBOSE_ERRORS=true 查看
//
// 2. 统一的错误格式
//    所有错误消息使用三段式格式：
//    - 问题：发生了什么
//    - 原因：为什么发生
//    - 提示：如何解决
//
// 3. 重试超时保护
//    默认 5 分钟总超时
//    最小 100ms 重试间隔
//    防止无限重试

// 🔒 安全注意事项：
//
// 1. 日志中脱敏
//    ✅ 不要记录完整的 API Key
//    ✅ 不要记录密码
//    ✅ 使用 "***" 或只显示前几位
//
// 2. 错误消息
//    ✅ 生产环境使用通用错误消息
//    ❌ 不要暴露内部路径
//    ❌ 不要暴露数据库结构
//    ❌ 不要暴露环境变量名
//
// 3. 超时设置
//    ✅ 设置合理的超时时间
//    ✅ 使用 maxElapsedMs 防止无限重试
//    ❌ 不要使用过长的超时（资源泄露）

// 📝 错误处理最佳实践：
//
// 场景 1: API Key 缺失
// if (!apiKey) {
//     // ✅ 好的错误消息
//     throw new Error("API Key 未配置，请设置环境变量");
//
//     // ❌ 不好的错误消息
//     throw new Error("PROD_API_KEY environment variable is missing");
// }
//
// 场景 2: 文件路径错误
// if (pathOutsideWorkspace(path)) {
//     // ✅ 好的错误消息
//     throw new Error("文件路径不安全，请使用相对路径");
//
//     // ❌ 不好的错误消息（泄露内部路径）
//     throw new Error(`Path ${path} is outside ${workspacePath}`);
// }

// 🎯 开发 vs 生产：
//
// 开发环境：
// export SCENARIO_VERBOSE_ERRORS=true  // 显示详细错误
// export NODE_ENV=development
//
// 生产环境：
// # SCENARIO_VERBOSE_ERRORS=false（默认）
// export NODE_ENV=production
