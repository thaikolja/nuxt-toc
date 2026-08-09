<script setup lang="ts">
const { data: page } = await useAsyncData('settings-deep-v2', () => queryContent('/deep').findOne())

const title = ref('On this page')
const depth = ref(2)
const showSublist = ref(true)
const showTitleWhenEmpty = ref(false)
const scrollSpy = ref(true)
const smooth = ref(true)
const scrollOffset = ref(16)
const activeColor = ref('#fde047')
const indent = ref(1)
const fontSize = ref(0.9)
const borderHighlight = ref(true)
</script>

<template>
  <div class="page">
    <article class="content">
      <h1>Module settings &amp; styling</h1>
      <p class="note">
        Live controls for <code>TableOfContents</code> props and CSS. Content:
        <code>/deep</code> (nested headings). Module defaults come from <code>nuxtToc</code> in
        <code>nuxt.config.ts</code>.
      </p>

      <div class="panel controls">
        <h2 class="panel-title">Props</h2>
        <label>
          title
          <input v-model="title" type="text" />
        </label>
        <label>
          depth ({{ depth }})
          <input v-model.number="depth" type="range" min="1" max="4" step="1" />
        </label>
        <label class="check">
          <input v-model="showSublist" type="checkbox" />
          isSublistShown
        </label>
        <label class="check">
          <input v-model="showTitleWhenEmpty" type="checkbox" />
          isTitleShownWithNoContent
        </label>
        <label class="check">
          <input v-model="scrollSpy" type="checkbox" />
          scrollSpy
        </label>
        <label class="check">
          <input v-model="smooth" type="checkbox" />
          smooth
        </label>
        <label>
          scrollOffset ({{ scrollOffset }}px)
          <input v-model.number="scrollOffset" type="range" min="0" max="120" step="8" />
        </label>
        <p class="hint">
          Effective depth is <strong>{{ showSublist ? depth : 1 }}</strong> (<code
            >isSublistShown=false</code
          >
          forces depth 1). Click TOC links to try smooth + offset.
        </p>
      </div>

      <div class="panel controls">
        <h2 class="panel-title">Styling</h2>
        <label>
          active color
          <input v-model="activeColor" type="color" />
        </label>
        <label>
          nested indent (rem): {{ indent }}
          <input v-model.number="indent" type="range" min="0.5" max="2.5" step="0.25" />
        </label>
        <label>
          font size (rem): {{ fontSize }}
          <input v-model.number="fontSize" type="range" min="0.75" max="1.25" step="0.05" />
        </label>
        <label class="check">
          <input v-model="borderHighlight" type="checkbox" />
          left border on active
        </label>
      </div>

      <ContentRenderer v-if="page" :value="page" />
    </article>

    <aside
      class="toc-panel"
      :style="{
        '--toc-active': activeColor,
        '--toc-indent': `${indent}rem`,
        '--toc-size': `${fontSize}rem`,
      }"
      :class="{ 'toc-panel--border': borderHighlight }"
    >
      <p class="panel-label">Live TOC</p>
      <TableOfContents
        :toc="page?.body?.toc"
        :title="title"
        :depth="depth"
        :is-sublist-shown="showSublist"
        :is-title-shown-with-no-content="showTitleWhenEmpty"
        :scroll-spy="scrollSpy"
        :smooth="smooth"
        :scroll-offset="scrollOffset"
      />
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

.panel {
  margin: 1rem 0 1.5rem;
  padding: 1rem;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  background: #0f172a;
}

.panel-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.controls label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #cbd5e1;
  min-width: 10rem;
}

.controls .check {
  flex-direction: row;
  align-items: center;
}

.controls input[type='text'] {
  min-width: 12rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.35rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #f8fafc;
}

.hint {
  width: 100%;
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

.toc-panel {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: 1rem;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  background: #1e293b;
  color: #e2e8f0;
  font-size: var(--toc-size, 0.9rem);
}

.panel-label {
  margin: 0 0 0.65rem;
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.toc-panel :deep(.active-toc-item) {
  color: var(--toc-active, #fde047) !important;
  font-weight: 600;
}

.toc-panel :deep(.toc-sublist-item) {
  padding-left: var(--toc-indent, 1rem);
}

.toc-panel--border :deep(.toc-item) {
  border-left: 2px solid transparent;
  padding-left: 0.4rem;
}

.toc-panel--border :deep(.active-toc-item) {
  border-left-color: var(--toc-active, #fde047);
}

.content :deep(h2),
.content :deep(h3),
.content :deep(h4) {
  scroll-margin-top: 1rem;
}

@media (max-width: 960px) {
  .page {
    grid-template-columns: 1fr;
  }

  .toc-panel {
    position: static;
    max-height: none;
  }
}
</style>
