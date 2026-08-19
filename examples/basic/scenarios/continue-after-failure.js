ScenarioTest.registerScenario("continue-after-failure", ScenarioTest.defineScenario({
    name: "失败后继续执行示例",
    failurePolicy: "continue",
    vars: {
        expectedStatus: "UP"
    },
    steps: [
        {
            name: "执行正常健康检查",
            method: "GET",
            path: "health",
            status: 200,
            assertions: [
                { name: "服务初始状态正常", path: "status", equals: "{{vars.expectedStatus}}" }
            ]
        },
        {
            name: "故意触发失败断言",
            method: "GET",
            path: "health",
            status: 200,
            assertions: [
                { name: "预期服务状态为 DOWN", path: "status", equals: "DOWN" }
            ]
        },
        {
            name: "失败后继续验证服务",
            method: "GET",
            path: "health",
            status: 200,
            assertions: [
                { name: "后续步骤仍正常执行", path: "status", equals: "{{vars.expectedStatus}}" }
            ]
        }
    ]
}));