import { ChatPanel } from './components/ChatPanel'
import { Board } from './components/Board'

const C = '#2B2BE0'
const BG = '#E8E4DF'

function MushroomDoodle() {
  return (
    <svg
      width="96"
      height="116"
      viewBox="0 0 96 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0 auto' }}
    >
      {/* mushroom cap */}
      <path d="M20 56 Q16 34 48 24 Q80 34 76 56" stroke={C} strokeWidth="1.4" strokeLinecap="round" />
      {/* mushroom stem */}
      <path d="M33 56 Q31 72 35 82 Q40 88 48 87 Q56 88 61 82 Q65 72 63 56" stroke={C} strokeWidth="1.4" strokeLinecap="round" />
      {/* gill line */}
      <path d="M33 56 Q48 61 63 56" stroke={C} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      {/* spots */}
      <circle cx="43" cy="37" r="3.5" stroke={C} strokeWidth="1.2" />
      <circle cx="59" cy="42" r="2.8" stroke={C} strokeWidth="1.2" />
      <circle cx="32" cy="46" r="2.2" stroke={C} strokeWidth="1.2" />
      {/* leaf left */}
      <path d="M27 80 Q13 76 11 63 Q22 67 27 80" stroke={C} strokeWidth="1.2" strokeLinecap="round" />
      {/* leaf right */}
      <path d="M69 80 Q83 76 85 63 Q74 67 69 80" stroke={C} strokeWidth="1.2" strokeLinecap="round" />
      {/* ground */}
      <path d="M7 96 Q48 101 89 96" stroke={C} strokeWidth="1" strokeLinecap="round" />
      {/* grass left */}
      <path d="M16 96 Q14 89 13 82" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M24 97 Q23 90 24 83" stroke={C} strokeWidth="1" strokeLinecap="round" />
      {/* grass right */}
      <path d="M72 96 Q74 89 75 82" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M80 97 Q81 90 80 83" stroke={C} strokeWidth="1" strokeLinecap="round" />
      {/* small flower left */}
      <circle cx="10" cy="22" r="2.2" stroke={C} strokeWidth="1.1" />
      <path d="M10 24 Q10 32 11 36" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M8 19 Q6 15 7 11" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M12 19 Q14 15 13 11" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M7 22 Q3 21 2 23" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M13 22 Q17 21 18 23" stroke={C} strokeWidth="1" strokeLinecap="round" />
      {/* small flower right */}
      <circle cx="84" cy="22" r="2.2" stroke={C} strokeWidth="1.1" />
      <path d="M84 24 Q84 32 83 36" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M82 19 Q80 15 81 11" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M86 19 Q88 15 87 11" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M81 22 Q77 21 76 23" stroke={C} strokeWidth="1" strokeLinecap="round" />
      <path d="M87 22 Q91 21 92 23" stroke={C} strokeWidth="1" strokeLinecap="round" />
      {/* tiny cloud */}
      <path d="M38 10 Q38 6 42 6 Q43 3 47 4 Q51 2 52 5 Q56 5 56 9 Q56 12 52 12 Q38 12 38 10Z" stroke={C} strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function App() {
  return (
    <div style={{ minHeight: '100svh', background: BG, display: 'flex', flexDirection: 'column' }}>
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '240px',
          paddingInline: '24px',
        }}
      >
        <MushroomDoodle />
        <h1
          style={{
            fontSize: '19px',
            letterSpacing: '0.16em',
            fontWeight: 300,
            color: C,
            marginTop: '32px',
            marginBottom: '12px',
          }}
        >
          save anything, instantly
        </h1>
        <p
          style={{
            fontSize: '12px',
            color: C,
            opacity: 0.55,
            letterSpacing: '0.08em',
            maxWidth: '340px',
            lineHeight: 1.7,
            textAlign: 'center',
          }}
        >
          paste a link, type a note, or describe a task — ai will sort it for you
        </p>
      </main>

      <Board />
      <ChatPanel />
    </div>
  )
}

export default App
