import { useItems } from '../hooks/useItems'
import { ItemCard } from './ItemCard'
import type { Section } from '../api/claude'

const C = '#2B2BE0'

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

export function Board() {
  const { items, loading } = useItems()

  if (loading || items.length === 0) return null

  const bySection = Object.fromEntries(
    ALL_SECTIONS.map((s) => [s, items.filter((item) => item.section === s)])
  ) as Record<Section, typeof items>

  const activeSections = ALL_SECTIONS.filter((s) => bySection[s].length > 0)

  return (
    <div
      style={{
        paddingInline: '32px',
        paddingTop: '64px',
        paddingBottom: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '48px 40px',
      }}
    >
      {activeSections.map((section) => (
        <div key={section}>
          <p
            style={{
              fontSize: '11px',
              color: C,
              opacity: 0.4,
              letterSpacing: '0.14em',
              marginBottom: '20px',
              textTransform: 'lowercase',
            }}
          >
            {SECTION_LABELS[section]}
          </p>
          {bySection[section].map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  )
}
