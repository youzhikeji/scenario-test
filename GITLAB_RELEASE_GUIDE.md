# GitLab Release 创建指南

## 📍 当前状态

- ✅ 代码已推送到 master
- ✅ 标签 v0.3.0 已创建并推送
- ✅ Release 说明已准备好

---

## 🎯 创建 GitLab Release（3 步完成）

### Step 1: 访问 GitLab 标签页面

打开浏览器访问：
```
http://192.168.1.239/zhangqianfeng/scenario-test/-/tags/v0.3.0
```

或者：
```
http://192.168.1.239/zhangqianfeng/scenario-test/-/tags
```
然后找到 `v0.3.0` 标签。

---

### Step 2: 创建 Release

1. 在标签页面，点击 **"Edit release notes"** 或 **"Create release"** 按钮

2. 填写 Release 信息：

**Release title（发布标题）**:
```
v0.3.0 - Security Fixes and Improvements
```

**Release notes（发布说明）**:
复制以下完整内容（已根据内网环境调整链接）：

---

## 🔒 Security Fixes

This release fixes **multiple critical security vulnerabilities**. Users are strongly encouraged to upgrade.

### CRITICAL Fixes
- **Path Traversal in XLSX Adapter**: Fixed vulnerability allowing access to files outside workspace
- **Path Traversal in File Upload/Download**: Added path validation for all file operations  
- **Dynamic Code Execution**: Added comprehensive security documentation for vm.runInContext usage

### HIGH Priority Fixes
- **Environment Variable Leakage**: Production mode no longer exposes environment variable names in error messages
- **Authorization Token in CLI**: Deprecated `--authorization` flag, use `SCENARIO_AUTH` environment variable instead
- **Plugin Path Validation**: External plugins now require explicit `--allow-external-plugins` flag

### MEDIUM Priority Fixes
- **Retry Timeout Protection**: Added default 5-minute timeout and minimum 100ms interval
- **Unified Error Messages**: Consistent three-part format (issue - reason - solution)

查看详情: [SECURITY.md](http://192.168.1.239/zhangqianfeng/scenario-test/-/blob/master/SECURITY.md)

---

## ⚠️ Breaking Changes

### 1. Authorization Method

**Old way** (deprecated but still works with warning):
```bash
node scenario-test-cli.cjs --authorization "Bearer token"
```

**New way** (recommended):
```bash
export SCENARIO_AUTH="Bearer token"
node scenario-test-cli.cjs --config scenario.config.js
```

### 2. File Path Restrictions

All file operations now reject:
- ❌ Absolute paths (`/etc/passwd`)
- ❌ Path traversal (`../../../tmp/file`)
- ✅ Relative paths only (`templates/file.xlsx`)

### 3. External Plugins

External plugins require explicit permission:
```bash
node scenario-test-cli.cjs --allow-external-plugins --config scenario.config.js
```

完整迁移指南: [CHANGELOG.md](http://192.168.1.239/zhangqianfeng/scenario-test/-/blob/master/CHANGELOG.md)

---

## 📦 Installation

从仓库克隆最新版本：
```bash
git clone http://192.168.1.239/zhangqianfeng/scenario-test.git
cd scenario-test
git checkout v0.3.0
npm install
npm run build
```

---

## ✅ What's Tested

- ✅ All 43 tests passing (100%)
- ✅ Security test suite added
- ✅ Build verified on Node.js 18+
- ✅ Backward compatibility maintained (with deprecation warnings)

---

## 📚 Documentation

- [Security Guide](http://192.168.1.239/zhangqianfeng/scenario-test/-/blob/master/SECURITY.md)
- [Changelog](http://192.168.1.239/zhangqianfeng/scenario-test/-/blob/master/CHANGELOG.md)
- [README](http://192.168.1.239/zhangqianfeng/scenario-test/-/blob/master/README.md)

---

## 🙏 Acknowledgments

Security fixes implemented with assistance from Claude Opus 4.8.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>

---

3. **（可选）上传构建产物**
   
   如果 GitLab 支持上传附件，可以上传：
   - `dist/scenario-test-cli.cjs`
   - `dist/scenario-test.umd.js`
   - `dist/adapters/xlsx.cjs`

4. 点击 **"Create release"** 或 **"保存"** 按钮

---

### Step 3: 验证 Release

1. 访问 Release 列表页面：
   ```
   http://192.168.1.239/zhangqianfeng/scenario-test/-/releases
   ```

2. 确认 v0.3.0 显示正确

3. 测试链接是否可以正常访问

---

## 📧 团队通知（可选）

如果需要通知团队，可以发送以下邮件：

**主题**: scenario-test v0.3.0 发布 - 重要安全更新

**内容**:
```
各位同事：

scenario-test v0.3.0 已正式发布，本次更新包含重要的安全修复，建议所有用户升级。

🔒 安全修复：
- 修复 3 个 CRITICAL 路径遍历漏洞
- 改进授权机制（推荐使用环境变量）
- 加强插件安全验证

⚠️ Breaking Changes：
- 推荐使用 SCENARIO_AUTH 环境变量代替 --authorization 参数
- 文件路径必须在工作区内
- 外部插件需要 --allow-external-plugins 标志

📦 如何升级：
git pull origin master
git checkout v0.3.0

📚 完整文档：
- Release: http://192.168.1.239/zhangqianfeng/scenario-test/-/releases/v0.3.0
- 安全指南: http://192.168.1.239/zhangqianfeng/scenario-test/-/blob/master/SECURITY.md
- 迁移指南: http://192.168.1.239/zhangqianfeng/scenario-test/-/blob/master/CHANGELOG.md

如有问题，请联系我或提交 Issue。

谢谢！
```

---

## ✅ 完成检查清单

创建 Release 后，请确认：

- [ ] GitLab Release 已创建
- [ ] Release 说明显示正确
- [ ] 所有文档链接可以访问
- [ ] 标签 v0.3.0 显示正确
- [ ] （可选）团队已收到通知

---

## 🎉 发版完成！

完成上述步骤后，scenario-test v0.3.0 发版工作就全部完成了！

**接下来**：
- 监控 GitLab Issues
- 收集用户反馈
- 准备 v0.3.1（如果需要）

祝使用顺利！🚀
