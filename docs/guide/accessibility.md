---
title: Accessibility of TableOfContents
description: >-
  ARIA roles, heading levels, keyboard navigation, heading id requirements, and screen-reader tips so nuxt-toc stays usable without a mouse.
---

# Accessibility

`nuxt-toc` aims to be usable with a keyboard, screen reader, and any heading structure that `@nuxt/content` already makes accessible. The component does three small things and relies on your content to do one.

## What the component handles

### 1. Semantic list

`TocTree.vue:7` renders a real list, not a chain of `<div>`s:

```html
<ul id="toc-container" role="list" aria-labelledby="toc-title">
  <li role="listitem">
    <div role="heading" aria-level="2" class="toc-item …">
      <a role="link" href="#installation" class="toc-link">Installation</a>
    </div>
    <ul class="toc-sublist" role="list">
      …nested…
    </ul>
  </li>
</ul>
```

- The outer list carries `id="toc-container"` and is labeled by `#toc-title`.
- Nested lists get `class="toc-sublist"` and no id — only one outer id per page (the single-TOC assumption in `TableOfContents.vue:168`).
- Each item exposes `role="heading"` with `aria-level` computed as `Math.min(6, 2 + level)` (level 1 → `"2"`, level 2 → `"3"` …). This mirrors how `h2` / `h3` appear in the article column.

### 2. Title as a heading

The visible title:

```html
<span id="toc-title" role="heading" aria-level="2">Table of Contents</span>
```

This is the accessible name for the whole nav. Keep it descriptive — “On this page” is fine, but an empty title would leave the list unlabeled. Customize via the `title` prop.

### 3. Standard hash links

Every entry is an `<a href="#{id}" class="toc-link">` with `role="link"`. Because these are native anchors:

- They are focusable and appear in the tab order without extra code.
- Enter/Space follows the link.
- The URL hash updates via `history.replaceState` (or `location.hash` fallback) so the Back button still works.

## What you must ensure (heading IDs)

The TOC links and the headings they point to must share the same `id`. `@nuxt/content` generates these automatically from the heading text:

```md
## Installation → <h2 id="installation">

### System requirements → <h3 id="system-requirements">
```

**If a TOC link has no matching `<h2 id="…">`, clicking does nothing and scroll-spy warns in dev.** Open dev console — `warnMissingHeadingIds` (`TableOfContents.vue:504`) lists the missing IDs.

This usually breaks when a custom prose component overrides `h2` and drops `id`:

```vue
<!-- ❌ Broken: id never reaches the heading -->
<template>
  <h2 class="fancy">{{ text }}</h2>
</template>

<!-- ✅ Correct: forward id -->
<script setup lang="ts">
defineProps<{ id?: string }>()
</script>
<template>
  <h2 :id="id" class="fancy"><slot /></h2>
</template>
```

Rule: any override for `h2` / `h3` / `h4` must bind `:id="id"` (and ideally forward the rest of props/attrs).

## Keyboard behavior

| Key         | Expected                               | Why it works                                                                        |
| ----------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| `Tab`       | Focus moves through TOC links in order | Native `<a href>` — no roving tab index needed                                      |
| `Enter`     | Jump/scroll to the linked heading      | Anchor default, intercepted only when `smooth` or `scrollOffset` is configured      |
| `Shift+Tab` | Move backward through links            | Same native behavior                                                                |
| Back button | Return to previous TOC hash            | `scroll-to-heading.ts:62` uses `replaceState` so history is minimal and predictable |

No custom key traps or roving focus is added — that would break standard browser handling. If you wrap the TOC in a `<nav>` region, you get an additional landmark for free (recommended but not emitted by default to keep markup minimal):

```vue
<nav aria-label="Table of contents">
  <TableOfContents :toc="page?.body?.toc" />
</nav>
```

## Screen-reader tips

- Keep `title` short but meaningful — it is the accessible name (`aria-labelledby`). “On this page: Installation, Usage …” is overkill; “Table of contents” or “On this page” is enough.
- Use a real heading hierarchy in your Markdown: `#` for the page title (once), `##` for main sections, `###` for subsections. The TOC `depth` and the article `h2/h3` should mirror each other.
- If your page has no headings (`links: []`), the component renders nothing in pass-in mode (or just the title with `isTitleShownWithNoContent`). Add that prop if an empty screen reader landmark would be confusing.

## Checklist for ordering fixes

1. **Heading IDs match** — inspect a heading (`<h2 id="installation">`) and its TOC link (`<a href="#installation">`) in DevTools. They must match.
2. **Links are focusable** — `Tab` through the TOC without CSS `pointer-events: none` or `display: contents` hiding the anchor.
3. **Focus ring visible** — check that your global CSS does not remove `:focus` without replacing it. A minimal replacement: `.toc-link:focus { outline: 2px solid currentColor; outline-offset: 2px; }`.
4. **Enough color contrast for `.active-toc-item`** — the default `#fef08a` on a dark sidebar fails WCAG on white backgrounds. Override to your brand palette.
5. **No duplicate IDs on the page** — the component assumes one TOC per page (hence single `#toc-container` / `#toc-title`). Duplicate TOCs would duplicate those IDs — keep one.
6. **Anchor jumps respect header height** — for sticky headers, use `scrollOffset` + `scroll-margin-top` together so focus after a jump leaves the heading visible (and therefore readable).

Next: If a heading is invisible or a click lands under your header, see [Active highlighting — smooth scroll and offset](/guide/active-highlighting#smooth-scroll-and-offset) and [Styling](/guide/styling).
