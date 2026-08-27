# Plan 001: Add TableOfContents characterization tests

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 51f9e20..HEAD -- vitest.config.ts package.json test/src/runtime/components/TableOfContents.vue src/runtime/components/TocTree.vue`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `51f9e20`, 2026-08-20

## Why this matters

`TableOfContents.vue` is the public component and the highest-churn file. Scroll-spy, click-scroll, empty/error branches, and depth markup have **zero** tests. Existing e2e only `$fetch`es HTML and checks that strings like `id="toc-container"` appear. Plan 002 will change observer lifecycle; those changes will be unsafe without tests that lock today’s public behavior first.

## Current state

- `src/runtime/components/TableOfContents.vue` — public SFC. Pass-in `:toc` skips fetch. Template branches (lines 7–53):
  - `showTitleOnly` → title span only
  - `hasLinks` → title + `TocTree` + `@click="onTocClick"`
  - `shouldAutoFetch && pending` → `Loading table of contents…` / `.nuxt-toc--pending`
  - `autoFetchFailed` → `Could not load table of contents for` / `.nuxt-toc--error`
  - `documentMissing` → `No content found for`
  - `emptyLinks` (auto-fetch only) → `No headings found for`
- Pass-in empty TOC **without** `isTitleShownWithNoContent` renders **nothing** (no matching branch). Lock that.
- `src/runtime/components/TocTree.vue` — nested `<ul id="toc-container">` when `root`; children in `.toc-sublist`; active class `active-toc-item`.
- `vitest.config.ts` — **no Vue plugin**. Unit tests cannot import `.vue` today. `environment: 'node'`.
- `test/scroll-to-heading.test.ts` — exemplar: `/** @vitest-environment happy-dom */`, `vi.stubGlobal`, `beforeEach`/`afterEach`.
- `test/limit-toc-depth.test.ts` — exemplar for depth tree fixtures.
- `@vitejs/plugin-vue` is already present in `node_modules` (via Nuxt). `@vue/test-utils` is only a **transitive** dep of `@nuxt/test-utils` — add it as a **direct** `devDependency`.
- Component imports `useRoute`, `useRuntimeConfig`, `useAsyncData`, `useNuxtApp` from `nuxt/app` and uses `import.meta.client` / `import.meta.dev`. Without Vite `define`, `import.meta.client` is falsy and spy/click client paths never run.

Public CSS/id contract (do not change in this plan): `#toc-title`, `#toc-container`, `.toc-link`, `.active-toc-item`.

Sample TOC to reuse in tests (same shape as `test/limit-toc-depth.test.ts`):

```ts
const sampleToc = {
  links: [
    {
      id: 'a',
      text: 'A',
      children: [
        { id: 'a1', text: 'A1', children: [{ id: 'a1a', text: 'A1a' }] },
        { id: 'a2', text: 'A2' },
      ],
    },
    { id: 'b', text: 'B', children: [{ id: 'b1', text: 'B1' }] },
  ],
}
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Install | `npm install` | exit 0, lockfile updated if you add `@vue/test-utils` |
| Component tests | `npx vitest run test/table-of-contents.test.ts` | all new tests pass |
| Full suite | `npm test` | all pass (e2e needs playgrounds prepared) |
| Types | `npm run test:types` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Format | `npm run format:check` | exit 0 |

## Suggested executor toolkit

- Model tests after `test/scroll-to-heading.test.ts` (happy-dom + stubs) and `test/limit-toc-depth.test.ts` (TOC fixtures).
- Do not add Playwright. Do not boot a playground for these tests.

## Scope

**In scope:**

- `package.json` / `package-lock.json` — add `@vue/test-utils` as a devDependency (Vue 3, `^2.4.6` or whatever npm resolves that is 2.x)
- `vitest.config.ts` — Vue plugin + `define` for `import.meta.client` / `import.meta.dev`
- `test/table-of-contents.test.ts` — create
- `docs/contributing/testing.md` — add the new file to the list (and `limit-toc-depth` / `scroll-to-heading` if still missing)

**Out of scope:**

- Any behavior change in `TableOfContents.vue` / `TocTree.vue` / plugins / module
- Extracting `useTocScrollSpy`
- Instance ids, slots, a11y role changes
- Plan 002 observer fixes (write tests that pass on **current** code)

## Git workflow

- Branch: `advisor/001-toc-characterization-tests`
- Commits like: `test: mount TableOfContents for spy, click, empty, and depth`
- Do NOT push or open a PR unless asked.

## Steps

### Step 1: Add `@vue/test-utils` and enable Vue in Vitest

In `package.json` `devDependencies`, add `"@vue/test-utils": "^2.4.6"` (or current 2.x). Run `npm install`.

Change `vitest.config.ts` to:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  define: {
    'import.meta.client': 'true',
    'import.meta.dev': 'false',
  },
  test: {
    include: ['test/**/*.{test,spec}.ts'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 120_000,
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/runtime/server/**'],
      reporter: ['text', 'html'],
    },
  },
})
```

`import.meta.client` **must** be the boolean true (`'true'` in `define`) or `onMounted` spy setup is a no-op.

If `@vitejs/plugin-vue` cannot be imported (missing from the package graph), add it as a devDependency (`^5` or `^6` matching the installed copy) and stop only if install fails.

**Verify**: `npx vitest run test/limit-toc-depth.test.ts` still passes.

### Step 2: Mock `nuxt/app` and mount helpers

Create `test/table-of-contents.test.ts` starting with:

```ts
/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
```

`vi.mock('nuxt/app', ...)` **before** importing the component.

Required mock behavior:

- `useRoute` → `{ path: routePath }` where `routePath` is a `let` default `'/'`.
- `useRuntimeConfig` → `{ public: { nuxtToc: { collection: 'content', depth: 2, scrollSpy: true, rootMargin: '0px 0px -80% 0px', smooth: false, scrollOffset: 0, contentMajor: 3 } } }`.
- `useNuxtApp` → `{ $nuxtTocFetch: fetchMock }` where `fetchMock` is a `vi.fn()`.
- `useAsyncData` is **awaited** in setup. Return a thenable that also has `{ data, pending, error }`:

```ts
useAsyncData: vi.fn(async (_key: unknown, handler: () => Promise<unknown>) => {
  let resolved: unknown = null
  try {
    resolved = await handler()
  } catch (e) {
    const error = ref(e)
    const bundle = { data: ref(null), pending: ref(false), error }
    return Object.assign(Promise.resolve(bundle), bundle)
  }
  const bundle = { data: ref(resolved), pending: ref(false), error: ref(null) }
  return Object.assign(Promise.resolve(bundle), bundle)
}),
```

Default `fetchMock` implementation: `vi.fn(async () => null)`.

Import the component **after** the mock:

```ts
import TableOfContents from '../src/runtime/components/TableOfContents.vue'
```

If the import fails (Vite/Vue compile error), STOP and report the error — do not rewrite the SFC to work around it.

### Step 3: Fake `IntersectionObserver` and sync `requestAnimationFrame`

```ts
class FakeIO {
  cb: IntersectionObserverCallback
  targets = new Set<Element>()
  disconnect = vi.fn(() => {
    this.targets.clear()
  })
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb
    fakeObservers.push(this)
  }
  observe(el: Element) {
    this.targets.add(el)
  }
  unobserve(el: Element) {
    this.targets.delete(el)
  }
  emit(id: string, isIntersecting: boolean) {
    const target = document.getElementById(id)
    if (!target) throw new Error(`no element #${id}`)
    this.cb(
      [{ target, isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
}
```

`vi.stubGlobal('IntersectionObserver', FakeIO)`.

Make `requestAnimationFrame` run the callback **synchronously** (`cb(0); return 1`) so the spy flush runs without real frames. Restore in `afterEach` with `vi.unstubAllGlobals()`.

Put matching heading nodes in `document.body` when testing spy (`<h2 id="a">A</h2>` etc.) **in addition** to mounting the TOC.

Mount with `attachTo: document.body` so `onMounted` runs. Always `await flushPromises(); await nextTick()` after mount.

### Step 4: Write the characterization cases

Implement these `it(...)` blocks. They must pass against **unmodified** `TableOfContents.vue`:

1. **Pass-in renders** — `:toc="sampleToc"` → `#toc-title` text `Table of Contents`, `#toc-container` exists, link `href="#a"` and text `A`.
2. **Default depth 2 markup** — `.toc-sublist` exists; `href="#a1"` exists; `href="#a1a"` does **not** (depth 2 drops the third tree level).
3. **`depth={1}`** — no `.toc-sublist`; no `href="#a1"`.
4. **`isSublistShown={false}`** — same as depth 1 even if `depth={3}`.
5. **Empty pass-in + title flag** — `:toc="{ links: [] }"` and `isTitleShownWithNoContent` → title visible, no `#toc-container`.
6. **Empty pass-in without flag** — `:toc="{ links: [] }"` → wrapper has no `.nuxt-toc` (or `wrapper.text()` is empty). This is current behavior.
7. **Missing `$nuxtTocFetch`** — `useNuxtApp` returns `{}`; no `:toc` → text includes `Could not load table of contents` and class `nuxt-toc--error`.
8. **Fetch returns null** — `fetchMock` resolves `null`; no `:toc` → `No content found for`.
9. **Fetch returns empty toc** — `fetchMock` resolves `{ body: { toc: { links: [] } } }` → `No headings found for`.
10. **Spy adds `active-toc-item`** — pass-in `sampleToc`, headings `#a` and `#b` in the document, emit intersecting on `#a` → the `#toc-item-a` node (or its closest `.toc-item`) has `active-toc-item`.
11. **Click with smooth** — set `smooth` prop true, click `a.toc-link[href="#a"]` → `preventDefault` happened (spy the event) **and** `window.scrollTo` was called (stub it like `test/scroll-to-heading.test.ts`).
12. **Click without smooth/offset** — default props, click link → `window.scrollTo` **not** called (native behavior; handler returns early).
13. **Unmount disconnects** — after mount with spy enabled, `wrapper.unmount()` → last `FakeIO.disconnect` was called.

Do **not** advance fake timers unless you add a dedicated retry test. Retries at 50/200/500ms are current (buggy) behavior; plan 002 will change them. Leaving timers unflushed keeps this file stable.

**Verify**: `npx vitest run test/table-of-contents.test.ts` → all 13 pass.

### Step 5: Full suite + docs list

Update `docs/contributing/testing.md` to list:

- `test/table-of-contents.test.ts` — component render, spy, click, empty states
- `test/limit-toc-depth.test.ts`
- `test/scroll-to-heading.test.ts`

Keep the existing detect / normalize / e2e bullets.

**Verify**: `npm test` → all pass. `npm run lint` and `npm run format:check` → exit 0.

## Test plan

Covered in Step 4. Pattern: `test/scroll-to-heading.test.ts`.

## Done criteria

- [ ] `npx vitest run test/table-of-contents.test.ts` exits 0 with the 13 cases above
- [ ] `npm test` exits 0
- [ ] `npm run test:types` exits 0
- [ ] `@vue/test-utils` is a direct devDependency
- [ ] `vitest.config.ts` uses `@vitejs/plugin-vue` and defines `import.meta.client` true
- [ ] No production runtime files under `src/` modified
- [ ] `plans/README.md` status row for 001 is DONE

## STOP conditions

- `TableOfContents.vue` cannot be imported in Vitest after adding the Vue plugin (report the compile error).
- `await useAsyncData` cannot be mocked without changing the SFC.
- A listed case fails on **unmodified** source — do not “fix” the component to match the test. Adjust the test to the actual current DOM/text, then record the discrepancy.
- You need to touch `src/` to make tests compile (except you must not).

## Maintenance notes

- Plan 002 will change retry/hash/unmount behavior; update spy tests there, do not pre-empt the new contract here.
- Reviewer: mocks must not swallow a real `useAsyncData` key/watch bug — they only isolate the SFC.

---
