import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBadges, getLevel, getRarityColor, type Badge } from '@/lib/badges';
import { Award, Star, Trophy, Zap, Lock } from 'lucide-react';

export default function Badges() {
  const badges = getBadges();
  const { level, xp, nextLevelXp } = getLevel();
  const [filter, setFilter] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const categories = [
    { id: 'all', label: 'Tous', icon: '🏅' },
    { id: 'governance', label: 'Gouvernance', icon: '🗳️' },
    { id: 'funding', label: 'Financement', icon: '💰' },
    { id: 'social', label: 'Social', icon: '💬' },
    { id: 'eco', label: 'Écologie', icon: '🌱' },
    { id: 'special', label: 'Spécial', icon: '⭐' },
  ];

  const filteredBadges = filter === 'all' ? badges : badges.filter((b) => b.category === filter);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Badges & Achievements</h1>
        </div>

        {/* Level & XP Card */}
        <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <span className="text-3xl font-black text-white">{level}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                LVL
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">Niveau {level} — Pionnier Confirmé</h2>
              <p className="text-gray-400 text-sm mb-3">{unlockedCount}/{badges.length} badges débloqués</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${(xp / nextLevelXp) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-yellow-400 font-medium">{xp}/{nextLevelXp} XP</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{unlockedCount}</p>
                <p className="text-xs text-gray-400">Badges</p>
              </div>
              <div>
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{xp + (level - 1) * nextLevelXp}</p>
                <p className="text-xs text-gray-400">XP Total</p>
              </div>
              <div>
                <Star className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{badges.filter((b) => b.rarity === 'legendary' && b.unlocked).length}</p>
                <p className="text-xs text-gray-400">Légendaires</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${filter === cat.id ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBadges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative group bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-4 text-center transition-all hover:scale-105 hover:shadow-lg ${badge.unlocked ? `border-white/10 hover:border-indigo-500/50` : 'border-white/5 opacity-60'}`}
            >
              {!badge.unlocked && (
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center z-10">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div className={`text-4xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>{badge.icon}</div>
              <h3 className="text-xs font-semibold text-white truncate">{badge.name}</h3>
              <p className={`text-[10px] mt-1 font-medium ${getRarityColor(badge.rarity)}`}>
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
              </p>
              {!badge.unlocked && (
                <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${badge.progress}%` }} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBadge(null)}>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
              <div className={`text-6xl mb-4 ${selectedBadge.unlocked ? 'animate-bounce' : 'grayscale'}`}>{selectedBadge.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedBadge.name}</h2>
              <p className={`text-sm font-medium mb-3 ${getRarityColor(selectedBadge.rarity)}`}>
                {selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)}
              </p>
              <p className="text-gray-400 text-sm mb-4">{selectedBadge.description}</p>
              <div className="bg-white/5 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Condition</p>
                <p className="text-sm text-white">{selectedBadge.requirement}</p>
              </div>
              {selectedBadge.unlocked ? (
                <p className="text-emerald-400 text-sm">✓ Débloqué le {new Date(selectedBadge.unlockedAt!).toLocaleDateString('fr-FR')}</p>
              ) : (
                <div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${selectedBadge.progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-400">{selectedBadge.progress}% complété</p>
                </div>
              )}
              <button onClick={() => setSelectedBadge(null)} className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm transition-colors">
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}