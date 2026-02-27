# CLI 命令全览

> blockcell 的所有子命令与参数

---

## 顶层命令结构

```
blockcell <子命令> [选项]
```

---

## `onboard` — 初始化向导

首次使用时运行，完成配置初始化。

```bash
blockcell onboard
blockcell onboard --interactive                        # 交互向导（默认）
blockcell onboard --provider deepseek --api-key sk-xxx --model deepseek-chat
blockcell onboard --provider openrouter --api-key sk-or-v1-xxx
blockcell onboard --provider kimi --api-key sk-xxx --model moonshot-v1-8k
blockcell onboard --channels-only                     # 只更新渠道配置
```

---

## `agent` — 对话模式

与 AI 进行交互对话。

```bash
blockcell agent                                        # 交互 REPL 模式
blockcell agent -m "今天的 AI 新闻"                   # 单条消息
blockcell agent -m "分析这段代码" --model claude-opus  # 指定模型
blockcell agent -m "帮我截图" --provider anthropic     # 指定 provider
```

交互模式内置命令：

| 命令 | 说明 |
|------|------|
| `/exit` / `/quit` | 退出 |
| `/tasks` | 查看后台任务 |
| `/clear` | 清空当前会话历史 |
| `/skills` | 列出已启用技能 |
| `/tools` | 列出可用工具 |

---

## `gateway` — 启动 HTTP 服务

将 blockcell 作为 HTTP/WebSocket 服务运行。

```bash
blockcell gateway                                      # 默认 127.0.0.1:18790
blockcell gateway --port 8080
blockcell gateway --host 0.0.0.0 --port 18790
```

---

## `status` — 查看当前状态

```bash
blockcell status
```

显示：配置文件路径、工作区路径、当前模型、各 provider 配置状态、各渠道状态。

---

## `doctor` — 环境诊断

自动检查运行环境，定位配置问题。

```bash
blockcell doctor
```

检查项：
- 配置文件与 API Key
- 工作区目录与写权限
- 各渠道连通性
- 系统工具（ffmpeg、Chrome 等）
- 记忆数据库健康状态
- 技能引擎状态

---

## `skills` — 技能管理

```bash
blockcell skills list                                  # 列出所有技能
blockcell skills list --enabled                        # 只列出已启用
blockcell skills list --all                            # 包括内置工具错误记录
blockcell skills show stock_monitor                    # 查看技能详情
blockcell skills enable stock_monitor                  # 启用技能
blockcell skills disable stock_monitor                 # 禁用技能
blockcell skills reload                                # 热重载所有技能
blockcell skills test ./skills/stock_monitor           # 运行技能测试（参数是目录路径）
blockcell skills test ./skills/stock_monitor -i "hello" --verbose
blockcell skills test-all ./skills -i "hello"         # 批量测试目录下所有技能
blockcell skills learn "增加网页翻译功能"              # 通过描述学习新技能
blockcell skills install stock_monitor                 # 从社区 Hub 安装技能（如实现/可用）
blockcell skills clear                                 # 清理所有技能进化记录
blockcell skills forget stock_monitor                  # 清理指定技能的记录
```

---

## `evolve` — 技能进化管理

```bash
blockcell evolve run "增加网页翻译功能" --watch        # 触发并观察进度
blockcell evolve trigger stock_monitor --reason "增加港股支持"  # trigger 是 run 的别名
blockcell evolve list                                  # 查看所有进化记录
blockcell evolve list --all --verbose                  # 含内置工具错误 + 详细信息
blockcell evolve show stock_monitor                    # 查看某技能进化历史
blockcell evolve status                                # 查看所有进化状态概览
blockcell evolve status <evolution-id>                 # 查看某条进化状态
blockcell evolve watch                                 # 观察所有进行中的进化
blockcell evolve watch <evolution-id>                  # 观察某条进化
blockcell evolve rollback stock_monitor --to v2         # 回滚到指定版本（见下方限制说明）
```

限制说明：
- 当前 `evolve rollback` **是信息性回滚**：不会自动恢复 `workspace/skills/<skill>` 目录下的文件内容，需要你手动回滚文件。

---

## `memory` — 记忆管理

```bash
blockcell memory list                                  # 列出记忆（默认 20 条）
blockcell memory list --type fact --limit 50            # 按类型筛选
blockcell memory search "苹果股票" --top 10            # 搜索记忆
blockcell memory search "苹果股票" --scope long_term --type fact
blockcell memory show <id>                             # 查看某条记忆
blockcell memory delete <id>                            # 删除（软删除）
blockcell memory stats                                 # 统计
blockcell memory maintenance --recycle-days 30          # 维护（清理过期 + 清空回收站）
blockcell memory clear                                  # 清空（软删除全部）
blockcell memory clear --scope short_term               # 仅清空短期记忆
```

---

## `tasks` — 后台任务管理

```bash
blockcell tasks list                                   # 查看所有任务
blockcell tasks show <task-id>                         # 查看任务详情
blockcell tasks cancel <task-id>                       # 取消任务（标记为 cancelled；不保证立即停止）
```

---

## `cron` — 定时任务管理

```bash
blockcell cron list                                    # 查看定时任务
blockcell cron list --all                              # 包括 disabled
blockcell cron remove <id>                             # 删除定时任务
blockcell cron pause <id>                              # 暂停
blockcell cron resume <id>                             # 恢复
blockcell cron add --name "morning" --message "早报" --every 3600
blockcell cron add --name "once" --message "提醒" --at 2026-02-26T10:00:00+08:00
blockcell cron run <id> --force                         # 立即运行（见下方限制说明）
```

限制说明：
- 当前 `cron run` 主要用于查看/演示 job 信息，未必会真正驱动 agent 执行。

---

## `channels` — 渠道管理

```bash
blockcell channels status                              # 查看各渠道状态
blockcell channels login whatsapp                      # 登录渠道（如 WhatsApp 扫码）
```

---

## `alerts` — 告警规则管理

```bash
blockcell alerts list                                  # 查看告警规则
blockcell alerts add --name "苹果跌破150" --source "finance_api:stock_quote:AAPL" --field price --operator lt --threshold 150
blockcell alerts remove <rule-id>                      # 删除告警规则（按 ID 前缀）
blockcell alerts history --limit 20                    # 触发历史
blockcell alerts evaluate                              # 手动评估一次（CLI 模式数据源有限）
```

---

## `streams` — 流订阅管理

```bash
blockcell streams list                                 # 查看活跃订阅
blockcell streams status <id>                           # 查看订阅详情
blockcell streams stop <id>                             # 停止订阅
blockcell streams unsubscribe <id>                     # 取消订阅
blockcell streams restore                               # 查看可恢复订阅
```

---

## `knowledge` — 知识图谱管理

```bash
blockcell knowledge list-graphs                         # 列出知识图谱数据库
blockcell knowledge stats --graph default               # 统计信息
blockcell knowledge search "比亚迪"                   # 搜索
blockcell knowledge export --format json --graph default
blockcell knowledge export --format mermaid --graph default --output kg.mmd
```

---

## `logs` — 日志查看

```bash
blockcell logs show                                    # 查看最近日志
blockcell logs show --filter evolution                 # 过滤进化相关日志
blockcell logs show --filter ghost                     # 过滤 Ghost Agent 日志
blockcell logs show --filter tool                      # 过滤工具调用日志
blockcell logs show -n 100                             # 查看最近 100 条
blockcell logs follow --filter evolution               # 实时跟随日志
blockcell logs clear --force                           # 清空日志
```

---

## `tools` — 工具信息

```bash
blockcell tools list                                   # 列出所有工具
blockcell tools show finance_api                       # 查看工具详情与 schema
blockcell tools test finance_api '{"symbol":"AAPL"}' # 直接调用工具（JSON 参数）
blockcell tools toggle finance_api --disable            # 禁用工具
blockcell tools toggle finance_api --enable             # 启用工具
```

---

## `config` — 配置管理

```bash
blockcell config show                                  # 打印当前配置
blockcell config schema                                # 打印配置 JSON Schema
blockcell config get agents.defaults.model              # 读取配置项
blockcell config set agents.defaults.model '"xxx"'     # 设置配置项（value 为 JSON 字面量）
blockcell config edit                                  # 用系统编辑器打开配置文件
blockcell config providers                              # 打印 provider 配置概览
blockcell config reset --force                          # 重置配置
```

---

## `upgrade` — 自动升级

```bash
blockcell upgrade --check                              # 只检查，不实际升级
blockcell upgrade check                                # 检查更新
blockcell upgrade download                             # 下载更新
blockcell upgrade apply                                # 应用更新（见下方限制说明）
blockcell upgrade rollback --to v2                      # 回滚（见下方限制说明）
blockcell upgrade status                               # 查看升级状态
```

限制说明：
- 当前 `upgrade apply` / `upgrade rollback` 在实现上仍属于占位：会输出提示但不会真正完成替换/回滚。

---

## `run` — 直接执行（绕过对话）

```bash
blockcell run msg "你好"                               # 等价于 agent 单条消息
blockcell run tool web_search '{"query":"blockcell"}'
```

---

## `completions` — 生成补全脚本

```bash
blockcell completions zsh
blockcell completions bash
```

---

## 全局选项

所有子命令均支持：

| 选项 | 说明 |
|------|------|
| `-v, --verbose` | 详细输出 |
| `-h, --help` | 显示帮助 |
| `--version` | 显示版本 |

---

*上一篇：[快速上手](./03_quickstart.md)*
*下一篇：[对话模式（Agent）](./05_agent_mode.md)*
