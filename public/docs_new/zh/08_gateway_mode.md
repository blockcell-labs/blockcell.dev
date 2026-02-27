# Gateway 模式

> 把 blockcell 部署为 HTTP 服务，通过 API 或 Web UI 访问

---

## 什么是 Gateway 模式？

默认的 `blockcell agent` 是**交互式终端模式**，每次都需要在命令行输入。

**Gateway 模式**将 blockcell 部署为一个后台服务，提供：
- **HTTP REST API**：任何客户端都可以通过 API 调用 AI
- **WebSocket API**：实时双向通信，流式返回
- **Web UI**：内置的可视化管理界面
- **多渠道集成**：同时运行所有消息渠道（Telegram / Slack 等）

适用场景：
- 在服务器上 24 小时运行 AI
- 团队成员通过 Web UI 共同使用
- 将 AI 能力集成到你的应用或工作流中
- 部署为家庭服务器的 AI 助手

---

## 启动 Gateway

```bash
blockcell gateway
```

默认监听：
- HTTP/WebSocket：`http://localhost:18790`
- Web UI：`http://localhost:18791`

---

## 配置

在 `~/.blockcell/config.json` 中配置 Gateway：

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

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `host` | `127.0.0.1` | 监听地址（`0.0.0.0` 表示所有网络接口） |
| `port` | `18790` | API 端口 |
| `webuiPort` | `18791` | Web UI 端口 |
| `apiToken` | 无（不鉴权） | 访问令牌，设置后所有请求必须携带 |
| `allowedOrigins` | `["*"]` | CORS 允许的来源 |

> ⚠️ **安全提示**：如果将 `host` 设置为 `0.0.0.0`（允许外网访问），**必须**设置 `apiToken`，否则任何人都可以控制你的 AI。

---

## API 接口说明

### 认证

所有接口（除 `/v1/health`）都需要携带 Token：

```bash
# 方式一：HTTP Header
curl -H "Authorization: Bearer your-secret-token" http://localhost:18790/v1/chat

# 方式二：Query 参数
curl "http://localhost:18790/v1/chat?token=your-secret-token"
```

---

### `GET /v1/health` — 健康检查

无需认证，适合 k8s 探针、负载均衡器等。

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

### `POST /v1/chat` — 发送消息

```bash
curl -X POST http://localhost:18790/v1/chat \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "帮我搜索今天的 AI 新闻",
    "channel": "api",
    "chat_id": "user123"
  }'
```

请求体：

| 字段 | 类型 | 必须 | 说明 |
|------|------|------|------|
| `message` | string | ✅ | 用户消息 |
| `channel` | string | | 来源标识（默认 `api`） |
| `chat_id` | string | | 用户/会话 ID，相同 ID 共享记忆和历史 |

响应：

```json
{
  "response": "今天的 AI 新闻主要包括：...",
  "tool_calls": [
    {
      "tool": "web_search",
      "params": {"query": "AI 新闻 2025"},
      "result_preview": "找到 10 条结果..."
    }
  ],
  "task_id": null
}
```

---

### `GET /v1/tasks` — 查看后台任务

```bash
curl -H "Authorization: Bearer your-token" http://localhost:18790/v1/tasks
```

```json
{
  "tasks": [
    {
      "id": "task_abc123",
      "label": "股票监控",
      "status": "running",
      "progress": "获取 600519 行情中...",
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

### `GET /v1/ws` — WebSocket 连接

WebSocket 端点，支持实时双向通信和流式返回：

```javascript
const ws = new WebSocket('ws://localhost:18790/v1/ws?token=your-token');

ws.onopen = () => {
  // 发送消息
  ws.send(JSON.stringify({
    type: 'chat',
    message: '帮我分析一下茅台的技术面',
    chat_id: 'user123'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'tool_call':
      console.log('工具调用:', data.tool, data.params);
      break;
    case 'tool_result':
      console.log('工具结果:', data.result_preview);
      break;
    case 'response':
      console.log('AI 回复:', data.content);
      break;
    case 'skills_updated':
      console.log('技能更新:', data.new_skills);
      break;
    case 'done':
      console.log('完成');
      break;
  }
};
```

---

## Web UI

访问 `http://localhost:18791`，你会看到内置的管理界面：

### Dashboard（仪表盘）

- **系统状态**：模型、工具、技能数量、内存使用
- **工具列表**：所有可用工具的状态
- **技能列表**：已安装技能，支持启用/禁用
- **实时日志**：工具调用和执行情况

### 聊天界面

- 与 AI 进行对话
- 查看每次工具调用的详情（展开/折叠）
- 查看后台任务进度

### 技能管理

- 查看已安装的所有技能
- 启用 / 禁用技能
- 查看技能进化历史
- 触发手动进化

### 记忆管理

- 查看和搜索记忆
- 手动添加、编辑、删除记忆
- 查看记忆统计（按类型、时间分布）

---

## 反向代理部署（生产环境）

建议在生产环境使用 Nginx 或 Caddy 做反向代理：

### Nginx 配置

```nginx
server {
    listen 443 ssl;
    server_name blockcell.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # API 端口
    location / {
        proxy_pass http://127.0.0.1:18790;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 443 ssl;
    server_name blockcell-ui.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Web UI 端口
    location / {
        proxy_pass http://127.0.0.1:18791;
    }
}
```

### Caddy 配置（更简单，自动 HTTPS）

```caddy
blockcell.yourdomain.com {
    reverse_proxy localhost:18790
}

blockcell-ui.yourdomain.com {
    reverse_proxy localhost:18791
}
```

---

## 作为系统服务运行（systemd）

Linux 系统上，创建 systemd 服务文件实现开机自启：

```ini
# /etc/systemd/system/blockcell.service
[Unit]
Description=blockcell AI Agent Gateway
After=network.target

[Service]
Type=simple
User=你的用户名
ExecStart=/home/你的用户名/.local/bin/blockcell gateway
Restart=always
RestartSec=10
Environment=HOME=/home/你的用户名

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

## macOS 开机自启（launchd）

```xml
<!-- ~/Library/LaunchAgents/ai.blockcell.gateway.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" ...>
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ai.blockcell.gateway</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/你/.local/bin/blockcell</string>
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

*上一篇：[浏览器自动化](./07_browser_automation.md)*
*下一篇：[自我进化](./09_self_evolution.md)*
