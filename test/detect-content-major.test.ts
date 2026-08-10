import { describe, it, expect, beforeAll } from 'vitest'
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { detectContentMajor } from '../src/utils/detect-content-major'

describe('detectContentMajor', () => {
  beforeAll(() => {
    // Playgrounds install their own Content majors under playgrounds/*/node_modules
  })

  it('detects Content v3 from the v3 playground after install', () => {
    const root = join(process.cwd(), 'playgrounds/content-v3')
    if (!existsSync(join(root, 'node_modules/@nuxt/content/package.json'))) {
      // Skip gracefully if playgrounds not installed yet
      expect(detectContentMajor(root)).toBeNull()
      return
    }
    expect(detectContentMajor(root)).toBe(3)
  })

  it('detects Content v2 from the v2 playground after install', () => {
    const root = join(process.cwd(), 'playgrounds/content-v2')
    if (!existsSync(join(root, 'node_modules/@nuxt/content/package.json'))) {
      expect(detectContentMajor(root)).toBeNull()
      return
    }
    expect(detectContentMajor(root)).toBe(2)
  })

  it('returns null when content is not installed in a fake root', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nuxt-toc-'))
    try {
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'fake', private: true }))
      expect(detectContentMajor(dir)).toBe(null)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('returns 2 when a fake content v2 package is present', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nuxt-toc-v2-'))
    try {
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'fake', private: true }))
      const contentDir = join(dir, 'node_modules', '@nuxt', 'content')
      mkdirSync(contentDir, { recursive: true })
      writeFileSync(
        join(contentDir, 'package.json'),
        JSON.stringify({ name: '@nuxt/content', version: '2.13.4' }),
      )
      expect(detectContentMajor(dir)).toBe(2)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('returns 3 when a fake content v3 package is present', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nuxt-toc-v3-'))
    try {
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'fake', private: true }))
      const contentDir = join(dir, 'node_modules', '@nuxt', 'content')
      mkdirSync(contentDir, { recursive: true })
      writeFileSync(
        join(contentDir, 'package.json'),
        JSON.stringify({ name: '@nuxt/content', version: '3.15.2' }),
      )
      expect(detectContentMajor(dir)).toBe(3)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
