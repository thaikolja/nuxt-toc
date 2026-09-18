---
title: Contributor playgrounds for Content v2/v3
description: >-
  How the dual content-v2 and content-v3 playgrounds verify nuxt-toc across both Content majors — separate node_modules, shared routes, and when to use which.
---

# Playgrounds

Every feature must be visibly verified against **both** Content majors. The repo keeps **two minimal playground apps** rather than one heavy blog — Content v2 and v3 cannot share a single `node_modules`.

## Layout

| Folder                   | Stack                       | Port | Demo               | Command          |
| ------------------------ | --------------------------- | ---- | ------------------ | ---------------- |
| `playgrounds/content-v3` | Nuxt 4 + `@nuxt/content@^3` | 3000 | Content v3 queries | `npm run dev:v3` |
| `playgrounds/content-v2` | Nuxt 4 + `@nuxt/content@^2` | 3001 | Content v2 queries | `npm run dev:v2` |

Each has its own `package.json` → own `node_modules`. The TOC runtime (`TableOfContents.vue + TocTree.vue + helpers`) is identical — only the fetch plugin and query shape differ.

## Shared demo routes

| Path          | Exercises                                                                             |
| ------------- | ------------------------------------------------------------------------------------- |
| `/`           | **Pass-in** `:toc="page.body.toc"` + sticky sidebar grid (`pages/index.vue`)          |
| `/auto-fetch` | Auto-fetch by `path`, `collection` (v3), missing-path / empty states                  |
| `/props`      | Title, `depth`, `isSublistShown`, `isTitleShownWithNoContent`, `path`, `collection`   |
| `/settings`   | Global `nuxtToc` options vs prop overrides + `content.build.markdown.toc` interaction |

Plugins and `ContentRenderer` vs `ContentDoc` differences are most visible under `/props` and `/settings`.

## One-time setup

```bash
npm install
npm run dev:prepare   # module stub → playground installs → nuxi prepare both apps
```

Then in parallel:

```bash
npm run dev:v3        # http://localhost:3000
npm run dev:v2        # http://localhost:3001
```

## Keep in sync

- **Branding:** root `logo.png` → copy to `playgrounds/content-v3/public/logo.png`, `playgrounds/content-v2/public/logo.png`, `docs/public/logo.png` when the logo changes.
- **Deps:** upgrades remain in the respective `playgrounds/*/package.json` — never hoist `@nuxt/content` to the root.
- **Content depth:** both `playgrounds/*/nuxt.config.ts` use `content.build.markdown.toc: { depth: 4, searchDepth: 4 }` so props can trim display freely. Keep them aligned.
- **Do not expand into blogs.** Keep the markdown under `content/` minimal — playground routes exist to exercise TOC behavior, not to host a documentation site.

## How tests use them

E2e suites `test/content-v3.test.ts` and `test/content-v2.test.ts` build/run the respective playground. They cover:

- `pass-in` render and nested links,
- `auto-fetch` by path,
- props (`title`, `depth`, `isSublistShown`, `isTitleShownWithNoContent`),
- module `nuxtToc` options vs prop precedence,
- `contentMajor` detection and empty/loading states.

Run `npm run dev:prepare` before e2e so `node_modules` and `.nuxt/` are present. See [Testing](/contributing/testing).

Also see the per-playground docs pages: [Content v3 playground](/content-v3/playground) and [Content v2 playground](/content-v2/playground).
