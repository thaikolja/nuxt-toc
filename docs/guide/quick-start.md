---
title: Quick start with TableOfContents
description: >-
  Minimal copy-paste to render a table of contents: pass-in :toc from your page query or use auto-fetch, with Nuxt Content v2 and v3 examples for beginners.
---

# Quick start

If you just ran [Installation](/guide/installation), you are one component away from a working TOC. Two approaches exist — **pass-in** (recommended) and **auto-fetch**. This page shows both for Content v3 and v2.

> **Rule of thumb:** if your page already calls `queryCollection` / `queryContent`, use **pass-in** — it is one prop and zero extra queries. Use **auto-fetch** when you want a standalone TOC without writing a query (e.g. in a layout).

## Recommended: pass-in `:toc`

### Content v3 (`queryCollection`)

```vue
<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()

// Fetch the current page once. `queryCollection` is auto-imported by @nuxt/content v3.
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first()
)
</script>

<template>
  <!-- Center: the Markdown body -->
  <ContentRenderer v-if="page" :value="page" />
  <p v-else>Content not found.</p>

  <!-- Right / aside: the TOC. page?.body?.toc is { links: TocLink[] } or null -->
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

What `page?.body?.toc` looks like (from Content):

```ts
// Simplified — every heading becomes a link
{
  links: [
    { id: 'installation', text: 'Installation', depth: 2, children: [
      { id: 'requirements', text: 'Requirements', depth: 3 }
    ]},
    { id: 'usage', text: 'Usage', depth: 2 }
  ]
}
```

### Content v2 (`queryContent`)

Same idea — only the query helper changes:

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

`collection` prop is ignored on v2 — `queryContent` does not use collections. See [queryContent](/content-v2/query-content).

### When pass-in shows nothing

- No `##` / `###` headings in the Markdown → `links` is `[]`. TOC renders nothing (or just the title if you add `is-title-shown-with-no-content`). See [Writing content](/guide/writing-content).
- Content config `toc.depth` is `0` → set it to `2`–`4` (in `nuxt.config.ts` under `content.build.markdown.toc`).

## Alternative: auto-fetch by path

When `:toc` is **omitted**, `<TableOfContents>` asks the module’s fetch plugin to load the document for you. No `useAsyncData` needed in your page.

```vue
<template>
  <!-- Uses the current URL: /guide/intro fetches /guide/intro -->
  <TableOfContents />

  <!-- Fixed document, custom title -->
  <TableOfContents path="/docs/intro" title="On this page" />

  <!-- v3 only: point at a specific collection -->
  <TableOfContents path="/blog/hello" collection="blog" />

  <!-- Tuning: sticky header, depth, smooth scroll -->
  <TableOfContents :scroll-offset="64" :depth="3" smooth />
</template>
```

Behind the scenes:

- On Content v3 the plugin calls `queryCollection(collection).path(path).first()` (`src/runtime/plugins/fetch-v3.ts:42`)
- On Content v2 it calls `queryContent(path).findOne()` (`src/runtime/plugins/fetch-v2.ts:41`)
- The path defaults to `route.path` with trailing slash stripped; an empty path is ignored and logs a warning in dev

**Trade-off:** auto-fetch fires an extra Content query per TOC instance. On a page that already fetches the document, pass-in is cheaper. See [Pass-in vs auto-fetch](/guide/pass-in-vs-auto-fetch) for the full comparison.

## Common props at a glance

```vue
<!-- Limit indentation to top-level only -->
<TableOfContents :toc="page?.body?.toc" :depth="1" />

<!-- Include h4 when your Content toc.searchDepth >= 4 -->
<TableOfContents :toc="page?.body?.toc" :depth="3" />

<!-- Legacy flat mode (same as :depth="1") -->
<TableOfContents :toc="page?.body?.toc" :is-sublist-shown="false" />

<!-- Keep the title even when links are empty -->
<TableOfContents :toc="page?.body?.toc" title="On this page" :is-title-shown-with-no-content="true" />

<!-- v3: override the default collection from nuxtToc.collection -->
<TableOfContents collection="docs" path="/docs/intro" />

<!-- Scroll behavior -->
<TableOfContents :scroll-spy="false" />   <!-- disable active highlighting -->
<TableOfContents smooth :scroll-offset="72" root-margin="0px 0px -60% 0px" />
```

Full table: [Props](/api/props). Defaults you can set globally: [Module options](/api/module-options).

## Sticky sidebar layout (copy-paste)

Both playgrounds (`playgrounds/content-v3/pages/index.vue:22`, `playgrounds/content-v2`) use this grid — it keeps the TOC beside the article on desktop and stacked on mobile:

```vue
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
  align-items: start;
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
  .toc  { position: static; order: -1; }
}
</style>
```

::: tip Scroll into view neatly
If you have a fixed header, pass its height so clicks land below it:

```vue
<TableOfContents :toc="page?.body?.toc" :scroll-offset="64" smooth />
```

And add `scroll-margin-top` to headings:

```css
.content :deep(h2), .content :deep(h3) { scroll-margin-top: 72px; }
```

See [Scroll-to-heading helper](/guide/active-highlighting#smooth-scroll-and-offset).
:::

## Next steps

- [Writing content](/guide/writing-content) — how headings become TOC links, and why yours might be empty
- [Styling](/guide/styling) — override `.active-toc-item`, indents, and the outer `#toc-container`
- [Recipes](/recipes/sticky-sidebar) — subject-specific examples (multiple collections, custom active styles, docs shell)
