ScenarioTest.registerScenario("manual-login", ScenarioTest.defineScenario({
    name: "手动登录与受保护请求",
    envVars: {
        demoAccount: "DEMO_ACCOUNT",
        demoPassword: "DEMO_PASSWORD"
    },
    vars: {
        sessionToken: "",
        orderId: ""
    },
    steps: [
        {
            name: "用户自定义登录步骤",
            method: "POST",
            path: "login",
            request: {
                body: {
                    account: "{{vars.demoAccount}}",
                    password: "{{vars.demoPassword}}"
                }
            },
            status: 200,
            extract: [{ name: "sessionToken", path: "data.token" }],
            assertions: [{ name: "返回会话 Token", path: "data.token", exists: true }]
        },
        {
            name: "使用提取的 Token 创建订单",
            method: "POST",
            path: "orders",
            request: {
                headers: { Authorization: "Bearer {{vars.sessionToken}}" },
                body: { product: "scenario-test", quantity: 1 }
            },
            status: 201,
            extract: [{ name: "orderId", path: "data.id" }],
            assertions: [{ name: "订单 ID 已生成", path: "data.id", exists: true }]
        },
        {
            name: "读取刚创建的订单",
            method: "GET",
            path: "orders/{{vars.orderId}}",
            request: { headers: { Authorization: "Bearer {{vars.sessionToken}}" } },
            status: 200,
            assertions: [
                { name: "商品匹配", path: "data.product", equals: "scenario-test" },
                { name: "数量匹配", path: "data.quantity", equals: 1 }
            ]
        }
    ]
}));
