# 技能（Skill）系统

> 把复杂的多步任务封装成可复用的"工作流程"

---

## 技能 vs 工具：有什么区别？

**工具（Tool）** 是单一能力，如 `read_file`、`web_search`。一次只做一件事。

**技能（Skill）** 是编排好的工作流程，把多个工具调用组合成一个完整任务。

举个例子：

```
工具级别：
  read_file → web_search → finance_api → message
  （4 次独立调用，需要 LLM 决策每一步）

技能级别："股票监控"
  1. 获取股价（finance_api）
  2. 计算技术指标（本地计算）
  3. 判断是否触发告警（逻辑判断）
  4. 生成报告（格式化输出）
  5. 发送到 Telegram（message）
  （1 次调用，确定性执行，不依赖 LLM 每步决策）
```

技能的核心优势：
- **确定性**：固定的执行逻辑，不受 LLM 随机性影响
- **高效**：减少 LLM 调用次数，省 token
- **可复用**：一次定义，反复使用
- **可进化**：系统可以自动优化技能代码

---

## 技能的组成

每个技能是一个目录，包含：

```
skills/stock_monitor/
├── meta.yaml      ← 元数据：触发词、权限、描述
├── SKILL.md       ← LLM 操作手册（AI 阅读这个）
├── SKILL.rhai     ← 可执行编排脚本（Rhai 语言）
└── tests/         ← 测试用例（可选）
    ├── basic_test.json
    └── alert_test.json
```

### meta.yaml — 元数据

```yaml
name: stock_monitor
description: "监控股票价格和技术指标，支持 A股/港股/美股"
version: "1.0.0"
author: "blockcell"

triggers:
  - "股票"
  - "股价"
  - "监控"
  - "K线"
  - "技术指标"

permissions:
  - network
  - message

capabilities:
  - finance_api
  - alert_rule
  - message
```

`triggers` 定义了用户说哪些关键词时会激活这个技能，系统会自动将对应的 `SKILL.md` 注入到 AI 的系统提示中。

### SKILL.md — LLM 操作手册

这是给 AI 读的文档，告诉 AI：
- 这个技能能做什么
- 如何触发各功能
- 调用工具的正确顺序
- 常见场景的处理方式
- 降级和容错策略

```markdown
# 股票监控技能

## 触发场景
当用户提到股价、K线、技术指标、设置告警时激活。

## 数据源选择
- A股（6位数字）→ 东方财富 API（自动）
- 港股（5位数字或 .HK 后缀）→ 东方财富 香港
- 美股 → Alpha Vantage / Yahoo Finance

## 基本查询流程
1. finance_api stock_quote 获取实时价格
2. finance_api stock_history 获取 K 线数据
3. 本地计算 MA5/MA20/MACD/RSI
4. 格式化输出

...
```

### SKILL.rhai — 编排脚本

用 [Rhai](https://rhai.rs) 脚本语言编写的确定性工作流：

```rhai
// SKILL.rhai 示例：简单股票查询
let symbol = ctx["symbol"];
let source = if is_chinese_stock(symbol) { "eastmoney" } else { "auto" };

// 获取实时行情
let quote = call_tool("finance_api", #{
    action: "stock_quote",
    symbol: symbol,
    source: source
});

if is_error(quote) {
    // 降级：尝试备用数据源
    quote = call_tool("finance_api", #{
        action: "stock_quote",
        symbol: symbol
    });
}

// 格式化输出
let price = get_field(quote, "price");
let change = get_field(quote, "change_pct");

set_output(`${symbol} 当前价格：${price}，涨跌幅：${change}%`);
```

Rhai 脚本有对所有工具的完整访问权限，通过 `call_tool(name, params)` 调用任意工具。

---

## 内置技能列表

blockcell 内置了 40+ 技能，覆盖主要场景：

### 金融投资类

| 技能 | 功能 |
|------|------|
| `stock_monitor` | A股/港股/美股监控，技术指标，资金流向，龙虎榜 |
| `bond_monitor` | 国债收益率曲线，信用债，可转债，央行操作 |
| `futures_monitor` | 期货持仓，基差，期权波动率，股指升贴水 |
| `crypto_onchain` | 链上数据，DeFi TVL，稳定币，Gas费，巨鲸监控 |
| `macro_monitor` | GDP/CPI/PMI，央行政策，中美利差，FOMC |
| `daily_finance_report` | 金融日报/周报自动生成 |
| `portfolio_advisor` | 资产配置建议，风险分析 |
| `token_security` | 代币安全检测，rug pull 风险 |
| `whale_tracker` | 巨鲸钱包追踪 |

### 开发工具类

| 技能 | 功能 |
|------|------|
| `code_review` | 代码审查，安全检测 |
| `git_workflow` | PR 管理，Issue 跟踪 |
| `deploy_helper` | 部署流程自动化 |

### 日常效率类

| 技能 | 功能 |
|------|------|
| `camera` | 拍照 / 截图 |
| `chrome_control` | 浏览器自动化 |
| `app_control` | macOS 应用控制 |
| `email_assistant` | 邮件收发和处理 |

---

## 安装社区技能

blockcell 有一个技能市场（Blockcell Hub），可以直接从社区安装技能：

```
You: 帮我从 Hub 搜索有没有适合的天气监控技能

You: 安装 Hub 上的 weather_monitor 技能
```

AI 会调用 `community_hub` 工具完成下载和安装。安装的技能放在 `~/.blockcell/workspace/skills/` 目录下。

```bash
# 查看已安装的技能
blockcell skills list

# 查看某个技能的详情
blockcell skills show stock_monitor
```

---

## 创建自定义技能

你可以让 AI 直接帮你创建技能：

```
You: 帮我创建一个技能，每天统计我的 GitHub 仓库的 star 数量变化，并记录到工作目录的 stats.json 里
```

AI 会自动生成 `meta.yaml`、`SKILL.md`、`SKILL.rhai` 三个文件，放到 `~/.blockcell/workspace/skills/github_stats/`。

创建后，技能会自动热加载（无需重启），并在 Dashboard 实时显示。

### 手动创建技能

也可以手动创建技能目录：

```bash
mkdir -p ~/.blockcell/workspace/skills/my_skill
```

然后创建 `meta.yaml`：

```yaml
name: my_skill
description: "我的自定义技能"
version: "1.0.0"
triggers:
  - "我的技能"
  - "自定义触发词"
```

创建 `SKILL.rhai`：

```rhai
// 获取用户传入的参数
let query = ctx["query"];

// 调用工具
let result = call_tool("web_search", #{
    query: query
});

// 输出结果
set_output(result);
```

---

## 技能自动进化

这是 blockcell 最独特的特性之一。

当某个技能在执行时**反复出错**（超过配置的阈值），系统会自动触发**进化流程**：

```
用户反馈错误 / 技能执行失败
        ↓
ErrorTracker 记录错误次数
        ↓
超过阈值 → 触发进化
        ↓
LLM 分析问题，生成新版本 SKILL.rhai
        ↓
自动审计代码（安全检查）
        ↓
语法编译检查
        ↓
灰度发布：10% 流量 → 50% → 100%
        ↓
监控新版本错误率
        ↓
成功：全量上线 / 失败：自动回滚
```

你也可以手动触发进化：

```
You: 帮我改进 stock_monitor 技能，让它支持显示 MACD 指标
```

查看进化记录：

```bash
blockcell evolve list
blockcell evolve show stock_monitor
```

---

## 技能的调试和测试

### 运行测试

```bash
# 运行某个技能的所有测试
blockcell skills test stock_monitor

# 运行单个测试用例
blockcell skills test stock_monitor --case basic_query
```

### 测试用例格式

`tests/basic_query.json`：

```json
{
  "name": "basic_query",
  "input": "查询茅台股价",
  "context": {
    "symbol": "600519"
  },
  "expected_tools": ["finance_api"],
  "expected_output_contains": ["600519", "价格"]
}
```

---

## 技能权限模型

每个技能声明它需要的权限，运行时只能使用声明的工具：

```yaml
permissions:
  - network      # 允许网络请求
  - filesystem   # 允许读写文件
  - message      # 允许发消息
  - exec         # 允许执行系统命令（需谨慎）
```

未声明的权限，技能运行时会被拒绝，保证安全性。

---

*上一篇：[工具系统](./03_tools_system.md)*
*下一篇：[记忆系统](./05_memory_system.md)*
