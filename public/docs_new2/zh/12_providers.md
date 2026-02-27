# AI 模型供应商

> blockcell 支持所有主流 LLM 供应商，一键切换，无需改代码

---

## 供应商一览

| 供应商 | 模型示例 | 特点 | API Key 获取 |
|--------|---------|------|------------|
| **OpenRouter** | `anthropic/claude-sonnet-4-6`、`openai/gpt-4o` | 统一接口访问所有模型 | [openrouter.ai/keys](https://openrouter.ai/keys) |
| **DeepSeek** | `deepseek-chat`、`deepseek-reasoner` | 性价比极高，中文优化 | [platform.deepseek.com](https://platform.deepseek.com) |
| **Kimi / Moonshot** | `moonshot-v1-8k`、`moonshot-v1-32k` | 中文优化，长上下文 | [platform.moonshot.cn](https://platform.moonshot.cn) |
| **Anthropic** | `claude-opus-4-5`、`claude-sonnet-4-6` | 强推理，代码能力强 | [console.anthropic.com](https://console.anthropic.com) |
| **Google Gemini** | `gemini-2.0-flash`、`gemini-1.5-pro` | 超长上下文，多模态 | [aistudio.google.com](https://aistudio.google.com) |
| **OpenAI** | `gpt-4o`、`gpt-4o-mini` | 工具调用能力标杆 | [platform.openai.com](https://platform.openai.com) |
| **Groq** | `llama-3.3-70b-versatile` | 极速推理（本地硬件加速） | [console.groq.com](https://console.groq.com) |
| **智谱 AI** | `glm-4-plus` | 国内可用，中文优化 | [open.bigmodel.cn](https://open.bigmodel.cn) |
| **Ollama** | `llama3`、`qwen2.5`、`deepseek-r1` | 本地运行，完全离线 | 无需 Key |
| **vLLM** | 任意模型 | 自部署推理服务 | 无需 Key |

---

## 配置方式

在 `~/.blockcell/config.json` 的 `providers` 下添加对应配置：

### OpenRouter（推荐新手）

可以用一个 Key 访问几乎所有主流模型，计费按实际用量：

```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4-6"
    }
  },
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-your-key-here"
    }
  }
}
```

### DeepSeek（推荐日常使用）

价格极低（约 OpenAI 的 1/30），中英文能力均衡：

```json
{
  "agents": {
    "defaults": {
      "model": "deepseek-chat"
    }
  },
  "providers": {
    "deepseek": {
      "apiKey": "sk-your-deepseek-key"
    }
  }
}
```

### Kimi / Moonshot

```json
{
  "agents": {
    "defaults": {
      "model": "moonshot-v1-8k"
    }
  },
  "providers": {
    "kimi": {
      "apiKey": "sk-your-kimi-key"
    }
  }
}
```

### Anthropic（Claude）

原生 Anthropic API，支持多模态输入：

```json
{
  "agents": {
    "defaults": {
      "model": "claude-sonnet-4-6"
    }
  },
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-your-key"
    }
  }
}
```

### Google Gemini

```json
{
  "agents": {
    "defaults": {
      "model": "gemini-2.0-flash"
    }
  },
  "providers": {
    "gemini": {
      "apiKey": "AIza-your-key"
    }
  }
}
```

### Ollama（本地模型）

先安装 Ollama 并拉取模型：

```bash
# 安装 Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 拉取模型
ollama pull llama3
ollama pull qwen2.5:7b
ollama pull deepseek-r1:7b
```

配置 blockcell：

```json
{
  "agents": {
    "defaults": {
      "model": "ollama/llama3"
    }
  },
  "providers": {
    "ollama": {
      "apiBase": "http://localhost:11434"
    }
  }
}
```

Ollama 完全离线运行，所有数据留在本地。

### vLLM（自部署推理）

```json
{
  "agents": {
    "defaults": {
      "model": "vllm/your-model-name"
    }
  },
  "providers": {
    "vllm": {
      "apiBase": "http://your-vllm-server:8000/v1",
      "apiKey": "your-api-key"
    }
  }
}
```

---

## 同时配置多个供应商

可以配置多个供应商，blockcell 会按优先级选择有效的：

```json
{
  "providers": {
    "deepseek": { "apiKey": "sk-..." },
    "anthropic": { "apiKey": "sk-ant-..." },
    "openrouter": { "apiKey": "sk-or-v1-..." }
  }
}
```

### 运行时指定模型

```bash
# 使用不同模型处理不同任务
blockcell agent --model deepseek-chat -m "日常问答"
blockcell agent --model anthropic/claude-opus-4-5 -m "写复杂代码"
blockcell agent --model ollama/llama3 -m "离线任务"
```

### 为 Ghost Agent 配置便宜模型

Ghost Agent 任务简单，用便宜模型即可：

```json
{
  "agents": {
    "ghost": {
      "model": "deepseek-chat"
    }
  }
}
```

### 为进化配置更强模型

技能进化需要高质量代码生成，可配置更强的模型：

```json
{
  "evolution": {
    "evolutionProvider": "anthropic/claude-opus-4-5"
  }
}
```

---

## 模型名称前缀规则

blockcell 根据模型名称前缀自动路由到正确的 provider：

| 前缀 | 路由到 |
|------|--------|
| `anthropic/` 或 `claude-` | AnthropicProvider |
| `gemini/` 或 `gemini-` | GeminiProvider |
| `ollama/` | OllamaProvider |
| `kimi/` 或 `moonshot-` | OpenAI 兼容（Kimi）|
| 其他 | OpenAIProvider（openrouter / deepseek / openai 等）|

---

## 查看当前 Provider 状态

```bash
blockcell status
```

```
Active provider: deepseek

Providers:
  openrouter     ✗ no key
  anthropic      ✗ no key
  openai         ✗ no key
  deepseek       ✓ configured
  gemini         ✗ no key
  ...
```

---

*上一篇：[配置文件详解](./11_config_file.md)*
*下一篇：[安全机制](./13_security.md)*
