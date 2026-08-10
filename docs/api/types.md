---
title: TOC TypeScript types reference
description: >-
  TypeScript interfaces used by nuxt-toc: Toc, TocLink, and related shapes for pass-in table of contents data from Nuxt Content.
---

# Types

```ts
interface TocLink {
  id: string
  text: string
  depth?: number
  children?: TocLink[]
}

interface Toc {
  links: TocLink[]
}
```

Content documents typically expose `body.toc` matching this shape on both Content v2 and v3.

Runtime injection (auto-fetch):

```ts
// Provided by version-specific plugins
$nuxtTocFetch?: (path: string, collection?: string) => Promise<unknown>
```
