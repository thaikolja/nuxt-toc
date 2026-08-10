---
title: queryContent with TableOfContents
description: >-
  Use queryContent and page.body.toc to pass a prefetched table of contents into TableOfContents on Content v2 projects.
---

# queryContent

```ts
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
```

```vue
<ContentRenderer v-if="page" :value="page" />
<TableOfContents :toc="page?.body?.toc" />
```

`collection` prop is ignored on Content v2.
