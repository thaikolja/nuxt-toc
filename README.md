**Languages:** [中文](./README_zh.md)

<p align="center">
  <img src="./logo.png" alt="nuxt-toc logo" width="120" height="120" />
</p>

# Table of Contents for @nuxt/content

[![npm version][npm-version-src]][npm-version-href] [![npm downloads][npm-downloads-src]][npm-downloads-href] [![License][license-src]][license-href] [![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module that adds a table of contents component for [@nuxt/content](https://content.nuxt.com/) projects.

> **Compatible with `@nuxt/content` v2 and v3**, on **Nuxt 4** (or Nuxt ≥ 3.16).

- [Documentation](https://thaikolja.github.io/nuxt-toc/)
- [Release notes](https://github.com/thaikolja/nuxt-toc/releases)

## Features

- Works with **Content v2** (`queryContent`) and **Content v3** (`queryCollection`)
- Prefer **pass-in** `:toc` (no extra query) or optional auto-fetch
- **`depth`** control for nested link trees
- Active section highlighting (toggleable scroll-spy)
- Optional smooth scroll + sticky-header offset
- Stable CSS class/id contract
- ARIA-friendly markup
- MIT licensed

## Requirements

Install **both** this module and Content:

```bash
# Content v3 (recommended for new apps)
npx nuxi module add nuxt-toc
npm i @nuxt/content@^3

# or Content v2
npx nuxi module add nuxt-toc
npm i @nuxt/content@^2
```

Register **both** modules (order does not matter for basic usage):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
})
```

## Quick Start

### Preferred usage (pass-in TOC)

Reuse the TOC from your page query so the component does **not** fetch again.

**Content v3** — also define a collection:

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

**Content v2** — put markdown under `content/` (no `content.config.ts`):

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

> `ContentDoc` only works with Content **v2**. Prefer `ContentRenderer` + an explicit query so the same page works across majors.

### Auto-fetch (optional)

Omit `:toc` and the component loads the document for the current route (or `path`).

| Installed Content | Auto-fetch implementation                        |
| ----------------- | ------------------------------------------------ |
| v2                | `queryContent(path).findOne()`                   |
| v3                | `queryCollection(collection).path(path).first()` |

```vue
<template>
  <!-- Current route path -->
  <TableOfContents />

  <!-- Explicit path + v3 collection -->
  <TableOfContents path="/docs/guide" collection="docs" />
</template>
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: {
    collection: 'content', // Content v3 auto-fetch default
    depth: 2,
    scrollSpy: true,
    rootMargin: '0px 0px -80% 0px',
    smooth: false,
    scrollOffset: 0,
  },
})
```

For auto-fetch to work, `@nuxt/content` must be installed **and** registered as a Nuxt module. If Content is missing, pass `:toc` instead.

## Props

| Prop                        | Type          | Default                     | Description                                                                                  |
| --------------------------- | ------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| `toc`                       | `Toc \| null` | `null`                      | Prefetched TOC (`page.body.toc`). When set, **no** fetch runs.                               |
| `path`                      | `string`      | `''`                        | Auto-fetch path. Defaults to the current route path.                                         |
| `collection`                | `string`      | `''`                        | Content **v3** collection. Falls back to `nuxtToc.collection` or `'content'`. Ignored on v2. |
| `depth`                     | `number`      | module `2`                  | Max nesting of the link tree (`1` = top-level only).                                         |
| `isSublistShown`            | `boolean`     | `true`                      | When `false`, forces effective depth to `1` (legacy).                                        |
| `isTitleShownWithNoContent` | `boolean`     | `false`                     | Still show `title` when there are no links.                                                  |
| `title`                     | `string`      | `'Table of Contents'`       | Heading text.                                                                                |
| `scrollSpy`                 | `boolean`     | module `true`               | Enable IntersectionObserver active highlighting.                                             |
| `rootMargin`                | `string`      | module `'0px 0px -80% 0px'` | Observer `rootMargin` (tune for sticky headers).                                             |
| `smooth`                    | `boolean`     | module `false`              | Smooth-scroll when a TOC link is clicked.                                                    |
| `scrollOffset`              | `number`      | module `0`                  | Pixels offset when scrolling to a heading (sticky header height).                            |

### Depth examples

```vue
<!-- Top-level only -->
<TableOfContents :toc="page?.body?.toc" :depth="1" />

<!-- Default: top + one nested level (typical h2 + h3) -->
<TableOfContents :toc="page?.body?.toc" :depth="2" />

<!-- Sticky header + smooth scroll -->
<TableOfContents
  :toc="page?.body?.toc"
  :smooth="true"
  :scroll-offset="72"
  root-margin="0px 0px -70% 0px"
/>
```

## Module options

Configured under `nuxtToc` in `nuxt.config.ts`:

| Option         | Type      | Default              | Description                                   |
| -------------- | --------- | -------------------- | --------------------------------------------- |
| `collection`   | `string`  | `'content'`          | Default collection for Content v3 auto-fetch. |
| `depth`        | `number`  | `2`                  | Default max TOC nesting depth.                |
| `scrollSpy`    | `boolean` | `true`               | Default active-section highlighting.          |
| `rootMargin`   | `string`  | `'0px 0px -80% 0px'` | Default observer root margin.                 |
| `smooth`       | `boolean` | `false`              | Default smooth scroll on link click.          |
| `scrollOffset` | `number`  | `0`                  | Default scroll offset in pixels.              |

Component props override these defaults when set.

## Styling

Styles are scoped under **`.nuxt-toc`** so they do not reset your whole app.

| ID/Class                                      | Type  | Description                |
| --------------------------------------------- | ----- | -------------------------- |
| `#toc-title`                                  | ID    | Title                      |
| `#toc-container`                              | ID    | Root list                  |
| `.toc-item`                                   | Class | Any item                   |
| `.toc-topitem`                                | Class | Top-level item             |
| `.active-toc-item`                            | Class | Active item                |
| `.active-toc-topitem`                         | Class | Active top-level item      |
| `.toc-link` / `.toc-toplink` / `.toc-sublink` | Class | Links                      |
| `.toc-sublist`                                | Class | Nested list                |
| `.toc-sublist-item`                           | Class | Nested item                |
| `.active-toc-sublist-item`                    | Class | Active nested item         |
| `#toc-item-${id}`                             | ID    | Per-item wrapper           |
| `.toc-topitem-and-sublist`                    | Class | Top item + sublist wrapper |

Default styles:

```css
.nuxt-toc .active-toc-item {
  color: #fef08a;
}

.nuxt-toc .toc-sublist-item {
  padding-left: 1rem;
}

.nuxt-toc a.toc-link {
  text-decoration: none;
  color: inherit;
}

.nuxt-toc ul,
.nuxt-toc ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
```

### Cookbook: custom active colors

```vue
<style>
.nuxt-toc .active-toc-item {
  color: #4ade80;
}

.nuxt-toc .toc-sublist-item {
  padding-left: 1.5rem;
}
</style>
```

### Cookbook: left border highlight

```vue
<style>
.nuxt-toc .toc-item {
  border-left: 2px solid #e5e7eb;
  padding-left: 0.25rem;
}

.nuxt-toc .active-toc-item {
  color: #60a5fa;
  border-color: #60a5fa;
}
</style>
```

## Development playgrounds

This repo ships **two Nuxt 4 apps** (separate installs — Content v2 and v3 cannot share `node_modules`):

| App        | Path                     | Stack                       | Dev command      | Port |
| ---------- | ------------------------ | --------------------------- | ---------------- | ---- |
| Content v3 | `playgrounds/content-v3` | Nuxt 4 + `@nuxt/content` ^3 | `bun run dev:v3` | 3000 |
| Content v2 | `playgrounds/content-v2` | Nuxt 4 + `@nuxt/content` ^2 | `bun run dev:v2` | 3001 |

```bash
bun install
bun run dev:prepare
bun run dev:v3        # /, /auto-fetch, /props, /settings
bun run dev:v2
```

## Compatibility

| Package         | Supported             |
| --------------- | --------------------- |
| `nuxt`          | `^3.16.0 \|\| ^4.0.0` |
| `@nuxt/content` | `^2.0.0 \|\| ^3.0.0`  |

## Breaking changes in v3.0.0

- Config key is **`nuxtToc`**
- Auto-fetch uses version-specific plugins (no ContentQuery clone)
- Tooling targets Nuxt 4; Nuxt ≥ 3.16 remains in the peer range
- Dual playgrounds + Bun for development

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
