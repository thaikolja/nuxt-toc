---
title: Active section highlighting (scroll-spy)
description: >-
  How nuxt-toc scroll-spy works with IntersectionObserver, rootMargin, active CSS classes, rebuilds on TOC changes, and cleanup on unmount.
---

# Active highlighting

On the client, `TableOfContents` creates an `IntersectionObserver` for `h2[id]` and `h3[id]` elements.

## Behavior

- Root margin: `0px 0px -80% 0px` (heading near the top of the viewport)
- Active items receive `active-toc-item` (plus top/sub variants)
- `lastVisibleHeading` keeps the last intersecting id as a fallback
- Observation is rebuilt when TOC data or path changes
- Cleanup runs on unmount via `onUnmounted` in `setup`

## Scoping

When TOC link ids are known, only those heading ids are observed (avoids tracking unrelated page chrome headings).

## Styling

```css
.active-toc-item {
  color: #4ade80;
  font-weight: 600;
}
```
