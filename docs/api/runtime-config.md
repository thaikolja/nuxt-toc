---
title: nuxtToc public runtime config API
description: >-
  Public runtimeConfig.public.nuxtToc fields written by the module at build: collection, depth, scrollSpy, rootMargin, smooth, scrollOffset, and detected contentMajor.
---

# Runtime config

The module writes a **public runtime config** namespace so the `<TableOfContents>` component (and your app) can read the same defaults on server and client.

Built in `src/module.ts:190`, published as:

```ts
nuxt.options.runtimeConfig.public.nuxtToc = {
  collection:   string   // default 'content'  (v3 collection)
  depth:        number   // default 2          (rendered depth)
  scrollSpy:    boolean  // default true
  rootMargin:   string   // default '0px 0px -80% 0px'
  smooth:       boolean  // default false
  scrollOffset: number   // default 0
  contentMajor: 2 | 3 | null  // detected @nuxt/content major, or null
}
```

Type: `NuxtTocPublicRuntimeConfig` (`src/module.ts:73`) and augmentation on `@nuxt/schema` (`src/module.ts:91`) so `useRuntimeConfig().public.nuxtToc` is fully typed after `npx nuxi prepare`.

## Reading it in your app

```ts
const config = useRuntimeConfig()
console.log(config.public.nuxtToc.collection)   // 'content'
console.log(config.public.nuxtToc.contentMajor) // 2 | 3 | null
```

### `contentMajor` — detection result

Set by `detectContentMajor(nuxt.options.rootDir)` once at module `setup()` (`src/module.ts:176`). Values:

- `2` — host has `@nuxt/content@2` installed
- `3` — host has `@nuxt/content@3` installed
- `null` — Content missing or version not 2/3

Used to decide which fetch plugin to register (`fetch-v2` vs `fetch-v3`), and purely informational for you — no app code needs to branch on it if you use pass-in `:toc`.

```ts
// Devtools / debugging helper
if (useRuntimeConfig().public.nuxtToc.contentMajor === null) {
  console.warn('Content not installed — auto-fetch disabled; pass :toc manually')
}
```

## How defaults flow into props

Inside `TableOfContents.vue:212` (`nuxtTocPublic`) the six user-tunable keys are read as fallback when a prop is `undefined` (example: `scrollSpyEnabled` at line 244, `resolvedRootMargin` at line 251, etc.):

| Runtime value | Prop fallback | Normalization point |
|---|---|---|
| `collection` | `props.collection \|\| nuxtToc.collection \|\| 'content'` | `fetch-v3.ts:39` guards empty string again |
| `depth` | `resolveEffectiveDepth(props.depth ?? nuxtToc.depth, isSublistShown)` | `limit-toc-depth.ts:113` |
| `scrollSpy` | `props.scrollSpy ?? nuxtToc.scrollSpy` | `scrollSpy !== false` |
| `rootMargin` | `props.rootMargin \|\| nuxtToc.rootMargin` | observer `options.rootMargin` |
| `smooth` | `props.smooth ?? nuxtToc.smooth` → `!!` | `scroll-to-heading.ts:58` |
| `scrollOffset` | `max(0, floor(props.scrollOffset ?? nuxtToc.scrollOffset))` | `scroll-to-heading.ts:50` |

Passing a prop always wins over the runtime value; runtime value wins over the built-in default. See [Module options](/api/module-options) (how to set the runtime values) and [Props](/api/props) (per-component overrides).

## Tweaking at runtime vs at build

- **Build-time / config-time:** edit `nuxt.config.ts → nuxtToc` — requires restarting dev.
- **Client-side only:** you can still override per-component props dynamically (bind to a ref) — the component watches `observedIdsKey`, `resolvedRootMargin`, `scrollSpyEnabled`, and `hasLinks` and rebuilds the observer on the next `requestAnimationFrame`.

## Log and warning behavior tied to this config

- If Content is installed (`contentMajor != null`) but not registered in `modules`, the module logs `[nuxt-toc] @nuxt/content is installed but not registered…` during setup.
- If `contentMajor == null`, it logs `[nuxt-toc] @nuxt/content v2 or v3 not found. Auto-fetch disabled; pass :toc…`.
- The fetch plugins (`fetch-v2.ts:31`, `fetch-v3.ts:31`) also warn when `path` is empty, and on caught fetch errors — only in `import.meta.dev`.

Next: [Types](/api/types) and [Module options](/api/module-options) for the full set of typed keys.
