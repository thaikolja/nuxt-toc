---
title: Build and preview the docs site
description: >-
  Edit, build, and preview the VitePress documentation at docs/, keep logo.png in sync, and how GitHub Pages deploys via the docs workflow.
---

# Docs site

This VitePress site lives under `docs/` (`docs/.vitepress/config.ts`). Source of truth for the published docs at **https://thaikolja.github.io/nuxt-toc/**.

## Local development

```bash
npm install
npm run docs:dev      # http://localhost:5173  (VitePress default)
npm run docs:build    # static output to docs/.vitepress/dist
npm run docs:preview  # preview of built site
```

`base` is resolved in `docs/.vitepress/config.ts:6`:

```ts
const base = process.env.DOCS_BASE ?? (process.env.CI ? '/nuxt-toc/' : '/')
```

- Local (`docs:dev`) uses `/` so images/links resolve as `/logo.png`.
- CI (GitHub Pages project site) uses `/nuxt-toc/` so `base: /nuxt-toc/` applies.

## Editing conventions

- Every `.md` file keeps **`title`** + **`description`** frontmatter (used for `<title>`/`og:description` fallback and sitemap). Edit inlines under `transformPageData` depend on them.
- Sidebar entries live in `docs/.vitepress/config.ts:96` (`themeConfig.sidebar`). Add a new file and register it there — otherwise the page is reachable by URL but hidden in navigation.
- Global types / prop / module changes must update both `src/` and `docs/api/` — the docs mirror the runtime types (`src/module.ts`, `src/runtime/types.ts`).
- Branding asset: `docs/public/logo.png` serves as `/logo.png` in VitePress. Keep it identical to `logo.png` at repo root and both `playgrounds/*/public/logo.png`. A stale playground logo is a visible doc regression.
- Run `npm run lint` + `npm run format` — docs `.md` files are prettier-formatted too.

## Deploy

Published via **GitHub Pages** only — workflow `.github/workflows/docs.yml`:

1. Trigger: push to `main` touching `docs/**` **or** manual **Actions → Docs → Run workflow**.
2. `npm ci` → `vitepress build docs` with `base: /nuxt-toc/` → upload artifact.
3. `actions/deploy-pages` publishes to `https://thaikolja.github.io/nuxt-toc/`.

### One-time repo setup (admin)

- Settings → **Pages** → **Source: GitHub Actions**.
- Pages will be empty until the first workflow run — push an edit to `docs/**` to trigger it.

No custom domain, Cloudflare, or monorepo-token setup.

## Verification

```bash
npm run docs:build    # should have no warnings; dead-link errors are from ignoreDeadLinks in config
```

Check that new pages appear in the sidebar (each `sidebar['/…/']` entry), and that `editLink.pattern` at `docs/.vitepress/config.ts:197` still points to `.../edit/main/docs/:path`.

Related: [Development setup](/contributing/development) (full repo scripts), [Release process](/contributing/release) (publish checklist including docs tagging).
