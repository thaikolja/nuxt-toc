# Styling contract

Public IDs and classes (stable for theming):

| Selector | Meaning |
|----------|---------|
| `#toc-title` | Title element |
| `#toc-container` | Root list |
| `.toc-item` | Any item |
| `.toc-topitem` | Top-level item |
| `.toc-sublist` | Nested list |
| `.toc-sublist-item` | Nested item |
| `.toc-link` / `.toc-toplink` / `.toc-sublink` | Anchors |
| `.active-toc-item` | Active item |
| `.active-toc-topitem` / `.active-toc-sublist-item` | Active variants |
| `#toc-item-${id}` | Per-item wrapper id |

Default styles are minimal (list reset, active color, nested indent). Override in your app CSS.
