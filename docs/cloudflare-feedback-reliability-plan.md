# Portfolio 点赞 API：Cloudflare 持续可用性最小方案

更新日期：2026-07-27
适用范围：`corrine-portfolio-feedback` Worker、D1 点赞数据、R2 待审头像。

## 决策状态

**2026-07-27：暂缓实施。**

Corrine 已确认可靠性目标，但当前有更高优先级事项，因此本方案仅作为未来工作记录，不继续投入开发。只有在移动端点赞异常持续出现、实时数据与 D1 不一致，或作品集增加更多动态数据功能时，再恢复本方案。

恢复讨论时，先阅读后端目录中的
[`FUTURE-WORK.md`](../infra/comment-interactions-worker/FUTURE-WORK.md)，再按本文件的优先级执行，避免重新调查。

## 结论

无法保证任何互联网接口“永远 100% 可用”。对这个低流量作品集，正确目标是：

1. 手机端不再把“接口暂时不可达”误显示成 `0`；
2. 5–10 分钟内发现 Worker 或 D1 故障；
3. 能在 7 天内恢复 D1 到任意分钟，并保留更长期的私密导出；
4. 日常只需每月约 5 分钟人工检查。

不建议现在上 Tail Worker、复杂日志平台或企业级中国网络。先完成“深度健康检查 + Workers Logs + 外部探测 + D1 恢复手册”，维护成本最低。

## 当前架构核对

| 项目 | 当前状态 | 判断 |
|---|---|---|
| 前端 API 地址 | `corrine-portfolio-feedback.corrine-chan1993.workers.dev` | 可用，但 `workers.dev` 更适合个人或爱好项目；Cloudflare 建议生产 Worker 使用 Route 或 Custom Domain。[官方说明](https://developers.cloudflare.com/workers/configuration/routing/) |
| 数据库 | D1，绑定名 `DB` | 点赞实时数量的唯一共享来源。 |
| 文件存储 | 私密 R2 bucket | 只服务待审头像，不是点赞数字的依赖。 |
| 定时任务 | `17 3 * * *`（UTC） | 当前用于每日清理和额度预警，不等于外部可用性监控。Cron 使用 UTC，配置传播最长可能约 15 分钟。[官方说明](https://developers.cloudflare.com/workers/configuration/cron-triggers/) |
| `/health` | 只返回 `{ ok: true }` | **浅健康检查**：只能证明 Worker 路由在运行，不能证明 D1 可以读取。 |
| Workers Logs | `wrangler.jsonc` 未显式配置 | 新建 Worker 默认可能已开启，但当前代码配置无法确认。应显式写入配置，避免状态不确定。Workers Logs 包含调用日志、自定义日志、错误和未捕获异常。[官方说明](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) |
| 后端源码版本控制 | `site/infra/` 当前在 Git 中显示为未跟踪 | **高优先级维护风险**：云端 Worker 可运行，但本地源码、数据库 schema 和配置尚未形成可靠版本记录。 |

## P0：最低成本、应优先落实

### 1. 把 `/health` 改成“深度健康检查”

建议 `/health` 至少执行一次只读 D1 查询，例如 `SELECT 1`；成功返回 HTTP `200`，D1 查询失败返回 HTTP `503`。这样健康检查才能同时验证：

- 公网域名可达；
- Worker 能执行；
- D1 binding 存在；
- D1 能实际接受查询。

点赞读取属于只读查询。Cloudflare D1 对可重试的只读查询会自动重试最多两次；写入查询不会自动重试。[官方说明](https://developers.cloudflare.com/d1/observability/debug-d1/)

建议响应不要包含数据库 ID、表结构、错误堆栈或用户数据：

```json
{
  "ok": true,
  "service": "corrine-portfolio-feedback",
  "database": "reachable"
}
```

头像 R2 不必加入每 5 分钟一次的主健康检查，因为点赞功能不依赖 R2。可以另设低频存储检查，避免通过健康探测制造额外写入和费用。

### 2. 显式启用 Workers Logs

在 Wrangler 配置中明确声明：

```jsonc
"observability": {
  "enabled": true,
  "head_sampling_rate": 1
}
```

低流量作品集可以先记录 100% 调用。Cloudflare Free 计划的 Workers Logs 当前包含每日 200,000 条、保留 3 天；Paid 计划保留 7 天。[官方价格与保留期](https://developers.cloudflare.com/workers/platform/pricing/)

错误日志采用结构化 JSON，只保留运维信息，不记录 voter token、头像审核 token 或个人信息：

```js
console.error({
  event: "likes_read_failed",
  route: "/v1/likes",
  dependency: "D1",
  message: error.message
});
```

Workers Logs 会自动解析结构化 JSON。在控制台使用 `$metadata.error EXISTS` 或 `$workers.outcome = "exception"` 查找异常。[Workers Logs 官方说明](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)；[错误筛选官方说明](https://developers.cloudflare.com/workers/observability/errors/)

### 3. 用“外部探测”监控深度 `/health`

**架构推断：** 不能只让同一个 Worker 的 Cron 检查自己。若 Worker、Cloudflare 路由或 Cron 本身没有运行，它也无法发出“我已停止”的通知。因此必须有一个 Worker 之外的探测器定期请求深度 `/health`。

最低规则：

- 每 5 分钟访问一次；
- 连续 2 次非 `200`、超时或 JSON 中 `ok !== true` 才告警；
- 恢复后再发一封恢复通知；
- 至少从一个中国大陆手机网络和一个境外网络做定期验证。

如果将来自有域名接入 Cloudflare Pro 或更高计划，可使用 Cloudflare Standalone Health Checks 监控指定 hostname、路径和状态码；该产品当前不包含在 Free 计划。[可用计划说明](https://developers.cloudflare.com/health-checks/)
Health Checks 可在状态变化时发送邮件，并要求所选区域中过半探测点确认状态变化，以减少单点误报。[通知说明](https://developers.cloudflare.com/health-checks/how-to/health-checks-notifications/)

如果暂时继续使用 Free 计划和 `workers.dev`，则采用一个轻量的外部 uptime 探测服务即可；不要为了一个低流量点赞 API 先购买复杂监控栈。

### 4. 将后端源码纳入私有、可恢复的版本控制

应版本化以下内容：

- Worker 源码；
- `wrangler.jsonc`；
- D1 `schema.sql` 和未来 migration；
- 部署及恢复说明。

不要提交：

- `VOTER_PEPPER`；
- Cloudflare API token；
- 头像审核 token；
- 数据库导出文件；
- 含 voter hash 或用户数据的日志。

Cloudflare D1 migrations 会用顺序 SQL 文件记录数据库结构变化，并在数据库中记录已应用迁移。[官方说明](https://developers.cloudflare.com/d1/reference/migrations/)

## P1：数据恢复

### 1. 先依赖 D1 Time Travel

D1 Time Travel 默认始终开启，不需要手动创建备份；可恢复到保留窗口内的任意分钟。Free 计划保留 7 天，Workers Paid 计划保留 30 天，历史与恢复本身不另收费。[官方说明](https://developers.cloudflare.com/d1/reference/time-travel/)

每次生产 schema 变更或批量数据操作前，先记录当前 bookmark：

```powershell
npx wrangler d1 time-travel info corrine-portfolio-feedback
```

恢复会原地覆盖数据库并取消进行中的查询，属于破坏性操作；必须在 Corrine 明确批准、确认目标时间后执行：

```powershell
npx wrangler d1 time-travel restore corrine-portfolio-feedback --timestamp="<RFC3339 时间>"
```

Cloudflare 会返回恢复前的 bookmark，可用于撤销本次恢复。[官方恢复说明](https://developers.cloudflare.com/d1/reference/time-travel/)

### 2. 每周或重要变更前做一次私密 SQL 导出

Time Travel 是短期恢复；长期保留可使用：

```powershell
npx wrangler d1 export corrine-portfolio-feedback --remote --output="<私密备份目录>\corrine-portfolio-feedback-YYYY-MM-DD.sql"
```

导出文件不要放进公开作品集仓库。Cloudflare 提醒：导出期间会阻塞其他数据库请求，因此应在低流量时间运行；当前数据库很小，但仍应遵守这一边界。[官方导入导出说明](https://developers.cloudflare.com/d1/best-practices/import-export-data/)

若未来确实需要超过 7/30 天的全自动留档，Cloudflare 支持通过 REST API 和 Workflows 将 D1 导出到 R2；当前阶段不必先增加这套复杂度。[官方说明](https://developers.cloudflare.com/d1/reference/time-travel/)

## P2：域名与中国大陆可达性

### Custom Domain

Cloudflare 建议面向生产的 Worker 使用 Route 或 Custom Domain，而不是长期依赖 `workers.dev`。当 Worker 本身就是 API origin 时，Custom Domain 是推荐方式；Cloudflare会代为创建 DNS 记录和证书。[路由选择说明](https://developers.cloudflare.com/workers/configuration/routing/)；[Custom Domain 说明](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

前提是 Corrine 拥有一个已加入 Cloudflare 的有效 zone。不能把 Custom Domain 配到不属于自己的 `cojeh.github.io`；Cloudflare 明确要求域名属于自己的 zone，且目标 hostname 不能已有冲突 CNAME。[官方限制](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

因此建议：

- 尚无自有域名：继续使用现有 `workers.dev`，先落实深度健康检查和外部监控；
- 已有自有域名：使用 `api.<自有域名>`，保留 `workers.dev` 一段迁移期，确认移动端跨网络均正常后再切换前端。

### 中国大陆现实边界

Cloudflare 官方说明，跨中国大陆网络边界的流量可能面临较高延迟与可靠性问题。Cloudflare China Network 需要 Enterprise 计划、单独订阅、ICP 备案和内容审核。[官方概览](https://developers.cloudflare.com/china-network/)；[接入要求](https://developers.cloudflare.com/china-network/get-started/)

**结论性推断：** 普通 Free/Paid Worker、`workers.dev` 或普通 Custom Domain 都不能承诺中国大陆“始终可达”。Custom Domain 能改善品牌、迁移控制和生产配置，但不能单独解决中国大陆网络波动。若中国大陆招聘者成为核心受众，应先收集 30 天真实失败率；只有失败率证明业务受影响时，再评估中国境内合规后端或双后端，而不是现在直接购买 Enterprise China Network。

## 为什么现在不建议 Tail Worker

Tail Worker 能在主 Worker 执行后接收状态、`console.log()` 和未捕获异常，并可做自定义告警或分析；但它只适用于 Workers Paid/Enterprise，并按 CPU 时间计费。[官方说明](https://developers.cloudflare.com/workers/observability/logs/tail-workers/)

Cloudflare 把 Tail Worker 定位为“高级模式”；对于导出日志和 trace，官方也建议优先考虑内建 OTEL 导出。[官方建议](https://developers.cloudflare.com/workers/observability/logs/tail-workers/)

当前点赞 API 流量低、逻辑简单，Workers Logs + 深度健康探测已经足够。只有满足以下任一条件再升级：

- 一个月发生两次以上难以复盘的故障；
- 需要自动把错误送入 Sentry/Grafana 等集中平台；
- 多个 Worker 需要统一告警。

## Corrine 的每月 5 分钟检查

1. Cloudflare → **Workers & Pages** → `corrine-portfolio-feedback` → **Observability**：
   - 最近 30 天请求量是否异常；
   - 最近 3 天是否有 exception、exceeded resources 或 5xx；
   - Workers 指标包括请求数、错误率、CPU 和执行时间。[官方指标说明](https://developers.cloudflare.com/workers/observability/)
2. Cloudflare → **D1** → `corrine-portfolio-feedback` → **Metrics**：
   - read/write 查询是否仍有活动；
   - query latency 是否异常；
   - storage size 是否异常增长。D1 指标默认显示最近 24 小时，并保留 31 天。[官方说明](https://developers.cloudflare.com/d1/observability/metrics-analytics/)
3. 用手机流量打开中文作品集，确认：
   - Xinjie 点赞数不是 `0`；
   - 点赞一次后刷新仍保持；
   - 取消点赞后数字恢复。
4. 确认外部健康探测最近 30 天没有未处理故障。
5. 确认最近一次私密 D1 导出不超过 7 天；重要变更前额外导出一次。

## 建议的实施顺序

| 顺序 | 动作 | 预计维护 |
|---|---|---|
| 1 | 把 `infra/comment-interactions-worker` 纳入安全版本控制 | 一次性 |
| 2 | 深化 `/health`，让它真实查询 D1 | 一次性 |
| 3 | 显式开启 Workers Logs，并增加不含敏感数据的结构化错误日志 | 一次性 |
| 4 | 配置每 5 分钟外部监控与邮件恢复通知 | 每月看一次 |
| 5 | 建立每周私密 D1 导出，记录恢复步骤 | 每周自动或重要变更前 |
| 6 | 收集 30 天中国大陆与境外可达性，再决定是否迁移 Custom Domain/双后端 | 30 天后决策 |

## 验收标准

- 深度 `/health` 在 D1 正常时返回 `200`，模拟 D1 binding 失败时返回 `503`；
- `/v1/likes` 能返回 Xinjie 的真实计数，手机刷新后保持一致；
- D1 查询失败时 Workers Logs 中能通过固定事件名找到错误；
- 连续两次深度健康检查失败后 10 分钟内收到通知，恢复后收到恢复通知；
- 有一份不在公开仓库内的 7 天以内 SQL 导出；
- 能从 Time Travel 查询出当前 bookmark，但没有在演练中直接覆盖生产库；
- 移动端在中国大陆手机网络与境外网络各完成一次读、赞、取消测试。
