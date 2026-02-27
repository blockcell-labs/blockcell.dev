# Blockcell Hub Community

> Skill marketplace + Agent2Agent collaboration platform

---

## What Is Blockcell Hub?

Blockcell Hub is the **community center** of the blockcell ecosystem, offering two core functions:

1. **Skill Marketplace**: discover, install, and share community-built skills
2. **Agent2Agent (A2A)**: a future multi-agent collaboration platform

Hub's goal: blockcell's capabilities shouldn't be limited to official built-in tools and skills — the entire community should be able to extend them together.

---

## Skill Marketplace

### Browse and Search Skills

Hub aggregates community-contributed skills across many categories:

- **Productivity**: schedule management, email assistant, document organization
- **Finance & Investing**: market monitors, quantitative strategy prototypes
- **Developer Tools**: code review, automated deployment, test assistants
- **Daily Life**: weather alerts, shopping assistants, health tracking
- **Creative Tools**: content generation, image captioning, social media management

### Install a Skill

Install directly from conversation:

```
You: Search Hub for a good weather monitoring skill

You: Install the weather_alert skill from Hub
```

AI uses the `community_hub` tool to search and install:
1. Downloads the skill package (zip) from Hub
2. Extracts to `~/.blockcell/workspace/skills/skill-name/`
3. Hot-reloads automatically — no restart needed

Or use the CLI:

```bash
# Search for skills
blockcell hub search "weather"
blockcell hub search "finance" --category trading

# Install a skill
blockcell hub install weather_alert

# List installed skills
blockcell skills list

# Uninstall a skill
blockcell hub uninstall weather_alert
```

### Publish Your Skill

If you've built something useful, share it with the community:

**Step 1**: Ensure your skill directory is complete

```
my_skill/
├── meta.yaml      ← required
├── SKILL.md       ← recommended
├── SKILL.rhai     ← required (if orchestration logic exists)
└── README.md      ← recommended (user-facing description)
```

**Step 2**: Publish to Hub

```bash
# Package and publish
blockcell hub publish ~/.blockcell/workspace/skills/my_skill
```

Or through conversation:

```
You: Publish the my_skill skill from the workspace to Hub.
   Description: A skill that monitors GitHub repository star count changes daily
   Tags: github, monitoring, developer
```

---

## Hub REST API

Hub exposes a standard REST API for programmatic integration:

```bash
# List all skills
GET https://hub.blockcell.dev/v1/skills

# Search skills
GET https://hub.blockcell.dev/v1/skills?q=weather&category=monitoring

# Get skill details
GET https://hub.blockcell.dev/v1/skills/weather_alert

# Download skill package
GET https://hub.blockcell.dev/v1/skills/weather_alert/download
```

---

## Agent2Agent (A2A) Collaboration

> 🚧 A2A is currently in the planning / early-access stage. The following describes the design vision.

### The Vision: AI Nodes Collaborating

Imagine this scenario:

```
Your blockcell (primary node)
    ↓
"I need to help the user with complex quantitative analysis
  that requires a professional options pricing model"
    ↓
Discovers a specialized options analysis blockcell node on Hub
    ↓
Two AIs collaborate to complete the task:
  - Your AI: handles data fetching and result presentation
  - The other AI: provides specialized options pricing calculations
    ↓
User gets a result that exceeds any single AI's capability boundary
```

This is the A2A vision: **AI nodes form a network — discovering and collaborating with each other**.

### Current State

blockcell already has foundational subagent (`spawn`) capability, enabling multiple AI instances to run in parallel on the same machine. True cross-node A2A collaboration is the next major milestone.

---

## Contributing to the Community

### GitHub

Project homepage: [https://github.com/blockcell-labs/blockcell](https://github.com/blockcell-labs/blockcell)

- **Open an Issue**: report bugs or suggest features
- **Submit a PR**: contribute code, tools, or documentation
- **Join Discussions**: share use cases and experiences

### Contributing a New Built-in Tool

To contribute a built-in tool to blockcell:

1. Fork the repository
2. Create a new tool file under `crates/tools/src/`
3. Register it in `registry.rs`, `runtime.rs`, `service.rs`, and `context.rs`
4. Write unit tests
5. Submit a PR

Basic structure for a tool file:

```rust
pub struct MyTool;

impl Tool for MyTool {
    fn name(&self) -> &str { "my_tool" }

    fn schema(&self) -> serde_json::Value {
        // Return JSON Schema
    }

    async fn execute(
        &self,
        params: serde_json::Value,
        ctx: &ToolContext
    ) -> Result<serde_json::Value> {
        // Tool implementation
    }
}
```

---

## Hub Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| ✅ Phase 1 | Skill upload / download | Completed |
| ✅ Phase 2 | Skill search and categories | Completed |
| 🚧 Phase 3 | Skill ratings and reviews | Planned |
| 🚧 Phase 4 | Agent2Agent protocol | Planned |
| 🔮 Phase 5 | Intelligent skill recommendations | Future |
| 🔮 Phase 6 | Cross-node task scheduling | Future |

---

## Summary

Blockcell Hub is what transforms blockcell from a personal tool into a **living ecosystem**.

As more skills and tools flow in from the community, every blockcell user can stand on the shoulders of those who came before — quickly gaining powerful AI capabilities without starting from scratch.

---

*Previous: [Ghost Agent](./15_ghost_agent.md)*
*Back to Index: [Documentation Home](./00_index.md)*

*Project: https://github.com/blockcell-labs/blockcell*
*Website: https://blockcell.dev*
