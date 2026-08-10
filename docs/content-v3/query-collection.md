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
