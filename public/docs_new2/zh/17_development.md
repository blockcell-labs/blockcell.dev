# 二次开发指南

> 为 blockcell 贡献工具、编写测试、参与社区

---

## 开发环境准备

### 前置依赖

```bash
# Rust 工具链（1.75+）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 验证
rustc --version
cargo --version
```

### 克隆仓库

```bash
git clone https://github.com/blockcell-labs/blockcell.git
cd blockcell
```

### 构建

```bash
# Debug 构建（快速，适合开发）
cargo build

# Release 构建（优化，适合生产）
cargo build --release --locked

# 安装到本地
cargo install --path bin/blockcell --force --locked
```

---

## 项目结构速览

```
blockcell/
├── bin/blockcell/src/commands/   # CLI 子命令实现
├── crates/
│   ├── core/                     # 核心类型（Config, Error, Paths）
│   ├── agent/                    # Agent 运行时（runtime, context, intent）
│   ├── tools/src/                # 工具实现（每个工具一个文件）
│   ├── providers/                # LLM Provider（openai, anthropic, gemini, ollama）
│   ├── skills/                   # 技能引擎（manager, engine, evolution）
│   ├── channels/                 # 消息渠道（telegram, discord, slack...）
│   ├── storage/                  # 记忆存储（SQLite + FTS5）
│   ├── scheduler/                # Cron 任务调度
│   └── updater/                  # 自动更新
└── Cargo.toml                    # Workspace 根
```

---

## 贡献一个新工具

工具是最常见的贡献类型。以下是完整步骤：

### 第一步：创建工具文件

在 `crates/tools/src/` 下创建新文件，例如 `my_tool.rs`：

```rust
use crate::lib::{Tool, ToolContext};
use anyhow::Result;
use serde_json::{json, Value};

pub struct MyTool;

impl Tool for MyTool {
    fn name(&self) -> &str {
        "my_tool"
    }

    fn description(&self) -> &str {
        "一句话描述这个工具的功能"
    }

    fn schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["do_something", "info"],
                    "description": "操作类型"
                },
                "param1": {
                    "type": "string",
                    "description": "参数说明"
                }
            },
            "required": ["action"]
        })
    }

    async fn execute(&self, params: Value, ctx: &ToolContext) -> Result<Value> {
        let action = params["action"].as_str().unwrap_or("");

        match action {
            "do_something" => {
                let param1 = params["param1"].as_str().unwrap_or("");
                // 实现逻辑...
                Ok(json!({"result": "success", "output": param1}))
            }
            "info" => {
                Ok(json!({"description": "工具信息"}))
            }
            _ => Err(anyhow::anyhow!("不支持的 action: {}", action))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_schema() {
        let tool = MyTool;
        let schema = tool.schema();
        assert!(schema["properties"]["action"].is_object());
    }

    #[tokio::test]
    async fn test_info_action() {
        let tool = MyTool;
        let ctx = ToolContext::default();
        let result = tool.execute(
            serde_json::json!({"action": "info"}),
            &ctx
        ).await.unwrap();
        assert!(result["description"].is_string());
    }
}
```

### 第二步：声明模块

在 `crates/tools/src/lib.rs` 添加：

```rust
pub mod my_tool;
```

### 第三步：注册到 ToolRegistry

在 `crates/tools/src/registry.rs` 的 `default_registry()` 函数中添加：

```rust
registry.register(Box::new(my_tool::MyTool));
```

### 第四步：注册到 Agent Runtime

在 `crates/agent/src/runtime.rs` 的子任务工具集和路径安全检查中：

```rust
// 子任务工具集（如果工具适合子任务使用）
subagent_registry.register(Box::new(blockcell_tools::my_tool::MyTool));

// 如果工具有文件路径参数，加入路径安全检查
fn extract_paths(tool_name: &str, params: &Value) -> Vec<String> {
    match tool_name {
        "my_tool" => extract_string_fields(params, &["file_path"]),
        // ...
    }
}
```

### 第五步：加入技能引擎白名单

在 `crates/skills/src/service.rs` 的 `BUILTIN_TOOLS` 列表中添加工具名称。

### 第六步：更新系统提示词（可选）

如果工具有特殊使用规范，在 `crates/agent/src/context.rs` 中添加说明。

---

## 运行测试

```bash
# 运行所有测试
cargo test

# 运行特定 crate 的测试
cargo test -p blockcell-tools

# 运行特定测试
cargo test -p blockcell-tools my_tool

# 运行时显示 println! 输出
cargo test -- --nocapture
```

---

## 代码规范

### Lint 检查

```bash
cargo clippy --all-targets --all-features
```

### 格式化

```bash
cargo fmt --all
```

### 启用 pre-push hook（可选）

```bash
# 在 .git/hooks/pre-push 中添加：
#!/bin/sh
cargo fmt --all -- --check && cargo clippy --all-targets && cargo test
```

---

## 贡献技能到 Hub

如果你编写了一个有用的 Rhai 技能，欢迎发布到 Blockcell Hub：

```bash
# 确保技能目录完整（meta.yaml + SKILL.rhai 必须有）
ls ~/.blockcell/workspace/skills/my_skill/

# 发布
blockcell hub publish ~/.blockcell/workspace/skills/my_skill
```

**发布前检查清单：**

- [ ] `meta.yaml` 填写了完整的 `name`、`description`、`triggers`
- [ ] `SKILL.md` 描述了技能的功能和使用场景
- [ ] `SKILL.rhai` 经过本地测试，功能正常
- [ ] `tests/` 目录有至少一个测试用例
- [ ] `README.md` 面向最终用户，说明了如何触发技能

---

## 提交 Pull Request

1. Fork 仓库
2. 创建功能分支：`git checkout -b feat/my-new-tool`
3. 编写代码和测试
4. 确保通过：`cargo fmt --all -- --check && cargo clippy && cargo test`
5. 提交：`git commit -m "feat(tools): add my_tool for xxx"`
6. 推送并创建 PR

**PR 描述模板：**

```markdown
## 变更说明

简述这次 PR 做了什么。

## 测试

- [ ] 新增了单元测试
- [ ] 本地 cargo test 全部通过
- [ ] 手动测试了核心功能

## 相关 Issue

Closes #xxx
```

---

## 社区资源

- **GitHub**：[github.com/blockcell-labs/blockcell](https://github.com/blockcell-labs/blockcell)
- **Issues**：报告 Bug 或提交功能建议
- **Discussions**：分享使用案例、讨论设计方向
- **Hub**：[hub.blockcell.dev](https://hub.blockcell.dev) — 社区技能市场

---

*上一篇：[自我进化系统](./16_self_evolution.md)*
*返回目录：[文档首页](./00_index.md)*
