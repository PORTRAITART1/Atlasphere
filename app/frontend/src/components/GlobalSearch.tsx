import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface SearchResult {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  type: 'project';
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProjects, setAllProjects] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load all projects for search
    api.listAll('projects').then((res) => {
      const items = (res.items || []).map((p: { id: number; title: string; description: string; category: string; status: string }) => ({
        ...p,
        type: 'project' as const,
      }));
      setAllProjects(items);
    });
  }, []);

  useEffect(() => {
    // Keyboard shortcut: Ctrl+K or Cmd+K
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = allProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      setResults(filtered.slice(0, 8));
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, allProjects]);

  function handleSelect(result: SearchResult) {
    navigate(`/proposal/${result.id}`);
    setIsOpen(false);
    setQuery('');
  }

  const categoryIcons: Record<string, string> = {
    education: '📚',
    commerce: '🏪',
    technology: '💻',
    social: '🤝',
    environment: '🌍',
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-gray-400 text-sm hover:border-indigo-500/50 hover:text-gray-300 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden md:inline">Rechercher...</span>
        <kbd className="hidden md:inline text-xs bg-slate-700 px-1.5 py-0.5 rounded text-gray-500">⌘K</kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}>
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="relative flex items-start justify-center pt-[15vh] px-4">
              <motion.div
                className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                initial={{ scale: 0.95, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: -20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un projet, une catégorie..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                  />
                  {loading && (
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  <kbd className="text-xs bg-slate-700 px-1.5 py-0.5 rounded text-gray-500">Esc</kbd>
                </div>

                {/* Results */}
                <div className="max-h-[300px] overflow-y-auto">
                  {query && results.length === 0 && !loading && (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      Aucun résultat pour "{query}"
                    </div>
                  )}
                  {results.map((result, i) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left"
                    >
                      <span className="text-lg">{categoryIcons[result.category] || '📋'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{result.title}</p>
                        <p className="text-xs text-gray-500 truncate">{result.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          result.status === 'voting' ? 'bg-blue-500/20 text-blue-400' :
                          result.status === 'funding' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>{result.status}</span>
                        <span className="text-xs text-gray-600">#{i + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quick Links */}
                {!query && (
                  <div className="p-4 border-t border-slate-700/50">
                    <p className="text-xs text-gray-500 mb-2">Accès rapide</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: '📋 Propositions', path: '/proposals' },
                        { label: '💰 Financement', path: '/funding' },
                        { label: '🗺️ Carte', path: '/map' },
                        { label: '📊 Analytics', path: '/analytics' },
                        { label: '🤝 Délégation', path: '/delegation' },
                      ].map((link) => (
                        <button
                          key={link.path}
                          onClick={() => { navigate(link.path); setIsOpen(false); }}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 transition-colors"
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}