# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Prototype Decisions

- Pocket Town Companions should be treated as a reusable game UI design system first, not a one-off screen.
- Canonical Figma page structure: `00 - Design Tokens`, `01 - Brand & Logo`, `02 - Core Components`, `03 - Game HUD`, `04 - Pet Assets`, `05 - Town Locations`, `06 - Task System`, `07 - Inventory & Shop`, `08 - Reward Modals`, `09 - Screens`, `10 - Prototype Flow`, `11 - Export Assets`.
- Core visual language: rounded, cute, modern web game UI with soft cream surfaces, chunky bordered cards, bottom button shadows, candy accent colors, and friendly rounded typography.
- Design tokens should map to the CSS custom properties requested for Pocket Town Companions, including primary `#6CA8FF`, secondary `#FF9DB5`, accent `#FFD86B`, background `#FFF8E8`, main text `#3A2E2A`, and border `#4A352E`.
- Asset naming should be code-ready and kebab-case, for example `pet-biscuit-corgi-avatar.png`, `location-town-plaza-card.png`, `icon-stat-charm.svg`, and `reward-stars-burst.png`.
