# 自我进化系统

> blockcell 最独特的能力：自动检测问题、重写代码、自我修复

---

## 什么是自我进化？

当一个技能（Skill）反复出错时，blockcell 不需要你手动修复——它会：

1. **自动检测**：统计技能失败次数，超过阈值即触发
2. **LLM 重写代码**：把错误日志和当前代码发给 LLM，生成修复版本
3. **安全审计**：检查新代码是否含危险操作
4. **编译验证**：Rhai 语法检查
5. **金丝雀发布**：先小流量验证，再逐步推全
6. **对比监控**：新版出错率高于旧版则立即回滚

整个流程**全自动**，无需人工干预。

---

## 触发条件

### 自动触发

```
在 [时间窗口] 内，技能执行失败次数超过 [阈值]
```

默认配置（可在 config.json 调整）：
- 时间窗口：1 小时（`timeWindowSecs: 3600`）
- 失败阈值：3 次（`errorThreshold: 3`）

### 手动触发

```bash
# 触发指定技能进化
blockcell evolve trigger stock_monitor

# 附带原因说明
blockcell evolve trigger stock_monitor --reason "增加港股支持"
```

也可以在对话中触发：

```
你: 帮我改进 stock_monitor 技能，增加对港股代码的支持

你: stock_monitor 在处理 ETF 时报错，帮我修复
```

---

## 完整进化流程

```
错误累积达阈值 / 手动触发
        ↓
【Stage 1】生成新代码
  LLM 接收：
    - 技能描述（SKILL.md）
    - 当前代码（SKILL.rhai）
    - 最近错误日志
    - 历史失败记录（重试时包含）
  LLM 输出：新版 SKILL.rhai
        ↓
【Stage 2】安全审计
  检查：危险文件操作、数据外泄风险、无限循环...
  ✗ 审计失败 → 附审计报告，最多重试 3 次
        ↓
【Stage 3】编译验证
  Rhai 语法检查
  ✗ 编译失败 → 附错误信息，最多重试 3 次
        ↓
【Stage 4】金丝雀发布
  阶段一（24h）：10% 流量走新版，90% 走旧版
  阶段二（24h）：50% / 50%
  阶段三：100% 新版上线
        ↓
【Stage 5】对比监控
  持续对比新旧版本的错误率
  新版错误率 > 旧版 → 立即自动回滚
  新版持续稳定 → 进化完成 ✅
```

---

## 进化状态机

每条 `EvolutionRecord` 的状态流转：

```
Triggered → Generating → Generated → Auditing → Audited
    → Compiling → Compiled → RollingOut → Completed
                                   ↓（出错率高）
                                 Failed（已回滚）
```

---

## 版本管理

每次进化都保留完整版本快照：

```
workspace/
├── skills/
│   └── stock_monitor/
│       └── SKILL.rhai        ← 当前运行版本
└── tool_versions/
    └── stock_monitor/
        ├── v1_20250101.rhai  ← 历史版本
        ├── v2_20250115.rhai
        └── v3_20250201.rhai  ← 上一个版本
```

### 查看进化历史

```bash
# 查看所有进化记录
blockcell evolve list

# 查看指定技能的进化历史
blockcell evolve show stock_monitor
```

示例输出：

```
stock_monitor 进化历史：

v3 (当前版本, 2025-02-01)  状态: 已全量上线
  触发原因: 港股代码解析失败
  改进内容: 修复港股代码 .HK 后缀解析，支持 HK 前缀格式
  重试次数: 1

v2 (2025-01-15)  状态: 已被替换
  触发原因: MACD 计算错误
  改进内容: 修正 MACD 指标公式中的 EMA 计算
  重试次数: 0

v1 (初始版本)  状态: 已被替换
```

### 手动回滚

```bash
blockcell evolve rollback stock_monitor --to v2
```

---

## 进化配置

```json
{
  "evolution": {
    "enabled": true,
    "errorThreshold": 3,
    "timeWindowSecs": 3600,
    "maxRetries": 3,
    "evolutionProvider": "anthropic/claude-opus-4-5",
    "canaryStages": [
      {"percentage": 10, "durationSecs": 86400},
      {"percentage": 50, "durationSecs": 86400},
      {"percentage": 100, "durationSecs": 0}
    ]
  }
}
```

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `enabled` | `true` | 是否开启自动进化 |
| `errorThreshold` | `3` | 触发阈值（错误次数） |
| `timeWindowSecs` | `3600` | 错误计数的滑动时间窗口 |
| `maxRetries` | `3` | 代码生成失败时的最大重试次数 |
| `evolutionProvider` | 同默认模型 | 进化专用模型（建议配更强的模型） |

**建议**：`evolutionProvider` 使用比日常对话模型更强的模型（如 Claude Opus 或 GPT-4o）。进化触发频率低，成本影响小，但代码质量更重要。

---

## Ghost Agent 与进化的协作

Ghost Agent 在后台持续监控技能表现：

- 发现技能有改进空间时，即使未达到自动触发阈值，也会提前标记
- 观察进化完成后的效果，确认改进是否真正有效

这形成一个**持续改进循环**：

```
执行 → 记录 → Ghost 观察 → 分析 → 进化 → 执行...
```

---

## 注意事项

**进化不中断使用**：金丝雀阶段大部分流量（90%/50%）仍走稳定的旧版本，用户无感知。

**审计是强制的**：每次进化都必须通过安全审计，LLM 无法生成绕过审计的代码。

**版本历史永久保留**：可随时回滚到任意历史版本。

**进化从失败中学习**：重试时 LLM 会看到所有之前的失败尝试，避免重复犯同样的错误。

---

## 监控进化过程

```bash
# 查看进化中的技能
blockcell evolve list --status learning

# 实时跟踪进化日志
blockcell logs --filter evolution

# 查看某技能当前运行在哪个版本
blockcell evolve show stock_monitor
```

---

*上一篇：[Gateway API 参考](./15_gateway_api.md)*
*下一篇：[二次开发指南](./17_development.md)*
