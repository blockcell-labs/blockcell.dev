import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Cpu, Network, Shield, Activity, GitMerge, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BlockcellLogo } from '@/components/ui/blockcell-logo';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat blur-none scale-100 opacity-100"
  style={{
    backgroundImage: "url('/story-bg.jpg')",
    backgroundPosition: "calc(50% + 100px) calc(50% - 300px)",
  }}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] bg-rust/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] bg-cyber/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-cyber/20 blur-xl rounded-full" />
            <BlockcellLogo size="xl" className="relative z-10" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] line-height-[1.1]"
          >
            {t('home.hero.title_prefix')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rust via-rust-light to-cyber">
              {t('home.hero.title_suffix')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            {t('home.hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/docs"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-rust hover:bg-rust-light text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-rust/25"
            >
              {t('home.hero.get_started')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/architecture"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-border bg-card/50 hover:bg-card text-foreground font-semibold transition-all hover:border-rust/50"
            >
              {t('home.hero.view_arch')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Value Props */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={Zap}
              title={t('home.value_props.evolution.title')}
              description={t('home.value_props.evolution.desc')}
            />
            <FeatureCard
              icon={Cpu}
              title={t('home.value_props.host_skills.title')}
              description={t('home.value_props.host_skills.desc')}
            />
            <FeatureCard
              icon={Network}
              title={t('home.value_props.gateway.title')}
              description={t('home.value_props.gateway.desc')}
            />
          </div>
        </div>
      </section>

      {/* How It Works Diagram (Redesigned) */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rust/5 to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.process.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.process.subtitle')}
            </p>
          </div>

          {/* Flowchart Container */}
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <FlowStep 
                icon={MessageSquare}
                title={t('home.process.steps.trigger.title')}
                description={t('home.process.steps.trigger.desc')}
                color="text-blue-400"
              />
              <FlowStep 
                icon={Activity}
                title={t('home.process.steps.execute.title')}
                description={t('home.process.steps.execute.desc')}
                color="text-rust"
              />
              <FlowStep 
                icon={Shield}
                title={t('home.process.steps.feedback.title')}
                description={t('home.process.steps.feedback.desc')}
                color="text-yellow-400"
              />
              <FlowStep 
                icon={GitMerge}
                title={t('home.process.steps.evolve.title')}
                description={t('home.process.steps.evolve.desc')}
                color="text-cyber"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Preview */}
      <section className="py-24 bg-card border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t('home.terminal.title')} <br />
              <span className="text-rust">{t('home.terminal.subtitle')}</span>
            </h2>
            <div className="space-y-6">
              <ListItem title={t('home.terminal.features.browser.title')} text={t('home.terminal.features.browser.desc')} />
              <ListItem title={t('home.terminal.features.memory.title')} text={t('home.terminal.features.memory.desc')} />
              <ListItem title={t('home.terminal.features.subagents.title')} text={t('home.terminal.features.subagents.desc')} />
              <ListItem title={t('home.terminal.features.safety.title')} text={t('home.terminal.features.safety.desc')} />
            </div>
            <Link to="/features" className="inline-flex items-center text-cyber hover:text-cyber/80 font-medium transition-colors group">
              {t('home.terminal.explore')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <div className="rounded-xl border border-border bg-[#0f172a] shadow-2xl overflow-hidden font-mono text-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-2 text-xs text-muted-foreground">blockcell — agent</span>
              </div>
              <div className="p-6 space-y-2 text-slate-300">
                <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> blockcell onboard</p>
                <p className="text-muted-foreground">Initializing workspace at ~/.blockcell...</p>
                <p className="text-green-400">✔ Config created</p>
                <p className="text-green-400">✔ Workspace ready</p>
                <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> blockcell skills install stock_monitor</p>
                <p className="text-muted-foreground">Downloading stock_monitor from hub...</p>
                <p className="text-green-400">✔ Skill 'stock_monitor' v1.2.0 installed</p>
                <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> blockcell agent</p>
                <p className="text-rust">blockcell v0.1.0</p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-background/75 border border-border hover:border-rust/50 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-rust/10 flex items-center justify-center mb-6 text-rust group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function FlowStep({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 flex flex-col items-center text-center p-6 bg-card/85 border border-border rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 min-h-[220px]"
    >
      <div className={`w-16 h-16 rounded-full bg-background border-4 border-card flex items-center justify-center mb-6 ${color} shadow-lg shrink-0`}>
        <Icon size={28} />
      </div>
      <h4 className="text-lg font-bold mb-3">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function ListItem({ title, text }: { title: string, text: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-6 h-6 rounded-full bg-cyber/10 flex items-center justify-center shrink-0 mt-0.5">
        <div className="w-2 h-2 rounded-full bg-cyber" />
      </div>
      <div>
        <h4 className="font-bold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
