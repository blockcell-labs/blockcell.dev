# 产品介绍

> blockcell —— 用 Rust 构建的、会自我进化的 AI 智能体框架

---

## blockcell 是什么？

blockcell 是一个运行在你本地或服务器上的 **AI 智能体（AI Agent）**。

你可以把它理解为：一个真正能"做事"的 AI 助手。它不仅能回答问题，还能：

- 读写文件、执行终端命令
- 搜索网页、抓取页面内容
- 控制浏览器完成自动化任务
- 实时获取股票、加密货币行情
- 发送 Telegram / Slack / 邮件消息
- 监控价格并自动触发提醒
- 在后台并发运行多个子任务
- **自动检测错误、重写代码、自我修复**

---

## 核心设计理念

### Block：稳定的地基

blockcell 的核心由 **Rust** 编写。Rust 以内存安全、零崩溃著称，是系统级编程的首选语言。

这一层我们称之为 **Block**：它是固定的、可信赖的执行基础。无论 AI 做出怎样的决策，它始终运行在这个安全的地基之上。

### Cell：可进化的能力单元

blockcell 的扩展能力由 **Rhai 脚本**（一种轻量级 Rust 内嵌脚本语言）驱动。

每一个「技能（Skill）」都是一个独立的 Rhai 脚本文件，就像生物细胞一样：

- 可以被复制（安装新技能）
- 可以变异（LLM 重写代码，自我进化）
- 可以替换（新版本金丝雀发布）
- 可以死亡（禁用或删除技能）

这一层我们称之为 **Cell**：它是灵活的、可替换的、持续进化的。

### Block + Cell = blockcell

```
┌──────────────────────────────────────────┐
│  Rust 核心层（Block）                     │
│  工具引擎 / 记忆引擎 / Provider 工厂      │
│  消息总线 / 任务调度 / 安全沙箱           │
├──────────────────────────────────────────┤
│  Rhai 技能层（Cell）                      │
│  stock_monitor / daily_report / ...       │
│  可热更新 / 可自我修复 / 可社区共享       │
└──────────────────────────────────────────┘
```

---

## 与其他 AI 工具的区别

| 特性 | ChatGPT / Claude | LangChain | blockcell |
|------|-----------------|-----------|-----------|
| 本地运行 | ✗ | △ | ✅ |
| 数据留本地 | ✗ | △ | ✅ |
| 内置 60+ 工具 | ✗ | 需组装 | ✅ |
| 持久化记忆 | 部分 | 需配置 | ✅ 自动 |
| 自我进化 | ✗ | ✗ | ✅ |
| 多渠道接入 | ✗ | 需组装 | ✅ |
| Rust 性能 | ✗ | ✗ | ✅ |
| 二进制单文件 | ✗ | ✗ | ✅ |

---

## 能力全景

### 工具层（60+ 内置工具）

| 类别 | 代表工具 |
|------|---------|
| 文件与代码 | `read_file` `write_file` `edit_file` `exec` |
| 网络与搜索 | `web_search` `web_fetch` `http_request` |
| 浏览器自动化 | `browse` `chrome_control` `app_control` |
| 金融数据 | `finance_api` `exchange_api` `alert_rule` `stream_subscribe` |
| 区块链 | `blockchain_rpc` `blockchain_tx` `contract_security` |
| 通信 | `message` `email` `notification` `social_media` |
| 数据处理 | `data_process` `chart_generate` `office_write` |
| 媒体 | `audio_transcribe` `tts` `ocr` `video_process` |
| 系统 | `system_info` `termux_api` `iot_control` |
| 开发运维 | `git_api` `cloud_api` `network_monitor` |

### 技能层（Rhai 脚本）

技能是工具的编排层，用自然语言描述任务意图，AI 自动匹配并执行。内置技能包括：

- `stock_monitor` — 股票监控与技术分析
- `crypto_onchain` — 链上数据分析
- `daily_finance_report` — 每日金融简报
- `bond_monitor` — 债券市场监控
- `macro_monitor` — 宏观经济数据跟踪

### 记忆层

使用 SQLite + FTS5 存储长期记忆，AI 能够在跨会话中记住你的偏好、项目、任务和重要信息。

### 自我进化

当技能执行出错次数超过阈值，系统自动触发进化流程：LLM 重写代码 → 安全审计 → 金丝雀发布 → 全量上线。

---

## 支持的 AI 模型

blockcell 是**模型无关**的，支持：

- **OpenRouter**（推荐，可访问所有主流模型）
- **DeepSeek**（性价比极高）
- **Kimi / Moonshot**（中文优化）
- **Anthropic Claude**（原生 API）
- **Google Gemini**（原生 API）
- **OpenAI**（GPT-4o 等）
- **Ollama**（本地模型，完全离线）
- **vLLM**（自部署推理服务）

---

## 为什么选择 Rust？

- **性能**：零成本抽象，没有 GC 停顿，适合长期运行的后台服务
- **安全**：内存安全由编译器保证，不会有悬垂指针或数据竞争
- **单文件分发**：编译产物是一个静态链接的二进制文件，无需 Python/Node 环境
- **可靠性**：Rust 程序一旦编译通过，运行时崩溃极为罕见

---

*下一篇：[安装](./02_installation.md)*
