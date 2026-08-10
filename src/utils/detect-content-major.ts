/**
 * Detect which major version of `@nuxt/content` the host app has installed.
 *
 * @module utils/detect-content-major
 */

// Node helpers for walking the filesystem and reading package.json.
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

/**
 * Supported Content package major versions for this module.
 */
export type ContentMajor = 2 | 3

/**
 * Walk up from `rootDir` and find `@nuxt/content`'s major version.
 *
 * We read `package.json` from disk on purpose: package `exports` often block
 * `require('@nuxt/content/package.json')`. Walking parents also covers hoisted
 * installs (e.g. playgrounds that depend on a parent `node_modules`).
 *
 * @param rootDir - App root (usually `nuxt.options.rootDir`)
 * @returns `2`, `3`, or `null` if Content is missing / unreadable / unsupported
 *
 * @example
 * ```ts
 * const major = detectContentMajor(nuxt.options.rootDir)
 * if (major === 3) addPlugin(fetchV3)
 * ```
 */
export function detectContentMajor(rootDir: string): ContentMajor | null {
  // Start at the app root and climb toward the filesystem root.
  let dir = rootDir

  // Cap the walk so we never loop forever on odd path setups.
  for (let i = 0; i < 8; i++) {
    // Build the path to Content's package.json under this directory.
    const pkgPath = join(dir, 'node_modules', '@nuxt', 'content', 'package.json')

    // Only try to parse if the file actually exists here.
    if (existsSync(pkgPath)) {
      try {
        // Read and parse the package manifest as JSON.
        const { version } = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string }

        // Take the major segment from a semver string like "3.15.2".
        const major = Number(String(version ?? '').split('.')[0])

        // Only 2 and 3 are wired up with fetch plugins.
        if (major === 2 || major === 3) {
          return major
        }
      } catch {
        // Bad JSON or unreadable file — treat as "not found".
        return null
      }
    }

    // Move one directory up.
    const parent = dirname(dir)

    // Stop when dirname no longer changes (we've hit the root).
    if (parent === dir) {
      break
    }

    // Continue the walk from the parent.
    dir = parent
  }

  // No usable Content package found along the path.
  return null
}
