import { useState, useRef } from 'react'
import { ChatPanel } from './components/ChatPanel'
import { Board } from './components/Board'

const C = '#2B2BE0'
const BG = '#E8E4DF'
const BOARD_BG = '#F5F2EE'
const SIDEBAR_WIDTH = 'min(420px, 28vw)'

const QUERY_HIGHLIGHT_MS = 60_000

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [queryHighlightedIds, setQueryHighlightedIds] = useState<Set<string>>(new Set())
  const queryHighlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleQueryMatch(ids: string[]) {
    if (queryHighlightTimer.current) clearTimeout(queryHighlightTimer.current)
    setQueryHighlightedIds(new Set(ids))
    queryHighlightTimer.current = setTimeout(() => {
      setQueryHighlightedIds(new Set())
    }, QUERY_HIGHLIGHT_MS)
  }

  return (
    <div
      style={{
        minHeight: '100svh',
        background: BOARD_BG,
        color: C,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <main
        style={{
          marginRight: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-right 320ms ease',
          minHeight: '100svh',
        }}
      >
        <Board queryHighlightedIds={queryHighlightedIds} />
      </main>

      <aside
        aria-hidden={!sidebarOpen}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          background: BG,
          borderLeft: `1px solid rgba(43, 43, 224, 0.2)`,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms ease',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px 12px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: C,
              opacity: 0.55,
              letterSpacing: '0.18em',
              textTransform: 'lowercase',
            }}
          >
            save anything
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="close sidebar"
            style={{
              background: 'transparent',
              border: `1px solid ${C}`,
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              color: C,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: '13px',
              lineHeight: 1,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1 L9 9 M9 1 L1 9" stroke={C} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <ChatPanel onQueryMatch={handleQueryMatch} />
        </div>
      </aside>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="open chat"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: C,
            border: `1px solid ${C}`,
            color: BOARD_BG,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            fontFamily: 'inherit',
            zIndex: 30,
            transition: 'transform 200ms ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 6 Q4 4 6 4 L18 4 Q20 4 20 6 L20 14 Q20 16 18 16 L10 16 L6 19 L6 16 Q4 16 4 14 Z"
              stroke={BOARD_BG}
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="9.5" cy="10" r="0.8" fill={BOARD_BG} />
            <circle cx="12" cy="10" r="0.8" fill={BOARD_BG} />
            <circle cx="14.5" cy="10" r="0.8" fill={BOARD_BG} />
          </svg>
        </button>
      )}
    </div>
  )
}

export default App
