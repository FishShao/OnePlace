import type { SavedItem } from '../hooks/useItems'

const C = '#2B2BE0'

interface Props {
  item: SavedItem
}

export function ItemCard({ item }: Props) {
  const date = item.createdAt
    ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : ''

  const preview =
    item.content.length > 80 ? item.content.slice(0, 80).trimEnd() + '…' : item.content

  return (
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '4px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            color: C,
            letterSpacing: '0.08em',
            fontWeight: 300,
          }}
        >
          {item.title}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: C,
            opacity: 0.35,
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}
        >
          {date}
        </span>
      </div>
      {preview !== item.title && (
        <p
          style={{
            fontSize: '11px',
            color: C,
            opacity: 0.5,
            letterSpacing: '0.05em',
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          {preview}
        </p>
      )}
    </div>
  )
}
