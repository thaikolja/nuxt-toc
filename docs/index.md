---
title: nuxt-toc — TOC for Nuxt Content
description: >-
  Add an accessible, sticky table of contents to Nuxt Content v2 and v3 docs. Pass-in or auto-fetch TOC with active section highlighting.
layout: home
hero:
  name: nuxt-toc
  text: Table of Contents for Nuxt Content
  tagline: The Nuxt module that turns your headings into a live, clickable outline. Works with Nuxt 4 (and 3.16+) and @nuxt/content v2 or v3.
  image:
    src: /logo.png
    alt: nuxt-toc logo
  actions:
    - theme: brand
      text: Get started (5 min)
      link: /guide/introduction
    - theme: alt
      text: API reference
      link: /api/props
    - theme: alt
      text: GitHub
      link: https://github.com/thaikolja/nuxt-toc
features:
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>'
    title: Made for beginners
    details: Copy-paste setup, clear errors, and a "pass-in" mode that reuses the page you already fetched — no magic queries to learn first.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 12.57-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.57"/><path d="m22 17.57-8.58 3.91a2 2 0 0 1-1.66 0L2.6 17.57"/></svg>'
    title: Dual Content support
    details: One module works with @nuxt/content v2 (queryContent) and v3 (queryCollection). It detects the installed major once and registers the right plugin.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>'
    title: Pass-in or auto-fetch
    details: >-
      Recommended: :toc="page.body?.toc" from your page query. Optional:
      <TableOfContents /> auto-fetches by route path or explicit path/collection props.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h12"/><path d="M3 12h12"/><path d="M3 18h8"/><circle cx="19" cy="18" r="3"/><path d="m21.2 16.2-4.4 3.6"/></svg>'
    title: Active highlighting
    details: Client-side IntersectionObserver tracks only the headings in your TOC and highlights the section you are reading. Tunable with rootMargin and scrollOffset.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22a8 8 0 0 1-2-15.5"/><path d="M20 12c0 4.4-3.6 8-8 8"/></svg>'
    title: Accessible & themeable
    details: >-
      Stable CSS IDs/classes (#toc-title, #toc-container, .active-toc-item…) and
      ARIA roles so you can style it to match any design system.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>'
    title: Tiny runtime
    details: No heavy dependencies. Depth limiting, batching, and rebuild skipping keep scroll-spy cheap even on long pages.
---
