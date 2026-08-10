---
title: Development setup for contributors
description: >-
  Clone nuxt-toc, install with npm, prepare playgrounds, run tests, and build the module package for local development.
---

# Development setup

```bash
npm install
npm run dev:prepare
npm run dev:v3   # or dev:v2
npm run test
npm run prepack
```

Use **npm** (`packageManager` field in root `package.json`). Commit `package-lock.json`. Do not introduce Bun or pnpm lockfiles.

Brand asset: repository root `logo.png` (also under playground `public/` and `docs/public/`).
