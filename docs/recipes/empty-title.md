---
title: Show TOC title when links are empty
description: >-
  Keep the TableOfContents heading visible on pages with no headings using isTitleShownWithNoContent — title-only state vs empty messages on pass-in vs auto-fetch.
---

# Empty title state

When a page has no `##` headings, `@nuxt/content` returns `links: []`. By default `nuxt-toc` renders **nothing** in pass-in mode — no list, no title — because `hasLinks` is false and `showTitleOnly` guards the title-only branch.

Add `isTitleShownWithNoContent` to keep the heading so the sidebar does not look broken.

## Usage

```vue
<TableOfContents
  :toc="page?.body?.toc"
  title="On this page"
  :is-title-shown-with-no-content="true"
/>
```

Rendered (`TableOfContents.vue:7`):

```html
<div class="nuxt-toc">
  <span id="toc-title" role="heading" aria-level="2">On this page</span>
</div>
```

No list is rendered — just the heading, with the same `#toc-title` id and ARIA semantics as the happy path, so global styles still apply (`#toc-title { … }`).

## Pass-in vs auto-fetch behavior

| Mode       | `links: []` + `isTitleShownWithNoContent` is `false`                            | with `true`                                                                                       |
| ---------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Pass-in    | Renders nothing (`v-if="showTitleOnly"` false, `hasLinks` false)                | Renders title only                                                                                |
| Auto-fetch | “No headings found for /path.” (`.nuxt-toc--empty` message, no title-only mode) | Same title-only applies after `pending` — empty-message branch uses the same `showTitleOnly` gate |

So the prop gives a consistent “always show the heading” outcome across both modes.

## When to use it

- A template that always reserves sidebar space for the TOC (the header stays visible even on short pages).
- Pages you _expect_ to have headings later — avoids a layout jolt when headings are added.

## When not to use it

If empty pages should honestly show nothing in that column, leave the prop `false` (the default) and let the grid collapse.

See [Styling](/guide/styling) for the title selector `#toc-title`, and [Props — isTitleShownWithNoContent](/api/props#istitleshownwithnocontent) for the API definition.
