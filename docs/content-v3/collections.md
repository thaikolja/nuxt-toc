---
title: Content v3 collections for TOC
description: >-
  What Content v3 collections are, how the collection prop and nuxtToc.collection map to content.config.ts keys, and common multi-source mistakes.
---

# Collections (Content v3)

Content v3 introduces **collections** — named groups of Markdown files defined in `content.config.ts`. They are the reason `queryCollection('content')` takes a string argument, and the reason `<TableOfContents>` has a `collection` prop (v3 only).

If you use Content **v2**, skip this page — `collection` is ignored there.

## What a collection is

```ts
// content.config.ts
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // key "content" → queryCollection('content')
    content: defineCollection({
      type: 'page',       // "page" documents include body.toc
      source: '**/*.md',  // every .md under content/
    }),

    // second collection example
    blog: defineCollection({
      type: 'page',
      source: 'blog/**',  // only under content/blog/ (relative to content dir)
    }),
  },
})
```

- **key** (`content`, `blog`, `docs`) → query name and `collection` prop value.
- **`type: 'page'`** → single document per path, with `body.toc`. Other types exist but `page` is what `nuxt-toc` expects.
- **`source`** → glob-like path within `content/` (`'**/*.md'` vs `'docs/**'`).

## How this maps to the TOC

### Auto-fetch

When you omit `:toc`, the `fetch-v3` plugin calls `queryCollection(collection).path(path).first()` (`src/runtime/plugins/fetch-v3.ts:42`) with:

```ts
collection = props.collection || runtimeConfig.public.nuxtToc.collection || 'content'
path       = props.path || route.path || '/'
```

So the chain is:

1. Per-component prop `<TableOfContents collection="blog" />` wins.
2. Else global `nuxtToc.collection` from `nuxt.config.ts`.
3. Else hard fallback `"content"`.

**Rule:** auto-fetch must be told which collection holds the document at `path`. If your `content/guide.md` lives in `content: defineCollection({ source: '**/*.md' })`, `collection="content"` is correct. If it lives in `blog: … source: 'blog/**'`, use `collection="blog"`.

### Pass-in

When you pass `:toc="page.body.toc"`, no collection resolution happens — you already fetched the page from the right collection. The `collection` prop is irrelevant:

```vue
<script setup lang="ts">
const page = await queryCollection('blog').path('/blog/hello').first()
</script>

<template>
  <!-- Works — collection already accounted for in the query above -->
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

## Typical setups

### Single collection (most apps)

```ts
// content.config.ts
collections: { content: defineCollection({ type: 'page', source: '**/*.md' }) }
// nuxt.config.ts
nuxtToc: { collection: 'content' }  // or omit — 'content' is the default
```

```vue
<TableOfContents :toc="page?.body?.toc" />
<!-- or auto-fetch -->
<TableOfContents path="/guide/intro" />
```

### Two collections: docs + blog

```ts
collections: {
  docs: defineCollection({ type: 'page', source: 'docs/**' }),
  blog: defineCollection({ type: 'page', source: 'blog/**' }),
}
```

```vue
<!-- Docs sidebar -->
<TableOfContents path="/docs/intro" collection="docs" />
<!-- Blog page (pass-in preferred) -->
<TableOfContents :toc="page?.body?.toc" />
```

### Global default + per-page override

```ts
// nuxt.config.ts — docs is the primary collection
nuxtToc: { collection: 'docs' }
```

```vue
<!-- Most pages inherit "docs" -->
<TableOfContents path="/docs/intro" />
<!-- One blog page overrides -->
<TableOfContents path="/blog/hello" collection="blog" />
```

## Common mistakes

| Symptom | Cause |
|---|---|
| `collection "xyz" not found` | `content.config.ts` has no `xyz` key — spell it same as `defineCollection` |
| File exists but `page == null` | `source` glob does not include the file (e.g. `docs/**` but file is at `content/guide.md`) |
| TOC always empty with auto-fetch | Wrong collection → query returned `null`; the component shows “No content found for /path” |
| `collection` seems to do nothing | You are on Content v2 or using pass-in mode — in both cases the prop is ignored |

Next: [queryCollection](/content-v3/query-collection) shows the pass-in query shape, and [Auto-fetch (v3)](/content-v3/auto-fetch) shows the path/collection runtime behavior.
