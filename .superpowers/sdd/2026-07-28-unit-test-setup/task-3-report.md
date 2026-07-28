# Task 3 Completion Report

**Status:** DONE

## Commits Made
- `3b217a7` — chore: server, authmanager vitest 설정 공통 프리셋으로 교체

## Summary
Successfully migrated `apps/server/fireballing-server` and `packages/authmanager` to use the shared `defineNodeConfig()` preset from `@fblg/testing-config`.

### Files Modified
1. **apps/server/fireballing-server/**
   - `package.json`: Added `@fblg/testing-config` as devDependency
   - `vitest.config.ts`: Replaced manual config with `defineNodeConfig()`

2. **packages/authmanager/**
   - `package.json`: Added `@fblg/testing-config` as devDependency
   - `vitest.config.ts`: Replaced manual config with `defineNodeConfig()`
   - `tsconfig.json`: Added `allowImportingTsExtensions: true` (required for TypeScript to accept `.ts` extensions in imports)

3. **packages/testing-config/**
   - `index.ts`: Added `.ts` extension to imports for proper ESM module resolution
   - `tsconfig.json`: Added `allowImportingTsExtensions: true` (required for TypeScript strict checking)

## Test Results
- **Server tests:** 8 files, 47 tests — **PASS** ✓
- **Authmanager tests:** No test files found (expected)

## Notes
- The `.ts` extension requirement in index.ts imports is necessary for proper ESM resolution in workspace environments with TypeScript strict checking
- All pre-commit hooks (type checking, linting) passed successfully
- Migration maintains backward compatibility — existing server tests continue to pass without modification

---

## Review Finding Analysis & Response

**Finding:** `.ts` extensions in `packages/testing-config/index.ts` were unnecessary; `moduleResolution: "Bundler"` supports extensionless imports.

**Analysis:** While `moduleResolution: "Bundler"` does support extensionless imports at **type-check time**, this package is in ESM mode (`"type": "module"` in package.json). At **runtime**, Node.js ESM requires explicit `.ts` extensions for local imports—a fundamental ESM constraint unrelated to TypeScript's module resolution configuration.

**Testing Performed:**
- Attempted revert to extensionless imports with `moduleResolution: "bundler"` alone: Runtime fails with `ERR_MODULE_NOT_FOUND`
- Tested with/without exports field mappings: No resolution without explicit `.ts` extensions
- Type-checking passes (bundler handles it), but vitest cannot load config files at runtime

**Conclusion:** The current implementation (`.ts` extensions + `allowImportingTsExtensions: true`) is **correct and necessary**, not redundant. The finding is based on a misconception conflating type-check resolution with runtime resolution. No changes made.

### Test Status: VERIFIED
- `yarn workspace @fblg/testing-config check-types` — PASS ✓
- `yarn workspace @fblg/authmanager check-types` — PASS ✓
- `yarn workspace fblg-server test` — 47 tests PASS ✓
