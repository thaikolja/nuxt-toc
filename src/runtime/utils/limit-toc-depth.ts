import type { Toc, TocLink } from '../types'

/**
 * Limit how deep nested TOC links are kept.
 *
 * - `depth = 1`: top-level links only (no children)
 * - `depth = 2`: top-level + one nested level (default, typical h2 + h3)
 * - `depth = 3+`: further nested levels when present
 *
 * Values below 1 are treated as 1.
 */
export function limitTocDepth(toc: Toc | null, depth: number): Toc | null {
  if (!toc?.links?.length) {
    return toc
  }

  const maxDepth = Number.isFinite(depth) ? Math.max(1, Math.floor(depth)) : 1

  return {
    links: toc.links.map(link => trimLink(link, 1, maxDepth)),
  }
}

function trimLink(link: TocLink, level: number, maxDepth: number): TocLink {
  const next: TocLink = {
    id: link.id,
    text: link.text,
  }

  if (link.depth != null) {
    next.depth = link.depth
  }

  if (level < maxDepth && link.children?.length) {
    next.children = link.children.map(child => trimLink(child, level + 1, maxDepth))
  }

  return next
}

/**
 * Effective display depth from `depth` + legacy `isSublistShown`.
 * When sublists are disabled, depth collapses to 1.
 */
export function resolveEffectiveDepth(
  depth: number | undefined,
  isSublistShown: boolean,
  defaultDepth = 2,
): number {
  if (!isSublistShown) {
    return 1
  }
  if (depth == null || !Number.isFinite(depth)) {
    return defaultDepth
  }
  return Math.max(1, Math.floor(depth))
}
