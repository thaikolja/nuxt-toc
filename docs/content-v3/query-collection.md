---
title: queryCollection with TableOfContents
description: >-
  Pass TOC data from queryCollection into TableOfContents for Content v3. Recommended pass-in pattern with useAsyncData and ContentRenderer.
---

# queryCollection

```ts
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
```

Then:

```vue
<ContentRenderer v-if="page" :value="page" />
<TableOfContents :toc="page?.body?.toc" />
```

TOC links live at `page.body.toc.links` with optional nested `children`.
