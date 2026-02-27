# Message Processing & Evolution Lifecycle

> The complete journey from input to output, and how skills automatically evolve

---

## Part 1: Full Message Processing Pipeline

### A Message's Journey

From the moment you send a message to when you see the reply, blockcell goes through this complete flow:

```
【Input Phase】
You type: "Get me Apple's current stock quote"
         ↓
Wrapped as InboundMessage {
  text: "Get me Apple's current stock quote",
  channel: "cli",
  chat_id: "default",
  media: []
}
         ↓
Sent to inbound_tx channel

【Processing Phase】
AgentRuntime receives the message
         ↓
1. Intent classification
   IntentClassifier → Finance intent (high confidence)
         ↓
2. Tool set selection
   Finance intent → inject finance tool set (~19 tool schemas)
         ↓
3. Memory retrieval
   FTS5 searches "Apple stock portfolio" → finds relevant memories (e.g. your holdings)
         ↓
4. Build system prompt
   Identity + behavior rules + finance guide + relevant memories + skill hints
         ↓
5. Send to LLM
   [system] + [history (compressed)] + [user: your message]
         ↓
6. LLM response
   Returns tool call: finance_api(action="stock_quote", symbol="AAPL")
         ↓
7. Execute tool
   Calls Alpha Vantage / Yahoo Finance API → gets real-time price
   Result: {"price": 212.50, "change_pct": "+1.4%", ...}
         ↓
8. Tool result sent back to LLM
   Added to message history, LLM generates reply based on result
         ↓
9. LLM generates final reply
   "Apple (AAPL) is currently trading at $212.50, up 1.4%..."

【Output Phase】
         ↓
Wrapped as OutboundMessage
         ↓
ChannelManager routes to correct channel
         ↓
Displayed in terminal / sent to Telegram / pushed via WebSocket
```

### The Tool-Call Loop

LLM may need **multiple rounds of tool calls** to complete a task. blockcell handles this loop automatically:

```
LLM response
  ├── Has tool calls?
  │     ├── Yes → execute tool → add result to history → call LLM again
  │     └── No  → return final reply (done)
  └── Max loop count reached (default 20)? → force-end, return current state
```

**Example (multi-step task):**

```
You: Analyze Apple's technicals and give me a fundamental overview too

LLM round 1: call finance_api(stock_quote, AAPL)
Execute: get real-time price

LLM round 2: call finance_api(stock_history, AAPL, period=daily, count=60)
Execute: get 60-day candlestick data

LLM round 3: call web_search("Apple AAPL 2025 earnings analyst forecast")
Execute: search for latest analysis

LLM round 4: [no tool call] generate comprehensive analysis report
```

The user sent one message; AI automatically completed 3 tool calls.

---

### History Compression Strategy

As conversations grow, history consumes more and more tokens. blockcell uses a dynamic compression strategy:

```
Most recent 1 turn: fully preserved (user + assistant + all tool call details)
  ↑
Last 2 turns: fully preserved
  ↑
Earlier turns: only user message text + assistant final reply text preserved
               tool call args and results stripped (biggest token consumers)
  ↑
Token budget exhausted: even older turns discarded entirely
```

Budget calculation:
```
Available tokens = max_context_tokens (32,000)
                 - system_prompt (~2,000–8,000)
                 - current user message (~50–500)
                 - reserved output space (4,096)
                 - safety buffer (500)
```

### Session Summaries (L2 Memory)

When conversation turns reach 6, the system automatically extracts Q&A pairs and generates a session summary saved to memory:

```json
{
  "type": "session_summary",
  "dedup_key": "session_2025-01-15-14:30",
  "content": "User asked about Apple stock and technical analysis. User holds 100 AAPL shares at $180 cost basis...",
  "scope": "short_term",
  "expires_in_days": 30
}
```

Future conversations can reference key info from past sessions without preserving the full raw history.

---

## Part 2: Skill Evolution Lifecycle

### Evolution State Machine

Every `EvolutionRecord` has a well-defined state:

```
Triggered
    ↓
Generating (LLM writing new code)
    ↓
Generated (new code produced)
    ↓
Auditing (security check)
    ↓ Fails → regenerate with audit report (up to 3 retries)
Audited (passed audit)
    ↓
Compiling (Rhai syntax check)
    ↓ Fails → regenerate with compile error (up to 3 retries)
Compiled (passed compilation)
    ↓
RollingOut (canary deployment active)
    ├── Stage 1: 10% traffic
    ├── Stage 2: 50% traffic (24h later, if error rate OK)
    └── Stage 3: 100% traffic (24h later)
    ↓ Error rate exceeds threshold → auto-rollback
Completed (full rollout, evolution done)
    or
Failed (rolled back)
```

### Error Tracking and Triggering

`ErrorTracker` monitors every skill's execution:

```rust
// Pseudocode
fn report_error(skill_name: &str) {
    let count = increment_error_count(skill_name, within_time_window: 1h);
    if count >= threshold (default: 3) {
        trigger_evolution(skill_name);
    }
}
```

Every tool execution failure (not a user input error) is reported to ErrorTracker.

### Canary Rollout & Traffic Routing

During canary rollout, each skill invocation uses the canary percentage to decide which version to use:

```
canary_percentage = 10%

for each call:
    if random() < 0.10:
        use new_version
    else:
        use old_version
```

`RolloutStats` tracks call counts and error counts for both versions separately. When the new version's error rate is significantly higher than the old version's, auto-rollback triggers immediately.

### Evolution Prompt Structure

When LLM generates evolved code, it receives:

```
1. Rhai language reference (syntax and available APIs)
2. Original task description (what this skill is supposed to do)
3. Current version code (complete SKILL.rhai content)
4. Recent error logs (the errors that triggered evolution)
5. History of failed attempts (on retries, all previous code and failure reasons are included)
```

Each retry adds more context, helping LLM better understand and fix the root cause.

---

## Part 3: Ghost Agent Periodic Runs

The Ghost Agent is a background daemon that runs a "health check" on a regular schedule (default: every 60 seconds):

```
tick (default every 60 seconds)
    ↓
Ghost Agent runs
    ↓
Checks:
  1. Any information worth remembering? (save important memories)
  2. Any expired short-term memories to clean up?
  3. Any proactive messages or reminders needed?
  4. Any system issues that need attention?
    ↓
Ghost outputs conclusions in JSON:
{
  "memory": [...memories to save],
  "cleanup": [...memories to delete],
  "social": "proactive message (if any)",
  "issues": [...]
}
```

Ghost Agent never interrupts the main conversation. It works silently in the background, making blockcell feel like an AI that is genuinely "thinking."

---

*Previous: [Architecture Deep Dive](./12_architecture.md)*
*Next: [Name Origin](./14_name_origin.md)*
