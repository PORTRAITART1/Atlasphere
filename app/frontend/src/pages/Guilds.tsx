import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getGuilds } from '@/lib/dao-advanced';
import { Shield, Users, Trophy, Swords, Star, MapPin } from 'lucide-react';

export default function Guilds() {
  const guilds = getGuilds();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Guildes Écologiques</h1>
              <p className="text-sm text-gray-400">Rejoignez une équipe, relevez des défis collectifs</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Shield className="w-4 h-4" />
            Créer une guilde
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Shield className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{guilds.length}</p>
            <p className="text-xs text-gray-400">Guildes actives</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{guilds.reduce((s, g) => s + g.members, 0)}</p>
            <p className="text-xs text-gray-400">Membres total</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Swords className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{guilds.reduce((s, g) => s + g.challenges, 0)}</p>
            <p className="text-xs text-gray-400">Défis complétés</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{guilds.reduce((s, g) => s + g.wins, 0)}</p>
            <p className="text-xs text-gray-400">Victoires</p>
          </div>
        </div>

        {/* Guilds Grid */}
        <div className="space-y-4">
          {guilds.map((guild, idx) => {
            const xpPct = (guild.xp / guild.xpNext) * 100;
            const memberPct = (guild.members / guild.maxMembers) * 100;
            return (
              <div key={guild.id} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <span className="text-4xl">{guild.icon}</span>
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {guild.rank}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{guild.name}</h3>
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Niv. {guild.level}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{guild.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Leader</p>
                        <p className="text-sm text-white">@{guild.leader}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Région</p>
                        <p className="text-sm text-white flex items-center gap-1"><MapPin className="w-3 h-3" />{guild.region}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Score Éco</p>
                        <p className="text-sm text-emerald-400 font-medium">{guild.ecoScore}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Défis</p>
                        <p className="text-sm text-white">{guild.wins}/{guild.challenges} gagnés</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Membres</p>
                        <p className="text-sm text-white">{guild.members}/{guild.maxMembers}</p>
                      </div>
                    </div>

                    {/* XP Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">XP Guilde</span>
                          <span className="text-amber-400">{guild.xp}/{guild.xpNext}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${xpPct}%` }} />
                        </div>
                      </div>
                      <button className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${memberPct >= 100 ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' : 'bg-amber-600/30 border border-amber-500/50 text-amber-300 hover:bg-amber-600/40'}`} disabled={memberPct >= 100}>
                        {memberPct >= 100 ? 'Complet' : 'Rejoindre'}
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mt-3">
                      {guild.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">#{tag}</span>
                      ))}
                    </div>
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