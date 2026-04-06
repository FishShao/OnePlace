# ARCHITECTURE
## Project: Pocket — Personal Knowledge Aggregator
**Client:** Davi Dai  
**Developer:** Sijia Shao
**Estimated Build Time:** 40–60 hours  

---

## 1. Problem Summary

Users scatter saved information (links, notes, recommendations) across WeChat, Apple Notes, RedNote, TikTok, and more. When they want to retrieve something, they can't remember where they saved it. The solution is a **single inbox** that accepts manual text input, auto-categorizes it with AI, and makes everything searchable in one place.

---

## 2. Tech Stack

### Recommended: Next.js 14 (App Router) + Supabase

| Layer | Choice | Justification |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | Full-stack React with server components; fast to build; great DX with Supabase |
| **Database** | Supabase (PostgreSQL) | Free tier is generous; built-in full-text search; real-time subscriptions for free; Row Level Security (RLS) for auth |
| **Auth** | Supabase Auth | Magic link or Google OAuth; zero-config; integrates directly with RLS |
| **AI categorization** | Claude API (`claude-haiku-3-5`) | Fast, cheap, accurate for short text classification; ~$0.001 per save |
| **Styling** | Tailwind CSS | Utility-first; pairs well with Next.js; fast iteration |
| **Deployment** | Vercel | One-click Next.js deployment; free tier; preview URLs on every push |

### Why not Python + Streamlit?
Streamlit is great for data prototypes but produces a less polished user experience and is harder to make mobile-friendly. Since users will likely paste content from phones, a responsive web app (Next.js) is the right call.

### Why not a native mobile app?
Out of scope for 40–60 hours. A responsive PWA (Progressive Web App) via Next.js gives a near-native mobile experience with "Add to Home Screen" support.

---

## 3. Data Model

### Supabase / PostgreSQL

#### Table: `items`
The single core table. Intentionally minimal.

```sql
CREATE TABLE items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,                    -- The raw saved text
  title       TEXT,                             -- Optional user-provided or AI-extracted title
  category    TEXT,                             -- AI-suggested: 'movie', 'restaurant', 'task', 'place', 'note', etc.
  tags        TEXT[],                           -- Optional user-added tags
  source_hint TEXT,                             -- Where it came from: 'WeChat', 'RedNote', 'manual', etc.
  url         TEXT,                             -- Optional link if the content contains one
  is_done     BOOLEAN DEFAULT FALSE,            -- For task-type items (checkbox)
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  -- Full-text search index
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || content)
  ) STORED
);

-- Indexes
CREATE INDEX items_user_id_idx ON items(user_id);
CREATE INDEX items_category_idx ON items(category);
CREATE INDEX items_search_idx ON items USING GIN(search_vector);
CREATE INDEX items_created_at_idx ON items(created_at DESC);

-- Row Level Security: users only see their own items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their items"
  ON items FOR ALL
  USING (auth.uid() = user_id);
```

#### Why only one table?
The pitch explicitly asks for 1–2 tables. A `categories` lookup table would add no real value since categories are a flexible, AI-generated string. If tags evolve in v2, a `tags` junction table could be added later. For now, a PostgreSQL `TEXT[]` array for tags is sufficient and avoids a join.

#### Optional v2 table: `categories` (not in MVP)
If users want to manage their own custom categories, a `user_categories` table can be added later.

---

## 4. Application Pages (2–3 Views)

### View 1: `/` — Inbox / Feed (Home)
- List of all saved items, sorted by `created_at DESC`
- Filter bar: All | Movie | Restaurant | Task | Place | Note | ...
- Search bar (full-text search via Supabase `search_vector`)
- Each card shows: category badge, content preview, source hint, date
- Tap to expand / mark done (for tasks)

### View 2: `/new` — Save Item (Add)
- Large textarea for pasting content
- Optional fields: title, source hint, URL
- "Save" button → triggers AI categorization in the background
- AI badge appears on card showing suggested category (user can override)

### View 3: `/item/[id]` — Item Detail
- Full content view
- Edit category, tags, title
- Delete item
- Mark as done (if task)

---

## 5. Agentic Engineering Plan

### AI Feature: Auto-Categorization

The AI feature is a **fire-and-refine** pattern: save first, categorize async, let user override.

#### Flow

```
User pastes text → Save to DB with category = null
                 → Optimistic UI shows "Categorizing..."
                 → POST /api/categorize { itemId, content }
                 → Server calls Claude Haiku API
                 → Claude returns { category, title? }
                 → Update item in DB
                 → UI updates card with category badge
```

#### API Route: `POST /api/categorize`

```typescript
// app/api/categorize/route.ts
import Anthropic from "@anthropic-ai/sdk";

const CATEGORIES = ["movie", "tv_show", "restaurant", "place", "task", "book", "product", "note"];

export async function POST(req: Request) {
  const { itemId, content } = await req.json();

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 100,
    messages: [{
      role: "user",
      content: `Classify this saved text into exactly one category.
Categories: ${CATEGORIES.join(", ")}
Text: "${content.slice(0, 500)}"
Respond with JSON only: { "category": "<category>", "title": "<short title or null>" }`
    }]
  });

  const result = JSON.parse(message.content[0].text);
  
  // Update item in Supabase
  await supabase.from("items").update(result).eq("id", itemId);
  
  return Response.json(result);
}
```

#### Why Haiku, not Sonnet?
- Categorizing a short text snippet is a simple classification task
- Haiku is ~10x cheaper and ~3x faster than Sonnet for this use case
- Accuracy for single-label classification on short text is equivalent

---

## 6. Core User Flow (End-to-End)

```
1. User opens app on phone → sees their feed (View 1)
2. User copies text from WeChat / RedNote
3. Taps "+" → opens View 2
4. Pastes text, optionally adds source hint ("from RedNote")
5. Taps "Save"
6. Item appears instantly in feed with "…" badge
7. 1–2 seconds later, badge updates to "🎬 Movie"
8. User can search "Italian movie" next week and find it instantly
```

---

## 7. Build Plan (40–60 Hours)

| Phase | Tasks | Hours |
|---|---|---|
| **Setup** | Next.js init, Supabase project, auth config, Vercel deploy | 4h |
| **DB & Auth** | Schema migration, RLS policies, login page (magic link) | 4h |
| **Feed (View 1)** | Item list, category filter, search, responsive layout | 10h |
| **Save (View 2)** | Add item form, optimistic UI, source hint selector | 6h |
| **AI Categorization** | `/api/categorize` route, Claude integration, badge UI | 6h |
| **Item Detail (View 3)** | Full view, edit, delete, mark done | 6h |
| **Polish** | Empty states, loading skeletons, mobile tweaks, PWA manifest | 6h |
| **Testing & Deploy** | E2E smoke tests, Vercel production deploy, final QA | 4h |
| **Buffer** | Bug fixes, client feedback, scope changes | 8h |
| **Total** | | **54h** |

---

## 8. Out of Scope (MVP)

- Import from WeChat / RedNote APIs (no public APIs available; manual paste is the v1 UX)
- Browser extension for one-click saving (v2)
- Sharing collections with others (v2)
- Offline support beyond PWA cache (v2)
- Bulk import from CSV or other exports (v2)

---

## 9. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Users forget to use the app | PWA home screen install + share-sheet intent handler (v1.5) |
| AI miscategorizes content | Category is always editable; shown as a "suggestion" badge |
| Supabase free tier limits (500MB, 50k rows) | More than sufficient for a personal-use MVP; upgrade path is straightforward |
| Search quality for Chinese/mixed text | `tsvector` works best for English; for Chinese content, fall back to `ILIKE` search on `content` column |

---

*Architecture version 1.0 — subject to revision after kickoff call.*
