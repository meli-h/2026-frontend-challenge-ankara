# Jotform Frontend Hackathon — Missing Podo: The Ankara Case

## User Information

- **Name**: Ahmet Melih Bulut
- **Project Date**:
- **Hackathon Duration**: 3 hours

## Project Description

An investigation dashboard built for the "Missing Podo: The Ankara Case" scenario. The app pulls submissions from five different Jotform forms (Checkins, Messages, Sightings, Personal Notes, Anonymous Tips), merges them into a single timeline, and helps the user explore the chain of Podo's last sightings and identify the most suspicious people. Built with React 19, TypeScript (strict), Vite, and Tailwind CSS v4.

## Features

### Core Features
- **Data Fetching**: All five Jotform forms are fetched in parallel and normalized into a unified `AppRecord` list with a `kind` discriminator.
- **Person Index**: A cross-form index that links the same person across every name-bearing field (sender, recipient, sighted, seenWith, author, mentioned, suspect, checkedIn).
- **People List**: Left-hand panel listing every person with their roles and record count, sorted by appearance frequency; Podo highlighted and auto-selected on load.
- **Timeline View**: Per-person chronological record list with kind-specific rendering (message bubbles, sightings, tips, notes, checkins) and colored kind badges.
- **Record Linking**: Every person reference inside any record is a clickable link that jumps straight into that person's timeline.
- **State Handling**: Explicit loading, error, and empty states; StrictMode-safe fetch effect.

### Enhanced Features
- **Smarter Person Matching**: Diacritic-insensitive, Turkish-locale-aware normalization so `Kağan` and `Kagan` collapse into a single person while preserving intentionally distinct forms like `Kağan A.`.
- **Search**: Filters both the people list and the active timeline by person name, location, or content fields (notes, tips, message text).
- **Timeline Kind Filter**: Quick filter buttons (`All`, `Sighting`, `Message`, `Tip`, `Note`, `Checkin`) to focus on a specific record type while investigating a person.
- **Podo Last Seen Card**: Summary card surfacing Podo's most recent sighting, with a direct link to the companion.
- **Most Suspicious Panel**: Ranks suspects by a weighted score of anonymous-tip counts and note mentions; each name links to that person's timeline.
- **Podo Route Card**: Chronological, stepper-style visualization of every sighting involving Podo — location, time, and companion at each step.
- **Responsive Design**: Layout collapses to a single column on small screens with a capped people-list panel.

## Run Locally

Clone the project

```bash
git clone https://github.com/meli-h/2026-frontend-challenge-ankara.git
```

Go to the project directory

```bash
cd 2026-frontend-challenge-ankara
```

Install dependencies

```bash
npm install
```

Start the dev server

```bash
npm run dev
```

The application will be available at http://localhost:5173/

Additional scripts:

```bash
npm run build    # type-check and build for production
npm run lint     # run ESLint
npm run preview  # preview the production build
```

## Project Structure

```
src/
├── api/            # Jotform API client and per-form normalizers
├── components/     # UI components (cards, list, timeline, record views)
├── utils/          # Person index, search, and derived insight helpers
├── types/          # TypeScript types (raw Jotform + normalized domain)
├── assets/         # Static assets
├── App.tsx         # Root component and app-level state
└── main.tsx        # Application entry point
```
