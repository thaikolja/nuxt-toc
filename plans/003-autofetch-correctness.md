# Plan 003: Gate auto-fetch plugin; distinguish errors; drop stale TOC; slim payload

> **Executor instructions**: Follow step by step. STOP if excerpts drifted. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat 51f9e20..HEAD -- src/module.ts src/runtime/plugins/fetch-v2.ts src/runtime/plugins/fetch-v3.ts src/runtime/components/TableOfContents.vue src/runtime/utils/normalize-toc.ts src/utils/detect-content-major.ts`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (can land after or in parallel with 002; if you touch `TableOfContents.vue` while 002 is in flight, rebase)
- **Category**: bug
- **Planned at**: commit `51f9e20`, 2026-08-20

## Why this matters

1. If `@nuxt/content` is installed (even hoisted) but **not** in `nuxt.config` `modules`, the module still `addPlugin`s `fetch-v2`/`fetch-v3`. Those files statically `import { queryContent|queryCollection } from '#imports'`. The host build fails. The warning text already says pass-in should work.
2. Plugin `catch` returns `null`, so query failures render “No content found” and the error empty-state almost never appears.
3. Template prefers `hasLinks` over `pending`, so a layout auto-fetch TOC keeps the **previous page’s** headings until the new query resolves.
4. Auto-fetch stores the entire Content document in `useAsyncData` though only `body.toc` is used.

## Current state

`src/module.ts` (HEAD formatting; worktree may only differ in whitespace):

```ts
if (contentMajor && !hasNuxtModule('@nuxt/content', nuxt)) {
  logger.warn(
    '[nuxt-toc] `@nuxt/content` is installed but not registered in `modules`. ' +
      'Add `@nuxt/content` to `nuxt.config` modules, or pass `:toc` and skip auto-fetch.',
  )
}

if (contentMajor === 2) {
  addPlugin(resolver.resolve('./runtime/plugins/fetch-v2'))
} else if (contentMajor === 3) {
  addPlugin(resolver.resolve('./runtime/plugins/fetch-v3'))
} else {
  logger.warn(
    '[nuxt-toc] @nuxt/content v2 or v3 not found. ' +
      'Auto-fetch is disabled; pass `:toc` from your page query instead.',
  )
}
```

`src/runtime/plugins/fetch-v2.ts:42-47` and `fetch-v3.ts:48-56`: `catch { log; return null }`.

`src/runtime/components/TableOfContents.vue` template order: `showTitleOnly` → `hasLinks` → `pending` → error → missing → empty.

`normalizeToc` already accepts a plain `{ links }` TOC or `{ body: { toc } }`.

Conventions: keep **exactly one** fetch plugin. Never import both Content APIs on one path. `detectContentMajor` stays a pure fs walk (`src/utils/detect-content-major.ts`). Match that style for a new tiny helper.

## Commands you will need

| Purpose        | Command                                                                                   | Expected |
| -------------- | ----------------------------------------------------------------------------------------- | -------- |
| New unit tests | `npx vitest run test/should-register-fetch-plugin.test.ts test/table-of-contents.test.ts` | pass     |
| Detect tests   | `npx vitest run test/detect-content-major.test.ts`                                        | pass     |
| Full suite     | `npm test`                                                                                | pass     |
| Types          | `npm run test:types`                                                                      | exit 0   |

## Scope

**In scope:**

- `src/utils/should-register-fetch-plugin.ts` — create
- `test/should-register-fetch-plugin.test.ts` — create
- `src/module.ts` — use the helper; do not change option normalization
- `src/runtime/plugins/fetch-v2.ts`
- `src/runtime/plugins/fetch-v3.ts`
- `src/runtime/components/TableOfContents.vue` — template order + slim fetch result + tests if 001 exists
- `test/table-of-contents.test.ts` — add cases if the file exists

**Out of scope:**

- Content query implementations
- New collection playground
- Changing pass-in API
- Re-exporting the new helper from the published module entry (do **not** add to `src/module.ts` exports)

## Git workflow

- Branch: `advisor/003-autofetch-correctness`
- Commits: `fix: register fetch plugin only when Content module is present` and `fix: auto-fetch errors, pending, and payload`
- Do NOT push unless asked.

## Steps

### Step 1: Gate plugin registration

Create `src/utils/should-register-fetch-plugin.ts`:

```ts
import type { ContentMajor } from './detect-content-major'

export function shouldRegisterFetchPlugin(
  contentMajor: ContentMajor | null,
  contentModuleRegistered: boolean,
): contentMajor is ContentMajor {
  return (contentMajor === 2 || contentMajor === 3) && contentModuleRegistered
}
```

In `src/module.ts` `setup`:

```ts
const contentRegistered = hasNuxtModule('@nuxt/content', nuxt)

if (contentMajor && !contentRegistered) {
  logger.warn(/* existing message — keep the same string */)
}

if (shouldRegisterFetchPlugin(contentMajor, contentRegistered)) {
  if (contentMajor === 2) addPlugin(resolver.resolve('./runtime/plugins/fetch-v2'))
  else addPlugin(resolver.resolve('./runtime/plugins/fetch-v3'))
} else if (!contentMajor) {
  logger.warn(/* existing “v2 or v3 not found” message */)
}
```

When major is 2/3 but module is unregistered: **warn once** (already done), **do not** addPlugin, **do not** emit the “not found” warn.

Tests in `test/should-register-fetch-plugin.test.ts` (model after `test/detect-content-major.test.ts` style: `describe` + `expect`):

- `(2, true)` → true
- `(3, true)` → true
- `(2, false)` → false
- `(3, false)` → false
- `(null, true)` → false
- `(null, false)` → false

**Verify**: `npx vitest run test/should-register-fetch-plugin.test.ts test/detect-content-major.test.ts` passes.

### Step 2: Plugin errors must throw (after dev log)

In both `fetch-v2.ts` and `fetch-v3.ts` `catch` blocks: keep the `import.meta.dev` `console.warn`, then **`throw err`** instead of `return null`.

Empty path still returns `null` (not an error). Successful not-found (`findOne()` / `.first()` resolving `null`) still returns `null`.

The component already does:

```ts
watch(
  asyncError,
  err => {
    if (err && shouldAutoFetch.value) autoFetchFailed.value = true
  },
  { immediate: true },
)
```

**Verify**: `npx vitest run test/table-of-contents.test.ts` — case 7/8/9 still make sense. Add case: `fetchMock` **rejects** → UI shows `Could not load` / `.nuxt-toc--error`, not `No content found`. If `useAsyncData` mock swallows throws, update the mock so a rejected handler sets `error` and `autoFetchFailed` can become true (or set `error` from the mock when the handler throws — the Step 001 mock already has a try/catch that sets `error`).

If plan 001 is not merged yet, add this reject case in a small new test file that uses the same mock, **or** STOP and say 001 is required for the UI assertion. Prefer waiting for 001.

### Step 3: Pending beats stale links

In `TableOfContents.vue` template, move the pending branch **above** `hasLinks` when auto-fetching:

```vue
<div v-if="showTitleOnly" ...>
<div v-else-if="shouldAutoFetch && pending" class="nuxt-toc nuxt-toc--pending">
  Loading table of contents…
</div>
<div v-else-if="hasLinks" class="nuxt-toc" @click="onTocClick">
...
```

`showTitleOnly` is already `!pending`, so title-only will not hide a loading state.

Add a test if 001 harness exists: mock `useAsyncData` so `pending` is `true` and `data` is a **previous** page toc; no `:toc` prop; assert the pending text is shown and `#toc-container` is **absent**.

**Verify**: that test passes; pass-in `:toc` still renders immediately (`shouldAutoFetch` is false, pending branch skipped).

### Step 4: Slim the cached auto-fetch value

In the `useAsyncData` handler in `TableOfContents.vue`, after `const page = await fetchPage(...)`:

```ts
if (page == null) return null
const toc = normalizeToc(page)
// Keep “document present but no headings” distinct from “no document”
return { body: { toc: toc ?? { links: [] } } }
```

Do **not** change plugin return types beyond the throw-on-error in Step 2 (plugins may still return a full document; the component slims). This avoids depending on Content `only()` / `select()` existing on both majors.

`resolvedToc` already runs `normalizeToc(fetchedPage.value)` — `{ body: { toc } }` still works.

**Verify**: empty-toc and missing-doc tests still distinguish “No headings found” vs “No content found”.

## Test plan

- `test/should-register-fetch-plugin.test.ts` — all boolean combinations
- `test/table-of-contents.test.ts` — reject → error UI; pending + stale data → loading; pass-in unchanged

## Done criteria

- [ ] `shouldRegisterFetchPlugin` exists and is unit-tested
- [ ] `addPlugin` runs only when helper is true
- [ ] Both plugins rethrow after logging
- [ ] Auto-fetch pending is rendered even if previous `hasLinks` would be true
- [ ] `useAsyncData` cache value is `{ body: { toc } }` or `null`, not a full document
- [ ] `npm test` exits 0
- [ ] `npm run test:types` exits 0
- [ ] `plans/README.md` 003 DONE

## STOP conditions

- `hasNuxtModule` API in this `@nuxt/kit` version does not match `hasNuxtModule('@nuxt/content', nuxt)` (already used in the file — if it disappeared, stop).
- Content plugins cannot rethrow without breaking playground `/auto-fetch` e2e (if e2e fails, inspect whether the playground query throws; do not swallow errors again — report).
- Slimming to `{ body: { toc } }` breaks `normalizeToc` on a live playground — stop and report rather than adding a third shape.

## Maintenance notes

- Reviewer: pass-in-only apps without Content in `modules` must **build**.
- Reviewer: “No content found” vs “Could not load” must both still be reachable.
- A second v3 collection playground is **not** this plan.

---
