---
title: TableOfContents CSS classes and IDs
description: >-
  Public CSS selectors for customizing nuxt-toc appearance: outer wrapper, pending/empty states, list classes, active variants, and per-item ids.
---

# CSS classes and IDs

Public selectors are the theming API — they are stable across minor releases. See [Styling](/guide/styling) for the full tutorial and copy-paste recipes. Two sources define them: `src/runtime/components/TableOfContents.vue:759` (defaults) and `src/runtime/components/TocTree.vue:5`.

## Complete selector map

### Outer wrapper

Every render state uses a `div.nuxt-toc`. Additional state classes are appended:

| Selector | Meaning | Render condition |
|---|---|---|
| `.nuxt-toc` | Root wrapper (always present) | always |
| `.nuxt-toc--pending` | Loading state | `shouldAutoFetch && pending` → “Loading table of contents…” |
| `.nuxt-toc--empty` | Finished with no result | `documentMissing` / `emptyLinks` / `autoFetchFailed` with message + `<code>resolvedPath</code>` |
| `.nuxt-toc--error` | Fetch failed (plugin missing or threw) | `autoFetchFailed` — subsets `.nuxt-toc--empty` |
| `#toc-title` | Title `<span role="heading" aria-level="2">` | present when links exist or `isTitleShownWithNoContent` |
| `#toc-container` | Root `<ul role="list">` | present when `hasLinks` |

### Recursive list (`TocTree.vue`)

| Selector | Element | When it appears |
|---|---|---|
| `.toc-item` | Every `div` wrapping a link | always per link |
| `.toc-topitem` | Top-level items | `root === true` (level 1) |
| `.toc-sublist-item` | Nested items | `root === false` |
| `.toc-sublist` | Nested `<ul>` | `root === false` |
| `.toc-topitem-and-sublist` | `<li>` at depth 1 | `root === true` (useful for group spacing) |
| `.toc-link` | Every `<a href="#id">` | always |
| `.toc-toplink` | Anchors at depth 1 | `root === true` |
| `.toc-sublink` | Anchors at depth > 1 | `root === false` |
| `.active-toc-item` | Active wrapper (observer) | `isActive(id) === true` |
| `.active-toc-topitem` | Active top-level | `root && isActive` |
| `.active-toc-sublist-item` | Active nested | `!root && isActive` |
| `#toc-item-${id}` | Per-link wrapper id | always — unique per heading id |

Combined active state for a top-level link looks like:

```html
<div id="toc-item-installation" class="toc-item toc-topitem active-toc-item active-toc-topitem"
     role="heading" aria-level="2">
  <a href="#installation" class="toc-link toc-toplink" role="link">Installation</a>
</div>
```

## Default minimal CSS (reproduced)

Scoped to `.nuxt-toc` so it does not affect other lists on the page:

```css
.nuxt-toc { color: inherit; }
.nuxt-toc--pending,
.nuxt-toc--empty { opacity: 0.75; font-size: 0.9em; }
.nuxt-toc--empty code { font-size: 0.9em; }
.nuxt-toc .active-toc-item { color: #fef08a; }
.nuxt-toc .toc-sublist-item { padding-left: 1rem; }
.nuxt-toc .toc-sublist .toc-sublist .toc-sublist-item { padding-left: 1.5rem; }
.nuxt-toc a.toc-link { text-decoration: none; color: inherit; }
.nuxt-toc ul, .nuxt-toc ol { list-style: none; padding: 0; margin: 0; }
```

## Common overrides

```css
/* Brand active highlight */
#toc-title { font-weight: 700; margin-bottom: 0.5rem; }
.toc-link:hover { text-decoration: underline; }
.active-toc-item { color: var(--brand, #38bdf8); }

/* Left indicator */
.toc-item { border-left: 2px solid transparent; }
.active-toc-sublist-item { border-left-color: var(--brand); }

/* Hide nesting via prop instead of display:none where possible */
```

Prefer the prop (`:depth="1"`) over hiding nested lists with `display: none` — the component avoids creating those DOM nodes at all and scroll-spy skips them. See [Styling](/guide/styling) and [Recipes — hide nested links](/recipes/hide-nested-links).

::: tip Keep overrides global
The TOC tree is a child subtree. `<style scoped>` without `:deep()` will not reach nested `TocTree` levels. Put your overrides in `app/assets/…` or wrap with `:deep(.toc-link)` in a scoped block.
:::
