# scenario-test v0.3.0 发版前检查清单

## ✅ 核心功能验证

### 测试状态
- ✅ **所有测试通过**: 43/43 (100%)
- ✅ **构建成功**: 所有产物正常生成
  - `dist/scenario-test.umd.js` (231.0kb)
  - `dist/scenario-test.esm.js` (223.7kb)
  - `dist/scenario-test.cjs` (230.8kb)
  - `dist/scenario-test-cli.cjs` (2.8mb)
  - `dist/adapters/xlsx.cjs` (2.1mb)

### 安全修复
- ✅ **CRITICAL 问题 (3个)**: 全部修复
  - 路径遍历漏洞 (XLSX)
  - 路径遍历漏洞 (Node IO)
  - 动态代码执行文档
- ✅ **HIGH 问题 (5个)**: 全部修复
  - 环境变量名泄露
  - 命令行授权令牌
  - 插件路径验证
- ✅ **MEDIUM 问题 (2个)**: 已修复
  - 重试超时保护
  - 错误消息统一

---

## 📋 发版前必查项

### 1. 代码质量 ✅

- ✅ 所有测试通过
- ✅ 构建无错误
- ✅ 无明显的代码异味
- ✅ Git 分支干净（security-fixes-2026-08）

### 2. 文档完整性 ✅

- ✅ `SECURITY.md` - 安全指南
- ✅ `CHANGELOG.md` - 变更日志和迁移指南
- ✅ `README.md` - 使用说明（已存在）
- ✅ CLI `--help` - 更新了帮助文档

### 3. Breaking Changes 说明 ✅

已在 CHANGELOG.md 中清晰说明：
- ✅ 授权方式变更（`--authorization` 弃用）
- ✅ 插件路径限制
- ✅ 文件路径验证

### 4. 向后兼容性 ✅

- ✅ `--authorization` 仍可用（显示弃用警告）
- ✅ 现有场景文件无需修改（除非使用路径遍历）
- ✅ API 未改变

### 5. 依赖检查 ⚠️

需要检查：
```bash
npm audit
npm outdated
```

---

## ⚠️ 发版前需要处理的问题

### 🔴 必须处理

#### 1. 版本号更新
```bash
# 当前版本
"version": "0.2.13"

# 需要更新为
"version": "0.3.0"
```

**位置**: `package.json`

**原因**: 包含 BREAKING CHANGES，应该是 minor 版本升级

#### 2. Git 合并和标签
```bash
# 当前在特性分支
git checkout master
git merge security-fixes-2026-08
git tag v0.3.0
git push origin master --tags
```

#### 3. 临时文件清理
```bash
# 删除测试生成的临时目录
rm -rf tmp-demo-project/
rm -rf tmp-init-verification/
rm -rf tmp-java-demo/
rm -rf tmp-java-scenario-demo/
```

**或者**添加到 `.gitignore`:
```
tmp-*/
```

### 🟡 建议处理

#### 4. 文档优化
- ⚠️ README.md 需要添加安全相关说明
- ⚠️ 添加迁移指南链接

**建议添加到 README.md**:
```markdown
## 安全

请阅读 [SECURITY.md](SECURITY.md) 了解安全最佳实践。

## 升级到 v0.3.0

请参考 [CHANGELOG.md](CHANGELOG.md) 中的迁移指南。
```

#### 5. 发布说明准备
创建 GitHub Release 时需要的内容：

**标题**: `v0.3.0 - Security Fixes and Improvements`

**说明**:
```markdown
## 🔒 Security Fixes

This release fixes multiple security vulnerabilities:

### CRITICAL
- Path traversal in XLSX adapter
- Path traversal in file upload/download
- Dynamic code execution documentation

### HIGH
- Environment variable name leakage
- Authorization token in command line
- Plugin path validation

See [SECURITY.md](SECURITY.md) for details.

## ⚠️ Breaking Changes

1. **Authorization**: `--authorization` is deprecated, use `SCENARIO_AUTH` environment variable
2. **File paths**: Must be within workspace, no absolute paths or `../` allowed
3. **Plugins**: External plugins require `--allow-external-plugins` flag

See [CHANGELOG.md](CHANGELOG.md) for migration guide.

## 📦 Installation

npm install scenario-test@0.3.0

## 🔗 Links

- [Security Guide](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [Documentation](README.md)
```

#### 6. npm 发布检查
```bash
# 检查将要发布的内容
npm pack --dry-run

# 查看 package.json 的 files 字段
# 确保包含必要文件，排除不需要的文件
```

---

## 🚫 发版前的阻塞问题

### 当前状态：⚠️ 有 3 个阻塞项

1. ❌ **版本号未更新** (package.json)
2. ❌ **未合并到主分支** (当前在 security-fixes-2026-08)
3. ❌ **临时文件未清理** (tmp-* 目录)

---

## 📊 风险评估

### 低风险 ✅

- ✅ 所有测试通过
- ✅ 构建成功
- ✅ 有完整的回滚计划（保留 v0.2.13）
- ✅ Breaking Changes 有清晰文档
- ✅ 向后兼容性好（弃用警告）

### 中风险 ⚠️

- ⚠️ 用户需要迁移授权方式（但很简单）
- ⚠️ 可能影响使用绝对路径的用户（但这本身就是不安全的）
- ⚠️ 没有 beta 测试阶段

### 可以接受的原因

1. 安全修复是必须的（CRITICAL 漏洞）
2. 影响范围可控（主要是配置变更）
3. 有清晰的迁移指南
4. 保留向后兼容（警告而非报错）

---

## ✅ 推荐的发版流程

### Step 1: 完成代码准备
```bash
# 1. 清理临时文件
echo "tmp-*/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore temporary test directories"

# 2. 更新版本号
# 编辑 package.json: "version": "0.3.0"
git add package.json
git commit -m "chore: bump version to 0.3.0"
```

### Step 2: 合并到主分支
```bash
# 1. 切换到主分支
git checkout master

# 2. 合并特性分支
git merge security-fixes-2026-08

# 3. 解决冲突（如果有）
# 4. 运行测试确认
npm test
npm run build
```

### Step 3: 打标签
```bash
git tag -a v0.3.0 -m "Release v0.3.0 - Security fixes and improvements"
git push origin master
git push origin v0.3.0
```

### Step 4: 发布到 npm（如果需要）
```bash
# 检查发布内容
npm pack --dry-run

# 发布
npm publish

# 或发布为 beta 版本先测试
npm publish --tag beta
```

### Step 5: 创建 GitHub Release
1. 访问 GitHub Releases 页面
2. 点击 "Draft a new release"
3. 选择 tag `v0.3.0`
4. 填写 Release 说明（见上面的模板）
5. 上传构建产物（可选）
6. 发布

### Step 6: 通知用户
- 在项目 README 中添加更新说明
- 在 GitHub Discussions 发布公告
- 如果有用户群，发送通知

---

## 🎯 最终建议

### 可以发版吗？

**答案**: **可以，但需要完成 3 个必须项** ✅⚠️

**当前状态**: 7.5/10（非常接近可发版）

**需要补充**:
1. ❌ 更新 package.json 版本号 → **5 分钟**
2. ❌ 合并到主分支 → **10 分钟**
3. ❌ 清理临时文件 → **2 分钟**
4. ⚠️ 更新 README（建议）→ **10 分钟**
5. ⚠️ 准备发布说明（建议）→ **15 分钟**

**总计**: 约 **40 分钟**即可完成发版准备

### 发版时机建议

**立即发版** ✅ - 如果：
- 已知有用户受安全漏洞影响
- 修复的是 CRITICAL 级别问题
- 有明确的用户需求

**延迟 1-2 周** ⏸️ - 如果：
- 想要更多测试反馈
- 希望添加更多功能
- 用户群还很小

### 我的建议

**建议立即发版（v0.3.0）**，理由：
1. ✅ 修复了 3 个 CRITICAL 安全漏洞
2. ✅ 所有测试通过
3. ✅ 文档完整
4. ✅ 风险可控
5. ✅ 快速迭代符合敏捷开发

然后计划 v0.3.1（1-2 周后）：
- 根据用户反馈修复 bug
- 补充文档
- 小的改进

---

## 📝 发版后待办

### 立即
- [ ] 监控 GitHub Issues
- [ ] 准备快速修复计划（如果发现问题）
- [ ] 更新项目网站/文档站点（如果有）

### 短期（1-2 周）
- [ ] 收集用户反馈
- [ ] 修复发现的小问题
- [ ] 准备 v0.3.1

### 中期（1 个月）
- [ ] 评估是否需要 v0.4.0
- [ ] 考虑添加推荐的功能（测试报告、并行执行等）

---

## 结论

**✅ 可以发版**，但请先：
1. 更新版本号
2. 合并到主分支
3. 清理临时文件

完成这 3 项后，项目处于**非常健康的发版状态**。

**推荐发版时间**: 今天或明天（完成准备工作后）

**信心指数**: ⭐⭐⭐⭐ (8/10)

需要我帮您执行这些准备步骤吗？
