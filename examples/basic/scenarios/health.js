ScenarioTest.registerScenario("health", ScenarioTest.defineScenario({
    name: "健康检查示例",
    vars: {
        expectedStatus: "UP"
    },
    steps: [
        {
            name: "服务健康",
            method: "GET",
            path: "health",
            status: 200,
            assertions: [
                { name: "业务状态正常", path: "status", equals: "{{vars.expectedStatus}}" }
            ]
        }
    ]
}));
