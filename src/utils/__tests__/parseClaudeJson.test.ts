import { describe, it, expect } from 'vitest'
import { parseClaudeJson } from '../parseClaudeJson'

describe('parseClaudeJson', () => {
  it('parses a clean JSON object', () => {
    const text = '{"section": "note", "confidence": "high"}'
    expect(parseClaudeJson<{ section: string; confidence: string }>(text)).toEqual({
      section: 'note',
      confidence: 'high',
    })
  })

  it('extracts JSON embedded in surrounding prose', () => {
    const text = 'Sure! Here is the result:\n{"section": "link"}\nLet me know if you need anything else.'
    expect(parseClaudeJson<{ section: string }>(text)).toEqual({ section: 'link' })
  })

  it('handles multiline pretty-printed JSON', () => {
    const text = '{\n  "section": "task",\n  "confidence": "low",\n  "title": "Call dentist"\n}'
    expect(parseClaudeJson<{ section: string; title: string }>(text)).toEqual({
      section: 'task',
      confidence: 'low',
      title: 'Call dentist',
    })
  })

  it('throws when no JSON object is present', () => {
    expect(() => parseClaudeJson('sorry, I cannot help with that')).toThrow(
      'No JSON found in Claude response'
    )
  })

  it('throws on an empty string', () => {
    expect(() => parseClaudeJson('')).toThrow('No JSON found in Claude response')
  })
})
