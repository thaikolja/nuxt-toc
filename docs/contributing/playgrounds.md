# Playgrounds

| Path | Stack | Port | Command |
|------|-------|------|---------|
| `playgrounds/content-v3` | Nuxt 4 + Content 3 | 3000 | `bun run dev:v3` |
| `playgrounds/content-v2` | Nuxt 4 + Content 2 | 3001 | `bun run dev:v2` |

Each app has its own `package.json` / `node_modules`.

Shared demo routes:

- `/` — pass-in `:toc`
- `/auto-fetch` — auto-fetch
- `/props` — title, sublist, empty title, path, collection (v3)
