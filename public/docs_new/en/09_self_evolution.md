# Self-Evolution

> blockcell's most unique feature: automatically detecting problems, repairing itself, and continuously improving

---

## What Is Self-Evolution?

When ordinary software has a bug, a developer must manually fix it, build a new release, and deploy it.

blockcell's **self-evolution** system can:

1. **Automatically detect problems**: notice when a skill keeps failing
2. **LLM generates a fix**: write a new version of the code
3. **Auto audit**: security check to prevent malicious code
4. **Canary rollout**: test the new version on a small slice of traffic first
5. **Monitor results**: if the new version performs worse, auto-rollback
6. **Full deployment**: replace the old version once improvement is confirmed

This entire process is **fully automatic** — no manual intervention required.

---

## What Triggers Evolution

### Automatic Trigger

When a skill meets these conditions, evolution is triggered automatically:

```
Within [time window], skill execution failures exceed [threshold]
```

Default configuration (adjustable in config.json):
- Time window: 1 hour
- Failure threshold: 3

### Manual Trigger

You can also trigger evolution at any time:

```
You: Improve the stock_monitor skill — add support for showing volume anomalies

You: The stock_monitor skill errors out on Hong Kong stocks, please fix it
```

Or via CLI:

```bash
blockcell evolve trigger stock_monitor --reason "Add volume indicators"
```

---

## The Complete Evolution Pipeline

```
Error accumulation / manual trigger
        ↓
【Step 1】Generate new code
  LLM receives: skill description + current code + error logs + failure history
  LLM outputs: new version of SKILL.rhai
        ↓
【Step 2】Code audit
  Security check: dangerous operations (file deletion, exfiltration, etc.)
  Format check: conforms to skill specification
  ↓ Audit fails → regenerate with feedback (up to 3 retries)
        ↓
【Step 3】Compilation check
  Rhai syntax verification
  ↓ Fails → regenerate with error details
        ↓
【Step 4】Canary rollout
  Stage 1: 10% traffic on new version, 90% on old
  Stage 2 (24h later, if error rate OK): 50%
  Stage 3 (24h later): 100%
        ↓
【Step 5】Monitoring
  Continuously track new version error rate
  Error rate > old version → immediate auto-rollback
  Error rate consistently good → evolution complete
```

### Retry Mechanism

When any stage fails, the system includes the failure reason (error message, audit report, etc.) and asks LLM to regenerate — up to 3 retries. Each retry includes all previous failure attempts, helping LLM better understand what went wrong.

---

## Version Management

Every evolution saves a version snapshot:

```
workspace/
├── skills/
│   └── stock_monitor/
│       └── SKILL.rhai        ← Current active version
└── tool_versions/
    └── stock_monitor/
        ├── v1_20250101.rhai  ← Historical version
        ├── v2_20250115.rhai
        └── v3_20250201.rhai  ← Previous active version
```

### View Evolution History

```bash
# List all evolution records
blockcell evolve list

# Show evolution history for a specific skill
blockcell evolve show stock_monitor
```

Example output:

```
stock_monitor Evolution History:

v3 (current, 2025-02-01)  status: fully deployed
  trigger: HK stock data fetch failure
  improvement: fixed HK stock code parsing, added .HK suffix support
  retries: 1

v2 (2025-01-15)  status: superseded
  trigger: MACD calculation error
  improvement: corrected MACD indicator formula
  retries: 0

v1 (initial version)  status: superseded
```

### Manual Rollback

If the new version has issues, roll back anytime:

```bash
blockcell evolve rollback stock_monitor --to v2
```

---

## Evolution Configuration

Configure the evolution system in `config.json`:

```json
{
  "evolution": {
    "enabled": true,
    "errorThreshold": 3,
    "timeWindowSecs": 3600,
    "maxRetries": 3,
    "evolutionProvider": "anthropic/claude-3-5-sonnet-20241022",
    "canaryStages": [
      {"percentage": 10, "durationSecs": 86400},
      {"percentage": 50, "durationSecs": 86400},
      {"percentage": 100, "durationSecs": 0}
    ]
  }
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Enable/disable automatic evolution |
| `errorThreshold` | `3` | Failure count before evolution triggers |
| `timeWindowSecs` | `3600` | Rolling time window for counting errors (seconds) |
| `maxRetries` | `3` | Max code generation retries on failure |
| `evolutionProvider` | main model | Model for code generation — can be a more capable model |

**Tip**: `evolutionProvider` can use a more powerful model than your daily conversation model (like Claude 3.5 Sonnet or GPT-4o). Evolution is infrequent, so the cost impact is minimal but quality improvement matters.

---

## Monitoring Evolution

### CLI

```bash
# View skills currently in evolution
blockcell evolve list --status learning

# View completed evolutions
blockcell evolve list --status learned

# Follow evolution logs in real time
blockcell logs --filter evolution
```

### During Conversation

```
You: Are any skills currently evolving?

AI: calls list_skills → returns evolution status list
```

---

## Core Evolution Engine Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `ErrorTracker` | `skills/service.rs` | Track skill error counts, trigger evolution |
| `SkillEvolution` | `skills/evolution.rs` | Generate code, run evolution pipeline |
| `VersionManager` | `skills/versioning.rs` | Save version snapshots, support rollback |
| `EvolutionService` | `skills/service.rs` | Coordinate the entire evolution process |
| `RolloutStats` | `skills/service.rs` | Monitor error rate during canary stages |

---

## Ghost Agent & Evolution

The [Ghost Agent](./15_ghost_agent.md) periodically reviews system status, including skill performance. If it identifies a skill with room for improvement, it can proactively suggest or trigger evolution.

This creates a **continuous improvement loop**:
- Execute → Record → Analyze → Improve → Execute

---

## Important Notes

1. **Evolution doesn't interrupt usage**: During canary rollout, most traffic (90%/50%) still uses the stable old version. Users experience no disruption.

2. **Code audit is mandatory**: Every evolved code must pass a security audit before entering canary rollout. This prevents LLM from generating dangerous code.

3. **Rollback is always available**: Version history is permanently retained. You can always go back to any previous version.

4. **Evolution learns from failures**: When generating a new version, LLM sees all previous failed attempts, avoiding repeating the same mistakes.

---

*Previous: [Gateway Mode](./08_gateway_mode.md)*
*Next: [Finance in Practice](./10_finance_use_case.md)*
