# 留言互动后端：未来工作

## 暂缓事项：Cloudflare 实时数据可靠性加固

- 决策日期：2026-07-27
- 当前状态：已记录，暂不实施
- 决策人：Corrine
- 适用服务：`corrine-portfolio-feedback` Worker、D1 点赞数据

### 已确认的目标

1. 实时接口正常时显示 D1 的实时数据；
2. 接口异常时不把错误状态误报为 `0`；
3. Worker 或 D1 故障在 5–10 分钟内被发现；
4. 点赞数据可以恢复。

### 当前边界

- Worker、D1 绑定、CORS 和线上点赞 API 在 2026-07-27 的只读检查中正常。
- 前端已有最近核验数回退，避免接口失败时错误显示 `0`。
- 当前 `/health` 只是浅检查，没有真实查询 D1。
- 当前额度提醒不能代替外部宕机监控。
- `workers.dev` 和普通 Cloudflare 全球网络不能保证中国大陆移动网络始终可达。
- 本事项暂缓，不继续增加监控、日志或新基础设施。

### 何时恢复处理

出现以下任一情况时，重新打开本事项：

- 手机端再次持续显示 `0`、旧数字或点赞按钮不可用；
- 页面数字与 D1 实际记录不一致；
- `/health` 或 `/v1/likes` 连续失败；
- Cloudflare Observability 出现持续 5xx 或 D1 错误；
- 作品集增加更多必须实时同步的动态数据；
- 准备把当前 `workers.dev` 地址迁移到自有 Custom Domain。

### 恢复后的实施顺序

1. 将 `/health` 改为真实查询 D1；成功返回 `200`，失败返回 `503`。
2. 显式启用 Workers Logs，并加入不含敏感信息的结构化错误日志。
3. 增加 Cloudflare 之外的外部探测：每 5 分钟检查一次，连续失败两次告警，恢复后通知。
4. 将后端源码、Wrangler 配置和 D1 schema 安全纳入版本控制，密钥继续只存 Cloudflare。
5. 确认 D1 Time Travel，并建立私密 SQL 导出与恢复说明。
6. 收集 30 天中国大陆与境外访问失败率，再决定 Custom Domain 或备用后端。

完整调查、官方资料和验收标准：

[`../../docs/cloudflare-feedback-reliability-plan.md`](../../docs/cloudflare-feedback-reliability-plan.md)
