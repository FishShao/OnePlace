import { useItems } from '../hooks/useItems'
import { SectionColumn } from './SectionColumn'
import type { Section } from '../api/claude'

const C = '#2B2BE0'

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

export function Board() {
  const { items, loading, highlightedIds } = useItems()

  const bySection = Object.fromEntries(
    ALL_SECTIONS.map((s) => [s, items.filter((item) => item.section === s)])
  ) as Record<Section, typeof items>

  return (
    <div
      style={{
        height: '100svh',
        overflowY: 'auto',
        paddingInline: '48px',
        paddingTop: '56px',
        paddingBottom: '56px',
        background: '#F5F2EE',
      }}
    >
      <h1
        style={{
          fontSize: '13px',
          color: C,
          letterSpacing: '0.22em',
          fontWeight: 300,
          marginBottom: '4px',
        }}
      >
        oneplace
      </h1>
      <p
        style={{
          fontSize: '11px',
          color: C,
          opacity: 0.4,
          letterSpacing: '0.1em',
          marginBottom: '48px',
        }}
      >
        everything you saved, one quiet place
      </p>

      {loading ? (
        <p
          style={{
            fontSize: '11px',
            color: C,
            opacity: 0.35,
            letterSpacing: '0.1em',
          }}
        >
          loading…
        </p>
      ) : (
        <div
          style={{
            columnWidth: '240px',
            columnGap: '56px',
          }}
        >
          {ALL_SECTIONS.map((section) => (
            <SectionColumn
              key={section}
              section={section}
              label={SECTION_LABELS[section]}
              items={bySection[section]}
              highlightedIds={highlightedIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}
