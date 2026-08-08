ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    baseUrl: "https://mock-api.example.com",
    globals: [
        { type: "header", name: "Authorization", value: "Bearer {{vars.accessToken}}" },
        { type: "query", name: "channel", value: "scenario-test" }
    ],
    vars: {
        accessToken: "",
        reportMonth: "2026-08",
        reportYear: "2026"
    },
    scenarios: [
        { id: "sales-report", url: "scenarios/sales-report.js" },
        { id: "user-list", url: "scenarios/user-list.js" }
    ]
}));
