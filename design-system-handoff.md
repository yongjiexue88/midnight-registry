# Midnight Registry Design Handoff

Figma file: pending refreshed Midnight Registry handoff.

Pocket Town Companions is archived. Do not use the old pet-care Figma pages, pet assets, town-scene references, or deleted Pet Town components as source material unless the project direction is explicitly revived.

## Source Alignment

The current design system is grounded in the playable Midnight Registry prototype and Storybook surface:

- `components/midnight/MidnightRegistryGame.tsx`
- `components/midnight/MidnightRegistryDesignSystem.tsx`
- `data/midnightRegistryDesignSystem.ts`
- `public/assets/midnight-registry/`
- `/design-system`
- `stories/MidnightRegistryDesignSystem.stories.tsx`

The reusable system must support the manual door-clerk verification loop: inspect documents, compare resident records and notices, call rooms or contacts, ask questions, mark evidence, then decide allow, refuse, security, or hold.

## Design Tokens

| Token | Current Direction |
| --- | --- |
| Background | near-black lobby, desk, registry, and monitor surfaces |
| Paper | aged registry paper, folders, notices, and stamped forms |
| Accent | warning red, evidence amber, sickly green, scanner blue |
| Typography | compact, legible clerk-interface text with stronger label hierarchy |
| Shape | restrained rectangular controls, 8px or smaller radii for cards and tools |
| Motion | pressure and state feedback, not decorative animation |

## Reusable Component Targets

- `NightStartNotice`
- `VisitorAtDoorPanel`
- `ResidentArchiveCard`
- `VisitorDocumentCard`
- `DailyNoticePanel`
- `AppointmentPanel`
- `EntryLogPanel`
- `EvidenceComparisonRow`
- `PhoneVerificationTool`
- `ScannerResultTool`
- `CctvMonitorTool`
- `QuestionPromptTool`
- `ApprovalForm`
- `DecisionControls`
- `NightSettlement`
- `EndingSummary`

## Variant Contract

### DecisionControls

Actions: `Allow`, `Refuse`, `Security`, `Hold`.

Required states: default, selected, unavailable, submitted, correct, wrong. The controls should be visually distinct enough for repeated desk-work use and must not rely only on color.

### EvidenceComparisonRow

Evidence types: name, room, ID, appearance, habit, appointment, call, rule, ledger.

Required states: unchecked, match, mismatch, suspicious, resolved. Rows should support concise notes and visible confidence/status markers.

### VerificationTool

Tools: phone, scanner, CCTV, question prompt.

Required states: idle, available, used, blocked, corrupted, contradiction found. The component should expose the evidence output in a reusable text block rather than as one-off prose.

### NightSettlement

Outcomes: survived, fired, replaced, entity admitted, perfect shift.

Required content: night number, visitor accuracy, mistake list, sanity pressure, unlocked notice, and next-night setup.

## Asset Shelves

### Characters

Use `public/assets/midnight-registry/characters/` for resident, visitor, and false-tenant portraits. Keep each character export tied to a stable data ID in `data/midnightRegistryDesignSystem.ts`.

### Props And Tools

Use `public/assets/midnight-registry/props/` for desk tools, notices, stamps, evidence objects, ledgers, scanner outputs, and pressure UI.
Each prop/tool/clue PNG in this directory is normalized to a `512 x 512` canvas with the full object centered and no external sheet labels.

### Sheets

Use these overview sheets for Figma reference shelves:

- `public/assets/midnight-registry/character-roster-sheet.png`
- `public/assets/midnight-registry/props-and-tools-sheet.png`
- `public/assets/midnight-registry/ui-flow-components-sheet.png`
- `public/assets/midnight-registry/night-progression-encounters-sheet.png`

## Screen Targets

### Playable Desk

Primary layout: dark apartment lobby and clerk desk, visitor panel, archive comparison, rules/notices, evidence tools, approval form, and decision controls.

### Design System

Primary layout: reusable component shelves grouped by characters, props, UI states, evidence states, nightly flows, and endings.

### Mobile

Use a stacked verification workflow. The visitor, document, archive, and decision areas must remain reachable without hiding the four decision outcomes.

## Implementation Notes

- Storybook assets should be reusable in the game UI, not static screenshots only.
- Figma components should map to current React component anatomy where possible.
- Avoid reviving deleted Pet Town APIs, routes, stores, seed data, CSS classes, or assets.
