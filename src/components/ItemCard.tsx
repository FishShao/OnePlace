import type { SavedItem } from '../hooks/useItems'

const C = '#2B2BE0'

interface Props {
  item: SavedItem
  highlighted?: boolean
}

export function ItemCard({ item, highlighted = false }: Props) {
  const date = item.createdAt
    ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : ''

  const preview =
    item.content.length > 80 ? item.content.slice(0, 80).trimEnd() + '…' : item.content

  return (
    <div
      style={{
        marginBottom: '14px',
        paddingLeft: highlighted ? '8px' : '0',
        borderLeft: highlighted ? `1px solid ${C}` : '1px solid transparent',
        transition: 'padding-left 400ms ease, border-color 400ms ease',
        position: 'relative',
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
    </div>
  )
}
