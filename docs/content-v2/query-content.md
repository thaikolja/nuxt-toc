---
title: queryContent with TableOfContents (Content v2)
description: >-
  Recommended pass-in pattern for Content v2: use queryContent to fetch a page and hand page.body.toc to TableOfContents — with SSR and typing notes.
---

# `queryContent` (Content v2)

**Recommended mode on Content v2:** fetch the page once and hand its TOC to `<TableOfContents>` — same idea as [queryCollection + v3](/content-v3/query-collection), only the query helper differs.

## Full example (Nuxt 4 catch-all)

```vue
<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne()
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <!-- Older apps may use <ContentDoc> instead of ContentRenderer -->
  <p v-else>Page not found at <code>{{ route.path }}</code></p>

  <!-- Pass-in TOC — no second query -->
  <TableOfContents :toc="page?.body?.toc" title="On this page" :depth="2" />
</template>
```

`queryContent` is auto-imported by `@nuxt/content` v2 when registered in `modules`. If the IDE complains, run `npx nuxi prepare`.

## What `page.body.toc` contains

Same shape as on v3:

```ts
{ links: [
  { id: 'installation', text: 'Installation', depth: 2,
    children: [{ id: 'prereqs', text: 'Prereqs', depth: 3 }] },
]}
```

So `<TableOfContents :toc="page?.body?.toc" />` works identically regardless of whether the data came from `queryContent` or `queryCollection` — the module normalizes via `normalizeToc` (`src/runtime/utils/normalize-toc.ts:21`), and render trimming via `limitTocDepth` is the same.

## Gotchas on v2

- **`collection` prop is ignored.** `fetch-v2` (`src/runtime/plugins/fetch-v2.ts:29`) discards the second argument. Only `path` matters for auto-fetch.
- **`source` filtering** is minimal on v2 — but if you create `content.config.ts` by mistake, v2 will not interpret it (it may just appear as a page at `/content.config`). Remove it for a pure v2 app.
- **TOC caps:** some v2 templates configure `content.markdown.toc` — if depth is too shallow, nested headings never appear. Check `nuxt.config.ts → content`.

## When not to use pass-in

See [Auto-fetch (v2)](/content-v2/auto-fetch) for the `path`-only mode: `<TableOfContents path="/guide/intro" />`.

## Typing

```ts
import type { Toc } from '#imports' // or src/runtime/types.ts
const toc = computed<Toc | null>(() => page.value?.body?.toc ?? null)
```

Next: [Auto-fetch (v2)](/content-v2/auto-fetch) or [Content v2 setup](/content-v2/setup) for the full v2 checklist.
