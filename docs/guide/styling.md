---
title: Style TableOfContents with CSS hooks
description: >-
  Stable CSS IDs and class names for theming TableOfContents — toc-title, toc-container, toc-link, active-toc-item, and how the default minimal styles work.
---

# Styling contract

`nuxt-toc` deliberately ships with **minimal default styles** — a list reset, a soft active color, and a small indent for nested lists. This keeps the component unopinionated so it blends into docs built with Tailwind, UnoCSS, vanilla CSS, or a design system.

Theming is done by targeting **stable selectors** that are guaranteed not to change in patch/minor releases. Two file locations define them: `TableOfContents.vue:759` and `TocTree.vue:5`.

## Public ID / class reference

### IDs (one per page — the component assumes a single TOC)

| Selector | Element | File |
|---|---|---|
| `#toc-title` | Title `<span role="heading">` | `TableOfContents.vue:169` |
| `#toc-container` | Root `<ul role="list">` | `TocTree.vue:8` |
| `#toc-item-${id}` | Per-link wrapper `div.toc-item` | `TocTree.vue:22` — useful to highlight a single entry |

### Wrapper / state classes

| Class | Meaning |
|---|---|
| `.nuxt-toc` | Outer wrapper present in every render state |
| `.nuxt-toc--pending` | Auto-fetch still in flight (“Loading…”) |
| `.nuxt-toc--empty` | Finished with no links / missing doc |
| `.nuxt-toc--error` | Auto-fetch threw or `$nuxtTocFetch` missing |

### List & item classes (recursive `TocTree`)

| Selector | Meaning |
|---|---|
| `.toc-item` | Every item wrapper (`div`) |
| `.toc-topitem` | Top-level only (`level === 1`) |
| `.toc-sublist-item` | Nested items (`level > 1`) |
| `.toc-sublist` | Any `<ul>` that is not the root |
| `.toc-topitem-and-sublist` | `<li>` at depth 1 (useful for group spacing) |
| `.toc-link` | Every anchor (`<a href="#id">`) |
| `.toc-toplink` | Anchors at depth 1 |
| `.toc-sublink` | Anchors in nested lists |
| `.active-toc-item` | Item whose heading is currently active |
| `.active-toc-topitem` | Active at depth 1 |
| `.active-toc-sublist-item` | Active in a nested list |

Combined states look like:

```html
<div id="toc-item-installation" class="toc-item toc-topitem active-toc-item active-toc-topitem">
  <a href="#installation" class="toc-link toc-toplink">Installation</a>
</div>
```

## Default minimal CSS (`TableOfContents.vue:759`)

If you want to replicate or reset it:

```css
/* Wrapper inherits surrounding color/font */
.nuxt-toc { color: inherit; }

/* Loading / empty are a bit faded */
.nuxt-toc--pending,
.nuxt-toc--empty { opacity: 0.75; font-size: 0.9em; }
.nuxt-toc--empty code { font-size: 0.9em; }

/* Active item (override to your brand color) */
.nuxt-toc .active-toc-item { color: #fef08a; } /* pale yellow */

/* Nesting indent — one level 1rem, deeper 1.5rem */
.nuxt-toc .toc-sublist-item { padding-left: 1rem; }
.nuxt-toc .toc-sublist .toc-sublist .toc-sublist-item { padding-left: 1.5rem; }

/* TOC links inherit color; no underline by default */
.nuxt-toc a.toc-link { text-decoration: none; color: inherit; }

/* List reset scoped to the TOC */
.nuxt-toc ul, .nuxt-toc ol { list-style: none; padding: 0; margin: 0; }
```

::: tip Global vs scoped
Keep your overrides **global** (or use `:deep()` inside `<style scoped>`). The TOC component is a child subtree — scoped styles in a parent without `:deep()` will not reach `.toc-link`.
:::

## Common recipes

### Brand color + weight for active item

```css
/* app/assets/main.css or layout style block */
.active-toc-item {
  color: var(--brand, #38bdf8);
  font-weight: 600;
}
```

### Left border indicator

```css
.toc-item { border-left: 2px solid transparent; padding-left: 0.75rem; }
.active-toc-item { border-left-color: var(--brand, #0ea5e9); }
```

### Sticky sidebar box (from both playgrounds)

```css
.page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16rem;
  gap: 2rem;
  align-items: start;
}
.toc {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: 1rem;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  background: #111827;
  color: #e2e8f0;
  font-size: 0.9rem;
}
@media (max-width: 900px) {
  .page { grid-template-columns: 1fr; }
  .toc  { position: static; order: -1; }
}
```

### Headings that respect a fixed header

```css
/* Keeps clicked headings from sliding under a 72px header */
.content :deep(h2), .content :deep(h3) {
  scroll-margin-top: 72px;
}
```
Pair with `<TableOfContents :scroll-offset="72" smooth />` — the prop handles the scroll math, CSS handles native hash jumps and reloads.

### Hide nested lists entirely

Rather than CSS `display:none`, prefer the prop — it trims the tree before rendering:

```vue
<TableOfContents :toc="page?.body?.toc" :depth="1" />
<!-- or legacy: :is-sublist-shown="false" -->
```

### Target a single heading

```css
/* e.g. emphasize the “Getting started” entry */
#toc-item-getting-started { font-weight: 700; }
#toc-item-getting-started.active-toc-item { color: #f59e0b; }
```

## ARIA and structure

The list tree (`TocTree.vue:7`):

```html
<ul id="toc-container" role="list" aria-labelledby="toc-title">
  <li role="listitem">
    <div role="heading" aria-level="2" class="toc-item …"><a role="link" href="#id">…</a></div>
    <ul class="toc-sublist" role="list">…nested…</ul>
  </li>
</ul>
```

`aria-level` is `Math.min(6, 2 + level)` (level 1 → 2, level 2 → 3 …), matching heading levels in a typical docs page. See [Accessibility](/guide/accessibility).

## Checklist for custom themes

- [ ] Override `.active-toc-item` color/weight — default `#fef08a` is intentional but visible.
- [ ] Increase indent or add a subtle `border-left` on `.toc-sublist-item` if you show depth `3`.
- [ ] Test both light and dark schemes — `.nuxt-toc` uses `color: inherit`.
- [ ] Verify `:scroll-offset` + `scroll-margin-top` still align headings when you change header height.
- [ ] Keep selectors global or `:deep()` — scoped styles without it miss nested levels.

Next: [Accessibility](/guide/accessibility) covers heading IDs, keyboard navigation, and screen-reader semantics.
