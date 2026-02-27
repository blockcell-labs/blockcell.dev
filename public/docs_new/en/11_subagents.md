# Subagents & Concurrency

> Run multiple AIs simultaneously — like having an AI team

---

## What Is a Subagent?

Normal AI conversations are **sequential**: AI finishes one thing before starting the next.

The subagent system lets you **launch multiple independent AI tasks in parallel**. They run in the background simultaneously without interfering with each other.

**Analogy**: You're a project manager. You delegate different tasks to team members, then continue with your own work. When they finish, they report back.

---

## When to Use Subagents

Good fit:
- **Long-running tasks**: data scraping, bulk file analysis, video processing
- **Parallel tasks**: monitoring multiple stocks at once, processing multiple data sources simultaneously
- **Periodic tasks**: background work that runs every hour
- **Independent tasks**: things that don't depend on each other and can happen concurrently

Not a good fit:
- Tasks that must run in order with dependencies (use skill workflows instead)
- Simple one-off queries (just ask directly)

---

## Launching Subagents

Use the `spawn` tool in conversation to start background tasks:

```
You: Do these three things simultaneously:
  1. Analyze all .py files in the workspace, find the 5 functions with highest complexity
  2. Search for technical articles about Rust and AI from the past week, compile a summary
  3. Get the latest quotes for the 5 stocks in my watchlist
  Tell me each result when done
```

AI spawns a subagent for each task, all running concurrently.

### Single Background Task

```
You: In the background, analyze all log files in the workspace,
     find the most frequently occurring errors, and tell me when done
```

---

## Task Management

### Check Task Status

```
You: /tasks
```

Or:

```
You: What background tasks are currently running?
```

Example output:

```
Background Tasks:

[Running] task_abc123
  📋 Analyze Python file complexity
  ⏱ Running for 2m 15s
  📍 Processing utils/helpers.py...

[Completed] task_def456
  📋 Search Rust + AI articles
  ✅ Completed 3 minutes ago

[Queued] task_ghi789
  📋 Fetch watchlist stock quotes
  ⏳ Waiting to start
```

### Via CLI

```bash
# View all tasks
blockcell tasks

# View specific task details
blockcell tasks show task_abc123

# Cancel a task (if supported)
blockcell tasks cancel task_abc123
```

---

## Task Completion Notifications

When a subagent completes, you're notified through your configured channel:

- In the terminal → result appears in the current conversation
- With Telegram configured → sends a Telegram message
- In Gateway mode → pushes a WebSocket event

---

## Subagent Capability Constraints

Subagents have full tool access but with safety restrictions:

| Capability | Subagent |
|------------|---------|
| Read/write files | ✅ |
| Execute commands | ✅ |
| Network requests | ✅ |
| Access memory | ✅ |
| Send notifications | ✅ |
| Spawn more subagents | ❌ (prevents infinite nesting) |
| Modify cron tasks | ❌ |

This design prevents runaway subagents while preserving full working capability.

---

## Real-World Examples

### Example 1: Bulk Data Analysis

```
You: The workspace has 12 CSV files (sales_jan.csv through sales_dec.csv).
  Please:
  1. Generate a stats summary for each file (rows, key columns, data quality)
  2. Identify which months had the highest sales
  3. Draw a full-year sales trend chart
  
  Process them in parallel, don't wait for each step
```

### Example 2: Investment Research

```
You: Research these 3 stocks simultaneously. For each one:
     latest price, technical indicators, and recent analyst ratings

Apple (AAPL), Nvidia (NVDA), Tesla (TSLA)
```

### Example 3: Content Generation Pipeline

```
You: Do the following:
  1. Find the 5 most important AI news stories today
  2. Simultaneously find today's major crypto news
  3. Once both are ready, merge them into a morning digest and post to my Telegram
```

Note: Steps 1 and 2 can run in parallel; step 3 must wait for both. Be explicit about this in your request.

---

## TaskManager Internals

Every task is tracked by `TaskManager`:

| Field | Description |
|-------|-------------|
| `id` | Unique task ID |
| `label` | Task description |
| `status` | Queued / Running / Completed / Failed |
| `progress` | Current progress description |
| `result` | Result summary after completion |
| `origin_channel` | Source channel (for routing replies correctly) |
| `created_at` | Creation timestamp |
| `completed_at` | Completion timestamp |

Tasks remain in TaskManager for ~5 minutes after completion, then are auto-cleaned.

---

## Each Subagent Is an Independent AI Instance

Every subagent is a complete, independent `AgentRuntime` instance:
- Independent conversation history
- Independent tool-call loop
- Uses the same LLM configuration (can specify a different model)
- Concurrent execution — non-blocking

---

## Subagents vs Cron Tasks

| Feature | spawn subagent | cron scheduled task |
|---------|---------------|---------------------|
| Trigger | Manual | Automatic (scheduled) |
| Executions | Once | Recurring |
| Best for | Immediate parallel work | Regular periodic tasks |
| Example | Bulk file analysis | Daily 8 AM market brief |

The two work well together: a cron task can spawn subagents to handle complex parallel sub-work.

---

*Previous: [Finance in Practice](./10_finance_use_case.md)*
*Next: [Architecture Deep Dive](./12_architecture.md)*
