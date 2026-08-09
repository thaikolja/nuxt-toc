# Installation

## Module

```bash
npx nuxi module add nuxt-toc
# or
bun add nuxt-toc
```

Ensure **@nuxt/content** is installed as a peer:

```bash
# Content v3 (recommended for new apps)
bun add @nuxt/content@^3

# or Content v2
bun add @nuxt/content@^2
```

## Register the module

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: {
    // Content v3 auto-fetch only
    collection: 'content',
  },
})
```

## Content v3 collections

Create `content.config.ts` in the app root:

```ts
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

Content v2 does not use collections or `content.config.ts`.

## Verify

In a page:

```vue
<template>
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

If the component is missing, run `nuxi prepare` and confirm `nuxt-toc` is listed under `modules`.
