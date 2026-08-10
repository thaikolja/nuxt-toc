/**
 * Helpers to turn Content documents (or plain TOC objects) into a `Toc`.
 *
 * @module runtime/utils/normalize-toc
 */

// Shared TOC shape used across the runtime.
import type { Toc } from '../types'

/**
 * Pull a usable TOC out of whatever the caller passed in.
 *
 * Accepts:
 * - a plain `{ links: [...] }` TOC object
 * - a full Content document with `body.toc`
 * - occasionally a document with top-level `toc`
 *
 * @param doc - Unknown value from a prop or a content query
 * @returns Normalized `Toc`, or `null` if nothing usable is found
 */
export function normalizeToc(doc: unknown): Toc | null {
  // Bail early on null/undefined/primitives.
  if (!doc || typeof doc !== 'object') {
    return null
  }

  // Treat the value as a generic object for field checks.
  const record = doc as Record<string, unknown>

  // Case 1: caller already passed a TOC (the `:toc` prop).
  if (isToc(record)) {
    return record
  }

  // Case 2: full document — look under `body.toc` (v2 + v3).
  const body = record.body
  // Only dig into body if it's an object.
  if (body && typeof body === 'object') {
    // Grab the nested toc field.
    const bodyToc = (body as Record<string, unknown>).toc
    // Validate shape before returning.
    if (isToc(bodyToc)) {
      return bodyToc
    }
  }

  // Case 3: rare — toc sitting on the document root.
  if (isToc(record.toc)) {
    return record.toc
  }

  // Nothing matched.
  return null
}

/**
 * Type guard: is this value a TOC with a `links` array?
 *
 * @param value - Candidate value
 * @returns Whether `value` looks like a `Toc`
 */
function isToc(value: unknown): value is Toc {
  // Need a non-null object with an array `links` field.
  return !!value && typeof value === 'object' && Array.isArray((value as Toc).links)
}
