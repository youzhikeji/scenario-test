# scenario-test v0.3.0 发版操作指南

## ✅ 准备工作已完成

- ✅ 版本号已更新: `0.2.13` → `0.3.0`
- ✅ .gitignore 已更新（忽略 tmp-* 目录）
- ✅ README.md 已添加安全章节和升级指南
- ✅ GitHub Release 说明已准备（RELEASE_NOTES_v0.3.0.md）
- ✅ 构建成功，所有测试通过 (43/43)
- ✅ Git 提交已完成

**当前分支**: `security-fixes-2026-08`
**最新提交**: `3db5a04` - "chore: prepare for v0.3.0 release"

---

## 🚀 发版步骤

### 方案 A: 直接合并到 master（推荐，快速）

```bash
# 1. 切换到 master 分支
git checkout master

# 2. 合并修复分支
git merge security-fixes-2026-08

# 3. 运行最终测试确认
npm test
npm run build

# 4. 打版本标签
git tag -a v0.3.0 -m "Release v0.3.0 - Security fixes and improvements

- Fix CRITICAL path traversal vulnerabilities
- Add environment variable authorization
- Improve error messages and documentation

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"

# 5. 推送到远程
git push origin master
git push origin v0.3.0

# 6. （可选）删除特性分支
git branch -d security-fixes-2026-08
git push origin --delete security-fixes-2026-08
```

### 方案 B: 通过 Pull Request（推荐，适合团队）

```bash
# 1. 推送当前分支到远程
git push origin security-fixes-2026-08

# 2. 在 GitHub 上创建 Pull Request
#    - 从 security-fixes-2026-08 到 master
#    - 标题: "Security fixes for v0.3.0"
#    - 描述: 复制 RELEASE_NOTES_v0.3.0.md 内容

# 3. 审查通过后合并 PR

# 4. 在本地拉取最新 master
git checkout master
git pull origin master

# 5. 打标签
git tag -a v0.3.0 -m "Release v0.3.0 - Security fixes"
git push origin v0.3.0
```

---

## 📦 发布到 GitHub Release

### 步骤：

1. **访问 GitHub Releases 页面**
   - 打开: https://github.com/youzhikeji/scenario-test/releases
   - 点击 "Draft a new release"

2. **填写 Release 信息**
   - **Tag**: 选择 `v0.3.0`（或手动输入）
   - **Target**: `master` 分支
   - **Title**: `v0.3.0 - Security Fixes and Improvements`
   - **Description**: 复制 `RELEASE_NOTES_v0.3.0.md` 的内容

3. **上传构建产物**（可选）
   - `dist/scenario-test.umd.js`
   - `dist/scenario-test-cli.cjs`
   - `dist/adapters/xlsx.cjs`

4. **标记为重要更新**
   - ✅ 勾选 "Set as the latest release"
   - ⚠️ 考虑勾选 "This is a pre-release"（如果想先小范围测试）

5. **发布**
   - 点击 "Publish release"

---

## 📢 发布到 npm（如果需要）

**注意**: 当前 package.json 中有 `"private": true`，需要先移除才能发布到 npm。

### 如果要发布到 npm：

```bash
# 1. 移除 private 标志
# 编辑 package.json，删除 "private": true 这行

# 2. 登录 npm（如果还没登录）
npm login

# 3. 检查发布内容
npm pack --dry-run

# 4. 发布（普通版本）
npm publish

# 或者先发布为 beta 测试
npm publish --tag beta
```

### 如果保持私有（内部使用）：

不需要执行上述步骤，只需要：
- GitHub Release 发布
- 用户通过 GitHub 下载或 git clone 使用

---

## ✅ 发版后检查清单

### 立即检查

- [ ] GitHub Release 已创建并可见
- [ ] Tag `v0.3.0` 已推送到远程
- [ ] README.md 在 GitHub 上显示正确
- [ ] SECURITY.md 和 CHANGELOG.md 链接正常
- [ ] 构建产物可以下载（如果上传了）

### 24 小时内

- [ ] 监控 GitHub Issues（是否有 bug 报告）
- [ ] 检查下载/克隆是否正常工作
- [ ] 回答用户问题（如果有）

### 1 周内

- [ ] 收集用户反馈
- [ ] 记录发现的问题
- [ ] 规划 v0.3.1 修复版本（如果需要）

---

## 🔄 回滚计划（如果出现问题）

### 如果发现严重 bug：

```bash
# 1. 创建热修复分支
git checkout v0.2.13
git checkout -b hotfix-v0.3.1

# 2. 修复问题
# ... 修改代码 ...

# 3. 测试
npm test
npm run build

# 4. 发布 v0.3.1
# 更新 package.json: "version": "0.3.1"
git commit -am "hotfix: fix critical bug in v0.3.0"
git tag -a v0.3.1 -m "Hotfix release v0.3.1"
git push origin hotfix-v0.3.1
git push origin v0.3.1

# 5. 在 GitHub 发布 v0.3.1，标注修复了什么问题
```

### 如果需要完全回退：

```bash
# 1. 在 GitHub Release 页面
#    - 编辑 v0.3.0 Release
#    - 取消勾选 "Set as the latest release"

# 2. 创建回退通知
#    - 在 GitHub 创建 Issue 说明原因
#    - 告知用户使用 v0.2.13
```

---

## 📊 成功指标

### 技术指标

- ✅ 所有测试通过 (43/43)
- ✅ 构建成功无错误
- ✅ Git 历史清晰

### 用户指标（发布后监控）

- 下载/克隆次数
- Issue 数量和类型
- 用户反馈（正面/负面）

### 预期结果

- 📉 安全漏洞报告数量减少到 0
- 📈 用户信任度提升
- 📊 迁移顺利，问题报告 < 5 个

---

## 💡 发版建议

### 时机选择

**推荐**:
- ✅ 工作日（周二-周四）
- ✅ 上午发布（有时间处理问题）
- ✅ 避开节假日

**不推荐**:
- ❌ 周五下午（周末无人值守）
- ❌ 深夜发布（出问题难以响应）
- ❌ 假期前

### 沟通策略

如果有用户社区：
1. 提前 1-2 天发布预告
2. 说明主要变更和 breaking changes
3. 提供迁移指南链接
4. 征询反馈

如果是内部项目：
1. 发送团队邮件通知
2. 更新内部文档
3. 组织培训/答疑会议（如果需要）

---

## 🎯 下一步（发版后）

### v0.3.1（1-2 周）- Bug 修复版本

基于用户反馈：
- 修复发现的小 bug
- 补充文档
- 改进错误消息

### v0.4.0（1-3 个月）- 功能版本

计划功能：
- 测试报告生成（HTML/JSON）
- 数据驱动测试支持
- 并行执行能力
- 更多适配器（GraphQL、gRPC）

---

## 📞 联系方式

如有问题：
- GitHub Issues: https://github.com/youzhikeji/scenario-test/issues
- 项目维护者: （您的联系方式）

---

## ✅ 准备就绪！

所有准备工作已完成，现在可以执行发版操作了。

**建议**: 使用方案 A（直接合并）或方案 B（Pull Request），取决于您的团队流程。

**预计时间**: 10-20 分钟完成发版操作

祝发版顺利！🎉
