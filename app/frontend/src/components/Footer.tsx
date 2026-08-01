import { Link } from 'react-router-dom';

export default function Footer() {
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
              />
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Atlasphere
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Plateforme de gouvernance décentralisée pour les Pionniers Pi Network. 
              Votez, financez et construisez ensemble l&apos;avenir de l&apos;écosystème Pi.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <div className="space-y-2.5">
              <Link to="/proposals" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Propositions</Link>
              <Link to="/funding" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Financement</Link>
              <Link to="/create" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Créer un Projet</Link>
              <Link to="/eco-wallet" className="block text-gray-400 hover:text-emerald-400 text-sm transition-colors">🌿 EcoWallet</Link>
              <Link to="/dashboard" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Mon Dashboard</Link>
            </div>
          </div>

          {/* Communauté */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Communauté</h4>
            <div className="space-y-2.5">
              <a href="https://minepi.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Pi Network</a>
              <Link to="/api-docs" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">📖 API Documentation</Link>
              <Link to="/security" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">🛡️ Sécurité</Link>
              <Link to="/reputation" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">⭐ Réputation</Link>
              <Link to="/settings" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">⚙️ Configuration</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 Atlasphere. Gouvernance par les Pionniers, pour les Pionniers.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">Propulsé par Pi Network</span>
            <span className="text-xs text-emerald-600">🌱 EcoChain AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}