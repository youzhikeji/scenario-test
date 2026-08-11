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

   `files: ["dist"]` 保证只发布构建产物；`bin` 指向 `dist/scenario-test-cli.cjs`（带 shebang，支持 `npx @yc_yzkj/scenario-test`）。
6. （可选）创建 GitHub Release 作为源码归档与历史参考；业务项目不再依赖 Release 下载安装。

业务项目由 `init` 生成 `index.html`，引用 npm 包内的 UMD，浏览器通过 `serve` 的 `/node_modules/@yc_yzkj/scenario-test/dist/scenario-test.umd.js` 路由加载：

```html
<script src="/node_modules/@yc_yzkj/scenario-test/dist/scenario-test.umd.js"></script>
```

已发布 Tag 不覆盖重推。修复通过新的 patch Tag 发布。

GitHub Pages 仅在需要公开文档或在线 Mock Demo 时启用，不作为 CLI/UMD 的生产分发地址。
