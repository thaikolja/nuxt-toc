---
title: Set up nuxt-toc with Content v3
description: >-
  Install @nuxt/content v3, define content.config.ts collections, register nuxt-toc, and render TableOfContents in a Nuxt 4 app — with file layout and common errors.
---

# Content v3 setup

Use this checklist if your app uses `@nuxt/content` **v3** (recommended for new Nuxt 4 apps). If you already have Content v2, see [Content v2 setup](/content-v2/setup) instead.

## Checklist

1. Install packages
2. Register modules
3. Define collections
4. Write Markdown
5. Render TOC (pass-in or auto-fetch)

### 1. Install

```bash
npm install @nuxt/content@^3 nuxt-toc
npm install -D better-sqlite3   # if your OS/CI warns Content v3 needs it
```

> Content v3 uses an embedded SQLite DB for indexing at build. Most machines are fine without `better-sqlite3`, but some Node/OS combinations print a warning — install it when asked.

### 2. Register modules

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],

  // Optional: global defaults (see /api/module-options)
  nuxtToc: {
    collection: 'content', // must match a key in content.config.ts below
    depth: 2,
  },

  // Tune how many heading levels Content extracts into body.toc
  content: {
    build: {
      markdown: { toc: { depth: 4, searchDepth: 4 } },
    },
  },

  compatibilityDate: '2025-01-01',
})
```

### 3. Define collections

Content v3 requires `content.config.ts` at the project root. Collections are **named buckets** of content — each maps a folder/glob to a query name.

```ts
// content.config.ts — minimal config that the playground also uses
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page', // 'page' adds body.toc automatically
      source: '**/*.md', // every .md under content/
    }),
  },
})
```

Multiple collections example (blog + docs):

```ts
collections: {
  docs: defineCollection({ type: 'page', source: 'docs/**/*.md' }),
  blog: defineCollection({ type: 'page', source: 'blog/**/*.md' }),
}
```

Each key (`content`, `docs`, `blog`) becomes the first argument of `queryCollection('content')` or the `collection` prop of `<TableOfContents>`. See [Collections](/content-v3/collections).

### 4. Write Markdown

```
content/
  index.md               → path "/"
  guide/
    intro.md             → path "/guide/intro"
  blog/
    hello.md             → path "/blog/hello" (if source includes it)
```

Every `##` heading becomes a TOC link (see [Writing content](/guide/writing-content)). `content/index.md`:

```md
---
title: Welcome
---

## Getting started

## Installation

### Via nuxi
```

### 5. Render the TOC

**Recommended (pass-in):** reuse the page query you already make for `<ContentRenderer>`:

```vue
<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" title="On this page" />
</template>
```

**Or auto-fetch by path/collection** — see [Auto-fetch (v3)](/content-v3/auto-fetch) and [queryCollection](/content-v3/query-collection).

## Verify

```bash
npx nuxi prepare
npm run dev          # playground v3 demo runs on http://localhost:3000
```

Open a page with at least two `##` headings — the TOC should list them. If it is empty, see [Troubleshooting — TOC renders nothing](/guide/troubleshooting#toc-renders-nothing).

## Common errors

| Message                                 | Fix                                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `collection "…"` not found              | `nuxtToc.collection` does not match any key in `content.config.ts` — make them match or pass `collection` per-component |
| `Could not load …` / `No content found` | Path does not match Content’s generated path — `content/guide.md` → `/guide`, not `/content/guide`                      |
| `better-sqlite3` native build failure   | Follow the link Content prints (requires build tools on Windows / Alpine)                                               |

Next: [Collections](/content-v3/collections) explains naming in detail, and [queryCollection](/content-v3/query-collection) shows the pass-in query shape.
