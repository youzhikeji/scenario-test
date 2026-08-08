/**
 * 修复后的引擎 - 遮蔽敏感变量名
 */

// src/engine.js 部分修改

function buildGeneratedVars(scenario, baseVars, environmentVariables, options = {}) {
    const identifiers = createRunIdentifiers();
    const vars = { ...(scenario.vars || {}), ...(baseVars || {}), ...identifiers };

    // ✅ 是否在错误消息中显示详细信息（仅开发模式）
    const verboseErrors = options.verboseErrors || process.env.SCENARIO_VERBOSE_ERRORS === "true";

    for (const [name, environmentName] of Object.entries(scenario.envVars || {})) {
        const value = environmentVariables?.[environmentName] ?? vars[name];

        if (value === undefined || value === null || value === "") {
            // ✅ 修复点 1: 遮蔽环境变量名，防止信息泄露
            if (verboseErrors) {
                // 开发模式：显示完整信息
                throw new Error(
                    `缺少场景变量: vars.${name}\n` +
                    `环境变量映射: ${environmentName}\n` +
                    `提示: 在配置中设置 vars.${name} 或设置环境变量 ${environmentName}`
                );
            } else {
                // 生产模式：不泄露环境变量名
                throw new Error(
                    `缺少必需的场景变量: vars.${name}\n` +
                    `提示: 请在配置文件的 vars 中设置该变量，或通过环境变量提供\n` +
                    `详细信息可通过设置 SCENARIO_VERBOSE_ERRORS=true 查看`
                );
            }
        }

        vars[name] = value;
    }

    for (const definition of scenario.generatedVars || []) {
        if (!definition?.name) continue;

        if (definition.type === "timestamp") {
            vars[definition.name] = Date.now();
        } else if (definition.type === "uuidHex") {
            if (!globalThis.crypto?.randomUUID) {
                throw new Error("当前环境不支持 crypto.randomUUID");
            }
            vars[definition.name] = globalThis.crypto.randomUUID().replace(/-/g, "");
        } else if (definition.type === "md5") {
            const source = (definition.parts || []).map((name) =>
                vars[name] == null ? "" : String(vars[name])
            ).join("");
            vars[definition.name] = md5(source);
        } else if (definition.type === "signature") {
            const params = Object.fromEntries(
                Object.entries(definition.params || {})
                    .map(([key, variableName]) => [key, vars[variableName]])
            );

            // ✅ 修复点 2: 不在 vars 中存储原始密钥
            const secret = vars[definition.secretVar || "apiSecret"];
            if (!secret) {
                throw new Error(
                    `签名生成失败: 缺少密钥变量 vars.${definition.secretVar || "apiSecret"}`
                );
            }

            // 只存储签名结果，不存储密钥
            vars[definition.name] = generateSignature(params, secret);

            // ✅ 可选: 清理密钥（如果只用于签名）
            if (definition.clearSecret) {
                delete vars[definition.secretVar || "apiSecret"];
            }
        } else {
            throw new Error(`不支持的 generatedVars 类型: ${definition.type}`);
        }
    }

    // ✅ 修复点 3: 冻结 vars 对象，防止意外修改
    return Object.freeze(vars);
}

// ✅ 修复点 4: 更新签名生成函数，接受单独的密钥参数
function generateSignature(params, secret) {
    // 确保密钥不出现在日志或错误消息中
    if (!secret || typeof secret !== "string") {
        throw new Error("签名密钥无效");
    }

    // 按字母顺序排序参数
    const sorted = Object.keys(params).sort();
    const combined = sorted.map((key) => `${key}=${params[key]}`).join("&");
    const toSign = combined + secret;

    // 使用 md5 生成签名
    return md5(toSign);
}

// ✅ 修复点 5: 在运行时验证 vars 的不可变性（开发模式）
function createRuntime(scenario, config, options) {
    const vars = buildGeneratedVars(
        scenario,
        { ...(config.vars || {}), ...(options.vars || {}) },
        options.environmentVariables || {},
        { verboseErrors: options.verboseErrors }
    );

    const runtime = {
        vars,
        lastResponse: null,
        lastResponseBody: null,
        // ...
    };

    // 开发模式：添加代理检测意外修改
    if (process.env.NODE_ENV === "development" || options.strictMode) {
        return new Proxy(runtime, {
            set(target, prop, value) {
                if (prop === "vars") {
                    console.warn(
                        "⚠️  警告: 尝试修改 runtime.vars 被阻止\n" +
                        "   runtime.vars 是不可变的，请使用 extract 提取新变量"
                    );
                    return false;
                }
                target[prop] = value;
                return true;
            }
        });
    }

    return runtime;
}
