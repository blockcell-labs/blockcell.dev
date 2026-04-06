import { motion } from 'framer-motion';
import { Terminal, Code, Settings, Download, Box, Cpu } from 'lucide-react';

export default function QuickstartPage() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Quickstart · blockcell 0.1.5
          </motion.h1>
          <p className="text-xl text-muted-foreground">
            参考最新版 `02_quickstart.md` 整理：优先使用 `blockcell setup`，5 分钟完成安装、配置、首次对话和 WebUI 启动。
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Cpu size={24} className="text-purple-400" />
              5 分钟最短路径
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StepCard number="01" title="安装" description="运行安装脚本，确保本机能直接使用 blockcell 命令。" />
              <StepCard number="02" title="配置" description="执行 blockcell setup，用向导完成 provider、模型和基础校验。" />
              <StepCard number="03" title="对话" description="执行 blockcell agent，发一句测试消息，确认 CLI 正常工作。" />
              <StepCard number="04" title="WebUI" description="执行 blockcell gateway，浏览器打开 http://127.0.0.1:18791。" />
            </div>
          </section>

          {/* Installation */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Download size={24} className="text-rust" /> 
              安装
            </h2>

            <div className="space-y-8">
              {/* Method 1: Script */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Terminal size={18} className="text-cyber" />
                  一键安装脚本（推荐）
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  这是当前文档推荐的最短路径。安装完成后可立即用 `blockcell --version` 验证。
                </p>
                <CodeBlock code="curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/refs/heads/main/install.sh | sh" />
                <p className="mt-4 text-sm text-muted-foreground">
                  如果终端找不到命令，把 `~/.local/bin` 加到 PATH：
                </p>
                <CodeBlock code={`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

blockcell --version`} />
              </div>

              {/* Method 2: Source */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Code size={18} className="text-orange-400" />
                  从源码编译
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground">前置条件</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                      <li>Rust 1.75+</li>
                      <li>macOS / Linux 推荐</li>
                      <li>如果只需要 CLI，不必先构建站点资源</li>
                    </ul>
                  </div>
                  <CodeBlock code={`git clone https://github.com/blockcell-labs/blockcell.git
cd blockcell/blockcell
cargo build --release
cp target/release/blockcell ~/.local/bin/`} />
                </div>
              </div>

              {/* Method 3: Docker */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Box size={18} className="text-blue-400" />
                  Docker 运行
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    适合隔离运行或快速试验。Gateway 默认使用 `18790` API 端口和 `18791` WebUI 端口。
                  </p>
                  <CodeBlock code={`# Build Image
docker build -t blockcell .

# Run Interactive Agent
docker run -it \\
  -v $HOME/.blockcell:/home/blockcell/.blockcell \\
  blockcell agent

# Run Gateway (Server)
docker run -d \\
  -v $HOME/.blockcell:/home/blockcell/.blockcell \\
  -p 18790:18790 -p 18791:18791 \\
  blockcell gateway`} />
                </div>
              </div>
            </div>
          </section>

          {/* Configuration */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Settings size={24} className="text-gray-400" /> 
              配置
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                推荐直接使用 `blockcell setup`。它会创建 `~/.blockcell/`、引导你选择 provider、配置 API Key，并自动做基础验证。
              </p>
              <CodeBlock code="blockcell setup" />
              
              <p className="text-muted-foreground">
                常见 provider 包括 `deepseek`、`openai`、`kimi`、`anthropic`、`gemini`、`zhipu`、`minimax`、`ollama`。如果你使用非交互方式，也可以这样写：
              </p>
              <CodeBlock language="json" code={`{
  "providers": {
    "deepseek": {
      "apiKey": "sk-你的DeepSeek密钥",
      "apiBase": "https://api.deepseek.com/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "deepseek-chat",
      "provider": "deepseek",
      "modelPool": [
        {
          "model": "deepseek-chat",
          "provider": "deepseek",
          "weight": 1,
          "priority": 1
        }
      ]
    }
  }
}`} />
              <p className="text-sm text-muted-foreground">
                如果你坚持使用传统初始化方式，也可以执行 `blockcell onboard` 后手动编辑配置，但 `0.1.5` 更推荐 `setup`。
              </p>
            </div>
          </section>

          {/* Running Modes */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Cpu size={24} className="text-purple-400" /> 
              启动与验证
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-4">CLI 对话</h3>
                <CodeBlock code="blockcell agent" />
                <p className="mt-4 text-sm text-muted-foreground">
                  启动后你可以直接输入问题、让它搜索网页、读文件、执行工具。读取工作目录外文件时会触发确认提示。
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-4">Gateway + WebUI</h3>
                <CodeBlock code="blockcell gateway" />
                <p className="mt-4 text-sm text-muted-foreground">
                  浏览器打开 `http://127.0.0.1:18791`。默认 API 端口是 `18790`，WebUI 端口是 `18791`。
                </p>
              </div>
            </div>

            <div className="mt-6 bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-4">常用检查命令</h3>
              <CodeBlock code={`blockcell status
blockcell tools
blockcell skills list
blockcell doctor`} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
 }

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="text-xs font-mono text-rust mb-3">STEP {number}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

 function CodeBlock({ code, language = 'bash' }: { code: string, language?: string }) {
  return (
    <div className="rounded-lg bg-black/50 border border-border p-4 font-mono text-sm overflow-x-auto relative group">
      <div className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] bg-border text-muted-foreground uppercase">
        {language}
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
