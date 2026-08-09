import { defineNuxtModule, createResolver, addComponent, addPlugin, logger } from '@nuxt/kit'
import { detectContentMajor } from './utils/detect-content-major'

export type { ContentMajor } from './utils/detect-content-major'
export { detectContentMajor } from './utils/detect-content-major'

export interface ModuleOptions {
  /**
   * Default content collection used when `TableOfContents` auto-fetches on Content v3.
   * @default 'content'
   */
  collection?: string
  /**
   * Default maximum nesting depth for TOC links (1 = top-level only).
   * @default 2
   */
  depth?: number
  /**
   * Enable IntersectionObserver active-section highlighting by default.
   * @default true
   */
  scrollSpy?: boolean
  /**
   * Default `rootMargin` for the scroll-spy IntersectionObserver.
   * @default '0px 0px -80% 0px'
   */
  rootMargin?: string
  /**
   * Use smooth scrolling when clicking TOC links by default.
   * @default false
   */
  smooth?: boolean
  /**
   * Pixel offset when scrolling to a heading (e.g. sticky header height).
   * @default 0
   */
  scrollOffset?: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-toc',
    configKey: 'nuxtToc',
    compatibility: {
      nuxt: '>=3.16.0',
    },
  },
  defaults: {
    collection: 'content',
    depth: 2,
    scrollSpy: true,
    rootMargin: '0px 0px -80% 0px',
    smooth: false,
    scrollOffset: 0,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const contentMajor = detectContentMajor(nuxt.options.rootDir)

    const depth = options.depth == null ? 2 : Math.max(1, Math.floor(Number(options.depth) || 2))
    const scrollOffset = Math.max(0, Math.floor(Number(options.scrollOffset) || 0))

    nuxt.options.runtimeConfig.public.nuxtToc = {
      collection: options.collection ?? 'content',
      depth,
      scrollSpy: options.scrollSpy !== false,
      rootMargin: options.rootMargin || '0px 0px -80% 0px',
      smooth: !!options.smooth,
      scrollOffset,
      contentMajor,
    }

    if (contentMajor === 2) {
      addPlugin(resolver.resolve('./runtime/plugins/fetch-v2'))
    } else if (contentMajor === 3) {
      addPlugin(resolver.resolve('./runtime/plugins/fetch-v3'))
    } else {
      logger.warn(
        '[nuxt-toc] @nuxt/content v2 or v3 not found. ' +
          'Auto-fetch is disabled; pass `:toc` from your page query instead.',
      )
    }

    addComponent({
      name: 'TableOfContents',
      filePath: resolver.resolve('./runtime/components/TableOfContents.vue'),
    })
  },
})
