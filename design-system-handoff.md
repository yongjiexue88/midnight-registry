# Pocket Town Companions Design Handoff

Figma file: https://www.figma.com/design/gahuXHpSIkv0Dtyoj30lez

## Figma Implementation Status

The Figma file was created through Figma MCP. The account is on Figma Starter, so two platform limits changed the implementation shape:

- Starter allows only 3 real Figma pages. The requested 12-page structure is represented as named sections across `00 - Foundations`, `01 - Components & Assets`, and `02 - Screens, Flow & Export`.
- The MCP tool-call limit was reached before `02 - Screens, Flow & Export` could be populated. Completed in Figma: file creation, token variables, text styles, shadow styles, the Foundations page, the Components & Assets page, reusable component sets, export asset shelves, and uploaded existing PNG pet/town assets.

The full target structure and screen/flow/export specs below remain the source of truth for the next Figma continuation pass.

## Source Alignment

The design system is grounded in the current Next/React prototype, `public/assets/reference-pocket-town-companions.png`, `public/assets/town-plaza-scene.png`, and the six existing pet raster assets. The requested plan fits the current prototype well: the prototype already has a top HUD, pet care/status panel, central town scene, task/event rail, pet carousel, inventory/reward modal, and game-like button/card styling.

Main gaps to fill in Figma v1:

- Dedicated reusable component variants instead of one-off React markup.
- Explicit design tokens for colors, radius, shadows, and typography.
- Separate asset shelves for pet expressions, town locations, icon sizes, reward decorations, and export naming.
- Desktop and mobile screen specs that front-end code can map to React components.

## Design Tokens

### Colors

| Token | Value |
| --- | --- |
| `--color-primary` | `#6CA8FF` |
| `--color-secondary` | `#FF9DB5` |
| `--color-accent` | `#FFD86B` |
| `--color-success` | `#7DDEB4` |
| `--color-danger` | `#FF6B6B` |
| `--color-purple` | `#A98BFF` |
| `--color-bg` | `#FFF8E8` |
| `--color-surface` | `#FFFFFF` |
| `--color-text-main` | `#3A2E2A` |
| `--color-text-soft` | `#8C7468` |
| `--color-border` | `#4A352E` |

### Radius

| Token | Value |
| --- | --- |
| `--radius-sm` | `8px` |
| `--radius-md` | `14px` |
| `--radius-lg` | `22px` |
| `--radius-xl` | `32px` |
| `--radius-pill` | `999px` |

### Shadows

| Token | Value |
| --- | --- |
| `--shadow-button` | `0 5px 0 rgba(58, 46, 42, 0.18)` |
| `--shadow-card` | `0 10px 24px rgba(58, 46, 42, 0.12)` |
| `--shadow-modal` | `0 18px 40px rgba(58, 46, 42, 0.2)` |

### Typography

Use `Nunito` for UI text, `Fredoka` or `Baloo 2` for logo/display moments, and system sans-serif fallback for Chinese text.

| Style | Size / Line Height |
| --- | --- |
| Display | `40 / 48` |
| H1 | `32 / 40` |
| H2 | `24 / 32` |
| H3 | `20 / 28` |
| Body | `16 / 24` |
| Small | `14 / 20` |
| Tiny | `12 / 16` |

## Figma Pages

1. `00 - Design Tokens`
2. `01 - Brand & Logo`
3. `02 - Core Components`
4. `03 - Game HUD`
5. `04 - Pet Assets`
6. `05 - Town Locations`
7. `06 - Task System`
8. `07 - Inventory & Shop`
9. `08 - Reward Modals`
10. `09 - Screens`
11. `10 - Prototype Flow`
12. `11 - Export Assets`

## Reusable Component List

- `Button / Primary`
- `Button / Secondary`
- `Button / Ghost`
- `Button / Danger`
- `Button / Disabled`
- `Button / Icon`
- `HUD / ResourceBar`
- `HUD / StatBar`
- `Card / Pet`
- `Card / Task`
- `Card / Location`
- `Card / InventoryItem`
- `Modal / Reward`
- `Navigation / BottomNav`

## Component Variant Contract

### Button

Axes: `Style=Primary|Secondary|Ghost|Danger|Disabled|Icon`, `State=Default|Hover|Pressed|Disabled`.

Required anatomy: icon slot, label, large radius, thick dark border, bottom game shadow, pressed vertical offset.

### HUD / ResourceBar

Anatomy: username, avatar, coins, stars, energy, add buttons. Resource items should support `Resource=Coins|Stars|Energy|Gems|Treats`.

### HUD / StatBar

Axis: `Stat=Hunger|Mood|Cleanliness|Energy|EXP|Bond`.

Anatomy: icon, label, progress bar, numeric value.

### Card / Pet

Axis: `State=Default|Selected|Locked|Level Up Ready|Tired|Hungry`.

Anatomy: pet avatar, name, level, main attribute, mood status, rarity badge.

### Card / Task

Axis: `Type=Daily|Care|Training|Work|Adventure`, `State=Default|Completed|Locked|In Progress`.

Anatomy: task icon, task name, location, recommended stat, energy cost, success rate, duration, reward preview, CTA button.

### Modal / Reward

Axis: `Type=Daily Reward|Task Complete|Level Up|Rare Drop|Multi Reward`.

Anatomy: reward icon, reward name, quantity, rarity, claim button, sparkle/burst decoration.

## Pet Assets

Existing local source assets:

- `public/assets/pet-biscuit-corgi.png`
- `public/assets/pet-mochi-kitten.png`
- `public/assets/pet-pudding-bunny.png`
- `public/assets/pet-nugget-shiba.png`
- `public/assets/pet-coco-panda.png`
- `public/assets/pet-peanut-hedgehog.png`

The current Figma v1 should use these as full-body source art and create avatar/export frames from them. Expression frames should be named now and replaced with dedicated generated art later if higher fidelity is needed.

## Export Asset List

### Pets

- `pet-biscuit-corgi-avatar.png`
- `pet-biscuit-corgi-full.png`
- `pet-biscuit-corgi-idle.png`
- `pet-biscuit-corgi-happy.png`
- `pet-biscuit-corgi-hungry.png`
- `pet-biscuit-corgi-sleep.png`
- `pet-biscuit-corgi-sick.png`
- `pet-biscuit-corgi-level-up.png`
- Repeat the same suffixes for `mochi-kitten`, `pudding-bunny`, `nugget-shiba`, `coco-panda`, and `peanut-hedgehog`.

### Locations

- `location-town-plaza-map-icon.svg`
- `location-town-plaza-card.png`
- `location-town-plaza-tile.png`
- `location-town-plaza-locked.png`
- `location-town-plaza-active.png`
- Repeat the same suffixes for `cafe`, `library`, `training-yard`, `bath-house`, `market`, `home-room`, and `adventure-gate`.

### Icons

- `icon-stat-charm.svg`
- `icon-stat-strength.svg`
- `icon-stat-intelligence.svg`
- `icon-stat-luck.svg`
- `icon-stat-energy.svg`
- `icon-stat-hunger.svg`
- `icon-stat-mood.svg`
- `icon-stat-cleanliness.svg`
- `icon-stat-bond.svg`
- `icon-resource-coins.svg`
- `icon-resource-stars.svg`
- `icon-resource-gems.svg`
- `icon-resource-exp.svg`
- `icon-resource-food.svg`
- `icon-resource-toy.svg`
- `icon-resource-furniture.svg`
- `icon-resource-outfit.svg`
- `icon-resource-medicine.svg`

### UI and Rewards

- `ui-button-primary.svg`
- `ui-button-secondary.svg`
- `ui-button-danger.svg`
- `ui-button-icon.svg`
- `reward-stars-burst.png`
- `reward-coins-stack.png`
- `reward-gems-burst.png`
- `reward-rare-drop.png`

## Desktop Main Screen

Layout:

- Top: logo, resource bar, user avatar/actions.
- Left: active pet state panel with stat bars.
- Center: town scene and location hotspots.
- Right: task/event list.
- Bottom: pet companion carousel and quick actions.
- Lower right: reward and inventory modal entry buttons.

Recommended React structure:

```jsx
<GameShell>
  <TopHud />
  <DesktopLayout>
    <PetStatusPanel />
    <TownScene />
    <TaskEventPanel />
  </DesktopLayout>
  <CompanionCarousel />
  <QuickActions />
</GameShell>
```

## Mobile Main Screen

Layout:

- Top resource bar.
- Center town scene.
- Horizontal pet status cards.
- Task list.
- Bottom navigation.

Recommended breakpoint: desktop layout above `1024px`, mobile layout below `768px`, tablet layout can keep two columns.

## Prototype Flow

1. `Town` default screen.
2. Tap pet card to select companion.
3. Tap location hotspot to filter tasks.
4. Start task, show `In Progress` task state.
5. Complete task, open `Modal / Reward`.
6. Claim reward, update HUD resources.
7. Open Inventory, use item on pet, update stat bars.
8. Friends tab shows friend pets and visit rewards.

## Front-End Notes

- Keep CSS variables aligned with the Figma tokens above.
- Treat `Button`, `StatBar`, `PetCard`, `TaskCard`, `RewardModal`, and `BottomNav` as first React components.
- Use image assets only for pets, location scenery, and reward art; use SVG/icon components for resource/stat icons.
- Avoid text embedded in exported images. All UI copy should stay in React.
