import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCarbonCredits, getUserCarbonOffset, type CarbonCredit } from '@/lib/dao-advanced';
import { Leaf, ShieldCheck, ShoppingCart, TrendingDown } from 'lucide-react';

const TYPE_ICONS: Record<string, string> = {
  reforestation: '🌳',
  renewable: '💨',
  efficiency: '🏠',
  transport: '🚲',
  waste: '♻️',
};

const TYPE_LABELS: Record<string, string> = {
  reforestation: 'Reforestation',
  renewable: 'Énergie renouvelable',
  efficiency: 'Efficacité énergétique',
  transport: 'Transport vert',
  waste: 'Gestion déchets',
};

export default function CarbonCredits() {
  const credits = getCarbonCredits();
  const userOffset = getUserCarbonOffset();
  const [filter, setFilter] = useState('all');
  const [buyModal, setBuyModal] = useState<CarbonCredit | null>(null);

  const filtered = filter === 'all' ? credits : credits.filter((c) => c.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Leaf className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Crédits Carbone</h1>
            <p className="text-sm text-gray-400">Compensez votre empreinte — crédits vérifiés et tokenisés</p>
          </div>
        </div>

        {/* User Offset Summary */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/20 border border-emerald-500/30 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-emerald-300 mb-1">Votre compensation totale</p>
              <p className="text-3xl font-bold text-white">{userOffset.totalOffset} tonnes CO₂</p>
              <p className="text-xs text-gray-400 mt-1">Équivalent à 3 ans de voiture en moins</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Crédits achetés</p>
              <p className="text-3xl font-bold text-emerald-400">{userOffset.credits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Votre rang</p>
              <p className="text-xl font-bold text-amber-400">{userOffset.rank}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">-23% vs mois dernier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${filter === 'all' ? 'bg-emerald-600/30 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
            🌍 Tous
          </button>
          {Object.entries(TYPE_ICONS).map(([type, icon]) => (
            <button key={type} onClick={() => setFilter(type)} className={`px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${filter === type ? 'bg-emerald-600/30 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
              {icon} {TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        {/* Credits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((credit) => {
            const soldPct = (credit.sold / credit.tonnes) * 100;
            return (
              <div key={credit.id} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{TYPE_ICONS[credit.type]}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{credit.title}</h3>
                    <p className="text-xs text-gray-400">{TYPE_LABELS[credit.type]} • {credit.origin} • Vintage {credit.vintage}</p>
                  </div>
                  {credit.verified && (
                    <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-emerald-300">{credit.verifier}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-white">{credit.available}</p>
                    <p className="text-xs text-gray-500">Disponibles</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-amber-400">{credit.pricePerTonne} π</p>
                    <p className="text-xs text-gray-500">Par tonne</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-white">⭐ {credit.rating}</p>
                    <p className="text-xs text-gray-500">Note</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Vendu</span>
                    <span className="text-white">{credit.sold}/{credit.tonnes} tonnes</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" style={{ width: `${soldPct}%` }} />
                  </div>
                </div>

                <button onClick={() => setBuyModal(credit)} className="w-full py-2.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm font-medium hover:bg-emerald-600/30 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Acheter des crédits
                </button>
              </div>
            );
          })}
        </div>

        {/* Buy Modal */}
        {buyModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setBuyModal(null)}>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-2">Acheter des Crédits Carbone</h2>
              <p className="text-sm text-gray-400 mb-4">{buyModal.title}</p>
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Prix par tonne</span>
                  <span className="text-lg font-bold text-amber-400">{buyModal.pricePerTonne} π</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Quantité</span>
                  <span className="text-lg font-bold text-white">1 tonne CO₂</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2 flex items-center justify-between">
                  <span className="text-sm text-white font-medium">Total</span>
                  <span className="text-xl font-bold text-emerald-400">{buyModal.pricePerTonne} π</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Vérifié par {buyModal.verifier} • Certificat blockchain inclus</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setBuyModal(null)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/10 transition-colors">Annuler</button>
                <button onClick={() => setBuyModal(null)} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors">Payer en Pi</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}