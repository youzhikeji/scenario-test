# Security Fix Implementation Plan

## Overview
Fix 18 security and code quality issues identified in code review, prioritized by severity.

## Phase 1: CRITICAL Security Fixes (Immediate)

### 1.1 Add Path Boundary Validation Utility
**File**: `src/utils/path-validator.js` (new)
**Purpose**: Centralized secure path validation
**Implementation**:
- Extract and enhance `safeFile()` from cli.js
- Add comprehensive JSDoc documentation
- Export as reusable utility

### 1.2 Fix XLSX Adapter Path Traversal
**File**: `src/adapters/xlsx.js`
**Changes**:
- Import path validator utility
- Validate `definition.template` and `definition.output` against workspace boundary
- Throw security error if paths escape workspace
- Update error messages to be actionable

### 1.3 Fix Node IO Path Traversal
**File**: `src/node/io.js`
**Changes**:
- Import path validator utility
- Validate file upload paths in `createUploadBody()`
- Validate save paths in `saveResponse()`
- Reject absolute paths and parent directory traversal

### 1.4 Document vm.runInContext Security Implications
**File**: `docs/SECURITY.md` (new)
**Content**:
- Explain sandbox limitations
- Document attack surface of scenario files
- Recommend plugin allowlisting strategy
- Add warning about untrusted scenario files

**File**: `src/node/loader.js`
**Changes**:
- Add JSDoc warning about security implications
- Log warning when loading files from outside project

## Phase 2: HIGH Priority Fixes

### 2.1 Move Authorization to Environment Variable
**File**: `src/cli.js`
**Changes**:
- Deprecate `--authorization` flag (keep for backward compatibility with warning)
- Read from `SCENARIO_AUTH` environment variable first
- Document migration in changelog
- Add deprecation warning when `--authorization` is used

### 2.2 Mask Environment Variable Names in Errors
**File**: `src/engine.js` line 69
**Changes**:
- Create utility function to mask sensitive variable names
- Update error message to show `vars.${name}` only, not environment variable name
- Add option to enable verbose error messages for debugging (via env var)

### 2.3 Validate Plugin Paths
**File**: `src/cli.js` lines 153-154
**Changes**:
- Use path validator to ensure plugins are within configDir
- Add `--allow-external-plugins` flag for legitimate external plugins
- Document security implications

### 2.4 Add Comprehensive Security Tests
**File**: `tests/security.test.js`
**Add test cases**:
- Path traversal attempts (../, absolute paths)
- Environment variable leakage in error messages
- Plugin path boundary validation
- File upload/save boundary checks

## Phase 3: MEDIUM Priority Fixes

### 3.1 Implement Immutable Runtime Vars
**File**: `src/engine.js`
**Changes**:
- Use `Object.freeze()` on runtime.vars after initialization
- Create helper to return frozen copies
- Update tests to verify immutability

### 3.2 Add JSON Parse Error Logging
**File**: `src/core.js` line 113
**Changes**:
- Add optional logger parameter to `parseBody()`
- Log parse failures with truncated content preview
- Preserve existing behavior (return string on failure)

### 3.3 Validate Library Dist Path in Server
**File**: `src/cli.js` lines 268, 272-273
**Changes**:
- Validate libraryDist is within expected directory
- Use path validator for special routes
- Add tests for directory traversal attempts

### 3.4 Add Input Sanitization for Query Parameters
**File**: `src/core.js` buildUrl function
**Changes**:
- Add validation for potentially dangerous characters in keys
- Document accepted character set
- Add tests for injection attempts

### 3.5 Separate Secret from Runtime Vars
**File**: `src/engine.js` line 85
**Changes**:
- Pass secrets as separate parameter to signature generation
- Never store raw secrets in vars
- Clear secrets from memory after use

### 3.6 Add Retry Timeout Protection
**File**: `src/engine.js` line 236
**Changes**:
- Add elapsed time limit for retries (default 5 minutes)
- Ensure minimum intervalMs of 100ms
- Add tests for infinite retry scenarios

## Phase 4: LOW Priority Improvements

### 4.1 Refactor Large Legacy Files
**Files**: 
- `src/browser/legacy/runtime.js` (~1200 lines)
- `src/browser/legacy/core.js` (~450 lines)
**Strategy**:
- Extract UI rendering logic
- Separate state management
- Create focused modules (<400 lines each)
- Note: Low priority - legacy code, potentially deprecated

### 4.2 Improve Error Messages
**Files**: Multiple locations
**Changes**:
- Add "How to fix" section to error messages
- Include relevant documentation links
- Provide actionable next steps

### 4.3 Add Error Path Test Coverage
**Files**: All test files
**Changes**:
- Test every throw statement
- Test boundary conditions
- Add integration tests for error scenarios
- Target: 80%+ coverage including error paths

### 4.4 Improve HTML Escaping
**File**: `src/browser/legacy/ui-view.js` line 814
**Changes**:
- Prefer `textContent` over `innerHTML` where possible
- Review custom `esc()` function
- Add XSS test cases

### 4.5 Add Rate Limiting to Dev Server
**File**: `src/cli.js` serveCommand
**Changes**:
- Add simple in-memory rate limiter
- Default: 100 requests/minute per IP
- Configurable via --rate-limit flag

## Testing Strategy

### Unit Tests
- Path validator utility (all edge cases)
- Immutability enforcement
- Error message masking
- Input sanitization

### Integration Tests
- File operations with malicious paths
- Authorization from environment variables
- Plugin loading restrictions
- Retry timeout scenarios

### Security Tests
- Path traversal attack vectors
- XSS attempts via UI
- Credential leakage scenarios
- DoS via infinite retries

## Rollout Plan

### Step 1: Create Feature Branch
```bash
git checkout -b security-fixes-2026-08
```

### Step 2: Implement in Phases
- Phase 1 (CRITICAL): 1 day
- Phase 2 (HIGH): 1 day
- Phase 3 (MEDIUM): 2 days
- Phase 4 (LOW): 3 days (optional)

### Step 3: Testing
- Run full test suite after each phase
- Add new tests incrementally
- Manual security testing with attack vectors

### Step 4: Documentation
- Update README.md with security best practices
- Create SECURITY.md with vulnerability reporting process
- Add CHANGELOG.md entry with breaking changes

### Step 5: Review & Release
- Code review by security-focused reviewer
- Bump version to 0.3.0 (breaking changes in auth)
- Tag release and publish

## Breaking Changes

1. **Authorization Flag Deprecation**: `--authorization` still works but logs warning
2. **Plugin Path Restrictions**: External plugins require `--allow-external-plugins`
3. **Path Validation**: Absolute paths in file operations now rejected by default

## Backward Compatibility

- Keep deprecated `--authorization` working for 2 releases
- Add migration guide in CHANGELOG.md
- Provide environment variable equivalents for all flags

## Success Metrics

- [ ] All CRITICAL issues resolved
- [ ] All HIGH issues resolved
- [ ] 80%+ test coverage including error paths
- [ ] Security test suite passing
- [ ] Documentation complete
- [ ] Zero hardcoded secrets/credentials
- [ ] All file operations boundary-checked
