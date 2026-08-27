---
title: Sticky TOC sidebar layout recipe
description: >-
  Build a docs layout with a sticky TableOfContents sidebar beside ContentRenderer — grid, sticky top, pass-in :toc, and handling of fixed headers.
---

# Sticky sidebar

The most common `nuxt-toc` layout: article column beside a TOC sidebar that stays visible while you scroll. Both playgrounds use this (`playgrounds/content-v3/pages/index.vue:22`).

## Minimal (pass-in)

```vue
<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first()
)
// On v2 use: queryContent(route.path).findOne()
</script>

<template>
  <div class="page">
    <article class="content">
      <ContentRenderer v-if="page" :value="page" />
    </article>
    <aside class="toc">
      <TableOfContents :toc="page?.body?.toc" title="On this page" />
    </aside>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16rem;
  gap: 2rem;
  align-items: start;  /* so sticky works inside grid */
}
.content :deep(h2), .content :deep(h3) {
  scroll-margin-top: 1rem;
}
.toc {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: 1rem;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  background: #111827;
  color: #e2e8f0;
  font-size: 0.9rem;
}
@media (max-width: 900px) {
  .page { grid-template-columns: 1fr; }
  .toc  { position: static; order: -1; } /* TOC above article on mobile */
}
</style>
```

## With a fixed header

If your header is 64px tall, keep clicks from landing under it:

```vue
<TableOfContents :toc="page?.body?.toc" :scroll-offset="64" smooth />
```

```css
.page .toc { top: 4.5rem; } /* below header */
.content :deep(h2), .content :deep(h3) { scroll-margin-top: 4.5rem; }
```

See [Active highlighting — sticky header tuning](/guide/active-highlighting#tuning-for-a-sticky-header).

## Auto-fetch variant (fixed document)

In a layout that always shows one doc’s TOC:

```vue
<aside class="toc">
  <TableOfContents path="/docs/intro" collection="docs" title="On this page" />
</aside>
```

## Don’t do this

- Do not put the TOC inside an `overflow: hidden` ancestor — the `position: sticky` stops being sticky.
- Do not give the wrapper `height: 100vh` without `overflow: auto` — nested list indents (`.toc-sublist-item`) will clip.
- Do not duplicate `#toc-title` / `#toc-container` by placing two `<TableOfContents>` components on one page — those IDs are global and should be unique.

Next: [Custom active styles](/recipes/custom-active-styles) and [Docs layout](/recipes/docs-layout) for refinements.
