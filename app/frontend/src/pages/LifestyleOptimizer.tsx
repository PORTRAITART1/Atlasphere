import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLifestyleRecommendations, getWeeklyGoals, getEcoScore, type LifestyleRecommendation } from '@/lib/eco-data';
import { Leaf, Target, TrendingDown, CheckCircle2, Circle, Sparkles } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  transport: '🚲',
  energy: '⚡',
  food: '🥗',
  waste: '♻️',
  water: '💧',
};

const IMPACT_COLORS: Record<string, string> = {
  low: 'text-green-400 bg-green-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  high: 'text-orange-400 bg-orange-500/10',
};

export default function LifestyleOptimizer() {
  const recommendations = getLifestyleRecommendations();
  const goals = getWeeklyGoals();
  const ecoScore = getEcoScore();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? recommendations : recommendations.filter((r) => r.category === filter);
  const adoptedCount = recommendations.filter((r) => r.adopted).length;
  const totalSaving = recommendations.filter((r) => r.adopted).reduce((s, r) => s + r.ecoSaving, 0);

  const categories = [
    { id: 'all', label: 'Tous', icon: '🌍' },
    { id: 'transport', label: 'Transport', icon: '🚲' },
    { id: 'energy', label: 'Énergie', icon: '⚡' },
    { id: 'food', label: 'Alimentation', icon: '🥗' },
    { id: 'waste', label: 'Déchets', icon: '♻️' },
    { id: 'water', label: 'Eau', icon: '💧' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Lifestyle Optimizer</h1>
            <p className="text-sm text-gray-400">Recommandations IA personnalisées pour réduire votre empreinte carbone</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/30 border border-emerald-500/20 rounded-xl p-4">
            <Leaf className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-white">{totalSaving}</p>
            <p className="text-xs text-gray-400">kg CO2/mois économisés</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
            <Target className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="text-2xl font-bold text-white">{adoptedCount}/{recommendations.length}</p>
            <p className="text-xs text-gray-400">Actions adoptées</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
            <TrendingDown className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{ecoScore.total}</p>
            <p className="text-xs text-gray-400">Score écologique</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
            <CheckCircle2 className="w-5 h-5 text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-white">{goals.filter((g) => g.current >= g.target).length}/{goals.length}</p>
            <p className="text-xs text-gray-400">Objectifs atteints</p>
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Objectifs de la Semaine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {goals.map((goal) => {
              const pct = Math.min((goal.current / goal.target) * 100, 100);
              const done = goal.current >= goal.target;
              return (
                <div key={goal.id} className={`bg-white/5 border rounded-xl p-4 ${done ? 'border-emerald-500/30' : 'border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{CATEGORY_ICONS[goal.category]}</span>
                    {done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">{goal.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{goal.current}/{goal.target} {goal.unit}</p>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-emerald-400 mt-2">+{goal.ecoReward} ECO</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${filter === cat.id ? 'bg-emerald-600/30 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {filtered.map((rec: LifestyleRecommendation) => (
            <div key={rec.id} className={`bg-slate-900/60 backdrop-blur-xl border rounded-xl p-5 transition-all ${rec.adopted ? 'border-emerald-500/30' : 'border-white/10 hover:border-emerald-500/20'}`}>
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{CATEGORY_ICONS[rec.category]}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{rec.title}</h3>
                    {rec.adopted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${IMPACT_COLORS[rec.impact]}`}>
                      Impact : {rec.impact === 'low' ? 'Faible' : rec.impact === 'medium' ? 'Moyen' : 'Élevé'}
                    </span>
                    <span className="text-xs text-emerald-400">-{rec.ecoSaving} kg CO2/mois</span>
                    <span className="text-xs text-gray-500">Difficulté : {rec.difficulty === 'easy' ? '⭐' : rec.difficulty === 'medium' ? '⭐⭐' : '⭐⭐⭐'}</span>
                  </div>
                  {rec.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progression</span>
                        <span className="text-white">{rec.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" style={{ width: `${rec.progress}%` }} />
                      </div>
                    </div>
                  )}
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