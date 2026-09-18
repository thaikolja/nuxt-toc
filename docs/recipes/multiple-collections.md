---
title: TOC with multiple Content collections
description: >-
  Point TableOfContents at different Content v3 collections (blog vs docs) with the collection prop, global defaults, and pass-in — with source glob guidance.
---

# Multiple collections (v3)

Real docs sites often have more than one **collection** — `docs/**` for guides and `blog/**` for posts. This recipe shows how to point `<TableOfContents>` at the right one.

> Only applies to **Content v3**. On v2, `collection` is ignored — see [Content v2 setup](/content-v2/setup).

## Define collections

```ts
// content.config.ts
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({ type: 'page', source: 'docs/**/*.md' }),
    blog: defineCollection({ type: 'page', source: 'blog/**/*.md' }),
  },
})
```

- `docs: source: 'docs/**'` → reachable via `queryCollection('docs')`, path `/docs/intro` comes from `content/docs/intro.md` (or `docs/intro.md` depending on your `content` folder placement — check what Content outputs at `.path`).
- `blog: source: 'blog/**'` → `queryCollection('blog')`.

## Option 1: Pass-in (recommended, most flexible)

Reuse the collection you already queried for the page:

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('docs').path(route.path).first(),
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <!-- No collection prop — already resolved above -->
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

And for a blog page:

```vue
<script setup lang="ts">
const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first(),
)
</script>

<template>
  <ContentRenderer v-if="post" :value="post" />
  <TableOfContents :toc="post?.body?.toc" />
</template>
```

You never need `collection` on `<TableOfContents>` with pass-in — that’s why docs call it the “works the same on v2 and v3” mode.

## Option 2: Auto-fetch by `path` + `collection`

When the TOC fetches itself:

```vue
<template>
  <!-- Docs TOC -->
  <TableOfContents path="/docs/intro" collection="docs" />
  <!-- Blog TOC -->
  <TableOfContents path="/blog/hello" collection="blog" />
</template>
```

Resolution: `props.collection || runtimeConfig.public.nuxtToc.collection || 'content'` (`TableOfContents.vue:230`). If your `nuxtToc.collection` in `nuxt.config.ts` is `"docs"`, the first line can omit `collection="docs"`:

```ts
// nuxt.config.ts — global default for auto-fetch
nuxtToc: {
  collection: 'docs'
}
```

```vue
<TableOfContents path="/docs/intro" />
<!-- inherits "docs" -->
<TableOfContents path="/blog/hello" collection="blog" />
<!-- override -->
```

## Option 3: Two TOCs with different collections on one page? Use pass-in

Auto-fetch per-instance fetches exactly one document, keyed `nuxt-toc-${collection}-${path}`. If you need to show two outlines (e.g. docs + related posts), do two pass-in fetches:

```vue
<script setup lang="ts">
const route = useRoute()
const docsPath = '/docs/intro'
const blogPath = '/blog/hello'
const { data: docsPage } = await useAsyncData(docsPath, () =>
  queryCollection('docs').path(docsPath).first(),
)
const { data: blogPage } = await useAsyncData(blogPath, () =>
  queryCollection('blog').path(blogPath).first(),
)
</script>

<template>
  <TableOfContents :toc="docsPage?.body?.toc" title="On this page" />
  <TableOfContents :toc="blogPage?.body?.toc" title="Related post" />
</template>
```

::: warning One TOC per page recommendation
IDs `#toc-title` / `#toc-container` are global. Two instances duplicate them. If you render two TOCs on purpose, give the second wrapper a custom CSS scope or hide the duplicate title so a11y tools do not flag duplicates.
:::

Next: [Collections](/content-v3/collections) for the full collection model and [Auto-fetch (v3)](/content-v3/auto-fetch) for error states.
