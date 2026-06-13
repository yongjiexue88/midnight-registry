# Midnight Registry

A Next.js prototype for a night-desk identity verification horror game set in Moonshadow Apartments.

## Prototype

The playable MVP is a 3-night demo. Each night has 8 authored visitor checks built around:

- resident archive comparison
- visitor documents and temporary passes
- daily notices and rule changes
- entry ledger conflicts
- multi-line phone verification
- limited question prompts
- manual evidence marking
- allow, refuse, security, and hold decisions

Pocket Town Companions is archived and is no longer part of the visible prototype.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- CSS in `styles/globals.css`
- Font Awesome icons
- Storybook for the reusable Midnight Registry design system

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run build-storybook
```

## Routes

- `/`: playable Midnight Registry demo
- `/design-system`: reusable character, prop, rule, UI, error-detail, and nightly-flow assets

## File Structure

- `components/midnight/`: playable game and design-system library
- `data/midnightRegistryDesignSystem.ts`: reusable asset, rule, encounter, and ending data
- `public/assets/midnight-registry/`: generated character, prop, tool, and flow assets
- `stories/`: Storybook entry for the Midnight Registry design system
- `styles/`: global styles and tokens
- `supabase/`: placeholder database notes for future Midnight Registry persistence

## Supabase

The current prototype is local/static and does not require Supabase to run. `supabase/schema.sql` is a placeholder for a future Midnight Registry data model.
