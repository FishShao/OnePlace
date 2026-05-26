export function parseClaudeJson<T>(text: string): T {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found in Claude response')
  return JSON.parse(match[0]) as T
}
