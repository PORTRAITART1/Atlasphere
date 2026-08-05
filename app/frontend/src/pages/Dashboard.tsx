import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { t, subscribeI18n } from '@/lib/i18n';
import { getCurrentUser, authenticate, subscribe, type PiUser } from '@/lib/pi-sdk';
import {
  fetchMyProjects,
  fetchMyVotes,
  fetchMyContributions,
  type Project,
  type Vote,
  type Contribution,
  getStatusLabel,
  getStatusColor,
} from '@/lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'votes' | 'contributions'>('overview');
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [myVotes, setMyVotes] = useState<Vote[]>([]);
  const [myContributions, setMyContributions] = useState<Contribution[]>([]);
  const [, setLangTick] = useState(0);

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      const [projectsRes, votesRes, contributionsRes] = await Promise.all([
        fetchMyProjects({ limit: 50, sort: '-created_at' }),
        fetchMyVotes({ limit: 50, sort: '-created_at' }),
        fetchMyContributions({ limit: 50, sort: '-created_at' }),
      ]);

      if (projectsRes?.items) setMyProjects(projectsRes.items);
      if (votesRes?.items) setMyVotes(votesRes.items);
      if (contributionsRes?.items) setMyContributions(contributionsRes.items);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  };

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
              <h2 className="text-2xl font-bold text-white mb-2">{t('dashboard.login')}</h2>
              <p className="text-gray-400 mb-6">{t('dashboard.login_desc')}</p>
              <button
                onClick={handleAuth}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                {loading ? t('dashboard.logging_in') : t('dashboard.login_btn')}
              </button>
            </motion.div>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  const totalContributed = myContributions.reduce((sum, c) => sum + c.amount, 0);

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
                <p className="text-gray-400 text-sm">@{user.username} • {t('dashboard.pioneer_since')} {user.joinedDate}</p>
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
                <div className="text-xs text-gray-400">{t('dashboard.balance')}</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t('dashboard.my_proposals'), value: myProjects.length, icon: '📋', color: 'text-indigo-400' },
              { label: t('dashboard.my_votes'), value: myVotes.length, icon: '🗳️', color: 'text-emerald-400' },
              { label: t('dashboard.contributions'), value: myContributions.length, icon: '💰', color: 'text-amber-400' },
              { label: t('dashboard.total_contributed'), value: `${totalContributed.toFixed(0)} π`, icon: '💎', color: 'text-purple-400' },
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
            {(['overview', 'proposals', 'votes', 'contributions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'overview'
                  ? t('dashboard.tab_overview')
                  : tab === 'proposals'
                    ? t('dashboard.tab_proposals')
                    : tab === 'votes'
                      ? t('dashboard.tab_votes')
                      : t('dashboard.tab_contributions')}
              </button>
            ))}
          </motion.div>

          {dataLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">{t('dashboard.loading_data')}</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.recent_activity')}</h3>
                    <div className="space-y-3">
                      {myVotes.slice(0, 5).map((v) => (
                        <div key={v.id} className="flex items-center gap-3 text-sm">
                          <span className={v.vote_type === 'for' ? 'text-emerald-400' : 'text-red-400'}>
                            {v.vote_type === 'for' ? '✓' : '✗'}
                          </span>
                          <Link to={`/proposal/${v.project_id}`} className="text-gray-300 truncate hover:text-indigo-300">
                            {t('dashboard.project')} #{v.project_id}
                          </Link>
                          <span className="text-xs text-gray-500 ml-auto">
                            {v.created_at ? new Date(v.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                      ))}
                      {myVotes.length === 0 && (
                        <p className="text-gray-500 text-sm">{t('dashboard.no_votes')}</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.financial_summary')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t('dashboard.total_contributed')}</span>
                        <span className="text-amber-400 font-medium">{totalContributed.toFixed(1)} π</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t('dashboard.projects_supported')}</span>
                        <span className="text-white font-medium">{myContributions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t('dashboard.proposals_created')}</span>
                        <span className="text-white font-medium">{myProjects.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t('dashboard.votes_cast')}</span>
                        <span className="text-white font-medium">{myVotes.length}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'proposals' && (
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {myProjects.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link
                        to={`/proposal/${p.id}`}
                        className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(p.status)}`}>
                            {getStatusLabel(p.status)}
                          </span>
                          <div className="flex-1">
                            <div className="text-white font-medium">{p.title}</div>
                            <div className="text-xs text-gray-400">
                              {p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}
                            </div>
                          </div>
                          <span className="text-amber-400 font-medium text-sm">
                            {p.budget.toLocaleString()} π
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  {myProjects.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-gray-400 mb-4">{t('dashboard.no_proposals')}</p>
                      <Link
                        to="/create"
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        {t('dashboard.create_first')}
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'votes' && (
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {myVotes.map((v, i) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link
                        to={`/proposal/${v.project_id}`}
                        className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                              v.vote_type === 'for'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {v.vote_type === 'for' ? '✓' : '✗'}
                          </span>
                          <div className="flex-1">
                            <div className="text-white font-medium">{t('dashboard.project')} #{v.project_id}</div>
                            <div className="text-xs text-gray-400">
                              {t('dashboard.voted_on')} {v.created_at ? new Date(v.created_at).toLocaleDateString() : ''}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              v.vote_type === 'for'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {v.vote_type === 'for' ? t('dashboard.vote_for') : t('dashboard.vote_against')} (×{v.weight})
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  {myVotes.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🗳️</div>
                      <p className="text-gray-400">{t('dashboard.no_votes_yet')}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'contributions' && (
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {myContributions.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link
                        to={`/proposal/${c.project_id}`}
                        className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-amber-500/20 text-amber-400">
                            π
                          </span>
                          <div className="flex-1">
                            <div className="text-white font-medium">{t('dashboard.project')} #{c.project_id}</div>
                            <div className="text-xs text-gray-400">
                              {t('dashboard.contributed_on')} {c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}
                            </div>
                          </div>
                          <span className="text-amber-400 font-medium">{c.amount} π</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  {myContributions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">💰</div>
                      <p className="text-gray-400">{t('dashboard.no_contributions')}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}