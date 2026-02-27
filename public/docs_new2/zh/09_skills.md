# 技能（Skill）系统

> 基于 Rhai 脚本的可编排、可进化的 AI 能力单元

---

## 工具 vs 技能

| 对比项 | 工具（Tool） | 技能（Skill） |
|--------|-------------|--------------|
| 实现语言 | Rust（编译进二进制） | Rhai 脚本（运行时加载） |
| 灵活性 | 固定功能 | 可热更新、可自定义 |
| 触发方式 | LLM 直接调用 | 自然语言描述 → AI 匹配调用 |
| 可进化 | ✗ | ✅（自动检测错误并重写） |
| 安装方式 | 内置，随版本更新 | 随时安装、社区共享 |

**简单说**：工具是原子操作（读文件、发消息），技能是工具的编排（每天早上抓数据 → 计算指标 → 生成报告 → 推送通知）。

---

## 技能文件结构

每个技能是一个目录，包含以下文件：

```
~/.blockcell/workspace/skills/stock_monitor/
├── meta.yaml       ← 元数据（名称、描述、触发词、权限）
├── SKILL.md        ← 自然语言描述（供 LLM 理解）
├── SKILL.rhai      ← 执行逻辑（Rhai 脚本）
└── tests/
    └── test_basic.rhai  ← 测试用例
```

### `meta.yaml` 示例

```yaml
name: stock_monitor
version: "1.0.0"
description: "实时股票行情监控与技术分析"
triggers:
  - "股票"
  - "行情"
  - "K线"
  - "MACD"
  - "RSI"
permissions:
  - network
  - memory
enabled: true
```

### `SKILL.md` 示例

```markdown
# stock_monitor 技能

当用户询问股票价格、技术指标、行情分析时使用本技能。

## 能力
- 获取 A股、港股、美股实时行情
- 计算 MA、MACD、RSI、布林带等技术指标
- 分析 K 线形态，判断趋势

## 使用工具
- finance_api: 行情数据获取
- memory_upsert: 保存分析结果
```

### `SKILL.rhai` 示例

```rust
// stock_monitor/SKILL.rhai
let symbol = args["symbol"];
let period = args["period"] ?? "daily";

// 获取实时行情
let quote = tool("finance_api", #{
    action: "stock_quote",
    symbol: symbol
});

// 获取历史数据计算技术指标
let history = tool("finance_api", #{
    action: "stock_history",
    symbol: symbol,
    outputsize: "60"
});

// 返回分析结果
#{
    price: quote["price"],
    change_pct: quote["change_pct"],
    signal: analyze_trend(history)
}
```

---

## 内置技能

blockcell 预装以下技能：

| 技能 | 说明 | 典型触发词 |
|------|------|----------|
| `stock_monitor` | 股票行情与技术分析 | 股票、行情、K线、MACD |
| `bond_monitor` | 债券市场监控 | 债券、国债、收益率 |
| `futures_monitor` | 期货市场数据 | 期货、持仓、基差 |
| `crypto_onchain` | 链上数据分析 | 链上、DeFi、Gas、稳定币 |
| `macro_monitor` | 宏观经济数据 | CPI、PMI、美联储、利率 |
| `daily_finance_report` | 每日金融简报 | 日报、周报、市场总结 |
| `portfolio_advisor` | 投资组合分析 | 仓位、持仓、风险分析 |

---

## 安装社区技能

### 通过对话安装

```
你: 在 Hub 上搜索一个天气监控技能

你: 安装 weather_alert 技能
```

### 通过 CLI 安装

```bash
# 搜索技能
blockcell hub search "weather"
blockcell hub search "finance" --category monitoring

# 安装技能
blockcell hub install weather_alert

# 查看已安装技能
blockcell skills list
```

安装后自动热重载，无需重启。

---

## 管理技能

```bash
blockcell skills list                    # 查看所有技能
blockcell skills list --enabled          # 只看已启用
blockcell skills show stock_monitor      # 查看技能详情
blockcell skills enable stock_monitor    # 启用
blockcell skills disable stock_monitor   # 禁用
blockcell skills test stock_monitor      # 运行测试
blockcell skills reload                  # 热重载所有技能
```

---

## 编写自定义技能

### 第一步：创建目录

```bash
mkdir -p ~/.blockcell/workspace/skills/my_skill
```

### 第二步：编写 meta.yaml

```yaml
name: my_skill
version: "1.0.0"
description: "我的自定义技能描述"
triggers:
  - "触发词1"
  - "触发词2"
permissions:
  - network
enabled: true
```

### 第三步：编写 SKILL.rhai

Rhai 脚本中可以调用任意内置工具：

```rust
// 调用工具
let result = tool("web_search", #{ query: "今日新闻" });

// 调用记忆
tool("memory_upsert", #{
    title: "重要信息",
    content: "内容...",
    type: "fact"
});

// 发送消息
tool("message", #{
    channel: "telegram",
    content: "任务完成！"
});
```

### 第四步：热重载

```bash
blockcell skills reload
```

或在对话中：

```
你: 重新加载技能
```

---

## 自我进化

技能的核心特性：**出错时自动修复**。

当一个技能在一小时内失败超过 3 次，系统自动触发进化流程：

1. LLM 分析错误日志，重写 SKILL.rhai
2. 安全审计（检查危险操作）
3. 编译验证（Rhai 语法检查）
4. 金丝雀发布（10% → 50% → 100% 流量逐步切换）
5. 监控对比（新版出错率高于旧版则自动回滚）

详见 [自我进化系统](./16_self_evolution.md)。

---

## 发布技能到 Hub

```bash
blockcell hub publish ~/.blockcell/workspace/skills/my_skill
```

---

*上一篇：[工具系统](./08_tools.md)*
*下一篇：[记忆系统](./10_memory.md)*
