<script setup lang="ts">
const route = useRoute()

// Content for this route lives at content/auto-fetch.md (path: /auto-fetch).
// TableOfContents auto-fetches the same path via queryCollection (no :toc prop).
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
</script>

<template>
  <div class="page">
    <article class="content">
      <p class="note">
        Auto-fetch demo (Content v3):
        <code>&lt;TableOfContents /&gt;</code>
        has no
        <code>:toc</code>
        prop — it loads TOC with
        <code>queryCollection</code>
        for
        <code>{{ route.path }}</code
        >.
      </p>
      <ContentRenderer v-if="page" :value="page" />
      <p v-else class="note">
        Content not found for <code>{{ route.path }}</code
        >.
      </p>
    </article>

    <aside class="toc">
      <TableOfContents />
    </aside>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16rem;
  gap: 2rem;
  align-items: start;
}

.note {
  color: #94a3b8;
  font-size: 0.95rem;
}

.content :deep(h2),
.content :deep(h3) {
  scroll-margin-top: 1rem;
}

.toc {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: 1rem;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  background: #111827;
  color: #e2e8f0;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .page {
    grid-template-columns: 1fr;
  }
}
</style>
