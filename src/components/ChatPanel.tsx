import { useState, useRef, useEffect } from 'react'
import { categorizeContent, type Section } from '../api/claude'
import { saveItem } from '../hooks/useItems'

const C = '#2B2BE0'
const BG = '#E8E4DF'
const FONT = "'Overpass Mono', 'Courier New', Courier, monospace"

type MessageRole = 'user' | 'assistant' | 'error'

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
  restaurant_place: 'restaurant / place',
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

export function ChatPanel() {
  const [content, setContent] = useState('')
  const [userNote, setUserNote] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState<PendingConfirmation | null>(null)
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

    try {
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
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        maxHeight: '60vh',
      }}
    >
      {/* message history */}
      {messages.length > 0 && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 32px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            minHeight: 0,
          }}
        >
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
                  maxWidth: '68%',
                  fontSize: '13px',
                  lineHeight: 1.75,
                  letterSpacing: '0.08em',
                  fontWeight: 300,
                  color: C,
                  opacity: msg.role === 'error' ? 0.45 : 1,
                  border: `1px solid ${msg.role === 'user' ? C : 'rgba(43,43,224,0.35)'}`,
                  borderRadius: '3px',
                  padding: '8px 14px',
                  textAlign: 'left',
                }}
                dangerouslySetInnerHTML={{
                  __html: msg.text
                    .replace(/\*\*(.+?)\*\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br />'),
                }}
              />
            </div>
          ))}

          {/* low-confidence section picker */}
          {pending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ maxWidth: '72%' }}>
                <p
                  style={{
                    fontSize: '11px',
                    color: C,
                    opacity: 0.5,
                    letterSpacing: '0.1em',
                    marginBottom: '10px',
                  }}
                >
                  pick a section:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  {ALL_SECTIONS.map((s, i) => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {i > 0 && (
                        <span style={{ color: C, opacity: 0.35, margin: '0 6px', fontSize: '13px' }}> · </span>
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
                          fontSize: '13px',
                          color: C,
                          letterSpacing: '0.06em',
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
      )}

      {/* input area */}
      <div
        style={{
          flexShrink: 0,
          padding: '18px 32px 28px',
          background: BG,
          borderTop: messages.length > 0 ? `1px solid rgba(43, 43, 224, 0.12)` : 'none',
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="paste or type anything..."
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
            fontSize: '14px',
            color: C,
            letterSpacing: '0.06em',
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
            gap: '16px',
            marginTop: '14px',
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
              border: 'none',
              borderBottom: `1px solid rgba(43, 43, 224, 0.3)`,
              borderRadius: 0,
              background: 'transparent',
              fontFamily: FONT,
              fontSize: '13px',
              color: C,
              letterSpacing: '0.06em',
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
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: content.trim() && !loading ? 'pointer' : 'default',
              fontFamily: FONT,
              fontSize: '13px',
              color: C,
              letterSpacing: '0.12em',
              textTransform: 'lowercase',
              opacity: loading || !content.trim() ? 0.25 : 1,
              flexShrink: 0,
            }}
          >
            {loading ? 'saving...' : 'save →'}
          </button>
        </div>

        <p
          style={{
            fontSize: '11px',
            color: C,
            opacity: 0.35,
            letterSpacing: '0.08em',
            marginTop: '12px',
          }}
        >
          enter to save · shift+enter for new line
        </p>
      </div>
    </div>
  )
}
