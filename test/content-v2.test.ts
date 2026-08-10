import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('playground content-v2 (Nuxt 4 + @nuxt/content v2)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../playgrounds/content-v2', import.meta.url)),
  })

  it('renders page content and TOC from :toc prop', async () => {
    const html = await $fetch('/')
    expect(html).toContain('@nuxt/content')
    expect(html).toContain('v2')
    expect(html).toContain('Table of Contents')
    expect(html).toContain('Getting started')
    expect(html).toContain('id="toc-container"')
    expect(html).toContain('id="toc-title"')
  })

  it('renders auto-fetch TOC page', async () => {
    const html = await $fetch('/auto-fetch')
    expect(html).toContain('Auto-fetch demo')
    expect(html).toContain('Table of Contents')
    expect(html).toContain('id="toc-container"')
    expect(html).toContain('id="toc-title"')
  })

  it('renders custom props demo', async () => {
    const html = await $fetch('/props')
    expect(html).toContain('Custom parameters')
    expect(html).toContain('Custom TOC title')
    expect(html).toContain('Alpha section')
    expect(html).toContain('Still show me')
    expect(html).toContain('props-demo')
    expect(html).toContain('isSublistShown')
  })

  it('renders settings page with depth controls', async () => {
    const html = await $fetch('/settings')
    expect(html).toContain('Module settings')
    expect(html).toContain('depth')
    expect(html).toContain('Level one alpha')
    expect(html).toContain('Live TOC')
  })
})
