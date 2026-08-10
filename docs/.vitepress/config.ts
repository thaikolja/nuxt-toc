import { defineConfig } from 'vitepress'

// GitHub Pages: https://thaikolja.github.io/nuxt-toc/
const siteUrl = process.env.DOCS_SITE_URL ?? 'https://thaikolja.github.io/nuxt-toc'
// Project Pages need `/nuxt-toc/`; local `docs:dev` uses `/`.
const base = process.env.DOCS_BASE ?? (process.env.CI ? '/nuxt-toc/' : '/')

const siteDescription =
  'Table of Contents component for Nuxt Content (v2 and v3) with active section highlighting, depth control, and sticky docs layouts.'

export default defineConfig({
  title: 'nuxt-toc',
  description: siteDescription,
  titleTemplate: ':title · nuxt-toc',
  lang: 'en-US',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^https?:\/\/localhost/],
  sitemap: {
    hostname: siteUrl,
  },
  head: [
    ['link', { rel: 'icon', href: `${base}logo.png`, type: 'image/png' }],
    ['meta', { name: 'theme-color', content: '#0b1220' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'nuxt, nuxt module, nuxt content, table of contents, toc, vue, markdown, scroll-spy, documentation',
      },
    ],
    ['meta', { name: 'author', content: 'nuxt-toc contributors' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'nuxt-toc' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:title', content: 'nuxt-toc' }],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { property: 'og:image', content: `${siteUrl}/logo.png` }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'nuxt-toc' }],
    ['meta', { name: 'twitter:description', content: siteDescription }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/logo.png` }],
  ],
  transformPageData(pageData) {
    const relative = pageData.relativePath.replace(/\\/g, '/')
    const path =
      relative === 'index.md' ? '' : relative.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = path ? `${siteUrl}/${path}` : siteUrl
    const pageTitle = pageData.title || pageData.frontmatter.title || 'nuxt-toc'
    const pageDescription =
      pageData.description || pageData.frontmatter.description || siteDescription
    // Prefer string descriptions (folded YAML may arrive as string already).
    const description =
      typeof pageDescription === 'string'
        ? pageDescription.replace(/\s+/g, ' ').trim()
        : siteDescription

    const titleWithSite =
      pageTitle === 'nuxt-toc' || pageTitle.includes('nuxt-toc —')
        ? pageTitle
        : `${pageTitle} · nuxt-toc`

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: titleWithSite }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: titleWithSite }],
      ['meta', { name: 'twitter:description', content: description }],
    )
  },
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'nuxt-toc',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API', link: '/api/props' },
      { text: 'Content v3', link: '/content-v3/setup' },
      { text: 'Content v2', link: '/content-v2/setup' },
      { text: 'Recipes', link: '/recipes/sticky-sidebar' },
      { text: 'Migration', link: '/migration/from-v2' },
      { text: 'Contributing', link: '/contributing/development' },
      {
        text: 'Links',
        items: [
          { text: 'GitHub', link: 'https://github.com/thaikolja/nuxt-toc' },
          { text: 'npm', link: 'https://www.npmjs.com/package/nuxt-toc' },
          { text: 'Changelog', link: '/guide/changelog' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick start', link: '/guide/quick-start' },
            { text: 'Compatibility', link: '/guide/compatibility' },
            { text: 'Changelog', link: '/guide/changelog' },
          ],
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Pass-in vs auto-fetch', link: '/guide/pass-in-vs-auto-fetch' },
            { text: 'Active highlighting', link: '/guide/active-highlighting' },
            { text: 'Styling contract', link: '/guide/styling' },
            { text: 'Accessibility', link: '/guide/accessibility' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API reference',
          items: [
            { text: 'Props', link: '/api/props' },
            { text: 'Module options', link: '/api/module-options' },
            { text: 'CSS classes & IDs', link: '/api/css-classes' },
            { text: 'Types', link: '/api/types' },
            { text: 'Runtime config', link: '/api/runtime-config' },
          ],
        },
      ],
      '/content-v3/': [
        {
          text: 'Content v3',
          items: [
            { text: 'Setup', link: '/content-v3/setup' },
            { text: 'Collections', link: '/content-v3/collections' },
            { text: 'queryCollection', link: '/content-v3/query-collection' },
            { text: 'Auto-fetch', link: '/content-v3/auto-fetch' },
            { text: 'Playground', link: '/content-v3/playground' },
          ],
        },
      ],
      '/content-v2/': [
        {
          text: 'Content v2',
          items: [
            { text: 'Setup', link: '/content-v2/setup' },
            { text: 'queryContent', link: '/content-v2/query-content' },
            { text: 'Auto-fetch', link: '/content-v2/auto-fetch' },
            { text: 'Playground', link: '/content-v2/playground' },
          ],
        },
      ],
      '/recipes/': [
        {
          text: 'Recipes',
          items: [
            { text: 'Sticky sidebar', link: '/recipes/sticky-sidebar' },
            { text: 'Custom active styles', link: '/recipes/custom-active-styles' },
            { text: 'Hide nested links', link: '/recipes/hide-nested-links' },
            { text: 'Empty title state', link: '/recipes/empty-title' },
            { text: 'Multiple collections', link: '/recipes/multiple-collections' },
            { text: 'Docs layout', link: '/recipes/docs-layout' },
          ],
        },
      ],
      '/migration/': [
        {
          text: 'Migration',
          items: [
            { text: 'From v2.x module', link: '/migration/from-v2' },
            { text: 'Content v2 → v3 app', link: '/migration/content-v2-to-v3' },
            { text: 'Breaking changes', link: '/migration/breaking-changes' },
          ],
        },
      ],
      '/contributing/': [
        {
          text: 'Contributing',
          items: [
            { text: 'Development setup', link: '/contributing/development' },
            { text: 'Playgrounds', link: '/contributing/playgrounds' },
            { text: 'Testing', link: '/contributing/testing' },
            { text: 'Docs site', link: '/contributing/docs' },
            { text: 'Release process', link: '/contributing/release' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/thaikolja/nuxt-toc' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'nuxt-toc contributors',
    },
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/thaikolja/nuxt-toc/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
