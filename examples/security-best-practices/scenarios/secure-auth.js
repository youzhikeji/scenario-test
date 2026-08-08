ScenarioTest.registerScenario("secure-auth", ScenarioTest.defineScenario({
    name: "安全的认证方式",

    // ✅ 推荐：使用环境变量
    envVars: {
        apiKey: "DEMO_API_KEY",
        apiSecret: "DEMO_API_SECRET"
    },

    // 用于存储生成的签名和时间戳
    vars: {
        timestamp: "",
        signature: ""
    },

    // 生成变量：时间戳和签名
    generatedVars: [
        { type: "timestamp", name: "timestamp" },
        {
            type: "signature",
            name: "signature",
            secretVar: "apiSecret",
            params: {
                apiKey: "apiKey",
                timestamp: "timestamp"
            }
        }
    ],

    steps: [
        {
            name: "✅ 使用环境变量进行认证",
            method: "POST",
            path: "api/auth/login",
            request: {
                headers: {
                    // 使用从环境变量读取的 API Key
                    "X-API-Key": "{{vars.apiKey}}",
                    "X-Timestamp": "{{vars.timestamp}}",
                    "X-Signature": "{{vars.signature}}"
                }
            },
            status: 200,
            assertions: [
                { name: "认证成功", path: "success", equals: true }
            ]
        },

        {
            name: "✅ 使用 SCENARIO_AUTH 环境变量",
            method: "GET",
            path: "api/user/profile",
            request: {
                // Authorization 头会自动从 SCENARIO_AUTH 环境变量读取
                // 不需要在这里显式指定
            },
            status: 200
        }
    ]
}));

// 💡 使用说明：
//
// 1. 设置环境变量：
//    export SCENARIO_AUTH="Bearer your-token"
//    export DEMO_API_KEY="your-api-key"
//    export DEMO_API_SECRET="your-api-secret"
//
// 2. 运行场景：
//    node ../../dist/scenario-test-cli.cjs \
//      --config scenario.config.js \
//      --scenario secure-auth
//
// 3. 凭据永远不会出现在代码中！

// ⚠️ 对比不安全的做法：
//
// ❌ 不要这样做：
// {
//     vars: {
//         apiKey: "AK_deb71f1234567890",  // 硬编码
//         apiSecret: "SK_W6HL9876543210"  // 会提交到 Git
//     }
// }
//
// ❌ 不要这样做：
// node cli.cjs --authorization "Bearer secret-token"  // 暴露在进程列表
