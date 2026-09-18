---
title: Auto-fetch table of contents (Content v3)
description: >-
  How the fetch-v3 plugin loads documents with queryCollection when :toc is omitted — path defaulting, collection resolution, loading/error/empty states, and when not to use it.
---

# Auto-fetch (v3)

When `toc` is **omitted** (i.e. `props.toc == null` in `TableOfContents.vue:275`), the module’s **fetch-v3** plugin (`src/runtime/plugins/fetch-v3.ts`) handles loading. You never call `queryCollection` yourself — just tell the component which document you want.

## Minimal usage

```vue
<template>
  <!-- Current page (route.path) -->
  <TableOfContents />

  <!-- Fixed document in default collection -->
  <TableOfContents path="/guide/intro" title="On this page" />

  <!-- Named collection -->
  <TableOfContents path="/blog/hello" collection="blog" />
</template>
```

## What runs behind the scenes

```ts
// src/runtime/plugins/fetch-v3.ts:42
await queryCollection(collectionName).path(path).first()
// collectionName = props.collection || runtimeConfig.public.nuxtToc.collection || 'content'
```

Registered only when the detected major is `3` (`src/module.ts:207`). Uses `defineNuxtPlugin().provide` to expose `$nuxtTocFetch` on the Nuxt app. The component calls it inside `useAsyncData` with `watch: [resolvedPath, resolvedCollection, shouldAutoFetch]`, so navigating or changing `path` re-fetches.

## Path and collection resolution

```ts
// TableOfContents.vue:216 and 230
resolvedPath = (props.path || route.path || '/').replace(/\/$/, '') || '/'
resolvedCollection = props.collection || nuxtToc.collection || 'content'
```

- Trailing slash is stripped (`/docs/` → `/docs`).
- Empty `path` → falls back to `route.path` → `'/'`. Guards in the plugin (`fetch-v3.ts:31`) warn `"auto-fetch skipped: empty path"` in dev and return `null`.
- Empty `collection` → module option `nuxtToc.collection` → `'content'`. The plugin further guards `collection || 'content'` so an empty string never reaches Content.

**Rule:** `path` must equal Content’s generated `.path` for the file (`content/guide.md` → `/guide`, not `/content/guide`). Generating `content.config.ts` with `source: '**/*.md'` vs `source: 'docs/**'` changes which paths exist — see [Collections](/content-v3/collections).

## Render states while loading / on error

Only in auto-fetch mode — pass-in mode (`:toc` provided) never shows “Loading…”.

| UI text                                       | Class                | Cause                                                                                      |
| --------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| `Loading table of contents…`                  | `.nuxt-toc--pending` | `useAsyncData` pending                                                                     |
| `Could not load table of contents for /path.` | `.nuxt-toc--error`   | Plugin missing (`$nuxtTocFetch` undefined) or query threw — dev console warns with details |
| `No content found for /path.`                 | `.nuxt-toc--empty`   | Query returned `null`                                                                      |
| `No headings found for /path.`                | `.nuxt-toc--empty`   | Document found but `body.toc.links` is `[]`                                                |

## When not to use auto-fetch

- **Page already fetches the document** with `queryCollection` for `<ContentRenderer>` — pass-in avoids a second query for the same path/collection.
- **No Content installed** — `contentMajor == null` means no fetch plugin was registered; the warning `[nuxt-toc] Auto-fetch unavailable ($nuxtTocFetch missing)…` appears. Pass-in ` { links: [...] }` still works.
- **Two collections on one page** — auto-fetch always fetches one document per TOC instance. With pass-in you can compose any number of collections with two queries and two component instances.

::: tip Compare both modes
See [Pass-in vs auto-fetch](/guide/pass-in-vs-auto-fetch) — the two modes are precisely defined by `shouldAutoFetch` and `normalizeToc`, and the page lists trade-offs and the common mistake “`path` seems ignored.”
:::

Next: [Collections](/content-v3/collections) if `collection` is unclear, or [queryCollection](/content-v3/query-collection) for the pass-in equivalent.
