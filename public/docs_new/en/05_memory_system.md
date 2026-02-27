# Memory System

> AI that doesn't forget — persistent memory powered by SQLite + FTS5

---

## Why Memory Matters

Ordinary AI conversations are stateless: each new session, the AI remembers nothing from before.

You tell it "I prefer concise code style" — next session you have to repeat it. You share your stock portfolio — close the window, it's gone.

blockcell's memory system solves this: **what AI remembers persists across sessions**.

---

## Storage Architecture

blockcell uses **SQLite + FTS5 (full-text search)** as the memory backend.

Database file: `~/.blockcell/workspace/memory/memory.db`

### Memory Data Structure

Each memory item contains:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (UUID) |
| `scope` | `long_term` or `short_term` |
| `type` | `fact` / `preference` / `project` / `task` / `note` / etc. |
| `title` | Display title |
| `content` | Full content |
| `summary` | Brief summary (used for fast retrieval) |
| `tags` | Comma-separated tag list |
| `importance` | Priority score (0-10, affects retrieval ranking) |
| `dedup_key` | Deduplication key — same key updates instead of duplicating |
| `expires_at` | Optional expiry timestamp (for short-term memories) |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

### FTS5 Full-Text Search

The `title`, `content`, `summary`, and `tags` fields are all indexed in an FTS5 virtual table, supporting:
- Full-text keyword search
- BM25 relevance ranking
- Importance and recency weighting

---

## How Memory Works

### Automatic Saving

During conversation, AI automatically judges what's worth remembering and calls `memory_upsert`:

```
You: I hold 100 shares of Apple at a cost basis of $180

AI: Got it, I'll remember that.
    → calls memory_upsert, saves to long-term memory
    → type: "fact", tags: "stocks,portfolio,Apple"
    → importance: 8
```

### Context Injection

At the start of each conversation, the system retrieves the most relevant memories for your question and injects them into the AI's system prompt:

```
You ask: "How is Apple doing today?"

System retrieves:
  → finds memory: "holds 100 shares of Apple at $180 cost basis"
  → injects into system prompt

AI responds knowing you own Apple stock, giving personalized analysis
```

The retrieval is **semantic**, not just keyword matching, so AI finds the most contextually relevant memories.

### Session Summaries

When a conversation reaches a certain length (default 6 turns), the system auto-generates a **session summary** in Q&A format and saves it to memory for future sessions.

---

## Memory Operation Tools

### `memory_upsert` — Save a memory

```
You: Remember, I don't like redundant comments in code

AI: Noted.
    → memory_upsert {
        type: "preference",
        title: "Code style preference",
        content: "Doesn't like redundant comments, prefers clean minimal code",
        tags: "code,style,preference",
        scope: "long_term",
        importance: 7
      }
```

Key parameters:
- `dedup_key`: With this set, re-saving the same key updates instead of creating duplicates
- `expires_in_days`: Set an expiry (good for temporary info like "meeting tomorrow")
- `importance` (0-10): Higher importance items rank first in retrieval

### `memory_query` — Search memories

```
You: Do you remember my stock portfolio?

AI: Let me check...
    → memory_query {
        query: "stock portfolio",
        scope: "long_term",
        top_k: 5
      }
    → Returns: 100 shares Apple at $180 cost basis; ...
```

Supports multiple filters:
- `scope`: Only query long-term or short-term
- `type`: Filter by memory type (fact / preference / project / etc.)
- `tags`: Filter by tags
- `time_range`: Filter by date range
- `top_k`: Limit result count

### `memory_forget` — Delete a memory

```
You: Forget my Apple position, I've sold all shares

AI: Done, removed.
    → memory_forget {
        action: "soft_delete",
        query: "Apple portfolio"
      }
```

Soft delete (goes to trash, permanently cleared after 30 days). Supports bulk deletion (by scope / type / tags).

---

## CLI Memory Management

```bash
# List all memories (sorted by importance and recency)
blockcell memory list

# Search memories
blockcell memory search "Apple"
blockcell memory search "portfolio" --type fact --scope long_term

# View memory statistics
blockcell memory stats

# Manually trigger maintenance (clean expired memories)
blockcell memory clean
```

---

## Memory Types Explained

| Type | Typical Content | Suggested importance |
|------|----------------|---------------------|
| `fact` | Objective facts, e.g. "My email is xxx" | 8-10 |
| `preference` | Preferences, e.g. "prefer concise code style" | 7-9 |
| `project` | Project info, e.g. "Project A uses React + TypeScript" | 7-9 |
| `task` | To-dos, e.g. "submit report on Friday" | 6-8 |
| `note` | General notes | 4-6 |
| `session_summary` | Auto-generated session summaries | 5 |
| `skill_context` | Skill execution context | 4 |

---

## Best Practices

### Tell AI What to Remember

Be explicit during conversations:

```
You: Remember, my main working directory is ~/projects/myapp, stack is React + TypeScript + Rust

You: Remember my Telegram channel ID @mychannel for sending daily reports

You: Remember my stock portfolio: 100 shares Apple at $180, 50 shares Google at $170
```

### Set Expiry for Temporary Info

```
You: Remember I have a meeting at 3pm tomorrow, forget this in 1 day
```

### Mark High-Importance Items

```
You: Remember this — important: my account passwords are managed in 1Password, never store raw passwords
```

AI will assign high importance, ensuring priority retrieval.

---

## Token Optimization: Smart Injection

blockcell doesn't dump all memories into the system prompt (that would be expensive). It uses **query-driven memory retrieval**:

1. Analyze your question, extract keywords
2. FTS5 search for relevant memories
3. Only inject the most relevant 10-20 items (~a few hundred tokens)

For casual chat (Chat intent), memory injection is skipped entirely to save tokens.

---

## Backup Your Memory

The memory database is a single SQLite file — trivial to back up:

```bash
# Backup
cp ~/.blockcell/workspace/memory/memory.db ~/backup/memory_$(date +%Y%m%d).db

# Restore
cp ~/backup/memory_20250101.db ~/.blockcell/workspace/memory/memory.db
```

---

*Previous: [Skill System](./04_skill_system.md)*
*Next: [Multi-channel Access](./06_channels.md)*
