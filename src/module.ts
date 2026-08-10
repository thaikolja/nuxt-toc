/**
 * nuxt-toc — Nuxt module entry.
 *
 * Detects `@nuxt/content` major, exposes public runtime config, registers one
 * version-specific fetch plugin, and adds the `TableOfContents` component.
 *
 * @module module
 * @packageDocumentation
 */

// Nuxt kit helpers for modules.
import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addPlugin,
  logger,
  hasNuxtModule,
} from '@nuxt/kit'
// Figure out whether the host has Content v2 or v3 installed.
import { detectContentMajor } from './utils/detect-content-major'

// Re-export detection helpers for advanced consumers / tests.
export type { ContentMajor } from './utils/detect-content-major'
export { detectContentMajor } from './utils/detect-content-major'

/**
 * Options under `nuxtToc` in `nuxt.config.ts`.
 *
 * Component props with the same names override these defaults when set.
 */
export interface ModuleOptions {
  /**
   * Default Content **v3** collection for auto-fetch.
   * @default 'content'
   */
  collection?: string

  /**
   * Default max nesting depth of TOC links (`1` = top-level only).
   * @default 2
   */
  depth?: number

  /**
   * Default for active-section highlighting via IntersectionObserver.
   * @default true
   */
  scrollSpy?: boolean

  /**
   * Default `rootMargin` for the scroll-spy observer.
   * @default '0px 0px -80% 0px'
   */
  rootMargin?: string

  /**
   * Default smooth scrolling when clicking TOC links.
   * @default false
   */
  smooth?: boolean

  /**
   * Default pixel offset when scrolling to a heading (sticky header height).
   * @default 0
   */
  scrollOffset?: number
}

/**
 * Shape we publish on `runtimeConfig.public.nuxtToc` for the client component.
 */
export interface NuxtTocPublicRuntimeConfig {
  /** Default collection for Content v3 auto-fetch. */
  collection: string
  /** Default max TOC nesting depth. */
  depth: number
  /** Whether scroll-spy is on by default. */
  scrollSpy: boolean
  /** Default IntersectionObserver root margin. */
  rootMargin: string
  /** Default smooth-scroll flag. */
  smooth: boolean
  /** Default scroll offset in pixels. */
  scrollOffset: number
  /** Detected Content major, or `null` if missing. */
  contentMajor: 2 | 3 | null
}

// Tell Nuxt/TS about our public runtime config (fixes IDE errors on assignment).
declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    nuxtToc: NuxtTocPublicRuntimeConfig
  }
}

// Same augmentation for the `nuxt/schema` path IDEs sometimes resolve.
declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    nuxtToc: NuxtTocPublicRuntimeConfig
  }
}

/**
 * Normalize and clamp module options so runtime never sees garbage values.
 *
 * @param options - Raw module options after Nuxt defaults merge
 */
function normalizeOptions(
  options: ModuleOptions,
): Required<
  Pick<
    ModuleOptions,
    'collection' | 'depth' | 'scrollSpy' | 'rootMargin' | 'smooth' | 'scrollOffset'
  >
> {
  // Collection must be a non-empty string.
  const collection =
    typeof options.collection === 'string' && options.collection.trim()
      ? options.collection.trim()
      : 'content'

  // Depth: positive integer, default 2.
  const rawDepth = Number(options.depth)
  const depth = Number.isFinite(rawDepth) ? Math.max(1, Math.floor(rawDepth)) : 2

  // Scroll offset: non-negative integer px.
  const rawOffset = Number(options.scrollOffset)
  const scrollOffset = Number.isFinite(rawOffset) ? Math.max(0, Math.floor(rawOffset)) : 0

  // rootMargin: non-empty CSS margin string.
  const rootMargin =
    typeof options.rootMargin === 'string' && options.rootMargin.trim()
      ? options.rootMargin.trim()
      : '0px 0px -80% 0px'

  // Booleans with sensible defaults.
  const scrollSpy = options.scrollSpy !== false
  const smooth = !!options.smooth

  return { collection, depth, scrollSpy, rootMargin, smooth, scrollOffset }
}

/**
 * Nuxt module definition for `nuxt-toc`.
 *
 * Config key: `nuxtToc`
 */
export default defineNuxtModule<ModuleOptions>({
  // Module metadata Nuxt uses for discovery and docs.
  meta: {
    // Package / module name.
    name: 'nuxt-toc',
    // Config key in nuxt.config: `nuxtToc: { ... }`.
    configKey: 'nuxtToc',
    // Rough Nuxt version floor (peer range is more precise).
    compatibility: {
      nuxt: '>=3.16.0',
    },
  },
  // Defaults applied when the consumer omits options.
  defaults: {
    collection: 'content',
    depth: 2,
    scrollSpy: true,
    rootMargin: '0px 0px -80% 0px',
    smooth: false,
    scrollOffset: 0,
  },
  // Runs once when the host app boots the module.
  setup(options, nuxt) {
    // Resolve paths relative to this file (works for src + dist layouts).
    const resolver = createResolver(import.meta.url)

    // Peek at the host's installed Content package major.
    const contentMajor = detectContentMajor(nuxt.options.rootDir)

    // Clamp / sanitize user options once at setup.
    const normalized = normalizeOptions(options)

    // Soft-warn when the package is present but not registered as a Nuxt module.
    if (contentMajor && !hasNuxtModule('@nuxt/content', nuxt)) {
      logger.warn(
        '[nuxt-toc] `@nuxt/content` is installed but not registered in `modules`. ' +
          'Add `@nuxt/content` to `nuxt.config` modules, or pass `:toc` and skip auto-fetch.',
      )
    }

    // Build the full public config object first (typed for the IDE).
    const publicNuxtToc: NuxtTocPublicRuntimeConfig = {
      collection: normalized.collection,
      depth: normalized.depth,
      scrollSpy: normalized.scrollSpy,
      rootMargin: normalized.rootMargin,
      smooth: normalized.smooth,
      scrollOffset: normalized.scrollOffset,
      contentMajor,
    }

    // Publish defaults + detection result for the runtime component.
    nuxt.options.runtimeConfig.public.nuxtToc = publicNuxtToc

    // Wire the matching auto-fetch plugin (never both — different APIs).
    if (contentMajor === 2) {
      // Content v2: queryContent-based fetch.
      addPlugin(resolver.resolve('./runtime/plugins/fetch-v2'))
    } else if (contentMajor === 3) {
      // Content v3: queryCollection-based fetch.
      addPlugin(resolver.resolve('./runtime/plugins/fetch-v3'))
    } else {
      // No Content (or unsupported major): pass-in `:toc` still works.
      logger.warn(
        '[nuxt-toc] @nuxt/content v2 or v3 not found. ' +
          'Auto-fetch is disabled; pass `:toc` from your page query instead.',
      )
    }

    // Register the public component as <TableOfContents />.
    addComponent({
      name: 'TableOfContents',
      filePath: resolver.resolve('./runtime/components/TableOfContents.vue'),
    })
  },
})
