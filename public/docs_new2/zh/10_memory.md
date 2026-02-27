# 记忆系统

> SQLite + FTS5 驱动的持久化记忆，让 AI 真正记住你

---

## 为什么需要记忆？

默认情况下，大多数 AI 在对话结束后会「失忆」，下次对话从零开始。

blockcell 的记忆系统解决了这个问题：

- AI 会自动从对话中提取重要信息保存
- 下次对话时，AI 检索相关记忆注入上下文
- 跨天、跨会话、跨渠道——AI 始终记得你

---

## 技术架构

```
记忆存储：~/.blockcell/workspace/memory.db（SQLite）

memory_items 表
├── id          TEXT     主键
├── scope       TEXT     long_term / short_term
├── type        TEXT     fact / preference / project / task / note / session_summary
├── title       TEXT     标题
├── content     TEXT     完整内容
├── summary     TEXT     摘要
├── tags        TEXT     标签（逗号分隔）
├── importance  INTEGER  重要度 0-10（影响检索排名）
├── dedup_key   TEXT     去重键（相同键 = 更新，而非新增）
├── expires_at  INTEGER  过期时间（可选）
└── ...

memory_fts 虚拟表（FTS5 全文搜索）
└── 索引 title + summary + content + tags
```

检索分数 = BM25 相关性 + 重要度权重 + 时间衰减权重

---

## 自动记忆提取

每次对话结束后，**Ghost Agent** 在后台分析对话内容，自动提取值得记住的信息：

```
你: 我最近在做一个 Rust + WASM 项目，目标是把 blockcell 的工具层编译到浏览器运行

→ Ghost 自动保存：
  title: "用户的 Rust+WASM 项目"
  content: "目标是将 blockcell 工具层编译到 WASM，在浏览器中运行"
  type: project
  importance: 8
```

每 6 轮对话，系统还会自动生成**会话摘要**（Session Summary），让未来的对话能快速了解历史背景。

---

## 记忆类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `fact` | 客观事实 | "用户持有 100 股苹果，成本 180 美元" |
| `preference` | 用户偏好 | "用户偏好代码示例简洁，不需要注释" |
| `project` | 项目信息 | "正在开发 XXX 项目，用 Rust 写" |
| `task` | 待办任务 | "明天需要完成 API 文档" |
| `note` | 备忘笔记 | "服务器 IP: 192.168.1.100" |
| `session_summary` | 会话摘要 | "本次对话讨论了苹果仓位和技术面分析" |

---

## 记忆操作工具

AI 使用这三个工具操作记忆（你也可以直接让 AI 调用）：

### `memory_upsert` — 保存/更新记忆

```
你: 记住我的服务器 IP 是 192.168.1.100，用户名 admin
```

AI 自动调用：
```json
{
  "tool": "memory_upsert",
  "title": "服务器信息",
  "content": "IP: 192.168.1.100，用户名: admin",
  "type": "note",
  "dedup_key": "server_info_main",
  "importance": 9
}
```

`dedup_key` 是去重键——如果你说「把服务器 IP 改成 10.0.0.1」，AI 会更新同一条记忆，而不是新建。

### `memory_query` — 检索记忆

```
你: 我的苹果仓位是多少？
```

AI 自动调用：
```json
{
  "tool": "memory_query",
  "query": "苹果 AAPL 持仓 仓位",
  "max_results": 10
}
```

FTS5 全文搜索，加权排序，返回最相关的记忆。

### `memory_forget` — 删除记忆

```
你: 把我之前说的服务器信息删掉
```

---

## CLI 管理记忆

```bash
# 列出所有记忆
blockcell memory list

# 按类型筛选
blockcell memory list --type fact
blockcell memory list --type project

# 全文搜索
blockcell memory search "苹果股票"

# 查看详情
blockcell memory show <id>

# 删除
blockcell memory delete <id>

# 清除短期记忆（保留长期）
blockcell memory clear --scope short_term
```

---

## 记忆注入机制

每次对话，系统根据**当前问题**做语义检索，只将最相关的 10-20 条记忆注入 System Prompt：

```
用户消息: "我的苹果仓位现在盈亏多少？"
              ↓
FTS5 搜索 memory_items
              ↓
找到：「苹果仓位：100股，成本$180」→ 注入
找到：「用户偏好简洁输出」→ 注入
其他无关记忆 → 不注入（节省 Token）
```

这样既保证了 AI 的上下文感知，又不会因为记忆过多导致 Token 浪费。

---

## 记忆最佳实践

**主动告知重要信息**

```
你: 记住我在上海，工作是 Rust 开发者，主要关注 AI 和区块链领域
```

**让 AI 记住你的偏好**

```
你: 以后给我的技术解释不用太详细，我有编程基础，直接给代码就行
```

**管理敏感信息**

```bash
# 查看包含 "密码" 的记忆
blockcell memory search "密码"

# 删除不需要的敏感信息
blockcell memory delete <id>
```

**数据备份**

```bash
cp ~/.blockcell/workspace/memory.db ~/backup/memory_$(date +%Y%m%d).db
```

---

*上一篇：[技能（Skill）系统](./09_skills.md)*
*下一篇：[配置文件详解](./11_config_file.md)*
