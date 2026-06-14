# Prototype Progress

Original prompt: Finish the marked Midnight Registry V1-V4 roadmap, review the current changes, create the required animations and materials, verify formats and crops, fix findings, update the plan, and commit when complete.

Current objective (2026-06-14): Implement every Sprint and material/audio/animation requirement in `docs/游戏体验提升计划书.md`, make the game more immersive and urgent, review and fix the resulting code, update the report, then commit and push when all verification passes.

## Current Direction

Midnight Registry is the active playable prototype. It replaces visible Pet Town routes and pet-care gameplay with a seven-night door-clerk identity verification horror game while preserving the original three-night MVP cases.

Current implementation status:

- Next.js App Router prototype is available at `/`.
- Reusable Midnight Registry design-system surface is available at `/design-system`.
- Character, prop, UI-flow, rule, error-detail, and nightly encounter assets live under `public/assets/midnight-registry/`.
- Core data for reusable assets and authored encounters lives in `data/midnightRegistryDesignSystem.ts`.
- Storybook exposes the reusable design-system assets through `stories/MidnightRegistryDesignSystem.stories.tsx`.

## Verified Playable Scope

- 7 playable story nights
- 10 resident records
- 68 authored/generated story cases, including the original 24-case three-night MVP
- evidence-based fake detection through names, rooms, IDs, appearance, habits, appointments, phone calls, ledgers, and rules
- four visitor outcomes: allow, refuse, security, hold
- story, Blackout challenge, and endless shift modes
- archive pollution and drag/select restoration
- persistent resident outcomes, office upgrades, equipment failures, and learning impostors
- 56 reusable animation events
- 16 character portraits, 39 props/tools/clues, and 8 CCTV/environment materials

## Archived Work

The previous Pocket Town Companions prototype, routes, API handlers, data catalogs, game store, pet assets, and Supabase seed/schema are archived and should not guide new implementation unless the user explicitly revives that direction.

Historical notes for that archived prototype are intentionally not treated as current source of truth.

## Verification

- `npm run verify:assets` validates portrait, prop, and CCTV dimensions plus the 56-event animation inventory.
- `npm run lint` validates TypeScript.
- `npm run build` validates the production Next.js build and both `/` and `/design-system` routes.
- Contact-sheet review confirms individual exports contain no neighboring sheet art or filename strips.
- In-app browser review exercised prep, archive, switchboard, hold investigation, persistent resident status, visitor advancement, and correct-refusal feedback.
- Runtime visual finding fixed: switchboard line cards now use a dark high-contrast surface, and verification-tool labels stack without mid-word wrapping.

## Remaining Product Work

- Durable save persistence remains intentionally deferred until a Midnight Registry database model is designed.
- Additional authored cases can expand Endless Shift later without changing the completed V1-V4 systems.

## UX Improvement Work Completed

- Sprint 1: directed first-night tutorial, current objective, five-stage case progress, layered hints, evidence thresholds, and explanatory results.
- Sprint 2: interactive document comparison, positive/negative evidence capture, phone states, scanner feedback, talking/question states, CCTV hotspots, and explicit saves.
- Sprint 3: Night 3 foreshadowing rewrite, all eight CCTV channels with night unlocks, nightly objectives, mid-shift events, and cliffhangers.
- Sprint 4: desk-like prep phase, ten prep sprites, shift transition, 15 generated WAV effects, stamp feedback, and stat-damage animation.
- Maintenance: 68-case scope unified, endless count renamed, runtime asset verification extended, and `/animation-debug` added.
- Runtime review exercised the three-case tutorial, 208-room phone conflict, CCTV freeze/save, security result, scanner, question, evidence warning, and hold investigation.
- V4 monster/audio pass: added six Borrower monster profiles, 24 clean 512 x 768 reveal-stage PNGs plus a contact sheet, 68 generated WAV effects, unified audio mapping, first-night 8-case monster sample order, exposure meter, abnormal observation panel, containment actions, and design-system monster template coverage.
- Verification on 2026-06-14: `npm run verify:assets`, `npm run lint`, and `npm run build` passed; in-app Browser opened the local preview, first-case tutorial flow completed correctly, design-system monster section loaded, and Playwright screenshots/state checks covered desktop and 390px mobile viewports without console errors.
