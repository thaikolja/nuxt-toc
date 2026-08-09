# Docs site

Developer docs use [VitePress](https://vitepress.dev/) in `docs/`.

```bash
bun run docs:dev
bun run docs:build
bun run docs:preview
```

GitHub Pages deploys from `.github/workflows/docs.yml` on pushes to `main` that touch `docs/**` or the workflow file.

Logo: `docs/public/logo.png` (copied from root `logo.png`).
