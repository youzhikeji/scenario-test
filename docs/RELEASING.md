# 发布流程

`master` 只包含可发布代码。`dist/` 随版本提交，消费者通过 AI 安装 Prompt 下载 GitHub Release 中的 CLI 并在项目内执行 `init`，不依赖 npm、GitHub Pages 或其他静态资源服务。

`dist/` 随每个版本 Tag 提交。CLI、UMD 和完整压缩包作为 GitHub Release 资产上传；浏览器始终加载业务项目内由 `init` 写入的 UMD，不直接引用 GitHub 地址。

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
   git tag -a v0.2.11 -m "v0.2.11"
   git push github v0.2.11
   ```

5. 创建 GitHub Release，并上传 `scenario-test-cli.cjs`、`scenario-test.umd.js`、其他 Node/ESM 产物、完整压缩包和 SHA256 清单。
6. AI 安装 Prompt 下载该 Release 的 CLI 后，`init` 会将 UMD 和 CLI 写入项目目录，由浏览器加载本地文件：

```html
<script src="./scenario-test.umd.js"></script>
```

已发布 Tag 不覆盖重推。修复通过新的 patch Tag 发布。

GitHub Pages 仅在需要公开文档或在线 Mock Demo 时启用，不作为 CLI/UMD 的生产分发地址。
