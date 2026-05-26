import { describe, it, expect } from 'vitest'
import { isQuery } from '../intentDetector'

describe('isQuery', () => {
  it('returns true for text ending with ?', () => {
    expect(isQuery('what restaurants did I save?')).toBe(true)
  })

  it('returns true for "what" prefix', () => {
    expect(isQuery('what movies did I save')).toBe(true)
  })

  it('returns true for "find" prefix', () => {
    expect(isQuery('find my notes about design')).toBe(true)
  })

  it('returns true for "show" prefix', () => {
    expect(isQuery('show me all my links')).toBe(true)
  })

  it('returns true for "list" prefix', () => {
    expect(isQuery('list everything in restaurant')).toBe(true)
  })

  it('returns false for plain content to save', () => {
    expect(isQuery('Ramen shop in Seattle, great tonkotsu')).toBe(false)
  })

  it('returns false for a URL', () => {
    expect(isQuery('https://example.com/article-to-read')).toBe(false)
  })

  it('returns false for a task description', () => {
    expect(isQuery('Remember to call dentist on Friday')).toBe(false)
  })

  it('trims leading/trailing whitespace before testing', () => {
    expect(isQuery('  show me all my links  ')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(isQuery('')).toBe(false)
  })
})
