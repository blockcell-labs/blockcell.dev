# 快速上手

> 从安装到第一次对话，大约需要 5 分钟

---

## 第一步：初始化

运行向导，完成首次配置：

```bash
blockcell onboard
```

向导会引导你：
1. 选择 AI 模型供应商
2. 输入 API Key
3. 初始化工作区目录（`~/.blockcell/workspace/`）
4. 创建配置文件（`~/.blockcell/config.json`）

### 快速初始化（不用交互）

```bash
# 使用 DeepSeek（推荐，价格低、能力强）
blockcell onboard --provider deepseek --api-key sk-xxx --model deepseek-chat

# 使用 OpenRouter（可访问所有模型）
blockcell onboard --provider openrouter --api-key sk-or-v1-xxx --model anthropic/claude-sonnet-4-6

# 使用 Kimi
blockcell onboard --provider kimi --api-key sk-xxx --model moonshot-v1-8k
```

---

## 第二步：检查状态

```bash
blockcell status
```

输出示例：

```
blockcell status
===============

Config:    /Users/you/.blockcell/config.json ✓
Workspace: /Users/you/.blockcell/workspace ✓
Model:     deepseek-chat

Providers:
  openrouter     ✗ no key
  anthropic      ✗ no key
  openai         ✗ no key
  deepseek       ✓ configured
  ...

Active provider: deepseek

Channels:
  telegram:  ✗ not configured
  slack:     ✗ not configured
  ...
```

如果看到 `Active provider` 显示正常，说明配置成功。

---

## 第三步：环境诊断（可选）

```bash
blockcell doctor
```

`doctor` 会自动检查：配置文件、API Key、工作区目录、系统工具（ffmpeg、Chrome 等），并给出建议。

---

## 第四步：开始对话

```bash
# 交互模式（推荐）
blockcell agent

# 单条消息模式
blockcell agent -m "你好，介绍一下你自己"
```

进入交互模式后：

```
blockcell> 今天的苹果公司股价是多少？

[tool: finance_api] 正在获取 AAPL 实时行情...
苹果（AAPL）当前价格为 $212.50，今日涨幅 +1.4%，成交量 58.2M...

blockcell> 帮我把这个分析保存到工作区

[tool: write_file] 已保存到 workspace/aapl_analysis_20250226.md

blockcell> exit
```

---

## 常用起步命令速查

```bash
# 初始化
blockcell onboard

# 交互对话
blockcell agent

# 单条消息
blockcell agent -m "帮我搜索今天的 AI 新闻"

# 指定模型
blockcell agent --model anthropic/claude-opus-4-5 -m "分析这段代码"

# 检查状态
blockcell status

# 环境诊断
blockcell doctor

# 启动 Gateway（HTTP API + Web UI）
blockcell gateway

# 查看后台任务
blockcell tasks

# 查看技能列表
blockcell skills list

# 查看记忆
blockcell memory list
```

---

## 初始化后的目录结构

```
~/.blockcell/
├── config.json          # 主配置文件
└── workspace/           # AI 工作区
    ├── agents.md        # Agent 行为指引
    ├── soul.md          # 人格与价值观设定
    ├── user.md          # 你的个人偏好
    ├── memory.md        # 长期记忆摘要
    ├── heartbeat.md     # 周期性任务配置
    ├── memory.db        # SQLite 记忆数据库
    └── skills/          # 已安装技能
```

这些文件都是普通的 Markdown / JSON 格式，可以直接用文本编辑器查看和修改。

---

## 下一步

- 想深入了解所有命令？→ [CLI 命令全览](./04_commands.md)
- 想接入 Telegram？→ [渠道接入](./07_channels.md)
- 想配置其他 AI 模型？→ [AI 模型供应商](./12_providers.md)

---

*上一篇：[安装](./02_installation.md)*
*下一篇：[CLI 命令全览](./04_commands.md)*
