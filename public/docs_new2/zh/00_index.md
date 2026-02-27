# blockcell 文档

> 一个用 Rust 构建的、会自我进化的 AI 智能体框架

---

## 入门

| 文档 | 说明 |
|------|------|
| [产品介绍](./01_introduction.md) | blockcell 是什么，核心理念与设计哲学 |
| [安装](./02_installation.md) | 各平台安装方式，从二进制到源码编译 |
| [快速上手](./03_quickstart.md) | 5 分钟完成初始化，开始第一次对话 |

## 使用指南

| 文档 | 说明 |
|------|------|
| [CLI 命令全览](./04_commands.md) | 所有子命令、参数与使用示例 |
| [对话模式（Agent）](./05_agent_mode.md) | 交互对话、子任务、多模态输入 |
| [Gateway 与后台服务](./06_gateway_daemon.md) | HTTP API、WebSocket、Web UI、服务化部署 |
| [渠道接入](./07_channels.md) | Telegram / Discord / Slack / 飞书 / 钉钉 / 企微 |
| [工具系统](./08_tools.md) | 60+ 内置工具分类详解 |
| [技能（Skill）系统](./09_skills.md) | Rhai 脚本技能，安装、编写与进化 |
| [记忆系统](./10_memory.md) | SQLite + FTS5 持久化记忆，自动存取 |

## 配置

| 文档 | 说明 |
|------|------|
| [配置文件详解](./11_config_file.md) | config.json 所有字段逐一说明 |
| [AI 模型供应商](./12_providers.md) | OpenAI / DeepSeek / Kimi / Anthropic / Gemini / Ollama |
| [安全机制](./13_security.md) | 路径沙箱、Token 鉴权、操作审计 |

## 进阶

| 文档 | 说明 |
|------|------|
| [架构深度解析](./14_architecture.md) | Crate 结构、核心组件、消息总线 |
| [Gateway API 参考](./15_gateway_api.md) | REST + WebSocket 完整接口文档 |
| [自我进化系统](./16_self_evolution.md) | 错误检测、代码生成、金丝雀发布 |
| [二次开发指南](./17_development.md) | 贡献工具、编写测试、构建流程 |
