export default defineNuxtConfig({
  modules: ['../../src/module', '@nuxt/content'],
  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',
  nuxtToc: {
    collection: 'content',
  },
  future: {
    compatibilityVersion: 4,
  },
})
