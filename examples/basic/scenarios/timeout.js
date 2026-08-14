ScenarioTest.registerScenario("timeout", ScenarioTest.defineScenario({
    name: "超时请求示例",
    steps: [
        {
            name: "超时步骤",
            method: "GET",
            path: "slow",
            timeoutMs: 500,
            request: {
                headers: { "X-Timeout-Check": "diagnostic" }
            }
        }
    ]
}));
