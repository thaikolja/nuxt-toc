<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
</script>

<template>
  <div class="page">
    <article class="content">
      <ContentRenderer v-if="page" :value="page" />
      <p v-else>Content not found.</p>
    </article>

    <aside class="toc">
      <TableOfContents :toc="page?.body?.toc" />
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

.content :deep(h2),
.content :deep(h3) {
  scroll-margin-top: 1rem;
}

.content :deep(h2) {
  margin-top: 2rem;
}

.content :deep(h3) {
  margin-top: 1.25rem;
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

  .toc {
    position: static;
    order: -1;
  }
}
</style>
