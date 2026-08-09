import { defineNuxtPlugin } from '#app'
import { queryContent } from '#imports'

/**
 * Content v2 auto-fetch for TableOfContents.
 * Registered only when the host app has @nuxt/content@2.
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      nuxtTocFetch: async (path: string, _collection?: string) => {
        try {
          return await queryContent(path).findOne()
        } catch {
          return null
        }
      },
    },
  }
})
