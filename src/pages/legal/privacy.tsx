import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <div className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 text-foreground">{t('legal.privacy.title')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('legal.privacy.updated')}</p>

          <section className="space-y-6 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.privacy.intro.title')}</h2>
            <p>{t('legal.privacy.intro.p1')}</p>
            <p>
              <Trans i18nKey="legal.privacy.intro.p2" components={[<strong />]} />
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.privacy.data.title')}</h2>
            
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">{t('legal.privacy.data.visitors.title')}</h3>
            <p>{t('legal.privacy.data.visitors.p')}</p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">{t('legal.privacy.data.software.title')}</h3>
            <p>{t('legal.privacy.data.software.p')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Trans i18nKey="legal.privacy.data.software.list.local" components={[<strong />, <code />]} />
              </li>
              <li>
                <Trans i18nKey="legal.privacy.data.software.list.llm" components={[<strong />]} />
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.privacy.hub.title')}</h2>
            <p>{t('legal.privacy.hub.p')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('legal.privacy.hub.list.code')}</li>
              <li>{t('legal.privacy.hub.list.author')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.privacy.updates.title')}</h2>
            <p>{t('legal.privacy.updates.p')}</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.privacy.contact.title')}</h2>
            <p>
              {t('legal.privacy.contact.p')}
              <br />
              <a href="mailto:privacy@blockcell.ai" className="text-rust hover:underline">privacy@blockcell.ai</a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
