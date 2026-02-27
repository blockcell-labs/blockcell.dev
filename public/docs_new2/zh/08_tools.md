# 工具系统

> blockcell 内置 60+ 工具，覆盖文件、网络、金融、通信、媒体、系统等各类场景

---

## 工具是什么？

工具（Tool）是 blockcell 的「执行手臂」。当你向 AI 提出需求时，AI 会自动判断需要调用哪些工具、以什么参数调用，然后将结果整合成最终回复。

整个过程对你完全透明：每次工具调用的名称、参数、执行结果都会在对话中展示。

---

## 工具分类

### 文件与代码

| 工具 | 说明 |
|------|------|
| `read_file` | 读取文件内容 |
| `write_file` | 创建或覆盖文件 |
| `edit_file` | 精确文本替换（避免覆盖整个文件） |
| `list_dir` | 列出目录内容 |
| `file_ops` | 批量文件操作（复制、移动、删除、解压） |
| `exec` | 执行 Shell 命令 |

### 网络与搜索

| 工具 | 说明 |
|------|------|
| `web_search` | 网页搜索（Google / Bing） |
| `web_fetch` | 抓取网页并转换为 Markdown |
| `http_request` | 发送 HTTP 请求（GET/POST/PUT/DELETE） |
| `html_to_md` | 将 HTML 转换为 Markdown |
| `stream_subscribe` | 订阅 WebSocket / SSE 实时数据流 |

### 浏览器自动化

| 工具 | 说明 |
|------|------|
| `browse` | CDP 无头浏览器（导航、点击、填表、截图、JS 执行） |
| `chrome_control` | AppleScript 控制已打开的 Chrome（有界面） |
| `app_control` | 控制任意 macOS 应用（辅助功能 API） |

### 金融数据

| 工具 | 说明 |
|------|------|
| `finance_api` | 股票/基金/加密货币/外汇行情、历史K线、市场概览 |
| `exchange_api` | CEX 交易所 API（Binance / OKX 等账户数据） |
| `alert_rule` | 创建/管理价格告警规则 |
| `stream_subscribe` | 订阅实时行情 WebSocket 流 |

### 区块链

| 工具 | 说明 |
|------|------|
| `blockchain_rpc` | 以太坊 / 多链 JSON-RPC 查询（余额、合约调用、日志） |
| `blockchain_tx` | 构建和广播交易 |
| `contract_security` | 合约安全扫描（GoPlus API） |
| `bridge_api` | 跨链桥 API 查询 |
| `nft_market` | NFT 市场数据（OpenSea / Blur） |
| `multisig` | 多签钱包操作 |

### 通信与消息

| 工具 | 说明 |
|------|------|
| `message` | 通过已配置渠道发送消息（Telegram / Slack 等） |
| `email` | 发送/读取邮件（SMTP / IMAP） |
| `notification` | 系统通知、桌面推送 |
| `social_media` | 社交媒体 API（发帖、读取时间线） |

### 数据处理与可视化

| 工具 | 说明 |
|------|------|
| `data_process` | CSV/JSON 数据清洗、统计、透视表、正则提取 |
| `chart_generate` | 生成图表（matplotlib / plotly：折线、柱状、饼图等） |
| `office_write` | 生成 PPTX / DOCX / XLSX 文件 |
| `office` | 读取 Office 文件内容 |

### 媒体处理

| 工具 | 说明 |
|------|------|
| `audio_transcribe` | 语音转文字（Whisper / OpenAI API） |
| `tts` | 文字转语音 |
| `ocr` | 图片文字识别 |
| `image_understand` | 图片内容理解（调用多模态模型） |
| `video_process` | 视频剪辑、合并、添加字幕、生成缩略图（ffmpeg） |
| `camera` | 调用摄像头拍照 |

### 系统与设备

| 工具 | 说明 |
|------|------|
| `system_info` | 获取 CPU/内存/磁盘/网络信息 |
| `termux_api` | Android Termux 设备 API（定位、短信、相机等） |
| `iot_control` | IoT 设备控制（智能家居、传感器） |
| `network_monitor` | 网络监控（端口扫描、延迟、DNS） |

### 开发运维

| 工具 | 说明 |
|------|------|
| `git_api` | GitHub API（PR、Issue、代码搜索、Actions） |
| `cloud_api` | AWS / GCP / Azure 云资源管理 |
| `encrypt` | 加解密（AES、RSA、哈希） |

### 健康与生活

| 工具 | 说明 |
|------|------|
| `health_api` | Apple Health / Fitbit / Google Fit 数据读取 |
| `calendar_api` | 日历事件管理 |
| `map_api` | 地图、地理编码、路线规划 |
| `contacts` | 联系人管理 |

### 记忆与知识

| 工具 | 说明 |
|------|------|
| `memory_upsert` | 保存或更新一条记忆 |
| `memory_query` | 语义搜索记忆 |
| `memory_forget` | 删除记忆 |
| `memory_maintenance` | 记忆批量清理与整理 |
| `knowledge_graph` | 知识图谱（实体关系存储与查询） |

### 任务管理

| 工具 | 说明 |
|------|------|
| `spawn` | 启动后台子智能体（并发执行独立任务） |
| `list_tasks` | 查看当前后台任务状态 |
| `cron` | 创建/管理定时任务 |
| `alert_rule` | 创建条件触发规则 |

### 技能管理

| 工具 | 说明 |
|------|------|
| `skills` | 技能的启用/禁用/热重载 |
| `community_hub` | 从 Hub 搜索和安装社区技能 |
| `toggle_manage` | 功能开关管理 |

---

## 意图驱动的工具加载

blockcell 不会把所有 60+ 工具的完整 Schema 都塞进 LLM 的 System Prompt（那会消耗大量 Token）。

系统内置**意图分类器**，根据你的消息自动判断意图类别（如 Finance、WebSearch、Media 等），然后只注入对应类别的工具：

| 意图 | 注入工具集示例 |
|------|-------------|
| `Chat` | 无工具（纯对话） |
| `Finance` | finance_api, exchange_api, alert_rule, stream_subscribe... |
| `FileOps` | read_file, write_file, edit_file, list_dir, exec... |
| `Media` | audio_transcribe, tts, ocr, video_process... |
| `DevOps` | git_api, cloud_api, network_monitor... |

13 个**核心工具**（如 `read_file`、`web_search`、`memory_query`）在所有意图下都注入完整 Schema，其余工具只注入轻量描述，需要时再按需升级。

---

## 查看所有工具

```bash
# 列出所有工具
blockcell tools list

# 查看某工具的详细 Schema
blockcell tools show finance_api
```

---

## 工具安全机制

- **路径沙箱**：文件类工具默认只能操作 `~/.blockcell/workspace/` 内的路径，访问外部路径需用户手动确认
- **子智能体限制**：后台子任务使用受限工具集（不能 spawn 新子任务，防止无限嵌套）
- **操作可见**：每次工具调用的参数和结果都在对话中展示，无隐藏操作

---

*上一篇：[渠道接入](./07_channels.md)*
*下一篇：[技能（Skill）系统](./09_skills.md)*
