# Module options

Configured under `nuxtToc` in `nuxt.config.ts` (config key is camelCase `nuxtToc`).

| Option         | Type      | Default              | Description                                   |
| -------------- | --------- | -------------------- | --------------------------------------------- |
| `collection`   | `string`  | `'content'`          | Default collection for Content v3 auto-fetch  |
| `depth`        | `number`  | `2`                  | Default max nesting depth for TOC links       |
| `scrollSpy`    | `boolean` | `true`               | Default active-section highlighting           |
| `rootMargin`   | `string`  | `'0px 0px -80% 0px'` | Default IntersectionObserver root margin      |
| `smooth`       | `boolean` | `false`              | Default smooth scroll on link click           |
| `scrollOffset` | `number`  | `0`                  | Default scroll offset (px) for sticky headers |

```ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: {
    collection: 'docs',
    depth: 2,
    scrollSpy: true,
    smooth: true,
    scrollOffset: 72,
  },
})
```

Component props override these defaults when set.
