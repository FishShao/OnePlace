
## Project Name
OnePlace

## Project Overview
OnePlace is a personal information organizer that helps users store and retrieve scattered information in one place.

Many people save useful content across different apps and channels, such as WeChat self-chat, Notes, Xiaohongshu, browsers, and documents. They may record reminders, account information, links, reference documents, movie or restaurant recommendations, and other text-based content. The problem is not that people do not save information. The problem is that their information is fragmented across platforms, stored in inconsistent formats, and difficult to find later when needed.

OnePlace solves this problem by giving users a lightweight tool to manually save, organize, and search important personal information in one structured place. The first version focuses on text-based entries and basic organization features.

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
OnePlace helps users centralize scattered personal information into one place that is easy to search and organize.

Instead of replacing the apps people already use, OnePlace provides a simple manual capture tool that makes saved information:
- easier to store
- easier to categorize
- easier to search
- easier to revisit later

## User Stories
- As a user, I want to save different kinds of information in one place, so that I do not have to remember which app I used.
- As a user, I want to save text notes, links, account-related details, and document references, so that important information is not scattered.
- As a user, I want to record where an item came from, so that I can recover its original context.
- As a user, I want to assign categories to my saved items, so that I can organize them more clearly.
- As a user, I want the system to suggest a category for my entry, so that organizing information takes less effort.
- As a user, I want to search by keyword, so that I can quickly find an item I saved before.
- As a user, I want to filter items by type or source, so that I can narrow down results faster.
- As a user, I want to edit saved information later, so that my records stay accurate and useful.
- As a user, I want to open one item and view all of its details clearly, so that I can use the information immediately.

## Product Scope

### In Scope for MVP
The MVP will include:
- manual text-based item creation
- title and description fields
- source selection
- category assignment
- simple category suggestion based on keywords or rules
- search by keyword
- filtering by category and source
- item detail view
- ability to edit and update an item
- list view of all saved items

### Out of Scope for MVP
The following features are not required for the first version:
- direct import from WeChat, Notes, Xiaohongshu, or other platforms
- full password manager functionality
- encryption system beyond basic classroom-project handling
- OCR from screenshots
- browser extension
- collaboration or multi-user accounts
- advanced AI summarization or recommendation engine
- native mobile app

These may be considered in future versions if time allows.

## Desired Specifications

### Functional Requirements

#### 1. Add Item
Users must be able to create a new item with:
- title
- description or content
- source
- category

#### 2. Supported Information Types
The system should support saving text-based information such as:
- personal notes
- useful links
- account-related details
- document references
- media recommendations
- places or ideas
- general reminders

#### 3. Source Tracking
Users must be able to label where an item came from.

Suggested sources may include:
- WeChat
- Notes
- Xiaohongshu
- Browser
- Document
- Other

#### 4. Category Organization
Users must be able to assign and edit categories for each item.

Suggested categories may include:
- Note
- Link
- Account Info
- Document
- Movie / TV
- Restaurant / Place
- Task / Reminder
- Other

#### 5. Category Suggestion
The system should provide a simple suggested category based on the text content entered by the user.

This suggestion can be implemented with lightweight AI, keyword matching, or rule-based logic.

#### 6. Search
Users must be able to search saved items by keyword.

The search should match at least:
- title
- description
- source
- category

#### 7. Filter
Users must be able to filter items by:
- category
- source

#### 8. Item Detail View
Users must be able to open an item and view all related information clearly.

#### 9. Edit and Update
Users must be able to edit an existing item's:
- title
- description
- source
- category

### Non-Functional Requirements

#### Usability
- The interface should be simple and intuitive.
- Adding a new item should take as few steps as possible.
- The product should be easy to understand without training.

#### Performance
- Search and filter actions should feel responsive in normal MVP usage.
- The system should support smooth interaction during a classroom demo.

#### Clarity
- Labels and categories should use plain language.
- The visual structure should make information easy to scan and understand.

#### Maintainability
- The codebase should be modular and readable.
- The data model should be simple enough to extend later.

## Example Use Cases

### Use Case 1
A user saves a streaming recommendation from Xiaohongshu. They add the title and a short note into OnePlace, mark the source as Xiaohongshu, and categorize it as Movie / TV. Later, they search the title and find it immediately.

### Use Case 2
A user has important account-related details saved in scattered notes. They move the useful login-related information into OnePlace under Account Info, making it easier to retrieve later.

### Use Case 3
A user copies a useful link into OnePlace and categorizes it as Link. When they need it later, they search by keyword instead of checking multiple apps.

### Use Case 4
A user stores the name and location of an important document in OnePlace as a document reference. Later, they can quickly locate the document without remembering where they originally saved it.

## Technical Approach
The proposed technical approach for the MVP is:

- Frontend: React
- Backend / Database: Firebase
- Optional logic: lightweight AI or rule-based category suggestion

This stack is suitable for a fast, classroom-scale prototype with basic CRUD functionality and cloud-based storage.

## Data Model
A simple MVP data model may use one main table or collection for saved items.

Each item may include:
- id
- title
- description
- source
- category
- created_at
- updated_at

This keeps the system simple and manageable for the project scope.

## Success Criteria
The MVP will be considered successful if:
- users can save different kinds of personal information in one place
- users can search and retrieve saved information more easily than searching across multiple apps
- the demo clearly shows the value of centralizing scattered information
- the system supports multiple information types without becoming confusing

## Future Enhancements
Possible future improvements may include:
- screenshot upload and OCR
- smarter tagging and categorization
- reminders for saved items
- pinned or favorite items
- secure handling for sensitive information
- link preview cards
- mobile-first version
- integrations with other apps

## Developer
Sijia Shao

## Agreed Development Fee
15 GIX Bucks
