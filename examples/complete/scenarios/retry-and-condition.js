ScenarioTest.registerScenario("retry-and-condition", ScenarioTest.defineScenario({
    name: "重试、提取和条件跳过",
    failurePolicy: "continue",
    vars: {
        taskId: "",
        shouldRunOptionalStep: false
    },
    steps: [
        {
            name: "创建异步任务",
            method: "POST",
            path: "tasks",
            status: 202,
            extract: [{ name: "taskId", path: "data.id" }]
        },
        {
            name: "轮询直到任务就绪",
            method: "GET",
            path: "tasks/{{vars.taskId}}",
            status: 200,
            retryUntil: { maxAttempts: 3, intervalMs: 50 },
            assertions: [{ name: "任务状态为 READY", path: "data.status", equals: "READY" }]
        },
        {
            name: "条件不满足时跳过",
            when: { from: "vars", path: "shouldRunOptionalStep", equals: true },
            method: "GET",
            path: "optional",
            status: 200
        },
        {
            name: "故意失败但继续执行",
            method: "GET",
            path: "health",
            status: 200,
            assertions: [{ name: "示范失败断言", path: "status", equals: "DOWN" }]
        },
        {
            name: "失败后仍会执行",
            method: "GET",
            path: "health",
            status: 200,
            assertions: [{ name: "服务仍然正常", path: "status", equals: "UP" }]
        }
    ]
}));
