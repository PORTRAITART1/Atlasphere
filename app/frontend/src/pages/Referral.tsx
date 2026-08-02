import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getReferralStats, getReferrals, type Referral as ReferralType } from '@/lib/advanced-features';
import { Users, Copy, Share2, Gift, TrendingUp, Check } from 'lucide-react';

export default function Referral() {
  const stats = getReferralStats();
  const referrals = getReferrals();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://atlasphere.app/join?ref=${stats.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Rejoins Atlasphere !',
        text: `Utilise mon code ${stats.code} pour gagner des ECO tokens en rejoignant la communauté écologique !`,
        url: `https://atlasphere.app/join?ref=${stats.code}`,
      });
    }
  };

  const tierProgress = (stats.totalReferrals / stats.nextTierRequirement) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Parrainage</h1>
            <p className="text-sm text-gray-400">Invitez des Pionniers et gagnez des récompenses ECO</p>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/30 rounded-2xl p-6 mb-8">
          <h2 className="text-sm text-amber-300 mb-2">Votre code de parrainage</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-white font-mono tracking-wider">{stats.code}</span>
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-300 hover:text-white'}`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <button onClick={handleShare} className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400">Chaque filleul actif vous rapporte <span className="text-amber-300 font-medium">50 ECO</span> + bonus de niveau</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
            <p className="text-xs text-gray-400">Filleuls</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.activeReferrals}</p>
            <p className="text-xs text-gray-400">Actifs</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.totalEarned}</p>
            <p className="text-xs text-gray-400">ECO gagnés</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">x{stats.bonusMultiplier}</p>
            <p className="text-xs text-gray-400">Multiplicateur</p>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold text-white">Tier : {stats.tier}</span>
            </div>
            <span className="text-xs text-gray-400">Prochain : {stats.nextTier} ({stats.nextTierRequirement} filleuls)</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${tierProgress}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {['Starter', 'Ambassadeur', 'Champion', 'Légende'].map((tier, i) => (
              <div key={tier} className={`text-xs py-1 rounded-lg ${i <= 1 ? 'text-amber-300 bg-amber-500/10' : 'text-gray-500'}`}>
                {tier}
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Info */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-emerald-400" />
            Récompenses par palier
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400">Par filleul actif</p>
              <p className="text-lg font-bold text-emerald-400">+50 ECO</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400">Bonus 10 filleuls</p>
              <p className="text-lg font-bold text-amber-400">+500 ECO</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400">Bonus 50 filleuls</p>
              <p className="text-lg font-bold text-purple-400">+3000 ECO</p>
            </div>
          </div>
        </div>

        {/* Referrals List */}
        <h3 className="text-lg font-bold text-white mb-4">Vos filleuls</h3>
        <div className="space-y-3">
          {referrals.map((ref: ReferralType) => (
            <div key={ref.id} className="bg-slate-900/60 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${ref.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-600/20 text-gray-500'}`}>
                  {ref.username.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{ref.username}</p>
                  <p className="text-xs text-gray-500">Rejoint le {ref.joinedAt} • Niv. {ref.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-emerald-400">+{ref.ecoEarned} ECO</p>
                <p className={`text-xs ${ref.active ? 'text-emerald-400' : 'text-gray-500'}`}>{ref.active ? '● Actif' : '○ Inactif'}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}