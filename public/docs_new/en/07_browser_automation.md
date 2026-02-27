# Browser Automation

> Control real Chrome/Edge via CDP protocol to complete any browser-based task

---

## Two Browser Tool Options

blockcell provides two browser-related tools for different scenarios:

| Tool | Mode | Characteristics | Best For |
|------|------|----------------|----------|
| `browse` | **Headless** (CDP) | No window, fast, full-featured | Data scraping, form automation, testing |
| `chrome_control` | **Headed** (AppleScript) | Shows real window, visible to user | When you need to see the process, complex interactions |
| `app_control` | **macOS native** (System Events) | Controls any macOS app | Beyond browsers — any Mac app |

---

## `browse` Tool (Headless CDP Mode)

### Supported Browsers

- Google Chrome
- Microsoft Edge
- Firefox (partial)

blockcell automatically searches common system locations for installed browsers.

### Basic Usage

```
You: Open GitHub, search for "rust async", take a screenshot
```

AI calls `browse`:

```json
{
  "tool": "browse",
  "action": "navigate",
  "url": "https://github.com/search?q=rust+async",
  "browser": "chrome"
}
```

### Complete Action Reference

#### Navigation

| Action | Description |
|--------|-------------|
| `navigate` | Go to a URL |
| `back` | Go back |
| `forward` | Go forward |
| `reload` | Reload page |
| `get_url` | Get current URL |

#### Content Reading

| Action | Description |
|--------|-------------|
| `snapshot` | Get accessibility tree (compact text, token-efficient) |
| `get_content` | Get HTML converted to Markdown |
| `execute_js` | Run JavaScript and return result |

`snapshot` is the recommended way to read page content. It returns the interactive element tree and assigns reference IDs (like `@e1`, `@e2`) to each element — subsequent click operations can use these references directly.

#### Interaction

| Action | Description |
|--------|-------------|
| `click` | Click an element (reference ID or CSS selector) |
| `fill` | Fill text into an input field |
| `type_text` | Simulate character-by-character keyboard input |
| `press_key` | Press a key or shortcut (`Enter`, `Tab`, `Ctrl+A`) |
| `scroll` | Scroll page (up/down/to coordinates) |
| `wait` | Wait specified milliseconds |
| `upload_file` | Upload file to `<input type="file">` |
| `dialog_handle` | Handle alert/confirm/prompt dialogs |

#### Screenshots & Export

| Action | Description |
|--------|-------------|
| `screenshot` | Capture current page as PNG (saved to workspace) |
| `pdf` | Save page as PDF |

#### Tab Management

| Action | Description |
|--------|-------------|
| `tab_list` | List all open tabs |
| `tab_new` | Open a new tab |
| `tab_close` | Close a specific tab |
| `tab_switch` | Switch to a specific tab |

#### Cookies & Network

| Action | Description |
|--------|-------------|
| `cookies_get` | Get cookies |
| `cookies_set` | Set cookies (useful for pre-authentication) |
| `cookies_clear` | Clear cookies |
| `set_headers` | Set request headers (e.g., custom User-Agent) |
| `network_intercept` | Intercept network requests |
| `network_block` | Block specific URLs (e.g., ads) |
| `network_continue` | Allow intercepted requests through |

#### Session Management

| Action | Description |
|--------|-------------|
| `session_list` | List all active CDP sessions |
| `session_close` | Close a specific session |
| `list_browsers` | Query available browsers on the system |

---

### Practical Examples

#### Example 1: Auto-fill and Submit a Form

```
You: Log into example.com with username admin and password xxx, then download the billing page content
```

AI workflow:
1. `navigate` → go to login page
2. `snapshot` → read page structure, find username and password fields
3. `fill` → enter username
4. `fill` → enter password
5. `click` → click login button
6. `navigate` → go to billing page
7. `get_content` → fetch content as Markdown

#### Example 2: Batch Screenshots

```
You: Screenshot these three sites in sequence: github.com / openai.com / rust-lang.org, save to workspace
```

AI loops through `navigate` + `screenshot` for each.

#### Example 3: Extract Data with JavaScript

```
You: Open this product page, use JS to extract all product names and prices
```

AI uses `execute_js` to run `document.querySelectorAll('.product')` and return structured data.

#### Example 4: Monitor Price Changes

```
You: Check this product page every 30 minutes, send me a Telegram notification when price drops below $50
```

AI combines cron task + `browse` + `alert_rule`.

---

## `chrome_control` Tool (Headed AppleScript Mode)

For situations where you need to **see the automation happening**, or need to interact with a Chrome that's already logged into your Google account.

### Supported Actions

| Action | Description |
|--------|-------------|
| `open` | Launch Chrome and open a URL |
| `goto` | Navigate in the already-open Chrome |
| `type` | Type text into a specified element (CSS selector) |
| `click` | Click an element |
| `press_key` | Key press (supports Cmd+T, Cmd+L combos) |
| `read` | Read page text content |
| `screenshot` | Capture the Chrome window |
| `scroll` | Scroll |
| `execute_js` | Execute JavaScript in current tab |
| `get_url` | Get current URL |
| `tabs` | List all tabs |
| `new_tab` | Open new tab |
| `close_tab` | Close current tab |
| `find_element` | Find page elements (returns position, class, text) |

### Example

```
You: Open my Gmail in Chrome, read the latest 5 unread emails
```

```
You: In Chrome, open Notion, search for "project notes", screenshot the result
```

---

## `app_control` Tool (Any macOS App)

Controls **any macOS application**, not just browsers.

### Supported Actions

| Action | Description |
|--------|-------------|
| `activate` | Bring specified app to foreground |
| `screenshot` | Capture specified app's window |
| `type` | Type text at current focus |
| `press_key` | Simulate key press |
| `read_ui` | Read app's accessibility UI tree |
| `click_menu` | Click menu items (e.g., "File > Save") |
| `click_ui_element` | Click by accessibility path |
| `get_windows` | List app's windows |
| `list_apps` | List all running applications |
| `get_frontmost` | Get current frontmost app info |
| `wait` | Wait specified duration |

### Examples

```
You: Screenshot the Windsurf IDE window — show me what files are open
```

```
You: In Xcode, run "Product > Build"
```

```
You: What app is currently in the foreground? What windows does it have?
```

---

## FAQ

### Q: browse says Chrome not found?

Make sure Chrome is installed in the standard location (`/Applications/Google Chrome.app`). Or specify `browser: "edge"` to use Edge.

### Q: The page requires login — how to handle it?

Option 1: Use `cookies_set` to inject cookies (exported from browser DevTools).

Option 2: Have AI simulate the login process (enter username and password).

Option 3: Use `chrome_control` to control your already-logged-in Chrome.

### Q: Some sites don't work in headless mode (anti-bot)?

Switch to `chrome_control` headed mode, or use `set_headers` to set a more realistic User-Agent.

### Q: app_control fails to read UI?

You need to grant **Accessibility** permission to your terminal or blockcell in macOS:
System Settings → Privacy & Security → Accessibility → Add your terminal app.

---

*Previous: [Multi-channel Access](./06_channels.md)*
*Next: [Gateway Mode](./08_gateway_mode.md)*
