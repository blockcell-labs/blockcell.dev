# Tool System: Making AI Actually Useful

> blockcell ships with 60+ tools — the core mechanism through which AI interacts with the real world

---

## What Are Tools?

In AI agent systems, a **tool** is a function that AI can call.

Without tools, AI can only chat. With tools, AI can:
- Read files → analyze content
- Search the web → get current information
- Execute commands → operate the system
- Send Telegram messages → notify you

### How Tool Calling Works

```
You say: "Read report.txt and summarize it"

  ↓ 1. Your input goes to the LLM

  ↓ 2. LLM decides: need to call read_file
       Generates params: {"path": "~/Desktop/report.txt"}

  ↓ 3. blockcell executes read_file, reads file content

  ↓ 4. File content is returned to the LLM

  ↓ 5. LLM generates a summary based on the content

  ↓ 6. Summary displayed to you
```

Every tool has a **JSON Schema** describing its parameters. LLM uses this schema to generate correct call arguments.

---

## Tool Categories

### 📁 File System Tools

#### `read_file` — Read a file
Supported formats: `txt` / `md` / `json` / `csv` / `xlsx` / `docx` / `pptx` / `pdf`

Excel, Word, and PDF files are automatically converted to Markdown text for AI to understand.

```
You: Read Q3_report.xlsx on my desktop and tell me which department has the highest sales
AI: calls read_file → parses Excel → analyzes data → answers
```

#### `write_file` — Write a file
Create new files or overwrite existing ones. Supports any text format.

#### `edit_file` — Precise file editing
Replace content by exact string match. Ideal for modifying code and config files without disturbing the rest of the file.

#### `list_dir` — List directory contents
Returns filenames, sizes, modification times. Supports recursive listing.

#### `file_ops` — File operation suite
- **Delete**: files or entire directories (recursive)
- **Rename / Move**: cross-device supported (auto copy + delete)
- **Copy**: files or directories
- **Compress**: zip or tar.gz
- **Decompress**: zip / tar.gz / tar
- **PDF text extraction**

---

### 🌐 Web Tools

#### `web_search` — Web search
Uses DuckDuckGo — no API key needed. Returns titles, excerpts, and URLs.

#### `web_fetch` — Fetch web page content
- Automatically converts HTML to **Markdown** (saves ~80% token usage)
- Supports Cloudflare "Markdown for Agents" protocol (sites that support it return server-side Markdown directly)
- Three modes: `markdown` (default) / `text` / `raw`

#### `http_request` — Generic HTTP client
GET / POST / PUT / PATCH / DELETE, custom headers, Bearer Token / Basic Auth, JSON / Form bodies, file download. Works with any REST API.

#### `browse` — Browser automation (headless)
Controls Chrome/Edge/Firefox via CDP protocol. Navigate, click, fill forms, screenshot. See [Browser Automation](./07_browser_automation.md).

#### `stream_subscribe` — Real-time data stream
Subscribe to WebSocket / SSE data streams with persistent reconnection (exponential backoff). Used for market data feeds, real-time logs, etc.

---

### 💻 System Tools

#### `exec` — Run terminal commands
Execute shell commands in a specified directory, returns stdout / stderr / exit code.

> ⚠️ Security: If `working_dir` is outside the workspace, blockcell will ask for your confirmation.

#### `system_info` — System information probe
Returns OS version, CPU/memory info, installed software (Python / Node / ffmpeg etc.), network status, available capabilities.

---

### 📈 Finance & Blockchain Tools

#### `finance_api` — Stocks / Forex / Crypto

| Action | Description |
|--------|-------------|
| `stock_quote` | Real-time price (China A-shares via Eastmoney, US via Alpha Vantage/Yahoo) |
| `stock_history` | OHLCV history data (daily/weekly/monthly) |
| `stock_search` | Search stocks by keyword |
| `crypto_price` | Crypto real-time price (CoinGecko, free) |
| `crypto_history` | Crypto historical prices |
| `forex_rate` | Foreign exchange rates |
| `bond_yield` | Government bond yield curves |
| `portfolio_value` | Multi-asset portfolio valuation |

**China A-share format:** 6-digit codes like `600519` (Kweichow Moutai), `601318` (Ping An)

#### `exchange_api` — Centralized exchanges (CEX)

Supports Binance / OKX / Bybit:
- Public: ticker, orderbook depth, klines, funding rate
- Account (requires API key): balances, place order, cancel order, positions

#### `blockchain_rpc` — Blockchain RPC queries

Ethereum / Polygon / BSC / Arbitrum / Base etc. Query balances, call contracts, parse event logs, ABI encode/decode.

#### `blockchain_tx` — On-chain transaction builder

Build and send EVM transactions: ERC20 transfers, approvals, swaps, multicall.

#### `contract_security` — Smart contract security scanner

Uses GoPlus Security API (free, no key). Detects rug pull risk, contract openness, holder concentration.

---

### 💬 Communication Tools

#### `email` — Email (SMTP / IMAP)
- **Send**: SMTP, HTML body, attachments, CC
- **Receive**: IMAP inbox listing, reading messages (with attachment download), searching

#### `notification` — Push notifications

| Channel | Description |
|---------|-------------|
| Desktop | macOS osascript popup |
| Pushover | iOS/Android push |
| Bark | iOS push (popular in China) |
| ntfy | Open-source push service |
| SMS | Twilio text messages |
| Webhook | Any HTTP callback |

#### `social_media` — Social platforms
- **Twitter/X**: post, thread, delete, timeline, search
- **Medium**: publish articles
- **WordPress**: create/update posts, upload media

---

### 🤖 AI Enhancement Tools

#### `image_understand` — Image understanding
Send images to vision models (GPT-4o / Claude / Gemini) for analysis, description, comparison, text extraction.

#### `ocr` — Text recognition
Backends: Tesseract (local) / macOS Vision (native) / OpenAI Vision API.

#### `tts` — Text to speech
Backends: macOS say (local) / Piper (local neural) / Edge TTS (Microsoft, free) / OpenAI TTS API.

#### `audio_transcribe` — Speech to text
Backends: openai-whisper (local) / whisper.cpp (local) / OpenAI Whisper API. Supports mp3 / wav / m4a / mp4 and more.

---

### 📊 Data Processing Tools

#### `data_process` — Structured data processing
- **Read CSV**: automatic type detection
- **Query**: filter / sort / select / limit with gt/lt/contains/in operators
- **Stats**: count / sum / avg / min / max / median / std_dev with group_by
- **Transform**: rename / drop / fill_null / dedup / add_column

#### `chart_generate` — Chart generation
Bar / line / pie / scatter / histogram / heatmap / area / box chart types. matplotlib (PNG/SVG) or plotly (interactive HTML).

#### `office_write` — Generate Office documents

| Format | Features |
|--------|----------|
| PPTX | Multiple layouts (title/content/section/two-column), images, tables |
| DOCX | Heading levels (1-9), tables, images, page breaks |
| XLSX | Multiple sheets, header styling, freeze panes, auto-filter |

---

### 🎬 Multimedia Tools

#### `video_process` — Video processing (ffmpeg)
clip / merge / subtitle (burn-in) / thumbnail / convert / extract_audio / resize / compress / watermark / info

#### `camera` — Camera capture
List camera devices, take photos, save to workspace. jpg / png formats.

#### `app_control` — macOS application control
Control any macOS app via AppleScript + System Events: activate, screenshot, type text, key press, read UI tree, click menu items.

---

### 🗄️ Storage & Knowledge Tools

#### `knowledge_graph` — Local knowledge graph

SQLite + FTS5 powered local graph database:
- Entity CRUD (add, get, update, delete, merge)
- Relationship management (bidirectional support)
- Path finding (BFS shortest path)
- Subgraph extraction
- Export (JSON / DOT / Mermaid)

#### `memory_query` / `memory_upsert` / `memory_forget` — Memory management

See [Memory System](./05_memory_system.md).

---

### ⏰ Scheduling & Automation Tools

#### `cron` — Scheduled tasks

Describe tasks in natural language, AI registers them automatically:
```
You: Every morning at 8 AM, find AI news and send me a summary on Telegram
AI: Registers a cron task for daily 08:00 execution
```

#### `alert_rule` — Conditional alerts

Set trigger conditions (price threshold, metric limit) — when triggered, execute specified actions (send notification, place order, etc.).

Operators: `gt` / `lt` / `gte` / `lte` / `eq` / `ne` / `change_pct` / `cross_above` / `cross_below`

#### `spawn` — Launch subagents

Start an independent background AI task. See [Subagents & Concurrency](./11_subagents.md).

---

### 🔧 Professional Tools

#### `git_api` — GitHub API
Repo info, PR management, Issue management, CI/CD workflows, releases, code search, webhooks.

#### `cloud_api` — Cloud service management
AWS / GCP / Azure: instances, storage buckets, metrics, cost queries.

#### `map_api` — Mapping services
Google Maps / Amap (Gaode): geocoding, routing, nearby search, place details.

#### `calendar_api` — Calendar & collaboration
Google Calendar, Notion database, CRM contacts/deals, Jira/Linear tickets.

#### `iot_control` — Smart home / IoT
Home Assistant device control (lights, sensors), MQTT publish/subscribe.

#### `health_api` — Health data
Apple Health XML parsing, Fitbit API, Google Fit API. Steps, heart rate, sleep, workouts.

#### `encrypt` — Encryption & security
AES-256-CBC file encryption, password generation (with strength analysis), file hashing (SHA-256/512/MD5), Base64/URL encoding.

#### `network_monitor` — Network diagnostics
ping / traceroute / port scan / SSL check / DNS lookup / WHOIS / HTTP performance / download speed test.

---

## Security Model

blockcell has a path-based security mechanism:

| Scenario | Behavior |
|----------|----------|
| Access files inside `~/.blockcell/workspace/` | Executes directly, no confirmation needed |
| Access files outside workspace | Shows confirmation prompt, requires your `y` |
| exec with external `working_dir` | Same confirmation required |

This ensures AI never reads or writes your personal files without your knowledge.

---

## View All Available Tools

```bash
blockcell tools
```

Or during a conversation:

```
You: /tools
```

---

*Previous: [5-Minute Quickstart](./02_quickstart.md)*
*Next: [Skill System](./04_skill_system.md)*
