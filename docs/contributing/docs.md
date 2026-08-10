---
title: Build and preview the docs site
description: >-
  Develop and build the VitePress documentation for nuxt-toc, and understand how both GitHub Pages and Cloudflare stay in sync on every docs change.
---

# Docs site

Developer docs use [VitePress](https://vitepress.dev/) in `docs/`.

```bash
npm run docs:dev
npm run docs:build
npm run docs:preview
```

## Public hosts (always deployed together)

When you push docs changes to **`main`** in this repo, **one workflow** (`.github/workflows/docs.yml`) updates **both** hosts:

| Host                           | URL                                    |
| ------------------------------ | -------------------------------------- |
| **Canonical** (Cloudflare hub) | https://docs.kolja-nolte.com/nuxt-toc/ |
| Mirror (GitHub Pages)          | https://thaikolja.github.io/nuxt-toc/  |

Flow:

1. Build VitePress once (`base: /nuxt-toc/`, canonical URL = Cloudflare host)
2. Deploy the same artifact to **GitHub Pages**
3. Rebuild the docs monorepo products, inject this site into `dist/nuxt-toc/`, deploy the full tree to **Cloudflare Pages**

Local `docs:dev` still uses `base: /`.

### Required GitHub secrets (Cloudflare job)

| Secret                  | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare Pages deploy                                        |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account id                                          |
| `DOCS_MONOREPO_TOKEN`   | GitLab PAT (`read_repository`) for `thaikolja/kolja-nolte.com` |

Trigger: push to `main` touching `docs/**` (or **Actions → docs → Run workflow**).

### Monorepo side (`docs.kolja-nolte.com`)

The GitLab monorepo also has CI (`.gitlab-ci.yml` on branch `docs`/`main`) that:

1. Builds secondary-title, ai-image-renamer-cli, viscribe, …
2. Clones **latest `nuxt-toc` from GitHub `main`**, builds its docs, injects `/nuxt-toc`
3. Deploys the full Cloudflare hub

So updating **either** repo keeps the hub (including `/nuxt-toc`) current, and this package’s GitHub Pages mirror updates whenever **this** repo’s docs change.

Logo: `docs/public/logo.png` (copied from root `logo.png`).
