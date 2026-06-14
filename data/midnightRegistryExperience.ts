import type {
  Decision,
  EvidenceKey,
  GameMode,
  Visitor,
} from "@/data/midnightRegistryData";

export type HintSetting = "full" | "light" | "off";

export type NightExperience = {
  objective: string;
  newRule: string;
  suspense: string;
  midEvent: string;
  cliffhanger: string;
};

export type PrepModeCard = {
  id: GameMode;
  name: string;
  description: string;
  image: string;
  recommended?: boolean;
};

export type PrepPerkId = "tutorial" | "coffee" | "booster" | "override" | "repairkit";

export type PrepPerk = {
  id: PrepPerkId;
  name: string;
  description: string;
  image: string;
};

export type CctvChannel = {
  channel: number;
  label: string;
  image: string;
  icon: string;
  unlockNight: number;
  purpose: string;
};

export type CctvHotspot = {
  id: string;
  label: string;
  text: string;
  evidence: EvidenceKey[];
  action: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TutorialStep = {
  action: string;
  objective: string;
  hint: string;
  strongHint: string;
};

export const nightExperiences: NightExperience[] = [
  {
    objective: "学会核对证件、档案和外貌，再用证据作出裁决。",
    newRule: "证件与档案必须一致。",
    suspense: "第一个伪人知道正确问候，但姓名写错了。",
    midEvent: "登记簿页边渗出新墨迹：它正在记录你的检查顺序。",
    cliffhanger: "拒绝章干透后，一行旧住户记录自己换了位置。",
  },
  {
    objective: "核对预约、公司、时间和楼层，不要只相信外部工单。",
    newRule: "维修与快递必须匹配预约。",
    suspense: "蓝星维修十二年前已经注销。",
    midEvent: "街对面短暂亮起一块褪色的蓝星维修车牌。",
    cliffhanger: "旧工商档案显示：蓝星最后一张工单签发于十二年前的今晚。",
  },
  {
    objective: "使用电话确认来客位置，处理同一身份同时出现的冲突。",
    newRule: "电话冲突必须留置或呼叫安保。",
    suspense: "前台监控里会出现一帧不属于你的值班画面。",
    midEvent: "物业传真吐出一张 03:00 换班通知，但管理处否认签发。",
    cliffhanger: "你保存了异常帧。画面里，另一个门岗正坐在你的椅子上。",
  },
  {
    objective: "用私人习惯、关系和问候识别完美证件背后的错误。",
    newRule: "完美证件不代表安全。",
    suspense: "有人记得档案，却记不住被删掉的私人动作。",
    midEvent: "一名住户坚持某段问候从未存在，关系网却还留着旧笔迹。",
    cliffhanger: "住户们开始用相同的停顿回答不同的问题。",
  },
  {
    objective: "档案可能被改写，至少使用一个独立来源交叉确认。",
    newRule: "损坏档案不能单独定案。",
    suspense: "档案室监控拍到一张卡片自行翻页。",
    midEvent: "档案室抽屉在无人进入时打开，203 室卡片从左栏移到右栏。",
    cliffhanger: "你修复的档案在墨迹干透前又被改写了一次。",
  },
  {
    objective: "轮换工具和提问方式，识别针对你流程准备的完美回答。",
    newRule: "过度完美也是异常。",
    suspense: "蓝星车辆停在楼下，车牌年份属于十二年前。",
    midEvent: "监控显示你离开前台一分钟，但你清楚记得自己没有起身。",
    cliffhanger: "登记簿开始提前写下你下一步会使用的工具。",
  },
  {
    objective: "证明当前薛夜已经在岗，阻止第二份记录覆盖你。",
    newRule: "不得登记第二个自己。",
    suspense: "第二个薛夜持完整文件来换班。",
    midEvent: "安保岗亭无人回应，前台监控却同时拍到两个值班轮廓。",
    cliffhanger: "天亮前，登记簿只允许一个薛夜继续存在。",
  },
];

export const prepModeCards: PrepModeCard[] = [
  {
    id: "story",
    name: "七夜故事",
    description: "推荐。完整剧情、白日修复、设备升级与四种结局。",
    image: "/assets/midnight-registry/prep/story-contract.png",
    recommended: true,
  },
  {
    id: "challenge",
    name: "挑战：停电",
    description: "资源更少，设备故障更频繁。",
    image: "/assets/midnight-registry/prep/blackout-contract.png",
  },
  {
    id: "endless",
    name: "无尽值班",
    description: "每轮八案，威胁与队列压力持续上升。",
    image: "/assets/midnight-registry/prep/endless-contract.png",
  },
];

export const prepPerks: PrepPerk[] = [
  {
    id: "tutorial",
    name: "值班手册",
    description: "第一夜固定支援：显示完整检查顺序与分层提示。",
    image: "/assets/midnight-registry/prep/tutorial-handbook.png",
  },
  {
    id: "coffee",
    name: "稳定咖啡",
    description: "换班后额外恢复稳定度。",
    image: "/assets/midnight-registry/prep/sanity-coffee.png",
  },
  {
    id: "booster",
    name: "扫描增幅器",
    description: "本夜扫描器不会故障，并增加扫描次数。",
    image: "/assets/midnight-registry/prep/scanner-booster.png",
  },
  {
    id: "override",
    name: "门锁手动旁路",
    description: "本夜门锁不会卡死。",
    image: "/assets/midnight-registry/prep/manual-lock-override.png",
  },
  {
    id: "repairkit",
    name: "交换机接线盒",
    description: "本夜电话线路不会中断，并增加电话次数。",
    image: "/assets/midnight-registry/prep/switchboard-kit.png",
  },
];

export const cctvChannels: CctvChannel[] = [
  { channel: 1, label: "正门", image: "/assets/midnight-registry/cctv/front-gate.png", icon: "fa-door-open", unlockNight: 1, purpose: "确认来客、衣着与门前位置。" },
  { channel: 2, label: "走廊角度", image: "/assets/midnight-registry/cctv/impossible-hallway-shadow.png", icon: "fa-circle-half-stroke", unlockNight: 1, purpose: "检查影子方向与延迟倒影。" },
  { channel: 3, label: "前台自身", image: "/assets/midnight-registry/cctv/clerk-counter.png", icon: "fa-box-open", unlockNight: 1, purpose: "检查随身物、柜面和当前门岗。" },
  { channel: 4, label: "电梯厅", image: "/assets/midnight-registry/cctv/elevator-landing.png", icon: "fa-elevator", unlockNight: 1, purpose: "检查电梯行为与不存在楼层。" },
  { channel: 5, label: "污染档案室", image: "/assets/midnight-registry/cctv/archive-room.png", icon: "fa-box-archive", unlockNight: 5, purpose: "观察自行移动和改写的档案卡。" },
  { channel: 6, label: "不可能楼梯间", image: "/assets/midnight-registry/cctv/impossible-stairwell.png", icon: "fa-stairs", unlockNight: 6, purpose: "证明六楼以上仍出现楼梯。" },
  { channel: 7, label: "蓝星维修车辆", image: "/assets/midnight-registry/cctv/blue-star-van.png", icon: "fa-truck", unlockNight: 6, purpose: "核对车辆、车牌和工单年代。" },
  { channel: 8, label: "安保岗亭", image: "/assets/midnight-registry/cctv/security-booth.png", icon: "fa-shield-halved", unlockNight: 7, purpose: "确认安保失联和最终封锁状态。" },
];

export const tutorialStepsByVisitor: Record<string, TutorialStep[]> = {
  "d1-lin-fake": [
    { action: "document:identity", objective: "打开她递来的住户证件。", hint: "先看纸面身份。", strongHint: "点击“住户证件”。" },
    { action: "view:archive", objective: "打开住户档案。", hint: "203 室应该有正式档案。", strongHint: "点击“档案”标签。" },
    { action: "compare:id", objective: "比较证件姓名与档案姓名。", hint: "选择一项字段进行对照。", strongHint: "点击档案里的“姓名对比”。" },
    { action: "evidence:id", objective: "把姓名差异盖到证据板上。", hint: "差异还没有进入审批表。", strongHint: "打开登记簿并选择“纸质身份不符”。" },
    { action: "decision:reject", objective: "证据足够，拒绝进入。", hint: "普通证件不符应拒绝。", strongHint: "点击“拒绝进入”。" },
  ],
  "d1-zhou-fake": [
    { action: "document:appearance", objective: "打开前台观察记录。", hint: "这次重点看左右特征。", strongHint: "点击“前台观察记录”。" },
    { action: "view:archive", objective: "打开周启明的档案。", hint: "档案记录了手套戴在哪只手。", strongHint: "点击“档案”标签。" },
    { action: "compare:appearance", objective: "比较现场特征与档案。", hint: "注意左右手。", strongHint: "点击档案里的“外貌对比”。" },
    { action: "evidence:appearance", objective: "标记外貌特征不符。", hint: "把左右差异写入审批表。", strongHint: "选择“外貌特征不符”。" },
    { action: "decision:reject", objective: "拒绝这个普通身份不符者。", hint: "目前没有必须呼叫安保的异常。", strongHint: "点击“拒绝进入”。" },
  ],
  "d1-mina-fake": [
    { action: "tool:phone", objective: "拨打 208 室确认她的位置。", hint: "危险身份需要第二来源。", strongHint: "打开电话交换机并拨打房间。" },
    { action: "save:phone", objective: "保存重复声音作为电话证据。", hint: "电话结果还没有进入证据板。", strongHint: "点击电话结果下的“保存为证据”。" },
    { action: "tool:cctv", objective: "打开 CCTV 检查她的影子。", hint: "复制声音还需要视觉证据。", strongHint: "点击“查看监控”。" },
    { action: "save:cctv", objective: "冻结异常画面并保存。", hint: "点击监控中的可疑区域。", strongHint: "冻结热点后点击“保存截图证据”。" },
    { action: "decision:security", objective: "复制声音与异常影子属于安保级威胁。", hint: "拒绝不能阻止身份覆盖。", strongHint: "点击“呼叫安保”。" },
  ],
};

export function getRequiredEvidenceCount(visitor: Visitor) {
  if (visitor.id === "d1-lin-fake" || visitor.id === "d1-zhou-fake") return 1;
  if (visitor.room === "000" || visitor.expectedAction === "security") return 3;
  if (visitor.isMirror || visitor.expectedAction === "wait") return 2;
  return 1;
}

export function getCctvHotspots(channel: number, visitor: Visitor, night: number): CctvHotspot[] {
  const mirror = visitor.isMirror;
  const shared = (id: string, label: string, text: string, evidence: EvidenceKey[], action: string, x: number, y: number, width: number, height: number): CctvHotspot => ({
    id,
    label,
    text,
    evidence,
    action,
    x,
    y,
    width,
    height,
  });

  if (channel === 1) {
    return [shared(
      "front-silhouette",
      "门前轮廓",
      mirror ? "冻结帧里，来客轮廓比玻璃倒影早移动半秒。" : "轮廓、衣着和到达位置与现场一致。",
      ["appearance"],
      "cctv:front",
      31,
      16,
      38,
      68,
    )];
  }
  if (channel === 2) {
    return [shared(
      "hall-shadow",
      "影子方向",
      mirror ? "影子正朝光源延伸，方向不可能成立。" : "影子自然落向楼梯间。",
      ["appearance"],
      "cctv:shadow",
      10,
      48,
      72,
      34,
    )];
  }
  if (channel === 3) {
    return [shared(
      "counter-object",
      night === 7 && visitor.room === "000" ? "当前门岗" : "柜面物品",
      night === 7 && visitor.room === "000"
        ? "前台监控仍拍到你坐在桌内，门外的第二个薛夜没有对应倒影。"
        : mirror
          ? "随身物的搭扣、封条或反光与档案不一致。"
          : "柜面物品与档案备注一致。",
      night === 7 && visitor.room === "000" ? ["ledger", "appearance"] : ["appearance"],
      night === 7 && visitor.room === "000" ? "cctv:clerk" : "cctv:counter",
      30,
      28,
      45,
      50,
    )];
  }
  if (channel === 4) {
    return [shared(
      "elevator-display",
      "楼层显示",
      mirror ? "电梯指示器短暂显示 7F；月影公寓只有六层。" : "电梯停在一楼，没有异常呼叫。",
      ["rules", "appearance"],
      "cctv:elevator",
      38,
      9,
      27,
      23,
    )];
  }
  if (channel === 5) {
    return [shared(
      "archive-card",
      "移动档案卡",
      "无人进入时，一张住户卡自行翻页并换到另一只抽屉。",
      ["ledger"],
      "cctv:archive",
      35,
      25,
      36,
      48,
    )];
  }
  if (channel === 6) {
    return [shared(
      "extra-landing",
      "第七层平台",
      "六楼之上仍有一段向上的楼梯，平台号码被刮成 7。",
      ["rules", "appearance"],
      "cctv:stairwell",
      23,
      12,
      52,
      64,
    )];
  }
  if (channel === 7) {
    return [shared(
      "van-plate",
      "车辆年份",
      "蓝星车辆的车牌和年检贴属于十二年前，与今晚工单矛盾。",
      ["appointment", "schedule"],
      "cctv:blue-star",
      28,
      47,
      48,
      34,
    )];
  }
  return [shared(
    "security-booth",
    "安保岗亭",
    visitor.room === "000"
      ? "岗亭空无一人，警报灯却在按你的心跳节奏闪烁。"
      : "安保线路无人回应，封锁开关仍处于待命状态。",
    ["phone", "rules"],
    "cctv:security",
    20,
    18,
    60,
    62,
  )];
}

export function getDecisionEvidenceWarning(decision: Decision, current: number, required: number) {
  if (current >= required) return null;
  if (decision === "security") return `安保建议至少 ${required} 条证据；当前只有 ${current} 条。`;
  return `本案建议至少 ${required} 条证据；直接盖章可能造成误判。`;
}
