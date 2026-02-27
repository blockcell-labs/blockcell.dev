# 什么是 blockcell？

> 一个用 Rust 编写的、会自我进化的 AI 智能体框架

---

## 先从一个真实的痛点说起

你有没有遇到过这种情况：

用 ChatGPT 问了一个问题，它给了你一段 Python 代码。你手动复制到编辑器里，运行，出错了。你把错误贴回去，它帮你改好了，你再复制，再运行……

或者你想让 AI 每天早上 8 点给你发一份股市日报。但你的 AI 工具不能定时执行，不能访问实时数据，也不能自动推送给你。

**AI 明明"知道"怎么做，但它只能说，不能做。**

blockcell 想解决的，就是这个问题。

---

## blockcell 是什么

blockcell 是一个开源的 **AI 智能体（AI Agent）框架**，用 **Rust** 编写。

它让 AI 不只是聊天，而是**真正能执行任务**：

```
你说："帮我分析桌面上的 sales.xlsx，画一张折线图，然后发到我的 Telegram"

blockcell：
  1. 读取 ~/Desktop/sales.xlsx
  2. 用 Python 分析数据，计算趋势
  3. 调用 matplotlib 生成折线图 chart.png
  4. 通过 Telegram Bot 发送图片给你
  ✅ 完成，全程不需要你手动操作
```

---

## 和普通 AI 工具的区别

| 能力 | ChatGPT/Claude 网页版 | blockcell |
|------|----------------------|-----------|
| 读写本地文件 | ❌ | ✅ |
| 执行终端命令 | ❌ | ✅ |
| 操控浏览器（自动化） | ❌ | ✅ |
| 发邮件 / 发 Telegram | ❌ | ✅ |
| 持久记忆（跨会话） | 有限 | ✅ SQLite 全文搜索 |
| 定时任务（Cron） | ❌ | ✅ |
| 接入 Telegram/Slack/飞书 | ❌ | ✅ |
| 实时股票 / 加密数据 | ❌ | ✅ |
| 自我进化（自动修复） | ❌ | ✅ |
| 本地离线运行 | ❌ | ✅ Ollama |
| 部署为 HTTP API | ❌ | ✅ Gateway 模式 |

---

## 核心设计：两层架构

blockcell 的架构分为稳定的"宿主层"和灵活的"技能层"：

```
┌──────────────────────────────────────────────────────┐
│              Rust 宿主层（可信计算基）                  │
│                                                      │
│  消息总线  │  工具注册中心  │  任务调度  │  记忆存储     │
│  安全审计  │  Provider 工厂 │  子智能体  │  自我进化引擎 │
└──────────────────────────────────────────────────────┘
                           ↕  标准接口
┌──────────────────────────────────────────────────────┐
│              Rhai 技能层（可变、可进化）                 │
│                                                      │
│  stock_monitor  │  bond_monitor  │  daily_report     │
│  crypto_onchain │  browser_task  │  你的自定义技能    │
└──────────────────────────────────────────────────────┘
```

**Rust 宿主层** 是稳定的核心：负责安全、性能、调度和工具执行。它不会轻易改变，是整个系统的信任基础。

**Rhai 技能层** 是灵活的扩展：用脚本语言编写，可以随时添加、修改，甚至让 AI 自动生成新技能。

这就像手机的操作系统（稳定的内核）和 App（灵活的扩展）的关系。

---

## 内置了哪些能力

blockcell 开箱即用，内置 **60+ 工具**，覆盖：

### 📁 文件与系统
- 读写文件（支持 Excel / Word / PDF / PPT 自动解析）
- 执行终端命令
- 文件压缩 / 解压 / 复制 / 移动

### 🌐 网络与数据
- 网页搜索（DuckDuckGo，无需 Key）
- 网页抓取（自动转 Markdown，节省 80% token）
- 浏览器自动化（CDP 协议，操控真实 Chrome）
- HTTP 请求 / WebSocket 实时流

### 📈 金融与区块链
- A 股 / 港股 / 美股实时行情（东方财富、Alpha Vantage）
- 加密货币价格（CoinGecko 免费 API）
- 链上数据查询（以太坊 / BSC / Polygon 等）
- CEX 交易所数据（Binance / OKX / Bybit）
- DeFi / NFT 数据

### 💬 通信
- 发邮件（SMTP 发送 / IMAP 收件）
- Telegram / Slack / Discord / 飞书 / 钉钉 消息
- 桌面通知 / SMS

### 🎬 多媒体
- 截图（macOS 原生 + 浏览器截图）
- 语音转文字（Whisper，支持本地和 API）
- 文字转语音（macOS say / Edge TTS / OpenAI TTS）
- 视频剪辑 / 提取音频（ffmpeg）
- 生成图表（matplotlib / plotly）
- 生成 PPT / Word / Excel

### 🤖 AI 增强
- 图片理解（GPT-4o / Claude / Gemini 视觉模型）
- OCR 文字识别
- 知识图谱（本地 SQLite）

---

## 最独特的特性：自我进化

当某个技能反复出错，blockcell 会**自动修复自己**：

```
1. 记录错误模式（超过阈值触发进化）
2. LLM 分析问题，生成新版本代码
3. 自动审计代码安全性
4. 编译 / 语法检查
5. 灰度发布：先 10% 流量 → 50% → 100%
6. 监控错误率，如果更差就自动回滚
```

这意味着 blockcell 会随着使用越来越可靠，像一个**会学习的员工**。

---

## 支持哪些 AI 模型

blockcell 对模型无锁定，支持：

| 模型 / 服务 | 说明 |
|------------|------|
| **OpenAI** (GPT-4o, GPT-4.1 等) | 原生支持 |
| **Anthropic** (Claude 3.5 / 3.7) | 原生支持 |
| **Google Gemini** | 原生支持 |
| **DeepSeek** | OpenAI 兼容接口 |
| **Kimi / Moonshot** | 内置配置，国内稳定 |
| **Ollama** | 本地运行，完全离线 |
| **OpenRouter** | 一个 Key 访问所有模型 |
| 任何 OpenAI 兼容 API | 通过 `apiBase` 配置 |

---

## 为什么用 Rust 编写

很多人会问：AI 框架不是应该用 Python 吗？

blockcell 选择 Rust 有明确的理由：

1. **内存安全**：AI 在执行代码时，宿主层不会因为意外内存问题崩溃
2. **并发性能**：单机可同时运行大量子智能体，无 Python GIL 限制
3. **可信赖的基座**：宿主层是"可信计算基"，必须极度稳定和可预测
4. **单文件部署**：编译成一个二进制文件，macOS / Linux / Windows 都能运行，无依赖

---

## 3 行命令感受一下

```bash
# 安装
curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/refs/heads/main/install.sh | sh

# 初始化 + 配置（填入你的 API Key）
blockcell onboard

# 启动
blockcell agent
```

然后尝试：
- `帮我搜索今天的 AI 新闻`
- `读一下 ~/Desktop/report.pdf，总结主要内容`
- `帮我监控茅台股价，跌破 1500 发通知给我`

---

## 小结

blockcell 是一个：
- **会执行任务**的 AI 框架（不只是聊天）
- **开箱即用**，内置 60+ 工具
- **可扩展**，通过技能系统添加任意能力
- **会自我进化**，自动修复和改进
- **全平台**，macOS / Linux / Windows 单文件运行

---

*下一篇：[5分钟上手 —— 从安装到第一次对话](./02_quickstart.md)*

*项目地址：https://github.com/blockcell-labs/blockcell*
