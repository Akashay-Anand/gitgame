# GitQuest

## Deployed link
- [magnificent-banoffee-587dc2.netlify.app  ](https://magnificent-banoffee-587dc2.netlify.app/levels) 

## Demo Video
- [Youtube demo video link] (https://youtu.be/OKp8kJsVlRc) 

<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/32f0cf67-517c-46f7-98a0-c3ac2a6cd130" />


A frontend-only **web-based Git learning game** built with React, Next.js, and TypeScript.

## Stack

- **React 19** + **Next.js 15** (App Router)
- **TypeScript**
- **Zustand** – game state (level, repository, avatar messages) with optional localStorage persistence
- **Tailwind CSS** – styling
- **Framer Motion** – UI animations
- **TanStack Query** – ready for future asset/translation fetching

## Project structure

```
src/
├── app/              # Next.js App Router (routes & layouts)
├── components/       # Reusable UI and level components
│   ├── levels/       # Level-specific components (Level 1, 2, …)
│   └── ui/           # Shared UI components
├── store/            # Zustand stores (game state)
├── styles/           # Global and shared styles
├── lib/               # Utilities (i18n placeholder, storage)
└── pages/             # (Optional) extra page modules if needed
```

## Scripts

```bash
npm install   # Install dependencies
npm run dev   # Start dev server (http://localhost:3000)
npm run build # Production build
npm run start # Start production server
npm run lint  # Run ESLint
```

## Game state (Zustand)

- **Level** – current level id and completed levels
- **Repository** – path/branch for the level
- **Avatar messages** – in-game guide messages

Progress is persisted to `localStorage` under the key `gitquest-progress` (current level and completed levels). Avatar messages are not persisted.

## i18n (Lingo.dev)

- **Source of truth**: `i18n/en.json` (English). Lingo.dev translates into `i18n/hi.json` (and other targets in `i18n.json`).
- **Runtime**: `src/lib/copy.ts` exposes `t(key)` and loads messages from `i18n/[locale].json`; `src/lib/i18n.ts` defines `getLocale()` and supported locales (`en`, `hi`).
- **CI**: On every push to `main`, the [Lingo.dev GitHub Action](.github/workflows/i18n.yml) runs and opens a **translation PR** with updated `i18n/*.json` and `i18n.lock`.

**Setup (one-time):**

1. **Repository secret**: In GitHub → **Settings → Secrets and variables → Actions**, add a secret named `LINGODOTDEV_API_KEY` with your [Lingo.dev](https://www.lingo.dev) API key.
2. **Allow Actions to create PRs**: In **Settings → Actions → General**, enable **Allow GitHub Actions to create and approve pull requests**, then save.

After that, merging any feature PR (or any change) to `main` will trigger the workflow and Lingo will open a PR like “feat: update translations via @LingoDotDev” for you to merge.

## Next steps

1. Implement **Level 1** gameplay in `src/app/play/page.tsx` and/or `src/components/levels/`.
2. Add a language switcher and wire it to `getLocale()` (e.g. cookie or URL) so users can switch to Hindi.
3. Add more levels and route them from the levels page.

