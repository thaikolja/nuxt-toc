---
title: Contributor playgrounds for Content v2/v3
description: >-
  Use dual content-v2 and content-v3 playgrounds to verify TableOfContents behavior across Content majors during development.
---

# Playgrounds

| Path                     | Stack              | Port | Command          |
| ------------------------ | ------------------ | ---- | ---------------- |
| `playgrounds/content-v3` | Nuxt 4 + Content 3 | 3000 | `npm run dev:v3` |
| `playgrounds/content-v2` | Nuxt 4 + Content 2 | 3001 | `npm run dev:v2` |

Each app has its own `package.json` / `node_modules`.

Shared demo routes:

- `/` — pass-in `:toc`
- `/auto-fetch` — auto-fetch
- `/props` — title, sublist, empty title, path, collection (v3)
