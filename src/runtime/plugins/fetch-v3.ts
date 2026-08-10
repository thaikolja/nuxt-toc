/**
 * Content v3 auto-fetch plugin for `TableOfContents`.
 *
 * Registered only when the host app has `@nuxt/content@3`.
 * Provides `$nuxtTocFetch` via Nuxt's plugin inject API.
 *
 * @module runtime/plugins/fetch-v3
 */

// Nuxt plugin factory.
import { defineNuxtPlugin } from '#app'
// Content v3 collection query API.
import { queryCollection } from '#imports'

/**
 * Install `$nuxtTocFetch` that loads one document with `queryCollection`.
 */
export default defineNuxtPlugin(() => {
  // Hand Nuxt the inject map for this plugin.
  return {
    provide: {
      /**
       * Load a Content v3 page by collection + path.
       *
       * @param path - Document path (e.g. `/docs/intro`)
       * @param collection - Collection name from `content.config.ts` (default `'content'`)
       * @returns The document, or `null` if the query fails / path is empty
       */
      nuxtTocFetch: async (path: string, collection = 'content') => {
        // Guard empty paths — `.path('')` is not a valid Content query.
        if (!path || typeof path !== 'string') {
          if (import.meta.dev) {
            console.warn('[nuxt-toc] auto-fetch skipped: empty path (Content v3)')
          }
          return null
        }

        // Normalize collection so we never pass an empty string.
        const collectionName = collection || 'content'

        try {
          // Content's typings expect known collection keys; cast for dynamic names.
          return await queryCollection(collectionName as 'content')
            // Restrict to this route/path.
            .path(path)
            // Take the first (only) match.
            .first()
        } catch (err) {
          // Soft-fail: empty TOC is better than a red screen.
          if (import.meta.dev) {
            console.warn(
              `[nuxt-toc] Content v3 fetch failed for collection "${collectionName}" path "${path}"`,
              err,
            )
          }
          return null
        }
      },
    },
  }
})
