import { motion } from 'framer-motion';
import { Box, Cpu, Activity, Network, Zap, RefreshCw, GitBranch, Flame } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

export default function NamingStoryPage() {
  const { t } = useTranslation();

  const replicatorTraits = [
    { key: 'adapt', icon: Zap },
    { key: 'evolve', icon: RefreshCw },
    { key: 'decentral', icon: GitBranch },
  ];

  const blockTraits: string[] = t('story.block.traits', { returnObjects: true }) as string[];
  const cellTraits: string[] = t('story.cell.traits', { returnObjects: true }) as string[];

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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rust via-white to-cyber">
                {t('story.title')}
              </span>
            </h1>

            {/* Intro */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-16 border-l-4 border-rust/50 pl-6">
              <Trans i18nKey="story.intro" components={{ 1: <strong className="text-foreground" /> }} />
            </p>

            {/* Section 1: Replicators */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
                <Activity className="text-rust shrink-0" />
                {t('story.replicators.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t('story.replicators.desc')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {replicatorTraits.map(({ key, icon: Icon }, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="p-5 rounded-xl bg-card/50 border border-border hover:border-rust/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-rust/10 border border-border flex items-center justify-center mb-3 text-rust">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold mb-1">{t(`story.replicators.traits.${key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`story.replicators.traits.${key}.desc`)}
                    </p>
                  </motion.div>
                ))}
              </div>

              <p className="mt-6 text-muted-foreground leading-relaxed italic border-l-4 border-purple-500/40 pl-5">
                {t('story.replicators.philosophy')}
              </p>
            </section>

            {/* Section 2: Block + Cell */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Network className="text-cyber shrink-0" />
                {t('story.genes.title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Block */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="p-6 rounded-xl bg-card/50 border border-border hover:border-rust/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-rust/10 border border-border flex items-center justify-center mb-4 text-rust">
                    <Box size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{t('story.block.title')}</h3>
                  <p className="text-sm text-rust/80 mb-4">{t('story.block.subtitle')}</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">{t('story.block.desc')}</p>
                  <ul className="space-y-2">
                    {Array.isArray(blockTraits) && blockTraits.map((trait, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-rust mt-0.5">▸</span>
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Cell */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="p-6 rounded-xl bg-card/50 border border-border hover:border-cyber/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-cyber/10 border border-border flex items-center justify-center mb-4 text-cyber">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{t('story.cell.title')}</h3>
                  <p className="text-sm text-cyber/80 mb-4">{t('story.cell.subtitle')}</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">{t('story.cell.desc')}</p>
                  <ul className="space-y-2">
                    {Array.isArray(cellTraits) && cellTraits.map((trait, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-cyber mt-0.5">▸</span>
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </section>

            {/* Section 3: Digital Nirvana */}
            <motion.section
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Flame className="text-rust shrink-0" />
                {t('story.nirvana.title')}
              </h2>

              {/* README quote */}
              <blockquote className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 mb-8 relative overflow-hidden group hover:border-rust/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-rust/10 via-transparent to-cyber/10 opacity-50" />
                <p className="relative z-10 text-lg leading-relaxed text-foreground/90 italic">
                  {t('story.nirvana.quote')}
                </p>
              </blockquote>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-xl bg-rust/5 border border-rust/20">
                  <p className="font-bold text-rust mb-2">{t('story.nirvana.block_side.title')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('story.nirvana.block_side.desc')}</p>
                </div>
                <div className="p-5 rounded-xl bg-cyber/5 border border-cyber/20">
                  <p className="font-bold text-cyber mb-2">{t('story.nirvana.cell_side.title')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('story.nirvana.cell_side.desc')}</p>
                </div>
              </div>
            </motion.section>

            {/* Closing */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
            >
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {t('story.closing.p1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('story.closing.p2')}
              </p>
            </motion.section>

            {/* Final Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12 relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-rust/20 blur-[100px] -z-10" />
              <blockquote className="text-3xl md:text-5xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-rust via-foreground to-cyber font-serif">
                {t('story.quote')}
              </blockquote>
              <p className="mt-6 text-muted-foreground text-sm">{t('story.closing.thanks')}</p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
