import { motion } from 'framer-motion';
import { Terminal, Code, Settings, Download, Box, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DocsPage() {
  const { t } = useTranslation();
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t('docs.title')}
          </motion.h1>
          <p className="text-xl text-muted-foreground">
            {t('docs.subtitle')}
          </p>
        </div>

        <div className="space-y-16">
          {/* Installation */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Download size={24} className="text-rust" /> 
              {t('docs.install.title')}
            </h2>

            <div className="space-y-8">
              {/* Method 1: Script */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Terminal size={18} className="text-cyber" />
                  {t('docs.install.script.title')}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {t('docs.install.script.desc')}
                </p>
                <CodeBlock code="curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/main/blockcell/install.sh | sh" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {t('docs.install.script.custom')}
                </p>
                <CodeBlock code={`BLOCKCELL_INSTALL_DIR="$HOME/bin" \\
  curl -fsSL https://raw.githubusercontent.com/blockcell-labs/blockcell/main/blockcell/install.sh | sh`} />
              </div>

              {/* Method 2: Source */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Code size={18} className="text-orange-400" />
                  {t('docs.install.source.title')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground">{t('docs.install.source.prereqs')}</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                      <li>Rust 1.75+</li>
                      <li>Node.js 20+ (for WebUI)</li>
                      <li>Optional: Python 3 + matplotlib (for charts)</li>
                    </ul>
                  </div>
                  <CodeBlock code={`# Clone repository
git clone https://github.com/blockcell-labs/blockcell.git
cd blockcell

# Build WebUI
cd webui && npm install && npm run build && cd ..

# Build Binary
cargo build --release`} />
                </div>
              </div>

              {/* Method 3: Docker */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Box size={18} className="text-blue-400" />
                  {t('docs.install.docker.title')}
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('docs.install.docker.desc')}
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
              {t('docs.config.title')}
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                {t('docs.config.init')}
              </p>
              <CodeBlock code="blockcell onboard" />
              
              <p className="text-muted-foreground">
                {t('docs.config.edit')}
              </p>
              <CodeBlock language="json" code={`{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-...",
      "apiBase": "https://openrouter.ai/api/v1"
    },
    "openai": {
      "apiKey": "sk-..."
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4-20250514"
    }
  }
}`} />
            </div>
          </section>

          {/* Running Modes */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Cpu size={24} className="text-purple-400" /> 
              {t('docs.running.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-4">{t('docs.running.interactive.title')}</h3>
                <CodeBlock code="blockcell agent" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {t('docs.running.interactive.desc')}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-4">{t('docs.running.gateway.title')}</h3>
                <CodeBlock code="blockcell gateway" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {t('docs.running.gateway.desc')}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
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
