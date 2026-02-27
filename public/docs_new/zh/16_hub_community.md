# Blockcell Hub 社区

> 技能市场 + Agent2Agent 协作平台

---

## 什么是 Blockcell Hub？

Blockcell Hub 是 blockcell 生态的**社区中心**，提供两大核心功能：

1. **技能市场**：发现、安装、分享社区创建的技能
2. **Agent2Agent（A2A）**：未来的多智能体协作平台

Hub 的目标是让 blockcell 的能力不局限于官方内置的工具和技能，而是由整个社区共同扩展。

---

## 技能市场

### 浏览和搜索技能

Hub 上汇聚了社区贡献的各类技能，涵盖：

- **生产力工具**：日程管理、邮件助手、文档整理
- **金融投资**：各类行情监控、量化策略原型
- **开发工具**：代码审查、自动部署、测试助手
- **生活服务**：天气提醒、购物助手、健康追踪
- **创意工具**：内容生成、图片描述、社交媒体管理

### 安装技能

在对话中直接安装：

```
你: 帮我搜索 Hub 上有没有适合的天气监控技能

你: 安装 Hub 上的 weather_alert 技能
```

AI 会调用 `community_hub` 工具完成搜索和安装：
1. 从 Hub 下载技能压缩包（zip）
2. 解压到 `~/.blockcell/workspace/skills/技能名/`
3. 自动热加载，无需重启

或者通过 CLI：

```bash
# 搜索技能
blockcell hub search "天气"
blockcell hub search "finance" --category trading

# 安装技能
blockcell hub install weather_alert

# 查看已安装的技能
blockcell skills list

# 卸载技能
blockcell hub uninstall weather_alert
```

### 发布你的技能

如果你创建了一个好用的技能，可以分享给社区：

**第一步**：确保你的技能目录结构完整

```
my_skill/
├── meta.yaml      ← 必须
├── SKILL.md       ← 推荐
├── SKILL.rhai     ← 必须（如果有编排逻辑）
└── README.md      ← 推荐（给其他用户看的说明）
```

**第二步**：发布到 Hub

```bash
# 打包并发布
blockcell hub publish ~/.blockcell/workspace/skills/my_skill
```

或者通过对话：

```
你: 帮我把工作目录里的 my_skill 技能发布到 Hub，
   描述：一个监控 GitHub Star 数量的技能
   标签：github, monitoring, developer
```

---

## Hub API 接口

Hub 提供了标准的 REST API，也可以通过程序集成：

```bash
# 列出所有技能
GET https://hub.blockcell.dev/v1/skills

# 搜索技能
GET https://hub.blockcell.dev/v1/skills?q=weather&category=monitoring

# 获取技能详情
GET https://hub.blockcell.dev/v1/skills/weather_alert

# 下载技能包
GET https://hub.blockcell.dev/v1/skills/weather_alert/download
```

---

## Agent2Agent（A2A）协作

> 🚧 A2A 功能目前处于规划/早期阶段，以下是设计愿景。

### 愿景：AI 之间的协作

想象这样的场景：

```
你的 blockcell（主节点）
    ↓
"我需要帮用户做一个复杂的量化分析，
  需要专业的期权定价模型"
    ↓
在 Hub 上发现了另一个专门做期权分析的 blockcell 节点
    ↓
两个 AI 协作完成任务：
  - 你的 AI 负责数据获取和结果呈现
  - 对方的 AI 提供专业的期权定价计算
    ↓
用户得到了超出单个 AI 能力边界的结果
```

这就是 Agent2Agent 的愿景：**AI 节点组成网络，相互发现、相互协作**。

### 当前阶段

目前，blockcell 已经有了基础的子智能体（spawn）功能，可以在同一台机器上并行运行多个 AI 实例。真正的 A2A 跨节点协作是下一步的目标。

---

## 参与社区

### GitHub

项目主页：[https://github.com/blockcell-labs/blockcell](https://github.com/blockcell-labs/blockcell)

- **提交 Issue**：报告 bug 或提出功能建议
- **提交 PR**：贡献代码、工具、文档
- **参与讨论**：在 Discussions 分享使用经验

### 贡献新工具

如果你想为 blockcell 贡献内置工具，基本流程是：

1. Fork 仓库
2. 在 `crates/tools/src/` 下创建新的工具文件
3. 在 `registry.rs`、`runtime.rs`、`service.rs`、`context.rs` 中注册
4. 编写单元测试
5. 提交 PR

每个工具文件的基本结构：

```rust
pub struct MyTool;

impl Tool for MyTool {
    fn name(&self) -> &str { "my_tool" }
    
    fn schema(&self) -> serde_json::Value {
        // 返回 JSON Schema
    }
    
    async fn execute(
        &self, 
        params: serde_json::Value, 
        ctx: &ToolContext
    ) -> Result<serde_json::Value> {
        // 实现工具逻辑
    }
}
```

---

## Hub 路线图

| 阶段 | 功能 | 状态 |
|------|------|------|
| ✅ Phase 1 | 技能上传/下载 | 已完成 |
| ✅ Phase 2 | 技能搜索和分类 | 已完成 |
| 🚧 Phase 3 | 技能评分和评论 | 规划中 |
| 🚧 Phase 4 | Agent2Agent 协议 | 规划中 |
| 🔮 Phase 5 | 技能自动推荐 | 远期目标 |
| 🔮 Phase 6 | 跨节点任务调度 | 远期目标 |

---

## 小结

Blockcell Hub 是让 blockcell 从一个个人工具成长为**生态系统**的关键。

当社区里有越来越多的技能和工具，每个 blockcell 用户都能站在前人的肩膀上，快速获得强大的 AI 能力——而不需要每个人都从头开始。

---

*上一篇：[幽灵智能体（Ghost Agent）](./15_ghost_agent.md)*
*返回目录：[文档中心](./00_index.md)*

*项目地址：https://github.com/blockcell-labs/blockcell*
*官网：https://blockcell.dev*
