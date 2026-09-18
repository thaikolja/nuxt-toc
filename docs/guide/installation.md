---
title: Install nuxt-toc in a Nuxt project
description: >-
  Step-by-step install for beginners and existing Nuxt apps: add nuxt-toc and @nuxt/content, register modules, configure collections, and fix common setup errors.
---

# Installation

This page works for both **brand-new Nuxt apps** and **existing projects**. If you have never created a Nuxt app, skim [First time with Nuxt](/guide/first-time-nuxt) first — it explains what each file does.

## Requirements

- **Node.js 20+** — check with `node -v` in your terminal. [Download from nodejs.org](https://nodejs.org) if needed.
- **Nuxt `^3.16.0` or `^4.0.0`** — Nuxt 4 is the primary target. The module's kit peer is `@nuxt/kit >=3.16 <5`.
- **`@nuxt/content` `^2` or `^3`** — pick one major per app. You cannot install v2 and v3 in the same `node_modules`.

> **npm only.** This repository uses `npm@10.9.2` and commits `package-lock.json`. Do not add a `pnpm-lock.yaml` or `bun.lockb` — CI will fail.

## 1. Install the module

Pick **one** of the two commands below.

**Recommended — `nuxi module add` (adds the line to `nuxt.config.ts` for you):**

```bash
npx nuxi module add nuxt-toc
```

**Or manual npm:**

```bash
npm install nuxt-toc
```

## 2. Install `@nuxt/content`

You need Content even if you “just want the TOC” — TOC data comes from Content.

```bash
# For new apps: Content v3 (recommended)
npm install @nuxt/content@^3

# Or for existing apps still on Content v2
npm install @nuxt/content@^2
```

> **Only one major at a time.** `npm install @nuxt/content@^2 @nuxt/content@^3` will not work — they conflict. This module handles the dual-support for you; you just pick the major your app should use.

## 3. Register both modules

Open `nuxt.config.ts`. If `nuxi module add` already edited it, just verify it looks like below.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // Order does not matter, but both must be listed
  modules: ['nuxt-toc', '@nuxt/content'],

  // Global defaults for every TableOfContents (all optional)
  nuxtToc: {
    collection: 'content', // Content v3 only — ignored on v2
    depth: 2, // show h2 + h3 by default
    scrollSpy: true, // highlight active section
    rootMargin: '0px 0px -80% 0px', // when a heading becomes “active”
    smooth: false, // smooth scroll on click
    scrollOffset: 0, // e.g. 64 for a 64px sticky header
  },
})
```

These defaults map 1:1 to component props — any prop you pass to `<TableOfContents>` overrides the value here. See [Module options](/api/module-options).

**TypeScript users:** `nuxtToc` is fully typed via augmentation in `src/module.ts:91` — your IDE should autocomplete it after you run `npx nuxi prepare`.

## 4. Configure Content

### Content v3

Content v3 needs `content.config.ts` at the project root to define **collections** (named buckets of Markdown).

```ts
// content.config.ts — minimal collection for TOC
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // name “content” matches nuxtToc.collection above
    content: defineCollection({
      type: 'page', // “page” gives you body.toc automatically
      source: '**/*.md', // every .md under content/
    }),
  },
})
```

`content/guide.md` will be available at path `/guide`. `content/index.md` at `/`. The key `content` becomes the argument to `queryCollection('content')`. See [Content v3 setup](/content-v3/setup) and [Collections](/content-v3/collections).

::: info SQLite note
Some hosts and Node setups need `better-sqlite3` (Content v3’s embedded DB). If `npm run dev` warns about it, run `npm install better-sqlite3` — see Content v3 docs for native-build prerequisites.
:::

### Content v2

No `content.config.ts` needed. Just put Markdown files in `content/`:

```
content/
  index.md
  guide/
    intro.md   →  path /guide/intro
```

See [Content v2 setup](/content-v2/setup).

## 5. Add a test page and verify

Create `pages/[...slug].vue` if you do not already have a catch-all Content route:

```vue
<script setup lang="ts">
const route = useRoute()
// For v3:
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
// For v2, use: () => queryContent(route.path).findOne()
</script>

<template>
  <main>
    <ContentRenderer v-if="page" :value="page" />
    <p v-else>Page not found.</p>
    <!-- pass-in TOC (recommended): -->
    <TableOfContents :toc="page?.body?.toc" />
  </main>
</template>
```

Start the dev server and open `http://localhost:3000` (or `:3001` for the v2 playground):

```bash
npx nuxi prepare   # generates types
npm run dev        # or npm run dev -- --port 3000
```

You should see a TOC on any page that has at least two `##` headings. Pages with no headings show nothing by default — add `is-title-shown-with-no-content` to keep the title visible. See [Empty title recipe](/recipes/empty-title).

## When something looks wrong

| Symptom                                    | Likely cause                                                     | Fix                                                                                                             |
| ------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `TableOfContents` unknown component        | Module not in `modules` or `nuxi prepare` not run                | Add `'nuxt-toc'` to `nuxt.config.ts`, then `npx nuxi prepare` and restart dev                                   |
| TOC always empty                           | Headings have no IDs, or Markdown has only `# h1`                | Use `## h2` / `### h3` — Content only includes those in `body.toc`. Check `page.body.toc.links` in Vue devtools |
| Auto-fetch warns `"$nuxtTocFetch missing"` | Content not installed or not registered                          | `npm ls @nuxt/content` should print v2 or v3; ensure `modules: ['@nuxt/content']`                               |
| `collection "xyz" not found` (v3)          | `nuxtToc.collection` does not match a key in `content.config.ts` | Make them match, or pass `<TableOfContents collection="xyz" />` explicitly                                      |
| App cannot install both Content v2 and v3  | Expected — they conflict                                         | Pick one major per app. The module supports both majors, but one app uses one                                   |

More help: [Writing content](/guide/writing-content), [Pass-in vs auto-fetch](/guide/pass-in-vs-auto-fetch), and [Troubleshooting](/guide/troubleshooting).

## Next step

→ [Quick start](/guide/quick-start) — full copy-paste layouts with both Content majors, sticky sidebar included.
