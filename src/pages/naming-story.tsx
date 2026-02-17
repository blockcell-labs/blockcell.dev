import { motion } from 'framer-motion';
import { Box, Cpu, Activity, Network } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

export default function NamingStoryPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-none scale-105 opacity-100"
          style={{ backgroundImage: "url('/story-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rust/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rust via-white to-cyber">
              {t('story.title')}
            </span>
          </h1>

          <div className="prose prose-invert max-w-none prose-lg">
            <p className="text-xl text-muted-foreground leading-relaxed mb-16 border-l-4 border-rust/50 pl-6">
              <Trans i18nKey="story.intro" components={{ 1: <strong className="text-foreground"/> }} />
            </p>

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Activity className="text-rust" />
              {t('story.genes.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <ConceptCard 
                icon={Box}
                title={t('story.genes.block.title')}
                desc={t('story.genes.block.desc')}
                delay={0.2}
                theme="rust"
              />
              <ConceptCard 
                icon={Cpu}
                title={t('story.genes.cell.title')}
                desc={t('story.genes.cell.desc')}
                delay={0.4}
                theme="cyber"
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-8 mb-16 relative overflow-hidden group hover:border-rust/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rust/10 via-transparent to-cyber/10 opacity-50" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Network className="text-cyber" />
                  {t('story.vision.title')}
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t('story.vision.desc')}
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center py-12 relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-rust/20 blur-[100px] -z-10" />
              <blockquote className="text-3xl md:text-5xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-rust via-foreground to-cyber font-serif">
                {t('story.quote')}
              </blockquote>
            </motion.div>
          </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ConceptCard({ icon: Icon, title, desc, delay, theme }: { icon: any, title: string, desc: string, delay: number, theme: 'rust' | 'cyber' }) {
  const colorClass = theme === 'rust' ? 'text-rust' : 'text-cyber';
  const bgClass = theme === 'rust' ? 'bg-rust/10' : 'bg-cyber/10';
  const borderClass = theme === 'rust' ? 'hover:border-rust/50 shadow-rust/10' : 'hover:border-cyber/50 shadow-cyber/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`p-6 rounded-xl bg-card/50 border border-border transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] ${borderClass}`}
    >
      <div className={`w-12 h-12 rounded-lg ${bgClass} border border-border flex items-center justify-center mb-4 ${colorClass}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}
