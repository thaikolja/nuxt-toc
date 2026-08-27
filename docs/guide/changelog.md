---
title: nuxt-toc changelog and release notes
description: >-
  Release highlights for nuxt-toc 3.x and links into the full CHANGELOG.md — breaking changes, enhancements, and migration pointers.
---

# Changelog

The authoritative history is the root [`CHANGELOG.md`](https://github.com/thaikolja/nuxt-toc/blob/main/CHANGELOG.md) (edited by `changelogen` at release time). This page highlights the current major so beginners know what to expect.

## v3.0.0 (current major)

**Nuxt 4** primary target with dual Content support.

**Breaking (see [Breaking changes](/migration/breaking-changes)):**
- Peers `nuxt ^3.16 || ^4` and `@nuxt/content ^2 || ^3`.
- Config key is now **`nuxtToc`** (not a hyphenated name) with `collection` / `depth` / `scrollSpy` / `rootMargin` / `smooth` / `scrollOffset` — all stable in this line.
- `CustomQuery` removed — use a page query + pass-in `:toc` or the new version-specific plugins (`fetch-v2` / `fetch-v3`).
- Single playground replaced by dual `playgrounds/content-v2` + `content-v3` (separate installs, ports `:3001`/`:3000`).
- Toolchain is **npm** (`package-lock.json`) with `@nuxt/kit >=3.16 <5`.

**Preserved from v2.x:**
- Public styling contract: `#toc-title`, `#toc-container`, `.toc-link`, `.active-toc-item`, etc.

**Enhancements (see [Introduction](/guide/introduction) → [How it works](/guide/how-it-works)):**
- Auto-detects Content major via `detectContentMajor` and registers exactly one fetch plugin — never both.
- `<TableOfContents>` accepts prefetched `page.body.toc` on both majors, depth-limited via `limitTocDepth` / `resolveEffectiveDepth`.
- Empty-state UX (`--pending` / `--empty` / `--error`) + title-only mode, `IntersectionObserver` with `requestAnimationFrame` batching.

**Docs:**
- `AGENTS.md` for maintainers, VitePress site + GitHub Pages at `https://thaikolja.github.io/nuxt-toc/`, slim multilingual READMEs, `logo.png` branding across all surfaces.

**Chore:**
- `build.config.ts`, `eslint.config.ts`, `sideEffects`, `publishConfig` metadata, deduped CI docs workflow.

## Earlier versions

See `CHANGELOG.md` in full — including v2.7.x modular props (`toc` pref, title, empty states), v2.6 styling normalization, and v1.0 playground origins.

For upgrading between majors: [Migrating from v2.x](/migration/from-v2) and [Content v2 → v3 for your app](/migration/content-v2-to-v3).
