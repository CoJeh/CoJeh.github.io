# Corrine Portfolio 流量与行为分析方案研究（官方资料）

研究日期：2026-07-26
范围：GitHub Pages 静态作品集，以及英文/中文 Portfolio、Dashboard、Playbook 页面。
来源原则：只使用 Cloudflare、Google、Microsoft、GitHub 官方资料。

## 结论先行

### 推荐的第一阶段：只上 Microsoft Clarity，运行 30 天

原因不是它“数据最多”，而是它最直接回答 Corrine 当前的四个问题：

| Corrine 想知道 | Clarity 能回答什么 |
|---|---|
| 访客量 | Unique users、Sessions、Page views、Pages/session |
| 他们是谁 | 匿名的国家/地区、来源页、设备、操作系统；**不是姓名、公司或职位** |
| 停留多久 | 单次 Session duration、页面数、滚动情况 |
| 点击哪里 | Click/Scroll/Area/Attention heatmaps，以及会话录制重放 |

Clarity 官方称服务永久免费且无网站流量上限；但录制保存存在技术边界：每项目每天最多保留 100,000 个 session recordings，超过后抽样。对个人作品集这通常不是现实限制。[Clarity 定价](https://clarity.microsoft.com/pricing)；[Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq)；[Clarity Client API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api)

### 第二阶段：有明确推广渠道后，再加 GA4

当 Corrine 开始经常从 LinkedIn、简历、招聘邮件、微信文章等不同入口引流，并需要长期比较“哪个渠道带来的访客更投入”时，再加入 GA4。GA4 的优势是渠道归因、UTM campaign、页面趋势、平均参与时长和自定义关键事件；它不是热图或录屏工具。

### Cloudflare Web Analytics：适合隐私优先的流量基线，不足以单独完成本目标

它免费、无 cookie、不使用 localStorage，也不靠 IP/User-Agent 指纹追踪个人，适合看 visits、page views、来源、国家、设备和网页性能。但官方当前的高阶指标只有 Visits、Page views、Page load time、Core Web Vitals；不提供停留时长、点击热图、会话录制，且暂不支持 UTM 参数和 custom events。因此它可以是“轻量流量计”，不能单独回答 Corrine 最关心的行为问题。[Cloudflare 高阶指标](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/)；[Cloudflare FAQ](https://developers.cloudflare.com/web-analytics/faq/)；[Cloudflare 隐私优先说明](https://blog.cloudflare.com/the-rum-diaries-enabling-web-analytics-by-default/)

## 一个必须先接受的数据边界：“Who they are”不是个人身份

三种工具都不能从匿名访问中可靠地告诉 Corrine“这是哪位招聘经理、来自哪家公司、叫什么名字”：

- Cloudflare 明确不使用 cookie/localStorage，也不通过 IP、User-Agent 或其他指纹长期追踪个人。
- GA4 可显示聚合的国家、城市、语言、设备，以及在启用 Google signals 后可能出现的年龄段、性别和兴趣；但这些人口属性仅来自已同意共享的用户，低流量时会被 threshold 隐藏。Google 还禁止客户向 GA 发送可识别个人身份的信息。
- Clarity 会给浏览器/设备分配匿名 ID，可在单次会话卡中显示国家、设备、referrer 等，但这不是现实身份。同一个人换设备会被视为不同用户。

官方来源：[Cloudflare privacy-first Web Analytics](https://blog.cloudflare.com/free-privacy-first-analytics-for-a-better-web/)；[GA4 Demographic details](https://support.google.com/analytics/answer/12948931?hl=en)；[GA4 PII 规则](https://support.google.com/analytics/answer/6366371?hl=en)；[Clarity FAQ](https://learn.microsoft.com/en-us/clarity/faq)

如果未来需要知道“招聘者/潜在合作方是哪类人”，更可靠的办法是让访客**自愿完成一个动作**，例如点击带不同 UTM 的专属链接、提交联系表单、预约交流，或在反馈中自愿选择身份类别。不要试图用分析工具反向识别匿名个人。

## 三个工具逐项比较

| 能力 | Cloudflare Web Analytics | Google Analytics 4 | Microsoft Clarity |
|---|---|---|---|
| 免费与流量限制 | 免费；非 Cloudflare 代理的网站每账号最多 10 个 analytics sites；可查看近 6 个月；7 天内保留未抽样 beacon 数据，之后聚合/查询会动态抽样 | 标准 GA4 property 免费；存在配置和探索查询限制；探索的用户/事件级数据最长 14 个月，标准聚合报告不受该 retention 设置影响 | 永久免费、无总流量上限；session recording 每项目每天最多保留 100,000 个，超出抽样 |
| 访客量 | Visits、Page views | Active/New/Total users、Sessions、Views、Engaged sessions | Unique users、Sessions、Page views、Pages/session |
| 访客属性 | Country、referrer、path、device、browser、OS；不追踪个人 | Country/city/language/device/browser/source/medium；可选人口属性受 consent、Google signals 和 threshold 限制 | Country、referrer、device、OS、匿名 User ID；可查看 visitor profile，但不是现实身份 |
| 停留 | **不提供停留时长**；Page load time 是加载性能，不是阅读时间 | Average engagement time、engagement rate、bounce rate；网页只有在焦点中才计入 engagement | Session duration、页面数、滚动深度，并可重放匿名会话 |
| 点击 | **无 custom events、无热图/录屏** | Enhanced measurement 自动收 outbound clicks、file downloads、90% scroll；站内按钮点击通常要另配 GTM/custom events | 自动收集 clicks/taps/scrolls/mouse movement；Click/Scroll/Area/Attention maps 和 recordings |
| 营销归因 | Referrer 可用；截至本研究日期不支持 UTM query parameters | 强项：source/medium/campaign、UTM、acquisition、path exploration、key events | 有 referrer、entry/exit URL 和筛选；可与 GA 集成，把 GA segment 关联到录屏 |
| 隐私负担 | 最低：无 cookie/localStorage、无用户指纹；但仍应在隐私说明中披露 | 使用第一方 cookie/标识符；Google 要求告知用户并让用户有同意/拒绝机会；禁止发送 PII | 典型完整功能依赖 cookie；默认遮罩敏感内容，但会采集 DOM 和交互用于重放；EEA/UK/瑞士访客自 2025-10-31 起需有效 consent signal 才能获得完整功能 |
| 数据保留 | Dashboard 可访问近 6 个月 | 用户/事件级探索可设 2 或 14 个月；年龄、性别、兴趣始终仅 2 个月；标准聚合报告不受此设置影响 | Playback 30 天；Heatmaps/Click data 9 个月；标记/收藏 session 9 个月 |
| GitHub Pages 安装 | 在需要追踪的每个 HTML 页面 `</body>` 前粘同一个 site beacon | 在需要追踪的每个 HTML 页面 `<head>` 开头后粘同一个 Google tag | 在需要追踪的每个 HTML 页面 `<head>` 内粘同一个 project tracking code |

### 比较表的官方依据

- Cloudflare：[Limits](https://developers.cloudflare.com/web-analytics/limits/)、[Get started](https://developers.cloudflare.com/web-analytics/get-started/)、[Dimensions](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/)、[FAQ 与数据保留/抽样/UTM/custom event 边界](https://developers.cloudflare.com/web-analytics/faq/)
- GA4：[免费标准服务条款](https://marketingplatform.google.com/about/analytics/terms/us/)、[Pages and screens report](https://support.google.com/analytics/answer/12926732?hl=en)、[User engagement](https://support.google.com/analytics/answer/11109416?hl=en)、[Enhanced measurement](https://support.google.com/analytics/answer/9216061?hl=en)、[Click trigger](https://support.google.com/tagmanager/answer/7679320?hl=en)、[Data retention](https://support.google.com/analytics/answer/7667196?hl=en)、[隐私与 cookie](https://support.google.com/analytics/answer/6004245?hl=en)
- Clarity：[Pricing](https://clarity.microsoft.com/pricing)、[Setup](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)、[Session recordings](https://learn.microsoft.com/en-us/clarity/session-recordings/recordings-overview)、[Session card 字段](https://learn.microsoft.com/en-us/clarity/session-recordings/session-list)、[Heatmaps](https://learn.microsoft.com/en-us/clarity/heatmaps/heatmaps-overview)、[Data collected](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data)、[Masking](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking)、[Consent management](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-management)、[Data retention](https://learn.microsoft.com/en-us/clarity/setup-and-installation/data-retention)

## GitHub Pages 的边界

GitHub Pages 只是把仓库中的 HTML、CSS、JavaScript 发布成静态网站；因此上述三种前端 JavaScript tag 都可以装，不需要后端服务器。[GitHub Pages 官方定义](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

GitHub 仓库自身的 **Insights → Traffic** 只显示仓库近 14 天的访问、referrer 和 popular content，不应当被当成完整的作品集网站行为分析系统。[GitHub repository traffic](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository)

GitHub 官方还说明，Pages 访问时 GitHub 会为安全目的记录访客 IP；这不等于 Corrine 能在 GitHub Pages 后台查看或识别这些 IP。[GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection)

## 对当前 Corrine-Portfolio 的安装范围

当前应使用**同一个 analytics project/site ID**覆盖同一域名下的公开页面：

- `site/index.html`
- `site/index.zh.html`
- `site/dashboard.html`
- `site/dashboard.en.html`
- `site/playbook.html`
- `site/playbook.zh.html`

`site/dashboard-standalone.html` 只有在它仍是有意公开、希望纳入分析的页面时才安装。`site/play/` 游戏页面是否纳入，应作为单独决定，避免把“作品集阅读行为”和“游戏试玩行为”混成一个改进问题。

因为这些是独立静态 HTML，不能只在首页安装；官方三家都要求 tracking snippet 出现在每个希望监测的页面。发布前应同时更新隐私说明，并排除 Corrine 自己的测试访问（Clarity 支持 block internal IP；GA4 可配置 internal traffic filter）。

## 推荐的 30 天最小实施方案

### 工具

1. 创建一个 Clarity project，域名使用线上 Portfolio hostname。
2. 在上述六个公开页面的 `<head>` 中加入同一段 tracking code。
3. 保持 Clarity 默认的敏感内容遮罩，不要 unmask 联系方式、表单、反馈内容或其他个人信息。
4. 增加简短隐私说明和 consent 机制；尤其要考虑 EEA、UK、瑞士流量。Clarity 官方推荐 Consent Mode + Consent API v2 或支持的 CMP。
5. 发布后用 Clarity 的实时数据/浏览器 Network 中的 `clarity.ms/collect` 请求验证每页。

### 每两周只检查一个小记分卡

| 业务问题 | 指标/证据 |
|---|---|
| 有多少人真正看作品集？ | Unique users、Sessions、Page views |
| 哪些入口带来有效访客？ | Referrer、entry page、country、device |
| 首页是否把人带到证据页？ | 首页到 Dashboard/Playbook 的点击和 page journey |
| 哪页让人停留？ | Session duration、pages/session、scroll depth |
| 核心 CTA 是否被看到和点击？ | Click map + scroll map；抽看相关 recordings |
| 哪里令人困惑？ | Dead clicks、rage clicks、quick backs、反复滚动、JS errors |

在低流量个人作品集上，不要因为 2–3 个 session 就重做页面。先积累约 30 天，并把“改了什么、哪天上线、希望改善哪个指标”记下来；这样下一轮数据才有可比较的假设。

## 何时升级到 GA4 + Clarity

满足任一条件再加 GA4：

- Corrine 开始在 LinkedIn、简历、招聘邮件、微信文章使用不同 UTM 链接；
- 需要按月长期保存并比较 acquisition / engagement 趋势；
- 需要把 `Open Dashboard`、`Open Playbook`、`Play Demo`、`Contact` 等定义成 key events；
- 需要 funnel/path exploration，而不只是看热图。

届时可以用官方 Clarity–GA integration 把 GA segment 关联到 session playback。不要同时再加 Cloudflare Web Analytics，除非 Corrine明确需要一个无 cookie 的独立流量基线；三个脚本一起上会增加维护和解释成本，却不一定增加可执行洞察。

## 最终建议

**现在选 Clarity；30 天后用真实问题决定是否加 GA4。**
Cloudflare Web Analytics 是优秀的隐私优先流量工具，但无法回答停留与点击；GA4 很强，但在当前低流量、以作品集体验改进为目标的阶段，配置和解读成本高于立即收益。Clarity 最适合先把“访客在哪停、在哪点、在哪里迷失”变成可见证据。
