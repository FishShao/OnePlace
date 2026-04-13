# CLAUDE.md
## OnePlace — Project Guide for Claude Code

---

## Project Overview

OnePlace is a personal knowledge aggregator. Users save scattered information from different apps (WeChat, Notes, Xiaohongshu, browsers) into one place via a chat-style input. AI auto-categorizes the content and organizes it on a visual kanban board. Users can retrieve saved items using natural language.

**Core user flow:**
1. User pastes or types content into a chat input (like messaging ChatGPT)
2. AI categorizes it automatically and saves it to the correct board section
3. User can ask "what restaurants did I save?" and get an instant answer

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Auth | Firebase Auth |
| AI | Claude Haiku API (`claude-haiku-4-5`) |
| Deployment | Firebase Hosting |

---

## Project Structure

```
src/
├── api/
│   └── claude.ts          # categorize() and retrieve() — Claude Haiku API calls
├── components/
│   ├── ChatPanel.tsx       # Primary input UI — save and query
│   ├── Board.tsx           # Kanban board layout
│   ├── SectionColumn.tsx   # One column per section
│   ├── ItemCard.tsx        # Individual saved item card
│   ├── ItemDetail.tsx      # Edit/view/delete modal
│   └── SourceBadge.tsx     # Small source label chip
├── hooks/
│   ├── useItems.ts         # Firestore real-time listener + saveItem()
│   └── useSections.ts      # Custom sections
├── utils/
│   └── intentDetector.ts   # Heuristic: is input a save or a query?
├── firebase.ts             # Firebase app init
├── App.tsx
└── main.tsx
```

---

## Default Board Sections

These are hardcoded — do NOT store them in Firestore:

| Key | Display Name |
|---|---|
| `note` | note |
| `link` | link |
| `account` | account info |
| `document` | document |
| `movie_tv` | movie / tv |
| `restaurant_place` | restaurant / place |
| `task` | task / reminder |
| `other` | other |

User-created custom sections are stored in `users/{userId}/sections` in Firestore.

---

## Environment Variables

```
VITE_ANTHROPIC_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Commands

```bash
npm run dev       # start dev server at localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

---

## Visual Style Guide

**Follow this strictly for every UI component. Never deviate.**

### Aesthetic
Hand-drawn minimalism. The app should feel like a personal nature journal — quiet, handmade, and unhurried. Not a tech product.

### Colors
- **Primary color:** `#2B2BE0` (deep blue-purple) — used for ALL text, icons, borders, buttons, strokes
- **Background:** `#E8E4DF` (flat muted warm gray) — the only background color
- **No** white surfaces, no card backgrounds, no secondary colors, no gradients, no shadows, no hover color fills

### Typography
- **Font:** `Overpass Mono` (import from Google Fonts)
- **All text lowercase** — no uppercase anywhere
- **Weight:** light (300) only — no bold, no semibold
- **Letter spacing:** wide (`tracking-widest` or `letter-spacing: 0.1em`)
- **Hierarchy:** through font size and vertical position only

### Icons & Illustrations
- Hand-drawn doodle style with nature/botanical theme: flowers, mushrooms, leaves, clouds, small animals
- Strokes slightly irregular and imperfect — not crisp vectors
- All in `#2B2BE0` only
- Use SVG inline illustrations where decorative elements are needed

### Layout
- Extreme whitespace — generous padding and margins everywhere
- Content floats directly on the gray background
- No cards, no borders, no dividers, no shadows, no rounded boxes
- Sections separated by space alone, not lines or containers

### Tailwind Implementation Notes
- Set `#E8E4DF` as background on `<body>` and root
- Set `#2B2BE0` as default text color globally
- Inputs: no background fill, only a bottom border in `#2B2BE0`, no box shadow, no rounded corners
- Buttons: no fill, just `#2B2BE0` text with a thin border or underline — no solid background buttons
- Never use Tailwind's default `bg-white`, `shadow`, `rounded-lg`, or any gray/blue utility colors

### Overall Feel
One color. One font. Lots of empty space. Everything feels hand-placed, not auto-generated.

---

## AI Behavior

### Categorization
- Model: `claude-haiku-4-5`
- Input: raw content + optional user note
- Output: `{ section, title, confidence, url? }`
- High confidence (≥ 0.8) → save directly, show confirmation
- Low confidence (< 0.8) → ask user to confirm or pick section

### Retrieval
- Model: `claude-haiku-4-5`
- Input: natural language query + last 200 items (trimmed to 200 chars each)
- Output: `{ answer, matchedIds[] }`
- Answer language matches query language (English or Chinese)

### Intent Detection (no AI, client-side)
```typescript
// save vs. query heuristic
const queryPatterns = [/\?$/, /^(what|which|where|show|find|list)/i, /^(什么|哪些|找|显示|列出|我有没有)/]
```

---

## Firestore Data Model

### `users/{userId}/items/{itemId}`
```
content       : string
title         : string?
section       : string      // one of the 8 default keys or custom section name
sourceLabel   : string?     // "WeChat" | "RedNote" | "Notes" | "manual" | etc.
url           : string?
isDone        : boolean     // for task items
createdAt     : Timestamp
updatedAt     : Timestamp
```

### `users/{userId}/sections/{sectionId}`
```
name          : string
color         : string?
createdAt     : Timestamp
```

---

## Current Status

- [x] Project initialized (React + Vite + TypeScript + Tailwind + Firebase + Claude SDK)
- [x] Issue #2: Chat-style input with AI categorization (ChatPanel.tsx)
- [ ] Issue #3: Kanban board renders saved cards
- [ ] Issue #4: Firebase Auth
- [ ] Issue #5: Natural language retrieval
- [ ] Issue #6: Move cards / drag-and-drop
- [ ] Issue #7: Custom sections
- [ ] Issue #8: Edit and delete items
