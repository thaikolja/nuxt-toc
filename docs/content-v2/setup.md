# Content v2 setup

1. Install `@nuxt/content@^2` and `nuxt-toc`
2. Register both modules
3. Put markdown under `content/`

No `content.config.ts` is required.

```ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
})
```
