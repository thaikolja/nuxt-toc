# How to keep the docs in sync

This file explains, in plain language, how nuxt-toc documentation is published and how you keep everything up to date.

## Where the docs live online

You have **two public websites** for the same docs:

| Name                        | URL                                    | What it is                                         |
| --------------------------- | -------------------------------------- | -------------------------------------------------- |
| **Main site (recommended)** | https://docs.kolja-nolte.com/nuxt-toc/ | Lives next to your other project docs (Cloudflare) |
| **Mirror**                  | https://thaikolja.github.io/nuxt-toc/  | Backup copy on GitHub Pages                        |

The **source** of the docs is always this repo: the `docs/` folder in **nuxt-toc**.

You also have a **docs hub repo** (GitLab monorepo) that holds other projects (`secondary-title`, `ai-image-renamer-cli`, …) and deploys them together to Cloudflare under `docs.kolja-nolte.com`.

```
You edit docs here (nuxt-toc)
        │
        │  push to main
        ▼
   GitHub Actions
        │
        ├──► GitHub Pages   →  thaikolja.github.io/nuxt-toc/
        │
        └──► Cloudflare hub →  docs.kolja-nolte.com/nuxt-toc/
              (also rebuilds your other project docs so they stay online)
```

---

## Everyday workflow (nuxt-toc — automatic)

This is what you should use most of the time.

### 1. Edit the docs

```bash
# work on the docs
npm run docs:dev
```

Change files under `docs/`. Check them in the browser.

### 2. Commit and push to `main`

```bash
git add docs/
git commit -m "docs: your short message"
git push origin main
```

### 3. GitHub does the rest

Pushing to **`main`** (when docs-related files change) starts the **docs** workflow:

1. Builds the VitePress site
2. Deploys to **GitHub Pages**
3. Rebuilds your other docs products from the monorepo
4. Puts nuxt-toc under `/nuxt-toc/`
5. Deploys everything to **Cloudflare**

After a few minutes, both URLs should show the new content.

**Manual run (optional):**  
GitHub → **Actions** → **docs** → **Run workflow**.

---

## One-time setup (do this once)

Until these are set, the Cloudflare part of the workflow will fail (GitHub Pages may still work).

### A. GitHub secrets (this nuxt-toc repo)

Open: **GitHub → thaikolja/nuxt-toc → Settings → Secrets and variables → Actions → New repository secret**

Add:

| Secret name             | What it is                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token that can **edit Pages**                                                       |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare **account id**                                                                     |
| `DOCS_MONOREPO_TOKEN`   | GitLab **personal access token** that can **read** the docs monorepo (`thaikolja/kolja-nolte.com`) |

Quick CLI option:

```bash
gh secret set CLOUDFLARE_API_TOKEN
gh secret set CLOUDFLARE_ACCOUNT_ID
gh secret set DOCS_MONOREPO_TOKEN
```

### B. GitHub Pages enabled

**Settings → Pages →** build from **GitHub Actions** (not “Deploy from a branch”).

### C. Cloudflare project name

The workflow deploys to the Pages project named:

`docs-kolja-nolte-com`

(that matches `docs-kolja-nolte-com.pages.dev`).  
If your project name is different, change `CF_PAGES_PROJECT` in `.github/workflows/docs.yml`.

### D. Docs monorepo (GitLab) — optional but recommended

So that when you **only** update the monorepo (other projects), `/nuxt-toc` is not deleted:

1. Commit and push `.gitlab-ci.yml` in the monorepo (branch `docs` or `main`).
2. In GitLab → **Settings → CI/CD → Variables**, set:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

That monorepo pipeline will:

1. Build all monorepo products
2. Clone **latest nuxt-toc from GitHub `main`**
3. Build its docs and put them in `/nuxt-toc`
4. Deploy the full hub to Cloudflare

---

## How the two repos work together

| You change…                | What updates automatically                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| **nuxt-toc** `main` (docs) | GitHub Pages **and** Cloudflare `/nuxt-toc` (plus rebuild of sibling docs on Cloudflare) |
| **docs monorepo** (GitLab) | Cloudflare hub (all products + **fresh** nuxt-toc from GitHub `main`)                    |

**Rule of thumb:**

- Edit **nuxt-toc** docs only in the **nuxt-toc** repo (`docs/`).
- Do **not** maintain a second hand-written copy of nuxt-toc docs in the monorepo.
- The monorepo **pulls** nuxt-toc from GitHub when it deploys.

---

## Local checks before you push

```bash
npm run docs:build      # build should succeed
npm run format:check    # Prettier (CI runs this in the quality workflow)
npm run check           # lint + format + tests (optional before big changes)
```

If `format:check` fails:

```bash
npm run format
git add -u
git commit -m "style: format with Prettier"
```

---

## If something breaks

### Cloudflare job fails with “Missing DOCS_MONOREPO_TOKEN”

→ Add the GitLab read token as a GitHub secret (see setup above).

### Cloudflare job fails on wrangler / auth

→ Check `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.  
→ Token needs permission to deploy Pages.

### GitHub Pages fails

→ Confirm Pages is set to **GitHub Actions**.  
→ Open the failed job under **Actions → docs**.

### Other docs disappeared (`/secondary-title` etc.)

Cloudflare always replaces the **whole** site.  
A good deploy **rebuilds every product** then uploads them together.  
Never upload only `/nuxt-toc` by hand without the other folders.

Fix: re-run the **docs** workflow on nuxt-toc, or the monorepo GitLab pipeline.

### Docs look old on one URL

→ Hard refresh the browser.  
→ Wait for the green check on the Actions (or GitLab) run.  
→ Confirm you pushed to **`main`** (nuxt-toc) or **`docs`/`main`** (monorepo).

---

## Short checklist

**First time**

- [ ] GitHub secrets: Cloudflare token, account id, monorepo token
- [ ] GitHub Pages uses Actions
- [ ] (Optional) Monorepo GitLab CI + Cloudflare variables

**Every docs change**

- [ ] Edit `docs/` in **nuxt-toc**
- [ ] `git push origin main`
- [ ] Wait for **docs** workflow to finish green
- [ ] Check both URLs

That’s it: **push to main = both doc sites update** for nuxt-toc.
