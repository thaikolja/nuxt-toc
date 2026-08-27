---
title: Pass-in TOC vs auto-fetch modes
description: >-
  Beginner guide to the two ways TableOfContents gets data: pass-in :toc from your page query (recommended) vs auto-fetch by path/collection, with trade-offs and examples.
---

# Pass-in vs auto-fetch

`<TableOfContents>` can get its data two ways. Understanding the difference saves you an extra Content query and avoids “empty TOC” confusion.

## The two modes in one sentence

- **Pass-in** → you fetch the page *once* in your page (`useAsyncData` + `queryCollection`/`queryContent`) and hand `page.body.toc` to the component: `<TableOfContents :toc="page.body?.toc" />`.
- **Auto-fetch** → you omit `:toc` and the component fetches the page *itself* by path (and collection on v3): `<TableOfContents path="/guide/intro" />`.

Technically, the component checks `props.toc == null` (`src/runtime/components/TableOfContents.vue:275`) — when `toc` is `null/undefined` it calls the injected `$nuxtTocFetch` helper; otherwise it runs `normalizeToc(toc)` and skips fetching.

## Pass-in (recommended)

### Why it is recommended

- **One query per page.** Your page already needs the document for `<ContentRenderer>` — reuse the same result.
- **Works identically on Content v2 and v3.** No `collection` to think about; you already chose the right query helper in your page.
- **No timing surprises.** The TOC renders as soon as your `useAsyncData` resolves. Auto-fetch waits for a second `useAsyncData` inside the component.

### Content v3

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first()
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

### Content v2

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne()
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

### What `normalizeToc` accepts

`src/runtime/utils/normalize-toc.ts:21` is tolerant of three shapes:

1. **Plain TOC:** `{ links: TocLink[] }` — exactly what `:toc` expects.
2. **Full document:** `{ body: { toc: { links: [...] } } }` — so even `<TableOfContents :toc="page" />` would work, but prefer `page.body.toc` to be explicit.
3. **Root `toc`:** `{ toc: { links: [...] } }` — rare fallback.

If the shape is not recognised, the component treats the TOC as empty (see title-only mode below).

### When props are ignored

When `:toc` is set, these props do **not** trigger a fetch:

- `path` — ignored (you already chose the document)
- `collection` — ignored (v3 only; you already queried the right collection)

They still affect other behaviors (`scrollOffset` etc. keep working).

## Auto-fetch

### When to use it

- A **layout or sidebar** that always shows the TOC for a fixed document: `<TableOfContents path="/docs/intro" />`.
- A quick prototype where you do not want to write `useAsyncData` in the page.
- A route that is not the document path (e.g. `/` renders `/docs/intro`) — auto-fetch can point anywhere.

### Minimal examples

```vue
<template>
  <!-- Uses current route path (e.g. /guide/installation) -->
  <TableOfContents />

  <!-- Fixed path -->
  <TableOfContents path="/guide/intro" title="On this page" />

  <!-- v3 only: collection matters for auto-fetch -->
  <TableOfContents path="/blog/hello" collection="blog" />
</template>
```

### How auto-fetch resolves `path` and `collection`

```ts
// src/runtime/components/TableOfContents.vue:216
const resolvedPath       = computed(() => (props.path || route.path || '/').replace(/\/$/, '') || '/')
const resolvedCollection = computed(() => props.collection || runtimeConfig.public.nuxtToc.collection || 'content')
```

- Empty `path` → falls back to `route.path` → `"/"`. Trailing slash is stripped (`/guide/` → `/guide`).
- Empty `collection` → module option `nuxtToc.collection` → `"content"`.
- The fetch is keyed as `nuxt-toc-${collection}-${path}` (`useAsyncData` key on line 284), so switching paths/collections triggers a new query.

### What auto-fetch actually calls

- **v3 plugin** (`src/runtime/plugins/fetch-v3.ts:42`): `queryCollection(collection).path(path).first()`
- **v2 plugin** (`src/runtime/plugins/fetch-v2.ts:41`): `queryContent(path).findOne()`

Both soft-fail on error: they log a warning in dev and return `null`, which makes the component show an empty/error state instead of crashing the page.

## Visual comparison

| Aspect | Pass-in | Auto-fetch |
|---|---|---|
| Queries | 0 extra (reuse page query) | 1 extra per TOC instance |
| Props needed | `:toc="page.body?.toc"` | none (or `path` / `collection`) |
| SSR | Same fetch as page — one trip | Second `useAsyncData` — still SSR, but more work |
| Works without Content? | Yes — give it `{ links: [...] }` manually | No — needs `queryContent` / `queryCollection` |
| Error states | “No headings” when `links: []` | + “Loading…”, “Could not load”, “No content found for /path” |
| Title when empty | `isTitleShownWithNoContent` still works | same |

## Empty and loading states (auto-fetch only)

When `:toc` is omitted, the template covers four states (`TableOfContents.vue:27`):

1. **Pending** — `...pending` with text “Loading table of contents…”
2. **Failed** — missing `$nuxtTocFetch` or plugin threw → “Could not load table of contents for `/path`.”
3. **Missing document** — query returned `null` (wrong path/collection) → “No content found for `/path`.”
4. **Empty links** — document exists but has no h2/h3 → “No headings found for `/path`.”

Pass-in mode never shows “Loading…” — it either renders links or, if `isTitleShownWithNoContent` is `true`, just the title (`TableOfContents.vue:7`). See [Empty title recipe](/recipes/empty-title).

## Which should I pick?

- **Building docs/pages where each page loads its own Markdown?** Use **pass-in**. It is faster and you already have `page` in scope.
- **Building a wrapper that shows a TOC without knowing about the page’s data?** Use **auto-fetch** with explicit `path`/`collection`.
- **Still unsure?** Start with pass-in — you can switch to auto-fetch later by removing `:toc` and adding `path`.

## Common beginner mistakes

**“I passed `:toc` and also set `path` — why is `path` ignored?”**  
Because `shouldAutoFetch` is `props.toc == null`. If `toc` is present, `path` is intentionally ignored. Remove `:toc` if you want auto-fetch.

**“I use Content v2 and set `collection` — nothing changes.”**  
`collection` is v3-only (`src/runtime/plugins/fetch-v2.ts:29` ignores the second argument). Use `path` only on v2.

**“Auto-fetch warns `empty path`.”**  
Both plugins guard against `''` — see `fetch-v2.ts:31` / `fetch-v3.ts:31`. This happens if `route.path` is `''` during a static prerender glitch. Passing an explicit `path` fixes it.

Next: [Active highlighting](/guide/active-highlighting) explains what happens *after* the TOC has data — how the scroll-spy decides which item is active.
