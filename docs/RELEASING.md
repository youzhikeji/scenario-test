# 发布流程

> ⚠️ **内部/历史文档**：本指南是仓库维护者的发布流程。对外接入默认**免 npm**
> （官方安装脚本从固定版本 GitHub Tag 的 `dist/` 下载运行时副本，不修改业务项目依赖），
> 对外安装指引见 [README](../README.md) 与 [AI_INSTALL_PROMPT.md](AI_INSTALL_PROMPT.md)。
> 仓库内的 `scripts/publish-release.mjs`（GitLab CI）仅用于内部镜像发布。

`master` 只包含可发布代码。`dist/` 随版本提交（GitHub Tag 的 Raw `dist/` 目录是免 npm 默认下载源，不依赖 GitHub Release 上传资产）。消费者默认免 npm：官方 `install.ps1` / `install.sh` 从固定版本 Tag 的 `dist/` 下载全部运行时副本到项目 `.scenario-test/`；npm（`@yc_yzkj/scenario-test`）为显式可选方式（`-UseNpm` / `SCENARIO_TEST_USE_NPM=true`）。

## 发布步骤

1. 修改 `package.json` 版本号，遵循语义化版本。
2. 本地运行：

   ```powershell
   npm run check
   npm run test:browser
   ```

3. 提交版本变更并推送 `master`。
4. 创建并推送同名 Tag：

   ```powershell
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push github vX.Y.Z
   ```

5. 发布到 npm（scoped 包需 `--access public` 或私有 org）：

   ```powershell
   npm run build
   npm publish --access public
   ```

   `files: ["dist", "scripts/start-scenario-test.ps1"]` 保证构建产物与 Windows 启动脚本一并发布；`bin` 指向 `dist/scenario-test-cli.cjs`（带 shebang，支持 `npx @yc_yzkj/scenario-test`）。

   Windows 浏览器工作台也可直接使用发行版中的启动脚本。脚本默认读取业务项目根目录下的 `scenario-test/scenario.config.js`，默认只启动服务；传入 `-OpenBrowser` 才会自动打开浏览器：

   ```powershell
   & ".\start-scenario-test.ps1" -Project . -OpenBrowser
   ```

   GitLab Release 同步提供 `start-scenario-test.ps1` 下载资产，脚本与该版本的 CLI、UMD 保持一致。
6. （可选）创建 GitHub Release 作为源码归档。免 npm 默认下载源是 GitHub Tag 的 Raw `dist/` 目录（`https://raw.githubusercontent.com/youzhikeji/scenario-test/vX.Y.Z/dist/`），不依赖 Release 上传资产；内网可把 `Source` / `SCENARIO_TEST_SOURCE` 指向 GitLab Raw 或制品目录。

业务项目由 `init` 生成 `index.html`，引用项目内运行时副本：

```html
<script src="./.scenario-test/scenario-test.umd.js"></script>
```

`init` 优先从本机 npm 包 `dist/` 拷贝副本；本机没有 npm 包时可用 `--library-url <目录>` 指定包含全部运行时文件的目录（默认指向固定版本 GitHub Tag 的 `dist/` Raw 目录）。人工场景测试通过 `start-scenario-test.cmd` 启动，`serve` 把接口请求代理到环境 `baseUrl`（页面 `baseUrl` 留空即走代理），无需后端放行 CORS。

已发布 Tag 不覆盖重推。修复通过新的 patch Tag 发布。

GitHub Pages 仅在需要公开文档或在线 Mock Demo 时启用，不作为 CLI/UMD 的生产分发地址。
