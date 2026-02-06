> [!IMPORTANT]
>
> The released version of this module, v2.7.2, **is not compatible** with the current version of Nuxt Content, [@nuxt/content v3](https://content.nuxt.com/). To use this module, you must downgrade to [@nuxt/content v2.x.x](https://v2.content.nuxt.com/). The upgrade of this module to v3.0.0 to be compatible with @nuxt/content v3 is currently in active development.

---

**Languages:** [中文](./README_zh.md)

# Table of Contents for @nuxt/content

[![npm version][npm-version-src]][npm-version-href] [![npm downloads][npm-downloads-src]][npm-downloads-href] [![License][license-src]][license-href] [![Nuxt][nuxt-src]][nuxt-href]

A module for the Nuxt module [@nuxt/content](https://content.nuxt.com/) to integrate a table of contents component inside your Nuxt Content projects.



- [✨  Release Notes](https://github.com/hanyujie2002/nuxt-toc/releases)
- [🚀 Nuxt 4 Requirements](./NUXT4_REQUIREMENTS.md)
<!-- - 🏀 Online playground -->
<!-- - 📖  Documentation -->

## Features ✨

- 🎨 **Highly Customizable**: Tailor it to fit your unique needs.
- 🔍 **Active TOC Highlighting**: Easily see which section you're in.
- 📦 **Out of the Box**: Ready to use with minimal setup.
- 🔗 **Section Links**: Navigate seamlessly within your content.
- ♿ **ARIA Support**: Ensures accessibility for all users.
- 🆓 **Free and Open Source (MIT License)**: Enjoy the freedom to use, modify, and distribute.

## Quick Start 🔧

1. Install the module to your Nuxt application:

```bash
npx nuxi module add nuxt-toc
```

2. Add `<TableOfContents />` at where you need the TOC.

```vue
<template>
    <ContentDoc />
    <TableOfContents />
</template>
```

You can also pass in TOC yourself to prevent duplicate fetching.

```vue
<template>
    <ContentRenderer :value="data" />
    <TableOfContents :toc="data.body.toc" />
</template>

<script setup>
const route = useRoute()

const { data } = await useAsyncData('home', () => queryContent(route.path).findOne())
</script>
```

## Props

| **Prop**           | **Type** | **Default** | **Description**                                                                                     |
|--------------------|----------|-------------|-----------------------------------------------------------------------------------------------------|
| `toc`                  | JSON | `null`              | Use the provided `toc` data. **If `toc` is passed in, this component will not fetch TOC info itself and `path` prop will be ignored**.|
| `path`             | String   | `''`        | The path to the content for which the TOC is generated. **Defaults to using the current URI if not set**.                                    |
| `isSublistShown`   | Boolean  | `true`      | Determines whether the sublist within the TOC is shown.                                             |
| `isTitleShownWithNoContent` | Boolean  | `false`     | Determines whether the title is shown even if there is no content in the TOC.                                  |
| `title`            | String   | `'Table of Contents'` | The title of the TOC.                                                                               |

## Styling

| **ID/Class**                | **Type** | **Description**                                                                                     |
|-----------------------------|----------|-----------------------------------------------------------------------------------------------------|
| `toc-container`             | ID       | The container for the table of contents (TOC).                                                      |
| `toc-title`                 | ID       | The title of the table of contents.                                                                 |
| `toc-item`                  | Class    | General class for TOC items.                                                                        |
| `toc-topitem`               | Class    | Specific class for top-level TOC items.                                                             |
| `active-toc-item`           | Class    | Applied to active TOC items.                                                                        |
| `active-toc-topitem`        | Class    | Applied to active top-level TOC items.                                                              |
| `toc-link`                  | Class    | General class for TOC links.                                                                        |
| `toc-toplink`               | Class    | Specific class for top-level TOC links.                                                             |
| `toc-sublist`               | Class    | Styles the sublist within the TOC.                                                                  |
| `toc-subitem`               | Class    | Specific class for sub-level TOC items.                                                             |
| `active-toc-subitem`        | Class    | Applied to active sub-level TOC items.                                                              |
| `toc-sublink`               | Class    | Specific class for sub-level TOC links.                                                             |
| `toc-item-${link.id}`       | ID       | Dynamically generated ID for each TOC item, based on the `link.id`.                                 |
| `toc-topitem-and-sublist`   | Class    | Styles the top-level TOC items and their sublists.                                                  |

> [!NOTE]
> The default styling of the `<TableOfContents />` component is:
>
> ```css
> .active-toc-item {
>   color: #fef08a;
> }
>
> .toc-sublist-item {
>   padding-left: 1rem;
> }
>
> a {
>   text-decoration: none;
>   color: inherit;
> }
>
> ul,
> ol {
>   list-style: none;
>   padding: 0;
>   margin: 0;
> }
> ```
>
> You can customize the style or reset it with:
>
> ```css
> .active-toc-item {
>   color: initial;
> }
>
> .toc-sublist-item {
>   padding-left: initial;
> }
>
> a {
>   text-decoration: underline;
>   color: initial;
> }
>
> ul,
> ol {
>   list-style: initial;
>   padding: initial;
>   margin: initial;
> }
> ```

## Cookbook

### Example One

Custom color for active items and custom padding for subitems

```vue
<template>
    <ContentDoc />
    <TableOfContents />
</template>

<style>
/* Styling for active Table of Contents items */
.active-toc-item {
  color: #4ade80;
}

/* Indentation for second-level Table of Contents items */
.toc-sublist-item {
  padding-left: 1.5rem;
}
</style>

<!-- Or with Tailwind CSS
<style>
.active-toc-item {
  @apply text-green-300
}

.toc-sublist-item {
  @apply pl-1.5
}
</style>
-->
```

Result:

<div align="center">
  <img src="./screenshots/example.png" alt="example">
</div>

### Example Two

Having a bar at left of each item

```vue
<template>
    <ContentDoc />
    <TableOfContents />
</template>

<style>
.toc-item {
  border-left-width: 2px;
  border-left-style: solid;
  border-color: #e5e7eb;
  padding-left: 0.25rem /* 4px */;
}

.active-toc-item {
  color: #60a5fa;
  border-color: #60a5fa;
}

.toc-sublist-item {
  padding-left: 1rem;
}
</style>

<!-- Or with Tailwind CSS
<style>
.toc-item {
  @apply border-l-2 pl-1
}

.active-toc-item {
  @apply text-blue-400 border-blue-400
}

.toc-sublist-item {
  @apply pl-4
}
</style>
-->
```

Result:

<div align="center">
  <img src="./screenshots/example1.png" alt="example1">
</div>

### Example Three

First level titles be active when any of it's second level titles be active.

```vue
<template>
    <ContentDoc />
    <TableOfContents />
</template>

<style>
/* Sublist item is contained in sub list, which is top item's sibling */
.active-toc-item, .toc-topitem:has(+ .toc-sublist .active-toc-sublist-item) {
  color: #60a5fa
}

.active-toc-sublist-item {
  color: #4ade80
}

.toc-sublist-item {
  padding-left: 1rem /* 16px */;
}
</style>

<!-- Or with Tailwind CSS
<style>
.active-toc-item, .toc-topitem:has(+ .toc-sublist .active-toc-sublist-item) {
  @apply text-blue-400
}

.active-toc-sublist-item {
  @apply text-green-400
}

.toc-sublist-item {
  @apply pl-4
}
</style>
-->
```

Result:

<div align="center">
  <img src="./screenshots/example2.png" alt="example2">
</div>

## License

This project is under [MIT](https://raw.githubusercontent.com/hanyujie2002/nuxt-toc/refs/heads/main/LICENSE) license.

[npm-version-src]: https://img.shields.io/npm/v/nuxt-toc/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-toc

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-toc.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-toc

[license-src]: https://img.shields.io/npm/l/nuxt-toc.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-toc

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
