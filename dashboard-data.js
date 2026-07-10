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
  {tag:"M4", name:"提审 + 备案",    nameEn:"Review submission + filing", status:"doing"},
  {tag:"M5", name:"上线 + 首批数据", nameEn:"Launch + first data", status:"todo"},
];

// 上线路线图 8 步（status: done/doing/todo；here:true = 当前位置）
const roadmap = [
  {t:"做游戏", tEn:"Build the game", c:"设计玩法、留广告位", cEn:"Design gameplay and reserve ad slots", time:"进行中", timeEn:"Ongoing", status:"doing", here:true},
  {t:"账号 & 主体", tEn:"Account & entity", c:"微信小游戏「找对了大师」（个人）", cEn:"WeChat mini-game Spot On!找对了大师 (individual entity)", time:"2026-07-04 完成", timeEn:"Completed Jul 4, 2026", status:"done"},
  {t:"软著", tEn:"Software copyright", c:"办软件著作权证书", cEn:"Apply for the software copyright certificate", time:"约 10–15 天", timeEn:"Approx. 10–15 days", status:"doing", here:true},
  {t:"备案", tEn:"Government filing", c:"资质+小游戏备案已提交，等待审核", cEn:"Qualifications + mini-game filing submitted; awaiting review", time:"约 10 个工作日", timeEn:"Approx. 10 business days", status:"doing", here:true},
  {t:"接广告", tEn:"Integrate ads", c:"流量主 + 微信广告插件", cEn:"Traffic owner + WeChat ad plugin", time:"几天", timeEn:"A few days", status:"todo"},
  {t:"提审", tEn:"Submit for review", c:"开发者工具上传、等审核", cEn:"Upload via Developer Tools; wait for review", time:"约 1–2 工作日", timeEn:"Approx. 1–2 business days", status:"todo"},
  {t:"上线", tEn:"Launch", c:"正式发布给玩家", cEn:"Publish for players", time:"即时", timeEn:"Immediate", status:"todo"},
  {t:"运营", tEn:"Operate", c:"看数据 / 换图 / 广告收入", cEn:"Watch data / swap images / ad revenue", time:"持续", timeEn:"Ongoing", status:"todo"},
];

const pillars = [
  {icon:"📓", title:"① AI 学习日志", titleEn:"① AI Learning Journal", desc:"主线 · 文科生靠AI解决技术问题", descEn:"Mainline · humanities background solving technical problems with AI", stat:"8 个工作日 · 最新：首篇公众号发布 + 内容工作流固化 + 求职叙事强化", statEn:"8 workdays · Latest: first WeChat article published + content workflow codified + career narrative strengthened"},
  {icon:"🎮", title:"② 作品交付", titleEn:"② Shipped Proof", desc:"上线游戏 + 简历素材", descEn:"Shipped game + resume material", stat:"V3《找对了大师》：30关大师区+段位+复活广告位；网页版已入作品集，微信正式包就绪", statEn:"V3 Spot On!找对了大师: 30 Master-tier levels + ranks + revive ad placement; web build now in portfolio, WeChat package ready"},
  {icon:"📘", title:"③ 可复制SOP", titleEn:"③ Replicable SOP", desc:"整套流程方法论", descEn:"End-to-end operating method", stat:"新增：Flomo → 日志 → 社媒草稿 → 微信审阅稿 → 公开文章记录的 wrap-up 闭环", statEn:"Added: Flomo → journal → social draft → WeChat review copy → public article record wrap-up loop"},
];

// Published public content evidence. Use official published-page metadata,
// not internal dashboard draft titles or local review links.
const publishedPosts = [
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
    description:"Hi 大家，我的公众号终于正式启动啦！这篇记录了 Corrine 作为一个零代码背景的大纯文科生如何跟 AI 搭档，把第一个可玩的 SpotOn小游戏从灵感做成 MVP，在天马行空的脑宇宙中解锁了AI新手村的第一块小地图~",
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
];
