# 渠道接入

> 让 AI 住进你的 Telegram、Slack、飞书——随时随地交互

---

## 支持的渠道

| 渠道 | 连接方式 | 适合场景 |
|------|---------|---------|
| **Telegram** | Long Polling | 个人使用，配置最简单 |
| **Discord** | WebSocket Gateway | 社区 / 团队 |
| **Slack** | Web API 轮询 | 企业团队 |
| **飞书（Lark）** | WebSocket 长连接 | 国内企业 |
| **钉钉** | Stream SDK | 国内企业 |
| **企业微信（WeCom）** | 轮询 / Webhook | 国内企业 |
| **WhatsApp** | Webhook | 个人 / 国际 |

所有渠道可同时启用，AI 实例共用，回复路由回消息来源渠道。

---

## Telegram（推荐首选）

### 1. 创建 Bot

1. 打开 Telegram，搜索 `@BotFather`
2. 发送 `/newbot`
3. 按提示设置 Bot 名称和用户名
4. 获得 **Bot Token**，格式如：`7123456789:AAHdqTcvCH1vGWJxfSeofSIs0K43sBvP`

### 2. 获取你的用户 ID

搜索 `@userinfobot`，发送任意消息，它会返回你的用户 ID（纯数字）。

### 3. 配置

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "7123456789:AAHdqTcvCH1vGWJxfSeofSIs0K43sBvP",
      "allowFrom": ["12345678"]
    }
  }
}
```

`allowFrom` 是白名单，**强烈建议配置**，只有列出的用户 ID 才能控制你的 AI。

### 使用代理（网络受限地区）

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "...",
      "allowFrom": ["12345678"],
      "proxy": "http://127.0.0.1:7890"
    }
  }
}
```

Telegram 使用 Long Polling，无需公网 IP 或 Webhook。

---

## Discord

### 1. 创建 Bot

1. 访问 [Discord Developer Portal](https://discord.com/developers/applications)
2. New Application → 创建应用
3. 左侧 Bot → Add Bot
4. 开启 **Message Content Intent**（必须，否则无法读取消息内容）
5. 复制 **Bot Token**

### 2. 获取频道 ID

Discord 设置 → 高级 → 开启开发者模式 → 右键频道 → 复制 ID

### 3. 配置

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "your-bot-token",
      "channels": ["channel-id-1"],
      "allowFrom": ["user-id-1"]
    }
  }
}
```

### 4. 邀请 Bot 到服务器

Developer Portal → OAuth2 → URL Generator，勾选 `bot` 权限（读消息、发消息、读历史），用生成的链接邀请 Bot。

---

## Slack

### 1. 创建 Slack App

1. 访问 [api.slack.com/apps](https://api.slack.com/apps) → Create New App
2. OAuth & Permissions → Bot Token Scopes 添加：
   - `channels:history`、`channels:read`、`chat:write`
3. Install to Workspace，复制 **Bot User OAuth Token**（`xoxb-` 开头）

### 2. 获取频道 ID

右键频道 → 查看频道详情 → 底部显示 Channel ID（`C` 开头）。

### 3. 配置

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-your-token",
      "channels": ["C-channel-id"],
      "allowFrom": ["user-member-id"],
      "pollIntervalSecs": 5
    }
  }
}
```

### 4. 将 Bot 加入频道

在频道中输入 `/invite @your-bot-name`。

---

## 飞书（Lark）

### 1. 创建应用

1. 访问[飞书开放平台](https://open.feishu.cn)
2. 创建企业自建应用，获取 **App ID** 和 **App Secret**

### 2. 配置权限

开启：`im:message`（接收/发送消息）、`im:message.group_at_msg`（接收群组@消息）

### 3. 开启 WebSocket 长连接

事件订阅 → 选择「通过长连接接收事件」→ 订阅 `im.message.receive_v1`

### 4. 配置

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxxxxxxxx",
      "appSecret": "your-app-secret",
      "allowFrom": ["user-open-id"]
    }
  }
}
```

---

## 钉钉

### 配置

```json
{
  "channels": {
    "dingtalk": {
      "enabled": true,
      "appKey": "your-app-key",
      "appSecret": "your-app-secret",
      "robotCode": "your-robot-code",
      "allowFrom": ["phone-number"]
    }
  }
}
```

钉钉使用 **Stream 模式**（WebSocket），无需公网 IP。

---

## 企业微信（WeCom）

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "corpId": "your-corp-id",
      "corpSecret": "your-corp-secret",
      "agentId": 1000001,
      "allowFrom": ["zhangsan", "lisi"]
    }
  }
}
```

---

## 查看渠道状态

```bash
blockcell channels status
```

```
Telegram:  ✓ 已连接（bot: @MyBot）
Discord:   ✗ 未配置
Slack:     ✓ 已连接（轮询中，2个频道）
飞书:      ✗ 未配置
```

或通过 `blockcell status` 查看所有渠道状态。

---

## AI 主动推送消息

配置好渠道后，AI 可以主动给你发消息（用于报告、告警等）：

```
你: 每天早上9点把行情简报推送给我的 Telegram
```

AI 会创建定时任务，到时间自动调用 `message` 工具通过 Telegram 发给你。

---

*上一篇：[Gateway 与后台服务](./06_gateway_daemon.md)*
*下一篇：[工具系统](./08_tools.md)*
