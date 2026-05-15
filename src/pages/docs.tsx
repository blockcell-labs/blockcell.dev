import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useTranslation } from 'react-i18next';
import { getAllDocItems, getDocSections, resolveDocFile, resolveDocTitle, type DocLocale } from './docs-data';

const DOCS_PREFIX = '/docs';

function getDocRouteFromPath(pathname: string) {
  if (!pathname.startsWith(DOCS_PREFIX)) return '';
  const rest = pathname.slice(DOCS_PREFIX.length).replace(/^\/+/, '');
  return rest.replace(/\/+$/, '');
}

function normalizeLinkPath(path: string) {
  const parts: string[] = [];
  path.split('/').forEach((part) => {
    if (!part || part === '.') return;
    if (part === '..') {
      parts.pop();
    } else {
      parts.push(part);
    }
  });
  return parts.join('/');
}

function getParentRoute(routePath: string) {
  if (!routePath) return '';
  const parts = routePath.split('/');
  if (parts.length <= 1) return '';
  return parts.slice(0, -1).join('/');
}

export default function DocsPage() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = (i18n.language.startsWith('zh') ? 'zh' : 'en') as DocLocale;
  const sections = getDocSections(lang);
  const routePath = getDocRouteFromPath(location.pathname);
  const fileName = routePath ? resolveDocFile(lang, routePath) : null;
  const title = routePath ? resolveDocTitle(lang, routePath) : null;
  const isIndex = !routePath;
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const currentLink = routePath ? `${window.location.origin}/docs/${routePath}` : `${window.location.origin}/docs`;

  useEffect(() => {
    let cancelled = false;

    const loadDoc = async () => {
      if (!fileName) {
        setContent('');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/docs/${lang}/${fileName}`);
        if (!cancelled) {
          if (response.ok) {
            setContent(await response.text());
          } else {
            setContent(`# Error\n\nFailed to load document: ${fileName}`);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setContent(`# Error\n\nFailed to load document: ${error}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDoc();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      cancelled = true;
    };
  }, [fileName, lang]);

  const goToDoc = (route: string) => navigate(`/docs/${route}`);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href || !href.endsWith('.md')) return;
    e.preventDefault();

    const currentDir = getParentRoute(routePath);
    const rawPath = href.startsWith('./') || href.startsWith('../')
      ? normalizeLinkPath(`${currentDir}/${href}`)
      : normalizeLinkPath(href);
    const route = rawPath.replace(/\.md$/, '');
    const target = getAllDocItems().find((doc) => doc.route === route || `${doc.route}.md` === rawPath);
    if (target) {
      navigate(`/docs/${target.route}`);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(currentLink);
  };

  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <BookOpen size={32} className="text-rust" />
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold">
                {isIndex ? (lang === 'zh' ? '文档中心' : 'Documentation') : (title ?? (lang === 'zh' ? '文档' : 'Document'))}
              </h1>
              {routePath && (
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Copy size={14} />
                  {lang === 'zh' ? '复制链接' : 'Copy link'}
                </button>
              )}
            </div>
          </motion.div>

          <p className="text-xl text-muted-foreground">
            {isIndex
              ? (lang === 'zh'
                ? 'blockcell 官方文档与技术文章索引，支持按路由直达单篇文档。'
                : 'The official blockcell docs and article index, with deep links for every document.')
              : (lang === 'zh'
                ? '当前页面就是该 Markdown 文档的可分享路由版本。'
                : 'This page is the shareable routed version of the Markdown document.')}
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                {lang === 'zh' ? '目录' : 'Contents'}
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <div key={section.title} className="pb-3 last:pb-0">
                    <h4 className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 first:pt-0">
                      {section.title}
                    </h4>
                    <div className="space-y-1">
                      {section.items.map((doc) => (
                        <button
                          key={doc.route}
                          onClick={() => goToDoc(doc.route)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                            routePath === doc.route
                              ? 'bg-rust/10 text-rust font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <span className="text-xs opacity-60">{doc.id}</span>
                          <span className="flex-1">{doc.title}</span>
                          {routePath === doc.route && <ChevronRight size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <main>
            <motion.div
              key={`${lang}-${routePath || 'index'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-xl p-8 md:p-12"
            >
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust"></div>
                </div>
              ) : isIndex ? (
                <article className="prose prose-invert prose-rust max-w-none">
                  <h2>{lang === 'zh' ? '可分享路由' : 'Shareable routes'}</h2>
                  <p>
                    {lang === 'zh'
                      ? '示例：`/docs/06_channels`、`/docs/17_cli_reference`、`/docs/channels/01_telegram`。'
                      : 'Examples: `/docs/06_channels`, `/docs/17_cli_reference`, `/docs/channels/01_telegram`.'}
                  </p>
                </article>
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
