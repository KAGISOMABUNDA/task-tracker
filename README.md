# Task Tracker

A React + Tailwind CSS (v4) task tracker with Firebase for persistence and hosting.

Live demo: https://task-tracker-2501.web.app/

This repository contains the frontend application built with React and styled using Tailwind CSS v4. Firebase is used for authentication, data storage (Firestore), and hosting.

## Tech stack

- React (v18+)
- Tailwind CSS v4
- Firebase (Auth, Firestore, Hosting, Storage as needed)
- Vite or Create React App (instructions below accept either)

## Quick links
- Firebase setup: FIREBASE.md
- Contribution guidelines: CONTRIBUTING.md
- Firebase initializer: src/firebase.js

## What you'll find in this repo
Typical structure (adjusted to match this repo):
- public/ or static/ — static assets and index.html
- src/
  - src/components/ — small reusable components
  - src/pages/ — page-level components / routes
  - src/styles/ — Tailwind entry (if present)
  - src/firebase.js — Firebase initialization (this repo)
  - src/main.jsx or src/index.jsx — app entry
- tailwind.config.js — Tailwind v4 config
- postcss.config.js — PostCSS config for Tailwind
- package.json — scripts and dependencies
- README.md — this file
- CONTRIBUTING.md — contribution guide
- FIREBASE.md — step-by-step Firebase setup & deploy

If your repository layout differs, I can inspect it and update this section to exactly match.

## Getting started (local)

Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- Firebase CLI (for deployment)

Clone and install
```bash
git clone https://github.com/KAGISOMABUNDA/task-tracker.git
cd task-tracker
npm install
```

Environment variables
- Create a local environment file with your Firebase config (see FIREBASE.md).
- If you use Vite, put keys in `.env.local` with `VITE_` prefixes (recommended).
- If you use Create React App, put keys in `.env.local` with `REACT_APP_` prefixes.

Run the app
- Vite:
  ```bash
  npm run dev
  ```
- Create React App:
  ```bash
  npm start
  ```

Build
```bash
npm run build
```

## Firebase notes

This project expects Firebase to be configured. See FIREBASE.md for:
- creating a Firebase project
- enabling Auth & Firestore
- adding the web app and copying config to environment variables
- deploying to Firebase Hosting

The app includes `src/firebase.js` which reads config from env vars. If you prefer using the Firebase emulator locally, the FIREBASE.md explains how to enable it.

## Tailwind v4 notes

- Tailwind v4 may introduce different configuration keys from v3; ensure `tailwind.config.js` is set accordingly.
- PostCSS must be configured (see `postcss.config.js`) and your CSS entry should include:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

## Routing & state

- Routing (if present) is located in `src/pages` and `src/App.jsx`.
- State management is component state / context — check `src` for specifics.

## Testing & linting

- If test or lint scripts are present, run them with:
  ```bash
  npm test
  npm run lint
  ```
- If not present, consider adding ESLint and testing with Jest or Vitest.

## Deployment

This project is set up to deploy to Firebase Hosting (the live demo above). Basic deploy steps:
```bash
npm run build
firebase deploy --only hosting
```
See FIREBASE.md for CLI setup and CI deployment tips.

## Contributing

See CONTRIBUTING.md for how to contribute and run checks.



## Maintainer

- KAGISOMABUNDA
