# Elvin's Café — Coffee Dial-in Notebook ☕

An artisanal, modern web application for logging, dialing in, and mastering specialty espresso recipes. Tailored specifically for the **Breville Bambino** espresso machine and the **Fellow Opus** conical burr grinder.

**Live Deployment**: [cafe.pixelvin.com](https://cafe.pixelvin.com)
**Database**: Google Firebase (Firestore with offline persistence & Google Authentication)

---

## Features

- **Artisanal Coffee Theme**: Warm linen and espresso design system with typography by *Lora* & *Inter*.
- **Breville Bambino & Fellow Opus Dialing**:
  - Auto-calculated **Brew Ratio** pills (Ristretto, Espresso, Lungo) with live previews.
  - Dedicated **Fellow Opus** grind tracker (macro 1–11 and micro adjustments).
  - Built-in **Bambino Shot Timer / Stopwatch** that auto-fills extraction duration directly into your recipe.
- **Interactive Espresso Dialing Assistant**:
  - Interactive flavor diagnostic based on the Barista Hustle Espresso Compass.
  - Diagnoses sour, bitter, astringent, and watery extractions with specific advice for Bambino pre-infusion and Opus dial adjustments.
  - High-resolution, lightweight vector/WebP compass chart (<105 KB vs original 10 MB).
- **Dynamic WCAG Contrast**:
  - Automatically analyzes banner colors and switches text between dark espresso and cream to guarantee legibility.
- **Offline First**:
  - Powered by Firebase modular SDK v11 with IndexedDB local cache persistence.
- **Search, Filter & Export**:
  - Instant search across bean origins, roasters, notes, and grind sizes.
  - One-click local JSON backup export.
- **Security & Performance**:
  - Zero XSS vulnerabilities (sanitized DOM rendering).
  - Precompiled, purged CSS (<14 KB) and tiny application bundle (~33 KB).

---

## Tech Stack

- **Frontend**: [Vite](https://vite.dev) + [TypeScript](https://www.typescriptlang.org/)
- **Backend & Auth**: Google Firebase v11 (Firestore + Google Auth)
- **Deployment**: GitHub Pages via automated GitHub Actions CI/CD (`.github/workflows/deploy.yml`)

---

## Getting Started Locally

### 1. Clone & Install
```bash
git clone https://github.com/g33kenn/cafe.git
cd cafe
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Firebase configuration if using your own Firebase project:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
```
Production assets are generated in `dist/`.

---

## Deployment to GitHub Pages

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`). Whenever changes are pushed to `main`, GitHub Actions automatically:
1. Installs dependencies
2. Runs TypeScript checks & Vite production build
3. Deploys the `dist/` directory to GitHub Pages with the custom domain `cafe.pixelvin.com` preserved via `public/CNAME`.
