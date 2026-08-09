# AGENTS.md

## Project

`nuxt-toc` is a Nuxt module that provides a `TableOfContents` component for
`@nuxt/content` projects. It renders nested heading links and highlights the
active section with IntersectionObserver.

**Target stack**

- Nuxt 4.x (primary; Nuxt ≥ 3.16 also supported via peer range)
- `@nuxt/content` **v2 or v3** (dual support in one package)
- Vue 3

## Repo layout

- `src/module.ts` — module entry: detects Content major, registers one fetch plugin, component
- `src/utils/detect-content-major.ts` — host `@nuxt/content` major detection
- `src/runtime/plugins/fetch-v2.ts` — auto-fetch via `queryContent` (Content v2 only)
- `src/runtime/plugins/fetch-v3.ts` — auto-fetch via `queryCollection` (Content v3 only)
- `src/runtime/components/TableOfContents.vue` — public UI (uses `$nuxtTocFetch` when needed)
- `src/runtime/types.ts` — shared TOC / plugin types
- `build.config.ts` / `eslint.config.ts` — TypeScript tooling configs
- `playgrounds/content-v3/` — **Nuxt 4 + Content v3** (own `package.json` / `node_modules`)
- `playgrounds/content-v2/` — **Nuxt 4 + Content v2** (own `package.json` / `node_modules`)
- `test/` — e2e against both playgrounds + unit tests for version detection
- `dist/` — build output from `nuxt-module-build` (do not hand-edit)

> Content v2 and v3 cannot share one `node_modules` tree. Each playground installs
> its own dependencies under `playgrounds/*/node_modules`.

## Package manager

Local development uses **Bun** (`packageManager`: `bun@1.3.14`).

```bash
bun install
bun run dev:prepare
bun run dev:v3   # etc.
```

Do not commit `package-lock.json` / `pnpm-lock.yaml`; use `bun.lock`.

## Commands

```bash
bun install
bun run dev:prepare   # stub module + install/prepare both playgrounds
bun run dev           # alias for dev:v3 (port 3000)
bun run dev:v3        # Content v3 playground (port 3000)
bun run dev:v2        # Content v2 playground (port 3001)
bun run test
bun run prepack
bun run lint
```

## Architecture rules

1. Prefer the **pass-in TOC** API: `<TableOfContents :toc="page.body?.toc" />`.
   This works the same on Content v2 and v3.
2. Auto-fetch must **not** statically import both `queryContent` and
   `queryCollection` in one file. Use version-specific plugins only.
3. Module setup detects `@nuxt/content` major from the host app and registers
   exactly one of `fetch-v2` / `fetch-v3`.
4. Collection name defaults to `content` and is configurable via
   `nuxtToc.collection` / prop `collection` (**v3 auto-fetch only**).
5. Keep the module small. Do not reintroduce a general ContentQuery clone.
6. Styling public contract: keep existing class/id names when possible
   (`toc-container`, `active-toc-item`, etc.).
7. IntersectionObserver highlighting is DOM-based; do not couple it to Content
   internals beyond heading `id`s.

## Content consumer checklist

### Content v3 (`playgrounds/content-v3`)

- `@nuxt/content` ^3
- `content.config.ts` with a page collection
- `queryCollection(...).path(...).first()` + `<ContentRenderer>`

### Content v2 (`playgrounds/content-v2`)

- `@nuxt/content` ^2
- `queryContent(path).findOne()` + `<ContentRenderer>` / `<ContentDoc>`
- No `collection` config required for auto-fetch

## Do / Don't

- **Do** verify changes in **both** playgrounds (`dev:v3` and `dev:v2`).
- **Do** run `dev:prepare` after dependency or module entry changes.
- **Do** keep v2 and v3 query APIs isolated in separate plugin files.
- **Don't** hard-import `queryCollection` inside files used on Content v2 apps.
- **Don't** install `@nuxt/content` at the monorepo root (conflicts v2 vs v3).
- **Don't** commit `node_modules` or edit `dist/` by hand.

## Release note

v3.0.0 targets Nuxt 4 and dual Content v2/v3 support. Config key is `nuxtToc`.
