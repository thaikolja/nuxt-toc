# Changelog

## v3.0.0

### ⚠️ Breaking Changes

- Target **Nuxt 4** (peer: `nuxt` `^3.16.0 || ^4.0.0`; primary host Nuxt 4)
- Module config key is now **`nuxtToc`** with option `collection` (default `'content'`)
- Removed internal `CustomQuery` helper; auto-fetch uses version-specific plugins (`fetch-v2` / `fetch-v3`)
- Single heavy blog playground replaced by **dual** minimal apps under `playgrounds/`
- Development package manager standardized on **Bun** (`bun.lock`)

### 🚀 Enhancements

- **Dual support** for `@nuxt/content` **v2 and v3** (peer: `^2 || ^3`)
- Auto-detects Content major from host `node_modules` and registers one fetch plugin
- `TableOfContents` accepts prefetched `page.body.toc` on both majors
- Props: `toc`, `path`, `collection`, `depth`, `isSublistShown`, `isTitleShownWithNoContent`, `title`
- **`depth`**: controls how deep nested TOC link trees are shown (module option + prop)
- **`scrollSpy`**, **`rootMargin`**, **`smooth`**, **`scrollOffset`**: scroll-spy and click-scroll controls
- Empty-state UX: loading message, missing-path message, optional title-only when empty
- Performance: observe only TOC heading ids, rAF-batched intersection updates, skip rebuild when unchanged
- IntersectionObserver rebuilds when TOC/path changes; reliable unmount cleanup
- Dual playgrounds: Content v3 (`:3000`) and Content v2 (`:3001`) with `/`, `/auto-fetch`, `/props`, `/settings`

- VitePress developer docs (`docs/`) with GitHub Pages workflow
- Branding via root **`logo.png`** (playgrounds + docs)

### 📖 Documentation

- `AGENTS.md` for maintainers and coding agents
- VitePress site: guide, API, Content v2/v3, recipes, migration, contributing
- README / README_zh updated for dual Content and Bun

### 🏡 Chore

- TypeScript tooling configs (`build.config.ts`, `eslint.config.ts`)
- CI on Bun; docs deploy workflow (`.github/workflows/docs.yml`)

## v2.7.2

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.7.1...v2.7.2)

### 🏡 Chore

- Clean unused code ([9aa9419](https://github.com/hanyujie2002/nuxt-toc/commit/9aa9419))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.7.1

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.7.0...v2.7.1)

### 📖 Documentation

- Updated README ([fdeccc1](https://github.com/hanyujie2002/nuxt-toc/commit/fdeccc1))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.7.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.6.7...v2.7.0)

### 🚀 Enhancements

- Implemented support for toc prop ([c68ca3b](https://github.com/hanyujie2002/nuxt-toc/commit/c68ca3b))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.6.7

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.6.6...v2.6.7)

### 🩹 Fixes

- Typo mistake ([8cdc9eb](https://github.com/hanyujie2002/nuxt-toc/commit/8cdc9eb))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.6.6

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.6.5...v2.6.6)

### 📖 Documentation

- Simplified an example ([1e4ba00](https://github.com/hanyujie2002/nuxt-toc/commit/1e4ba00))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.6.5

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.6.4...v2.6.5)

### 📖 Documentation

- Fixed an example ([70d2795](https://github.com/hanyujie2002/nuxt-toc/commit/70d2795))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.6.4

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.6.3...v2.6.4)

### 📖 Documentation

- Update notes on default styles ([e4c45a9](https://github.com/hanyujie2002/nuxt-toc/commit/e4c45a9))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.6.3

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.6.2...v2.6.3)

### 📖 Documentation

- Fixed an error in docs ([dee0c00](https://github.com/hanyujie2002/nuxt-toc/commit/dee0c00))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.6.2

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.6.1...v2.6.2)

### 📖 Documentation

- Added features info ([2495c2e](https://github.com/hanyujie2002/nuxt-toc/commit/2495c2e))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.6.1

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.6.0...v2.6.1)

### 🚀 Enhancements

- Added aria-level for toc sublist items ([7263c38](https://github.com/hanyujie2002/nuxt-toc/commit/7263c38))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.6.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.5.3...v2.6.0)

### 🚀 Enhancements

- Implemented aria support ([dffa643](https://github.com/hanyujie2002/nuxt-toc/commit/dffa643))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.5.3

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.5.2...v2.5.3)

### 📖 Documentation

- Updated styles in an example ([6f14230](https://github.com/hanyujie2002/nuxt-toc/commit/6f14230))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.5.2

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.5.1...v2.5.2)

### 📖 Documentation

- Remove info of deprecated classes ([1a0da31](https://github.com/hanyujie2002/nuxt-toc/commit/1a0da31))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.5.1

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.5.0...v2.5.1)

### 💅 Refactors

- Simplified the code ([5d5622d](https://github.com/hanyujie2002/nuxt-toc/commit/5d5622d))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.5.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.9...v2.5.0)

### 🚀 Enhancements

- Unstyled links and lists ([2e2a2da](https://github.com/hanyujie2002/nuxt-toc/commit/2e2a2da))

### 📖 Documentation

- Fixed two examples ([26b24f3](https://github.com/hanyujie2002/nuxt-toc/commit/26b24f3))

### 🏡 Chore

- Minified js codes ([ea37a41](https://github.com/hanyujie2002/nuxt-toc/commit/ea37a41))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.9

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.8...v2.4.9)

### 🏡 Chore

- Added new dependencies ([1460c3a](https://github.com/hanyujie2002/nuxt-toc/commit/1460c3a))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.8

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.7...v2.4.8)

### 💅 Refactors

- Use npm instead of pnpm ([c26cec4](https://github.com/hanyujie2002/nuxt-toc/commit/c26cec4))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.7

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.6...v2.4.7)

### 🏡 Chore

- Added @nuxt/content dependency ([5761e1a](https://github.com/hanyujie2002/nuxt-toc/commit/5761e1a))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.6

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.5...v2.4.6)

### 📖 Documentation

- Added licence info in readme ([bada191](https://github.com/hanyujie2002/nuxt-toc/commit/bada191))

### 🏡 Chore

- **release:** V2.4.6 ([6b47dc5](https://github.com/hanyujie2002/nuxt-toc/commit/6b47dc5))
- **release:** V2.4.6 ([3169c77](https://github.com/hanyujie2002/nuxt-toc/commit/3169c77))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.6

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.6...v2.4.6)

## v2.4.6

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.5...v2.4.6)

### 📖 Documentation

- Added licence info in readme ([bada191](https://github.com/hanyujie2002/nuxt-toc/commit/bada191))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.5

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.4...v2.4.5)

### 📖 Documentation

- Added author and keywords info ([bb6a9ca](https://github.com/hanyujie2002/nuxt-toc/commit/bb6a9ca))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.4

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.3...v2.4.4)

### 📖 Documentation

- Fixed a translation ([4323bcd](https://github.com/hanyujie2002/nuxt-toc/commit/4323bcd))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.3

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.2...v2.4.3)

### 📖 Documentation

- Fix a link ([f22baa1](https://github.com/hanyujie2002/nuxt-toc/commit/f22baa1))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.2

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.1...v2.4.2)

### 📖 Documentation

- Added Chinese translation of readme ([a2eff96](https://github.com/hanyujie2002/nuxt-toc/commit/a2eff96))
- Translated an English word ([52f977f](https://github.com/hanyujie2002/nuxt-toc/commit/52f977f))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.1

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.4.0...v2.4.1)

### 📖 Documentation

- Update readme with info of new prop and a new example
  ([e126cb9](https://github.com/hanyujie2002/nuxt-toc/commit/e126cb9))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.4.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.3.0...v2.4.0)

### 🩹 Fixes

- Resolved title being rendered with no content in toc
  ([8ca38b1](https://github.com/hanyujie2002/nuxt-toc/commit/8ca38b1))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.3.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.2.1...v2.3.0)

### 🚀 Enhancements

- Implemented is-title-shown-with-no-content prop ([6621df2](https://github.com/hanyujie2002/nuxt-toc/commit/6621df2))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.2.1

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.2.0...v2.2.1)

### 📖 Documentation

- Added two examples ([f9d10dd](https://github.com/hanyujie2002/nuxt-toc/commit/f9d10dd))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.2.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.1.0...v2.2.0)

### 🏡 Chore

- Update case of isSublistShown to align ([66e1895](https://github.com/hanyujie2002/nuxt-toc/commit/66e1895))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.1.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.8...v2.1.0)

### 🚀 Enhancements

- Removed nested mode and simplified the code ([325ad4c](https://github.com/hanyujie2002/nuxt-toc/commit/325ad4c))
- Simplified the code ([b2989d4](https://github.com/hanyujie2002/nuxt-toc/commit/b2989d4))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.8

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.7...v2.0.8)

### 🏡 Chore

- Correct class names ([e1f2d90](https://github.com/hanyujie2002/nuxt-toc/commit/e1f2d90))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.7

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.6...v2.0.7)

### 🏡 Chore

- Aligh the naming of classes ([665354b](https://github.com/hanyujie2002/nuxt-toc/commit/665354b))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.6

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.5...v2.0.6)

### 📖 Documentation

- Removed useless info ([5798e05](https://github.com/hanyujie2002/nuxt-toc/commit/5798e05))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.5

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.4...v2.0.5)

### 📖 Documentation

- Add props info in readme ([364ed30](https://github.com/hanyujie2002/nuxt-toc/commit/364ed30))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.4

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.3...v2.0.4)

### 📖 Documentation

- Seted the size of logo ([feb687b](https://github.com/hanyujie2002/nuxt-toc/commit/feb687b))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.3

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.2...v2.0.3)

### 📖 Documentation

- Added logo ([e52baa2](https://github.com/hanyujie2002/nuxt-toc/commit/e52baa2))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.2

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.1...v2.0.2)

### 📖 Documentation

- Added a logo and centered the images ([2fc1ff9](https://github.com/hanyujie2002/nuxt-toc/commit/2fc1ff9))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.1

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v2.0.0...v2.0.1)

### 🏡 Chore

- Linted code ([e602750](https://github.com/hanyujie2002/nuxt-toc/commit/e602750))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v2.0.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.6.0...v2.0.0)

### 🚀 Enhancements

- Implemented is-sublist-nested prop and renamed show-sub-list to is-sub-list-shown
  ([cd5f867](https://github.com/hanyujie2002/nuxt-toc/commit/cd5f867))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.6.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.5.0...v1.6.0)

### 🚀 Enhancements

- Implement toc title ([bd7d975](https://github.com/hanyujie2002/nuxt-toc/commit/bd7d975))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.5.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.4.0...v1.5.0)

### 🚀 Enhancements

- Implemented showSubList prop ([f2b3f64](https://github.com/hanyujie2002/nuxt-toc/commit/f2b3f64))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.4.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.3.0...v1.4.0)

### 🚀 Enhancements

- Implement default margin left for toc subitem ([ce99a4d](https://github.com/hanyujie2002/nuxt-toc/commit/ce99a4d))
- Add support of path prop ([d573dcc](https://github.com/hanyujie2002/nuxt-toc/commit/d573dcc))

### 🏡 Chore

- Linted code ([d012006](https://github.com/hanyujie2002/nuxt-toc/commit/d012006))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.3.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.2.0...v1.3.0)

### 📖 Documentation

- **README:** Init readme ([22fab29](https://github.com/hanyujie2002/nuxt-toc/commit/22fab29))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.2.0

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.1.1...v1.2.0)

### 🚀 Enhancements

- Addd some classes for styling ([1ac4bc4](https://github.com/hanyujie2002/nuxt-toc/commit/1ac4bc4))

### 🏡 Chore

- Add release scripts. ([aaa8a61](https://github.com/hanyujie2002/nuxt-toc/commit/aaa8a61))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.1.1

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.0.3...v1.1.1)

### 🏡 Chore

- Stop linting playground ([bef6294](https://github.com/hanyujie2002/nuxt-toc/commit/bef6294))
- Remove dependency on tainwind ([dbfcfd9](https://github.com/hanyujie2002/nuxt-toc/commit/dbfcfd9))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.0.3

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.0.1...v1.0.3)

### 🏡 Chore

- **playground:** Add playground code ([0cd3c75](https://github.com/hanyujie2002/nuxt-toc/commit/0cd3c75))
- **lint:** Linted codes in playground ([974c0e9](https://github.com/hanyujie2002/nuxt-toc/commit/974c0e9))
- **release:** V1.0.2 ([6d7c466](https://github.com/hanyujie2002/nuxt-toc/commit/6d7c466))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.0.2

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.0.1...v1.0.2)

### 🏡 Chore

- **playground:** Add playground code ([0cd3c75](https://github.com/hanyujie2002/nuxt-toc/commit/0cd3c75))
- **lint:** Linted codes in playground ([974c0e9](https://github.com/hanyujie2002/nuxt-toc/commit/974c0e9))

### ❤️ Contributors

- Hanyujie2002 ([@hanyujie2002](http://github.com/hanyujie2002))

## v1.0.1

[compare changes](https://github.com/hanyujie2002/nuxt-toc/compare/v1.0.0...v1.0.1)

