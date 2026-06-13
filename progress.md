Original prompt: 我想要这个游戏像以前的QQ宠物一样，养成类的，需要定制各种宠物类型、属性、魅力武力智力和任务，并先设计可重复使用的 design system 素材，准备做成网页游戏。Confirmed direction: modern cute web game style, full interactive web prototype, selected visual direction 3 Pocket Town Companions.

Progress:
- Created isolated Product Design prototype at prototypes/pocket-town-companions.
- Installed local dependencies and Font Awesome icon assets.
- Generated and copied visual assets: selected visual reference, town plaza scene, and six pet portraits.
- Next: implement React/CSS interactive prototype, run build, launch dev server, verify with browser screenshots and design QA.

TODO:
- Add interactive care actions, task rewards, inventory use, pet selection, location switching, and design system shelf.
- Add render_game_to_text and advanceTime hooks for web-game verification.
- Capture implementation screenshot and compare against reference in design-qa.md.

- Implemented interactive React prototype shell with pet selection, care actions, task claims, inventory usage, reward modal, design kit drawer, and web-game text hooks.
- Added responsive CSS matching the selected Pocket Town Companions visual direction.

- Tightened desktop layout and moved status bubble away from town hotspots after screenshot review.

- Added Pocket Town mini map component to the task/events rail to better match the selected visual direction.

- Final build passed. Captured desktop, interaction, modal, mobile, and side-by-side QA evidence.
- design-qa.md final result is passed. Web-game client produced final screenshots/state JSON; DOM click-selector had a Playwright stability warning under the virtual-time shim, while custom Playwright interaction checks passed.

- Migrated the prototype into a maintainable Next.js App Router + TypeScript structure while preserving the Pocket Town visual direction and generated assets.
- Added reusable layout, game, and UI components under `components/`, typed seed data under `data/`, game rules/Zustand state under `lib/game/`, Supabase helpers under `lib/supabase/`, route handlers under `app/api/`, and SQL/docs/README files.
- Split reusable assets into `public/assets/pets`, `public/assets/locations`, and `public/assets/backgrounds`.
- Implemented routes for `/`, `/town`, `/pets`, `/tasks`, `/inventory`, `/shop`, `/friends`, and `/design-system`.
- Added global Next styles in `styles/globals.css` for landing, town, route panels, reusable components, reward modal, toast, and bottom nav.
- Added Supabase baseline schema in `supabase/schema.sql` with catalog tables, player progress tables, inventory, task runs, rewards, friendships, RLS policies, grants, and seed data aligned to the app's TypeScript IDs.
- Verification after Next migration:
  - `npm run build` passed on Next.js 16.2.9.
  - `npm run lint` passed when run after build completed.
  - Next route output includes `/`, `/town`, `/design-system`, `/pets`, `/tasks`, `/inventory`, `/shop`, `/friends`, and API routes.
  - Web-game verification against `http://127.0.0.1:3000/town` produced state JSON and screenshots in `output/next-web-game`.
  - Playwright interaction check clicked a task Start button, opened reward modal, updated coins/stars/inventory/task completion, and saw no console errors.

Next TODO:
- Connect route handlers to real Supabase auth/session persistence once project credentials are configured.
- Generate a real Supabase migration with `supabase migration new pocket_town_baseline_schema` once the Supabase CLI is installed.
- Add dedicated image assets for icons/rewards if the next iteration needs fewer Font Awesome placeholders.
