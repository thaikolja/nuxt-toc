# queryContent

```ts
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne(),
)
```

```vue
<ContentRenderer v-if="page" :value="page" />
<TableOfContents :toc="page?.body?.toc" />
```

`collection` prop is ignored on Content v2.
