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
