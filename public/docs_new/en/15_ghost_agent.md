# Ghost Agent

> The silent guardian that tidies memories, monitors health, and occasionally speaks up

---

## What Is the Ghost Agent?

blockcell has a special component called the **Ghost Agent**. The "ghost" name comes from how it operates:

- Runs **in the background** — you usually don't notice it
- But it's always **watching** your conversations and system state
- Occasionally **makes itself known** — reminding you of something important, or checking in

Analogy: Like a thoughtful assistant while you're in a meeting (the main conversation). They're quietly taking notes in the corner, preparing for the next thing on the agenda, and occasionally sliding you a sticky note with a reminder.

---

## What Does the Ghost Agent Do?

Ghost runs a **routine check** in the background on a schedule (default: every 60 seconds), handling four categories of tasks:

### 1. Memory Management (memory)

Reviews recent conversation history and extracts information worth preserving long-term.

Examples:
- You mentioned a new project → Ghost saves the project name and key details
- You expressed a preference ("I like minimal code") → Ghost ensures it's saved
- Your portfolio changed → Ghost updates the relevant memory

### 2. Memory Cleanup (cleanup)

Removes stale, redundant, or expired short-term memories to keep the memory store clean.

Examples:
- Yesterday's "meeting at 3pm" reminder is past due — safe to delete
- Multiple memories about the same topic → Ghost merges them into one accurate record

### 3. Proactive Messages (social)

If warranted, Ghost sends you a message proactively. This doesn't happen often, but it's useful in specific situations:

- You've been away a while and there's an important item to flag
- A monitoring metric just triggered (like a price alert) — Ghost confirms you received it
- A skill evolution completed and you should know the result

### 4. Issue Detection (issues)

Scans for anything that needs attention:

- A skill has been failing repeatedly — should it evolve?
- Are alert rules firing correctly?
- Is the memory database getting large enough to warrant maintenance?

---

## Ghost's Output Format

Ghost outputs its judgments in structured JSON, keeping responses efficient and token-light:

```json
{
  "memory": [
    {
      "action": "upsert",
      "title": "User's Apple position updated",
      "content": "User holds 100 shares of Apple at $180 cost basis, updated 2025-01-15",
      "type": "fact",
      "importance": 8
    }
  ],
  "cleanup": ["dedup_key_old_apple_position"],
  "social": null,
  "issues": []
}
```

When there's nothing to do, all fields are empty. Ghost stays silent.

---

## Ghost vs the Main Conversation

Ghost and your main conversation are **completely independent**:

- The main conversation handles your real-time requests
- Ghost runs asynchronously in the background, never interrupting the main flow
- Ghost's actions (saving memories, sending messages) go through standard tools with full audit trails
- Ghost is **lightweight**: its system prompt was compressed from ~800 chars to ~300 chars, so each run consumes very few tokens

---

## Ghost and Self-Evolution

Ghost Agent serves as the **observer and catalyst** for the self-evolution system:

1. Ghost continuously watches how each skill performs
2. If a skill shows room for improvement — even before the auto-evolution threshold is reached — Ghost can flag it early
3. Ghost also observes the results of completed evolutions, ensuring the improvements actually helped

This creates a complete **AI self-maintenance loop**:
```
Execute → Observe (Ghost) → Remember → Improve (Evolution) → Execute again
```

---

## Configuring the Ghost Agent

Ghost is enabled by default. Adjust in `config.json`:

```json
{
  "agents": {
    "ghost": {
      "enabled": true,
      "intervalSecs": 60,
      "model": "deepseek-chat"
    }
  }
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Enable or disable Ghost |
| `intervalSecs` | `60` | How often Ghost runs (seconds) |
| `model` | main model | Model Ghost uses (can be a cheaper, smaller model) |

**Tip**: Ghost's tasks are relatively simple. Configure it to use a cheaper model (like `deepseek-chat`) to save on API costs.

---

## Watching Ghost in Logs

```bash
blockcell logs --filter ghost
```

You'll see output like:

```
[Ghost] Routine check complete
  Memory: saved 1, cleaned 0
  Proactive message: none
  Issues: none
[Ghost] Routine check complete
  Memory: saved 0, cleaned 2 expired memories
  Proactive message: "Apple (AAPL) has reached your $200 alert threshold"
  Issues: none
```

---

## Why "Ghost"?

Because the best assistant is **invisible**:

- You don't have to manage it — it does what needs to be done
- It doesn't interrupt you unless it truly matters
- But when you need to, you can see the "traces" it left behind (memories, reminders) — proof it was always there

Like the benevolent spirits in stories that watch over a place — barely noticeable, but the place is better for their presence.

---

*Previous: [Name Origin](./14_name_origin.md)*
*Next: [Blockcell Hub Community](./16_hub_community.md)*
