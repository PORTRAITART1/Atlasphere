import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEcoAds, getEcoAdStats, type EcoAd } from '@/lib/advanced-features';
import { Megaphone, Play, FileText, MousePointerClick, ClipboardList, Gift } from 'lucide-react';

export default function EcoAds() {
  const [ads, setAds] = useState(getEcoAds());
  const stats = getEcoAdStats();

  const typeIcons: Record<string, React.ReactNode> = {
    video: <Play className="w-4 h-4" />,
    survey: <ClipboardList className="w-4 h-4" />,
    action: <MousePointerClick className="w-4 h-4" />,
    article: <FileText className="w-4 h-4" />,
  };

  const typeLabels: Record<string, string> = {
    video: 'Vidéo',
    survey: 'Sondage',
    action: 'Action',
    article: 'Article',
  };

  const handleComplete = (id: string) => {
    setAds((prev) => prev.map((ad) => (ad.id === id ? { ...ad, completed: true } : ad)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Megaphone className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Éco-Publicités</h1>
            <p className="text-sm text-gray-400">Gagnez des ECO en découvrant des marques éco-responsables (opt-in)</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.totalEarned}</p>
            <p className="text-xs text-gray-400">ECO gagnés</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.adsCompleted}</p>
            <p className="text-xs text-gray-400">Complétées</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">{stats.weeklyCompleted}/{stats.weeklyLimit}</p>
            <p className="text-xs text-gray-400">Cette semaine</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${stats.optIn ? 'text-emerald-400' : 'text-red-400'}`}>{stats.optIn ? '✓' : '✗'}</div>
            <p className="text-xs text-gray-400">Opt-in actif</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Gift className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            Les éco-publicités sont <span className="text-emerald-300 font-medium">100% opt-in</span>. Vous choisissez ce que vous regardez et êtes récompensé en ECO tokens. Aucune donnée personnelle n'est partagée.
          </p>
        </div>

        {/* Ads List */}
        <div className="space-y-4">
          {ads.map((ad: EcoAd) => (
            <div key={ad.id} className={`bg-slate-900/60 border rounded-xl p-5 transition-all ${ad.completed ? 'border-emerald-500/20 opacity-60' : 'border-white/10 hover:border-green-500/20'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ad.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-500/10 text-green-400'}`}>
                  {typeIcons[ad.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`font-medium ${ad.completed ? 'text-gray-400 line-through' : 'text-white'}`}>{ad.title}</h3>
                    <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{typeLabels[ad.type]}</span>
                  </div>
                  <p className="text-xs text-gray-500">{ad.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-500">🏢 {ad.brand}</span>
                    <span className="text-xs text-gray-500">⏱️ {ad.duration}</span>
                    <span className="text-xs text-indigo-400">🏷️ {ad.category}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-emerald-400">+{ad.rewardEco}</p>
                  <p className="text-xs text-gray-500">ECO</p>
                  {!ad.completed && (
                    <button
                      onClick={() => handleComplete(ad.id)}
                      className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded-lg transition-colors"
                    >
                      Participer
                    </button>
                  )}
                  {ad.completed && <span className="text-xs text-emerald-400">✓ Fait</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}