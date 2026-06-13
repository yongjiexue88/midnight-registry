# Pocket Town Companions

A cozy web-based pet town companion game built with Next.js, Supabase, and reusable game UI components.

## Gameplay

Pick a pet, care for it with Feed, Bath, Play, and Rest, then run town tasks to earn coins, stars, EXP, and inventory items. Each task checks energy, calculates a success rate from the pet stat, mood, and fatigue, then opens a reward modal. Pets level up every 100 EXP and gain stats.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS config plus CSS variables in `styles/tokens.css`
- Zustand local game state
- Supabase schema and seed SQL
- Vercel-ready route handlers

## Local Start

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Supabase

Copy `.env.example` to `.env.local`, then set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

For GitHub Actions deployment, set the same Supabase values plus `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub repository secrets.

Run `supabase/schema.sql`, then `supabase/seed.sql`.

## Vercel

Import the repository in Vercel, keep the default Next.js settings, and add the Supabase environment variables. API route handlers are in `app/api`.

## File Structure

- `app/`: route pages and Vercel API route handlers
- `components/layout/`: app shell, resource bar, nav, side panels
- `components/game/`: town, pet, task, inventory, reward, and map components
- `components/ui/`: reusable primitive UI
- `data/`: static seed data for prototype state
- `lib/game/`: types, rules, reward math, care logic, leveling, Zustand store
- `lib/supabase/`: client helpers
- `public/assets/`: pets, locations, icons, rewards, and backgrounds
- `styles/`: design tokens and global styles
- `supabase/`: schema and seed SQL
- `docs/`: game design, Figma handoff, deployment notes

## Design System

Open `/design-system` to inspect color tokens, typography, buttons, cards, stat bars, pet cards, task cards, reward modal behavior, inventory grid, and location cards. This page is the source for future Figma sync.

## Add A New Pet

1. Place the pet image in `public/assets/pets/`.
2. Add a `Pet` object in `data/pets.ts`.
3. Add a matching row to `supabase/seed.sql` if it should be available in Supabase.

## Add A New Task

1. Add a `Task` object in `data/tasks.ts`.
2. Choose a `locationId`, `recommendedStat`, `energyCost`, and rewards.
3. Add a matching `task_templates` row in `supabase/seed.sql`.

## Add A New Location

1. Add the location metadata in `data/locations.ts`.
2. Add or reuse an image in `public/assets/locations/`.
3. Pick hotspot coordinates as percentages of the town scene.

## Add A New Item

1. Add an `InventoryItem` in `data/items.ts`.
2. Give it a typed effect object and Font Awesome icon.
3. Add it to `initialInventory` if players should start with it.
4. Add a matching `inventory_items` row in `supabase/seed.sql`.
