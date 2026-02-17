import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const lang = i18n.language.split('-')[0].toLowerCase();

  const langLabel = lang.startsWith('zh') ? 'EN' : '中文';

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
      title="Switch Language"
    >
      <Globe size={20} />
      <span className="text-sm font-medium">{langLabel}</span>
    </button>
  );
}
