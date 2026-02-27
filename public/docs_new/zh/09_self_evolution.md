# 自我进化

> blockcell 最独特的特性：能自动发现问题、修复自己、持续改进

---

## 什么是自我进化？

普通的软件出了 bug，需要开发者手动修复、发版、更新。

blockcell 的**自我进化**系统可以：

1. **自动检测问题**：发现某个技能反复出错
2. **LLM 生成修复代码**：用 AI 写出新版本
3. **自动审计**：安全检查，防止恶意代码
4. **灰度发布**：先在小流量上测试新版本
5. **监控效果**：如果新版本更差，自动回滚
6. **全量上线**：确认改进后，替换旧版本

这个过程**完全自动**，不需要你手动干预。

---

## 进化的触发条件

### 自动触发

当某个技能满足以下条件时，自动触发进化：

```
在 [时间窗口] 内，某个技能执行失败 [次数] 超过阈值
```

默认配置（可在 config.json 调整）：
- 时间窗口：1 小时
- 失败阈值：3 次

### 手动触发

你也可以随时手动触发进化：

```
你: 帮我改进 stock_monitor 技能，让它支持显示成交量异动数据

你: stock_monitor 技能在处理港股时报错，帮我修复一下
```

或者通过 CLI：

```bash
blockcell evolve trigger stock_monitor --reason "添加成交量指标"
```

---

## 进化的完整流程

```
错误积累 / 手动触发
        ↓
【第 1 步】生成新代码
  LLM 接收：技能描述 + 当前代码 + 错误日志 + 失败历史
  LLM 输出：新版本的 SKILL.rhai
        ↓
【第 2 步】代码审计
  安全检查：是否有危险操作（删除文件、网络外发等）
  格式检查：是否符合技能规范
  ↓ 审计失败 → 附带反馈重新生成（最多 3 次重试）
        ↓
【第 3 步】编译检查
  Rhai 语法检查
  ↓ 编译失败 → 附带错误信息重新生成
        ↓
【第 4 步】灰度发布
  阶段 1：10% 流量使用新版本，90% 使用旧版本
  阶段 2（24小时后，若错误率达标）：50%
  阶段 3（再 24 小时后）：100%
        ↓
【第 5 步】监控
  持续监控新版本的错误率
  如果错误率 > 旧版本 → 立即自动回滚
  如果错误率持续良好 → 完成进化
```

### 重试机制

每个阶段失败时，系统会附上失败原因（错误信息、审计报告等）重新让 LLM 生成，最多重试 3 次。每次重试都会把之前所有失败的尝试告诉 LLM，帮助它更好地修复。

---

## 版本管理

每次进化都会保存一个版本快照：

```
workspace/
├── skills/
│   └── stock_monitor/
│       └── SKILL.rhai        ← 当前活跃版本
└── tool_versions/
    └── stock_monitor/
        ├── v1_20250101.rhai  ← 历史版本
        ├── v2_20250115.rhai
        └── v3_20250201.rhai  ← 上一个活跃版本
```

### 查看进化历史

```bash
# 列出所有进化记录
blockcell evolve list

# 查看某个技能的进化历史
blockcell evolve show stock_monitor
```

输出示例：

```
stock_monitor 进化历史：

v3 (当前, 2025-02-01)  状态: 全量上线
  触发原因: 港股数据获取失败
  改进内容: 修复港股代码解析逻辑，新增 .HK 后缀支持
  重试次数: 1

v2 (2025-01-15)  状态: 已替换
  触发原因: MACD 计算错误
  改进内容: 修正 MACD 指标计算公式
  重试次数: 0

v1 (初始版本)  状态: 已替换
```

### 手动回滚

如果新版本有问题，随时手动回滚：

```bash
blockcell evolve rollback stock_monitor --to v2
```

---

## 进化配置

在 `config.json` 中配置进化系统：

```json
{
  "evolution": {
    "enabled": true,
    "errorThreshold": 3,
    "timeWindowSecs": 3600,
    "maxRetries": 3,
    "evolutionProvider": "anthropic/claude-3-5-sonnet-20241022",
    "canaryStages": [
      {"percentage": 10, "durationSecs": 86400},
      {"percentage": 50, "durationSecs": 86400},
      {"percentage": 100, "durationSecs": 0}
    ]
  }
}
```

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `enabled` | `true` | 是否启用自动进化 |
| `errorThreshold` | `3` | 触发进化的失败次数阈值 |
| `timeWindowSecs` | `3600` | 统计错误的时间窗口（秒） |
| `maxRetries` | `3` | 代码生成失败时的最大重试次数 |
| `evolutionProvider` | 主模型 | 用于生成代码的模型，可以指定更强的模型 |

**建议**：`evolutionProvider` 可以使用比日常对话更强的模型（如 Claude 3.5 Sonnet 或 GPT-4o），因为进化不频繁，费用影响小。

---

## 查看进化状态

### CLI

```bash
# 查看当前正在进化的技能
blockcell evolve list --status learning

# 查看已完成的进化
blockcell evolve list --status learned

# 实时监控进化进度
blockcell logs --filter evolution
```

### 对话中查询

```
你: 有哪些技能在进化中？

AI: 调用 list_skills → 返回进化状态列表
```

---

## 核心进化引擎组件

理解这些组件有助于诊断问题：

| 组件 | 文件 | 职责 |
|------|------|------|
| `ErrorTracker` | `skills/service.rs` | 统计技能错误次数，触发进化 |
| `SkillEvolution` | `skills/evolution.rs` | 生成代码、运行进化流程 |
| `VersionManager` | `skills/versioning.rs` | 保存版本快照、支持回滚 |
| `EvolutionService` | `skills/service.rs` | 协调整个进化过程 |
| `RolloutStats` | `skills/service.rs` | 监控灰度阶段的错误率 |

---

## Ghost Agent 与进化的配合

blockcell 的 [Ghost Agent](./15_ghost_agent.md)（幽灵智能体）会定期审阅系统状态，包括技能的运行情况。如果它发现某个技能有改进空间，也可以主动建议或触发进化。

这形成了一个**持续改进的闭环**：
- 执行 → 记录 → 分析 → 改进 → 执行

---

## 注意事项

1. **进化不影响使用**：灰度发布期间，大部分流量（90%/50%）仍使用稳定的旧版本，用户体验不会中断。

2. **代码审计是强制的**：每次进化生成的代码都必须通过安全审计，防止 LLM 生成危险代码。

3. **回滚总是可用的**：版本历史永久保存，任何时候都可以回到之前的版本。

4. **进化记录可供学习**：AI 在生成新版本时，会阅读所有历史失败记录，避免重复犯同样的错误。

---

*上一篇：[Gateway 模式](./08_gateway_mode.md)*
*下一篇：[金融场景实战](./10_finance_use_case.md)*
