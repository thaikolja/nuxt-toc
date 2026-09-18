---
title: Customize active TOC link styles
description: >-
  Style the highlighted section in nuxt-toc with .active-toc-item, variants, left border indicators, per-item ids, and dark/light theme tips.
---

# Custom active styles

The TOC highlights the link whose heading is nearest the top (`isActive(id)` in `TableOfContents.vue:422`). Override the default pale-yellow highlight by styling the wrapper or the anchor.

## Where the class lives

`TocTree.vue:22` applies the classes to the wrapper, not the `<a>`:

```html
<div class="toc-item toc-topitem active-toc-item active-toc-topitem" id="toc-item-installation">
  <a href="#installation" class="toc-link toc-toplink">Installation</a>
</div>
```

So both `.active-toc-item` and `.active-toc-item .toc-link` selectors work — pick the scope you prefer.

## Simple: brand color + weight

```css
/* Global CSS or app/assets/main.css */
.active-toc-item {
  color: #4ade80;
  font-weight: 600;
}
.toc-link:hover {
  text-decoration: underline;
}
```

## Left border indicator

More visible on long sidebars:

```css
.toc-item {
  border-left: 2px solid transparent;
  padding-left: 0.75rem;
}
.active-toc-item {
  border-left-color: var(--brand, #0ea5e9);
}
```

As seen in `playgrounds/content-v3/pages/index.vue`, bump indent for nested items too:

```css
.toc-sublist-item {
  padding-left: 1rem;
}
.toc-sublist .toc-sublist .toc-sublist-item {
  padding-left: 1.5rem;
}
```

## Differentiate top vs nested items

```css
.active-toc-topitem {
  color: #38bdf8;
}
.active-toc-sublist-item {
  color: #a5b4fc;
  opacity: 1;
}
```

Available because `TocTree.vue:26` adds the level-specific variants alongside `.active-toc-item`.

## Target one heading only

Every wrapper has `id="toc-item-${id}"`:

```css
#toc-item-getting-started {
  font-weight: 700;
}
#toc-item-api-reference.active-toc-item {
  color: #f59e0b;
}
```

## Dark vs light themes

`.nuxt-toc` inherits `color: inherit` by default (`TableOfContents.vue:761`). Keep the pair clear:

```css
.nuxt-toc {
  color: inherit;
}
.dark .active-toc-item {
  color: #fef08a;
} /* original default */
.light .active-toc-item {
  color: #0ea5e9;
}
```

See [Styling](/guide/styling) for the full selector table and [Active highlighting](/guide/active-highlighting) for how the class is decided.

::: tip Keep it global
The nested `TocTree` levels are child components — `<style scoped>` without `:deep()` will miss them. Put overrides in global CSS or write `:deep(.active-toc-item)` inside a scoped block.
:::
