# AGENTS.md

## Project

`nuxt-toc` is a Nuxt module that provides a `TableOfContents` component for
`@nuxt/content` projects. It renders nested heading links and highlights the
active section with IntersectionObserver.

**Target stack**

- Nuxt 4.x (primary; Nuxt ≥ 3.16 also listed in peer range)
- `@nuxt/content` **v2 or v3** (dual support in one package)
- Vue 3
- Brand asset: root **`logo.png`** (also `playgrounds/*/public/logo.png`, `docs/public/logo.png`)

## Repo layout

- `src/module.ts` — detects Content major, registers one fetch plugin, component
- `src/utils/detect-content-major.ts` — host `@nuxt/content` major detection
- `src/runtime/plugins/fetch-v2.ts` — auto-fetch via `queryContent` (v2)
- `src/runtime/plugins/fetch-v3.ts` — auto-fetch via `queryCollection` (v3)
- `src/runtime/components/TableOfContents.vue` — public UI + props + observer
- `src/runtime/utils/normalize-toc.ts` — TOC shape normalization
- `src/runtime/types.ts` — TOC / `$nuxtTocFetch` types
- `playgrounds/content-v3/` — Nuxt 4 + Content v3 (`/`, `/auto-fetch`, `/props`)
- `playgrounds/content-v2/` — Nuxt 4 + Content v2 (same routes)
- `docs/` — VitePress developer documentation (GitHub Pages)
- `test/` — unit + e2e against both playgrounds
- `dist/` — `nuxt-module-build` output (do not hand-edit)

> Content v2 and v3 cannot share one `node_modules` tree. Each playground installs
> its own dependencies under `playgrounds/*/node_modules`.

## Package manager

Local development uses **Bun** (`packageManager`: `bun@1.3.14`).

```bash
bun install
bun run dev:prepare
bun run dev:v3
bun run dev:v2
bun run docs:dev
bun run test
bun run lint
bun run check   # lint + format:check + test
```

Do not commit `package-lock.json` / `pnpm-lock.yaml`; use `bun.lock`.

## Commands

```bash
bun install
bun run dev:prepare   # stub module + install/prepare both playgrounds
bun run dev           # alias for dev:v3 (port 3000)
bun run dev:v3        # Content v3 playground
bun run dev:v2        # Content v2 playground (port 3001)
bun run docs:dev      # VitePress
bun run docs:build
bun run test
bun run prepack
bun run lint
```

## Component props (must keep working)

| Prop                        | Default               | Notes                                   |
| --------------------------- | --------------------- | --------------------------------------- |
| `toc`                       | `null`                | Pass-in; skips auto-fetch               |
| `path`                      | `''`                  | Auto-fetch path (else route path)       |
| `collection`                | `''`                  | v3 only; else module option / `content` |
| `depth`                     | module default `2`    | Max link-tree depth (`1` = top only)    |
| `isSublistShown`            | `true`                | When false, forces depth `1` (legacy)   |
| `isTitleShownWithNoContent` | `false`               | Show title when links empty             |
| `title`                     | `'Table of Contents'` | Heading text                            |
| `scrollSpy`                 | module `true`         | IntersectionObserver highlighting       |
| `rootMargin`                | module default        | Observer root margin                    |
| `smooth`                    | module `false`        | Smooth scroll on click                  |
| `scrollOffset`              | module `0`            | Sticky header offset (px)               |

Module options: `collection`, `depth`, `scrollSpy`, `rootMargin`, `smooth`, `scrollOffset`.

Depth logic: `src/runtime/utils/limit-toc-depth.ts`. Scroll helpers: `scroll-to-heading.ts`. UI: `TocTree.vue`.

Verify on **both** playgrounds via `/props` and `/settings` after changes.

## Architecture rules

1. Prefer **pass-in** API: `<TableOfContents :toc="page.body?.toc" />`.
2. Auto-fetch must not statically import both `queryContent` and `queryCollection`.
3. Detect Content major once; register exactly one of `fetch-v2` / `fetch-v3`.
4. Keep CSS class/id contract (`toc-container`, `active-toc-item`, etc.).
5. IntersectionObserver: register `onUnmounted` in setup; rebuild when TOC/path changes; use reactive arrays for active ids.
6. Do not expand playgrounds into full blogs unless requested.
7. Docs live in `docs/`; deploy via `.github/workflows/docs.yml` (GitHub Pages).

## Content consumer checklist

### Content v3

- `@nuxt/content` ^3 + `content.config.ts`
- `queryCollection` + `ContentRenderer`
- Optional `collection` prop / `nuxtToc.collection`

### Content v2

- `@nuxt/content` ^2
- `queryContent` + `ContentRenderer` / `ContentDoc`
- `collection` ignored

## Do / Don't

- **Do** verify `dev:v3`, `dev:v2`, and `/props` on both.
- **Do** run `dev:prepare` after module or dependency changes.
- **Do** keep `logo.png` in sync under playgrounds and `docs/public`.
- **Don't** hard-import `queryCollection` in code paths used on Content v2.
- **Don't** install both Content majors at the monorepo root.
- **Don't** commit `node_modules` or hand-edit `dist/`.

## Release note

v3.0.0: Nuxt 4, dual Content v2/v3, `nuxtToc` config key, Bun, dual playgrounds, VitePress docs.
