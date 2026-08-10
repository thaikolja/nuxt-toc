/**
 * Content v2 auto-fetch plugin for `TableOfContents`.
 *
 * Registered only when the host app has `@nuxt/content@2`.
 * Provides `$nuxtTocFetch` via Nuxt's plugin inject API.
 *
 * @module runtime/plugins/fetch-v2
 */

// Nuxt plugin factory.
import { defineNuxtPlugin } from '#app'
// Content v2 query API (auto-imported by the Content module).
import { queryContent } from '#imports'

/**
 * Install `$nuxtTocFetch` that loads one document with `queryContent`.
 */
export default defineNuxtPlugin(() => {
  // Hand Nuxt the inject map for this plugin.
  return {
    provide: {
      /**
       * Load a Content v2 page by path.
       *
       * @param path - Document path (e.g. `/blog/hello`)
       * @param _collection - Ignored on v2 (kept for a shared function signature)
       * @returns The document, or `null` if the query fails / path is empty
       */
      nuxtTocFetch: async (path: string, _collection?: string) => {
        // Guard empty paths — Content queries with '' are unreliable.
        if (!path || typeof path !== 'string') {
          // Help developers spot misconfigured path props.
          if (import.meta.dev) {
            console.warn('[nuxt-toc] auto-fetch skipped: empty path (Content v2)')
          }
          return null
        }

        try {
          // Ask Content for a single doc at this path.
          return await queryContent(path).findOne()
        } catch (err) {
          // Soft-fail so the TOC shows empty instead of crashing the page.
          if (import.meta.dev) {
            console.warn(`[nuxt-toc] Content v2 fetch failed for path "${path}"`, err)
          }
          return null
        }
      },
    },
  }
})
