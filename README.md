# GitQuest

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

## i18n (future)

- `src/lib/i18n.ts` – placeholder and `t()` helper for **Lingo.dev** integration.
- Use translation keys in the store and UI; swap in Lingo when ready.

## Next steps

1. Implement **Level 1** gameplay in `src/app/play/page.tsx` and/or `src/components/levels/`.
2. Connect **Lingo.dev** in `src/lib/i18n.ts` and replace `t()` with the SDK.
3. Add more levels and route them from the levels page.
