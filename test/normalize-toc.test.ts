import { describe, it, expect } from 'vitest'
import { normalizeToc } from '../src/runtime/utils/normalize-toc'

describe('normalizeToc', () => {
  it('returns null for empty input', () => {
    expect(normalizeToc(null)).toBe(null)
    expect(normalizeToc(undefined)).toBe(null)
    expect(normalizeToc({})).toBe(null)
  })

  it('accepts a plain toc object', () => {
    const toc = { links: [{ id: 'a', text: 'A' }] }
    expect(normalizeToc(toc)).toEqual(toc)
  })

  it('reads body.toc from a document', () => {
    const toc = {
      links: [
        {
          id: 'a',
          text: 'A',
          children: [{ id: 'b', text: 'B' }],
        },
      ],
    }
    expect(normalizeToc({ body: { toc } })).toEqual(toc)
  })

  it('accepts empty links array', () => {
    expect(normalizeToc({ links: [] })).toEqual({ links: [] })
  })
})
