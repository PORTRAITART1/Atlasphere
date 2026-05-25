import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProposalCard from '@/components/ProposalCard';
import { getProposals, type ProposalStatus, type Category } from '@/lib/store';

export default function Proposals() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const proposals = getProposals();

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [proposals, search, statusFilter, categoryFilter]);

  const statuses: { value: ProposalStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'voting', label: '🗳️ En Vote' },
    { value: 'approved', label: '✅ Approuvé' },
    { value: 'funding', label: '💰 En Financement' },
    { value: 'funded', label: '🎉 Financé' },
    { value: 'completed', label: '🏆 Terminé' },
  ];

  const categories: { value: Category | 'all'; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'education', label: '📚 Éducation' },
    { value: 'commerce', label: '🛍️ Commerce' },
    { value: 'technology', label: '💻 Technologie' },
    { value: 'social', label: '🤝 Social' },
    { value: 'environment', label: '🌍 Environnement' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Propositions</h1>
          <p className="text-gray-400">Explorez et votez sur les projets de la communauté Pi</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-8 space-y-4">
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategoryFilter(c.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === c.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-gray-400">{filtered.length} proposition(s) trouvée(s)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400">Aucune proposition trouvée avec ces filtres.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}