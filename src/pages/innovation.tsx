import { motion } from 'framer-motion';
import { 
  Network, Ghost, Dna, FileCode, Users, Server, Smartphone, Zap, Code, ArrowRight
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function InnovationPage() {
  const { t } = useTranslation();

  const innovations = [
    {
      icon: Network,
      title: t('innovation.items.hub.title'),
      description: t('innovation.items.hub.desc'),
      Visual: HubVisual
    },
    {
      icon: Users, // Using Users for A2A
      title: t('innovation.items.a2a.title'),
      description: t('innovation.items.a2a.desc'),
      Visual: A2AVisual
    },
    {
      icon: Ghost,
      title: t('innovation.items.ghost.title'),
      description: t('innovation.items.ghost.desc'),
      Visual: GhostVisual
    },
    {
      icon: Dna,
      title: t('innovation.items.evolution.title'),
      description: t('innovation.items.evolution.desc'),
      Visual: EvolutionVisual
    },
    {
      icon: FileCode,
      title: t('innovation.items.rhai.title'),
      description: t('innovation.items.rhai.desc'),
      Visual: RhaiVisual
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
            {t('innovation.title')}
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('innovation.subtitle')}
          </p>
        </div>

        <div className="space-y-24">
          {innovations.map((item, index) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-background to-card border border-border flex items-center justify-center text-rust mb-6 shadow-2xl shadow-rust/10">
                  <item.icon size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              <div className="flex-1 w-full">
                <div className="aspect-video rounded-xl bg-card border border-border relative overflow-hidden group shadow-2xl flex items-center justify-center bg-gradient-to-br from-card to-background">
                  <item.Visual />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Visual Components

function HubVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Hub */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-16 h-16 rounded-full bg-rust flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.4)] z-10"
      >
        <Network className="text-white w-8 h-8" />
      </motion.div>
      
      {/* Satellites */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-32 origin-bottom left-[calc(50%-1px)] bottom-1/2"
          style={{ rotate: deg }}
          animate={{ rotate: deg + 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-8 h-8 -mt-4 -ml-3 rounded-full bg-card border border-rust/50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-rust" />
          </div>
        </motion.div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
}

function A2AVisual() {
  return (
    <div className="flex items-center justify-center gap-8 w-full px-8">
      {/* Node A */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-xl bg-card border-2 border-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <Server className="text-blue-500 w-8 h-8" />
        </div>
        <span className="text-xs font-mono text-muted-foreground">Server</span>
      </div>

      {/* Connection */}
      <div className="flex-1 h-[2px] bg-border relative overflow-hidden">
        <motion.div 
          animate={{ x: [-100, 200] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        />
        <motion.div 
          animate={{ x: [200, -100] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-l from-transparent via-green-500 to-transparent"
        />
      </div>

      {/* Node B */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-xl bg-card border-2 border-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <Smartphone className="text-green-500 w-8 h-8" />
        </div>
        <span className="text-xs font-mono text-muted-foreground">Edge</span>
      </div>
    </div>
  );
}

function GhostVisual() {
  return (
    <div className="relative w-full h-full bg-black/20 flex items-center justify-center overflow-hidden">
      {/* Background Matrix */}
      <div className="absolute inset-0 opacity-10 font-mono text-[10px] leading-3 p-4 text-green-500 overflow-hidden">
        {Array.from({ length: 400 }).map((_, i) => (
          <span key={i}>{Math.random() > 0.5 ? '0' : '1'} </span>
        ))}
      </div>

      <motion.div 
        animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-24 h-24 flex items-center justify-center"
      >
        <Ghost className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </motion.div>
    </div>
  );
}

function EvolutionVisual() {
  return (
    <div className="flex items-center gap-4">
      {/* V1 */}
      <div className="w-24 h-32 bg-card border border-border rounded p-2 opacity-50 scale-90">
        <div className="h-2 w-12 bg-red-500/50 rounded mb-2" />
        <div className="space-y-1">
          <div className="h-1 w-full bg-muted rounded" />
          <div className="h-1 w-2/3 bg-muted rounded" />
          <div className="h-1 w-full bg-red-500/20 rounded" />
        </div>
      </div>

      <motion.div 
        animate={{ opacity: [0, 1, 0], x: [-10, 10] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowRight className="text-cyber" />
      </motion.div>

      {/* V2 */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="w-28 h-36 bg-card border-2 border-cyber rounded p-3 shadow-[0_0_20px_rgba(0,255,157,0.1)]"
      >
        <div className="h-2 w-16 bg-cyber rounded mb-3" />
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-muted rounded" />
          <div className="h-1.5 w-3/4 bg-muted rounded" />
          <div className="h-1.5 w-full bg-cyber/30 rounded" />
          <div className="h-1.5 w-5/6 bg-muted rounded" />
        </div>
        <div className="absolute -top-2 -right-2 bg-cyber text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">v2.0</div>
      </motion.div>
    </div>
  );
}

function RhaiVisual() {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-4 border-dashed border-border rounded-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-2 border-rust/30 flex items-center justify-center"
        >
          <div className="w-24 h-32 bg-[#1e1e1e] rounded-lg border border-border p-3 flex flex-col items-center justify-center shadow-xl">
             <Code className="text-yellow-400 mb-2" />
             <span className="text-xs font-mono text-yellow-400">.rhai</span>
          </div>
        </motion.div>
      </div>
      <Zap className="absolute -top-2 -right-2 text-yellow-400 w-8 h-8 fill-yellow-400 animate-bounce" />
    </div>
  );
}
