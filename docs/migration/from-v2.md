---
title: Migrate from nuxt-toc 2.x to 3.0
description: >-
  Upgrade from nuxt-toc 2.x to 3.0.0: new nuxtToc config key, version-specific plugins, dual Content support, playground and tooling changes.
---

# Migrating from nuxt-toc 2.x → 3.0

`3.0.0` is a new major for **Nuxt 4** with dual Content awareness. Most TOC template lines (`:toc`, `title`, `isSublistShown`) continue to work — the biggest change is `nuxt.config.ts`.

## At a glance

| Area | v2.x | v3.0.0 |
|---|---|---|
| Content | v2 only | **v2 or v3** from one install |
| Internal fetch | `CustomQuery` helper in the component | **Version-specific plugins** (`fetch-v2` / `fetch-v3`) chosen at setup; never both |
| Config key | Loosely `nuxt-toc` (docs varied) | Strictly **`nuxtToc`** (camelCase, `src/module.ts:155`) |
| Styles | Early majors had `.toc-*` class churn | **Stable IDs**: `#toc-title`, `#toc-container`, `.toc-link`, `.active-toc-item` (preserved from v2.x) |
| Playground | Single heavy blog app | **Dual minimal apps** `playgrounds/content-v2` (3001) + `content-v3` (3000), each with its own `node_modules` |
| Package manager | pnpm / npm mixed | **npm only** (`npm@10.9.2`, commits `package-lock.json`) |
| Published kit | loose | `@nuxt/kit >=3.16 <5` (Nuxt 4 primary) |

## 1. Update install

```bash
# Before — may still be pnpm
npm install nuxt-toc@^3 @nuxt/content@^3   # or @nuxt/content@^2 if staying on v2
```

## 2. Fix `nuxt.config.ts`

```ts
// ❌ v2.x (implicit or wrong key)
export default defineNuxtConfig({
  modules: ['nuxt-toc'],
  // 'nuxt-toc': { ... }  // not this
})

// ✅ v3.0.0
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],  // register both explicitly
  nuxtToc: {
    collection: 'content',   // v3 only; ignored on v2
    depth: 2,
    scrollSpy: true,
    rootMargin: '0px 0px -80% 0px',
    smooth: false,
    scrollOffset: 0,
  },
})
```

Full reference: [Module options](/api/module-options). Global defaults now map 1:1 to props.

## 3. Keep or adopt pass-in `page.body.toc`

```vue
<!-- Works on both majors — preferred on 3.0 too -->
<TableOfContents :toc="page?.body?.toc" />
```

Auto-fetch still works, but it now calls `queryCollection(collection).path(path).first()` on v3 vs `queryContent(path).findOne()` on v2 — the detection is automatic (`src/utils/detect-content-major.ts:32`).

## 4. Deleted / changed areas

- **`CustomQuery`** internal component was removed — replace with explicit Content queries (`queryCollection` / `queryContent`) in your page or rely on the module’s plugin-driven `$nuxtTocFetch`.
- **`nuxtToc.collection`** defaults to `'content'` when omitted (`normalizeOptions` in `src/module.ts:118`).
- Published package now lists `homepage`, `bugs`, `publishConfig.access: 'public'`, and `sideEffects: ["**/*.css","**/*.vue"]`.
- `screenshots/` assets were removed; branding is now `logo.png` (root `playgrounds/*/public`, `docs/public`).

For app-level Content migration (v2 → v3 queries, `ContentRenderer` vs `ContentDoc`), see [Migrating your app: Content v2 → v3](/migration/content-v2-to-v3). For a full breaking list, see [Breaking changes](/migration/breaking-changes).
