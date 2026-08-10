---
title: Show TOC title when links are empty
description: >-
  Keep a Table of Contents heading visible when a page has no headings using isTitleShownWithNoContent on TableOfContents.
---

# Empty title state

When a page has no h2/h3 headings, Content may produce empty `links`.

```vue
<TableOfContents
  :toc="page.body?.toc"
  title="On this page"
  :is-title-shown-with-no-content="true"
/>
```

Without the flag, nothing is rendered for an empty TOC when using pass-in mode.
