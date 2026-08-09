export default defineNuxtConfig({
  modules: ['../../src/module', '@nuxt/content'],
  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',
  future: {
    compatibilityVersion: 4,
  },
  // Content v2 module options (no collections)
  content: {
    highlight: {
      theme: 'github-dark',
    },
  },
})
