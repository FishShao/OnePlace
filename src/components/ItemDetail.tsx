import { useState } from 'react'
import type { SavedItem } from '../hooks/useItems'
import { updateItem } from '../hooks/useItems'
import type { Section } from '../api/claude'

const C = '#2B2BE0'
const BG = '#eaecf7'
const FONT = "'Overpass Mono', 'Courier New', Courier, monospace"

const SOURCE_LABELS = ['wechat', 'notes', 'xiaohongshu', 'browser', 'document', 'other'] as const

const ALL_SECTIONS: Section[] = [
  'note', 'link', 'account', 'document', 'movie_tv', 'restaurant_place', 'task', 'other',
]

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

function formatDate(ts: { seconds: number } | null | undefined): string {
  if (!ts) return '—'
  return new Date(ts.seconds * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface Props {
  item: SavedItem
  onClose: () => void
  customSections?: string[]
}

export function ItemDetail({ item, onClose, customSections = [] }: Props) {
  const [content, setContent] = useState(item.content)
  const [sourceLabel, setSourceLabel] = useState<string>(
    item.sourceLabel ? item.sourceLabel.toLowerCase() : ''
  )
  const [section, setSection] = useState<Section>(item.section)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateItem(item.id, {
        content,
        sourceLabel: sourceLabel || undefined,
        section,
      })
      onClose()
    } catch (err) {
      console.error('save failed:', err)
      setSaving(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(560px, 90vw)',
        maxHeight: '82vh',
        overflowY: 'auto',
        background: BG,
        border: `1px solid ${C}`,
        padding: '36px 40px 32px',
        zIndex: 50,
        fontFamily: FONT,
        color: C,
        fontWeight: 500,
      }}
    >
      {/* title */}
      <p
        style={{
          fontSize: '16px',
          letterSpacing: '0.1em',
          marginBottom: '6px',
          overflowWrap: 'anywhere',
          fontWeight: 800,
        }}
      >
        {item.title}
      </p>

      {/* dates */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <span style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.08em' }}>
          saved {formatDate(item.createdAt)}
        </span>
        {item.updatedAt && (
          <span style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.08em' }}>
            edited {formatDate(item.updatedAt)}
          </span>
        )}
      </div>

      {/* content */}
      <p
        style={{
          fontSize: '12px',
          opacity: 0.45,
          letterSpacing: '0.12em',
          marginBottom: '6px',
        }}
      >
        content
      </p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        style={{
          display: 'block',
          width: '100%',
          background: 'none',
          border: 'none',
          borderBottom: `2px solid ${C}`,
          outline: 'none',
          resize: 'vertical',
          fontFamily: FONT,
          fontSize: '12px',
          color: C,
          letterSpacing: '0.04em',
          lineHeight: 1.65,
          padding: '4px 0 6px',
          marginBottom: '32px',
          fontWeight: 500,
          boxSizing: 'border-box',
        }}
      />

      {/* source label */}
      <p
        style={{
          fontSize: '12px',
          opacity: 0.45,
          letterSpacing: '0.12em',
          marginBottom: '8px',
        }}
      >
        source
      </p>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}
      >
        {SOURCE_LABELS.map((label, i) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {i > 0 && (
              <span style={{ color: C, opacity: 0.25, margin: '0 7px', fontSize: '14px' }}>·</span>
            )}
            <button
              onClick={() => setSourceLabel(sourceLabel === label ? '' : label)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: '12px',
                color: C,
                letterSpacing: '0.08em',
                fontWeight: 800,
                textDecoration: sourceLabel === label ? 'underline' : 'none',
                textUnderlineOffset: '3px',
                opacity: sourceLabel === label ? 1 : 0.45,
              }}
            >
              {label}
            </button>
          </span>
        ))}
      </div>

      {/* section */}
      <p
        style={{
          fontSize: '12px',
          opacity: 0.45,
          letterSpacing: '0.12em',
          marginBottom: '8px',
        }}
      >
        section
      </p>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '40px' }}
      >
        {[...ALL_SECTIONS.map((s) => ({ key: s, label: SECTION_LABELS[s] })), ...customSections.map((s) => ({ key: s, label: s }))].map(({ key, label }, i) => (
          <span key={key} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {i > 0 && (
              <span style={{ color: C, opacity: 0.25, margin: '0 7px', fontSize: '14px' }}>·</span>
            )}
            <button
              onClick={() => setSection(key)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: '12px',
                color: C,
                letterSpacing: '0.08em',
                fontWeight: 800,
                textDecoration: section === key ? 'underline' : 'none',
                textUnderlineOffset: '3px',
                opacity: section === key ? 1 : 0.45,
              }}
            >
              {label}
            </button>
          </span>
        ))}
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: '#2B2BE0',
            border: `2px solid ${C}`,
            padding: '5px 18px',
            cursor: saving ? 'default' : 'pointer',
            fontFamily: FONT,
            fontSize: '12px',
            color: '#EEF0FF',
            letterSpacing: '0.12em',
            fontWeight: 500,
            opacity: saving ? 0.45 : 1,
          }}
        >
          {saving ? 'saving…' : 'save'}
        </button>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: '12px',
            color: C,
            letterSpacing: '0.12em',
            fontWeight: 500,
            opacity: 0.45,
          }}
        >
          cancel
        </button>
      </div>
    </div>
  )
}
