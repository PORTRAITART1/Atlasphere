import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentSeason, getSeasonMissions } from '@/lib/dao-advanced';
import { Calendar, Star, Target, Clock, CheckCircle2, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Seasons() {
  const season = getCurrentSeason();
  const missions = getSeasonMissions();
  const [timeLeft, setTimeLeft] = useState('');
  const userXP = 4200;

  useEffect(() => {
    const update = () => {
      const end = new Date(season.endDate).getTime();
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) { setTimeLeft('Terminée'); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      setTimeLeft(`${days}j ${hours}h`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [season.endDate]);

  const currentTier = season.rewards.reduce((best, r) => (userXP >= r.threshold ? r : best), season.rewards[0]);
  const nextTier = season.rewards.find((r) => r.threshold > userXP);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Season Header */}
        <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{season.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-white">{season.name}</h1>
                <p className="text-sm text-cyan-300">{season.theme}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-amber-400">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-bold">{timeLeft}</span>
              </div>
              <p className="text-xs text-gray-400">restant</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white font-medium">Votre progression : <span className="text-cyan-400">{userXP.toLocaleString()} XP</span></span>
              <span className="text-xs text-gray-400">Tier actuel : <span className="text-amber-400">{currentTier.tier}</span></span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${nextTier ? (userXP / nextTier.threshold) * 100 : 100}%` }} />
            </div>
            {nextTier && (
              <p className="text-xs text-gray-400">Prochain tier ({nextTier.tier}) : {nextTier.threshold - userXP} XP restants</p>
            )}
          </div>
        </div>

        {/* Rewards Tiers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {season.rewards.map((reward) => {
            const unlocked = userXP >= reward.threshold;
            return (
              <div key={reward.tier} className={`bg-slate-900/60 border rounded-xl p-4 text-center transition-all ${unlocked ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/10'}`}>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className={`w-4 h-4 ${unlocked ? 'text-amber-400' : 'text-gray-600'}`} />
                  <span className={`text-sm font-bold ${unlocked ? 'text-amber-400' : 'text-gray-500'}`}>{reward.tier}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{reward.threshold.toLocaleString()} XP</p>
                <p className={`text-xs ${unlocked ? 'text-white' : 'text-gray-500'}`}>{reward.reward}</p>
                {unlocked && <span className="text-xs text-emerald-400 mt-1 block">✓ Débloqué</span>}
              </div>
            );
          })}
        </div>

        {/* Missions */}
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Missions de la Semaine
        </h2>
        <div className="space-y-3">
          {missions.map((mission) => {
            const pct = Math.min((mission.progress / mission.target) * 100, 100);
            return (
              <div key={mission.id} className={`bg-slate-900/60 border rounded-xl p-5 transition-all ${mission.completed ? 'border-emerald-500/30 opacity-70' : 'border-white/10 hover:border-purple-500/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {mission.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Flame className="w-4 h-4 text-orange-400" />}
                      <h3 className="font-semibold text-white">{mission.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{mission.description}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${mission.completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-white font-medium">{mission.progress}/{mission.target} {mission.unit}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-xs text-purple-400 font-medium">+{mission.xpReward} XP</p>
                    <p className="text-xs text-emerald-400">+{mission.ecoReward} ECO</p>
                    <p className="text-xs text-gray-500 mt-1">Expire : {new Date(mission.expires).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}