import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-indigo-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                π
              </div>
              <span className="text-lg font-bold text-white">PoliGov</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Plateforme de gouvernance décentralisée pour les Pionniers Pi Network. 
              Votez, financez et construisez ensemble l&apos;avenir de l&apos;écosystème Pi.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Navigation</h4>
            <div className="space-y-2">
              <Link to="/proposals" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Propositions</Link>
              <Link to="/funding" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Financement</Link>
              <Link to="/create" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Créer un Projet</Link>
              <Link to="/dashboard" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Mon Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Communauté</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">Pi Network</a>
              <Link to="/api-docs" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">📖 API Documentation</Link>
              <Link to="/security" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">🛡️ Sécurité & Transparence</Link>
              <Link to="/reputation" className="block text-gray-400 hover:text-indigo-400 text-sm transition-colors">⭐ Réputation</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 PoliGov. Gouvernance par les Pionniers, pour les Pionniers.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">Propulsé par pionniers Pi Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}