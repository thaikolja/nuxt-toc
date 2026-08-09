# Props

`TableOfContents` accepts the following props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toc` | `Toc \| null` | `null` | Prefetched TOC (`page.body.toc`). When set, no auto-fetch. |
| `path` | `string` | `''` | Content path for auto-fetch. Defaults to current route path. |
| `collection` | `string` | `''` | Content **v3** collection. Falls back to `nuxtToc.collection` or `'content'`. Ignored on v2. |
| `isSublistShown` | `boolean` | `true` | Show nested children under top-level links. |
| `isTitleShownWithNoContent` | `boolean` | `false` | Still show `title` when there are no links. |
| `title` | `string` | `'Table of Contents'` | Heading text. |

## Examples

### Custom title, no nested items

```vue
<TableOfContents
  :toc="page.body?.toc"
  title="On this page"
  :is-sublist-shown="false"
/>
```

### Auto-fetch a fixed path (v3)

```vue
<TableOfContents
  path="/docs/intro"
  collection="docs"
  title="Contents"
/>
```

### Empty TOC still shows title

```vue
<TableOfContents
  :toc="{ links: [] }"
  title="Outline"
  :is-title-shown-with-no-content="true"
/>
```
