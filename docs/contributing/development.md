---
title: Development setup for contributors
description: >-
  Clone nuxt-toc, install with npm, prepare playgrounds and stubs, run dev servers on both Content majors, lint, format, type-check, and build dist/.
---

# Development setup

Contribute to `nuxt-toc` with **npm only** — `packageManager: npm@10.9.2` in `package.json` commits `package-lock.json`.

## Quick start

```bash
git clone https://github.com/thaikolja/nuxt-toc.git
cd nuxt-toc

npm install                     # root deps
npm run dev:prepare             # stubs module + generates types + installs/prepares both playgrounds
npm run dev:v3                  # http://localhost:3000 — Content v3 playground
# in another terminal:
npm run dev:v2                  # http://localhost:3001 — Content v2 playground

npm run test                    # unit + e2e (both majors)
npm run prepack                 # production dist/ build via nuxt-module-build
```

### What `dev:prepare` does

Sequentially (`package.json → scripts`):

1. `nuxt-module-build build --stub` — stubs the module so playgrounds can resolve `../../src/module`.
2. `nuxt-module-build prepare` — generates types.
3. `npm install --prefix playgrounds/content-v3` + `.../content-v2` — independent `node_modules` per Content major (they cannot share one tree).
4. `nuxi prepare` both playgrounds — generates `.nuxt/` types for Content v2 and v3 separately.

Re-run `dev:prepare` whenever `src/` or root dependencies change.

## Useful scripts

| Script | What it does |
|---|---|
| `npm run dev` | Alias for `dev:v3` |
| `npm run dev:v3` | `nuxi dev playgrounds/content-v3 --port 3000` |
| `npm run dev:v2` | `nuxi dev playgrounds/content-v2 --port 3001` |
| `npm run dev:build:v3/v2` | `nuxi build` per playground |
| `npm run playgrounds:install` | `npm install --prefix` both playgrounds |
| `npm run playgrounds:prepare` | `nuxi prepare` both playgrounds |
| `npm run docs:dev` | `vitepress dev docs` (this site) → `http://localhost:5173` |
| `npm run docs:build` | `vitepress build docs` |
| `npm run lint` / `lint:fix` | `eslint .` (project uses `eslint.config.ts` prettier-aware) |
| `npm run format` / `format:check` | `prettier --write/check .` |
| `npm run test` / `test:watch` | `vitest run/watch` (happy-dom, see `test/…`) |
| `npm run test:coverage` | `vitest run --coverage` |
| `npm run test:types` | `vue-tsc --noEmit` |
| `npm run check` | `lint && format:check && test` — the CI gate |
| `npm run prepack` | `nuxt-module-build prepare && build` → `dist/` |
| `npm run release` | `check && prepack && changelogen --release && npm publish && git push --follow-tags` |

## Repository conventions

- **Source of truth:** `src/` — `dist/` is build output; never hand-edit.
- **Package manager:** npm only. Do not commit `pnpm-lock.yaml` or `bun.lockb`.
- **Logo:** root `logo.png` is canonical. Copies at `playgrounds/*/public/logo.png` and `docs/public/logo.png` must stay in sync.
- **Module entry:** `src/module.ts` — registers `TableOfContents` (`addComponent`), detects Content major (`detectContentMajor`), and adds one fetch plugin. See [How it works](/guide/how-it-works).
- **Runtime:** `src/runtime/plugins/` (one plugin per Content major), `src/runtime/components/TableOfContents.vue`, `src/runtime/components/TocTree.vue`, and the three helpers `normalize-toc`, `limit-toc-depth`, `scroll-to-heading`.

## Checklist before a PR

1. `npm run dev:prepare` and verify both playgrounds render `/`, `/auto-fetch`, `/props`, `/settings`.
2. `npm run test` green (detect, normalize, plus e2e against both playgrounds).
3. `npm run lint` + `npm run format:check` green (or `lint:fix` + `format`).
4. `npm run prepack` produces clean `dist/` and `dist/types.d.mts` with `contentMajor` exported.

See also: [Playgrounds](/contributing/playgrounds), [Testing](/contributing/testing), [Docs site](/contributing/docs), [Release process](/contributing/release).
