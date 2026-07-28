ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    envs: [
        { key: "mock", name: "Mock 环境", baseUrl: "https://mock.local" }
    ],
    defaultEnvKey: "mock",
    requestTimeoutMs: 5000,
    vars: {
        expectedStatus: "UP"
    },
    variables: [
        { name: "exampleToken", label: "示例 Token", defaultValue: "" },
        { name: "expectedStatus", label: "期望状态", defaultValue: "" }
    ],
    scenarios: [
        { id: "health", name: "健康检查示例", url: "scenarios/health.js" },
        { id: "slow", name: "取消请求示例", url: "scenarios/slow.js" }
    ]
}));
