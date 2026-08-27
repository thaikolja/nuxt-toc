---
title: Nuxt and Content compatibility
description: >-
  Supported Nuxt, Vue, and @nuxt/content versions for nuxt-toc. How dual Content v2/v3 detection works and what to expect on Nuxt 3.16+ and Nuxt 4.
---

# Compatibility

`nuxt-toc` is a **Nuxt module** — it runs inside your Nuxt app at build time and adds the `<TableOfContents>` component. That means its compatibility is tied to your Nuxt and Content versions.

## Supported versions

| Package         | Supported                               | Primary target |
| --------------- | --------------------------------------- | -------------- |
| `nuxt`          | `^3.16.0 \|\| ^4.0.0`                     | **Nuxt 4**     |
| `@nuxt/content` | `^2.0.0 \|\| ^3.0.0`                      | both           |
| `vue`           | `3.x`                                   | —              |
| `node`          | `>=20.0.0`                              | —              |

The published package declares `@nuxt/kit >=3.16 <5` as a dependency so Nuxt 3.16+ and Nuxt 4 hosts can both resolve a matching kit. Your `package.json` should still pin `nuxt` itself to `^3.16` or `^4`.

::: warning One Content major per app
`@nuxt/content` v2 and v3 cannot be installed in the same `node_modules` tree — they export conflicting APIs. This repo keeps **separate playgrounds** (`playgrounds/content-v2` and `playgrounds/content-v3`) each with its own `package.json`. Your app should install **one** major: `npm install @nuxt/content@^2` **or** `npm install @nuxt/content@^3`.
:::

## How dual Content support works

On `setup()` (`src/module.ts:171`), the module:

1. **Detects the major** by walking up from `nuxt.options.rootDir` looking for `node_modules/@nuxt/content/package.json` and reading its `version` (`src/utils/detect-content-major.ts:32`). Walking covers hoisted installs (e.g. playgrounds that depend on a parent `node_modules`). Unsupported majors return `null`.
2. **Publishes runtime config** at `runtimeConfig.public.nuxtToc.contentMajor` (`2`, `3`, or `null`) so the client can be inspected in Vue devtools.
3. **Registers exactly one plugin** — never both (they import different queries and would break the tree):

| Detected major | Plugin registered | Query used |
| -------------- | ----------------- | ---------- |
| `2` | `src/runtime/plugins/fetch-v2.ts` | `queryContent(path).findOne()` |
| `3` | `src/runtime/plugins/fetch-v3.ts` | `queryCollection(collection).path(path).first()` |
| `null` | none — logs a warning | Pass-in `:toc` still works |

The fetch plugins are added with `addPlugin()` and provide `$nuxtTocFetch` via `defineNuxtPlugin().provide`. The component (`src/runtime/components/TableOfContents.vue:295`) calls that function only when `:toc` is omitted — otherwise it reuses `normalizeToc(toc)`.

**Consequence you may notice:** if you build with Content v3 and open the app with Content v2 installed (or vice versa), the auto-fetch plugin will not match and the TOC will stay in the “Could not load” empty state. The fix is to align the installed package with what you build against, then run `npx nuxi prepare`.

## Module vs playground Nuxt versions

- **This package (`nuxt-toc@3.0.0`):** built against Nuxt 4 tooling. CI runs `nuxt-module-build`, `vitest`, and both playground builds.
- **Playgrounds:** both are **Nuxt 4** apps, differing only in the Content major. Ports: `content-v3` on `3000`, `content-v2` on `3001`.

You can still use the **published module** from a **Nuxt 3.16+** host — just keep `@nuxt/kit` aligned with your Nuxt version (your lockfile will do this after `npm install`).

## Content v2 vs v3 differences that affect the TOC

| Topic | v2 | v3 |
|---|---|---|
| Install | `npm install @nuxt/content@^2` | `npm install @nuxt/content@^3` |
| Config file | none (put `.md` in `content/`) | `content.config.ts` with `defineCollection({ type: 'page', source: '**/*.md' })` |
| Query in pages | `queryContent(path).findOne()` | `queryCollection('content').path(path).first()` |
| Collection concept | no collections — `collection` prop is ignored | required — `nuxtToc.collection` / `collection` prop must match a `content.config.ts` key |
| `ContentRenderer` | `ContentRenderer` or legacy `ContentDoc` | `ContentRenderer` |
| TOC location | `page.body.toc.links` | `page.body.toc.links` — same shape on both majors |
| TOC depth cap | set via `content.build.markdown.toc` (if exposed) | `defineCollection` / `content.build.markdown.toc: { depth, searchDepth }` |

See setup guides: [Content v3](/content-v3/setup) and [Content v2](/content-v2/setup).

## Quick answers

**Which Content version should a new app pick?**
Content v3 is recommended for new Nuxt 4 apps. The module works equally well with either — the choice is about Content features, not TOC behavior.

**Can I migrate an app from Content v2 to v3 later?**
Yes — see [Migrating your app: Content v2 → v3](/migration/content-v2-to-v3). The TOC usage (`:toc="page.body.toc"`) does not change; only the query helper does.

**Do I need to configure anything for dual support?**
No. Install the Content major you want, list `['nuxt-toc', '@nuxt/content']` in `modules`, and the module picks the right plugin. Only Content v3 needs `content.config.ts`.

**How do I debug which major was detected?**
Open Vue devtools → `runtimeConfig.public.nuxtToc.contentMajor` should be `2` or `3`. In dev, the module also warns if Content is installed but not registered in `modules` (“pass `:toc` and skip auto-fetch”).

## Next step

- New to Nuxt? → [First time with Nuxt](/guide/first-time-nuxt)
- Ready to install → [Installation](/guide/installation)
- Curious about the internals → [How it works](/guide/how-it-works)
