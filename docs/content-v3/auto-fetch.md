# Auto-fetch (v3)

When `toc` is omitted, the module’s `fetch-v3` plugin runs:

```ts
queryCollection(collection).path(path).first()
```

Ensure:

- Collection exists in `content.config.ts`
- Document path matches Content’s generated `path` (e.g. `content/guide.md` → `/guide`)
- Headings are present so `body.toc.links` is non-empty
