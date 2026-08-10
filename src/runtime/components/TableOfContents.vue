<!--
  Public <TableOfContents /> component.
  Renders a nested TOC, optional auto-fetch, and client scroll-spy.
-->
<template>
  <!-- Title-only mode when there are no links but the user asked to keep the title -->
  <div v-if="showTitleOnly" class="nuxt-toc">
    <span :id="titleId" role="heading" aria-level="2">{{ title }}</span>
  </div>

  <!-- Happy path: we have links to show -->
  <div v-else-if="hasLinks" class="nuxt-toc" @click="onTocClick">
    <!-- Visible heading above the list -->
    <span :id="titleId" role="heading" aria-level="2">{{ title }}</span>
    <!-- Recursive list (handles nesting + active classes) -->
    <TocTree
      :links="displayToc!.links"
      :max-depth="effectiveDepth"
      :is-active="isActive"
      :title-id="titleId"
      :list-id="listId"
      root
    />
  </div>

  <!-- Auto-fetch still in flight -->
  <div v-else-if="shouldAutoFetch && pending" class="nuxt-toc nuxt-toc--pending">
    Loading table of contents…
  </div>

  <!-- Auto-fetch threw (plugin returned null after error or missing helper) -->
  <div
    v-else-if="shouldAutoFetch && !pending && autoFetchFailed"
    class="nuxt-toc nuxt-toc--empty nuxt-toc--error"
  >
    Could not load table of contents for
    <code>{{ resolvedPath }}</code
    >.
  </div>

  <!-- Document loaded but has no heading links -->
  <div v-else-if="shouldAutoFetch && !pending && documentMissing" class="nuxt-toc nuxt-toc--empty">
    No content found for
    <code>{{ resolvedPath }}</code
    >.
  </div>

  <!-- Document present, TOC empty (no h2/h3 etc.) -->
  <div v-else-if="shouldAutoFetch && !pending && emptyLinks" class="nuxt-toc nuxt-toc--empty">
    No headings found for
    <code>{{ resolvedPath }}</code
    >.
  </div>
</template>

<script setup lang="ts">
/**
 * Table of Contents for `@nuxt/content` documents.
 *
 * @see Module options under `nuxtToc` in `nuxt.config.ts`
 */

// Vue prop typing helper + reactivity / lifecycle (avoid `#imports` for vue-tsc).
import { type PropType, ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
// Nuxt app composables (typed via `nuxt/app`, not generated `#imports`).
import { useRoute, useRuntimeConfig, useAsyncData, useNuxtApp } from 'nuxt/app'
// Shared TOC type.
import type { Toc } from '../types'
// Turn documents / plain objects into a Toc.
import { normalizeToc } from '../utils/normalize-toc'
// Truncate nested trees + resolve depth with legacy isSublistShown.
import { limitTocDepth, resolveEffectiveDepth } from '../utils/limit-toc-depth'
// Smooth / offset scroll for TOC clicks.
import { scrollToHeading } from '../utils/scroll-to-heading'
// Recursive list UI.
import TocTree from './TocTree.vue'

/**
 * Public component props.
 * Module defaults live on `runtimeConfig.public.nuxtToc` and apply when a prop is unset.
 */
const props = defineProps({
  /**
   * Prefetched TOC (`page.body.toc`). When set, auto-fetch is skipped.
   */
  toc: {
    type: Object as PropType<Toc | null>,
    default: null,
  },
  /**
   * Document path for auto-fetch (defaults to the current route path).
   */
  path: {
    type: String,
    default: '',
  },
  /**
   * Content **v3** collection name (ignored on v2).
   */
  collection: {
    type: String,
    default: '',
  },
  /**
   * Max nesting depth of the link tree (`1` = top-level only).
   * Falls back to module option `nuxtToc.depth` (default `2`).
   */
  depth: {
    type: Number,
    default: undefined,
  },
  /**
   * Legacy: when `false`, forces effective depth to `1`.
   */
  isSublistShown: {
    type: Boolean,
    default: true,
  },
  /**
   * Still render `title` when there are no TOC links.
   */
  isTitleShownWithNoContent: {
    type: Boolean,
    default: false,
  },
  /**
   * Text for the TOC heading.
   */
  title: {
    type: String,
    default: 'Table of Contents',
  },
  /**
   * Toggle IntersectionObserver active highlighting.
   * Falls back to `nuxtToc.scrollSpy` (default `true`).
   */
  scrollSpy: {
    type: Boolean,
    default: undefined,
  },
  /**
   * IntersectionObserver `rootMargin` (sticky header tuning).
   * Falls back to `nuxtToc.rootMargin`.
   */
  rootMargin: {
    type: String,
    default: undefined,
  },
  /**
   * Smooth-scroll when clicking a TOC link.
   * Falls back to `nuxtToc.smooth` (default `false`).
   */
  smooth: {
    type: Boolean,
    default: undefined,
  },
  /**
   * Pixel offset when scrolling to a heading (sticky header height).
   * Falls back to `nuxtToc.scrollOffset` (default `0`).
   */
  scrollOffset: {
    type: Number,
    default: undefined,
  },
})

// Stable public ids (styling contract — see docs/guide/styling.md).
// One TOC per page is the supported layout; ids match v2 consumers.
const titleId = 'toc-title'
const listId = 'toc-container'

// Heading ids currently intersecting the spy region (array so Vue tracks changes).
const activeTocIds = ref<string[]>([])
// Last heading that entered view — fallback when the set is empty mid-scroll.
const lastVisibleHeading = ref<string>('')
// True when auto-fetch helper was missing or threw (dev-logged in plugins).
const autoFetchFailed = ref(false)

// Current route (for default path).
const route = useRoute()
// Public runtime config (module defaults live here).
const runtimeConfig = useRuntimeConfig()
// Nuxt app — we read `$nuxtTocFetch` from here when auto-fetching.
const nuxtApp = useNuxtApp()

// Live IntersectionObserver instance (client only).
let observer: IntersectionObserver | null = null
// requestAnimationFrame id for batching spy updates.
let rafId = 0
// Debounced rebuild frame id.
let rebuildRafId = 0
// Cache key so we don't rebuild the observer for no reason.
let lastObservedKey = ''
// Late-heading retry handles (cleared on unmount).
const retryTimeouts: number[] = []

/**
 * Module defaults from `runtimeConfig.public.nuxtToc`.
 */
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

/**
 * Path we will query: prop → route → `/`, with trailing slashes stripped.
 */
const resolvedPath = computed(() => {
  // Prefer explicit path, else current route.
  const raw = props.path || route.path || '/'
  // Drop a trailing slash (except for root `/`).
  if (raw.length > 1 && raw.endsWith('/')) {
    return raw.slice(0, -1)
  }
  // Final fallback.
  return raw || '/'
})

/**
 * Collection name for Content v3 auto-fetch.
 */
const resolvedCollection = computed(
  () => props.collection || nuxtTocPublic.value.collection || 'content',
)

/**
 * Depth after combining prop, module default, and `isSublistShown`.
 */
const effectiveDepth = computed(() =>
  resolveEffectiveDepth(props.depth ?? nuxtTocPublic.value.depth, props.isSublistShown, 2),
)

/**
 * Whether scroll-spy should run.
 */
const scrollSpyEnabled = computed(() =>
  props.scrollSpy === undefined ? nuxtTocPublic.value.scrollSpy !== false : props.scrollSpy,
)

/**
 * Observer root margin (sticky header / “active zone” tuning).
 */
const resolvedRootMargin = computed(
  () => props.rootMargin || nuxtTocPublic.value.rootMargin || '0px 0px -80% 0px',
)

/**
 * Whether link clicks should smooth-scroll.
 */
const smoothEnabled = computed(() =>
  props.smooth === undefined ? !!nuxtTocPublic.value.smooth : props.smooth,
)

/**
 * Non-negative pixel offset for click scrolling.
 */
const resolvedScrollOffset = computed(() => {
  // Prop wins, then module default, then 0.
  const value = props.scrollOffset ?? nuxtTocPublic.value.scrollOffset ?? 0
  // Floor + clamp so we never pass NaN or negatives into scroll math.
  return Math.max(0, Math.floor(Number(value) || 0))
})

/**
 * Auto-fetch only when the caller did not pass `:toc`.
 */
const shouldAutoFetch = computed(() => props.toc == null)

// Load the document when auto-fetch is on (keyed by collection + path).
const {
  data: fetchedPage,
  pending,
  error: asyncError,
} = await useAsyncData(
  // Cache key must change when path/collection change.
  () => `nuxt-toc-${resolvedCollection.value}-${resolvedPath.value}`,
  // Fetcher: no-op when pass-in toc is provided.
  async () => {
    // Reset failure flag for this attempt.
    autoFetchFailed.value = false

    // Pass-in mode: do not hit Content.
    if (!shouldAutoFetch.value) {
      return null
    }

    // Grab the plugin-provided fetch helper.
    const fetchPage = nuxtApp.$nuxtTocFetch
    // Missing plugin → warn in dev and show error empty state.
    if (typeof fetchPage !== 'function') {
      // Only noise the console during development.
      if (import.meta.dev) {
        console.warn(
          '[nuxt-toc] Auto-fetch unavailable ($nuxtTocFetch missing). ' +
            'Is @nuxt/content installed and registered in `modules`? Or pass `:toc` instead.',
        )
      }
      // Mark as failed so UI can differ from “no headings”.
      autoFetchFailed.value = true
      return null
    }

    // Ask Content for this path (and collection on v3).
    // null = not found or soft error (plugins already log failures in dev).
    return await fetchPage(resolvedPath.value, resolvedCollection.value)
  },
  {
    // Re-run when inputs change.
    watch: [resolvedPath, resolvedCollection, shouldAutoFetch],
    // Run on first setup.
    immediate: true,
    // Don't deep-track huge document bodies.
    deep: false,
  },
)

// useAsyncData hard errors also count as failed auto-fetch.
watch(
  asyncError,
  (err: Error | null | undefined) => {
    if (err && shouldAutoFetch.value) {
      autoFetchFailed.value = true
    }
  },
  { immediate: true },
)

/**
 * Raw TOC from prop or fetched document (not depth-limited yet).
 */
const resolvedToc = computed<Toc | null>(() => {
  // Prefer the explicit prop when the caller supplied one.
  if (props.toc != null) {
    return normalizeToc(props.toc)
  }
  // Otherwise peel toc out of the auto-fetched page.
  return normalizeToc(fetchedPage.value)
})

/**
 * TOC after applying `depth` / `isSublistShown` limits.
 */
const displayToc = computed(() => limitTocDepth(resolvedToc.value, effectiveDepth.value))

/**
 * Whether we have at least one link to render.
 */
const hasLinks = computed(() => !!displayToc.value?.links?.length)

/**
 * Auto-fetch finished with no document at this path.
 */
const documentMissing = computed(
  () =>
    shouldAutoFetch.value &&
    !pending.value &&
    !autoFetchFailed.value &&
    fetchedPage.value == null &&
    props.toc == null,
)

/**
 * Document (or pass-in toc) resolved but has zero heading links.
 */
const emptyLinks = computed(
  () =>
    !hasLinks.value &&
    !pending.value &&
    !autoFetchFailed.value &&
    (props.toc != null || fetchedPage.value != null),
)

/**
 * Title-only empty state (pass-in or finished auto-fetch with no links).
 */
const showTitleOnly = computed(
  () => !hasLinks.value && props.isTitleShownWithNoContent && !pending.value,
)

/**
 * Stable key of observed heading ids (cheap equality for observer rebuilds).
 */
const observedIdsKey = computed(() => {
  // Collect ids in tree order.
  const ids: string[] = []
  // Depth-first walk of the display tree.
  const walk = (links: Toc['links'] | undefined) => {
    // Nothing at this level.
    if (!links) return
    // Visit each node.
    for (const link of links) {
      // Keep ids we can spy on.
      if (link.id) ids.push(link.id)
      // Recurse into children.
      walk(link.children)
    }
  }
  // Start from the visible TOC.
  walk(displayToc.value?.links)
  // Join with a separator that won't appear in ids.
  return ids.join('\0')
})

/**
 * Set view of active ids for O(1) lookups in the template.
 */
const activeIdSet = computed(() => new Set(activeTocIds.value))

/**
 * Whether a TOC link should look active.
 *
 * @param id - Heading / link id
 */
function isActive(id: string): boolean {
  // Active if currently intersecting, or it was the last one we saw.
  return activeIdSet.value.has(id) || id === lastVisibleHeading.value
}

/**
 * Collect every id in a TOC tree into a Set.
 *
 * @param toc - TOC to walk
 */
function collectTocIds(toc: Toc | null): Set<string> {
  // Output set.
  const ids = new Set<string>()
  // Recursive walker.
  const walk = (links: Toc['links'] | undefined) => {
    // Empty level.
    if (!links) return
    // Visit each link.
    for (const link of links) {
      // Store non-empty ids.
      if (link.id) ids.add(link.id)
      // Continue into nested lists.
      walk(link.children)
    }
  }
  // Kick off the walk.
  walk(toc?.links)
  // Done.
  return ids
}

/**
 * Tear down the observer and any pending animation frames / retries.
 */
function disconnectObserver() {
  // Cancel a queued rAF flush if any.
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  // Cancel a debounced rebuild if any.
  if (rebuildRafId) {
    cancelAnimationFrame(rebuildRafId)
    rebuildRafId = 0
  }
  // Cancel late-heading retries.
  while (retryTimeouts.length) {
    const t = retryTimeouts.pop()
    if (t != null) clearTimeout(t)
  }
  // Disconnect the live observer.
  if (observer) {
    observer.disconnect()
    observer = null
  }
  // Clear the rebuild cache key.
  lastObservedKey = ''
}

/**
 * Schedule observeSections on the next frame (debounces rapid prop thrashing).
 *
 * @param force - Force rebuild even if the key is unchanged
 */
function scheduleObserveSections(force = false) {
  // SSR: nothing to schedule.
  if (!import.meta.client) return
  // Coalesce multiple schedule calls into one frame.
  if (rebuildRafId) cancelAnimationFrame(rebuildRafId)
  // Run after layout.
  rebuildRafId = requestAnimationFrame(() => {
    rebuildRafId = 0
    observeSections(force)
  })
}

/**
 * Warn in dev when TOC ids have no matching heading in the DOM.
 *
 * @param allowedIds - Ids we tried to observe
 * @param found - How many DOM nodes we attached to
 */
function warnMissingHeadingIds(allowedIds: Set<string>, found: number) {
  // Only in development, and only when something is missing.
  if (!import.meta.dev || found >= allowedIds.size) return
  // List which ids never showed up.
  const missing = [...allowedIds].filter(id => !document.getElementById(id))
  if (missing.length) {
    console.warn('[nuxt-toc] TOC links have no matching heading elements in the DOM:', missing)
  }
}

/**
 * If the URL hash matches a TOC id, mark it active (and offset-scroll if needed).
 */
function applyInitialHash() {
  // Need a browser + a hash + some TOC links.
  if (!import.meta.client || !hasLinks.value) return
  // Raw hash without '#'.
  const hash = decodeURIComponent(location.hash.replace(/^#/, ''))
  // Empty hash — nothing to do.
  if (!hash) return
  // Only act if this id is part of our TOC.
  const allowed = collectTocIds(displayToc.value)
  if (!allowed.has(hash)) return
  // Highlight immediately.
  lastVisibleHeading.value = hash
  activeTocIds.value = [hash]
  // When offset/smooth is configured, correct native jump position.
  if (smoothEnabled.value || resolvedScrollOffset.value > 0) {
    scrollToHeading(hash, {
      smooth: smoothEnabled.value,
      offset: resolvedScrollOffset.value,
    })
  }
}

/**
 * (Re)create the IntersectionObserver for the current TOC headings.
 *
 * @param force - Rebuild even if the observed-id key did not change
 */
function observeSections(force = false) {
  // Only run in the browser with spy enabled and links present.
  if (!import.meta.client || !scrollSpyEnabled.value || !hasLinks.value) {
    // Make sure we don't leave a stale observer around.
    disconnectObserver()
    // Clear active state (keep hash-applied active if any — re-apply after).
    activeTocIds.value = []
    lastVisibleHeading.value = ''
    return
  }

  // Key covers which ids we watch + the margin string.
  const key = `${observedIdsKey.value}|${resolvedRootMargin.value}`
  // Skip rebuild when nothing relevant changed.
  if (!force && key === lastObservedKey && observer) {
    return
  }

  // Drop the previous observer before creating a new one.
  if (observer) {
    observer.disconnect()
    observer = null
  }
  // Reset active ids for a clean slate (hash re-applied below).
  activeTocIds.value = []
  lastVisibleHeading.value = ''
  // Remember what this observer is bound to.
  lastObservedKey = key

  // Ids we care about (only these get observed).
  const allowedIds = collectTocIds(displayToc.value)
  // No targets → nothing to spy on.
  if (allowedIds.size === 0) {
    return
  }

  // Single threshold is cheaper than multi-threshold sampling for scroll-spy.
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: resolvedRootMargin.value,
    threshold: 0,
  }

  // Entries waiting for the next animation frame.
  let pendingEntries: IntersectionObserverEntry[] = []

  /**
   * Apply batched intersection results to reactive state.
   */
  const flush = () => {
    // Clear the scheduled frame id.
    rafId = 0
    // Snapshot and clear the buffer.
    const entries = pendingEntries
    pendingEntries = []
    // Nothing to do.
    if (!entries.length) return

    // Track whether we need to reassign the ref.
    let changed = false
    // Work on a mutable Set of current actives.
    const next = new Set(activeTocIds.value)

    // Apply each entry.
    for (const entry of entries) {
      // Target heading id.
      const id = (entry.target as HTMLElement).id
      // Skip nodes without ids.
      if (!id) continue
      // Entering the active zone.
      if (entry.isIntersecting) {
        // Remember as last-seen.
        lastVisibleHeading.value = id
        // Add if new.
        if (!next.has(id)) {
          next.add(id)
          changed = true
        }
      }
      // Leaving the active zone.
      else if (next.delete(id)) {
        changed = true
      }
    }

    // Only reassign when membership actually changed (Vue tracking).
    if (changed) {
      activeTocIds.value = [...next]
    }
  }

  /**
   * Queue observer entries and schedule a single rAF flush.
   */
  const callback: IntersectionObserverCallback = entries => {
    // Append to the batch.
    pendingEntries.push(...entries)
    // Schedule flush if one isn't already pending.
    if (!rafId) {
      rafId = requestAnimationFrame(flush)
    }
  }

  // Create the observer with our options + callback.
  observer = new IntersectionObserver(callback, options)

  // Count how many targets we actually found.
  let found = 0
  // Observe only known TOC heading nodes by id (fast path).
  for (const id of allowedIds) {
    // Resolve the DOM node.
    const el = document.getElementById(id)
    // Attach when present in the document.
    if (el) {
      observer.observe(el)
      found++
    }
  }

  // Dev-only: help catch id mismatches after Content render.
  warnMissingHeadingIds(allowedIds, found)

  // Re-apply URL hash highlight after rebuild.
  applyInitialHash()
}

/**
 * Retry observe a few times — headings sometimes mount after first paint.
 */
function scheduleLateHeadingRetries() {
  // Only on client with spy enabled.
  if (!import.meta.client || !scrollSpyEnabled.value) return
  // Clear previous retries.
  while (retryTimeouts.length) {
    const t = retryTimeouts.pop()
    if (t != null) clearTimeout(t)
  }
  // A couple of delayed force rebuilds (cheap if key unchanged after force…).
  for (const ms of [50, 200, 500]) {
    // Capture timeout handles for cleanup.
    const handle = window.setTimeout(() => {
      // Force so we re-query the DOM even if the id key is the same.
      observeSections(true)
    }, ms)
    retryTimeouts.push(handle)
  }
}

/**
 * Click handler for smooth / offset scrolling on TOC anchors.
 *
 * @param event - Click event from the TOC root
 */
function onTocClick(event: MouseEvent) {
  // Where the click landed.
  const target = event.target as HTMLElement | null
  // Walk up to the nearest TOC anchor if any.
  const anchor = target?.closest?.('a.toc-link') as HTMLAnchorElement | null
  // Not a TOC link — let the browser handle it.
  if (!anchor) return

  // Read href like "#section-id".
  const href = anchor.getAttribute('href') || ''
  // Only handle in-page hashes.
  if (!href.startsWith('#')) return

  // Decode the id portion.
  const id = decodeURIComponent(href.slice(1))
  // Empty hash — ignore.
  if (!id) return

  // If neither smooth nor offset is on, keep native anchor behavior.
  if (!smoothEnabled.value && resolvedScrollOffset.value === 0) {
    return
  }

  // Stop the default jump so we control the final position.
  event.preventDefault()
  // Scroll with the configured options.
  scrollToHeading(id, {
    smooth: smoothEnabled.value,
    offset: resolvedScrollOffset.value,
  })
}

// After mount, wait a tick for Content to render headings, then spy.
onMounted(() => {
  // nextTick ensures DOM nodes from ContentRenderer are present.
  nextTick(() => {
    // Initial spy setup.
    observeSections(true)
    // Hash landing (e.g. /page#section).
    applyInitialHash()
    // Headings that stream in slightly later.
    scheduleLateHeadingRetries()
  })
})

// Always clean up on unmount (registered in setup, not inside onMounted).
onUnmounted(() => {
  // Drop observer + rAF + retries.
  disconnectObserver()
})

// Rebuild the observer when the visible TOC or spy settings change.
watch([observedIdsKey, resolvedRootMargin, scrollSpyEnabled, hasLinks], async () => {
  // SSR: no DOM.
  if (!import.meta.client) return
  // Wait for DOM updates after reactive TOC changes.
  await nextTick()
  // Debounced rebuild (skips work if the key is unchanged).
  scheduleObserveSections()
})
</script>

<style>
/* Root wrapper — keeps default styles from leaking into the whole app */
.nuxt-toc {
  color: inherit;
}

/* Soft styles for loading / empty / error messages */
.nuxt-toc--pending,
.nuxt-toc--empty {
  opacity: 0.75;
  font-size: 0.9em;
}

/* Slightly smaller code chips in empty state */
.nuxt-toc--empty code {
  font-size: 0.9em;
}

/* Active item color (override in your app) */
.nuxt-toc .active-toc-item {
  color: #fef08a;
}

/* First-level nesting indent */
.nuxt-toc .toc-sublist-item {
  padding-left: 1rem;
}

/* Deeper nesting gets a bit more indent */
.nuxt-toc .toc-sublist .toc-sublist .toc-sublist-item {
  padding-left: 1.5rem;
}

/* TOC anchors inherit surrounding color by default */
.nuxt-toc a.toc-link {
  text-decoration: none;
  color: inherit;
}

/* Reset list chrome inside the TOC only */
.nuxt-toc ul,
.nuxt-toc ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
