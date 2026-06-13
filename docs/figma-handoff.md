# Figma Handoff

The reusable visual system is exposed in `/design-system`.

## Token Mapping

- `styles/tokens.css` contains color, radius, shadow, surface, and typography CSS variables.
- `tailwind.config.ts` maps key token variables into Tailwind color names for future utility usage.
- Component anatomy is implemented in DOM and CSS. No task text, button labels, or stats are baked into images.

## Components To Sync

- Buttons: primary, secondary, ghost, icon
- Cards: generic card, task card, inventory card, pet card
- Stat bars: need meters and progress bars
- Game components: PetStatusPanel, TownScene, TaskBoard, RewardModal, InventoryPanel, LocationMap

## Assets

- Pets: `public/assets/pets/`
- Locations: `public/assets/locations/`
- Background references: `public/assets/backgrounds/`
- Icons and rewards have reserved folders for generated or exported media.
