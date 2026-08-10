/**
 * Shared TOC types for Content v2/v3 and the runtime auto-fetch helper.
 *
 * @module runtime/types
 */

/**
 * One entry in a table-of-contents tree (usually one markdown heading).
 *
 * Mirrors what `@nuxt/content` puts under `body.toc.links`.
 */
export interface TocLink {
  /**
   * Anchor id used in `href="#id"` and on the heading element.
   */
  id: string

  /**
   * Visible label for the TOC link.
   */
  text: string

  /**
   * Heading depth from Content (e.g. `2` for `h2`), when provided.
   */
  depth?: number

  /**
   * Nested TOC entries (deeper headings under this one).
   */
  children?: TocLink[]
}

/**
 * Root TOC payload: a list of top-level links (with optional nesting).
 */
export interface Toc {
  /**
   * Top-level TOC links for the document.
   */
  links: TocLink[]
}

/**
 * Runtime helper injected by version-specific plugins to load a content page.
 *
 * - Content v2 plugin ignores `collection`
 * - Content v3 plugin uses `collection` for `queryCollection`
 *
 * @param path - Content document path (e.g. `/docs/intro`)
 * @param collection - Content v3 collection name (optional)
 * @returns A document-like object that may include `body.toc`, or `null` on failure
 */
export type NuxtTocFetch = (
  path: string,
  collection?: string,
) => Promise<{ body?: { toc?: Toc } | null } | null | undefined>

/**
 * Augment Nuxt's app instance so `$nuxtTocFetch` is typed in script setup.
 */
declare module '#app' {
  interface NuxtApp {
    /**
     * Optional auto-fetch function provided when Content v2 or v3 is detected.
     */
    $nuxtTocFetch?: NuxtTocFetch
  }
}

/**
 * Augment Vue instance properties for Options API / templates if needed.
 */
declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Optional auto-fetch function provided when Content v2 or v3 is detected.
     */
    $nuxtTocFetch?: NuxtTocFetch
  }
}

// Keep this file a module so the `declare module` blocks apply correctly.
export {}
