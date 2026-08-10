---
title: Build and preview the docs site
description: >-
  Develop and build the VitePress documentation for nuxt-toc, and understand how GitHub Pages deploys from the docs workflow.
---

# Docs site

Developer docs use [VitePress](https://vitepress.dev/) in `docs/`.

```bash
npm run docs:dev
npm run docs:build
npm run docs:preview
```

## Deploy

Docs are published to **GitHub Pages** only:

**https://thaikolja.github.io/nuxt-toc/**

Workflow: `.github/workflows/docs.yml`

- Trigger: push to `main` that touches `docs/**` (or manual **Actions → docs → Run workflow**)
- Build uses `base: /nuxt-toc/`
- Local `docs:dev` uses `base: /`

### Setup once

1. Repo **Settings → Pages →** Source: **GitHub Actions**
2. Push docs changes to `main`

No Cloudflare or monorepo tokens are required.

Logo: `docs/public/logo.png` (copied from root `logo.png`).
