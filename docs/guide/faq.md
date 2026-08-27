---
title: Frequently asked questions
description: >-
  Common questions about nuxt-toc for Nuxt beginners: TOC empty, v2 vs v3, multiple TOCs, styling, collections, SEO and performance.
---

# FAQ

Short answers to questions that come up often when using `nuxt-toc` for the first time.

## Getting started

### I just want a TOC on my page — what is the minimal code?

Pass-in is three lines in your page:

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

Replace `queryCollection` with `queryContent(route.path).findOne()` for Content v2. See [Quick start](/guide/quick-start).

### I have never used Nuxt — where do I create `content.config.ts`?

At the project root, next to `nuxt.config.ts`. See [First time with Nuxt](/guide/first-time-nuxt).

### Does the TOC affect SEO?

Headings are already in `<ContentRenderer>` as real `<h2><h3>…` elements — search engines see them. The TOC is a list of `<a href="#id">` anchors that reference those headings, plus a small `<span id="toc-title">`. That structure is SEO-neutral to beneficial (outline links help crawlers and accessibility). No custom meta is needed.

## Data modes

### Should I use pass-in or auto-fetch?

Pass-in (`:toc`) when your page already fetches the document — one query, fully SSR, no timing surprises.  
Auto-fetch (`path` / `collection`) when a layout or wrapper needs a TOC without knowing the page’s query.  
See [Pass-in vs auto-fetch](/guide/pass-in-vs-auto-fetch).

### Why does `path` do nothing when I also pass `:toc`?

`path` is only read when `:toc` is `null/undefined` (`shouldAutoFetch = props.toc == null`). If you supply a TOC object, `path` is intentionally ignored to avoid a second query.

### Can I fetch a TOC for a path the user is not currently on?

Yes — auto-fetch handles that:

```vue
<TableOfContents path="/docs/intro" collection="docs" />
```

It still observes only the headings of *that* document, not the current page’s headings, so make sure the headings for `/docs/intro` are actually rendered somewhere on the screen if you expect scroll-spy to light up.

### I manually call `queryContent` but the TOC is still empty — why?

Usually `content.build.markdown.toc` is off, or `searchDepth` is too shallow. The playgrounds set:

```ts
content: { build: { markdown: { toc: { depth: 4, searchDepth: 4 } } } }
```

See [Writing content](/guide/writing-content).

## Content v2 vs v3

### How do I know whether I have Content v2 or v3?

```
npm ls @nuxt/content
```

The module prints the detected major at build time (`contentMajor` in `runtimeConfig.public.nuxtToc`). On mismatch you will see `Content v2/v3 fetch failed…` warnings. See [Compatibility](/guide/compatibility).

### Can I mix v2 and v3 in one app?

No — `@nuxt/content` v2 and v3 cannot coexist in one `node_modules`. Pick one major per app; the module adapts to whichever you installed.

### Does the `collection` prop work on v2?

No — it is ignored (`src/runtime/plugins/fetch-v2.ts:29`). Use `path` only on v2. See [Content v2 playground](/content-v2/playground).

## Props and appearance

### How do I control how deep the TOC goes?

The rendered depth (`:depth`) trims the already-extracted tree. Start broad in Content and limit per-component:

```ts
// Extract h2–h4, display h2–h3 by default, allow h4 on one page
nuxtToc: { depth: 2 }
<TableOfContents :toc="page?.body?.toc" :depth="3" />
```
See [Writing content — two depths](/guide/writing-content#two-depth-concepts).

### Legacy `isSublistShown` — should I use it?

Only if you already use it (v2.x carryover). It forces effective depth to `1` (`resolveEffectiveDepth` in `limit-toc-depth.ts`). For new code use `:depth="1"`.

### How do I style the active item?

```css
.active-toc-item { color: #38bdf8; font-weight: 600; }
.active-toc-topitem { border-left: 2px solid currentColor; }
```

See [Styling](/guide/styling) and [Custom active styles](/recipes/custom-active-styles).

### How do I make the TOC sticky?

Wrap it in a container with `position: sticky`. Copy-paste recipe: [Sticky sidebar](/recipes/sticky-sidebar).

### Why are clicks not smooth?

Add `smooth`:

```vue
<TableOfContents :toc="page?.body?.toc" smooth />
```

And if you have a header, pair it with `:scroll-offset="64"`. See [Active highlighting](/guide/active-highlighting).

## Layout and multiple TOCs

### Can I have two TOCs on one page?

Not recommended. IDs `#toc-title` / `#toc-container` and `#toc-item-${id}` are global and assumed unique (`src/module` TODO: one TOC per page). Two instances would duplicate those IDs. Use one TOC per page.

### Can the TOC show the left-nav of all pages instead of the current page’s headings?

No — TOC is per-document outline, not a site-wide navigation. Build your left-nav from a separate Content query (e.g. `queryCollection('content').all()`) or a hand-maintained list.

### My headings are inside an overflowing container — will scroll-spy work?

The observer uses `root: null` (viewport) (`TableOfContents.vue:582`). Headings inside an `overflow: auto` div with its own scroll are not observed by default. Keep article scroll on the window for the built-in spy, or disable it (`:scroll-spy="false"`) and wire a custom observer.

## Performance and safety

### Is scroll-spy expensive?

No — the observer watches only TOC heading IDs (not every `h2` on the page), uses a single `threshold: 0`, batches through `requestAnimationFrame`, and only re-renders when the active set changes. See [How it works](/guide/how-it-works).

### Does the module import both Content majors?

No. It detects the major once at `setup()` and registers exactly one of `fetch-v2` / `fetch-v3`. This keeps bundle size honest.

### What if Content is not installed at all?

Auto-fetch is disabled (warning in dev). Pass-in still works if you hand in a plain `{ links: [...] }` object.

Next: stuck despite the FAQ? See [Troubleshooting](/guide/troubleshooting).
