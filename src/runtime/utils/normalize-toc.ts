import type { Toc } from '../types'

/**
 * Normalize TOC from Content v2/v3 document shapes.
 */
export function normalizeToc(doc: unknown): Toc | null {
  if (!doc || typeof doc !== 'object') {
    return null
  }

  const record = doc as Record<string, unknown>

  // Prefetched toc prop shape: { links: [...] }
  if (isToc(record)) {
    return record
  }

  // Full document: body.toc (v2 + v3)
  const body = record.body
  if (body && typeof body === 'object') {
    const bodyToc = (body as Record<string, unknown>).toc
    if (isToc(bodyToc)) {
      return bodyToc
    }
  }

  // Rare: toc on document root
  if (isToc(record.toc)) {
    return record.toc
  }

  return null
}

function isToc(value: unknown): value is Toc {
  return !!value && typeof value === 'object' && Array.isArray((value as Toc).links)
}
