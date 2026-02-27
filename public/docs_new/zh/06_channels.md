# 多渠道接入

> 让 AI 住进你的 Telegram、Slack、飞书……随时随地与它对话

---

## 为什么需要渠道接入？

默认情况下，blockcell 运行在终端里，你需要打开命令行才能与 AI 交互。

接入消息渠道后：
- 在手机上发 Telegram 消息，AI 立刻响应
- 在团队 Slack 里 @ AI，它帮你处理任务
- 飞书群里有问题，直接问 AI
- 定时任务的报告直接推送到你的手机

---

## 支持的渠道

| 渠道 | 连接方式 | 适用场景 |
|------|----------|----------|
| **Telegram** | Long Polling | 个人使用，最简单 |
| **Discord** | WebSocket Gateway | 社区 / 团队 |
| **Slack** | Web API 轮询 | 企业团队 |
| **飞书（Lark）** | WebSocket 长连接 | 国内企业 |
| **钉钉** | Stream SDK | 国内企业 |
| **企业微信** | Polling | 国内企业 |
| **WhatsApp** | Webhook | 个人 / 企业 |

---

## Telegram（最推荐，配置最简单）

### 第一步：创建 Bot

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot`
3. 按提示设置 Bot 名称和用户名
4. 获得一个 **Bot Token**，格式如 `7123456789:AAHdqTcvCH1vGWJxfSeofSIs0K43sBvP`

### 第二步：获取你的用户 ID

1. 搜索 `@userinfobot`
2. 发送任意消息
3. 它会回复你的用户 ID（一串数字，如 `12345678`）

### 第三步：配置

在 `~/.blockcell/config.json` 中添加：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "7123456789:AAHdqTcvCH1vGWJxfSeofSIs0K43sBvP",
      "allowFrom": ["12345678"]
    }
  }
}
```

`allowFrom` 是白名单，只有列表中的用户 ID 才能控制 AI，**强烈建议填写**，防止他人滥用你的 Bot。

### 第四步：启动

```bash
blockcell agent
```

启动后，给你的 Bot 发消息，AI 就会响应了。

### 注意事项

- Telegram 使用 Long Polling，不需要公网 IP
- 无法访问 Telegram 时，需要配置代理：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "...",
      "allowFrom": ["12345678"],
      "proxy": "http://127.0.0.1:7890"
    }
  }
}
```

---

## Discord

### 创建 Bot

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications)
2. 点击 "New Application"，创建应用
3. 左侧选择 "Bot"，点击 "Add Bot"
4. 在 "Privileged Gateway Intents" 中开启：
   - **Message Content Intent**（必须，否则收不到消息内容）
   - **Server Members Intent**（可选）
5. 复制 **Bot Token**

### 获取频道 ID

1. Discord 设置 → 高级 → 开启开发者模式
2. 右键点击目标频道 → 复制 ID

### 配置

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "你的Bot Token",
      "channels": ["频道ID1", "频道ID2"],
      "allowFrom": ["用户ID1"]
    }
  }
}
```

### 邀请 Bot 到服务器

在 Developer Portal → OAuth2 → URL Generator 中，勾选 `bot` scope 和以下权限：
- Read Messages/View Channels
- Send Messages
- Read Message History

生成邀请链接，用管理员账号打开，将 Bot 添加到你的服务器。

---

## Slack

### 创建 Slack App

1. 前往 [Slack API](https://api.slack.com/apps)，点击 "Create New App"
2. 选择 "From scratch"，填写应用名称和工作区

### 配置 Bot 权限

在 "OAuth & Permissions" → "Bot Token Scopes" 中添加：
- `channels:history`
- `channels:read`
- `chat:write`
- `users:read`（用于过滤用户）

点击 "Install to Workspace"，复制 **Bot User OAuth Token**（以 `xoxb-` 开头）。

### 获取频道 ID

右键点击 Slack 频道 → "View channel details" → 底部显示频道 ID（以 `C` 开头）。

### 配置

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的Bot-Token",
      "channels": ["C频道ID"],
      "allowFrom": ["用户邮箱或ID"],
      "pollIntervalSecs": 5
    }
  }
}
```

### 将 Bot 加入频道

在 Slack 频道中输入 `/invite @你的Bot名称`。

---

## 飞书（Lark）

### 创建应用

1. 前往[飞书开放平台](https://open.feishu.cn)
2. 创建企业自建应用
3. 在应用凭证页面获取 **App ID** 和 **App Secret**

### 配置权限

在应用后台，开通以下权限：
- `im:message`（接收和发送消息）
- `im:message.group_at_msg`（接收群 @ 消息）

### 配置 WebSocket 长连接

在事件订阅页面，选择"使用长连接接收事件"，订阅 `im.message.receive_v1` 事件。

### 配置

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxxxxxxxx",
      "appSecret": "你的AppSecret",
      "allowFrom": ["用户open_id或邮箱"]
    }
  }
}
```

### 获取用户 ID

可以在飞书管理后台查询成员的 Open ID，或者在 Bot 首次收到消息时从日志中获取。

---

## 钉钉

### 创建机器人

1. 前往[钉钉开放平台](https://open.dingtalk.com)
2. 创建企业内部应用
3. 获取 **AppKey**、**AppSecret**
4. 在应用中创建 AI 助手机器人，获取 **Robot Code**

### 配置

```json
{
  "channels": {
    "dingtalk": {
      "enabled": true,
      "appKey": "你的AppKey",
      "appSecret": "你的AppSecret",
      "robotCode": "你的RobotCode",
      "allowFrom": ["手机号或用户ID"]
    }
  }
}
```

钉钉使用 **Stream 模式**（WebSocket），无需公网 IP。

---

## 企业微信

### 创建应用

1. 登录[企业微信管理后台](https://work.weixin.qq.com)
2. 应用管理 → 创建应用
3. 获取 **CorpId**（企业 ID）、**AgentId**（应用 ID）、**Secret**

### 配置

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "corpId": "你的CorpId",
      "corpSecret": "你的Secret",
      "agentId": 100001,
      "allowFrom": ["员工userId"],
      "pollIntervalSecs": 10
    }
  }
}
```

---

## 多渠道同时启用

可以同时配置多个渠道，blockcell 会同时监听所有渠道：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "...",
      "allowFrom": ["你的TG用户ID"]
    },
    "slack": {
      "enabled": true,
      "botToken": "xoxb-...",
      "channels": ["C频道ID"]
    }
  }
}
```

来自任一渠道的消息都会被同一个 AI 实例处理，AI 的回复会发回到对应的渠道。

---

## 渠道状态检查

```bash
blockcell channels status
```

输出示例：

```
Telegram:  ✓ connected (bot: @MyBot)
Discord:   ✗ not configured
Slack:     ✓ connected (polling, 2 channels)
Feishu:    ✗ not configured
```

---

## 使用渠道发送消息

AI 可以主动向渠道发送消息（用于推送报告、告警等）：

```
你: 每天早上 9 点把 A 股开盘情况发到我的 Telegram
```

AI 会设置一个 cron 任务，定时执行并通过 `message` 工具发送到你的 Telegram。

---

*上一篇：[记忆系统](./05_memory_system.md)*
*下一篇：[浏览器自动化](./07_browser_automation.md)*
