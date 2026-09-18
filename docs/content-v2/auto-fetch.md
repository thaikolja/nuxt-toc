---
title: Auto-fetch table of contents (Content v2)
description: >-
  How the fetch-v2 plugin uses queryContent(path).findOne() when :toc is omitted, path defaulting, render states, and when to prefer pass-in.
---

# Auto-fetch (v2)

When `toc` is **omitted**, the module’s **fetch-v2** plugin (`src/runtime/plugins/fetch-v2.ts`) takes over. You do not call `queryContent` yourself — the component does.

## Minimal usage

```vue
<template>
  <!-- Current page -->
  <TableOfContents />

  <!-- Fixed document -->
  <TableOfContents path="/guide/intro" title="On this page" />
</template>
```

## What runs behind the scenes

```ts
// src/runtime/plugins/fetch-v2.ts:41
await queryContent(path).findOne()
// path = props.path || route.path || '/'
```

Registered only when the detected major is `2` (`src/module.ts:204`). Exposed as `$nuxtTocFetch` via `defineNuxtPlugin().provide`. The component calls it with `useAsyncData` keyed `nuxt-toc-${collection}-${path}` — note `collection` is part of the key for cross-version consistency but the second argument is ignored on v2.

## Path resolution

```ts
// TableOfContents.vue:216
resolvedPath = (props.path || route.path || '/').replace(/\/$/, '') || '/'
```

- Trailing slash stripped.
- Empty `path` → warning in dev `"auto-fetch skipped: empty path"` → returns `null` (no fetch).
- Content’s generated path must match — `content/guide/intro.md` → `/guide/intro`, not `/content/guide/intro`. If in doubt, log `page._path` / `page.path` from a `queryContent` result and copy that string.

## Render states (auto-fetch only)

| UI text                                       | Class                | Cause                                           |
| --------------------------------------------- | -------------------- | ----------------------------------------------- |
| `Loading table of contents…`                  | `.nuxt-toc--pending` | `pending`                                       |
| `Could not load table of contents for /path.` | `.nuxt-toc--error`   | Plugin missing / query threw (dev warns)        |
| `No content found for /path.`                 | `.nuxt-toc--empty`   | Query returned `null` — wrong path?             |
| `No headings found for /path.`                | `.nuxt-toc--empty`   | Document exists but has no extractable headings |

Pass-in mode (`:toc` set) never shows the loading rows — see [Pass-in vs auto-fetch](/guide/pass-in-vs-auto-fetch).

## When not to use auto-fetch

- Your page already does `queryContent(route.path).findOne()` for `<ContentRenderer>` — use pass-in to avoid a duplicate query.
- Content is not installed (`contentMajor == null`) — auto-fetch plugin was never registered. Pass-in ` { links: […] }` still works.

## `collection` does not exist on v2

```vue
<!-- v2: this prop is intentionally ignored -->
<TableOfContents path="/docs" collection="docs" />
```

The underlying `NuxtTocFetch` signature is `(path, collection?) => Promise<…>`, but `fetch-v2` names the second param `_collection` — it never reaches Content. See [Content v2 setup](/content-v2/setup) for the full v2 checklist.

Next: [queryContent](/content-v2/query-content) for the pass-in pattern, or [Comparison](/guide/pass-in-vs-auto-fetch).
