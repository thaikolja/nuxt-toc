# Runtime config

The module writes public runtime config:

```ts
runtimeConfig.public.nuxtToc = {
  collection: 'content', // from module options
  contentMajor: 2 | 3 | null,
}
```

`contentMajor` is detected at build/setup from the host’s installed `@nuxt/content` package. It is informational for debugging; fetch plugins are registered once based on the same detection.
