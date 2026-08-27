---
title: Active section highlighting (scroll-spy)
description: >-
  How TableOfContents scroll-spy highlights the heading in view with IntersectionObserver, rootMargin, smooth scroll, scrollOffset, and how to tune it for sticky headers.
---

# Active highlighting

When you scroll a long docs page, the sidebar TOC should tell you where you are — “Installation” lights up when its heading is near the top, then “Usage” takes over. This is called **scroll-spy**, and in `nuxt-toc` it is driven by a browser `IntersectionObserver`.

You do not need to configure anything for the default behavior, but when you have a sticky header you will want to tune two props: `rootMargin` and `scrollOffset`.

## Default behavior (no props)

```vue
<TableOfContents :toc="page?.body?.toc" />
<!-- equivalent to: -->
<TableOfContents :toc="page?.body?.toc" :scroll-spy="true" root-margin="0px 0px -80% 0px" :scroll-offset="0" />
```

What happens on the client (`src/runtime/components/TableOfContents.vue:543`):

1. After `onMounted` + `nextTick`, the component creates one `IntersectionObserver` with `root: null` (viewport), `threshold: 0`, and `rootMargin` from props/module defaults.
2. It walks `displayToc` and observes **only heading IDs that actually appear in the TOC** (via `collectTocIds` → `document.getElementById(id)`). Unrelated page headings are never watched — cheaper and less noisy.
3. It batches `IntersectionObserver` entries through a `requestAnimationFrame` flush (`pendingEntries → flush → activeTocIds Set`). Only when membership changes does Vue re-render — this avoids thrashing.
4. The “active” link(s) receive CSS classes; `lastVisibleHeading` keeps the last intersecting heading so one item stays highlighted even in the gap between sections (see below).

### Which headings are watched?

Not “h2/h3” blindly. The observer watches whatever IDs are in your **TOC tree after depth limiting**. If your Content `searchDepth` includes `h4` and `depth >= 3`, `h4` headings will be watched too. If the TOC is `depth: 1`, only top-level headings are observed.

### Keeping one item always active

`IntersectionObserver` fires both entering and leaving events. Between two headings neither may be intersecting for a frame — the set would briefly be empty and no item would look active. The component avoids this flicker with `lastVisibleHeading`:

```ts
// src/runtime/components/TableOfContents.vue:422
function isActive(id: string) {
  return activeIdSet.value.has(id) || id === lastVisibleHeading.value
}
```

Actionable meaning: style `.active-toc-item` and you will always have at least one highlighted link after the first intersection.

## Tuning for a sticky header

If your page has a fixed header (e.g. 64px tall), the default `0px 0px -80% 0px` may light up the next section too early, and clicking a TOC link may scroll the heading under the header.

Two props solve this — they handle **different phases** of the interaction:

| Prop | When it matters | What it does |
|---|---|---|
| `rootMargin` | While **scrolling** (observer) | Shrinks/expands the viewport zone where a heading counts as “visible”. Default shrinks the bottom 80%, so a heading is active when it is near the **top**. |
| `scrollOffset` | When **clicking** a link (and on initial hash) | Pixels to subtract from the scroll target so the heading lands below the sticky header. Also applied in `applyInitialHash` when you land on `/page#section`. |

**Typical sticky header (64px):**

```vue
<TableOfContents :toc="page?.body?.toc" :scroll-offset="72" root-margin="0px 0px -70% 0px" />
```

And pair it with CSS so native hash links also offset correctly:

```css
/* Makes headings leave room for the sticky header */
.content :deep(h2), .content :deep(h3) {
  scroll-margin-top: 72px;
}
```

See `src/runtime/utils/scroll-to-heading.ts:53` — click handling computes `rect.top + scrollY - offset` and calls `window.scrollTo({ top, behavior })`, then quietly updates the hash with `history.replaceState`.

## Scroll props reference

All three can be set per-component **or** globally under `nuxtToc` in `nuxt.config.ts` — per-component wins.

```ts
// nuxt.config.ts — global defaults
export default defineNuxtConfig({
  nuxtToc: {
    scrollSpy: true,
    rootMargin: '0px 0px -80% 0px',
    smooth: false,
    scrollOffset: 0,
  }
})
```

### `:scroll-spy="false"` — disable highlighting

Turns the observer off entirely (`observeSections` disconnects and clears `activeTocIds`). Useful if you want a static TOC:

```vue
<TableOfContents :toc="page?.body?.toc" :scroll-spy="false" />
```

### `rootMargin` — the “active zone”

String with CSS margin syntax (four values + unit). The default `0px 0px -80% 0px` means *expand top/right/left by 0, shrink bottom by 80%* — so only the top 20% of the viewport counts.

- **Makes active jump earlier:** shrink less (e.g. `-60%`).
- **Makes active jump later:** shrink more (e.g. `-85%`).
- **Sticky header at top:** also offset top, e.g. `-72px 0px -70% 0px` to push the zone below the header.

Watch the key that triggers a rebuild: `` `${observedIdsKey}|${resolvedRootMargin}` `` (`TableOfContents.vue:556`). Changing `rootMargin` alone forces a fresh observer.

### `smooth` and `scrollOffset` — click behavior

Controlled in `TableOfContents.vue:696` and `scroll-to-heading.ts:35`:

```vue
<!-- Smooth animation, 64px header -->
<TableOfContents :toc="page?.body?.toc" smooth :scroll-offset="64" />
```

- If **both** are falsy (`smooth=false` + `scrollOffset=0`), clicks use the browser’s native anchor jump — no interception.
- If **either** is set, `onTocClick` calls `event.preventDefault()` and uses `scrollToHeading(id, { smooth, offset })` so the heading lands exactly where you want.

::: tip Test tuning quickly
Open the `content-v3` playground (`npm run dev:v3` → `http://localhost:3000/props`) — it has a matrix of `scrollSpy`, `rootMargin`, `smooth`, and `scrollOffset` so you can see the effect before touching your own app.
:::

## Lifecycle and rebuilds

Understanding these prevents “why does highlighting lag?” confusion:

- **Initial build:** `onMounted → nextTick → observeSections(true)` → `applyInitialHash()`.
- **Late headings:** `scheduleLateHeadingRetries` re-runs `observeSections(true)` after 50ms/200ms/500ms to catch headings that mount slightly after Content hydration (dev warning listed if an expected ID has no DOM node: `warnMissingHeadingIds`).
- **Reactive rebuild:** `watch([observedIdsKey, resolvedRootMargin, scrollSpyEnabled, hasLinks], () => scheduleObserveSections())` — changing TOC data, swapping pages, or toggling `scrollSpy` rebuilds the observer on the next frame.
- **Cleanup:** `onUnmounted(() => disconnectObserver())` cancels `requestAnimationFrame`, timeouts, and the observer itself — no leaks when navigating between pages.

## Styling the active state

The classes applied per item (see `src/runtime/components/TocTree.vue:24`):

```html
<div class="toc-item toc-topitem active-toc-item active-toc-topitem">…</div>
```

Per-item wrapper also gets `id="toc-item-${id}"` so a single section can be targeted:

```css
/* Color the whole item */
.active-toc-item { color: #4ade80; font-weight: 600; }

/* Only the top-level (h2) highlight */
.active-toc-topitem { border-left: 2px solid currentColor; }

/* Only nested (h3+) highlight */
.active-toc-sublist-item { opacity: 1; }

/* Pinpoint one heading */
#toc-item-custom-section { scroll-margin-top: 80px; }
```

See [Styling](/guide/styling) and [Custom active styles recipe](/recipes/custom-active-styles) for a full selector table.

## When active highlighting does not appear

- `scrollSpy` is `false` (prop or `nuxtToc.scrollSpy` global) — set it to `true`.
- TOC is empty (`links: []`) — no IDs to observe. Check `page.body.toc.links` in Vue devtools.
- Heading elements lack `id` attributes — Content normally adds them, but custom prose components that override `h2` may drop `id`. Restore `:id="id"` in your component.
- Heading IDs differ from TOC link IDs — Content generates one from the heading text; if you override `:id`, keep them in sync. A dev warning lists missing DOM nodes.

Next: [Styling](/guide/styling) shows every stable selector you can theme.
