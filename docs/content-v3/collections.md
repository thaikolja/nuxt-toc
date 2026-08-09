# Collections

Content v3 stores documents in **named collections**. Auto-fetch needs the correct name:

```vue
<TableOfContents path="/guide" collection="docs" />
```

Or set the default:

```ts
export default defineNuxtConfig({
  nuxtToc: { collection: 'docs' },
})
```

The pass-in `:toc` path never needs the collection name — you already fetched the page.
