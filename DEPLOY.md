# Deploying the docs (GitHub Pages only)

nuxt-toc documentation is published from this repository to **GitHub Pages**.

**Live site:** https://thaikolja.github.io/nuxt-toc/

---

## How it works

```
Edit docs/  →  push to main  →  GitHub Actions  →  GitHub Pages
```

Source of truth: the `docs/` folder in this repo.  
There is **no** Cloudflare hub or shared monorepo deploy for nuxt-toc.

---

## Everyday workflow

1. Edit docs and preview locally:

   ```bash
   npm run docs:dev
   ```

2. Commit and push to **`main`**:

   ```bash
   git add docs/
   git commit -m "docs: your message"
   git push origin main
   ```

3. Wait for the **docs** workflow (Actions tab) to finish green.

4. Open https://thaikolja.github.io/nuxt-toc/

You can also run the workflow by hand: **Actions → docs → Run workflow**.

---

## One-time setup

1. Open **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. That’s it — no API tokens or extra secrets

---

## Local checks (optional)

```bash
npm run docs:build
npm run format:check
```

If Prettier fails:

```bash
npm run format
```

---

## Troubleshooting

| Problem             | What to try                                                 |
| ------------------- | ----------------------------------------------------------- |
| Workflow didn’t run | Did you push to `main`? Did you change files under `docs/`? |
| Pages 404           | Settings → Pages → source must be **GitHub Actions**        |
| Build fails         | Open the failed job log under **Actions → docs**            |
| Old content         | Hard-refresh; wait for the green check on the latest run    |

---

## Summary

| Item           | Value                                 |
| -------------- | ------------------------------------- |
| Host           | GitHub Pages only                     |
| URL            | https://thaikolja.github.io/nuxt-toc/ |
| Trigger        | Push to `main` (docs paths)           |
| Workflow       | `.github/workflows/docs.yml`          |
| Secrets needed | None                                  |
