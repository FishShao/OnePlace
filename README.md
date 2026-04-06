# OnePlace

**Save and retrieve your scattered information through a single conversational interface.**

---

## Overview

Many people save useful content across different apps — WeChat self-chat, Notes, Xiaohongshu, browsers, and documents. The problem is not that people don't save information. The problem is that it's fragmented, stored in inconsistent formats, and nearly impossible to find later.

OnePlace solves this with a chat-style input — just like messaging an AI assistant. Paste a link, jot a thought, or describe what you're saving. OnePlace understands it, categorizes it automatically, and organizes it on a visual kanban board. When you need something back, just ask.

---

## Features (MVP)

- **Chat-style input** — type or paste content the same way you'd message ChatGPT; add a note for context if needed
- **AI auto-categorization** — OnePlace figures out what you're saving and puts it in the right board section automatically
- **Natural language retrieval** — ask "what restaurants did I save?" and get an answer instantly
- **Kanban board** — all your saved content displayed visually across 8 default sections
- **Custom board sections** — create new sections that fit your own organization style
- **Move cards** — manually reassign cards if the AI got it wrong
- **Edit cards** — update content, source label, or section at any time
- **Source labels** — small, unobtrusive tags showing where each item came from

---

## Default Board Sections

| Section | Example content |
|---------|----------------|
| Note | Quick thoughts, reminders, ideas |
| Link | URLs and bookmarks |
| Account Info | Login-related details |
| Document | File references and doc notes |
| Movie / TV | Streaming recommendations |
| Restaurant / Place | Cafés, restaurants, places to visit |
| Task / Reminder | Things to do |
| Other | Anything that doesn't fit elsewhere |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React |
| Backend / Database | Firebase |
| AI | LLM API (OpenAI or Claude) for categorization and retrieval |

---

## Team

| Role | Name |
|------|------|
| Proposer (Client) | Davi Dai |
| Developer | Sijia Shao |

**Agreed Development Fee:** 15 GIX Bucks

---

## Timeline

The project runs over 10 weeks (April – June 2026). The proposer and developer have agreed on the following progress check-in points:

### ✅ Week 1 — Project Kickoff (April 5, 2026)
- Proposer publishes `SPEC.md` and GitHub Issues
- Developer matched and fee negotiated
- Repository set up

### 📌 Check-in 1 — Week 3 (April 19, 2026)
**Required developer progress:**
- `ARCHITECTURE.md` submitted and reviewed via PR #1
- Tech stack finalized
- Data model defined
- Development environment set up

### 📌 Check-in 2 — Week 6 (May 10, 2026)
**Required developer progress:**
- Chat input functional — user can submit content and it saves to Firebase
- AI categorization working — content routed to correct board section
- Kanban board renders saved cards

### 📌 Check-in 3 — Week 9 (May 31, 2026)
**Required developer progress:**
- Natural language retrieval working through chat input
- Move cards and custom sections implemented
- App deployed and accessible via public URL
- All GitHub Issues closed or addressed

### 🎯 Week 10 — Demo Day (June 2026)
- Final presentation
- GIX Bucks investment round

---

## Repository Structure

```
oneplace/
├── SPEC.md           # Full project specification and acceptance criteria
├── ARCHITECTURE.md   # Developer's architecture document (added by developer)
├── README.md         # This file
└── src/              # Application source code (added by developer)
```

---

## Links

- [Project Spec](./SPEC.md)
- [GitHub Issues](../../issues)
