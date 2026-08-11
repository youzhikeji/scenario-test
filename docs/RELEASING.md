# 发布流程

> ⚠️ **内部/历史文档**：本指南是仓库维护者的发布流程。对外正式渠道是 **npm**
> （`@yc_yzkj/scenario-test`），对外安装指引见
> [README](../README.md) 与 [AI_INSTALL_PROMPT.md](AI_INSTALL_PROMPT.md)。
> 仓库内的 `scripts/publish-release.mjs`（GitLab CI）仅用于内部镜像发布。

`master` 只包含可发布代码。`dist/` 随版本提交，消费者通过 npm 安装 `@yc_yzkj/scenario-test` 并用 `npx @yc_yzkj/scenario-test` 执行命令。运行时（CLI、UMD、d.ts、能力清单）只存在于 npm 包，不写入业务项目；项目 `.scenario-test/` 仅保存 AI 规则与模式库。

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
6. （可选）创建 GitHub Release 作为源码归档；Release 的 `dist/` 资产同时是 `init --library-url` 的 UMD 下载源（GitHub Release 与 GitLab Raw URL 均可）。

业务项目由 `init` 生成 `index.html`，引用项目内运行时副本：

```html
<script src="./.scenario-test/scenario-test.umd.js"></script>
```

`init` 优先从本机 npm 包 `dist/` 拷贝副本；CLI 不在本机时可用 `--library-url` 指定下载地址（默认指向 GitHub Release 的 `scenario-test.umd.js`）。人工场景测试通过 `start-scenario-test.cmd` 启动，`serve` 把接口请求代理到环境 `baseUrl`（页面 `baseUrl` 留空即走代理），无需后端放行 CORS。

已发布 Tag 不覆盖重推。修复通过新的 patch Tag 发布。

GitHub Pages 仅在需要公开文档或在线 Mock Demo 时启用，不作为 CLI/UMD 的生产分发地址。
