<template>
  <div
    v-if="showTitleOnly"
    class="nuxt-toc"
  >
    <span
      id="toc-title"
      role="heading"
      aria-level="2"
    >{{ title }}</span>
  </div>

  <div
    v-else-if="hasLinks"
    class="nuxt-toc"
  >
    <span
      id="toc-title"
      role="heading"
      aria-level="2"
    >{{ title }}</span>
    <ul
      id="toc-container"
      role="list"
      aria-labelledby="toc-title"
    >
      <li
        v-for="link in resolvedToc!.links"
        :key="link.id || link.text"
        class="toc-topitem-and-sublist"
        role="listitem"
      >
        <div
          :id="`toc-item-${link.id}`"
          class="toc-item toc-topitem"
          :class="{ 'active-toc-item active-toc-topitem': isActive(link.id) }"
          role="heading"
          aria-level="3"
        >
          <a
            :href="`#${link.id}`"
            class="toc-link toc-toplink"
            role="link"
          >{{ link.text }}</a>
        </div>

        <ul
          v-if="isSublistShown && link.children?.length"
          class="toc-sublist"
          role="list"
        >
          <li
            v-for="sublink in link.children"
            :key="sublink.id"
            class="toc-item toc-sublist-item"
            :class="{ 'active-toc-item active-toc-sublist-item': isActive(sublink.id) }"
            role="listitem"
            aria-level="4"
          >
            <a
              :href="`#${sublink.id}`"
              class="toc-link toc-sublink"
              role="link"
            >{{ sublink.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <div
    v-else-if="shouldAutoFetch && pending"
    class="nuxt-toc nuxt-toc--pending"
  >
    Loading table of contents…
  </div>

  <div
    v-else-if="shouldAutoFetch && !pending"
    class="nuxt-toc nuxt-toc--empty"
  >
    No table of contents found for
    <code>{{ resolvedPath }}</code>.
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Toc } from '../types'
import { normalizeToc } from '../utils/normalize-toc'
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
   * Prefetched TOC data. When set, the component does not fetch content itself
   * and the `path` / `collection` props are ignored for fetching.
   */
  toc: {
    type: Object as PropType<Toc | null>,
    default: null,
  },
  /**
   * Path of the content document to load TOC from.
   * Defaults to the current route path.
   */
  path: {
    type: String,
    default: '',
  },
  /**
   * Content collection name (Content v3 auto-fetch only).
   * Defaults to module option `nuxtToc.collection` or `'content'`.
   */
  collection: {
    type: String,
    default: '',
  },
  /**
   * When false, nested (h3) children are hidden.
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
})

/** Reactive active heading ids (replaced wholesale for Vue tracking). */
const activeTocIds = ref<string[]>([])
const lastVisibleHeading = ref<string>('')

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const nuxtApp = useNuxtApp()

let observer: IntersectionObserver | null = null

const resolvedPath = computed(() => {
  const raw = props.path || route.path || '/'
  if (raw.length > 1 && raw.endsWith('/')) {
    return raw.slice(0, -1)
  }
  return raw || '/'
})

const resolvedCollection = computed(
  () =>
    props.collection
    || (runtimeConfig.public.nuxtToc as { collection?: string } | undefined)?.collection
    || 'content',
)

const shouldAutoFetch = computed(() => props.toc == null)

const {
  data: fetchedPage,
  pending,
} = await useAsyncData(
  () => `nuxt-toc-${resolvedCollection.value}-${resolvedPath.value}`,
  async () => {
    if (!shouldAutoFetch.value) {
      return null
    }

    const fetchPage = nuxtApp.$nuxtTocFetch
    if (typeof fetchPage !== 'function') {
      if (import.meta.dev) {
        console.warn(
          '[nuxt-toc] Auto-fetch unavailable ($nuxtTocFetch missing). '
          + 'Is @nuxt/content installed? Or pass :toc instead.',
        )
      }
      return null
    }

    return await fetchPage(resolvedPath.value, resolvedCollection.value)
  },
  {
    watch: [resolvedPath, resolvedCollection, shouldAutoFetch],
    immediate: true,
  },
)

const resolvedToc = computed<Toc | null>(() => {
  if (props.toc != null) {
    return normalizeToc(props.toc)
  }
  return normalizeToc(fetchedPage.value)
})

const hasLinks = computed(() => !!resolvedToc.value?.links?.length)

const showTitleOnly = computed(
  () => !hasLinks.value && props.isTitleShownWithNoContent && !pending.value,
)

function isActive(id: string): boolean {
  return activeTocIds.value.includes(id) || id === lastVisibleHeading.value
}

function collectTocIds(toc: Toc | null): Set<string> {
  const ids = new Set<string>()
  if (!toc?.links) {
    return ids
  }
  for (const link of toc.links) {
    if (link.id) {
      ids.add(link.id)
    }
    for (const child of link.children ?? []) {
      if (child.id) {
        ids.add(child.id)
      }
    }
  }
  return ids
}

function disconnectObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

function observeSections() {
  if (!import.meta.client) {
    return
  }

  disconnectObserver()
  activeTocIds.value = []
  lastVisibleHeading.value = ''

  const allowedIds = collectTocIds(resolvedToc.value)

  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px -80% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  }

  const callback: IntersectionObserverCallback = (entries) => {
    let changed = false
    const next = new Set(activeTocIds.value)

    entries.forEach((entry) => {
      const id = entry.target.id
      if (!id) {
        return
      }
      if (entry.isIntersecting) {
        lastVisibleHeading.value = id
        if (!next.has(id)) {
          next.add(id)
          changed = true
        }
      }
      else if (next.delete(id)) {
        changed = true
      }
    })

    if (changed) {
      activeTocIds.value = [...next]
    }
  }

  observer = new IntersectionObserver(callback, options)

  const sections = document.querySelectorAll('h2[id], h3[id]')
  sections.forEach((section) => {
    if (allowedIds.size === 0 || allowedIds.has(section.id)) {
      observer!.observe(section)
    }
  })
}

onMounted(() => {
  nextTick(() => observeSections())
})

onUnmounted(() => {
  disconnectObserver()
})

watch(
  [resolvedToc, resolvedPath, () => props.isSublistShown],
  async () => {
    if (!import.meta.client) {
      return
    }
    await nextTick()
    observeSections()
  },
)
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
