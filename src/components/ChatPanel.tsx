import { useState, useRef, useEffect } from 'react'
import { categorizeContent, retrieve, type Section } from '../api/claude'
import { saveItem, getRecentItems, checkDuplicate } from '../hooks/useItems'
import { isQuery } from '../utils/intentDetector'

const C = '#2B2BE0'
const BG = '#E8E4DF'
const FONT = "'Overpass Mono', 'Courier New', Courier, monospace"

type MessageRole = 'user' | 'assistant' | 'retrieval' | 'error'

interface ChatMessage {
  id: number
  role: MessageRole
  text: string
}

const SECTION_LABELS: Record<Section, string> = {
  note: 'note',
  link: 'link',
  account: 'account',
  document: 'document',
  movie_tv: 'movie / tv',
  restaurant_place: 'restaurant',
  task: 'task',
  other: 'other',
}

const ALL_SECTIONS: Section[] = [
  'note', 'link', 'account', 'document', 'movie_tv', 'restaurant_place', 'task', 'other',
]

interface PendingConfirmation {
  content: string
  userNote: string
  section: Section
  title: string
  summary: string
}

function FrogDoodle() {
  return (
    <svg
      width="96"
      height="116"
      viewBox="0 0 96 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: 'block', margin: '0 auto' }}
    >
      <path d="M20 56 Q16 34 48 24 Q80 34 76 56" stroke={C} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M33 56 Q31 72 35 82 Q40 88 48 87 Q56 88 61 82 Q65 72 63 56" stroke={C} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M33 56 Q48 61 63 56" stroke={C} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <circle cx="43" cy="37" r="3.5" stroke={C} strokeWidth="1.2" />
      <circle cx="59" cy="42" r="2.8" stroke={C} strokeWidth="1.2" />
      <circle cx="32" cy="46" r="2.2" stroke={C} strokeWidth="1.2" />
      <path d="M27 80 Q13 76 11 63 Q22 67 27 80" stroke={C} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M69 80 Q83 76 85 63 Q74 67 69 80" stroke={C} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 96 Q48 101 89 96" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M16 96 Q14 89 13 82" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M24 97 Q23 90 24 83" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M72 96 Q74 89 75 82" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M80 97 Q81 90 80 83" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <circle cx="10" cy="22" r="2.2" stroke={C} strokeWidth="1.1" />
      <path d="M10 24 Q10 32 11 36" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M8 19 Q6 15 7 11" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M12 19 Q14 15 13 11" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M7 22 Q3 21 2 23" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M13 22 Q17 21 18 23" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <circle cx="84" cy="22" r="2.2" stroke={C} strokeWidth="1.1" />
      <path d="M84 24 Q84 32 83 36" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M82 19 Q80 15 81 11" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M86 19 Q88 15 87 11" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M81 22 Q77 21 76 23" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M87 22 Q91 21 92 23" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M38 10 Q38 6 42 6 Q43 3 47 4 Q51 2 52 5 Q56 5 56 9 Q56 12 52 12 Q38 12 38 10Z" stroke={C} strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

interface Props {
  onQueryMatch?: (ids: string[]) => void
}

export function ChatPanel({ onQueryMatch }: Props) {
  const [content, setContent] = useState('')
  const [userNote, setUserNote] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [isQuerying, setIsQuerying] = useState(false)
  const [pending, setPending] = useState<PendingConfirmation | null>(null)
  const savedContents = useRef<Map<string, string>>(new Map())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pending])

  function addMessage(role: MessageRole, text: string) {
    setMessages((prev) => [...prev, { id: Date.now(), role, text }])
  }

  async function handleSubmit() {
    const trimmedContent = content.trim()
    if (!trimmedContent || loading) return

    const displayText = userNote.trim()
      ? `${trimmedContent}\n\n note: ${userNote.trim()}`
      : trimmedContent

    addMessage('user', displayText)
    setContent('')
    setUserNote('')
    setLoading(true)

    if (isQuery(trimmedContent)) {
      setIsQuerying(true)
      try {
        const items = await getRecentItems()
        const itemsForQuery = items.map((item) => ({
          id: item.id,
          title: item.title,
          section: item.section,
          content: item.content.slice(0, 200),
        }))
        const result = await retrieve(trimmedContent, itemsForQuery)
        addMessage('retrieval', `— ${result.answer}`)
        if (result.matchedIds.length > 0) {
          onQueryMatch?.(result.matchedIds)
        }
      } catch (err) {
        console.error(err)
        addMessage('error', 'search failed. please check your api keys and try again.')
      } finally {
        setLoading(false)
        setIsQuerying(false)
      }
      return
    }

    if (savedContents.current.has(trimmedContent)) {
      const cachedTitle = savedContents.current.get(trimmedContent)!
      addMessage('assistant', `— already saved: "${cachedTitle}"`)
      setLoading(false)
      return
    }

    try {
      const { isDuplicate, title: existingTitle } = await checkDuplicate(trimmedContent)
      if (isDuplicate) {
        savedContents.current.set(trimmedContent, existingTitle)
        addMessage('assistant', `— already saved: "${existingTitle}"`)
        setLoading(false)
        return
      }

      const result = await categorizeContent(trimmedContent, userNote.trim())

      if (result.confidence === 'low') {
        setPending({
          content: trimmedContent,
          userNote: userNote.trim(),
          section: result.section,
          title: result.title,
          summary: result.summary,
        })
        addMessage(
          'assistant',
          `not fully sure about the category. i think this belongs in **${SECTION_LABELS[result.section]}** — does that look right?`
        )
      } else {
        await saveItem(trimmedContent, userNote.trim(), result.section, result.title, result.summary)
        savedContents.current.set(trimmedContent, result.title)
        addMessage('assistant', `saved to **${SECTION_LABELS[result.section]}** as "${result.title}".`)
      }
    } catch (err) {
      console.error(err)
      addMessage('error', 'something went wrong. please check your api keys and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(chosenSection: Section) {
    if (!pending) return
    setLoading(true)
    setPending(null)

    try {
      await saveItem(pending.content, pending.userNote, chosenSection, pending.title, pending.summary)
      savedContents.current.set(pending.content, pending.title)
      addMessage('assistant', `saved to **${SECTION_LABELS[chosenSection]}** as "${pending.title}".`)
    } catch (err) {
      console.error(err)
      addMessage('error', 'failed to save. please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
      }}
    >
      {/* message history */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.length === 0 && !pending && (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              color: C,
              maxWidth: '240px',
            }}
          >
            <FrogDoodle />
            <p
              style={{
                marginTop: '24px',
                fontSize: '11px',
                letterSpacing: '0.1em',
                lineHeight: 1.8,
                opacity: 0.55,
              }}
            >
              paste a link, type a note, or ask "what did i save?" — ai will sort and find for you
            </p>
          </div>
        )}

        {messages.length > 0 && <div style={{ flex: 1 }} />}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '88%',
                fontSize: '12px',
                lineHeight: 1.7,
                letterSpacing: '0.06em',
                fontWeight: 300,
                color: C,
                opacity: msg.role === 'error' ? 0.45 : 1,
                border: `1px solid ${
                  msg.role === 'user'
                    ? C
                    : msg.role === 'retrieval'
                    ? 'rgba(43,43,224,0.55)'
                    : 'rgba(43,43,224,0.35)'
                }`,
                background:
                  msg.role === 'retrieval'
                    ? 'rgba(43,43,224,0.11)'
                    : msg.role === 'assistant'
                    ? 'rgba(43,43,224,0.07)'
                    : 'transparent',
                borderRadius: '3px',
                padding: '7px 12px',
                textAlign: 'left',
                wordBreak: 'break-word',
              }}
              dangerouslySetInnerHTML={{
                __html: msg.text
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/"([^"]+)"/g, '<strong>"$1"</strong>')
                  .replace(/\n/g, '<br />'),
              }}
            />
          </div>
        ))}

        {pending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ maxWidth: '92%' }}>
              <p
                style={{
                  fontSize: '10px',
                  color: C,
                  opacity: 0.5,
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}
              >
                pick a section:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                {ALL_SECTIONS.map((s, i) => (
                  <span key={s} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {i > 0 && (
                      <span style={{ color: C, opacity: 0.35, margin: '0 5px', fontSize: '12px' }}> · </span>
                    )}
                    <button
                      onClick={() => handleConfirm(s)}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: loading ? 'default' : 'pointer',
                        fontFamily: FONT,
                        fontSize: '12px',
                        color: C,
                        letterSpacing: '0.05em',
                        textTransform: 'lowercase',
                        textDecoration: s === pending.section ? 'underline' : 'none',
                        textUnderlineOffset: '3px',
                        opacity: loading ? 0.3 : s === pending.section ? 1 : 0.6,
                      }}
                    >
                      {SECTION_LABELS[s]}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* input area */}
      <div
        style={{
          padding: '16px 24px 22px',
          borderTop: `1px solid rgba(43, 43, 224, 0.15)`,
          background: BG,
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="paste, type, or ask anything..."
          rows={2}
          disabled={loading}
          style={{
            width: '100%',
            resize: 'none',
            border: 'none',
            borderBottom: `1px solid ${C}`,
            borderRadius: 0,
            background: 'transparent',
            fontFamily: FONT,
            fontSize: '13px',
            color: C,
            letterSpacing: '0.05em',
            textTransform: 'lowercase',
            padding: '4px 0 8px',
            outline: 'none',
            opacity: loading ? 0.45 : 1,
            display: 'block',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '12px',
          }}
        >
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
            placeholder="add a note (optional)"
            disabled={loading}
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              borderBottom: `1px solid rgba(43, 43, 224, 0.3)`,
              borderRadius: 0,
              background: 'transparent',
              fontFamily: FONT,
              fontSize: '12px',
              color: C,
              letterSpacing: '0.05em',
              textTransform: 'lowercase',
              padding: '4px 0',
              outline: 'none',
              opacity: loading ? 0.45 : 1,
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            style={{
              background: 'transparent',
              border: `1px solid ${loading || !content.trim() ? 'rgba(43,43,224,0.3)' : C}`,
              borderRadius: '3px',
              padding: '6px 14px',
              cursor: content.trim() && !loading ? 'pointer' : 'default',
              fontFamily: FONT,
              fontSize: '12px',
              color: C,
              letterSpacing: '0.12em',
              textTransform: 'lowercase',
              flexShrink: 0,
              opacity: loading || !content.trim() ? 0.4 : 1,
            }}
          >
            {loading
              ? isQuerying
                ? 'searching...'
                : 'saving...'
              : isQuery(content)
              ? 'ask →'
              : 'save →'}
          </button>
        </div>

        <p
          style={{
            fontSize: '10px',
            color: C,
            opacity: 0.35,
            letterSpacing: '0.08em',
            marginTop: '10px',
          }}
        >
          enter to send · shift+enter for new line
        </p>
      </div>
    </div>
  )
}
