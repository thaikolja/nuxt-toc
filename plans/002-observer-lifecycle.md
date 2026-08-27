# Plan 002: Fix observer lifecycle, retries, and hash apply

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the STOP conditions section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 51f9e20..HEAD -- src/runtime/components/TableOfContents.vue src/runtime/utils/scroll-to-heading.ts test/table-of-contents.test.ts test/scroll-to-heading.test.ts`
> If `test/table-of-contents.test.ts` does not exist, **STOP** — plan 001 must land first.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-toc-characterization-tests.md
- **Category**: bug
- **Planned at**: commit `51f9e20`, 2026-08-20

## Why this matters

On hash URLs with `smooth` or `scrollOffset`, the page is yanked back to the heading multiple times in the first 500ms. Late-heading retries always call `observeSections(true)`, which disconnects the observer, **clears** active ids, and calls `applyInitialHash()` again (that function scrolls). Rebuilds call `observer.disconnect()` only and leave a pending `requestAnimationFrame` flush from the old closure. A `watch` that `await nextTick()` can run after unmount and create an observer that is never disconnected.

## Current state

`src/runtime/components/TableOfContents.vue`:

```
// applyInitialHash (approx 517–537)
if (smoothEnabled.value || resolvedScrollOffset.value > 0) {
  scrollToHeading(hash, { smooth: ..., offset: ... })
}

// observeSections end (approx 667)
applyInitialHash()

// scheduleLateHeadingRetries (673–689)
for (const ms of [50, 200, 500]) {
  window.setTimeout(() => { observeSections(true) }, ms)
}

// rebuild (562–566) only:
if (observer) { observer.disconnect(); observer = null }

// watch (749–756)
await nextTick()
scheduleObserveSections()

// onMounted (730–739)
observeSections(true)
applyInitialHash()
scheduleLateHeadingRetries()
```

`onUnmounted` already calls `disconnectObserver()` (cancels rAF + retries + observer) but there is **no `disposed` flag**, so a late `nextTick` / rAF still calls `observeSections`.

Also fix while you are in the same functions (small, same file):

- `decodeURIComponent` at hash apply (~521) and click (~711) has no try/catch — a lone `%` throws `URIError`.
- Click with `smooth`/`scrollOffset` always `preventDefault()` then `scrollToHeading`, which no-ops if the heading is missing (`scroll-to-heading.ts:42-47`).
- `new IntersectionObserver(...)` is unguarded; invalid `rootMargin` throws.

## Commands you will need

| Purpose | Command | Expected |
| --- | --- | --- |
| Component tests | `npx vitest run test/table-of-contents.test.ts` | all pass |
| Scroll helper | `npx vitest run test/scroll-to-heading.test.ts` | all pass |
| Full suite | `npm test` | all pass |
| Lint / format | `npm run lint` && `npm run format:check` | exit 0 |

## Scope

**In scope:**

- `src/runtime/components/TableOfContents.vue`
- `src/runtime/utils/scroll-to-heading.ts` — only if you encode the hash fragment there
- `test/table-of-contents.test.ts` — add/adjust cases listed below
- `test/scroll-to-heading.test.ts` — add encode/missing-id cases if you change the helper

**Out of scope:**

- Changing default ids `#toc-title` / `#toc-container`
- Fetch plugins / `module.ts`
- Extracting a `useTocScrollSpy` composable (do the fix in place)
- A11y role changes

## Git workflow

- Branch: `advisor/002-observer-lifecycle`
- Commit: `fix: stop hash re-scroll on spy retries and dispose observer on unmount`
- Do NOT push unless asked.

## Steps

### Step 1: Add a disposed flag and always fully cancel rAF on rebuild

In `TableOfContents.vue` script:

1. Add `let disposed = false` next to the other module-level lets (`observer`, `rafId`, …).
2. At the start of `observeSections` and inside the `requestAnimationFrame` callback in `scheduleObserveSections`, if `disposed` return immediately.
3. In the `watch` that `await nextTick()`, after the await, if `disposed` return.
4. In `onUnmounted`, set `disposed = true` **then** call `disconnectObserver()`.
5. When rebuilding an existing observer inside `observeSections`, call `disconnectObserver()` instead of only `observer.disconnect()`.

**Retry interaction:** `disconnectObserver()` currently clears `retryTimeouts`. If a retry callback calls `observeSections(true)`, that would cancel later retries. Change retries (Step 2) so they **do not** call `observeSections(true)` for a full rebuild. Then it is safe to use `disconnectObserver()` on real rebuilds (key change / unmount).

**Verify**: existing `test/table-of-contents.test.ts` unmount case still passes.

### Step 2: Retries only attach missing headings; hash apply once

Replace `scheduleLateHeadingRetries` so that each timeout:

- If `disposed` or spy disabled, return.
- Count how many `allowedIds` (from `collectTocIds(displayToc.value)`) are missing `document.getElementById(id)`.
- If **zero** missing, return (do **not** rebuild).
- If missing > 0 and `observer` exists, `observer.observe(el)` for newly found ids only.
- If missing > 0 and `observer` is null, call `observeSections(false)` (not `true`).
- **Never** call `applyInitialHash()` from retries.

Remove `applyInitialHash()` from the **end of `observeSections`**. Keep it in `onMounted` (once, after the first `observeSections`).

Optional: listen to `hashchange` to highlight a new hash without scrolling unless `smooth`/`scrollOffset` is on. Not required. Do not re-scroll on observer rebuilds.

**Verify**: `npx vitest run test/table-of-contents.test.ts` still passes.

### Step 3: Harden hash decode, missing heading clicks, invalid rootMargin

1. Wrap both `decodeURIComponent(...)` calls in try/catch; on failure use the raw string (minus `#`).
2. In `onTocClick`, resolve `document.getElementById(id)` **before** `preventDefault`. If missing, return (let the browser set the hash).
3. Wrap `new IntersectionObserver(...)` in try/catch. On failure, retry once with `'0px 0px -80% 0px'` and `console.warn` when `import.meta.dev`. If the fallback also throws, disconnect and return.

In `scroll-to-heading.ts`, when calling `history.replaceState`, set the URL with a safe fragment. Prefer:

```ts
const url = new URL(window.location.href)
url.hash = id
history.replaceState(null, '', url)
```

`URL.hash` setter handles encoding. If `new URL` is awkward in tests, `encodeURIComponent(id)` on the fragment is acceptable. Keep the `location.hash = id` fallback.

**Verify**: `npx vitest run test/scroll-to-heading.test.ts` still passes (update the `replaceState` assertion if the third argument is now a full URL, not `#section-a`).

### Step 4: Regression tests

Add to `test/table-of-contents.test.ts` (same harness as 001):

1. **Retries do not rebuild when all headings exist** — mount with headings present; `vi.useFakeTimers()`; advance 500ms; `fakeObservers.length` stays `1` (only the initial observer).
2. **Hash + offset does not scroll again on timers** — stub `window.scrollTo`; set `location.hash = '#a'`; mount with `scrollOffset={16}`; record call count after mount flush; advance 500ms; call count must **not** increase.
3. **No observer after unmount of a pending nextTick** — mount; immediately `unmount()`; flush promises; `IntersectionObserver` instance count created *after* unmount is 0 (compare `fakeObservers` length before/after flush).
4. **Malformed hash does not throw** — `location.hash = '#%E0%A4%A'`; mount pass-in TOC; `wrapper` exists (no throw).
5. **Missing heading + smooth does not preventDefault** — no `#missing` in the document; create a toc link to `missing` (or click after removing the heading); with `smooth` true, the click handler must not leave the app with a prevented native navigation and no scroll. Easiest: spy `Event.prototype.preventDefault` and assert it was **not** called when the heading node is absent.

**Verify**: `npx vitest run test/table-of-contents.test.ts test/scroll-to-heading.test.ts` → all pass.

## Test plan

See Step 4. Keep the 13 characterization cases green; add the five regressions.

## Done criteria

- [ ] `observeSections` is not called with `true` from the 50/200/500 retry loop
- [ ] `applyInitialHash` is not invoked from `observeSections` or retries
- [ ] `disposed` prevents observe/schedule/watch work after unmount
- [ ] New tests in Step 4 exist and pass
- [ ] `npm test` exits 0
- [ ] `npm run lint` and `npm run format:check` exit 0
- [ ] Default public ids and CSS classes unchanged
- [ ] `plans/README.md` 002 status DONE

## STOP conditions

- Plan 001 tests are missing or red before you edit `TableOfContents.vue`.
- Live `TableOfContents.vue` no longer matches the lifecycle excerpts (already refactored).
- Fix appears to need a new composable file — stay in the SFC unless the file becomes impossible to edit; if you extract, you must move tests with it and stay within scope files listed above (adding `src/runtime/composables/use-toc-scroll-spy.ts` is **out of scope** — stop).

## Maintenance notes

- Reviewer: confirm hash landing still highlights on first paint (`onMounted` → `applyInitialHash`).
- Reviewer: confirm late Content headings still get `observe()` when they appear within 500ms.
- Default `rootMargin` and one-TOC ids stay part of the public contract.

---
