---
title: TableOfContents CSS classes and IDs
description: >-
  Public CSS selectors for customizing nuxt-toc appearance, including title, container, link, and active-state class hooks for your theme.
---

# CSS classes and IDs

See [Styling contract](/guide/styling) for the full table.

Quick overrides:

```css
#toc-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.toc-link:hover {
  text-decoration: underline;
}

.active-toc-item {
  color: var(--brand, #38bdf8);
}
```
