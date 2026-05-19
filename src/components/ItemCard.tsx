import { useState, useRef, useEffect } from 'react'
import type { SavedItem } from '../hooks/useItems'
import { moveItem } from '../hooks/useItems'
import type { Section } from '../api/claude'

const C = '#2B2BE0'
const FONT = "'Overpass Mono', 'Courier New', Courier, monospace"

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

interface Props {
  item: SavedItem
  highlighted?: boolean
}

export function ItemCard({ item, highlighted = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const date = item.createdAt
    ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : ''

  const preview =
    item.content.length > 80 ? item.content.slice(0, 80).trimEnd() + '…' : item.content

  useEffect(() => {
    if (!menuOpen) return
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [menuOpen])

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    if (menuOpen) { e.preventDefault(); return }
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  async function handleMove(targetSection: Section) {
    setMenuOpen(false)
    try {
      await moveItem(item.id, targetSection)
    } catch (err) {
      console.error('move failed:', err)
    }
  }

  const otherSections = ALL_SECTIONS.filter((s) => s !== item.section)

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        marginBottom: '14px',
        paddingLeft: highlighted ? '8px' : '0',
        borderLeft: highlighted ? `1px solid ${C}` : '1px solid transparent',
        transition: 'padding-left 400ms ease, border-color 400ms ease',
        position: 'relative',
        cursor: menuOpen ? 'default' : 'grab',
      }}
    >
      {highlighted && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: '3px',
            left: '-3px',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: C,
            animation: 'oneplace-pulse 1.6s ease-in-out infinite',
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '10px',
          marginBottom: '2px',
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: C,
            letterSpacing: '0.06em',
            fontWeight: 300,
            minWidth: 0,
            flex: 1,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {item.title}
        </span>
        <span
          style={{
            fontSize: '10px',
            color: C,
            opacity: 0.35,
            letterSpacing: '0.05em',
            flexShrink: 0,
          }}
        >
          {date}
        </span>
      </div>
      {preview !== item.title && (
        <p
          style={{
            fontSize: '10px',
            color: C,
            opacity: 0.5,
            letterSpacing: '0.04em',
            lineHeight: 1.55,
            fontWeight: 300,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {preview}
        </p>
      )}

      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: FONT,
          fontSize: '10px',
          color: C,
          opacity: menuOpen ? 0.65 : 0.3,
          letterSpacing: '0.08em',
          marginTop: '5px',
          display: 'block',
        }}
      >
        {menuOpen ? '— close' : 'move →'}
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            marginTop: '5px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {otherSections.map((s, i) => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {i > 0 && (
                <span style={{ color: C, opacity: 0.3, margin: '0 4px', fontSize: '10px' }}>·</span>
              )}
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleMove(s)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: '10px',
                  color: C,
                  opacity: 0.6,
                  letterSpacing: '0.06em',
                  textTransform: 'lowercase',
                }}
              >
                {SECTION_LABELS[s]}
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
