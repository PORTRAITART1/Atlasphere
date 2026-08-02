import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUserProfile } from '@/lib/advanced-features';
import { User, Award, Vote, Coins, Leaf, Database, Users, Flame, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const profile = getUserProfile();
  const xpPct = (profile.xp / profile.xpNext) * 100;

  const statCards = [
    { label: 'Réputation', value: profile.reputation, icon: <Award className="w-4 h-4" />, color: 'text-amber-400' },
    { label: 'Propositions', value: profile.proposals, icon: <Vote className="w-4 h-4" />, color: 'text-indigo-400' },
    { label: 'Votes', value: profile.votes, icon: <Vote className="w-4 h-4" />, color: 'text-cyan-400' },
    { label: 'Contributions', value: profile.contributions, icon: <Coins className="w-4 h-4" />, color: 'text-emerald-400' },
    { label: 'NFTs', value: profile.nfts, icon: <Database className="w-4 h-4" />, color: 'text-purple-400' },
    { label: 'Filleuls', value: profile.referrals, icon: <Users className="w-4 h-4" />, color: 'text-orange-400' },
    { label: 'Streak', value: `${profile.streak}j`, icon: <Flame className="w-4 h-4" />, color: 'text-red-400' },
    { label: 'CO2 compensé', value: `${profile.carbonOffset}t`, icon: <Leaf className="w-4 h-4" />, color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center text-4xl">
              {profile.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Niv. {profile.level}</span>
              </div>
              <p className="text-sm text-indigo-300">{profile.title}</p>
              <p className="text-xs text-gray-500 mt-1">Membre depuis {profile.joinedAt}</p>

              {/* XP Bar */}
              <div className="mt-3 max-w-md">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">XP</span>
                  <span className="text-indigo-300">{profile.xp.toLocaleString()} / {profile.xpNext.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${xpPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-400">{profile.ecoBalance}</p>
              <p className="text-xs text-gray-500">ECO</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-amber-400">{profile.piBalance} π</p>
              <p className="text-xs text-gray-500">Pi</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-purple-400">{profile.badges}/{profile.totalBadges}</p>
              <p className="text-xs text-gray-500">Badges</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-cyan-400">{profile.dataShared}</p>
              <p className="text-xs text-gray-500">Données partagées</p>
            </div>
          </div>
        </div>

        {/* Guild Info */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 mb-8 flex items-center gap-4">
          <Shield className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">{profile.guild}</h3>
            <p className="text-xs text-gray-400">Rôle : {profile.guildRole}</p>
          </div>
          <Link to="/guilds" className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            Voir la guilde →
          </Link>
        </div>

        {/* Stats Grid */}
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Statistiques
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center hover:border-indigo-500/20 transition-all">
              <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h2 className="text-lg font-bold text-white mb-4">Accès rapide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { path: '/rewards', label: '🎁 Récompenses', desc: 'XP & actions' },
            { path: '/badges', label: '🏅 Badges', desc: 'Achievements' },
            { path: '/referral', label: '👥 Parrainage', desc: 'Inviter des amis' },
            { path: '/eco-wallet', label: '💰 Portefeuille', desc: 'ECO & Pi' },
            { path: '/ipfs-storage', label: '💾 Stockage IPFS', desc: 'Mes données' },
            { path: '/my-dashboard', label: '📊 Mon Board', desc: 'Dashboard perso' },
          ].map((link) => (
            <Link key={link.path} to={link.path} className="bg-slate-900/60 border border-white/10 rounded-xl p-4 hover:border-indigo-500/20 transition-all block">
              <p className="text-sm font-medium text-white">{link.label}</p>
              <p className="text-xs text-gray-500">{link.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}