<template>
  <div v-if="showTitleOnly" class="nuxt-toc">
    <span id="toc-title" role="heading" aria-level="2">{{ title }}</span>
  </div>

  <div v-else-if="hasLinks" class="nuxt-toc" @click="onTocClick">
    <span id="toc-title" role="heading" aria-level="2">{{ title }}</span>
    <TocTree :links="displayToc!.links" :max-depth="effectiveDepth" :is-active="isActive" root />
  </div>

  <div v-else-if="shouldAutoFetch && pending" class="nuxt-toc nuxt-toc--pending">
    Loading table of contents…
  </div>

  <div v-else-if="shouldAutoFetch && !pending" class="nuxt-toc nuxt-toc--empty">
    No table of contents found for
    <code>{{ resolvedPath }}</code
    >.
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Toc } from '../types'
import { normalizeToc } from '../utils/normalize-toc'
import { limitTocDepth, resolveEffectiveDepth } from '../utils/limit-toc-depth'
import { scrollToHeading } from '../utils/scroll-to-heading'
import TocTree from './TocTree.vue'
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  useRoute,
  useRuntimeConfig,
  useAsyncData,
  useNuxtApp,
} from '#imports'

const props = defineProps({
  /**
   * Prefetched TOC data. When set, the component does not fetch content itself.
   */
  toc: {
    type: Object as PropType<Toc | null>,
    default: null,
  },
  /**
   * Path of the content document for auto-fetch (default: current route path).
   */
  path: {
    type: String,
    default: '',
  },
  /**
   * Content v3 collection name (default: module `nuxtToc.collection` or `'content'`).
   */
  collection: {
    type: String,
    default: '',
  },
  /**
   * Max nesting depth of TOC links (1 = top-level only).
   * Falls back to module option `nuxtToc.depth` (default 2).
   */
  depth: {
    type: Number,
    default: undefined,
  },
  /**
   * When false, nested children are hidden (effective depth 1). Legacy alias.
   */
  isSublistShown: {
    type: Boolean,
    default: true,
  },
  /**
   * When true, still render the title if the TOC has no links.
   */
  isTitleShownWithNoContent: {
    type: Boolean,
    default: false,
  },
  /**
   * Heading text above the list.
   */
  title: {
    type: String,
    default: 'Table of Contents',
  },
  /**
   * Enable IntersectionObserver active highlighting.
   * Falls back to module option `nuxtToc.scrollSpy` (default true).
   */
  scrollSpy: {
    type: Boolean,
    default: undefined,
  },
  /**
   * IntersectionObserver `rootMargin` (e.g. sticky header compensation).
   * Falls back to module option `nuxtToc.rootMargin`.
   */
  rootMargin: {
    type: String,
    default: undefined,
  },
  /**
   * Smooth-scroll when clicking a TOC link.
   * Falls back to module option `nuxtToc.smooth` (default false).
   */
  smooth: {
    type: Boolean,
    default: undefined,
  },
  /**
   * Pixel offset applied when scrolling to a heading (sticky header height).
   * Falls back to module option `nuxtToc.scrollOffset` (default 0).
   */
  scrollOffset: {
    type: Number,
    default: undefined,
  },
})

const activeTocIds = ref<string[]>([])
const lastVisibleHeading = ref<string>('')

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const nuxtApp = useNuxtApp()

let observer: IntersectionObserver | null = null
let rafId = 0
let lastObservedKey = ''

const nuxtTocPublic = computed(
  () =>
    (runtimeConfig.public.nuxtToc ?? {}) as {
      collection?: string
      depth?: number
      scrollSpy?: boolean
      rootMargin?: string
      smooth?: boolean
      scrollOffset?: number
      contentMajor?: number | null
    },
)

const resolvedPath = computed(() => {
  const raw = props.path || route.path || '/'
  if (raw.length > 1 && raw.endsWith('/')) {
    return raw.slice(0, -1)
  }
  return raw || '/'
})

const resolvedCollection = computed(
  () => props.collection || nuxtTocPublic.value.collection || 'content',
)

const effectiveDepth = computed(() =>
  resolveEffectiveDepth(props.depth ?? nuxtTocPublic.value.depth, props.isSublistShown, 2),
)

const scrollSpyEnabled = computed(() =>
  props.scrollSpy === undefined ? nuxtTocPublic.value.scrollSpy !== false : props.scrollSpy,
)

const resolvedRootMargin = computed(
  () => props.rootMargin || nuxtTocPublic.value.rootMargin || '0px 0px -80% 0px',
)

const smoothEnabled = computed(() =>
  props.smooth === undefined ? !!nuxtTocPublic.value.smooth : props.smooth,
)

const resolvedScrollOffset = computed(() => {
  const value = props.scrollOffset ?? nuxtTocPublic.value.scrollOffset ?? 0
  return Math.max(0, Math.floor(Number(value) || 0))
})

const shouldAutoFetch = computed(() => props.toc == null)

const { data: fetchedPage, pending } = await useAsyncData(
  () => `nuxt-toc-${resolvedCollection.value}-${resolvedPath.value}`,
  async () => {
    if (!shouldAutoFetch.value) {
      return null
    }

    const fetchPage = nuxtApp.$nuxtTocFetch
    if (typeof fetchPage !== 'function') {
      if (import.meta.dev) {
        console.warn(
          '[nuxt-toc] Auto-fetch unavailable ($nuxtTocFetch missing). ' +
            'Is @nuxt/content installed? Or pass `:toc` instead.',
        )
      }
      return null
    }

    return await fetchPage(resolvedPath.value, resolvedCollection.value)
  },
  {
    watch: [resolvedPath, resolvedCollection, shouldAutoFetch],
    immediate: true,
    // Avoid deep tracking on large document bodies
    deep: false,
  },
)

const resolvedToc = computed<Toc | null>(() => {
  if (props.toc != null) {
    return normalizeToc(props.toc)
  }
  return normalizeToc(fetchedPage.value)
})

const displayToc = computed(() => limitTocDepth(resolvedToc.value, effectiveDepth.value))

const hasLinks = computed(() => !!displayToc.value?.links?.length)

const showTitleOnly = computed(
  () => !hasLinks.value && props.isTitleShownWithNoContent && !pending.value,
)

/** Stable string key of observed heading ids (for cheap observer rebuild checks). */
const observedIdsKey = computed(() => {
  const ids: string[] = []
  const walk = (links: Toc['links'] | undefined) => {
    if (!links) return
    for (const link of links) {
      if (link.id) ids.push(link.id)
      walk(link.children)
    }
  }
  walk(displayToc.value?.links)
  return ids.join('\0')
})

const activeIdSet = computed(() => new Set(activeTocIds.value))

function isActive(id: string): boolean {
  return activeIdSet.value.has(id) || id === lastVisibleHeading.value
}

function collectTocIds(toc: Toc | null): Set<string> {
  const ids = new Set<string>()
  const walk = (links: Toc['links'] | undefined) => {
    if (!links) return
    for (const link of links) {
      if (link.id) ids.add(link.id)
      walk(link.children)
    }
  }
  walk(toc?.links)
  return ids
}

function disconnectObserver() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
  lastObservedKey = ''
}

function observeSections(force = false) {
  if (!import.meta.client || !scrollSpyEnabled.value || !hasLinks.value) {
    disconnectObserver()
    activeTocIds.value = []
    lastVisibleHeading.value = ''
    return
  }

  const key = `${observedIdsKey.value}|${resolvedRootMargin.value}`
  if (!force && key === lastObservedKey && observer) {
    return
  }

  disconnectObserver()
  activeTocIds.value = []
  lastVisibleHeading.value = ''
  lastObservedKey = key

  const allowedIds = collectTocIds(displayToc.value)
  if (allowedIds.size === 0) {
    return
  }

  // Single threshold is cheaper than multi-threshold sampling for scroll-spy.
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: resolvedRootMargin.value,
    threshold: 0,
  }

  let pendingEntries: IntersectionObserverEntry[] = []

  const flush = () => {
    rafId = 0
    const entries = pendingEntries
    pendingEntries = []
    if (!entries.length) return

    let changed = false
    const next = new Set(activeTocIds.value)

    for (const entry of entries) {
      const id = (entry.target as HTMLElement).id
      if (!id) continue
      if (entry.isIntersecting) {
        lastVisibleHeading.value = id
        if (!next.has(id)) {
          next.add(id)
          changed = true
        }
      } else if (next.delete(id)) {
        changed = true
      }
    }

    if (changed) {
      activeTocIds.value = [...next]
    }
  }

  const callback: IntersectionObserverCallback = entries => {
    pendingEntries.push(...entries)
    if (!rafId) {
      rafId = requestAnimationFrame(flush)
    }
  }

  observer = new IntersectionObserver(callback, options)

  // Query only by id for known TOC headings (faster than scanning all h2–h6).
  for (const id of allowedIds) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
}

function onTocClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  const anchor = target?.closest?.('a.toc-link') as HTMLAnchorElement | null
  if (!anchor) return

  const href = anchor.getAttribute('href') || ''
  if (!href.startsWith('#')) return

  const id = decodeURIComponent(href.slice(1))
  if (!id) return

  // Always intercept when smooth or offset is configured so scroll position is correct.
  if (!smoothEnabled.value && resolvedScrollOffset.value === 0) {
    return
  }

  event.preventDefault()
  scrollToHeading(id, {
    smooth: smoothEnabled.value,
    offset: resolvedScrollOffset.value,
  })
}

onMounted(() => {
  nextTick(() => observeSections(true))
})

onUnmounted(() => {
  disconnectObserver()
})

watch([observedIdsKey, resolvedRootMargin, scrollSpyEnabled, hasLinks], async () => {
  if (!import.meta.client) return
  await nextTick()
  observeSections()
})
</script>

<style>
.nuxt-toc {
  color: inherit;
}

.nuxt-toc--pending,
.nuxt-toc--empty {
  opacity: 0.75;
  font-size: 0.9em;
}

.nuxt-toc--empty code {
  font-size: 0.9em;
}

.nuxt-toc .active-toc-item {
  color: #fef08a;
}

.nuxt-toc .toc-sublist-item {
  padding-left: 1rem;
}

.nuxt-toc .toc-sublist .toc-sublist .toc-sublist-item {
  padding-left: 1.5rem;
}

.nuxt-toc a.toc-link {
  text-decoration: none;
  color: inherit;
}

.nuxt-toc ul,
.nuxt-toc ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
