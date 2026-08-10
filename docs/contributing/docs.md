# Docs site

Developer docs use [VitePress](https://vitepress.dev/) in `docs/`.

```bash
npm run docs:dev
npm run docs:build
npm run docs:preview
```

GitHub Pages deploys from `.github/workflows/docs.yml` on pushes to `main` that touch `docs/**` or the workflow file.

Logo: `docs/public/logo.png` (copied from root `logo.png`).
