# Auto-fetch (v2)

The `fetch-v2` plugin runs:

```ts
queryContent(path).findOne()
```

Use `path` when the current route is not the document path (for example a layout route that always shows TOC for `/docs/intro`).
