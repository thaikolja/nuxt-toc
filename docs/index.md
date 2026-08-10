---
title: nuxt-toc — TOC for Nuxt Content
description: >-
  Add an accessible, sticky table of contents to Nuxt Content v2 and v3 docs. Pass-in or auto-fetch TOC with active section highlighting.
layout: home
hero:
  name: nuxt-toc
  text: Table of Contents for Nuxt Content
  tagline: Works with Nuxt 4 and @nuxt/content v2 or v3. Pass-in TOC or auto-fetch. Active section highlighting out of the box.
  image:
    src: /logo.png
    alt: nuxt-toc logo
  actions:
    - theme: brand
      text: Get started
      link: /guide/introduction
    - theme: alt
      text: API reference
      link: /api/props
    - theme: alt
      text: GitHub
      link: https://github.com/thaikolja/nuxt-toc
features:
  - title: Dual Content support
    details: One module for @nuxt/content v2 (queryContent) and v3 (queryCollection). Detects the major at setup time.
  - title: Pass-in or auto-fetch
    details: Prefer :toc="page.body?.toc" from your page query, or let the component fetch via a version-specific plugin.
  - title: Active highlighting
    details: IntersectionObserver tracks h2/h3 headings and applies stable CSS classes you can theme.
  - title: Accessible markup
    details: ARIA roles and levels for list structure and headings, with a clear CSS class/id contract.
---
