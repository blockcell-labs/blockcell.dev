import { motion } from 'framer-motion';
import { 
  ShieldCheck, Globe, Database, Cpu, 
  Terminal, Workflow, Layers, Clock, Zap 
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function FeaturesPage() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: ShieldCheck,
      title: t('features.items.tool_calling.title'),
      description: t('features.items.tool_calling.desc'),
      color: "text-green-400"
    },
    {
      icon: Globe,
      title: t('features.items.browser.title'),
      description: t('features.items.browser.desc'),
      color: "text-blue-400"
    },
    {
      icon: Database,
      title: t('features.items.memory.title'),
      description: t('features.items.memory.desc'),
      color: "text-purple-400"
    },
    {
      icon: Layers,
      title: t('features.items.subagents.title'),
      description: t('features.items.subagents.desc'),
      color: "text-orange-400"
    },
    {
      icon: Clock,
      title: t('features.items.scheduling.title'),
      description: t('features.items.scheduling.desc'),
      color: "text-red-400"
    },
    {
      icon: Workflow,
      title: t('features.items.skills.title'),
      description: t('features.items.skills.desc'),
      color: "text-yellow-400"
    },
    {
      icon: Terminal,
      title: t('features.items.gateway.title'),
      description: t('features.items.gateway.desc'),
      color: "text-cyan-400"
    },
    {
      icon: Zap,
      title: t('features.items.channels.title'),
      description: t('features.items.channels.desc'),
      color: "text-pink-400"
    },
    {
      icon: Cpu,
      title: t('features.items.safety.title'),
      description: t('features.items.safety.desc'),
      color: "text-indigo-400"
    }
  ];

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t('features.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {t('features.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-rust/30 transition-all hover:bg-card/80"
            >
              <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-6 ${feature.color} border border-border`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
