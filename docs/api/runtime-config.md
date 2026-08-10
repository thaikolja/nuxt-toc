---
title: nuxtToc public runtime config API
description: >-
  Public runtimeConfig.nuxtToc fields set by the module, including defaults and detected contentMajor for Content v2 or v3 debugging.
---

# Runtime config

The module writes public runtime config:

```ts
runtimeConfig.public.nuxtToc = {
  collection: 'content', // from module options
  contentMajor: 2 | 3 | null,
}
```

`contentMajor` is detected at build/setup from the host’s installed `@nuxt/content` package. It is informational for debugging; fetch plugins are registered once based on the same detection.
