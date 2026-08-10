# Accessibility

- Title uses `role="heading"` and `aria-level="2"`
- Lists use `role="list"` / `role="listitem"`
- Nested levels use `aria-level` on items
- Links use `role="link"` and standard `href="#id"` anchors

Ensure Content (or your prose components) emit heading `id` attributes that match TOC link ids so skip links work.
