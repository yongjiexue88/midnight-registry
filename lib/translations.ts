import { useI18nStore, Language } from "./i18n";

type TranslationDictionary = {
  [key: string]: string;
};

const en: TranslationDictionary = {
  // Visitor Types
  "visitor.resident": "Resident",
  "visitor.visitor": "Registered visitor",
  "visitor.maintenance": "Maintenance",
  "visitor.courier": "Courier",
  "visitor.emergency": "Emergency staff",
  "visitor.clerk": "Desk staff",

  // Decisions
  "decision.allow": "Allow entry",
  "decision.reject": "Refuse entry",
  "decision.security": "Call security",
  "decision.wait": "Hold / wait",

  // Checklist
  "checklist.documents": "Paper identity checked",
  "checklist.archive": "Archive reality matched",
  "checklist.phone": "Social identity confirmed",
  "checklist.appearance": "Appearance compared",
  "checklist.rules": "Night rules reviewed",
  "checklist.ledger": "Entry log checked",

  // Evidence
  "evidence.id": "Paper identity mismatch",
  "evidence.id.detail": "Printed identity, badge, checksum, or room number does not line up.",
  "evidence.appearance": "Appearance mismatch",
  "evidence.appearance.detail": "Face, feature side, carried item, clothing, or camera view contradicts the archive.",
  "evidence.schedule": "Schedule conflict",
  "evidence.schedule.detail": "Arrival, curfew, shift, or already-inside timing is impossible.",
  "evidence.phone": "Social identity conflict",
  "evidence.phone.detail": "Room, employer, management, or neighbor call contradicts the claim.",
  "evidence.behavior": "Unrecorded memory failure",
  "evidence.behavior.detail": "Habit answer, greeting, speech pattern, or private routine is wrong.",
  "evidence.rules": "Rule violation",
  "evidence.rules.detail": "Tonight's notice blocks this entrant or requires escalation.",
  "evidence.appointment": "Appointment mismatch",
  "evidence.appointment.detail": "Visitor, courier, maintenance, company, time, room, or work order is wrong.",
  "evidence.ledger": "Reality ledger conflict",
  "evidence.ledger.detail": "Today's in/out record conflicts with the person at the glass.",

  // UI labels
  "ui.toggleLang": "EN / 中文",
  "ui.desk.documents": "Documents",
  "ui.desk.archive": "Archive",
  "ui.desk.notice": "Notice",
  "ui.desk.ledger": "Ledger",
  "ui.tools.phoneLocked": "Phone locked",
  "ui.tools.phoneCall": "Call",
  "ui.tools.phone": "Phone",
  "ui.tools.scanner": "Scan ID",
  "ui.tools.camera": "Camera",
  "ui.tools.question": "Question",
  "ui.history.empty": "No entries tonight.",
  "ui.game.over": "Shift Complete",
};

const zh: TranslationDictionary = {
  // Visitor Types
  "visitor.resident": "住户",
  "visitor.visitor": "登记访客",
  "visitor.maintenance": "维修人员",
  "visitor.courier": "快递员",
  "visitor.emergency": "急救人员",
  "visitor.clerk": "前台职员",

  // Decisions
  "decision.allow": "允许进入",
  "decision.reject": "拒绝进入",
  "decision.security": "呼叫安保",
  "decision.wait": "暂时留置 / 等待",

  // Checklist
  "checklist.documents": "纸质身份已核对",
  "checklist.archive": "档案记录已比对",
  "checklist.phone": "社会关系已确认",
  "checklist.appearance": "外貌特征已对比",
  "checklist.rules": "夜间规定已复核",
  "checklist.ledger": "出入登记已检查",

  // Evidence
  "evidence.id": "纸质身份不符",
  "evidence.id.detail": "打印身份、工牌、校验码或房号对不上。",
  "evidence.appearance": "外貌特征不符",
  "evidence.appearance.detail": "面部、特征位置、随身物品、衣着或监控画面与档案矛盾。",
  "evidence.schedule": "行程时间冲突",
  "evidence.schedule.detail": "到达时间、宵禁、班次或已在楼内的时间逻辑不通。",
  "evidence.phone": "社会关系冲突",
  "evidence.phone.detail": "房间、雇主、物业或邻居的通话记录与来访者说辞矛盾。",
  "evidence.behavior": "未记录的记忆错误",
  "evidence.behavior.detail": "习惯回答、问候方式、语言模式或私人习惯错误。",
  "evidence.rules": "违反夜间规定",
  "evidence.rules.detail": "今夜的通知禁止此人进入，或要求升级处理。",
  "evidence.appointment": "预约信息不符",
  "evidence.appointment.detail": "访客、快递、维修、公司、时间、房间或工单信息有误。",
  "evidence.ledger": "现实登记薄冲突",
  "evidence.ledger.detail": "今日的进出记录与玻璃前的人矛盾。",

  // UI labels
  "ui.toggleLang": "EN / 中文",
  "ui.desk.documents": "证件",
  "ui.desk.archive": "档案",
  "ui.desk.notice": "通知",
  "ui.desk.ledger": "登记薄",
  "ui.tools.phoneLocked": "电话已断线",
  "ui.tools.phoneCall": "致电",
  "ui.tools.phone": "电话",
  "ui.tools.scanner": "扫描证件",
  "ui.tools.camera": "查看监控",
  "ui.tools.question": "提问",
  "ui.history.empty": "今晚尚无记录。",
  "ui.game.over": "换班结束",
};

const dictionaries: Record<Language, TranslationDictionary> = { en, zh };

export function useTranslation() {
  const language = useI18nStore((state) => state.language);
  const toggleLanguage = useI18nStore((state) => state.toggleLanguage);

  const t = (key: string): string => {
    return dictionaries[language][key] || key;
  };

  return { t, language, toggleLanguage };
}
