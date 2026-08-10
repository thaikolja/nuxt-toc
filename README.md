# nuxt-toc

[![npm version](https://img.shields.io/npm/v/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc) [![npm downloads](https://img.shields.io/npm/dm/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc) [![License](https://img.shields.io/npm/l/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/thaikolja/nuxt-toc/blob/main/LICENSE) [![CI](https://img.shields.io/github/actions/workflow/status/thaikolja/nuxt-toc/ci.yml?branch=main&style=flat&colorA=18181B&label=ci)](https://github.com/thaikolja/nuxt-toc/actions/workflows/ci.yml)

**nuxt-toc** is a [Nuxt 3 and 4](https://nuxt.com/) module to display a table of contents (TOC) when using content created with the [@nuxt/content](https://content.nuxt.com/) module. Since `v.3.0.0`, nuxt-toc supports both versions of @nuxt/content, `v2` and `v3`. nuxt-toc is also compatible with Nuxt 3 and 4.

> [!NOTE]
>
> For more information, check out the [full documentation](https://thaikolja.github.io/nuxt-toc/).

**Languages:**  [🇺🇸 English](./README.md) · [🇹🇼 中文](./README_zh.md) · [🇩🇪 Deutsch](./README_de.md) · [🇪🇸 Español](./README_es.md) · [🇫🇷 Français](./README_fr.md) · [🇸🇦 فارسی](./README_fa.md)

## ⚡️ Features

- Content **v2** (`queryContent`) and **v3** (`queryCollection`)
- Pass-in `:toc` (recommended) or optional auto-fetch
- Nested link depth control
- Active section highlighting (scroll-spy)
- Optional smooth scroll + sticky-header offset
- Stable CSS class/id hooks for theming
- Accessible list markup

## 🔨 Install

### Step 1: Setup

```bash
# Adding to existing site
npx nuxi module add nuxt-toc

# Or install manually
npm install nuxt-toc
```

### Step 2: Add module to Nuxt

If you installed `nuxt-toc` via `nuxi module`, you can skip this step.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
})
```

## 🧑‍💻 Usage

Prefer passing the TOC from your page query. Make sure to use the correct version to match your @nuxt/content version.

## @nuxt/content v3

```vue
<!-- MyPage.vue -->
<script setup lang="ts">
const route 					= useRoute()
const { data: page } 	= await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

## @nuxt/content v2

```vue
<!-- MyPage.vue -->
<script setup lang="ts">
const route 			= useRoute()
constage { data } = queryContent(route.path).findOne()
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

Or auto-fetch by path:

```vue
<TableOfContents path="/docs/intro" />
```

## ⚙️ Props

| Prop                        | Type          | Default               | Description                                                            |
| --------------------------- | ------------- | --------------------- | ---------------------------------------------------------------------- |
| `toc`                       | `Toc \| null` | `null`                | Prefetched TOC (`page.body.toc`). Skips fetch when set.                |
| `path`                      | `string`      | `''`                  | Auto-fetch path (default: current route).                              |
| `collection`                | `string`      | `''`                  | Content **v3** collection (default: `nuxtToc.collection` / `content`). |
| `depth`                     | `number`      | `2`                   | Max nesting depth of the link tree (`1` = top-level only).             |
| `isSublistShown`            | `boolean`     | `true`                | When `false`, forces depth `1`.                                        |
| `isTitleShownWithNoContent` | `boolean`     | `false`               | Keep showing the title when there are no links.                        |
| `title`                     | `string`      | `'Table of Contents'` | Heading text.                                                          |
| `scrollSpy`                 | `boolean`     | `true`                | Active-section highlighting.                                           |
| `rootMargin`                | `string`      | `'0px 0px -80% 0px'`  | IntersectionObserver `rootMargin`.                                     |
| `smooth`                    | `boolean`     | `false`               | Smooth scroll on link click.                                           |
| `scrollOffset`              | `number`      | `0`                   | Scroll offset in px (sticky header).                                   |

## 🛠️ Module options

Customize `nuxt-toc` via the following settings (values used here are default values).

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'nuxt-toc',
    ... // Your other modules
  ],
  nuxtToc: {
    collection: 	'content',
    depth: 				2,
    scrollSpy: 		true,
    rootMargin: 	'0px 0px -80% 0px',
    smooth: 			false,
    scrollOffset: 0,
  },
})
```

## 📚 Documentation

To learn more about `nuxt-toc` and how to use or style it, check out [the full documentation](https://thaikolja.github.io/nuxt-toc). You will find guides, recipes, and more.

## 🧑‍💻 Authors

### Creator

[**hanyujie2002**](https://github.com/hanyujie2002) (yujiehan2002@outlook.com)

### Maintainers

[**thaikolja**](https://github.com/thaikolja) (kolja.nolte@gmail.com)

## © License

This project is licensed under the [MIT License](/LICENSE).
