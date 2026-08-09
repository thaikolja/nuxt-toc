# Migrating from nuxt-toc 2.x

| v2.x                          | v3.0.0                   |
| ----------------------------- | ------------------------ |
| Content v2 only               | Content v2 **or** v3     |
| Internal CustomQuery          | Version-specific plugins |
| Config key loosely `nuxt-toc` | **`nuxtToc`**            |
| Heavy blog playground         | Dual minimal playgrounds |

Update config:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: {
    collection: 'content', // v3
  },
})
```

Prefer `:toc="page.body?.toc"`; auto-fetch still works when Content is installed.
