# 对话模式（Agent）

> blockcell 的核心使用方式——与 AI 进行自然语言交互，完成各类任务

---

## 启动方式

### 交互 REPL 模式

```bash
blockcell agent
```

进入持续对话的命令行界面，支持多轮对话，AI 会记住当前会话的上下文。

### 单条消息模式

```bash
blockcell agent -m "帮我分析工作区里的所有 Python 文件"
```

执行一条消息后退出，适合脚本调用。

### 指定模型

```bash
blockcell agent --model anthropic/claude-opus-4-5 -m "帮我写一篇技术博客"
blockcell agent --model deepseek-chat
blockcell agent --model ollama/llama3
```

---

## 工具调用循环

当你发送一条消息，blockcell 在后台会自动执行一个**工具调用循环**：

```
你的消息
    ↓
意图分类（选择合适的工具集）
    ↓
加载记忆（检索相关历史记忆注入上下文）
    ↓
调用 LLM（携带工具 schema）
    ↓
LLM 返回工具调用？
  ├── 是 → 执行工具 → 结果追加到对话 → 再次调用 LLM
  └── 否 → 输出最终回复
```

AI 一次对话可能自动执行多个工具调用（默认最多 20 轮）。

### 示例：多步任务

```
你: 获取苹果和英伟达的今日行情，比较两者的技术面，给出建议

[tool: finance_api] 获取 AAPL 实时行情...
[tool: finance_api] 获取 NVDA 实时行情...
[tool: finance_api] 获取 AAPL 60日历史K线...
[tool: finance_api] 获取 NVDA 60日历史K线...

苹果（AAPL）当前 $212.50 (+1.4%)，RSI 58，处于多头趋势...
英伟达（NVDA）当前 $875.20 (+3.2%)，RSI 72，短期超买...
综合来看，AAPL 技术面更为健康...
```

---

## 多模态输入（图片）

直接在消息中附带图片路径，AI 会自动识别并处理：

```bash
# 绝对路径
blockcell agent -m "分析这张图片 /Users/me/chart.png"

# @ 前缀
blockcell agent -m "这个截图里有什么错误？@/tmp/error_screenshot.png"

# 波浪线路径
blockcell agent -m "~/Downloads/contract.pdf 里的主要条款是什么？"
```

支持格式：`jpg`、`jpeg`、`png`、`gif`、`webp`。

---

## 会话内置命令

在交互模式中，以下命令直接输入即可：

| 命令 | 说明 |
|------|------|
| `exit` / `quit` / `q` | 退出 |
| `/tasks` | 查看当前后台任务列表 |
| `/clear` | 清空本次会话历史（记忆不受影响） |
| `/skills` | 列出已启用的技能 |

---

## 子任务（并发执行）

blockcell 支持在对话中启动**后台子任务**，让多个 AI 并发处理不同工作：

```
你: 同时做三件事：
   1. 分析工作区里所有 Python 文件的复杂度
   2. 搜索本周的 AI 行业新闻并整理摘要
   3. 获取我自选股的最新行情

每件事完成后告诉我结果
```

AI 会通过 `spawn` 工具启动多个独立的子智能体并发处理，任务完成后分别返回结果。

查看进度：

```
你: /tasks
```

```
后台任务：

[运行中] task_abc123
  📋 分析 Python 文件复杂度
  ⏱ 已运行 2m15s
  📍 正在处理 utils/helpers.py...

[已完成] task_def456
  📋 搜索 AI 新闻
  ✅ 3分钟前完成
```

---

## 定时任务

在对话中直接描述定时需求，AI 会自动创建 cron 任务：

```
你: 每天早上 8:30 给我发一份 A 股开盘前简报，推送到 Telegram

你: 每小时检查一次比特币价格，如果跌破 90000 美元立即通知我

你: 每周一早上 9 点整理上周的工作日志并保存到工作区
```

管理定时任务：

```bash
blockcell cron list
blockcell cron delete <id>
```

---

## 记忆与跨会话连续性

AI 会自动从对话中提取重要信息保存到记忆库：

```
你: 记住我持有 100 股苹果，成本价 180 美元

AI: 好的，我已记住你的苹果仓位信息。

（下次对话，不同会话）

你: 我的苹果仓位现在盈亏多少？

AI: [从记忆中读取仓位信息] [获取当前 AAPL 价格]
    你持有 100 股 AAPL，成本价 $180，当前价 $212.50，
    浮盈 $3,250（+18.1%）。
```

Ghost Agent 在后台持续整理记忆，无需你手动管理。

---

## 安全确认机制

当 AI 需要操作**工作区之外**的文件或目录时，会主动请求确认：

```
AI 请求操作工作区外的路径：/Users/me/Documents/report.docx
是否允许？(y/N)
```

工作区内（`~/.blockcell/workspace/`）的操作无需确认，直接执行。

---

## 在特定场景下的技巧

### 上传文件给 AI 分析

```
你: 分析这个 CSV 文件：@/Downloads/sales_data.csv
   找出销售额最高的前 10 个产品
```

### 让 AI 写代码并运行

```
你: 写一个 Python 脚本，统计工作区里所有 .log 文件中 ERROR 的出现次数，然后运行它
```

AI 会写代码 → 保存到工作区 → 调用 `exec` 执行 → 返回结果。

### 管道式工作流

```
你: 1. 从 GitHub 获取 rust-lang/rust 今天的 issues
   2. 筛选出标签包含 bug 的
   3. 整理成表格保存到工作区
   4. 给我发 Telegram 通知
```

---

*上一篇：[CLI 命令全览](./04_commands.md)*
*下一篇：[Gateway 与后台服务](./06_gateway_daemon.md)*
