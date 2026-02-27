# Gateway API 参考

> blockcell Gateway 的完整 REST + WebSocket 接口文档

---

## 基础信息

启动 Gateway：

```bash
blockcell gateway
```

默认地址：`http://127.0.0.1:18790`

---

## 鉴权

设置 `apiToken` 后（推荐），所有接口（除 `/v1/health`）均需携带：

```bash
# HTTP Header（推荐）
Authorization: Bearer your-secret-token

# Query 参数（备用）
?token=your-secret-token
```

---

## REST API

### `GET /v1/health`

健康检查，无需鉴权。适合负载均衡探活、k8s liveness probe。

**请求：**
```bash
curl http://localhost:18790/v1/health
```

**响应：**
```json
{
  "status": "ok",
  "version": "0.x.x"
}
```

---

### `POST /v1/chat`

发送消息，等待 AI 完整回复。

**请求：**
```bash
curl -X POST http://localhost:18790/v1/chat \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "苹果公司今天股价多少？",
    "channel": "api",
    "chat_id": "user_001"
  }'
```

**请求体字段：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `message` | string | ✅ | 用户消息文本 |
| `channel` | string | | 来源标识符（默认 `api`） |
| `chat_id` | string | | 用户/会话 ID；相同 ID 共享记忆和历史 |

**响应体：**

```json
{
  "response": "苹果（AAPL）当前价格 $212.50，今日涨幅 +1.4%...",
  "tool_calls": [
    {
      "tool": "finance_api",
      "params": {
        "action": "stock_quote",
        "symbol": "AAPL"
      },
      "result_preview": "price: 212.50, change_pct: +1.4%..."
    }
  ],
  "task_id": null
}
```

**响应字段说明：**

| 字段 | 说明 |
|------|------|
| `response` | AI 最终回复文本 |
| `tool_calls` | 本次调用的工具列表（含参数和结果摘要） |
| `task_id` | 如果 AI 启动了后台子任务，返回任务 ID；否则为 null |

---

### `GET /v1/tasks`

查看所有后台任务状态。

**请求：**
```bash
curl -H "Authorization: Bearer your-token" \
     http://localhost:18790/v1/tasks
```

**响应：**
```json
{
  "tasks": [
    {
      "id": "task_abc123",
      "label": "分析 Python 文件复杂度",
      "status": "running",
      "progress": "正在处理 utils/helpers.py...",
      "created_at": "2025-01-01T08:00:00Z",
      "completed_at": null
    },
    {
      "id": "task_def456",
      "label": "搜索 AI 新闻",
      "status": "completed",
      "progress": "已完成",
      "result": "找到 12 篇相关文章...",
      "created_at": "2025-01-01T07:55:00Z",
      "completed_at": "2025-01-01T07:57:30Z"
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

**任务状态枚举：**

| 状态 | 说明 |
|------|------|
| `queued` | 等待执行 |
| `running` | 正在运行 |
| `completed` | 执行成功 |
| `failed` | 执行失败 |

---

### `GET /v1/tasks/:id`

查看单个任务详情。

**请求：**
```bash
curl -H "Authorization: Bearer your-token" \
     http://localhost:18790/v1/tasks/task_abc123
```

**响应：** 同 `/v1/tasks` 中的单个 task 对象，但 `result` 字段包含完整结果文本。

---

## WebSocket API

### `GET /v1/ws`

升级为 WebSocket 连接，获得实时流式交互能力。

**连接：**
```javascript
const ws = new WebSocket('ws://localhost:18790/v1/ws?token=your-token');
```

---

### 客户端 → 服务端消息格式

#### 发送对话消息

```json
{
  "type": "chat",
  "message": "分析苹果股票的技术面",
  "chat_id": "user_001",
  "channel": "ws"
}
```

---

### 服务端 → 客户端事件格式

#### `tool_call` — 工具调用开始

```json
{
  "type": "tool_call",
  "tool": "finance_api",
  "params": {
    "action": "stock_quote",
    "symbol": "AAPL"
  }
}
```

#### `tool_result` — 工具调用结果

```json
{
  "type": "tool_result",
  "tool": "finance_api",
  "result_preview": "price: 212.50, change_pct: +1.4%"
}
```

#### `response` — AI 回复片段（流式）

```json
{
  "type": "response",
  "content": "苹果（AAPL）当前价格为 $212.50...",
  "done": false
}
```

#### `done` — 本轮对话结束

```json
{
  "type": "done"
}
```

#### `error` — 错误

```json
{
  "type": "error",
  "message": "Provider API error: rate limit exceeded"
}
```

---

### 完整 WebSocket 客户端示例

```javascript
const ws = new WebSocket('ws://localhost:18790/v1/ws?token=your-token');

ws.onopen = () => {
  console.log('已连接');
  ws.send(JSON.stringify({
    type: 'chat',
    message: '分析苹果股票技术面，给出建议',
    chat_id: 'demo_user'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'tool_call':
      console.log(`[工具调用] ${data.tool}`, data.params);
      break;
    case 'tool_result':
      console.log(`[工具结果] ${data.result_preview}`);
      break;
    case 'response':
      process.stdout.write(data.content);  // 流式输出
      break;
    case 'done':
      console.log('\n[完成]');
      break;
    case 'error':
      console.error('[错误]', data.message);
      break;
  }
};

ws.onerror = (err) => console.error('WebSocket 错误:', err);
ws.onclose = () => console.log('连接已关闭');
```

---

## 错误码

| HTTP 状态码 | 说明 |
|------------|------|
| `200` | 成功 |
| `400` | 请求参数错误 |
| `401` | 未鉴权（缺少或无效 token） |
| `404` | 资源不存在（如 task_id 不存在） |
| `500` | 服务器内部错误（LLM 调用失败等） |

---

## 与 `chat_id` 的会话隔离

不同 `chat_id` 的请求完全隔离：
- 独立的对话历史
- 独立的工具调用循环
- 共享同一个记忆库（但可以通过 `chat_id` 区分来源）

同一个 `chat_id` 的多次请求：
- 共享对话历史（最近 N 轮，按 Token 预算自动压缩）
- AI 能记住同一会话中的上下文

---

*上一篇：[架构深度解析](./14_architecture.md)*
*下一篇：[自我进化系统](./16_self_evolution.md)*
