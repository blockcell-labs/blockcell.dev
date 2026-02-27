# 记忆系统

> AI 不再"失忆"——基于 SQLite + FTS5 的持久化记忆

---

## 为什么需要记忆？

普通的 AI 对话是无状态的：每次开启新会话，AI 完全不记得你之前说过什么。

你告诉它"我喜欢简洁的代码风格"，下次又得重新说一遍。你让它记住你的股票持仓，关掉窗口就消失了。

blockcell 的记忆系统解决了这个问题：**AI 记得的东西，会持久保存，跨会话可用。**

---

## 记忆存储架构

blockcell 使用 **SQLite + FTS5（全文搜索）** 作为记忆后端。

数据库文件位于：`~/.blockcell/workspace/memory/memory.db`

### 记忆的数据结构

每条记忆包含：

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识符（UUID） |
| `scope` | 范围：`long_term`（长期）/ `short_term`（短期） |
| `type` | 类型：`fact`（事实）/ `preference`（偏好）/ `project`（项目）/ `task`（任务）/ `note`（笔记）等 |
| `title` | 标题（用于展示） |
| `content` | 完整内容 |
| `summary` | 摘要（用于快速检索） |
| `tags` | 标签列表（逗号分隔） |
| `importance` | 重要性（0-10，影响检索排序） |
| `dedup_key` | 去重键（相同 key 的记忆会更新而非重复创建） |
| `expires_at` | 过期时间（可选，短期记忆用） |
| `created_at` | 创建时间 |
| `updated_at` | 最后更新时间 |

### FTS5 全文搜索

记忆的 `title`、`content`、`summary`、`tags` 字段都被索引到 FTS5 虚拟表中，支持：
- 关键词全文搜索
- BM25 相关性排序
- 重要性和时效性加权

---

## 记忆的工作方式

### 自动保存

AI 在对话中会自动判断哪些信息值得记住，并调用 `memory_upsert` 工具保存：

```
你: 我的股票账户里有 1000 股茅台，成本价 1800 元

AI: 好的，我会记住这个信息。
    → 调用 memory_upsert，保存到长期记忆
    → type: "fact", tags: "股票,持仓,茅台"
    → importance: 8
```

### 上下文注入

每次对话开始时，系统会根据你的问题，从记忆库中检索最相关的记忆，自动注入到 AI 的系统提示中：

```
你问："茅台今天涨了多少？"

系统自动检索：
  → 找到记忆："持有 1000 股茅台，成本价 1800 元"
  → 注入到系统提示

AI 回答时就知道你持有茅台，可以给出个性化的分析
```

这个检索是**基于语义相关性**的，不是简单的关键词匹配，所以 AI 能智能找到最相关的上下文。

### 会话摘要

当对话轮次达到一定数量（默认 6 轮），系统会自动生成**会话摘要**，以 Q&A 对的形式保存到记忆库，供未来会话参考。

---

## 记忆操作工具

### `memory_upsert` — 保存记忆

```
你: 记住，我不喜欢代码里有冗余的注释

AI: 已记住。
    → memory_upsert {
        type: "preference",
        title: "代码风格偏好",
        content: "不喜欢代码里有冗余注释，偏好简洁风格",
        tags: "代码,风格,偏好",
        scope: "long_term",
        importance: 7
      }
```

参数说明：
- `dedup_key`：设置这个参数后，重复保存同一个 key 会更新而不是新建（防止重复）
- `expires_in_days`：设置过期天数（适合短期信息，如"明天开会"）
- `importance` (0-10)：重要性越高，检索时排序越靠前

### `memory_query` — 查询记忆

```
你: 你还记得我的股票持仓吗？

AI: 让我查一下...
    → memory_query {
        query: "股票 持仓",
        scope: "long_term",
        top_k: 5
      }
    → 返回：持有 1000 股茅台，成本价 1800 元；...
```

支持多种过滤：
- `scope`：只查长期或短期记忆
- `type`：只查某类记忆（fact / preference / project 等）
- `tags`：按标签过滤
- `time_range`：按时间范围过滤
- `top_k`：返回数量限制

### `memory_forget` — 删除记忆

```
你: 忘掉关于茅台持仓的记忆，我已经清仓了

AI: 好的，已删除。
    → memory_forget {
        action: "soft_delete",
        query: "茅台 持仓"
      }
```

软删除（进入回收站，30天后永久清除）。支持批量删除（按 scope / type / tags 过滤）。

---

## CLI 记忆管理

```bash
# 列出所有记忆（按重要性和时间排序）
blockcell memory list

# 搜索记忆
blockcell memory search "茅台"
blockcell memory search "股票" --type fact --scope long_term

# 查看记忆统计
blockcell memory stats

# 手动触发维护（清理过期记忆）
blockcell memory clean
```

---

## 记忆类型详解

| 类型 | 典型内容 | 建议 importance |
|------|----------|----------------|
| `fact` | 客观事实，如"我的邮箱是 xxx" | 8-10 |
| `preference` | 偏好设置，如"喜欢简洁代码风格" | 7-9 |
| `project` | 项目信息，如"项目 A 使用 React + TypeScript" | 7-9 |
| `task` | 待办事项，如"周五提交报告" | 6-8 |
| `note` | 通用笔记 | 4-6 |
| `session_summary` | 自动生成的会话摘要 | 5 |
| `skill_context` | 技能执行上下文 | 4 |

---

## 记忆的最佳实践

### 让 AI 主动记忆

在对话中明确告诉 AI 需要记住的信息：

```
你: 记住，我的主要工作目录是 ~/projects/myapp，技术栈是 React + TypeScript + Rust

你: 记住我的 Telegram 频道 ID 是 @mychannel，用于发送每日报告

你: 记住我的股票持仓：茅台 1000 股（成本 1800），平安 2000 股（成本 45）
```

### 设置过期时间

对于临时信息，设置过期时间避免记忆库堆积：

```
你: 记住明天下午 3 点有个会议，1 天后可以忘掉
```

### 标记重要性

```
你: 记住这个，很重要：我的账户安全密码是通过 1Password 管理的，不要直接存密码
```

AI 会给高重要性标记，确保在检索时优先显示。

---

## Token 优化：智能注入

blockcell 不会把所有记忆都塞进系统提示（那样会消耗大量 token）。

它使用**查询驱动的记忆检索**：
1. 分析你的问题，提取关键词
2. FTS5 搜索相关记忆
3. 只注入最相关的 10-20 条（约占几百 token）

对于闲聊类对话（Chat 意图），甚至完全跳过记忆注入，进一步节省 token。

---

## 数据备份

记忆数据库是单个 SQLite 文件，备份非常简单：

```bash
# 备份
cp ~/.blockcell/workspace/memory/memory.db ~/backup/memory_$(date +%Y%m%d).db

# 恢复
cp ~/backup/memory_20250101.db ~/.blockcell/workspace/memory/memory.db
```

---

*上一篇：[技能（Skill）系统](./04_skill_system.md)*
*下一篇：[多渠道接入](./06_channels.md)*
