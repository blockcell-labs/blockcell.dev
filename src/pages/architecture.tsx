import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ArchitecturePage() {
  const { t } = useTranslation();
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t('architecture.title')}
          </motion.h1>
          <p className="text-xl text-muted-foreground">
            {t('architecture.subtitle')}
          </p>
        </div>

        <div className="space-y-16">
          {/* Section 1: Host + Skills */}
          <Section number="01" title={t('architecture.host_skills.title')}>
            <p>
              {t('architecture.host_skills.desc')}
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div className="p-6 bg-card rounded-xl border border-border">
                <h3 className="text-rust font-bold mb-2">{t('architecture.host_skills.host')}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Immutable Foundation</li>
                  <li>• MessageBus & Backpressure</li>
                  <li>• ToolRegistry & Permissions</li>
                  <li>• Storage & Scheduling</li>
                </ul>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border">
                <h3 className="text-cyber font-bold mb-2">{t('architecture.host_skills.skills')}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SKILL.rhai (Logic & Flow)</li>
                  <li>• SKILL.md (Instructions)</li>
                  <li>• meta.yaml (Config)</li>
                  <li>• Versioned & Rollback-able</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {t('architecture.host_skills.footer')}
            </p>
          </Section>

          {/* Section 2: Data Flow */}
          <Section number="02" title={t('architecture.data_flow.title')}>
            <p>
              {t('architecture.data_flow.desc')}
            </p>
            <div className="mt-6 p-8 bg-card rounded-xl border border-border font-mono text-sm leading-relaxed overflow-x-auto">
              1. Input Source (CLI/Channel/Cron) <br/>
              &nbsp;&nbsp;&nbsp;↓ <br/>
              2. MessageBus (Inbound) <br/>
              &nbsp;&nbsp;&nbsp;↓ <br/>
              3. AgentRuntime (Context Build) <br/>
              &nbsp;&nbsp;&nbsp;↓ <br/>
              4. LLM Inference (Tool Calling) <br/>
              &nbsp;&nbsp;&nbsp;↓ <br/>
              5. ToolRegistry Execution <br/>
              &nbsp;&nbsp;&nbsp;↓ <br/>
              6. Output (Outbound Message)
            </div>
          </Section>

          {/* Section 3: Self Upgrade */}
          <Section number="03" title={t('architecture.upgrade.title')}>
            <p>
              {t('architecture.upgrade.desc')}
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-4">
                <span className="font-bold text-rust">{t('architecture.upgrade.manifest')}</span>
                <span className="text-muted-foreground">{t('architecture.upgrade.manifest_desc')}</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-rust">{t('architecture.upgrade.verification')}</span>
                <span className="text-muted-foreground">{t('architecture.upgrade.verification_desc')}</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-rust">{t('architecture.upgrade.atomic')}</span>
                <span className="text-muted-foreground">{t('architecture.upgrade.atomic_desc')}</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-rust">{t('architecture.upgrade.rollback')}</span>
                <span className="text-muted-foreground">{t('architecture.upgrade.rollback_desc')}</span>
              </li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }: { number: string, title: string, children: React.ReactNode }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative pl-12 border-l border-border"
    >
      <span className="absolute -left-3 top-0 text-sm font-mono text-muted-foreground bg-background px-1">{number}</span>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="text-muted-foreground">
        {children}
      </div>
    </motion.section>
  );
}
