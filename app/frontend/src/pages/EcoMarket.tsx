import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMarketDatasets, type MarketDataset } from '@/lib/eco-data';

const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: '🌐' },
  { id: 'air', label: 'Air', icon: '🌬️' },
  { id: 'water', label: 'Eau', icon: '💧' },
  { id: 'energy', label: 'Énergie', icon: '⚡' },
  { id: 'biodiversity', label: 'Biodiversité', icon: '🌳' },
  { id: 'climate', label: 'Climat', icon: '🌡️' },
  { id: 'soil', label: 'Sol', icon: '🪨' },
];

function DatasetCard({ dataset, onBuy }: { dataset: MarketDataset; onBuy: (id: string) => void }) {
  const categoryIcon = CATEGORIES.find((c) => c.id === dataset.category)?.icon || '📊';

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryIcon}</span>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full capitalize">
            {dataset.category}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-300">{dataset.rating}</span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{dataset.title}</h3>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{dataset.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {dataset.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs bg-slate-700/50 text-gray-300 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div>
          <p className="text-xs text-gray-500">Points</p>
          <p className="text-xs font-medium text-gray-300">{(dataset.dataPoints / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Région</p>
          <p className="text-xs font-medium text-gray-300 truncate">{dataset.region}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">DL</p>
          <p className="text-xs font-medium text-gray-300">{dataset.downloads}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div>
          <span className="text-lg font-bold text-amber-400">{dataset.price}</span>
          <span className="text-xs text-gray-400 ml-1">Pi</span>
        </div>
        <button
          onClick={() => onBuy(dataset.id)}
          className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg transition-all"
        >
          Acheter
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Par {dataset.provider} • Mis à jour le {new Date(dataset.lastUpdated).toLocaleDateString('fr-FR')}
      </p>
    </div>
  );
}

export default function EcoMarket() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const datasets = getMarketDatasets();

  const filtered = datasets.filter((d) => {
    const matchCat = category === 'all' || d.category === category;
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleBuy = (id: string) => {
    const ds = datasets.find((d) => d.id === id);
    if (ds) {
      alert(`🛒 Achat simulé : "${ds.title}" pour ${ds.price} Pi\n\nEn production, cela déclenchera un paiement Pi via le SDK.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🛒 EcoMarket
          </h1>
          <p className="text-sm text-gray-400 mt-1">Place de marché de données environnementales — Achetez et vendez des datasets climatiques en Pi</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-emerald-400">6</p>
            <p className="text-xs text-gray-400">Datasets</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-cyan-400">12.6M</p>
            <p className="text-xs text-gray-400">Points de données</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-amber-400">1 516</p>
            <p className="text-xs text-gray-400">Téléchargements</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-purple-400">6</p>
            <p className="text-xs text-gray-400">Fournisseurs</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Rechercher des datasets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === cat.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} onBuy={handleBuy} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun dataset trouvé pour cette recherche.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}