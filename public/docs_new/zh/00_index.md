# blockcell 文档中心

> **一个用 Rust 编写的、会自我进化的 AI 智能体框架**

---

## 这份文档适合谁

- 想让 AI **真正帮你干活**（执行任务，而不只是聊天）的用户
- 想把 AI 接入 **Telegram / 微信 / Slack** 等消息平台的开发者
- 想搭建**自动化金融监控**、**定时报告**等场景的工程师
- 对 AI 智能体架构感兴趣的技术人员

---

## 文章目录

### 入门篇

| 编号 | 标题 | 简介 |
|------|------|------|
| [01](./01_what_is_blockcell.md) | 什么是 blockcell？ | 核心理念、与普通 AI 工具的区别、5分钟快速认识 |
| [02](./02_quickstart.md) | 5分钟上手 | 安装、配置 API Key、第一次对话、常用命令 |

### 核心能力篇

| 编号 | 标题 | 简介 |
|------|------|------|
| [03](./03_tools_system.md) | 工具系统 | 50+ 内置工具详解：文件、网络、金融、通信、多媒体 |
| [04](./04_skill_system.md) | 技能（Skill）系统 | 什么是技能、如何安装/创建/自定义技能 |
| [05](./05_memory_system.md) | 记忆系统 | SQLite 持久记忆、跨会话记忆、记忆管理 |
| [06](./06_channels.md) | 多渠道接入 | Telegram / Discord / Slack / 飞书 / 钉钉 配置指南 |
| [07](./07_browser_automation.md) | 浏览器自动化 | CDP 协议控制真实 Chrome、表单填写、截图、爬取 |
| [08](./08_gateway_mode.md) | Gateway 模式 | 部署为 HTTP 服务、WebSocket API、多用户访问 |

### 高级特性篇

| 编号 | 标题 | 简介 |
|------|------|------|
| [09](./09_self_evolution.md) | 自我进化 | 错误触发→LLM 生成新代码→审计→灰度发布→自动回滚 |
| [10](./10_finance_use_case.md) | 金融场景实战 | A股监控、加密货币链上数据、自动日报 |
| [11](./11_subagents.md) | 子智能体与任务并发 | spawn 多个后台 AI、TaskManager、并发执行 |
| [12](./12_architecture.md) | 架构深度解析 | Crate 结构、消息总线、Provider 工厂、安全模型 |
| [13](./13_message_processing_and_evolution.md) | 消息处理与进化生命周期 | 从输入到输出的完整链路 + 进化状态机 |

### 故事篇

| 编号 | 标题 | 简介 |
|------|------|------|
| [14](./14_name_origin.md) | 名字由来 | Block + Cell 的含义，设计哲学 |
| [15](./15_ghost_agent.md) | 幽灵智能体（Ghost Agent）| 后台自主运行的守护进程 |
| [16](./16_hub_community.md) | Blockcell Hub 社区 | 技能市场、Agent2Agent 协作 |

---

## 推荐阅读路径

**完全新手：** 01 → 02 → 03 → 05 → 06

**想玩自动化：** 02 → 07 → 08 → 09 → 11

**金融用户：** 02 → 03 → 10 → 15

**开发者/贡献者：** 12 → 13 → 09 → 04

---

## 快速链接

- **GitHub：** [https://github.com/blockcell-labs/blockcell](https://github.com/blockcell-labs/blockcell)
- **官网：** [https://blockcell.dev](https://blockcell.dev)
- **一键安装：**

```bash
curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/refs/heads/main/install.sh | sh
```

---

*如有问题，欢迎在 GitHub Issues 或 Discussions 中提问。*
