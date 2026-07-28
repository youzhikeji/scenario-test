ScenarioTest.registerScenario("slow", ScenarioTest.defineScenario({
    name: "取消请求示例",
    steps: [
        {
            name: "等待慢请求",
            method: "GET",
            path: "slow",
            status: 200
        }
    ]
}));
