# 架构深度解析

> 从代码层面理解 blockcell 的内部结构

---

## 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户接口层                                 │
│   CLI (blockcell agent)  │  Gateway HTTP/WS  │  消息渠道          │
│                          │  (port 18790)     │  (TG/Slack/飞书)  │
└─────────────────────────┬───────────────────┬───────────────────┘
                          ↓                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Agent 运行时层                              │
│                                                                 │
│  AgentRuntime                                                   │
│  ├── ContextBuilder      (系统提示构建 + 意图分类)                 │
│  ├── IntentClassifier    (14 种意图，决定注入哪些工具)              │
│  ├── ToolRegistry        (工具注册中心，分层 Schema)               │
│  ├── TaskManager         (后台任务追踪)                           │
│  ├── MemoryStore         (SQLite + FTS5 记忆)                   │
│  └── EvolutionService    (自我进化引擎)                           │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Provider 层                                │
│                                                                 │
│  factory::create_provider()                                     │
│  ├── OpenAIProvider      (OpenAI / DeepSeek / Kimi / vLLM)     │
│  ├── AnthropicProvider   (Claude 系列)                          │
│  ├── GeminiProvider      (Google Gemini)                        │
│  └── OllamaProvider      (本地模型)                              │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓ (HTTP API)
                    外部 LLM 服务
```

---

## Crate 结构

blockcell 是一个 Cargo Workspace，代码分为多个 crate：

```
blockcell/
├── Cargo.toml                    # Workspace 根，定义共享依赖
├── bin/
│   └── blockcell/                # 二进制入口
│       └── src/
│           └── commands/
│               ├── agent.rs      # blockcell agent 命令
│               ├── gateway.rs    # blockcell gateway 命令
│               ├── provider.rs   # Provider 创建（委托给 factory）
│               └── ...
└── crates/
    ├── core/                     # 基础类型（Config, Error, Paths）
    ├── agent/                    # Agent 运行时核心
    │   ├── runtime.rs            # 主循环，工具调用，子智能体
    │   ├── context.rs            # 系统提示构建，意图分类
    │   ├── intent.rs             # IntentClassifier
    │   ├── ghost.rs              # Ghost Agent
    │   ├── task_manager.rs       # 后台任务管理
    │   └── memory_adapter.rs     # 记忆适配器
    ├── tools/                    # 60+ 工具实现
    │   ├── registry.rs           # ToolRegistry
    │   ├── lib.rs                # ToolContext, 跨 crate trait
    │   ├── finance_api.rs        # 金融数据
    │   ├── browse/               # 浏览器自动化（CDP）
    │   └── ...（60+ 文件）
    ├── providers/                # LLM Provider 抽象
    │   ├── factory.rs            # 统一 Provider 创建入口
    │   ├── openai.rs             # OpenAI 兼容实现
    │   ├── anthropic.rs          # Anthropic 原生 API
    │   ├── gemini.rs             # Gemini 原生 API
    │   └── ollama.rs             # Ollama 本地模型
    ├── skills/                   # 技能引擎
    │   ├── manager.rs            # SkillManager
    │   ├── dispatcher.rs         # Rhai → Tool 桥接
    │   ├── evolution.rs          # SkillEvolution（进化核心）
    │   ├── service.rs            # EvolutionService
    │   └── versioning.rs         # VersionManager
    ├── channels/                 # 消息渠道
    │   ├── telegram.rs
    │   ├── discord.rs
    │   ├── slack.rs
    │   ├── feishu.rs
    │   ├── dingtalk.rs
    │   └── wecom.rs
    └── storage/
        └── memory.rs             # SQLite + FTS5 记忆存储
```

---

## 核心组件详解

### AgentRuntime — 运行时核心

`crates/agent/src/runtime.rs` 是整个系统的心脏。

**主要职责：**
- `process_message()` — 处理一条用户消息，运行完整的 LLM + Tool 调用循环
- `execute_tool_call()` — 执行单个工具调用（含路径安全检查）
- `spawn_subagent()` — 在后台线程启动子智能体
- `run_loop()` — 守护循环：处理 tick、定时任务、进化

**工具调用循环：**

```
process_message()
  ↓
  分类意图 → 选择工具集 → 构建消息
  ↓
  LLM 推断
  ↓
  有工具调用？
    ├── Yes → execute_tool_call() → 结果加回消息 → 继续循环
    └── No  → 返回最终回复
```

最大循环次数默认为 20，防止无限循环。

### IntentClassifier — 意图分类

`crates/agent/src/intent.rs`

14 种意图类别：

| 意图 | 注入的工具集 | 示例触发词 |
|------|------------|-----------|
| `Chat` | 无工具（纯对话） | 你好、聊天 |
| `FileOps` | 文件系统工具 | 读文件、写代码 |
| `WebSearch` | web 工具 | 搜索、查一下 |
| `Finance` | 金融工具全集 | 股票、加密货币 |
| `Blockchain` | 区块链工具 | 链上、ETH、合约 |
| `DataAnalysis` | 数据处理工具 | 分析数据、统计 |
| `Communication` | 邮件/消息工具 | 发邮件、通知 |
| `SystemControl` | 系统/浏览器工具 | 执行命令、截图 |
| `DevOps` | Git/云服务工具 | 部署、GitHub |
| `IoT` | IoT 工具 | 智能家居、开灯 |
| `Media` | 多媒体工具 | 截图、视频、TTS |
| `Lifestyle` | 健康/日历工具 | 日程、健康数据 |
| `Organization` | 知识图谱 | 记录、整理知识 |
| `Unknown` | 核心工具集 | 不能识别的意图 |

意图分类决定了哪些工具的 Schema 会被注入到 LLM 的系统提示中，这是 token 优化的关键。

### ToolRegistry — 工具注册中心

`crates/tools/src/registry.rs`

**分层 Schema 机制：**
- **核心工具**（13个）：完整 JSON Schema 注入（LLM 最常用的工具）
- **其他工具**：只注入名称 + 简短描述（节省 token）
- **按需升级**：LLM 调用未知工具时，动态加载完整 Schema 后重试

核心工具列表：`read_file`, `write_file`, `edit_file`, `list_dir`, `exec`, `web_search`, `web_fetch`, `message`, `memory_query`, `memory_upsert`, `spawn`, `list_tasks`, `cron`

### Provider Factory — 统一 Provider 入口

`crates/providers/src/factory.rs`

三级优先级选择 Provider：
1. 显式配置（`agents.defaults.provider`）
2. 模型名前缀推断（`anthropic/` → Anthropic，`ollama/` → Ollama 等）
3. 扫描 config.providers，找第一个有效 API Key

```rust
// 优先级逻辑（简化）
fn create_provider(config, model, explicit) -> Box<dyn Provider> {
    if let Some(name) = explicit {
        return provider_by_name(name, config);
    }
    if let Some(name) = infer_from_model_prefix(model) {
        return provider_by_name(name, config);
    }
    provider_by_name(fallback_provider_name(config), config)
}
```

### MemoryStore — SQLite 记忆

`crates/storage/src/memory.rs`

```sql
-- 主表
CREATE TABLE memory_items (
    id TEXT PRIMARY KEY,
    scope TEXT,           -- long_term / short_term
    type TEXT,            -- fact / preference / project / task / note
    title TEXT,
    content TEXT,
    summary TEXT,
    tags TEXT,
    importance INTEGER,   -- 0-10，影响检索排名
    dedup_key TEXT,       -- 相同 key 更新而不新建
    expires_at INTEGER,   -- 可选过期时间
    deleted_at INTEGER,   -- 软删除
    created_at INTEGER,
    updated_at INTEGER
);

-- FTS5 全文搜索虚拟表
CREATE VIRTUAL TABLE memory_fts USING fts5(
    title, summary, content, tags,
    content=memory_items
);
```

检索排分 = BM25 相关性 + 重要性加权 + 时效性加权

---

## Token 优化架构

blockcell 有一套精心设计的 token 优化机制：

### 1. 意图过滤

不同意图注入不同工具集，"你好"这类聊天消息消耗 < 1000 token，金融查询约 8000 token。

### 2. 历史压缩

```
当前轮（完整保留）
  ↑
最近 2 轮（完整保留）
  ↑
较早的轮次（只保留 user/assistant 文本，删除工具调用详情）
  ↑
动态 token 预算：max_context - system_prompt - user_msg - reserved_output - 500 safety
```

### 3. 工具结果截断

工具执行结果超过 2400 字符时，截取首 1600 字符 + 末 800 字符，避免大文件内容撑爆上下文。

### 4. 记忆按需检索

系统提示只注入与当前问题最相关的 10-20 条记忆，而不是所有记忆。

### 5. 分层工具 Schema

核心工具 13 个完整 Schema，其余工具只有名字+描述（4-10 token vs 200+ token）。

---

## 消息总线设计

```
消息进来（CLI / Gateway / 渠道）
         ↓
  InboundMessage { text, media, channel, chat_id }
         ↓
  发送到 inbound_tx（mpsc::Sender）
         ↓
  AgentRuntime.run_loop() 接收
         ↓
  process_message() 处理
         ↓
  OutboundMessage { text, channel, chat_id }
         ↓
  发送到 outbound_tx（mpsc::Sender）
         ↓
  ChannelManager.dispatch_outbound_msg()
         ↓
  发回到对应渠道（Telegram / Slack / 终端 / WebSocket）
```

所有通信都通过 `mpsc` 通道（Rust 标准的多生产者单消费者队列），实现了完全的异步解耦。

---

## 安全架构

### 路径安全

所有文件操作工具（read_file, write_file, edit_file, list_dir, exec）在执行前都经过路径安全检查：

```
路径是否在 ~/.blockcell/workspace/ 内？
  ├── 是 → 直接执行
  └── 否 → 发送 ConfirmRequest
            ├── 用户确认 (y) → 执行
            └── 用户拒绝 (n) → 返回拒绝错误
```

### 子智能体限制

子智能体使用受限的工具注册表（不包含 spawn、cron、message），防止失控。

### 技能代码审计

进化生成的代码必须通过安全审计（检查危险操作），才能进入灰度发布流程。

### Gateway 认证

Bearer Token 鉴权，支持白名单 IP 和 CORS 配置。

---

## 关键依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| `tokio` | 1.x | 异步运行时 |
| `axum` | 0.7 | HTTP/WebSocket 服务 |
| `reqwest` | 0.12 | HTTP 客户端 |
| `serde` / `serde_json` | 1.x | JSON 序列化 |
| `rusqlite` | 0.31 (bundled) | SQLite 记忆存储 |
| `rhai` | 1.x | 技能脚本引擎 |
| `tokio-tungstenite` | 0.21 | WebSocket |
| `chrono` | 0.4 | 时间处理 |
| `anyhow` | 1.x | 错误处理 |

---

*上一篇：[子智能体与任务并发](./11_subagents.md)*
*下一篇：[消息处理与进化生命周期](./13_message_processing_and_evolution.md)*
