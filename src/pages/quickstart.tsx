import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Download, Rocket, Settings, Terminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Lang = 'zh' | 'en';

const copy: Record<Lang, {
  title: string;
  subtitle: string;
  pathTitle: string;
  pathIntro: string;
  steps: Array<{ title: string; description: string }>;
  installTitle: string;
  scriptTitle: string;
  scriptDesc: string;
  sourceTitle: string;
  sourcePrereqsTitle: string;
  sourcePrereqs: string[];
  dockerTitle: string;
  dockerDesc: string;
  configTitle: string;
  configIntro: string;
  configProviders: string;
  configFallback: string;
  runTitle: string;
  cliTitle: string;
  cliDesc: string;
  gatewayTitle: string;
  gatewayDesc: string;
  checksTitle: string;
  badgeScript: string;
  badgeSource: string;
  badgeDocker: string;
  badgeSetup: string;
  badgeGateway: string;
}> = {
  zh: {
    title: '5 分钟上手 blockcell',
    subtitle: '优先使用 `blockcell setup`，按最短路径完成安装、配置、首次对话和 WebUI 验证。',
    pathTitle: '最短路径',
    pathIntro: '如果你只想尽快跑通，按下面 4 步走就够了。',
    steps: [
      { title: '安装', description: '运行安装脚本，确认本机可以直接使用 blockcell 命令。' },
      { title: '配置', description: '执行 `blockcell setup`，完成 provider、模型和基础校验。' },
      { title: '对话', description: '执行 `blockcell agent`，发一句测试消息，确认 CLI 正常工作。' },
      { title: 'WebUI', description: '执行 `blockcell gateway`，浏览器打开 `http://127.0.0.1:18791`。' },
    ],
    installTitle: '安装方式',
    scriptTitle: '一键安装脚本',
    scriptDesc: '推荐先用脚本安装，再用 `blockcell --version` 验证。',
    sourceTitle: '从源码编译',
    sourcePrereqsTitle: '前置条件',
    sourcePrereqs: ['Rust 1.75+', 'macOS / Linux 推荐', '只跑 CLI 时不必先构建站点资源'],
    dockerTitle: 'Docker 运行',
    dockerDesc: '适合隔离运行或快速试验。Gateway 默认使用 `18790` API 端口和 `18791` WebUI 端口。',
    configTitle: '配置',
    configIntro: '直接使用 `blockcell setup`。它会创建 `~/.blockcell/` 并引导你完成 provider、模型和基础验证。',
    configProviders: '常见 provider 包括 `deepseek`、`openai`、`kimi`、`anthropic`、`gemini`、`zhipu`、`minimax`、`ollama`。',
    configFallback: '如果你坚持使用传统初始化方式，也可以执行 `blockcell onboard` 后手动编辑配置，但 `0.1.6` 更推荐 `setup`。',
    runTitle: '启动与验证',
    cliTitle: 'CLI 对话',
    cliDesc: '启动后你可以直接输入问题、让它搜索网页、读文件、执行工具。读取工作目录外文件时会触发确认提示。',
    gatewayTitle: 'Gateway + WebUI',
    gatewayDesc: '浏览器打开 `http://127.0.0.1:18791`。默认 API 端口是 `18790`，WebUI 端口是 `18791`。',
    checksTitle: '常用检查命令',
    badgeScript: '推荐',
    badgeSource: '可选',
    badgeDocker: '隔离运行',
    badgeSetup: '首选',
    badgeGateway: '服务化',
  },
  en: {
    title: 'Quickstart · blockcell 0.1.6',
    subtitle: 'Follow the shortest path with `blockcell setup` to install, configure, launch your first chat, and verify the WebUI.',
    pathTitle: 'Fast path',
    pathIntro: 'If you just want a clean first run, these 4 steps are enough.',
    steps: [
      { title: 'Install', description: 'Run the installer script and make sure the `blockcell` command is available locally.' },
      { title: 'Configure', description: 'Run `blockcell setup` to complete provider selection, model setup, and validation.' },
      { title: 'Chat', description: 'Run `blockcell agent` and send a test message to confirm the CLI works.' },
      { title: 'WebUI', description: 'Run `blockcell gateway`, then open `http://127.0.0.1:18791` in your browser.' },
    ],
    installTitle: 'Installation options',
    scriptTitle: 'One-line install script',
    scriptDesc: 'Recommended first step. After installation, verify with `blockcell --version`.',
    sourceTitle: 'Build from source',
    sourcePrereqsTitle: 'Prerequisites',
    sourcePrereqs: ['Rust 1.75+', 'macOS / Linux recommended', 'No need to build site assets if you only need the CLI'],
    dockerTitle: 'Run with Docker',
    dockerDesc: 'Useful for isolated runs or quick experiments. Gateway uses API port `18790` and WebUI port `18791` by default.',
    configTitle: 'Configuration',
    configIntro: 'Use `blockcell setup` directly. It creates `~/.blockcell/` and walks you through provider, model, and validation setup.',
    configProviders: 'Common providers include `deepseek`, `openai`, `kimi`, `anthropic`, `gemini`, `zhipu`, `minimax`, and `ollama`.',
    configFallback: 'If you prefer the older manual flow, run `blockcell onboard` and edit the config yourself. In `0.1.6`, `setup` is the recommended path.',
    runTitle: 'Launch and verify',
    cliTitle: 'CLI chat',
    cliDesc: 'Once started, you can ask questions, search the web, read files, and run tools. Accessing files outside the workspace triggers a confirmation prompt.',
    gatewayTitle: 'Gateway + WebUI',
    gatewayDesc: 'Open `http://127.0.0.1:18791` in your browser. The API port is `18790`; the WebUI port is `18791`.',
    checksTitle: 'Common check commands',
    badgeScript: 'Recommended',
    badgeSource: 'Optional',
    badgeDocker: 'Isolated run',
    badgeSetup: 'Preferred',
    badgeGateway: 'Service mode',
  },
};

export default function QuickstartPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const c = copy[lang];

  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-5"
            >
              <Rocket size={14} className="text-rust" />
              {lang === 'zh' ? 'Quickstart' : 'Quickstart'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-5"
            >
              {c.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
            >
              {c.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <QuickStat label={lang === 'zh' ? '最短路径' : 'Fast path'} value={lang === 'zh' ? '4 steps' : '4 steps'} />
            <QuickStat label={lang === 'zh' ? '首选命令' : 'Default path'} value="setup" />
          </div>
        </div>

        <section className="mb-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{c.pathTitle}</h2>
              <p className="text-muted-foreground">{c.pathIntro}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {c.steps.map((step, index) => (
              <StepCard
                key={step.title}
                number={`0${index + 1}`}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8">
          <div className="space-y-8">
            <section>
              <SectionTitle icon={Download} title={c.installTitle} />

              <div className="space-y-4">
                <ContentCard title={c.scriptTitle} badge={c.badgeScript}>
                  <p className="text-sm text-muted-foreground mb-4">{c.scriptDesc}</p>
                  <CodeBlock code="curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/refs/heads/main/install.sh | sh" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    {lang === 'zh' ? '如果终端找不到命令，把 `~/.local/bin` 加到 PATH：' : 'If the shell cannot find the command, add `~/.local/bin` to your `PATH`:'}
                  </p>
                  <CodeBlock code={`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

blockcell --version`} />
                </ContentCard>

                <ContentCard title={c.sourceTitle} badge={c.badgeSource}>
                  <p className="text-sm text-muted-foreground mb-4">{c.sourcePrereqsTitle}</p>
                  <ul className="space-y-2 mb-4">
                    {c.sourcePrereqs.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={16} className="mt-0.5 text-rust shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <CodeBlock code={`git clone https://github.com/blockcell-labs/blockcell.git
cd blockcell/blockcell
cargo build --release
cp target/release/blockcell ~/.local/bin/`} />
                </ContentCard>

                <ContentCard title={c.dockerTitle} badge={c.badgeDocker}>
                  <p className="text-sm text-muted-foreground mb-4">{c.dockerDesc}</p>
                  <CodeBlock code={`# Build Image
docker build -t blockcell .

# Run Interactive Agent
docker run -it \\
  -v $HOME/.blockcell:/home/blockcell/.blockcell \\
  blockcell agent

# Run Gateway
docker run -d \\
  -v $HOME/.blockcell:/home/blockcell/.blockcell \\
  -p 18790:18790 -p 18791:18791 \\
  blockcell gateway`} />
                </ContentCard>
              </div>
            </section>

            <section>
              <SectionTitle icon={Settings} title={c.configTitle} />
              <div className="space-y-4">
                <ContentCard title={lang === 'zh' ? '推荐流程' : 'Recommended flow'} badge={c.badgeSetup}>
                  <p className="text-sm text-muted-foreground mb-4">{c.configIntro}</p>
                  <CodeBlock code="blockcell setup" />
                </ContentCard>

                <ContentCard title={lang === 'zh' ? 'Provider 示例' : 'Provider example'}>
                  <p className="text-sm text-muted-foreground mb-4">{c.configProviders}</p>
                  <CodeBlock language="json" code={`{
  "providers": {
    "deepseek": {
      "apiKey": "sk-your-deepseek-key",
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
                  <p className="mt-4 text-sm text-muted-foreground">{c.configFallback}</p>
                </ContentCard>
              </div>
            </section>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
            <section>
              <SectionTitle icon={Terminal} title={c.runTitle} />
              <div className="space-y-4">
                <ContentCard title={c.cliTitle}>
                  <CodeBlock code="blockcell agent" />
                  <p className="mt-4 text-sm text-muted-foreground">{c.cliDesc}</p>
                </ContentCard>

                <ContentCard title={c.gatewayTitle} badge={c.badgeGateway}>
                  <CodeBlock code="blockcell gateway" />
                  <p className="mt-4 text-sm text-muted-foreground">{c.gatewayDesc}</p>
                </ContentCard>

                <ContentCard title={c.checksTitle}>
                  <CodeBlock code={`blockcell status
blockcell tools
blockcell skills list
blockcell doctor`} />
                </ContentCard>
              </div>
            </section>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <ArrowRight size={16} className="text-rust" />
                {lang === 'zh' ? '下一步' : 'Next step'}
              </div>
              <p className="text-sm text-muted-foreground">
                {lang === 'zh'
                  ? '跑通后直接去文档页看更完整的配置说明和各模块细节。'
                  : 'Once it works, head to the docs page for deeper configuration and module details.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-lg bg-rust/10 flex items-center justify-center text-rust">
        <Icon size={20} />
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}

function ContentCard({ title, badge, children }: { title: string; badge?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {badge ? <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-1">{badge}</span> : null}
      </div>
      {children}
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 min-h-[180px]">
      <div className="text-xs font-mono text-rust mb-3">STEP {number}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <div className="rounded-lg bg-black/50 border border-border p-4 font-mono text-sm overflow-x-auto relative">
      <div className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] bg-border text-muted-foreground uppercase">
        {language}
      </div>
      <pre className="pr-12">
        <code>{code}</code>
      </pre>
    </div>
  );
}
