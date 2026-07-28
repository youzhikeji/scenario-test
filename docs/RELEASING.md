# 发布流程

`master` 只包含可发布代码。发布由 Git Tag 触发 GitLab CI：校验、构建 `dist/`、创建 Release，并将浏览器和 CLI 运行时上传到内部静态资源服务。

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

5. 等待 GitLab `release` 和 `static_publish` Job 成功。`release` 创建 GitLab Release；`static_publish` 原子发布以下版本地址：

   ```text
   http://192.168.1.199:8088/scenario-test/<tag>/scenario-test.umd.js
   http://192.168.1.199:8088/scenario-test/<tag>/scenario-test-cli.cjs
   ```

项目 CI/CD 变量必须配置受保护且掩码的 `GITLAB_RELEASE_TOKEN`，它需要当前项目的 API 权限以创建 Release。变量只在 GitLab CI 中使用，不写入仓库。

静态发布还需要两个受保护的 **File** 类型变量：

- `SCENARIO_TEST_STATIC_SSH_KEY`：`scenario-publisher@192.168.1.199` 的私钥。
- `SCENARIO_TEST_STATIC_KNOWN_HOSTS`：`192.168.1.199` 的 SSH known_hosts 条目。

服务器上的 `scenario-publisher` 仅拥有 `/opt/scenario-test-static/public/scenario-test` 的写权限。Tag 必须是 `vX.Y.Z` 格式；同版本目录已存在时发布会失败，避免覆盖历史产物。

`init` 会下载 Release UMD 到项目目录，由浏览器加载本地文件：

```html
<script src="./scenario-test.umd.js"></script>
```

已发布 Tag 不覆盖重推。修复通过新的 patch Tag 发布。
