---
title: Introduction to nuxt-toc
description: >-
  What nuxt-toc is, when to use it, and how it fits into a Nuxt Content site. Beginner-friendly overview of modules, TOCs, and active highlighting.
---

# Introduction

**nuxt-toc** is a [Nuxt module](https://nuxt.com/docs/guide/directory-structure/modules) — a small plugin that teaches your Nuxt app a new trick. That trick is a **Table of Contents (TOC)**: a clickable outline on the side of a page that lists its headings and highlights the section you are currently reading.

If you have ever read docs that show “On this page” with links like *Installation → Quick start → Configuration*, that is exactly what this module renders.

## In 30 seconds

1. You write content in Markdown (`content/guide.md`) with headings (`## Installation`, `### Requirements`).
2. `@nuxt/content` parses the file and generates a TOC object at `page.body.toc` — a tree of `{ id, text, children }`.
3. `nuxt-toc` gives you a single component, `<TableOfContents>`, that renders that tree as a nested list, handles scroll-spy, and lets you style it.

```vue
<!-- pages/[...slug].vue — the whole wiring -->
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first() // v3, or queryContent(route.path).findOne() for v2
)
</script>

<template>
  <div class="layout">
    <main><ContentRenderer v-if="page" :value="page" /></main>
    <aside><TableOfContents :toc="page?.body?.toc" /></aside>
  </div>
</template>
```

No second query. No custom parser. If you already fetch the page, just hand its `toc` to the component.

## What it does

- **Renders nested links** from Content TOC data. The shape is always `{ links: TocLink[] }` where each link has `id`, `text`, `depth`, and optional `children`. See [Types](/api/types).
- **Optionally auto-fetches** when you omit `:toc`. The module detects whether you have Content v2 or v3 (via `src/utils/detect-content-major.ts:32`) and registers exactly one plugin: `fetch-v2` (`queryContent(path).findOne()`) or `fetch-v3` (`queryCollection(col).path(path).first()`). This is why the package never hard-imports both query helpers.
- **Highlights the active section** with an `IntersectionObserver` that watches only the heading IDs present in your TOC. It batches updates with `requestAnimationFrame`, keeps `lastVisibleHeading` as a fallback so one item is always active, and rebuilds when the TOC or path changes. See [Active highlighting](/guide/active-highlighting).
- **Stays accessible and themeable** — the rendered markup uses stable IDs/classes (`#toc-title`, `#toc-container`, `.toc-link`, `.active-toc-item` …) and ARIA roles (`role="list"`, `role="heading"`). You override a few CSS rules and you are done.

## What it does NOT do

- It does **not generate the TOC** — `@nuxt/content` does that from your headings. This module only displays it.
- It does **not replace `@nuxt/content`** — you still install and configure Content yourself.
- It does **not force a design**. Default styles are intentionally minimal (list reset, a light indent, a yellowish active color you will likely override).

## Who should use it

- You use **Nuxt 4** (or Nuxt ≥ 3.16) — the module is tested as a Nuxt 4 module with `@nuxt/kit >=3.16 <5`.
- You use **`@nuxt/content` v2 or v3**. Both are supported from the same install. See [Compatibility](/guide/compatibility).
- You want a small, focused TOC component with a stable CSS contract that you can drop into a docs or blog layout. If you need full-text search or left-nav generation, pair this component with other modules — it does not try to do everything.

## Nuxt modules in plain language

If you are new to Nuxt: a module is an add-on you list in `nuxt.config.ts` under `modules`. At build time Nuxt runs the module's `setup()` (see `src/module.ts:171`) which can add components, plugins, and runtime config. For `nuxt-toc`:

1. It adds the `<TableOfContents>` component globally (`addComponent`).
2. It detects your Content major (`detectContentMajor`) and adds one fetch plugin (`addPlugin`).
3. It publishes defaults under `runtimeConfig.public.nuxtToc` so the component knows your `collection`, `depth`, `scrollSpy`, etc.

You never import the component manually. Once the module is in `nuxt.config.ts`, `<TableOfContents>` is available in every page.

## File layout this guide assumes

```
my-nuxt-app/
  nuxt.config.ts          ← register modules here
  content.config.ts       ← Content v3 collections (v2 has no file)
  content/
    index.md              ← your Markdown pages
    guide/
      intro.md
  pages/
    [...slug].vue         ← catch-all route that renders Content
  components/             ← your own components (optional)
```

If this is your first Nuxt app, read [First time with Nuxt](/guide/first-time-nuxt) before continuing — it walks you from `npx nuxi init` to a rendered Markdown page.

## Logo

Brand asset: `logo.png` at the repository root. Copies live at `playgrounds/*/public/logo.png` and `docs/public/logo.png` so all playgrounds and the docs show the same image.

![nuxt-toc logo](/logo.png){width=120}

## Next steps

- **Never used Nuxt?** → [First time with Nuxt](/guide/first-time-nuxt)
- **Have a Nuxt app?** → [Installation](/guide/installation) (one command + `nuxt.config.ts`)
- **Want the code now?** → [Quick start](/guide/quick-start)
- **Curious how auto-fetch vs pass-in works?** → [Pass-in vs auto-fetch](/guide/pass-in-vs-auto-fetch)
