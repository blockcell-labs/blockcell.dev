import { motion } from 'framer-motion';
import {
  ArrowRight,
  Boxes,
  Brain,
  Bot,
  CircuitBoard,
  Code2,
  Cog,
  Database,
  Files,
  GitBranch,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Lang = 'zh' | 'en';

const copy: Record<Lang, {
  overview: string;
  pillarsTitle: string;
  pillars: Array<{ title: string; desc: string; icon: typeof Bot }>;
  skillShapesTitle: string;
  skillShapesSubtitle: string;
  skillShapes: Array<{ title: string; desc: string; icon: typeof Sparkles }>;
  stackTitle: string;
  stackSubtitle: string;
  layers: Array<{ title: string; desc: string; items: string[]; icon: typeof Boxes }>;
  flowTitle: string;
  flowSubtitle: string;
  flowSteps: Array<{ title: string; desc: string }>;
  hotspotsTitle: string;
  hotspots: Array<{ title: string; desc: string; icon: typeof CircuitBoard }>;
  extensionTitle: string;
  extensionSubtitle: string;
  extensionPoints: Array<{ title: string; desc: string; icon: typeof Code2 }>;
  closing: string;
}> = {
  zh: {
    overview: 'blockcell 不是一个单点脚本，而是一套分层系统：Rust 宿主负责边界、安全和调度，Rhai 技能负责可变逻辑，SQLite 负责持久状态，渠道和 Provider 负责外部连接。',
    pillarsTitle: '先看三件事',
    pillars: [
      { title: 'Rust 宿主', desc: '把路径、权限、调度、消息流和运行边界收进可信计算基。', icon: ShieldCheck },
      { title: '多形态技能', desc: '技能不再只有一种脚本形态，而是 Prompt-only、Local Script、Hybrid、Rhai orchestration 的组合。', icon: Sparkles },
      { title: '可恢复状态', desc: '把记忆、会话、工作流和账本落到 SQLite 和文件系统。', icon: Database },
    ],
    skillShapesTitle: '技能现在长什么样',
    skillShapesSubtitle: 'Rhai 仍然存在，但它只是 skill 的一种运行形态。',
    skillShapes: [
      { title: 'Prompt-only', desc: '以 SKILL.md 为主，靠工具白名单和上下文约束完成任务。', icon: Sparkles },
      { title: 'Local Script', desc: 'SKILL.py、scripts/、bin/ 等本地脚本资产通过 exec_local 调起。', icon: Sparkles },
      { title: 'Hybrid', desc: 'Prompt 负责编排，脚本负责确定性步骤，两者组合成稳定工作流。', icon: Sparkles },
      { title: 'Rhai orchestration', desc: 'SKILL.rhai 适合强约束、多步骤、可测试的流程控制。', icon: Sparkles },
    ],
    stackTitle: '代码分层',
    stackSubtitle: '从入口到数据层，blockcell 的代码边界是清晰的。',
    layers: [
      { title: '入口层', desc: 'CLI、Gateway、HTTP API、WebUI、Channel adapter。', items: ['`bin/blockcell`', '`gateway`', '各消息渠道适配器'], icon: Bot },
      { title: '运行时层', desc: 'AgentRuntime、ContextBuilder、IntentToolResolver、TaskManager。', items: ['`crates/agent`', 'runtime pool', 'intentRouter'], icon: Workflow },
      { title: '能力层', desc: 'Tools、Skills、Providers、Scheduler。', items: ['`crates/tools`', '`crates/skills`', '`crates/providers`', '`crates/scheduler`'], icon: Cog },
      { title: '状态层', desc: 'SQLite、RabitQ、sessions、ledgers、workspace 文件。', items: ['`crates/storage`', 'memory.db', 'tasks / ledger / sessions'], icon: Files },
    ],
    flowTitle: '一条消息怎么走',
    flowSubtitle: '从消息进来，到工具执行，再到结果返回。',
    flowSteps: [
      { title: '1. 输入入口', desc: 'CLI、Webhook、WebSocket、Cron、Heartbeat 都会进入同一条消息通道。' },
      { title: '2. 路由与上下文', desc: 'RuntimePool / AgentRouter / ContextBuilder 决定该交给哪个 agent、带哪些上下文和工具。' },
      { title: '3. 任务执行', desc: 'LLM 先做意图判断，再按 JSON Schema 调用 ToolRegistry、SkillDispatcher 或 Provider。' },
      { title: '4. 状态落盘', desc: 'Memory、Session、Workflow、Ledger、任务状态会写入 SQLite 或文件系统。' },
      { title: '5. 主动反馈', desc: 'SystemEventOrchestrator 会把后台任务、Cron 事件等整理成即时通知或摘要。' },
    ],
    hotspotsTitle: '实现重点',
    hotspots: [
      { title: '多 Agent 运行时池', desc: 'default agent 用根目录，其他 agent 用独立 workspace / sessions / audit。', icon: Boxes },
      { title: 'intentRouter', desc: '把“意图 → 工具集合”从硬编码变成配置驱动。', icon: GitBranch },
      { title: 'TaskManager', desc: '后台任务状态持久化，重启后可恢复失败态，不做自动重放。', icon: Workflow },
      { title: 'SystemEventOrchestrator', desc: '把后台事件分流成即时通知或主会话摘要。', icon: Brain },
      { title: 'SQLite + RabitQ', desc: '默认走 SQLite + FTS5，需要时再叠加 RabitQ 向量层。', icon: Database },
      { title: 'Self-updater', desc: '通过 manifest、签名、原子替换和回滚完成升级。', icon: Sparkles },
    ],
    extensionTitle: '怎么扩展',
    extensionSubtitle: '页面不是为了画图，而是为了帮助你看懂哪里该改。',
    extensionPoints: [
      { title: '加工具', desc: '在 tools 注册、补 schema、接入 runtime 和 context。', icon: Code2 },
      { title: '加渠道', desc: '实现收发适配器，接入 gateway 路由和 owner 绑定。', icon: MessageSquare },
      { title: '加技能', desc: '把逻辑拆到 SKILL.rhai / SKILL.md / meta.yaml。', icon: Sparkles },
      { title: '加 Provider', desc: '实现 provider trait，并接入配置选择与模型池。', icon: Cog },
    ],
    closing: '如果你只记住一件事：blockcell 的核心不是“会聊天”，而是“有清晰边界的可进化系统”。',
  },
  en: {
    overview: 'blockcell is not a single script. It is a layered system: a Rust host owns boundaries, safety, and scheduling; Rhai skills own mutable logic; SQLite owns durable state; channels and providers own external connectivity.',
    pillarsTitle: 'Three things to notice first',
    pillars: [
      { title: 'Rust host', desc: 'Keeps paths, permissions, scheduling, message flow, and runtime boundaries inside a trusted core.', icon: ShieldCheck },
      { title: 'Multi-form skills', desc: 'Skills are no longer just one script type. They can be Prompt-only, Local Script, Hybrid, or Rhai orchestration.', icon: Sparkles },
      { title: 'Durable state', desc: 'Persists memory, sessions, workflows, and ledgers in SQLite and the filesystem.', icon: Database },
    ],
    skillShapesTitle: 'What skills look like now',
    skillShapesSubtitle: 'Rhai still exists, but it is only one skill runtime shape.',
    skillShapes: [
      { title: 'Prompt-only', desc: 'SKILL.md does the orchestration while scoped tools handle execution.', icon: Sparkles },
      { title: 'Local Script', desc: 'SKILL.py, scripts/, and bin/ assets can be invoked through exec_local.', icon: Sparkles },
      { title: 'Hybrid', desc: 'Prompt reasoning and local scripts work together as one workflow.', icon: Sparkles },
      { title: 'Rhai orchestration', desc: 'SKILL.rhai is used for strict, multi-step, testable control flow.', icon: Sparkles },
    ],
    stackTitle: 'Code layers',
    stackSubtitle: 'From entry points to storage, the boundaries are explicit.',
    layers: [
      { title: 'Entry layer', desc: 'CLI, Gateway, HTTP API, WebUI, and channel adapters.', items: ['`bin/blockcell`', '`gateway`', 'channel adapters'], icon: Bot },
      { title: 'Runtime layer', desc: 'AgentRuntime, ContextBuilder, IntentToolResolver, and TaskManager.', items: ['`crates/agent`', 'runtime pool', 'intentRouter'], icon: Workflow },
      { title: 'Capability layer', desc: 'Tools, Skills, Providers, and Scheduler.', items: ['`crates/tools`', '`crates/skills`', '`crates/providers`', '`crates/scheduler`'], icon: Cog },
      { title: 'State layer', desc: 'SQLite, RabitQ, sessions, ledgers, and workspace files.', items: ['`crates/storage`', 'memory.db', 'tasks / ledger / sessions'], icon: Files },
    ],
    flowTitle: 'How one message moves',
    flowSubtitle: 'From input to tool execution to output.',
    flowSteps: [
      { title: '1. Entry', desc: 'CLI, webhooks, WebSocket, Cron, and Heartbeat all enter the same message pipeline.' },
      { title: '2. Routing and context', desc: 'RuntimePool / AgentRouter / ContextBuilder decide which agent handles the request and which tools and context it gets.' },
      { title: '3. Execution', desc: 'The LLM does intent selection, then calls ToolRegistry, SkillDispatcher, or a Provider through JSON Schema contracts.' },
      { title: '4. Persistence', desc: 'Memory, sessions, workflows, ledgers, and task state are written to SQLite or the filesystem.' },
      { title: '5. Proactive feedback', desc: 'SystemEventOrchestrator turns background tasks and Cron events into notifications or summaries.' },
    ],
    hotspotsTitle: 'Where the interesting code lives',
    hotspots: [
      { title: 'Multi-agent runtime pool', desc: 'default agent uses the root workspace; other agents get isolated workspace / sessions / audit trees.', icon: Boxes },
      { title: 'intentRouter', desc: 'Turns intent → tool selection from hardcoded logic into config-driven routing.', icon: GitBranch },
      { title: 'TaskManager', desc: 'Persists background task state and restores failed state after restart without auto-replay.', icon: Workflow },
      { title: 'SystemEventOrchestrator', desc: 'Splits background events into immediate alerts or main-session summaries.', icon: Brain },
      { title: 'SQLite + RabitQ', desc: 'SQLite + FTS5 is the default; RabitQ is an optional vector layer.', icon: Database },
      { title: 'Self-updater', desc: 'Uses manifest, signature verification, atomic replace, and rollback for upgrades.', icon: Sparkles },
    ],
    extensionTitle: 'Where to extend',
    extensionSubtitle: 'This page should help you locate the right seam to edit.',
    extensionPoints: [
      { title: 'Add a tool', desc: 'Register it in tools, add a schema, and wire it into runtime and context.', icon: Code2 },
      { title: 'Add a channel', desc: 'Implement send/receive adapters and hook them into gateway routing and owner binding.', icon: MessageSquare },
      { title: 'Add a skill', desc: 'Split logic into SKILL.rhai / SKILL.md / meta.yaml.', icon: Sparkles },
      { title: 'Add a provider', desc: 'Implement the provider trait and wire it into config selection and model pools.', icon: Cog },
    ],
    closing: 'If you only remember one thing: blockcell is not just a chatbot. It is a system with clear boundaries that can keep evolving.',
  },
};

export default function ArchitecturePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const c = copy[lang];

  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-5"
            >
              <CircuitBoard size={14} className="text-rust" />
              {lang === 'zh' ? '代码架构' : 'Code architecture'}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-5"
            >
              {t('architecture.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
            >
              {t('architecture.subtitle')}
            </motion.p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <Brain size={20} className="text-cyber" />
              <h2 className="text-lg font-semibold">{lang === 'zh' ? '一句话读懂' : 'One-line summary'}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {c.overview}
            </p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-3">{c.pillarsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {c.pillars.map((item) => (
              <InfoCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{c.skillShapesTitle}</h2>
          <p className="text-muted-foreground mb-5">{c.skillShapesSubtitle}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {c.skillShapes.map((item) => (
              <InfoCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} compact />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{c.stackTitle}</h2>
              <p className="text-muted-foreground">{c.stackSubtitle}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {c.layers.map((layer) => (
              <LayerCard key={layer.title} layer={layer} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{c.flowTitle}</h2>
          <p className="text-muted-foreground mb-5">{c.flowSubtitle}</p>
          <div className="grid gap-4">
            {c.flowSteps.map((step, index) => (
              <FlowRow key={step.title} index={index + 1} title={step.title} desc={step.desc} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{c.hotspotsTitle}</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
            {c.hotspots.map((item) => (
              <InfoCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} compact />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{c.extensionTitle}</h2>
          <p className="text-muted-foreground mb-5">{c.extensionSubtitle}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {c.extensionPoints.map((item) => (
              <InfoCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} compact />
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <ArrowRight size={18} className="text-rust mt-1 shrink-0" />
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{c.closing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, desc, compact = false }: { icon: typeof Bot; title: string; desc: string; compact?: boolean }) {
  return (
    <div className={`rounded-xl border border-border bg-card ${compact ? 'p-5' : 'p-6'}`}>
      <div className="w-11 h-11 rounded-lg bg-rust/10 flex items-center justify-center text-rust mb-4">
        <Icon size={20} />
      </div>
      <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold mb-2`}>{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function LayerCard({ layer }: { layer: { title: string; desc: string; items: string[]; icon: typeof Boxes } }) {
  const Icon = layer.icon;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-cyber/10 flex items-center justify-center text-cyber shrink-0">
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold mb-1">{layer.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{layer.desc}</p>
          <div className="flex flex-wrap gap-2">
            {layer.items.map((item) => (
              <span key={item} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowRow({ index, title, desc }: { index: number; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-rust/10 flex items-center justify-center text-rust font-semibold shrink-0">
          {index}
        </div>
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
