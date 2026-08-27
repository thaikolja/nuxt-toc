---
title: Release process for nuxt-toc packages
description: >-
  Version bump, changelog, checks, dist build, npm publish, and tag push for releases — with compatibility promises for the 3.x line.
---

# Release process

`nuxt-toc@3.0.0` is the first major of the dual Content / Nuxt 4 line. Patch and minor releases within `3.x` should preserve:

- Nuxt `^3.16 || ^4`, Content `^2 || ^3` peer range.
- Config key `nuxtToc`.
- Stable CSS contract (`#toc-title`, `#toc-container`, `.toc-link`, `.active-toc-item`, …).
- Dual playground layout under `playgrounds/`.

Bumping outside those promises requires a new **major** and a [Breaking changes](/migration/breaking-changes) entry.

## Steps

```bash
# 1. From a clean main
git checkout main && git pull

# 2. Gate — same as CI
npm run check              # lint + format:check + test
npm run prepack            # dist/ should be clean; inspect dist/module.mjs + types

# 3. Bump version in package.json (use npm version or edit manually)
npm version patch          # or minor / major — updates package.json + creates tag locally

# 4. Update CHANGELOG.md under that version (commit before releasing)
# Include: Breaking / Enhancements / Fixes / Docs / Chore sections

# 5. Release helper — or the longhand next block
npm run release
# Equivalent to: npm run check && npm run prepack && changelogen --release && npm publish && git push --follow-tags
```

### Longhand (if you prefer explicit control)

```bash
npm run lint && npm run format:check && npm run test
npm run prepack
changelogen --release        # changelog helper — keeps CHANGELOG.md + git tag consistent
npm publish --access public
git push --follow-tags
```

## After publish

- Verify on `https://www.npmjs.com/package/nuxt-toc` that `dist/` (module + runtime + types) is present and `files: ["dist"]` is sufficient.
- Smoke-check both playgrounds (`npm run dev:prepare` → ± `nuxi build playgrounds/content-v3`, `content-v2`) after the publish tag — the CI pack dry-run covers this, but a real build adds the packed artifact path.

## Checklist before tagging

- [ ] `package.json → version` matches the changelog heading.
- [ ] `docs/guide/changelog.md` shim points to `CHANGELOG.md` at root (no separate per-version text needed).
- [ ] `logo.png` copies still identical across root, playgrounds, docs.
- [ ] No pending lock-file churn (`package-lock.json` should be committed).
- [ ] `release` script’s `publishConfig.registry: https://registry.npmjs.org/` is still correct if publishing from an org registry.

Also see: [Changelog](/guide/changelog), [Breaking changes](/migration/breaking-changes), [Docs site](/contributing/docs).
