# 5-Minute Quickstart

> From installation to your first meaningful conversation — about 5 minutes

---

## Prerequisites

You need:
- **A computer**: macOS, Linux, or Windows (this guide uses macOS/Linux examples)
- **An LLM API key**: DeepSeek / Kimi / OpenAI / Anthropic — pick one
  - No key? Try [DeepSeek](https://platform.deepseek.com) (free credits on signup, cheapest option)
  - Or install [Ollama](https://ollama.ai) to run models locally (completely free, no internet needed)

---

## Step 1: Install

### Option A: One-line Script (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/refs/heads/main/install.sh | sh
```

The script downloads the correct binary for your system and installs it to `~/.local/bin/`.

If `blockcell` isn't found after installation, add it to your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Option B: Build from Source

Requires Rust 1.75+ ([install Rust](https://rustup.rs)):

```bash
git clone https://github.com/blockcell-labs/blockcell.git
cd blockcell/blockcell
cargo build --release
cp target/release/blockcell ~/.local/bin/
```

### Verify Installation

```bash
blockcell --version
# Output: blockcell 0.x.x
```

---

## Step 2: Initialize

```bash
blockcell onboard
```

This creates the necessary directory structure and default config file:

```
~/.blockcell/
├── config.json          ← Main config file (you'll edit this)
└── workspace/           ← AI's working directory (AI stays here by default)
    ├── memory/          ← Memory database (SQLite)
    ├── sessions/        ← Conversation history
    ├── skills/          ← User-installed skills
    ├── media/           ← Screenshots, audio files, etc.
    ├── alerts/          ← Alert rules
    ├── streams/         ← Real-time data subscriptions
    └── audit/           ← Operation audit logs
```

---

## Step 3: Configure Your API Key

Open the config file:

```bash
nano ~/.blockcell/config.json
# Or use any editor you prefer
```

Choose based on which API key you have:

### Option A: DeepSeek (Cheapest, great for getting started)

```json
{
  "providers": {
    "deepseek": {
      "apiKey": "sk-your-deepseek-key",
      "apiBase": "https://api.deepseek.com/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "deepseek-chat"
    }
  }
}
```

### Option B: OpenAI

```json
{
  "providers": {
    "openai": {
      "apiKey": "sk-your-openai-key"
    }
  },
  "agents": {
    "defaults": {
      "model": "gpt-4o"
    }
  }
}
```

### Option C: Anthropic Claude

```json
{
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-your-anthropic-key"
    }
  },
  "agents": {
    "defaults": {
      "model": "claude-3-5-sonnet-20241022"
    }
  }
}
```

### Option D: OpenRouter (Access every model with one key)

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-your-openrouter-key",
      "apiBase": "https://openrouter.ai/api/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4-20250514"
    }
  }
}
```

### Option E: Ollama (Fully local, free)

First install Ollama and pull a model:

```bash
# Visit https://ollama.ai to install Ollama
ollama pull llama3.1
```

Then configure:

```json
{
  "providers": {
    "ollama": {
      "apiBase": "http://localhost:11434"
    }
  },
  "agents": {
    "defaults": {
      "model": "ollama/llama3.1"
    }
  }
}
```

---

## Step 4: Check Status

```bash
blockcell status
```

Normal output looks like:

```
✓ Config loaded
✓ Provider: deepseek (deepseek-chat)
✓ Workspace: /Users/you/.blockcell/workspace
✓ Memory: SQLite (0 items)
✓ Skills: 0 user skills, 44 builtin skills
✓ Channels: none configured
```

If anything shows ✗, fix it based on the hint (usually a typo in the API key).

---

## Step 5: Start a Conversation

```bash
blockcell agent
```

You'll see:

```
╔══════════════════════════════════════════╗
║          blockcell agent                 ║
║  /tasks  view background tasks           ║
║  /tools  view available tools            ║
║  /quit   exit                            ║
╚══════════════════════════════════════════╝

You:
```

---

## Try These Scenarios

### Search the web

```
You: Find me the most important AI news from today
```

AI will automatically call `web_search`, then `web_fetch` to get content.

### Read a local file

```
You: Read ~/Desktop/report.txt and summarize the key points
```

> ⚠️ **Security note**: When accessing files outside the workspace (`~/.blockcell/workspace`), blockcell shows a confirmation prompt. Type `y` and press Enter to allow. This is a built-in safety mechanism.

### Run a command

```
You: Show me which files larger than 100MB are in my home directory
```

AI will use the `exec` tool to run `find` or `du`.

### Write a file

```
You: Write a Python script that reads data.csv and calculates the mean of each column, save it to the workspace
```

AI will use `write_file` to create the `.py` file.

### Analyze + visualize

```
You: Read sales.csv in the workspace, draw a bar chart of monthly revenue
```

AI will: read file → analyze data → generate Python plotting script → execute → return image path.

---

## Common CLI Commands

```bash
# List all available tools
blockcell tools

# Search and manage memory
blockcell memory list
blockcell memory search "keyword"

# List installed skills
blockcell skills list

# View scheduled (cron) tasks
blockcell cron list

# View background task status
blockcell tasks

# Check messaging channel status
blockcell channels status

# View evolution history
blockcell evolve list

# View alert rules
blockcell alerts list

# View logs
blockcell logs

# Run self-diagnostics
blockcell doctor
```

---

## Full Config Structure

`~/.blockcell/config.json` supports additional advanced settings:

```json
{
  "providers": {
    "deepseek": {
      "apiKey": "sk-...",
      "apiBase": "https://api.deepseek.com/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "deepseek-chat",
      "maxTokens": 4096,
      "temperature": 0.7,
      "maxContextTokens": 32000
    }
  },
  "tools": {
    "tickIntervalSecs": 30
  },
  "gateway": {
    "host": "127.0.0.1",
    "port": 18790,
    "webuiPort": 18791,
    "apiToken": "optional-access-token"
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "your-bot-token",
      "allowFrom": ["your-user-id (number)"]
    }
  }
}
```

---

## FAQ

### Q: Command not found after installation?

```bash
# Check if PATH is set
echo $PATH | grep ".local/bin"

# If missing, add it
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

### Q: API call failing?

```bash
blockcell doctor
# Auto-checks network and API configuration
```

### Q: How to switch models?

Edit `agents.defaults.model` in `config.json` and restart `blockcell agent`. No reinstall needed.

### Q: Why does AI ask for confirmation when reading a file?

This is normal security behavior. blockcell only allows unrestricted access to `~/.blockcell/workspace/`. Files outside that path (like your Desktop) require your confirmation. Type `y` to allow.

### Q: How to set up a scheduled task?

Just say it: `Set up a daily task at 8 AM to search for AI news and send me a summary`. AI will call the `cron` tool to register the task.

---

## What's Next?

- [Tool System](./03_tools_system.md) — Explore all 60+ built-in tools
- [Multi-channel Access](./06_channels.md) — Connect Telegram so AI reaches you on your phone
- [Finance in Practice](./10_finance_use_case.md) — Build stock alerts and automated reports

---

*Previous: [What is blockcell?](./01_what_is_blockcell.md)*
*Next: [Tool System — Making AI Actually Useful](./03_tools_system.md)*
