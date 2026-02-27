# 浏览器自动化

> 用 CDP 协议控制真实的 Chrome / Edge，完成任何需要浏览器的任务

---

## 两种浏览器工具

blockcell 提供两个浏览器相关工具，适合不同场景：

| 工具 | 模式 | 特点 | 适用场景 |
|------|------|------|----------|
| `browse` | **无头模式**（CDP） | 不显示窗口，速度快，功能全 | 数据抓取、表单自动填写、自动化测试 |
| `chrome_control` | **有头模式**（AppleScript） | 显示真实窗口，用户可见 | 需要看到操作过程，复杂页面交互 |
| `app_control` | **macOS 原生**（System Events） | 控制任意 macOS 应用 | 不止浏览器，任何 Mac 应用都能控 |

---

## `browse` 工具（无头 CDP 模式）

### 支持的浏览器

- Google Chrome
- Microsoft Edge
- Firefox（部分功能）

blockcell 会自动在系统常见位置查找已安装的浏览器。

### 基本用法

```
你: 帮我打开 GitHub，搜索 "rust async"，截一张图
```

AI 调用 `browse` 工具：

```json
{
  "tool": "browse",
  "action": "navigate",
  "url": "https://github.com/search?q=rust+async",
  "browser": "chrome"
}
```

### 完整动作列表

#### 导航

| 动作 | 说明 |
|------|------|
| `navigate` | 跳转到指定 URL |
| `back` | 后退 |
| `forward` | 前进 |
| `reload` | 刷新页面 |
| `get_url` | 获取当前 URL |

#### 内容读取

| 动作 | 说明 |
|------|------|
| `snapshot` | 获取页面无障碍树（紧凑文本格式，节省 token） |
| `get_content` | 获取页面 HTML 并转换为 Markdown |
| `execute_js` | 执行 JavaScript 代码并返回结果 |

`snapshot` 是读取页面内容最推荐的方式：它返回页面的可交互元素树（类似 DOM 结构），并为每个元素分配引用编号（如 `@e1`、`@e2`），后续点击操作可以直接用引用编号。

#### 交互操作

| 动作 | 说明 |
|------|------|
| `click` | 点击元素（支持引用编号或 CSS 选择器） |
| `fill` | 在输入框中填写文字 |
| `type_text` | 模拟逐字键盘输入 |
| `press_key` | 按下快捷键（如 `Enter`、`Tab`、`Ctrl+A`） |
| `scroll` | 滚动页面（向上/向下/到坐标） |
| `wait` | 等待指定毫秒 |
| `upload_file` | 上传文件到 `<input type="file">` |
| `dialog_handle` | 处理 alert / confirm / prompt 弹窗 |

#### 截图与导出

| 动作 | 说明 |
|------|------|
| `screenshot` | 截取当前页面（PNG，保存到工作目录） |
| `pdf` | 将页面保存为 PDF |

#### 多标签管理

| 动作 | 说明 |
|------|------|
| `tab_list` | 列出所有标签页 |
| `tab_new` | 打开新标签页 |
| `tab_close` | 关闭指定标签页 |
| `tab_switch` | 切换到指定标签页 |

#### Cookie 和网络

| 动作 | 说明 |
|------|------|
| `cookies_get` | 获取 Cookie |
| `cookies_set` | 设置 Cookie（用于免登录） |
| `cookies_clear` | 清除 Cookie |
| `set_headers` | 设置请求 Header（如伪装 User-Agent） |
| `network_intercept` | 拦截网络请求 |
| `network_block` | 屏蔽特定 URL（如广告） |
| `network_continue` | 放行被拦截的请求 |

#### 会话管理

| 动作 | 说明 |
|------|------|
| `session_list` | 列出所有 CDP 会话 |
| `session_close` | 关闭指定会话 |
| `list_browsers` | 查询系统中可用的浏览器 |

---

### 实战示例

#### 示例 1：自动填写并提交表单

```
你: 帮我登录 example.com，用户名 admin，密码 xxx，然后下载账单页面的内容
```

AI 操作流程：
1. `navigate` → 打开登录页
2. `snapshot` → 读取页面结构，找到用户名和密码输入框
3. `fill` → 填写用户名
4. `fill` → 填写密码
5. `click` → 点击登录按钮
6. `navigate` → 跳转到账单页面
7. `get_content` → 获取内容并转为 Markdown

#### 示例 2：批量截图

```
你: 帮我依次截图这三个网站：github.com / openai.com / rust-lang.org，保存到工作目录
```

AI 会循环执行 `navigate` + `screenshot`。

#### 示例 3：执行 JS 获取数据

```
你: 打开这个页面，用 JS 提取所有产品的名称和价格
```

AI 会用 `execute_js` 执行 `document.querySelectorAll('.product')` 之类的代码，直接返回结构化数据。

#### 示例 4：监控价格变动

```
你: 每 30 分钟检查一次这个商品页面的价格，低于 500 元时发 Telegram 通知给我
```

AI 会设置 cron 任务 + `browse` + `alert_rule` 组合实现。

---

## `chrome_control` 工具（有头 AppleScript 模式）

适合需要**看到操作过程**的场景，或者需要与登录了 Google 账号的 Chrome 交互。

### 支持的动作

| 动作 | 说明 |
|------|------|
| `open` | 启动 Chrome 并打开 URL |
| `goto` | 在已打开的 Chrome 中跳转 |
| `type` | 在指定元素输入文字（可指定 CSS 选择器） |
| `click` | 点击元素 |
| `press_key` | 按键（支持 Cmd+T / Cmd+L 等组合键） |
| `read` | 读取页面文本内容 |
| `screenshot` | 截取 Chrome 窗口 |
| `scroll` | 滚动 |
| `execute_js` | 在当前标签页执行 JavaScript |
| `get_url` | 获取当前 URL |
| `tabs` | 列出所有标签页 |
| `new_tab` | 打开新标签 |
| `close_tab` | 关闭当前标签 |
| `find_element` | 查找页面元素（返回位置、class、文本） |

### 实战示例

```
你: 帮我在 Chrome 里打开百度，搜索"今天天气北京"，截一张图
```

```
你: 帮我在 Chrome 里打开我的 Gmail，读取最新的 5 封未读邮件
```

---

## `app_control` 工具（macOS 任意应用控制）

可以控制**任意 macOS 应用**，不限于浏览器。

### 支持的动作

| 动作 | 说明 |
|------|------|
| `activate` | 激活（前台打开）指定应用 |
| `screenshot` | 截取指定应用的窗口 |
| `type` | 在当前焦点输入文字 |
| `press_key` | 模拟按键 |
| `read_ui` | 读取应用的无障碍 UI 树 |
| `click_menu` | 点击菜单项（如 "File > Save"） |
| `click_ui_element` | 按无障碍路径点击元素 |
| `get_windows` | 列出应用的所有窗口 |
| `list_apps` | 列出所有正在运行的应用 |
| `get_frontmost` | 获取当前最前台的应用信息 |
| `wait` | 等待指定时间 |

### 实战示例

```
你: 帮我截一张 Windsurf（IDE）的窗口截图，看看当前打开了什么文件
```

```
你: 帮我在 Xcode 里执行 "Product > Build"
```

```
你: 看看我现在屏幕上最前面的是哪个应用，有什么窗口
```

---

## 常见问题

### Q：browse 提示找不到 Chrome？

确保 Chrome 已安装在标准位置（`/Applications/Google Chrome.app`）。也可以指定 `browser: "edge"` 使用 Edge。

### Q：页面有登录，怎么处理？

方案一：用 `cookies_set` 注入已有的 Cookie（从浏览器开发者工具导出）。

方案二：让 AI 模拟登录操作（输入用户名密码）。

方案三：用 `chrome_control` 控制你已登录 Google 账号的 Chrome 实例。

### Q：有些网站用无头模式打不开（反爬）？

切换到 `chrome_control` 有头模式，或者使用 `set_headers` 设置更真实的 User-Agent。

### Q：app_control 读取 UI 失败？

需要在 macOS 系统设置中给终端或 blockcell 开启**辅助功能**权限：  
系统设置 → 隐私与安全性 → 辅助功能 → 添加你的终端应用

---

*上一篇：[多渠道接入](./06_channels.md)*
*下一篇：[Gateway 模式](./08_gateway_mode.md)*
