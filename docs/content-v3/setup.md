---
title: Set up nuxt-toc with Content v3
description: >-
  Install @nuxt/content v3, define content.config.ts collections, register nuxt-toc, and start rendering TableOfContents in Nuxt 4 apps.
---

# Content v3 setup

1. Install `@nuxt/content@^3` and `nuxt-toc`
2. Register both modules
3. Add `content.config.ts` with at least one page collection
4. For SQLite adapters in some environments, install `better-sqlite3` as needed by Content

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: { collection: 'content' },
})
```

```ts
// content.config.ts
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
  },
})
```
