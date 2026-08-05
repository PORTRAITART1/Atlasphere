import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { t, subscribeI18n } from '@/lib/i18n';
import {
  fetchAllProjects,
  type Project,
  getStatusLabel,
  getStatusColor,
  getCategoryLabel,
} from '@/lib/api';

type StatusFilter = 'all' | 'voting' | 'approved' | 'funding' | 'funded' | 'completed';
type CategoryFilter = 'all' | 'education' | 'commerce' | 'technology' | 'social' | 'environment';

export default function Proposals() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [, setLangTick] = useState(0);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await fetchAllProjects({ limit: 100, sort: '-created_at' });
      if (result?.items) {
        setProjects(result.items);
        setTotal(result.total);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [projects, search, statusFilter, categoryFilter]);

  const statuses: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: t('proposals.filter.all') },
    { value: 'voting', label: t('proposals.filter.voting') },
    { value: 'approved', label: t('proposals.filter.approved') },
    { value: 'funding', label: t('proposals.filter.funding') },
    { value: 'funded', label: t('proposals.filter.funded') },
    { value: 'completed', label: t('proposals.filter.completed') },
  ];

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: t('proposals.cat.all') },
    { value: 'education', label: t('proposals.cat.education') },
    { value: 'commerce', label: t('proposals.cat.commerce') },
    { value: 'technology', label: t('proposals.cat.technology') },
    { value: 'social', label: t('proposals.cat.social') },
    { value: 'environment', label: t('proposals.cat.environment') },
  ];

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
            <h1 className="text-3xl font-bold text-white mb-2">{t('proposals.title')}</h1>
            <p className="text-gray-400">
              {t('proposals.subtitle')} ({total} {t('proposals.total')})
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-8 space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <input
              type="text"
              placeholder={t('proposals.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === s.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategoryFilter(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    categoryFilter === c.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            className="mb-4 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? t('proposals.loading') : `${filtered.length} ${t('proposals.results')}`}
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/3 mb-3" />
                  <div className="h-6 bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-700 rounded w-full mb-4" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-400">{t('proposals.no_results')}</p>
            </motion.div>
          )}
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const votePercentage =
    (project.voter_count || 0) > 0
      ? ((project.votes_for || 0) / (project.voter_count || 1)) * 100
      : 0;
  const fundingPercentage =
    project.budget > 0 ? ((project.raised || 0) / project.budget) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link
        to={`/proposal/${project.id}`}
        className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-indigo-500/40 hover:bg-slate-800/80 transition-all group h-full"
      >
        <div className="flex items-start justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
          <span className="text-xs text-gray-500">{getCategoryLabel(project.category)}</span>
        </div>

        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500 ml-auto">
            {project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : ''}
          </span>
        </div>

        {project.status === 'voting' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Votes: {project.voter_count || 0}</span>
              <span>{votePercentage.toFixed(0)}% Pour</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${votePercentage}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {(project.status === 'funding' || project.status === 'funded' || project.status === 'completed') && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {(project.raised || 0).toLocaleString()} π / {project.budget.toLocaleString()} π
              </span>
              <span>{fundingPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}