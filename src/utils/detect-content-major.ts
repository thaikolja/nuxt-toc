import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export type ContentMajor = 2 | 3

/**
 * Detect installed @nuxt/content major version from the host app.
 * Walks up from rootDir so nested playgrounds resolve hoisted node_modules.
 * Reads package.json from disk (exports map often blocks require('.../package.json')).
 */
export function detectContentMajor(rootDir: string): ContentMajor | null {
  let dir = rootDir
  for (let i = 0; i < 8; i++) {
    const pkgPath = join(dir, 'node_modules', '@nuxt', 'content', 'package.json')
    if (existsSync(pkgPath)) {
      try {
        const { version } = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string }
        const major = Number(String(version ?? '').split('.')[0])
        if (major === 2 || major === 3) {
          return major
        }
      }
      catch {
        return null
      }
    }
    const parent = dirname(dir)
    if (parent === dir) {
      break
    }
    dir = parent
  }
  return null
}
