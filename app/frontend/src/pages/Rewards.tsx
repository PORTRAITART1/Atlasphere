import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEngagementActions, getEngagementStreak, getEngagementLevel, getLevelProgression, type EngagementAction } from '@/lib/engagement';
import { Gift, Flame, Star, Trophy, Target, Zap, TrendingUp } from 'lucide-react';

export default function Rewards() {
  const actions = getEngagementActions();
  const streak = getEngagementStreak();
  const level = getEngagementLevel();
  const levels = getLevelProgression();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? actions : actions.filter((a) => a.category === filter);
  const dailyCompleted = actions.filter((a) => a.category === 'daily' && a.completed).length;
  const dailyTotal = actions.filter((a) => a.category === 'daily').length;
  const xpPct = (level.xp / level.xpNext) * 100;

  const categories = [
    { id: 'all', label: 'Toutes', icon: '🎯' },
    { id: 'daily', label: 'Quotidiennes', icon: '☀️' },
    { id: 'weekly', label: 'Hebdomadaires', icon: '📅' },
    { id: 'milestone', label: 'Jalons', icon: '🏆' },
    { id: 'special', label: 'Spéciales', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Gift className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Récompenses & Engagement</h1>
            <p className="text-sm text-gray-400">Gagnez des XP et ECO en participant activement</p>
          </div>
        </div>

        {/* Level & Streak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{level.icon}</span>
              <div>
                <p className="text-xs text-indigo-300">Niveau {level.level}</p>
                <h3 className="text-xl font-bold text-white">{level.title}</h3>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">XP</span>
                <span className="text-indigo-300">{level.xp.toLocaleString()} / {level.xpNext.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {level.perks.map((perk, i) => (
                <span key={i} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{perk}</span>
              ))}
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-xs text-orange-300">Streak actif</p>
                <h3 className="text-xl font-bold text-white">{streak.current} jours consécutifs</h3>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-white">{streak.longest}</p>
                <p className="text-xs text-gray-500">Record</p>
              </div>
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-amber-400">x{streak.multiplier}</p>
                <p className="text-xs text-gray-500">Multiplicateur</p>
              </div>
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-white">{streak.nextMilestone}j</p>
                <p className="text-xs text-gray-500">Prochain bonus</p>
              </div>
            </div>
            <p className="text-xs text-orange-300 mt-3">🎁 Bonus à {streak.nextMilestone} jours : +{streak.milestoneReward} ECO</p>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Actions du jour</span>
            </div>
            <span className="text-sm text-cyan-400 font-medium">{dailyCompleted}/{dailyTotal} complétées</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ width: `${(dailyCompleted / dailyTotal) * 100}%` }} />
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${filter === cat.id ? 'bg-amber-600/30 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Actions List */}
        <div className="space-y-3">
          {filtered.map((action: EngagementAction) => (
            <div key={action.id} className={`bg-slate-900/60 border rounded-xl p-4 transition-all ${action.completed ? 'border-emerald-500/20 opacity-70' : 'border-white/10 hover:border-amber-500/20'}`}>
              <div className="flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{action.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`font-medium ${action.completed ? 'text-gray-400 line-through' : 'text-white'}`}>{action.action}</h3>
                    {action.completed && <span className="text-xs text-emerald-400">✓</span>}
                  </div>
                  <p className="text-xs text-gray-500">{action.description}</p>
                  {action.progress !== undefined && action.target !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(action.progress / action.target) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{action.progress}/{action.target}</span>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-purple-400 font-medium">+{action.xpReward} XP</p>
                  <p className="text-xs text-emerald-400">+{action.ecoReward} ECO</p>
                  {action.cooldown && <p className="text-xs text-gray-600 mt-0.5">{action.cooldown}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Level Progression */}
        <div className="mt-8 bg-slate-900/60 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Progression des Niveaux
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {levels.map((l) => {
              const unlocked = level.level >= l.level;
              const current = level.level === l.level;
              return (
                <div key={l.level} className={`text-center p-3 rounded-xl border transition-all ${current ? 'bg-indigo-500/20 border-indigo-500/50' : unlocked ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                  <span className="text-xl">{l.icon}</span>
                  <p className={`text-xs font-medium mt-1 ${current ? 'text-indigo-300' : unlocked ? 'text-emerald-300' : 'text-gray-500'}`}>Niv. {l.level}</p>
                  <p className="text-[10px] text-gray-500">{l.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}