---
title: Quick start with TableOfContents
description: >-
  Render a table of contents in minutes: pass page.body.toc from queryCollection (v3) or queryContent (v2), or use auto-fetch with the path prop.
---

# Quick start

## Content v3

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
</script>

<template>
  <div class="layout">
    <main>
      <ContentRenderer v-if="page" :value="page" />
    </main>
    <aside>
      <TableOfContents :toc="page?.body?.toc" />
    </aside>
  </div>
</template>
```

## Content v2

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
</script>

<template>
  <div class="layout">
    <main>
      <ContentRenderer v-if="page" :value="page" />
    </main>
    <aside>
      <TableOfContents :toc="page?.body?.toc" />
    </aside>
  </div>
</template>
```

## Auto-fetch (optional)

```vue
<template>
  <!-- Uses current route path -->
  <TableOfContents />

  <!-- Or a fixed document path -->
  <TableOfContents path="/docs/intro" title="On this page" />
</template>
```

Prefer pass-in `:toc` when the page already loads the document to avoid a second query.
