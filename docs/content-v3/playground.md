---
title: Content v3 playground demo
description: >-
  Run the local Content v3 playground for nuxt-toc on port 3000 — pass-in, auto-fetch, props, and settings demos with synced logo.png.
---

# Content v3 playground

Minimal Nuxt 4 + Content v3 demo app that exercises `nuxt-toc` in both modes. Lives at `playgrounds/content-v3` — it has its own `package.json` / `node_modules` because Content v2 and v3 cannot share one tree.

## Run

```bash
# From repository root — one-time
npm install
npm run dev:prepare   # stubs module + installs + nuxi prepare both playgrounds

# Run the v3 playground
npm run dev:v3
# or: npx nuxi dev playgrounds/content-v3 --port 3000
```

- URL: `http://localhost:3000`
- Content config: `playgrounds/content-v3/content.config.ts`
- Module config: `playgrounds/content-v3/nuxt.config.ts` (note `content.build.markdown.toc: { depth: 4, searchDepth: 4 }` — extracts h2–h4 so props can limit display)
- Branding: `playgrounds/content-v3/public/logo.png` (same file as repo root `logo.png` and `docs/public/logo.png`)

## Routes

| Route | Purpose |
|---|---|
| `/` | **Pass-in** (`:toc="page.body.toc"`) + sticky sidebar layout. Mirrors typical docs. |
| `/auto-fetch` | Auto-fetch by `path` / `collection`. Try missing path, empty headings, different collections. |
| `/props` | Parameter matrix — toggles `depth`, `isSublistShown`, `isTitleShownWithNoContent`, `title`, `scrollSpy`, `rootMargin`, `smooth`, `scrollOffset`. Best for tuning scroll-spy. |
| `/settings` | Module-option defaults vs prop overrides exercise. |

See also the v2 equivalent: [Content v2 playground](/content-v2/playground). E2e tests hit both playgrounds (`test/content-v3.test.ts`, `test/content-v2.test.ts`).
