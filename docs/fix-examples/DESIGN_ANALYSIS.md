# scenario-test 插件/适配器设计分析

## 📊 设计复杂度评估：⭐⭐⭐ (中等偏简单)

**结论**: 设计相对**简单且实用**，但有一些可以优化的地方。

---

## ✅ 设计优点

### 1. **简单直观的核心概念**

**适配器模式清晰**:
```javascript
{
  matches(step) {
    return Boolean(step.prepareXlsx);  // 简单判断
  },
  async execute({ step, runtime }) {
    // 执行逻辑
  }
}
```

✅ **好处**:
- 一看就懂
- 易于扩展
- 符合单一职责原则

### 2. **最小化的插件 API**

插件只需要返回两个可选字段：
```javascript
export default function myPlugin(api) {
  return {
    adapters: { ... },      // 可选：提供适配器
    transformScenario: ...  // 可选：场景转换
  };
}
```

✅ **好处**:
- 学习曲线低
- 不强制实现不需要的方法
- 灵活性高

### 3. **约定优于配置**

```javascript
// 自动识别步骤类型
{
  prepareXlsx: { ... }  // 自动匹配 xlsx 适配器
}

// vs 显式指定（不需要）
{
  adapter: "xlsx",
  config: { ... }
}
```

✅ **好处**:
- DSL 更简洁
- 用户无需了解内部机制

### 4. **渐进式增强**

```javascript
// 基础使用 - 不需要插件
{ method: "GET", path: "/api/users" }

// 中级使用 - 内置适配器
{ prepareXlsx: { template: "...", output: "..." } }

// 高级使用 - 自定义插件
{ myCustomStep: { ... } }  // 通过插件支持
```

✅ **好处**:
- 初学者不被插件系统吓到
- 高级用户有扩展能力

---

## ❌ 设计问题

### 1. **插件加载时机不清晰**

**当前实现**:
```javascript
// src/cli.js:261
const plugins = await loadPlugins(config, configDir, options);
const adapters = { xlsx: createXlsxAdapter({ workspace: configDir }) };
for (const plugin of plugins) Object.assign(adapters, plugin?.adapters || {});
```

**问题**:
- ❌ XLSX 适配器硬编码在 CLI 中
- ❌ 插件适配器通过 `Object.assign` 合并，可能覆盖内置适配器
- ❌ 没有优先级机制

**影响**:
```javascript
// 用户插件可能意外覆盖内置 xlsx 适配器
export default function myPlugin() {
  return {
    adapters: {
      xlsx: { ... }  // 覆盖了内置实现！
    }
  };
}
```

**建议修复**:
```javascript
// 明确的优先级：插件 > 内置
const builtinAdapters = { xlsx: createXlsxAdapter(...) };
const pluginAdapters = {};
for (const plugin of plugins) {
  Object.assign(pluginAdapters, plugin?.adapters || {});
}
const adapters = { ...builtinAdapters, ...pluginAdapters };
// 现在插件可以显式覆盖内置适配器
```

### 2. **适配器注册机制未使用**

**registry.js 中定义了注册函数**:
```javascript
export function registerAdapter(name, adapter) {
    invariant(typeof name === "string" && name.trim(), "适配器名称不能为空");
    invariant(adapter && typeof adapter.execute === "function", `适配器 ${name} 缺少 execute`);
    adapterRegistry.set(name, adapter);
    return adapter;
}

export function listAdapters() {
    return new Map(adapterRegistry);
}
```

**但实际没有使用**:
```javascript
// cli.js 中直接管理适配器对象
const adapters = { xlsx: createXlsxAdapter(...) };
// 没有调用 registerAdapter()
```

**问题**:
- ❌ 注册机制存在但未使用（死代码）
- ❌ 浏览器和 Node 环境可能使用不同的适配器集合
- ❌ 无法在运行时查询可用适配器

**建议**:
1. **选项 A - 移除注册机制**（简化）
   ```javascript
   // 删除 registry.js 中的 adapter 相关代码
   // 直接在 engine 中使用传入的 adapters 对象
   ```

2. **选项 B - 真正使用注册机制**（规范化）
   ```javascript
   // 初始化时注册
   registerAdapter("xlsx", createXlsxAdapter(...));
   
   // 运行时查询
   const adapter = getAdapter("xlsx");
   ```

### 3. **插件 API 暴露不一致**

**当前**:
```javascript
// src/cli.js:198
const pluginApi = { ...ScenarioTest, readWorkbookRows };
```

**问题**:
- ❌ `readWorkbookRows` 是后来手动添加的
- ❌ 未来添加工具函数需要手动修改这行
- ❌ 浏览器环境和 Node 环境 API 不同（浏览器没有 `readWorkbookRows`）

**建议**:
```javascript
// 统一的插件 API 构建
function createPluginApi(platform) {
  const api = { ...ScenarioTest };
  
  if (platform === 'node') {
    api.readWorkbookRows = readWorkbookRows;
    api.fs = fs;  // 可能需要的 Node.js 功能
    api.path = path;
  }
  
  return api;
}
```

### 4. **适配器选择逻辑简单**

**当前实现** (src/engine.js):
```javascript
function chooseAdapter(step, adapters) {
    for (const adapter of Object.values(adapters)) {
        if (typeof adapter?.matches === "function" && adapter.matches(step)) return adapter;
    }
    return null;
}
```

**问题**:
- ❌ 返回第一个匹配的适配器（无优先级）
- ❌ 如果多个适配器都匹配，无法选择
- ❌ 无法处理冲突

**示例冲突场景**:
```javascript
// 两个插件都匹配 prepareXlsx
const adapters = {
  xlsx: { matches: (step) => step.prepareXlsx },
  excelPro: { matches: (step) => step.prepareXlsx }  // 更强大的实现
};

// 用户无法指定使用哪个
```

**建议修复**:
```javascript
// 选项 1: 显式指定适配器
{
  name: "生成 Excel",
  adapter: "excelPro",  // 明确指定
  prepareXlsx: { ... }
}

// 选项 2: 优先级系统
const adapter = {
  priority: 10,  // 数字越大优先级越高
  matches: (step) => step.prepareXlsx
};
```

### 5. **transformScenario 缺少上下文**

**当前**:
```javascript
async function transformScenario(scenario, context, plugins) {
    let transformed = scenario;
    for (const plugin of plugins) {
        if (typeof plugin?.transformScenario === "function") {
            transformed = await plugin.transformScenario(transformed, context);
        }
    }
    return transformed;
}
```

**问题**:
- ❌ `context` 只包含 `{ config, environment }`
- ❌ 插件无法访问 `vars`、`adapters` 等运行时信息
- ❌ 转换是顺序执行，可能有依赖问题

**建议**:
```javascript
// 提供更丰富的上下文
const context = {
  config,
  environment,
  vars: runtime.vars,
  adapters,
  platform: 'node',  // or 'browser'
  version: VERSION
};
```

---

## 🎯 设计理念分析

### 当前设计遵循：

1. **KISS 原则** (Keep It Simple, Stupid) ✅
   - 核心概念少（只有 adapter 和 transform）
   - API 简单直观

2. **约定优于配置** ✅
   - 自动匹配适配器
   - 不需要显式注册

3. **渐进式增强** ✅
   - 基础功能不需要插件
   - 高级功能通过插件扩展

### 但缺少：

4. **一致性原则** ❌
   - 注册机制定义了但没用
   - 内置适配器和插件适配器处理不一致

5. **可预测性** ⚠️
   - 适配器选择顺序不明确
   - 插件加载优先级不清晰

---

## 💡 改进建议（按优先级）

### 🔴 高优先级（影响使用）

**1. 明确适配器优先级**
```javascript
// 方案：显式指定或警告冲突
function chooseAdapter(step, adapters) {
    const matched = Object.entries(adapters)
        .filter(([name, adapter]) => adapter?.matches?.(step))
        .map(([name, adapter]) => ({ name, adapter }));
    
    if (matched.length > 1) {
        console.warn(
            `步骤 "${step.name}" 匹配多个适配器: ${matched.map(m => m.name).join(', ')}\n` +
            `使用第一个: ${matched[0].name}`
        );
    }
    
    return matched[0]?.adapter || null;
}
```

**2. 统一插件 API 构建**
```javascript
function createPluginApi(options = {}) {
    const api = {
        ...ScenarioTest,
        platform: options.platform || 'node',
        version: VERSION
    };
    
    // Node.js 特有功能
    if (options.platform === 'node') {
        api.readWorkbookRows = readWorkbookRows;
        api.path = path;
    }
    
    return Object.freeze(api);  // 防止插件修改
}
```

### 🟡 中优先级（改进体验）

**3. 移除或使用适配器注册机制**

**选项 A - 移除**（推荐，更简单）:
```javascript
// 删除 registry.js 中的：
// - registerAdapter()
// - getAdapter()
// - listAdapters()
// - adapterRegistry

// 理由：当前设计中适配器是运行时传递的，不需要全局注册
```

**选项 B - 完整使用**（更规范，但复杂）:
```javascript
// 启动时注册所有适配器
registerAdapter('xlsx', createXlsxAdapter(...));
registerAdapter('pdf', createPdfAdapter(...));

// 运行时查询
const adapters = Object.fromEntries(listAdapters());
```

**4. 丰富 transformScenario 上下文**
```javascript
const transformContext = {
    config,
    environment,
    vars: runtime.vars,
    adapters: Object.keys(adapters),
    platform: process ? 'node' : 'browser',
    version: VERSION
};
```

### 🟢 低优先级（锦上添花）

**5. 插件生命周期钩子**
```javascript
export default function myPlugin(api) {
    return {
        // 可选：初始化
        async onInit(context) {
            console.log('插件初始化');
        },
        
        // 可选：场景开始前
        async onBeforeScenario(scenario, context) {
            // 准备工作
        },
        
        // 可选：场景结束后
        async onAfterScenario(result, context) {
            // 清理工作
        },
        
        adapters: { ... },
        transformScenario: ...
    };
}
```

**6. 插件元数据**
```javascript
export default function myPlugin(api) {
    return {
        meta: {
            name: 'my-plugin',
            version: '1.0.0',
            description: '我的自定义插件'
        },
        adapters: { ... }
    };
}
```

---

## 📊 与其他测试框架对比

| 框架 | 插件复杂度 | 扩展能力 | 学习曲线 | scenario-test 对比 |
|------|-----------|---------|---------|------------------|
| **Postman** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中 | scenario-test 更简单 |
| **Playwright** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 高 | scenario-test 简单很多 |
| **REST Assured** | ⭐⭐⭐ | ⭐⭐⭐⭐ | 中 | 类似复杂度 |
| **Karate DSL** | ⭐⭐ | ⭐⭐⭐ | 低 | scenario-test 类似 |
| **scenario-test** | ⭐⭐⭐ | ⭐⭐⭐ | 低 | 平衡点不错 |

---

## 🎬 最终评价

### 设计哲学：✅ 简单实用主义

**适合**:
- ✅ 快速上手
- ✅ 满足 80% 的使用场景
- ✅ 易于理解和维护

**不适合**:
- ❌ 极度复杂的插件生态
- ❌ 需要精细控制的场景
- ❌ 企业级插件市场

### 总结

**当前设计评分**: 7/10

**优点**:
- ✅ 核心概念清晰（适配器 + 转换器）
- ✅ API 简单直观
- ✅ 满足基本扩展需求
- ✅ 学习曲线低

**缺点**:
- ⚠️ 适配器注册机制未使用（混乱）
- ⚠️ 优先级和冲突处理不明确
- ⚠️ 插件 API 不够一致

### 建议

**短期**（v0.3.0 之后）:
1. 移除未使用的注册机制
2. 添加适配器冲突警告
3. 统一插件 API 构建

**长期**（v0.4.0+）:
1. 考虑添加生命周期钩子
2. 插件元数据和版本管理
3. 官方插件市场

**结论**: 设计**不算复杂**，反而是**适度简化**了。对于当前项目规模（轻量级测试库）来说，这个设计是**合适的**。但随着生态发展，未来可能需要一些标准化改进。
