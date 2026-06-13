# Prototype Progress

## Current Direction

Midnight Registry is the active playable prototype. It replaces visible Pet Town routes and pet-care gameplay with a 3-night door-clerk identity verification horror demo.

Current implementation status:

- Next.js App Router prototype is available at `/`.
- Reusable Midnight Registry design-system surface is available at `/design-system`.
- Character, prop, UI-flow, rule, error-detail, and nightly encounter assets live under `public/assets/midnight-registry/`.
- Core data for reusable assets and authored encounters lives in `data/midnightRegistryDesignSystem.ts`.
- Storybook exposes the reusable design-system assets through `stories/MidnightRegistryDesignSystem.stories.tsx`.

## Verified MVP Scope

- 3 playable nights
- 10 resident records
- 8 visitor checks per night
- evidence-based fake detection through names, rooms, IDs, appearance, habits, appointments, phone calls, ledgers, and rules
- four visitor outcomes: allow, refuse, security, hold

## Archived Work

The previous Pocket Town Companions prototype, routes, API handlers, data catalogs, game store, pet assets, and Supabase seed/schema are archived and should not guide new implementation unless the user explicitly revives that direction.

Historical notes for that archived prototype are intentionally not treated as current source of truth.

## Next TODO

- Add durable persistence only after a Midnight Registry database model is designed.
- Expand authored night content beyond the MVP once the 3-night loop is stable.
- Keep the design-system assets reusable in the playable desk UI and Storybook.
