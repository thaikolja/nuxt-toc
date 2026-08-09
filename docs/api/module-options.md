# Module options

Configured under `nuxtToc` in `nuxt.config.ts` (config key is camelCase `nuxtToc`).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collection` | `string` | `'content'` | Default collection for Content v3 auto-fetch |

```ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: {
    collection: 'docs',
  },
})
```

Component prop `collection` overrides this value when auto-fetching.
