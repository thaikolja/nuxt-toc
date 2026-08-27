# Plan 005: Include `test:types` in `npm run check`

> **Executor instructions**: Follow step by step. `package.json` may have uncommitted key alignment — change **script strings only**, keep the user’s formatting if the file is dirty.
>
> **Drift check (run first)**: `git diff --stat 51f9e20..HEAD -- package.json .github/workflows/ci.yml`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `51f9e20`, 2026-08-20

## Why this matters

`npm run check` is what `prepublishOnly` and `release` run. It is `lint && format:check && test` and **omits** `test:types`. CI’s quality job runs `npm run test:types` separately. A maintainer can `npm run release` with type errors that CI would have caught only if they pushed first.

## Current state (HEAD)

```json
"test:types": "vue-tsc --noEmit",
"check": "npm run lint && npm run format:check && npm run test"
```

```json
"prepublishOnly": "npm run check && npm run prepack",
"release": "npm run check && npm run prepack && changelogen --release && npm publish && git push --follow-tags"
```

CI `.github/workflows/ci.yml` quality job already runs `npm run test:types` after `npx nuxt-module-build prepare`. Do **not** remove that job.

`tsconfig.json` extends `./.nuxt/tsconfig.json` and excludes `dist`, `node_modules`, `playgrounds`, `docs`. Types can fail if `.nuxt` is missing — same as today’s CI quality job (it runs `nuxt-module-build prepare` first).

## Commands you will need

| Purpose | Command | Expected |
| --- | --- | --- |
| Types | `npm run test:types` | exit 0 (run `npx nuxt-module-build prepare` first if `.nuxt` is missing) |
| Check | `npm run check` | lint + format + types + test all exit 0 |

## Scope

**In scope:**

- `package.json` — `check` script only
- `docs/contributing/testing.md` or `docs/contributing/release.md` — one sentence that `check` includes types, only if those pages list the old command

**Out of scope:**

- Playground typecheck
- Changing CI graph
- Husky / lint-staged
- Making `test:types` depend on playgrounds

## Git workflow

- Branch: `advisor/005-check-includes-types`
- Commit: `chore: run vue-tsc in npm run check`
- Do NOT push unless asked.

## Steps

### Step 1: Update the check script

Set:

```json
"check": "npm run lint && npm run format:check && npm run test:types && npm run test"
```

Keep `test:types` **before** `test` so type errors fail faster than e2e. Do not rewrite other scripts. If `package.json` is column-aligned in the worktree, preserve that alignment for the `check` line only.

**Verify**: `node -e "const p=require('./package.json'); if(!p.scripts.check.includes('test:types')) process.exit(1)"` exits 0.

### Step 2: Run check

If `.nuxt/tsconfig.json` is missing: `npx nuxt-module-build prepare`.

**Verify**: `npm run test:types` exits 0. Then `npm run check` exits 0.

If `test:types` fails on **pre-existing** errors you did not cause, STOP and report (do not disable `vue-tsc`).

### Step 3: Docs one-liner if needed

If `docs/contributing/testing.md` or `docs/contributing/release.md` says check is lint+format+test only, add types to that list.

## Test plan

No new tests. Gate is `npm run check` exit 0.

## Done criteria

- [ ] `package.json` `scripts.check` contains `npm run test:types`
- [ ] `prepublishOnly` / `release` still call `check` (unchanged)
- [ ] `npm run test:types` exits 0
- [ ] `plans/README.md` 005 DONE

## STOP conditions

- `vue-tsc` is red on unmodified source — report, do not `@ts-ignore` the repo.
- Someone already added types to `check` — mark this plan DONE / no-op.

## Maintenance notes

- Reviewer: first-time clones still need `nuxt-module-build prepare` (or `dev:prepare`) before `check`, same as CI quality.
- Playground typecheck remains optional and out of scope.

---
