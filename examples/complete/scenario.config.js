ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    envs: [
        { key: "mock", name: "本地 Mock", baseUrl: "http://127.0.0.1:4310" }
    ],
    defaultEnvKey: "mock",
    storagePrefix: "scenario-test.example-complete",
    requestTimeoutMs: 5000,
    variables: [
        { name: "demoAccount", label: "示例账号", env: "DEMO_ACCOUNT", defaultValue: "demo" },
        { name: "demoPassword", label: "示例密码", env: "DEMO_PASSWORD", defaultValue: "demo-password" }
    ],
    scenarios: [
        { id: "manual-login", name: "手动登录与受保护请求", url: "scenarios/manual-login.js" },
        { id: "retry-and-condition", name: "重试、提取和条件跳过", url: "scenarios/retry-and-condition.js" }
    ]
}));
