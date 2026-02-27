# 5 分钟上手 blockcell

> 从安装到第一次有意义的对话，全程约 5 分钟

---

## 准备工作

你需要：
- **一台电脑**：macOS、Linux 或 Windows（本文以 macOS/Linux 为例）
- **一个 LLM API Key**：DeepSeek / Kimi / OpenAI / Anthropic 任选一个
  - 没有的话，可以用 [DeepSeek](https://platform.deepseek.com)（注册免费送额度，最便宜）
  - 或者安装 [Ollama](https://ollama.ai) 在本地跑模型（完全免费，无需网络）

---

## 第一步：安装

### 方式 A：一键脚本（推荐）

```bash
curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/refs/heads/main/install.sh | sh
```

脚本会自动下载适合你系统的二进制文件，安装到 `~/.local/bin/`。

安装后，如果提示找不到 `blockcell` 命令，需要把路径加入 PATH：

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 方式 B：从源码编译

需要 Rust 1.75 或更高版本（[安装 Rust](https://rustup.rs)）：

```bash
git clone https://github.com/blockcell-labs/blockcell.git
cd blockcell/blockcell
cargo build --release
cp target/release/blockcell ~/.local/bin/
```

### 验证安装

```bash
blockcell --version
# 输出类似：blockcell 0.x.x
```

---

## 第二步：初始化

```bash
blockcell onboard
```

这个命令会创建必要的目录结构和默认配置文件：

```
~/.blockcell/
├── config.json          ← 主配置文件（你需要编辑这个）
└── workspace/           ← AI 的工作目录（AI 默认只能访问这里）
    ├── memory/          ← 记忆数据库（SQLite）
    ├── sessions/        ← 会话历史
    ├── skills/          ← 用户安装的技能
    ├── media/           ← 截图、录音等媒体文件
    ├── alerts/          ← 告警规则
    ├── streams/         ← 实时数据订阅
    └── audit/           ← 操作审计日志
```

---

## 第三步：配置 API Key

打开配置文件：

```bash
nano ~/.blockcell/config.json
# 或者用任何你喜欢的编辑器
```

根据你有的 API Key 选择配置：

### 选项 A：DeepSeek（最便宜，推荐新手）

```json
{
  "providers": {
    "deepseek": {
      "apiKey": "sk-你的DeepSeek密钥",
      "apiBase": "https://api.deepseek.com/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "deepseek-chat"
    }
  }
}
```

### 选项 B：Kimi / Moonshot（国内访问稳定）

```json
{
  "providers": {
    "kimi": {
      "apiKey": "sk-你的Kimi密钥",
      "apiBase": "https://api.moonshot.cn/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "kimi/moonshot-v1-8k"
    }
  }
}
```

### 选项 C：OpenAI

```json
{
  "providers": {
    "openai": {
      "apiKey": "sk-你的OpenAI密钥"
    }
  },
  "agents": {
    "defaults": {
      "model": "gpt-4o"
    }
  }
}
```

### 选项 D：Anthropic Claude

```json
{
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-你的Anthropic密钥"
    }
  },
  "agents": {
    "defaults": {
      "model": "claude-3-5-sonnet-20241022"
    }
  }
}
```

### 选项 E：OpenRouter（一个 Key 访问所有模型）

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-你的OpenRouter密钥",
      "apiBase": "https://openrouter.ai/api/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4-20250514"
    }
  }
}
```

### 选项 F：Ollama（完全本地，免费）

先安装 Ollama 并拉取模型：

```bash
# 安装 Ollama（访问 https://ollama.ai）
ollama pull llama3.1
```

然后配置：

```json
{
  "providers": {
    "ollama": {
      "apiBase": "http://localhost:11434"
    }
  },
  "agents": {
    "defaults": {
      "model": "ollama/llama3.1"
    }
  }
}
```

---

## 第四步：检查状态

```bash
blockcell status
```

正常输出如下：

```
✓ Config loaded
✓ Provider: deepseek (deepseek-chat)
✓ Workspace: /Users/你/.blockcell/workspace
✓ Memory: SQLite (0 items)
✓ Skills: 0 user skills, 44 builtin skills
✓ Channels: none configured
```

如果某项是 ✗，根据提示修复（通常是 API Key 填写有误）。

---

## 第五步：启动对话

```bash
blockcell agent
```

你会看到：

```
╔══════════════════════════════════════════╗
║          blockcell agent                 ║
║  /tasks  查看后台任务                     ║
║  /tools  查看可用工具                     ║
║  /quit   退出                            ║
╚══════════════════════════════════════════╝

You:
```

---

## 试试这些场景

### 场景 1：搜索信息

```
You: 帮我搜一下今天有哪些 AI 相关的重要新闻
```

AI 会自动调用 `web_search` 工具搜索，再用 `web_fetch` 获取内容摘要。

### 场景 2：读取本地文件

```
You: 帮我读一下 ~/Desktop/report.txt，总结主要内容
```

> ⚠️ **安全提示**：访问工作目录（`~/.blockcell/workspace`）之外的文件时，blockcell 会显示确认提示，你需要输入 `y` 确认。这是内置的安全机制。

### 场景 3：执行命令

```
You: 帮我看看当前目录有哪些大文件（超过 100MB）
```

AI 会调用 `exec` 工具执行 `find` 或 `du` 命令。

### 场景 4：写文件

```
You: 帮我写一个 Python 脚本，读取 data.csv 并计算每列的均值，保存到工作目录
```

AI 会用 `write_file` 工具创建 `.py` 文件。

### 场景 5：分析 + 可视化

```
You: 帮我读一下工作目录里的 sales.csv，画一张按月销售额的柱状图
```

AI 会：读文件 → 分析数据 → 生成 Python 绘图脚本 → 执行 → 返回图片路径。

---

## 常用 CLI 命令

```bash
# 查看所有可用工具
blockcell tools

# 查看/搜索记忆
blockcell memory list
blockcell memory search "关键词"

# 查看技能
blockcell skills list

# 查看定时任务
blockcell cron list

# 查看后台任务状态
blockcell tasks

# 查看消息渠道状态
blockcell channels status

# 查看进化记录
blockcell evolve list

# 查看告警规则
blockcell alerts list

# 查看日志
blockcell logs

# 运行自诊断
blockcell doctor
```

---

## 配置文件完整结构

`~/.blockcell/config.json` 支持更多高级配置：

```json
{
  "providers": {
    "deepseek": {
      "apiKey": "sk-...",
      "apiBase": "https://api.deepseek.com/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "deepseek-chat",
      "maxTokens": 4096,
      "temperature": 0.7,
      "maxContextTokens": 32000
    }
  },
  "tools": {
    "tickIntervalSecs": 30
  },
  "gateway": {
    "host": "127.0.0.1",
    "port": 18790,
    "webuiPort": 18791,
    "apiToken": "可选的访问令牌"
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "你的Bot Token",
      "allowFrom": ["你的用户ID（数字）"]
    }
  }
}
```

---

## 常见问题

### Q：命令找不到？

```bash
# 检查 PATH
echo $PATH | grep ".local/bin"

# 如果没有，添加
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

### Q：API 调用失败？

```bash
blockcell doctor
# 会自动检测网络和 API 配置问题
```

### Q：想换模型？

直接修改 `config.json` 里的 `agents.defaults.model`，重启 `blockcell agent` 即可，无需重新安装。

### Q：AI 读取文件时弹出确认？

这是正常的安全行为。blockcell 默认只允许访问 `~/.blockcell/workspace/` 目录，访问其他路径（如桌面文件）时会请求你确认。输入 `y` 回车即可。

### Q：如何让 AI 定时执行任务？

在对话中说：`帮我设置一个定时任务，每天早上 8 点搜索今日 AI 新闻并告诉我`。AI 会自动调用 `cron` 工具注册定时任务。

---

## 下一步

你已经完成了基本设置。接下来推荐阅读：

- [工具系统](./03_tools_system.md) — 了解 60+ 内置工具的详细用法
- [多渠道接入](./06_channels.md) — 接入 Telegram，让 AI 通过手机与你交互
- [金融场景实战](./10_finance_use_case.md) — 搭建股票监控和自动日报

---

*上一篇：[什么是 blockcell？](./01_what_is_blockcell.md)*
*下一篇：[工具系统 —— 让 AI 真正能干活](./03_tools_system.md)*
