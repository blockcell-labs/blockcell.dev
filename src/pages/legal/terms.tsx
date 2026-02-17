import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <div className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 text-foreground">{t('legal.terms.title')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('legal.terms.updated')}</p>

          <section className="space-y-6 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.terms.agreement.title')}</h2>
            <p>{t('legal.terms.agreement.p')}</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.terms.license.title')}</h2>
            <p>
              <Trans i18nKey="legal.terms.license.p" components={[<strong />]} />
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.terms.responsibilities.title')}</h2>
            <p>{t('legal.terms.responsibilities.p')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('legal.terms.responsibilities.list.illegal')}</li>
              <li>{t('legal.terms.responsibilities.list.tos')}</li>
              <li>{t('legal.terms.responsibilities.list.malicious')}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.terms.disclaimer.title')}</h2>
            <p>{t('legal.terms.disclaimer.p1')}</p>
            <p>
              <Trans i18nKey="legal.terms.disclaimer.p2" components={[<strong />]} />
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.terms.law.title')}</h2>
            <p>{t('legal.terms.law.p')}</p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">{t('legal.terms.changes.title')}</h2>
            <p>{t('legal.terms.changes.p')}</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
