# 工具系统：让 AI 真正能干活

> blockcell 内置 60+ 工具，这是 AI 与真实世界交互的核心机制

---

## 工具是什么

在 AI 智能体里，**工具（Tool）** 是 AI 可以调用的函数。

没有工具，AI 只能聊天。有了工具，AI 就能：
- 读文件 → 分析内容
- 搜网页 → 获取最新信息  
- 执行命令 → 操作系统
- 发 Telegram → 通知你

### 工具调用的完整流程

```
你说："帮我读一下 report.txt，总结一下"

  ↓ 1. 你的输入发给 LLM

  ↓ 2. LLM 决定：需要调用 read_file 工具
       生成参数：{"path": "~/Desktop/report.txt"}

  ↓ 3. blockcell 执行 read_file，读取文件内容

  ↓ 4. 文件内容返回给 LLM

  ↓ 5. LLM 根据内容生成总结

  ↓ 6. 总结显示给你
```

每个工具都有一个 **JSON Schema**，描述它接受哪些参数。LLM 根据这个 schema 生成正确的调用参数。

---

## 工具分类详解

### 📁 文件系统工具

#### `read_file` — 读取文件
支持格式：`txt` / `md` / `json` / `csv` / `xlsx` / `docx` / `pptx` / `pdf`

Excel、Word、PDF 文件会被自动转换为 Markdown 文本，方便 AI 理解。

```
你: 帮我读一下桌面上的 Q3_report.xlsx，告诉我哪个部门销售额最高
AI: 调用 read_file → 解析 Excel → 分析数据 → 回答你
```

#### `write_file` — 写入文件
创建新文件或覆盖现有文件。支持写入任何文本格式。

#### `edit_file` — 精确编辑文件
通过字符串精确匹配替换内容，适合修改代码和配置文件，不会破坏文件其余部分。

#### `list_dir` — 列出目录内容
返回文件名、大小、修改时间。支持递归列出。

#### `file_ops` — 文件操作集合
- **删除**：文件或整个目录（含递归）
- **重命名 / 移动**：支持跨设备（自动 copy + delete）
- **复制**：文件或目录
- **压缩**：zip 或 tar.gz
- **解压**：zip / tar.gz / tar
- **读取 PDF**：提取 PDF 文本内容

---

### 🌐 网络工具

#### `web_search` — 网页搜索
使用 DuckDuckGo 搜索，无需 API Key，返回标题、摘要、URL。

#### `web_fetch` — 抓取网页内容
- 自动将 HTML 转换为 **Markdown 格式**（节省约 80% token 消耗）
- 支持 Cloudflare "Markdown for Agents" 协议（如果网站支持，直接返回服务器端 Markdown）
- 三种模式：`markdown`（默认）/ `text` / `raw`

#### `http_request` — 通用 HTTP 请求
支持 GET / POST / PUT / PATCH / DELETE，自定义 Header，Bearer Token / Basic Auth，JSON / Form 请求体，文件下载。适合调用任何 REST API。

#### `browse` — 浏览器自动化（无头模式）
通过 CDP 协议控制 Chrome/Edge/Firefox，可以导航、点击、填表、截图。详见[浏览器自动化](./07_browser_automation.md)。

#### `stream_subscribe` — 实时数据流订阅
订阅 WebSocket / SSE 数据流，支持持久化重连（指数退避），可用于订阅行情数据、实时日志等。

---

### 💻 系统工具

#### `exec` — 执行终端命令
在指定目录执行 Shell 命令，返回 stdout / stderr / 退出码。

> ⚠️ 安全提示：exec 的 `working_dir` 如果在工作目录之外，会请求你确认。

#### `system_info` — 系统信息探测
返回操作系统版本、CPU / 内存信息、已安装软件（Python / Node / ffmpeg 等）、网络状态、可用能力列表。

---

### 📈 金融与区块链工具

#### `finance_api` — 股票 / 外汇 / 加密货币行情

| 功能 | 说明 |
|------|------|
| `stock_quote` | 实时股价（A股用东方财富，美股用 Alpha Vantage / Yahoo） |
| `stock_history` | K线历史数据（日 / 周 / 月） |
| `stock_search` | 按关键词搜索股票 |
| `crypto_price` | 加密货币实时价格（CoinGecko 免费） |
| `crypto_history` | 加密货币历史价格 |
| `forex_rate` | 外汇汇率 |
| `bond_yield` | 国债收益率曲线 |
| `portfolio_value` | 多资产组合估值 |

**A 股代码格式：** 直接填 6 位数字，如 `601318`（中国平安）、`600519`（贵州茅台）

#### `exchange_api` — 中心化交易所（CEX）

支持 Binance / OKX / Bybit：
- 公开数据：行情、深度、K线、资金费率
- 账户数据（需 API Key）：余额、下单、撤单、持仓

#### `blockchain_rpc` — 区块链 RPC 查询

支持以太坊 / Polygon / BSC / Arbitrum / Base 等，可查询余额、调用合约、解析事件日志、ABI 编码/解码。

#### `blockchain_tx` — 链上交易构建

构建并发送 EVM 链上交易，支持 ERC20 转账、approve、swap、多签等。

#### `contract_security` — 合约安全检测

调用 GoPlus Security API（免费，无需 Key），检测代币 rug pull 风险、合约是否开源、持仓集中度等。

---

### 💬 通信工具

#### `email` — 电子邮件

- **发送**：SMTP 协议，支持 HTML 正文、附件、CC
- **收件**：IMAP 协议，列出收件箱、读取邮件（含附件下载）、搜索

#### `notification` — 通知推送

| 渠道 | 说明 |
|------|------|
| 桌面通知 | macOS osascript 弹窗 |
| Pushover | iOS / Android 推送 |
| Bark | iOS 推送（国内常用） |
| ntfy | 开源推送服务 |
| SMS | Twilio 短信 |
| Webhook | 任意 HTTP 回调 |

#### `social_media` — 社交媒体

- **Twitter / X**：发推、发线程、删推、看时间线
- **Medium**：发布文章
- **WordPress**：创建/更新文章、上传图片

---

### 🤖 AI 增强工具

#### `image_understand` — 图片理解
将图片发给视觉模型（GPT-4o / Claude / Gemini）进行分析、描述、比较、提取文字。

#### `ocr` — 文字识别
后端：Tesseract（本地）/ macOS Vision（苹果原生）/ OpenAI Vision API。

#### `tts` — 文字转语音
后端：macOS say（本地）/ Piper（本地神经网络）/ Edge TTS（微软免费）/ OpenAI TTS API。

#### `audio_transcribe` — 语音转文字
后端：openai-whisper（本地）/ whisper.cpp（本地）/ OpenAI Whisper API。支持 mp3 / wav / m4a / mp4 等格式。

---

### 📊 数据处理工具

#### `data_process` — 结构化数据处理

- **读取 CSV**：自动类型检测
- **查询**：filter / sort / select / limit，支持 gt/lt/contains/in 等操作符
- **统计**：count / sum / avg / min / max / median / std_dev，支持 group_by
- **转换**：rename / drop / fill_null / dedup / add_column

#### `chart_generate` — 图表生成

支持 bar / line / pie / scatter / histogram / heatmap / area / box 等图表类型，后端 matplotlib（PNG/SVG）或 plotly（交互式 HTML）。

#### `office_write` — 生成 Office 文件

| 格式 | 功能 |
|------|------|
| PPTX | 多种布局（标题页/内容页/节标题/双栏），插入图片、表格 |
| DOCX | 标题层级（1-9 级）、表格、图片、分页符 |
| XLSX | 多 Sheet、表头样式、冻结行、自动筛选 |

---

### 🎬 多媒体工具

#### `video_process` — 视频处理（ffmpeg）
clip（剪辑）/ merge（合并）/ subtitle（烧录字幕）/ thumbnail（截帧）/ convert（格式转换）/ extract_audio / resize / compress / watermark / info

#### `camera` — 摄像头拍照
列出摄像头设备，拍照保存到工作目录。支持 jpg / png。

#### `app_control` — macOS 应用控制
通过 AppleScript + System Events 控制任意 macOS 应用：激活、截图、输入文字、按键、读取 UI 树、点击菜单项。

---

### 🗄️ 存储与知识工具

#### `knowledge_graph` — 本地知识图谱

基于 SQLite + FTS5 的本地知识图谱：
- 实体管理（增删改查、合并）
- 关系管理（支持双向关系）
- 路径查找（BFS 最短路径）
- 子图提取
- 导出（JSON / DOT / Mermaid）

#### `memory_query` / `memory_upsert` / `memory_forget` — 记忆管理

详见[记忆系统](./05_memory_system.md)。

---

### ⏰ 调度与自动化工具

#### `cron` — 定时任务

用自然语言描述任务，AI 自动调度：
```
你: 每天早上 8 点帮我搜索 AI 新闻，整理后发到我的 Telegram
AI: 注册一个 cron 任务，每日 08:00 自动执行
```

#### `alert_rule` — 条件告警

设置触发条件（如股价跌破阈值、指标超限），条件满足时自动执行指定操作（发通知、下单等）。

支持操作符：`gt` / `lt` / `gte` / `lte` / `eq` / `ne` / `change_pct`（涨跌幅）/ `cross_above` / `cross_below`

#### `spawn` — 启动子智能体

在后台启动一个独立的 AI 子任务，主对话可以继续。详见[子智能体](./11_subagents.md)。

---

### 🔧 专业工具

#### `git_api` — GitHub API
repo 信息、PR 管理、Issue 管理、CI/CD、Release 发布、代码搜索、Webhook 管理。

#### `cloud_api` — 云服务管理
AWS / GCP / Azure 云实例、存储桶、监控指标、费用查询。

#### `map_api` — 地图服务
谷歌地图 / 高德地图：地理编码、路线规划、附近搜索、地点详情。

#### `calendar_api` — 日历与协作
Google Calendar 事件管理、Notion 数据库操作、CRM 联系人与销售管理、Jira/Linear 工单。

#### `iot_control` — 智能家居 / IoT
Home Assistant 设备控制（开关灯、查看传感器）、MQTT 消息发布订阅。

#### `health_api` — 健康数据
Apple Health XML 解析、Fitbit API、Google Fit API。支持步数、心率、睡眠、运动记录。

#### `encrypt` — 加密与安全
AES-256-CBC 文件加密解密、密码生成（含强度分析）、文件哈希校验（SHA-256/512/MD5）、Base64/URL 编码。

#### `network_monitor` — 网络诊断
ping / traceroute / 端口扫描 / SSL 证书检查 / DNS 查询 / WHOIS / HTTP 性能测试 / 下载速测。

---

## 工具安全机制

blockcell 有一套路径安全保护：

| 场景 | 行为 |
|------|------|
| 访问 `~/.blockcell/workspace/` 内的文件 | 直接执行，无需确认 |
| 访问工作目录之外的文件 | 弹出确认提示，需要你输入 `y` |
| exec 命令的 working_dir 在外部 | 同样请求确认 |

这确保了 AI 不会在你不知情的情况下读写你的个人文件。

---

## 查看所有可用工具

```bash
blockcell tools
```

在对话中也可以：

```
You: /tools
```

---

*上一篇：[5分钟上手](./02_quickstart.md)*
*下一篇：[技能（Skill）系统](./04_skill_system.md)*
