# 配置文件详解

> `~/.blockcell/config.json` 所有字段逐一说明

---

## 配置文件位置

```
~/.blockcell/config.json
```

运行 `blockcell onboard` 时自动创建。可用任意文本编辑器直接修改，修改后下次启动生效（部分配置热重载无需重启）。

查看当前配置：

```bash
blockcell config show
blockcell config edit      # 用系统默认编辑器打开
```

---

## 完整配置示例

```json
{
  "agents": {
    "defaults": {
      "model": "deepseek-chat",
      "provider": "deepseek",
      "maxContextTokens": 32000,
      "temperature": 0.7,
      "maxLoopIterations": 20
    },
    "ghost": {
      "enabled": true,
      "intervalSecs": 60,
      "model": "deepseek-chat"
    }
  },

  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-...",
      "apiBase": "https://openrouter.ai/api/v1"
    },
    "deepseek": {
      "apiKey": "sk-...",
      "apiBase": "https://api.deepseek.com/v1"
    },
    "kimi": {
      "apiKey": "sk-...",
      "apiBase": "https://api.moonshot.cn/v1"
    },
    "anthropic": {
      "apiKey": "sk-ant-..."
    },
    "gemini": {
      "apiKey": "AIza..."
    },
    "openai": {
      "apiKey": "sk-..."
    },
    "ollama": {
      "apiBase": "http://localhost:11434"
    },
    "alpha_vantage": {
      "apiKey": "your-alpha-vantage-key"
    },
    "github": {
      "apiKey": "ghp_..."
    }
  },

  "channels": {
    "telegram": {
      "enabled": true,
      "token": "7123456789:AAH...",
      "allowFrom": ["12345678"],
      "proxy": ""
    },
    "discord": {
      "enabled": false,
      "botToken": "",
      "channels": [],
      "allowFrom": []
    },
    "slack": {
      "enabled": false,
      "botToken": "",
      "channels": [],
      "allowFrom": [],
      "pollIntervalSecs": 5
    },
    "feishu": {
      "enabled": false,
      "appId": "",
      "appSecret": "",
      "allowFrom": []
    },
    "dingtalk": {
      "enabled": false,
      "appKey": "",
      "appSecret": "",
      "robotCode": "",
      "allowFrom": []
    },
    "wecom": {
      "enabled": false,
      "corpId": "",
      "corpSecret": "",
      "agentId": 0,
      "allowFrom": []
    },
    "lark": {
      "enabled": false,
      "appId": "",
      "appSecret": "",
      "allowFrom": []
    },
    "whatsapp": {
      "enabled": false,
      "bridgeUrl": ""
    }
  },

  "gateway": {
    "host": "127.0.0.1",
    "port": 18790,
    "webuiPort": 18791,
    "apiToken": "",
    "allowedOrigins": ["*"]
  },

  "evolution": {
    "enabled": true,
    "errorThreshold": 3,
    "timeWindowSecs": 3600,
    "maxRetries": 3,
    "evolutionProvider": ""
  }
}
```

---

## 字段说明

### `agents.defaults`

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `model` | `deepseek-chat` | 默认使用的 AI 模型名称 |
| `provider` | 自动检测 | 指定 provider，不填则根据 model 名称前缀自动判断 |
| `maxContextTokens` | `32000` | 上下文窗口大小，影响历史压缩阈值 |
| `temperature` | `0.7` | 模型输出随机性（0 = 确定，1 = 最随机） |
| `maxLoopIterations` | `20` | 单次对话最多工具调用循环次数 |

### `agents.ghost`

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `enabled` | `true` | 是否启用 Ghost Agent |
| `intervalSecs` | `60` | Ghost 心跳间隔（秒） |
| `model` | 同 defaults.model | Ghost 使用的模型，可设置为便宜的小模型 |

### `providers.<name>`

| 字段 | 说明 |
|------|------|
| `apiKey` | 该 provider 的 API Key |
| `apiBase` | API 基础 URL（有默认值，通常不用填） |

### `channels.*`

各渠道均有 `enabled` 布尔字段控制是否激活。详见 [渠道接入](./07_channels.md)。

### `gateway`

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `host` | `127.0.0.1` | 监听地址，`0.0.0.0` 为全部接口 |
| `port` | `18790` | API 端口 |
| `webuiPort` | `18791` | Web UI 端口 |
| `apiToken` | `""` | 不为空时启用 Bearer Token 鉴权 |
| `allowedOrigins` | `["*"]` | CORS 允许来源 |

### `evolution`

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `enabled` | `true` | 是否开启自动进化 |
| `errorThreshold` | `3` | 触发进化的错误次数阈值 |
| `timeWindowSecs` | `3600` | 错误计数的时间窗口（秒） |
| `maxRetries` | `3` | 代码生成失败时的最大重试次数 |
| `evolutionProvider` | `""` | 进化使用的模型（留空则同 defaults.model） |

---

## 工作区文件

配置文件之外，`~/.blockcell/workspace/` 目录下还有一些 Markdown 文件影响 AI 行为：

| 文件 | 说明 |
|------|------|
| `agents.md` | Agent 行为准则（工具使用规范等） |
| `soul.md` | AI 人格、价值观、沟通风格设定 |
| `user.md` | 你的个人信息和偏好（AI 会参考） |
| `memory.md` | 长期记忆摘要（Ghost 维护） |
| `heartbeat.md` | 后台周期性任务清单 |

这些文件直接用文本编辑器编辑即可，修改后立即生效。

### `user.md` 示例

```markdown
# 用户偏好

## 基本信息
- 姓名：张三
- 所在地：北京
- 职业：全栈工程师

## 技术背景
- 熟悉 Rust、Python、TypeScript
- 主要做 Web3 和 AI 方向

## 沟通偏好
- 技术问题直接给代码，不需要大段解释
- 回复简洁，不用废话
- 用中文回复

## 关注领域
- A股和加密货币行情
- Rust 生态动态
```

---

## 环境变量

部分配置也可通过环境变量设置（优先级低于 config.json）：

```bash
# Provider API Keys
OPENROUTER_API_KEY=sk-or-v1-...
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Alpha Vantage（金融数据）
ALPHA_VANTAGE_API_KEY=...

# GitHub
GITHUB_TOKEN=ghp_...

# Ollama
OLLAMA_HOST=http://localhost:11434
```

---

*上一篇：[记忆系统](./10_memory.md)*
*下一篇：[AI 模型供应商](./12_providers.md)*
