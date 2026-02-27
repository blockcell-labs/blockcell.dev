# Architecture Deep Dive

> Understanding blockcell's internal structure at the code level

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                     │
│   CLI (blockcell agent)  │  Gateway HTTP/WS  │  Message Channels │
│                          │  (port 18790)     │  (TG/Slack/etc.)  │
└─────────────────────────┬───────────────────┬───────────────────┘
                          ↓                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Agent Runtime Layer                        │
│                                                                 │
│  AgentRuntime                                                   │
│  ├── ContextBuilder      (system prompt + intent classification) │
│  ├── IntentClassifier    (14 intents → selects tool set)        │
│  ├── ToolRegistry        (tool registry, tiered schemas)        │
│  ├── TaskManager         (background task tracking)             │
│  ├── MemoryStore         (SQLite + FTS5 memory)                 │
│  └── EvolutionService    (self-evolution engine)                │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                         Provider Layer                           │
│                                                                 │
│  factory::create_provider()                                     │
│  ├── OpenAIProvider      (OpenAI / DeepSeek / Kimi / vLLM)     │
│  ├── AnthropicProvider   (Claude series)                        │
│  ├── GeminiProvider      (Google Gemini)                        │
│  └── OllamaProvider      (local models)                        │
└─────────────────────────┬───────────────────────────────────────┘
                          ↓ (HTTP API)
                    External LLM Services
```

---

## Crate Structure

blockcell is a Cargo Workspace split into multiple crates:

```
blockcell/
├── Cargo.toml                    # Workspace root, shared dependencies
├── bin/
│   └── blockcell/                # Binary entry point
│       └── src/
│           └── commands/
│               ├── agent.rs      # blockcell agent command
│               ├── gateway.rs    # blockcell gateway command
│               ├── provider.rs   # Provider creation (delegates to factory)
│               └── ...
└── crates/
    ├── core/                     # Core types (Config, Error, Paths)
    ├── agent/                    # Agent runtime core
    │   ├── runtime.rs            # Main loop, tool calls, subagents
    │   ├── context.rs            # System prompt building, intent classification
    │   ├── intent.rs             # IntentClassifier
    │   ├── ghost.rs              # Ghost Agent
    │   ├── task_manager.rs       # Background task management
    │   └── memory_adapter.rs     # Memory adapter
    ├── tools/                    # 60+ tool implementations
    │   ├── registry.rs           # ToolRegistry
    │   ├── lib.rs                # ToolContext, cross-crate traits
    │   ├── finance_api.rs        # Financial data
    │   ├── browse/               # Browser automation (CDP)
    │   └── ...
    ├── providers/                # LLM provider abstraction
    │   ├── factory.rs            # Unified provider creation entry point
    │   ├── openai.rs             # OpenAI-compatible implementation
    │   ├── anthropic.rs          # Anthropic native API
    │   ├── gemini.rs             # Gemini native API
    │   └── ollama.rs             # Ollama local models
    ├── skills/                   # Skill engine
    │   ├── manager.rs            # SkillManager
    │   ├── dispatcher.rs         # Rhai → Tool bridge
    │   ├── evolution.rs          # SkillEvolution (evolution core)
    │   ├── service.rs            # EvolutionService
    │   └── versioning.rs         # VersionManager
    ├── channels/                 # Messaging channels
    │   ├── telegram.rs
    │   ├── discord.rs
    │   ├── slack.rs
    │   ├── feishu.rs
    │   ├── dingtalk.rs
    │   └── wecom.rs
    └── storage/
        └── memory.rs             # SQLite + FTS5 memory storage
```

---

## Core Components

### AgentRuntime — The Heart

`crates/agent/src/runtime.rs` is the center of the system.

**Key responsibilities:**
- `process_message()` — Handle a user message, run the full LLM + tool call loop
- `execute_tool_call()` — Execute a single tool call (with path security checks)
- `spawn_subagent()` — Start a subagent in a background thread
- `run_loop()` — Daemon loop: ticks, cron tasks, evolution checks

**Tool call loop:**

```
process_message()
  ↓
  classify intent → select tool set → build messages
  ↓
  call LLM
  ↓
  tool calls in response?
    ├── Yes → execute_tool_call() → add result to messages → call LLM again
    └── No  → return final reply
```

Default max loop iterations: 20 (prevents infinite loops).

### IntentClassifier — Intent Routing

`crates/agent/src/intent.rs`

14 intent categories:

| Intent | Tools Injected | Example Triggers |
|--------|---------------|------------------|
| `Chat` | None (pure chat) | hello, let's chat |
| `FileOps` | File system tools | read file, write code |
| `WebSearch` | Web tools | search, look up |
| `Finance` | Full finance toolkit | stocks, crypto |
| `Blockchain` | Blockchain tools | on-chain, ETH, contract |
| `DataAnalysis` | Data processing tools | analyze data, statistics |
| `Communication` | Email/messaging tools | send email, notify |
| `SystemControl` | System/browser tools | run command, screenshot |
| `DevOps` | Git/cloud tools | deploy, GitHub |
| `IoT` | IoT tools | smart home, turn on light |
| `Media` | Multimedia tools | screenshot, video, TTS |
| `Lifestyle` | Health/calendar tools | schedule, health data |
| `Organization` | Knowledge graph | record, organize knowledge |
| `Unknown` | Core tool set | unrecognized intent |

Intent classification determines which tool schemas are injected into the LLM system prompt — this is the key to token optimization.

### ToolRegistry — Tool Registration Center

`crates/tools/src/registry.rs`

**Tiered Schema mechanism:**
- **Core tools** (13): Full JSON Schema injected (most frequently used by LLM)
- **Other tools**: Only name + short description (saves tokens)
- **On-demand upgrade**: When LLM calls an unknown tool, full schema is dynamically loaded and the call is retried

Core tools: `read_file`, `write_file`, `edit_file`, `list_dir`, `exec`, `web_search`, `web_fetch`, `message`, `memory_query`, `memory_upsert`, `spawn`, `list_tasks`, `cron`

### Provider Factory — Unified Provider Entry Point

`crates/providers/src/factory.rs`

Three-tier priority for provider selection:
1. Explicit config (`agents.defaults.provider`)
2. Model name prefix inference (`anthropic/` → Anthropic, `ollama/` → Ollama, etc.)
3. Scan `config.providers` for the first valid API key

```rust
// Priority logic (simplified)
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

### MemoryStore — SQLite Memory

`crates/storage/src/memory.rs`

```sql
-- Main table
CREATE TABLE memory_items (
    id TEXT PRIMARY KEY,
    scope TEXT,           -- long_term / short_term
    type TEXT,            -- fact / preference / project / task / note
    title TEXT,
    content TEXT,
    summary TEXT,
    tags TEXT,
    importance INTEGER,   -- 0-10, affects retrieval ranking
    dedup_key TEXT,       -- same key = update, not insert
    expires_at INTEGER,   -- optional expiry
    deleted_at INTEGER,   -- soft delete
    created_at INTEGER,
    updated_at INTEGER
);

-- FTS5 full-text search virtual table
CREATE VIRTUAL TABLE memory_fts USING fts5(
    title, summary, content, tags,
    content=memory_items
);
```

Retrieval score = BM25 relevance + importance weight + recency weight

---

## Token Optimization Architecture

blockcell has a carefully designed multi-layer token optimization system:

### 1. Intent Filtering

Different intents inject different tool sets. A "hello" chat message costs < 1,000 tokens, a finance query ~8,000 tokens.

### 2. History Compression

```
Current turn (fully preserved)
  ↑
Last 2 turns (fully preserved)
  ↑
Earlier turns (only user/assistant text kept, tool call details stripped)
  ↑
Dynamic token budget: max_context - system_prompt - user_msg - reserved_output - 500 safety
```

### 3. Tool Result Truncation

When tool results exceed 2,400 characters, the system keeps the first 1,600 + last 800 characters, preventing large files from flooding the context window.

### 4. Query-Driven Memory Retrieval

System prompt only injects the 10-20 most relevant memories for the current question, never all memories.

### 5. Tiered Tool Schemas

Core tools: 13 full schemas. All other tools: name + description only (4-10 tokens vs 200+ tokens per tool).

---

## Message Bus Design

```
Message arrives (CLI / Gateway / channel)
         ↓
  InboundMessage { text, media, channel, chat_id }
         ↓
  Sent to inbound_tx (mpsc::Sender)
         ↓
  AgentRuntime.run_loop() receives it
         ↓
  process_message() handles it
         ↓
  OutboundMessage { text, channel, chat_id }
         ↓
  Sent to outbound_tx (mpsc::Sender)
         ↓
  ChannelManager.dispatch_outbound_msg()
         ↓
  Routes to correct channel (Telegram / Slack / terminal / WebSocket)
```

All communication flows through `mpsc` channels (Rust's standard multi-producer single-consumer queues), achieving complete async decoupling.

---

## Security Architecture

### Path Safety

All file operation tools (`read_file`, `write_file`, `edit_file`, `list_dir`, `exec`) pass through a path safety check before execution:

```
Is the path inside ~/.blockcell/workspace/?
  ├── Yes → execute directly
  └── No  → send ConfirmRequest
            ├── User confirms (y) → execute
            └── User declines (n) → return rejection error
```

### Subagent Constraints

Subagents use a restricted tool registry (excludes `spawn`, `cron`, `message`) to prevent runaway behavior.

### Skill Code Audit

Evolution-generated code must pass a safety audit (checking for dangerous operations) before entering canary rollout.

### Gateway Authentication

Bearer Token auth with optional IP allowlist and CORS configuration.

---

## Key Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tokio` | 1.x | Async runtime |
| `axum` | 0.7 | HTTP/WebSocket server |
| `reqwest` | 0.12 | HTTP client |
| `serde` / `serde_json` | 1.x | JSON serialization |
| `rusqlite` | 0.31 (bundled) | SQLite memory storage |
| `rhai` | 1.x | Skill scripting engine |
| `tokio-tungstenite` | 0.21 | WebSocket |
| `chrono` | 0.4 | Time handling |
| `anyhow` | 1.x | Error handling |

---

*Previous: [Subagents & Concurrency](./11_subagents.md)*
*Next: [Message Processing & Evolution Lifecycle](./13_message_processing_and_evolution.md)*
