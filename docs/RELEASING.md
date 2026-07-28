# 发布流程

`master` 只包含可发布代码。发布由 Git Tag 触发 GitLab CI：校验、构建 `dist/`、创建 Release，并挂载稳定下载地址。

`dist/` 随每个版本 Tag 提交。Release 资产指向该 Tag 的 Raw 文件，不依赖会过期的流水线 Artifact 或 GitLab Generic Package Registry。

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

5. 等待 GitLab `release` Job 成功。Job 会创建指向当前 Tag 中 `dist/` 文件的 Release 资产。

项目 CI/CD 变量必须配置受保护且掩码的 `GITLAB_RELEASE_TOKEN`，它需要当前项目的 API 权限以创建 Release。变量只在 GitLab CI 中使用，不写入仓库。

`init` 会下载 Release UMD 到项目目录，由浏览器加载本地文件：

```html
<script src="./scenario-test.umd.js"></script>
```

已发布 Tag 不覆盖重推。修复通过新的 patch Tag 发布。
