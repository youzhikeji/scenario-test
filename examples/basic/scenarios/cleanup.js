ScenarioTest.registerScenario("cleanup", ScenarioTest.defineScenario({
    name: "条件清理示例",
    vars: { cleanupId: "" },
    steps: [
        { name: "仅当提取到 ID 时删除", when: { from: "vars", path: "cleanupId", exists: true }, method: "DELETE", path: "records/{{vars.cleanupId}}" }
    ]
}));