// scenario-test DSL Contract —— 三方能力发现的唯一事实来源
//
// 本模块是运行时（core/registry/engine/cli）与对外投影
// （capabilities 命令、dist/scenario-test-capabilities.json、scenario-test.d.ts、
//  init 生成的 AI Prompt / Patterns / README、doctor 版本握手）共同消费的
// 机器可读契约。README / AI Prompt 只能描述 contract，不能反向驱动代码。
//
// 规则：
//   - contract 一旦发布即不可变；新增能力时递增 contractVersion 并保留旧字段。
//   - 不要在本模块手写 runtime 版本，统一复用 version.generated.js 的 VERSION。
import { VERSION } from "./version.generated.js";

export const CONTRACT_VERSION = 1;

export const contract = Object.freeze({
    contractVersion: CONTRACT_VERSION,
    runtimeVersion: VERSION,

    // 运行时要求（与 package.json engines 保持一致，doctor 据此校验 Node 版本）
    engines: Object.freeze({ node: ">=18" }),

    assertions: Object.freeze({
        // 断言对象允许的元数据键（非操作符键）
        metaKeys: Object.freeze(["name", "path", "from", "target", "header", "implicit"]),
        // 断言操作符：键为操作符名；valueType 描述期望值类型约束，
        // finiteNumber 表示实际值与期望值都必须是有限 number（不做字符串隐式转换）
        operators: Object.freeze({
            exists: Object.freeze({
                description: "字段存在且非 null/空串（exists: true），或不存在（exists: false）",
                valueType: "boolean"
            }),
            equals: Object.freeze({
                description: "实际值与期望值 JSON 深比较相等",
                valueType: "any"
            }),
            notEquals: Object.freeze({
                description: "实际值与期望值 JSON 深比较后取反",
                valueType: "any"
            }),
            includes: Object.freeze({
                description: "数组包含期望项，或字符串包含期望子串",
                valueType: "any"
            }),
            matches: Object.freeze({
                description: "正则表达式匹配字符串化后的实际值",
                valueType: "string"
            }),
            oneOf: Object.freeze({
                description: "实际值属于期望候选数组之一（深比较）",
                valueType: "array"
            }),
            gt: Object.freeze({
                description: "实际值大于期望值",
                valueType: "finiteNumber"
            }),
            gte: Object.freeze({
                description: "实际值大于等于期望值",
                valueType: "finiteNumber"
            }),
            lt: Object.freeze({
                description: "实际值小于期望值",
                valueType: "finiteNumber"
            }),
            lte: Object.freeze({
                description: "实际值小于等于期望值",
                valueType: "finiteNumber"
            })
        }),
        // 只接受有限 number 的操作符（与 operators 中 valueType: "finiteNumber" 一致）
        numericOperators: Object.freeze(["gt", "gte", "lt", "lte"])
    }),

    when: Object.freeze({
        // when 对象形式支持的来源：仅 vars；不允许 body/status/header 条件
        sources: Object.freeze(["vars"]),
        note: "when 对象形式只允许 from: \"vars\"；非对象形式（模板字符串/布尔）保持真值语义"
    }),

    extract: Object.freeze({
        // extract 支持的来源（默认 body）
        from: Object.freeze(["body", "headers", "bodyText", "response"]),
        // required 语义：路径不存在时 required: true 使当前步骤失败，默认缺失产生 warning
        required: "boolean",
        note: "required: true 且路径不存在时当前步骤失败；默认缺失产生 warning（不含响应内容），变量为 undefined"
    }),

    // 运行时自动生成的保留变量：禁止在 vars/envVars/generatedVars/extract 中声明或覆盖
    reservedVars: Object.freeze(["runId", "runNo"]),

    generatedVars: Object.freeze({
        types: Object.freeze(["timestamp", "uuidHex", "md5", "signature"])
    }),

    globals: Object.freeze({
        // 全局参数类型：追加到每个请求的 header / cookie / query
        types: Object.freeze(["header", "cookie", "query"]),
        note: "全局参数支持 header / cookie / query 三种类型，步骤显式声明或 URL 已有同名参数优先"
    }),

    config: Object.freeze({
        // 配置中 scenarios 清单项的字段（file/path 为 url 的兼容回退，不写入契约字段）
        scenarioItemKeys: Object.freeze(["id", "name", "url", "manual"]),
        environmentKeys: Object.freeze(["key", "name", "baseUrl", "globals"]),
        variableKeys: Object.freeze(["name", "label", "env", "required", "defaultValue"]),
        manual: Object.freeze({
            type: "boolean",
            note: "manual: true 表示场景需要人工准备数据或写数据，--all 默认排除，--scenario <id> 可显式执行"
        })
    }),

    scenario: Object.freeze({
        keys: Object.freeze(["name", "steps", "vars", "envVars", "generatedVars", "failurePolicy"]),
        stepKeys: Object.freeze([
            "name", "method", "path", "params", "request", "status",
            "assertions", "extract", "when", "retryUntil", "timeoutMs",
            "saveResponseAs", "adapter"
        ]),
        failurePolicies: Object.freeze(["stop", "continue"])
    }),

    cli: Object.freeze({
        commands: Object.freeze(["run", "serve", "init", "capabilities", "doctor"]),
        options: Object.freeze({
            config: { kind: "value", prop: "config", description: "场景配置文件" },
            env: { kind: "value", prop: "env", description: "配置中的环境 key" },
            "base-url": { kind: "value", prop: "baseUrl", description: "临时覆盖 Base URL" },
            scenario: { kind: "value", prop: "scenario", description: "执行指定场景（可执行 manual:true 场景）" },
            port: { kind: "value", prop: "port", parse: "number", description: "浏览器服务端口，默认 4300" },
            project: { kind: "value", prop: "project", description: "init 目标项目根目录" },
            dir: { kind: "value", prop: "dir", description: "init 场景测试目录名" },
            "library-url": { kind: "value", prop: "libraryUrl", description: "init 时 UMD 下载地址" },
            all: { kind: "flag", prop: "all", description: "执行配置中的全部自动场景（默认排除 manual:true）" },
            force: { kind: "flag", prop: "force", description: "init 强制覆盖已有文件" },
            "fail-on-skip": { kind: "flag", prop: "failOnSkip", description: "存在任何 SKIP 步骤时最终退出码为 1" },
            "allow-external-plugins": { kind: "flag", prop: "allowExternalPlugins", description: "允许加载外部插件（有安全风险）" },
            json: { kind: "flag", prop: "json", description: "capabilities/doctor 输出机器可读 JSON（stdout 纯净）" },
            token: {
                kind: "value", prop: "authorization",
                aliases: ["authorization"],
                description: "（已弃用）命令行传递授权令牌；推荐 SCENARIO_AUTH 环境变量"
            }
        })
    })
});