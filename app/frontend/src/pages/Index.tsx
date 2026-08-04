import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { t, useI18nRerender } from '@/lib/i18n';
import {
  fetchAllProjects,
  fetchAllVotes,
  type Project,
  getStatusLabel,
  getStatusColor,
  getCategoryLabel,
} from '@/lib/api';

export default function Index() {
  useI18nRerender();

  const [featured, setFeatured] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFunded: 0,
    totalPiInvested: 0,
    totalVotes: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, votesRes] = await Promise.all([
        fetchAllProjects({ limit: 100 }),
        fetchAllVotes({ limit: 1 }),
      ]);

      if (projectsRes?.items) {
        const projects = projectsRes.items;
        const featuredProjects = projects
          .filter((p) => p.status === 'voting' || p.status === 'funding')
          .slice(0, 3);
        setFeatured(featuredProjects);

        const funded = projects.filter((p) => p.status === 'funded' || p.status === 'completed').length;
        const totalRaised = projects.reduce((sum, p) => sum + (p.raised || 0), 0);

        setStats({
          totalProjects: projectsRes.total,
          totalFunded: funded,
          totalPiInvested: totalRaised,
          totalVotes: votesRes?.total || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load homepage data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <PageTransition>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/marketing-pack/images/branded-hero-governance-globe.png"
              alt="Atlasphere Governance"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
          </div>
          {/* Logo overlay on hero */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
            <img
              src="/assets/logo-atlasphere-transparent.png"
              alt="Atlasphere"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-indigo-300">{t('home.badge')}</span>
              </motion.div>
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t('home.heading')}{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                  Pi Network
                </span>
              </motion.h1>
              <motion.p
                className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t('home.description')}
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  to="/proposals"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25"
                >
                  {t('hero.cta')}
                </Link>
                <Link
                  to="/create"
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  {t('home.submit')}
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t('home.stats.submitted'), value: stats.totalProjects.toString(), icon: '📋' },
              { label: t('home.stats.funded'), value: stats.totalFunded.toString(), icon: '🏆' },
              { label: t('home.stats.invested'), value: stats.totalPiInvested > 1000 ? `${(stats.totalPiInvested / 1000).toFixed(0)}K π` : `${stats.totalPiInvested} π`, icon: '💰' },
              { label: t('home.stats.votes'), value: stats.totalVotes.toLocaleString(), icon: '🗳️' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.h2
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            {t('home.how_title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: t('home.step1.title'),
                description: t('home.step1.desc'),
                image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-24/pgiealqaagra/illustration-global-projects.png',
              },
              {
                step: '02',
                title: t('home.step2.title'),
                description: t('home.step2.desc'),
                image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-24/pgiea7aaagta/illustration-community-voting.png',
              },
              {
                step: '03',
                title: t('home.step3.title'),
                description: t('home.step3.desc'),
                image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-24/pgid75yaagsq/illustration-crowdfunding-growth.png',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group hover:border-indigo-500/30 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="h-40 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="text-xs text-indigo-400 font-mono mb-2">{t('home.step')} {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Proposals */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white">{t('home.active_proposals')}</h2>
            <Link to="/proposals" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
              {t('home.view_all')}
            </Link>
          </motion.div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <FeaturedProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800/30 border border-slate-700/30 rounded-xl">
              <div className="text-3xl mb-3">🚀</div>
              <p className="text-gray-400">{t('home.no_proposals')}</p>
              <Link to="/create" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
                {t('home.be_first')}
              </Link>
            </div>
          )}
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}

function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  useI18nRerender();

  const votePercentage =
    (project.voter_count || 0) > 0
      ? ((project.votes_for || 0) / (project.voter_count || 1)) * 100
      : 0;
  const fundingPercentage =
    project.budget > 0 ? ((project.raised || 0) / project.budget) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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

        {project.status === 'voting' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{t('vote.for')}: {project.voter_count || 0}</span>
              <span>{votePercentage.toFixed(0)}% {t('vote.for')}</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${votePercentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {(project.status === 'funding' || project.status === 'funded') && (
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
                whileInView={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}