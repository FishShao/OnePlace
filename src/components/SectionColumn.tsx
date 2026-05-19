import { useState, useRef, useEffect } from 'react'
import { ItemCard } from './ItemCard'
import { moveItem } from '../hooks/useItems'
import type { SavedItem } from '../hooks/useItems'
import type { Section } from '../api/claude'
import type { CustomSection } from '../hooks/useSections'

const C = '#2B2BE0'
const FONT = "'Overpass Mono', 'Courier New', Courier, monospace"

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 18 18',
  fill: 'none' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
  style: { flexShrink: 0, display: 'block' as const },
}
const s = (w = 1.1) => ({
  stroke: C,
  strokeWidth: w,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
})

function IconNote() {
  return (
    <svg {...iconProps}>
      <path d="M14.5 3.2 Q15.1 2.6 15.5 3 Q15.9 3.5 15.3 4 Q10.5 8.8 5.5 13.5 Q4.3 14.6 3.2 14.4 Q3.4 13 4.5 11.9 Q9.5 7.2 14.5 3.2 Z" {...s(1)} />
      <path d="M6.8 10 Q9.5 10.2 11.6 8.5" {...s(0.9)} />
      <path d="M3.2 14.4 Q2.6 15 2.3 16" {...s(0.95)} />
    </svg>
  )
}

function IconLink() {
  return (
    <svg {...iconProps}>
      <path d="M7.3 10.5 Q4.3 10.7 3.4 8.3 Q2.6 5.7 5.2 4.4 Q7.6 3.3 8.9 5.4" {...s(1)} />
      <path d="M10.7 7.5 Q13.7 7.3 14.6 9.7 Q15.4 12.3 12.8 13.6 Q10.4 14.7 9.1 12.6" {...s(1)} />
      <path d="M6.8 9.2 Q9 9 11.2 8.8" {...s(0.9)} />
    </svg>
  )
}

function IconAccount() {
  return (
    <svg {...iconProps}>
      <circle cx="5.2" cy="6" r="2.7" {...s(1)} />
      <path d="M7.3 7.7 Q10 10.2 14.5 14.6" {...s(1)} />
      <path d="M12 12.2 L13.2 13.5" {...s(1)} />
      <path d="M10.3 13.9 L11.4 15" {...s(1)} />
    </svg>
  )
}

function IconDocument() {
  return (
    <svg {...iconProps}>
      <path d="M3.6 2.8 Q3.4 2.6 3.7 2.6 L11.3 2.6 Q11.5 2.6 11.6 2.8 L14.6 5.8 Q14.8 6 14.7 6.2 L14.7 14.9 Q14.7 15.3 14.3 15.3 L3.8 15.3 Q3.4 15.3 3.4 14.9 L3.4 3 Q3.4 2.8 3.6 2.8 Z" {...s(1)} />
      <path d="M11.4 2.8 L11.4 5.9 Q11.4 6.1 11.6 6.1 L14.6 6.1" {...s(0.95)} />
      <path d="M5.8 9 Q8.8 9.1 12 9" {...s(0.85)} />
      <path d="M5.8 11.4 Q8.8 11.5 12 11.4" {...s(0.85)} />
    </svg>
  )
}

function IconMovie() {
  return (
    <svg {...iconProps}>
      <path d="M2.4 6.2 L15.6 6.2 Q15.8 6.2 15.8 6.4 L15.8 14.7 Q15.8 14.9 15.6 14.9 L2.4 14.9 Q2.2 14.9 2.2 14.7 L2.2 6.4 Q2.2 6.2 2.4 6.2 Z" {...s(1)} />
      <path d="M2.4 6.2 L3.8 3.4 L6.2 3.4 L4.9 6.2" {...s(0.95)} />
      <path d="M6.4 3.4 L8.8 3.4 L7.5 6.2" {...s(0.95)} />
      <path d="M9 3.4 L11.4 3.4 L10.1 6.2" {...s(0.95)} />
      <path d="M11.6 3.4 L14 3.4 L12.7 6.2" {...s(0.95)} />
    </svg>
  )
}

function IconPlace() {
  return (
    <svg {...iconProps}>
      <path d="M9.2 2.3 Q3.3 6 4.5 13 Q5 15 6.8 15.2 Q13.6 15 15 5.3 Q13.5 3 9.2 2.3 Z" {...s(1)} />
      <path d="M8.3 4.2 Q7.4 9 6.2 14.8" {...s(0.9)} />
      <path d="M8 7.2 Q10 6.4 11.8 5.8" {...s(0.85)} />
      <path d="M7.3 10 Q9.4 9.4 11 8.5" {...s(0.85)} />
    </svg>
  )
}

function IconTask() {
  return (
    <svg {...iconProps}>
      <path d="M9 2.2 Q14.5 2.8 15.6 7.9 Q16.5 13.4 11.4 15.3 Q6 16.8 3.1 12 Q0.9 6.8 5.4 3.5 Q7 2.4 9 2.2 Z" {...s(1)} />
      <path d="M5.6 9.3 Q7 10.8 8.3 12 Q10.4 8.7 12.8 5.8" {...s(1.1)} />
    </svg>
  )
}

function IconOther() {
  return (
    <svg {...iconProps}>
      <path d="M9 2.8 Q9.2 6 9 8.9" {...s(1)} />
      <path d="M9 9.1 Q8.8 12.4 9 15.2" {...s(1)} />
      <path d="M2.8 9 Q6 8.8 8.9 9" {...s(1)} />
      <path d="M9.1 9 Q12.2 9.2 15.2 9" {...s(1)} />
      <path d="M4.6 4.6 Q6.7 6.8 8.8 8.8" {...s(0.95)} />
      <path d="M9.2 9.2 Q11.4 11.3 13.4 13.4" {...s(0.95)} />
      <path d="M13.4 4.6 Q11.3 6.8 9.2 8.8" {...s(0.95)} />
      <path d="M8.8 9.2 Q6.7 11.3 4.6 13.4" {...s(0.95)} />
    </svg>
  )
}

const SECTION_ICONS: Record<Section, () => React.ReactElement> = {
  note: IconNote,
  link: IconLink,
  account: IconAccount,
  document: IconDocument,
  movie_tv: IconMovie,
  restaurant_place: IconPlace,
  task: IconTask,
  other: IconOther,
}

interface Props {
  section: string
  label: string
  items: SavedItem[]
  highlightedIds: Set<string>
  customSections: CustomSection[]
  isCustom?: boolean
  onOpenDetail?: (item: SavedItem) => void
  onRename?: (newName: string) => Promise<void>
  onDelete?: () => Promise<void>
}

export function SectionColumn({
  section,
  label,
  items,
  highlightedIds,
  customSections,
  isCustom = false,
  onOpenDetail,
  onRename,
  onDelete,
}: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(label)
  const dragCounter = useRef(0)
  const renameInputRef = useRef<HTMLInputElement>(null)

  const Icon = SECTION_ICONS[section as Section] ?? IconOther

  useEffect(() => {
    if (isRenaming) renameInputRef.current?.focus()
  }, [isRenaming])

  async function handleRenameSubmit() {
    const trimmed = renameValue.trim().toLowerCase()
    setIsRenaming(false)
    if (!trimmed || trimmed === label) return
    await onRename?.(trimmed)
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    dragCounter.current++
    setIsDragOver(true)
  }

  function handleDragLeave() {
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragOver(false)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragOver(false)
    const itemId = e.dataTransfer.getData('text/plain')
    if (!itemId) return
    try {
      await moveItem(itemId, section)
    } catch (err) {
      console.error('drop move failed:', err)
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        breakInside: 'avoid',
        marginBottom: '20px',
        border: isDragOver ? `1px dashed ${C}` : `1px solid ${C}`,
        borderRadius: '3px',
        padding: '14px 16px 16px',
        background: isDragOver ? 'rgba(43,43,224,0.04)' : 'transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          marginBottom: collapsed ? 0 : '14px',
        }}
      >
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: C,
            flexShrink: 0,
          }}
        >
          <Icon />
        </button>

        {isRenaming ? (
          <input
            ref={renameInputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit()
              if (e.key === 'Escape') setIsRenaming(false)
            }}
            onBlur={handleRenameSubmit}
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: `1px solid ${C}`,
              borderRadius: 0,
              fontFamily: FONT,
              fontSize: '13px',
              color: C,
              letterSpacing: '0.06em',
              fontWeight: 300,
              padding: '0 0 2px',
              outline: 'none',
              textTransform: 'lowercase',
              minWidth: 0,
            }}
          />
        ) : (
          <span
            onDoubleClick={(e) => {
              e.stopPropagation()
              setRenameValue(label)
              setIsRenaming(true)
            }}
            title="double-click to rename"
            style={{
              flex: 1,
              fontSize: '13px',
              fontWeight: 300,
              color: C,
              textTransform: 'lowercase',
              letterSpacing: '0.08em',
              cursor: 'text',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        )}

        <span
          style={{
            fontSize: '10px',
            color: C,
            opacity: 0.4,
            letterSpacing: '0.08em',
            fontWeight: 300,
            flexShrink: 0,
          }}
        >
          {items.length > 0 ? `· ${items.length}` : ''}
        </span>

        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'expand' : 'collapse'}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-block',
            fontSize: '10px',
            color: C,
            opacity: 0.45,
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          ▾
        </button>
      </div>

      {!collapsed && (
        <div>
          {items.length === 0 ? (
            <p
              style={{
                fontSize: '10px',
                color: C,
                opacity: 0.3,
                letterSpacing: '0.08em',
                fontStyle: 'italic',
              }}
            >
              — nothing here yet
            </p>
          ) : (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                highlighted={highlightedIds.has(item.id)}
                onOpenDetail={onOpenDetail}
                customSections={customSections}
              />
            ))
          )}

          {isCustom && (
            <button
              disabled={items.length > 0}
              onClick={async () => { await onDelete?.() }}
              style={{
                marginTop: '10px',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: items.length > 0 ? 'default' : 'pointer',
                fontFamily: FONT,
                fontSize: '10px',
                color: C,
                opacity: items.length > 0 ? 0.2 : 0.4,
                letterSpacing: '0.08em',
                display: 'block',
                textTransform: 'lowercase',
              }}
              title={items.length > 0 ? 'move all cards out before deleting' : 'delete this section'}
            >
              — delete section
            </button>
          )}
        </div>
      )}
    </div>
  )
}
