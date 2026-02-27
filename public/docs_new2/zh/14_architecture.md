# 架构深度解析

> blockcell 的内部结构：Crate 组织、核心组件、消息流转

---

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                       用户接口层                             │
│   CLI (blockcell agent)  │  Gateway HTTP/WS  │  消息渠道     │
│                          │  (:18790)         │  TG/Slack/...│
└──────────────────────────┬──────────────────┬───────────────┘
                           ↓                  ↓
┌─────────────────────────────────────────────────────────────┐
│                      Agent Runtime 层                        │
│                                                             │
│  AgentRuntime                                               │
│  ├── IntentClassifier   意图分类 → 选择工具集               │
│  ├── ContextBuilder     构建系统提示词 + 注入记忆            │
│  ├── ToolRegistry       工具注册中心（分级 Schema）          │
│  ├── TaskManager        后台任务跟踪                        │
│  ├── MemoryStore        SQLite + FTS5 记忆                  │
│  ├── GhostAgent         后台心跳守护者                      │
│  └── EvolutionService   技能进化引擎                        │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                       Provider 层                            │
│                                                             │
│  factory::create_provider(model, config)                    │
│  ├── OpenAIProvider    (DeepSeek/Kimi/OpenAI/Groq/vLLM)    │
│  ├── AnthropicProvider (Claude 系列，原生 API)              │
│  ├── GeminiProvider    (Google Gemini，原生 API)            │
│  └── OllamaProvider    (本地模型，300s 超时)                │
└──────────────────────────┬──────────────────────────────────┘
                           ↓ HTTP API
                      外部 LLM 服务
```

---

## Crate 结构

blockcell 是一个 Cargo Workspace，拆分为多个 Crate：

```
blockcell/
├── Cargo.toml                  # Workspace 根，共享依赖
├── bin/
│   └── blockcell/              # 可执行二进制入口
│       └── src/
│           └── commands/
│               ├── agent.rs    # blockcell agent 命令
│               ├── gateway.rs  # blockcell gateway 命令
│               ├── onboard.rs  # blockcell onboard 命令
│               ├── status.rs   # blockcell status 命令
│               ├── doctor.rs   # blockcell doctor 命令
│               ├── skills.rs   # blockcell skills 命令
│               ├── evolve.rs   # blockcell evolve 命令
│               ├── memory.rs   # blockcell memory 命令
│               └── ...
└── crates/
    ├── core/                   # 核心类型（Config, Error, Paths, Message）
    ├── agent/                  # Agent 运行时核心
    │   ├── runtime.rs          # 主循环、工具调用、子任务
    │   ├── context.rs          # 系统提示词构建、意图分类触发
    │   ├── intent.rs           # IntentClassifier
    │   ├── ghost.rs            # Ghost Agent
    │   ├── task_manager.rs     # 后台任务管理
    │   └── memory_adapter.rs   # 记忆适配器
    ├── tools/                  # 60+ 工具实现
    │   ├── registry.rs         # ToolRegistry（工具注册、分级 Schema）
    │   ├── finance_api.rs      # 金融数据工具
    │   ├── browser/            # CDP 浏览器自动化
    │   └── ...
    ├── providers/              # LLM Provider 抽象
    │   ├── factory.rs          # 统一 Provider 创建入口
    │   ├── openai.rs           # OpenAI 兼容实现
    │   ├── anthropic.rs        # Anthropic 原生 API
    │   ├── gemini.rs           # Gemini 原生 API
    │   └── ollama.rs           # Ollama 本地模型
    ├── skills/                 # 技能引擎
    │   ├── manager.rs          # SkillManager
    │   ├── engine.rs           # Rhai 脚本执行引擎
    │   ├── evolution.rs        # SkillEvolution（进化核心）
    │   ├── service.rs          # EvolutionService
    │   └── versioning.rs       # VersionManager
    ├── channels/               # 消息渠道
    │   ├── telegram.rs
    │   ├── discord.rs
    │   ├── slack.rs
    │   ├── feishu.rs
    │   ├── dingtalk.rs
    │   └── wecom.rs
    ├── storage/
    │   └── memory.rs           # SQLite + FTS5 记忆存储
    ├── scheduler/              # Cron 任务调度
    └── updater/                # 自动更新（原子替换二进制）
```

---

## 核心组件详解

### AgentRuntime — 系统心脏

`crates/agent/src/runtime.rs`

核心方法：
- `process_message()` — 处理一条用户消息，执行完整 LLM + 工具调用循环
- `execute_tool_call()` — 执行单次工具调用（含路径安全检查）
- `spawn_subagent()` — 在独立线程启动子智能体
- `run_loop()` — 守护循环：心跳、Cron 任务调度、进化检查

**工具调用循环（最多 20 轮）：**

```
process_message()
  ↓
  意图分类 → 选择工具集 → 检索记忆 → 构建消息列表
  ↓
  调用 LLM
  ↓
  响应中有工具调用？
    ├── 是 → execute_tool_call() → 结果追加 → 再次调用 LLM
    └── 否 → 返回最终回复
```

### IntentClassifier — 意图路由

`crates/agent/src/intent.rs`

14 种意图分类，每种对应不同的工具集注入策略：

```
Chat / Finance / Blockchain / FileOps / WebSearch /
DataAnalysis / Communication / SystemControl /
Organization / IoT / Media / DevOps / Lifestyle / Unknown
```

分类器使用关键词匹配 + 正则模式，权重打分后取最高分意图。

### ToolRegistry — 工具注册中心

`crates/tools/src/registry.rs`

**分级 Schema 机制**（关键 Token 优化）：
- **核心工具**（13 个）：注入完整 JSON Schema
- **其他工具**：只注入名称 + 短描述（节省 90% Token）
- **按需升级**：LLM 调用未知工具时，动态加载完整 Schema 后重试

核心工具：`read_file`、`write_file`、`edit_file`、`list_dir`、`exec`、`web_search`、`web_fetch`、`message`、`memory_query`、`memory_upsert`、`spawn`、`list_tasks`、`cron`

### Provider Factory — 供应商路由

`crates/providers/src/factory.rs`

三级优先级：
1. 显式配置（`agents.defaults.provider`）
2. 模型名称前缀推断（`anthropic/` → Anthropic，`ollama/` → Ollama）
3. 扫描 `config.providers` 找第一个有效 API Key

### MemoryStore — SQLite 记忆

`crates/storage/src/memory.rs`

检索分数 = **BM25 FTS5 相关性** × 0.6 + **重要度权重** × 0.3 + **时间衰减** × 0.1

---

## Token 优化策略

### 历史压缩

```
最近 1 轮：完整保留（用户消息 + 助手回复 + 所有工具调用细节）
最近 2 轮：完整保留
更早的轮次：只保留用户文本 + 助手最终文本（剥离工具调用参数和结果）
Token 耗尽：更早的轮次整体丢弃
```

预算计算：
```
可用 Token = max_context(32000) - 系统提示词 - 用户消息 - 保留输出空间(4096) - 安全余量(500)
```

### 工具结果截断

工具返回结果超过 2400 字符时，保留前 1600 + 后 800 字符，防止大文件淹没上下文窗口。

### 查询驱动记忆注入

每次对话只注入与当前问题最相关的 10-20 条记忆，而不是全量注入。

### 分级 Tool Schema

核心工具 13 个完整 Schema（~200 Token 每个），其余工具轻量描述（~5 Token 每个）。

---

## 消息总线

```
消息到达（CLI / Gateway / 渠道）
         ↓
  InboundMessage { text, media, channel, chat_id }
         ↓
  inbound_tx (mpsc::Sender)
         ↓
  AgentRuntime.run_loop() 接收
         ↓
  process_message() 处理
         ↓
  OutboundMessage { text, channel, chat_id }
         ↓
  outbound_tx (mpsc::Sender)
         ↓
  ChannelManager.dispatch_outbound()
         ↓
  路由到对应渠道（Telegram / Slack / 终端 / WebSocket）
```

全程通过 Tokio `mpsc` 通道异步解耦，各渠道完全独立。

---

## 关键依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| `tokio` | 1.x | 异步运行时 |
| `axum` | 0.7 | HTTP / WebSocket 服务器 |
| `reqwest` | 0.12 | HTTP 客户端 |
| `serde` / `serde_json` | 1.x | JSON 序列化 |
| `rusqlite` | 0.31 (bundled) | SQLite 记忆存储 |
| `rhai` | 1.x | 技能脚本引擎 |
| `tokio-tungstenite` | 0.21 | WebSocket |
| `chrono` | 0.4 | 时间处理 |
| `anyhow` | 1.x | 错误处理 |
| `regex` | 1.x | 意图分类器 |

---

*上一篇：[安全机制](./13_security.md)*
*下一篇：[Gateway API 参考](./15_gateway_api.md)*
