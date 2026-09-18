---
title: queryCollection with TableOfContents
description: >-
  Recommended pass-in pattern for Content v3: fetch a page with queryCollection and hand page.body.toc to TableOfContents — with SSR, error, and typing notes.
---

# `queryCollection` (Content v3)

**Recommended mode:** fetch the page once in your page and hand its TOC to `<TableOfContents>`. This is the cheapest and most explicit option — it works even if Content is not detected at build.

## Full example (Nuxt 4 catch-all route)

```vue
<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()

// Cached by route.path, re-fetched on navigation
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <p v-else>
    Page not found at <code>{{ route.path }}</code>
  </p>

  <!-- Pass-in TOC — no extra query -->
  <TableOfContents :toc="page?.body?.toc" title="On this page" :depth="2" />
</template>
```

`queryCollection('content')` is auto-imported by `@nuxt/content` v3 when `modules: ['@nuxt/content']` is in `nuxt.config.ts`. No import line is needed — but if your IDE flags it, ensure `npx nuxi prepare` has generated types.

## What `page.body.toc` contains

```ts
// page.body.toc — shape from Content v3's toc extractor
{
  links: [
    {
      id: 'installation',
      text: 'Installation',
      depth: 2,
      children: [{ id: 'prereqs', text: 'Prereqs', depth: 3 }],
    },
    { id: 'usage', text: 'Usage', depth: 2 },
  ]
}
```

The same shape as [Types — Toc/TocLink](/api/types). `normalizeToc` (`src/runtime/utils/normalize-toc.ts`) wraps it, but prefer passing `page.body.toc` directly.

## Handling the not-found case

`first()` returns `null` when no document matches the path. Do not render the TOC with auto-fetch as a fallback unless you explicitly want a second query:

```vue
<!-- Avoid: page is null → this triggers auto-fetch and fetches again -->
<TableOfContents v-if="!page" />

<!-- Prefer: just show “not found” when page is missing -->
```

## useAsyncData key matters

The key (first argument) should reflect the document:

```ts
await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
```

Using `route.path` ensures navigation from `/` → `/guide` triggers a new fetch and a fresh TOC. Auto-fetch inside the component does the same at `TableOfContents.vue:284` with a key `nuxt-toc-${collection}-${path}`.

## Collections

`queryCollection('content')` chooses the collection key defined in `content.config.ts`. With multiple collections:

```ts
const blogPage = await queryCollection('blog').path('/blog/hello').first()
```

Then `<TableOfContents :toc="blogPage?.body?.toc" />` — no `collection` prop needed, because you already queried the right collection. See [Collections](/content-v3/collections).

## Depth nuance

Content determines **which heading levels generate `links`** (see `content.build.markdown.toc` → `depth`/`searchDepth`). The TOC’s `:depth` prop trims what is **rendered**. If `searchDepth` is `2` but you pass `:depth="3"`, the third level never existed — nothing extra shows. See [Writing Content — two depths](/guide/writing-content#two-depth-concepts).

## Typing

```ts
import type { Toc } from '#imports' // or src/runtime/types.ts
const toc = computed<Toc | null>(() => page.value?.body?.toc ?? null)
```

TOC links are `{ id, text, depth?, children? }`. See [Types](/api/types).

Next: [Auto-fetch (v3)](/content-v3/auto-fetch) covers the path/collection plugin behavior, or [Content v2 — queryContent](/content-v2/query-content) if you are on the other major.
