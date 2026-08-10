/* ============================================================
   SpotOn 仪表盘 · 共享数据（单一数据源 Single Source of Truth）
   ------------------------------------------------------------
   两份仪表盘共用本文件：
   ① 内部版  SpotOn Game/internal-dashboard.html（含社媒模块）
   ② 公开版  Corrine-Portfolio/site/dashboard.html（作品集展示版）
   ★ 内容更新只改这里 → 两边自动生效（框架/样式改动才需各自动手）
   ★ 本地改动先只更新文件；只有 Corrine 明确要求发布时才推送 GitHub Pages
   （内部版专属数据 statusMeta / socialContent 仍在内部版页面里）
   ============================================================ */

/*
   READABLE RULE CHECK - 2026-07-06

   This file is the only shared data source for both SpotOn dashboards.

   Internal dashboard:
   D:\Codex\projects\SpotOn Game\internal-dashboard.html
   May include internal social media drafts and detailed working notes.

   Public dashboard:
   D:\Codex\projects\Corrine-Portfolio\site\dashboard.html / dashboard.en.html
   Clean public case-study/evidence page linked from the public portfolio.

   Update shared public progress/evidence content here only:
   milestones, roadmap, pillars, publishedPosts, and journal.

   Internal-only data such as statusMeta and socialContent stays in the
   internal dashboard HTML and must not be added to the public page.
*/

const milestones = [
  {tag:"M0", name:"立项 & 环境搭建", nameEn:"Project kickoff + environment setup", status:"done"},
  {tag:"M1", name:"第一个可玩原型", nameEn:"First playable prototype", status:"done"},
  {tag:"M2", name:"完整游戏循环",   nameEn:"Complete game loop", status:"done"},
  {tag:"M3", name:"V3优化 + 广告位", nameEn:"V3 polish + ad placement", status:"done"},
  {tag:"M4", name:"提审 + 备案",    nameEn:"Review submission + filing", status:"done"},
  {tag:"M5", name:"上线 + 首批数据", nameEn:"Launch + first data", status:"done"},
];

// 上线路线图 8 步（status: done/doing/todo；here:true = 当前位置）
const roadmap = [
  {t:"做游戏", tEn:"Build the game", c:"设计玩法、留广告位", cEn:"Design gameplay and reserve ad slots", time:"持续迭代", timeEn:"Continuous iteration", status:"doing"},
  {t:"账号 & 主体", tEn:"Account & entity", c:"微信小游戏「找对了大师」（个人）", cEn:"WeChat mini-game Spot On!找对了大师 (individual entity)", time:"2026-07-04 完成", timeEn:"Completed Jul 4, 2026", status:"done"},
  {t:"软著", tEn:"Software copyright", c:"已跳过，不作为当前上线阻塞项", cEn:"Closed as skipped; not a launch blocker for the current release", time:"已处理", timeEn:"Closed", status:"done"},
  {t:"备案", tEn:"Government filing", c:"前置审批与小程序 ICP 备案均已通过", cEn:"Pre-approval and mini-program ICP filing both approved", time:"2026-07-24 完成", timeEn:"Completed Jul 24, 2026", status:"done"},
  {t:"接广告", tEn:"Integrate ads", c:"流量主 + 微信广告插件", cEn:"Traffic owner + WeChat ad plugin", time:"几天", timeEn:"A few days", status:"todo"},
  {t:"提审", tEn:"Submit for review", c:"1.0.0 代码审核已通过", cEn:"Version 1.0.0 passed code review", time:"2026-08-05 完成", timeEn:"Completed Aug 5, 2026", status:"done"},
  {t:"上线", tEn:"Launch", c:"线上 1.0.0 已发布，可搜索、打开和生成分享海报", cEn:"Version 1.0.0 is live, searchable, playable, and can generate a share poster", time:"2026-08-05 13:57", timeEn:"Live Aug 5, 2026 at 13:57", status:"done"},
  {t:"运营", tEn:"Operate", c:"收集首批反馈 / 数据 / 后续加固版本", cEn:"Collect first feedback and data; prepare the hardened update", time:"持续", timeEn:"Ongoing", status:"doing", here:true},
];

const pillars = [
  {icon:"📓", title:"① AI 学习日志", titleEn:"① AI Learning Journal", desc:"主线 · 文科生靠AI解决技术问题", descEn:"Mainline · humanities background solving technical problems with AI", stat:"16 个工作日 · 最新：正式上线文章已发布，并完成文章、Dashboard 与证据包的状态对齐", statEn:"16 workdays · Latest: the official launch article was published, with its status reconciled across the article, dashboards, and evidence package"},
  {icon:"🎮", title:"② 作品交付", titleEn:"② Shipped Proof", desc:"上线游戏 + 简历素材", descEn:"Shipped game + resume material", stat:"《找对了大师》1.0.0 已于 2026-08-05 正式上线；首批真实玩家反馈记录到 44、60、80、84 分；代码加固延后至 1.0.1", statEn:"Spot On! version 1.0.0 officially launched on Aug 5, 2026; early player feedback recorded scores of 44, 60, 80, and 84; code hardening is deferred to 1.0.1"},
  {icon:"📘", title:"③ 可复制SOP", titleEn:"③ Replicable SOP", desc:"整套流程方法论", descEn:"End-to-end operating method", stat:"新增：API-first 微信发布、发布稿对照复盘、备案预填清单与 Flomo 到公开证据的 wrap-up 闭环", statEn:"Added: API-first WeChat publishing, published-vs-source review, a prefilled filing checklist, and the Flomo-to-public-evidence wrap-up loop"},
];

// Published public content evidence. Use official published-page metadata,
// not internal dashboard draft titles or local review links.
const publishedPosts = [
  {
    id:"wechat-20260807-spoton-official-launch",
    date:"2026-08-07",
    title:"《找对了大师》俏皮首发：色感达人争霸赛 等你挑战！",
    titleEn:"SpotOn launches on WeChat: join the color-sense challenge",
    platform:"微信公众号",
    platformEn:"WeChat Official Account",
    description:"玩游戏，赢奖品！色感达人，是你吗？！",
    descriptionEn:"Play the game, chase the score, and join the color-sense challenge.",
    url:"https://mp.weixin.qq.com/s/HJd50tPLQAtungPsYxl3TA",
    coverImage:"assets/wechat/spoton-official-launch-20260807.png",
    coverAlt:"《找对了大师》色感达人争霸赛微信公众号文章封面"
  },
  {
    id:"wechat-20260726-ai-content-system",
    date:"2026-07-26",
    title:"为什么第二篇只花了 1 小时？因为第一篇的坑都被我写成了规则",
    titleEn:"Why did the second post take only one hour? Because I turned every first-post pitfall into a rule",
    platform:"微信公众号",
    platformEn:"WeChat Official Account",
    description:"第二篇变快，不只是因为模板，而是我把业务目标、Agent 分工、数据流、交付证据与反馈画成了一套可复用架构。",
    descriptionEn:"The second post became faster not just because of a template, but because I turned business goals, Agent roles, data flow, delivery evidence, and feedback into a reusable architecture.",
    url:"https://mp.weixin.qq.com/s/hWD_50z5dhfCm4Dk2DdvuA",
    coverImage:"assets/wechat/spoton-ai-content-system-cover.card.webp",
    coverAlt:"Cover image for the SpotOn WeChat post about turning content-production lessons into a reusable AI system"
  },
  {
    id:"wechat-20260726-ai-last-mile",
    date:"2026-07-26",
    title:"AI 帮我做出小游戏后，我发现最难的根本不是技术",
    titleEn:"After AI helped me build a mini-game, I realized the hardest part was never the technology",
    platform:"微信公众号",
    platformEn:"WeChat Official Account",
    description:"从零代码小游戏、AI 工作流到备案与真实世界的检验：真正拉开差距的，是能不能把想法变成可靠、可交付、有结果的作品。",
    descriptionEn:"From a no-code mini-game and AI workflows to filing and real-world validation, the real differentiator is whether an idea can become a reliable, deliverable work with tangible results.",
    url:"https://mp.weixin.qq.com/s/4yS7CEJdKL-DHJHOTQXWeA",
    coverImage:"assets/wechat/spoton-ai-last-mile-cover.card.webp",
    coverAlt:"Cover image for the SpotOn WeChat post about moving an AI-built product through the last mile into the real world"
  },
  {
    id:"wechat-20260714-spoton-v3-master-zone",
    date:"2026-07-14",
    title:"SpotOn V3 首次亮相：第31关后，游戏才算正式开始",
    titleEn:"SpotOn V3 debuts: the real game begins after Level 31",
    platform:"微信公众号",
    platformEn:"WeChat Official Account",
    description:"从简单原型到 V3 完整版本：我用 AI 做市场研究、设计升级方向、调度开发和上线流程，把一个 idea一步步推向正式发布。距离微信正式上线，又近了一步。",
    descriptionEn:"From a simple prototype to a complete V3: I used AI for market research, feature direction, development orchestration, and launch preparation, moving the idea one step closer to its official WeChat release.",
    url:"https://mp.weixin.qq.com/s/MyX_hqhz-AR60JOz-oqu3Q",
    coverImage:"assets/wechat/spoton-v3-master-zone-cover.card.webp",
    coverAlt:"Cover image for the third published SpotOn WeChat post about the V3 Master Zone"
  },
  {
    id:"wechat-20260709-spoton-m2-timer",
    date:"2026-07-09",
    title:"我的小游戏突然有了心跳：倒计时一加，紧张感拉满",
    titleEn:"My mini-game suddenly has a heartbeat: one countdown timer changed everything",
    platform:"微信公众号",
    platformEn:"WeChat Official Account",
    description:"从能玩到有输赢：SpotOn V2 加上倒计时、结算页和一键重来，也让我第一次摸到“工程脑”。",
    descriptionEn:"SpotOn V2 moved from merely playable to a real win-or-lose loop with a countdown, results screen, and one-tap restart. It was also the first time I felt my product brain turn into an engineering brain.",
    url:"https://mp.weixin.qq.com/s/AuUFtHHXnGKRmTZCQp14MA",
    coverImage:"assets/wechat/spoton-m2-timer-cover.card.webp",
    coverAlt:"Cover image for the second published SpotOn WeChat post"
  },
  {
    id:"wechat-20260707-first-spoton-post",
    date:"2026-07-07",
    title:"小Co大ai正式“开波” · 手搓了第一个小游戏",
    titleEn:"The first Spot On!找对了大师 mini-game is live",
    platform:"微信公众号",
    platformEn:"WeChat Official Account",
    description:"Hi 大家，我的公众号终于正式启动啦！这篇记录了阿Co作为一个零代码背景的大纯文科生如何跟 AI 搭档，把第一个可玩的 SpotOn小游戏从灵感做成 MVP，在天马行空的脑宇宙中解锁了AI新手村的第一块小地图~",
    descriptionEn:"Hi everyone, my WeChat Official Account is officially live. This post documents how Corrine, a humanities graduate with no coding background, partnered with AI to turn her first playable Spot On!找对了大师 mini-game from an idea into an MVP.",
    url:"https://mp.weixin.qq.com/s/C52zmMGwODzMX6DIZVT7jg",
    coverImage:"assets/wechat/spoton-first-wechat-cover.card.webp",
    coverAlt:"Cover image for the first published SpotOn WeChat post"
  },
];

const journal = [
  {date:"2026-06-16", day:"01", ms:"M0", result:"立项+命名 Spot On!、搭三支柱+仪表盘、打通 Flomo、产出首篇社媒素材", resultEn:"Named and scoped Spot On!, set up the three-pillar system and dashboard, connected Flomo, and produced the first social content asset.", link:"01_learning-journal/2026-06-16_entry-01.md"},
  {date:"2026-06-21", day:"02", ms:"M0", result:"winget 装好 Cocos 3.8.8 + 建好 SpotOn 项目，M0 达成 ✅；首次直面引擎界面", resultEn:"Installed Cocos 3.8.8 via winget and created the Spot On!找对了大师 project; M0 complete. First hands-on session inside a game engine.", link:"01_learning-journal/2026-06-21_entry-02.md"},
  {date:"2026-06-22", day:"03", ms:"M1", result:"写出第一段能跑的代码 Game.ts，连过 20 关、修好三轮界面 bug，M1 达成 ✅", resultEn:"Wrote the first runnable Game.ts, cleared 20 levels, fixed three rounds of UI bugs, and completed M1.", link:"01_learning-journal/2026-06-22_entry-03.md"},
  {date:"2026-06-24", day:"04", ms:"M2", result:"加倒计时+时间到动画+结算页+一键重来；攻克多设备自适应(720×1280)，M2 达成 ✅；产出 M2 录屏+演示脚本", resultEn:"Added countdown, timeout animation, results screen, and one-tap restart; solved responsive layout across devices at 720×1280 and completed M2. Produced the M2 recording and demo script.", link:"01_learning-journal/2026-06-24_entry-04.md"},
  {date:"2026-06-24", day:"04（续）", ms:"M2", result:"像产品负责人一样筹备上线：字幕版录屏(学会Clipchamp AI字幕)+可视化playbook+8步上线路线图+备案runbook；定上线timeline，优先级转向作品集", resultEn:"Prepared launch like a product owner: captioned recording with Clipchamp AI captions, visual playbook, 8-step launch roadmap, and filing runbook. Set the launch timeline and shifted priority to the portfolio.", link:"01_learning-journal/2026-06-24_entry-05.md"},
  {date:"2026-06-25 ~ 07-01", day:"—", ms:"—", result:"✈️ 预定外出行程，项目暂停一周——以上全部进度实际只用了 4 个净工作日", resultEn:"✈️ Travel break paused the project for one week; all progress above took only four net workdays.", pause:true},
  {date:"2026-07-03", day:"05", ms:"M2→M3", result:"Fable 5 项目体检+爆款研究（IAA公式：广告织进玩法+段位进度感）；优先级重排；作品集升格为母项目（Apple风格双语主页）", resultEn:"Reviewed Fable 5 and researched hit patterns (IAA formula: ads integrated into play + rank-based progression); reprioritized and elevated the portfolio into the parent project with an Apple-style bilingual homepage.", link:"01_learning-journal/2026-07-03_entry-06.md"},
  {date:"2026-07-04", day:"06", ms:"M3完成", result:"游戏 V3/M3 交付完成：30关大师门槛+段位+纪录+连击+复活广告位+点错惩罚；首次 CLI 构建网页版(3.3MB)接入作品集，浏览器实测可玩 ✅", resultEn:"Completed game V3/M3: 30-level Master threshold, ranks, records, combos, revive ad placement, and wrong-tap penalty. Built the web version via CLI (3.3MB), connected it to the portfolio, and verified it playable in-browser.", link:"01_learning-journal/2026-07-04_entry-07.md"},
  {date:"2026-07-04", day:"06（续）", ms:"M4", result:"作品集上线 https://cojeh.github.io 🌐；注册微信小游戏《找对了大师》；备案首交被驳回（名称不一致）当天修复重交 ✅——官方审核时钟开始走", resultEn:"Portfolio live at https://cojeh.github.io; registered the WeChat mini-game Spot On!找对了大师; first filing submission rejected due to a name mismatch, fixed and resubmitted the same day. The official review clock is now running.", link:"01_learning-journal/2026-07-04_entry-08.md"},
  {date:"2026-07-06", day:"07", ms:"M4 等待期", result:"项目展示系统加固：明确内部/公开两套 dashboard，恢复 dashboard-data.js 单一数据源，并补齐 AGENTS/CLAUDE 规则", resultEn:"Hardened the project showcase system: separated internal and public dashboards, restored dashboard-data.js as the single source of truth, and completed the AGENTS/CLAUDE rules.", link:"01_learning-journal/2026-07-06_entry-09.md"},
  {date:"2026-07-07", day:"08", ms:"M4 等待期", result:"首篇 SpotOn 微信公众号文章正式发布；从 Flomo 纳入“项目经验”、内容工作流复用、AI 改动可逆备份等复盘，并生成新的微信审阅稿素材", resultEn:"Published the first Spot On!找对了大师 WeChat Official Account article; added project experience, reusable content workflow, and reversible AI change backups to the retrospective, and generated new review-copy assets.", link:"01_learning-journal/2026-07-07_entry-10.md"},
  {date:"2026-07-08—13", day:"09", ms:"M4 等待期", result:"第二篇公众号正式发布；固化 API-first 内容流程；完成 V3 字幕 Demo、AI 工作流图、备案预填清单和 V3 微信审阅包", resultEn:"Published the second WeChat article, codified an API-first content workflow, and completed the V3 captioned demo, AI workflow diagrams, prefilled filing checklist, and V3 WeChat review package.", link:"01_learning-journal/2026-07-13_entry-11.md"},
  {date:"2026-07-14", day:"10", ms:"M4 等待期", result:"第三篇 SpotOn 微信文章正式发布；V3 产品故事成为新的公开证据，并同步内部/公开 dashboard", resultEn:"Published the third SpotOn WeChat article, turning the V3 product story into new public evidence and syncing it across the internal and public dashboards.", link:"01_learning-journal/2026-07-14_entry-12.md"},
  {date:"2026-07-20", day:"11", ms:"M4 备案推进", result:"小游戏前置审批通过；完成承诺书签署并正式提交小程序备案，进入平台审核与 12381 短信核验阶段", resultEn:"Mini-game pre-approval passed; signed the service commitment and formally submitted the mini-program filing, entering platform review and the 12381 SMS verification stage.", link:"01_learning-journal/2026-07-20_entry-13.md"},
  {date:"2026-07-22", day:"12", ms:"M4 备案推进", result:"小程序备案通过平台初审；7月21日错过首次短信后申请重发，7月22日完成工信部核验，等待后续审核", resultEn:"Mini-program filing passed platform review; after missing the first SMS on Jul 21, requested a resend and completed MIIT verification on Jul 22; awaiting further review.", link:"01_learning-journal/2026-07-22_entry-14.md"},
  {date:"2026-07-24", day:"13", ms:"M4 提审 + 备案", result:"小程序 ICP 备案通过通信管理局审核；明确备案成功不等于上线，下一步转入正式代码上传、审核与发布", resultEn:"Mini-program ICP filing passed the communications authority review; clarified that filing approval is not launch, and moved to production upload, code review, and release.", link:"01_learning-journal/2026-07-24_entry-15.md"},
  {date:"2026-07-26", day:"14", ms:"M4 发布准备 + 内容复利", result:"根据玩家反馈完成公平性升级与本地 QA；同日正式发布两篇公众号文章，并把内容与排版经验沉淀为可复用工作流", resultEn:"Completed and locally QA-tested a fairness-focused upgrade based on player feedback; published two WeChat articles on the same day and turned the content and layout lessons into a reusable workflow.", link:"01_learning-journal/2026-07-26_entry-16.md"},
  {date:"2026-08-05", day:"15", ms:"M4 完成 → M5 上线", result:"《找对了大师》线上版本 1.0.0 于 13:57:27 正式发布；搜索、手机首页、分享海报与首批玩家 44/60/80/84 分反馈均已留证。代码加固延后到 1.0.1", resultEn:"Spot On! version 1.0.0 officially launched at 13:57:27. Search visibility, the mobile landing page, share poster, and early player feedback at 44/60/80/84 points were archived. Code hardening is deferred to version 1.0.1.", link:"01_learning-journal/2026-08-05_entry-17.md"},
  {date:"2026-08-07", day:"16", ms:"M5 发布收口", result:"官方微信公众号文章《找对了大师》俏皮首发：色感达人争霸赛 等你挑战！已发布；线上标题、发布时间与链接已回写本地源、内部/公开 Dashboard 和发布证据包。", resultEn:"The official launch article was published on WeChat. Its live title, publication time, URL, local source, internal/public dashboards, and evidence package were reconciled.", link:"01_learning-journal/2026-08-07_entry-18.md"},
];
