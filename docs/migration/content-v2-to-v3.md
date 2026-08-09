# Migrating your app: Content v2 → v3

1. Upgrade `@nuxt/content` to ^3  
2. Add `content.config.ts` collections  
3. Replace `queryContent` with `queryCollection`  
4. Replace dropped components (`ContentDoc`, etc.) with `ContentRenderer`  
5. Keep `TableOfContents` usage; pass-in path is unchanged  

```diff
- const page = await queryContent(route.path).findOne()
+ const page = await queryCollection('content').path(route.path).first()
```

Auto-fetch will pick `fetch-v3` after the package major is 3.
