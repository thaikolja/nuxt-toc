/**
 * Ambient shims for Content APIs imported from `#imports` inside this package.
 *
 * The module repo does not always install `@nuxt/content` at the root, so those
 * symbols are missing from generated `#imports` types here. At runtime in a host
 * app that registers Content, the real auto-imports are present.
 */

declare module '#imports' {
  /**
   * Content v2 query builder (provided by `@nuxt/content@2` in host apps).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const queryContent: (...args: any[]) => any

  /**
   * Content v3 collection query (provided by `@nuxt/content@3` in host apps).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const queryCollection: (collection: string) => any
}
