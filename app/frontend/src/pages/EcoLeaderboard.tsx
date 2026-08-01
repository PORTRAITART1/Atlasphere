import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLeaderboard, getCommunityChallenge, type LeaderboardEntry } from '@/lib/eco-data';
import { Trophy, TrendingUp, TrendingDown, Minus, Users, Target } from 'lucide-react';

export default function EcoLeaderboard() {
  const [region, setRegion] = useState('all');
  const leaderboard = getLeaderboard(region === 'all' ? undefined : region);
  const challenges = getCommunityChallenge();

  const regions = [
    { id: 'all', label: '🌍 Mondial' },
    { id: 'paris', label: '🗼 Paris' },
    { id: 'lyon', label: '🦁 Lyon' },
    { id: 'marseille', label: '⛵ Marseille' },
  ];

  const getTrendIcon = (entry: LeaderboardEntry) => {
    if (entry.trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    if (entry.trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
    return <Minus className="w-3.5 h-3.5 text-gray-500" />;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/40';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/10 to-slate-400/10 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700/10 to-orange-700/10 border-amber-700/30';
    return 'bg-white/5 border-white/10';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Leaderboard Écologique</h1>
            <p className="text-sm text-gray-400">Classement des Pionniers les plus éco-responsables</p>
          </div>
        </div>

        {/* Region Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => setRegion(r.id)}
              className={`px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${region === r.id ? 'bg-yellow-500/20 border-yellow-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard Table */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Top Pionniers</h2>
              <p className="text-xs text-gray-400">{leaderboard.length} participants • Mis à jour en temps réel</p>
            </div>
            <div className="divide-y divide-white/5">
              {leaderboard.map((entry) => (
                <div key={entry.rank} className={`flex items-center gap-4 p-4 border-l-2 ${getRankStyle(entry.rank)} ${entry.username === 'pioneer_dao' ? 'ring-1 ring-indigo-500/30' : ''}`}>
                  <div className="w-10 text-center">
                    <span className={`text-lg ${entry.rank <= 3 ? '' : 'text-gray-400 text-sm font-medium'}`}>
                      {getRankBadge(entry.rank)}
                    </span>
                  </div>
                  <span className="text-2xl">{entry.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${entry.username === 'pioneer_dao' ? 'text-indigo-300' : 'text-white'}`}>
                        {entry.username}
                      </span>
                      {entry.username === 'pioneer_dao' && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Vous</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{entry.region} • {entry.badges} badges</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">{entry.ecoScore}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {getTrendIcon(entry)}
                      {entry.trendValue > 0 && (
                        <span className={`text-xs ${entry.trend === 'up' ? 'text-emerald-400' : entry.trend === 'down' ? 'text-red-400' : 'text-gray-500'}`}>
                          {entry.trend === 'up' ? '+' : entry.trend === 'down' ? '-' : ''}{entry.trendValue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Challenges */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Défis Communautaires
            </h2>
            {challenges.map((challenge) => {
              const pct = (challenge.current / challenge.target) * 100;
              return (
                <div key={challenge.id} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{challenge.title}</h3>
                    <span className="text-xs text-emerald-400 font-medium">+{challenge.reward} ECO</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{challenge.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-white font-medium">{Math.round(pct)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {challenge.participants.toLocaleString()} participants
                    </span>
                    <span>{challenge.current.toLocaleString()}/{challenge.target.toLocaleString()} {challenge.unit}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Target className="w-3 h-3" />
                    <span>Fin : {new Date(challenge.endsAt).toLocaleDateString('fr-FR')}</span>
                  </div>
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