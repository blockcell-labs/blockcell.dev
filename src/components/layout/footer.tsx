import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BlockcellLogo } from '../ui/blockcell-logo';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <BlockcellLogo size="sm" />
              <span className="font-bold text-lg tracking-wider">
                BLOCK<span className="text-cyber">CELL</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/blockcell-labs/blockcell" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-rust transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-rust transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.product')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-rust transition-colors">{t('nav.features')}</Link></li>
              <li><Link to="/architecture" className="hover:text-rust transition-colors">{t('nav.architecture')}</Link></li>
              <li><Link to="/innovation" className="hover:text-rust transition-colors">{t('nav.innovation')}</Link></li>
              <li><a href="https://hub.blockcell.dev" target="_blank" rel="noreferrer" className="hover:text-rust transition-colors">{t('nav.hub')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/docs" className="hover:text-rust transition-colors">{t('nav.docs')}</Link></li>
              <li><Link to="/story" className="hover:text-rust transition-colors">{t('footer.story')}</Link></li>
              <li><a href="#" className="hover:text-rust transition-colors">API Reference</a></li>
              <li><Link to="/examples" className="hover:text-rust transition-colors">{t('footer.examples')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/legal/privacy" className="hover:text-rust transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/legal/terms" className="hover:text-rust transition-colors">{t('footer.terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Blockcell. Open Source MIT License.</p>
        </div>
      </div>
    </footer>
  );
}
