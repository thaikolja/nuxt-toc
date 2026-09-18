---
title: Testing nuxt-toc (unit and e2e)
description: >-
  Which suites exist, how to run unit vs e2e for both Content majors, and what must pass before a pull request — including the dev:prepare prerequisite.
---

# Testing

CI runs `lint + format:check + test` (`npm run check`) and `prepack` dry-run — PRs should pass the same.

## Run

```bash
# One-time
npm run dev:prepare   # so playground .nuxt + node_modules exist

# All suites (unit + e2e)
npm run test

# Watch / coverage
npm run test:watch
npm run test:coverage

# Types (independent of Vitest)
npm run test:types    # vue-tsc --noEmit
```

Config: `vitest.config.ts` (environment `happy-dom`), `test/*` as `run` entries. Tests do **not** need a live playground on ports 3000/3001 — e2e suites launch an isolated Nuxt fixture when available.

## Suites

| File                                        | Coverage                                                                                                          |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `test/detect-content-major.test.ts`         | `src/utils/detect-content-major.ts:32` — walking detection for `2                                                 | 3   | null`, hoisted installs, bad/missing `package.json` |
| `test/normalize-toc.test.ts`                | `src/runtime/utils/normalize-toc.ts:21` — `Toc` vs `body.toc` vs `toc` vs garbage, `TocLink` shape guard          |
| `test/limit-toc-depth.test.ts` (if present) | `limitTocDepth` / `resolveEffectiveDepth` / `isSublistShown` legacy                                               |
| `test/content-v3.test.ts`                   | E2e against **content-v3 playground** — pass-in, auto-fetch, props, settings, `contentMajor === 3` runtime config |
| `test/content-v2.test.ts`                   | E2e against **content-v2 playground** — `queryContent`, pass-in, auto-fetch (`path` only), `contentMajor === 2`   |

New functionality should add:

- **Unit tests** to `test/` for pure helpers (`normalize-toc`, `limit-toc-depth`, `scroll-to-heading`, `detect-content-major`) before touching runtime.
- **E2e assertions** that exercise a prop or module option in **both** playgrounds (or add a `/props` variation) — browsing the repo’s `/settings` page during review is not enough.

## When tests need playgrounds

- `detect-content-major` unit tests use temporary directories — no playground.
- `content-v2.test.ts` / `content-v3.test.ts` require `playgrounds/*/node_modules` and `.nuxt/` — hence `npm run dev:prepare` before first run. If a playground install is stale, re-run `dev:prepare` (it reinstalls per playground prefix).

## Failures to watch for

- Changing `src/module.ts` defaults without updating `normalizeOptions` + `NuxtTocPublicRuntimeConfig` will often surface only in `contentMajor` or `scrollSpy`/`smooth` e2e expectations.
- Adding a prop without adding it to `docs/api/props.md` + `defineProps` is caught by `vue-tsc` and by the e2e for unknown-props behavior (`vue` warnings in `happy-dom` stdio).

## Release gate

See `.github/workflows/ci.yml` for the exact order: checkout → setup node 20 → `npm ci` → `npm run dev:prepare` → `npm run lint` / `format:check` / `test` matrix → `npm run prepack -- --dry-run`. Match it locally with `npm run check && npm run prepack`.

Also see: [Development setup](/contributing/development) and [Playgrounds](/contributing/playgrounds).
