# Nuxt 4 Requirements

This document outlines the requirements and changes needed for `nuxt-toc` to be compatible with Nuxt 4.

## Overview

Nuxt 4 introduces breaking changes and new features that require updates to modules and applications. This document serves as a checklist for upgrading `nuxt-toc` from Nuxt 3 to Nuxt 4 compatibility.

## Current Status

- **Current Nuxt Version**: 3.12.4
- **Target Nuxt Version**: 4.x
- **Module Version**: 2.7.2

## Node.js Requirements

- **Minimum Node.js Version**: 18.0.0 or higher
- **Recommended Version**: Node.js 20.x (LTS)
- Drop support for Node.js 16.x (EOL)

## Nuxt 4 Core Requirements

### 1. Package Updates

Update all Nuxt-related dependencies to Nuxt 4 compatible versions:

```json
{
  "dependencies": {
    "@nuxt/kit": "^4.0.0"
  },
  "devDependencies": {
    "@nuxt/devtools": "^2.0.0",
    "@nuxt/module-builder": "^0.9.0",
    "@nuxt/schema": "^4.0.0",
    "@nuxt/test-utils": "^4.0.0",
    "nuxt": "^4.0.0"
  }
}
```

### 2. ESM-First Architecture

- **Full ESM Support**: Nuxt 4 is ESM-first, requiring modules to be ESM-compatible
- Ensure all imports use `.js` extensions or proper module resolution
- Update `package.json` to explicitly set `"type": "module"` (already done ✓)

### 3. Vue 3.5+ Compatibility

- **Minimum Vue Version**: 3.5.0
- Update to latest Vue 3.x version that's compatible with Nuxt 4
- Test with Vue 3.5+ features and reactivity system

### 4. Directory Structure Changes

#### Removed `pages/` Auto-Import Behavior
- Previously, pages were auto-imported; now requires explicit configuration if needed
- No direct impact on module, but document for users

#### New Default Directory Structure
- `app/` directory as the new default (replaces root-level directories)
- Module should support both old and new structures

### 5. Composables and Auto-Imports

#### Stricter Auto-Import Rules
- Auto-imports are more explicit
- Use `#imports` for internal imports
- Module composables must be properly exported

#### Updated Import Paths
```typescript
// Old
import { defineNuxtModule } from '@nuxt/kit'

// New (same, but ensure compatibility)
import { defineNuxtModule } from '@nuxt/kit'
```

### 6. Configuration Changes

#### `nuxt.config.ts` Updates

**Removed/Deprecated Options:**
- `target` property (removed)
- `bridge` property (removed - no longer needed)
- `vite.optimizeDeps.exclude` (changed behavior)

**New Required Options:**
```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01', // Required for Nuxt 4
  future: {
    compatibilityVersion: 4, // Enable Nuxt 4 features
  },
})
```

**Updated Default Behaviors:**
- `experimental.payloadExtraction` is now default `true`
- `experimental.renderJsonPayloads` is now default `true`
- `experimental.sharedPrerenderData` is now default `true`

### 7. TypeScript Requirements

- **Minimum TypeScript Version**: 5.0+
- Stricter type checking
- Update `.nuxt/types.d.ts` generation compatibility
- Ensure module provides proper TypeScript definitions

### 8. Build Tool Updates

#### Vite 6+
- **Minimum Vite Version**: 6.0.0
- Update Vite plugins and configuration
- Test build performance and compatibility

#### Rollup 4+
- Ensure compatibility with Rollup 4.x

### 9. Routing Changes

#### File-Based Routing Updates
- New route types and definitions
- Updated `pages:extend` hook signature
- Type-safe routing with better TypeScript support

#### Route Middleware
- Updated middleware signature
- Async middleware handling improvements

### 10. Server Engine (Nitro) Updates

- **Nitro Version**: 3.x (bundled with Nuxt 4)
- Updated server API
- New deployment presets
- Enhanced edge runtime support

### 11. Module Development Changes

#### Module Builder Updates
- Update to `@nuxt/module-builder` 0.9+
- New build targets and options
- ESM-only module output

#### Module Hook Changes
```typescript
// Ensure compatibility with new hook signatures
export default defineNuxtModule({
  setup(options, nuxt) {
    // Updated hook APIs
    nuxt.hook('pages:extend', (pages) => {
      // New signature
    })
  }
})
```

### 12. Content Module Compatibility

**Critical for nuxt-toc:**
- **@nuxt/content Version**: Must use v3.x (Nuxt 4 compatible)
- Currently, `nuxt-toc` v2.7.2 requires `@nuxt/content` v2.x
- **Breaking Change**: Major refactor needed for Content v3 API

#### Content v3 Changes:
- New query API syntax
- Updated document structure
- Changed TOC data format
- New composables (`useContent()`, `queryContent()`)

### 13. Breaking API Changes

#### Removed APIs
- `$content` global (use `queryContent()` composable)
- Legacy `asyncData` format (use `useAsyncData()`)
- `fetch` hook (use `useAsyncData()` or `useFetch()`)

#### Changed APIs
- `useHead()` replaces `head()` option
- Updated `useState()` signature
- New error handling patterns

### 14. Performance Requirements

- **Lighthouse Score**: Maintain 90+ for default config
- **Bundle Size**: Reduce by leveraging tree-shaking
- **Runtime Performance**: Optimize for edge deployments

### 15. Compatibility & Testing

#### Browser Support
- Modern browsers only (ES2020+)
- Drop IE11 support (already done)
- Target evergreen browsers

#### Testing Requirements
- Update test suite for Nuxt 4 APIs
- Test with `@nuxt/test-utils` v4
- E2E testing with Nuxt 4 runtime

### 16. Documentation Updates

- [ ] Update README.md with Nuxt 4 compatibility notes
- [ ] Add migration guide from v2.x to v3.x
- [ ] Update examples for Nuxt 4 syntax
- [ ] Document breaking changes
- [ ] Update TypeScript examples

### 17. Accessibility (ARIA) Requirements

- Maintain existing ARIA support
- Test with updated Vue 3.5 accessibility features
- Ensure compliance with WCAG 2.1 Level AA

## Module-Specific Requirements

### For `nuxt-toc` Module

1. **Content Module Integration**
   - Migrate from `@nuxt/content` v2 to v3
   - Update TOC parsing logic
   - Update query syntax

2. **Component Updates**
   - Ensure `<TableOfContents />` works with Nuxt 4
   - Update reactive patterns for Vue 3.5
   - Test SSR and CSR rendering

3. **Props and API**
   - Review all component props
   - Ensure TypeScript definitions are accurate
   - Test all documented examples

4. **Build Configuration**
   - Update `build.config.js` if needed
   - Ensure proper tree-shaking
   - Optimize bundle size

## Migration Strategy

### Phase 1: Preparation
1. Update Node.js to v20+ in CI/CD
2. Update development dependencies
3. Run tests with current setup (establish baseline)

### Phase 2: Core Updates
1. Update Nuxt to v4
2. Update Vue to v3.5+
3. Update @nuxt/kit and related packages
4. Fix breaking changes

### Phase 3: Content Module Migration
1. Update `@nuxt/content` to v3
2. Refactor TOC query logic
3. Update component to use new APIs
4. Test all functionality

### Phase 4: Testing & Validation
1. Run full test suite
2. Test playground application
3. Perform manual testing
4. Test in production-like environment

### Phase 5: Documentation & Release
1. Update all documentation
2. Create migration guide
3. Release as v3.0.0
4. Monitor for issues

## References

- [Nuxt 4 Release Notes](https://nuxt.com/blog/v4)
- [Nuxt 4 Upgrade Guide](https://nuxt.com/docs/getting-started/upgrade)
- [Nuxt 4 Migration Checklist](https://nuxt.com/docs/migration/overview)
- [@nuxt/content v3 Documentation](https://content.nuxt.com/)
- [Vue 3.5 Release Notes](https://blog.vuejs.org/posts/vue-3-5)

## Related Issues

- Fixes https://linear.app/thaikolja/issue/KOLJA-18/maintenance

## Checklist Summary

### Must-Have for Nuxt 4 Compatibility
- [ ] Node.js 18+ requirement
- [ ] Nuxt 4.x dependencies
- [ ] Vue 3.5+ compatibility
- [ ] @nuxt/content v3 integration
- [ ] ESM-first architecture
- [ ] Updated TypeScript definitions
- [ ] Vite 6+ compatibility
- [ ] compatibilityDate in config

### Should-Have
- [ ] Updated examples in playground
- [ ] Migration documentation
- [ ] Performance optimizations
- [ ] Enhanced TypeScript support

### Nice-to-Have
- [ ] Edge runtime support
- [ ] Additional accessibility features
- [ ] Enhanced error messages
- [ ] Development mode improvements

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-02-06  
**Status**: Planning Phase
