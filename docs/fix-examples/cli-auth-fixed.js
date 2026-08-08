/**
 * 修复后的 CLI 参数解析 - 环境变量优先
 */

// src/cli.js 部分修改

function parseArgs(argv) {
    const args = {
        command: "run",
        all: false,
        config: "",
        scenario: "",
        env: "",
        baseUrl: "",
        authorization: "",  // 保留用于向后兼容
        port: 4300,
        project: "",
        dir: "",
        libraryUrl: "",
        force: false
    };

    let start = 0;
    if (["run", "serve", "init"].includes(argv[0])) {
        args.command = argv[0];
        start = 1;
    }

    let deprecatedAuthUsed = false;

    for (let index = start; index < argv.length; index += 1) {
        const item = argv[index];
        if (item === "--config") args.config = argumentValue(argv, index++, item);
        else if (item === "--scenario") args.scenario = argumentValue(argv, index++, item);
        else if (item === "--env") args.env = argumentValue(argv, index++, item);
        else if (item === "--base-url") args.baseUrl = argumentValue(argv, index++, item);
        else if (["--token", "--authorization"].includes(item)) {
            // ✅ 修复点: 标记弃用警告
            args.authorization = argumentValue(argv, index++, item);
            deprecatedAuthUsed = true;
        }
        else if (item === "--port") args.port = Number(argumentValue(argv, index++, item));
        // ... 其他参数
    }

    // ✅ 修复点: 环境变量优先于命令行参数
    if (process.env.SCENARIO_AUTH) {
        args.authorization = process.env.SCENARIO_AUTH;

        // 如果同时使用了两种方式，给出警告
        if (deprecatedAuthUsed) {
            console.warn(
                "\n⚠️  警告: 同时检测到 SCENARIO_AUTH 环境变量和 --authorization 参数\n" +
                "   环境变量优先级更高，--authorization 参数将被忽略\n"
            );
        }
    } else if (deprecatedAuthUsed) {
        // 只使用了命令行参数，显示迁移提示
        console.warn(
            "\n⚠️  弃用警告: --authorization 参数将在未来版本中移除\n" +
            "   推荐使用环境变量: export SCENARIO_AUTH=\"Bearer your-token\"\n" +
            "   原因: 命令行参数在进程列表中可见，存在安全风险\n"
        );
    }

    return args;
}

// ✅ 在帮助文档中更新说明
function printHelp() {
    console.log(`
scenario-test CLI v${VERSION}

用法:
  node scenario-test-cli.cjs [command] [options]

命令:
  run      运行场景测试（默认）
  serve    启动浏览器工作台
  init     初始化项目

选项:
  --config <path>          配置文件路径（必需）
  --scenario <id>          运行指定场景
  --all                    运行所有场景
  --env <name>             使用指定环境
  --base-url <url>         覆盖环境 baseUrl
  --port <number>          服务端口（默认 4300）

认证选项:
  环境变量 SCENARIO_AUTH    推荐方式，设置授权令牌
  --authorization <token>   （已弃用）命令行传递令牌

初始化选项:
  --project <path>         项目根目录
  --dir <name>             场景测试目录名（默认 scenario-test）
  --library-url <url>      库文件下载地址
  --force                  强制覆盖已有文件

示例:
  # ✅ 推荐: 使用环境变量
  export SCENARIO_AUTH="Bearer your-token"
  node scenario-test-cli.cjs --config scenario.config.js --all

  # 或从 .env 文件加载
  export $(cat .env | xargs)
  node scenario-test-cli.cjs --config scenario.config.js --all

  # ❌ 不推荐: 命令行参数（将被移除）
  node scenario-test-cli.cjs --authorization "Bearer token" --all
`);
}
