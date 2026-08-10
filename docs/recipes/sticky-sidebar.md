---
title: Sticky TOC sidebar layout recipe
description: >-
  Build a documentation layout with a sticky TableOfContents sidebar beside ContentRenderer using pass-in :toc for SSR-friendly outlines.
---

# Sticky sidebar

```vue
<template>
  <div class="page">
    <article><ContentRenderer v-if="page" :value="page" /></article>
    <aside class="toc">
      <TableOfContents :toc="page?.body?.toc" />
    </aside>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16rem;
  gap: 2rem;
}
.toc {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
}
</style>
```
