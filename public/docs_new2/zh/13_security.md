# 安全机制

> blockcell 的安全设计：沙箱隔离、操作透明、最小权限

---

## 设计原则

blockcell 的安全机制基于以下原则：

1. **默认安全**：所有高风险操作默认受限，需要明确授权
2. **操作透明**：每次工具调用都可见，无隐藏行为
3. **最小权限**：子任务和技能只获得完成任务所需的最小权限
4. **本地优先**：数据默认存储在本地，不强制上传到任何云服务

---

## 文件路径沙箱

### 工作区约束

所有文件操作工具（`read_file`、`write_file`、`edit_file`、`list_dir`、`exec`）默认只能操作**工作区目录**内的路径：

```
~/.blockcell/workspace/
```

当 AI 需要访问工作区**之外**的路径时，会弹出确认提示：

```
AI 请求访问工作区外的路径：
  /Users/you/Documents/report.docx

是否允许此操作？(y/N): 
```

你可以选择：
- `y` — 本次允许
- `N`（默认）— 拒绝，AI 收到拒绝错误

### 路径安全检查的覆盖范围

以下工具的文件参数都经过路径安全检查：

| 工具 | 受检参数 |
|------|---------|
| `read_file` | `path` |
| `write_file` | `path` |
| `edit_file` | `path` |
| `list_dir` | `path` |
| `exec` | 命令中的路径参数 |
| `video_process` | `input`, `output` |
| `audio_transcribe` | `file` |
| `office_write` | `output_path` |

---

## Gateway API 鉴权

当 `blockcell gateway` 对外暴露时，通过 `apiToken` 启用 Bearer Token 鉴权：

```json
{
  "gateway": {
    "host": "0.0.0.0",
    "port": 18790,
    "apiToken": "your-strong-random-token-here"
  }
}
```

生成一个强随机 Token：

```bash
openssl rand -hex 32
# 示例: a3f8c2d1e4b5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
```

所有请求必须携带：

```bash
curl -H "Authorization: Bearer your-token" \
     http://your-server:18790/v1/chat
```

> ⚠️ 如果 `host` 设为 `0.0.0.0`（公网可访问），**必须**设置 `apiToken`，否则任何人都可以控制你的 AI。

---

## 渠道白名单

每个渠道都有 `allowFrom` 白名单，只有列出的用户才能与 AI 交互：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "...",
      "allowFrom": ["12345678", "87654321"]
    }
  }
}
```

不在白名单中的用户消息会被**静默忽略**（无回复、无提示）。

**强烈建议**始终配置 `allowFrom`，防止 Bot 被陌生人滥用。

---

## 子智能体权限限制

通过 `spawn` 启动的后台子任务使用**受限工具集**，不包含：

- `spawn`（防止无限嵌套）
- `cron`（防止子任务创建新定时任务）
- `message`（防止子任务向外发送消息）

子任务仍然可以：读写文件、执行命令、网络请求、访问记忆、调用各类 API。

---

## 技能代码审计

每次技能进化时，新生成的 Rhai 代码在进入金丝雀发布**之前**必须通过安全审计：

审计检查项：
- 是否包含文件系统破坏操作（`rm -rf` 等）
- 是否包含数据外泄操作（向未知地址发送敏感信息）
- 是否包含无限循环风险
- 是否符合 Rhai 脚本规范

审计失败 → 代码被拒绝，附带失败原因重新生成（最多 3 次）。

---

## 操作可见性

blockcell 的每次工具调用都在对话中完整展示：

```
[tool: finance_api]  action=stock_quote symbol=AAPL
→ {"price": 212.50, "change_pct": "+1.4%", ...}

[tool: write_file]  path=workspace/analysis.md
→ 写入 1.2KB 成功
```

**没有任何隐藏的工具调用**。如果 AI 执行了你不期望的操作，你可以立即发现。

---

## CORS 配置

Gateway 模式下，限制哪些前端域名可以访问 API：

```json
{
  "gateway": {
    "allowedOrigins": [
      "https://yourdomain.com",
      "https://app.yourdomain.com"
    ]
  }
}
```

默认值 `["*"]` 允许所有来源，生产环境应改为具体域名。

---

## 本地数据存储

blockcell 的所有数据均存储在本地：

| 数据 | 位置 |
|------|------|
| 配置 | `~/.blockcell/config.json` |
| 记忆数据库 | `~/.blockcell/workspace/memory.db` |
| 技能文件 | `~/.blockcell/workspace/skills/` |
| 工作区文件 | `~/.blockcell/workspace/` |

blockcell **不会**：
- 将你的对话内容上传到 blockcell 服务器
- 将你的 API Key 发送给任何第三方
- 在后台收集使用统计数据

对话内容只会发送给你配置的 **LLM 供应商**（DeepSeek / OpenAI 等），这由你的 API Key 配置决定。

---

## 安全检查清单

部署前建议逐项确认：

- [ ] `apiToken` 已设置（如果 gateway 对公网开放）
- [ ] 所有渠道的 `allowFrom` 白名单已配置
- [ ] API Key 妥善保管，不提交到 Git
- [ ] 如果用 Nginx/Caddy 反代，确认启用了 HTTPS
- [ ] 定期备份 `~/.blockcell/workspace/memory.db`

---

*上一篇：[AI 模型供应商](./12_providers.md)*
*下一篇：[架构深度解析](./14_architecture.md)*
