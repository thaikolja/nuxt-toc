import { describe, it, expect } from 'vitest'
import { limitTocDepth, resolveEffectiveDepth } from '../src/runtime/utils/limit-toc-depth'
import type { Toc } from '../src/runtime/types'

const sample: Toc = {
  links: [
    {
      id: 'a',
      text: 'A',
      children: [
        {
          id: 'a1',
          text: 'A1',
          children: [{ id: 'a1a', text: 'A1a' }],
        },
        { id: 'a2', text: 'A2' },
      ],
    },
    {
      id: 'b',
      text: 'B',
      children: [{ id: 'b1', text: 'B1' }],
    },
  ],
}

describe('limitTocDepth', () => {
  it('returns null/empty as-is', () => {
    expect(limitTocDepth(null, 2)).toBe(null)
    expect(limitTocDepth({ links: [] }, 2)).toEqual({ links: [] })
  })

  it('depth 1 keeps top-level only', () => {
    const result = limitTocDepth(sample, 1)!
    const [first, second] = result.links
    expect(result.links).toHaveLength(2)
    expect(first?.children).toBeUndefined()
    expect(second?.children).toBeUndefined()
    expect(result.links.map(l => l.id)).toEqual(['a', 'b'])
  })

  it('depth 2 keeps one nested level', () => {
    const result = limitTocDepth(sample, 2)!
    const first = result.links[0]!
    expect(first.children).toHaveLength(2)
    expect(first.children?.[0]?.children).toBeUndefined()
    expect(first.children?.map(c => c.id)).toEqual(['a1', 'a2'])
  })

  it('depth 3 keeps two nested levels', () => {
    const result = limitTocDepth(sample, 3)!
    expect(result.links[0]?.children?.[0]?.children).toEqual([{ id: 'a1a', text: 'A1a' }])
  })

  it('clamps depth below 1 to 1', () => {
    const result = limitTocDepth(sample, 0)!
    expect(result.links[0]?.children).toBeUndefined()
  })

  it('does not mutate the original tree', () => {
    limitTocDepth(sample, 1)
    expect(sample.links[0]?.children).toBeDefined()
    expect(sample.links[0]?.children?.[0]?.children).toBeDefined()
  })

  it('returns the same reference when depth already covers the tree', () => {
    const shallow: Toc = {
      links: [{ id: 'only', text: 'Only' }],
    }
    expect(limitTocDepth(shallow, 2)).toBe(shallow)
    expect(limitTocDepth(sample, 10)).toBe(sample)
  })
})

describe('resolveEffectiveDepth', () => {
  it('returns 1 when sublist is hidden', () => {
    expect(resolveEffectiveDepth(5, false)).toBe(1)
  })

  it('uses default when depth omitted', () => {
    expect(resolveEffectiveDepth(undefined, true)).toBe(2)
    expect(resolveEffectiveDepth(undefined, true, 3)).toBe(3)
  })

  it('floors finite depth values', () => {
    expect(resolveEffectiveDepth(2.9, true)).toBe(2)
    expect(resolveEffectiveDepth(1, true)).toBe(1)
  })
})
