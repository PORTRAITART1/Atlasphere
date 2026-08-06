import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, subscribeI18n } from '@/lib/i18n';
import { getCurrentUser } from '@/lib/pi-sdk';
import { api } from '@/lib/api';

interface AdminProject {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  budget: number;
  raised?: number;
  created_at?: string;
}

interface AdminUser {
  id: number;
  username: string;
  pi_uid: string;
  reputation_score?: number;
  is_vip?: boolean;
  created_at?: string;
}

interface AdminStats {
  total_projects: number;
  total_users: number;
  total_votes: number;
  total_contributions: number;
  total_pi_raised: number;
  active_proposals: number;
}

interface AdminLog {
  id: number;
  action: string;
  target: string;
  admin: string;
  timestamp: string;
}

export default function Admin() {
  const [, setLangTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'users' | 'logs'>('overview');
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats>({ total_projects: 0, total_users: 0, total_votes: 0, total_contributions: 0, total_pi_raised: 0, active_proposals: 0 });
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [projectsRes, votesRes, contribRes] = await Promise.all([
        api.listAll('projects'),
        api.listAll('votes'),
        api.listAll('contributions'),
      ]);

      const allProjects = projectsRes.items || [];
      const allVotes = votesRes.items || [];
      const allContribs = contribRes.items || [];

      setProjects(allProjects);

      // Build stats
      const totalRaised = allContribs.reduce((sum: number, c: { amount?: number }) => sum + (c.amount || 0), 0);
      setStats({
        total_projects: allProjects.length,
        total_users: new Set([...allVotes.map((v: { pi_uid?: string }) => v.pi_uid), ...allContribs.map((c: { pi_uid?: string }) => c.pi_uid)]).size,
        total_votes: allVotes.length,
        total_contributions: allContribs.length,
        total_pi_raised: totalRaised,
        active_proposals: allProjects.filter((p: AdminProject) => p.status === 'voting' || p.status === 'funding').length,
      });

      // Mock users from unique pi_uids
      const uniqueUsers = new Map<string, AdminUser>();
      allVotes.forEach((v: { pi_uid?: string }, i: number) => {
        if (v.pi_uid && !uniqueUsers.has(v.pi_uid)) {
          uniqueUsers.set(v.pi_uid, { id: i + 1, username: `Pioneer_${v.pi_uid.slice(0, 6)}`, pi_uid: v.pi_uid, reputation_score: Math.floor(Math.random() * 500) + 50, is_vip: Math.random() > 0.7 });
        }
      });
      setUsers(Array.from(uniqueUsers.values()));

      // Mock admin logs
      setLogs([
        { id: 1, action: 'Approved', target: allProjects[0]?.title || 'Project #1', admin: user?.username || 'admin', timestamp: new Date().toISOString() },
        { id: 2, action: 'VIP Granted', target: 'Pioneer_abc123', admin: user?.username || 'admin', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, action: 'Rejected', target: 'Spam Proposal', admin: user?.username || 'admin', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 4, action: 'Milestone Verified', target: allProjects[1]?.title || 'Project #2', admin: user?.username || 'admin', timestamp: new Date(Date.now() - 86400000).toISOString() },
      ]);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleModerate(projectId: number, newStatus: string) {
    try {
      await api.update('projects', projectId, { status: newStatus });
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)));
      setLogs((prev) => [{ id: Date.now(), action: newStatus === 'voting' ? 'Approved' : 'Rejected', target: projects.find((p) => p.id === projectId)?.title || '', admin: user?.username || 'admin', timestamp: new Date().toISOString() }, ...prev]);
    } catch (err) {
      console.error('Moderation error:', err);
    }
  }

  function handleToggleVIP(userId: number) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_vip: !u.is_vip } : u)));
    const targetUser = users.find((u) => u.id === userId);
    setLogs((prev) => [{ id: Date.now(), action: targetUser?.is_vip ? 'VIP Revoked' : 'VIP Granted', target: targetUser?.username || '', admin: user?.username || 'admin', timestamp: new Date().toISOString() }, ...prev]);
  }

  const tabs = [
    { key: 'overview', label: t('admin.tab_overview') },
    { key: 'projects', label: t('admin.tab_projects') },
    { key: 'users', label: t('admin.tab_users') },
    { key: 'logs', label: t('admin.tab_logs') },
  ] as const;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-400 text-lg">{t('admin.login_required')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🛡️ {t('admin.title')}
          </h1>
          <p className="text-gray-400">{t('admin.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800/40 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-3" />
                  <div className="h-8 bg-slate-700 rounded w-3/4" />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { label: t('admin.stat_projects'), value: stats.total_projects, icon: '📋', color: 'indigo' },
                      { label: t('admin.stat_users'), value: stats.total_users, icon: '👥', color: 'purple' },
                      { label: t('admin.stat_votes'), value: stats.total_votes, icon: '🗳️', color: 'emerald' },
                      { label: t('admin.stat_contributions'), value: stats.total_contributions, icon: '💰', color: 'amber' },
                      { label: t('admin.stat_pi_raised'), value: `${stats.total_pi_raised.toLocaleString()} π`, icon: '💎', color: 'yellow' },
                      { label: t('admin.stat_active'), value: stats.active_proposals, icon: '🔥', color: 'red' },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-2xl">{stat.icon}</span>
                        <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">{t('admin.recent_activity')}</h3>
                    <div className="space-y-3">
                      {logs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-center gap-3 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            log.action === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                            log.action === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                            log.action === 'VIP Granted' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>{log.action}</span>
                          <span className="text-gray-300 flex-1">{log.target}</span>
                          <span className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">{t('admin.moderation_title')}</h3>
                    <span className="text-xs text-gray-400">{projects.length} {t('admin.projects_total')}</span>
                  </div>
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium">{project.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              project.status === 'voting' ? 'bg-blue-500/20 text-blue-400' :
                              project.status === 'funding' ? 'bg-amber-500/20 text-amber-400' :
                              project.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                              project.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>{project.status}</span>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-1">{project.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>📁 {project.category}</span>
                            <span>💰 {project.budget} π</span>
                            <span>📈 {project.raised || 0} π {t('admin.collected')}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {project.status === 'draft' && (
                            <>
                              <button
                                onClick={() => handleModerate(project.id, 'voting')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 transition-colors"
                              >
                                {t('admin.approve')}
                              </button>
                              <button
                                onClick={() => handleModerate(project.id, 'rejected')}
                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-colors"
                              >
                                {t('admin.reject')}
                              </button>
                            </>
                          )}
                          {project.status === 'voting' && (
                            <button
                              onClick={() => handleModerate(project.id, 'funding')}
                              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-500 transition-colors"
                            >
                              {t('admin.to_funding')}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">{t('admin.users_title')}</h3>
                    <span className="text-xs text-gray-400">{users.length} {t('admin.users_count')}</span>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          <th className="text-left p-3 text-gray-400 font-medium">{t('admin.col_user')}</th>
                          <th className="text-left p-3 text-gray-400 font-medium">{t('admin.col_pi_uid')}</th>
                          <th className="text-left p-3 text-gray-400 font-medium">{t('admin.col_reputation')}</th>
                          <th className="text-left p-3 text-gray-400 font-medium">{t('admin.col_vip')}</th>
                          <th className="text-left p-3 text-gray-400 font-medium">{t('admin.col_actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-700/20">
                            <td className="p-3 text-white">@{u.username}</td>
                            <td className="p-3 text-gray-400 font-mono text-xs">{u.pi_uid.slice(0, 12)}...</td>
                            <td className="p-3">
                              <span className="text-indigo-400 font-medium">{u.reputation_score}</span>
                            </td>
                            <td className="p-3">
                              {u.is_vip ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">{t('admin.vip_label')}</span>
                              ) : (
                                <span className="text-xs text-gray-500">{t('admin.standard')}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleVIP(u.id)}
                                className={`text-xs px-2 py-1 rounded ${u.is_vip ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'} transition-colors`}
                              >
                                {u.is_vip ? t('admin.revoke_vip') : t('admin.grant_vip')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Logs Tab */}
              {activeTab === 'logs' && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold mb-4">{t('admin.logs_title')}</h3>
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium min-w-[100px] text-center ${
                          log.action.includes('Approved') || log.action.includes('Verified') ? 'bg-emerald-500/20 text-emerald-400' :
                          log.action.includes('Rejected') || log.action.includes('Revoked') ? 'bg-red-500/20 text-red-400' :
                          log.action.includes('VIP') ? 'bg-purple-500/20 text-purple-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>{log.action}</span>
                        <span className="text-sm text-gray-300 flex-1">{log.target}</span>
                        <span className="text-xs text-gray-500">{t('admin.by')} {log.admin}</span>
                        <span className="text-xs text-gray-600">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}