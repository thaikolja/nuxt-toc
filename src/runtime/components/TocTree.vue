<!--
  Recursive TOC list renderer.
  Renders one level of links and nests itself for children up to maxDepth.
-->
<template>
  <!-- Root list gets the public #toc-container id; nested lists get .toc-sublist -->
  <ul
    :id="root ? listId : undefined"
    :class="root ? undefined : 'toc-sublist'"
    role="list"
    :aria-labelledby="root ? titleId : undefined"
  >
    <!-- One list item per TOC link at this level -->
    <li
      v-for="link in links"
      :key="link.id || link.text"
      :class="root ? 'toc-topitem-and-sublist' : undefined"
      role="listitem"
    >
      <!-- Heading row + anchor for this link -->
      <div
        :id="`toc-item-${link.id}`"
        class="toc-item"
        :class="[
          root ? 'toc-topitem' : 'toc-sublist-item',
          {
            'active-toc-item': isActive(link.id),
            'active-toc-topitem': root && isActive(link.id),
            'active-toc-sublist-item': !root && isActive(link.id),
          },
        ]"
        role="heading"
        :aria-level="ariaLevel"
      >
        <!-- Jump link to the page heading with the same id -->
        <a
          :href="`#${link.id}`"
          class="toc-link"
          :class="root ? 'toc-toplink' : 'toc-sublink'"
          role="link"
          >{{ link.text }}</a
        >
      </div>

      <!-- Recurse into children while we still have depth budget -->
      <TocTree
        v-if="link.children?.length && level < maxDepth"
        :links="link.children"
        :level="level + 1"
        :max-depth="maxDepth"
        :is-active="isActive"
        :title-id="titleId"
        :list-id="listId"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
/**
 * Recursive tree used by `TableOfContents` to paint nested links.
 */

// Link node type from shared runtime types.
import type { TocLink } from '../types'
// Vue computed helper.
import { computed } from 'vue'

/**
 * Props for one level of the TOC tree.
 */
const props = defineProps<{
  /** Links to render at this level. */
  links: TocLink[]
  /**
   * Current depth in the tree (1 = top / root list).
   * @default 1
   */
  level?: number
  /** Inclusive max depth; children stop when `level >= maxDepth`. */
  maxDepth: number
  /**
   * Whether this instance is the outer list.
   * @default false
   */
  root?: boolean
  /** Active-state checker from the parent (IntersectionObserver driven). */
  isActive: (id: string) => boolean
  /** Title element id for aria-labelledby (public contract: `toc-title`). */
  titleId: string
  /** Root list id (public contract: `toc-container`). */
  listId: string
}>()

// Resolve level with a default of 1 for the root call.
const level = computed(() => props.level ?? 1)

// Resolve root flag (only the outer list is root).
const root = computed(() => props.root ?? false)

// Map tree level to an aria-level, capped at 6 for a11y sanity.
const ariaLevel = computed(() => Math.min(6, 2 + level.value))
</script>
