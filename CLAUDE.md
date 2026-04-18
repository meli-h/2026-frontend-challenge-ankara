# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Jotform Frontend Hackathon 2026 entry — a 3-hour timed challenge. Scenario: "Missing Podo: The Ankara Case" — build an investigation dashboard that fetches submissions from five Jotform forms and lets the judge (user) explore who is suspicious and where Podo might be.

Evaluation: functional success, developer experience (code quality, state management, error handling), and product/UX thinking. Submission is judged from git commits before the 3-hour deadline, so favor shipping the core loop (fetch → list → detail → linking → search) over polish.

## Commands

```
npm run dev       # vite dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # preview production build
```

There is no test suite.

## Stack

React 19 + TypeScript (strict) + Vite 8 + Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js`, just `@import "tailwindcss";` in `src/index.css`).

## Data layer

Five Jotform forms provide the raw data. Form IDs and the API key are hardcoded in [src/api/jotform.ts](src/api/jotform.ts) (intentional for the hackathon — no `.env`). All five are fetched in parallel by `fetchAllRecords()` and normalized into a single `AppRecord[]` where each record carries a `kind` discriminator (`checkin` | `message` | `sighting` | `personalNote` | `anonymousTip`).

Raw Jotform submissions store form fields in `answers: Record<string, JotformAnswer>` keyed by numeric strings, where each answer has a `name` property. The per-form normalizers in `jotform.ts` use `getAnswer(submission, name)` to extract fields by that `name`. When a field is empty, normalizers return `''` — UI components display context-appropriate Turkish placeholders (e.g. "Konum belirtilmemiş", "Not bulunmamakta"). Do not bake those strings into the data layer.

The Jotform default response limit is 20 per form, which is sufficient here; there is no `?limit=` or pagination — data is small and filtered client-side.

## Person index

[src/utils/personIndex.ts](src/utils/personIndex.ts) is the backbone of cross-linking. `buildPersonIndex(records)` walks every record and extracts people from every name-bearing field:

| Form kind       | Extracted as               |
| --------------- | -------------------------- |
| `checkin`       | personName → checkedIn     |
| `message`       | senderName, recipientName  |
| `sighting`      | personName, seenWith       |
| `personalNote`  | authorName, mentionedPeople|
| `anonymousTip`  | suspectName                |

Result: `Map<normalizedKey, PersonEntry>` where `normalizedKey` is `name.trim().toLocaleLowerCase('tr')` (Turkish locale is load-bearing — "İ"/"I" differs from English). Each `PersonEntry` tracks a `Set<PersonRole>` (same person can be sender AND sighted) and a flat `PersonAppearance[]` (the record plus the role it appeared as).

`mentionedPeople` / `seenWith` may contain multiple names; `splitNames` splits on `,`, `;`, ` ve `, ` and `. This regex is intentionally conservative — inspect data first before adding `&`/`/` etc.

Map (not plain object) is used because keys are user-provided strings, so reserved names like `constructor` would collide on an object.

Exposed helpers: `getPersonList` (sorted by appearance count desc), `getLastSeenWithPodo` (latest Podo sighting by `createdAt`), `lookupPerson` (for cross-linking), `personMatchesQuery` (search by name + location + content fields).

## Component wiring

```
App.tsx
 ├── SearchBar            value + onChange
 ├── PersonList           persons + selected + onSelect
 └── TimelinePanel        person + personIndex + onSelectPerson
      └── RecordCard      record + personIndex + onSelectPerson
           └── PersonLink (inline) — if lookupPerson finds an entry, renders a button
                                       that calls onSelectPerson; otherwise plain text
```

`App.tsx` owns all state: `records`, `loading`, `error`, `selected`, `query`. The fetch effect uses a `let cancelled = false` flag in the cleanup to defuse StrictMode's double-mount in dev. Podo is auto-selected on first load via a separate effect that finds `normalizedName === 'podo'` in the sorted list.

Cross-linking flow: `personIndex` + `onSelectPerson` are threaded from App down to RecordCard. Whenever a record displays a name (sender, recipient, personName, seenWith, authorName, mentionedPeople, suspectName), it goes through the inline `PersonLink` component which uses `lookupPerson` to decide button vs. plain text.

## Conventions

- TypeScript strict; no `any`. Prefer discriminated unions over generic maps for record shapes.
- UI copy mixes English (top-level labels, kind badges) and Turkish (contextual placeholders for empty fields). Keep that split.
- Record sort uses `createdAt.localeCompare(...)` because the string is `YYYY-MM-DD HH:MM:SS` — lexicographic order equals chronological order; no Date parsing needed. The form's own `timestamp` field is `DD-MM-YYYY HH:MM` which does not sort lexicographically, so avoid it for ordering.
