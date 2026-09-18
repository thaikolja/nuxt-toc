---
title: Content v2 playground demo
description: >-
  Run the local Content v2 playground for nuxt-toc on port 3001 — pass-in, auto-fetch, and props demos on a separate Nuxt 4 + Content v2 app.
---

# Content v2 playground

Minimal Nuxt 4 + Content v2 demo app at `playgrounds/content-v2` — mirrors the v3 playground but built against `@nuxt/content@^2`. It has its own `package.json` / `node_modules` because Content majors cannot share a tree.

## Run

```bash
# From repository root — one-time
npm install
npm run dev:prepare   # stub + prepare both playgrounds

# Run the v2 playground
npm run dev:v2
# or: npx nuxi dev playgrounds/content-v2 --port 3001
```

- URL: `http://localhost:3001`
- Module config: `playgrounds/content-v2/nuxt.config.ts`
- Branding: `playgrounds/content-v2/public/logo.png`
- Uses `queryContent` throughout (no `content.config.ts` — v2 does not have collections)

## Routes

| Route         | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `/`           | Pass-in (`:toc="page.body.toc"`) — `queryContent(route.path).findOne()` |
| `/auto-fetch` | Auto-fetch by `path` (no `collection`) — missing-path and empty states  |
| `/props`      | `title`, `depth`, `isSublistShown`, `isTitleShownWithNoContent` matrix  |

::: tip Check dual support without two machines
Run both playgrounds at once (`npm run dev:v3` in one terminal, `npm run dev:v2` in another) and compare a props tweak on v3 vs v2 side-by-side. The TOC render (`TocTree` + `.nuxt-toc` classes) is identical — only the query helper differs.
:::

E2e tests: `test/content-v2.test.ts` (and `test/content-v3.test.ts` for the other major). See also [Playgrounds — contributor guide](/contributing/playgrounds) for the repo-level workflow.
