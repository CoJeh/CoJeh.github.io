/* ============================================================
   SpotOn 仪表盘 · 共享数据（单一数据源 Single Source of Truth）
   ------------------------------------------------------------
   两份仪表盘共用本文件：
   ① 内部版  spot-the-difference-game/dashboard.html（含社媒模块）
   ② 公开版  Corrine-Portfolio/site/dashboard.html（作品集展示版）
   ★ 内容更新只改这里 → 两边自动生效（框架/样式改动才需各自动手）
   ★ 改完后把本文件重新上传 GitHub，线上作品集才会同步
   （内部版专属数据 statusMeta / socialContent 仍在内部版页面里）
   ============================================================ */

const milestones = [
  {tag:"M0", name:"立项 & 环境搭建", status:"done"},
  {tag:"M1", name:"第一个可玩原型", status:"done"},
  {tag:"M2", name:"完整游戏循环",   status:"done"},
  {tag:"M3", name:"接入广告",       status:"todo"},
  {tag:"M4", name:"提审 + 备案",    status:"doing"},
  {tag:"M5", name:"上线 + 首批数据", status:"todo"},
];

// 上线路线图 8 步（status: done/doing/todo；here:true = 当前位置）
const roadmap = [
  {t:"做游戏",     c:"设计玩法、留广告位",              time:"进行中",        status:"doing"},
  {t:"账号 & 主体", c:"微信小游戏「找对了大师」（个人）",  time:"2026-07-04 完成", status:"done"},
  {t:"软著",       c:"办软件著作权证书",                time:"约 10–15 天",   status:"todo"},
  {t:"备案",       c:"资质+小游戏备案已提交，等待审核",   time:"约 10 个工作日", status:"doing", here:true},
  {t:"接广告",     c:"流量主 + 微信广告插件",            time:"几天",          status:"todo"},
  {t:"提审",       c:"开发者工具上传、等审核",           time:"约 1–2 工作日",  status:"todo"},
  {t:"上线",       c:"正式发布给玩家",                  time:"即时",          status:"todo"},
  {t:"运营",       c:"看数据 / 换图 / 广告收入",         time:"持续",          status:"todo"},
];

const pillars = [
  {icon:"📓", title:"① AI 学习日志", desc:"主线 · 文科生靠AI解决技术问题", stat:"6 个工作日 · 最新：V3 优化 + 微信版构建 + 备案提交"},
  {icon:"🎮", title:"② 作品交付",   desc:"上线游戏 + 简历素材",          stat:"V3《找对了大师》：30关大师区+段位+复活广告位；网页版已入作品集，微信正式包就绪"},
  {icon:"📘", title:"③ 可复制SOP",  desc:"整套流程方法论",              stat:"新增：CLI 构建/发布流程 + IAA 爆款公式 + 备案三流程实操踩坑"},
];

const journal = [
  {date:"2026-06-16", day:"01", ms:"M0", result:"立项+命名 Spot On!、搭三支柱+仪表盘、打通 flomo、产出首篇社媒素材", link:"01_learning-journal/2026-06-16_entry-01.md"},
  {date:"2026-06-21", day:"02", ms:"M0", result:"winget 装好 Cocos 3.8.8 + 建好 SpotOn 项目，M0 达成 ✅；首次直面引擎界面", link:"01_learning-journal/2026-06-21_entry-02.md"},
  {date:"2026-06-22", day:"03", ms:"M1", result:"写出第一段能跑的代码 Game.ts，连过 20 关、修好三轮界面 bug，M1 达成 ✅", link:"01_learning-journal/2026-06-22_entry-03.md"},
  {date:"2026-06-24", day:"04", ms:"M2", result:"加倒计时+时间到动画+结算页+一键重来；攻克多设备自适应(720×1280)，M2 达成 ✅；产出 M2 录屏+演示脚本", link:"01_learning-journal/2026-06-24_entry-04.md"},
  {date:"2026-06-24", day:"04", ms:"M2", result:"像产品负责人一样筹备上线：字幕版录屏(学会Clipchamp AI字幕)+可视化playbook+8步上线路线图+备案runbook；定上线timeline，优先级转向作品集", link:"01_learning-journal/2026-06-24_entry-05.md"},
  {date:"2026-06-25 ~ 07-01", day:"—", ms:"—", result:"✈️ 预定外出行程，项目暂停一周——以上全部进度实际只用了 4 个净工作日", pause:true},
  {date:"2026-07-03", day:"05", ms:"M2→M3", result:"Fable 5 项目体检+爆款研究（IAA公式：广告织进玩法+段位进度感）；优先级重排；作品集升格为母项目（Apple风格双语主页）", link:"01_learning-journal/2026-07-03_entry-06.md"},
  {date:"2026-07-04", day:"06", ms:"M3筹备", result:"游戏 V3 优化：30关大师门槛+段位+纪录+连击+复活广告位+点错惩罚；首次 CLI 构建网页版(3.3MB)接入作品集，浏览器实测可玩 ✅", link:"01_learning-journal/2026-07-04_entry-07.md"},
  {date:"2026-07-04", day:"06", ms:"M4", result:"下午续篇：作品集上线 GitHub Pages 🌐；注册微信小游戏「找对了大师」；备案首交被驳回（名称不一致）当天修复重交 ✅——官方审核时钟开始走", link:"01_learning-journal/2026-07-04_entry-07.md"},
];
