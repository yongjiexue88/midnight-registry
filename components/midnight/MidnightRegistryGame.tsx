"use client";

import { useEffect, useMemo, useState } from "react";
import { registryCharacterAssets, registryNightPlans } from "@/data/midnightRegistryDesignSystem";
import { useTranslation } from "@/lib/translations";

import {
  Decision,
  ToolName,
  DeskView,
  ChecklistKey,
  EvidenceKey,
  VisitorType,
  QuestionCategory,
  VisitorMood,
  GameMode,
  ResidentStatus,
  OfficeUpgradeId,
  Resident,
  Appointment,
  Visitor,
  HistoryEntry,
  EvidenceOption,
  EntryLog,
  PhoneLine,
  QuestionOption,
  checklistItems,
  evidenceOptions,
  emptyToolCounts,
  visitorTypeLabels,
  decisionLabels,
  residents,
  appointments,
  playableNightCount,
  visitorsPerNight,
  nights,
  visitors,
  residentIdByName,
  getResident,
  generatedVisitors,
  playableVisitors,
  entryLogsByDay,
  entrySignalByVisitorId,
  officeUpgrades,
  residentRelationships,
  cctvSceneAssets,
} from "@/data/midnightRegistryData";
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


function TypewriterText({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 24);

    return () => clearInterval(timer);
  }, [text]);

  return <p className="registry-dialogue">{shown}</p>;
}


type ScreenEffect = null | "allow" | "refuse" | "security" | "wait" | "wrong";
type ResourcePool = Record<ToolName, number>;
type HoldReveal = {
  visitorId: string;
  phase: "waiting" | "revealed";
  text: string;
  evidence: EvidenceKey[];
};
type NightSettlement = {
  night: number;
  correct: number;
  total: number;
  replaced: number;
  credits: number;
};

const baseResourcesByMode: Record<GameMode, ResourcePool> = {
  story: { phone: 10, scanner: 6, camera: 10, question: 18 },
  challenge: { phone: 4, scanner: 3, camera: 4, question: 8 },
  endless: { phone: 6, scanner: 4, camera: 6, question: 12 },
};

function makeResidentStatusMap(): Record<string, ResidentStatus> {
  return Object.fromEntries(residents.map((resident) => [resident.id, "active"])) as Record<string, ResidentStatus>;
}

function getResourcePool(
  mode: GameMode,
  perk: "coffee" | "booster" | "override" | "repairkit" | null,
  upgrades: OfficeUpgradeId[],
): ResourcePool {
  const resources = { ...baseResourcesByMode[mode] };
  if (perk === "repairkit") resources.phone += 2;
  if (perk === "booster") resources.scanner += 2;
  if (upgrades.includes("hotline")) resources.phone += 2;
  if (upgrades.includes("camera-buffer")) resources.camera += 2;
  if (upgrades.includes("scanner-capacitor")) resources.scanner += 2;
  if (upgrades.includes("archive-lock")) resources.question = Math.max(1, resources.question - 2);
  return resources;
}

function getHoldReveal(visitor: Visitor): { text: string; evidence: EvidenceKey[] } {
  if (visitor.isMirror) {
    return {
      text: "During the hold, the room calls back while the visitor is still at the glass. CCTV then catches the visitor's reflection moving before the body does.",
      evidence: ["phone", "appearance", "ledger"],
    };
  }

  if (visitor.expectedAction === "wait") {
    return {
      text: "The callback arrives after the hold: the visitor is legitimate, but tonight's rules require the parcel, badge, or person to remain at the desk.",
      evidence: ["phone", "rules", "appointment"],
    };
  }

  return {
    text: "Nothing changes during the hold. The existing archive, schedule, and lived details remain the strongest evidence.",
    evidence: ["schedule"],
  };
}

export function MidnightRegistryGame() {
  const { t, toggleLanguage } = useTranslation();
  const [gameMode, setGameMode] = useState<GameMode>("story");
  const [endlessRound, setEndlessRound] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [visitorIndex, setVisitorIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [safety, setSafety] = useState(100);
  const [reputation, setReputation] = useState(100);
  const [sanity, setSanity] = useState(100);
  const [deskView, setDeskView] = useState<DeskView | "cctv" | "phone">("documents");
  const [activeDocument, setActiveDocument] = useState("claim");
  const [documentMotionKey, setDocumentMotionKey] = useState(0);
  const [checkedItems, setCheckedItems] = useState<ChecklistKey[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceKey[]>([]);
  const [toolCounts, setToolCounts] = useState<Record<ToolName, number>>({ ...emptyToolCounts });
  const [toolLog, setToolLog] = useState("The desk lamp hums. Every stamp writes a person into the registry. Check paper, people, memory, and rules before you make anyone official.");
  const [visitorMood, setVisitorMood] = useState<VisitorMood>("idle");
  const [screenEffect, setScreenEffect] = useState<ScreenEffect>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ decision: Decision; correct: boolean; visitor: Visitor; consequences: string[] } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [ending, setEnding] = useState<string | null>(null);
  const [nightSettlement, setNightSettlement] = useState<NightSettlement | null>(null);
  const [holdReveal, setHoldReveal] = useState<HoldReveal | null>(null);
  const [visitorWaitMs, setVisitorWaitMs] = useState(0);
  const [resourcePool, setResourcePool] = useState<ResourcePool>(() => getResourcePool("story", null, []));
  const [residentStatuses, setResidentStatuses] = useState<Record<string, ResidentStatus>>(makeResidentStatusMap);

  // V3 & V4 States
  const [gamePhase, setGamePhase] = useState<"prep" | "shift">("prep");
  const [prepPoints, setPrepPoints] = useState(100);
  const [decryptedFiles, setDecryptedFiles] = useState<string[]>([]);
  const [selectedPerk, setSelectedPerk] = useState<"coffee" | "booster" | "override" | "repairkit" | null>(null);
  const [upgradeCredits, setUpgradeCredits] = useState(0);
  const [ownedUpgrades, setOwnedUpgrades] = useState<OfficeUpgradeId[]>([]);
  const [repairTarget, setRepairTarget] = useState<string | null>(null);
  const [repairSources, setRepairSources] = useState<string[]>([]);

  // Equipment failures state
  const [failures, setFailures] = useState<Record<ToolName | "lock", boolean>>({
    phone: false,
    scanner: false,
    camera: false,
    question: false,
    lock: false,
  });
  const [activeRepairTool, setActiveRepairTool] = useState<ToolName | "lock" | null>(null);

  // Switchboard and CCTV state
  const [cctvChannel, setCctvChannel] = useState(1);
  const [totalToolUsage, setTotalToolUsage] = useState<Record<ToolName, number>>({
    phone: 0,
    scanner: 0,
    camera: 0,
    question: 0,
  });

  // Repair minigame sub-states
  const [phoneWires, setPhoneWires] = useState<{ left: string[]; right: string[]; connections: Record<string, string> }>({
    left: ["Red", "Blue", "Yellow"],
    right: ["Blue", "Yellow", "Red"],
    connections: {},
  });
  const [selectedLeftWire, setSelectedLeftWire] = useState<string | null>(null);
  const [cctvFrequency, setCctvFrequency] = useState(50.0);
  const [cctvTargetFrequency, setCctvTargetFrequency] = useState(74.5);
  const [scannerProgress, setScannerProgress] = useState(0);
  const [lockSequence, setLockSequence] = useState("");
  const [lockTargetCode, setLockTargetCode] = useState("4291");

  const currentNight =
    gameMode === "endless"
      ? {
          title: `Endless Shift ${endlessRound + 1}`,
          subtitle: "The Registry Never Closes",
          rules: nights[Math.min(endlessRound, nights.length - 1)].rules,
        }
      : nights[dayIndex];
  const dayVisitors = useMemo(() => {
    if (gameMode !== "endless") {
      return playableVisitors.filter((candidate) => candidate.day === dayIndex + 1);
    }

    return Array.from({ length: visitorsPerNight }, (_, index) => {
      const source = playableVisitors[(endlessRound * visitorsPerNight + index) % playableVisitors.length];
      return {
        ...source,
        id: `endless-${endlessRound}-${index}-${source.id}`,
        day: endlessRound + 1,
        arrival: `${String(20 + Math.floor(index / 3)).padStart(2, "0")}:${String(8 + index * 6).padStart(2, "0")}`,
        threat: source.threat + endlessRound * 2,
      };
    });
  }, [dayIndex, endlessRound, gameMode]);
  const visitor = dayVisitors[visitorIndex];
  const resident = getResident(visitor?.sourceResidentId);
  const visitorType = visitor ? getVisitorType(visitor) : "visitor";
  const phoneLines = useMemo(() => (visitor ? getPhoneLines(visitor) : []), [visitor]);
  const questionOptions = useMemo(() => (visitor ? getQuestionOptions(visitor, resident) : []), [visitor, resident]);
  const entryLogDay = Math.min(gameMode === "endless" ? endlessRound + 1 : dayIndex + 1, 7);
  const entryLogs = entryLogsByDay[entryLogDay] ?? [];
  const entrySignal = visitor ? getEntrySignal(visitor) : "";
  const pressure = 100 - sanity;
  const queuePressure = dayVisitors.length ? Math.round(((visitorIndex + 1) / dayVisitors.length) * 100) : 0;
  const visitorDocuments = useMemo(() => (visitor ? makeVisitorDocuments(visitor) : []), [visitor]);
  const selectedDocument = visitorDocuments.find((document) => document.id === activeDocument) ?? visitorDocuments[0];
  const mostUsedTool = useMemo(() => {
    const entries = Object.entries(totalToolUsage) as [ToolName, number][];
    const maxUsage = Math.max(...entries.map(([, count]) => count));
    if (maxUsage === 0) return null;
    return entries.find(([, count]) => count === maxUsage)?.[0] ?? null;
  }, [totalToolUsage]);
  const learningImpostorActive = (dayIndex >= 5 || (gameMode === "endless" && endlessRound >= 5)) && visitor.isMirror;
  const storyScenes = [
    "/assets/midnight-registry/cctv/front-gate.png",
    "/assets/midnight-registry/cctv/blue-star-van.png",
    "/assets/midnight-registry/cctv/security-booth.png",
    "/assets/midnight-registry/cctv/impossible-stairwell.png",
    "/assets/midnight-registry/cctv/archive-room.png",
    "/assets/midnight-registry/cctv/impossible-hallway-shadow.png",
    "/assets/midnight-registry/cctv/clerk-counter.png",
  ];
  const storyScene = storyScenes[(gameMode === "endless" ? endlessRound : dayIndex) % storyScenes.length];

  // Scanner calibration bar effect
  useEffect(() => {
    if (activeRepairTool !== "scanner") return;
    let direction = 1;
    const interval = setInterval(() => {
      setScannerProgress((prev) => {
        let next = prev + direction * 4;
        if (next >= 100) {
          next = 100;
          direction = -1;
        } else if (next <= 0) {
          next = 0;
          direction = 1;
        }
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [activeRepairTool]);

  useEffect(() => {
    setVisitorWaitMs(0);
  }, [visitor.id]);

  useEffect(() => {
    if (gamePhase !== "shift" || feedback || ending || holdReveal) return;
    const timer = window.setInterval(() => setVisitorWaitMs((value) => value + 1000), 1000);
    return () => window.clearInterval(timer);
  }, [ending, feedback, gamePhase, holdReveal]);

  useEffect(() => {
    if (feedback || holdReveal || visitorMood === "revealed" || visitorMood === "leaving") return;
    if (visitorWaitMs >= 45000) {
      setVisitorMood("angry");
    } else if (visitorWaitMs >= 30000) {
      setVisitorMood("suspicious");
    } else if (visitorWaitMs >= 20000) {
      setVisitorMood("waiting");
    }
  }, [feedback, holdReveal, visitorMood, visitorWaitMs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "f") return;
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      } else {
        void document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const gameWindow = window;

    gameWindow.render_game_to_text = () =>
      JSON.stringify({
        coordinateSystem: "DOM desk interface; top-left origin; screen sections flow downward.",
        mode: gameMode,
        phase: gamePhase,
        night: gameMode === "endless" ? endlessRound + 1 : dayIndex + 1,
        visitor: {
          index: visitorIndex + 1,
          total: dayVisitors.length,
          id: visitor.id,
          name: visitor.name,
          room: visitor.room,
          mood: visitorMood,
          waitMs: visitorWaitMs,
        },
        deskView,
        checkedItems,
        selectedEvidence,
        resources: resourcePool,
        failures,
        stats: { score, safety, reputation, sanity },
        feedback: feedback ? { decision: feedback.decision, correct: feedback.correct } : null,
        hold: holdReveal?.phase ?? null,
        ending: ending?.split(":")[0] ?? null,
      });
    gameWindow.advanceTime = (ms = 1000) => {
      setVisitorWaitMs((value) => value + Math.max(0, ms));
    };

    return () => {
      delete gameWindow.render_game_to_text;
      delete gameWindow.advanceTime;
    };
  }, [
    checkedItems,
    dayIndex,
    dayVisitors.length,
    deskView,
    endlessRound,
    ending,
    failures,
    feedback,
    gameMode,
    gamePhase,
    holdReveal,
    reputation,
    resourcePool,
    safety,
    sanity,
    score,
    selectedEvidence,
    visitor.id,
    visitor.name,
    visitor.room,
    visitorIndex,
    visitorMood,
    visitorWaitMs,
  ]);

  const resetDesk = () => {
    setDeskView("documents");
    setActiveDocument("claim");
    setDocumentMotionKey((key) => key + 1);
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
    if (!visitor || feedback || holdReveal) return;
    const limit = tool === "phone" ? phoneLines.length : tool === "question" ? 3 : 1;
    if (toolCounts[tool] >= limit) {
      setToolLog(tool === "phone" ? "The switchboard refuses another call for this visitor." : tool === "question" ? "The visitor will not answer another question." : "That check is already logged on the form.");
      return;
    }
    if (resourcePool[tool] <= 0) {
      setToolLog(`No ${tool} resources remain for this shift. Use the archive, rules, ledger, and lived details.`);
      return;
    }

    if (failures[tool]) {
      if (tool === "phone") {
        setPhoneWires({
          left: ["Red", "Blue", "Yellow"],
          right: ["Blue", "Yellow", "Red"].sort(() => Math.random() - 0.5),
          connections: {},
        });
        setSelectedLeftWire(null);
      } else if (tool === "camera") {
        setCctvFrequency(50.0);
        setCctvTargetFrequency(parseFloat((60 + Math.random() * 30).toFixed(1)));
      } else if (tool === "scanner") {
        setScannerProgress(0);
      }
      setActiveRepairTool(tool);
      return;
    }

    const baseResult = tool === "phone" ? phoneLines[toolCounts.phone]?.result ?? visitor.phone : visitor[tool];
    const result =
      tool === "scanner" && learningImpostorActive && mostUsedTool === "scanner"
        ? "The scan is perfectly clean. Its timestamp matches the moment you usually trust the scanner most."
        : baseResult;
    setToolCounts((counts) => ({ ...counts, [tool]: counts[tool] + 1 }));
    setResourcePool((resources) => ({ ...resources, [tool]: Math.max(0, resources[tool] - 1) }));
    setActiveTool(tool);
    setToolLog(`${tool} running...`);

    setTimeout(() => {
      setToolLog(tool === "phone" ? `${phoneLines[toolCounts.phone]?.label}: ${result}` : result);
      setActiveTool(null);
      if (tool === "phone") {
        setVisitorMood("nervous");
        setCheckedItems((items) => addUnique(items, "phone"));
        if (result.includes("already") || result.includes("contradicts") || result.includes("No relief")) {
          setSelectedEvidence((items) => addUnique(addUnique(items, "phone"), "ledger"));
        }
      }
      if (tool === "scanner") {
        setVisitorMood("waiting");
        setCheckedItems((items) => addUnique(items, "documents"));
        if (result.includes("fails") || result.includes("mismatch") || result.includes("wrong") || result.includes("corrupted")) {
          setSelectedEvidence((items) => addUnique(items, "id"));
        }
      }
      if (tool === "camera") {
        setVisitorMood("waiting");
        setCheckedItems((items) => addUnique(items, "appearance"));
        if (result.includes("wrong") || result.includes("not") || result.includes("empty") || result.includes("anomaly")) {
          setSelectedEvidence((items) => addUnique(items, "appearance"));
        }
      }
      if (tool === "question") {
        setVisitorMood("suspicious");
      }
      if (result.includes("scream") || result.includes("wet tapping") || result.includes("calls itself") || result.includes("hungry")) {
        setSanity((value) => clamp(value - 4));
      }
    }, 900);
  };

  const askQuestion = (question: QuestionOption) => {
    if (!visitor || feedback || holdReveal) return;
    if (toolCounts.question >= 3) {
      setToolLog("The visitor will not answer another question.");
      return;
    }
    if (resourcePool.question <= 0) {
      setToolLog("The interview deck is exhausted for this shift.");
      return;
    }

    setToolCounts((counts) => ({ ...counts, question: counts.question + 1 }));
    setResourcePool((resources) => ({ ...resources, question: Math.max(0, resources.question - 1) }));
    const learnedAnswer =
      learningImpostorActive && mostUsedTool === "question"
        ? "The answer matches your most repeated question exactly, including the same pause you accepted earlier."
        : question.answer;
    const learnedSignal =
      learningImpostorActive && mostUsedTool === "question"
        ? "No contradiction appears because this impostor prepared for the interview pattern you use most."
        : question.signal;
    setToolLog(`${question.prompt} ${learnedAnswer} ${learnedSignal}`);
    setVisitorMood(question.category === "trap" ? "suspicious" : "nervous");
    setCheckedItems((items) => addUnique(items, "archive"));
    if ((question.category === "trap" || question.category === "relation") && !(learningImpostorActive && mostUsedTool === "question")) {
      setSelectedEvidence((items) => addUnique(items, "behavior"));
    }
    if (question.category === "situation") {
      setSelectedEvidence((items) => addUnique(items, "schedule"));
    }
  };

  // Switchboard Wires Mini-game clicks
  const handleLeftWireClick = (color: string) => {
    setSelectedLeftWire(color);
  };

  const handleRightWireClick = (color: string) => {
    if (!selectedLeftWire) return;
    if (selectedLeftWire === color) {
      setPhoneWires((prev) => {
        const newConns = { ...prev.connections, [color]: color };
        if (Object.keys(newConns).length === 3) {
          setTimeout(() => {
            setFailures((f) => ({ ...f, phone: false }));
            setActiveRepairTool(null);
            setToolLog("Phone system switchboard synchronized. Line restored.");
          }, 300);
        }
        return { ...prev, connections: newConns };
      });
    }
    setSelectedLeftWire(null);
  };

  // CCTV frequency mini-game tuner
  const tuneCctv = () => {
    if (Math.abs(cctvFrequency - cctvTargetFrequency) < 1.5) {
      setFailures((f) => ({ ...f, camera: false }));
      setActiveRepairTool(null);
      setToolLog("CCTV channels frequency synchronized. Feeds restored.");
    } else {
      setToolLog("Frequency mismatch. Tune closer to the target frequency.");
    }
  };

  // Scanner calibration mini-game button
  const calibrateScanner = () => {
    if (scannerProgress >= 45 && scannerProgress <= 55) {
      setFailures((f) => ({ ...f, scanner: false }));
      setActiveRepairTool(null);
      setToolLog("ID scanner laser calibrated successfully.");
    } else {
      setToolLog(`Calibration failed at ${scannerProgress}%. Laser must land on the green sweet spot (45-55%).`);
    }
  };

  // Lock keypad numpad click
  const pressLockKey = (num: string) => {
    setLockSequence((prev) => {
      const next = prev + num;
      if (next === lockTargetCode) {
        setTimeout(() => {
          setFailures((f) => ({ ...f, lock: false }));
          setActiveRepairTool(null);
          setToolLog("Lobby door backup lock sequence accepted. Lock released.");
        }, 300);
      } else if (next.length >= 4) {
        return "";
      }
      return next;
    });
  };

  const resolveDecision = (decision: Decision, evidenceReasons = selectedEvidence) => {
    const correct = decision === visitor.expectedAction;
    const allowedMirror = decision === "allow" && visitor.isMirror;
    const blockedValidHuman = !correct && decision !== "allow" && !visitor.isMirror && visitor.expectedAction === "allow";
    const paperworkBonus = Math.min(checkedItems.length, checklistItems.length) * 6;
    const evidenceBonus = correct ? Math.min(evidenceReasons.length, 4) * 7 : 0;
    const rushedPenalty = Math.max(0, 3 - checkedItems.length) * 8;
    const consequences = getConsequences(visitor, decision, correct, evidenceReasons.length);

    setVisitorMood(decision === "security" ? "revealed" : visitor.isMirror && !correct ? "revealed" : "idle");
    setFeedback({ decision, correct, visitor, consequences });
    setHistory((entries) => [
      ...entries,
      {
        day: gameMode === "endless" ? endlessRound + 1 : dayIndex + 1,
        visitor: visitor.name,
        room: visitor.room,
        decision,
        correct,
        mirror: visitor.isMirror,
        consequence: consequences[0],
      },
    ]);
    setScore((value) => value + (correct ? 100 + visitor.threat + paperworkBonus + evidenceBonus : -70 - rushedPenalty));
    setSafety((value) => clamp(value - (allowedMirror ? 26 : correct ? 0 : 8)));
    setReputation((value) => clamp(value - (blockedValidHuman ? 18 : decision === "security" && !visitor.isMirror && !correct ? 14 : correct ? 0 : 6)));
    setSanity((value) => clamp(value - (correct ? Math.floor(visitor.threat / 7) : 14 + Math.floor(visitor.threat / 5))));

    if (visitor.sourceResidentId) {
      if (allowedMirror) {
        setResidentStatuses((statuses) => ({ ...statuses, [visitor.sourceResidentId!]: "replaced" }));
      } else if (blockedValidHuman) {
        setResidentStatuses((statuses) => ({ ...statuses, [visitor.sourceResidentId!]: "stranded" }));
      } else if (correct && decision === "allow") {
        setResidentStatuses((statuses) => ({ ...statuses, [visitor.sourceResidentId!]: "active" }));
      }
    }
    setScreenEffect(null);
  };

  const decide = (decision: Decision) => {
    if (!visitor || feedback || holdReveal) return;
    if (failures.lock) {
      setLockSequence("");
      setLockTargetCode(String(Math.floor(1000 + Math.random() * 9000)));
      setActiveRepairTool("lock");
      return;
    }

    setScreenEffect(decision === "reject" ? "refuse" : decision);
    setVisitorMood(decision === "allow" ? "leaving" : decision === "security" ? "revealed" : decision === "reject" ? "leaving" : "angry");

    if (decision === "wait") {
      const reveal = getHoldReveal(visitor);
      setHoldReveal({ visitorId: visitor.id, phase: "waiting", text: "The registry clock advances while the visitor remains outside.", evidence: [] });
      window.setTimeout(() => {
        setSelectedEvidence((items) => reveal.evidence.reduce((next, key) => addUnique(next, key), items));
        setCheckedItems((items) => addUnique(addUnique(items, "phone"), "ledger"));
        setToolLog(reveal.text);
        setHoldReveal({ visitorId: visitor.id, phase: "revealed", text: reveal.text, evidence: reveal.evidence });
      }, 900);
      return;
    }

    window.setTimeout(() => resolveDecision(decision), 750);
  };

  const recordHoldDecision = () => {
    if (!holdReveal || holdReveal.phase !== "revealed") return;
    const evidenceReasons = holdReveal.evidence.reduce((items, key) => addUnique(items, key), selectedEvidence);
    setHoldReveal(null);
    resolveDecision("wait", evidenceReasons);
  };

  const continueGame = () => {
    setFeedback(null);
    resetDesk();

    if (visitorIndex + 1 < dayVisitors.length) {
      let failedSystem: ToolName | "lock" | null = null;
      const progressionNight = gameMode === "endless" ? endlessRound : dayIndex;
      if (progressionNight >= 2) {
        const roll = Math.random();
        const threshold = gameMode === "challenge" ? 0.35 : progressionNight === 2 ? 0.15 : progressionNight === 3 ? 0.2 : 0.25;
        if (roll < threshold) {
          const pool: (ToolName | "lock")[] = [];
          if (!failures.phone && selectedPerk !== "repairkit") pool.push("phone");
          if (!failures.scanner && selectedPerk !== "booster") pool.push("scanner");
          if (!failures.camera) pool.push("camera");
          if (!failures.lock && selectedPerk !== "override") pool.push("lock");
          if (pool.length > 0) {
            failedSystem = pool[Math.floor(Math.random() * pool.length)];
          }
        }
      }

      if (failedSystem) {
        setFailures((currentFailures) => ({ ...currentFailures, [failedSystem!]: true }));
        setToolLog(`WARNING: Critical ${failedSystem.toUpperCase()} failure. Manual calibration required.`);
      }
      setVisitorIndex((index) => index + 1);
      return;
    }

    const settlementDay = gameMode === "endless" ? endlessRound + 1 : dayIndex + 1;
    const nightEntries = history.filter((entry) => entry.day === settlementDay);
    const correctCalls = nightEntries.filter((entry) => entry.correct).length;
    const replacedResidents = Object.values(residentStatuses).filter((status) => status === "replaced").length;
    const earnedCredits = correctCalls >= Math.ceil(dayVisitors.length * 0.75) ? 2 : 1;

    if (gameMode === "endless" || dayIndex + 1 < nights.length) {
      setUpgradeCredits((credits) => credits + earnedCredits);
      setNightSettlement({
        night: settlementDay,
        correct: correctCalls,
        total: dayVisitors.length,
        replaced: replacedResidents,
        credits: earnedCredits,
      });
      return;
    }

    const mirrorMistakes = history.filter((entry) => entry.mirror && entry.decision === "allow").length;
    const wrongCalls = history.filter((entry) => !entry.correct).length;
    const finalScore = score;

    const isBadCallClerk = feedback?.visitor.room === "000" && feedback?.decision === "allow";
    if (isBadCallClerk || safety <= 0 || reputation <= 0 || sanity <= 0) {
      setEnding("Bad Ending: The replacement is registered. Morning finds a new clerk sitting at your desk inside, while the real Y. Xue stands outside in the rain, knocking on the glass.");
    } else if (mirrorMistakes === 0 && wrongCalls <= 2 && finalScore >= 2500) {
      setEnding("Good Ending: You block the duplicate, verify all resident files, and survive the seven nights. At dawn, you walk out of the lobby with your name crossed off the hiring notice, free of the registry's cycle.");
    } else {
      setEnding("Survival Ending: You survive the week, but too many duplicates got through. The building continues, but everyone greets you with a polite nod and a smile that is slightly off-pitch.");
    }
  };

  const continueAfterSettlement = () => {
    setNightSettlement(null);
    setVisitorIndex(0);
    setSanity((value) => clamp(value + (selectedPerk === "coffee" ? 30 : 15)));
    setGamePhase("prep");
    setPrepPoints(ownedUpgrades.includes("archive-lock") ? 120 : 100);
    setSelectedPerk(null);
    setRepairTarget(null);
    setRepairSources([]);
    if (gameMode === "endless") {
      setEndlessRound((round) => round + 1);
    } else {
      setDayIndex((index) => index + 1);
    }
  };

  const resetGame = () => {
    setGameMode("story");
    setEndlessRound(0);
    setDayIndex(0);
    setVisitorIndex(0);
    setScore(0);
    setSafety(100);
    setReputation(100);
    setSanity(100);
    setGamePhase("prep");
    setPrepPoints(100);
    setSelectedPerk(null);
    setDecryptedFiles([]);
    setUpgradeCredits(0);
    setOwnedUpgrades([]);
    setRepairTarget(null);
    setRepairSources([]);
    setResourcePool(getResourcePool("story", null, []));
    setResidentStatuses(makeResidentStatusMap());
    setFailures({
      phone: false,
      scanner: false,
      camera: false,
      question: false,
      lock: false,
    });
    setTotalToolUsage({
      phone: 0,
      scanner: 0,
      camera: 0,
      question: 0,
    });
    resetDesk();
    setFeedback(null);
    setHistory([]);
    setEnding(null);
    setNightSettlement(null);
    setHoldReveal(null);
    setVisitorWaitMs(0);
  };

  if (!visitor) {
    return null;
  }

  const portraitAsset = getVisitorAsset(visitor);
  const isCorrupted = (dayIndex >= 4 || (gameMode === "endless" && endlessRound >= 4)) && resident && !decryptedFiles.includes(resident.id);

  // Daytime Preparation Screen Render Phase
  if (gamePhase === "prep") {
    const nextNight = currentNight;
    const repairResident = getResident(repairTarget ?? undefined);
    const archiveRepairActive = dayIndex >= 4 || (gameMode === "endless" && endlessRound >= 4);
    return (
      <main className="registry-shell registry-shell--prep registry-animation--prep-open">
        <section className="registry-hero">
          <img className="registry-story-scene" src={storyScene} alt="" aria-hidden="true" />
          <div className="registry-hero__content">
            <span>Moonshadow Apartments</span>
            <h1>Daytime Prep Desk</h1>
            <p>Daytime preparation shift. Read briefings, calibrate your equipment, and restore corrupted sectors before curfew begins.</p>
          </div>
        </section>

        <section className="registry-dashboard" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <header className="registry-topbar" style={{ display: "block", textAlign: "center", borderBottom: "1px solid rgba(237, 194, 112, 0.28)" }}>
            <h2>Shift Briefing: {nextNight.title}</h2>
            <p style={{ color: "#eedcb2", fontStyle: "italic", fontSize: "0.9rem", marginTop: "4px" }}>"{nextNight.subtitle}"</p>
          </header>

          {history.length === 0 ? (
            <article className="registry-prep-mode" aria-label="Game mode selection">
              <header>
                <span>Shift contract</span>
                <h3>Select Registry Mode</h3>
              </header>
              <div>
                {[
                  ["story", "Seven-Night Story", "Authored escalation, daytime repair, upgrades, and four endings."],
                  ["challenge", "Challenge: Blackout", "Seven nights with severe tool limits and more frequent equipment failures."],
                  ["endless", "Endless Shift", "Eight-case rounds loop forever while threat and pressure continue rising."],
                ].map(([id, name, description]) => (
                  <button
                    aria-pressed={gameMode === id}
                    key={id}
                    onClick={() => {
                      const nextMode = id as GameMode;
                      setGameMode(nextMode);
                      setResourcePool(getResourcePool(nextMode, selectedPerk, ownedUpgrades));
                    }}
                    type="button"
                  >
                    <strong>{name}</strong>
                    <span>{description}</span>
                  </button>
                ))}
              </div>
            </article>
          ) : null}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", padding: "18px 0" }}>
            <article className="registry-paper registry-prep-card" style={{ padding: "16px", minHeight: "220px" }}>
              <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, color: "#eedcb2" }}>Tonight's Curfew Rules</h4>
              </header>
              <ol className="registry-rules" style={{ paddingLeft: "20px", margin: 0 }}>
                {nextNight.rules.map((rule) => (
                  <li key={rule} style={{ marginBottom: "6px", fontSize: "0.85rem" }}>{rule}</li>
                ))}
              </ol>
            </article>

            <article className="registry-paper registry-prep-card" style={{ padding: "16px", minHeight: "220px" }}>
              <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, color: "#eedcb2" }}>Select Desk Perk</h4>
              </header>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>Choose one device bypass perk for tonight's shift:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  ["coffee", "fa-mug-hot", "Sanity Coffee", "Restores +30 Stability between shifts."],
                  ["booster", "fa-bolt", "ID Laser Booster", "Protects ID Scanner from malfunctions."],
                  ["override", "fa-lock-open", "Manual Lock Override", "Protects Door Lock from jamming."],
                  ["repairkit", "fa-toolbox", "Switchboard Kit", "Protects Phone Line from dropouts."],
                ].map(([id, icon, name, desc]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedPerk(id as Exclude<typeof selectedPerk, null>)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      background: selectedPerk === id ? "rgba(237, 194, 112, 0.18)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${selectedPerk === id ? "#edc270" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "6px",
                      color: "white",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <i className={`fa-solid ${icon}`} style={{ color: selectedPerk === id ? "#edc270" : "rgba(255,255,255,0.4)", width: "16px", textAlign: "center" }} />
                    <div>
                      <strong style={{ display: "block", fontSize: "0.85rem" }}>{name}</strong>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </article>
          </div>

          {history.length > 0 ? (
            <article className="registry-paper registry-prep-card registry-upgrade-panel">
              <header>
                <div>
                  <span>Permanent office improvements</span>
                  <h4>Upgrade Bench</h4>
                </div>
                <strong>{upgradeCredits} credits</strong>
              </header>
              <div>
                {officeUpgrades.map((upgrade) => {
                  const owned = ownedUpgrades.includes(upgrade.id);
                  return (
                    <button
                      disabled={owned || upgradeCredits < 1}
                      key={upgrade.id}
                      onClick={() => {
                        setOwnedUpgrades((upgrades) => addUnique(upgrades, upgrade.id));
                        setUpgradeCredits((credits) => Math.max(0, credits - 1));
                      }}
                      type="button"
                    >
                      <strong>{upgrade.name}</strong>
                      <span>{upgrade.benefit}</span>
                      <small>Tradeoff: {upgrade.sideEffect}</small>
                      <em>{owned ? "Installed" : "Cost: 1 credit"}</em>
                    </button>
                  );
                })}
              </div>
            </article>
          ) : null}

          {archiveRepairActive ? (
            <article className="registry-paper registry-prep-card" style={{ padding: "16px", marginBottom: "18px" }}>
              <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ margin: 0 }}>Archive Restoration ({prepPoints} Points Left)</h4>
                <span style={{ fontSize: "0.8rem" }}>Restored: {decryptedFiles.length} / {residents.length}</span>
              </header>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {residents.map((r) => {
                  const isDone = decryptedFiles.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      disabled={isDone || prepPoints < 40}
                      onClick={() => {
                        setRepairTarget(r.id);
                        setRepairSources([]);
                      }}
                      style={{
                        padding: "8px",
                        background: isDone ? "rgba(34, 201, 214, 0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isDone ? "#22c9d6" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "4px",
                        color: isDone ? "#22c9d6" : "white",
                        fontSize: "0.8rem",
                        cursor: isDone ? "default" : prepPoints >= 40 ? "pointer" : "not-allowed"
                      }}
                    >
                      <i className={`fa-solid ${isDone ? "fa-circle-check" : "fa-unlock-keyhole"}`} style={{ marginRight: "6px" }} />
                      <span>{r.name} {isDone ? "" : "(restore -40)"}</span>
                    </button>
                  );
                })}
              </div>
            </article>
          ) : null}

          <div style={{ textAlign: "center", padding: "10px 0 18px" }}>
            <button
              type="button"
              onClick={() => {
                setResourcePool(getResourcePool(gameMode, selectedPerk, ownedUpgrades));
                setFailures((currentFailures) => ({
                  ...currentFailures,
                  phone: selectedPerk === "repairkit" ? false : currentFailures.phone,
                  scanner: selectedPerk === "booster" ? false : currentFailures.scanner,
                  lock: selectedPerk === "override" ? false : currentFailures.lock,
                }));
                if (ownedUpgrades.includes("hotline")) setSanity((value) => clamp(value - 3));
                if (ownedUpgrades.includes("camera-buffer")) setReputation((value) => clamp(value - 2));
                if (ownedUpgrades.includes("scanner-capacitor")) setSafety((value) => clamp(value - 2));
                setGamePhase("shift");
              }}
              style={{
                padding: "12px 32px",
                background: "radial-gradient(circle, #edc270 0%, #a47b32 100%)",
                border: "none",
                borderRadius: "6px",
                color: "#121820",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 16px rgba(237, 194, 112, 0.3)",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              Start Night Shift
            </button>
          </div>
        </section>

        {repairResident ? (
          <div className="registry-modal registry-repair-modal" role="dialog" aria-modal="true" aria-labelledby="archive-repair-title">
            <div className="registry-modal__card">
              <span>Polluted archive sector</span>
              <h2 id="archive-repair-title">Restore {repairResident.name}</h2>
              <p>Drag or select at least two historical sources into the restoration tray. Recorded facts can be polluted; independent memory sources rebuild the file.</p>
              <div className="registry-repair-sources">
                {[
                  ["old-photo", "Old photograph", `Shows ${repairResident.feature}.`],
                  ["voice-reel", "Voice reel", `Preserves the greeting: ${repairResident.greeting}.`],
                  ["paper-note", "Paper habit note", repairResident.habit],
                ].map(([id, label, detail]) => (
                  <button
                    draggable
                    key={id}
                    onClick={() => setRepairSources((sources) => addUnique(sources, id))}
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", id)}
                    type="button"
                  >
                    <strong>{label}</strong>
                    <span>{detail}</span>
                  </button>
                ))}
              </div>
              <div
                className="registry-repair-dropzone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const source = event.dataTransfer.getData("text/plain");
                  if (source) setRepairSources((sources) => addUnique(sources, source));
                }}
              >
                <strong>Restoration tray</strong>
                <span>{repairSources.length}/2 independent sources placed</span>
                <div>
                  {repairSources.map((source) => (
                    <em key={source}>{source.replace("-", " ")}</em>
                  ))}
                </div>
              </div>
              <button
                disabled={repairSources.length < 2}
                onClick={() => {
                  setDecryptedFiles((files) => addUnique(files, repairResident.id));
                  setPrepPoints((points) => Math.max(0, points - 40));
                  setRepairTarget(null);
                  setRepairSources([]);
                }}
                type="button"
              >
                Restore True Record
              </button>
              <button
                className="registry-modal__secondary"
                onClick={() => {
                  setRepairTarget(null);
                  setRepairSources([]);
                }}
                type="button"
              >
                Close Archive
              </button>
            </div>
          </div>
        ) : null}
      </main>
    );
  }

  return (
    <main
      className={`registry-shell ${pressure > 48 ? "registry-shell--strained" : ""} registry-shell--mood-${visitorMood} ${
        feedback ? `registry-shell--decision-${feedback.decision}` : ""
      } ${feedback && !feedback.correct ? "registry-shell--bad-call" : ""} ${
        screenEffect ? `registry-effect--${screenEffect}` : ""
      } ${queuePressure >= 60 ? "registry-shell--queue-high" : ""} ${
        learningImpostorActive ? "registry-shell--duplicate-active" : ""
      } registry-shell--mode-${gameMode}`}
    >
      <section className="registry-hero">
        <a className="registry-design-link" href="/design-system">
          Design system
        </a>
        <div className="registry-hero__backdrop" aria-hidden="true">
          <img className="registry-story-scene" src={storyScene} alt="" />
          <span className="registry-window registry-window--one" />
          <span className="registry-window registry-window--two" />
          <span className="registry-window registry-window--three" />
          <span className="registry-rain" />
          <span className="registry-hallway-shadow" />
          <span className="registry-fluorescent-glow" />
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
            <span>{gameMode} / case type</span>
            <strong>{t(`visitor.${visitorType}`)}</strong>
          </div>
          <div className="registry-shift">
            <span>Visitor {visitorIndex + 1}/{dayVisitors.length}</span>
            <strong>{visitor.arrival}</strong>
          </div>
          <div className="registry-shift">
            <span>Queue pressure</span>
            <strong>{queuePressure}% / {Math.floor(visitorWaitMs / 1000)}s</strong>
          </div>
          <div className="registry-score">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <button type="button" onClick={toggleLanguage} style={{ padding: "0.25rem 0.5rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", color: "white", cursor: "pointer", fontSize: "0.875rem" }}>
            {t("ui.toggleLang")}
          </button>
        </header>

        <div className="registry-stats">
          <StatMeter label="Safety" value={safety} tone="safe" />
          <StatMeter label="Reputation" value={reputation} tone="trust" />
          <StatMeter label="Stability" value={sanity} tone="mind" />
        </div>

        <div className="registry-resource-strip" aria-label="Shift tool resources">
          {(Object.entries(resourcePool) as [ToolName, number][]).map(([tool, remaining]) => (
            <span data-empty={remaining === 0} key={tool}>
              <i className={`fa-solid ${tool === "phone" ? "fa-phone" : tool === "scanner" ? "fa-id-card" : tool === "camera" ? "fa-video" : "fa-comments"}`} />
              <strong>{tool}</strong>
              <em>{remaining} left</em>
            </span>
          ))}
          {mostUsedTool && learningImpostorActive ? (
            <span className="registry-learning-warning">
              <i className="fa-solid fa-eye" />
              <strong>Pattern learned</strong>
              <em>{mostUsedTool} checks may be copied</em>
            </span>
          ) : null}
        </div>

        <div className="registry-grid registry-grid--desk">
          <section className="registry-panel registry-arrival">
            <div className="registry-panel__title">
              <span>At the door / {t(`visitor.${visitorType}`)}</span>
              <h3>{visitor.name}</h3>
            </div>
            {visitor.specialEvent ? (
              <div className="registry-special-event">
                <strong>{visitor.specialEvent.label}</strong>
                <span>{visitor.specialEvent.detail}</span>
              </div>
            ) : null}
            <div
              className={`registry-portrait registry-portrait--${visitor.portrait} registry-portrait--${visitorMood} ${
                activeTool === "scanner" ? "registry-scanline" : ""
              } ${visitor.isMirror ? "registry-portrait--duplicate" : ""} ${
                visitor.isMirror && sanity < 55 ? "registry-portrait--eye-glitch" : ""
              }`}
              aria-label={`${visitor.name} portrait`}
            >
              <img src={portraitAsset.image} alt={`${portraitAsset.name} asset card`} />
            </div>
            <dl className="registry-facts">
              <div><dt>Type</dt><dd>{t(`visitor.${visitorType}`)}</dd></div>
              <div><dt>Room</dt><dd>{visitor.room}</dd></div>
              <div><dt>Role</dt><dd>{visitor.job}</dd></div>
              <div><dt>ID</dt><dd>{visitor.idCode}</dd></div>
              <div><dt>Reason</dt><dd>{visitor.reason}</dd></div>
              <div><dt>Badge</dt><dd>{visitor.badge}</dd></div>
              {visitor.sourceResidentId ? (
                <div><dt>Record status</dt><dd>{residentStatuses[visitor.sourceResidentId]}</dd></div>
              ) : null}
            </dl>
          </section>

          <section className="registry-panel registry-desk" aria-label="Desk verification workspace">
            <div className="registry-panel__title">
              <span>Desk workspace</span>
              <h3>Manual Verification</h3>
            </div>
            <div className="registry-desk-tabs" role="tablist" aria-label="Desk sources">
              {[
                ["documents", "ui.desk.documents", "fa-folder-open"],
                ["archive", "ui.desk.archive", "fa-book"],
                ["notice", "ui.desk.notice", "fa-thumbtack"],
                ["ledger", "ui.desk.ledger", "fa-list-check"],
              ].map(([view, labelKey, icon]) => (
                <button
                  aria-selected={deskView === view}
                  key={view}
                  onClick={() => selectDeskView(view as DeskView)}
                  type="button"
                >
                  <i className={`fa-solid ${icon}`} aria-hidden="true" />
                  <span>{t(labelKey as string)}</span>
                </button>
              ))}
              {deskView === "cctv" && (
                <button aria-selected={true} type="button">
                  <i className="fa-solid fa-video" aria-hidden="true" style={{ color: "#22c9d6" }} />
                  <span style={{ color: "#22c9d6" }}>CCTV Monitor</span>
                </button>
              )}
              {deskView === "phone" && (
                <button aria-selected={true} type="button">
                  <i className="fa-solid fa-phone-flip" aria-hidden="true" style={{ color: "#edc270" }} />
                  <span style={{ color: "#edc270" }}>Switchboard</span>
                </button>
              )}
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
                          setDocumentMotionKey((key) => key + 1);
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
                    <article className="registry-paper registry-paper--document-enter" key={`${selectedDocument.id}-${documentMotionKey}`}>
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
                    <>
                      <dl className="registry-facts registry-facts--paper">
                        <div><dt>Room</dt><dd>{resident.room}</dd></div>
                        <div><dt>Job</dt><dd>{resident.job}</dd></div>
                        <div><dt>ID</dt><dd>{resident.idCode}</dd></div>
                        <div><dt>Feature</dt><dd>{isCorrupted ? "[CORRUPTED - SECTOR GLITCH]" : resident.feature}</dd></div>
                        <div><dt>Habit</dt><dd>{isCorrupted ? "[CORRUPTED - SECTOR GLITCH]" : resident.habit}</dd></div>
                        <div><dt>Never</dt><dd>{isCorrupted ? "[CORRUPTED - SECTOR GLITCH]" : resident.forbidden}</dd></div>
                        <div><dt>Greeting</dt><dd>{resident.greeting}</dd></div>
                      </dl>
                      <div className={`registry-relationship-network ${isCorrupted ? "is-corrupted" : ""}`}>
                        <strong>Resident relationship cross-check</strong>
                        {(residentRelationships[resident.id] ?? []).map((relationship) => {
                          const linkedResident = getResident(relationship.residentId);
                          const linkedStatus = residentStatuses[relationship.residentId] ?? "active";
                          return (
                            <span key={`${resident.id}-${relationship.residentId}`}>
                              <b>{linkedResident?.name ?? relationship.residentId}</b>
                              <em>{isCorrupted ? "LINK POLLUTED - restore during daytime prep" : relationship.detail}</em>
                              <small data-status={linkedStatus}>{linkedStatus}</small>
                            </span>
                          );
                        })}
                      </div>
                      {isCorrupted ? (
                        <p className="registry-corruption-warning">
                          Historical sources are required. This file can only be repaired during daytime prep.
                        </p>
                      ) : null}
                    </>
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
                          <span>{t(`checklist.${item.key}`)}</span>
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
                            title={t(`evidence.${option.key}.detail`)}
                            type="button"
                          >
                            <i className={`fa-solid ${selectedEvidence.includes(option.key) ? "fa-circle-check" : "fa-circle"}`} aria-hidden="true" />
                            <span>{t(`evidence.${option.key}`)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              ) : null}

              {/* CCTV Monitor Sub-Panel */}
              {deskView === "cctv" ? (
                <article className="registry-paper registry-paper--cctv-board" style={{ display: "block" }}>
                  <header>
                    <span>cctv screen</span>
                    <h4>Lobby CCTV Terminal (CH{cctvChannel})</h4>
                  </header>
                  <div style={{ display: "flex", gap: "12px", padding: "12px 0" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "160px" }}>
                      {cctvSceneAssets.map((scene) => (
                        <button
                          disabled={resourcePool.camera <= 0 && cctvChannel !== scene.channel}
                          key={scene.channel}
                          type="button"
                          onClick={() => {
                            if (cctvChannel === scene.channel) return;
                            if (resourcePool.camera <= 0) {
                              setToolLog("No CCTV review time remains for this shift.");
                              return;
                            }
                            setCctvChannel(scene.channel);
                            setResourcePool((resources) => ({ ...resources, camera: Math.max(0, resources.camera - 1) }));
                            setTotalToolUsage((usage) => ({ ...usage, camera: usage.camera + 1 }));
                            setCheckedItems((items) => addUnique(items, "appearance"));
                            const isCctvTrap = learningImpostorActive && mostUsedTool === "camera";
                            const isCctvAnomaly = visitor.isMirror && !isCctvTrap && (
                              scene.channel === 2 ||
                              (scene.channel === 3 && (visitor.name === "Owen Xu" || visitor.name === "Han Dong")) ||
                              (scene.channel === 4 && (visitor.name === "Li Mei" || visitor.name === "Ke Ren"))
                            );
                            if (isCctvAnomaly) {
                              setSelectedEvidence((items) => addUnique(items, "appearance"));
                            }
                          }}
                          style={{
                            padding: "8px",
                            background: cctvChannel === scene.channel ? "rgba(34, 201, 214, 0.15)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${cctvChannel === scene.channel ? "#22c9d6" : "rgba(255,255,255,0.1)"}`,
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "0.75rem",
                            textAlign: "left",
                            cursor: "pointer"
                          }}
                        >
                          <i className={`fa-solid ${scene.channel === 1 ? "fa-user" : scene.channel === 2 ? "fa-circle-half-stroke" : scene.channel === 3 ? "fa-box-open" : "fa-elevator"}`} style={{ marginRight: "6px", color: cctvChannel === scene.channel ? "#22c9d6" : "rgba(255,255,255,0.4)" }} />
                          <span>CH{scene.channel}: {scene.label}</span>
                        </button>
                      ))}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        background: "#050b0f",
                        border: "3px solid #1a2f3a",
                        borderRadius: "8px",
                        padding: "16px",
                        minHeight: "180px",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                          backgroundSize: "100% 4px, 6px 100%",
                          pointerEvents: "none"
                        }}
                      />
                      <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#22c9d6", display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid rgba(34, 201, 214, 0.3)", paddingBottom: "4px" }}>
                        <span>CAMERA FEED: CH{cctvChannel}</span>
                        <span>LIVE - NIGHT {dayIndex + 1}</span>
                      </div>

                      <img
                        className="registry-cctv-feed"
                        key={`${visitor.id}-${cctvChannel}`}
                        src={cctvSceneAssets[cctvChannel - 1].image}
                        alt={`${cctvSceneAssets[cctvChannel - 1].label} surveillance scene`}
                      />

                      <p style={{ margin: 0, color: "#9cd6db", fontSize: "0.85rem", lineHeight: "1.4", minHeight: "100px" }}>
                        {(() => {
                          const isCctvTrap = learningImpostorActive && mostUsedTool === "camera";

                          if (cctvChannel === 1) {
                            return isCctvTrap
                              ? `Front Gate view shows: ${visitor.name}. Features align with archive photo. No visible anomalies.`
                              : `Front Gate view shows: ${visitor.name}. Eyes: ${visitor.eyes}, Hair: ${visitor.hair}, Special details: ${visitor.feature}.`;
                          }
                          if (cctvChannel === 2) {
                            if (visitor.isMirror) {
                              return isCctvTrap
                                ? "Corridor camera shows the subject standing still. Shadow casts naturally on the floor."
                                : "Corridor camera shows: Subject's shadow points directly toward the light source. WARNING: Shadow angle violates physical laws.";
                            }
                            return "Corridor camera shows: Subject casts a natural shadow toward the stairwell.";
                          }
                          if (cctvChannel === 3) {
                            if (visitor.name === "Owen Xu" && visitor.isMirror) {
                              return isCctvTrap
                                ? "Desk Counter camera shows a violin case on the ledge. Latch details appear standard."
                                : "Desk Counter camera shows a violin case on the ledge. Latch is brass (violates silver file notes).";
                            }
                            if (visitor.name === "Sun Hao") {
                              return "Desk Counter camera shows a small parcel wrapped in grease paper on the counter.";
                            }
                            if (visitor.name === "Han Dong" && visitor.isMirror) {
                              return isCctvTrap
                                ? "Desk Counter camera shows a standard maintenance toolbox on the counter."
                                : "Desk Counter camera shows: The contractor's toolbox is slightly open. Inside is completely empty; no tools visible.";
                            }
                            if (visitor.name === "Zhao Jun") {
                              return "Desk Counter camera shows: Leather folder is placed flat on the counter desk.";
                            }
                            return "Desk Counter camera shows: Documents placed on the glass. Subject's posture is steady.";
                          }
                          if (cctvChannel === 4) {
                            if (visitor.name === "Li Mei" && visitor.isMirror) {
                              return isCctvTrap
                                ? "Elevator landing shows elevator is locked."
                                : "Elevator landing shows elevator call light is active and blinking (Li Mei never uses the elevator).";
                            }
                            if (visitor.name === "Ke Ren") {
                              return "Elevator landing: CCTV signal is flickering violently. Video frame loses sync for three frames.";
                            }
                            return "Elevator landing shows elevator is empty and stationary on ground floor.";
                          }
                          return "Feed loading...";
                        })()}
                      </p>
                    </div>
                  </div>
                </article>
              ) : null}

              {/* Switchboard Sub-Panel */}
              {deskView === "phone" ? (
                <article className="registry-paper registry-paper--phone-board">
                  <header>
                    <span>Switchboard lines</span>
                    <h4>Plug-In Directory (Case: {Math.max(0, 3 - toolCounts.phone)} / Shift: {resourcePool.phone})</h4>
                  </header>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "12px 0" }}>
                    {[
                      { id: "room", label: `Room ${visitor.room} Line`, desc: "Dial occupant's room directly." },
                      { id: "management", label: "Management Office", desc: "Confirm work order or notice approvals." },
                      { id: "security", label: "Security Guard Desk", desc: "Consult building guard for advice." },
                      { id: "neighbor", label: "Neighboring Apartment", desc: "Cross-check neighbor observations." }
                    ].map((line) => {
                      const isCallLimit = toolCounts.phone >= 3 || resourcePool.phone <= 0;
                      return (
                        <button
                          key={line.id}
                          type="button"
                          disabled={isCallLimit || activeTool !== null}
                          onClick={() => {
                            if (feedback) return;
                            setToolCounts((counts) => ({ ...counts, phone: counts.phone + 1 }));
                            setResourcePool((resources) => ({ ...resources, phone: Math.max(0, resources.phone - 1) }));
                            const isPhoneTrap = learningImpostorActive && mostUsedTool === "phone";

                            let resultText = "";
                            if (line.id === "room") {
                              const residentStatus = visitor.sourceResidentId ? residentStatuses[visitor.sourceResidentId] : "active";
                              resultText = residentStatus === "replaced"
                                ? "The room answers with a perfectly copied voice, but a second receiver can be heard breathing on the same line."
                                : residentStatus === "stranded"
                                  ? "No one answers upstairs. The resident was previously turned away and never returned."
                                  : isPhoneTrap
                                ? "The receiver clicks. An identical voice to the visitor answers: 'Yes, that is me. I am expected, let me up.'"
                                : phoneLines[0]?.result ?? visitor.phone;
                            } else if (line.id === "management") {
                              resultText = phoneLines[1]?.result ?? "Management repeats: 'Check the guidelines. No exceptions.'";
                            } else if (line.id === "security") {
                              resultText = dayIndex === 6
                                ? "Zhou Qiming's line clicks. A low whisper warns: 'Do not sign in the duplicate Y. Xue. Check the back of your badge.'"
                                : "Zhou Qiming answers: 'I'm watching the stairwells. Match the shadow direction on camera.'";
                            } else {
                              resultText = "The line rings... A resident answers: 'I heard strange noises in the hallways, check their habits!'";
                            }

                            setTotalToolUsage((usage) => ({ ...usage, phone: usage.phone + 1 }));
                            setActiveTool("phone");
                            setToolLog("Establishing switchboard patch connection...");

                            setTimeout(() => {
                              setToolLog(`${line.label}: ${resultText}`);
                              setActiveTool(null);
                              setVisitorMood("nervous");
                              setCheckedItems((items) => addUnique(items, "phone"));
                              if (resultText.includes("already") || resultText.includes("contradicts") || resultText.includes("No relief")) {
                                setSelectedEvidence((items) => addUnique(addUnique(items, "phone"), "ledger"));
                              }
                              if (resultText.includes("screams") || resultText.includes("wet tapping") || resultText.includes("whispers")) {
                                setSanity((value) => clamp(value - 4));
                              }
                            }, 1200);
                          }}
                          style={{
                            padding: "10px",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "6px",
                            color: "white",
                            cursor: isCallLimit || activeTool !== null ? "not-allowed" : "pointer",
                            textAlign: "left"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <i className="fa-solid fa-plug" style={{ color: "#edc270" }} />
                            <strong style={{ fontSize: "0.85rem", color: "#edc270" }}>{line.label}</strong>
                          </div>
                          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{line.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </article>
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
            <button
              className={deskView === "phone" ? "is-active" : ""}
              type="button"
              onClick={() => {
                if (failures.phone) {
                  setPhoneWires({
                    left: ["Red", "Blue", "Yellow"],
                    right: ["Blue", "Yellow", "Red"].sort(() => Math.random() - 0.5),
                    connections: {},
                  });
                  setSelectedLeftWire(null);
                  setActiveRepairTool("phone");
                } else {
                  setDeskView("phone");
                  setToolLog("Switchboard dial tones active. Plug a jack line to call a contact.");
                }
              }}
            >
              <img src="/assets/midnight-registry/props/phone-receiver-dial.png" alt="" aria-hidden="true" />
              <span>{failures.phone ? "⚠️ Phone Error" : "Switchboard"}</span>
            </button>
            <button
              disabled={toolCounts.scanner >= 1 || activeTool !== null || resourcePool.scanner <= 0}
              className={activeTool === "scanner" ? "is-active" : ""}
              type="button"
              onClick={() => {
                if (failures.scanner) {
                  setScannerProgress(0);
                  setActiveRepairTool("scanner");
                } else {
                  setTotalToolUsage((usage) => ({ ...usage, scanner: usage.scanner + 1 }));
                  useTool("scanner");
                }
              }}
            >
              <img src="/assets/midnight-registry/props/id-scanner-device.png" alt="" aria-hidden="true" />
              <span>{failures.scanner ? "⚠️ Scanner Error" : t("ui.tools.scanner")}</span>
            </button>
            <button
              className={deskView === "cctv" ? "is-active" : ""}
              type="button"
              onClick={() => {
                if (failures.camera) {
                  setCctvFrequency(50.0);
                  setCctvTargetFrequency(parseFloat((60 + Math.random() * 30).toFixed(1)));
                  setActiveRepairTool("camera");
                } else {
                  setDeskView("cctv");
                  setToolLog("CCTV terminal feed loaded. Select channel CH1-CH4 to check security angles.");
                }
              }}
            >
              <img src="/assets/midnight-registry/props/cctv-monitor.png" alt="" aria-hidden="true" />
              <span>{failures.camera ? "⚠️ CCTV Error" : t("ui.tools.camera")}</span>
            </button>
          </div>
          <div className="registry-tool-log">
            <TypewriterText text={toolLog} />
            <span>{checkedItems.length}/{checklistItems.length} sources checked / {selectedEvidence.length} evidence reasons marked</span>
          </div>

          {/* V2 Redesigned Question Index Cards */}
          <div className="registry-question-board" aria-label="Question prompts">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong>Interview Questions Left:</strong>
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: toolCounts.question >= n ? "rgba(255,255,255,0.2)" : "#22c9d6",
                      boxShadow: toolCounts.question >= n ? "none" : "0 0 8px #22c9d6"
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {questionOptions.map((question) => {
                const disabled = toolCounts.question >= 3 || feedback !== null || resourcePool.question <= 0;
                return (
                  <button
                    disabled={disabled}
                    key={question.category}
                    onClick={() => {
                      setTotalToolUsage((usage) => ({ ...usage, question: usage.question + 1 }));
                      askQuestion(question);
                    }}
                    type="button"
                    style={{
                      background: "linear-gradient(135deg, #1d2630 0%, #111822 100%)",
                      border: "1px solid rgba(237, 194, 112, 0.2)",
                      borderRadius: "6px",
                      padding: "10px",
                      textAlign: "left",
                      color: "white",
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.4 : 1,
                      position: "relative",
                      minHeight: "110px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.2s"
                    }}
                    className="registry-question-card"
                  >
                    <div style={{ position: "absolute", top: "-4px", left: "12px", width: "24px", height: "10px", background: "rgba(237,194,112,0.15)", transform: "rotate(-5deg)", border: "1px solid rgba(237,194,112,0.2)" }} />
                    <span style={{ fontSize: "0.8rem", color: "#eedcb2", fontWeight: "bold", display: "block", marginTop: "4px" }}>{question.prompt}</span>
                    <span style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#22c9d6", alignSelf: "flex-end", letterSpacing: "1px" }}>{question.category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="registry-decisions">
          {/* Clerk Duplicate special climax Hidden Ending trigger */}
          {visitor.room === "000" && sanity >= 60 && safety >= 75 && reputation >= 75 && selectedEvidence.length >= 3 && (
            <button
              className="registry-decision"
              style={{
                gridColumn: "span 4",
                background: "linear-gradient(180deg, #991c20 0%, #ff4b4b 100%)",
                border: "2px solid #ff7b7b",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "12px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              disabled={screenEffect !== null || feedback !== null || holdReveal !== null}
              type="button"
              onClick={() => {
                setScreenEffect("security");
                setVisitorMood("revealed");
                setTimeout(() => {
                  setEnding("Hidden Ending: You gather the evidence reasons matching the registry's glitch. Using the security alarm as cover, you burn the registry ledger. The door remains sealed, your replacement Y. Xue is erased, and your own name disappears from Moonshadow's history.");
                }, 750);
              }}
            >
              <i className="fa-solid fa-fire" style={{ marginRight: "8px" }} />
              <span>Burn the Registry Ledger (Destroy Record)</span>
            </button>
          )}

          <button className="registry-decision registry-decision--allow" disabled={screenEffect !== null || feedback !== null || holdReveal !== null} type="button" onClick={() => decide("allow")}>
            <img src="/assets/midnight-registry/props/approve-stamp.png" alt="" aria-hidden="true" />
            <span>{failures.lock ? "⚠️ Lock stuck" : t("decision.allow")}</span>
          </button>
          <button className="registry-decision registry-decision--reject" disabled={screenEffect !== null || feedback !== null || holdReveal !== null} type="button" onClick={() => decide("reject")}>
            <img src="/assets/midnight-registry/props/deny-stamp.png" alt="" aria-hidden="true" />
            <span>{failures.lock ? "⚠️ Lock stuck" : t("decision.reject")}</span>
          </button>
          <button className="registry-decision registry-decision--security" disabled={screenEffect !== null || feedback !== null || holdReveal !== null} type="button" onClick={() => decide("security")}>
            <img src="/assets/midnight-registry/props/security-call-stamp.png" alt="" aria-hidden="true" />
            <span>{failures.lock ? "⚠️ Lock stuck" : t("decision.security")}</span>
          </button>
          <button className="registry-decision registry-decision--wait" disabled={screenEffect !== null || feedback !== null || holdReveal !== null} type="button" onClick={() => decide("wait")}>
            <img src="/assets/midnight-registry/props/wait-token.png" alt="" aria-hidden="true" />
            <span>{failures.lock ? "⚠️ Lock stuck" : t("decision.wait")}</span>
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

      {holdReveal ? (
        <div className="registry-modal registry-hold-modal" role="dialog" aria-modal="true" aria-labelledby="registry-hold-title">
          <div className="registry-modal__card">
            <span>Hold investigation</span>
            <h2 id="registry-hold-title">{holdReveal.phase === "waiting" ? "The Clock Advances" : "A Second Source Responds"}</h2>
            <div className={`registry-hold-clock is-${holdReveal.phase}`}>
              <i className="fa-solid fa-hourglass-half" />
              <strong>{holdReveal.phase === "waiting" ? "WAITING" : "CALLBACK RECEIVED"}</strong>
            </div>
            <p>{holdReveal.text}</p>
            {holdReveal.phase === "revealed" ? (
              <>
                <div className="registry-hold-evidence">
                  {holdReveal.evidence.map((evidence) => (
                    <span key={evidence}>{evidence}</span>
                  ))}
                </div>
                <button onClick={recordHoldDecision} type="button">
                  Record Hold Result
                </button>
              </>
            ) : (
              <div className="registry-hold-progress"><i /></div>
            )}
          </div>
        </div>
      ) : null}

      {nightSettlement ? (
        <div className="registry-modal registry-settlement-modal" role="dialog" aria-modal="true" aria-labelledby="registry-settlement-title">
          <div className="registry-modal__card">
            <span>Nightly settlement</span>
            <h2 id="registry-settlement-title">Night {nightSettlement.night} Recorded</h2>
            <div className="registry-ending-stats">
              <strong>Correct {nightSettlement.correct}/{nightSettlement.total}</strong>
              <strong>Replaced {nightSettlement.replaced}</strong>
              <strong>Upgrade credits +{nightSettlement.credits}</strong>
              <strong>Stability {sanity}</strong>
            </div>
            <p>The ledger dries. Daylight gives you one preparation window before the next set of records arrives.</p>
            <button onClick={continueAfterSettlement} type="button">
              <i className="fa-solid fa-sun" />
              <span>{gameMode === "endless" ? "Prepare Next Endless Round" : "Open Daytime Prep"}</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Repair Mini-game Modal */}
      {activeRepairTool ? (
        <div className="registry-modal" role="dialog" aria-modal="true" style={{ zIndex: 99 }}>
          <div className="registry-modal__card" style={{ maxWidth: "480px", border: "2px solid #ff7b7b" }}>
            <span style={{ color: "#ff7b7b", fontWeight: "bold" }}>⚠️ EQUIPMENT MALFUNCTION</span>
            <h2>Repair: {activeRepairTool.toUpperCase()}</h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
              {activeRepairTool === "phone" && "Match and connect the switchboard wire lines on left and right."}
              {activeRepairTool === "camera" && "Tune frequency slider close to target channel range."}
              {activeRepairTool === "scanner" && "Press calibrate when laser is inside the green sweet spot."}
              {activeRepairTool === "lock" && "Input the security backup bypass pin code."}
            </p>

            {/* Phone Repair: Wires match */}
            {activeRepairTool === "phone" && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "18px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <strong>Switch Slots</strong>
                  {phoneWires.left.map((color) => {
                    const connected = phoneWires.connections[color];
                    return (
                      <button
                        key={`left-${color}`}
                        type="button"
                        onClick={() => handleLeftWireClick(color)}
                        disabled={!!connected}
                        style={{
                          padding: "8px 16px",
                          background: connected ? "rgba(255,255,255,0.05)" : selectedLeftWire === color ? color.toLowerCase() : "rgba(255,255,255,0.1)",
                          border: `1px solid ${selectedLeftWire === color ? "white" : "rgba(255,255,255,0.2)"}`,
                          borderRadius: "4px",
                          color: connected ? "rgba(255,255,255,0.3)" : "white",
                          fontSize: "0.8rem",
                          cursor: connected ? "default" : "pointer"
                        }}
                      >
                        {color} Plug {connected ? "🔌" : ""}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <strong>Terminal Jacks</strong>
                  {phoneWires.right.map((color) => {
                    const isConnected = Object.values(phoneWires.connections).includes(color);
                    return (
                      <button
                        key={`right-${color}`}
                        type="button"
                        onClick={() => handleRightWireClick(color)}
                        disabled={isConnected || !selectedLeftWire}
                        style={{
                          padding: "8px 16px",
                          background: isConnected ? color.toLowerCase() : "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "4px",
                          color: isConnected ? "black" : "white",
                          fontSize: "0.8rem",
                          cursor: isConnected || !selectedLeftWire ? "default" : "pointer"
                        }}
                      >
                        Jack {color} {isConnected ? "✓" : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CCTV Repair: Frequency tuner */}
            {activeRepairTool === "camera" && (
              <div style={{ padding: "18px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "16px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.9rem" }}>
                  <span>Current: <strong>{cctvFrequency.toFixed(1)} MHz</strong></span>
                  <span style={{ color: "#22c9d6" }}>Target: <strong>{cctvTargetFrequency.toFixed(1)} MHz</strong></span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.1"
                  value={cctvFrequency}
                  onChange={(e) => setCctvFrequency(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#edc270", marginBottom: "16px" }}
                />
                <button
                  type="button"
                  onClick={tuneCctv}
                  style={{
                    padding: "8px 24px",
                    background: "#edc270",
                    border: "none",
                    borderRadius: "4px",
                    color: "black",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Tune Channel
                </button>
              </div>
            )}

            {/* ID Scanner Repair: Calibration */}
            {activeRepairTool === "scanner" && (
              <div style={{ padding: "18px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "16px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                  <span>Beam: <strong>{scannerProgress}%</strong></span>
                  <span style={{ color: "#22c9d6" }}>Target Sweet Spot: <strong>45-55%</strong></span>
                </div>
                <div style={{ height: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden", position: "relative", marginBottom: "16px" }}>
                  <div style={{ position: "absolute", left: "45%", width: "10%", top: 0, bottom: 0, background: "rgba(34, 201, 214, 0.4)" }} />
                  <div style={{ width: `${scannerProgress}%`, height: "100%", background: "linear-gradient(90deg, #ff7b7b, #edc270)" }} />
                </div>
                <button
                  type="button"
                  onClick={calibrateScanner}
                  style={{
                    padding: "8px 24px",
                    background: "#edc270",
                    border: "none",
                    borderRadius: "4px",
                    color: "black",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Calibrate Beam
                </button>
              </div>
            )}

            {/* Lock Repair: Keypad input */}
            {activeRepairTool === "lock" && (
              <div style={{ padding: "18px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: "0.85rem", color: "#ff7b7b", border: "1px dashed #ff7b7b", padding: "4px 12px", borderRadius: "4px", marginBottom: "12px", fontFamily: "monospace" }}>
                  STICKY NOTE BACKUP CODE: <strong>{lockTargetCode}</strong>
                </div>
                <div style={{ fontSize: "1.5rem", letterSpacing: "4px", background: "#050b0f", border: "1px solid #1a2f3a", borderRadius: "4px", width: "160px", textAlign: "center", padding: "6px 0", marginBottom: "12px", color: "#ff7b7b", minHeight: "36px" }}>
                  {lockSequence || "----"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", width: "160px" }}>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => pressLockKey(n)}
                      style={{ padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "white", cursor: "pointer" }}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLockSequence("")}
                    style={{ padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#ff7b7b", cursor: "pointer" }}
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => pressLockKey("0")}
                    style={{ padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "white", cursor: "pointer" }}
                  >
                    0
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveRepairTool(null)}
              style={{
                width: "100%",
                padding: "8px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "4px",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "0.85rem",
                marginTop: "8px"
              }}
            >
              Cancel Repair (Keep Offline)
            </button>
          </div>
        </div>
      ) : null}

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
