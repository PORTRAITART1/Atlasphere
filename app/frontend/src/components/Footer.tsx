import { Link } from 'react-router-dom';
import { t, useI18nRerender } from '@/lib/i18n';

export default function Footer() {
  useI18nRerender();

  return (
    <footer className="bg-slate-900 border-t border-indigo-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/assets/logo-atlasphere-transparent.png"
                alt="Atlasphere Logo"
                className="w-9 h-9 object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(58%) saturate(600%) hue-rotate(2deg) brightness(103%) contrast(104%)' }}
              />
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Atlasphere
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.navigation')}</h4>
            <div className="space-y-2.5">
              <Link to="/proposals" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.proposals')}</Link>
              <Link to="/funding" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.funding')}</Link>
              <Link to="/create" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.create')}</Link>
              <Link to="/eco-wallet" className="block text-gray-400 hover:text-emerald-400 text-sm transition-colors">{t('footer.ecowallet')}</Link>
              <Link to="/dashboard" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.dashboard')}</Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.community')}</h4>
            <div className="space-y-2.5">
              <a href="https://minepi.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.pi_network')}</a>
              <Link to="/api-docs" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.api_docs')}</Link>
              <Link to="/security" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.security')}</Link>
              <Link to="/reputation" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.reputation')}</Link>
              <Link to="/settings" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">{t('footer.settings')}</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">{t('footer.powered_by')}</span>
            <span className="text-xs text-emerald-600">{t('footer.ecochain')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}