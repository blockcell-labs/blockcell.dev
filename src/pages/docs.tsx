import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useTranslation } from 'react-i18next';

interface DocItem {
  id: string;
  title: string;
  file: string;
}

const zhDocs: DocItem[] = [
  { id: '00', title: '系列目录', file: '00_index.md' },
  { id: '01', title: '什么是 blockcell？', file: '01_what_is_blockcell.md' },
  { id: '02', title: '5分钟上手', file: '02_quickstart.md' },
  { id: '03', title: '工具系统', file: '03_tools_system.md' },
  { id: '04', title: '技能（Skill）系统', file: '04_skill_system.md' },
  { id: '05', title: '记忆系统', file: '05_memory_system.md' },
  { id: '06', title: '多渠道接入', file: '06_channels.md' },
  { id: '07', title: '浏览器自动化', file: '07_browser_automation.md' },
  { id: '08', title: 'Gateway 模式', file: '08_gateway_mode.md' },
  { id: '09', title: '自我进化', file: '09_self_evolution.md' },
  { id: '10', title: '金融场景实战', file: '10_finance_use_case.md' },
  { id: '11', title: '子智能体与任务并发', file: '11_subagents.md' },
  { id: '12', title: '架构深度解析', file: '12_architecture.md' },
  { id: '13', title: '消息处理与自进化生命周期', file: '13_message_processing_and_evolution.md' },
  { id: '14', title: '名字由来', file: '14_name_origin.md' },
  { id: '15', title: '幽灵智能体（Ghost Agent）', file: '15_ghost_agent.md' },
  { id: '16', title: 'Agent2Agent 社区（Blockcell Hub）', file: '16_hub_community.md' },
  { id: '17', title: 'CLI 参考手册', file: '17_cli_reference.md' },
  { id: '18', title: '代理与 LLM Provider 配置', file: '18_proxy_and_provider_config.md' },
  { id: '19', title: 'MCP Server 集成', file: '19_mcp_servers.md' },
  { id: '20', title: 'Provider Pool - 多模型高可用配置', file: '20_provider_pool.md' },
  { id: '21', title: 'intentRouter 多 Profile 配置指南', file: '21_intent_router_profiles.md' },
  { id: '22', title: '路径访问策略', file: '22_path_access_policy.md' },
  { id: '23', title: '微信集成指南', file: '23_weixin_integration.md' },
  { id: '24', title: '技能开发入门', file: '24_skill_beginner.md' },
  { id: '25', title: '技能开发进阶', file: '25_skill_intermediate.md' },
  { id: '26', title: '技能开发高级', file: '26_skill_advanced.md' },
];

const enDocs: DocItem[] = [
  { id: '00', title: 'Table of Contents', file: '00_index.md' },
  { id: '01', title: 'What is blockcell?', file: '01_what_is_blockcell.md' },
  { id: '02', title: '5-minute Quickstart', file: '02_quickstart.md' },
  { id: '03', title: 'Tool System', file: '03_tools_system.md' },
  { id: '04', title: 'Skill System', file: '04_skill_system.md' },
  { id: '05', title: 'Memory System', file: '05_memory_system.md' },
  { id: '06', title: 'Multi-channel Access', file: '06_channels.md' },
  { id: '07', title: 'Browser Automation', file: '07_browser_automation.md' },
  { id: '08', title: 'Gateway Mode', file: '08_gateway_mode.md' },
  { id: '09', title: 'Self-evolution', file: '09_self_evolution.md' },
  { id: '10', title: 'Finance in Practice', file: '10_finance_use_case.md' },
  { id: '11', title: 'Subagents and Task Concurrency', file: '11_subagents.md' },
  { id: '12', title: 'Architecture Deep Dive', file: '12_architecture.md' },
  { id: '13', title: 'Message Processing & Evolution Lifecycle', file: '13_message_processing_and_evolution.md' },
  { id: '14', title: 'Name Origin', file: '14_name_origin.md' },
  { id: '15', title: 'Ghost Agent', file: '15_ghost_agent.md' },
  { id: '16', title: 'Agent2Agent Community (Blockcell Hub)', file: '16_hub_community.md' },
  { id: '17', title: 'CLI Reference', file: '17_cli_reference.md' },
  { id: '18', title: 'Proxy and Provider Configuration', file: '18_proxy_and_provider_config.md' },
  { id: '19', title: 'MCP Server Integration', file: '19_mcp_servers.md' },
  { id: '20', title: 'Provider Pool - Multi-Model High Availability', file: '20_provider_pool.md' },
  { id: '21', title: 'intentRouter Multi-Profile Guide', file: '21_intent_router_profiles.md' },
  { id: '22', title: 'Path Access Policy', file: '22_path_access_policy.md' },
  { id: '23', title: 'Weixin Integration Guide', file: '23_weixin_integration.md' },
];

export default function DocsPage() {
  const { i18n } = useTranslation();
  const [selectedDoc, setSelectedDoc] = useState<string>('00');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 根据网站语言自动设置文档语言
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const docs = lang === 'zh' ? zhDocs : enDocs;
  const currentDoc = docs.find(d => d.id === selectedDoc);

  useEffect(() => {
    if (currentDoc) {
      loadDoc(currentDoc.file);
    }
  }, [currentDoc, lang]);

  const loadDoc = async (filename: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/docs/${lang}/${filename}`);
      if (response.ok) {
        const text = await response.text();
        setContent(text);
      } else {
        setContent(`# Error\n\nFailed to load document: ${filename}`);
      }
    } catch (error) {
      setContent(`# Error\n\nFailed to load document: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // 处理 Markdown 内部链接点击
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // 检查是否是内部 .md 链接
    if (href && href.endsWith('.md')) {
      e.preventDefault();
      
      // 提取文件名（去掉 ./ 前缀）
      const filename = href.replace(/^\.\//, '');
      
      // 从文件名中提取 ID（假设格式是 XX_title.md）
      const match = filename.match(/^(\d+)_/);
      if (match) {
        const docId = match[1];
        setSelectedDoc(docId);
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <BookOpen size={32} className="text-rust" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {lang === 'zh' ? '文档中心' : 'Documentation'}
            </h1>
          </motion.div>
          
          <p className="text-xl text-muted-foreground">
            {lang === 'zh' 
              ? 'blockcell 官方文档与技术文章索引，覆盖从快速上手到架构、CLI、MCP、Provider Pool 与 intentRouter 的完整主题。'
              : 'The official blockcell docs and article index, covering everything from quickstart to architecture, CLI, MCP, provider pools, and intentRouter.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                {lang === 'zh' ? '目录' : 'Contents'}
              </h3>
              <nav className="space-y-1">
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedDoc === doc.id
                        ? 'bg-rust/10 text-rust font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="text-xs opacity-60">{doc.id}</span>
                    <span className="flex-1">{doc.title}</span>
                    {selectedDoc === doc.id && <ChevronRight size={16} />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main>
            <motion.div
              key={`${lang}-${selectedDoc}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-xl p-8 md:p-12"
            >
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust"></div>
                </div>
              ) : (
                <article className="prose prose-invert prose-rust max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      a: ({ node, ...props }) => {
                        const href = props.href || '';
                        const isExternal = href.startsWith('http');
                        const isMdLink = href.endsWith('.md');
                        
                        return (
                          <a
                            {...props}
                            className="text-rust hover:text-rust-light transition-colors cursor-pointer"
                            onClick={(e) => {
                              if (isMdLink && !isExternal) {
                                handleLinkClick(e, href);
                              }
                            }}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                          />
                        );
                      },
                      code: ({ node, inline, ...props }: any) =>
                        inline ? (
                          <code className="px-1.5 py-0.5 rounded bg-muted text-rust text-sm" {...props} />
                        ) : (
                          <code className="block" {...props} />
                        ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-black/50 border border-border rounded-lg p-4 overflow-x-auto" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-border bg-muted px-4 py-2 text-left" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-border px-4 py-2" {...props} />
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </article>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
