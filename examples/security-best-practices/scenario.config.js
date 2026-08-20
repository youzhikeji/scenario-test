ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    envs: [
        { key: "prod", name: "示例 API", baseUrl: "https://api.example.com" }
    ],
    defaultEnvKey: "prod",

    // ✅ 推荐：使用环境变量映射
    // 从环境变量 SCENARIO_AUTH 读取授权令牌
    // 使用方式：export SCENARIO_AUTH="Bearer your-token"

    envVars: {
        // 场景变量名: 环境变量名
        apiKey: "DEMO_API_KEY",
        apiSecret: "DEMO_API_SECRET"
    },

    // ❌ 不推荐：硬编码凭据（永远不要这样做！）
    // vars: {
    //     apiKey: "AK_1234567890",
    //     apiSecret: "SK_0987654321"
    // },

    scenarios: [
        { id: "secure-auth", url: "scenarios/secure-auth.js" },
        { id: "safe-paths", url: "scenarios/safe-paths.js" },
        { id: "error-handling", url: "scenarios/error-handling.js" }
    ]
}));
