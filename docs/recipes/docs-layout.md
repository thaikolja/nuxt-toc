---
title: Full documentation page layout recipe
description: >-
  Assemble header, left page nav, centered ContentRenderer, and sticky TableOfContents into a typical docs shell — with pass-in :toc and responsive collapse.
---

# Docs layout

This recipe assembles a typical **header + left nav + centered article + right TOC** shell for a Nuxt Content docs site. It uses pass-in `:toc` so SSR includes both article and outline in one Content fetch.

## Wiring overview

```
┌─────────────── header (sticky) ───────────────┐
│  logo.png + title + search                    │
├─ left nav ─┬──── article (ContentRenderer) ───┬─ TOC ──┤
│  /intro    │                                  │        │
│  /install  │  <h1>{{ page.title }}</h1>       │ <Table │
│  /api/props│  <ContentRenderer :value="page"> │ Of     │
│  …         │  <h2 id="…">…                   │ Contents│
└────────────┴──────────────────────────────────┴────────┘
```

**Left nav** is not provided by `nuxt-toc` — build it from a Content query or a hand-written list. The TOC is only the _per-page outline_ (right column).

## Full page (`pages/[...slug].vue`)

```vue
<script setup lang="ts">
const route = useRoute()

// Pass-in: reuse the same fetch for ContentRenderer + TOC
// On v2 replace with: queryContent(route.path).findOne()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)

// Left-nav list — one query for all docs (cached by list key)
const { data: nav } = await useAsyncData(
  'nav',
  () => queryCollection('content').all(), // or queryCollectionNavigation in Content's helper
)
</script>

<template>
  <header class="header">
    <img src="/logo.png" alt="my docs logo" width="120" />
  </header>

  <div v-if="page" class="shell">
    <!-- Left: site navigation -->
    <nav class="nav" aria-label="Primary">
      <NuxtLink v-for="item in nav" :key="item.path" :to="item.path">{{ item.title }}</NuxtLink>
    </nav>

    <!-- Center: article -->
    <main class="main">
      <h1 class="h1">{{ page.title }}</h1>
      <ContentRenderer :value="page" />
    </main>

    <!-- Right: TOC -->
    <aside class="toc" aria-label="Table of contents">
      <TableOfContents :toc="page.body?.toc" title="On this page" :scroll-offset="72" smooth />
    </aside>
  </div>

  <div v-else class="not-found">
    Page not found at <code>{{ route.path }}</code>
  </div>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
}

.shell {
  display: grid;
  grid-template-columns: 14rem minmax(0, 1fr) 14rem;
  gap: 2rem;
  align-items: start;
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.main :deep(h2),
.main :deep(h3) {
  scroll-margin-top: 5rem;
} /* 72px header */
.toc {
  position: sticky;
  top: 5rem;
  max-height: calc(100vh - 6rem);
  overflow: auto;
  font-size: 0.875rem;
}

@media (max-width: 1100px) {
  .shell {
    grid-template-columns: 14rem minmax(0, 1fr);
  }
  .toc {
    display: none;
  }
}
@media (max-width: 700px) {
  .shell {
    grid-template-columns: 1fr;
  }
  .nav {
    display: none;
  }
}
</style>
```

## Notes

- **SSR:** `useAsyncData` fetches `page` on the server; the TOC renders in the initial HTML. Scroll-spy (IntersectionObserver) only activates on the client after mount — no SSR mismatch.
- **Reused query:** pass-in means no second Content fetch. With auto-fetch (`<TableOfContents path="/docs/intro" />` inside the same page), a second `useAsyncData` (`nuxt-toc-${path}`) would fire for the same document.
- **Fixed header:** `top: 5rem` on the sticky aside plus `scroll-margin-top` on headings plus `:scroll-offset="72"` and `smooth` keep clicks aligned. See [Active highlighting](/guide/active-highlighting).
- **A11y landmarks:** the `nav` (left), `main`, and `aside` are real landmarks; the TOC internal `role="list"` / title `role="heading"` stays accessible. Wrap TOC in `<aside aria-label="Table of contents">` when you add it to a layout region — the module does not emit a `<nav>` itself.
- **Bundle impact:** The docs layout adds only `limit-toc-depth`, `normalize-toc`, `scroll-to-heading`, `TableOfContents`, and `TocTree` to the client chunk — plus whatever Content collects. No extra router or animation libs are needed.

See also: [Sticky sidebar](/recipes/sticky-sidebar) for the minimal two-column variant, and [Custom active styles](/recipes/custom-active-styles) for `.active-toc-item` theming.
