import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, subscribeI18n } from '@/lib/i18n';
import { getCurrentUser } from '@/lib/pi-sdk';

interface Delegate {
  id: string;
  username: string;
  reputation: number;
  delegatedWeight: number;
  since: string;
  active: boolean;
}

interface DelegationHistory {
  id: string;
  action: 'delegated' | 'revoked' | 'received';
  from: string;
  to: string;
  weight: number;
  date: string;
}

export default function Delegation() {
  const [, setLangTick] = useState(0);
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [receivedDelegations, setReceivedDelegations] = useState<Delegate[]>([]);
  const [history, setHistory] = useState<DelegationHistory[]>([]);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [delegateUsername, setDelegateUsername] = useState('');
  const [delegateWeight, setDelegateWeight] = useState(50);
  const user = getCurrentUser();

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    // Load mock delegation data
    if (user) {
      setDelegates([
        { id: '1', username: 'Pioneer_Alpha', reputation: 420, delegatedWeight: 30, since: '2026-06-15', active: true },
        { id: '2', username: 'Pioneer_Beta', reputation: 310, delegatedWeight: 20, since: '2026-06-20', active: true },
      ]);
      setReceivedDelegations([
        { id: '3', username: 'Pioneer_Gamma', reputation: 180, delegatedWeight: 40, since: '2026-06-18', active: true },
        { id: '4', username: 'Pioneer_Delta', reputation: 95, delegatedWeight: 15, since: '2026-06-22', active: true },
      ]);
      setHistory([
        { id: '1', action: 'delegated', from: user.username || 'You', to: 'Pioneer_Alpha', weight: 30, date: '2026-06-15' },
        { id: '2', action: 'delegated', from: user.username || 'You', to: 'Pioneer_Beta', weight: 20, date: '2026-06-20' },
        { id: '3', action: 'received', from: 'Pioneer_Gamma', to: user.username || 'You', weight: 40, date: '2026-06-18' },
        { id: '4', action: 'received', from: 'Pioneer_Delta', to: user.username || 'You', weight: 15, date: '2026-06-22' },
        { id: '5', action: 'revoked', from: user.username || 'You', to: 'Pioneer_Omega', weight: 25, date: '2026-06-10' },
      ]);
    }
  }, [user]);

  const totalDelegatedOut = delegates.reduce((sum, d) => sum + d.delegatedWeight, 0);
  const totalReceivedIn = receivedDelegations.reduce((sum, d) => sum + d.delegatedWeight, 0);
  const availableWeight = 100 - totalDelegatedOut;

  function handleDelegate() {
    if (!delegateUsername.trim() || delegateWeight <= 0 || delegateWeight > availableWeight) return;
    const newDelegate: Delegate = {
      id: Date.now().toString(),
      username: delegateUsername,
      reputation: Math.floor(Math.random() * 300) + 100,
      delegatedWeight: delegateWeight,
      since: new Date().toISOString().split('T')[0],
      active: true,
    };
    setDelegates((prev) => [...prev, newDelegate]);
    setHistory((prev) => [{ id: Date.now().toString(), action: 'delegated', from: user?.username || 'You', to: delegateUsername, weight: delegateWeight, date: new Date().toISOString().split('T')[0] }, ...prev]);
    setDelegateUsername('');
    setDelegateWeight(50);
    setShowDelegateModal(false);
  }

  function handleRevoke(delegateId: string) {
    const target = delegates.find((d) => d.id === delegateId);
    if (!target) return;
    setDelegates((prev) => prev.filter((d) => d.id !== delegateId));
    setHistory((prev) => [{ id: Date.now().toString(), action: 'revoked', from: user?.username || 'You', to: target.username, weight: target.delegatedWeight, date: new Date().toISOString().split('T')[0] }, ...prev]);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-400 text-lg">{t('delegation.login_required')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              🤝 {t('delegation.title')}
            </h1>
            <p className="text-gray-400">{t('delegation.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowDelegateModal(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            {t('delegation.delegate_btn')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-400">{t('delegation.available_weight')}</p>
            <p className="text-2xl font-bold text-white">{availableWeight}%</p>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${availableWeight}%` }} />
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-400">{t('delegation.delegated_out')}</p>
            <p className="text-2xl font-bold text-amber-400">{totalDelegatedOut}%</p>
            <p className="text-xs text-gray-500 mt-1">{t('delegation.to_delegates').replace('{0}', String(delegates.length))}</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-400">{t('delegation.received_in')}</p>
            <p className="text-2xl font-bold text-emerald-400">{totalReceivedIn}%</p>
            <p className="text-xs text-gray-500 mt-1">{t('delegation.from_delegators').replace('{0}', String(receivedDelegations.length))}</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-400">{t('delegation.effective_power')}</p>
            <p className="text-2xl font-bold text-purple-400">{availableWeight + totalReceivedIn}%</p>
            <p className="text-xs text-gray-500 mt-1">{t('delegation.personal_received')}</p>
          </div>
        </div>

        {/* Active Delegations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Delegated Out */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">{t('delegation.my_delegations')}</h3>
            {delegates.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">{t('delegation.no_delegations')}</p>
            ) : (
              <div className="space-y-3">
                {delegates.map((d) => (
                  <motion.div
                    key={d.id}
                    className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">
                      👤
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">@{d.username}</p>
                      <p className="text-xs text-gray-500">{t('delegation.rep')}: {d.reputation} • {t('delegation.since')} {d.since}</p>
                    </div>
                    <span className="text-amber-400 font-bold text-sm">{d.delegatedWeight}%</span>
                    <button
                      onClick={() => handleRevoke(d.id)}
                      className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      {t('delegation.revoke')}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Received */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">{t('delegation.received_title')}</h3>
            {receivedDelegations.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">{t('delegation.no_received')}</p>
            ) : (
              <div className="space-y-3">
                {receivedDelegations.map((d) => (
                  <motion.div
                    key={d.id}
                    className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">
                      👤
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">@{d.username}</p>
                      <p className="text-xs text-gray-500">{t('delegation.rep')}: {d.reputation} • {t('delegation.since')} {d.since}</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">+{d.delegatedWeight}%</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">{t('delegation.history_title')}</h3>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center gap-3 p-3 bg-slate-800/20 rounded-lg text-sm">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  h.action === 'delegated' ? 'bg-blue-500/20 text-blue-400' :
                  h.action === 'received' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {h.action === 'delegated' ? t('delegation.action_delegated') : h.action === 'received' ? t('delegation.action_received') : t('delegation.action_revoked')}
                </span>
                <span className="text-gray-300 flex-1">
                  {h.action === 'received' ? `${t('delegation.from')} @${h.from}` : `${t('delegation.to')} @${h.to}`} — {h.weight}%
                </span>
                <span className="text-xs text-gray-500">{h.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8 bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">{t('delegation.how_title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3">
              <span className="text-2xl block mb-2">🎯</span>
              <p className="text-sm text-gray-300 font-medium">{t('delegation.how_step1_title')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('delegation.how_step1_desc')}</p>
            </div>
            <div className="text-center p-3">
              <span className="text-2xl block mb-2">⚖️</span>
              <p className="text-sm text-gray-300 font-medium">{t('delegation.how_step2_title')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('delegation.how_step2_desc')}</p>
            </div>
            <div className="text-center p-3">
              <span className="text-2xl block mb-2">🔄</span>
              <p className="text-sm text-gray-300 font-medium">{t('delegation.how_step3_title')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('delegation.how_step3_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delegate Modal */}
      {showDelegateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDelegateModal(false)}>
          <motion.div
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-lg mb-4">{t('delegation.modal_title')}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">{t('delegation.modal_username')}</label>
                <input
                  type="text"
                  value={delegateUsername}
                  onChange={(e) => setDelegateUsername(e.target.value)}
                  placeholder="@Pioneer_..."
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">{t('delegation.modal_weight')}: {delegateWeight}%</label>
                <input
                  type="range"
                  min="1"
                  max={availableWeight}
                  value={delegateWeight}
                  onChange={(e) => setDelegateWeight(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1%</span>
                  <span>{t('delegation.modal_available')}: {availableWeight}%</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDelegateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-gray-300 text-sm hover:bg-slate-600 transition-colors"
                >
                  {t('delegation.modal_cancel')}
                </button>
                <button
                  onClick={handleDelegate}
                  disabled={!delegateUsername.trim() || delegateWeight <= 0}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('delegation.modal_confirm')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}