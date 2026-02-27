# blockcell Documentation

> **A self-evolving AI agent framework written in Rust**

---

## Who Is This For?

- Users who want AI to **actually execute tasks** (not just chat)
- Developers connecting AI to **Telegram / Slack / Discord** and other platforms
- Engineers building **automated financial monitoring**, scheduled reports, and workflows
- Technical readers interested in AI agent architecture

---

## Table of Contents

### Getting Started

| # | Title | Description |
|---|-------|-------------|
| [01](./01_what_is_blockcell.md) | What is blockcell? | Core concepts, comparison to chat AI, quick overview |
| [02](./02_quickstart.md) | 5-Minute Quickstart | Install, configure API key, first conversation, common commands |

### Core Capabilities

| # | Title | Description |
|---|-------|-------------|
| [03](./03_tools_system.md) | Tool System | 60+ built-in tools: files, web, finance, communication, media |
| [04](./04_skill_system.md) | Skill System | What skills are, how to install/create/customize them |
| [05](./05_memory_system.md) | Memory System | SQLite persistent memory, cross-session recall, memory management |
| [06](./06_channels.md) | Multi-channel Access | Telegram / Discord / Slack / Feishu / DingTalk setup guides |
| [07](./07_browser_automation.md) | Browser Automation | CDP-based Chrome control, form filling, screenshots, scraping |
| [08](./08_gateway_mode.md) | Gateway Mode | Deploy as HTTP service, WebSocket API, multi-user access |

### Advanced Features

| # | Title | Description |
|---|-------|-------------|
| [09](./09_self_evolution.md) | Self-Evolution | Error detection → LLM code generation → audit → canary rollout → auto-rollback |
| [10](./10_finance_use_case.md) | Finance in Practice | Stock monitoring, crypto on-chain data, automated daily reports |
| [11](./11_subagents.md) | Subagents & Concurrency | Spawn parallel background AI tasks, TaskManager, concurrent execution |
| [12](./12_architecture.md) | Architecture Deep Dive | Crate structure, message bus, provider factory, security model |
| [13](./13_message_processing_and_evolution.md) | Message Processing & Evolution | Full input-to-output pipeline + evolution state machine |

### Story & Community

| # | Title | Description |
|---|-------|-------------|
| [14](./14_name_origin.md) | Name Origin | The meaning of Block + Cell, design philosophy |
| [15](./15_ghost_agent.md) | Ghost Agent | The background daemon that watches over everything |
| [16](./16_hub_community.md) | Blockcell Hub Community | Skill marketplace, Agent2Agent collaboration |

---

## Recommended Reading Paths

**Complete beginner:** 01 → 02 → 03 → 05 → 06

**Automation focus:** 02 → 07 → 08 → 09 → 11

**Finance/trading user:** 02 → 03 → 10 → 15

**Developer/contributor:** 12 → 13 → 09 → 04

---

## Quick Links

- **GitHub:** [https://github.com/blockcell-labs/blockcell](https://github.com/blockcell-labs/blockcell)
- **Website:** [https://blockcell.dev](https://blockcell.dev)
- **One-line install:**

```bash
curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/refs/heads/main/install.sh | sh
```

---

*Questions? Open an issue or discussion on GitHub.*
