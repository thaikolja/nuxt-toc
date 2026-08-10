# Breaking changes (v3.0.0)

- Peer **Nuxt** `^3.16 \|\| ^4` (primary Nuxt 4 tooling)
- Peer **Content** `^2 \|\| ^3` (not v1)
- Module config key: **`nuxtToc`** (was not this key on older majors)
- Removed CustomQuery-style internal query component
- Dual playground layout under `playgrounds/`
- Development package manager: **npm** (`package-lock.json`)
- Published package depends on `@nuxt/kit` `>=3.16 <5` (Nuxt 4 is the primary host)

## Unchanged theming contract

Public selectors remain stable for upgrades from v2.x:

- `#toc-title`, `#toc-container`
- `.toc-item`, `.toc-link`, `.active-toc-item`, …

See [Styling](/guide/styling) and the root `CHANGELOG.md`.
