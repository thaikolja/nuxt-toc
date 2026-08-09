<template>
  <ul
    :id="root ? 'toc-container' : undefined"
    :class="root ? undefined : 'toc-sublist'"
    role="list"
    :aria-labelledby="root ? 'toc-title' : undefined"
  >
    <li
      v-for="link in links"
      :key="link.id || link.text"
      :class="root ? 'toc-topitem-and-sublist' : undefined"
      role="listitem"
    >
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
        <a
          :href="`#${link.id}`"
          class="toc-link"
          :class="root ? 'toc-toplink' : 'toc-sublink'"
          role="link"
          >{{ link.text }}</a
        >
      </div>

      <TocTree
        v-if="link.children?.length && level < maxDepth"
        :links="link.children"
        :level="level + 1"
        :max-depth="maxDepth"
        :is-active="isActive"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { TocLink } from '../types'
import { computed } from 'vue'

const props = defineProps<{
  links: TocLink[]
  level?: number
  maxDepth: number
  root?: boolean
  isActive: (id: string) => boolean
}>()

const level = computed(() => props.level ?? 1)
const root = computed(() => props.root ?? false)
const ariaLevel = computed(() => Math.min(6, 2 + level.value))
</script>
