---
title: Set up nuxt-toc with Content v2
description: >-
  Install @nuxt/content v2 with nuxt-toc in Nuxt 4, put Markdown under content/, and render TableOfContents without content.config.ts — with common gotchas.
---

# Content v2 setup

Use this checklist if your app uses `@nuxt/content` **v2**. New apps should prefer v3 ([Content v3 setup](/content-v3/setup)), but this module supports v2 equally — the same `<TableOfContents :toc="page.body.toc" />` works on both.

## Checklist

### 1. Install

```bash
npm install @nuxt/content@^2 nuxt-toc
```

No `better-sqlite3` needed — that is a v3 requirement only.

### 2. Register modules

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],

  // Global defaults (all optional)
  nuxtToc: {
    depth: 2,
    scrollSpy: true,
  },

  compatibilityDate: '2025-01-01',
})
```

Content v2 has **no `content.config.ts`** — do not create one (it would confuse v2).

### 3. Write Markdown

Just put files under `content/`:

```
content/
  index.md               → path "/"
  guide/
    intro.md             → path "/guide/intro"
  blog/
    hello.md             → path "/blog/hello"
```

```md
---
title: Intro
---

## Getting started  <!-- appears in TOC -->
### Requirements
## Installation
```

Only `##` (`h2`) and deeper headings generate TOC entries — see [Writing content](/guide/writing-content).

### 4. Render the TOC

**Pass-in (recommended):**

```vue
<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne()
)
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

`queryContent` is the v2 equivalent of v3’s `queryCollection`. For auto-fetch by path, see [Auto-fetch (v2)](/content-v2/auto-fetch) — the `collection` prop is ignored on v2.

## v2-specific gotchas

- **No `collection` on v2.** `<TableOfContents collection="docs" />` is ignored (`fetch-v2.ts:29`). Use `path` only.
- **Source filtering is narrower in old Content defaults.** A `content/` file not found → check that you did not create `content.config.ts` by mistake (v2 treats it as a plain file, not a config).
- **TOC caps:** some `nuxt.config.ts` templates set `content.markdown.toc.depth`. If too shallow (`1`), nested headings never appear in `body.toc`.
- **You cannot install v2 and v3 together.** Choose one major per app (one `node_modules`).

## Verify

```bash
npx nuxi prepare
npm run dev        # playground v2 demo runs on http://localhost:3001
```

See also: [queryContent](/content-v2/query-content), [Auto-fetch (v2)](/content-v2/auto-fetch), [Playground (v2)](/content-v2/playground), and [Compatibility](/guide/compatibility) for the detection logic (`src/utils/detect-content-major.ts`).
