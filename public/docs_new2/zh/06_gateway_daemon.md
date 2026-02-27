# Gateway 与后台服务

> 将 blockcell 部署为持续运行的 HTTP 服务，供 API 调用、Web UI 管理、团队共用

---

## 启动 Gateway

```bash
blockcell gateway
```

默认监听：
- **API 端口**：`http://127.0.0.1:18790`
- **Web UI 端口**：`http://127.0.0.1:18791`

自定义端口和绑定地址：

```bash
blockcell gateway --port 8080
blockcell gateway --host 0.0.0.0 --port 18790
```

> ⚠️ 将 `host` 设为 `0.0.0.0` 意味着对公网开放，**必须**同时配置 `apiToken`。

---

## Gateway 配置

在 `~/.blockcell/config.json` 中：

```json
{
  "gateway": {
    "host": "127.0.0.1",
    "port": 18790,
    "webuiPort": 18791,
    "apiToken": "your-secret-token",
    "allowedOrigins": ["https://yourdomain.com"]
  }
}
```

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `host` | `127.0.0.1` | 监听地址 |
| `port` | `18790` | API 端口 |
| `webuiPort` | `18791` | Web UI 端口 |
| `apiToken` | 无（不鉴权） | 设置后所有请求必须携带 |
| `allowedOrigins` | `["*"]` | CORS 允许的来源 |

---

## API 鉴权

设置 `apiToken` 后，所有 API 请求（`/v1/health` 除外）都需要携带：

```bash
# Header 方式（推荐）
curl -H "Authorization: Bearer your-secret-token" \
     http://localhost:18790/v1/chat

# Query 参数方式
curl "http://localhost:18790/v1/chat?token=your-secret-token"
```

---

## 主要 API 端点

### `GET /v1/health` — 健康检查

无需鉴权，适合负载均衡探活。

```bash
curl http://localhost:18790/v1/health
# {"status":"ok","version":"0.x.x"}
```

### `POST /v1/chat` — 发送消息

```bash
curl -X POST http://localhost:18790/v1/chat \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"message": "今天苹果股价多少？", "chat_id": "user1"}'
```

请求字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `message` | string | ✅ | 用户消息 |
| `channel` | string | | 来源标识（默认 `api`） |
| `chat_id` | string | | 用户/会话 ID，相同 ID 共享记忆和上下文 |

响应：

```json
{
  "response": "苹果（AAPL）当前价格 $212.50，今日涨幅 +1.4%...",
  "tool_calls": [
    {
      "tool": "finance_api",
      "params": {"action": "stock_quote", "symbol": "AAPL"},
      "result_preview": "price: 212.50..."
    }
  ]
}
```

### `GET /v1/tasks` — 查看后台任务

```bash
curl -H "Authorization: Bearer your-token" \
     http://localhost:18790/v1/tasks
```

### `GET /v1/ws` — WebSocket 实时对话

```javascript
const ws = new WebSocket('ws://localhost:18790/v1/ws?token=your-token');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'chat',
    message: '分析苹果股票技术面',
    chat_id: 'user1'
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  // data.type: 'tool_call' | 'tool_result' | 'response' | 'done'
};
```

WebSocket 支持流式输出，每次工具调用和最终回复都会实时推送。

---

## Web UI

访问 `http://localhost:18791` 打开内置管理界面：

- **Dashboard**：系统状态、工具列表、技能开关、实时日志
- **对话**：与 AI 对话，查看工具调用详情
- **技能管理**：启用/禁用技能，查看进化历史
- **记忆管理**：浏览、搜索、增删记忆

---

## 作为系统服务运行

### Linux（systemd）

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

### macOS（launchd）

```xml
<!-- ~/Library/LaunchAgents/ai.blockcell.gateway.plist -->
<?xml version="1.0" encoding="UTF-8"?>
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

## 反向代理（生产部署）

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
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Caddy（自动 HTTPS）

```
blockcell.yourdomain.com {
    reverse_proxy localhost:18790
}
```

---

*上一篇：[对话模式（Agent）](./05_agent_mode.md)*
*下一篇：[渠道接入](./07_channels.md)*
