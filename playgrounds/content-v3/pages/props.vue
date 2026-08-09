<script setup lang="ts">
const { data: page } = await useAsyncData('props-demo-v3', () =>
  queryCollection('content').path('/props-demo').first(),
)

const { data: emptyPage } = await useAsyncData('empty-v3', () =>
  queryCollection('content').path('/empty').first(),
)

const title = ref('Custom TOC title')
const showSublist = ref(true)
const showTitleWhenEmpty = ref(true)
</script>

<template>
  <div class="page">
    <article class="content">
      <h1>Custom parameters (Content v3)</h1>
      <p class="note">
        Toggle props and confirm SSR + client behavior. Content path:
        <code>/props-demo</code>.
      </p>

      <div class="controls">
        <label>
          title
          <input v-model="title" type="text" />
        </label>
        <label class="check">
          <input v-model="showSublist" type="checkbox" />
          isSublistShown
        </label>
        <label class="check">
          <input v-model="showTitleWhenEmpty" type="checkbox" />
          isTitleShownWithNoContent
        </label>
      </div>

      <h2 id="live-preview" class="section-label">Live preview (pass-in :toc)</h2>
      <ContentRenderer v-if="page" :value="page" />

      <h2 id="empty-preview" class="section-label">Empty TOC + title flag</h2>
      <ContentRenderer v-if="emptyPage" :value="emptyPage" />
    </article>

    <aside class="toc-column">
      <section class="panel">
        <p class="panel-label">:toc + custom title / sublist</p>
        <TableOfContents :toc="page?.body?.toc" :title="title" :is-sublist-shown="showSublist" />
      </section>

      <section class="panel">
        <p class="panel-label">path="/props-demo") auto-fetch</p>
        <TableOfContents path="/props-demo" :title="title" :is-sublist-shown="showSublist" />
      </section>

      <section class="panel">
        <p class="panel-label">empty :toc + isTitleShownWithNoContent</p>
        <TableOfContents
          :toc="emptyPage?.body?.toc ?? { links: [] }"
          title="Still show me"
          :is-title-shown-with-no-content="showTitleWhenEmpty"
        />
      </section>

      <section class="panel">
        <p class="panel-label">collection override (default content)</p>
        <TableOfContents path="/props-demo" collection="content" title="Collection content" />
      </section>
    </aside>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18rem;
  gap: 1.5rem;
  align-items: start;
}

.note {
  color: #94a3b8;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0 1.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  background: #0f172a;
}

.controls label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #cbd5e1;
}

.controls .check {
  flex-direction: row;
  align-items: center;
}

.controls input[type='text'] {
  min-width: 14rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.35rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #f8fafc;
}

.section-label {
  margin-top: 2rem;
  font-size: 1.1rem;
}

.toc-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
}

.panel {
  padding: 0.85rem 1rem;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  background: #111827;
  color: #e2e8f0;
  font-size: 0.88rem;
}

.panel-label {
  margin: 0 0 0.65rem;
  color: #94a3b8;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.content :deep(h2),
.content :deep(h3) {
  scroll-margin-top: 1rem;
}

@media (max-width: 960px) {
  .page {
    grid-template-columns: 1fr;
  }

  .toc-column {
    position: static;
    max-height: none;
  }
}
</style>
