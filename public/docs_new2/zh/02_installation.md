# 安装

> 支持 macOS、Linux、树莓派等 ARM 设备

---

## 方式一：下载预编译二进制（推荐）

### macOS (Apple Silicon / Intel)

```bash
# Apple Silicon (M1/M2/M3)
curl -L https://github.com/blockcell-labs/blockcell/releases/latest/download/blockcell-aarch64-apple-darwin.tar.gz | tar xz
sudo mv blockcell /usr/local/bin/

# Intel
curl -L https://github.com/blockcell-labs/blockcell/releases/latest/download/blockcell-x86_64-apple-darwin.tar.gz | tar xz
sudo mv blockcell /usr/local/bin/
```

### Linux (x86_64)

```bash
curl -L https://github.com/blockcell-labs/blockcell/releases/latest/download/blockcell-x86_64-unknown-linux-musl.tar.gz | tar xz
sudo mv blockcell /usr/local/bin/
```

### Linux (ARM64 / 树莓派)

```bash
curl -L https://github.com/blockcell-labs/blockcell/releases/latest/download/blockcell-aarch64-unknown-linux-musl.tar.gz | tar xz
sudo mv blockcell /usr/local/bin/
```

---

## 方式二：从源码编译

需要先安装 Rust 工具链（1.75+）：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

然后编译安装：

```bash
git clone https://github.com/blockcell-labs/blockcell.git
cd blockcell
cargo build --release --locked
cargo install --path bin/blockcell --force --locked
```

编译完成后，`blockcell` 会安装到 `~/.cargo/bin/`。

确保该目录在 PATH 中：

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export PATH="$HOME/.cargo/bin:$PATH"
source ~/.zshrc
```

---

## 验证安装

```bash
blockcell --version
# 输出：blockcell 0.x.x
```

---

## 系统依赖（可选）

blockcell 本身是一个单一二进制文件，无需额外依赖即可运行。

部分高级功能需要系统工具：

| 功能 | 依赖 | 安装方式 |
|------|------|---------|
| 浏览器自动化（CDP） | Chrome 或 Edge | 官网下载 |
| 视频处理 | ffmpeg | `brew install ffmpeg` |
| 语音转文字（本地） | whisper.cpp | [参考文档](https://github.com/ggerganov/whisper.cpp) |
| Office 文件生成 | Python + 相关库 | `pip install python-pptx python-docx openpyxl` |
| 图表生成 | Python + matplotlib | `pip install matplotlib plotly` |
| macOS 应用控制 | 无需安装，系统内置 | 需开启辅助功能权限 |

---

## 升级

```bash
blockcell upgrade
```

blockcell 会自动检查最新版本、下载并原子替换当前二进制文件（替换时不中断运行中的进程）。

---

## 卸载

```bash
# 删除二进制
rm $(which blockcell)

# 删除所有数据（配置、记忆、工作区）
rm -rf ~/.blockcell
```

---

*上一篇：[产品介绍](./01_introduction.md)*
*下一篇：[快速上手](./03_quickstart.md)*
