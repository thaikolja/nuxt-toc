---
title: How nuxt-toc works under the hood
description: >-
  Lifecycle of the nuxt-toc Nuxt module: detection of Content v2/v3, runtime config, version-specific fetch plugins, TOC normalization, depth limiting, and scroll-spy.
---

# How it works (under the hood)

You do not need to understand this page to use the module, but if you are curious — or debugging “why auto-fetch picks the wrong query” — this is how the pieces fit.

## One picture

```
Your app
  nuxt.config.ts  →  lists modules: ['nuxt-toc', '@nuxt/content']
                              │
                              ▼
                 src/module.ts:setup()                          src/utils/detect-content-major.ts
                ┌────────────────────────────────┐               ┌──────────────────────────────┐
                │ detectContentMajor(rootDir)     │◀──────────────│ walk up to 8 dirs, read    │
                │ normalizeOptions(options)       │               │ package.json → 2 | 3 | null │
                │ runtimeConfig.public.nuxtToc ── │──▶ client     └──────────────────────────────┘
                │ hasNuxtModule('@nuxt/content')  │
                │ addPlugin(fetch-v2 or fetch-v3) │               Only ONE plugin is registered
                │ addComponent(TableOfContents)   │               Never both (different APIs)
                └────────────────────────────────┘
                              │
              ┌───────────────┼─────────────────┐
              ▼               ▼                 ▼
        fetch-v2.vue   /   fetch-v3.vue    TableOfContents.vue
     queryContent()    queryCollection()   props: toc/path/collection/…
     provide            provide              useAsyncData( $nuxtTocFetch )
     $nuxtTocFetch      $nuxtTocFetch      normalize-toc / limit-depth /
                                           TocTree (recursive) /
                                           IntersectionObserver scroll-spy
```

## Step by step

### 1. Detect the installed Content major

`src/module.ts:176`:

```ts
const contentMajor = detectContentMajor(nuxt.options.rootDir)
```

`src/utils/detect-content-major.ts:32` walks up to 8 levels from `rootDir`, looks for `node_modules/@nuxt/content/package.json`, reads `version` (`"3.15.2"` → `3`), and returns `2 | 3 | null`. Walking is intentional — package `exports` often block `require('@nuxt/content/package.json')` and some monorepo/playground layouts hoist dependencies.

### 2. Clamp options and publish runtime config

`normalizeOptions()` (`src/module.ts:109`) sanitizes every user value once at build:

- `collection`: non-empty string or `"content"`.
- `depth`: `Math.max(1, floor(depth))` or `2`.
- `scrollOffset`: non-negative integer or `0`.
- `rootMargin`: non-empty string or `"0px 0px -80% 0px"`.
- `scrollSpy`: `options.scrollSpy !== false`, `smooth`: `!!smooth`.

The result plus `contentMajor` is written to `nuxt.options.runtimeConfig.public.nuxtToc`. The component and your app can read it via `useRuntimeConfig().public.nuxtToc` (see [Runtime config](/api/runtime-config)).

A soft dev warning is emitted if Content is installed but not listed in `modules` — you forgot to register it, but pass-in `:toc` can still work.

### 3. Register exactly one fetch plugin

```ts
if (contentMajor === 2) addPlugin('…/fetch-v2')
else if (contentMajor === 3) addPlugin('…/fetch-v3')
else logger.warn('Auto-fetch disabled; pass :toc')
```

Why not register both and let the component pick? Because `fetch-v2` statically imports `queryContent` (`from '#imports'`) and `fetch-v3` imports `queryCollection` — importing the wrong helper on the wrong Content major would break the build. Registering one plugin keeps tree-shaking clean. This is the “prefer pass-in; never hard-import both helpers” architecture rule from `AGENTS.md`.

Both plugins expose `provide: { nuxtTocFetch }` so the component sees it as `nuxtApp.$nuxtTocFetch`. Their type is `NuxtTocFetch = (path, collection?) => Promise<{ body?: { toc?: Toc } }>`.

- **v2** (`src/runtime/plugins/fetch-v2.ts:29`): `queryContent(path).findOne()`. The second argument is ignored.
- **v3** (`src/runtime/plugins/fetch-v3.ts:29`): `queryCollection(collection).path(path).first()` with `collection || 'content'`.

Both guard against empty `path`, and on error they warn in dev and return `null`.

### 4. Register the component

```ts
addComponent({ name: 'TableOfContents', filePath: '…/TableOfContents.vue' })
```

The component is now available globally — no import needed. Its local helper `TocTree.vue` is not globally registered — it is imported inside `TableOfContents.vue` for recursion.

### 5. In your page: pass-in or auto-fetch

- **Pass-in** (`<TableOfContents :toc="page.body.toc" />`): `resolvedToc` (`TableOfContents.vue:339`) calls `normalizeToc(toc)` directly. `normalizeToc` (`src/runtime/utils/normalize-toc.ts:21`) accepts plain TOCs, `body.toc`, or document-root `toc` — so you can be a little sloppy, but `page.body.toc` is the intended shape.

- **Auto-fetch** (`<TableOfContents />`): `shouldAutoFetch` (`TableOfContents.vue:275`) is `props.toc == null`. The internal `useAsyncData` calls `nuxtApp.$nuxtTocFetch(path, collection)`; if the helper is missing (Content not installed) it logs and sets `autoFetchFailed`. Watchers on `resolvedPath / resolvedCollection / shouldAutoFetch` re-fetch when navigation happens.

After a fetch, `limitTocDepth` (`src/runtime/utils/limit-toc-depth.ts:24`) trims `resolvedToc` to `effectiveDepth` (`resolveEffectiveDepth(depth, isSublistShown)`). When no trimming is needed, the original reference is returned — a cheap short-circuit.

### 6. Render: `TocTree.vue` recursively

`TableOfContents.vue:16` delegates the actual list to `TocTree`:

```html
<TocTree :links="displayToc!.links" :max-depth="effectiveDepth" :is-active="isActive" … root />
```

`TocTree.vue:46` renders one `<ul>` per level and recurses while `level < maxDepth` (`level` defaults to `1`). ARIA `aria-level` is `Math.min(6, 2 + level)`.

### 7. Scroll-spy: `IntersectionObserver` on the client

After mount (`TableOfContents.vue:730` → `onMounted` → `nextTick` → `observeSections(true)`):

- Observe only heading IDs present in the (already depth-limited) TOC — `collectTocIds` → `document.getElementById(id) → observer.observe(node)`.
- Batch intersections via `pendingEntries + requestAnimationFrame(flush)`, updating `activeTocIds` as a Set and `lastVisibleHeading` as fallback.
- `rootMargin` default `"0px 0px -80% 0px"` means the “active zone” is the top 20% of the viewport — headings near the top win.
- `scheduleLateHeadingRetries` force-re-observes at 50ms/200ms/500ms in case Content hydration finishes late.
- `watch([observedIdsKey, rootMargin, scrollSpy, hasLinks])` rebuilds the observer when data changes; `onUnmounted` disconnects everything.

### 8. Empty / loading render states

The template (`TableOfContents.vue:6`):

- `showTitleOnly` → title alone (`isTitleShownWithNoContent` + no links)
- `hasLinks` → the list via `TocTree`
- `shouldAutoFetch && pending` → “Loading…”
- `autoFetchFailed` → “Could not load …”
- `documentMissing` → “No content found …”
- `emptyLinks` → “No headings found …”

Pass-in mode never shows “Loading…” — it is either links or title-only.

## Why this architecture?

Two design constraints from `AGENTS.md`:

1. **Prefer pass-in** — avoids a second Content query when the page already fetched the document.
2. **Never statically import both query helpers** in a single execution path — enables dual v2/v3 support without a dual install.

Detect-once, add-one-plugin satisfies both: pass-in sites can even omit Content entirely (they pass `{ links: [...] }` manually) and still use the TOC, while auto-fetch sites get the right helper without a broken import.

Next: [FAQ](/guide/faq) and [Troubleshooting](/guide/troubleshooting) for quick “why is my TOC empty?” fixes, or [Runtime config](/api/runtime-config) to see the seven values this module publishes.
