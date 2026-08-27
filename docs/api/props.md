---
title: TableOfContents component props API
description: >-
  Full prop reference for TableOfContents: toc, path, collection, depth, scrollSpy, rootMargin, smooth, scrollOffset, title, and empty-state options.
---

# Props

`TableOfContents` is the only component the module registers (`addComponent` in `src/module.ts:218`). It is global — no import needed in pages.

Component source: `src/runtime/components/TableOfContents.vue:82`.

## Summary

| Prop | Type | Default | Controls |
|---|---|---|---|
| [`toc`](#toc) | `Toc \| null` | `null` | Prefetched TOC — when set, no auto-fetch |
| [`path`](#path) | `string` | `''` (→ `route.path`) | Document path for auto-fetch |
| [`collection`](#collection) | `string` | `''` (→ `nuxtToc.collection` → `'content'`) | v3 collection — ignored on v2 |
| [`depth`](#depth) | `number \| undefined` | `undefined` (→ `nuxtToc.depth` → `2`) | Max rendered link-tree depth |
| [`isSublistShown`](#issublistshown) | `boolean` | `true` | Legacy flag; `false` forces `depth = 1` |
| [`isTitleShownWithNoContent`](#istitleshownwithnocontent) | `boolean` | `false` | Keep title when links empty |
| [`title`](#title) | `string` | `'Table of Contents'` | Heading above the list |
| [`scrollSpy`](#scrollspy) | `boolean \| undefined` | `undefined` (→ `nuxtToc.scrollSpy` → `true`) | Highlight active section |
| [`rootMargin`](#rootmargin) | `string \| undefined` | `undefined` (→ `nuxtToc.rootMargin` → `'0px 0px -80% 0px'`) | Observer active zone |
| [`smooth`](#smooth) | `boolean \| undefined` | `undefined` (→ `nuxtToc.smooth` → `false`) | Smooth scroll on click |
| [`scrollOffset`](#scrolloffset) | `number \| undefined` | `undefined` (→ `nuxtToc.scrollOffset` → `0`) | Sticky header offset (px) |

### `toc`

```ts
toc?: Toc | null  // default null
```

- Preferred source: `page.body.toc` from your `useAsyncData` query. `normalizeToc` (`src/runtime/utils/normalize-toc.ts:21`) also accepts a full document (`{ body: { toc } }`) or `{ toc: { links } }`, but pass `body.toc` explicitly so intent is clear.
- When `toc != null`, auto-fetch is skipped and `path`/`collection` are ignored. When `null`, the component calls `$nuxtTocFetch(path, collection)` via `useAsyncData` keyed as `nuxt-toc-${collection}-${path}`.
- Empty TOC `{ links: [] }` renders nothing by default; add `isTitleShownWithNoContent` to keep the title visible (title-only mode `v-if="showTitleOnly"`).

### `path`

```ts
path?: string  // default ''
```

- Document path for auto-fetch. Falls back to `route.path` (trailing slash stripped) → `'/'`. Empty path is guarded in both fetch plugins and logs a dev warning.
- Ignored when `toc` is set.

::: tip Example
```vue
<TableOfContents path="/docs/intro" title="On this page" />
```
:::

### `collection`

```ts
collection?: string  // default '' — falls back to nuxtToc.collection → 'content'
```

- Content **v3 only** — `fetch-v3` does `queryCollection(collection).path(path).first()`. `fetch-v2` ignores this argument.
- Set globally via `nuxt.config.ts → nuxtToc.collection` so you do not repeat it per-component.

### `depth`

```ts
depth?: number | undefined  // default undefined — resolves via resolveEffectiveDepth() → 2
```

- Max rendered depth after extraction. `1` = top-level only (e.g. `h2`), `2` = top + one nesting (default), `3+` = deeper when Content provides it.
- Combined with legacy `isSublistShown` via `limitTocDepth` / `resolveEffectiveDepth` (`src/runtime/utils/limit-toc-depth.ts:24/113`):

```ts
resolveEffectiveDepth(depth ?? nuxtToc.depth, isSublistShown, 2)
```

If `isSublistShown === false`, effective depth is always `1` regardless of `depth`.

```vue
<TableOfContents :toc="page.body?.toc" :depth="1" />  <!-- flat -->
<TableOfContents :toc="page.body?.toc" :depth="2" />  <!-- default: h2 + h3 -->
<TableOfContents :toc="page.body?.toc" :depth="3" />  <!-- include h4 -->
```

### `isSublistShown`

```ts
isSublistShown?: boolean  // default true (legacy API)
```

- When `false`, forces effective depth to `1`. Keep only if upgrading from `v2.x`; new code should use `:depth="1"`.

### `isTitleShownWithNoContent`

```ts
isTitleShownWithNoContent?: boolean  // default false
```

- When there are no links, still render the title span (`showTitleOnly` computed, `TableOfContents.vue:384`) instead of rendering nothing or the empty/error state. Auto-fetch also has distinct empty states — see [Pass-in vs auto-fetch](/guide/pass-in-vs-auto-fetch).

```vue
<TableOfContents :toc="{ links: [] }" title="Outline" :is-title-shown-with-no-content="true" />
```

### `title`

```ts
title?: string  // default 'Table of Contents'
```

- Rendered as `<span id="toc-title" role="heading" aria-level="2">…</span>` and used as `aria-labelledby` for the root list. Keep it short — “On this page” is a common choice.

### `scrollSpy`

```ts
scrollSpy?: boolean | undefined  // default undefined — resolves to nuxtToc.scrollSpy (true)
```

- `false` disconnects the `IntersectionObserver` and clears `activeTocIds`. Convenience for static TOCs.

### `rootMargin`

```ts
rootMargin?: string | undefined  // default undefined — resolves to nuxtToc.rootMargin ('0px 0px -80% 0px')
```

- Observer `rootMargin` (CSS margin syntax). Shrinking the bottom (`-80%`) creates an “active zone” at the top of the viewport — a heading is active when it is near the top, not anywhere on screen. Changing it triggers an observer rebuild.

### `smooth`

```ts
smooth?: boolean | undefined  // default undefined — resolves to nuxtToc.smooth (false)
```

- `true` animates scroll-to-heading. When neither `smooth` nor `scrollOffset` is configured, clicks use native anchor jumps without interception.

### `scrollOffset`

```ts
scrollOffset?: number | undefined  // default undefined — resolves to Math.max(0, floor(nuxtToc.scrollOffset)) (0)
```

- Pixels subtracted from `getBoundingClientRect().top + scrollY` when scrolling, so headings land below a sticky header. Applied both on click and on initial hash landing (`applyInitialHash`).

## Examples

### Depth control

```vue
<!-- Top-level headings only -->
<TableOfContents :toc="page.body?.toc" :depth="1" />

<!-- Default: top + one nested level -->
<TableOfContents :toc="page.body?.toc" :depth="2" />

<!-- Deeper trees when Content TOC includes h4+ -->
<TableOfContents :toc="page.body?.toc" :depth="3" />
```

### Custom title, no nested items

```vue
<TableOfContents :toc="page.body?.toc" title="On this page" :depth="1" />
<!-- or legacy: :is-sublist-shown="false" -->
```

### Auto-fetch a fixed path (v3)

```vue
<TableOfContents path="/docs/intro" collection="docs" title="Contents" />
```

### Empty TOC still shows title

```vue
<TableOfContents :toc="{ links: [] }" title="Outline" :is-title-shown-with-no-content="true" />
```

### Scroll behavior with sticky header

```vue
<TableOfContents :toc="page.body?.toc" :scroll-spy="true" root-margin="0px 0px -70% 0px" :scroll-offset="64" smooth />
```

See also: [Module options](/api/module-options) (global defaults) and [CSS classes & IDs](/api/css-classes) (active-state hooks).
