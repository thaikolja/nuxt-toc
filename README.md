**Languages:** [中文](./README_zh.md)

# Table of Contents for @nuxt/content

[![npm version][npm-version-src]][npm-version-href] [![npm downloads][npm-downloads-src]][npm-downloads-href] [![License][license-src]][license-href] [![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module that adds a table of contents component for [@nuxt/content](https://content.nuxt.com/) projects.

> **Compatible with `@nuxt/content` v2 and v3**, on **Nuxt 4** (or Nuxt ≥ 3.16).

- [✨ Release Notes](https://github.com/hanyujie2002/nuxt-toc/releases)

## Features

- Works with **Content v2** (`queryContent`) and **Content v3** (`queryCollection`)
- Highly customizable styling (stable CSS class/id contract)
- Active section highlighting via IntersectionObserver
- Pass-in TOC data or optional auto-fetch
- Section anchor links
- ARIA-friendly markup
- MIT licensed

## Development playgrounds

This repo ships **two Nuxt 4 apps** (separate installs — Content v2 and v3 cannot share `node_modules`):

| App | Path | Stack | Dev command | Port |
|-----|------|-------|-------------|------|
| Content v3 | `playgrounds/content-v3` | Nuxt 4 + `@nuxt/content` ^3 | `bun run dev:v3` | 3000 |
| Content v2 | `playgrounds/content-v2` | Nuxt 4 + `@nuxt/content` ^2 | `bun run dev:v2` | 3001 |

Local development uses **Bun**:

```bash
bun install
bun run dev:prepare   # builds the module stub + installs both playgrounds
bun run dev:v3        # or: bun run dev
bun run dev:v2
```

## Quick Start

```bash
npx nuxi module add nuxt-toc
# peer: @nuxt/content ^2 or ^3
```

### Preferred usage (v2 and v3)

Pass TOC from your existing page query so the component does not fetch twice:

**Content v3**

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

Define a collection in `content.config.ts`:

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

**Content v2**

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne(),
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <!-- or <ContentDoc /> -->
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

### Auto-fetch (optional)

Omit `:toc` and the module loads the document for the current path (or `path` prop).

It automatically picks the correct Content API based on the installed major version:

| Installed Content | Auto-fetch implementation |
|-------------------|---------------------------|
| v2 | `queryContent(path).findOne()` |
| v3 | `queryCollection(collection).path(path).first()` |

```vue
<template>
  <TableOfContents />
  <!-- or -->
  <TableOfContents path="/docs/guide" collection="docs" />
</template>
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: {
    // Used for Content v3 auto-fetch only
    collection: 'content',
  },
})
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toc` | `Toc \| null` | `null` | Prefetched TOC (`page.body.toc`). When set, no fetch is performed. |
| `path` | `string` | `''` | Content path for auto-fetch. Defaults to the current route path. |
| `collection` | `string` | `''` | Content **v3** collection name. Falls back to `nuxtToc.collection` or `'content'`. Ignored on v2. |
| `isSublistShown` | `boolean` | `true` | Show nested (h3) links. |
| `isTitleShownWithNoContent` | `boolean` | `false` | Show title even when TOC is empty. |
| `title` | `string` | `'Table of Contents'` | Heading text. |

## Module options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collection` | `string` | `'content'` | Default collection for Content v3 auto-fetch. |

## Styling

| ID/Class | Type | Description |
|----------|------|-------------|
| `toc-container` | ID | TOC list container |
| `toc-title` | ID | TOC title |
| `toc-item` | Class | Any TOC item |
| `toc-topitem` | Class | Top-level item |
| `active-toc-item` | Class | Active item |
| `active-toc-topitem` | Class | Active top-level item |
| `toc-link` | Class | Link |
| `toc-toplink` | Class | Top-level link |
| `toc-sublist` | Class | Nested list |
| `toc-sublist-item` | Class | Nested item |
| `active-toc-sublist-item` | Class | Active nested item |
| `toc-sublink` | Class | Nested link |
| `toc-item-${link.id}` | ID | Per-item id |
| `toc-topitem-and-sublist` | Class | Top item + its sublist wrapper |

Default styles:

```css
.active-toc-item {
  color: #fef08a;
}

.toc-sublist-item {
  padding-left: 1rem;
}

a {
  text-decoration: none;
  color: inherit;
}

ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
```

## Compatibility

| Package | Supported |
|---------|-----------|
| `nuxt` | `^3.16.0 \|\| ^4.0.0` |
| `@nuxt/content` | `^2.0.0 \|\| ^3.0.0` |

## Breaking changes in v3.0.0

- Config key is `nuxtToc` (option: `collection`).
- Internal ContentQuery-style helper removed; auto-fetch uses version-specific plugins.
- Tooling targets Nuxt 4; Nuxt ≥ 3.16 remains in the peer range.

## Cookbook

### Custom active colors

```vue
<style>
.active-toc-item {
  color: #4ade80;
}

.toc-sublist-item {
  padding-left: 1.5rem;
}
</style>
```

### Left border highlight

```vue
<style>
.toc-item {
  border-left: 2px solid #e5e7eb;
  padding-left: 0.25rem;
}

.active-toc-item {
  color: #60a5fa;
  border-color: #60a5fa;
}
</style>
```

## License

This project is under the [MIT](./LICENSE) license.

[npm-version-src]: https://img.shields.io/npm/v/nuxt-toc/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-toc
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-toc.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-toc
[license-src]: https://img.shields.io/npm/l/nuxt-toc.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-toc
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
