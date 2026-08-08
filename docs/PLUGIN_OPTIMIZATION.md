# 插件机制优化总结（内部版）

## 优化内容

本次优化主要针对内部团队使用场景，增强了适配器的可维护性和可靠性。

### 1. **作用域隔离** - 多引擎实例支持

**问题**：全局注册表导致多引擎实例间适配器污染

**解决方案**：
- 每个 `createEngine()` 默认创建独立的适配器注册表
- 支持 `isolateAdapters: false` 使用全局注册表

```javascript
// 引擎 A 有独立的适配器
const engineA = createEngine({
    adapters: { custom: adapterA }
});

// 引擎 B 不受影响
const engineB = createEngine({
    adapters: { custom: adapterB }
});
```

---

### 2. **完整生命周期** - 初始化与清理

**问题**：适配器无法管理长生命周期资源（数据库连接池、MQ 连接等）

**解决方案**：
- `initialize()` - 注册时调用，初始化资源
- `dispose()` - 卸载时调用，清理资源
- `unregisterAdapter(name)` 和 `clearAdapters()` 支持安全清理

```javascript
const dbAdapter = {
    initialize() {
        this.pool = mysql.createPool(config);
    },
    async execute({ step }) {
        const [rows] = await this.pool.execute(step.sql);
        return { response: { status: 200, body: { rows } } };
    },
    dispose() {
        this.pool?.end();
    }
};

registerAdapter("database", dbAdapter);
// 自动调用 initialize()

unregisterAdapter("database");
// 自动调用 dispose()
```

---

### 3. **钩子支持** - 前置/后置/错误处理

**问题**：无法统一处理日志、验证、清理等横切关注点

**解决方案**：
- `beforeExecute()` - 执行前钩子（日志、验证）
- `afterExecute()` - 执行后钩子（后处理、清理）
- `onError()` - 错误处理钩子（告警、回滚）

```javascript
const adapter = {
    async beforeExecute({ step }) {
        console.log(`执行步骤: ${step.name}`);
    },
    async execute({ step }) {
        return { response: { status: 200 } };
    },
    async afterExecute({ output }) {
        console.log("步骤完成");
        return output;
    },
    async onError({ error }) {
        console.error("步骤失败", error);
    }
};
```

---

### 4. **错误标准化** - AdapterExecutionError

**问题**：适配器异常无法区分来源，调试困难

**解决方案**：
- 统一包装为 `AdapterExecutionError`
- 携带 `adapterName`、`stepName`、`originalError`

```javascript
try {
    await engine.runScenario(scenario);
} catch (error) {
    if (error.name === "AdapterExecutionError") {
        console.log("适配器:", error.adapterName);
        console.log("步骤:", error.stepName);
        console.log("原始错误:", error.originalError);
    }
}
```

---

### 5. **类型验证** - 运行时协议校验

**问题**：错误的适配器实现在运行时才暴露问题

**解决方案**：
- `validateAdapter()` 在注册时校验协议
- 检查必需的 `execute` 和可选方法的类型
- 更友好的错误提示

```javascript
// ❌ 会在注册时立即报错
registerAdapter("bad", {
    execute: "not a function"  // 类型错误
});

// Error: 适配器 bad 验证失败:
//   - execute 必须是函数
```

---

## 新增 API

### 核心增强

- `src/adapter-types.js` - 适配器验证与工具函数
- `unregisterAdapter(name)` - 卸载适配器并清理资源
- `clearAdapters()` - 清理所有适配器

### 文档

- `docs/ADAPTER_GUIDE.md` - 内部适配器开发指南
- `docs/INTERNAL_USAGE_GUIDE.md` - 内部使用指南
- `docs/PLUGIN_OPTIMIZATION.md` - 优化总结（本文档）

---

## 向后兼容

所有改动保持向后兼容：

```javascript
// ✅ 旧版本适配器仍可用
const oldAdapter = {
    matches(step) { return true; },
    async execute({ step }) {
        return { response: { status: 200 } };
    }
};

registerAdapter("old", oldAdapter);  // 仍然有效

// ✅ 新版本适配器享受新特性
const newAdapter = {
    initialize() { /* ... */ },
    matches(step) { return true; },
    async execute({ step }) {
        return { response: { status: 200 } };
    },
    dispose() { /* ... */ }
};

registerAdapter("new", newAdapter);  // 自动调用 initialize()
```

---

## 优化效果

| 优化项 | 改进前 | 改进后 |
|--------|--------|--------|
| **多实例隔离** | ❌ 全局污染 | ✅ 独立注册表 |
| **资源管理** | ❌ 手动管理 | ✅ 生命周期钩子 |
| **错误追踪** | ❌ 原始异常 | ✅ 包装错误 + 上下文 |
| **横切关注点** | ❌ 无支持 | ✅ 前置/后置/错误钩子 |
| **类型安全** | ❌ 运行时才发现 | ✅ 注册时验证 |
| **向后兼容** | - | ✅ 100% 兼容 |

---

## 设计原则

遵循 "保持简洁，仅修复明显缺陷" 的原则：

1. ✅ **最小侵入**：核心协议未变（`matches` + `execute`）
2. ✅ **渐进增强**：新特性为可选钩子，不破坏现有代码
3. ✅ **零学习成本**：旧适配器无需改动即可使用
4. ✅ **实用优先**：每个改进都解决真实痛点（资源泄漏、多实例冲突、错误追踪）

---

**详细使用指南见 `docs/ADAPTER_GUIDE.md` 和 `docs/INTERNAL_USAGE_GUIDE.md`。**

**问题**：全局注册表导致多引擎实例间适配器污染

**解决方案**：
- 每个 `createEngine()` 默认创建独立的适配器注册表
- 支持 `isolateAdapters: false` 使用全局注册表
- 实例级适配器通过 `engineOptions.adapters` 注入

```javascript
// 引擎 A 有独立的适配器
const engineA = createEngine({
    adapters: { custom: adapterA }
});

// 引擎 B 不受影响
const engineB = createEngine({
    adapters: { custom: adapterB }
});
```

---

### 2. **完整生命周期** - 初始化与清理

**问题**：适配器无法管理长生命周期资源（数据库连接池、MQ 连接等）

**解决方案**：
- `initialize()` - 注册时调用，初始化资源
- `dispose()` - 卸载时调用，清理资源
- `unregisterAdapter(name)` 和 `clearAdapters()` 支持安全清理

```javascript
const dbAdapter = {
    initialize() {
        this.pool = mysql.createPool(config);
    },
    async execute({ step }) {
        const [rows] = await this.pool.execute(step.sql);
        return { response: { status: 200, body: { rows } } };
    },
    dispose() {
        this.pool?.end();
    }
};

registerAdapter("database", dbAdapter);
// 自动调用 initialize()

unregisterAdapter("database");
// 自动调用 dispose()
```

---

### 3. **钩子支持** - 前置/后置/错误处理

**问题**：无法统一处理日志、验证、清理等横切关注点

**解决方案**：
- `beforeExecute()` - 执行前钩子（日志、验证）
- `afterExecute()` - 执行后钩子（后处理、清理）
- `onError()` - 错误处理钩子（告警、回滚）

```javascript
const adapter = {
    async beforeExecute({ step }) {
        console.log(`执行步骤: ${step.name}`);
    },
    async execute({ step }) {
        return { response: { status: 200 } };
    },
    async afterExecute({ output }) {
        console.log("步骤完成");
        return output;
    },
    async onError({ error }) {
        console.error("步骤失败", error);
    }
};
```

---

### 4. **错误标准化** - AdapterExecutionError

**问题**：适配器异常无法区分来源，调试困难

**解决方案**：
- 统一包装为 `AdapterExecutionError`
- 携带 `adapterName`、`stepName`、`originalError`

```javascript
try {
    await engine.runScenario(scenario);
} catch (error) {
    if (error.name === "AdapterExecutionError") {
        console.log("适配器:", error.adapterName);
        console.log("步骤:", error.stepName);
        console.log("原始错误:", error.originalError);
    }
}
```

---

### 5. **类型验证** - 运行时协议校验

**问题**：错误的适配器实现在运行时才暴露问题

**解决方案**：
- `validateAdapter()` 在注册时校验协议
- 检查必需的 `execute` 和可选方法的类型
- 更友好的错误提示

```javascript
// ❌ 会在注册时立即报错
registerAdapter("bad", {
    execute: "not a function"  // 类型错误
});

// Error: 适配器 bad 验证失败:
//   - execute 必须是函数
```

---

### 6. **工厂模式** - 简化配置注入

**问题**：适配器需要手动绑定配置，代码冗余

**解决方案**：
- `createAdapterFactory()` 辅助函数
- 自动绑定 `this` 和配置
- 自动调用 `initialize(config)`

```javascript
const createDbAdapter = createAdapterFactory({
    initialize(config) {
        this.pool = mysql.createPool(config);
    },
    async execute({ step }) {
        return { response: { status: 200 } };
    },
    dispose() {
        this.pool?.end();
    }
});

// 使用配置创建实例
registerAdapter("database", createDbAdapter({
    host: "localhost",
    user: "test"
}));
```

---

## 新增文件

### 核心文件

- `src/adapter-types.js` - 类型验证与工厂函数
- `docs/ADAPTER_GUIDE.md` - 完整开发指南

### 示例适配器

- `examples/adapters/database-adapter.js` - 数据库查询（MySQL）
- `examples/adapters/rabbitmq-adapter.js` - 消息队列（RabbitMQ）
- `src/adapters/xlsx-refactored.js` - 重构的 XLSX 适配器（使用工厂模式）

---

## 向后兼容

所有改动保持向后兼容：

```javascript
// ✅ 旧版本适配器仍可用
const oldAdapter = {
    matches(step) { return true; },
    async execute({ step }) {
        return { response: { status: 200 } };
    }
};

registerAdapter("old", oldAdapter);  // 仍然有效

// ✅ 新版本适配器享受新特性
const newAdapter = {
    initialize() { /* ... */ },
    matches(step) { return true; },
    async execute({ step }) {
        return { response: { status: 200 } };
    },
    dispose() { /* ... */ }
};

registerAdapter("new", newAdapter);  // 自动调用 initialize()
```

---

## 使用示例

### 基础用法（无变化）

```javascript
import ScenarioTest from "scenario-test";

const adapter = {
    matches(step) { return Boolean(step.custom); },
    async execute({ step }) {
        return { response: { status: 200, body: {} } };
    }
};

ScenarioTest.registerAdapter("custom", adapter);
```

### 完整生命周期

```javascript
import { createAdapterFactory } from "scenario-test/adapter-types";

const createDbAdapter = createAdapterFactory({
    initialize(config) {
        this.pool = mysql.createPool(config);
    },
    matches(step) {
        return Boolean(step.dbQuery);
    },
    async beforeExecute({ step }) {
        console.log(`SQL: ${step.dbQuery.sql}`);
    },
    async execute({ step }) {
        const [rows] = await this.pool.execute(step.dbQuery.sql);
        return {
            method: "SQL",
            response: { status: 200, body: { rows } }
        };
    },
    async afterExecute({ output }) {
        console.log(`返回 ${output.response.body.rows.length} 行`);
        return output;
    },
    async onError({ error }) {
        console.error("SQL 失败", error);
    },
    dispose() {
        this.pool?.end();
    }
});

ScenarioTest.registerAdapter("database", createDbAdapter({
    host: "localhost",
    user: "test",
    password: "test"
}));
```

### 引擎实例隔离

```javascript
// 全局共享适配器
ScenarioTest.registerAdapter("shared", sharedAdapter);

// 引擎 A 有独立的 custom 适配器
const engineA = ScenarioTest.createEngine({
    adapters: {
        custom: customAdapterA
    }
});

// 引擎 B 有不同的 custom 适配器
const engineB = ScenarioTest.createEngine({
    adapters: {
        custom: customAdapterB
    }
});

// 两个引擎都能访问 shared，但 custom 互不影响
```

---

## 优化效果

| 优化项 | 改进前 | 改进后 |
|--------|--------|--------|
| **多实例隔离** | ❌ 全局污染 | ✅ 独立注册表 |
| **资源管理** | ❌ 手动管理 | ✅ 生命周期钩子 |
| **错误追踪** | ❌ 原始异常 | ✅ 包装错误 + 上下文 |
| **横切关注点** | ❌ 无支持 | ✅ 前置/后置/错误钩子 |
| **类型安全** | ❌ 运行时才发现 | ✅ 注册时验证 |
| **配置注入** | ❌ 手动绑定 | ✅ 工厂模式 |
| **向后兼容** | - | ✅ 100% 兼容 |

---

## 设计原则

遵循 "保持简洁，仅修复明显缺陷" 的原则：

1. ✅ **最小侵入**：核心协议未变（`matches` + `execute`）
2. ✅ **渐进增强**：新特性为可选钩子，不破坏现有代码
3. ✅ **零学习成本**：旧适配器无需改动即可使用
4. ✅ **实用优先**：每个改进都解决真实痛点（资源泄漏、多实例冲突、错误追踪）

---

**完整示例见 `examples/adapters/` 和 `docs/ADAPTER_GUIDE.md`。**