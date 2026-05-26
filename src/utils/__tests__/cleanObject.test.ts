import { describe, it, expect } from 'vitest'
import { stripUndefined } from '../cleanObject'

describe('stripUndefined', () => {
  it('removes keys with undefined values', () => {
    const result = stripUndefined({ content: 'hello', sourceLabel: undefined })
    expect(result).toEqual({ content: 'hello' })
    expect('sourceLabel' in result).toBe(false)
  })

  it('keeps keys with null values', () => {
    const result = stripUndefined({ content: 'hello', sourceLabel: null as unknown as string })
    expect(result).toEqual({ content: 'hello', sourceLabel: null })
  })

  it('keeps keys with empty string values', () => {
    const result = stripUndefined({ content: '', section: 'note' })
    expect(result).toEqual({ content: '', section: 'note' })
  })

  it('returns empty object when all values are undefined', () => {
    const result = stripUndefined({ a: undefined, b: undefined })
    expect(result).toEqual({})
  })

  it('passes through an object with no undefined values unchanged', () => {
    const input = { content: 'text', section: 'link', sourceLabel: 'wechat' }
    expect(stripUndefined(input)).toEqual(input)
  })
})
