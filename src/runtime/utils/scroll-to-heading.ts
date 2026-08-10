/**
 * Programmatic scroll helpers for TOC link clicks.
 *
 * @module runtime/utils/scroll-to-heading
 */

/**
 * Options for {@link scrollToHeading}.
 */
export interface ScrollToHeadingOptions {
  /**
   * Pixels to subtract from the target top (e.g. sticky header height).
   * @default 0
   */
  offset?: number

  /**
   * Whether to use smooth scrolling.
   * @default false
   */
  smooth?: boolean
}

/**
 * Scroll the window so the element with `id` sits near the top (minus offset).
 *
 * Also updates the URL hash via `history.replaceState` when available, so we
 * don't get a second native jump from setting `location.hash`.
 *
 * No-ops on the server or when the element is missing.
 *
 * @param id - Element id (without `#`)
 * @param options - Offset / smooth flags
 */
export function scrollToHeading(id: string, options: ScrollToHeadingOptions = {}): void {
  // Skip on SSR or empty ids.
  if (typeof window === 'undefined' || typeof document === 'undefined' || !id) {
    return
  }

  // Find the heading in the page.
  const el = document.getElementById(id)

  // Nothing to do if Content didn't render that id.
  if (!el) {
    return
  }

  // How far below the top we want the heading to land.
  const offset = options.offset ?? 0

  // Document Y of the element, then pull back by the sticky offset.
  const top = el.getBoundingClientRect().top + window.scrollY - offset

  // Scroll the window (never negative).
  window.scrollTo({
    top: Math.max(0, top),
    behavior: options.smooth ? 'smooth' : 'auto',
  })

  // Prefer replaceState so the hash updates without an extra jump.
  if (history.replaceState) {
    // Update the hash quietly.
    history.replaceState(null, '', `#${id}`)
  } else {
    // Older browsers: fall back to the classic hash assignment.
    location.hash = id
  }
}
