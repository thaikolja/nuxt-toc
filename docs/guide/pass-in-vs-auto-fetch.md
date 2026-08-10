---
title: Pass-in TOC vs auto-fetch modes
description: >-
  Choose pass-in :toc (recommended) or auto-fetch by path. Compare performance, SSR behavior, and when path and collection props apply in nuxt-toc.
---

# Pass-in vs auto-fetch

## Pass-in (recommended)

```vue
<TableOfContents :toc="page?.body?.toc" />
```

- No extra Content query
- Works the same on v2 and v3
- `path` / `collection` are ignored for loading when `toc` is set

## Auto-fetch

```vue
<TableOfContents />
<!-- or -->
<TableOfContents path="/guide/intro" collection="docs" />
```

| Prop         | Role                                                           |
| ------------ | -------------------------------------------------------------- |
| `path`       | Document path (default: current route)                         |
| `collection` | Content **v3** collection (default: module option / `content`) |

If Content is not installed or the document has no TOC links, the component shows an empty/loading state (or title-only when `isTitleShownWithNoContent` is true).
