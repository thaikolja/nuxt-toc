import { defineNuxtPlugin } from '#app'
import { queryCollection } from '#imports'

/**
 * Content v3 auto-fetch for TableOfContents.
 * Registered only when the host app has @nuxt/content@3.
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      nuxtTocFetch: async (path: string, collection = 'content') => {
        try {
          return await queryCollection(collection as 'content')
            .path(path)
            .first()
        } catch {
          return null
        }
      },
    },
  }
})
