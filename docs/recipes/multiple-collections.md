---
title: TOC with multiple Content collections
description: >-
  Point TableOfContents at blog vs docs Content v3 collections using the collection prop for multi-source documentation sites.
---

# Multiple collections (v3)

```ts
// content.config.ts
export default defineContentConfig({
  collections: {
    blog: defineCollection({ type: 'page', source: 'blog/**' }),
    docs: defineCollection({ type: 'page', source: 'docs/**' }),
  },
})
```

```vue
<!-- Blog post TOC -->
<TableOfContents path="/blog/hello" collection="blog" />

<!-- Docs TOC -->
<TableOfContents path="/docs/intro" collection="docs" />
```

Or pass-in after fetching from the right collection.
