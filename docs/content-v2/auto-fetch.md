---
title: Auto-fetch table of contents (Content v2)
description: >-
  How the fetch-v2 plugin uses queryContent(path).findOne() when :toc is omitted, and when to set an explicit path prop.
---

# Auto-fetch (v2)

The `fetch-v2` plugin runs:

```ts
queryContent(path).findOne()
```

Use `path` when the current route is not the document path (for example a layout route that always shows TOC for `/docs/intro`).
