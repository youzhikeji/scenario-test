/**
 * 统一错误消息格式示例
 */

// ========================================
// 修复前：错误消息不一致、不够友好
// ========================================

// 示例 1: xlsx.js 原始错误
try {
    const templatePath = path.resolve(workspace, "../../../etc/passwd");
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Excel 模板不存在: ${templatePath}`);
    }
} catch (error) {
    console.error(error.message);
    // 输出: Excel 模板不存在: /etc/passwd
    // ❌ 问题: 没有说明为什么会到这个路径
    // ❌ 问题: 没有告诉用户怎么修复
    // ❌ 问题: 泄露了实际的文件系统路径
}

// 示例 2: engine.js 原始错误
try {
    const value = environmentVariables["PROD_API_SECRET"];
    if (!value) {
        throw new Error(`缺少场景变量 PROD_API_SECRET（映射到 vars.apiSecret）`);
    }
} catch (error) {
    console.error(error.message);
    // 输出: 缺少场景变量 PROD_API_SECRET（映射到 vars.apiSecret）
    // ❌ 问题: 泄露了生产环境的环境变量名
    // ❌ 问题: 攻击者可以了解系统架构
}

// 示例 3: cli.js 原始错误
try {
    if (!fs.existsSync(configPath)) {
        throw new Error("配置文件未找到");
    }
} catch (error) {
    console.error(error.message);
    // 输出: 配置文件未找到
    // ❌ 问题: 没有说明是哪个配置文件
    // ❌ 问题: 没有告诉用户怎么解决
}

// ========================================
// 修复后：统一的三段式错误格式
// ========================================

/**
 * 统一错误消息格式标准
 *
 * 格式: [问题描述] + [原因] + [解决提示]
 *
 * 1. 问题描述: 简明扼要，说明发生了什么
 * 2. 原因: 技术层面的原因（可选敏感信息遮蔽）
 * 3. 提示: 可操作的解决步骤
 */

// 示例 1: xlsx.js 修复后
try {
    let templatePath;
    try {
        templatePath = validatePath(workspace, definition.template);
    } catch (error) {
        throw new Error(
            `Excel 模板路径不安全: ${definition.template}\n` +
            `原因: ${error.message}\n` +
            `提示: 模板必须在工作区内 (${workspace})`
        );
    }
} catch (error) {
    console.error(error.message);
    /* 输出:
    Excel 模板路径不安全: ../../../etc/passwd
    原因: 路径越界: ../../../etc/passwd (解析为 /etc/passwd, 根目录 /workspace)
    提示: 模板必须在工作区内 (/workspace)

    ✅ 优点: 清楚说明问题
    ✅ 优点: 解释了技术原因
    ✅ 优点: 提供了解决方案
    ✅ 优点: 格式统一，容易解析
    */
}

// 示例 2: engine.js 修复后（生产模式）
try {
    const value = environmentVariables["PROD_API_SECRET"];
    if (!value) {
        throw new Error(
            `缺少必需的场景变量: vars.apiSecret\n` +
            `提示: 请在配置文件的 vars 中设置该变量，或通过环境变量提供\n` +
            `详细信息可通过设置 SCENARIO_VERBOSE_ERRORS=true 查看`
        );
    }
} catch (error) {
    console.error(error.message);
    /* 输出:
    缺少必需的场景变量: vars.apiSecret
    提示: 请在配置文件的 vars 中设置该变量，或通过环境变量提供
    详细信息可通过设置 SCENARIO_VERBOSE_ERRORS=true 查看

    ✅ 优点: 不泄露环境变量名 PROD_API_SECRET
    ✅ 优点: 提供了两种解决方案
    ✅ 优点: 告知如何查看详细信息
    */
}

// 示例 3: cli.js 修复后
try {
    const configPath = args.config || "./scenario.config.js";
    if (!fs.existsSync(configPath)) {
        throw new Error(
            `配置文件不存在: ${configPath}\n` +
            `提示: 使用 --config 参数指定配置文件路径\n` +
            `示例: node scenario-test-cli.cjs --config path/to/scenario.config.js`
        );
    }
} catch (error) {
    console.error(error.message);
    /* 输出:
    配置文件不存在: ./scenario.config.js
    提示: 使用 --config 参数指定配置文件路径
    示例: node scenario-test-cli.cjs --config path/to/scenario.config.js

    ✅ 优点: 明确指出是哪个文件
    ✅ 优点: 提供了参数说明
    ✅ 优点: 给出了具体示例
    */
}

// ========================================
// 错误消息分级处理
// ========================================

/**
 * 根据环境和用户角色调整错误详细程度
 */

class ErrorFormatter {
    constructor(options = {}) {
        this.verboseMode = options.verbose || process.env.SCENARIO_VERBOSE_ERRORS === "true";
        this.isDevelopment = process.env.NODE_ENV === "development";
    }

    // 生产模式：遮蔽敏感信息
    formatProductionError(issue, varName, envName) {
        if (this.verboseMode) {
            // 开发者明确要求详细信息
            return (
                `缺少场景变量: vars.${varName}\n` +
                `环境变量映射: ${envName}\n` +
                `提示: 在配置中设置 vars.${varName} 或设置环境变量 ${envName}`
            );
        } else {
            // 默认：不泄露环境变量名
            return (
                `缺少必需的场景变量: vars.${varName}\n` +
                `提示: 请在配置文件的 vars 中设置该变量，或通过环境变量提供\n` +
                `详细信息可通过设置 SCENARIO_VERBOSE_ERRORS=true 查看`
            );
        }
    }

    // 开发模式：提供完整堆栈
    formatDevelopmentError(issue, details) {
        return (
            `${issue}\n` +
            `原因: ${details.reason}\n` +
            `位置: ${details.location}\n` +
            `堆栈: ${details.stack}\n` +
            `提示: ${details.solution}`
        );
    }

    // 用户友好的错误
    formatUserError(issue, solution, example = null) {
        let message = (
            `${issue}\n` +
            `提示: ${solution}`
        );

        if (example) {
            message += `\n示例: ${example}`;
        }

        return message;
    }

    // 安全错误：不泄露系统信息
    formatSecurityError(issue, safeReason) {
        return (
            `安全限制: ${issue}\n` +
            `原因: ${safeReason}\n` +
            `如需帮助，请联系管理员`
        );
    }
}

// 使用示例
const formatter = new ErrorFormatter({ verbose: false });

// 场景 1: 生产环境，缺少变量
try {
    throw new Error(
        formatter.formatProductionError("缺少配置", "apiKey", "PROD_API_KEY")
    );
} catch (error) {
    console.error(error.message);
    // 不会泄露 PROD_API_KEY
}

// 场景 2: 开发环境，详细调试信息
try {
    throw new Error(
        formatter.formatDevelopmentError("数据库连接失败", {
            reason: "连接超时",
            location: "src/db/connection.js:42",
            stack: "...",
            solution: "检查数据库服务是否运行"
        })
    );
} catch (error) {
    console.error(error.message);
}

// 场景 3: 用户操作错误
try {
    throw new Error(
        formatter.formatUserError(
            "配置文件格式错误",
            "确保配置文件是有效的 JavaScript",
            "module.exports = { scenarios: [...] }"
        )
    );
} catch (error) {
    console.error(error.message);
}

// 场景 4: 安全限制
try {
    throw new Error(
        formatter.formatSecurityError(
            "路径访问被拒绝",
            "文件必须在项目目录内"
        )
    );
} catch (error) {
    console.error(error.message);
}

// ========================================
// 可解析的错误格式
// ========================================

/**
 * 结构化错误，便于程序化处理
 */

class StructuredError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = "StructuredError";
        this.code = code;  // 错误代码，如 "PATH_TRAVERSAL"
        this.details = details;  // 额外的结构化信息
        this.timestamp = new Date().toISOString();
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp
        };
    }

    toString() {
        let output = this.message;

        if (Object.keys(this.details).length > 0) {
            output += "\n详细信息:";
            for (const [key, value] of Object.entries(this.details)) {
                output += `\n  ${key}: ${value}`;
            }
        }

        return output;
    }
}

// 使用示例
try {
    throw new StructuredError(
        "PATH_TRAVERSAL",
        "路径越界: ../../../etc/passwd\n" +
        "提示: 文件必须在工作区内",
        {
            userPath: "../../../etc/passwd",
            resolvedPath: "/etc/passwd",
            workspaceRoot: "/workspace",
            severity: "CRITICAL"
        }
    );
} catch (error) {
    // 可以作为字符串显示给用户
    console.error(error.toString());

    // 可以作为 JSON 记录到日志
    console.log(JSON.stringify(error, null, 2));

    // 可以根据代码做不同处理
    if (error.code === "PATH_TRAVERSAL") {
        // 记录安全事件
        // sendSecurityAlert(error.toJSON());
    }
}

// ========================================
// 错误消息最佳实践总结
// ========================================

/**
 * ✅ 好的错误消息特征:
 *
 * 1. 清晰性 - 明确说明发生了什么
 * 2. 上下文 - 提供相关的背景信息
 * 3. 可操作 - 告诉用户如何解决
 * 4. 安全性 - 不泄露敏感信息
 * 5. 一致性 - 格式统一，便于理解
 * 6. 分级性 - 根据环境调整详细程度
 * 7. 可解析 - 程序可以提取关键信息
 *
 * ❌ 避免的错误消息:
 *
 * 1. "发生错误" - 太模糊
 * 2. "null is not an object" - 技术性太强
 * 3. 堆栈跟踪直接显示给用户 - 不友好
 * 4. 泄露文件路径、环境变量名 - 不安全
 * 5. 没有解决建议 - 不可操作
 * 6. 不同地方格式不一致 - 难以理解
 */
