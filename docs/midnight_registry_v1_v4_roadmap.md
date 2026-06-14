# Midnight Registry (午夜登记簿) V1 → V4 设计路线图

## 总体方向

游戏核心应该一直保持这个感觉：
> 玩家坐在一个狭小的夜班门岗室里，手里有很多资料，但每一样资料都可能是真的，也可能是被污染的。玩家必须靠证据链决定谁能进入现实。

所以从 V2 到 V4，不是加“跑图”“战斗”“解谜大地图”，而是加：
- 更多核验方式
- 更多压力来源
- 更多资料冲突
- 更多剧情后果
- 更多可重复玩法

---

## 完成验证（2026-06-14）

以下进度按当前可运行代码、设计系统和素材校验结果记录，不只按文档标记判断：

- [x] **V1 核心循环**：前 3 夜保留 24 个手工访客案例，每夜 8 人，支持允许、拒绝、安保、暂缓四种登记结果。
- [x] **V2 互动增强**：桌面文件切换与重播动画、四类提问卡、四路电话、四路图片化 CCTV、访客等待/紧张/可疑/愤怒/暴露状态、四种决定过场与错误反馈均已接入游戏状态。
- [x] **V3 系统深化**：第五夜档案污染、旧照片/录音/纸条拖放修复、住户关系交叉验证、Story/Challenge/Endless 三套资源限制、电话/扫描/CCTV/门锁故障小游戏、白天准备、带伤住户/双重影像/电话伪装/紧急封锁特殊事件均已接入。
- [x] **V4 完整体验**：7 夜故事共 68 个可玩案例；第 6 夜起伪人会针对最常用工具学习；第 7 夜 Y. Xue 复制体、四结局、住户 active/stranded/replaced 连续状态、带副作用办公室升级、Blackout 挑战模式和无限轮班均已接入。
- [x] **Hold / Wait 调查**：暂缓不再立即结算；时钟推进后会出现回电、CCTV、档案或访客反应证据，再由玩家正式写入暂缓结果。
- [x] **动画库**：56/56 个 V4 动画事件已登记在 `registryAnimationAssets`，并由环境、访客、文件、工具、决定和剧情状态触发 CSS 动画。
- [x] **可复用素材**：16 张角色基础立绘（统一 `512 x 768`，通过前端状态层复用）、39 张文件/工具/线索素材（统一 `512 x 512`）、8 张 CCTV/环境素材（统一 `512 x 512`）。
- [x] **素材清洁度**：最终独立导出中没有外部 sheet 标题、文件名条、卡片边框或相邻作品；已完成 63 张独立素材的 contact-sheet 复查。
- [x] **自动校验**：`npm run verify:assets` 检查所有 PNG 尺寸及 56 个动画事件；`npm run lint` 和 `npm run build` 检查类型与生产构建。

实现策略遵循本路线图建议：角色使用干净基础立绘加 CSS 状态层，UI 和特效使用可复用 CSS，只有 CCTV/剧情环境使用独立大图，避免为每个表情重复生成整张角色图。

---

## V1：Core Demo (当前版本定位)

**目标**：证明核心玩法成立。
**核心循环**：访客出现 → 玩家查资料 → 找异常 → 做决定 → 得到反馈

**已包含内容**：
- 3 夜，24 个访客
- 住户档案、今日规则、出入记录
- 电话 / 扫描 / CCTV / 提问
- 证据标记
- 4 种处理结果，基础结局

**最大价值**：游戏不是单纯猜真假，而是通过证据链判断。

---

## V2：互动增强版 (重点：手感、反馈、工具、操作)

**核心目标**：让玩家像真的在操作门岗设备，而非点选网页表单。

### 新增系统：
1. **[✅ 核心交互已完成]** **可交互桌面**：资料系统变成桌面操作，打字机台词框，过场动画。
2. **[✅ 动画已完成]** **文件动画与交互**：文件滑入动画，选中状态，重新播放机制。
3. **[✅ 已完成]** **提问卡系统**：分类（身份、关系、习惯、情境、陷阱），每人限问3个，增强策略性。
4. **[✅ 已完成]** **电话系统升级**：可拨打多处（房间、管理处、医院、隔壁），结果多样化。
5. **[✅ 已完成]** **CCTV 初级互动**：多镜头切换截图（大厅、走廊、电梯），不再纯文字。
6. **[✅ 动画已完成]** **访客情绪反应**：idle, nervous, suspicious, revealed 等状态动画实装。
7. **[✅ 动画已完成]** **更明确的错误反馈**：允许、拒绝、警报、等待的屏幕效果和过场延迟实装。

**内容规模**：升级至 7 夜完整故事线，重点优化交互、工具与故障压力反馈。
**完成标准**：“我不是在看表格，我是真的坐在门岗室里查人。”

---

## V3：系统深化版 (重点：冲突、污染、策略、资源、后果)

**核心目标**：让挑战不仅停留在“查证件”。

### 新增系统：
1. **[✅ 已完成]** **档案污染**：第5夜起真实档案被篡改（照片模糊、特征反转）。
2. **[✅ 已完成]** **档案修复玩法**：通过旧照片、录音、纸质便条等历史记录，拖拽恢复真实档案。保护现实。
3. **[✅ 已完成]** **住户关系网**：建立交叉验证（谁认识谁），后期关系网可被伪人污染。
4. **[✅ 已完成]** **资源管理**：限制电话、CCTV、扫描等工具次数，按难度模式区分限制程度。
5. **[✅ 已完成]** **设备故障**：电话断线、门锁卡住等，需通过简单短促的小游戏修复，增加压力。
6. **[✅ 已完成]** **白天准备阶段**：班前复习档案、检查设备、选卡组、修复档案，获得当晚增益。
7. **[✅ 已完成]** **特殊访客事件**：双胞胎同时来访、受伤住户答错问题、伪人接听楼上电话、紧急救援人员。

**推荐剧情结构 (扩展至 7 夜)**：
- 第1夜：基础核验；第2夜：访客类型增加；第3夜：电话矛盾；第4夜：关系习惯；第5夜：档案污染。
**完成标准**：“我不能只相信一个系统. 每个工具都可能误导我。”

---

## V4：完整体验版 (重点：完整主线、多结局、可重复游玩、最终反转)

**核心目标**：从Demo走向独立游戏完整体验。

### 新增系统：
1. **[✅ 已完成]** **完整 7 夜主线**：第6夜学习型伪人，第7夜“最终复制体”。
2. **[✅ 已完成]** **学习型伪人**：根据玩家游戏习惯（爱打电话/爱查照片/忽略规则）生成针对性陷阱。
3. **[✅ 已完成]** **最终复制体事件**：门外出现接替班次的玩家复制体（Y. Xue），文件几乎完美，需综合所有工具及过往线索找破绽。
4. **[✅ 已完成]** **多结局分支**：Good Ending (存活且查明真相), Survival Ending (存活但现实崩坏), Bad Ending (被替换), Hidden Ending (销毁登记簿，牺牲式结局)。
5. **[✅ 已完成]** **核心住户连续剧情**：重点刻画5个住户（如Lin Anna, Zhou Qiming），他们的存活会影响后期线索获取。
6. **[✅ 已完成]** **办公室升级**：通过游戏进度解锁工具增强（非无敌化，带副作用）。
7. **[✅ 已完成]** **挑战模式**：Endless Shift (无限随机生成), Challenge Mode (极端限制条件)。

---

## 开发避坑指南
- ❌ **不要加无关玩法**：拒绝跑图、战斗、合成、大地图。
- ❌ **工具不要自动给答案**：扫描器只报异常代码，不直接提示“此人是伪人”。
- ❌ **破绽需渐进**：前期可明显（名字错），后期需隐蔽（习惯、关系、背景音）。
- ❌ **控制随机性**：每个生成的伪人必须保证有足够线索可循，拒绝盲猜。

---

## 结论建议
优先推进 **V2 (互动增强版)** 的开发。
不要急着扩展夜数，**先把“文件、电话、CCTV、提问、访客反应、按钮反馈”做得有手感。**
只要 V2 做好，游戏就会从“文字网页”真正进化为“夜班门岗恐怖模拟器”。


要。到了 V4，你不只是要“加动画”，还要准备一套完整的 可复用美术资产包。
最重要的一点是：

不是所有东西都要画成完整 sprite。
V4 最省工的方式是：角色立绘分层 + UI 用 CSS + 特效用 overlay + 少量关键大图。

这样你工作量不会爆炸。

先说结论：V4 你要准备的元素包

我建议你把素材拆成 8 组：

1. Character Portrait Pack（角色立绘包）
2. Document Pack（文件/纸张包）
3. Tool & Desk Pack（工具与桌面物件）
4. UI Frame Pack（界面框体与按钮）
5. FX Overlay Pack（特效与覆盖层）
6. Background Pack（场景背景）
7. CCTV Pack（监控画面包）
8. Story / Ending Pack（剧情过场与结局包）

如果按 V4 标准 来做，建议目标大概是：

角色立绘素材：60~90 个
文件纸张素材：20~30 个
桌面工具素材：15~25 个
UI 元素素材：20~35 个
FX 特效素材：15~25 个
背景场景素材：8~14 个
CCTV 素材：10~18 个
剧情/结局素材：6~12 个

总量不一定全是“大图”，很多是小元素。

一、Character Portrait Pack 角色立绘包

这是最重要的。
你的游戏核心视觉几乎都靠访客窗口。

最推荐做法：分层立绘

不要每个角色画 8 张整图。
建议每个核心角色拆成：

base body / bust
eyes-open
eyes-closed
mouth-closed
mouth-open
special expression overlay
corruption overlay
shadow overlay

这样可以靠前端拼状态，工作量会小很多。

A. 核心住户角色包

你现在有 10 名核心住户，V4 不一定需要每个人都超完整，但至少要这样：

每个核心住户最少需要：
1. Base portrait（正常）
2. Blink / eyes closed（眨眼）
3. Nervous（紧张）
4. Suspicious / angry（可疑/烦躁）
5. Reveal / corrupted（伪人暴露或异常）

也就是：

10 个住户 × 5 = 50 个角色状态素材

如果你做“分层”，就不一定是 50 张完整图，可能是：

10 个 base
10 个 eyes-closed
10 个 nervous-face overlay
10 个 angry/suspicious-face overlay
10 个 corruption overlay
B. 访客类型通用角色包

除了固定住户，你还有：

注册访客
维修工
快递员
紧急人员
门岗人员
管理处人员

这些不一定都做成“有名字的完整角色”，可以做 通用 archetype。

建议你做：

1. Generic Visitor A（普通访客）
2. Generic Visitor B（商务访客）
3. Repair Worker（维修工）
4. Courier（快递员）
5. Emergency Staff（紧急人员）
6. Security/Staff（内部人员）

每个做 3 个状态：

normal
nervous
suspicious

总共：

6 × 3 = 18 个
C. 特殊角色包

这是最值得下功夫的。

必须单独做的特殊角色
Y. Xue / 门岗复制体
Blue Star Repair 可疑维修员
Lin Anna / 关键住户
Zhou Qiming / 关键住户
最终不存在住户 / Final Resident
学习型伪人高级模板
每个特殊角色建议状态
normal
blink
talking
nervous
smile
anger
duplicate
reveal
hurt / fading
shadow

至少：

6 个特殊角色 × 8~10 状态
≈ 48~60 个状态素材

但这里不一定全做完整图，可以做更细的分层。

D. 角色附加部件 Pack

这些非常有用，因为你很多判断点是“细节不对”。

建议单独做可替换小部件：

痣（左/右）
手套（左手/右手）
帽子（有/无）
眼镜（有/无）
口罩（有/无）
耳环（左/右）
胸牌
工牌
维修工证件挂绳
污渍/血迹
反光眼睛
怪异笑容 overlay

这组素材能让你快速做“伪人版本”。

建议数量：

15~25 个小部件 sprite
二、Document Pack 文件 / 纸张包

你的玩法 60% 都发生在文件上。
所以文件包必须系统化。

A. 文件模板类

这些最好每种做一张 干净模板，由前端动态填内容。

必做模板
1. Resident ID / 居民身份证
2. Building Pass / 门禁卡
3. Visitor Appointment Form / 访客预约单
4. Repair Order / 维修工单
5. Courier Slip / 快递单
6. Medical ID / 医院证件
7. Security Notice / 安保通知
8. Shift Handover Note / 交班单
9. Daily Rules Sheet / 每日规则
10. Entry Log Sheet / 出入记录页
11. Resident Archive Card / 住户档案卡
12. Incident Report / 事故报告

建议：

12 个文件模板
B. 文件状态类

每种文件建议再准备一些状态元素：

clean
stamped-approved
stamped-rejected
scribbled
folded edge
damaged
corrupted
highlighted

这些不一定是整张图，可以是 overlay。

建议：

8~12 个 overlay / stamp 元素
C. 纸张边缘和旧化素材

你要做恐怖办公感，建议准备：

paper shadow
paper fold corner
aged paper stain
coffee stain
ink smudge
burnt edge
red annotation line
corruption static line

建议：

8~10 个纸张效果元素
三、Tool & Desk Pack 工具与桌面物件包

这些是“操作感”的来源。

A. 必做桌面工具
1. Desk phone / 电话
2. ID scanner / ID 扫描器
3. CCTV monitor / 监控屏
4. Desk lamp / 台灯
5. Evidence board / 证据板
6. Clipboard / 写字板
7. Intercom / 对讲机
8. Stamp / 印章
9. Security alarm button / 红色报警按钮
10. Unlock button / 放行按钮
11. Refuse button / 拒绝按钮
12. Hold button / 暂缓按钮
13. Drawer / 抽屉
14. Archive binder / 档案夹
15. Keycard tray / 门卡托盘

建议至少：

15 个桌面工具元素
B. 工具状态元素

每个工具最好有一些状态，不一定都需要单独大图。

电话
idle
dialing glow
connected light
dead line / dark
bad call flicker
扫描器
idle
beam
pass
error
overheat / glitch
CCTV
idle
boot static
channel switch
zoom frame
signal lost
报警按钮
idle
hover glow
pressed
active alarm
cooldown

这组如果拆成状态素材：

20~30 个小状态元素

很多可以 CSS 做，图像只要基础外形。

四、UI Frame Pack 界面框体与按钮包

这类不要画得太“重”。
建议做成少量纹理 + CSS 组合。

A. 窗口 / 面板框

你至少需要：

main frame / 主界面框
visitor window frame / 访客窗口框
paper panel frame / 文件面板框
tool panel frame / 工具面板框
dialogue box / 台词框
notification box / 通知框
meter frame / 数值条框
tab frame / 标签页框
modal frame / 放大查看文件框
ending card frame / 结局卡框

建议：

10 个 UI 框体
B. 按钮类

你当前至少有这些按钮：

Allow entry
Refuse entry
Call security
Hold / wait
Call room
Call management
Call hospital/company
Scan ID
Open CCTV
Ask question
Open archive
View ledger
Mark evidence
Next visitor / Continue

建议每个按钮不用 4 张整图，可以统一风格，用 CSS + 图标。
但至少要准备：

button base background
button hover glow
button pressed shadow
disabled version
danger version
success version
warning version

建议：

7 个按钮底图/状态条
C. 图标类

你需要一套统一 icon 风格。

必做图标
phone
scanner
CCTV
question
archive
ledger
security
allow
refuse
hold
warning
evidence
visitor
resident
repair
courier
hospital
management
clock
rules

建议：

18~22 个图标
五、FX Overlay Pack 特效与覆盖层

这一组会让网页从“文字页面”变成“游戏”。

A. 环境特效
rain overlay
window condensation / 玻璃水汽
soft vignette / 暗角
lamp glow
dust particles
hall shadow
light flicker overlay
fog / outside haze

建议：

8 个
B. 系统特效
CCTV static
scanline
glitch strip
corruption noise
red alarm overlay
green unlock flash
bad-call yellow flash
wrong-decision dark flicker
queue pressure pulse
stability distortion

建议：

10 个
C. 事件特效
stamp impact
paper dust puff
button press flash
screen shake mask
duplicate ghost overlay
blood-red tint
registry rewrite effect
ending fade overlay

建议：

8 个

总计：

18~26 个 FX 元素
六、Background Pack 场景背景包

背景不要做太多，但要做“关键切换场景”。

A. 主办公场景

至少准备：

1. Office main night background
2. Office main alarm background
3. Office low-stability / distorted background
4. Office dawn / ending background

建议：

4 个
B. 窗外 / 公寓外景
Moonshadow exterior night
rain heavy version
power outage / dark exterior
window lights variation

建议：

3~4 个
C. 白天准备阶段背景
prep phase office
archive room
maintenance corner / breaker box

建议：

3 个
七、CCTV Pack 监控画面包

如果你要把 CCTV 做好，建议不要只写文字。
哪怕不做复杂动图，也可以做“静态画面 + 小动画”。

必做 CCTV 场景
1. Lobby cam
2. Elevator cam
3. Hallway cam
4. Back door cam
5. 6th floor cam
6. Stairwell cam

建议：

6 个基本监控背景
CCTV 特殊事件版本

每个不需要完整重画，但至少准备一些异常版本：

same person upstairs
shadow in hallway
empty frame
static corruption
nonexistent floor 7
duplicate visitor

建议：

6~10 个异常监控素材
八、Story / Ending Pack 剧情与结局包

V4 如果要更完整，必须有一些不是纯 UI 的“剧情视觉”。

A. 夜晚章节卡
Night 1
Night 2
Night 3
Night 4
Night 5
Night 6
Night 7

建议：

7 个 night card

可以只是同一模板换字。

B. 结局卡
Good Ending
Survival Ending
Bad Ending
Hidden Ending

建议：

4 个
C. 关键剧情视觉

最值得单独做的剧情图：

1. 门岗复制体站在门外
2. 玩家的档案出现
3. 登记簿改写现实
4. 不存在住户档案
5. 天亮后的月影公寓

建议：

5 个关键剧情图
V4 最推荐的资源制作策略

重点来了。
你不要“所有东西都画完整图”，不然会非常累。

方案一：最推荐，适合你现在
角色用分层

每个关键角色：

base portrait
eyes layer
mouth layer
emotion overlay
corruption overlay

这样你就能做：

眨眼
说话
紧张
微笑
reveal
duplicate

不用每个状态都画整张。

方案二：文件模板动态填字

不要画死内容。
只画：

空白居民证模板
空白预约单模板
空白维修单模板
空白住户档案模板

然后前端填：

名字
房号
ID
公司名
时间
印章
照片

这样很省。

方案三：按钮和 UI 用 CSS，多画图标

你不需要给每个按钮都画 normal/hover/pressed 的完整 sprite。
你只要有：

1. 按钮底纹
2. 图标
3. glow/highlight 小素材

hover / active / disabled 全部交给 CSS。

方案四：特效优先做 overlay，不做复杂逐帧

比如这些直接做 overlay：

scanline
static
alarm flash
unlock flash
glitch
dark vignette
duplicate ghost
corruption noise

这样非常适合网页游戏。

V4 最小必做素材清单

如果你想先做 “够用的 V4”，不是满配，我建议最少先生成这些。

1. 角色包最小版
10 个核心住户 × 3 状态 = 30
6 个通用访客 × 2 状态 = 12
3 个特殊角色 × 6 状态 = 18
配件小元素 = 15

合计大约：

75 个角色相关元素
2. 文件包最小版
12 个文件模板
8 个章/污染/折痕 overlay

合计：

20 个
3. 工具/桌面最小版
15 个工具元素
10 个工具状态特效

合计：

25 个
4. UI 包最小版
10 个框体
20 个图标
7 个按钮底图/状态纹理

合计：

37 个
5. FX 包最小版
12 个
6. 背景 + CCTV + 结局最小版
背景 8
CCTV 8
结局/剧情 8

合计：

24 个
最小 V4 总资源量

大致会是：

角色相关：75
文件相关：20
工具相关：25
UI 相关：37
FX：12
背景/CCTV/剧情：24
--------------------
总计：193 个左右元素

注意这 193 不是 193 张大插画。
里面很多是：

图标
overlay
小部件
UI 边框
状态纹理
分层脸部素材

所以是合理的。

我最建议你先生成的 30 个核心元素

如果你现在资源紧张，先做这 30 个，提升最大。

角色
1. Lin Anna base
2. Lin Anna nervous
3. Lin Anna reveal
4. Zhou Qiming base
5. Zhou Qiming suspicious
6. Zhou Qiming reveal
7. Repair worker base
8. Repair worker suspicious
9. Courier base
10. Courier suspicious
11. Emergency staff base
12. Y. Xue copycat base
13. Y. Xue duplicate
14. Y. Xue reveal
15. Generic visitor base
16. Generic visitor nervous
文件
17. Resident ID template
18. Visitor appointment template
19. Repair order template
20. Resident archive template
21. Daily rules template
22. Entry ledger template
工具
23. Phone base
24. Scanner base
25. CCTV screen base
26. Red security button
FX
27. Scanline overlay
28. Alarm red overlay
29. Corruption overlay
30. Green unlock flash

这 30 个做完，你的游戏观感就会明显提升。

文件命名建议

从现在开始就把素材命名规范做好，不然后面会乱。

建议这样：

/characters/residents/lin_anna/base.png
/characters/residents/lin_anna/nervous.png
/characters/residents/lin_anna/reveal.png

/characters/special/y_xue/base.png
/characters/special/y_xue/duplicate.png

/documents/resident_id/template.png
/documents/visitor_appointment/template.png

/ui/icons/phone.png
/ui/icons/scanner.png

/effects/scanline.png
/effects/alarm_red.png

/backgrounds/office/night_main.png
/backgrounds/cctv/lobby.png
尺寸建议

为了网页端不太重，建议：

角色立绘
1024 x 1536 PNG 透明底

如果只显示半身，也可以：

900 x 1200
文件模板
1200 x 800
图标
128 x 128
特效 overlay
1920 x 1080
CCTV 背景
1280 x 720
主背景
1920 x 1080
最后的建议

你现在真正要做的，不是“再加一堆内容”，而是把素材分成：

必须出图的
可以分层的
可以 CSS 做的
可以动态生成的

我给你的最推荐分法是：

必须出图
角色 base
特殊角色状态
文件模板
背景
CCTV 场景
图标
分层做
眼睛
嘴巴
微笑
紧张
corruption
duplicate shadow
小部件配件
CSS 做
hover
glow
shake
pulse
flash
scanline move
alarm flicker
typing effect
动态生成
文件文字内容
证件号码
房号
印章位置
规则文本
结算日志

可以。按照你现在的《Midnight Registry / 午夜登记簿》规划，我建议 **V4 标准一共做到 56 个动画效果**。

注意：这里说的 56 个不是 56 段复杂逐帧动画，而是 **56 个可复用的网页游戏动画事件**，大部分可以用 CSS animation + React state 做出来。

你现在已经有大概 8 个基础动画：

```text
rain
drift
visitor-enter
breathe
document-enter
face-flash
shake
alarm-flash / bad-flicker
```

所以 V4 标准是：

```text
总动画目标：56 个
你已有基础：约 8 个
还需要新增：约 48 个
```

---

# V4 动画总分类

## 总表

| 类别         |     数量 | 作用                 |
| ---------- | -----: | ------------------ |
| 环境氛围动画     |      8 | 让办公室不像静态网页         |
| 访客角色动画     |     14 | 让访客有反应、有压迫感        |
| 文件/桌面动画    |     10 | 让核验过程更像真实操作        |
| 工具系统动画     |     12 | 电话、扫描、CCTV、提问更有游戏感 |
| 决策/后果动画    |      8 | 放行、拒绝、报警、等待有冲击     |
| V4 剧情/模式动画 |      4 | 夜晚切换、结局、档案污染、随机模式  |
| **总计**     | **56** | V4 完整动画标准          |

---

# 第一类：环境氛围动画 8 个

这些是一直存在的底层动画，让页面从 dashboard 变成恐怖门岗室。

## 1. Rain Loop / 雨夜循环

**你已经有了。**

用途：背景雨景。
触发：常驻。
效果：斜向雨线移动。
时长：0.8s 无限循环。
Class：

```text
.registry-rain
```

---

## 2. Window Light Flicker / 楼窗闪烁

用途：让 Moonshadow Apartments 看起来有人住，也有异常。
触发：随机，每 8 到 20 秒。
效果：远处窗户灯光闪一下，有时熄灭。
时长：0.4s 到 1.2s。

```text
.registry-window--flicker
```

---

## 3. Desk Lamp Pulse / 台灯呼吸

用途：办公室桌面有生命感。
触发：常驻。
效果：桌面暖光轻微明暗变化。
时长：4s 循环。

```text
.registry-desk-lamp--pulse
```

---

## 4. Fluorescent Buzz / 灯管故障

用途：稳定度下降时制造压迫。
触发：Stability < 70。
效果：整体画面亮度轻微跳动。
时长：1.6s 循环。

```text
.registry-shell--light-buzz
```

---

## 5. Hallway Shadow Pass / 走廊黑影掠过

用途：CCTV 或门口背景偶尔有黑影。
触发：随机或伪人接近时。
效果：背景后方一道黑影横移。
时长：0.8s。

```text
.registry-shadow-pass
```

---

## 6. Clock Tick Jump / 时间跳动

用途：Hold / wait 或夜晚推进时。
触发：时间变化。
效果：时间数字轻微跳动、闪一下。
时长：0.25s。

```text
.registry-time--tick
```

---

## 7. Queue Pressure Pulse / 排队压力闪烁

用途：队列压力高时提醒玩家。
触发：Queue pressure > 60%。
效果：Queue 数字变红、轻微 pulse。
时长：1s 循环。

```text
.registry-queue--pressure
```

---

## 8. Stability Distortion / 稳定度失真

用途：玩家精神/系统稳定度下降。
触发：Stability < 40。
效果：UI 轻微错位、文字抖动、画面对比度变化。
时长：2s 循环。

```text
.registry-shell--distorted
```

---

# 第二类：访客角色动画 14 个

这是最重要的部分。你现在的角色还偏静态，V4 要让访客根据玩家行为变化。

## 9. Visitor Enter / 访客进入窗口

**你已经有基础版。**

触发：新访客出现。
效果：访客从暗处淡入/上移。
时长：0.45s。

```text
.registry-portrait--enter
```

---

## 10. Visitor Idle Breathing / 访客呼吸

**你已经有基础版。**

触发：访客等待。
效果：轻微上下浮动。
时长：3.4s 循环。

```text
.registry-portrait--idle
```

---

## 11. Blink / 眨眼

用途：让静态立绘更像活人。
触发：随机，每 3 到 7 秒。
效果：眼部图层或全图快速切换 blink 状态。
时长：0.12s。

```text
.registry-portrait--blink
```

---

## 12. Talking / 说话

用途：访客台词出现时。
触发：显示 dialogue。
效果：角色轻微上下动，像在说话。
时长：0.22s 循环，台词结束停止。

```text
.registry-portrait--talking
```

---

## 13. Waiting / 等久不耐烦

用途：玩家检查太久。
触发：单个访客等待超过 45 秒。
效果：呼吸变快，身体轻微左右动。
时长：1.4s 循环。

```text
.registry-portrait--waiting
```

---

## 14. Nervous / 紧张

用途：玩家打电话或发现疑点时。
触发：Call room、Scan ID、标记证据。
效果：角色轻微抖动，眼神不稳。
时长：0.7s 循环。

```text
.registry-portrait--nervous
```

---

## 15. Suspicious Smile / 诡异微笑

用途：玩家问到关键问题，伪人开始异常。
触发：Trap question / 电话冲突。
效果：角色缓慢前倾，画面轻微变冷。
时长：1.4s。

```text
.registry-portrait--suspicious
```

---

## 16. Angry Knock / 敲玻璃

用途：等待太久或拒绝前。
触发：Hold 多次、错误质疑真人、危险伪人。
效果：角色突然前冲，屏幕小震。
时长：0.35s。

```text
.registry-portrait--knock
```

---

## 17. Lean In / 贴近玻璃

用途：高压访客威胁玩家。
触发：危险伪人、最终复制体。
效果：角色 scale 放大 1.05 到 1.1。
时长：0.5s。

```text
.registry-portrait--lean-in
```

---

## 18. Eye Glitch / 眼睛异常闪烁

用途：伪人快暴露。
触发：玩家标记两个以上正确证据。
效果：脸部闪白/眼睛变暗一瞬间。
时长：0.25s。

```text
.registry-portrait--eye-glitch
```

---

## 19. Reveal / 暴露伪人

用途：Call security 正确时。
触发：正确呼叫安保。
效果：角色图像抖动、红光、脸部变形感。
时长：0.8s。

```text
.registry-portrait--revealed
```

---

## 20. Visitor Leave / 访客离开

用途：放行或拒绝后。
触发：Allow / Refuse。
效果：角色向下或向后淡出。
时长：0.45s。

```text
.registry-portrait--leaving
```

---

## 21. True Resident Hurt / 真人被误拒

用途：错拒真人时。
触发：Refuse real resident。
效果：角色停顿、低头、慢慢离开。
时长：0.9s。

```text
.registry-portrait--hurt
```

---

## 22. Duplicate Overlay / 复制体重影

用途：第 6 夜学习型伪人、第 7 夜玩家复制体。
触发：高级伪人或最终夜。
效果：角色旁边出现一层错位透明重影。
时长：1.2s 循环。

```text
.registry-portrait--duplicate
```

---

# 第三类：文件/桌面动画 10 个

你的游戏大量时间都在看文件，所以文件必须有手感。

## 23. Paper Slide In / 文件滑入桌面

**你已有基础版。**

触发：访客递交文件。
效果：纸张从下方滑入。
时长：0.28s。

```text
.registry-paper--document-enter
```

---

## 24. Document Select Pop / 文件选中弹跳

触发：点击 Window Claim / Resident ID / Observation。
效果：被选文件轻微弹一下。
时长：0.22s。

```text
.registry-document--selected
```

---

## 25. Paper Hover Lift / 纸张悬浮

触发：鼠标 hover 文件按钮或纸张。
效果：文件轻微上浮、旋转 0.5 度。
时长：0.16s transition。

```text
.registry-paper--hover
```

---

## 26. Document Zoom Open / 文件放大查看

触发：点击文件详情。
效果：文件从桌面放大到中央，背景变暗。
时长：0.25s。

```text
.registry-document-modal--open
```

---

## 27. Document Zoom Close / 文件关闭

触发：关闭放大文件。
效果：文件缩回桌面。
时长：0.2s。

```text
.registry-document-modal--close
```

---

## 28. Archive Page Flip / 档案翻页

触发：切换 Archive 住户档案。
效果：页面横向翻动/滑动。
时长：0.35s。

```text
.registry-archive--page-flip
```

---

## 29. Evidence Stamp / 证据盖章

触发：玩家标记证据原因。
效果：红色/黄色 stamp 砸到纸上。
时长：0.32s。

```text
.registry-evidence--stamp
```

---

## 30. Evidence Pin / 证据钉到证据板

触发：证据加入 evidence board。
效果：证据卡片从文件飞到证据板。
时长：0.45s。

```text
.registry-evidence--pin
```

---

## 31. File Corruption Flicker / 档案污染

触发：第 5 夜以后，档案被污染。
效果：字段闪烁，文字短暂变成错误版本。
时长：0.6s。

```text
.registry-paper--corrupted
```

---

## 32. Ledger Entry Pop / 出入记录弹入

触发：完成一个访客后，Shift Ledger 新增记录。
效果：新记录从右侧弹入。
时长：0.3s。

```text
.registry-ledger-entry--pop
```

---

# 第四类：工具系统动画 12 个

这些会让你的“电话/扫描/CCTV/提问”不只是文字结果。

## 33. Phone Dial Pulse / 电话拨号

触发：点击 Call Room。
效果：电话按钮闪烁，log 显示 Dialing。
时长：0.9s。

```text
.registry-tool--phone-dialing
```

---

## 34. Phone Connected / 电话接通

触发：电话正常返回结果。
效果：绿色小灯亮一下，log 打字出现。
时长：0.35s。

```text
.registry-tool--phone-connected
```

---

## 35. Phone Dead Air / 电话死线

触发：无人接听/异常电话。
效果：电话按钮变暗，背景噪声视觉线条。
时长：0.8s。

```text
.registry-tool--phone-dead
```

---

## 36. Bad Call Distortion / 恐怖电话

**你已有类似 bad-call，可以强化。**

触发：电话里出现重复声音、本人已在楼上。
效果：屏幕轻微黄闪、文字乱码一瞬间。
时长：0.6s。

```text
.registry-shell--bad-call
```

---

## 37. ID Scanner Beam / ID 扫描线

触发：点击 Scan ID。
效果：文件上出现蓝色扫描线。
时长：1.1s。

```text
.registry-scanner--beam
```

---

## 38. Scanner Pass / 扫描通过

触发：ID 正常。
效果：绿色 check 快速弹出。
时长：0.35s。

```text
.registry-scanner--pass
```

---

## 39. Scanner Error / 扫描错误

触发：ID 不符/过期。
效果：扫描器红灯抖动。
时长：0.45s。

```text
.registry-scanner--error
```

---

## 40. CCTV Boot Static / 监控启动雪花

触发：打开 CCTV。
效果：CCTV 面板先出现雪花屏。
时长：0.5s。

```text
.registry-cctv--boot
```

---

## 41. CCTV Channel Switch / 切换监控频道

触发：Lobby / Elevator / Hallway / Back Door 切换。
效果：横向闪屏，频道名跳动。
时长：0.25s。

```text
.registry-cctv--channel-switch
```

---

## 42. CCTV Zoom Freeze / 监控冻结放大

触发：玩家点击可疑画面。
效果：画面暂停，放大局部。
时长：0.3s。

```text
.registry-cctv--freeze-zoom
```

---

## 43. Question Card Flip / 提问卡翻转

触发：点击问题卡。
效果：卡片翻面，显示回答。
时长：0.35s。

```text
.registry-question-card--flip
```

---

## 44. Trap Question Hit / 陷阱问题命中

触发：伪人回答错误私人问题。
效果：问题卡边缘红光，访客表情变 suspicious。
时长：0.5s。

```text
.registry-question-card--trap-hit
```

---

# 第五类：决策/后果动画 8 个

这部分最能让玩家觉得“我做了一个重大决定”。

## 45. Allow Unlock / 放行开门

触发：Allow entry。
效果：绿光从门锁位置亮起，访客离开。
时长：0.75s。

```text
.registry-effect--allow
```

---

## 46. Refuse Shutter / 拒绝关窗

触发：Refuse entry。
效果：窗口变暗，像铁板/玻璃关闭。
时长：0.75s。

```text
.registry-effect--refuse
```

---

## 47. Security Alarm / 呼叫安保

**你已有基础版，可以加强。**

触发：Call security。
效果：红灯闪烁、屏幕震动、访客 reveal。
时长：0.9s。

```text
.registry-effect--security
```

---

## 48. Hold Time Skip / 暂缓等待

触发：Hold / wait。
效果：时间数字跳动，队列压力上升，访客变 nervous。
时长：0.7s。

```text
.registry-effect--wait
```

---

## 49. Correct Decision Stamp / 正确处理反馈

触发：玩家判断正确。
效果：ledger 上出现小 stamp，绿色/金色闪一下。
时长：0.35s。

```text
.registry-result--correct
```

---

## 50. Wrong Decision Stinger / 错误处理反馈

触发：玩家判断错误。
效果：短暂黑屏、灯闪、远处尖叫或电话响。
时长：1.0s。

```text
.registry-result--wrong
```

---

## 51. Reputation Damage / 信誉下降

触发：错拒真人。
效果：Reputation meter 抖动并下降。
时长：0.45s。

```text
.registry-meter--reputation-hit
```

---

## 52. Safety Damage / 安全下降

触发：放进伪人。
效果：Safety meter 红闪，楼层背景暗一下。
时长：0.6s。

```text
.registry-meter--safety-hit
```

---

# 第六类：V4 剧情/模式动画 4 个

这些是 V4 才需要的更完整体验。

## 53. Night Transition / 夜晚切换

触发：Night 1 → Night 2。
效果：黑屏、打字显示“Night 2 / Appointment Rules”。
时长：1.5s。

```text
.registry-transition--night
```

---

## 54. Day Prep Open / 白天准备阶段展开

触发：进入白天准备阶段。
效果：办公室灯光变亮，准备卡片依次出现。
时长：0.8s。

```text
.registry-prep--open
```

---

## 55. Registry Rewrite / 登记簿改写现实

触发：第 5 夜档案污染、第 7 夜最终复制体。
效果：档案字段被划掉、重新打字、红线覆盖。
时长：1.2s。

```text
.registry-ledger--rewrite
```

---

## 56. Ending Title Reveal / 结局标题出现

触发：Good / Survival / Bad / Hidden Ending。
效果：结局标题逐字出现，背景慢慢淡出。
时长：2s。

```text
.registry-ending--title-reveal
```

---

# V4 动画状态机建议

你不要把动画写散。建议集中管理几个 state。

```ts
type VisitorMood =
  | "enter"
  | "idle"
  | "talking"
  | "waiting"
  | "nervous"
  | "suspicious"
  | "angry"
  | "revealed"
  | "hurt"
  | "leaving"
  | "duplicate";

type ActiveTool =
  | null
  | "phone"
  | "scanner"
  | "cctv"
  | "question"
  | "archive"
  | "ledger";

type ScreenEffect =
  | null
  | "allow"
  | "refuse"
  | "security"
  | "wait"
  | "wrong"
  | "badCall"
  | "nightTransition"
  | "registryRewrite";
```

你的主页面 class 可以这样拼：

```tsx
<main
  className={[
    "registry-shell",
    `registry-shell--mood-${visitorMood}`,
    screenEffect ? `registry-effect--${screenEffect}` : "",
    stability < 40 ? "registry-shell--distorted" : "",
    queuePressure > 60 ? "registry-shell--queue-danger" : "",
  ].join(" ")}
>
```

访客 portrait：

```tsx
<div className={`registry-portrait registry-portrait--${visitorMood}`}>
  <img src={visitor.image} alt={visitor.name} />
</div>
```

工具按钮：

```tsx
<button className={activeTool === "phone" ? "registry-tool--phone-dialing" : ""}>
  Call Room
</button>
```

---

# V4 每个访客的完整动画流程

一轮访客应该长这样：

```text
1. 新访客进入
   Animation: Visitor Enter

2. 访客说第一句话
   Animation: Talking + Typewriter Text

3. 文件滑入桌面
   Animation: Paper Slide In

4. 玩家点文件
   Animation: Document Select Pop / Paper Hover Lift

5. 玩家查档案
   Animation: Archive Page Flip

6. 玩家打电话
   Animation: Phone Dial Pulse
   Result:
      - Connected
      - Dead Air
      - Bad Call Distortion

7. 玩家扫描 ID
   Animation: Scanner Beam
   Result:
      - Scanner Pass
      - Scanner Error

8. 玩家问问题
   Animation: Question Card Flip
   访客状态变化:
      - nervous
      - suspicious
      - angry

9. 玩家标记证据
   Animation: Evidence Stamp / Evidence Pin

10. 玩家做决定
   Allow:
      Animation: Allow Unlock + Visitor Leave
   Refuse:
      Animation: Refuse Shutter + Visitor Leave
   Security:
      Animation: Security Alarm + Reveal
   Hold:
      Animation: Hold Time Skip + Waiting/Nervous

11. 结果记录
   Animation: Ledger Entry Pop
   Correct:
      Correct Decision Stamp
   Wrong:
      Wrong Decision Stinger + Meter Damage
```

---

# 按版本拆分：你应该怎么做

## V2 动画目标：24 个

先做最基础的“像游戏”。

必须包含：

```text
访客进入
访客呼吸
访客说话
访客紧张
访客离开
文件滑入
文件选中
档案翻页
电话拨号
电话接通
电话异常
扫描线
扫描成功
扫描失败
CCTV 雪花
问题卡翻转
证据盖章
放行动画
拒绝动画
报警动画
等待动画
正确反馈
错误反馈
Ledger 弹入
```

---

## V3 动画目标：40 个

在 V2 基础上加入：

```text
灯光故障
黑影掠过
队列压力
访客敲玻璃
访客贴近
眼睛异常
CCTV 切频道
CCTV 放大
证据飞入证据板
档案污染
信誉下降
安全下降
白天准备阶段
夜晚切换
```

---

## V4 动画目标：56 个

V4 就是完整标准，包括：

```text
环境氛围完整
访客情绪完整
工具反馈完整
决策过场完整
档案污染完整
白天准备完整
结局动画完整
随机/挑战模式反馈完整
```

---

# 最少需要多少美术资源？

不需要每个访客都画 10 张图。建议这样做：

## 核心角色

每个重要角色 5 张：

```text
normal
blink
nervous
angry
reveal / corrupted
```

## 普通访客

每人 2 张就够：

```text
normal
suspicious 或 nervous
```

## 最终复制体

至少 6 张：

```text
normal
smile
nervous
duplicate
reveal
leaving
```

## 工具资源

你已经有一些工具图标。V4 只需要补：

```text
phone active glow
scanner beam overlay
CCTV static overlay
stamp overlay
red alarm overlay
green unlock overlay
black shutter overlay
corruption texture
```

很多可以用 CSS 做，不一定要画新图。

---

# 最终建议

你的 V4 标准应该定为：

```text
56 个可复用动画效果
8 个环境动画
14 个访客动画
10 个文件桌面动画
12 个工具动画
8 个决策后果动画
4 个剧情模式动画
```

真正优先做的是这 12 个，因为它们最能改变“文字网页”的感觉：

```text
1. 访客进入
2. 访客说话
3. 访客紧张
4. 访客离开
5. 文件滑入
6. 文件选中
7. 电话拨号
8. 扫描线
9. CCTV 雪花
10. 问题卡翻转
11. 报警红灯 + 震动
12. 错误决定黑屏/尖叫反馈
```

这 12 个做好，你的游戏马上会从“文字系统”变成“可玩的恐怖门岗模拟器”。
V4 再做到 56 个，就是完整商业 demo 的动画标准。
