# 发布流程

`master` 只包含可发布代码。`dist/` 随版本提交，消费者通过 AI 安装 Prompt 下载 CLI 并在项目内执行 `init`，不依赖 GitLab CI、GitLab Pages 或静态资源服务。

`dist/` 随每个版本 Tag 提交。GitLab Raw 只作为 Node.js 下载源，不作为浏览器脚本地址。

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
   git tag -a v0.2.7 -m "v0.2.7"
   git push origin v0.2.7
   ```

5. AI 安装 Prompt 下载该 Tag 的 CLI 后，`init` 会将 UMD 和 CLI 写入项目目录，由浏览器加载本地文件：

```html
<script src="./scenario-test.umd.js"></script>
```

已发布 Tag 不覆盖重推。修复通过新的 patch Tag 发布。
