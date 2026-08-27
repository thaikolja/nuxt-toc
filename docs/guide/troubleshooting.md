---
title: Troubleshooting nuxt-toc
description: >-
  Fixes for empty TOC, unknown component, auto-fetch errors, wrong collection, scroll-spy not highlighting, and heading id mismatches.
---

# Troubleshooting

Quick fixes in the order you are most likely to need them.

## TOC renders nothing

**1. Check that your Markdown has `##` headings.**
Only `##` (depth 2) and deeper become TOC links — `#` (`h1`) is ignored. A file with only `# Title` and paragraphs has `links: []` by definition. See [Writing Content](/guide/writing-content).

**2. Log `page.body.toc` in the browser.**
Add temporarily in your page:

```vue
<pre>{{ JSON.stringify(page?.body?.toc, null, 2) }}</pre>
```

- `null` → Content did not return a `toc` at all. Check that Content is configured (`content.build.markdown.toc` not `false`) and that `source` includes the file.
- `{ links: [] }` → no headings were extracted. Add `##` headings.
- Object with `links` → data is there; ensure you pass `:toc="page.body?.toc"` (not `:toc="page"`). The component tolerates `page`, but explicit is clearer and avoids `normalizeToc` guessing.

**3. Wrong path queried? (auto-fetch)**
`<TableOfContents />` defaults to `route.path`. If your page renders `/docs/intro` inside layout route `/`, the auto-fetch path is wrong — pass it explicitly:

```vue
<TableOfContents path="/docs/intro" />
```

Compare Content’s generated `.path` (`content/guide.md` → `/guide`, not `/content/guide`) with what you pass.

**4. Wrong collection? (Content v3)**
```
[v3] Content fetch failed for collection "docs"
```
`nuxtToc.collection` (or the `collection` prop) must equal a key in `content.config.ts`:

```ts
// content.config.ts
collections: { docs: defineCollection({ type: 'page', source: 'docs/**' }) }
// nuxt.config.ts
nuxtToc: { collection: 'docs' }  // must match
```

**5. No Content installed at all?**
```
[nuxt-toc] @nuxt/content v2 or v3 not found. Auto-fetch disabled
```
Install one major: `npm install @nuxt/content@^3` (or `^2`) and list it in `modules`. Pass-in `:toc="{ links: [...] }"` works without Content, but auto-fetch requires it.

## “Unknown component: TableOfContents”

- Add `'nuxt-toc'` to `modules` in `nuxt.config.ts`.
- Run `npx nuxi prepare` and restart dev. Nuxt generates component type declarations there.
- If you added the module inside a **local layer** that is not auto-registered, make sure the layer’s `nuxt.config.ts` also includes the module or extend it correctly.

## Auto-fetch states and their meaning

When `:toc` is omitted the component shows one of these (never in pass-in mode):

| Message | Cause |
|---|---|
| `Loading table of contents…` | Query still pending (`.nuxt-toc--pending`). Normal briefly; if stuck, Content query is hanging. |
| `Could not load table of contents for /path.` | Plugin missing or threw (`autoFetchFailed`). Check dev console warning — missing `$nuxtTocFetch` or file not found. |
| `No content found for /path.` | Content returned `null` — path or collection wrong. |
| `No headings found for /path.` | Document exists but has no extractable headings. Add `##`. |

## Always loud error in dev

**`warnMissingHeadingIds`: `[nuxt-toc] TOC links have no matching heading elements`**
A `links[i].id` has no `<h2 id="…">` in the DOM. Happens when:

- A prose component overrides `h2` and drops `id`. Forward it: `<h2 :id="id"><slot /></h2>`.
- An `id` was manually changed (`## Foo {#bar}` vs `{ id: 'foo' }` in TOC). Keep them in sync.

## Scroll-spy does not highlight

Check in order:

1. `scrollSpy` prop or `nuxtToc.scrollSpy` in `nuxt.config.ts` is not `false`.
2. TOC actually has links (empty TOC → nothing to observe).
3. Heading elements exist in the DOM with matching IDs (see warning above).
4. The page has a `height` > viewport so scrolling is possible — short pages never intersect outside the initial zone.
5. A global `* { overflow: hidden }` on a parent can break IntersectionObserver — keep the root scroll on `window` (default config uses `root: null`).

## Clicks jump under the sticky header

Use `scrollOffset` (click math) **and** `scroll-margin-top` (native hash) together:

```vue
<TableOfContents :toc="page?.body?.toc" :scroll-offset="64" smooth />
```

```css
.content :deep(h2), .content :deep(h3) { scroll-margin-top: 64px; }
```

`scrollOffset` is `Math.max(0, floor(value))` — non-finite values become `0`. See [Active highlighting](/guide/active-highlighting).

## TypeScript errors: “Property nuxtToc does not exist”

Run `npx nuxi prepare`. The module augments `PublicRuntimeConfig` via `src/module.ts:91` (`declare module '@nuxt/schema'`), which requires generated types.

## Still stuck?

- Open the minimal reproductions: `npm run dev:v3` → `http://localhost:3000` and `npm run dev:v2` → `http://localhost:3001` (see [Playgrounds](/contributing/playgrounds)). Compare their file layout with your app.
- Search existing issues on GitHub: `https://github.com/thaikolja/nuxt-toc/issues`.
- Open Vue devtools → component `<TableOfContents>` → inspect `displayToc`, `activeTocIds`, `resolvedPath/resolvedCollection`.
