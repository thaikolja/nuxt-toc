# Plan 004: Fix README v2 snippet + remaining docs drift

> **Executor instructions**: Follow step by step. The working tree may already have a large VitePress rewrite. **Do not revert those edits.** Only apply hunks that are still wrong in the live file.
>
> **Drift check (run first)**: `git diff --stat 51f9e20..HEAD -- README.md README_zh.md README_de.md README_es.md README_fr.md README_fa.md docs/api/runtime-config.md docs/guide/active-highlighting.md docs/index.md docs/contributing/testing.md docs/guide/quick-start.md`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `51f9e20`, 2026-08-20

## Why this matters

The GitHub/npm English README is the first copy-paste for Content v2 and currently does not parse. Translations comment-out v2. `docs/api/runtime-config.md` documents two of seven published public config fields. HEAD VitePress still says the spy watches `h2[id]`/`h3[id]` only; the **worktree** rewrite of `docs/guide/active-highlighting.md` may already have fixed that — skip if live text already says the observer follows TOC ids, not tags.

## Current state (HEAD `51f9e20`; re-read live files)

English README v2 fence (still present on live `README.md` at audit time):

```vue
<script setup lang="ts">
const route 			= useRoute()
constage { data } = queryContent(route.path).findOne()
</script>
<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

Correct pattern (from `docs/guide/quick-start.md` / playgrounds):

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
</script>
<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

Translations (`README_zh.md`, `README_de.md`, `README_es.md`, `README_fr.md`, `README_fa.md`) around the usage section: live `queryCollection` plus a comment `// queryContent(route.path).findOne()`.

`docs/api/runtime-config.md` today:

```ts
runtimeConfig.public.nuxtToc = {
  collection: 'content',
  contentMajor: 2 | 3 | null,
}
```

Published fields from `src/module.ts` `NuxtTocPublicRuntimeConfig`: `collection`, `depth`, `scrollSpy`, `rootMargin`, `smooth`, `scrollOffset`, `contentMajor`.

HEAD `docs/guide/active-highlighting.md` line 9: “IntersectionObserver for `h2[id]` and `h3[id]`”. HEAD `docs/index.md` feature: “tracks h2/h3 headings”. **If the live file already contradicts that, skip.**

## Commands you will need

| Purpose                           | Command                                                                 | Expected                                       |
| --------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| Format md if prettier includes it | `npx prettier --check README.md README_*.md docs/api/runtime-config.md` | no errors (md may be ignored by prettier — OK) |
| No src changes                    | `git diff --stat -- src/`                                               | empty for this plan                            |

There is no markdown compiler in CI. Manual: the v2 fence must be valid Vue (no `constage`).

## Scope

**In scope:**

- `README.md` — v2 usage fence only (do not rewrite the intro unless it still contains `constage`)
- `README_zh.md`, `README_de.md`, `README_es.md`, `README_fr.md`, `README_fa.md` — add a labeled v2 fence; keep slim README shape
- `docs/api/runtime-config.md` — full public config object
- `docs/guide/active-highlighting.md` and `docs/index.md` — **only if** they still claim tag-limited h2/h3 observation
- `docs/contributing/testing.md` — list missing test files if still incomplete

**Out of scope:**

- New VitePress pages
- Reverting the user’s uncommitted guide rewrite
- Changing default title strings / i18n
- Source code

## Git workflow

- Branch: `advisor/004-docs-readme-accuracy`
- Commit: `docs: fix Content v2 README example and runtime-config fields`
- Do NOT push unless asked.

## Steps

### Step 1: Fix English README v2 fence

Replace the broken script block with the `useAsyncData` + `queryContent(route.path).findOne()` snippet above. Keep the surrounding `## @nuxt/content v2` heading if it exists. Do not introduce tabs-for-alignment. Do **not** copy `constage` into any file.

**Verify**: `rg -n "constage" README.md` prints nothing.

### Step 2: Translations get a real v2 fence

In each of the five locale READMEs, keep the v3 `queryCollection` example, then add a short v2 section (translated heading, **identical code** to Step 1). Delete the comment-only `// queryContent(...)` line so nobody copies v3 queries into a v2 app.

Do not translate identifiers (`useAsyncData`, `queryContent`, `TableOfContents`).

**Verify**: `rg -n "constage" README_*.md` empty; each file contains `queryContent(route.path).findOne()`.

### Step 3: runtime-config.md

Replace the sample with:

```ts
runtimeConfig.public.nuxtToc = {
  collection: 'content',
  depth: 2,
  scrollSpy: true,
  rootMargin: '0px 0px -80% 0px',
  smooth: false,
  scrollOffset: 0,
  contentMajor: 2 | 3 | null,
}
```

Keep the sentence that `contentMajor` is informational and plugins are chosen once at setup.

**Verify**: the page mentions `scrollOffset` and `rootMargin`.

### Step 4: Spy wording only if still stale

If live `docs/guide/active-highlighting.md` still says the observer is created for `h2[id]` and `h3[id]`, change it to: the observer attaches to DOM nodes whose `id` matches a TOC link (any tag), after depth limiting. Same for `docs/index.md` “tracks h2/h3” if that phrase is still there.

If the live highlighting guide already has a “Which headings are watched? / Not h2/h3 blindly” section, **leave it**.

**Verify**: `rg -n "h2\\[id\\]|tracks h2/h3" docs/guide/active-highlighting.md docs/index.md` — no stale hits, or only historical wording you intentionally kept in a “not this” sentence.

## Test plan

No runtime tests. Check: `rg constage README.md` empty.

## Done criteria

- [ ] English README v2 example compiles as Vue (`useAsyncData` + `queryContent` + `data: page`)
- [ ] Five locale READMEs include that v2 example
- [ ] `docs/api/runtime-config.md` lists all seven public fields
- [ ] No `constage` anywhere in the repo (`rg constage`)
- [ ] No `src/` files changed
- [ ] `plans/README.md` 004 DONE

## STOP conditions

- README v2 fence is already fixed on live `README.md` — skip Step 1, continue the rest.
- A locale README was rewritten so there is no usage section — add a minimal v2/v3 pair at the bottom of the usage section rather than inventing a new page structure.

## Maintenance notes

- Reviewer: do not ship the English typo into translations.
- Future README edits should copy from `docs/guide/quick-start.md`, not the other way around.

---
