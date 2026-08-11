# 发布流程

> ⚠️ **内部/历史文档**：本指南是仓库维护者的发布流程。对外正式渠道是 **GitHub Release**
> （https://github.com/youzhikeji/scenario-test/releases），对外安装指引见
> [README](../README.md) 与 [AI_INSTALL_PROMPT.md](AI_INSTALL_PROMPT.md)。
> 仓库内的 `scripts/publish-release.mjs`（GitLab CI）仅用于内部镜像发布。

`master` 只包含可发布代码。`dist/` 随版本提交，消费者通过 AI 接入 Prompt 下载 GitHub Release 中的 CLI 并在项目内执行 `init`，不依赖 npm、GitHub Pages 或其他静态资源服务。新项目的框架文件统一写入场景测试目录下的 `.scenario-test/`；旧平铺项目继续原位兼容。

`dist/` 随每个版本 Tag 提交。CLI、UMD、d.ts、能力清单与完整压缩包作为 GitHub Release 资产上传；浏览器始终加载业务项目内由 `init` 写入的 UMD，不直接引用 GitHub 地址。

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
   git tag -a v0.5.0 -m "v0.5.0"
   git push github v0.5.0
   ```

5. 创建 GitHub Release，并上传 `scenario-test-cli.cjs`、`scenario-test.umd.js`、`scenario-test.esm.js`、`scenario-test.cjs`、`scenario-test.d.ts`、`scenario-test-capabilities.json`、`adapters/xlsx.cjs`、完整压缩包和 SHA256 清单（文件清单见 `scripts/publish-release.mjs`）。
6. AI 安装 Prompt 下载该 Release 的 CLI 后，`init` 会将 UMD 和 CLI 写入项目目录，由浏览器加载本地文件：

```html
<script src="./.scenario-test/scenario-test.umd.js"></script>
```

已发布 Tag 不覆盖重推。修复通过新的 patch Tag 发布。

GitHub Pages 仅在需要公开文档或在线 Mock Demo 时启用，不作为 CLI/UMD 的生产分发地址。
