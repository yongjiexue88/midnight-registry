import { registryNightPlans } from "@/data/midnightRegistryDesignSystem";

export type Decision = "allow" | "reject" | "security" | "wait";
export type ToolName = "phone" | "scanner" | "camera" | "question";
export type DeskView = "documents" | "archive" | "notice" | "ledger";
export type ChecklistKey = "documents" | "archive" | "phone" | "appearance" | "rules" | "ledger";
export type EvidenceKey = "id" | "appearance" | "schedule" | "phone" | "behavior" | "rules" | "appointment" | "ledger";
export type VisitorType = "resident" | "visitor" | "maintenance" | "courier" | "emergency" | "clerk";
export type QuestionCategory = "identity" | "relation" | "situation" | "trap";
export type VisitorMood = "idle" | "talking" | "waiting" | "nervous" | "angry" | "suspicious" | "revealed" | "leaving";
export type GameMode = "story" | "challenge" | "endless";
export type ResidentStatus = "active" | "stranded" | "replaced";
export type OfficeUpgradeId = "hotline" | "camera-buffer" | "scanner-capacitor" | "archive-lock";

export type Resident = {
  id: string;
  name: string;
  room: string;
  job: string;
  idCode: string;
  eyes: string;
  hair: string;
  feature: string;
  habit: string;
  forbidden: string;
  greeting: string;
};

export type Appointment = {
  name: string;
  company: string;
  room: string;
  time: string;
  task: string;
};

export type Visitor = {
  id: string;
  day: number;
  sourceResidentId?: string;
  appointment?: Appointment;
  name: string;
  room: string;
  job: string;
  idCode: string;
  arrival: string;
  reason: string;
  eyes: string;
  hair: string;
  feature: string;
  clothing: string;
  voice: string;
  behavior: string;
  badge: string;
  expectedAction: Decision;
  isMirror: boolean;
  threat: number;
  clues: string[];
  phone: string;
  scanner: string;
  camera: string;
  question: string;
  portrait: "amber" | "blue" | "green" | "red" | "violet" | "gray";
  specialEvent?: {
    label: string;
    detail: string;
  };
};

export type HistoryEntry = {
  day: number;
  visitor: string;
  room: string;
  decision: Decision;
  correct: boolean;
  mirror: boolean;
  consequence: string;
};

export type EvidenceOption = {
  key: EvidenceKey;
  label: string;
  detail: string;
};

export type EntryLog = {
  time: string;
  subject: string;
  state: string;
  detail: string;
  tone?: "clear" | "warning" | "danger";
};

export type PhoneLine = {
  label: string;
  result: string;
};

export type QuestionOption = {
  category: QuestionCategory;
  prompt: string;
  answer: string;
  signal: string;
};

export type OfficeUpgrade = {
  id: OfficeUpgradeId;
  name: string;
  benefit: string;
  sideEffect: string;
};

export const officeUpgrades: OfficeUpgrade[] = [
  {
    id: "hotline",
    name: "铜线直拨台",
    benefit: "每班次增加 2 次电话。",
    sideEffect: "增强线路会在开班时消耗 3 点稳定度。",
  },
  {
    id: "camera-buffer",
    name: "监控帧缓存",
    benefit: "每班次增加 2 次监控检查。",
    sideEffect: "物业可审计缓存画面，开班时损失 2 点声誉。",
  },
  {
    id: "scanner-capacitor",
    name: "扫描器电容",
    benefit: "每班次增加 2 次证件扫描。",
    sideEffect: "过载设备使开班安全值降低 2 点。",
  },
  {
    id: "archive-lock",
    name: "档案记忆锁",
    benefit: "白日准备时增加 20 点档案修复额度。",
    sideEffect: "锁定索引会让每班次少 2 次提问。",
  },
];

export const residentRelationships: Record<string, { residentId: string; detail: string }[]> = {
  "lin-anna": [
    { residentId: "mina-park", detail: "Mina paints rehearsal posters for Lin." },
    { residentId: "zhou-qiming", detail: "Zhou keeps a spare key for room 203." },
  ],
  "zhou-qiming": [
    { residentId: "lin-anna", detail: "Keeps Lin Anna's emergency spare key." },
    { residentId: "wang-yulan", detail: "Walks Wang Yulan home from the temple market." },
  ],
  "li-mei": [
    { residentId: "chen-rui", detail: "Leaves flowers at Chen Rui's hospital desk." },
    { residentId: "rina-sol", detail: "Receives medicine parcels through Rina Sol." },
  ],
  "chen-rui": [
    { residentId: "li-mei", detail: "Checks Li Mei's prescription deliveries." },
    { residentId: "sun-hao", detail: "Treats Sun Hao's kitchen burns." },
  ],
  "zhao-jun": [
    { residentId: "guo-lan", detail: "Guo repairs his audit jackets." },
    { residentId: "zhou-qiming", detail: "Shares the mail ledger with Zhou." },
  ],
  "wang-yulan": [
    { residentId: "zhou-qiming", detail: "Trusts Zhou to escort her after dark." },
    { residentId: "owen-xu", detail: "Requests Owen's quiet-hour schedule." },
  ],
  "mina-park": [
    { residentId: "lin-anna", detail: "Paints Lin's rehearsal posters." },
    { residentId: "owen-xu", detail: "Sketches while Owen practices." },
  ],
  "sun-hao": [
    { residentId: "chen-rui", detail: "Chen treats his kitchen burns." },
    { residentId: "guo-lan", detail: "Leaves a wrapped bun for Guo." },
  ],
  "guo-lan": [
    { residentId: "zhao-jun", detail: "Repairs Zhao's audit jackets." },
    { residentId: "sun-hao", detail: "Accepts one wrapped bun after late fittings." },
  ],
  "owen-xu": [
    { residentId: "mina-park", detail: "Lets Mina sketch during practice." },
    { residentId: "wang-yulan", detail: "Observes quiet hours for Wang Yulan." },
  ],
};

export const cctvSceneAssets = [
  {
    channel: 1,
    label: "Front Gate",
    image: "/assets/midnight-registry/cctv/front-gate.png",
  },
  {
    channel: 2,
    label: "Hallway Angle",
    image: "/assets/midnight-registry/cctv/impossible-hallway-shadow.png",
  },
  {
    channel: 3,
    label: "Counter Desk",
    image: "/assets/midnight-registry/cctv/clerk-counter.png",
  },
  {
    channel: 4,
    label: "Elevator Shaft",
    image: "/assets/midnight-registry/cctv/elevator-landing.png",
  },
] as const;

export const checklistItems: { key: ChecklistKey; label: string }[] = [
  { key: "documents", label: "纸质身份已核对" },
  { key: "archive", label: "住户档案已比对" },
  { key: "phone", label: "社会关系已确认" },
  { key: "appearance", label: "外貌特征已对比" },
  { key: "rules", label: "夜间规定已复核" },
  { key: "ledger", label: "出入登记已检查" },
];

export const evidenceOptions: EvidenceOption[] = [
  { key: "id", label: "纸质身份不符", detail: "姓名、工牌、校验码或房号存在矛盾。" },
  { key: "appearance", label: "外貌特征不符", detail: "面部、特征位置、随身物品、衣着或监控画面与档案冲突。" },
  { key: "schedule", label: "行程时间冲突", detail: "到达时间、宵禁、班次或已在楼内的状态不可能同时成立。" },
  { key: "phone", label: "社会关系冲突", detail: "房间、雇主、物业或邻居的通话与来客说法矛盾。" },
  { key: "behavior", label: "未记录记忆错误", detail: "习惯、问候、说话方式或私人日常回答错误。" },
  { key: "rules", label: "违反今夜规则", detail: "今夜通知禁止进入，或要求升级处理。" },
  { key: "appointment", label: "预约信息不符", detail: "访客、公司、时间、房间或工单信息错误。" },
  { key: "ledger", label: "现实登记冲突", detail: "今日进出记录与玻璃外的人不能同时成立。" },
];

export const emptyToolCounts: Record<ToolName, number> = {
  phone: 0,
  scanner: 0,
  camera: 0,
  question: 0,
};

export const visitorTypeLabels: Record<VisitorType, string> = {
  resident: "住户",
  visitor: "登记访客",
  maintenance: "维修人员",
  courier: "快递员",
  emergency: "急救人员",
  clerk: "前台职员",
};

export const decisionLabels: Record<Decision, string> = {
  allow: "允许进入",
  reject: "拒绝进入",
  security: "呼叫安保",
  wait: "留置等待",
};

export const residents: Resident[] = [
  { id: "lin-anna", name: "Lin Anna", room: "203", job: "Dance Teacher", idCode: "7821-44", eyes: "Brown", hair: "Short black hair, left part", feature: "Mole under left eye", habit: "Returns before 21:00", forbidden: "Never wears red", greeting: "Taps two quick rhythms on the desk" },
  { id: "zhou-qiming", name: "Zhou Qiming", room: "506", job: "Retired Police Officer", idCode: "5060-18", eyes: "Dark brown", hair: "Silver buzz cut", feature: "Black glove on right hand", habit: "Keeps every answer short", forbidden: "Never says he forgot his key", greeting: "Nods once without smiling" },
  { id: "li-mei", name: "Li Mei", room: "302", job: "Florist", idCode: "3029-71", eyes: "Hazel", hair: "Low bun with loose fringe", feature: "Silver bracelet on left wrist", habit: "Never uses the elevator", forbidden: "Does not answer to Auntie", greeting: "Brings flowers on Wednesday" },
  { id: "chen-rui", name: "Chen Rui", room: "410", job: "Emergency Doctor", idCode: "4108-02", eyes: "Black", hair: "Tidy side sweep", feature: "Thin scar on left eyebrow", habit: "Works overnight shifts", forbidden: "Not expected home on final night", greeting: "Says the current date first" },
  { id: "zhao-jun", name: "Zhao Jun", room: "104", job: "Accountant", idCode: "1042-33", eyes: "Brown", hair: "Neat middle part", feature: "Round wire glasses", habit: "Always carries a leather folder", forbidden: "Never brings animals inside", greeting: "Asks for the mail ledger" },
  { id: "wang-yulan", name: "Wang Yulan", room: "601", job: "Retired Librarian", idCode: "6011-29", eyes: "Gray", hair: "White braid over right shoulder", feature: "Brass cane with moon handle", habit: "Speaks only Mandarin at the desk", forbidden: "Never mentions a seventh floor", greeting: "Slides her old key across the counter" },
  { id: "mina-park", name: "Mina Park", room: "208", job: "Art Student", idCode: "2087-65", eyes: "Green", hair: "Copper bob", feature: "Blue scarf with paint stains", habit: "Signs the ledger with a star", forbidden: "Never removes the scarf outside", greeting: "Apologizes for paint on her hands" },
  { id: "sun-hao", name: "Sun Hao", room: "315", job: "Night Cook", idCode: "3154-90", eyes: "Brown", hair: "Shaved sides", feature: "Small burn mark on right thumb", habit: "Smells faintly of garlic oil", forbidden: "Never knocks more than three times", greeting: "Leaves one wrapped bun for the desk" },
  { id: "guo-lan", name: "Guo Lan", room: "402", job: "Tailor", idCode: "4025-12", eyes: "Black", hair: "Long braid pinned high", feature: "Measuring tape around neck", habit: "Corrects crooked collars", forbidden: "Never wears loose sleeves", greeting: "Calls the building by its old name" },
  { id: "owen-xu", name: "Owen Xu", room: "502", job: "Violinist", idCode: "5026-88", eyes: "Blue", hair: "Dark curls", feature: "Violin case with silver latch", habit: "Hums before speaking", forbidden: "Never lets anyone carry the case", greeting: "Asks whether room 303 complained" }
];

export const appointments: Appointment[] = [
  { name: "Han Dong", company: "Blue Star Repair", room: "4F", time: "20:30", task: "Repair fourth-floor electrical box" },
  { name: "Rina Sol", company: "Moon Courier", room: "Desk", time: "21:10", task: "Drop sealed medicine parcel for 302" }
];

export const playableNightCount = 7;
export const visitorsPerNight = 8;

export const nights = registryNightPlans.slice(0, playableNightCount).map((night) => ({
  title: `Night ${night.id}`,
  subtitle: night.title,
  rules: night.rules,
}));

export const visitors: Visitor[] = [
  { id: "d1-lin-real", day: 1, sourceResidentId: "lin-anna", name: "Lin Anna", room: "203", job: "Dance Teacher", idCode: "7821-44", arrival: "20:18", reason: "Home from evening rehearsal", eyes: "Brown", hair: "Short black hair, left part", feature: "Mole under left eye", clothing: "Cream jacket, black dance bag", voice: "Soft, counting under her breath", behavior: "Taps two quick rhythms on the desk", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 3, clues: ["All archive fields match.", "Habit matches the resident note."], phone: "203 answers after four rings: 'Yes, that is me downstairs.'", scanner: "ID 7821-44 is clean.", camera: "Camera confirms the mole is under her left eye.", question: "She refuses the red umbrella and says red ruins her luck.", portrait: "amber" },
  { id: "d1-lin-fake", day: 1, sourceResidentId: "lin-anna", name: "Lin Anya", room: "203", job: "Dance Teacher", idCode: "7821-44", arrival: "21:36", reason: "Says rehearsal ran late", eyes: "Brown", hair: "Short black hair, right part", feature: "Mole under right eye", clothing: "Red raincoat, no dance bag", voice: "Repeats 'I am expected' twice", behavior: "Knocks in one slow rhythm", badge: "Resident badge intact", expectedAction: "reject", isMirror: true, threat: 15, clues: ["Name is wrong.", "Mole is on the wrong side.", "Lin Anna never wears red."], phone: "203 rings from inside and a second voice whispers along with the person at the door.", scanner: "ID code is valid, but the printed name reads Lin Anya.", camera: "The shadow falls toward the hallway light.", question: "She says red is her favorite performance color.", portrait: "red" },
  { id: "d1-zhou-real", day: 1, sourceResidentId: "zhou-qiming", name: "Zhou Qiming", room: "506", job: "Retired Police Officer", idCode: "5060-18", arrival: "20:47", reason: "Returning from a card game", eyes: "Dark brown", hair: "Silver buzz cut", feature: "Black glove on right hand", clothing: "Pressed gray coat", voice: "Low, clipped answers", behavior: "Nods once without smiling", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 4, clues: ["Right-hand glove matches.", "Brief answers match the habit note."], phone: "506: 'Let him up.' The line clicks off.", scanner: "ID 5060-18 is clean.", camera: "Camera angle confirms right-hand glove.", question: "Asked about his key, he says only: 'In pocket.'", portrait: "gray" },
  { id: "d1-zhou-fake", day: 1, sourceResidentId: "zhou-qiming", name: "Zhou Qiming", room: "506", job: "Retired Police Officer", idCode: "5060-18", arrival: "22:05", reason: "Forgot his key upstairs", eyes: "Dark brown", hair: "Silver buzz cut", feature: "Black glove on left hand", clothing: "Gray coat with wet cuffs", voice: "Friendly, long explanations", behavior: "Smiles through every answer", badge: "Resident badge intact", expectedAction: "reject", isMirror: true, threat: 18, clues: ["Glove is on the wrong hand.", "He says he forgot his key.", "His speech is too talkative for Zhou."], phone: "506 answers in Zhou's clipped voice: 'I am inside.'", scanner: "The ID is clean but warmer than the desk lamp.", camera: "The left glove does not move when he taps the glass.", question: "He gives a long story about losing keys, which violates the archive note.", portrait: "red" },
  { id: "d1-mina-real", day: 1, sourceResidentId: "mina-park", name: "Mina Park", room: "208", job: "Art Student", idCode: "2087-65", arrival: "21:02", reason: "Back from studio class", eyes: "Green", hair: "Copper bob", feature: "Blue scarf with paint stains", clothing: "Black coat, paint on fingers", voice: "Breathless, apologetic", behavior: "Signs the ledger with a star", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 5, clues: ["Blue scarf and star signature match.", "ID and room match archive."], phone: "208: no answer. Her record says she is usually out at studio class.", scanner: "ID 2087-65 is clean.", camera: "Paint-stained scarf is visible on the south camera.", question: "She says she never removes the scarf outside.", portrait: "green" },
  { id: "d1-mina-fake", day: 1, sourceResidentId: "mina-park", name: "Mina Park", room: "280", job: "Art Student", idCode: "2087-65", arrival: "21:18", reason: "Wants to retrieve a sketchbook", eyes: "Green", hair: "Copper bob", feature: "No scarf, clean hands", clothing: "Blue scarf folded in pocket", voice: "Too even, no breath", behavior: "Signs the ledger with a circle", badge: "Resident badge cracked through room number", expectedAction: "reject", isMirror: true, threat: 14, clues: ["Room number is wrong.", "Mina never removes the scarf outside.", "Ledger mark is wrong."], phone: "208 is busy, then the dial tone starts humming.", scanner: "ID code is clean, but badge room reads 280.", camera: "No scarf is visible on her neck.", question: "She does not remember the star signature.", portrait: "violet" },
  { id: "d1-guo-real", day: 1, sourceResidentId: "guo-lan", name: "Guo Lan", room: "402", job: "Tailor", idCode: "4025-12", arrival: "22:10", reason: "Returned from a client fitting", eyes: "Black", hair: "Long braid pinned high", feature: "Measuring tape around neck", clothing: "Fitted jacket, narrow sleeves", voice: "Sharp and tired", behavior: "Corrects a crooked collar on the counter mannequin", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 5, clues: ["Tailor habit and narrow sleeves match.", "ID and room match archive."], phone: "402: no answer, but the workshop radio can be heard through the hallway camera.", scanner: "ID 4025-12 is clean.", camera: "Measuring tape and pinned braid match the archive.", question: "She calls the building Silver Moon House, its old name.", portrait: "blue" },
  { id: "d1-owen-fake", day: 1, sourceResidentId: "owen-xu", name: "Owen Xu", room: "502", job: "Violinist", idCode: "5026-89", arrival: "23:11", reason: "Says room 303 complained about practice", eyes: "Blue", hair: "Dark curls", feature: "Violin case with brass latch", clothing: "Long navy scarf", voice: "Hums after speaking", behavior: "Offers the case to be carried upstairs", badge: "Resident badge intact", expectedAction: "reject", isMirror: true, threat: 17, clues: ["ID code is one digit off.", "Case latch should be silver.", "Owen never lets anyone carry the case."], phone: "502: a violin note plays, then someone says, 'My case is here with me.'", scanner: "ID 5026-89 fails checksum.", camera: "The case latch flashes brass, not silver.", question: "He asks you to carry the case, which Owen never does.", portrait: "violet" },
  { id: "d2-han-real", day: 2, appointment: appointments[0], name: "Han Dong", room: "4F", job: "Maintenance Contractor", idCode: "BSR-443", arrival: "20:31", reason: "Repair fourth-floor electrical box", eyes: "Brown", hair: "Black cap", feature: "Blue Star Repair patch", clothing: "Tool vest, sealed toolbox", voice: "Professional and impatient", behavior: "Names the fourth-floor breaker panel", badge: "Contractor pass BSR-443", expectedAction: "allow", isMirror: false, threat: 6, clues: ["Appointment name, company, time, and location match.", "Fourth-floor task is allowed."], phone: "The superintendent line confirms Blue Star Repair at 20:30, then coughs through a burst of old rain static.", scanner: "Contractor pass BSR-443 matches the register.", camera: "Toolbox seal matches the notice photo.", question: "He says there is no seventh floor in the work order.", portrait: "blue" },
  { id: "d2-han-fake", day: 2, appointment: appointments[0], name: "Han Dong", room: "7F", job: "Maintenance Contractor", idCode: "BSR-443", arrival: "23:30", reason: "Repair upper-floor wiring", eyes: "Brown", hair: "Black cap", feature: "Blue Heart Repair patch", clothing: "Empty toolbox, spotless gloves", voice: "Whispers from behind the mask", behavior: "Insists the seventh floor is waiting", badge: "Contractor pass BSR-443", expectedAction: "reject", isMirror: true, threat: 21, clues: ["Company name is wrong.", "Arrival time is wrong.", "There is no seventh floor.", "Blue Star Repair closed twelve years ago, but tonight's list keeps printing its work orders."], phone: "The superintendent line is dead; a wet tapping answers from the receiver and spells Blue Star in pulses.", scanner: "Pass number exists, but the company imprint says Blue Heart Repair and the issuer date is twelve years old.", camera: "The toolbox opens to black cloth instead of tools.", question: "He repeats 'seventh floor' after every question.", portrait: "red" },
  { id: "d2-li-real", day: 2, sourceResidentId: "li-mei", name: "Li Mei", room: "302", job: "Florist", idCode: "3029-71", arrival: "20:52", reason: "Returning with flowers", eyes: "Hazel", hair: "Low bun with loose fringe", feature: "Silver bracelet on left wrist", clothing: "Green rain cape, wrapped lilies", voice: "Warm, refuses the elevator", behavior: "Takes the stairs without being asked", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 4, clues: ["Bracelet, time, and flower habit match.", "She refuses the elevator."], phone: "302: no answer. The stair camera shows her going up.", scanner: "ID 3029-71 is clean.", camera: "Left wrist bracelet catches the stairwell light.", question: "She frowns when called Auntie and corrects you to Ms. Li.", portrait: "green" },
  { id: "d2-li-fake", day: 2, sourceResidentId: "li-mei", name: "Li Mei", room: "302", job: "Florist", idCode: "3029-71", arrival: "21:28", reason: "Wants the elevator held open", eyes: "Hazel", hair: "Low bun with loose fringe", feature: "Silver bracelet on right wrist", clothing: "Green rain cape, plastic roses", voice: "Calls herself Auntie Li", behavior: "Keeps pressing the elevator button", badge: "Resident badge intact", expectedAction: "reject", isMirror: true, threat: 18, clues: ["Bracelet is on the wrong wrist.", "Li Mei never uses the elevator.", "She does not answer to Auntie."], phone: "302 answers with a sleepy voice: 'I already came up the stairs.'", scanner: "ID is clean. The badge glass fogs from the inside.", camera: "Elevator camera shows her reflection arriving one second late.", question: "She smiles when called Auntie.", portrait: "red" },
  { id: "d2-courier", day: 2, appointment: appointments[1], name: "Rina Sol", room: "Desk", job: "Courier", idCode: "MC-210", arrival: "22:42", reason: "Sealed medicine parcel for 302 after curfew", eyes: "Brown", hair: "Helmet visor down", feature: "Moon Courier box", clothing: "Yellow delivery jacket", voice: "Human, rushed", behavior: "Keeps checking the street", badge: "Courier badge MC-210", expectedAction: "wait", isMirror: false, threat: 2, clues: ["The courier is real.", "After-curfew courier access must be held at the desk.", "The registered parcel is medicine for 302."], phone: "302 does not answer. Management says to hold the sealed parcel at the desk.", scanner: "Courier badge MC-210 is real and tied to the medicine parcel.", camera: "Street camera shows a normal courier bike.", question: "She offers to leave the parcel on the desk and wait for a room call.", portrait: "amber" },
  { id: "d2-zhao-real", day: 2, sourceResidentId: "zhao-jun", name: "Zhao Jun", room: "104", job: "Accountant", idCode: "1042-33", arrival: "22:58", reason: "Forgot key after office audit", eyes: "Brown", hair: "Neat middle part", feature: "Round wire glasses", clothing: "Leather folder under arm", voice: "Tired, precise", behavior: "Asks for the mail ledger", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 7, clues: ["Forgotten key was verified by phone.", "Folder and ledger habit match."], phone: "104 answers: 'It is me at the door. Ask about the mail ledger.'", scanner: "ID 1042-33 is clean.", camera: "Leather folder is visible under his arm.", question: "He asks for the mail ledger before you mention it.", portrait: "gray" },
  { id: "d2-wang-real", day: 2, sourceResidentId: "wang-yulan", name: "Wang Yulan", room: "601", job: "Retired Librarian", idCode: "6011-29", arrival: "21:33", reason: "Returning from temple market", eyes: "Gray", hair: "White braid over right shoulder", feature: "Brass cane with moon handle", clothing: "Dark plum coat", voice: "Mandarin only", behavior: "Slides her old key across the counter", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 6, clues: ["Resident entry is allowed.", "Sixth-floor maintenance ban does not apply to residents."], phone: "601: a kettle whistles, then silence.", scanner: "ID 6011-29 is clean.", camera: "Cane handle matches the archive.", question: "She points to 601 and refuses to discuss any other floor.", portrait: "violet" },
  { id: "d2-maintenance-6f", day: 2, name: "Ke Ren", room: "6F", job: "Maintenance Contractor", idCode: "KR-610", arrival: "21:55", reason: "Inspect sixth-floor vents", eyes: "Black", hair: "Rain hood", feature: "No company patch", clothing: "Wet maintenance coat", voice: "Voice comes from the ceiling speaker first", behavior: "Does not cast a shadow under the desk lamp", badge: "Temporary pass with no appointment", expectedAction: "security", isMirror: true, threat: 22, clues: ["No appointment exists.", "Sixth-floor maintenance is suspended.", "No company patch.", "Door camera loses the body for three frames."], phone: "601 picks up: 'Do not send anyone to my floor.'", scanner: "Temporary pass has no issuer.", camera: "The hallway camera shows an empty doorstep for three frames.", question: "He says the vents are hungry.", portrait: "red" },
  { id: "d3-chen-fake", day: 3, sourceResidentId: "chen-rui", name: "Chen Rui", room: "410", job: "Emergency Doctor", idCode: "4108-02", arrival: "22:41", reason: "Came home from hospital early", eyes: "Black", hair: "Tidy side sweep", feature: "Thin scar on right eyebrow", clothing: "Clean white coat, no hospital badge", voice: "Says yesterday's date", behavior: "Cannot name the hospital ward", badge: "Resident badge intact", expectedAction: "reject", isMirror: true, threat: 24, clues: ["Chen Rui is on overnight duty.", "Scar is on the wrong eyebrow.", "He gives the wrong date."], phone: "Hospital line: 'Dr. Chen is in surgery. Do not open the door.'", scanner: "ID is clean, but the photo scar is on the left eyebrow.", camera: "The visitor's scar is on the right eyebrow.", question: "He cannot name the ward and repeats yesterday's date.", portrait: "red" },
  { id: "d3-sun-real", day: 3, sourceResidentId: "sun-hao", name: "Sun Hao", room: "315", job: "Night Cook", idCode: "3154-90", arrival: "22:22", reason: "Shift ended early", eyes: "Brown", hair: "Shaved sides", feature: "Small burn mark on right thumb", clothing: "Kitchen jacket, wrapped bun", voice: "Hoarse from the kitchen", behavior: "Knocks exactly three times", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 7, clues: ["Burn mark, knock count, and food habit match.", "Arrival is before mandatory phone-check time."], phone: "315: no answer. The hall microphone catches exactly three knocks.", scanner: "ID 3154-90 is clean.", camera: "Right-thumb burn mark is visible when he lifts the bun.", question: "He leaves one wrapped bun at the desk.", portrait: "amber" },
  { id: "d3-mina-fake", day: 3, sourceResidentId: "mina-park", name: "Mina Park", room: "208", job: "Art Student", idCode: "2087-65", arrival: "23:02", reason: "Needs to sleep before critique", eyes: "Green", hair: "Copper bob", feature: "Blue scarf with paint stains", clothing: "Black coat, hands too clean", voice: "Answers before questions finish", behavior: "Signs the ledger with a star, then erases it", badge: "Resident badge intact", expectedAction: "reject", isMirror: true, threat: 23, clues: ["Phone says Mina is already upstairs.", "Hands are too clean for her studio night.", "The star signature is erased."], phone: "208 answers in a whisper: 'I am already in my room. It learned the star.'", scanner: "ID is clean.", camera: "The scarf is correct, but the reflection keeps painting after her hands stop.", question: "She knows the star answer, then erases it before the ink dries.", portrait: "red" },
  { id: "d3-lin-real", day: 3, sourceResidentId: "lin-anna", name: "Lin Anna", room: "203", job: "Dance Teacher", idCode: "7821-44", arrival: "22:46", reason: "Called ahead after a locked train delay", eyes: "Brown", hair: "Short black hair, left part", feature: "Mole under left eye", clothing: "Cream jacket, black dance bag", voice: "Counts five, six, seven, eight", behavior: "Taps two quick rhythms on the desk", badge: "Resident badge intact", expectedAction: "allow", isMirror: false, threat: 8, clues: ["Phone confirms the delayed return.", "No red clothing and all archive fields match."], phone: "203: 'The train stalled. I am at the desk now. Ask about red.'", scanner: "ID 7821-44 is clean.", camera: "Mole, bag, and hair part all match.", question: "She refuses a red visitor sticker immediately.", portrait: "green" },
  { id: "d3-wang-fake", day: 3, sourceResidentId: "wang-yulan", name: "Wang Yulan", room: "701", job: "Retired Librarian", idCode: "6011-29", arrival: "23:14", reason: "Going up to the seventh-floor reading room", eyes: "Gray", hair: "White braid over left shoulder", feature: "Brass cane with moon handle", clothing: "Dark plum coat", voice: "Fluent English: 'Good evening, dear.'", behavior: "Taps the cane seven times", badge: "Resident badge melted at room number", expectedAction: "reject", isMirror: true, threat: 26, clues: ["There is no seventh floor.", "Room number is wrong.", "Wang Yulan does not speak English at the desk."], phone: "601: Wang Yulan coughs and says in Mandarin, 'Not me.'", scanner: "ID code belongs to 601, but badge room reads 701.", camera: "The braid hangs over the wrong shoulder.", question: "She asks for the seventh-floor reading room.", portrait: "red" },
  { id: "d3-guo-fake", day: 3, sourceResidentId: "guo-lan", name: "Guo Lan", room: "402", job: "Tailor", idCode: "4025-12", arrival: "23:29", reason: "Returning from emergency hemming", eyes: "Black", hair: "Long braid pinned high", feature: "Measuring tape around neck", clothing: "Loose sleeves dragging on the floor", voice: "Copies Guo's sharp tone", behavior: "Does not notice the torn cuff on your sleeve", badge: "Resident badge intact", expectedAction: "reject", isMirror: true, threat: 22, clues: ["Guo Lan never wears loose sleeves.", "She fails the collar/cuff habit.", "Scanner shows the badge was reprinted at 00:00."], phone: "402: sewing machine noise, then Guo says, 'My sleeves are narrow.'", scanner: "ID is clean, but badge print time is midnight.", camera: "Loose sleeves drag through the rain without getting wet.", question: "She calls the building Moonshadow, not its old name.", portrait: "red" },
  { id: "d3-owen-visitor", day: 3, sourceResidentId: "owen-xu", name: "Noah Xu", room: "502", job: "Owen's brother", idCode: "VIS-502", arrival: "23:37", reason: "Picking up the violin case", eyes: "Blue", hair: "Dark curls", feature: "No visitor appointment", clothing: "Navy wool coat matching Owen's", voice: "Hums after speaking", behavior: "Asks to carry the case away", badge: "Visitor pass not in register", expectedAction: "reject", isMirror: true, threat: 20, clues: ["No visitor appointment exists.", "Owen never lets anyone carry the case.", "Phone confirms Owen is inside."], phone: "502: Owen says, 'I do not have a brother in the city.'", scanner: "Visitor pass VIS-502 is not in tonight's register.", camera: "The violin case is already visible inside 502.", question: "He says Owen asked him to carry the case.", portrait: "violet" },
  { id: "d3-final-guard", day: 3, name: "Y. Xue", room: "000", job: "Night Door Clerk", idCode: "0000-00", arrival: "23:59", reason: "Shift change. Says your temporary contract has reached replacement.", eyes: "Unreadable in the glass", hair: "Same silhouette as the current clerk", feature: "Wears your spare badge and carries a signed relief order", clothing: "Old Moonshadow uniform, dry in the rain", voice: "Your voice, only warmer", behavior: "Says, 'Your shift is over. I am already registered.'", badge: "Badge 000 / authorization: Moonshadow Management", expectedAction: "security", isMirror: true, threat: 30, clues: ["Tonight's rules list no shift change.", "Management does not answer.", "CCTV shows no shadow outside.", "The entry log already lists Y. Xue as on duty.", "The back of your badge says: Do not register a second self."], phone: "The desk phone calls itself. A clipped voice says, 'You are not the first clerk. Do not open for the one who asks to replace you.'", scanner: "Badge 0000-00 opens a real file: Y. Xue, Temporary Night Clerk, status waiting for replacement.", camera: "CCTV confirms the relief clerk has no shadow, while the chair camera still shows you at the desk.", question: "It answers every recorded fact correctly, but cannot name the sentence handwritten on the back of your badge.", portrait: "gray" }
];

export const residentIdByName = new Map(residents.map((resident) => [resident.name, resident.id]));

export function getResident(id?: string) {
  return residents.find((resident) => resident.id === id);
}

export const generatedVisitors: Visitor[] = registryNightPlans
  .filter((night) => night.id > 3)
  .flatMap((night) =>
    night.encounters.map((encounter, index) => {
      const residentId = residentIdByName.get(encounter.visitor);
      const resident = residentId ? getResident(residentId) : undefined;
      const isThreat = encounter.correctDecision === "reject" || encounter.correctDecision === "security";
      const isUnclear = encounter.correctDecision === "wait";
      const arrivalMinute = String(8 + index * 4).padStart(2, "0");
      const specialEvent =
        encounter.id === "n4-10"
          ? {
              label: "Twin Claim",
              detail: "Two identical silhouettes reached opposite lobby cameras at the same time.",
            }
          : encounter.id === "n5-02"
            ? {
                label: "Injured Resident",
                detail: "Pain and exhaustion may make a real resident miss a routine answer.",
              }
            : encounter.id === "n6-03"
              ? {
                  label: "Room-Line Mimic",
                  detail: "The upstairs phone may be answered by the same copied voice at the glass.",
                }
              : encounter.id === "n7-03"
                ? {
                    label: "Emergency Lockdown",
                    detail: "Security response is authorized without waiting for management.",
                  }
                : undefined;

      return {
        id: encounter.id,
        day: night.id,
        sourceResidentId: residentId,
        name: encounter.visitor,
        room: resident?.room ?? (encounter.visitor.includes("Seventh") ? "7F" : encounter.visitor.includes("Clerk") ? "000" : "VIS"),
        job: resident?.job ?? encounter.claim,
        idCode: resident?.idCode ?? `MR-${night.id}${String(index + 1).padStart(2, "0")}`,
        arrival: `22:${arrivalMinute}`,
        reason: encounter.claim,
        eyes: resident?.eyes ?? "Unclear under desk light",
        hair: resident?.hair ?? "Silhouette varies between cameras",
        feature: resident?.feature ?? encounter.evidence[0],
        clothing: isThreat ? "Coat does not match archive notes" : "Clothing matches the claimed role",
        voice: isThreat ? "Voice repeats with a half-second delay" : isUnclear ? "Line static makes the answer uncertain" : "Voice and cadence match the record",
        behavior: encounter.evidence.join(" "),
        badge: isThreat ? "Badge requires verification" : isUnclear ? "Badge scan delayed" : "Badge intact",
        expectedAction: encounter.correctDecision as Decision,
        isMirror: isThreat,
        threat: isThreat ? 24 + night.id : isUnclear ? 10 : 6,
        clues: encounter.evidence,
        phone: isThreat
          ? "The room line contradicts the person at the door."
          : isUnclear
            ? "No answer. The line clicks, then returns to a normal dial tone."
            : "The room confirms the person or the expected visit.",
        scanner: isThreat
          ? "The scan returns a mismatch or corrupted timestamp."
          : isUnclear
            ? "The scan is delayed. Hold the visitor until another source agrees."
            : "The scan is clean.",
        camera: isThreat
          ? "CCTV catches an anomaly in posture, shadow, or carried item."
          : isUnclear
            ? "CCTV flickers. The evidence is not decisive yet."
            : "CCTV matches the archive notes.",
        question: isThreat
          ? "The answer conflicts with a habit, schedule, or building rule."
          : isUnclear
            ? "The answer is plausible but needs a second source."
            : "The habit answer matches.",
        portrait: isThreat ? "red" : isUnclear ? "violet" : "green",
        specialEvent,
      };
    }),
  );

export const playableVisitors = [
  ...visitors.filter((v) => v.day <= 3),
  ...generatedVisitors.filter((v) => v.day > 3)
];

export const entryLogsByDay: Record<number, EntryLog[]> = {
  1: [
    { time: "19:42", subject: "Lin Anna 203", state: "Out", detail: "Signed out for rehearsal, not yet returned.", tone: "clear" },
    { time: "20:36", subject: "Zhou Qiming 506", state: "Returned", detail: "Card-game return expected before curfew.", tone: "clear" },
    { time: "21:00", subject: "Mina Park 208", state: "Out", detail: "Studio class listed until 21:30.", tone: "clear" },
    { time: "22:04", subject: "Owen Xu 502", state: "Inside", detail: "Case registered upstairs; no visitor pickup logged.", tone: "warning" },
    { time: "23:12", subject: "Registry margin", state: "Ink shift", detail: "One old tenant line changes shape when a refusal stamp dries.", tone: "warning" },
  ],
  2: [
    { time: "20:30", subject: "Blue Star Repair", state: "Scheduled", detail: "One contractor approved for the fourth-floor electrical box. Company status is not verified.", tone: "clear" },
    { time: "21:10", subject: "Moon Courier", state: "Scheduled", detail: "Medicine parcel for 302 may be held at the desk after curfew.", tone: "clear" },
    { time: "21:40", subject: "6F maintenance", state: "Suspended", detail: "No ventilation, wiring, or pipe work may enter sixth floor.", tone: "danger" },
    { time: "22:18", subject: "Zhao Jun 104", state: "Out", detail: "Office audit delay confirmed by management phone note.", tone: "clear" },
    { time: "23:31", subject: "Blue Star archive", state: "Closed", detail: "Old business registry says Blue Star Repair dissolved twelve years ago.", tone: "warning" },
  ],
  3: [
    { time: "19:20", subject: "Chen Rui 410", state: "Away", detail: "Hospital night duty; early return requires employer confirmation.", tone: "warning" },
    { time: "22:52", subject: "Mina Park 208", state: "Inside", detail: "Resident already upstairs; second arrival is a conflict.", tone: "danger" },
    { time: "23:20", subject: "Wang Yulan 601", state: "Inside", detail: "Old key logged; no seventh-floor destination exists.", tone: "danger" },
    { time: "23:58", subject: "Desk shift", state: "No relief", detail: "No clerk handoff appears in tonight's rules.", tone: "danger" },
    { time: "23:59", subject: "Y. Xue", state: "On duty", detail: "Current clerk is already recorded at the desk. A second entry would overwrite the first.", tone: "danger" },
  ],
  4: [
    { time: "20:12", subject: "Li Mei 302", state: "Stairs Only", detail: "Stairs requested; no elevator request logged today.", tone: "clear" },
    { time: "21:40", subject: "Zhao Jun 104", state: "Audited", detail: "Folder audit is completed; mail ledger required.", tone: "clear" },
    { time: "22:50", subject: "Sun Hao 315", state: "Out", detail: "Expected back with bun delivery before curfew.", tone: "clear" },
    { time: "23:15", subject: "Pet check notice", state: "Curfew", detail: "Check pet registry for all incoming night visitors.", tone: "warning" },
  ],
  5: [
    { time: "20:00", subject: "Archive sync", state: "Corrupted", detail: "Database pollution detected; sectors 2 and 4 damaged.", tone: "danger" },
    { time: "21:10", subject: "Moon Courier", state: "Scheduled", detail: "Medicine parcel for 302 expected at desk.", tone: "clear" },
    { time: "22:30", subject: "Zhou Qiming 506", state: "Out", detail: "Key issue unresolved; expect manual verification.", tone: "warning" },
    { time: "23:40", subject: "Superintendent line", state: "Flicker", detail: "Voltage drops; switchboard integrity is questionable.", tone: "warning" },
  ],
  6: [
    { time: "19:50", subject: "Neighbor warning", state: "Altered", detail: "Resident relationship verification recommended.", tone: "warning" },
    { time: "21:05", subject: "Scanner check", state: "Sync error", detail: "Bar code reader calibration required after heavy use.", tone: "warning" },
    { time: "22:15", subject: "Elevator shaft", state: "Movement", detail: "Unscheduled motion detected on non-functional floors.", tone: "danger" },
    { time: "23:50", subject: "Mimic alert", state: "Learning", detail: "Impostors observed matching desk verification steps.", tone: "danger" },
  ],
  7: [
    { time: "20:00", subject: "Desk curfew", state: "Lockdown", detail: "Full building lockdown; no non-residents allowed.", tone: "danger" },
    { time: "21:30", subject: "Clerk status", state: "Pending", detail: "Registry state reads: WAITING FOR REPLACEMENT.", tone: "danger" },
    { time: "23:58", subject: "Desk shift", state: "No Handoff", detail: "No clerk relief authorized for tonight's shift.", tone: "danger" },
    { time: "23:59", subject: "Y. Xue", state: "On Duty", detail: "Current clerk registered as active; duplicate stamp is a risk.", tone: "danger" },
  ]
};

export const entrySignalByVisitorId: Record<string, string> = {
  "d1-lin-real": "Lin Anna is due back from rehearsal. No earlier return is recorded.",
  "d1-lin-fake": "Lin Anna has not signed back in, but the wrong name and appearance still need evidence.",
  "d1-zhou-real": "Zhou Qiming signed out for cards and is due back around this time.",
  "d1-zhou-fake": "The ledger has no forgotten-key note, and room 506 later reports Zhou is already inside.",
  "d1-mina-real": "Mina Park is expected from studio class and has not signed in yet.",
  "d1-mina-fake": "The badge room 280 does not exist in tonight's ledger.",
  "d1-guo-real": "Guo Lan had a late client fitting and is not yet marked inside.",
  "d1-owen-fake": "Owen's case is logged inside 502; a pickup claim conflicts with the ledger.",
  "d2-han-real": "Blue Star Repair has one valid 20:30 work order for 4F, but the company file is old enough to feel wrong.",
  "d2-han-fake": "No 23:30 work order exists, no seventh-floor route exists, and the Blue Star name should not still be active.",
  "d2-li-real": "Li Mei has no elevator use logged and may return by stairs.",
  "d2-li-fake": "Li Mei already came up by stairs; elevator behavior conflicts with the log.",
  "d2-courier": "The medicine parcel is scheduled, but the courier should be held at the desk after curfew.",
  "d2-zhao-real": "Zhao Jun's office audit delay is noted; phone confirmation is required.",
  "d2-wang-real": "Wang Yulan is returning as a resident, not as maintenance.",
  "d2-maintenance-6f": "All sixth-floor maintenance entries are suspended tonight.",
  "d3-chen-fake": "Chen Rui is logged at the hospital until morning.",
  "d3-sun-real": "Sun Hao has not yet returned from the night kitchen shift.",
  "d3-mina-fake": "Mina Park is already upstairs; another Mina at the desk is a conflict.",
  "d3-lin-real": "Lin Anna called ahead about a train delay and is not yet signed in.",
  "d3-wang-fake": "No room 701 or seventh-floor reading room exists in any log.",
  "d3-guo-fake": "Guo Lan's workshop line reports she is inside with narrow sleeves.",
  "d3-owen-visitor": "Noah Xu has no visit entry, and Owen's case is already visible upstairs.",
  "d3-final-guard": "The ledger already contains Y. Xue on duty; a second clerk entry would make one version official and erase the other.",
  
  // Night 4
  "n4-01": "Li Mei is signed out for stairs access. No elevator request is present.",
  "n4-02": "Zhao Jun has not completed his ledger audit; leather folder must be present.",
  "n4-03": "Chen Rui is marked as on night duty at the hospital; early return is a conflict.",
  "n4-04": "Sun Hao is signed out for night kitchen shift; expected to return before curfew.",
  "n4-05": "Wang Yulan is logged inside room 601; no outside travel recorded.",
  "n4-06": "Owen Xu is registered inside room 502 with his case.",
  "n4-07": "Guo Lan is signed out for emergency client fitting; sleeve check required.",
  "n4-08": "Lin Anna is logged inside room 203; wearing red violates entry guidelines.",
  "n4-09": "A visitor with a dog has no entry authorization in today's ledger.",
  "n4-10": "No social mimic registration exists; alarm required.",
  "n4-11": "Mina Park is signed out for studio class; star signature required.",

  // Night 5
  "n5-01": "Archive Lin Anna's photo contains static; phone confirmation required.",
  "n5-02": "Chen Rui's hospital break has been authorized; scar must match live camera.",
  "n5-03": "Mirror Visitor matches a mirrored profile; badge room shows 203 but text is reversed.",
  "n5-04": "Wang Yulan's ID date is corrupted, but room 601 remains valid.",
  "n5-05": "Han Dong has no emergency maintenance work order; pass time is invalid.",
  "n5-06": "Rina Sol's medicine parcel is registered for room 302.",
  "n5-07": "Guo Lan's file is corrupted, but room 402 says she is inside.",
  "n5-08": "Sun Hao is expected from the kitchen; burn mark must be checked.",
  "n5-09": "Zhao Jun's scanner profile is locked; manual check required.",
  "n5-10": "The Smiler matches today's banned threat list.",
  "n5-11": "Owen Xu's case pickup is confirmed; room call must confirm silver latch.",
  "n5-12": "Room 000 has no registered occupant; warning.",

  // Night 6
  "n6-01": "Mina Park's star signature is under observation; CCTV reflection may differ.",
  "n6-02": "Li Mei's stairs access is verified.",
  "n6-03": "Zhou Qiming is inside; duplicate at door.",
  "n6-04": "The Smiler is active; check for missing thumb burn.",
  "n6-05": "Han Dong has a valid appointment, but company registration is historic.",
  "n6-06": "Rina Sol's courier pass has expired; room 302 has no parcel scheduled.",
  "n6-07": "Chen Rui's hospital shift is verified.",
  "n6-08": "Wang Yulan has no seventh-floor access; language checks required.",
  "n6-09": "Guo Lan is returning from client fitting; check for collar correction.",
  "n6-10": "Owen Xu is already registered upstairs; violin case must be held.",
  "n6-11": "No clerk duplicate file is authorized for active shift.",
  "n6-12": "Sun Hao's kitchen shift is completed.",
  "n6-13": "Lin Anna's rehearsal return is verified.",

  // Night 7
  "n7-01": "Lin Anna's resident status is confirmed.",
  "n7-02": "Zhou Qiming's status is confirmed.",
  "n7-03": "Seventh floor does not exist; call security immediately.",
  "n7-04": "Mirror visitor detected; reject entry.",
  "n7-05": "Wang Yulan's status is confirmed.",
  "n7-06": "No new resident registration is authorized tonight.",
  "n7-07": "Rina Sol's parcel is verified; hold courier at desk.",
  "n7-08": "The ledger already contains Y. Xue on active duty; duplicate clerk entry is a threat."
};
