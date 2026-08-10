---
title: Accessibility of TableOfContents
description: >-
  ARIA roles, heading levels, list semantics, and heading id requirements so nuxt-toc stays usable with keyboard navigation and screen readers.
---

# Accessibility

- Title uses `role="heading"` and `aria-level="2"`
- Lists use `role="list"` / `role="listitem"`
- Nested levels use `aria-level` on items
- Links use `role="link"` and standard `href="#id"` anchors

Ensure Content (or your prose components) emit heading `id` attributes that match TOC link ids so skip links work.
