# ARCHITECTURE.md
## OnePlace — Personal Knowledge Aggregator
**Developer:** Sijia Shao  
**Client:** Davi Dai  
**Submitted for:** PR #1 / Check-in 1 (April 19, 2026)  

---

## 1. Tech Stack (Finalized)

| Layer | Choice | Justification |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast dev server, component-based — ideal for a kanban board with dynamic card state |
| **Styling** | Tailwind CSS | Utility-first, great for responsive card layouts; avoids custom CSS overhead |
| **Backend / Database** | Firebase (Firestore + Auth) | As specified; real-time listeners simplify card move UX; no server to manage |
| **AI** | Claude API (`claude-haiku-4-5`) | Fast and cheap for single-pass categorization + retrieval; handles bilingual (EN/ZH) input reliably |
| **Deployment** | Firebase Hosting | Co-located with Firestore; single `firebase deploy` ships both frontend and rules |
| **State Management** | React Context + `useReducer` | Sufficient for this scale; avoids Redux complexity |

### Why Claude over OpenAI?
Both work. Claude Haiku is preferred because the prompt needs to handle bilingual (English/Chinese) input reliably, and Claude's models handle mixed-language text classification with fewer errors on short snippets.

---

## 2. Data Model (Firestore)

Firestore is a document-oriented NoSQL database. The model mirrors that structure.

### Collection: `users/{userId}/items`

Each document represents one saved item.

```
items/{itemId}
├── content       : string       // Raw pasted or typed text
├── title         : string?      // Short AI-extracted label, or user-edited
├── section       : string       // "note" | "link" | "account" | "document" |
│                                //   "movie_tv" | "restaurant_place" | "task" | "other"
│                                //   OR a custom section name (user-created)
├── sourceLabel   : string?      // "WeChat" | "RedNote" | "Notes" | "manual" | etc.
├── url           : string?      // Extracted URL if content contains one
├── isDone        : boolean      // For task items; default false
├── createdAt     : Timestamp
└── updatedAt     : Timestamp
```

### Collection: `users/{userId}/sections`

Stores user-created custom sections. The 8 default sections are hardcoded in the frontend and do not need DB entries.

```
sections/{sectionId}
├── name          : string       // Display name
├── color         : string?      // Optional hex color for the card header
└── createdAt     : Timestamp
```

### Default Sections (hardcoded, not stored in DB)

| Key | Display Name |
|---|---|
| `note` | Note |
| `link` | Link |
| `account` | Account Info |
| `document` | Document |
| `movie_tv` | Movie / TV |
| `restaurant_place` | Restaurant / Place |
| `task` | Task / Reminder |
| `other` | Other |

### Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Users can only read and write their own documents. No cross-user data access.

---

## 3. Application Views

### View 1: Board (`/`)
- Kanban-style layout: 8 default section columns + user custom columns
- Each column renders its `items` filtered by `section`, ordered by `createdAt DESC`
- Cards show: title, content preview, source label badge, URL chip (if any), done checkbox (if task)
- Drag-and-drop (or move button) to reassign a card to a different section
- "+" / chat button → opens Chat Input Panel

### View 2: Chat Input Panel (slide-over or modal)
- Single textarea — the primary input UX (same as messaging an AI assistant)
- Optional source label selector (WeChat, RedNote, Notes, Manual, Other)
- Submit → auto-detects intent: **save** or **query**
- Returns: category badge confirmation (save) or plain-language answer + highlighted cards (query)

### View 3: Item Detail (inline expand or modal)
- Full content view
- Edit title, content, section, source label
- Delete item
- Mark done (task items only)

---

## 4. Agentic Engineering Plan

### 4.1 Intent Detection (Client-Side, No AI)

```typescript
// utils/intentDetector.ts
export function detectIntent(text: string): "save" | "query" {
  const trimmed = text.trim();
  const queryPatterns = [
    /\?$/,
    /^(what|which|where|show|find|list|do i have|have i saved)/i,
    /^(什么|哪些|找|显示|列出|我有没有|我存了)/
  ];
  return queryPatterns.some(p => p.test(trimmed)) ? "query" : "save";
}
```

This keeps the fast path (save) instant and avoids an extra AI call just to detect intent.

### 4.2 Save + Categorize Flow

The AI categorizes **after** save, keeping latency invisible.

```
User submits text in ChatPanel
  │
  ├── detectIntent() → "save"
  │
  ├── 1. Write item to Firestore immediately
  │       { content, section: "other", title: null, sourceLabel, createdAt }
  │
  ├── 2. Card appears instantly under "Other" with a spinner badge
  │
  ├── 3. Call claude.categorize(content, customSections)
  │       → Claude returns { section, title, url? }
  │
  └── 4. Update Firestore item with { section, title, url }
          Card animates from "Other" to correct column ✓
```

### 4.3 Categorization Prompt

```
You are a personal information organizer. The user has just saved the following text.

SECTIONS: note, link, account, document, movie_tv, restaurant_place, task, other
CUSTOM SECTIONS (user-defined): {{customSections}}

TEXT: "{{content}}"

Instructions:
1. Pick the single most appropriate section from the list above.
2. Extract a short title (max 8 words). If the text is in Chinese, the title should also be in Chinese.
3. If the text contains a URL, extract it.
4. Respond with JSON only — no explanation, no markdown:
   { "section": "...", "title": "...", "url": "..." }
```

**Model:** `claude-haiku-4-5` | **Max tokens:** 150 | **Cost:** ~$0.001/save

### 4.4 Retrieval Flow

```
User submits text in ChatPanel
  │
  ├── detectIntent() → "query"
  │
  ├── 1. Fetch user's 200 most recent items from Firestore
  │       (trim each item's content to 200 chars for payload efficiency)
  │
  ├── 2. Call claude.retrieve(query, itemsJson)
  │       → Claude returns { answer, matchedIds[] }
  │
  └── 3. Render answer text in chat panel
          Highlight matching cards on the board
```

### 4.5 Retrieval Prompt

```
You are a personal knowledge assistant. The user wants to find something they saved.

USER QUERY: "{{query}}"

SAVED ITEMS (JSON):
{{itemsJson}}

Instructions:
1. Answer the user's question conversationally (1–3 sentences).
   Match the language of the user's query (English or Chinese).
2. Return the IDs of all matching items.
3. Respond with JSON only — no explanation, no markdown:
   { "answer": "...", "matchedIds": ["id1", "id2"] }
```

**Model:** `claude-haiku-4-5` | **Max tokens:** 500  
**Context ceiling check:** 200 items × 200 chars ≈ 40k chars — well within Haiku's 200k token window.

---

## 5. Project Structure

```
oneplace/
├── SPEC.md
├── ARCHITECTURE.md          ← this file
├── README.md
├── firebase.json
├── firestore.rules
├── .env.local               ← ANTHROPIC_API_KEY (never committed)
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── firebase.ts           ← Firebase init (Auth + Firestore)
    ├── api/
    │   └── claude.ts         ← categorize() and retrieve() wrappers
    ├── components/
    │   ├── Board.tsx          ← Kanban board layout
    │   ├── SectionColumn.tsx  ← One column per section
    │   ├── ItemCard.tsx       ← Individual card
    │   ├── ChatPanel.tsx      ← Save + query input (slide-over)
    │   ├── ItemDetail.tsx     ← Edit/view modal
    │   └── SourceBadge.tsx    ← Small source label chip
    ├── hooks/
    │   ├── useItems.ts        ← Firestore real-time listener
    │   └── useSections.ts     ← Custom sections listener
    ├── store/
    │   └── boardContext.tsx   ← React Context + useReducer
    ├── types/
    │   └── index.ts           ← Item, Section TypeScript types
    └── utils/
        └── intentDetector.ts  ← save vs. query heuristic
```

---

## 6. Build Milestones (Mapped to Agreed Timeline)

### ✅ Check-in 1 — Week 3 (April 19) — THIS PR
- [x] ARCHITECTURE.md submitted
- [x] Tech stack finalized: React + Vite + Firebase + Claude Haiku
- [x] Data model defined (2 Firestore collections)
- [x] Development environment set up (Firebase project init, `.env.local`)

### 📌 Check-in 2 — Week 6 (May 10)
- [ ] Firebase Auth (Google login) working
- [ ] Firestore rules deployed
- [ ] `ChatPanel` saves items to Firestore
- [ ] Claude categorization routes items to correct section
- [ ] `Board` renders saved cards in real time via Firestore listener

### 📌 Check-in 3 — Week 9 (May 31)
- [ ] Natural language retrieval through chat input
- [ ] Move cards / drag-and-drop to reassign section
- [ ] Add and rename custom sections
- [ ] Edit + delete items in `ItemDetail`
- [ ] Deployed to Firebase Hosting with public URL
- [ ] All GitHub Issues closed

---

## 7. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| AI categorization latency feels slow | Optimistic UI: card appears immediately under "Other", animates to correct section after AI responds (~1s) |
| Retrieval over many items is slow | Cap payload at 200 most recent items; add section-hint prefix detection to filter before calling Claude |
| Chinese / English mixed input | Claude Haiku handles bilingual input; title is returned in the same language as the input content |
| API key exposed in client bundle | Key is in `.env.local` only; for production, proxy calls through a Firebase Cloud Function |
| Retrieval answer quality | Prompt instructs Claude to match the query language; tested against WeChat-style pastes and short Chinese phrases |

---

*ARCHITECTURE.md v1.0 — Sijia Shao — April 2026*
