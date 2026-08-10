import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, subscribeI18n } from '@/lib/i18n';
import {
  getEcoBalance,
  getEcoTransactions,
  getEcoRewards,
  getEcoLevel,
  formatEco,
  type EcoTransaction,
  type EcoReward,
} from '@/lib/eco-data';

function BalanceCard() {
  const balance = getEcoBalance();
  const level = getEcoLevel(balance.totalEarned);
  const progress = ((balance.totalEarned - (level.nextThreshold === 500 ? 0 : level.nextThreshold === 2000 ? 500 : level.nextThreshold === 5000 ? 2000 : level.nextThreshold === 10000 ? 5000 : 10000)) / (level.nextThreshold - (level.nextThreshold === 500 ? 0 : level.nextThreshold === 2000 ? 500 : level.nextThreshold === 5000 ? 2000 : level.nextThreshold === 10000 ? 5000 : 10000))) * 100;

  return (
    <div className="bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-cyan-900/40 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-emerald-300/70">{t('ecowallet.wallet_name')}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">{level.icon}</span>
              <span className="text-sm font-medium text-emerald-300">{t(level.level)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full">
            <span className="text-xs text-emerald-400">🔥 {t('ecowallet.streak')}</span>
            <span className="text-sm font-bold text-emerald-300">{balance.streak}{t('ecowallet.streak_days')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{t('ecowallet.balance_eco')}</p>
            <p className="text-2xl font-bold text-emerald-400">{formatEco(balance.eco)}</p>
            <p className="text-xs text-emerald-400/60 mt-1">≈ {formatEco(balance.eco * 0.02)} Pi</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{t('ecowallet.balance_pi')}</p>
            <p className="text-2xl font-bold text-amber-400">{formatEco(balance.pi)}</p>
            <p className="text-xs text-amber-400/60 mt-1">π Network</p>
          </div>
        </div>

        <div className="bg-black/20 rounded-xl p-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{t('ecowallet.total_earned')} : {formatEco(balance.totalEarned)} ECO</span>
            <span className="text-emerald-400">{Math.min(Math.round(progress), 100)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('ecowallet.next_level')} : {formatEco(level.nextThreshold)} ECO</p>
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ tx }: { tx: EcoTransaction }) {
  const icon = tx.type === 'earn' ? '↗️' : tx.type === 'spend' ? '↙️' : tx.type === 'reward' ? '🎁' : '↔️';
  const color = tx.type === 'earn' || tx.type === 'reward' ? 'text-emerald-400' : 'text-red-400';
  const sign = tx.type === 'earn' || tx.type === 'reward' ? '+' : '-';

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm text-gray-200">{t(tx.description)}</p>
          <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
      <span className={`text-sm font-semibold ${color}`}>
        {sign}{tx.amount} {tx.currency}
      </span>
    </div>
  );
}

function RewardCard({ reward, onClaim }: { reward: EcoReward; onClaim: (id: string) => void }) {
  return (
    <div className={`border rounded-xl p-4 transition-all ${reward.claimed ? 'bg-emerald-900/10 border-emerald-500/20 opacity-70' : 'bg-slate-800/50 border-slate-600/30 hover:border-emerald-500/40 hover:bg-slate-800/70'}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{reward.icon}</span>
        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          +{reward.ecoAmount} ECO
        </span>
      </div>
      <h4 className="text-sm font-semibold text-gray-200 mb-1">{t(reward.title)}</h4>
      <p className="text-xs text-gray-400 mb-3">{t(reward.description)}</p>
      {reward.claimed ? (
        <span className="text-xs text-emerald-400/70">{t('ecowallet.claimed_on')} {reward.claimedAt}</span>
      ) : (
        <button
          onClick={() => onClaim(reward.id)}
          className="w-full py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          {t('ecowallet.claim')}
        </button>
      )}
    </div>
  );
}

export default function EcoWallet() {
  const [tab, setTab] = useState<'transactions' | 'rewards'>('transactions');
  const transactions = getEcoTransactions();
  const [rewards, setRewards] = useState<EcoReward[]>(getEcoRewards());
  const [, setLang] = useState(0);

  useEffect(() => {
    return subscribeI18n(() => setLang((n) => n + 1));
  }, []);

  const handleClaim = (id: string) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, claimed: true, claimedAt: new Date().toISOString().split('T')[0] } : r))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {t('ecowallet.title')}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{t('ecowallet.subtitle')}</p>
        </div>

        <BalanceCard />

        <div className="mt-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab('transactions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'transactions' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
            >
              {t('ecowallet.tab_transactions')}
            </button>
            <button
              onClick={() => setTab('rewards')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'rewards' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
            >
              {t('ecowallet.tab_rewards')}
            </button>
          </div>

          {tab === 'transactions' && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              {transactions.map((tx) => (
                <TransactionItem key={tx.id} tx={tx} />
              ))}
            </div>
          )}

          {tab === 'rewards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} onClaim={handleClaim} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}