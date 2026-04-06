# SPEC.md

## Project Name
OnePlace

## Project Overview
OnePlace is a personal information organizer that helps users store and retrieve scattered information in one place through a conversational AI interface.

Many people save useful content across different apps and channels, such as WeChat self-chat, Notes, Xiaohongshu, browsers, and documents. The problem is not that people do not save information. The problem is that their information is fragmented across platforms, stored in inconsistent formats, and difficult to find later when needed.

OnePlace solves this by giving users a single chat-driven input — similar to how people interact with AI assistants like ChatGPT — where they can save, organize, and retrieve personal information naturally. A kanban-style board displays all saved content organized into categories. The first version focuses on text-based entries and conversational interaction.

## Problem Statement
Users often save information in many different places, but when they actually need it, they cannot find it quickly.

Common examples include:
- sending important details to themselves in WeChat
- saving notes in a notes app
- bookmarking links but forgetting where they are
- keeping account-related information in random places
- storing document references without a clear organization system
- collecting movies, restaurants, or ideas across multiple apps

As a result, users often:
- forget where information was saved
- waste time searching through several apps
- lose track of useful links, notes, and references
- fail to revisit saved content when it becomes relevant

## Target Users
The target users for OnePlace include:
- students who save information, links, and reminders across multiple apps
- young professionals who need one place for personal notes, references, and account-related details
- users who frequently save content but struggle to retrieve it later
- people who want a simple and searchable personal information hub

## Core Value Proposition
OnePlace lets users save and retrieve personal information through a natural chat interface, without needing to manually organize anything. Users type or paste content the same way they would message a friend or an AI assistant. OnePlace understands what it is, categorizes it automatically, and displays it on a visual kanban board.

## User Stories
- As a user, I want to type or paste content into a chat-style input and have it automatically saved and categorized, so I don't have to think about where to put things.
- As a user, I want to add a note or context alongside what I'm saving, so the AI can better understand and categorize it.
- As a user, I want to ask the AI in natural language to find something I saved before, so I don't have to remember where I stored it.
- As a user, I want to see all my saved content organized in a visual kanban board by category, so I can browse at a glance.
- As a user, I want to move a card to a different board section if the AI categorized it wrong, so my information stays organized the way I want.
- As a user, I want to create custom board sections, so I can organize information in a way that fits my own needs.
- As a user, I want to edit the content of a saved card, so I can keep my information accurate and up to date.
- As a user, I want each saved item to show where it came from as a small label, so I have context without it cluttering the view.

## Product Scope

### In Scope for MVP
The MVP will include:
- chat-style input box as the primary interface for saving and querying information
- AI-powered automatic categorization of saved content
- AI-powered natural language retrieval ("what restaurants did I save?")
- kanban board as the main display, with default sections for each category
- ability to create custom board sections
- content cards showing a summary, source label, and creation time
- ability to move cards between sections manually
- ability to edit card content
- new card highlight to show recently added items

### Out of Scope for MVP
The following features are not required for the first version:
- direct import from WeChat, Notes, Xiaohongshu, or other platforms
- full password manager functionality
- encryption system beyond basic classroom-project handling
- OCR from screenshots
- browser extension
- collaboration or multi-user accounts
- reminders or notifications
- native mobile app

These may be considered in future versions if time allows.

## Desired Specifications

### Functional Requirements

#### 1. Chat-Style Input
The primary interface is a chat input box at the bottom of the screen, similar to ChatGPT or other AI assistants.

Users can:
- type or paste any text-based content
- add a natural language note for context (e.g. "this is a restaurant I want to try" or "save this link about design")
- submit and receive confirmation that the item was saved and categorized

The AI processes the input and either:
- saves and categorizes the content automatically, or
- asks the user to confirm the suggested category if confidence is low

#### 2. AI-Powered Automatic Categorization
When a user submits content, the AI analyzes the input and assigns it to the most appropriate board section.

Default sections:
- Note
- Link
- Account Info
- Document
- Movie / TV
- Restaurant / Place
- Task / Reminder
- Other

If the AI is not confident, it should ask the user to confirm or choose a category before saving.

#### 3. Natural Language Retrieval
Users can ask the AI questions through the same input box to find previously saved content.

Examples:
- "what restaurants did I save?"
- "find the link I saved about design"
- "show me everything under Movie / TV"

The AI should respond with matching results displayed in the chat or highlighted on the board.

#### 4. Kanban Board Display
The main screen displays a kanban-style board with one section per category.

Each section:
- shows its category name
- displays all cards belonging to that category
- can be collapsed or expanded

The board supports horizontal or vertical scrolling to view all sections.

#### 5. Content Cards
Each saved item appears as a card within its board section.

Each card displays:
- content summary or title
- source label (small, unobtrusive — e.g. "WeChat", "Browser")
- creation time
- highlight indicator if recently added

Clicking a card opens a detail view with full content and edit options.

#### 6. Move Cards Between Sections
Users can manually move a card to a different board section if the AI categorization was incorrect or if they want to reorganize.

Move options:
- a "Move to" option on the card
- drag and drop (if time allows)

#### 7. Custom Board Sections
Users can create new board sections with a custom name.

Rules:
- default 8 sections cannot be deleted, but can be renamed
- custom sections can be deleted if they are empty
- sections with content cannot be deleted until content is moved or removed

#### 8. Edit Card Content
Users can edit the content of any saved card.

Editable fields:
- main content or description
- source label
- section / category

#### 9. Source Label
Each card can carry a small source label indicating where the content came from.

Source label:
- is optional
- can be set by the user during input or edited later
- appears as a small, unobtrusive tag on the card
- suggested values: WeChat, Notes, Xiaohongshu, Browser, Document, Other

### Non-Functional Requirements

#### Usability
- The chat input should feel familiar and require no learning curve.
- Saving an item should take as few steps as possible — ideally just paste and submit.
- The kanban board should be easy to scan visually.

#### Performance
- AI categorization response should feel fast during a classroom demo.
- Board rendering should be smooth even with many cards.

#### Clarity
- Board sections should use plain, recognizable category names.
- Cards should be compact but readable.

#### Maintainability
- The codebase should be modular and readable.
- The data model should be simple enough to extend later.

## Example Use Cases

### Use Case 1
A user copies a Xiaohongshu link about a café they want to visit. They paste it into the OnePlace input and add "nice café for studying." OnePlace categorizes it as Restaurant / Place and the card appears in that section with a Xiaohongshu source label.

### Use Case 2
A user types "what cafés did I save?" into the input. OnePlace responds with a list of cards from the Restaurant / Place section that match.

### Use Case 3
A user pastes a streaming recommendation and types "movie I want to watch this weekend." OnePlace categorizes it as Movie / TV. The card appears highlighted in the board.

### Use Case 4
A user realizes a saved card was placed in the wrong section. They open the card and use "Move to" to reassign it to the correct section.

### Use Case 5
A user wants to track job application links separately. They create a custom board section called "Job Apps" and move relevant cards into it.

## Technical Approach
The proposed technical approach for the MVP is:

- Frontend: React
- Backend / Database: Firebase
- AI: LLM API (e.g. OpenAI or Claude) for categorization and natural language retrieval

This stack is suitable for a fast, classroom-scale prototype with real AI-powered interaction and cloud-based storage.

## Data Model
A simple MVP data model may use two main collections.

### Items Collection
Each saved item may include:
- id
- content (full text)
- summary (short display text, AI-generated or first N characters)
- source (optional label)
- section_id (which board section it belongs to)
- is_new (boolean, for highlight indicator)
- created_at
- updated_at

### Sections Collection
Each board section may include:
- id
- name
- is_default (boolean)
- created_at

## Success Criteria
The MVP will be considered successful if:
- users can save content through a chat-style input without manual categorization effort
- users can retrieve saved content using natural language
- the kanban board clearly displays all saved content organized by section
- users can correct AI categorization and reorganize their board
- the demo clearly shows the value of conversational, centralized information saving

## Future Enhancements
Possible future improvements may include:
- screenshot upload and OCR
- smarter AI summarization and tagging
- reminders for saved items
- pinned or favorite cards
- secure handling for sensitive information
- link preview cards
- mobile-first version
- integrations with WeChat, Xiaohongshu, and other platforms

## Developer
Sijia Shao

## Agreed Development Fee
15 GIX Bucks
