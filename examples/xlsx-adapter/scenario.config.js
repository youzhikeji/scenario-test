ScenarioTest.registerConfig(ScenarioTest.defineConfig({
    baseUrl: "https://mock-api.example.com",
    vars: {
        reportMonth: "2026-08",
        reportYear: "2026"
    },
    scenarios: [
        { id: "sales-report", url: "scenarios/sales-report.js" },
        { id: "user-list", url: "scenarios/user-list.js" }
    ]
}));
