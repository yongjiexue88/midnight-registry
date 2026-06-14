# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Prototype Decisions

- Pocket Town Companions is archived and should not guide future design work unless the user explicitly revives it.
- Current active prototype direction is Midnight Registry: a seven-night door-clerk identity verification horror game with reusable character, prop, UI, rule, error-detail, and nightly encounter assets.
- Midnight Registry decisions must support four outcomes during each visitor check: allow entry, refuse entry, call security, and hold/wait.
- Storybook/design-system assets should be reusable in the game UI, not just static reference images.
- Midnight Registry / 午夜登记簿 is the primary playable prototype and should replace visible Pet Town routes and pet-care gameplay.
- Midnight Registry should feel like an original old-apartment night desk horror interface: dark lobby, registry paperwork, resident archive comparison, nightly rules, verification tools, sanity pressure, and direct allow/refuse decisions.
- The MVP should remain a 3-night playable demo with authored visitor cases, 10 resident records, 8 visitors per night, and evidence-based fake detection through names, rooms, IDs, appearance, habits, appointments, phone calls, and rules.
- Midnight Registry gameplay should emphasize a manual door-clerk verification loop: inspect visitor documents, compare archive/notice details, call rooms or contacts, ask questions, mark an approval form, then stamp allow/refuse/security/hold.
- Midnight Registry impostors are not generic monsters; they are registry error records trying to be formally logged so they can occupy a real resident's identity and erase the original from reality.
- Every allow/refuse/security/hold decision should feel like a reality-recording action, not a simple door-control action.
- The player starts as a temporary night clerk, but the long arc should imply their own file is in the registry with status "waiting for replacement"; the final duplicate should be almost fully documented and only beatable through accumulated evidence.
- The core verification rule is that impostors can copy documents and recorded facts, but struggle with unrecorded memories, habits, greetings, relationships, and private routines.
- Hold/wait should work as a narrative investigation tool: waiting can reveal callbacks, CCTV contradictions, changing files, or visitor reactions, while carrying reputation and danger risks.
- The seven-night story should reveal a past whole-building registration error, Blue Star Repair's impossible work orders, unreliable management, archive pollution, learning impostors, and the final Y. Xue shift-change duplicate.
- Midnight Registry exported assets must be clean reusable game materials: no external sheet labels, filename strips, card borders, or neighboring artwork may remain in individual exports; characters use uniform `512 x 768` portrait canvases and props/tools/clues use uniform `512 x 512` canvases, with contact-sheet review before considering the asset pass complete.
- Midnight Registry 的主游戏可见内容默认使用简体中文，包括剧情、住户档案、规则、工具结果、监控、结算、维修小游戏和结局；英文仅可保留在稳定的内部 ID 与判定逻辑中。
- 留置 / 等待必须是可互动的调查分支：玩家选择回拨、复查监控或观察反应，取得不同证据后再进行允许、拒绝、呼叫安保或继续留置的二次裁决。
- 《午夜登记簿》的前 10 分钟必须被明确导演：第一夜前三案依次教学文件与档案、外貌差异、证据与安保，之后才开放自由核验。
- 主游戏应始终显示当前目标、案件阶段和证据完整度；玩家停滞时分层提示，但提示不得直接公布真假答案。
- 关键工具与裁决必须有即时音画反馈，整体节奏应更紧迫：电话、扫描、CCTV、提问、印章、数值受损和夜间转场都不能只返回文字。
- 第三夜只能铺垫换班异常与前台影像，不得让第二个薛夜实体来访；第七夜必须保留为唯一的前台复制体实体高潮。
- 白日准备阶段应呈现为旧公寓门岗桌面：合同、支援道具、值班手册、值班铃和门禁总开关均作为可复用游戏素材，而不是普通设置卡片。
- 第一案林安雅必须是完全不会迷路的强导演教学：只高亮一个可操作目标，按证件、档案、保存姓名冲突证据、拒绝章顺序推进，禁止玩家过早自由乱点。
- 证据链必须是主游戏屏幕中央的核心 UI；每次查看资料或使用工具都应像把证据卡钉到板上，并明确显示结论与推荐裁决。
- 电话、CCTV、扫描器和提问都必须是小操作流程：选择线路、切频道/冻结/截图、校准扫描条、选择问题，而不是单击后只读文本答案。
- 恐怖反馈必须绑定玩家盖章行为：错放、错拒、正确安保、正确留置和证据不足强行盖章都要表现登记簿改写现实的即时后果。
