# Skill System

> Package complex multi-step tasks into reusable workflows

---

## Skills vs Tools: What's the Difference?

**Tools** are single-purpose functions like `read_file` or `web_search`. They do one thing at a time.

**Skills** are orchestrated workflows that combine multiple tool calls into a complete task.

Example:

```
Tool level:
  read_file → web_search → finance_api → message
  (4 independent calls, LLM decides each step)

Skill level: "stock_monitor"
  1. Get stock price (finance_api)
  2. Compute technical indicators (local calculation)
  3. Check alert conditions (logic)
  4. Format report (structured output)
  5. Send to Telegram (message)
  (1 invocation, deterministic execution, no LLM needed for each step)
```

Key advantages of skills:
- **Deterministic**: Fixed execution logic, unaffected by LLM randomness
- **Efficient**: Fewer LLM calls, lower token cost
- **Reusable**: Define once, invoke repeatedly
- **Evolvable**: The system can auto-optimize skill code

---

## Anatomy of a Skill

Every skill is a directory containing:

```
skills/stock_monitor/
├── meta.yaml      ← Metadata: trigger words, permissions, description
├── SKILL.md       ← LLM instruction manual (AI reads this)
├── SKILL.rhai     ← Executable orchestration script (Rhai language)
└── tests/         ← Test cases (optional)
    ├── basic_test.json
    └── alert_test.json
```

### meta.yaml — Metadata

```yaml
name: stock_monitor
description: "Monitor stock prices and technical indicators for US/HK/China markets"
version: "1.0.0"
author: "blockcell"

triggers:
  - "stock"
  - "price"
  - "monitor"
  - "candlestick"
  - "technical indicator"

permissions:
  - network
  - message

capabilities:
  - finance_api
  - alert_rule
  - message
```

`triggers` defines which keywords activate this skill. When matched, the corresponding `SKILL.md` is injected into the AI's system prompt.

### SKILL.md — LLM Instruction Manual

This file tells the AI:
- What this skill can do
- How to trigger each feature
- The correct order to call tools
- How to handle common scenarios
- Fallback and error-handling strategies

```markdown
# Stock Monitor Skill

## Trigger Scenarios
Activate when user mentions stock prices, candlestick charts, technical indicators, or alert setup.

## Data Source Selection
- China A-shares (6-digit) → Eastmoney API (auto)
- Hong Kong (5-digit or .HK suffix) → Eastmoney HK
- US stocks → Alpha Vantage / Yahoo Finance

## Basic Query Flow
1. finance_api stock_quote — get real-time price
2. finance_api stock_history — get candlestick data
3. Calculate MA5/MA20/MACD/RSI locally
4. Format and return output
...
```

### SKILL.rhai — Orchestration Script

Written in [Rhai](https://rhai.rs) scripting language for deterministic workflow execution:

```rhai
// SKILL.rhai example: simple stock query
let symbol = ctx["symbol"];
let source = if is_chinese_stock(symbol) { "eastmoney" } else { "auto" };

// Get real-time quote
let quote = call_tool("finance_api", #{
    action: "stock_quote",
    symbol: symbol,
    source: source
});

if is_error(quote) {
    // Fallback: try alternative source
    quote = call_tool("finance_api", #{
        action: "stock_quote",
        symbol: symbol
    });
}

// Format output
let price = get_field(quote, "price");
let change = get_field(quote, "change_pct");

set_output(`${symbol} current price: ${price}, change: ${change}%`);
```

Rhai scripts have full access to all tools via `call_tool(name, params)`.

---

## Built-in Skills

blockcell ships with 40+ built-in skills:

### Finance & Investment

| Skill | Features |
|-------|----------|
| `stock_monitor` | A-share/HK/US monitoring, technical indicators, fund flows |
| `bond_monitor` | Yield curves, credit bonds, convertibles, central bank ops |
| `futures_monitor` | Futures positions, basis, options volatility |
| `crypto_onchain` | On-chain data, DeFi TVL, stablecoins, gas, whale alerts |
| `macro_monitor` | GDP/CPI/PMI, central bank policy, US-China rate spreads |
| `daily_finance_report` | Auto-generate daily/weekly financial reports |
| `portfolio_advisor` | Asset allocation suggestions, risk analysis |
| `token_security` | Token security scanning, rug pull risk |

### Development Tools

| Skill | Features |
|-------|----------|
| `code_review` | Code review, security analysis |
| `git_workflow` | PR management, issue tracking |
| `deploy_helper` | Automated deployment workflows |

### Daily Productivity

| Skill | Features |
|-------|----------|
| `camera` | Photos and screenshots |
| `chrome_control` | Browser automation |
| `app_control` | macOS app control |
| `email_assistant` | Email reading and composing |

---

## Installing Community Skills

The Blockcell Hub marketplace lets you install community-built skills directly:

```
You: Search Hub for a weather monitoring skill

You: Install the weather_monitor skill from Hub
```

AI will use the `community_hub` tool to download and install. Installed skills go to `~/.blockcell/workspace/skills/`.

```bash
# View installed skills
blockcell skills list

# View skill details
blockcell skills show stock_monitor
```

---

## Creating Custom Skills

Ask AI to create a skill for you:

```
You: Create a skill that tracks my GitHub repository's daily star count changes
     and saves them to stats.json in the workspace
```

AI will automatically generate all three files (`meta.yaml`, `SKILL.md`, `SKILL.rhai`) in `~/.blockcell/workspace/skills/github_stats/`.

Skills are hot-reloaded instantly — no restart needed.

### Manual Skill Creation

Create the skill directory:

```bash
mkdir -p ~/.blockcell/workspace/skills/my_skill
```

Create `meta.yaml`:

```yaml
name: my_skill
description: "My custom skill"
version: "1.0.0"
triggers:
  - "my skill"
  - "custom trigger"
```

Create `SKILL.rhai`:

```rhai
let query = ctx["query"];

let result = call_tool("web_search", #{
    query: query
});

set_output(result);
```

---

## Skill Auto-Evolution

When a skill repeatedly fails (exceeding the configured threshold), the system automatically triggers an **evolution cycle**:

```
User feedback / skill execution failure
        ↓
ErrorTracker records failure count
        ↓
Threshold exceeded → trigger evolution
        ↓
LLM analyzes the issue, generates new SKILL.rhai
        ↓
Automated code audit (security check)
        ↓
Syntax / compilation check
        ↓
Canary rollout: 10% traffic → 50% → 100%
        ↓
Monitor error rate
        ↓
Success: full rollout / Failure: auto-rollback
```

Manual evolution trigger:

```
You: Improve the stock_monitor skill to show MACD indicators
```

View evolution history:

```bash
blockcell evolve list
blockcell evolve show stock_monitor
```

---

## Testing Skills

```bash
# Run all tests for a skill
blockcell skills test stock_monitor

# Run a specific test case
blockcell skills test stock_monitor --case basic_query
```

### Test Case Format

`tests/basic_query.json`:

```json
{
  "name": "basic_query",
  "input": "What is Apple's current stock price?",
  "context": {
    "symbol": "AAPL"
  },
  "expected_tools": ["finance_api"],
  "expected_output_contains": ["AAPL", "price"]
}
```

---

## Skill Permissions Model

Each skill declares the permissions it needs, and is restricted to only those tools at runtime:

```yaml
permissions:
  - network      # Allow network requests
  - filesystem   # Allow reading/writing files
  - message      # Allow sending messages
  - exec         # Allow system command execution (use cautiously)
```

Undeclared permissions are denied at runtime — this is the security boundary.

---

*Previous: [Tool System](./03_tools_system.md)*
*Next: [Memory System](./05_memory_system.md)*
