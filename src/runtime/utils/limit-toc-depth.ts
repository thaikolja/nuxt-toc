/**
 * Truncate nested TOC trees so only N levels of links are shown.
 *
 * @module runtime/utils/limit-toc-depth
 */

// TOC types for the tree we walk/copy.
import type { Toc, TocLink } from '../types'

/**
 * Return a TOC limited to `depth` levels of nesting.
 *
 * - `depth = 1` → top-level links only (no children)
 * - `depth = 2` → top-level + one nested level (default h2 + h3)
 * - `depth = 3+` → deeper nesting when Content provides it
 *
 * Never mutates the original tree when truncating. If nothing would be cut,
 * returns the original reference (cheap short-circuit).
 *
 * @param toc - Source TOC (or null)
 * @param depth - Max levels to keep (values &lt; 1 become 1)
 * @returns TOC reference or a shallow-copied trimmed tree
 */
export function limitTocDepth(toc: Toc | null, depth: number): Toc | null {
  // Nothing to trim if there's no TOC or no links.
  if (!toc?.links?.length) {
    return toc
  }

  // Normalize depth to a positive integer (fallback to 1 if garbage).
  const maxDepth = Number.isFinite(depth) ? Math.max(1, Math.floor(depth)) : 1

  // If the tree is already shallow enough, skip cloning.
  if (!treeExceedsDepth(toc.links, 1, maxDepth)) {
    return toc
  }

  // Map every top-level link through the recursive trimmer starting at level 1.
  return {
    links: toc.links.map(link => trimLink(link, 1, maxDepth)),
  }
}

/**
 * True if any node sits deeper than `maxDepth`.
 *
 * @param links - Nodes at the current level
 * @param level - Current depth (1 = top)
 * @param maxDepth - Inclusive max allowed depth
 */
function treeExceedsDepth(links: TocLink[] | undefined, level: number, maxDepth: number): boolean {
  // Empty level cannot exceed depth.
  if (!links?.length) {
    return false
  }

  // Children at this level already mean we need room past `level`.
  for (const link of links) {
    // If we're at max depth but still have children, we must trim.
    if (level >= maxDepth && link.children?.length) {
      return true
    }
    // Recurse into the next level.
    if (treeExceedsDepth(link.children, level + 1, maxDepth)) {
      return true
    }
  }

  // Entire subtree fits within maxDepth.
  return false
}

/**
 * Copy one link and optionally its children up to `maxDepth`.
 *
 * @param link - Source link node
 * @param level - Current depth in the tree (1 = top)
 * @param maxDepth - Inclusive max level to keep
 * @returns A new link node (children omitted past max depth)
 */
function trimLink(link: TocLink, level: number, maxDepth: number): TocLink {
  // Always keep id + text on the copy.
  const next: TocLink = {
    id: link.id,
    text: link.text,
  }

  // Preserve Content's heading depth when present.
  if (link.depth != null) {
    next.depth = link.depth
  }

  // Only attach children if we still have budget for another level.
  if (level < maxDepth && link.children?.length) {
    // Recurse into each child one level deeper.
    next.children = link.children.map(child => trimLink(child, level + 1, maxDepth))
  }

  // Hand back the trimmed node.
  return next
}

/**
 * Combine the `depth` prop/option with legacy `isSublistShown`.
 *
 * When sublists are off, effective depth is always `1`.
 *
 * @param depth - Optional explicit depth from prop/config
 * @param isSublistShown - Legacy flag; `false` forces depth 1
 * @param defaultDepth - Fallback when depth is missing/invalid (default 2)
 * @returns A positive integer depth to pass into {@link limitTocDepth}
 */
export function resolveEffectiveDepth(
  depth: number | undefined,
  isSublistShown: boolean,
  defaultDepth = 2,
): number {
  // Legacy switch: hide all nested lists.
  if (!isSublistShown) {
    return 1
  }

  // Missing/NaN depth → use the default.
  if (depth == null || !Number.isFinite(depth)) {
    return defaultDepth
  }

  // Floor and clamp so we never return 0 or fractions.
  return Math.max(1, Math.floor(depth))
}
