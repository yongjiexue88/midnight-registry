export type RegistryCharacterKind = "resident" | "visitor" | "impostor" | "final";

export type RegistryCharacterAsset = {
  id: string;
  name: string;
  room?: string;
  role: string;
  kind: RegistryCharacterKind;
  image: string;
  primaryChecks: string[];
  impostorHooks?: string[];
};

export type RegistrySheetAsset = {
  id: string;
  title: string;
  image: string;
  usage: string;
  reviewNotes: string[];
};

export type RegistryPropAsset = {
  id: string;
  label: string;
  category: "document" | "tool" | "decision" | "clue" | "reward";
  usage: string;
};

export type RegistryErrorDetail = {
  id: string;
  label: string;
  real: string;
  impostorExample: string;
  checkWith: string;
};

export type RegistryNightPlan = {
  id: number;
  title: string;
  storyTheme: string;
  keyEvent: string;
  mechanic: string;
  visitorTarget: string;
  rules: string[];
  encounters: {
    id: string;
    visitor: string;
    claim: string;
    correctDecision: "allow" | "reject" | "security" | "wait";
    evidence: string[];
  }[];
};

export type RegistryStoryPillar = {
  id: string;
  title: string;
  detail: string;
};

export const registryAssetBase = "/assets/midnight-registry";

export const registryStoryPillars: RegistryStoryPillar[] = [
  {
    id: "registry-errors",
    title: "Impostors are registry errors",
    detail: "They are not simply monsters at the door. They need a formal entry stamp so the building can treat their copied identity as real and erase the original resident.",
  },
  {
    id: "identity-layers",
    title: "Evidence has three identity layers",
    detail: "Paper identity is documents and IDs. Social identity is calls, habits, relationships, and routines. True identity is exposed by private memories that were never written into the archive.",
  },
  {
    id: "player-replacement",
    title: "The clerk is part of the record",
    detail: "Y. Xue begins as a temporary night clerk, then finds their own registry file marked waiting for replacement. The final visitor is nearly correct because the system is trying to log a second clerk.",
  },
  {
    id: "hold-as-story",
    title: "Hold creates story pressure",
    detail: "Hold / wait is not a pause. It gives callbacks, CCTV, files, and visitor behavior time to change, while still risking reputation loss, danger, and timeout failures.",
  },
];

export const registryCharacterAssets: RegistryCharacterAsset[] = [
  {
    id: "lin-anna-dance-teacher",
    name: "Lin Anna",
    room: "203",
    role: "Dance teacher",
    kind: "resident",
    image: `${registryAssetBase}/characters/lin-anna-dance-teacher.png`,
    primaryChecks: ["Left-eye mole", "short black hair", "home before 21:00", "never wears red"],
    impostorHooks: ["Name typo", "mole on right eye", "red coat", "late-night shift excuse"],
  },
  {
    id: "zhou-qiming-retired-police",
    name: "Zhou Qiming",
    room: "506",
    role: "Retired police officer",
    kind: "resident",
    image: `${registryAssetBase}/characters/zhou-qiming-retired-police.png`,
    primaryChecks: ["Black glove on right hand", "short answers", "never says he forgot his key"],
    impostorHooks: ["Left-hand glove", "too talkative", "young ID photo", "forgot-key claim"],
  },
  {
    id: "li-mei-florist",
    name: "Li Mei",
    room: "302",
    role: "Florist",
    kind: "resident",
    image: `${registryAssetBase}/characters/li-mei-florist.png`,
    primaryChecks: ["Silver bracelet on left wrist", "flowers on Wednesdays", "takes stairs"],
    impostorHooks: ["Bracelet on right wrist", "uses elevator", "answers to Auntie"],
  },
  {
    id: "chen-rui-doctor",
    name: "Chen Rui",
    room: "410",
    role: "Emergency doctor",
    kind: "resident",
    image: `${registryAssetBase}/characters/chen-rui-doctor.png`,
    primaryChecks: ["Left eyebrow scar", "states current date", "night duty schedule"],
    impostorHooks: ["Scar on right eyebrow", "wrong date", "cannot name ward"],
  },
  {
    id: "zhao-jun-accountant",
    name: "Zhao Jun",
    room: "104",
    role: "Accountant",
    kind: "resident",
    image: `${registryAssetBase}/characters/zhao-jun-accountant.png`,
    primaryChecks: ["Round wire glasses", "leather folder", "asks for mail ledger"],
    impostorHooks: ["No folder", "brings animal", "does not ask about ledger"],
  },
  {
    id: "wang-yulan-librarian",
    name: "Wang Yulan",
    room: "601",
    role: "Retired librarian",
    kind: "resident",
    image: `${registryAssetBase}/characters/wang-yulan-librarian.png`,
    primaryChecks: ["Moon-handled cane", "Mandarin only at desk", "never says seventh floor"],
    impostorHooks: ["English greeting", "claims room 701", "braid on wrong shoulder"],
  },
  {
    id: "mina-park-art-student",
    name: "Mina Park",
    room: "208",
    role: "Art student",
    kind: "resident",
    image: `${registryAssetBase}/characters/mina-park-art-student.png`,
    primaryChecks: ["Blue paint scarf", "star ledger signature", "paint-stained hands"],
    impostorHooks: ["Clean hands", "erased star", "no scarf outside"],
  },
  {
    id: "sun-hao-cook",
    name: "Sun Hao",
    room: "315",
    role: "Night cook",
    kind: "resident",
    image: `${registryAssetBase}/characters/sun-hao-cook.png`,
    primaryChecks: ["Right-thumb burn", "three knocks", "wrapped bun for desk"],
    impostorHooks: ["Four knocks", "left-thumb burn", "no food smell"],
  },
  {
    id: "guo-lan-tailor",
    name: "Guo Lan",
    room: "402",
    role: "Tailor",
    kind: "resident",
    image: `${registryAssetBase}/characters/guo-lan-tailor.png`,
    primaryChecks: ["Measuring tape", "narrow sleeves", "old building name"],
    impostorHooks: ["Loose sleeves", "misses torn cuff", "wrong building name"],
  },
  {
    id: "owen-xu-violinist",
    name: "Owen Xu",
    room: "502",
    role: "Violinist",
    kind: "resident",
    image: `${registryAssetBase}/characters/owen-xu-violinist.png`,
    primaryChecks: ["Silver-latch violin case", "hums before speaking", "never hands over case"],
    impostorHooks: ["Brass latch", "hums after speaking", "asks you to carry case"],
  },
  {
    id: "han-dong-repair-worker",
    name: "Han Dong",
    role: "Blue Star repair worker",
    kind: "visitor",
    image: `${registryAssetBase}/characters/han-dong-repair-worker.png`,
    primaryChecks: ["Blue Star patch", "20:30 appointment", "fourth-floor electrical box"],
    impostorHooks: ["Blue Heart patch", "23:30 arrival", "claims seventh floor"],
  },
  {
    id: "rina-courier",
    name: "Rina Sol",
    role: "Courier",
    kind: "visitor",
    image: `${registryAssetBase}/characters/rina-courier.png`,
    primaryChecks: ["Courier pass", "medicine parcel appointment", "drop-off only after curfew"],
    impostorHooks: ["Wrong parcel type", "wrong room", "tries to enter after 22:00"],
  },
  {
    id: "false-tenant-too-wide-smile",
    name: "False Tenant",
    role: "Social mimic",
    kind: "impostor",
    image: `${registryAssetBase}/characters/false-tenant-too-wide-smile.png`,
    primaryChecks: ["Smile exceeds portrait note", "answers are too rehearsed", "shadow direction wrong"],
  },
  {
    id: "mirror-visitor-wrong-side-mole",
    name: "Mirror Visitor",
    role: "Wrong-side duplicate",
    kind: "impostor",
    image: `${registryAssetBase}/characters/mirror-visitor-wrong-side-mole.png`,
    primaryChecks: ["Mirrored feature placement", "voice repeats one second late", "photo does not line up"],
  },
  {
    id: "seventh-floor-impostor",
    name: "Seventh-floor Impostor",
    role: "Impossible maintenance claim",
    kind: "impostor",
    image: `${registryAssetBase}/characters/seventh-floor-impostor.png`,
    primaryChecks: ["Claims 7F", "no valid company patch", "toolbox does not contain tools"],
  },
  {
    id: "clerk-duplicate-silhouette",
    name: "Clerk Duplicate",
    role: "Final-night duplicate",
    kind: "final",
    image: `${registryAssetBase}/characters/clerk-duplicate-silhouette.png`,
    primaryChecks: ["Uses your badge", "room 000", "knows questions before asked"],
  },
];

export const registrySheetAssets: RegistrySheetAsset[] = [
  {
    id: "character-roster",
    title: "Character roster sheet",
    image: `${registryAssetBase}/character-roster-sheet.png`,
    usage: "Master sheet for resident, visitor, impostor, and final duplicate silhouettes.",
    reviewNotes: ["16 labeled front-facing busts are present.", "Readable identity markers are visible.", "Individual character portraits use regenerated clean 512 x 768 files rather than labeled sheet crops."],
  },
  {
    id: "props-and-tools",
    title: "Props and verification tools",
    image: `${registryAssetBase}/props-and-tools-sheet.png`,
    usage: "Inspectable documents, desk tools, stamps, clues, and result badges.",
    reviewNotes: ["Covers all requested tools: phone, CCTV, ledger, scanner, questions.", "Includes decision stamps and settlement badges.", "Individual prop exports are normalized to 512 x 512 canvases with full-object crops."],
  },
  {
    id: "ui-flow-components",
    title: "UI flow components",
    image: `${registryAssetBase}/ui-flow-components-sheet.png`,
    usage: "Reusable interface states for inspection, calls, scanner, decisions, sanity effects, and settlement.",
    reviewNotes: ["Useful for component anatomy.", "The original strip skipped Night 6 visually; use the corrected progression sheet for the canonical 7-night flow."],
  },
  {
    id: "night-progression",
    title: "7-night progression and encounters",
    image: `${registryAssetBase}/night-progression-encounters-sheet.png`,
    usage: "Canonical story progression board with all seven nights and encounter density.",
    reviewNotes: ["All seven nights are present, including Night 6 Learning Impostors.", "Shows 8-15 encounter-card density per night.", "Includes ending badges and reusable error-detail cards."],
  },
];

export const registryProps: RegistryPropAsset[] = [
  { id: "resident-id-card", label: "Resident ID card", category: "document", usage: "Compare name, room, ID, portrait, and issue date." },
  { id: "visitor-pass", label: "Visitor pass", category: "document", usage: "Required for non-residents and appointment guests." },
  { id: "contractor-badge", label: "Contractor badge", category: "document", usage: "Company, clearance level, and task authorization." },
  { id: "appointment-slip", label: "Appointment slip", category: "document", usage: "Time, company, reason, and target room." },
  { id: "archive-folder", label: "Resident archive folder", category: "document", usage: "Persistent resident facts and habits." },
  { id: "today-appointments", label: "Today appointment list", category: "document", usage: "Night 2 onward schedule matching." },
  { id: "maintenance-notice", label: "Maintenance notice", category: "document", usage: "Daily building-rule modifiers." },
  { id: "banned-entry-list", label: "Banned-entry list", category: "document", usage: "Immediate refusal or security escalation." },
  { id: "floor-rules", label: "Floor rules", category: "document", usage: "Detect impossible floors and curfew restrictions." },
  { id: "phone-receiver-dial", label: "Phone receiver and dial", category: "tool", usage: "Desk phone art for calling rooms and triggering line anomalies." },
  { id: "phone-switchboard", label: "Room-call switchboard", category: "tool", usage: "Confirm identity, already-inside state, or phone anomaly." },
  { id: "cctv-monitor", label: "CCTV monitor", category: "tool", usage: "Check shadow, reflection, hallway, and prop details." },
  { id: "visitor-ledger", label: "Visitor ledger", category: "tool", usage: "Check signatures, prior visits, and erased entries." },
  { id: "id-scanner", label: "ID scanner", category: "tool", usage: "Validate checksum, issue date, and corrupted file warnings." },
  { id: "question-card", label: "Extra question card", category: "tool", usage: "Ask habit-based questions that documents cannot answer." },
  { id: "approve-stamp", label: "Approve stamp", category: "decision", usage: "Allow verified people through." },
  { id: "deny-stamp", label: "Deny stamp", category: "decision", usage: "Reject mismatched or rule-breaking entrants." },
  { id: "security-call", label: "Security-call stamp", category: "decision", usage: "Escalate dangerous or final-night anomalies." },
  { id: "wait-token", label: "Wait token", category: "decision", usage: "Hold uncertain cases while tools resolve." },
  { id: "danger-alarm", label: "Danger alarm button", category: "decision", usage: "High-risk panic action that hurts reputation if abused." },
  { id: "cracked-glass-overlay", label: "Cracked glass overlay", category: "clue", usage: "Glass/anomaly overlay for horror visitor states." },
  { id: "taped-paper-corners", label: "Taped paper corners", category: "clue", usage: "Reusable taped-corner dressing for papers and notices." },
  { id: "paper-clips", label: "Paper clips", category: "clue", usage: "Desk dressing for case files and archive cards." },
  { id: "red-string", label: "Red string", category: "clue", usage: "Investigation-board connection marker." },
  { id: "elevator-key", label: "Elevator key", category: "clue", usage: "Rule and access clue for elevator-related contradictions." },
  { id: "leather-folder", label: "Leather folder", category: "clue", usage: "Zhao Jun habit prop and archive desk object." },
  { id: "violin-case", label: "Violin case", category: "clue", usage: "Owen Xu prop; silver-latch checks expose impostors." },
  { id: "toolbox-open", label: "Open toolbox", category: "clue", usage: "Maintenance prop; missing tools expose fake repair workers." },
  { id: "parcel-box", label: "Parcel box", category: "clue", usage: "Courier and appointment-list verification prop." },
  { id: "flower-bundle", label: "Flower bundle", category: "clue", usage: "Li Mei habit prop and Wednesday-return clue." },
  { id: "wrapped-bun", label: "Wrapped bun", category: "clue", usage: "Sun Hao habit prop and food-smell clue." },
  { id: "blue-scarf", label: "Blue scarf", category: "clue", usage: "Mina Park identity prop; removal outside is suspicious." },
  { id: "black-glove-right", label: "Black right glove", category: "clue", usage: "Zhou Qiming hand-side verification clue." },
  { id: "brass-moon-cane", label: "Brass moon cane", category: "clue", usage: "Wang Yulan identity prop and silhouette marker." },
  { id: "measuring-tape", label: "Measuring tape", category: "clue", usage: "Guo Lan tailor prop and sleeve/collar habit marker." },
  { id: "mirror-shard", label: "Mirror-shard clue", category: "clue", usage: "Signals copied records or reversed features." },
  { id: "corrupted-file", label: "Corrupted file card", category: "clue", usage: "Night 5 archive-pollution evidence." },
  { id: "sanity-meter-strip", label: "Sanity meter strip", category: "reward", usage: "Settlement and pressure-system meter art." },
  { id: "result-badges", label: "Safety/Reputation/Stability badges", category: "reward", usage: "Nightly settlement metrics." },
];

export const registryErrorDetails: RegistryErrorDetail[] = [
  { id: "name-typo", label: "Name typo", real: "Lin Anna", impostorExample: "Lin Anya / Lin An-na", checkWith: "ID card + archive" },
  { id: "room-reversal", label: "Room reversal", real: "4B or 203", impostorExample: "B4 / 230 / 701", checkWith: "Archive + floor rules" },
  { id: "wrong-id-digit", label: "Wrong ID digit", real: "7821-44", impostorExample: "7821-45", checkWith: "ID scanner" },
  { id: "wrong-side-mole", label: "Wrong-side mole", real: "Mole under left eye", impostorExample: "Mole under right eye", checkWith: "Photo + CCTV" },
  { id: "wrong-job", label: "Wrong occupation", real: "Nurse / teacher / tailor", impostorExample: "Claims a different job", checkWith: "Archive + extra question" },
  { id: "late-arrival", label: "Curfew violation", real: "May enter before 21:00", impostorExample: "Arrives at 23:50", checkWith: "Daily rules + register" },
  { id: "wrong-glove", label: "Wrong glove hand", real: "Right-hand glove", impostorExample: "Left-hand glove", checkWith: "CCTV + portrait" },
  { id: "no-seventh-floor", label: "Impossible floor", real: "Building has six floors", impostorExample: "Claims 7F", checkWith: "Floor rules" },
  { id: "wrong-company", label: "Wrong company", real: "Blue Star Repair", impostorExample: "Blue Heart Repair", checkWith: "Appointment + contractor badge" },
  { id: "habit-failure", label: "Habit failure", real: "Resident-specific routine", impostorExample: "Knows documents but misses habit", checkWith: "Extra question + phone" },
  { id: "duplicate-voice", label: "Duplicate voice", real: "One voice source", impostorExample: "Phone and door speak together", checkWith: "Phone system" },
  { id: "shadow-error", label: "Shadow direction", real: "Shadow follows desk lamp", impostorExample: "Shadow points at the light", checkWith: "CCTV + door view" },
  { id: "unrecorded-memory", label: "Unrecorded memory", real: "Private greeting, habit, or relationship never written in the file", impostorExample: "Perfect documents but wrong desk phrase", checkWith: "Extra question + trusted resident call" },
  { id: "duplicate-record", label: "Duplicate official record", real: "Only one active record may exist for a person", impostorExample: "Second Y. Xue asks to be registered as replacement", checkWith: "Tonight rules + ledger + CCTV" },
];

export const registryNightPlans: RegistryNightPlan[] = [
  {
    id: 1,
    title: "Records Look Normal",
    storyTheme: "The rules appear ordinary until the first refusal makes the ledger ink move.",
    keyEvent: "The player catches a basic duplicate and assumes the threat is just a monster wearing a resident's face.",
    mechanic: "Teach name, room, photo, ID, and obvious mismatches while framing each stamp as a reality-recording action.",
    visitorTarget: "8 visitors",
    rules: ["Only listed residents may enter after 20:00.", "Missing ID is refused.", "Photo notes override excuses.", "Do not register a person whose paper identity and lived habits disagree."],
    encounters: [
      { id: "n1-01", visitor: "Lin Anna", claim: "Resident 203", correctDecision: "allow", evidence: ["Name, room, ID, and mole match."] },
      { id: "n1-02", visitor: "Lin Anya", claim: "Resident 203", correctDecision: "reject", evidence: ["Name typo.", "Mole on wrong side."] },
      { id: "n1-03", visitor: "Zhou Qiming", claim: "Resident 506", correctDecision: "allow", evidence: ["Right glove.", "Short answers."] },
      { id: "n1-04", visitor: "Zhou Qiming", claim: "Forgot key", correctDecision: "reject", evidence: ["Wrong glove hand.", "Never claims forgotten key."] },
      { id: "n1-05", visitor: "Mina Park", claim: "Resident 208", correctDecision: "allow", evidence: ["Scarf and star signature match."] },
      { id: "n1-06", visitor: "Mina Park", claim: "Room 280", correctDecision: "reject", evidence: ["Room typo.", "Scarf removed."] },
      { id: "n1-07", visitor: "Guo Lan", claim: "Resident 402", correctDecision: "allow", evidence: ["Measuring tape and old building name match."] },
      { id: "n1-08", visitor: "Owen Xu", claim: "Resident 502", correctDecision: "reject", evidence: ["ID digit wrong.", "Case latch color wrong."] },
    ],
  },
  {
    id: 2,
    title: "External Systems Lie",
    storyTheme: "Outside paperwork begins to contradict the building's memory.",
    keyEvent: "Blue Star Repair appears on tonight's work list even though old records say the company closed twelve years ago.",
    mechanic: "Non-residents need correct appointment, time, company, and room, but old work orders may be bait for impossible entries.",
    visitorTarget: "10 visitors",
    rules: ["Food delivery stays outside after 22:00.", "Sixth-floor maintenance is suspended.", "Forgotten-key claims require phone confirmation.", "Any Blue Star Repair claim after 21:00 needs a second source."],
    encounters: [
      { id: "n2-01", visitor: "Han Dong", claim: "Blue Star repair at 20:30", correctDecision: "allow", evidence: ["Appointment matches.", "Task is 4F electrical box."] },
      { id: "n2-02", visitor: "Han Dong", claim: "Blue Heart repair at 23:30", correctDecision: "reject", evidence: ["Company wrong.", "Time wrong.", "Claims 7F."] },
      { id: "n2-03", visitor: "Li Mei", claim: "Resident 302", correctDecision: "allow", evidence: ["Bracelet and flowers match."] },
      { id: "n2-04", visitor: "Li Mei", claim: "Needs elevator", correctDecision: "reject", evidence: ["Never uses elevator.", "Bracelet wrong wrist."] },
      { id: "n2-05", visitor: "Rina Sol", claim: "Hot food for 506", correctDecision: "reject", evidence: ["Wrong parcel.", "After 22:00 food rule."] },
      { id: "n2-06", visitor: "Zhao Jun", claim: "Forgot key", correctDecision: "allow", evidence: ["Phone confirms.", "Mail-ledger habit matches."] },
      { id: "n2-07", visitor: "Wang Yulan", claim: "Resident 601", correctDecision: "allow", evidence: ["Resident, not maintenance.", "Cane matches."] },
      { id: "n2-08", visitor: "Ke Ren", claim: "6F vents", correctDecision: "reject", evidence: ["No appointment.", "6F maintenance suspended."] },
      { id: "n2-09", visitor: "Owen Xu", claim: "Resident 502", correctDecision: "allow", evidence: ["Silver latch.", "Hums before speaking."] },
      { id: "n2-10", visitor: "Unknown courier", claim: "Parcel for 701", correctDecision: "reject", evidence: ["No seventh floor.", "No appointment."] },
    ],
  },
  {
    id: 3,
    title: "Two Places At Once",
    storyTheme: "A copied person can stand at the glass while the original answers from upstairs.",
    keyEvent: "A room line says the real resident is already inside, and a later call warns that the player is not the first clerk.",
    mechanic: "Phone can confirm, fail, reveal already-inside cases, or trigger anomalies.",
    visitorTarget: "9 visitors",
    rules: ["Call rooms for arrivals after 22:30.", "If the room says the resident is already inside, refuse the door.", "Duplicate voice is security-level danger.", "A person cannot be safely registered in two places at once."],
    encounters: [
      { id: "n3-01", visitor: "Chen Rui", claim: "Home early", correctDecision: "reject", evidence: ["Hospital phone says he is in surgery.", "Scar wrong side."] },
      { id: "n3-02", visitor: "Sun Hao", claim: "Resident 315", correctDecision: "allow", evidence: ["Three knocks.", "Right-thumb burn."] },
      { id: "n3-03", visitor: "Mina Park", claim: "Resident 208", correctDecision: "reject", evidence: ["Phone says she is upstairs.", "Learned star habit."] },
      { id: "n3-04", visitor: "Lin Anna", claim: "Delayed train", correctDecision: "allow", evidence: ["Phone confirms delay.", "No red clothing."] },
      { id: "n3-05", visitor: "Wang Yulan", claim: "Room 701", correctDecision: "reject", evidence: ["No seventh floor.", "English greeting."] },
      { id: "n3-06", visitor: "Guo Lan", claim: "Tailor 402", correctDecision: "reject", evidence: ["Loose sleeves.", "Phone contradicts."] },
      { id: "n3-07", visitor: "Noah Xu", claim: "Owen's brother", correctDecision: "reject", evidence: ["No appointment.", "Owen has no brother in city."] },
      { id: "n3-08", visitor: "Rina Sol", claim: "Medicine parcel", correctDecision: "wait", evidence: ["Phone no answer.", "Ledger says courier can leave parcel outside."] },
      { id: "n3-09", visitor: "Y. Xue", claim: "Shift change", correctDecision: "reject", evidence: ["No shift change.", "Badge 000 appears corrupted."] },
    ],
  },
  {
    id: 4,
    title: "Resident Habits",
    storyTheme: "Memory becomes more reliable than paperwork.",
    keyEvent: "Perfect documents fail because the visitor does not know a greeting, private routine, or unrecorded relationship.",
    mechanic: "Documents can be right while routine and personality are wrong.",
    visitorTarget: "11 visitors",
    rules: ["Ask one habit question for any perfect document match.", "Behavior contradictions outrank clean scans.", "Pets cannot enter unless listed in the archive.", "Unrecorded memories are the hardest detail for a copied record to fake."],
    encounters: [
      { id: "n4-01", visitor: "Li Mei", claim: "Stairs only", correctDecision: "allow", evidence: ["Refuses elevator.", "Correct bracelet."] },
      { id: "n4-02", visitor: "Zhao Jun", claim: "Lost folder", correctDecision: "reject", evidence: ["Never arrives without folder.", "Does not ask for ledger."] },
      { id: "n4-03", visitor: "Chen Rui", claim: "Night off", correctDecision: "reject", evidence: ["Schedule says night duty.", "Wrong date."] },
      { id: "n4-04", visitor: "Sun Hao", claim: "Cook 315", correctDecision: "allow", evidence: ["Wrapped bun.", "Garlic-oil smell."] },
      { id: "n4-05", visitor: "Wang Yulan", claim: "601", correctDecision: "allow", evidence: ["Mandarin response.", "Moon cane."] },
      { id: "n4-06", visitor: "Owen Xu", claim: "Needs help carrying case", correctDecision: "reject", evidence: ["Owen never hands case over."] },
      { id: "n4-07", visitor: "Guo Lan", claim: "Emergency fitting", correctDecision: "allow", evidence: ["Fixes torn cuff.", "Uses old building name."] },
      { id: "n4-08", visitor: "Lin Anna", claim: "Wearing red for show", correctDecision: "reject", evidence: ["Never wears red."] },
      { id: "n4-09", visitor: "Visitor with dog", claim: "Zhao's guest", correctDecision: "reject", evidence: ["Zhao never brings animals.", "No appointment."] },
      { id: "n4-10", visitor: "False Tenant", claim: "Any room you choose", correctDecision: "security", evidence: ["Does not know own room.", "Repeats answer."] },
      { id: "n4-11", visitor: "Mina Park", claim: "Studio return", correctDecision: "allow", evidence: ["Paint hands.", "Star signature."] },
    ],
  },
  {
    id: 5,
    title: "Corrupted Archive",
    storyTheme: "The archive starts rewriting reality while the player is reading it.",
    keyEvent: "A resident file changes in front of the player: a feature flips side, then a status changes to never lived here.",
    mechanic: "Some records are polluted, so cross-check multiple sources.",
    visitorTarget: "12 visitors",
    rules: ["A corrupted file is not proof by itself.", "Use phone and CCTV when archive ink moves.", "Scanner timestamps can expose reprinted badges.", "The management office may now disagree with reliable human witnesses."],
    encounters: [
      { id: "n5-01", visitor: "Archive Lin Anna", claim: "Photo changed", correctDecision: "wait", evidence: ["Call room before deciding.", "Archive portrait flickers."] },
      { id: "n5-02", visitor: "Chen Rui", claim: "Resident 410", correctDecision: "allow", evidence: ["Hospital line confirms break.", "Scar matches live CCTV."] },
      { id: "n5-03", visitor: "Mirror Visitor", claim: "Resident 203", correctDecision: "reject", evidence: ["Archive and live photo both mirrored.", "Phone contradicts."] },
      { id: "n5-04", visitor: "Wang Yulan", claim: "601", correctDecision: "allow", evidence: ["Cane and language match despite corrupted ID date."] },
      { id: "n5-05", visitor: "Han Dong", claim: "Emergency repair", correctDecision: "reject", evidence: ["No notice.", "Badge print time 00:00."] },
      { id: "n5-06", visitor: "Rina Sol", claim: "Medicine parcel", correctDecision: "allow", evidence: ["Appointment restored in ledger.", "Parcel seal matches."] },
      { id: "n5-07", visitor: "Guo Lan", claim: "402", correctDecision: "reject", evidence: ["Archive says yes, phone says she is inside.", "Sleeves wrong."] },
      { id: "n5-08", visitor: "Sun Hao", claim: "315", correctDecision: "allow", evidence: ["Three knocks.", "Burn mark visible."] },
      { id: "n5-09", visitor: "Zhao Jun", claim: "104", correctDecision: "wait", evidence: ["Scanner damaged.", "Phone delayed."] },
      { id: "n5-10", visitor: "Banned name: The Smiler", claim: "New tenant", correctDecision: "security", evidence: ["Banned list match.", "Smile too wide."] },
      { id: "n5-11", visitor: "Owen Xu", claim: "Case pickup", correctDecision: "allow", evidence: ["Case never leaves hand.", "Room confirms."] },
      { id: "n5-12", visitor: "Unknown", claim: "Room 000", correctDecision: "reject", evidence: ["No room 000 in archive."] },
    ],
  },
  {
    id: 6,
    title: "Learning Impostors",
    storyTheme: "The impostors begin learning the player's verification habits.",
    keyEvent: "CCTV shows Y. Xue leaving the desk during a minute the player remembers sitting still.",
    mechanic: "Impostors remember your common questions and copy habits.",
    visitorTarget: "13 visitors",
    rules: ["Do not rely on a single habit answer.", "Ask varied questions.", "Repeated perfect answers are suspicious after midnight.", "CCTV evidence about the player must be checked against the entry ledger."],
    encounters: [
      { id: "n6-01", visitor: "Mina Park", claim: "Star signature", correctDecision: "reject", evidence: ["Answers learned habit.", "Hands continue painting in reflection."] },
      { id: "n6-02", visitor: "Li Mei", claim: "Flowers and stairs", correctDecision: "allow", evidence: ["Phone, camera, and bracelet all align."] },
      { id: "n6-03", visitor: "Zhou Qiming", claim: "Brief answer", correctDecision: "reject", evidence: ["Perfect scripted answers.", "Left glove."] },
      { id: "n6-04", visitor: "False Tenant", claim: "Resident 315", correctDecision: "security", evidence: ["Knows bun habit but thumb burn missing."] },
      { id: "n6-05", visitor: "Han Dong", claim: "Blue Star Repair", correctDecision: "wait", evidence: ["Appointment real but room call unclear."] },
      { id: "n6-06", visitor: "Rina Sol", claim: "Courier", correctDecision: "reject", evidence: ["Pass expired.", "Parcel addressed to nonexistent room."] },
      { id: "n6-07", visitor: "Chen Rui", claim: "Doctor", correctDecision: "allow", evidence: ["Hospital badge and date match."] },
      { id: "n6-08", visitor: "Wang Yulan", claim: "601", correctDecision: "reject", evidence: ["Says seventh floor in Mandarin.", "Braid wrong shoulder."] },
      { id: "n6-09", visitor: "Guo Lan", claim: "Tailor", correctDecision: "allow", evidence: ["Corrects your cuff before prompted."] },
      { id: "n6-10", visitor: "Owen Xu", claim: "502", correctDecision: "reject", evidence: ["Hums after speaking.", "Brass latch."] },
      { id: "n6-11", visitor: "Archive Clerk", claim: "New file delivery", correctDecision: "security", evidence: ["File has your photo.", "No appointment."] },
      { id: "n6-12", visitor: "Sun Hao", claim: "Cook", correctDecision: "allow", evidence: ["Right burn and three knocks."] },
      { id: "n6-13", visitor: "Lin Anna", claim: "Dance teacher", correctDecision: "allow", evidence: ["Varied habit answers remain consistent."] },
    ],
  },
  {
    id: 7,
    title: "Replacement Clerk",
    storyTheme: "The player's own identity is challenged by a fully documented duplicate.",
    keyEvent: "A second Y. Xue arrives with correct papers, a valid-looking badge, and the line: your shift is over.",
    mechanic: "The final visitor is nearly correct; only accumulated evidence proves that registering them would replace the current clerk.",
    visitorTarget: "8 visitors plus final choice",
    rules: ["Room 000 is not valid.", "Tonight has no relief shift.", "The real clerk is already logged as on duty.", "Do not register a second self."],
    encounters: [
      { id: "n7-01", visitor: "Lin Anna", claim: "203", correctDecision: "allow", evidence: ["True resident, confirms first-night memory."] },
      { id: "n7-02", visitor: "Zhou Qiming", claim: "506", correctDecision: "allow", evidence: ["Right glove and phone match."] },
      { id: "n7-03", visitor: "Seventh-floor Impostor", claim: "Maintenance 7F", correctDecision: "security", evidence: ["Impossible floor.", "Danger list match."] },
      { id: "n7-04", visitor: "Mirror Visitor", claim: "203", correctDecision: "reject", evidence: ["Wrong-side details return."] },
      { id: "n7-05", visitor: "Wang Yulan", claim: "601", correctDecision: "allow", evidence: ["Old key and language match."] },
      { id: "n7-06", visitor: "False Tenant", claim: "New resident", correctDecision: "reject", evidence: ["No matching archive before Night 1."] },
      { id: "n7-07", visitor: "Rina Sol", claim: "Final medicine parcel", correctDecision: "wait", evidence: ["Legitimate but settlement-sensitive."] },
      { id: "n7-08", visitor: "Clerk Duplicate", claim: "Shift change room 000", correctDecision: "security", evidence: ["All papers look correct.", "No shift change in rules.", "No shadow on CCTV.", "Y. Xue already on duty.", "Badge-back warning."] },
    ],
  },
];

export const registryUiComponents = [
  "night-start notice",
  "visitor-at-door panel",
  "resident archive card",
  "appointment list",
  "maintenance notice",
  "banned-entry list",
  "floor rules card",
  "evidence comparison row",
  "tool tray",
  "phone result states",
  "CCTV monitor states",
  "ID scanner states",
  "extra-question dialog",
  "allow/reject/security/wait controls",
  "shift ledger row",
  "nightly settlement modal",
  "sanity distortion overlay",
  "final-night choice panel",
];

export const registryEndings = [
  { id: "good", label: "Good ending", trigger: "Block the duplicate, preserve enough true residents, and leave at dawn with your name crossed off the hiring notice." },
  { id: "normal", label: "Survival ending", trigger: "Survive until morning after too many residents have been replaced; everyone greets you slightly wrong." },
  { id: "bad", label: "Bad ending", trigger: "Allow the replacement clerk; the next morning the real Y. Xue is outside the glass asking to be let back in." },
  { id: "hidden", label: "Hidden ending", trigger: "Collect enough evidence to erase the duplicate record, destroying the registry's route in while removing yourself from the building record." },
];
