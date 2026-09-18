---
title: First time with Nuxt (for beginners)
description: >-
  Create a Nuxt Content app from zero: install Node, scaffold a project, add your first Markdown file, and understand the folders Nuxt creates.
---

# First time with Nuxt

If you have never used **Nuxt** or **Nuxt Content**, this page is for you. Nuxt is a **Vue 3 framework** — think “a Vue app with file-based routing, server rendering, and a plugin system already wired up.” **Nuxt Content** is a Nuxt module that lets you write pages in **Markdown** and query them like a tiny CMS.

`nuxt-toc` sits on top of Content and renders the clickable “On this page” outline.

## 1. Check prerequisites

Open a terminal (Terminal on macOS, “Command Prompt” or “Windows Terminal” on Windows).

```bash
node -v   # needs >=20.0.0
npm -v    # 10.x is fine
```

- No Node or too old? Install Node 20 LTS from [nodejs.org](https://nodejs.org) (the installer includes npm).
- You do **not** need to learn Vue first — the examples below show the minimal `script setup` blocks you can copy verbatim.

## 2. Create a Nuxt app from scratch

```bash
# Any folder on your machine works
npx nuxi init my-docs --template v3   # or --template v4 for Nuxt 4
cd my-docs
npm install
npm run dev
```

Open the URL the terminal prints (usually `http://localhost:3000`) — you should see a starter Nuxt page.

### What just appeared on disk

```
my-docs/
  nuxt.config.ts     ← app configuration (where modules are registered)
  app.vue            ← root component (often just <NuxtPage />)
  pages/
    index.vue        ← route "/" (create any .vue here → new route)
  content/           ← does not exist yet — you will add it for Content
  public/            ← static assets served at "/"
  package.json       ← dependencies + scripts
```

**Key Nuxt idea: file-based routing.** `pages/about.vue` automatically becomes route `/about`. `pages/guide/index.vue` becomes `/guide`. A catch-all `pages/[...slug].vue` matches every unknown path — exactly what we use for Content-driven pages.

## 3. Add Nuxt Content and nuxt-toc

Stop the dev server (`Ctrl+C`) and install the two Nuxt modules:

```bash
# Content v3 for a new app
npm install @nuxt/content@^3 nuxt-toc

# (Optional) verify both landed in package.json → dependencies
```

Register them in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],

  // Optional: global defaults for every TOC on the site
  nuxtToc: {
    collection: 'content',
    depth: 2,
    scrollSpy: true,
  },

  // Content v3 needs no extra file yet — it will be created next
  compatibilityDate: '2025-01-01',
})
```

::: tip Why two modules?

- `@nuxt/content` parses `.md` files and exposes `queryCollection()` / `queryContent()` and `page.body.toc`.
- `nuxt-toc` adds `<TableOfContents>` and the auto-fetch plugin. It cannot work without Content.
  :::

## 4. Configure Content (v3) and write Markdown

### For Content v3

Create `content.config.ts` at the project root:

```ts
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page', // page collections have body.toc automatically
      source: '**/*.md', // grab every .md under content/
    }),
  },
})
```

Now write your first Markdown page:

```md
<!-- content/index.md -->

---

title: Hello
---

# Hello, Nuxt! <!-- h1 — not in the TOC, only h2/h3 are -->

## Installation <!-- h2 — will appear as a top-level TOC entry -->

## Usage <!-- h2 -->

### Rendering <!-- h3 — nested under “Usage” when depth >= 2 -->

### Custom styles
```

```md
<!-- content/guide/intro.md -->

---

title: Intro guide
---

# Intro guide

## Prerequisites

## Install

## Next steps
```

- One `#` (`h1`) per file — this is the page title, not listed in the TOC.
- `##` (`h2`) and `###` (`h3`) become the TOC links you see in `<TableOfContents>`. Add `#title`? It is ignored.
- The file path maps to a URL: `content/guide/intro.md` → `/guide/intro`. The key `content` in `content.config.ts` matches the first argument of `queryCollection('content')`.

### For Content v2

Skip `content.config.ts` entirely — just put files under `content/` as above. The same headings become `body.toc.links`.

## 5. Create a page that renders Content + TOC

A docs app usually has **one catch-all route** that works for any Markdown file:

```vue
<!-- pages/[...slug].vue  — handles /, /guide/intro, /blog/hello … -->
<script setup lang="ts">
const route = useRoute()

// For Content v3:
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)

// For Content v2 use this instead:
// const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
</script>

<template>
  <!-- When Content has a page at this path, render it -->
  <div v-if="page" class="layout">
    <main><ContentRenderer :value="page" /></main>
    <aside><TableOfContents :toc="page.body?.toc" title="On this page" /></aside>
  </div>

  <!-- Graceful 404 when nothing matches -->
  <div v-else class="not-found">
    <p>
      No content found at <code>{{ route.path }}</code>
    </p>
    <NuxtLink to="/">Go home</NuxtLink>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16rem;
  gap: 2rem;
}
aside {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
}
</style>
```

`useAsyncData` caches by `route.path` and re-fetches when you navigate. `ContentRenderer` renders the parsed Markdown body, headings included. The TOC reuses the same `page.body.toc` so no second query happens.

Restart dev (`npm run dev`) and open `/` or `/guide/intro` — the TOC should list the `##` headings and highlight the one near the top as you scroll.

## 6. Verify the wiring

- Visit `/guide/intro` — do you see `<h2 id="prerequisites">`, `<h2 id="install">` in DevTools → Elements? Content auto-generates those `id` attributes.
- Does the TOC contain `<a href="#prerequisites">`? It should be a nested `<ul id="toc-container">`. See [Styling](/guide/styling) for the exact selectors.
- No TOC? Check [Writing Content](/guide/writing-content) — likely the Markdown has only `h1` or `toc.depth` is `0`.

## 7. Where to go from here

- [Installation](/guide/installation) — denser setup reference for existing apps
- [Quick start](/guide/quick-start) — pass-in vs auto-fetch in two snippets
- [Writing Content](/guide/writing-content) — how headings become `page.body.toc.links`
- [Compatibility](/guide/compatibility) — Nuxt 3.16 vs 4, Content v2 vs v3 peers

No custom build tools or global Vue knowledge is needed — everything above is the minimal working docs site.
