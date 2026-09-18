---
title: Migrate Nuxt Content apps v2 to v3
description: >-
  Update a Nuxt app from @nuxt/content v2 to v3 while keeping TableOfContents: collections, queryCollection, ContentRenderer, and the unchanged pass-in :toc contract.
---

# Migrating your app: Content v2 → v3

This page is about migrating **your Nuxt app’s Content** from v2 to v3. `nuxt-toc` supports both majors from the same install, but your app should use one query API — switch when you upgrade Content.

::: tip Module does not auto-migrate your content
This module’s pass-in `:toc="page.body.toc"` contract is stable across majors (`normalizeToc` handles `body.toc` on both). Only the line that **fetches the page** changes.
:::

## 1. Upgrade the Content package

```bash
npm install @nuxt/content@^3
# If your OS needs the embedded SQLite native addon:
npm install -D better-sqlite3
```

Remove any `content.config.ts` that exists only as a leftover? On v3 you **need** one — read next step.

## 2. Add `content.config.ts`

```ts
// content.config.ts — at project root
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

- `content` is the collection name — it must match `queryCollection('content')` and `nuxtToc.collection`.
- `type: 'page'` is the shape that gives you `body.toc`.
- `source: '**/*.md'` picks up whatever v2 picked up under `content/` — adjust if you previously filtered.

See [Collections](/content-v3/collections) for multiple collections and [Content v3 setup](/content-v3/setup) for the full file.

## 3. Replace `queryContent`

```diff
- const route = useRoute()
- const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
+ const route = useRoute()
+ const { data: page } = await useAsyncData(route.path, () =>
+   queryCollection('content').path(route.path).first()
+ )
```

Keep `useAsyncData(route.path, …)` so `page` is keyed by path and cached. Keep `queryCollection`’s collection key exactly as in `content.config.ts`.

## 4. Replace dropped components

| v2                                             | v3                                                     |
| ---------------------------------------------- | ------------------------------------------------------ |
| `ContentDoc`                                   | removed — use `ContentRenderer` with your fetched page |
| `ContentRenderer / ContentDoc` hybrid patterns | `ContentRenderer` paired with an explicit query        |

```vue
<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

## 5. Point `nuxtToc.collection` at the right collection

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: { collection: 'content' }, // matters for auto-fetch; pass-in :toc ignores it
})
```

If you have `blog` and `docs` collections with different source globs, set the one used for auto-fetch here, or override per-component `<TableOfContents collection="blog" />`. See [Collections](/content-v3/collections) for the full resolution chain.

## 6. Check heading depth and TOC extraction

On v2 some setups configured `content.markdown.toc`. On v3 the equivalent is:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  content: {
    build: {
      markdown: { toc: { depth: 4, searchDepth: 4 } },
    },
  },
})
```

...paired with a `nuxtLoc.depth`/`depth` prop that limits what is **rendered** (see [Writing content — two depths](/guide/writing-content#two-depth-concepts)).

## 7. Verify

```bash
npx nuxi prepare
npm run dev
```

Existing TOC lines (`:toc="page.body.toc"`, `title`, `depth`, `isSublistShown`, `isTitleShownWithNoContent`) need no change. Auto-fetch will pick `fetch-v3` automatically after detection (`contentMajor === 3`).

## When to keep Content v2

Staying on v2 is fine — the module keeps supporting it. The only v3–only feature you miss is `collection` awareness (on v2 the prop is ignored). See [Content v2 setup](/content-v2/setup) and [Compatibility](/guide/compatibility).
