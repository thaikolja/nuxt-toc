---
title: nuxt-toc v3.0.0 breaking changes
description: >-
  Breaking changes in nuxt-toc 3.0.0: required peers, strict nuxtToc key, removal of CustomQuery, npm-only tooling, kit range, and what is unchanged.
---

# Breaking changes (v3.0.0)

v3.0.0 is the **Nuxt 4** major with dual Content v2/v3 runtime. It is stable and interactive-tested with `nuxt-module-build`, `vitest`, and both playground builds (`npm run check` / `npm run prepack`).

## What breaks if you do not change anything

| Area                           | v2.x tolerated                                | v3.0.0 requires                                                                                       |
| ------------------------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Node**                       | 16/18 depending on Nuxt version               | **`>=20.0.0`** (`package.json → engines`)                                                             |
| **Nuxt**                       | `^3.x` loosely                                | **`^3.16.0 \|\| ^4.0.0`**, Nuxt 4 is primary host for this docs lineup                                |
| **`@nuxt/content`**            | v2 only                                       | **`^2.0.0 \|\| ^3.0.0`** — v3 now supported, v1 not                                                   |
| **Key under `nuxt.config.ts`** | Varied docs, often implicit                   | **`nuxtToc` (camelCase)** — `defineNuxtModule({ configKey: 'nuxtToc' })` in `src/module.ts:155`       |
| **Internal fetch**             | `CustomQuery` helper built into the component | Removed — replaced by registered plugins `fetch-v2` / `fetch-v3` (one added at `setup()`)             |
| **Published runtime**          | `quasar`? no, package lacked metadata         | `homepage`, `bugs`, `publishConfig`, `sideEffects` set                                                |
| **Playground location**        | Single heavy blog app                         | `playgrounds/content-v2` + `content-v3` — `dev:prepare` required                                      |
| **Package manager**            | pnpm/npm mixed                                | **npm `10.9.2`** — `packageManager: npm@10.9.2`, `package-lock.json` committed, no pnpm/bun lockfiles |

## Detailed changes

### Module key is now `nuxtToc`

```ts
// v2.x (would still load the module but options ignored)
export default defineNuxtConfig({
  // 'nuxt-toc': { … }
})

// v3.0.0
export default defineNuxtConfig({
  nuxtToc: { collection: 'content', depth: 2, scrollSpy: true, … }
})
```

Defaults come from `src/module.ts:162` and are clamped in `normalizeOptions` (validates `collection`, positive integer `depth`, `scrollSpy !== false`, etc.).

### `CustomQuery` removed

v2.x embedded a `CustomQuery` helper that effectively ran a Content query inside the TOC. v3.0.0 removes it and instead:

- Runs `queryContent` / `queryCollection` via **version-specific plugins** that are `addPlugin`-ed once (never both) — see `src/module.ts:204` / `fetch-v2.ts` / `fetch-v3.ts`.
- Exposes them as `$nuxtTocFetch` for auto-fetch (`TableOfContents.vue:295`).

**Migration:** replace `CustomQuery` with an explicit page query and pass-in `:toc` (see [Quick start](/guide/quick-start)), or rely on auto-fetch `<TableOfContents />`.

### Dual Content majors + detection

`detectContentMajor(rootDir)` (`src/utils/detect-content-major.ts:32`) reads `@nuxt/content/package.json`. Only `2` and `3` are wired. No `node_modules` layout ever bundles both plugins. See [Compatibility — how dual support works](/guide/compatibility#how-dual-content-support-works).

### Kit range and publish

- Package `dependencies: { "@nuxt/kit": ">=3.16.0 <5.0.0" }`.
- `peerDependencies: { "@nuxt/content": "^2 || ^3", "nuxt": "^3.16 || ^4" }` — optional on `@nuxt/content` so pass-in with a hand-built TOC is possible without Content at all.
- Published `dist/` via `nuxt-module-build`; do not hand-edit `dist/` — it is an artifact of `npm run prepack`.

### Tooling becomes npm-only

`packageManager` field in `package.json` and `package-lock.json` are authoritative. CI (`lint`, `format:check`, `test`, `pack dry-run`) runs with `npm`. Adding a `pnpm-lock.yaml` or `bun.lockb` is considered a regression — remove it before PRs.

### Removed assets

- `screenshots/` deleted.
- Early CSS class experiments pruned — public styling contract is now the list in [Styling](/guide/styling) (`#toc-title`, `#toc-container`, `.toc-link`, `.toc-item`, `.active-toc-item`, …).

## What is intentionally unchanged

The **stable theming contract** was preserved for v2.x upgrades:

- `#toc-title`, `#toc-container`
- `.toc-item`, `.toc-topitem`, `.toc-sublist`, `.toc-sublist-item`
- `.toc-link`, `.toc-toplink`, `.toc-sublink`
- `.active-toc-item`, `.active-toc-topitem`, `.active-toc-sublist-item`
- `#toc-item-${id}`

Default styles (`TableOfContents.vue:759`) remain minimal (list reset, 1rem/1.5rem nested indent, `color: #fef08a` active). Upgrade by just updating `@nuxt/content` and `nuxt.config.ts → nuxtToc` — no markup or CSS rename.

## Full history

See [guide/changelog](/guide/changelog) → root `CHANGELOG.md` for every previous minor (v2.7.x → v1.0). Release notes for the current major live there.
