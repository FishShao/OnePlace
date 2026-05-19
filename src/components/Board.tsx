import { useState } from 'react'
import { useItems } from '../hooks/useItems'
import { useSections, addSection, deleteSection, renameSection } from '../hooks/useSections'
import { SectionColumn } from './SectionColumn'
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
  queryHighlightedIds?: Set<string>
}

export function Board({ queryHighlightedIds = new Set() }: Props) {
  const { items, loading, highlightedIds } = useItems()
  const { sections: customSections, loading: sectionsLoading } = useSections()

  const [defaultLabelOverrides, setDefaultLabelOverrides] = useState<Record<string, string>>({})
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [addingSectionName, setAddingSectionName] = useState('')
  const [addError, setAddError] = useState('')

  const allHighlightedIds = new Set([...highlightedIds, ...queryHighlightedIds])

  const bySection = Object.fromEntries(
    ALL_SECTIONS.map((s) => [s, items.filter((item) => item.section === s)])
  ) as Record<Section, typeof items>

  async function handleAddSection() {
    const name = addingSectionName.trim().toLowerCase()
    if (!name) { setIsAddingSection(false); return }

    const exists = customSections.some((cs) => cs.name === name)
    if (exists) { setAddError('already exists'); return }

    setAddError('')
    try {
      await addSection(name)
      setAddingSectionName('')
      setIsAddingSection(false)
    } catch (err) {
      console.error(err)
      setAddError('failed to create')
    }
  }

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

      {loading || sectionsLoading ? (
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
              label={defaultLabelOverrides[section] ?? SECTION_LABELS[section]}
              items={bySection[section]}
              highlightedIds={allHighlightedIds}
              customSections={customSections}
              isCustom={false}
              onRename={async (newName) => {
                setDefaultLabelOverrides((prev) => ({ ...prev, [section]: newName }))
              }}
            />
          ))}

          {customSections.map((cs) => (
            <SectionColumn
              key={cs.id}
              section={cs.name}
              label={cs.name}
              items={items.filter((item) => item.section === cs.name)}
              highlightedIds={allHighlightedIds}
              customSections={customSections}
              isCustom={true}
              onRename={async (newName) => renameSection(cs.id, cs.name, newName)}
              onDelete={async () => deleteSection(cs.id)}
            />
          ))}

          {/* add section */}
          <div
            style={{
              breakInside: 'avoid',
              marginBottom: '20px',
            }}
          >
            {isAddingSection ? (
              <div>
                <input
                  autoFocus
                  value={addingSectionName}
                  onChange={(e) => { setAddingSectionName(e.target.value); setAddError('') }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSection()
                    if (e.key === 'Escape') {
                      setIsAddingSection(false)
                      setAddingSectionName('')
                      setAddError('')
                    }
                  }}
                  onBlur={handleAddSection}
                  placeholder="section name..."
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: `1px solid ${C}`,
                    borderRadius: 0,
                    fontFamily: FONT,
                    fontSize: '12px',
                    color: C,
                    letterSpacing: '0.06em',
                    fontWeight: 300,
                    padding: '4px 0',
                    outline: 'none',
                    textTransform: 'lowercase',
                    width: '100%',
                  }}
                />
                {addError && (
                  <p
                    style={{
                      fontSize: '10px',
                      color: C,
                      opacity: 0.45,
                      letterSpacing: '0.06em',
                      marginTop: '4px',
                    }}
                  >
                    — {addError}
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAddingSection(true)}
                style={{
                  background: 'none',
                  border: `1px solid rgba(43,43,224,0.4)`,
                  borderRadius: '3px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: '11px',
                  color: C,
                  opacity: 0.55,
                  letterSpacing: '0.12em',
                  textTransform: 'lowercase',
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                + add section
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
