import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PiPaymentButton from '@/components/PiPaymentButton';
import { t, subscribeI18n } from '@/lib/i18n';
import {
  fetchAllProjects,
  createContribution,
  updateProject,
  type Project,
} from '@/lib/api';
import { getCurrentUser, subscribe } from '@/lib/pi-sdk';

export default function Funding() {
  const [user, setUser] = useState(getCurrentUser());
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributedIds, setContributedIds] = useState<Set<number>>(new Set());
  const [, setLangTick] = useState(0);

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    loadFundingProjects();
  }, []);

  const loadFundingProjects = async () => {
    setLoading(true);
    try {
      // Load projects with funding or approved status
      const result = await fetchAllProjects({ limit: 50, sort: '-created_at' });
      if (result?.items) {
        const fundingProjects = result.items.filter(
          (p) => p.status === 'funding' || p.status === 'approved'
        );
        setProjects(fundingProjects);
      }
    } catch (err) {
      console.error('Failed to load funding projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (project: Project, amount: number) => {
    if (!user) return;
    try {
      await createContribution({
        project_id: project.id,
        amount,
        pi_uid: user.uid,
        status: 'completed',
      });

      // Update project raised amount
      const newRaised = (project.raised || 0) + amount;
      await updateProject(project.id, { raised: newRaised });

      // Update local state
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, raised: newRaised } : p))
      );
      setContributedIds(new Set([...contributedIds, project.id]));
    } catch (err) {
      console.error('Contribution failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <PageTransition>
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">{t('funding.title')}</h1>
            <p className="text-gray-400">{t('funding.subtitle')}</p>
          </motion.div>

          {/* Banner */}
          <motion.div
            className="relative rounded-xl overflow-hidden mb-8"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-full h-48 bg-gradient-to-r from-amber-900/40 to-purple-900/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-950/40 flex items-center px-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('funding.invest_title')}</h2>
                <p className="text-gray-300 text-sm max-w-md">
                  {t('funding.banner_desc')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-slate-700 rounded w-2/3 mb-4" />
                  <div className="h-3 bg-slate-700 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Funding Projects */}
          {!loading && (
            <div className="space-y-6">
              {projects.map((p, i) => {
                const percentage = p.budget > 0 ? ((p.raised || 0) / p.budget) * 100 : 0;
                const hasContributed = contributedIds.has(p.id);

                return (
                  <motion.div
                    key={p.id}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    whileHover={{ borderColor: 'rgba(99, 102, 241, 0.3)', transition: { duration: 0.2 } }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link
                            to={`/proposal/${p.id}`}
                            className="text-lg font-semibold text-white hover:text-indigo-300 transition-colors"
                          >
                            {p.title}
                          </Link>
                          <Link
                            to={`/escrow/${p.id}`}
                            className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
                          >
                            🔐 Escrow
                          </Link>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-amber-400 font-medium">
                              {(p.raised || 0).toLocaleString()} π {t('funding.collected')}
                            </span>
                            <span className="text-gray-400">{t('funding.goal')}: {p.budget.toLocaleString()} π</span>
                          </div>
                          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(percentage, 100)}%` }}
                              transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{p.category}</span>
                            <span>{percentage.toFixed(0)}% {t('funding.reached')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[160px]">
                        {user && !hasContributed ? (
                          <>
                            <button
                              onClick={() => handleContribute(p, 10)}
                              className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
                            >
                              {t('funding.contribute_10')}
                            </button>
                            <button
                              onClick={() => handleContribute(p, 50)}
                              className="px-4 py-2 rounded-lg bg-amber-700 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                            >
                              {t('funding.contribute_50')}
                            </button>
                            <PiPaymentButton
                              amount={100}
                              projectId={p.id}
                              memo={`${t('funding.memo')} ${p.title}`}
                              onSuccess={() => loadFundingProjects()}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-medium hover:from-amber-500 hover:to-amber-400 transition-all"
                            >
                              {t('funding.contribute_100')}
                            </PiPaymentButton>
                          </>
                        ) : hasContributed ? (
                          <div className="text-center text-amber-400 text-sm py-2">
                            {t('funding.thanks')}
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 text-sm py-2">
                            {t('funding.login_to_contribute')}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && projects.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">💰</div>
              <p className="text-gray-400">{t('funding.no_projects')}</p>
            </motion.div>
          )}
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}