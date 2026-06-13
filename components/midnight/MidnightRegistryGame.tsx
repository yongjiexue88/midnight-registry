"use client";

import { useMemo, useState } from "react";
import { registryCharacterAssets, registryNightPlans } from "@/data/midnightRegistryDesignSystem";

type Decision = "allow" | "reject" | "security" | "wait";
type ToolName = "phone" | "scanner" | "camera" | "question";
type DeskView = "documents" | "archive" | "notice" | "ledger";
type ChecklistKey = "documents" | "archive" | "phone" | "appearance" | "rules" | "ledger";
type EvidenceKey = "id" | "appearance" | "schedule" | "phone" | "behavior" | "rules" | "appointment" | "ledger";
type VisitorType = "resident" | "visitor" | "maintenance" | "courier" | "emergency" | "clerk";
type QuestionCategory = "identity" | "relation" | "situation" | "trap";
type VisitorMood = "idle" | "watched" | "called" | "cornered" | "alarmed" | "revealed";

type Resident = {
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

type Appointment = {
  name: string;
  company: string;
  room: string;
  time: string;
  task: string;
};

type Visitor = {
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
};

type HistoryEntry = {
  visitor: string;
  room: string;
  decision: Decision;
  correct: boolean;
  mirror: boolean;
  consequence: string;
};

type EvidenceOption = {
  key: EvidenceKey;
  label: string;
  detail: string;
};

type EntryLog = {
  time: string;
  subject: string;
  state: string;
  detail: string;
  tone?: "clear" | "warning" | "danger";
};

type PhoneLine = {
  label: string;
  result: string;
};

type QuestionOption = {
  category: QuestionCategory;
  prompt: string;
  answer: string;
  signal: string;
};

const checklistItems: { key: ChecklistKey; label: string }[] = [
  { key: "documents", label: "Paper identity checked" },
  { key: "archive", label: "Archive reality matched" },
  { key: "phone", label: "Social identity confirmed" },
  { key: "appearance", label: "Appearance compared" },
  { key: "rules", label: "Night rules reviewed" },
  { key: "ledger", label: "Entry log checked" },
];

const evidenceOptions: EvidenceOption[] = [
  { key: "id", label: "Paper identity mismatch", detail: "Printed identity, badge, checksum, or room number does not line up." },
  { key: "appearance", label: "Appearance mismatch", detail: "Face, feature side, carried item, clothing, or camera view contradicts the archive." },
  { key: "schedule", label: "Schedule conflict", detail: "Arrival, curfew, shift, or already-inside timing is impossible." },
  { key: "phone", label: "Social identity conflict", detail: "Room, employer, management, or neighbor call contradicts the claim." },
  { key: "behavior", label: "Unrecorded memory failure", detail: "Habit answer, greeting, speech pattern, or private routine is wrong." },
  { key: "rules", label: "Rule violation", detail: "Tonight's notice blocks this entrant or requires escalation." },
  { key: "appointment", label: "Appointment mismatch", detail: "Visitor, courier, maintenance, company, time, room, or work order is wrong." },
  { key: "ledger", label: "Reality ledger conflict", detail: "Today's in/out record conflicts with the person at the glass." },
];

const emptyToolCounts: Record<ToolName, number> = {
  phone: 0,
  scanner: 0,
  camera: 0,
  question: 0,
};

const visitorTypeLabels: Record<VisitorType, string> = {
  resident: "Resident",
  visitor: "Registered visitor",
  maintenance: "Maintenance",
  courier: "Courier",
  emergency: "Emergency staff",
  clerk: "Desk staff",
};

const decisionLabels: Record<Decision, string> = {
  allow: "Allow entry",
  reject: "Refuse entry",
  security: "Call security",
  wait: "Hold / wait",
};

const residents: Resident[] = [
  {
    id: "lin-anna",
    name: "Lin Anna",
    room: "203",
    job: "Dance Teacher",
    idCode: "7821-44",
    eyes: "Brown",
    hair: "Short black hair, left part",
    feature: "Mole under left eye",
    habit: "Returns before 21:00",
    forbidden: "Never wears red",
    greeting: "Taps two quick rhythms on the desk",
  },
  {
    id: "zhou-qiming",
    name: "Zhou Qiming",
    room: "506",
    job: "Retired Police Officer",
    idCode: "5060-18",
    eyes: "Dark brown",
    hair: "Silver buzz cut",
    feature: "Black glove on right hand",
    habit: "Keeps every answer short",
    forbidden: "Never says he forgot his key",
    greeting: "Nods once without smiling",
  },
  {
    id: "li-mei",
    name: "Li Mei",
    room: "302",
    job: "Florist",
    idCode: "3029-71",
    eyes: "Hazel",
    hair: "Low bun with loose fringe",
    feature: "Silver bracelet on left wrist",
    habit: "Never uses the elevator",
    forbidden: "Does not answer to Auntie",
    greeting: "Brings flowers on Wednesday",
  },
  {
    id: "chen-rui",
    name: "Chen Rui",
    room: "410",
    job: "Emergency Doctor",
    idCode: "4108-02",
    eyes: "Black",
    hair: "Tidy side sweep",
    feature: "Thin scar on left eyebrow",
    habit: "Works overnight shifts",
    forbidden: "Not expected home on final night",
    greeting: "Says the current date first",
  },
  {
    id: "zhao-jun",
    name: "Zhao Jun",
    room: "104",
    job: "Accountant",
    idCode: "1042-33",
    eyes: "Brown",
    hair: "Neat middle part",
    feature: "Round wire glasses",
    habit: "Always carries a leather folder",
    forbidden: "Never brings animals inside",
    greeting: "Asks for the mail ledger",
  },
  {
    id: "wang-yulan",
    name: "Wang Yulan",
    room: "601",
    job: "Retired Librarian",
    idCode: "6011-29",
    eyes: "Gray",
    hair: "White braid over right shoulder",
    feature: "Brass cane with moon handle",
    habit: "Speaks only Mandarin at the desk",
    forbidden: "Never mentions a seventh floor",
    greeting: "Slides her old key across the counter",
  },
  {
    id: "mina-park",
    name: "Mina Park",
    room: "208",
    job: "Art Student",
    idCode: "2087-65",
    eyes: "Green",
    hair: "Copper bob",
    feature: "Blue scarf with paint stains",
    habit: "Signs the ledger with a star",
    forbidden: "Never removes the scarf outside",
    greeting: "Apologizes for paint on her hands",
  },
  {
    id: "sun-hao",
    name: "Sun Hao",
    room: "315",
    job: "Night Cook",
    idCode: "3154-90",
    eyes: "Brown",
    hair: "Shaved sides",
    feature: "Small burn mark on right thumb",
    habit: "Smells faintly of garlic oil",
    forbidden: "Never knocks more than three times",
    greeting: "Leaves one wrapped bun for the desk",
  },
  {
    id: "guo-lan",
    name: "Guo Lan",
    room: "402",
    job: "Tailor",
    idCode: "4025-12",
    eyes: "Black",
    hair: "Long braid pinned high",
    feature: "Measuring tape around neck",
    habit: "Corrects crooked collars",
    forbidden: "Never wears loose sleeves",
    greeting: "Calls the building by its old name",
  },
  {
    id: "owen-xu",
    name: "Owen Xu",
    room: "502",
    job: "Violinist",
    idCode: "5026-88",
    eyes: "Blue",
    hair: "Dark curls",
    feature: "Violin case with silver latch",
    habit: "Hums before speaking",
    forbidden: "Never lets anyone carry the case",
    greeting: "Asks whether room 303 complained",
  },
];

const appointments: Appointment[] = [
  { name: "Han Dong", company: "Blue Star Repair", room: "4F", time: "20:30", task: "Repair fourth-floor electrical box" },
  { name: "Rina Sol", company: "Moon Courier", room: "Desk", time: "21:10", task: "Drop sealed medicine parcel for 302" },
];

const playableNightCount = 3;
const visitorsPerNight = 8;

const nights = registryNightPlans.slice(0, playableNightCount).map((night) => ({
  title: `Night ${night.id}`,
  subtitle: night.title,
  rules: night.rules,
}));

const visitors: Visitor[] = [
  {
    id: "d1-lin-real",
    day: 1,
    sourceResidentId: "lin-anna",
    name: "Lin Anna",
    room: "203",
    job: "Dance Teacher",
    idCode: "7821-44",
    arrival: "20:18",
    reason: "Home from evening rehearsal",
    eyes: "Brown",
    hair: "Short black hair, left part",
    feature: "Mole under left eye",
    clothing: "Cream jacket, black dance bag",
    voice: "Soft, counting under her breath",
    behavior: "Taps two quick rhythms on the desk",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 3,
    clues: ["All archive fields match.", "Habit matches the resident note."],
    phone: "203 answers after four rings: 'Yes, that is me downstairs.'",
    scanner: "ID 7821-44 is clean.",
    camera: "Camera confirms the mole is under her left eye.",
    question: "She refuses the red umbrella and says red ruins her luck.",
    portrait: "amber",
  },
  {
    id: "d1-lin-fake",
    day: 1,
    sourceResidentId: "lin-anna",
    name: "Lin Anya",
    room: "203",
    job: "Dance Teacher",
    idCode: "7821-44",
    arrival: "21:36",
    reason: "Says rehearsal ran late",
    eyes: "Brown",
    hair: "Short black hair, right part",
    feature: "Mole under right eye",
    clothing: "Red raincoat, no dance bag",
    voice: "Repeats 'I am expected' twice",
    behavior: "Knocks in one slow rhythm",
    badge: "Resident badge intact",
    expectedAction: "reject",
    isMirror: true,
    threat: 15,
    clues: ["Name is wrong.", "Mole is on the wrong side.", "Lin Anna never wears red."],
    phone: "203 rings from inside and a second voice whispers along with the person at the door.",
    scanner: "ID code is valid, but the printed name reads Lin Anya.",
    camera: "The shadow falls toward the hallway light.",
    question: "She says red is her favorite performance color.",
    portrait: "red",
  },
  {
    id: "d1-zhou-real",
    day: 1,
    sourceResidentId: "zhou-qiming",
    name: "Zhou Qiming",
    room: "506",
    job: "Retired Police Officer",
    idCode: "5060-18",
    arrival: "20:47",
    reason: "Returning from a card game",
    eyes: "Dark brown",
    hair: "Silver buzz cut",
    feature: "Black glove on right hand",
    clothing: "Pressed gray coat",
    voice: "Low, clipped answers",
    behavior: "Nods once without smiling",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 4,
    clues: ["Right-hand glove matches.", "Brief answers match the habit note."],
    phone: "506: 'Let him up.' The line clicks off.",
    scanner: "ID 5060-18 is clean.",
    camera: "Camera angle confirms right-hand glove.",
    question: "Asked about his key, he says only: 'In pocket.'",
    portrait: "gray",
  },
  {
    id: "d1-zhou-fake",
    day: 1,
    sourceResidentId: "zhou-qiming",
    name: "Zhou Qiming",
    room: "506",
    job: "Retired Police Officer",
    idCode: "5060-18",
    arrival: "22:05",
    reason: "Forgot his key upstairs",
    eyes: "Dark brown",
    hair: "Silver buzz cut",
    feature: "Black glove on left hand",
    clothing: "Gray coat with wet cuffs",
    voice: "Friendly, long explanations",
    behavior: "Smiles through every answer",
    badge: "Resident badge intact",
    expectedAction: "reject",
    isMirror: true,
    threat: 18,
    clues: ["Glove is on the wrong hand.", "He says he forgot his key.", "His speech is too talkative for Zhou."],
    phone: "506 answers in Zhou's clipped voice: 'I am inside.'",
    scanner: "The ID is clean but warmer than the desk lamp.",
    camera: "The left glove does not move when he taps the glass.",
    question: "He gives a long story about losing keys, which violates the archive note.",
    portrait: "red",
  },
  {
    id: "d1-mina-real",
    day: 1,
    sourceResidentId: "mina-park",
    name: "Mina Park",
    room: "208",
    job: "Art Student",
    idCode: "2087-65",
    arrival: "21:02",
    reason: "Back from studio class",
    eyes: "Green",
    hair: "Copper bob",
    feature: "Blue scarf with paint stains",
    clothing: "Black coat, paint on fingers",
    voice: "Breathless, apologetic",
    behavior: "Signs the ledger with a star",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 5,
    clues: ["Blue scarf and star signature match.", "ID and room match archive."],
    phone: "208: no answer. Her record says she is usually out at studio class.",
    scanner: "ID 2087-65 is clean.",
    camera: "Paint-stained scarf is visible on the south camera.",
    question: "She says she never removes the scarf outside.",
    portrait: "green",
  },
  {
    id: "d1-mina-fake",
    day: 1,
    sourceResidentId: "mina-park",
    name: "Mina Park",
    room: "280",
    job: "Art Student",
    idCode: "2087-65",
    arrival: "21:18",
    reason: "Wants to retrieve a sketchbook",
    eyes: "Green",
    hair: "Copper bob",
    feature: "No scarf, clean hands",
    clothing: "Blue scarf folded in pocket",
    voice: "Too even, no breath",
    behavior: "Signs the ledger with a circle",
    badge: "Resident badge cracked through room number",
    expectedAction: "reject",
    isMirror: true,
    threat: 14,
    clues: ["Room number is wrong.", "Mina never removes the scarf outside.", "Ledger mark is wrong."],
    phone: "208 is busy, then the dial tone starts humming.",
    scanner: "ID code is clean, but badge room reads 280.",
    camera: "No scarf is visible on her neck.",
    question: "She does not remember the star signature.",
    portrait: "violet",
  },
  {
    id: "d1-guo-real",
    day: 1,
    sourceResidentId: "guo-lan",
    name: "Guo Lan",
    room: "402",
    job: "Tailor",
    idCode: "4025-12",
    arrival: "22:10",
    reason: "Returned from a client fitting",
    eyes: "Black",
    hair: "Long braid pinned high",
    feature: "Measuring tape around neck",
    clothing: "Fitted jacket, narrow sleeves",
    voice: "Sharp and tired",
    behavior: "Corrects a crooked collar on the counter mannequin",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 5,
    clues: ["Tailor habit and narrow sleeves match.", "ID and room match archive."],
    phone: "402: no answer, but the workshop radio can be heard through the hallway camera.",
    scanner: "ID 4025-12 is clean.",
    camera: "Measuring tape and pinned braid match the archive.",
    question: "She calls the building Silver Moon House, its old name.",
    portrait: "blue",
  },
  {
    id: "d1-owen-fake",
    day: 1,
    sourceResidentId: "owen-xu",
    name: "Owen Xu",
    room: "502",
    job: "Violinist",
    idCode: "5026-89",
    arrival: "23:11",
    reason: "Says room 303 complained about practice",
    eyes: "Blue",
    hair: "Dark curls",
    feature: "Violin case with brass latch",
    clothing: "Long navy scarf",
    voice: "Hums after speaking",
    behavior: "Offers the case to be carried upstairs",
    badge: "Resident badge intact",
    expectedAction: "reject",
    isMirror: true,
    threat: 17,
    clues: ["ID code is one digit off.", "Case latch should be silver.", "Owen never lets anyone carry the case."],
    phone: "502: a violin note plays, then someone says, 'My case is here with me.'",
    scanner: "ID 5026-89 fails checksum.",
    camera: "The case latch flashes brass, not silver.",
    question: "He asks you to carry the case, which Owen never does.",
    portrait: "violet",
  },
  {
    id: "d2-han-real",
    day: 2,
    appointment: appointments[0],
    name: "Han Dong",
    room: "4F",
    job: "Maintenance Contractor",
    idCode: "BSR-443",
    arrival: "20:31",
    reason: "Repair fourth-floor electrical box",
    eyes: "Brown",
    hair: "Black cap",
    feature: "Blue Star Repair patch",
    clothing: "Tool vest, sealed toolbox",
    voice: "Professional and impatient",
    behavior: "Names the fourth-floor breaker panel",
    badge: "Contractor pass BSR-443",
    expectedAction: "allow",
    isMirror: false,
    threat: 6,
    clues: ["Appointment name, company, time, and location match.", "Fourth-floor task is allowed."],
    phone: "The superintendent line confirms Blue Star Repair at 20:30, then coughs through a burst of old rain static.",
    scanner: "Contractor pass BSR-443 matches the register.",
    camera: "Toolbox seal matches the notice photo.",
    question: "He says there is no seventh floor in the work order.",
    portrait: "blue",
  },
  {
    id: "d2-han-fake",
    day: 2,
    appointment: appointments[0],
    name: "Han Dong",
    room: "7F",
    job: "Maintenance Contractor",
    idCode: "BSR-443",
    arrival: "23:30",
    reason: "Repair upper-floor wiring",
    eyes: "Brown",
    hair: "Black cap",
    feature: "Blue Heart Repair patch",
    clothing: "Empty toolbox, spotless gloves",
    voice: "Whispers from behind the mask",
    behavior: "Insists the seventh floor is waiting",
    badge: "Contractor pass BSR-443",
    expectedAction: "reject",
    isMirror: true,
    threat: 21,
    clues: ["Company name is wrong.", "Arrival time is wrong.", "There is no seventh floor.", "Blue Star Repair closed twelve years ago, but tonight's list keeps printing its work orders."],
    phone: "The superintendent line is dead; a wet tapping answers from the receiver and spells Blue Star in pulses.",
    scanner: "Pass number exists, but the company imprint says Blue Heart Repair and the issuer date is twelve years old.",
    camera: "The toolbox opens to black cloth instead of tools.",
    question: "He repeats 'seventh floor' after every question.",
    portrait: "red",
  },
  {
    id: "d2-li-real",
    day: 2,
    sourceResidentId: "li-mei",
    name: "Li Mei",
    room: "302",
    job: "Florist",
    idCode: "3029-71",
    arrival: "20:52",
    reason: "Returning with flowers",
    eyes: "Hazel",
    hair: "Low bun with loose fringe",
    feature: "Silver bracelet on left wrist",
    clothing: "Green rain cape, wrapped lilies",
    voice: "Warm, refuses the elevator",
    behavior: "Takes the stairs without being asked",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 4,
    clues: ["Bracelet, time, and flower habit match.", "She refuses the elevator."],
    phone: "302: no answer. The stair camera shows her going up.",
    scanner: "ID 3029-71 is clean.",
    camera: "Left wrist bracelet catches the stairwell light.",
    question: "She frowns when called Auntie and corrects you to Ms. Li.",
    portrait: "green",
  },
  {
    id: "d2-li-fake",
    day: 2,
    sourceResidentId: "li-mei",
    name: "Li Mei",
    room: "302",
    job: "Florist",
    idCode: "3029-71",
    arrival: "21:28",
    reason: "Wants the elevator held open",
    eyes: "Hazel",
    hair: "Low bun with loose fringe",
    feature: "Silver bracelet on right wrist",
    clothing: "Green rain cape, plastic roses",
    voice: "Calls herself Auntie Li",
    behavior: "Keeps pressing the elevator button",
    badge: "Resident badge intact",
    expectedAction: "reject",
    isMirror: true,
    threat: 18,
    clues: ["Bracelet is on the wrong wrist.", "Li Mei never uses the elevator.", "She does not answer to Auntie."],
    phone: "302 answers with a sleepy voice: 'I already came up the stairs.'",
    scanner: "ID is clean. The badge glass fogs from the inside.",
    camera: "Elevator camera shows her reflection arriving one second late.",
    question: "She smiles when called Auntie.",
    portrait: "red",
  },
  {
    id: "d2-courier",
    day: 2,
    appointment: appointments[1],
    name: "Rina Sol",
    room: "Desk",
    job: "Courier",
    idCode: "MC-210",
    arrival: "22:42",
    reason: "Sealed medicine parcel for 302 after curfew",
    eyes: "Brown",
    hair: "Helmet visor down",
    feature: "Moon Courier box",
    clothing: "Yellow delivery jacket",
    voice: "Human, rushed",
    behavior: "Keeps checking the street",
    badge: "Courier badge MC-210",
    expectedAction: "wait",
    isMirror: false,
    threat: 2,
    clues: ["The courier is real.", "After-curfew courier access must be held at the desk.", "The registered parcel is medicine for 302."],
    phone: "302 does not answer. Management says to hold the sealed parcel at the desk.",
    scanner: "Courier badge MC-210 is real and tied to the medicine parcel.",
    camera: "Street camera shows a normal courier bike.",
    question: "She offers to leave the parcel on the desk and wait for a room call.",
    portrait: "amber",
  },
  {
    id: "d2-zhao-real",
    day: 2,
    sourceResidentId: "zhao-jun",
    name: "Zhao Jun",
    room: "104",
    job: "Accountant",
    idCode: "1042-33",
    arrival: "22:58",
    reason: "Forgot key after office audit",
    eyes: "Brown",
    hair: "Neat middle part",
    feature: "Round wire glasses",
    clothing: "Leather folder under arm",
    voice: "Tired, precise",
    behavior: "Asks for the mail ledger",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 7,
    clues: ["Forgotten key was verified by phone.", "Folder and ledger habit match."],
    phone: "104 answers: 'It is me at the door. Ask about the mail ledger.'",
    scanner: "ID 1042-33 is clean.",
    camera: "Leather folder is visible under his arm.",
    question: "He asks for the mail ledger before you mention it.",
    portrait: "gray",
  },
  {
    id: "d2-wang-real",
    day: 2,
    sourceResidentId: "wang-yulan",
    name: "Wang Yulan",
    room: "601",
    job: "Retired Librarian",
    idCode: "6011-29",
    arrival: "21:33",
    reason: "Returning from temple market",
    eyes: "Gray",
    hair: "White braid over right shoulder",
    feature: "Brass cane with moon handle",
    clothing: "Dark plum coat",
    voice: "Mandarin only",
    behavior: "Slides her old key across the counter",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 6,
    clues: ["Resident entry is allowed.", "Sixth-floor maintenance ban does not apply to residents."],
    phone: "601: a kettle whistles, then silence.",
    scanner: "ID 6011-29 is clean.",
    camera: "Cane handle matches the archive.",
    question: "She points to 601 and refuses to discuss any other floor.",
    portrait: "violet",
  },
  {
    id: "d2-maintenance-6f",
    day: 2,
    name: "Ke Ren",
    room: "6F",
    job: "Maintenance Contractor",
    idCode: "KR-610",
    arrival: "21:55",
    reason: "Inspect sixth-floor vents",
    eyes: "Black",
    hair: "Rain hood",
    feature: "No company patch",
    clothing: "Wet maintenance coat",
    voice: "Voice comes from the ceiling speaker first",
    behavior: "Does not cast a shadow under the desk lamp",
    badge: "Temporary pass with no appointment",
    expectedAction: "security",
    isMirror: true,
    threat: 22,
    clues: ["No appointment exists.", "Sixth-floor maintenance is suspended.", "No company patch.", "Door camera loses the body for three frames."],
    phone: "601 picks up: 'Do not send anyone to my floor.'",
    scanner: "Temporary pass has no issuer.",
    camera: "The hallway camera shows an empty doorstep for three frames.",
    question: "He says the vents are hungry.",
    portrait: "red",
  },
  {
    id: "d3-chen-fake",
    day: 3,
    sourceResidentId: "chen-rui",
    name: "Chen Rui",
    room: "410",
    job: "Emergency Doctor",
    idCode: "4108-02",
    arrival: "22:41",
    reason: "Came home from hospital early",
    eyes: "Black",
    hair: "Tidy side sweep",
    feature: "Thin scar on right eyebrow",
    clothing: "Clean white coat, no hospital badge",
    voice: "Says yesterday's date",
    behavior: "Cannot name the hospital ward",
    badge: "Resident badge intact",
    expectedAction: "reject",
    isMirror: true,
    threat: 24,
    clues: ["Chen Rui is on overnight duty.", "Scar is on the wrong eyebrow.", "He gives the wrong date."],
    phone: "Hospital line: 'Dr. Chen is in surgery. Do not open the door.'",
    scanner: "ID is clean, but the photo scar is on the left eyebrow.",
    camera: "The visitor's scar is on the right eyebrow.",
    question: "He cannot name the ward and repeats yesterday's date.",
    portrait: "red",
  },
  {
    id: "d3-sun-real",
    day: 3,
    sourceResidentId: "sun-hao",
    name: "Sun Hao",
    room: "315",
    job: "Night Cook",
    idCode: "3154-90",
    arrival: "22:22",
    reason: "Shift ended early",
    eyes: "Brown",
    hair: "Shaved sides",
    feature: "Small burn mark on right thumb",
    clothing: "Kitchen jacket, wrapped bun",
    voice: "Hoarse from the kitchen",
    behavior: "Knocks exactly three times",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 7,
    clues: ["Burn mark, knock count, and food habit match.", "Arrival is before mandatory phone-check time."],
    phone: "315: no answer. The hall microphone catches exactly three knocks.",
    scanner: "ID 3154-90 is clean.",
    camera: "Right-thumb burn mark is visible when he lifts the bun.",
    question: "He leaves one wrapped bun at the desk.",
    portrait: "amber",
  },
  {
    id: "d3-mina-fake",
    day: 3,
    sourceResidentId: "mina-park",
    name: "Mina Park",
    room: "208",
    job: "Art Student",
    idCode: "2087-65",
    arrival: "23:02",
    reason: "Needs to sleep before critique",
    eyes: "Green",
    hair: "Copper bob",
    feature: "Blue scarf with paint stains",
    clothing: "Black coat, hands too clean",
    voice: "Answers before questions finish",
    behavior: "Signs the ledger with a star, then erases it",
    badge: "Resident badge intact",
    expectedAction: "reject",
    isMirror: true,
    threat: 23,
    clues: ["Phone says Mina is already upstairs.", "Hands are too clean for her studio night.", "The star signature is erased."],
    phone: "208 answers in a whisper: 'I am already in my room. It learned the star.'",
    scanner: "ID is clean.",
    camera: "The scarf is correct, but the reflection keeps painting after her hands stop.",
    question: "She knows the star answer, then erases it before the ink dries.",
    portrait: "red",
  },
  {
    id: "d3-lin-real",
    day: 3,
    sourceResidentId: "lin-anna",
    name: "Lin Anna",
    room: "203",
    job: "Dance Teacher",
    idCode: "7821-44",
    arrival: "22:46",
    reason: "Called ahead after a locked train delay",
    eyes: "Brown",
    hair: "Short black hair, left part",
    feature: "Mole under left eye",
    clothing: "Cream jacket, black dance bag",
    voice: "Counts five, six, seven, eight",
    behavior: "Taps two quick rhythms on the desk",
    badge: "Resident badge intact",
    expectedAction: "allow",
    isMirror: false,
    threat: 8,
    clues: ["Phone confirms the delayed return.", "No red clothing and all archive fields match."],
    phone: "203: 'The train stalled. I am at the desk now. Ask about red.'",
    scanner: "ID 7821-44 is clean.",
    camera: "Mole, bag, and hair part all match.",
    question: "She refuses a red visitor sticker immediately.",
    portrait: "green",
  },
  {
    id: "d3-wang-fake",
    day: 3,
    sourceResidentId: "wang-yulan",
    name: "Wang Yulan",
    room: "701",
    job: "Retired Librarian",
    idCode: "6011-29",
    arrival: "23:14",
    reason: "Going up to the seventh-floor reading room",
    eyes: "Gray",
    hair: "White braid over left shoulder",
    feature: "Brass cane with moon handle",
    clothing: "Dark plum coat",
    voice: "Fluent English: 'Good evening, dear.'",
    behavior: "Taps the cane seven times",
    badge: "Resident badge melted at room number",
    expectedAction: "reject",
    isMirror: true,
    threat: 26,
    clues: ["There is no seventh floor.", "Room number is wrong.", "Wang Yulan does not speak English at the desk."],
    phone: "601: Wang Yulan coughs and says in Mandarin, 'Not me.'",
    scanner: "ID code belongs to 601, but badge room reads 701.",
    camera: "The braid hangs over the wrong shoulder.",
    question: "She asks for the seventh-floor reading room.",
    portrait: "red",
  },
  {
    id: "d3-guo-fake",
    day: 3,
    sourceResidentId: "guo-lan",
    name: "Guo Lan",
    room: "402",
    job: "Tailor",
    idCode: "4025-12",
    arrival: "23:29",
    reason: "Returning from emergency hemming",
    eyes: "Black",
    hair: "Long braid pinned high",
    feature: "Measuring tape around neck",
    clothing: "Loose sleeves dragging on the floor",
    voice: "Copies Guo's sharp tone",
    behavior: "Does not notice the torn cuff on your sleeve",
    badge: "Resident badge intact",
    expectedAction: "reject",
    isMirror: true,
    threat: 22,
    clues: ["Guo Lan never wears loose sleeves.", "She fails the collar/cuff habit.", "Scanner shows the badge was reprinted at 00:00."],
    phone: "402: sewing machine noise, then Guo says, 'My sleeves are narrow.'",
    scanner: "ID is clean, but badge print time is midnight.",
    camera: "Loose sleeves drag through the rain without getting wet.",
    question: "She calls the building Moonshadow, not its old name.",
    portrait: "red",
  },
  {
    id: "d3-owen-visitor",
    day: 3,
    sourceResidentId: "owen-xu",
    name: "Noah Xu",
    room: "502",
    job: "Owen's brother",
    idCode: "VIS-502",
    arrival: "23:37",
    reason: "Picking up the violin case",
    eyes: "Blue",
    hair: "Dark curls",
    feature: "No visitor appointment",
    clothing: "Navy wool coat matching Owen's",
    voice: "Hums after speaking",
    behavior: "Asks to carry the case away",
    badge: "Visitor pass not in register",
    expectedAction: "reject",
    isMirror: true,
    threat: 20,
    clues: ["No visitor appointment exists.", "Owen never lets anyone carry the case.", "Phone confirms Owen is inside."],
    phone: "502: Owen says, 'I do not have a brother in the city.'",
    scanner: "Visitor pass VIS-502 is not in tonight's register.",
    camera: "The violin case is already visible inside 502.",
    question: "He says Owen asked him to carry the case.",
    portrait: "violet",
  },
  {
    id: "d3-final-guard",
    day: 3,
    name: "Y. Xue",
    room: "000",
    job: "Night Door Clerk",
    idCode: "0000-00",
    arrival: "23:59",
    reason: "Shift change. Says your temporary contract has reached replacement.",
    eyes: "Unreadable in the glass",
    hair: "Same silhouette as the current clerk",
    feature: "Wears your spare badge and carries a signed relief order",
    clothing: "Old Moonshadow uniform, dry in the rain",
    voice: "Your voice, only warmer",
    behavior: "Says, 'Your shift is over. I am already registered.'",
    badge: "Badge 000 / authorization: Moonshadow Management",
    expectedAction: "security",
    isMirror: true,
    threat: 30,
    clues: ["Tonight's rules list no shift change.", "Management does not answer.", "CCTV shows no shadow outside.", "The entry log already lists Y. Xue as on duty.", "The back of your badge says: Do not register a second self."],
    phone: "The desk phone calls itself. A clipped voice says, 'You are not the first clerk. Do not open for the one who asks to replace you.'",
    scanner: "Badge 0000-00 opens a real file: Y. Xue, Temporary Night Clerk, status waiting for replacement.",
    camera: "CCTV confirms the relief clerk has no shadow, while the chair camera still shows you at the desk.",
    question: "It answers every recorded fact correctly, but cannot name the sentence handwritten on the back of your badge.",
    portrait: "gray",
  },
];

const residentIdByName = new Map(residents.map((resident) => [resident.name, resident.id]));

const generatedVisitors: Visitor[] = registryNightPlans
  .filter((night) => night.id > 3)
  .flatMap((night) =>
    night.encounters.map((encounter, index) => {
      const residentId = residentIdByName.get(encounter.visitor);
      const resident = residentId ? getResident(residentId) : undefined;
      const isThreat = encounter.correctDecision === "reject" || encounter.correctDecision === "security";
      const isUnclear = encounter.correctDecision === "wait";
      const arrivalMinute = String(8 + index * 4).padStart(2, "0");

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
        expectedAction: encounter.correctDecision,
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
      } satisfies Visitor;
    }),
  );

const playableVisitors = nights.flatMap((_, index) =>
  visitors.filter((visitor) => visitor.day === index + 1).slice(0, visitorsPerNight),
);

const entryLogsByDay: Record<number, EntryLog[]> = {
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
};

const entrySignalByVisitorId: Record<string, string> = {
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
};

function getResident(id?: string) {
  return residents.find((resident) => resident.id === id);
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function addUnique<T>(items: T[], item: T) {
  return items.includes(item) ? items : [...items, item];
}

function getVisitorType(visitor: Visitor): VisitorType {
  if (visitor.room === "000" || visitor.job.includes("Door Clerk")) return "clerk";
  if (visitor.job.includes("Doctor") || visitor.job.includes("Emergency")) return "emergency";
  if (visitor.job.includes("Maintenance") || visitor.job.includes("Contractor")) return "maintenance";
  if (visitor.job.includes("Courier")) return "courier";
  if (visitor.appointment || visitor.idCode.startsWith("VIS-")) return "visitor";
  return "resident";
}

function getEntrySignal(visitor: Visitor) {
  return entrySignalByVisitorId[visitor.id] ?? "No special ledger conflict is recorded for this claim.";
}

function getPhoneLines(visitor: Visitor): PhoneLine[] {
  const visitorType = getVisitorType(visitor);
  const primaryLabel =
    visitorType === "emergency"
      ? "Employer line"
      : visitorType === "courier"
        ? "Courier dispatch"
        : visitor.room === "Desk"
          ? "Desk appointment line"
          : `Room ${visitor.room}`;

  const lines: PhoneLine[] = [{ label: primaryLabel, result: visitor.phone }];

  if (visitorType === "maintenance") {
    lines.push({
      label: "Management office",
      result: visitor.expectedAction === "allow"
        ? "Management confirms one Blue Star contractor for the fourth-floor electrical box, then denies knowing when the company closed."
        : "Management has no matching work order, then repeats your question in a voice that is not the superintendent.",
    });
  } else if (visitorType === "courier") {
    lines.push({
      label: "Management office",
      result: visitor.expectedAction === "wait"
        ? "Management confirms the parcel but orders a desk hold until 302 answers."
        : "Management says this courier has no upstairs clearance tonight.",
    });
  } else if (visitorType === "emergency") {
    lines.push({
      label: "Management office",
      result: visitor.expectedAction === "allow"
        ? "Management confirms the emergency note and asks you to log the badge number."
        : "Management warns that this resident is already accounted for elsewhere.",
    });
  } else if (visitorType === "clerk") {
    lines.push({
      label: "Security booth",
      result: "If Zhou Qiming is still in the building, security relays his warning: if the person at the door looks like you, do not open.",
    });
  } else {
    lines.push({
      label: "Entry ledger",
      result: getEntrySignal(visitor),
    });
  }

  return lines;
}

function getQuestionOptions(visitor: Visitor, resident?: Resident): QuestionOption[] {
  const visitorType = getVisitorType(visitor);
  const relationPrompt = resident
    ? `Name the desk habit for room ${resident.room}.`
    : visitor.appointment
      ? "Who authorized this visit tonight?"
      : "Who should confirm your visit?";

  return [
    {
      category: "identity",
      prompt: "State your full name, room, and badge number.",
      answer: `${visitor.name} claims ${visitor.room} with badge ${visitor.idCode}.`,
      signal: visitor.expectedAction === "allow" || visitor.expectedAction === "wait"
        ? "The claim can still be valid, but documents must match the archive or appointment list."
        : "The claim may be copied from paper; compare it against people, habits, and tonight's ledger.",
    },
    {
      category: "relation",
      prompt: relationPrompt,
      answer: resident
        ? `${visitor.question} Archive note: ${resident.greeting}.`
        : visitor.appointment
          ? `${visitor.question} Appointment target: ${visitor.appointment.room}, ${visitor.appointment.task}.`
          : visitor.question,
      signal: visitor.isMirror ? "The answer exposes a habit, relationship, or unrecorded-memory mismatch." : "The answer gives a usable cross-check.",
    },
    {
      category: "situation",
      prompt: "Why are you here this late?",
      answer: `${visitor.reason}. Arrival recorded at ${visitor.arrival}.`,
      signal: visitor.expectedAction === "wait"
        ? "The timing makes this a hold case, not a clean entry."
        : "Compare timing against tonight's rules and the in/out log.",
    },
    {
      category: "trap",
      prompt:
        visitorType === "resident"
          ? "Answer the resident-specific trap question."
          : visitorType === "maintenance"
            ? "Repeat the exact work order and floor."
            : visitorType === "courier"
              ? "Who is allowed to touch the parcel after curfew?"
              : "Name the registry rule that lets you in.",
      answer: visitor.question,
      signal: visitor.isMirror
        ? "The pause is too long, then the answer arrives too smoothly for something never written down."
        : "The answer stays consistent with at least one source.",
    },
  ];
}

function getConsequences(visitor: Visitor, decision: Decision, correct: boolean, markedEvidenceCount: number) {
  if (correct) {
    if (decision === "allow") {
      return ["The door light turns green and the ledger accepts one existing life without rewriting it.", "Safety holds because paper, social proof, and lived detail support entry."];
    }

    if (decision === "wait") {
      return ["The visitor remains outside while the record keeps searching for a second source.", "Hold buys time for callbacks, CCTV updates, and file movement without making anyone official yet."];
    }

    if (decision === "security") {
      return ["The shutter drops and security seals the lobby before the record can claim a body.", "The anomaly is logged as hostile instead of being written into residence."];
    }

    return ["The window darkens and the visitor leaves the glass before the ledger can legalize the claim.", "The refusal is backed by contradictions across the evidence chain."];
  }

  if (decision === "allow" && visitor.isMirror) {
    return ["A false entrant reaches the stairs and gains an official line in the registry.", "Tomorrow's archive will erase one clean detail from the original resident."];
  }

  if (decision === "security" && !visitor.isMirror) {
    return ["Security trust falls after a bad alarm.", "Future calls will take longer when the lobby is actually unsafe."];
  }

  if (visitor.expectedAction === "allow") {
    return ["A valid resident is turned away.", "Management records a complaint and reputation falls."];
  }

  if (visitor.expectedAction === "wait") {
    return ["An uncertain case is forced into the wrong outcome.", "The desk loses the callback, camera, or file-change clue that waiting would have exposed."];
  }

  return markedEvidenceCount === 0
    ? ["The decision lands without a supporting evidence chain.", "The registry marks the call as careless."]
    : ["The marked evidence did not support the final stamp.", "The wrong result shakes the desk light."];
}

const characterAssetById = new Map(registryCharacterAssets.map((asset) => [asset.id, asset]));

const residentAssetIds: Record<string, string> = {
  "lin-anna": "lin-anna-dance-teacher",
  "zhou-qiming": "zhou-qiming-retired-police",
  "li-mei": "li-mei-florist",
  "chen-rui": "chen-rui-doctor",
  "zhao-jun": "zhao-jun-accountant",
  "wang-yulan": "wang-yulan-librarian",
  "mina-park": "mina-park-art-student",
  "sun-hao": "sun-hao-cook",
  "guo-lan": "guo-lan-tailor",
  "owen-xu": "owen-xu-violinist",
};

function getVisitorAsset(visitor: Visitor) {
  if (visitor.id.includes("final") || visitor.room === "000") {
    return characterAssetById.get("clerk-duplicate-silhouette")!;
  }

  if (visitor.id.includes("maintenance") || visitor.room === "7F" || visitor.room === "701") {
    return characterAssetById.get("seventh-floor-impostor")!;
  }

  if (visitor.id.includes("han")) {
    return characterAssetById.get("han-dong-repair-worker")!;
  }

  if (visitor.id.includes("courier") || visitor.name === "Rina Sol") {
    return characterAssetById.get("rina-courier")!;
  }

  if (visitor.isMirror) {
    if (visitor.sourceResidentId === "lin-anna" || visitor.sourceResidentId === "mina-park" || visitor.sourceResidentId === "wang-yulan") {
      return characterAssetById.get("mirror-visitor-wrong-side-mole")!;
    }
    return characterAssetById.get("false-tenant-too-wide-smile")!;
  }

  const namedAsset = registryCharacterAssets.find((asset) => visitor.name.includes(asset.name));
  if (namedAsset) {
    return namedAsset;
  }

  if (visitor.sourceResidentId && residentAssetIds[visitor.sourceResidentId]) {
    return characterAssetById.get(residentAssetIds[visitor.sourceResidentId])!;
  }

  return characterAssetById.get("false-tenant-too-wide-smile")!;
}

function StatMeter({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="registry-meter">
      <span>{label}</span>
      <strong>{value}</strong>
      <div className="registry-meter__track">
        <i style={{ width: `${value}%` }} data-tone={tone} />
      </div>
    </div>
  );
}

function makeVisitorDocuments(visitor: Visitor) {
  const documents = [
    {
      id: "claim",
      title: "Window Claim",
      icon: "fa-comment",
      rows: [
        ["Name", visitor.name],
        ["Room", visitor.room],
        ["Reason", visitor.reason],
        ["Arrival", visitor.arrival],
      ],
    },
    {
      id: "identity",
      title: visitor.appointment ? "Temporary Pass" : "Resident ID",
      icon: visitor.appointment ? "fa-address-card" : "fa-id-card",
      rows: [
        ["Printed name", visitor.name],
        ["Number", visitor.idCode],
        ["Role", visitor.job],
        ["Badge", visitor.badge],
      ],
    },
    {
      id: "appearance",
      title: "Desk Observation",
      icon: "fa-eye",
      rows: [
        ["Eyes", visitor.eyes],
        ["Hair", visitor.hair],
        ["Feature", visitor.feature],
        ["Clothing", visitor.clothing],
        ["Voice", visitor.voice],
        ["Behavior", visitor.behavior],
      ],
    },
  ];

  if (visitor.appointment) {
    documents.push({
      id: "appointment",
      title: "Appointment Slip",
      icon: "fa-clipboard-list",
      rows: [
        ["Name", visitor.appointment.name],
        ["Company", visitor.appointment.company],
        ["Target", visitor.appointment.room],
        ["Time", visitor.appointment.time],
        ["Task", visitor.appointment.task],
      ],
    });
  }

  return documents;
}

export function MidnightRegistryGame() {
  const [dayIndex, setDayIndex] = useState(0);
  const [visitorIndex, setVisitorIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [safety, setSafety] = useState(100);
  const [reputation, setReputation] = useState(100);
  const [sanity, setSanity] = useState(100);
  const [deskView, setDeskView] = useState<DeskView>("documents");
  const [activeDocument, setActiveDocument] = useState("claim");
  const [checkedItems, setCheckedItems] = useState<ChecklistKey[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceKey[]>([]);
  const [toolCounts, setToolCounts] = useState<Record<ToolName, number>>({ ...emptyToolCounts });
  const [toolLog, setToolLog] = useState("The desk lamp hums. Every stamp writes a person into the registry. Check paper, people, memory, and rules before you make anyone official.");
  const [visitorMood, setVisitorMood] = useState<VisitorMood>("idle");
  const [feedback, setFeedback] = useState<{ decision: Decision; correct: boolean; visitor: Visitor; consequences: string[] } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [ending, setEnding] = useState<string | null>(null);

  const currentNight = nights[dayIndex];
  const dayVisitors = useMemo(() => playableVisitors.filter((visitor) => visitor.day === dayIndex + 1), [dayIndex]);
  const visitor = dayVisitors[visitorIndex];
  const resident = getResident(visitor?.sourceResidentId);
  const visitorType = visitor ? getVisitorType(visitor) : "visitor";
  const phoneLines = useMemo(() => (visitor ? getPhoneLines(visitor) : []), [visitor]);
  const questionOptions = useMemo(() => (visitor ? getQuestionOptions(visitor, resident) : []), [visitor, resident]);
  const entryLogs = entryLogsByDay[dayIndex + 1] ?? [];
  const entrySignal = visitor ? getEntrySignal(visitor) : "";
  const pressure = 100 - sanity;
  const queuePressure = dayVisitors.length ? Math.round(((visitorIndex + 1) / dayVisitors.length) * 100) : 0;
  const visitorDocuments = useMemo(() => (visitor ? makeVisitorDocuments(visitor) : []), [visitor]);
  const selectedDocument = visitorDocuments.find((document) => document.id === activeDocument) ?? visitorDocuments[0];

  const resetDesk = () => {
    setDeskView("documents");
    setActiveDocument("claim");
    setCheckedItems([]);
    setSelectedEvidence([]);
    setToolCounts({ ...emptyToolCounts });
    setToolLog("The desk lamp hums. Every stamp writes a person into the registry. Check paper, people, memory, and rules before you make anyone official.");
    setVisitorMood("idle");
  };

  const selectDeskView = (view: DeskView) => {
    setDeskView(view);
    if (view === "archive") {
      setCheckedItems((items) => addUnique(items, "archive"));
    }
    if (view === "notice") {
      setCheckedItems((items) => addUnique(items, "rules"));
    }
    if (view === "ledger") {
      setCheckedItems((items) => addUnique(items, "ledger"));
    }
  };

  const toggleChecklist = (key: ChecklistKey) => {
    setCheckedItems((items) => (items.includes(key) ? items.filter((item) => item !== key) : [...items, key]));
  };

  const toggleEvidence = (key: EvidenceKey) => {
    setSelectedEvidence((items) => (items.includes(key) ? items.filter((item) => item !== key) : [...items, key]));
  };

  const useTool = (tool: ToolName) => {
    if (!visitor || feedback) return;
    const limit = tool === "phone" ? phoneLines.length : tool === "question" ? 3 : 1;
    if (toolCounts[tool] >= limit) {
      setToolLog(tool === "phone" ? "The switchboard refuses another call for this visitor." : tool === "question" ? "The visitor will not answer another question." : "That check is already logged on the form.");
      return;
    }

    const result = tool === "phone" ? phoneLines[toolCounts.phone]?.result ?? visitor.phone : visitor[tool];
    setToolCounts((counts) => ({ ...counts, [tool]: counts[tool] + 1 }));
    setToolLog(tool === "phone" ? `${phoneLines[toolCounts.phone]?.label}: ${result}` : result);
    if (tool === "phone") {
      setVisitorMood("called");
      setCheckedItems((items) => addUnique(items, "phone"));
      if (result.includes("already") || result.includes("contradicts") || result.includes("No relief")) {
        setSelectedEvidence((items) => addUnique(addUnique(items, "phone"), "ledger"));
      }
    }
    if (tool === "scanner") {
      setVisitorMood("watched");
      setCheckedItems((items) => addUnique(items, "documents"));
      if (result.includes("fails") || result.includes("mismatch") || result.includes("wrong") || result.includes("corrupted")) {
        setSelectedEvidence((items) => addUnique(items, "id"));
      }
    }
    if (tool === "camera") {
      setVisitorMood("watched");
      setCheckedItems((items) => addUnique(items, "appearance"));
      if (result.includes("wrong") || result.includes("not") || result.includes("empty") || result.includes("anomaly")) {
        setSelectedEvidence((items) => addUnique(items, "appearance"));
      }
    }
    if (tool === "question") {
      setVisitorMood("cornered");
    }
    if (result.includes("scream") || result.includes("wet tapping") || result.includes("calls itself") || result.includes("hungry")) {
      setSanity((value) => clamp(value - 4));
    }
  };

  const askQuestion = (question: QuestionOption) => {
    if (!visitor || feedback) return;
    if (toolCounts.question >= 3) {
      setToolLog("The visitor will not answer another question.");
      return;
    }

    setToolCounts((counts) => ({ ...counts, question: counts.question + 1 }));
    setToolLog(`${question.prompt} ${question.answer} ${question.signal}`);
    setVisitorMood(question.category === "trap" ? "cornered" : "watched");
    setCheckedItems((items) => addUnique(items, "archive"));
    if (question.category === "trap" || question.category === "relation") {
      setSelectedEvidence((items) => addUnique(items, "behavior"));
    }
    if (question.category === "situation") {
      setSelectedEvidence((items) => addUnique(items, "schedule"));
    }
  };

  const decide = (decision: Decision) => {
    if (!visitor || feedback) return;
    const correct = decision === visitor.expectedAction;
    const allowedMirror = decision === "allow" && visitor.isMirror;
    const blockedValidHuman = !correct && decision !== "allow" && !visitor.isMirror && visitor.expectedAction === "allow";
    const paperworkBonus = Math.min(checkedItems.length, checklistItems.length) * 6;
    const evidenceBonus = correct ? Math.min(selectedEvidence.length, 4) * 7 : 0;
    const rushedPenalty = Math.max(0, 3 - checkedItems.length) * 8;
    const consequences = getConsequences(visitor, decision, correct, selectedEvidence.length);

    setVisitorMood(decision === "security" ? "alarmed" : visitor.isMirror && !correct ? "revealed" : "idle");
    setFeedback({ decision, correct, visitor, consequences });
    setHistory((entries) => [
      ...entries,
      { visitor: visitor.name, room: visitor.room, decision, correct, mirror: visitor.isMirror, consequence: consequences[0] },
    ]);
    setScore((value) => value + (correct ? 100 + visitor.threat + paperworkBonus + evidenceBonus : -70 - rushedPenalty));
    setSafety((value) => clamp(value - (allowedMirror ? 26 : correct ? 0 : 8)));
    setReputation((value) => clamp(value - (blockedValidHuman ? 18 : decision === "security" && !visitor.isMirror && !correct ? 14 : correct ? 0 : 6)));
    setSanity((value) => clamp(value - (correct ? Math.floor(visitor.threat / 7) : 14 + Math.floor(visitor.threat / 5))));
  };

  const continueGame = () => {
    setFeedback(null);
    resetDesk();

    if (visitorIndex + 1 < dayVisitors.length) {
      setVisitorIndex((index) => index + 1);
      return;
    }

    if (dayIndex + 1 < nights.length) {
      setDayIndex((index) => index + 1);
      setVisitorIndex(0);
      setSanity((value) => clamp(value + 10));
      return;
    }

    const mirrorMistakes = history.filter((entry) => entry.mirror && entry.decision === "allow").length + (feedback?.visitor.isMirror && feedback.decision === "allow" ? 1 : 0);
    const wrongCalls = history.filter((entry) => !entry.correct).length + (feedback && !feedback.correct ? 1 : 0);
    const finalScore = score + (feedback?.correct ? 100 + feedback.visitor.threat : -70);

    if (mirrorMistakes === 0 && wrongCalls <= 2 && finalScore >= 1900) {
      setEnding("Good Ending: The duplicate is blocked and enough real residents remain anchored. At dawn, the registry stops updating and your name is crossed off the hiring notice.");
    } else if (mirrorMistakes <= 2 && safety >= 45) {
      setEnding("Survival Ending: You last until morning, but too many residents have been rewritten. They greet you politely, and every greeting is slightly wrong.");
    } else {
      setEnding("Bad Ending: The replacement is registered. Morning finds a new clerk at your desk while the real Y. Xue knocks from outside the glass.");
    }
  };

  const resetGame = () => {
    setDayIndex(0);
    setVisitorIndex(0);
    setScore(0);
    setSafety(100);
    setReputation(100);
    setSanity(100);
    resetDesk();
    setFeedback(null);
    setHistory([]);
    setEnding(null);
  };

  if (!visitor) {
    return null;
  }

  const portraitAsset = getVisitorAsset(visitor);

  return (
    <main
      className={`registry-shell ${pressure > 48 ? "registry-shell--strained" : ""} registry-shell--mood-${visitorMood} ${
        feedback ? `registry-shell--decision-${feedback.decision}` : ""
      } ${feedback && !feedback.correct ? "registry-shell--bad-call" : ""}`}
    >
      <section className="registry-hero">
        <a className="registry-design-link" href="/design-system">
          Design system
        </a>
        <div className="registry-hero__backdrop" aria-hidden="true">
          <span className="registry-window registry-window--one" />
          <span className="registry-window registry-window--two" />
          <span className="registry-window registry-window--three" />
          <span className="registry-rain" />
        </div>
        <div className="registry-hero__content">
          <span>Moonshadow Apartments</span>
          <h1>Midnight Registry</h1>
          <p>Night clerk desk. Every entry stamp can make a visitor real, erase an original resident, or leave your own replacement outside the glass.</p>
        </div>
      </section>

      <section className="registry-dashboard" aria-label="Night clerk dashboard">
        <header className="registry-topbar">
          <div>
            <span>{currentNight.title}</span>
            <h2>{currentNight.subtitle}</h2>
          </div>
          <div className="registry-shift">
            <span>Case type</span>
            <strong>{visitorTypeLabels[visitorType]}</strong>
          </div>
          <div className="registry-shift">
            <span>Visitor {visitorIndex + 1}/{dayVisitors.length}</span>
            <strong>{visitor.arrival}</strong>
          </div>
          <div className="registry-shift">
            <span>Queue pressure</span>
            <strong>{queuePressure}%</strong>
          </div>
          <div className="registry-score">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
        </header>

        <div className="registry-stats">
          <StatMeter label="Safety" value={safety} tone="safe" />
          <StatMeter label="Reputation" value={reputation} tone="trust" />
          <StatMeter label="Stability" value={sanity} tone="mind" />
        </div>

        <div className="registry-grid registry-grid--desk">
          <section className="registry-panel registry-arrival">
            <div className="registry-panel__title">
              <span>At the door / {visitorTypeLabels[visitorType]}</span>
              <h3>{visitor.name}</h3>
            </div>
            <div className={`registry-portrait registry-portrait--${visitor.portrait} registry-portrait--${visitorMood}`} aria-label={`${visitor.name} portrait`}>
              <img src={portraitAsset.image} alt={`${portraitAsset.name} asset card`} />
            </div>
            <dl className="registry-facts">
              <div><dt>Type</dt><dd>{visitorTypeLabels[visitorType]}</dd></div>
              <div><dt>Room</dt><dd>{visitor.room}</dd></div>
              <div><dt>Role</dt><dd>{visitor.job}</dd></div>
              <div><dt>ID</dt><dd>{visitor.idCode}</dd></div>
              <div><dt>Reason</dt><dd>{visitor.reason}</dd></div>
              <div><dt>Badge</dt><dd>{visitor.badge}</dd></div>
            </dl>
          </section>

          <section className="registry-panel registry-desk" aria-label="Desk verification workspace">
            <div className="registry-panel__title">
              <span>Desk workspace</span>
              <h3>Manual Verification</h3>
            </div>
            <div className="registry-desk-tabs" role="tablist" aria-label="Desk sources">
              {[
                ["documents", "Documents", "fa-folder-open"],
                ["archive", "Archive", "fa-book"],
                ["notice", "Notice", "fa-thumbtack"],
                ["ledger", "Ledger", "fa-list-check"],
              ].map(([view, label, icon]) => (
                <button
                  aria-selected={deskView === view}
                  key={view}
                  onClick={() => selectDeskView(view as DeskView)}
                  type="button"
                >
                  <i className={`fa-solid ${icon}`} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="registry-desk-surface">
              {deskView === "documents" ? (
                <>
                  <div className="registry-document-tray" aria-label="Collected documents">
                    {visitorDocuments.map((document) => (
                      <button
                        aria-pressed={selectedDocument?.id === document.id}
                        key={document.id}
                        onClick={() => {
                          setActiveDocument(document.id);
                          setCheckedItems((items) => addUnique(items, "documents"));
                        }}
                        type="button"
                      >
                        <i className={`fa-solid ${document.icon}`} aria-hidden="true" />
                        <span>{document.title}</span>
                      </button>
                    ))}
                  </div>
                  {selectedDocument ? (
                    <article className="registry-paper registry-paper--document-enter" key={selectedDocument.id}>
                      <header>
                        <span>Collected paper</span>
                        <h4>{selectedDocument.title}</h4>
                      </header>
                      <dl className="registry-facts registry-facts--paper">
                        {selectedDocument.rows.map(([label, value]) => (
                          <div key={`${selectedDocument.id}-${label}`}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  ) : null}
                </>
              ) : null}

              {deskView === "archive" ? (
                <article className="registry-paper registry-paper--archive">
                  <header>
                    <span>Resident file</span>
                    <h4>{resident ? resident.name : visitor.appointment ? "Visitor Register" : "No matching file"}</h4>
                  </header>
                  {resident ? (
                    <dl className="registry-facts registry-facts--paper">
                      <div><dt>Room</dt><dd>{resident.room}</dd></div>
                      <div><dt>Job</dt><dd>{resident.job}</dd></div>
                      <div><dt>ID</dt><dd>{resident.idCode}</dd></div>
                      <div><dt>Feature</dt><dd>{resident.feature}</dd></div>
                      <div><dt>Habit</dt><dd>{resident.habit}</dd></div>
                      <div><dt>Never</dt><dd>{resident.forbidden}</dd></div>
                      <div><dt>Greeting</dt><dd>{resident.greeting}</dd></div>
                    </dl>
                  ) : visitor.appointment ? (
                    <dl className="registry-facts registry-facts--paper">
                      <div><dt>Name</dt><dd>{visitor.appointment.name}</dd></div>
                      <div><dt>Company</dt><dd>{visitor.appointment.company}</dd></div>
                      <div><dt>Target</dt><dd>{visitor.appointment.room}</dd></div>
                      <div><dt>Time</dt><dd>{visitor.appointment.time}</dd></div>
                      <div><dt>Task</dt><dd>{visitor.appointment.task}</dd></div>
                    </dl>
                  ) : (
                    <p className="registry-empty">No resident or appointment record matches this claim.</p>
                  )}
                </article>
              ) : null}

              {deskView === "notice" ? (
                <article className="registry-paper registry-paper--notice">
                  <header>
                    <span>Tonight rules</span>
                    <h4>{currentNight.title} Notice</h4>
                  </header>
                  <ol className="registry-rules">
                    {currentNight.rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ol>
                  <div className="registry-register">
                    <strong>Appointments</strong>
                    {appointments.map((appointment) => (
                      <span key={`${appointment.name}-${appointment.time}`}>
                        {appointment.time} - {appointment.name}, {appointment.company}, {appointment.task}
                      </span>
                    ))}
                  </div>
                </article>
              ) : null}

              {deskView === "ledger" ? (
                <div className="registry-ledger-stack">
                  <article className="registry-paper registry-paper--ledger">
                    <header>
                      <span>Today entry log</span>
                      <h4>{currentNight.title} In / Out Records</h4>
                    </header>
                    <div className="registry-entry-log">
                      {entryLogs.map((entry) => (
                        <span data-tone={entry.tone ?? "clear"} key={`${entry.time}-${entry.subject}`}>
                          <strong>{entry.time} / {entry.subject}</strong>
                          <em>{entry.state}</em>
                          <small>{entry.detail}</small>
                        </span>
                      ))}
                    </div>
                    <p className="registry-ledger-signal">{entrySignal}</p>
                  </article>

                  <article className="registry-paper registry-form">
                    <header>
                      <span>Approval form</span>
                      <h4>Entry Review #{visitorIndex + 1}</h4>
                    </header>
                    <div className="registry-form__identity">
                      <strong>{visitor.name}</strong>
                      <span>{visitor.room} / {visitor.idCode} / Decision pending</span>
                    </div>
                    <div className="registry-checklist">
                      {checklistItems.map((item) => (
                        <button
                          aria-pressed={checkedItems.includes(item.key)}
                          key={item.key}
                          onClick={() => toggleChecklist(item.key)}
                          type="button"
                        >
                          <i className={`fa-solid ${checkedItems.includes(item.key) ? "fa-square-check" : "fa-square"}`} aria-hidden="true" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="registry-evidence-board">
                      <strong>Evidence reasons</strong>
                      <div>
                        {evidenceOptions.map((option) => (
                          <button
                            aria-pressed={selectedEvidence.includes(option.key)}
                            key={option.key}
                            onClick={() => toggleEvidence(option.key)}
                            title={option.detail}
                            type="button"
                          >
                            <i className={`fa-solid ${selectedEvidence.includes(option.key) ? "fa-circle-check" : "fa-circle"}`} aria-hidden="true" />
                            <span>{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              ) : null}
            </div>
          </section>

          <section className="registry-panel registry-observation">
            <div className="registry-panel__title">
              <span>Observed details</span>
              <h3>Glass Notes</h3>
            </div>
            <ul className="registry-note-list">
              <li><strong>Eyes</strong>{visitor.eyes}</li>
              <li><strong>Hair</strong>{visitor.hair}</li>
              <li><strong>Feature</strong>{visitor.feature}</li>
              <li><strong>Clothing</strong>{visitor.clothing}</li>
              <li><strong>Voice</strong>{visitor.voice}</li>
              <li><strong>Behavior</strong>{visitor.behavior}</li>
            </ul>
          </section>
        </div>

        <section className="registry-tools">
          <div className="registry-tool-buttons" aria-label="Verification tools">
            <button disabled={toolCounts.phone >= phoneLines.length} type="button" onClick={() => useTool("phone")}>
              <img src="/assets/midnight-registry/props/phone-receiver-dial.png" alt="" aria-hidden="true" />
              <span>{toolCounts.phone >= phoneLines.length ? "Phone locked" : `Call ${phoneLines[toolCounts.phone]?.label}`}</span>
            </button>
            <button disabled={toolCounts.scanner >= 1} type="button" onClick={() => useTool("scanner")}>
              <img src="/assets/midnight-registry/props/id-scanner-device.png" alt="" aria-hidden="true" />
              <span>Scan ID</span>
            </button>
            <button disabled={toolCounts.camera >= 1} type="button" onClick={() => useTool("camera")}>
              <img src="/assets/midnight-registry/props/cctv-monitor.png" alt="" aria-hidden="true" />
              <span>Camera</span>
            </button>
          </div>
          <div className="registry-tool-log">
            <p>{toolLog}</p>
            <span>{checkedItems.length}/{checklistItems.length} sources checked / {selectedEvidence.length} evidence reasons marked</span>
          </div>
          <div className="registry-question-board" aria-label="Question prompts">
            <strong>Questions left: {Math.max(0, 3 - toolCounts.question)}</strong>
            <div>
              {questionOptions.map((question) => (
                <button
                  disabled={toolCounts.question >= 3}
                  key={question.category}
                  onClick={() => askQuestion(question)}
                  type="button"
                >
                  <img src="/assets/midnight-registry/props/question-prompt-card.png" alt="" aria-hidden="true" />
                  <span>{question.prompt}</span>
                  <small>{question.category}</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        <footer className="registry-decisions">
          <button className="registry-decision registry-decision--allow" type="button" onClick={() => decide("allow")}>
            <img src="/assets/midnight-registry/props/approve-stamp.png" alt="" aria-hidden="true" />
            <span>{decisionLabels.allow}</span>
          </button>
          <button className="registry-decision registry-decision--reject" type="button" onClick={() => decide("reject")}>
            <img src="/assets/midnight-registry/props/deny-stamp.png" alt="" aria-hidden="true" />
            <span>{decisionLabels.reject}</span>
          </button>
          <button className="registry-decision registry-decision--security" type="button" onClick={() => decide("security")}>
            <img src="/assets/midnight-registry/props/security-call-stamp.png" alt="" aria-hidden="true" />
            <span>{decisionLabels.security}</span>
          </button>
          <button className="registry-decision registry-decision--wait" type="button" onClick={() => decide("wait")}>
            <img src="/assets/midnight-registry/props/wait-token.png" alt="" aria-hidden="true" />
            <span>{decisionLabels.wait}</span>
          </button>
        </footer>
      </section>

      <section className="registry-history" aria-label="Shift ledger">
        <h2>Shift Ledger</h2>
        <div>
          {history.length === 0 ? (
            <span>No entries yet.</span>
          ) : (
            history.slice(-8).map((entry, index) => (
              <span key={`${entry.visitor}-${index}`} data-status={entry.correct ? "correct" : "wrong"}>
                <strong>{entry.visitor} {entry.room}: {entry.decision}</strong>
                <small>{entry.consequence}</small>
              </span>
            ))
          )}
        </div>
      </section>

      {feedback ? (
        <div className="registry-modal" role="dialog" aria-modal="true" aria-labelledby="registry-feedback-title">
          <div className="registry-modal__card">
            <span>{feedback.correct ? "Correct call" : "Bad call"}</span>
            <h2 id="registry-feedback-title">
              {feedback.decision === "allow"
                ? "Gate Opened"
                : feedback.decision === "security"
                  ? "Security Called"
                  : feedback.decision === "wait"
                    ? "Visitor Held"
                    : "Entry Refused"}
            </h2>
            <p>
              {feedback.correct
                ? feedback.visitor.isMirror
                  ? feedback.decision === "security"
                    ? "Security locks the lobby before the record can legalize the thing at the door."
                    : "The thing at the door loses the identity it was trying to occupy."
                  : feedback.decision === "wait"
                    ? "Holding the case buys enough time for another source to reveal which record is moving."
                    : feedback.visitor.expectedAction === "allow"
                      ? "A valid person reaches the stairs without being rewritten."
                      : "The rule holds. A human visitor leaves without incident."
                : feedback.visitor.isMirror
                  ? "The mirror guest records your mistake and starts occupying the name."
                  : "A legitimate resident or approved case is marked as a threat."}
            </p>
            <div className="registry-feedback-grid">
              <section>
                <strong>Case evidence</strong>
                <ul>
                  {feedback.visitor.clues.map((clue) => (
                    <li key={clue}>{clue}</li>
                  ))}
                </ul>
              </section>
              <section>
                <strong>Marked reasons</strong>
                <ul>
                  {selectedEvidence.length === 0 ? (
                    <li>No evidence reasons were marked.</li>
                  ) : (
                    selectedEvidence.map((key) => {
                      const evidence = evidenceOptions.find((option) => option.key === key);
                      return <li key={key}>{evidence?.label ?? key}</li>;
                    })
                  )}
                </ul>
              </section>
            </div>
            <strong className="registry-consequence-title">Immediate consequences</strong>
            <ul className="registry-consequence-list">
              {feedback.consequences.map((consequence) => (
                <li key={consequence}>{consequence}</li>
              ))}
            </ul>
            <button type="button" onClick={continueGame}>
              <i className="fa-solid fa-forward-step" aria-hidden="true" />
              <span>{dayIndex === nights.length - 1 && visitorIndex === dayVisitors.length - 1 ? "Read Ending" : "Continue Shift"}</span>
            </button>
          </div>
        </div>
      ) : null}

      {ending ? (
        <div className="registry-modal" role="dialog" aria-modal="true" aria-labelledby="registry-ending-title">
          <div className="registry-modal__card registry-modal__card--ending">
            <span>Final Registry</span>
            <h2 id="registry-ending-title">{ending.split(":")[0]}</h2>
            <p>{ending.split(":").slice(1).join(":").trim()}</p>
            <div className="registry-ending-stats">
              <strong>Score {score}</strong>
              <strong>Safety {safety}</strong>
              <strong>Reputation {reputation}</strong>
              <strong>Stability {sanity}</strong>
            </div>
            <button type="button" onClick={resetGame}>
              <i className="fa-solid fa-rotate-right" aria-hidden="true" />
              <span>Restart Demo</span>
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
