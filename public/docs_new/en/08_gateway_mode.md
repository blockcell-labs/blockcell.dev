# Gateway Mode

> Deploy blockcell as an HTTP service — accessible via API or Web UI

---

## What Is Gateway Mode?

The default `blockcell agent` is an **interactive terminal mode** requiring you to type in a command line.

**Gateway mode** runs blockcell as a background service providing:
- **HTTP REST API**: Any client can call AI through the API
- **WebSocket API**: Real-time bidirectional communication, streaming responses
- **Web UI**: Built-in visual management dashboard
- **Multi-channel integration**: Run all messaging channels simultaneously (Telegram / Slack / etc.)

Use cases:
- Run AI 24/7 on a server
- Team members share access via the Web UI
- Integrate AI capabilities into your apps or workflows
- Deploy as a home server AI assistant

---

## Start Gateway

```bash
blockcell gateway
```

Default ports:
- HTTP/WebSocket: `http://localhost:18790`
- Web UI: `http://localhost:18791`

---

## Configuration

Configure Gateway in `~/.blockcell/config.json`:

```json
{
  "gateway": {
    "host": "127.0.0.1",
    "port": 18790,
    "webuiPort": 18791,
    "apiToken": "your-secret-token-here",
    "allowedOrigins": ["https://yourdomain.com"]
  }
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `host` | `127.0.0.1` | Listen address (`0.0.0.0` = all interfaces) |
| `port` | `18790` | API port |
| `webuiPort` | `18791` | Web UI port |
| `apiToken` | none (no auth) | Access token — all requests must include it when set |
| `allowedOrigins` | `["*"]` | CORS allowed origins |

> ⚠️ **Security**: If you set `host` to `0.0.0.0` (public internet access), you **must** set `apiToken`, otherwise anyone can control your AI.

---

## API Reference

### Authentication

All endpoints (except `/v1/health`) require a token:

```bash
# Method 1: HTTP Header
curl -H "Authorization: Bearer your-secret-token" http://localhost:18790/v1/chat

# Method 2: Query parameter
curl "http://localhost:18790/v1/chat?token=your-secret-token"
```

---

### `GET /v1/health` — Health Check

No auth required. Ideal for k8s probes, load balancers, etc.

```bash
curl http://localhost:18790/v1/health
```

```json
{
  "status": "ok",
  "version": "0.x.x"
}
```

---

### `POST /v1/chat` — Send a Message

```bash
curl -X POST http://localhost:18790/v1/chat \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find today'\''s top AI news",
    "channel": "api",
    "chat_id": "user123"
  }'
```

Request body:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | ✅ | User message |
| `channel` | string | | Source identifier (default: `api`) |
| `chat_id` | string | | User/session ID — same ID shares memory and history |

Response:

```json
{
  "response": "Today's top AI news includes...",
  "tool_calls": [
    {
      "tool": "web_search",
      "params": {"query": "AI news today"},
      "result_preview": "Found 10 results..."
    }
  ],
  "task_id": null
}
```

---

### `GET /v1/tasks` — View Background Tasks

```bash
curl -H "Authorization: Bearer your-token" http://localhost:18790/v1/tasks
```

```json
{
  "tasks": [
    {
      "id": "task_abc123",
      "label": "Stock monitoring",
      "status": "running",
      "progress": "Fetching AAPL quote...",
      "created_at": "2025-01-01T08:00:00Z"
    }
  ],
  "summary": {
    "running": 1,
    "queued": 0,
    "completed": 5,
    "failed": 0
  }
}
```

---

### `GET /v1/ws` — WebSocket Connection

Real-time bidirectional communication with streaming responses:

```javascript
const ws = new WebSocket('ws://localhost:18790/v1/ws?token=your-token');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'chat',
    message: 'Analyze Apple stock technical indicators',
    chat_id: 'user123'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'tool_call':
      console.log('Tool call:', data.tool, data.params);
      break;
    case 'tool_result':
      console.log('Tool result:', data.result_preview);
      break;
    case 'response':
      console.log('AI reply:', data.content);
      break;
    case 'done':
      console.log('Complete');
      break;
  }
};
```

---

## Web UI

Visit `http://localhost:18791` to access the built-in management interface:

### Dashboard

- **System status**: Model, tool count, skill count, memory usage
- **Tool list**: Status of all available tools
- **Skill list**: Installed skills — enable/disable each one
- **Real-time logs**: Tool calls and execution activity

### Chat Interface

- Converse with AI
- View details of each tool call (expandable/collapsible)
- Monitor background task progress

### Skill Management

- View all installed skills
- Enable / disable skills
- View skill evolution history
- Trigger manual evolution

### Memory Management

- Browse and search memories
- Manually add, edit, delete memories
- View memory statistics (by type, time distribution)

---

## Reverse Proxy (Production)

For production, use Nginx or Caddy as a reverse proxy:

### Nginx

```nginx
server {
    listen 443 ssl;
    server_name blockcell.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:18790;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Caddy (Auto HTTPS)

```caddy
blockcell.yourdomain.com {
    reverse_proxy localhost:18790
}

blockcell-ui.yourdomain.com {
    reverse_proxy localhost:18791
}
```

---

## Run as a System Service (systemd)

On Linux, create a systemd service for auto-start on boot:

```ini
# /etc/systemd/system/blockcell.service
[Unit]
Description=blockcell AI Agent Gateway
After=network.target

[Service]
Type=simple
User=your-username
ExecStart=/home/your-username/.local/bin/blockcell gateway
Restart=always
RestartSec=10
Environment=HOME=/home/your-username

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable blockcell
sudo systemctl start blockcell
sudo systemctl status blockcell
```

---

## macOS Auto-Start (launchd)

```xml
<!-- ~/Library/LaunchAgents/ai.blockcell.gateway.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "...">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ai.blockcell.gateway</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/you/.local/bin/blockcell</string>
        <string>gateway</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/ai.blockcell.gateway.plist
```

---

*Previous: [Browser Automation](./07_browser_automation.md)*
*Next: [Self-Evolution](./09_self_evolution.md)*
