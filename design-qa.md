**Source Visual Truth**
- User-provided inspection-game screenshots from June 13, 2026.
- Product direction: original seven-night door-clerk identity verification horror game, not Pet Town.

**Generated Asset Inventory**
- Character roster sheet: `/Users/yongjiexue/Documents/pet_town/public/assets/midnight-registry/character-roster-sheet.png`
- Props and tools sheet: `/Users/yongjiexue/Documents/pet_town/public/assets/midnight-registry/props-and-tools-sheet.png`
- UI flow components sheet: `/Users/yongjiexue/Documents/pet_town/public/assets/midnight-registry/ui-flow-components-sheet.png`
- Corrected seven-night progression sheet: `/Users/yongjiexue/Documents/pet_town/public/assets/midnight-registry/night-progression-encounters-sheet.png`
- Individual character card crops: `/Users/yongjiexue/Documents/pet_town/public/assets/midnight-registry/characters/*.png`

**Reusable Data And Storybook**
- Data source: `/Users/yongjiexue/Documents/pet_town/data/midnightRegistryDesignSystem.ts`
- Design system component: `/Users/yongjiexue/Documents/pet_town/components/midnight/MidnightRegistryDesignSystem.tsx`
- Next preview route: `http://127.0.0.1:3000/design-system`
- Storybook story: `/Users/yongjiexue/Documents/pet_town/stories/MidnightRegistryDesignSystem.stories.tsx`

**Review Results**
- Asset sheets cover characters, objects/tools, UI components, and full nightly structure.
- The first UI flow sheet visually skipped Night 6, so a corrected seven-night progression sheet was generated and marked as canonical.
- Character assets were regenerated as individual clean portrait files rather than cropped from the labeled roster sheet. Each character now uses a uniform `512 x 768` canvas with no top numbers, status dots, card border, name label, or filename strip.
- The old roster-sheet crop approach was abandoned because the generated display board did not keep every figure at a uniform position or scale.
- 39 individual prop/tool/clue crops were exported from the props sheet and added to the design system. Problem crops such as the glove, scarf, cane, red string, paper clips, floor rules, and final-column character cards were manually corrected after contact-sheet review.
- `/design-system` DOM audit passed: 4 sheet cards, 16 character cards, 5 prop/tool groups, 12 error-detail cards, 7 night cards, and 4 ending cards.
- Runtime/file image audit found 59 PNG assets and no empty or black-image candidates.
- Game UI audit passed: first visitor portrait loads from `/assets/midnight-registry/characters/lin-anna-dance-teacher.png`, and the four decision buttons are present.
- Game UI now also uses cropped prop assets for call room, ID scanner, CCTV, question, approve, deny, security call, and wait controls.

**Implementation Checklist**
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run build-storybook`: passed, with only Storybook bundle-size warnings.
- In-app browser opened `http://127.0.0.1:3000/design-system`.
- In-app browser opened `http://127.0.0.1:3000/` and verified the integrated character image plus decision modal.

final result: passed
