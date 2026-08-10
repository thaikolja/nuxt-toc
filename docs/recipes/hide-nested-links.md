---
title: Hide nested TOC links (flat outline)
description: >-
  Show only top-level headings in TableOfContents with isSublistShown false or depth 1 for a flatter on-this-page outline.
---

# Hide nested links

```vue
<TableOfContents :toc="page.body?.toc" :is-sublist-shown="false" title="Sections" />
```

Only top-level TOC entries (typically h2) are listed.
