const QUERY_PATTERNS: RegExp[] = [
  /\?$/,
  /^(what|which|where|show|find|list|search|do i have|have i)/i,
]

export function isQuery(text: string): boolean {
  const t = text.trim()
  return QUERY_PATTERNS.some((p) => p.test(t))
}
