# Props

`TableOfContents` accepts the following props.

| Prop                        | Type          | Default                              | Description                                                                                  |
| --------------------------- | ------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `toc`                       | `Toc \| null` | `null`                               | Prefetched TOC (`page.body.toc`). When set, no auto-fetch.                                   |
| `path`                      | `string`      | `''`                                 | Content path for auto-fetch. Defaults to current route path.                                 |
| `collection`                | `string`      | `''`                                 | Content **v3** collection. Falls back to `nuxtToc.collection` or `'content'`. Ignored on v2. |
| `depth`                     | `number`      | module `nuxtToc.depth` (default `2`) | Max link-tree depth: `1` = top-level only, `2` = one nested level, `3+` = deeper.            |
| `isSublistShown`            | `boolean`     | `true`                               | When `false`, forces effective depth to `1` (legacy API).                                    |
| `isTitleShownWithNoContent` | `boolean`     | `false`                              | Still show `title` when there are no links.                                                  |
| `title`                     | `string`      | `'Table of Contents'`                | Heading text.                                                                                |
| `scrollSpy`                 | `boolean`     | module `true`                        | Enable IntersectionObserver active highlighting.                                             |
| `rootMargin`                | `string`      | module value                         | Observer `rootMargin` (sticky header tuning).                                                |
| `smooth`                    | `boolean`     | module `false`                       | Smooth-scroll on TOC link click.                                                             |
| `scrollOffset`              | `number`      | module `0`                           | Pixel offset when scrolling to headings.                                                     |

## Examples

### Depth control

```vue
<!-- Top-level headings only -->
<TableOfContents :toc="page.body?.toc" :depth="1" />

<!-- Default: top + one nested level -->
<TableOfContents :toc="page.body?.toc" :depth="2" />

<!-- Deeper trees when Content TOC includes h4+ -->
<TableOfContents :toc="page.body?.toc" :depth="3" />
```

### Custom title, no nested items

```vue
<TableOfContents :toc="page.body?.toc" title="On this page" :depth="1" />
<!-- or legacy: :is-sublist-shown="false" -->
```

### Auto-fetch a fixed path (v3)

```vue
<TableOfContents path="/docs/intro" collection="docs" title="Contents" />
```

### Empty TOC still shows title

```vue
<TableOfContents :toc="{ links: [] }" title="Outline" :is-title-shown-with-no-content="true" />
```
