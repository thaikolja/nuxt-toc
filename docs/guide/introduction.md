---
title: Introduction to the nuxt-toc module
description: >-
  Learn what nuxt-toc does: nested Content TOC links, optional auto-fetch for v2/v3, and IntersectionObserver active section highlighting for Nuxt docs layouts.
---

# Introduction

**nuxt-toc** is a Nuxt module that registers a single component, `TableOfContents`, for use with [@nuxt/content](https://content.nuxt.com/).

It is designed for documentation and blog layouts where a sticky outline of the current page improves navigation.

## What it does

1. Renders nested links from Content TOC data (`id`, `text`, `children`)
2. Optionally auto-fetches that data from Content v2 or v3
3. Highlights the heading currently in view

## What it does not do

- It does not replace Content’s own TOC generation
- It does not force a visual design system (styles are minimal and overridable)
- It does not register Content for you — you still install `@nuxt/content`

## Who should use it

- Apps on **Nuxt 4** (or Nuxt ≥ 3.16) with Content **v2 or v3**
- Sites that want a small, focused TOC component with stable CSS hooks

## Logo

Brand assets live in the repository root as `logo.png` and are copied into playgrounds and this docs site (`/logo.png`).

![nuxt-toc logo](/logo.png){width=120}
