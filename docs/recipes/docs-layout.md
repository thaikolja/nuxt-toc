---
title: Full documentation page layout recipe
description: >-
  Assemble header, page nav, ContentRenderer, and sticky TableOfContents into a typical documentation shell for Nuxt Content sites.
---

# Docs layout

Typical documentation shell:

1. Header with brand (`logo.png`)
2. Left: navigation of pages
3. Center: `ContentRenderer`
4. Right: `TableOfContents` sticky

Pass-in `:toc` from the same `useAsyncData` that loads the page so SSR includes both body and outline.
