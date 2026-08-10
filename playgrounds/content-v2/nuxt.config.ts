export default defineNuxtConfig({
  modules: ['../../src/module', '@nuxt/content'],
  devtools: { enabled: true },
  content: {
    highlight: {
      theme: 'github-dark',
    },
    markdown: {
      toc: {
        depth: 4,
        searchDepth: 4,
      },
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-01-01',
})
