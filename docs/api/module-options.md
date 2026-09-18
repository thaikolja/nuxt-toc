---
title: nuxtToc module options reference
description: >-
  Configure defaults under nuxtToc in nuxt.config.ts: collection, depth, scrollSpy, rootMargin, smooth, and scrollOffset for TableOfContents.
---

# Module options

Configure global defaults under **`nuxtToc`** in `nuxt.config.ts`. The config key is camelCase `nuxtToc` (`src/module.ts:155`). Every option is optional and can be overridden per-component as a prop.

Module interface: `src/module.ts:31` (`ModuleOptions`). Normalization: `src/module.ts:109` (`normalizeOptions`).

## Reference

| Option         | Type      | Default              | Normalization                                       | Per-component prop                    |
| -------------- | --------- | -------------------- | --------------------------------------------------- | ------------------------------------- |
| `collection`   | `string`  | `'content'`          | non-empty trimmed string, else `'content'`          | `collection` (v3 only, ignored on v2) |
| `depth`        | `number`  | `2`                  | `max(1, floor(Number(depth)))`, else `2`            | `depth`                               |
| `scrollSpy`    | `boolean` | `true`               | `options.scrollSpy !== false`                       | `scrollSpy`                           |
| `rootMargin`   | `string`  | `'0px 0px -80% 0px'` | non-empty trimmed string, else `'0px 0px -80% 0px'` | `rootMargin`                          |
| `smooth`       | `boolean` | `false`              | `!!options.smooth`                                  | `smooth`                              |
| `scrollOffset` | `number`  | `0`                  | `max(0, floor(Number(offset)))`, else `0`           | `scrollOffset`                        |

These values are merged into `nuxt.schema` defaults (`src/module.ts:162`) and then published at build time to `runtimeConfig.public.nuxtToc` together with `contentMajor: 2 | 3 | null`. See [Runtime config](/api/runtime-config).

## Example

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],

  // Global defaults — override per-component when needed
  nuxtToc: {
    collection: 'docs', // v3 Content collection
    depth: 2, // show h2 + h3 everywhere by default
    scrollSpy: true, // active highlighting on
    rootMargin: '0px 0px -80% 0px', // active zone = top 20% of viewport
    smooth: true, // animate scrolls
    scrollOffset: 72, // header height in px
  },
})
```

Per-component props override the values above — e.g. `<TableOfContents :depth="3" :scroll-spy="false" />` on one page does not affect others.

## Per-option notes

### `collection: string = 'content'`

- Default collection for **Content v3 auto-fetch** (`src/runtime/plugins/fetch-v3.ts:39` → `collection || 'content'`).
- Must match a key in `content.config.ts → collections`. Example with multiple collections:

```ts
// content.config.ts
collections: {
  docs: defineCollection({ type: 'page', source: 'docs/**' }),
  blog: defineCollection({ type: 'page', source: 'blog/**' }),
}
```

Then either set `nuxtToc.collection` globally, or per-component `collection="blog"`.

- On Content v2 this option is stored but ignored — `fetch-v2` discards the second argument.

### `depth: number = 2`

- Max link-tree depth that will be **rendered**. Effective depth per-component is `resolveEffectiveDepth(propDepth ?? moduleDepth, isSublistShown)` (`src/runtime/utils/limit-toc-depth.ts:113`). Legacy `isSublistShown: false` forces `1`.

### `scrollSpy: boolean = true`

- Default for `scrollSpy` prop (`TableOfContents.vue:244` — `prop === undefined ? nuxtToc.scrollSpy !== false : prop`).

### `rootMargin: string = '0px 0px -80% 0px'`

- Default `IntersectionObserver` root margin. See [Active highlighting](/guide/active-highlighting).

### `smooth: boolean = false`

- Default for click scroll. Coerced with `!!`.

### `scrollOffset: number = 0`

- Header height compensation in pixels. See [Active highlighting](/guide/active-highlighting) and `scroll-to-heading.ts:50`.

## TypeScript usage

`nuxtToc` is typed via `declare module '@nuxt/schema' { interface PublicRuntimeConfig }` (`src/module.ts:91`). After `npx nuxi prepare`, IDE autocomplete and type errors on unknown keys work out of the box.

Next: [Props](/api/props) (per-component overrides) and [Runtime config](/api/runtime-config) (what the client actually sees).
