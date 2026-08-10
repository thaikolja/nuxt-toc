/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { scrollToHeading } from '../src/runtime/utils/scroll-to-heading'

describe('scrollToHeading', () => {
  const scrollTo = vi.fn()
  const replaceState = vi.fn()

  beforeEach(() => {
    scrollTo.mockReset()
    replaceState.mockReset()
    vi.stubGlobal('scrollTo', scrollTo)
    vi.stubGlobal('history', { replaceState })
    document.body.innerHTML = '<h2 id="section-a" style="margin-top:200px">A</h2>'
    // jsdom/node may not have layout; getBoundingClientRect mocked
    const el = document.getElementById('section-a')!
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 120,
      bottom: 140,
      left: 0,
      right: 0,
      width: 0,
      height: 20,
      x: 0,
      y: 120,
      toJSON: () => ({}),
    })
    Object.defineProperty(window, 'scrollY', { value: 50, configurable: true })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  it('scrolls to element with offset and smooth behavior', () => {
    scrollToHeading('section-a', { offset: 20, smooth: true })
    expect(scrollTo).toHaveBeenCalledWith({
      top: 150, // 120 + 50 - 20
      behavior: 'smooth',
    })
    expect(replaceState).toHaveBeenCalled()
  })

  it('no-ops for missing ids', () => {
    scrollToHeading('missing')
    expect(scrollTo).not.toHaveBeenCalled()
  })
})
