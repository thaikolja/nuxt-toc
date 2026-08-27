---
title: Hide nested TOC links (flat outline)
description: >-
  Show only top-level headings in TableOfContents with depth 1 or legacy isSublistShown false — with when to pick each and how depth trimming works.
---

# Hide nested links

A flat outline (`##` only, no `###` indentation) is common for landing pages or short guides. Two props achieve this — prefer the modern `depth`.

## Recommended: `depth`

```vue
<TableOfContents :toc="page?.body?.toc" :depth="1" />
```

Under the hood `limitTocDepth(toc, 1)` (`src/runtime/utils/limit-toc-depth.ts:24`) shallow-copies and drops every `children` array before rendering. `TocTree` never sees nested links and scroll-spy never observes nested heading IDs.

```vue
<!-- With a custom title -->
<TableOfContents :toc="page?.body?.toc" title="Sections" :depth="1" />

<!-- Global default for the whole site -->
<!-- nuxt.config.ts → nuxtToc: { depth: 1 } -->
```

## Legacy: `isSublistShown`

```vue
<TableOfContents :toc="page?.body?.toc" :is-sublist-shown="false" />
```

Same result: `resolveEffectiveDepth(depth, isSublistShown)` (`limit-toc-depth.ts:113`) forces effective depth to `1` when `isSublistShown === false`. Keep this only if you upgrade from v2.x where you already use it — new code should use `depth`.

## Visually vs structurally hiding

- **Structurally (this recipe):** nested links are removed from the list (`v-if="link.children?.length && level < maxDepth"` in `TocTree.vue:46`). They are not in the DOM — screen readers also skip them, and scroll-spy saves work.
- **Visually (CSS):** leaving them in the DOM but setting `display: none` wastes observer work and is less accessible. Prefer the prop.

Next: [Styling](/guide/styling) for the `.toc-sublist*` selectors and [Props — depth](/api/props#depth) for the full depth API.
