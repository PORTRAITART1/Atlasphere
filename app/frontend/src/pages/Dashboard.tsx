import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { getCurrentUser, authenticate, subscribe, type PiUser } from '@/lib/pi-sdk';
import { getUserVotes, getUserContributions, getProposalById } from '@/lib/store';

export default function Dashboard() {
  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'votes' | 'contributions'>('overview');

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    try {
      await authenticate();
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <PageTransition>
          <div className="flex-1 flex items-center justify-center py-20">
            <motion.div
              className="text-center bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 max-w-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-white mb-2">Connectez-vous</h2>
              <p className="text-gray-400 mb-6">Accédez à votre tableau de bord de gouvernance Pi</p>
              <button
                onClick={handleAuth}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                {loading ? 'Connexion...' : '🔐 Connecter Pi Network'}
              </button>
            </motion.div>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  const votes = getUserVotes();
  const contributions = getUserContributions();
  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <PageTransition>
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <motion.div
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {user.avatar}
              </motion.div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
                <p className="text-gray-400 text-sm">@{user.username} • Pionnier depuis {user.joinedDate}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  {user.badges.map((badge, i) => (
                    <motion.span
                      key={badge}
                      className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    >
                      {badge}
                    </motion.span>
                  ))}
                </div>
              </div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="text-3xl font-bold text-amber-400">{user.piBalance.toFixed(1)} π</div>
                <div className="text-xs text-gray-400">Solde disponible</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Réputation', value: user.reputation, icon: '⭐', color: 'text-amber-400' },
              { label: 'Pouvoir de Vote', value: user.votingPower, icon: '🗳️', color: 'text-indigo-400' },
              { label: 'Votes Exprimés', value: user.votescast, icon: '✓', color: 'text-emerald-400' },
              { label: 'Contributions', value: user.contributions, icon: '💰', color: 'text-purple-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <motion.div
            className="flex gap-1 bg-slate-800/50 rounded-lg p-1 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {(['overview', 'votes', 'contributions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'overview' ? 'Aperçu' : tab === 'votes' ? 'Mes Votes' : 'Mes Contributions'}
              </button>
            ))}
          </motion.div>

          {activeTab === 'overview' && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Activité Récente</h3>
                <div className="space-y-3">
                  {votes.slice(0, 3).map((v) => {
                    const proposal = getProposalById(v.proposalId);
                    return (
                      <div key={v.proposalId} className="flex items-center gap-3 text-sm">
                        <span className={v.vote === 'for' ? 'text-emerald-400' : 'text-red-400'}>{v.vote === 'for' ? '✓' : '✗'}</span>
                        <span className="text-gray-300 truncate">{proposal?.title || 'Proposition'}</span>
                        <span className="text-xs text-gray-500 ml-auto">{v.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Résumé Financier</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Contribué</span>
                    <span className="text-amber-400 font-medium">{totalContributed} π</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Projets Soutenus</span>
                    <span className="text-white font-medium">{contributions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Propositions Créées</span>
                    <span className="text-white font-medium">{user.proposalsCreated}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'votes' && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {votes.map((v, i) => {
                const proposal = getProposalById(v.proposalId);
                return (
                  <motion.div
                    key={v.proposalId}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link to={`/proposal/${v.proposalId}`} className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${v.vote === 'for' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {v.vote === 'for' ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                          <div className="text-white font-medium">{proposal?.title || 'Proposition'}</div>
                          <div className="text-xs text-gray-400">Voté le {v.date}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${v.vote === 'for' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {v.vote === 'for' ? 'Pour' : 'Contre'}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'contributions' && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {contributions.map((c, i) => {
                const proposal = getProposalById(c.proposalId);
                return (
                  <motion.div
                    key={c.proposalId + c.date}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link to={`/proposal/${c.proposalId}`} className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-amber-500/20 text-amber-400">π</span>
                        <div className="flex-1">
                          <div className="text-white font-medium">{proposal?.title || 'Projet'}</div>
                          <div className="text-xs text-gray-400">Contribué le {c.date}</div>
                        </div>
                        <span className="text-amber-400 font-medium">{c.amount} π</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}