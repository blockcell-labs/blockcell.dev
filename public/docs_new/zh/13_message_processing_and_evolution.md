# 消息处理与进化生命周期

> 一条消息从输入到输出的完整旅程，以及技能如何自动进化

---

## Part 1：消息处理全链路

### 一条消息的旅程

从你发出一条消息，到你看到回复，blockcell 内部经历了以下完整的流程：

```
【输入阶段】
你输入：「帮我查一下茅台今天的行情」
         ↓
消息封装为 InboundMessage {
  text: "帮我查一下茅台今天的行情",
  channel: "cli",
  chat_id: "default",
  media: []
}
         ↓
发送到 inbound_tx 通道

【处理阶段】
AgentRuntime 接收消息
         ↓
1. 意图分类
   IntentClassifier → Finance 意图（置信度高）
         ↓
2. 工具集选择
   Finance 意图 → 注入金融工具集（~19 个工具的 Schema）
         ↓
3. 记忆检索
   FTS5 搜索「茅台 行情 股票」→ 找到相关记忆（如你的持仓信息）
         ↓
4. 构建系统提示
   身份信息 + 行为规则 + 金融指南 + 相关记忆 + 技能提示
         ↓
5. 发送给 LLM
   [system] + [历史消息（压缩后）] + [user: 你的消息]
         ↓
6. LLM 响应
   返回工具调用：finance_api(action="stock_quote", symbol="600519")
         ↓
7. 执行工具
   调用东方财富 API → 获取实时价格
   结果：{"price": 1756.5, "change_pct": "+1.2%", ...}
         ↓
8. 工具结果回传 LLM
   加入消息历史，LLM 根据结果生成回复
         ↓
9. LLM 生成最终回复
   「茅台（600519）今日报价 1756.5 元，上涨 1.2%...」

【输出阶段】
         ↓
封装为 OutboundMessage
         ↓
ChannelManager 路由到正确渠道
         ↓
显示在终端 / 发送到 Telegram / 推送到 WebSocket
```

### 工具调用循环

LLM 可能需要**多轮工具调用**才能完成任务。blockcell 自动处理这个循环：

```
LLM 响应
  ├── 有工具调用？
  │     ├── Yes → 执行工具 → 结果加入历史 → 再次调用 LLM
  │     └── No  → 直接返回最终回复（结束）
  └── 最大循环次数（默认 20）达到？→ 强制结束，返回当前状态
```

**示例（多步任务）：**

```
你：帮我分析茅台最近的技术面，顺便看一下基本面

LLM 第1次响应：调用 finance_api(stock_quote, 600519)
执行：获取实时价格

LLM 第2次响应：调用 finance_api(stock_history, 600519, period=daily, count=60)
执行：获取 60 日 K 线

LLM 第3次响应：调用 web_search("茅台 2025 业绩 基本面")
执行：搜索最新分析

LLM 第4次响应：[无工具调用] 生成综合分析报告
```

整个过程用户只发了一条消息，AI 自动完成了 3 次工具调用。

---

### 历史压缩策略

随着对话越来越长，历史记录会占用大量 token。blockcell 使用动态压缩策略：

```
最新 1 轮：完整保留（user + assistant + 所有工具调用详情）
  ↑
最近 2 轮：完整保留
  ↑  
更早的轮次：只保留 user 消息文本 + assistant 最终回复文本
            删除工具调用和工具结果的详情（这些通常是最大的 token 消耗者）
  ↑
Token 预算耗尽：更早的轮次被完全丢弃
```

预算计算：
```
可用 token = max_context_tokens(32000)
           - system_prompt(~2000-8000)
           - 当前用户消息(~50-500)
           - 保留输出空间(4096)
           - 安全缓冲(500)
```

### 会话摘要（L2 记忆）

当对话轮次达到 6 轮，系统会自动提取 Q&A 对，生成会话摘要，保存到记忆库：

```json
{
  "type": "session_summary",
  "dedup_key": "session_2025-01-15-14:30",
  "content": "用户询问了茅台股价和技术分析。用户持有茅台 500 股，成本价 1820 元...",
  "scope": "short_term",
  "expires_in_days": 30
}
```

这使得未来的对话可以参考历史会话的关键信息，而无需保留完整的原始历史。

---

## Part 2：技能进化生命周期

### 进化状态机

每个进化记录（`EvolutionRecord`）都有一个明确的状态：

```
Triggered（已触发）
    ↓
Generating（生成中）
    ↓
Generated（已生成代码）
    ↓
Auditing（审计中）
    ↓ 失败 → 附带审计报告重新生成（最多 3 次）
Audited（已通过审计）
    ↓
Compiling（编译检查中）
    ↓ 失败 → 附带编译错误重新生成（最多 3 次）
Compiled（编译通过）
    ↓
RollingOut（灰度发布中）
    ├── 阶段 1：10% 流量
    ├── 阶段 2：50% 流量（24h 后，若错误率达标）
    └── 阶段 3：100% 流量（再 24h 后）
    ↓ 错误率超标 → 自动回滚
Completed（完成，全量上线）
    或
Failed（失败，已回滚）
```

### 错误追踪与触发

`ErrorTracker` 监控每个技能的执行情况：

```rust
// 伪代码
fn report_error(skill_name: &str) {
    let count = increment_error_count(skill_name, within_time_window: 1h);
    if count >= threshold (default: 3) {
        trigger_evolution(skill_name);
    }
}
```

每次工具执行失败（非用户输入错误），都会上报给 ErrorTracker。

### 灰度发布与流量路由

在灰度发布阶段，每次技能被调用时，系统根据**当前灰度百分比**决定使用新版本还是旧版本：

```
canary_percentage = 10%

for each call:
    if random() < 0.10:
        use new_version
    else:
        use old_version
```

`RolloutStats` 分别追踪新旧版本的调用次数和错误次数，当新版本的错误率明显高于旧版本时，自动触发回滚。

### 进化生成提示词结构

LLM 生成进化代码时，收到的提示包含：

```
1. Rhai 语言参考手册（常用语法和 API）
2. 原始任务描述（这个技能要做什么）
3. 当前版本的代码（SKILL.rhai 完整内容）
4. 近期错误日志（触发进化的错误信息）
5. 历史失败尝试（如果已经重试过，每次失败的代码和失败原因都会附上）
```

重试时，每次都会增加更多上下文，帮助 LLM 更好地理解问题所在。

---

## Part 3：Ghost Agent 定期运行

Ghost Agent（幽灵智能体）是一个定期在后台运行的守护进程，每隔一段时间自动执行一次「健康检查」：

```
tick（默认每 60 秒）
    ↓
Ghost Agent 运行
    ↓
检查项目：
  1. 有没有需要记住的信息？（保存重要记忆）
  2. 有没有过期的短期记忆需要清理？
  3. 需要主动问候用户或提醒什么吗？
  4. 系统有没有需要关注的问题？
    ↓
Ghost 以 JSON 格式输出结论：
{
  "memory": [...要保存的记忆],
  "cleanup": [...要删除的记忆],
  "social": "主动消息（如果有的话）",
  "issues": [...]
}
```

Ghost Agent 不会干扰正常对话，它只在后台默默工作，让 blockcell 更像一个真正在"思考"的 AI。

---

*上一篇：[架构深度解析](./12_architecture.md)*
*下一篇：[名字由来](./14_name_origin.md)*
