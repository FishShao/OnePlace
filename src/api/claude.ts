import Anthropic from '@anthropic-ai/sdk'

export type Section =
  | 'note'
  | 'link'
  | 'account'
  | 'document'
  | 'movie_tv'
  | 'restaurant_place'
  | 'task'
  | 'other'

export interface CategorizationResult {
  section: Section
  confidence: 'high' | 'low'
  title: string
  summary: string
}

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const SECTION_DESCRIPTIONS: Record<Section, string> = {
  note: 'personal notes, thoughts, ideas, memos, or written reminders',
  link: 'URLs, web links, articles to read, bookmarks',
  account: 'login credentials, usernames, passwords, account information',
  document: 'files, documents, PDFs, contracts, reports, forms',
  movie_tv: 'movies, TV shows, series, films, anime, streaming content to watch',
  restaurant_place: 'restaurants, cafes, bars, places to visit, travel destinations, locations',
  task: 'todos, action items, tasks, things to do, reminders with action required',
  other: 'anything that does not fit the above categories',
}

export async function categorizeContent(
  content: string,
  userNote: string,
  customSections?: string[]
): Promise<CategorizationResult> {
  const defaultList = Object.entries(SECTION_DESCRIPTIONS)
    .map(([key, desc]) => `- ${key}: ${desc}`)
  const customList = (customSections ?? [])
    .map((name) => `- ${name}: user-defined custom section`)
  const sectionList = [...defaultList, ...customList].join('\n')

  const prompt = `You are a content categorization assistant. Classify the following content into exactly one of these sections:

${sectionList}

Content to classify:
${content}
${userNote ? `\nUser note: ${userNote}` : ''}

Respond with a JSON object only, no extra text:
{
  "section": "<section_name>",
  "confidence": "high" or "low",
  "title": "<the name of the thing itself, not the user's action — e.g. 'Project Hail Mary' not 'watch project hail mary', max 60 chars>",
  "summary": "<one sentence summary of the content>"
}

For title: extract the core subject (movie name, restaurant name, task description, etc.). Strip phrases like 'i want to', 'remember to', 'save this', 'check out', etc.
Use "low" confidence if you are unsure between multiple categories or the content is ambiguous.`

  const message = await client.messages.create(
    {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    },
    { timeout: 15000 }
  )

  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response')
  }

  const parsed = JSON.parse(jsonMatch[0]) as CategorizationResult
  return parsed
}

export interface RetrievalResult {
  answer: string
  matchedIds: string[]
}

export async function retrieve(
  query: string,
  items: Array<{ id: string; title: string; section: string; content: string }>
): Promise<RetrievalResult> {
  const itemList = items
    .map((item) => `[id:${item.id}] title: "${item.title}" | section: ${item.section} | ${item.content}`)
    .join('\n')

  const prompt = `You are a personal knowledge retrieval assistant. The user saved items to their board.

User query: ${query}

Saved items (most recent first):
${itemList || '(no items saved yet)'}

Respond with a JSON object only, no extra text:
{
  "answer": "<answer in the same language as the query — list matching items with title and section name, be concise and conversational. If nothing matches, say so gently.>",
  "matchedIds": ["<id>", ...]
}

Rules:
- matchedIds must only contain ids from the list above
- If nothing matches, set matchedIds to [] and say so in the answer
- Answer language must match query language (Chinese query → Chinese answer, English → English)`

  const message = await client.messages.create(
    {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    },
    { timeout: 15000 }
  )

  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in Claude response')

  return JSON.parse(jsonMatch[0]) as RetrievalResult
}
