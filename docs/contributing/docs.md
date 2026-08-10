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

GitHub Pages deploys from `.github/workflows/docs.yml` on pushes to `main` that touch `docs/**` or the workflow file.

Logo: `docs/public/logo.png` (copied from root `logo.png`).
