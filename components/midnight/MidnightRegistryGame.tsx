"use client";

import { useEffect, useMemo, useState } from "react";
import { registryCharacterAssets } from "@/data/midnightRegistryDesignSystem";
import {
  chineseAppointments,
  chineseCctvLabels,
  chineseEntryLogs,
  chineseNights,
  getChineseEntrySignal,
  getChineseHoldInvestigation,
  getChineseName,
  getChineseResident,
  getChineseVisitor,
} from "@/lib/midnightRegistryZh";

import {
  Decision,
  ToolName,
  DeskView,
  ChecklistKey,
  EvidenceKey,
  VisitorType,
  VisitorMood,
  GameMode,
  ResidentStatus,
  OfficeUpgradeId,
  Resident,
  Visitor,
  HistoryEntry,
  PhoneLine,
  QuestionOption,
  checklistItems,
  evidenceOptions,
  emptyToolCounts,
  visitorTypeLabels,
  decisionLabels,
  residents,
  visitorsPerNight,
  nights,
  getResident,
  playableVisitors,
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
  return getChineseEntrySignal(visitor);
}

function getPhoneLines(visitor: Visitor): PhoneLine[] {
  const visitorType = getVisitorType(visitor);
  const displayVisitor = getChineseVisitor(visitor);
  const primaryLabel =
    visitorType === "emergency"
      ? "医院或雇主线路"
      : visitorType === "courier"
        ? "快递调度"
        : visitor.room === "Desk"
          ? "前台预约线路"
          : `${visitor.room} 室`;

  const lines: PhoneLine[] = [{ label: primaryLabel, result: displayVisitor.phone }];

  if (visitorType === "maintenance") {
    lines.push({
      label: "物业办公室",
      result: visitor.expectedAction === "allow"
        ? "物业确认今晚有一名蓝星维修工处理四楼配电箱，却拒绝回答这家公司何时注销。"
        : "物业查不到对应工单，随后用一个并非管理员的声音重复了你的问题。",
    });
  } else if (visitorType === "courier") {
    lines.push({
      label: "物业办公室",
      result: visitor.expectedAction === "wait"
        ? "物业确认包裹真实，但要求在 302 室回电前继续留置前台。"
        : "物业表示该快递员今晚没有上楼权限。",
    });
  } else if (visitorType === "emergency") {
    lines.push({
      label: "物业办公室",
      result: visitor.expectedAction === "allow"
        ? "物业确认紧急备注，并要求记录工牌号码。"
        : "物业警告：这名住户此刻已经在别处被登记。",
    });
  } else if (visitorType === "clerk") {
    lines.push({
      label: "安保岗亭",
      result: "周启明留下警告：如果门外的人长得像你，不要开门，也不要让他碰登记簿。",
    });
  } else {
    lines.push({
      label: "出入登记簿",
      result: getEntrySignal(visitor),
    });
  }

  return lines;
}

function getQuestionOptions(visitor: Visitor, resident?: Resident): QuestionOption[] {
  const visitorType = getVisitorType(visitor);
  const displayVisitor = getChineseVisitor(visitor);
  const displayResident = getChineseResident(resident?.id);
  const relationPrompt = resident
    ? `说出 ${resident.room} 室住户在前台的私人习惯。`
    : visitor.appointment
      ? "今晚是谁批准了这次来访？"
      : "谁能为你的来访作证？";

  return [
    {
      category: "identity",
      prompt: "报出姓名、房号和证件号码。",
      answer: `${displayVisitor.name} 声称前往 ${visitor.room}，证件号 ${visitor.idCode}。`,
      signal: visitor.expectedAction === "allow" || visitor.expectedAction === "wait"
        ? "说法暂时可能成立，但仍须与档案或预约表相符。"
        : "这些信息可能只是从纸上抄来的，必须核对关系、习惯和今夜出入簿。",
    },
    {
      category: "relation",
      prompt: relationPrompt,
      answer: resident
        ? `${displayVisitor.question} 档案备注：${displayResident?.greeting}。`
        : visitor.appointment
          ? `${displayVisitor.question} 预约目标：${visitor.appointment.room}，${displayVisitor.reason}。`
          : displayVisitor.question,
      signal: visitor.isMirror ? "回答暴露了习惯、关系或未记录记忆的矛盾。" : "回答提供了一条可交叉核验的信息。",
    },
    {
      category: "situation",
      prompt: "为什么这么晚才来？",
      answer: `${displayVisitor.reason}。到达时间 ${visitor.arrival}。`,
      signal: visitor.expectedAction === "wait"
        ? "当前时段要求留置调查，不能直接放行。"
        : "需要与今夜规则和出入记录比对。",
    },
    {
      category: "trap",
      prompt:
        visitorType === "resident"
          ? "回答一个只属于该住户的私人问题。"
          : visitorType === "maintenance"
            ? "完整复述工单内容和施工楼层。"
            : visitorType === "courier"
              ? "宵禁后谁可以接触包裹？"
              : "说出允许你进入的具体登记规则。",
      answer: displayVisitor.question,
      signal: visitor.isMirror
        ? "对方停顿太久，随后又把未记录信息回答得过于流畅。"
        : "回答至少与一个独立来源保持一致。",
    },
  ];
}

function getConsequences(visitor: Visitor, decision: Decision, correct: boolean, markedEvidenceCount: number) {
  if (correct) {
    if (decision === "allow") {
      return ["门灯转为绿色，登记簿接受了一个已经存在的人，没有改写任何身份。", "纸面、社会关系和生活细节共同支持这次放行。"];
    }

    if (decision === "wait") {
      return ["来客继续留在警戒线外，登记簿暂不把任何人写成正式住户。", "留置争取到了回拨、监控刷新和档案变化的调查时间。"];
    }

    if (decision === "security") {
      return ["卷帘门落下，安保在错误记录占据身份前封锁大厅。", "异常被登记为威胁，而不是住户。"];
    }

    return ["窗口熄暗，来客在登记簿承认其身份前离开。", "拒绝决定由多条互相印证的矛盾支持。"];
  }

  if (decision === "allow" && visitor.isMirror) {
    return ["冒名者抵达楼梯，并在登记簿中获得正式记录。", "明天的档案会从原住户身上抹去一条真实细节。"];
  }

  if (decision === "security" && !visitor.isMirror) {
    return ["错误报警降低了安保信任。", "真正危险出现时，响应会更慢。"];
  }

  if (visitor.expectedAction === "allow") {
    return ["真实住户被挡在门外。", "物业记录投诉，声誉下降。"];
  }

  if (visitor.expectedAction === "wait") {
    return ["本应继续调查的案例被强行定性。", "你失去了本可通过回拨、监控或档案变化获得的线索。"];
  }

  return markedEvidenceCount === 0
    ? ["决定没有任何证据链支持。", "登记簿把这次处理标记为草率。"]
    : ["勾选的证据无法支持最终印章。", "错误结果让台灯剧烈闪烁。"];
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
  const displayVisitor = getChineseVisitor(visitor);
  const documents = [
    {
      id: "claim",
      title: "窗口陈述",
      icon: "fa-comment",
      rows: [
        ["姓名", displayVisitor.name],
        ["房间", visitor.room],
        ["来访理由", displayVisitor.reason],
        ["到达时间", visitor.arrival],
      ],
    },
    {
      id: "identity",
      title: visitor.appointment ? "临时通行证" : "住户证件",
      icon: visitor.appointment ? "fa-address-card" : "fa-id-card",
      rows: [
        ["印刷姓名", displayVisitor.name],
        ["号码", visitor.idCode],
        ["身份", displayVisitor.job],
        ["工牌状态", displayVisitor.badge],
      ],
    },
    {
      id: "appearance",
      title: "前台观察记录",
      icon: "fa-eye",
      rows: [
        ["眼睛", displayVisitor.eyes],
        ["头发", displayVisitor.hair],
        ["显著特征", displayVisitor.feature],
        ["衣着", displayVisitor.clothing],
        ["声音", displayVisitor.voice],
        ["行为", displayVisitor.behavior],
      ],
    },
  ];

  if (visitor.appointment) {
    documents.push({
      id: "appointment",
      title: "预约单",
      icon: "fa-clipboard-list",
      rows: [
        ["姓名", getChineseName(visitor.appointment.name)],
        ["公司", visitor.appointment.company === "Blue Star Repair" ? "蓝星维修" : "月影快递"],
        ["目标", visitor.appointment.room === "Desk" ? "前台" : visitor.appointment.room],
        ["时间", visitor.appointment.time],
        ["任务", displayVisitor.reason],
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
  phase: "choosing" | "revealed";
  text: string;
  evidence: EvidenceKey[];
  route?: "callback" | "cctv" | "reaction";
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

export function MidnightRegistryGame() {
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
  const [toolLog, setToolLog] = useState("台灯在低鸣。每一次盖章都在把一个人写进现实。请先核对证件、关系、记忆和今夜规则。");
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
          title: `无尽值班 ${endlessRound + 1}`,
          subtitle: "登记簿永不打烊",
          briefing: "重复出现的身份会继承你过去的判断习惯，威胁也会不断上升。",
          rules: chineseNights[Math.min(endlessRound, chineseNights.length - 1)].rules,
        }
      : chineseNights[dayIndex];
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
  const displayVisitor = getChineseVisitor(visitor);
  const displayResident = getChineseResident(resident?.id);
  const visitorType = visitor ? getVisitorType(visitor) : "visitor";
  const phoneLines = useMemo(() => (visitor ? getPhoneLines(visitor) : []), [visitor]);
  const questionOptions = useMemo(() => (visitor ? getQuestionOptions(visitor, resident) : []), [visitor, resident]);
  const entryLogDay = Math.min(gameMode === "endless" ? endlessRound + 1 : dayIndex + 1, 7);
  const entryLogs = chineseEntryLogs[entryLogDay] ?? [];
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
    setToolLog("台灯在低鸣。每一次盖章都在把一个人写进现实。请先核对证件、关系、记忆和今夜规则。");
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
      setToolLog(tool === "phone" ? "交换机拒绝为这名来客继续接线。" : tool === "question" ? "来客拒绝回答更多问题。" : "这项检查已经记录在表单上。");
      return;
    }
    if (resourcePool[tool] <= 0) {
      setToolLog("本班次该工具次数已用尽。请改用档案、规则、登记簿和生活细节继续核验。");
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

    const baseResult = tool === "phone" ? phoneLines[toolCounts.phone]?.result ?? displayVisitor.phone : displayVisitor[tool];
    const result =
      tool === "scanner" && learningImpostorActive && mostUsedTool === "scanner"
        ? "扫描结果完美无误，时间戳甚至对准了你最习惯信任扫描器的那一刻。"
        : baseResult;
    setToolCounts((counts) => ({ ...counts, [tool]: counts[tool] + 1 }));
    setResourcePool((resources) => ({ ...resources, [tool]: Math.max(0, resources[tool] - 1) }));
    setActiveTool(tool);
    setToolLog(tool === "phone" ? "正在接通线路……" : tool === "scanner" ? "正在扫描证件……" : tool === "camera" ? "正在读取监控……" : "正在记录回答……");

    setTimeout(() => {
      setToolLog(tool === "phone" ? `${phoneLines[toolCounts.phone]?.label}: ${result}` : result);
      setActiveTool(null);
      if (tool === "phone") {
        setVisitorMood("nervous");
        setCheckedItems((items) => addUnique(items, "phone"));
        if (visitor.isMirror) {
          setSelectedEvidence((items) => addUnique(addUnique(items, "phone"), "ledger"));
        }
      }
      if (tool === "scanner") {
        setVisitorMood("waiting");
        setCheckedItems((items) => addUnique(items, "documents"));
        if (visitor.isMirror) {
          setSelectedEvidence((items) => addUnique(items, "id"));
        }
      }
      if (tool === "camera") {
        setVisitorMood("waiting");
        setCheckedItems((items) => addUnique(items, "appearance"));
        if (visitor.isMirror) {
          setSelectedEvidence((items) => addUnique(items, "appearance"));
        }
      }
      if (tool === "question") {
        setVisitorMood("suspicious");
      }
      if (visitor.isMirror && (tool === "phone" || tool === "camera")) {
        setSanity((value) => clamp(value - 4));
      }
    }, 900);
  };

  const askQuestion = (question: QuestionOption) => {
    if (!visitor || feedback || holdReveal) return;
    if (toolCounts.question >= 3) {
      setToolLog("来客拒绝回答更多问题。");
      return;
    }
    if (resourcePool.question <= 0) {
      setToolLog("本班次的提问卡已经用尽。");
      return;
    }

    setToolCounts((counts) => ({ ...counts, question: counts.question + 1 }));
    setResourcePool((resources) => ({ ...resources, question: Math.max(0, resources.question - 1) }));
    const learnedAnswer =
      learningImpostorActive && mostUsedTool === "question"
        ? "回答与此前最常出现的版本完全一致，连你曾经接受过的停顿时长都一模一样。"
        : question.answer;
    const learnedSignal =
      learningImpostorActive && mostUsedTool === "question"
        ? "没有出现矛盾，因为这个复制体已经针对你最常用的提问流程做好准备。"
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
            setToolLog("交换机线路已同步，电话恢复。");
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
      setToolLog("监控频道频率同步完成，画面恢复。");
    } else {
      setToolLog("频率不匹配，请继续靠近目标值。");
    }
  };

  // Scanner calibration mini-game button
  const calibrateScanner = () => {
    if (scannerProgress >= 45 && scannerProgress <= 55) {
      setFailures((f) => ({ ...f, scanner: false }));
      setActiveRepairTool(null);
      setToolLog("证件扫描器校准成功。");
    } else {
      setToolLog(`校准失败：${scannerProgress}%。光束必须落在绿色区间 45%-55%。`);
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
          setToolLog("备用门锁密码正确，门锁恢复。");
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
        visitor: displayVisitor.name,
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
      setHoldReveal({
        visitorId: visitor.id,
        phase: "choosing",
        text: "你把来客留在玻璃外。时间正在流逝，只够选择一种追加调查。",
        evidence: [],
      });
      return;
    }

    window.setTimeout(() => resolveDecision(decision), 750);
  };

  const investigateHold = (route: "callback" | "cctv" | "reaction") => {
    if (!holdReveal || holdReveal.phase !== "choosing") return;
    const reveal = getChineseHoldInvestigation(visitor, route);
    if (visitor.expectedAction !== "allow") {
      setSelectedEvidence((items) => reveal.evidence.reduce((next, key) => addUnique(next, key), items));
    }
    if (route === "callback") {
      setCheckedItems((items) => addUnique(addUnique(items, "phone"), "ledger"));
    } else if (route === "cctv") {
      setCheckedItems((items) => addUnique(items, "appearance"));
    } else {
      setCheckedItems((items) => addUnique(items, "archive"));
    }
    setVisitorWaitMs((value) => value + 8000);
    setVisitorMood(visitor.isMirror ? "suspicious" : "waiting");
    setToolLog(reveal.text);
    setHoldReveal({
      visitorId: visitor.id,
      phase: "revealed",
      text: reveal.text,
      evidence: reveal.evidence,
      route,
    });
  };

  const recordHoldDecision = (decision: Decision) => {
    if (!holdReveal || holdReveal.phase !== "revealed") return;
    const evidenceReasons = visitor.expectedAction === "allow"
      ? selectedEvidence
      : holdReveal.evidence.reduce((items, key) => addUnique(items, key), selectedEvidence);
    setHoldReveal(null);
    resolveDecision(decision, evidenceReasons);
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
        setToolLog("警告：关键设备故障，需要手动校准。");
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
      setEnding("坏结局: 替换完成。清晨，新的薛夜坐在前台内侧；真正的你站在雨里，一遍遍敲着玻璃。");
    } else if (mirrorMistakes === 0 && wrongCalls <= 2 && finalScore >= 2500) {
      setEnding("好结局: 你阻止了复制体，保存了足够多的真实住户档案。天亮时，招聘告示上的名字被划掉，你终于离开登记循环。");
    } else {
      setEnding("幸存结局: 你熬过了七夜，却放进了太多复制体。公寓照常运转，只是每个人的点头和微笑都比记忆里偏了一点。");
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
            <span>月影公寓</span>
            <h1>白日准备台</h1>
            <p>阅读夜班简报，选择设备支援，并在宵禁前修复被污染的住户档案。</p>
          </div>
        </section>

        <section className="registry-dashboard" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <header className="registry-topbar" style={{ display: "block", textAlign: "center", borderBottom: "1px solid rgba(237, 194, 112, 0.28)" }}>
            <h2>值班简报：{nextNight.title}</h2>
            <p style={{ color: "#eedcb2", fontStyle: "italic", fontSize: "0.9rem", marginTop: "4px" }}>"{nextNight.subtitle}"</p>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.82rem", margin: "10px auto 0", maxWidth: "620px" }}>{nextNight.briefing}</p>
          </header>

          {history.length === 0 ? (
            <article className="registry-prep-mode" aria-label="游戏模式选择">
              <header>
                <span>值班合同</span>
                <h3>选择登记模式</h3>
              </header>
              <div>
                {[
                  ["story", "七夜故事", "完整剧情升级、白日修复、设备升级与四种结局。"],
                  ["challenge", "挑战：停电", "工具次数更少，设备故障更频繁。"],
                  ["endless", "无尽值班", "每轮八个案例，威胁与压力持续上升。"],
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
                <h4 style={{ margin: 0, color: "#eedcb2" }}>今夜宵禁规则</h4>
              </header>
              <ol className="registry-rules" style={{ paddingLeft: "20px", margin: 0 }}>
                {nextNight.rules.map((rule) => (
                  <li key={rule} style={{ marginBottom: "6px", fontSize: "0.85rem" }}>{rule}</li>
                ))}
              </ol>
            </article>

            <article className="registry-paper registry-prep-card" style={{ padding: "16px", minHeight: "220px" }}>
              <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, color: "#eedcb2" }}>选择前台支援</h4>
              </header>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>本夜只能选择一项设备支援：</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  ["coffee", "fa-mug-hot", "稳定咖啡", "换班后额外恢复 30 点稳定度。"],
                  ["booster", "fa-bolt", "扫描激光增幅器", "本夜证件扫描器不会故障。"],
                  ["override", "fa-lock-open", "门锁手动旁路", "本夜门锁不会卡死。"],
                  ["repairkit", "fa-toolbox", "交换机维修包", "本夜电话线路不会中断。"],
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
                  <span>永久前台改造</span>
                  <h4>设备升级台</h4>
                </div>
                <strong>{upgradeCredits} 点升级额度</strong>
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
                      <small>代价：{upgrade.sideEffect}</small>
                      <em>{owned ? "已安装" : "消耗 1 点额度"}</em>
                    </button>
                  );
                })}
              </div>
            </article>
          ) : null}

          {archiveRepairActive ? (
            <article className="registry-paper registry-prep-card" style={{ padding: "16px", marginBottom: "18px" }}>
              <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ margin: 0 }}>档案修复（剩余 {prepPoints} 点）</h4>
                <span style={{ fontSize: "0.8rem" }}>已修复：{decryptedFiles.length} / {residents.length}</span>
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
                      <span>{getChineseName(r.name)} {isDone ? "" : "（修复 -40）"}</span>
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
              开始夜班
            </button>
          </div>
        </section>

        {repairResident ? (
          <div className="registry-modal registry-repair-modal" role="dialog" aria-modal="true" aria-labelledby="archive-repair-title">
            <div className="registry-modal__card">
              <span>被污染的档案区</span>
              <h2 id="archive-repair-title">修复 {getChineseName(repairResident.name)} 的档案</h2>
              <p>选择至少两种独立历史来源。正式记录可能被污染，私人记忆和旧物证能重新固定真实身份。</p>
              <div className="registry-repair-sources">
                {[
                  ["old-photo", "旧照片", `记录特征：${getChineseResident(repairResident.id)?.feature}。`],
                  ["voice-reel", "声音磁带", `保留问候：${getChineseResident(repairResident.id)?.greeting}。`],
                  ["paper-note", "手写习惯便条", getChineseResident(repairResident.id)?.habit ?? ""],
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
                <strong>修复托盘</strong>
                <span>已放入 {repairSources.length}/2 个独立来源</span>
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
                恢复真实档案
              </button>
              <button
                className="registry-modal__secondary"
                onClick={() => {
                  setRepairTarget(null);
                  setRepairSources([]);
                }}
                type="button"
              >
                关闭档案
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
          设计系统
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
          <span>月影公寓</span>
          <h1>午夜登记簿</h1>
          <p>每一枚印章都在记录现实：它可以让来客成为住户，也可以抹去原本存在的人。</p>
        </div>
      </section>

      <section className="registry-dashboard" aria-label="夜班前台工作台">
        <header className="registry-topbar">
          <div>
            <span>{currentNight.title}</span>
            <h2>{currentNight.subtitle}</h2>
          </div>
          <div className="registry-shift">
            <span>{gameMode === "story" ? "故事" : gameMode === "challenge" ? "挑战" : "无尽"} / 案例类型</span>
            <strong>{visitorTypeLabels[visitorType]}</strong>
          </div>
          <div className="registry-shift">
            <span>来客 {visitorIndex + 1}/{dayVisitors.length}</span>
            <strong>{visitor.arrival}</strong>
          </div>
          <div className="registry-shift">
            <span>队列压力</span>
            <strong>{queuePressure}% / {Math.floor(visitorWaitMs / 1000)} 秒</strong>
          </div>
          <div className="registry-score">
            <span>得分</span>
            <strong>{score}</strong>
          </div>
        </header>

        <div className="registry-stats">
          <StatMeter label="安全" value={safety} tone="safe" />
          <StatMeter label="声誉" value={reputation} tone="trust" />
          <StatMeter label="稳定度" value={sanity} tone="mind" />
        </div>

        <div className="registry-resource-strip" aria-label="本班次工具次数">
          {(Object.entries(resourcePool) as [ToolName, number][]).map(([tool, remaining]) => (
            <span data-empty={remaining === 0} key={tool}>
              <i className={`fa-solid ${tool === "phone" ? "fa-phone" : tool === "scanner" ? "fa-id-card" : tool === "camera" ? "fa-video" : "fa-comments"}`} />
              <strong>{tool === "phone" ? "电话" : tool === "scanner" ? "扫描" : tool === "camera" ? "监控" : "提问"}</strong>
              <em>剩余 {remaining}</em>
            </span>
          ))}
          {mostUsedTool && learningImpostorActive ? (
            <span className="registry-learning-warning">
              <i className="fa-solid fa-eye" />
              <strong>流程已被学习</strong>
              <em>复制体可能模仿你最常用的核验方式</em>
            </span>
          ) : null}
        </div>

        <div className="registry-grid registry-grid--desk">
          <section className="registry-panel registry-arrival">
            <div className="registry-panel__title">
              <span>门外 / {visitorTypeLabels[visitorType]}</span>
              <h3>{displayVisitor.name}</h3>
            </div>
            {displayVisitor.specialEvent ? (
              <div className="registry-special-event">
                <strong>{displayVisitor.specialEvent.label}</strong>
                <span>{displayVisitor.specialEvent.detail}</span>
              </div>
            ) : null}
            <div
              className={`registry-portrait registry-portrait--${visitor.portrait} registry-portrait--${visitorMood} ${
                activeTool === "scanner" ? "registry-scanline" : ""
              } ${visitor.isMirror ? "registry-portrait--duplicate" : ""} ${
                visitor.isMirror && sanity < 55 ? "registry-portrait--eye-glitch" : ""
              }`}
              aria-label={`${displayVisitor.name} 肖像`}
            >
              <img src={portraitAsset.image} alt={`${displayVisitor.name} 角色肖像`} />
            </div>
            <dl className="registry-facts">
              <div><dt>类型</dt><dd>{visitorTypeLabels[visitorType]}</dd></div>
              <div><dt>房间</dt><dd>{visitor.room}</dd></div>
              <div><dt>身份</dt><dd>{displayVisitor.job}</dd></div>
              <div><dt>证件</dt><dd>{visitor.idCode}</dd></div>
              <div><dt>理由</dt><dd>{displayVisitor.reason}</dd></div>
              <div><dt>工牌</dt><dd>{displayVisitor.badge}</dd></div>
              {visitor.sourceResidentId ? (
                <div><dt>档案状态</dt><dd>{residentStatuses[visitor.sourceResidentId] === "active" ? "有效" : residentStatuses[visitor.sourceResidentId] === "stranded" ? "滞留楼外" : "已被替换"}</dd></div>
              ) : null}
            </dl>
          </section>

          <section className="registry-panel registry-desk" aria-label="人工核验工作区">
            <div className="registry-panel__title">
              <span>前台工作区</span>
              <h3>人工身份核验</h3>
            </div>
            <div className="registry-desk-tabs" role="tablist" aria-label="核验资料">
              {[
                ["documents", "证件", "fa-folder-open"],
                ["archive", "档案", "fa-book"],
                ["notice", "通知", "fa-thumbtack"],
                ["ledger", "登记簿", "fa-list-check"],
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
              {deskView === "cctv" && (
                <button aria-selected={true} type="button">
                  <i className="fa-solid fa-video" aria-hidden="true" style={{ color: "#22c9d6" }} />
                  <span style={{ color: "#22c9d6" }}>监控终端</span>
                </button>
              )}
              {deskView === "phone" && (
                <button aria-selected={true} type="button">
                  <i className="fa-solid fa-phone-flip" aria-hidden="true" style={{ color: "#edc270" }} />
                  <span style={{ color: "#edc270" }}>电话交换机</span>
                </button>
              )}
            </div>

            <div className="registry-desk-surface">
              {deskView === "documents" ? (
                <>
                  <div className="registry-document-tray" aria-label="已收集证件">
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
                        <span>收集到的纸面材料</span>
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
                    <span>住户档案</span>
                    <h4>{displayResident ? displayResident.name : visitor.appointment ? "访客登记" : "没有匹配档案"}</h4>
                  </header>
                  {resident ? (
                    <>
                      <dl className="registry-facts registry-facts--paper">
                        <div><dt>房间</dt><dd>{resident.room}</dd></div>
                        <div><dt>职业</dt><dd>{displayResident?.job}</dd></div>
                        <div><dt>证件</dt><dd>{resident.idCode}</dd></div>
                        <div><dt>特征</dt><dd>{isCorrupted ? "【档案污染：字段损坏】" : displayResident?.feature}</dd></div>
                        <div><dt>习惯</dt><dd>{isCorrupted ? "【档案污染：字段损坏】" : displayResident?.habit}</dd></div>
                        <div><dt>禁忌</dt><dd>{isCorrupted ? "【档案污染：字段损坏】" : displayResident?.forbidden}</dd></div>
                        <div><dt>问候</dt><dd>{displayResident?.greeting}</dd></div>
                      </dl>
                      <div className={`registry-relationship-network ${isCorrupted ? "is-corrupted" : ""}`}>
                        <strong>住户关系交叉核验</strong>
                        {(residentRelationships[resident.id] ?? []).map((relationship) => {
                          const linkedResident = getResident(relationship.residentId);
                          const linkedStatus = residentStatuses[relationship.residentId] ?? "active";
                          return (
                            <span key={`${resident.id}-${relationship.residentId}`}>
                              <b>{getChineseName(linkedResident?.name ?? relationship.residentId)}</b>
                              <em>{isCorrupted ? "关系索引已污染，请在白日准备时修复" : "该住户可作为独立关系证人"}</em>
                              <small data-status={linkedStatus}>{linkedStatus === "active" ? "有效" : linkedStatus === "stranded" ? "楼外滞留" : "已被替换"}</small>
                            </span>
                          );
                        })}
                      </div>
                      {isCorrupted ? (
                        <p className="registry-corruption-warning">
                          需要独立历史来源；该档案只能在白日准备阶段修复。
                        </p>
                      ) : null}
                    </>
                  ) : visitor.appointment ? (
                    <dl className="registry-facts registry-facts--paper">
                      <div><dt>姓名</dt><dd>{displayVisitor.name}</dd></div>
                      <div><dt>公司</dt><dd>{visitor.appointment.company === "Blue Star Repair" ? "蓝星维修" : "月影快递"}</dd></div>
                      <div><dt>目标</dt><dd>{visitor.appointment.room === "Desk" ? "前台" : visitor.appointment.room}</dd></div>
                      <div><dt>时间</dt><dd>{visitor.appointment.time}</dd></div>
                      <div><dt>任务</dt><dd>{displayVisitor.reason}</dd></div>
                    </dl>
                  ) : (
                    <p className="registry-empty">没有住户档案或预约记录与该说法匹配。</p>
                  )}
                </article>
              ) : null}

              {deskView === "notice" ? (
                <article className="registry-paper registry-paper--notice">
                  <header>
                    <span>今夜规则</span>
                    <h4>{currentNight.title} 通知</h4>
                  </header>
                  <ol className="registry-rules">
                    {currentNight.rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ol>
                  <div className="registry-register">
                    <strong>预约记录</strong>
                    {chineseAppointments.map((appointment) => (
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
                      <span>今日出入记录</span>
                      <h4>{currentNight.title} 进出簿</h4>
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
                      <span>审批表</span>
                      <h4>进入审核 #{visitorIndex + 1}</h4>
                    </header>
                    <div className="registry-form__identity">
                      <strong>{displayVisitor.name}</strong>
                      <span>{visitor.room} / {visitor.idCode} / 等待裁决</span>
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
                      <strong>证据理由</strong>
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

              {/* CCTV Monitor Sub-Panel */}
              {deskView === "cctv" ? (
                <article className="registry-paper registry-paper--cctv-board" style={{ display: "block" }}>
                  <header>
                    <span>监控画面</span>
                    <h4>大厅监控终端（频道 {cctvChannel}）</h4>
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
                              setToolLog("本班次的监控复核次数已经用尽。");
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
                          <span>频道 {scene.channel}：{chineseCctvLabels[scene.channel - 1]}</span>
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
                        <span>监控频道：{cctvChannel}</span>
                        <span>实时画面 / 第 {dayIndex + 1} 夜</span>
                      </div>

                      <img
                        className="registry-cctv-feed"
                        key={`${visitor.id}-${cctvChannel}`}
                        src={cctvSceneAssets[cctvChannel - 1].image}
                        alt={`${chineseCctvLabels[cctvChannel - 1]}监控画面`}
                      />

                      <p style={{ margin: 0, color: "#9cd6db", fontSize: "0.85rem", lineHeight: "1.4", minHeight: "100px" }}>
                        {(() => {
                          const isCctvTrap = learningImpostorActive && mostUsedTool === "camera";

                          if (cctvChannel === 1) {
                            return isCctvTrap
                              ? `正门画面显示：${displayVisitor.name}。所有特征都与档案照片一致，没有可见异常。`
                              : `正门画面显示：${displayVisitor.name}。眼睛：${displayVisitor.eyes}；头发：${displayVisitor.hair}；显著特征：${displayVisitor.feature}。`;
                          }
                          if (cctvChannel === 2) {
                            if (visitor.isMirror) {
                              return isCctvTrap
                                ? "走廊监控显示来客站立不动，影子方向看似正常。"
                                : "走廊监控显示：影子直接朝向光源。警告：该角度违反物理规律。";
                            }
                            return "走廊监控显示：影子自然投向楼梯间。";
                          }
                          if (cctvChannel === 3) {
                            if (visitor.name === "Owen Xu" && visitor.isMirror) {
                              return isCctvTrap
                                ? "柜面监控拍到小提琴盒，搭扣细节看似正常。"
                                : "柜面监控拍到小提琴盒，搭扣为黄铜色，与档案的银色记录冲突。";
                            }
                            if (visitor.name === "Sun Hao") {
                              return "柜面监控拍到一个油纸包裹的小包子。";
                            }
                            if (visitor.name === "Han Dong" && visitor.isMirror) {
                              return isCctvTrap
                                ? "柜面监控拍到一个外观正常的维修工具箱。"
                                : "柜面监控显示：工具箱微微打开，里面完全是空的。";
                            }
                            if (visitor.name === "Zhao Jun") {
                              return "柜面监控显示：皮质文件夹平放在柜台上。";
                            }
                            return "柜面监控显示：证件贴在玻璃上，来客姿势稳定。";
                          }
                          if (cctvChannel === 4) {
                            if (visitor.name === "Li Mei" && visitor.isMirror) {
                              return isCctvTrap
                                ? "电梯厅显示电梯已经锁定。"
                                : "电梯呼叫灯正在闪烁，但李梅从不使用电梯。";
                            }
                            if (visitor.name === "Ke Ren") {
                              return "电梯厅信号剧烈闪烁，画面连续三帧失去同步。";
                            }
                            return "电梯为空，停在一楼。";
                          }
                          return "画面加载中……";
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
                    <span>交换机线路</span>
                    <h4>接线目录（本案剩余 {Math.max(0, 3 - toolCounts.phone)} / 本班剩余 {resourcePool.phone}）</h4>
                  </header>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "12px 0" }}>
                    {[
                      { id: "room", label: `${visitor.room} 室线路`, desc: "直接拨入住户房间。" },
                      { id: "management", label: "物业办公室", desc: "确认工单或通知授权。" },
                      { id: "security", label: "安保岗亭", desc: "向楼内安保核实异常。" },
                      { id: "neighbor", label: "相邻住户", desc: "交叉核对邻居观察。" }
                    ].map((line) => {
                      const isCallLimit = toolCounts.phone >= 3 || resourcePool.phone <= 0;
                      return (
                        <button
                          key={line.id}
                          className="registry-phone-line"
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
                                ? "房间用完美复制的声音接听，但同一线路里还能听见第二只听筒的呼吸。"
                                : residentStatus === "stranded"
                                  ? "楼上无人接听；这名住户此前被挡在门外，再也没有回来。"
                                  : isPhoneTrap
                                ? "听筒轻响，与门外来客完全相同的声音回答：“对，是我。有人等我，让我上去。”"
                                : phoneLines[0]?.result ?? displayVisitor.phone;
                            } else if (line.id === "management") {
                              resultText = phoneLines[1]?.result ?? "物业重复：“按规则处理，不得例外。”";
                            } else if (line.id === "security") {
                              resultText = dayIndex === 6
                                ? "周启明压低声音：“别登记第二个薛夜。看你工牌背面。”"
                                : "周启明回答：“我在盯楼梯间。去监控里核对影子方向。”";
                            } else {
                              resultText = "邻居接起电话：“走廊里有怪声。别只看证件，问他平时怎么做。”";
                            }

                            setTotalToolUsage((usage) => ({ ...usage, phone: usage.phone + 1 }));
                            setActiveTool("phone");
                            setToolLog("正在建立交换机接线……");

                            setTimeout(() => {
                              setToolLog(`${line.label}: ${resultText}`);
                              setActiveTool(null);
                              setVisitorMood("nervous");
                              setCheckedItems((items) => addUnique(items, "phone"));
                              if (visitor.isMirror) {
                                setSelectedEvidence((items) => addUnique(addUnique(items, "phone"), "ledger"));
                              }
                              if (visitor.isMirror) {
                                setSanity((value) => clamp(value - 4));
                              }
                            }, 1200);
                          }}
                          style={{
                            cursor: isCallLimit || activeTool !== null ? "not-allowed" : "pointer",
                          }}
                        >
                          <div className="registry-phone-line__title">
                            <i className="fa-solid fa-plug" />
                            <strong>{line.label}</strong>
                          </div>
                          <p>{line.desc}</p>
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
              <span>现场观察</span>
              <h3>玻璃窗记录</h3>
            </div>
            <ul className="registry-note-list">
              <li><strong>眼睛</strong>{displayVisitor.eyes}</li>
              <li><strong>头发</strong>{displayVisitor.hair}</li>
              <li><strong>特征</strong>{displayVisitor.feature}</li>
              <li><strong>衣着</strong>{displayVisitor.clothing}</li>
              <li><strong>声音</strong>{displayVisitor.voice}</li>
              <li><strong>行为</strong>{displayVisitor.behavior}</li>
            </ul>
          </section>
        </div>

        <section className="registry-tools">
          <div className="registry-tool-buttons" aria-label="核验工具">
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
                  setToolLog("交换机已上线，请选择要接通的联系人。");
                }
              }}
            >
              <img src="/assets/midnight-registry/props/phone-receiver-dial.png" alt="" aria-hidden="true" />
              <span>{failures.phone ? "电话故障" : "电话交换机"}</span>
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
              <span>{failures.scanner ? "⚠️ 扫描器故障" : "扫描证件"}</span>
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
                  setToolLog("监控终端已载入，请选择 1-4 号频道核对不同角度。");
                }
              }}
            >
              <img src="/assets/midnight-registry/props/cctv-monitor.png" alt="" aria-hidden="true" />
              <span>{failures.camera ? "⚠️ 监控故障" : "查看监控"}</span>
            </button>
          </div>
          <div className="registry-tool-log">
            <TypewriterText text={toolLog} />
            <span>已核对 {checkedItems.length}/{checklistItems.length} 项来源 / 已标记 {selectedEvidence.length} 条证据</span>
          </div>

          {/* V2 Redesigned Question Index Cards */}
          <div className="registry-question-board" aria-label="提问卡">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong>本案可用提问：</strong>
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
                    <span style={{ fontSize: "0.65rem", color: "#22c9d6", alignSelf: "flex-end", letterSpacing: "1px" }}>
                      {question.category === "identity" ? "身份" : question.category === "relation" ? "关系" : question.category === "situation" ? "情境" : "陷阱问题"}
                    </span>
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
                  setEnding("隐藏结局: 你收集到足够证据，并借安保警报掩护烧毁登记簿。大门保持封锁，替换者薛夜被删除，而你的名字也从月影公寓历史中消失。");
                }, 750);
              }}
            >
              <i className="fa-solid fa-fire" style={{ marginRight: "8px" }} />
              <span>烧毁登记簿（摧毁记录）</span>
            </button>
          )}

          <button className="registry-decision registry-decision--allow" disabled={screenEffect !== null || feedback !== null || holdReveal !== null} type="button" onClick={() => decide("allow")}>
            <img src="/assets/midnight-registry/props/approve-stamp.png" alt="" aria-hidden="true" />
            <span>{failures.lock ? "⚠️ 门锁卡死" : decisionLabels.allow}</span>
          </button>
          <button className="registry-decision registry-decision--reject" disabled={screenEffect !== null || feedback !== null || holdReveal !== null} type="button" onClick={() => decide("reject")}>
            <img src="/assets/midnight-registry/props/deny-stamp.png" alt="" aria-hidden="true" />
            <span>{failures.lock ? "⚠️ 门锁卡死" : decisionLabels.reject}</span>
          </button>
          <button className="registry-decision registry-decision--security" disabled={screenEffect !== null || feedback !== null || holdReveal !== null} type="button" onClick={() => decide("security")}>
            <img src="/assets/midnight-registry/props/security-call-stamp.png" alt="" aria-hidden="true" />
            <span>{failures.lock ? "⚠️ 门锁卡死" : decisionLabels.security}</span>
          </button>
          <button className="registry-decision registry-decision--wait" disabled={screenEffect !== null || feedback !== null || holdReveal !== null} type="button" onClick={() => decide("wait")}>
            <img src="/assets/midnight-registry/props/wait-token.png" alt="" aria-hidden="true" />
            <span>{failures.lock ? "⚠️ 门锁卡死" : decisionLabels.wait}</span>
          </button>
        </footer>
      </section>

      <section className="registry-history" aria-label="本班裁决记录">
        <h2>本班裁决簿</h2>
        <div>
          {history.length === 0 ? (
            <span>尚无裁决记录。</span>
          ) : (
            history.slice(-8).map((entry, index) => (
              <span key={`${entry.visitor}-${index}`} data-status={entry.correct ? "correct" : "wrong"}>
                <strong>{getChineseName(entry.visitor)} {entry.room}：{decisionLabels[entry.decision]}</strong>
                <small>{entry.consequence}</small>
              </span>
            ))
          )}
        </div>
      </section>

      {holdReveal ? (
        <div className="registry-modal registry-hold-modal" role="dialog" aria-modal="true" aria-labelledby="registry-hold-title">
          <div className="registry-modal__card">
            <span>留置调查</span>
            <h2 id="registry-hold-title">{holdReveal.phase === "choosing" ? "时间正在推进" : "第二来源已返回"}</h2>
            <div className={`registry-hold-clock is-${holdReveal.phase}`}>
              <i className="fa-solid fa-hourglass-half" />
              <strong>{holdReveal.phase === "choosing" ? "选择一种追加调查" : "调查结果已记录"}</strong>
            </div>
            <p>{holdReveal.text}</p>
            {holdReveal.phase === "choosing" ? (
              <>
                <div className="registry-hold-progress"><i /></div>
                <div className="registry-hold-actions registry-hold-actions--investigate">
                  <button onClick={() => investigateHold("callback")} type="button">
                    <i className="fa-solid fa-phone" />
                    <span>等待回拨</span>
                  </button>
                  <button onClick={() => investigateHold("cctv")} type="button">
                    <i className="fa-solid fa-video" />
                    <span>复查监控</span>
                  </button>
                  <button onClick={() => investigateHold("reaction")} type="button">
                    <i className="fa-solid fa-eye" />
                    <span>观察反应</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="registry-hold-evidence">
                  {holdReveal.evidence.map((evidence) => (
                    <span key={evidence}>
                      {visitor.expectedAction === "allow"
                        ? holdReveal.route === "callback"
                          ? "电话回拨一致"
                          : holdReveal.route === "cctv"
                            ? "监控外貌一致"
                            : "行为习惯一致"
                        : evidenceOptions.find((option) => option.key === evidence)?.label ?? evidence}
                    </span>
                  ))}
                </div>
                <strong className="registry-hold-prompt">根据新证据写入最终处理结果</strong>
                <div className="registry-hold-actions registry-hold-actions--decision">
                  {(Object.keys(decisionLabels) as Decision[]).map((decision) => (
                    <button
                      data-decision={decision}
                      key={decision}
                      onClick={() => recordHoldDecision(decision)}
                      type="button"
                    >
                      {decisionLabels[decision]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {nightSettlement ? (
        <div className="registry-modal registry-settlement-modal" role="dialog" aria-modal="true" aria-labelledby="registry-settlement-title">
          <div className="registry-modal__card">
            <span>夜班结算</span>
            <h2 id="registry-settlement-title">第 {nightSettlement.night} 夜已写入登记簿</h2>
            <div className="registry-ending-stats">
              <strong>正确 {nightSettlement.correct}/{nightSettlement.total}</strong>
              <strong>已被替换 {nightSettlement.replaced}</strong>
              <strong>升级额度 +{nightSettlement.credits}</strong>
              <strong>稳定度 {sanity}</strong>
            </div>
            <p>登记簿的墨迹正在干。下一批记录到来前，你只有一个白日准备窗口。</p>
            <button onClick={continueAfterSettlement} type="button">
              <i className="fa-solid fa-sun" />
              <span>{gameMode === "endless" ? "准备下一轮无尽值班" : "进入白日准备"}</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Repair Mini-game Modal */}
      {activeRepairTool ? (
        <div className="registry-modal" role="dialog" aria-modal="true" style={{ zIndex: 99 }}>
          <div className="registry-modal__card" style={{ maxWidth: "480px", border: "2px solid #ff7b7b" }}>
            <span style={{ color: "#ff7b7b", fontWeight: "bold" }}>设备故障</span>
            <h2>维修：{activeRepairTool === "phone" ? "电话" : activeRepairTool === "camera" ? "监控" : activeRepairTool === "scanner" ? "扫描器" : "门锁"}</h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
              {activeRepairTool === "phone" && "把左侧插头与右侧同色端口连接。"}
              {activeRepairTool === "camera" && "调节频率滑块，使当前值靠近目标频道。"}
              {activeRepairTool === "scanner" && "光束进入绿色区间时按下校准。"}
              {activeRepairTool === "lock" && "输入安保备用旁路密码。"}
            </p>

            {/* Phone Repair: Wires match */}
            {activeRepairTool === "phone" && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "18px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <strong>交换机插头</strong>
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
                        {color === "Red" ? "红色" : color === "Blue" ? "蓝色" : "黄色"}插头 {connected ? "已连接" : ""}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <strong>线路端口</strong>
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
                        {color === "Red" ? "红色" : color === "Blue" ? "蓝色" : "黄色"}端口 {isConnected ? "已连接" : ""}
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
                  <span>当前：<strong>{cctvFrequency.toFixed(1)} MHz</strong></span>
                  <span style={{ color: "#22c9d6" }}>目标：<strong>{cctvTargetFrequency.toFixed(1)} MHz</strong></span>
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
                  校准频道
                </button>
              </div>
            )}

            {/* ID Scanner Repair: Calibration */}
            {activeRepairTool === "scanner" && (
              <div style={{ padding: "18px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "16px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                  <span>光束：<strong>{scannerProgress}%</strong></span>
                  <span style={{ color: "#22c9d6" }}>目标区间：<strong>45-55%</strong></span>
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
                  校准光束
                </button>
              </div>
            )}

            {/* Lock Repair: Keypad input */}
            {activeRepairTool === "lock" && (
              <div style={{ padding: "18px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: "0.85rem", color: "#ff7b7b", border: "1px dashed #ff7b7b", padding: "4px 12px", borderRadius: "4px", marginBottom: "12px", fontFamily: "monospace" }}>
                  便签上的备用密码：<strong>{lockTargetCode}</strong>
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
              取消维修（保持离线）
            </button>
          </div>
        </div>
      ) : null}

      {feedback ? (
        <div className="registry-modal" role="dialog" aria-modal="true" aria-labelledby="registry-feedback-title">
          <div className="registry-modal__card">
            <span>{feedback.correct ? "裁决正确" : "裁决错误"}</span>
            <h2 id="registry-feedback-title">
              {feedback.decision === "allow"
                ? "大门已开启"
                : feedback.decision === "security"
                  ? "安保已响应"
                  : feedback.decision === "wait"
                    ? "来客继续留置"
                    : "已拒绝进入"}
            </h2>
            <p>
              {feedback.correct
                ? feedback.visitor.isMirror
                  ? feedback.decision === "security"
                    ? "安保在门外异常被登记为住户前封锁了大厅。"
                    : "门外的东西失去了它试图占据的身份。"
                  : feedback.decision === "wait"
                    ? "留置争取到足够时间，让第二来源暴露正在移动的记录。"
                    : feedback.visitor.expectedAction === "allow"
                      ? "真实来客抵达楼梯，没有被登记簿改写。"
                      : "规则得到执行，普通访客安全离开。"
                : feedback.visitor.isMirror
                  ? "镜像来客记住了你的错误，开始占据这个名字。"
                  : "真实住户或已批准案例被错误标记为威胁。"}
            </p>
            <div className="registry-feedback-grid">
              <section>
                <strong>案例证据</strong>
                <ul>
                  {getChineseVisitor(feedback.visitor).clues.map((clue) => (
                    <li key={clue}>{clue}</li>
                  ))}
                </ul>
              </section>
              <section>
                <strong>已标记理由</strong>
                <ul>
                  {selectedEvidence.length === 0 ? (
                    <li>没有标记任何证据理由。</li>
                  ) : (
                    selectedEvidence.map((key) => {
                      const evidence = evidenceOptions.find((option) => option.key === key);
                      return <li key={key}>{evidence?.label ?? key}</li>;
                    })
                  )}
                </ul>
              </section>
            </div>
            <strong className="registry-consequence-title">即时后果</strong>
            <ul className="registry-consequence-list">
              {feedback.consequences.map((consequence) => (
                <li key={consequence}>{consequence}</li>
              ))}
            </ul>
            <button type="button" onClick={continueGame}>
              <i className="fa-solid fa-forward-step" aria-hidden="true" />
              <span>{dayIndex === chineseNights.length - 1 && visitorIndex === dayVisitors.length - 1 ? "查看结局" : "继续值班"}</span>
            </button>
          </div>
        </div>
      ) : null}

      {ending ? (
        <div className="registry-modal" role="dialog" aria-modal="true" aria-labelledby="registry-ending-title">
          <div className="registry-modal__card registry-modal__card--ending">
            <span>最终登记</span>
            <h2 id="registry-ending-title">{ending.split(":")[0]}</h2>
            <p>{ending.split(":").slice(1).join(":").trim()}</p>
            <div className="registry-ending-stats">
              <strong>得分 {score}</strong>
              <strong>安全 {safety}</strong>
              <strong>声誉 {reputation}</strong>
              <strong>稳定度 {sanity}</strong>
            </div>
            <button type="button" onClick={resetGame}>
              <i className="fa-solid fa-rotate-right" aria-hidden="true" />
              <span>重新开始</span>
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
