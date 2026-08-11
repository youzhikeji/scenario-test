# Release v0.3.0 - Security Fixes and Improvements

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

See [SECURITY.md](https://github.com/youzhikeji/scenario-test/blob/master/SECURITY.md) for details.

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

See [CHANGELOG.md](https://github.com/youzhikeji/scenario-test/blob/master/CHANGELOG.md) for complete migration guide.

---

## 📦 Installation

```bash
npm install scenario-test@0.3.0
```

Or download from releases page.

---

## ✅ What's Tested

- ✅ All 43 tests passing (100%)
- ✅ Security test suite added
- ✅ Build verified on Node.js 18+
- ✅ Backward compatibility maintained (with deprecation warnings)

---

## 📚 Documentation

- [Security Guide](https://github.com/youzhikeji/scenario-test/blob/master/SECURITY.md)
- [Changelog](https://github.com/youzhikeji/scenario-test/blob/master/CHANGELOG.md)
- [README](https://github.com/youzhikeji/scenario-test/blob/master/README.md)

---

## 🙏 Acknowledgments

Security fixes implemented with assistance from Claude Opus 4.8.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
