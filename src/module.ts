import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addPlugin,
  logger,
} from '@nuxt/kit'
import { detectContentMajor } from './utils/detect-content-major'

export type { ContentMajor } from './utils/detect-content-major'
export { detectContentMajor } from './utils/detect-content-major'

export interface ModuleOptions {
  /**
   * Default content collection used when `TableOfContents` auto-fetches on Content v3.
   * Consumers define collections in `content.config.ts`.
   * @default 'content'
   */
  collection?: string
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
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const contentMajor = detectContentMajor(nuxt.options.rootDir)

    nuxt.options.runtimeConfig.public.nuxtToc = {
      collection: options.collection ?? 'content',
      contentMajor,
    }

    if (contentMajor === 2) {
      addPlugin(resolver.resolve('./runtime/plugins/fetch-v2'))
    }
    else if (contentMajor === 3) {
      addPlugin(resolver.resolve('./runtime/plugins/fetch-v3'))
    }
    else {
      logger.warn(
        '[nuxt-toc] @nuxt/content v2 or v3 not found. '
        + 'Auto-fetch is disabled; pass `:toc` from your page query instead.',
      )
    }

    addComponent({
      name: 'TableOfContents',
      filePath: resolver.resolve('./runtime/components/TableOfContents.vue'),
    })
  },
})
