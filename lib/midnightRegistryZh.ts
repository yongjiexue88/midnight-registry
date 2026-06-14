import type {
  Appointment,
  EntryLog,
  EvidenceKey,
  Resident,
  Visitor,
} from "@/data/midnightRegistryData";

export type ChineseNight = {
  title: string;
  subtitle: string;
  briefing: string;
  rules: string[];
};

type VisitorCopy = Pick<
  Visitor,
  | "name"
  | "job"
  | "reason"
  | "eyes"
  | "hair"
  | "feature"
  | "clothing"
  | "voice"
  | "behavior"
  | "badge"
  | "clues"
  | "phone"
  | "scanner"
  | "camera"
  | "question"
> & {
  specialEvent?: Visitor["specialEvent"];
};

const residentCopies: Record<string, Resident> = {
  "lin-anna": {
    id: "lin-anna",
    name: "林安娜",
    room: "203",
    job: "舞蹈教师",
    idCode: "7821-44",
    eyes: "棕色",
    hair: "黑色短发，左分",
    feature: "左眼下方有痣",
    habit: "通常在 21:00 前回楼",
    forbidden: "从不穿红色",
    greeting: "会在柜台上快速敲两段节拍",
  },
  "zhou-qiming": {
    id: "zhou-qiming",
    name: "周启明",
    room: "506",
    job: "退休警员",
    idCode: "5060-18",
    eyes: "深棕色",
    hair: "银灰色寸头",
    feature: "右手戴黑手套",
    habit: "回答一向简短",
    forbidden: "绝不会说自己忘带钥匙",
    greeting: "不笑，只点一次头",
  },
  "li-mei": {
    id: "li-mei",
    name: "李梅",
    room: "302",
    job: "花店店员",
    idCode: "3029-71",
    eyes: "榛色",
    hair: "低发髻，额前有碎发",
    feature: "左手腕戴银手链",
    habit: "从不乘电梯",
    forbidden: "不接受“李阿姨”这个称呼",
    greeting: "每周三会带花回来",
  },
  "chen-rui": {
    id: "chen-rui",
    name: "陈睿",
    room: "410",
    job: "急诊医生",
    idCode: "4108-02",
    eyes: "黑色",
    hair: "整齐侧分",
    feature: "左眉有一道细疤",
    habit: "经常值通宵班",
    forbidden: "最后一夜不应回楼",
    greeting: "开口前会先报当天日期",
  },
  "zhao-jun": {
    id: "zhao-jun",
    name: "赵峻",
    room: "104",
    job: "会计",
    idCode: "1042-33",
    eyes: "棕色",
    hair: "整齐中分",
    feature: "圆框金属眼镜",
    habit: "总带着皮质文件夹",
    forbidden: "从不带动物进楼",
    greeting: "进门前会先问邮件登记簿",
  },
  "wang-yulan": {
    id: "wang-yulan",
    name: "王玉兰",
    room: "601",
    job: "退休图书管理员",
    idCode: "6011-29",
    eyes: "灰色",
    hair: "白色长辫搭在右肩",
    feature: "月牙柄黄铜手杖",
    habit: "在前台只说普通话",
    forbidden: "从不提“七楼”",
    greeting: "会把旧钥匙推过柜台",
  },
  "mina-park": {
    id: "mina-park",
    name: "朴米娜",
    room: "208",
    job: "美术系学生",
    idCode: "2087-65",
    eyes: "绿色",
    hair: "铜红色短发",
    feature: "沾有颜料的蓝围巾",
    habit: "在登记簿上画星号签名",
    forbidden: "在室外从不摘围巾",
    greeting: "总会先为手上的颜料道歉",
  },
  "sun-hao": {
    id: "sun-hao",
    name: "孙浩",
    room: "315",
    job: "夜班厨师",
    idCode: "3154-90",
    eyes: "棕色",
    hair: "两侧剃短",
    feature: "右手拇指有小块烫伤",
    habit: "身上有淡淡蒜油味",
    forbidden: "敲门绝不超过三下",
    greeting: "会给前台留一个纸包包子",
  },
  "guo-lan": {
    id: "guo-lan",
    name: "郭岚",
    room: "402",
    job: "裁缝",
    idCode: "4025-12",
    eyes: "黑色",
    hair: "长辫高高盘起",
    feature: "脖子上挂着软尺",
    habit: "看见歪领子会顺手纠正",
    forbidden: "从不穿宽松袖口",
    greeting: "称这栋楼为旧名“银月公馆”",
  },
  "owen-xu": {
    id: "owen-xu",
    name: "徐欧文",
    room: "502",
    job: "小提琴手",
    idCode: "5026-88",
    eyes: "蓝色",
    hair: "深色卷发",
    feature: "银色搭扣的小提琴盒",
    habit: "说话前会先轻哼一声",
    forbidden: "绝不让别人替他拿琴盒",
    greeting: "总问 303 室有没有投诉琴声",
  },
};

const nameCopies: Record<string, string> = {
  "Lin Anna": "林安娜",
  "Lin Anya": "林安雅",
  "Zhou Qiming": "周启明",
  "Li Mei": "李梅",
  "Chen Rui": "陈睿",
  "Zhao Jun": "赵峻",
  "Wang Yulan": "王玉兰",
  "Mina Park": "朴米娜",
  "Sun Hao": "孙浩",
  "Guo Lan": "郭岚",
  "Owen Xu": "徐欧文",
  "Han Dong": "韩东",
  "Rina Sol": "莉娜·索尔",
  "Ke Ren": "柯仁",
  "Noah Xu": "徐诺亚",
  "Y. Xue": "薛夜",
  "Archive Lin Anna": "档案中的林安娜",
  "Mirror Visitor": "镜像访客",
  "Banned name: The Smiler": "禁入者：笑面人",
  "Unknown": "无名者",
  "False Tenant": "伪住户",
  "Visitor with dog": "牵狗访客",
  "Archive Clerk": "档案员",
  "Seventh-floor Impostor": "七楼冒名者",
  "Clerk Duplicate": "前台复制体",
  "Unknown courier": "身份不明的快递员",
};

const roleCopies: Record<string, string> = {
  "Dance Teacher": "舞蹈教师",
  "Retired Police Officer": "退休警员",
  Florist: "花店店员",
  "Emergency Doctor": "急诊医生",
  Accountant: "会计",
  "Retired Librarian": "退休图书管理员",
  "Art Student": "美术系学生",
  "Night Cook": "夜班厨师",
  Tailor: "裁缝",
  Violinist: "小提琴手",
  "Maintenance Contractor": "维修承包商",
  Courier: "快递员",
  "Owen's brother": "自称徐欧文的兄弟",
  "Night Door Clerk": "夜班门岗",
};

const caseCopies: Record<string, Partial<VisitorCopy>> = {
  "d1-lin-real": {
    reason: "晚间排练结束回家",
    clothing: "米色外套，黑色舞蹈包",
    voice: "声音轻柔，小声数着拍子",
    behavior: "在柜台上快速敲了两段节拍",
    clues: ["姓名、房号、证件与外貌全部一致。", "敲击习惯与住户档案一致。"],
    phone: "203 室响了四声后接通：“对，是我在楼下。”",
    scanner: "证件 7821-44 校验通过。",
    camera: "监控确认痣在左眼下方。",
    question: "她立刻拒绝红色雨伞，说红色会毁掉她的运气。",
  },
  "d1-lin-fake": {
    reason: "声称排练拖延，回来晚了",
    hair: "黑色短发，右分",
    feature: "右眼下方有痣",
    clothing: "红色雨衣，没有舞蹈包",
    voice: "连续两次重复“有人等我”",
    behavior: "只敲了一段缓慢节拍",
    clues: ["姓名多了一个字。", "痣的位置左右相反。", "林安娜从不穿红色。"],
    phone: "203 室从楼内响起，听筒里的第二个声音与门外的人同步低语。",
    scanner: "号码有效，但证件姓名印着“林安雅”。",
    camera: "她的影子朝着走廊灯光延伸。",
    question: "她说红色是自己最喜欢的演出服颜色。",
  },
  "d1-zhou-real": {
    reason: "打牌结束回家",
    clothing: "熨得笔挺的灰色大衣",
    voice: "低沉，回答简短",
    behavior: "不笑，只点了一次头",
    clues: ["右手黑手套与档案一致。", "简短回答符合他的习惯。"],
    phone: "506 室：“让他上来。”随即挂断。",
    scanner: "证件 5060-18 校验通过。",
    camera: "监控角度确认黑手套戴在右手。",
    question: "问到钥匙时，他只回答：“口袋里。”",
  },
  "d1-zhou-fake": {
    reason: "声称把钥匙忘在楼上",
    feature: "左手戴黑手套",
    clothing: "袖口湿透的灰色大衣",
    voice: "异常热情，解释冗长",
    behavior: "回答每个问题时都在微笑",
    clues: ["手套戴错了手。", "他声称忘带钥匙。", "说话方式不像周启明。"],
    phone: "506 室用周启明短促的声音回答：“我在屋里。”",
    scanner: "证件干净无误，但温度比台灯还高。",
    camera: "他敲玻璃时，左手套没有随手指移动。",
    question: "他讲了一大段丢钥匙的故事，与档案习惯相反。",
  },
  "d1-mina-real": {
    reason: "画室课程结束回楼",
    clothing: "黑色外套，手指沾着颜料",
    voice: "气喘吁吁，不停道歉",
    behavior: "在登记簿上画了一个星号",
    clues: ["蓝围巾与星号签名一致。", "证件和房号与档案一致。"],
    phone: "208 室无人接听；档案显示她此时通常还在画室。",
    scanner: "证件 2087-65 校验通过。",
    camera: "南侧监控拍到沾有颜料的蓝围巾。",
    question: "她说自己在室外从不会摘下围巾。",
  },
  "d1-mina-fake": {
    reason: "想上楼取回速写本",
    feature: "没有围巾，双手干净",
    clothing: "蓝围巾折好放在口袋里",
    voice: "语气过于平稳，听不见呼吸",
    behavior: "在登记簿上画圆圈时，房间线路同步重复她的声音",
    clues: ["房号错误。", "房间电话与门外来客同时说话。", "走廊监控连续三帧无法记录她的影子。"],
    phone: "208 室在门外来客说话时同步接通。两个声音停止后，第二只听筒仍在呼吸。",
    scanner: "证件号码有效，但工牌房号是 280。",
    camera: "她的影子消失三帧，再出现时朝向灯光。",
    question: "她知道星号签名，却说不出围巾上是哪种颜料。",
  },
  "d1-guo-real": {
    reason: "为客户量体结束后回楼",
    clothing: "合身外套，窄袖口",
    voice: "尖锐而疲惫",
    behavior: "顺手扶正了柜台假人歪掉的衣领",
    clues: ["裁缝习惯与窄袖口吻合。", "证件和房号与档案一致。"],
    phone: "402 室无人接听，但走廊监控能听见工作室的收音机。",
    scanner: "证件 4025-12 校验通过。",
    camera: "软尺与盘起的长辫均与档案一致。",
    question: "她称这栋楼为旧名“银月公馆”。",
  },
  "d1-owen-fake": {
    reason: "声称 303 室投诉了练琴声",
    feature: "琴盒搭扣是黄铜色",
    clothing: "深蓝色长围巾",
    voice: "说完话才开始哼歌",
    behavior: "主动让你替他把琴盒拿上楼",
    clues: ["证件号码错了一位。", "琴盒搭扣应为银色。", "徐欧文绝不让别人拿琴盒。"],
    phone: "502 室先传来一个琴音，随后有人说：“我的琴盒就在我手边。”",
    scanner: "证件 5026-89 校验失败。",
    camera: "琴盒搭扣反射出黄铜色，不是银色。",
    question: "他让你代拿琴盒，真正的徐欧文绝不会这样做。",
  },
  "d2-han-real": {
    reason: "维修四楼配电箱",
    feature: "蓝星维修臂章",
    clothing: "工具背心，工具箱封条完整",
    voice: "专业，但有些不耐烦",
    behavior: "准确说出四楼断路器的位置",
    clues: ["姓名、公司、时间和施工位置均与预约一致。", "四楼电箱维修获准进入。"],
    phone: "物业确认 20:30 的蓝星维修工单，随后线路混入十二年前的雨声。",
    scanner: "承包商通行证 BSR-443 与登记一致。",
    camera: "工具箱封条与通知照片一致。",
    question: "他说工单里根本没有七楼。",
  },
  "d2-han-fake": {
    reason: "维修高层线路",
    feature: "蓝心维修臂章",
    clothing: "空工具箱，手套干净得反常",
    voice: "隔着口罩低声说话",
    behavior: "坚持说七楼正在等他",
    clues: ["公司名称错误。", "到达时间错误。", "大楼没有七楼。", "蓝星维修十二年前已注销，但今晚的工单仍在打印它的名字。"],
    phone: "物业线路已死，听筒里的湿敲击声一下一下拼出“蓝星”。",
    scanner: "通行证号码存在，但公司印章写着“蓝心维修”，签发日期是十二年前。",
    camera: "工具箱打开后里面只有黑布，没有工具。",
    question: "无论问什么，他都会在回答末尾重复“七楼”。",
  },
  "d2-li-real": {
    reason: "带花回家",
    clothing: "绿色雨披，抱着包好的百合",
    voice: "语气温和，明确拒绝乘电梯",
    behavior: "没等询问就走向楼梯",
    clues: ["手链、时间和带花习惯一致。", "她主动拒绝乘电梯。"],
    phone: "302 室无人接听；楼梯监控拍到她正在上楼。",
    scanner: "证件 3029-71 校验通过。",
    camera: "左手腕的银手链在楼梯灯下反光。",
    question: "你称她“李阿姨”时，她皱眉纠正为“李女士”。",
  },
  "d2-li-fake": {
    reason: "要求你替她按住电梯",
    feature: "右手腕戴银手链",
    clothing: "绿色雨披，抱着塑料玫瑰",
    voice: "自称“李阿姨”",
    behavior: "不停按电梯按钮",
    clues: ["手链戴错了手。", "李梅从不乘电梯。", "她不会接受“李阿姨”的称呼。"],
    phone: "302 室传来困倦的声音：“我已经走楼梯上来了。”",
    scanner: "证件无误，但卡片玻璃从内部起雾。",
    camera: "电梯监控里，她的倒影晚了一秒才出现。",
    question: "被称作“李阿姨”时，她笑着答应。",
  },
  "d2-courier": {
    reason: "宵禁后送来 302 室的密封药品包裹",
    eyes: "棕色",
    hair: "头盔面罩未掀起",
    feature: "月影快递药品箱",
    clothing: "黄色快递外套",
    voice: "听起来是普通人，但很着急",
    behavior: "不断回头查看街道",
    clues: ["快递员身份真实。", "宵禁后的快递必须留置在前台。", "登记包裹是送往 302 室的药品。"],
    phone: "302 室无人接听；物业要求把密封包裹留在前台。",
    scanner: "快递证 MC-210 有效，并与药品包裹绑定。",
    camera: "街道监控显示一辆正常的快递摩托。",
    question: "她愿意把包裹留在前台，等待房间回电。",
  },
  "d2-zhao-real": {
    reason: "办公室审计结束后发现忘带钥匙",
    clothing: "腋下夹着皮质文件夹",
    voice: "疲惫但措辞精确",
    behavior: "主动询问邮件登记簿",
    clues: ["忘带钥匙已通过电话确认。", "文件夹和登记簿习惯一致。"],
    phone: "104 室：“门口的是我。问他邮件登记簿。”",
    scanner: "证件 1042-33 校验通过。",
    camera: "皮质文件夹清楚夹在他腋下。",
    question: "你还没提，他就先问起邮件登记簿。",
  },
  "d2-wang-real": {
    reason: "从庙会集市回楼",
    clothing: "深紫色外套",
    voice: "只说普通话",
    behavior: "把旧钥匙推过柜台",
    clues: ["住户可正常进入。", "六楼维修禁令不针对住户。"],
    phone: "601 室传来水壶鸣响，随后一片安静。",
    scanner: "证件 6011-29 校验通过。",
    camera: "手杖月牙柄与档案一致。",
    question: "她指向 601，拒绝谈论其他楼层。",
  },
  "d2-maintenance-6f": {
    reason: "检查六楼通风口",
    eyes: "黑色",
    hair: "戴着雨帽",
    feature: "没有任何公司臂章",
    clothing: "湿透的维修外套",
    voice: "天花板扬声器先于他本人发出声音",
    behavior: "台灯下没有影子",
    clues: ["没有预约。", "今晚暂停所有六楼维修。", "没有公司标识。", "门口监控连续三帧拍不到身体。"],
    phone: "601 室接起电话：“别让任何人上我这层。”",
    scanner: "临时通行证没有签发方。",
    camera: "走廊监控连续三帧只拍到空门口。",
    question: "他说通风口饿了。",
  },
  "d3-chen-fake": {
    reason: "声称从医院提前回家",
    feature: "右眉有一道细疤",
    clothing: "干净白大褂，没有医院工牌",
    voice: "报出的是昨天日期",
    behavior: "说不出自己所在病区",
    clues: ["陈睿正在值通宵班。", "疤痕在错误的眉毛上。", "他报错了日期。"],
    phone: "医院线路：“陈医生正在手术。不要开门。”",
    scanner: "证件有效，但照片上的疤在左眉。",
    camera: "门外访客的疤在右眉。",
    question: "他说不出病区，只会重复昨天的日期。",
  },
  "d3-sun-real": {
    reason: "夜班提前结束",
    clothing: "厨师服，手里拿着纸包包子",
    voice: "被厨房烟气熏得沙哑",
    behavior: "正好敲了三下门",
    clues: ["烫伤、敲门次数和食物习惯一致。", "到达时间早于强制电话核验时段。"],
    phone: "315 室无人接听；门厅麦克风记录到恰好三下敲门声。",
    scanner: "证件 3154-90 校验通过。",
    camera: "他举起包子时，右拇指烫伤清晰可见。",
    question: "他给前台留下了一个纸包包子。",
  },
  "d3-mina-fake": {
    reason: "想在作品讲评前回来睡一觉",
    clothing: "黑色外套，双手干净得反常",
    voice: "问题还没说完就抢先回答",
    behavior: "画下星号后又把它擦掉",
    clues: ["电话确认朴米娜已经在楼上。", "画室课后双手不应如此干净。", "星号签名被擦除了。"],
    phone: "208 室低声说：“我已经在房里。它学会星号了。”",
    scanner: "证件校验通过。",
    camera: "围巾正确，但她停手后倒影仍在作画。",
    question: "她知道星号答案，却在墨迹未干时把它擦掉。",
  },
  "d3-lin-real": {
    reason: "列车故障，已提前打电话说明晚归",
    clothing: "米色外套，黑色舞蹈包",
    voice: "轻声数着五、六、七、八",
    behavior: "在柜台上快速敲了两段节拍",
    clues: ["电话确认列车延误。", "没有红色衣物，所有档案字段一致。"],
    phone: "203 室：“列车停了。我现在就在前台。问我红色。”",
    scanner: "证件 7821-44 校验通过。",
    camera: "痣、舞蹈包和发缝方向全部一致。",
    question: "她立即拒绝红色访客贴纸。",
  },
  "d3-wang-fake": {
    reason: "要去七楼阅览室",
    hair: "白色长辫搭在左肩",
    clothing: "深紫色外套",
    voice: "用流利英语说：“晚上好，亲爱的。”",
    behavior: "用手杖敲了七下",
    clues: ["大楼没有七楼。", "房号错误。", "王玉兰在前台不会说英语。"],
    phone: "601 室里，王玉兰咳嗽后用普通话说：“不是我。”",
    scanner: "证件属于 601 室，但工牌房号写着 701。",
    camera: "长辫搭在错误的肩膀上。",
    question: "她要求前往七楼阅览室。",
  },
  "d3-guo-fake": {
    reason: "紧急改衣结束回楼",
    clothing: "宽大袖口拖在地上",
    voice: "模仿郭岚尖锐的语调",
    behavior: "完全没注意到你袖口的裂线",
    clues: ["郭岚从不穿宽松袖口。", "她没有表现出整理衣领和袖口的习惯。", "扫描显示工牌在 00:00 被重新打印。"],
    phone: "402 室传来缝纫机声，郭岚说：“我的袖子是窄的。”",
    scanner: "证件有效，但工牌打印时间是午夜。",
    camera: "宽袖拖过雨水，却没有沾湿。",
    question: "她称大楼为“月影公寓”，而不是旧名。",
  },
  "d3-owen-visitor": {
    reason: "来取走徐欧文的小提琴盒",
    feature: "没有访客预约",
    clothing: "与徐欧文相似的深蓝羊毛外套",
    voice: "说完话才开始哼歌",
    behavior: "要求把琴盒带走",
    clues: ["没有访客预约。", "徐欧文绝不让别人拿琴盒。", "电话确认徐欧文就在楼内。"],
    phone: "502 室里，徐欧文说：“我在这座城里没有兄弟。”",
    scanner: "访客证 VIS-502 不在今晚登记中。",
    camera: "502 室内已经能看到小提琴盒。",
    question: "他声称徐欧文让自己来拿琴盒。",
  },
  "d3-rina-hold": {
    reason: "为 302 室送来药品；房间线路暂时无人接听",
    eyes: "棕色",
    hair: "已经掀起头盔面罩",
    feature: "密封完好的月影快递药品箱",
    clothing: "被雨淋透的黄色快递外套",
    voice: "疲惫、普通，只想把包裹留下",
    behavior: "停在警戒线外，同意等待回电",
    clues: ["快递身份和封条有效。", "302 室无人接听。", "宵禁规则要求包裹留置前台。"],
    phone: "302 室无人接听。线路轻响一次后恢复正常拨号音。",
    scanner: "快递证 MC-210 有效，并与密封药品箱绑定。",
    camera: "快递员始终停在警戒线外，影子没有异常。",
    question: "她同意等待，包裹保持密封并留在前台。",
  },
};

const generatedCases: Record<string, { reason: string; clues: string[] }> = {
  "n4-01": { reason: "坚持走楼梯回 302 室", clues: ["拒绝电梯。", "左手腕手链正确。"] },
  "n4-02": { reason: "声称遗失皮质文件夹", clues: ["赵峻从不空手回楼。", "没有询问邮件登记簿。"] },
  "n4-03": { reason: "声称今晚休班", clues: ["排班显示仍在医院值夜。", "日期回答错误。"] },
  "n4-04": { reason: "夜班厨房下班回 315 室", clues: ["带着纸包包子。", "身上有蒜油味。"] },
  "n4-05": { reason: "返回 601 室", clues: ["只说普通话。", "月牙柄手杖一致。"] },
  "n4-06": { reason: "要求你帮忙拿琴盒", clues: ["徐欧文从不把琴盒交给别人。"] },
  "n4-07": { reason: "紧急量体结束回楼", clues: ["主动修正你裂开的袖口。", "使用大楼旧名。"] },
  "n4-08": { reason: "声称演出要求穿红衣", clues: ["林安娜从不穿红色。"] },
  "n4-09": { reason: "自称赵峻的访客，想带狗上楼", clues: ["赵峻从不带动物进楼。", "今晚没有预约。"] },
  "n4-10": { reason: "让你随便替他选一个房间", clues: ["说不出自己的房号。", "每次回答都重复上一句。"] },
  "n4-11": { reason: "画室课程结束回楼", clues: ["双手有颜料。", "星号签名正确。"] },
  "n5-01": { reason: "档案照片正在改变", clues: ["必须先给房间打电话。", "档案照片不断闪烁。"] },
  "n5-02": { reason: "医院批准短暂回楼", clues: ["医院线路确认休息时间。", "实时监控中的眉疤正确。"] },
  "n5-03": { reason: "声称自己是 203 室住户", clues: ["档案与现场照片都被镜像翻转。", "房间电话否认。"] },
  "n5-04": { reason: "返回 601 室", clues: ["证件日期损坏，但手杖与语言习惯一致。"] },
  "n5-05": { reason: "声称执行紧急维修", clues: ["没有维修通知。", "工牌打印时间是 00:00。"] },
  "n5-06": { reason: "投递 302 室药品包裹", clues: ["预约已在登记簿恢复。", "包裹封条一致。"] },
  "n5-07": { reason: "返回 402 室", clues: ["档案说可以进入，但房间电话说本人已在楼上。", "袖口错误。"] },
  "n5-08": { reason: "返回 315 室", clues: ["正好敲三下。", "右拇指烫伤可见。"] },
  "n5-09": { reason: "返回 104 室", clues: ["扫描器损坏。", "房间回电延迟。"] },
  "n5-10": { reason: "申请登记为新住户", clues: ["与禁入名单吻合。", "笑容宽度超出正常范围。"] },
  "n5-11": { reason: "带琴盒返回 502 室", clues: ["琴盒始终没有离手。", "房间电话确认。"] },
  "n5-12": { reason: "声称住在 000 室", clues: ["档案中不存在 000 室住户。"] },
  "n6-01": { reason: "用星号签名证明身份", clues: ["已经学会档案中的习惯。", "倒影里的手仍在作画。"] },
  "n6-02": { reason: "带花走楼梯回家", clues: ["电话、监控和手链三项一致。"] },
  "n6-03": { reason: "用简短回答证明身份", clues: ["回答完美得像背诵。", "黑手套戴在左手。"] },
  "n6-04": { reason: "冒充 315 室住户", clues: ["知道包子习惯，却没有拇指烫伤。"] },
  "n6-05": { reason: "执行蓝星维修预约", clues: ["预约真实，但房间回电无法确认。"] },
  "n6-06": { reason: "投递快递", clues: ["快递证已过期。", "包裹寄往不存在的房间。"] },
  "n6-07": { reason: "医院下班回楼", clues: ["医院工牌和日期一致。"] },
  "n6-08": { reason: "返回 601 室", clues: ["用普通话提到七楼。", "长辫搭在错误肩膀。"] },
  "n6-09": { reason: "量体结束回楼", clues: ["没被提醒就先纠正了你的袖口。"] },
  "n6-10": { reason: "返回 502 室", clues: ["说完话才哼歌。", "琴盒是黄铜搭扣。"] },
  "n6-11": { reason: "送来一份新档案", clues: ["档案照片是你。", "没有任何预约。"] },
  "n6-12": { reason: "夜班厨房下班回楼", clues: ["右拇指烫伤与三下敲门都正确。"] },
  "n6-13": { reason: "排练结束回楼", clues: ["换了几种问题后，所有私人习惯仍然一致。"] },
  "n7-01": { reason: "返回 203 室", clues: ["真实住户，记得第一夜未写入档案的细节。"] },
  "n7-02": { reason: "返回 506 室", clues: ["右手手套与房间电话一致。"] },
  "n7-03": { reason: "维修七楼设备", clues: ["楼层不存在。", "与危险名单吻合。"] },
  "n7-04": { reason: "声称住在 203 室", clues: ["第一夜出现过的左右颠倒特征再次出现。"] },
  "n7-05": { reason: "返回 601 室", clues: ["旧钥匙与语言习惯一致。"] },
  "n7-06": { reason: "申请登记为新住户", clues: ["第一夜之前从未存在这份住户档案。"] },
  "n7-07": { reason: "送来最后一份药品包裹", clues: ["身份真实，但必须留置至结算完成。"] },
  "n7-08": { reason: "声称接替 000 号夜班", clues: ["所有纸面证件都正确。", "今晚没有换班。", "监控中没有影子。", "薛夜已登记为当班。", "工牌背面有禁止登记第二个自己的警告。"] },
};

export const chineseNights: ChineseNight[] = [
  {
    title: "第一夜",
    subtitle: "档案看起来一切正常",
    briefing: "你是月影公寓新来的临时夜班门岗。物业只留下一句话：印章不是开门许可，而是在登记谁有资格成为“真实住户”。",
    rules: ["20:00 后只允许名单内住户进入。", "无证件者一律拒绝。", "照片与现场特征冲突时，以人工核验为准。", "纸面身份与生活习惯矛盾时，不得盖章登记。"],
  },
  {
    title: "第二夜",
    subtitle: "外部系统也会说谎",
    briefing: "蓝星维修出现在今夜工单里，但工商旧档显示它十二年前就已注销。有人正在用过期记录替不存在的入口铺路。",
    rules: ["22:00 后外卖不得进楼。", "今晚暂停所有六楼维修。", "忘带钥匙必须通过房间电话确认。", "21:00 后出现的蓝星维修必须取得第二来源证明。"],
  },
  {
    title: "第三夜",
    subtitle: "同一个人出现在两处",
    briefing: "复制体已经学会证件和习惯。真正的住户可能正在楼上接电话，而另一个“他”正站在玻璃外等你把错误写成现实。",
    rules: ["22:30 后到达者必须致电房间。", "若房间确认本人已在楼内，门外来客必须拒绝。", "同一声音同时出现在电话与门外，立即呼叫安保。", "同一身份不得同时登记在两个位置。"],
  },
  {
    title: "第四夜",
    subtitle: "住户的私人习惯",
    briefing: "完美证件开始失去意义。没有写进档案的问候、关系和小动作，反而成了最可靠的身份证明。",
    rules: ["证件完全匹配时，也必须追问一个私人习惯。", "行为矛盾优先于干净的扫描结果。", "未登记宠物不得进入。", "未记录记忆是复制体最难伪造的部分。"],
  },
  {
    title: "第五夜",
    subtitle: "被污染的档案",
    briefing: "档案会在你阅读时改写：痣的位置翻转，住户状态变成“从未居住”。从今晚起，档案本身也可能是证人或凶手。",
    rules: ["损坏档案不能单独作为证据。", "档案墨迹移动时，必须交叉核验电话和监控。", "扫描时间戳可识别重印工牌。", "物业说法可能与可靠的人证冲突。"],
  },
  {
    title: "第六夜",
    subtitle: "它们学会了你的流程",
    briefing: "复制体开始记住你最常问的问题、最常看的摄像头和最依赖的工具。重复流程越多，伪造就越完美。",
    rules: ["不得只依赖一个习惯答案。", "必须轮换提问方式。", "午夜后的完美回答本身就是异常。", "涉及你本人的监控证据必须与出入簿交叉核验。"],
  },
  {
    title: "第七夜",
    subtitle: "等待替换的前台",
    briefing: "你的档案状态变成“等待替换”。今夜会有第二个薛夜带着完整证件来换班；只要你给他盖章，就会有一个你被系统删除。",
    rules: ["000 室不是有效住户房间。", "今晚没有任何换班安排。", "真正的前台已经登记为当班。", "不得登记第二个自己。"],
  },
];

export const chineseAppointments: Appointment[] = [
  { name: "韩东", company: "蓝星维修", room: "4 楼", time: "20:30", task: "维修四楼配电箱" },
  { name: "莉娜·索尔", company: "月影快递", room: "前台", time: "21:10", task: "投递 302 室密封药品包裹" },
];

export const chineseEntryLogs: Record<number, EntryLog[]> = {
  1: [
    { time: "19:42", subject: "林安娜 / 203", state: "外出", detail: "已登记去排练，尚未回楼。", tone: "clear" },
    { time: "20:36", subject: "周启明 / 506", state: "待归", detail: "打牌结束，应在宵禁前返回。", tone: "clear" },
    { time: "21:00", subject: "朴米娜 / 208", state: "外出", detail: "画室课程登记至 21:30。", tone: "clear" },
    { time: "22:04", subject: "徐欧文 / 502", state: "楼内", detail: "琴盒已登记在楼上，没有取件访客。", tone: "warning" },
    { time: "23:12", subject: "登记簿页边", state: "墨迹移动", detail: "拒绝印章干透后，一行旧住户记录改变了笔画。", tone: "warning" },
  ],
  2: [
    { time: "20:30", subject: "蓝星维修", state: "已预约", detail: "一名维修工获准处理四楼配电箱，公司状态未核实。", tone: "clear" },
    { time: "21:10", subject: "月影快递", state: "已预约", detail: "302 室药品可在宵禁后留置前台。", tone: "clear" },
    { time: "21:40", subject: "六楼维修", state: "暂停", detail: "通风、电路及管道施工均不得进入六楼。", tone: "danger" },
    { time: "22:18", subject: "赵峻 / 104", state: "外出", detail: "物业电话备注确认办公室审计延迟。", tone: "clear" },
    { time: "23:31", subject: "蓝星旧档", state: "已注销", detail: "工商旧档显示蓝星维修十二年前已解散。", tone: "warning" },
  ],
  3: [
    { time: "19:20", subject: "陈睿 / 410", state: "医院值班", detail: "提前回楼必须取得医院确认。", tone: "warning" },
    { time: "22:52", subject: "朴米娜 / 208", state: "已在楼内", detail: "若第二个朴米娜出现，即构成身份冲突。", tone: "danger" },
    { time: "23:20", subject: "王玉兰 / 601", state: "已在楼内", detail: "旧钥匙已登记，大楼不存在七楼目的地。", tone: "danger" },
    { time: "23:58", subject: "前台传真", state: "异常通知", detail: "机器吐出一张 03:00 换班单，物业否认签发。", tone: "danger" },
    { time: "23:59", subject: "前台监控", state: "丢失一帧", detail: "缺失画面恢复前，椅子上短暂出现另一个门岗轮廓。", tone: "danger" },
  ],
  4: [
    { time: "20:12", subject: "李梅 / 302", state: "仅走楼梯", detail: "今日没有电梯请求。", tone: "clear" },
    { time: "21:40", subject: "赵峻 / 104", state: "审计中", detail: "必须携带皮质文件夹并核对邮件登记簿。", tone: "clear" },
    { time: "22:50", subject: "孙浩 / 315", state: "外出", detail: "预计在宵禁前带纸包包子回楼。", tone: "clear" },
    { time: "23:15", subject: "宠物核验", state: "宵禁规则", detail: "所有夜间来访宠物都必须核对档案。", tone: "warning" },
  ],
  5: [
    { time: "20:00", subject: "档案同步", state: "污染", detail: "检测到数据库污染，第 2、4 区损坏。", tone: "danger" },
    { time: "21:10", subject: "月影快递", state: "已预约", detail: "302 室药品包裹预计送至前台。", tone: "clear" },
    { time: "22:30", subject: "周启明 / 506", state: "外出", detail: "钥匙问题未解决，需要人工核验。", tone: "warning" },
    { time: "23:40", subject: "物业线路", state: "闪断", detail: "电压下降，交换机结果可能不可靠。", tone: "warning" },
  ],
  6: [
    { time: "19:50", subject: "邻居警告", state: "被篡改", detail: "建议使用住户关系交叉核验。", tone: "warning" },
    { time: "21:05", subject: "扫描器", state: "同步错误", detail: "高频使用后需要重新校准。", tone: "warning" },
    { time: "22:15", subject: "电梯井", state: "异常移动", detail: "停用楼层出现未经安排的移动。", tone: "danger" },
    { time: "23:50", subject: "模仿警报", state: "正在学习", detail: "复制体开始照搬前台的核验步骤。", tone: "danger" },
  ],
  7: [
    { time: "20:00", subject: "全楼宵禁", state: "封锁", detail: "非住户一律不得进入。", tone: "danger" },
    { time: "21:30", subject: "前台状态", state: "等待中", detail: "登记簿显示：等待替换。", tone: "danger" },
    { time: "23:58", subject: "前台班次", state: "无交接", detail: "今晚没有授权接班人。", tone: "danger" },
    { time: "23:59", subject: "薛夜", state: "正在值班", detail: "当前前台已生效，重复盖章会造成身份覆盖。", tone: "danger" },
  ],
};

export const chineseCctvLabels = ["正门", "走廊角度", "前台自身", "电梯厅", "污染档案室", "不可能楼梯间", "蓝星维修车辆", "安保岗亭"];

export function getChineseResident(id?: string) {
  return id ? residentCopies[id] : undefined;
}

export function getChineseName(name: string) {
  return nameCopies[name] ?? name;
}

export function getChineseVisitor(visitor: Visitor): VisitorCopy {
  const resident = getChineseResident(visitor.sourceResidentId);
  const caseCopy = caseCopies[visitor.id] ?? {};
  const generated = generatedCases[visitor.id];
  const isThreat = visitor.isMirror;
  const isHold = visitor.expectedAction === "wait";

  return {
    name: getChineseName(visitor.name),
    job: resident?.job ?? roleCopies[visitor.job] ?? "身份待核验",
    reason: caseCopy.reason ?? generated?.reason ?? "声称自己符合今晚的进入条件",
    eyes: caseCopy.eyes ?? resident?.eyes ?? "台灯下无法辨清",
    hair: caseCopy.hair ?? resident?.hair ?? "不同监控角度中的轮廓不一致",
    feature: caseCopy.feature ?? resident?.feature ?? generated?.clues[0] ?? "现场特征需要人工核验",
    clothing: caseCopy.clothing ?? (isThreat ? "衣着与档案备注存在细微冲突" : "衣着与其声称身份基本相符"),
    voice: caseCopy.voice ?? (isThreat ? "声音会延迟半秒重复" : isHold ? "线路杂音使声音无法确认" : "音色与说话节奏符合记录"),
    behavior: caseCopy.behavior ?? generated?.clues.join(" ") ?? (isThreat ? "行为与生活习惯或今夜规则冲突" : "现场行为未发现明显矛盾"),
    badge: caseCopy.badge ?? (isThreat ? "工牌需要进一步核验" : isHold ? "工牌扫描延迟" : "工牌外观完整"),
    clues: caseCopy.clues ?? generated?.clues ?? (isThreat ? ["至少一项身份来源互相矛盾。"] : ["多项身份来源能够互相印证。"]),
    phone: caseCopy.phone ?? (isThreat ? "房间线路否认门外来客的说法。" : isHold ? "暂时无人接听；线路恢复正常拨号音。" : "房间或预约联系人确认了来客。"),
    scanner: caseCopy.scanner ?? (isThreat ? "扫描返回不一致字段或损坏时间戳。" : isHold ? "扫描延迟，需要第二来源确认。" : "证件扫描通过。"),
    camera: caseCopy.camera ?? (isThreat ? "监控捕捉到姿势、影子或随身物品异常。" : isHold ? "画面闪烁，暂时无法定论。" : "监控与档案备注一致。"),
    question: caseCopy.question ?? (isThreat ? "回答与习惯、行程或楼内规则冲突。" : isHold ? "回答看似合理，但仍需第二来源。" : "私人习惯回答一致。"),
    specialEvent: visitor.specialEvent
      ? {
          label: visitor.specialEvent.label === "Twin Claim"
            ? "双重身份申报"
            : visitor.specialEvent.label === "Injured Resident"
              ? "受伤住户"
              : visitor.specialEvent.label === "Room-Line Mimic"
                ? "房间线路模仿"
                : "紧急封锁",
          detail: visitor.specialEvent.label === "Twin Claim"
            ? "两个相同轮廓同时出现在大厅两端的摄像头里。"
            : visitor.specialEvent.label === "Injured Resident"
              ? "疼痛和疲惫可能让真实住户答错日常问题。"
              : visitor.specialEvent.label === "Room-Line Mimic"
                ? "楼上电话可能被玻璃外同一个复制声音接听。"
                : "无需等待物业，安保可立即响应。",
        }
      : undefined,
  };
}

export function getChineseEntrySignal(visitor: Visitor) {
  if (visitor.room === "000") {
    return "登记簿已经记录薛夜正在值班。第二名前台一旦盖章，其中一个身份会被覆盖。";
  }
  if (visitor.isMirror) {
    return "当前出入记录与门外说法存在冲突。必须至少找到两条相互独立的证据。";
  }
  if (visitor.expectedAction === "wait") {
    return "记录暂时不能证明对方有害，但今夜规则要求先留置并等待第二来源。";
  }
  return "当前出入记录没有发现重复身份，但仍需完成证件、档案与生活细节核验。";
}

export function getChineseHoldInvestigation(
  visitor: Visitor,
  route: "callback" | "cctv" | "reaction",
): { text: string; evidence: EvidenceKey[] } {
  if (route === "callback") {
    if (visitor.isMirror) {
      return {
        text: "留置期间，楼上房间主动回电。听筒里的住户与玻璃外来客同时说出同一句话，但呼吸节奏完全不同。",
        evidence: ["phone", "ledger"],
      };
    }
    if (visitor.expectedAction === "wait") {
      return {
        text: "回拨终于接通：来客身份真实，但房间明确要求人或包裹继续留在前台，直到住户亲自下楼领取。",
        evidence: ["phone", "rules", "appointment"],
      };
    }
    return {
      text: "回拨内容与现有档案一致，没有出现新的身份冲突。",
      evidence: ["phone"],
    };
  }

  if (route === "cctv") {
    if (visitor.isMirror) {
      return {
        text: "你冻结了留置期间的三帧画面：倒影先转头，身体随后才移动；登记簿上的姓名也在同一秒短暂变成两行。",
        evidence: ["appearance", "ledger"],
      };
    }
    if (visitor.expectedAction === "wait") {
      return {
        text: "监控确认来客没有异常动作，但门禁规则仍将其限制在前台区域，不能直接放行。",
        evidence: ["appearance", "rules"],
      };
    }
    return {
      text: "追加监控与档案外貌一致，没有发现新的异常。",
      evidence: ["appearance"],
    };
  }

  if (visitor.isMirror) {
    return {
      text: "你故意沉默。来客开始逐字复述你上一位访客说过的话，却无法回答一个从未写进档案的私人问候。",
      evidence: ["behavior", "schedule"],
    };
  }
  if (visitor.expectedAction === "wait") {
    return {
      text: "来客接受留置，并主动把物品放在前台警戒线外。反应符合真实访客，但仍不能越过今夜规则。",
      evidence: ["behavior", "rules"],
    };
  }
  return {
    text: "对方在等待中保持原有习惯，反应与档案一致。",
    evidence: ["behavior"],
  };
}
