# Multi-channel Access

> Let AI live in your Telegram, Slack, Discord — interact anywhere, anytime

---

## Why Connect Channels?

By default, blockcell runs in a terminal session. You must open a command line to interact with it.

After connecting a messaging channel:
- Send a Telegram message from your phone, AI responds instantly
- @ AI in a team Slack channel, it handles tasks for you
- Ask AI questions directly in a Feishu group
- Scheduled reports get pushed to your phone automatically

---

## Supported Channels

| Channel | Connection Method | Best For |
|---------|------------------|----------|
| **Telegram** | Long Polling | Personal use, easiest setup |
| **Discord** | WebSocket Gateway | Community / team |
| **Slack** | Web API polling | Enterprise teams |
| **Feishu (Lark)** | WebSocket long connection | China enterprises |
| **DingTalk** | Stream SDK | China enterprises |
| **WeCom (WeChat Work)** | Polling | China enterprises |
| **WhatsApp** | Webhook | Personal / enterprise |

---

## Telegram (Recommended — Simplest Setup)

### Step 1: Create a Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Follow prompts to set a bot name and username
4. You'll receive a **Bot Token** like: `7123456789:AAHdqTcvCH1vGWJxfSeofSIs0K43sBvP`

### Step 2: Get Your User ID

1. Search for `@userinfobot`
2. Send any message
3. It replies with your user ID (a number like `12345678`)

### Step 3: Configure

Add to `~/.blockcell/config.json`:

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

`allowFrom` is a whitelist — **strongly recommended**. Only listed user IDs can control your AI.

### Step 4: Start

```bash
blockcell agent
```

Message your bot — AI will respond immediately.

### Notes

- Telegram uses Long Polling — no public IP needed
- If Telegram is blocked in your region, configure a proxy:

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

### Create a Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application", create an app
3. Select "Bot" in the left sidebar, click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - **Message Content Intent** (required — without this you can't read message content)
   - **Server Members Intent** (optional)
5. Copy the **Bot Token**

### Get Channel ID

1. Discord Settings → Advanced → Enable Developer Mode
2. Right-click the target channel → Copy ID

### Configure

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "your-bot-token",
      "channels": ["channel-id-1", "channel-id-2"],
      "allowFrom": ["user-id-1"]
    }
  }
}
```

### Invite Bot to Server

In Developer Portal → OAuth2 → URL Generator, check `bot` scope with permissions:
- Read Messages/View Channels
- Send Messages
- Read Message History

Use the generated link (as an admin) to add the bot to your server.

---

## Slack

### Create a Slack App

1. Go to [Slack API](https://api.slack.com/apps), click "Create New App"
2. Choose "From scratch", enter app name and workspace

### Configure Bot Permissions

Under "OAuth & Permissions" → "Bot Token Scopes", add:
- `channels:history`
- `channels:read`
- `chat:write`
- `users:read` (for user filtering)

Click "Install to Workspace", copy the **Bot User OAuth Token** (starts with `xoxb-`).

### Get Channel ID

Right-click a Slack channel → "View channel details" → Channel ID shown at the bottom (starts with `C`).

### Configure

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-your-bot-token",
      "channels": ["C-channel-id"],
      "allowFrom": ["user-email-or-id"],
      "pollIntervalSecs": 5
    }
  }
}
```

### Add Bot to Channel

In Slack, type `/invite @your-bot-name` in the channel.

---

## Feishu (Lark)

### Create an App

1. Go to [Feishu Open Platform](https://open.feishu.cn)
2. Create an enterprise self-built application
3. Get **App ID** and **App Secret** from the credentials page

### Configure Permissions

Enable these scopes:
- `im:message` (receive and send messages)
- `im:message.group_at_msg` (receive @ mentions in groups)

### Set Up WebSocket Long Connection

Under Event Subscriptions, select "Receive events via long connection", subscribe to `im.message.receive_v1`.

### Configure

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxxxxxxxx",
      "appSecret": "your-app-secret",
      "allowFrom": ["user-open-id-or-email"]
    }
  }
}
```

---

## DingTalk

### Create a Robot

1. Go to [DingTalk Open Platform](https://open.dingtalk.com)
2. Create an enterprise internal application
3. Get **AppKey**, **AppSecret**
4. Create an AI assistant robot in the app, get **Robot Code**

### Configure

```json
{
  "channels": {
    "dingtalk": {
      "enabled": true,
      "appKey": "your-app-key",
      "appSecret": "your-app-secret",
      "robotCode": "your-robot-code",
      "allowFrom": ["phone-number-or-user-id"]
    }
  }
}
```

DingTalk uses **Stream mode** (WebSocket) — no public IP required.

---

## Enable Multiple Channels Simultaneously

Configure multiple channels at once — blockcell listens to all of them:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "...",
      "allowFrom": ["your-tg-user-id"]
    },
    "slack": {
      "enabled": true,
      "botToken": "xoxb-...",
      "channels": ["C-channel-id"]
    }
  }
}
```

Messages from any channel are handled by the same AI instance. Replies go back to the originating channel.

---

## Check Channel Status

```bash
blockcell channels status
```

Example output:

```
Telegram:  ✓ connected (bot: @MyBot)
Discord:   ✗ not configured
Slack:     ✓ connected (polling, 2 channels)
Feishu:    ✗ not configured
```

---

## AI Sending Proactive Messages

AI can actively send messages to channels (for pushing reports, alerts, etc.):

```
You: Every morning at 9 AM, send me the stock market open summary on Telegram
```

AI will create a cron task that runs daily and sends via the `message` tool to your Telegram.

---

*Previous: [Memory System](./05_memory_system.md)*
*Next: [Browser Automation](./07_browser_automation.md)*
