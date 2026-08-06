import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PiPaymentButton from '@/components/PiPaymentButton';
import Comments from '@/components/Comments';
import SocialShare from '@/components/SocialShare';
import {
  fetchProjectById,
  fetchAllVotes,
  updateProject,
  type Project,
  type Vote,
  getStatusLabel,
  getStatusColor,
  getCategoryLabel,
  parseMilestones,
  parseTeam,
} from '@/lib/api';
import { getCurrentUser, subscribe, submitGovernanceVote, createPiPayment, shareProposal } from '@/lib/pi-sdk';
import { t, subscribeI18n } from '@/lib/i18n';

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(getCurrentUser());
  const [voted, setVoted] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('10');
  const [contributing, setContributing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'team'>('overview');
  const [, setLang] = useState(0);

  useEffect(() => {
    return subscribeI18n(() => setLang((n) => n + 1));
  }, []);

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  useEffect(() => {
    if (id) loadProject(parseInt(id));
  }, [id]);

  const loadProject = async (projectId: number) => {
    setLoading(true);
    try {
      const proj = await fetchProjectById(projectId);
      setProject(proj);

      // Load votes for this project
      const votesResult = await fetchAllVotes({
        query: { project_id: projectId },
        limit: 100,
      });
      if (votesResult?.items) {
        setVotes(votesResult.items);
        // Check if current user already voted
        if (user) {
          const hasVoted = votesResult.items.some((v) => v.pi_uid === user.uid);
          setVoted(hasVoted);
        }
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 'for' | 'against') => {
    if (!user || !project || voted) return;
    try {
      const result = await submitGovernanceVote(project.id, voteType);

      if (result.success) {
        setProject({
          ...project,
          votes_for: result.votesFor ?? (project.votes_for || 0),
          votes_against: result.votesAgainst ?? (project.votes_against || 0),
          voter_count: (project.voter_count || 0) + 1,
        });
        setVoted(true);
      } else {
        console.error('Vote failed:', result.message);
        // If already voted, mark as voted
        if (result.message?.includes('already voted')) {
          setVoted(true);
        }
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleContribute = async () => {
    if (!user || !project) return;
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;

    setContributing(true);
    try {
      const success = await createPiPayment(
        amount,
        `Contribution à ${project.title}`,
        { project_id: String(project.id), type: 'contribution' }
      );

      if (success) {
        // Refresh project data to get updated raised amount
        const updatedProject = await fetchProjectById(project.id);
        if (updatedProject) {
          setProject(updatedProject);
        } else {
          // Fallback: update locally
          setProject({ ...project, raised: (project.raised || 0) + amount });
        }
        setContributionAmount('10');
      }
    } catch (err) {
      console.error('Contribution failed:', err);
    } finally {
      setContributing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">{t('proposals.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-gray-400 mb-4">{t('detail.not_found')}</p>
            <Link to="/proposals" className="text-indigo-400 hover:text-indigo-300">
              ← {t('detail.back_to_proposals')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const votePercentage =
    (project.voter_count || 0) > 0
      ? ((project.votes_for || 0) / ((project.votes_for || 0) + (project.votes_against || 0) || 1)) * 100
      : 50;
  const fundingPercentage = project.budget > 0 ? ((project.raised || 0) / project.budget) * 100 : 0;
  const milestones = parseMilestones(project.milestones);
  const team = parseTeam(project.team);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <PageTransition>
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/proposals" className="text-indigo-400 hover:text-indigo-300 text-sm mb-6 inline-block">
            ← {t('detail.back_to_proposals')}
          </Link>

          {/* Header */}
          <motion.div
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
              <span className="text-sm text-gray-400">{getCategoryLabel(project.category)}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {t('detail.created_on')} {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{project.title}</h1>
              <button
                onClick={() => shareProposal(project.title, project.id)}
                className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title={t('detail.share_pi')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
            </div>
            <p className="text-gray-400">{project.description}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
                {(['overview', 'milestones', 'team'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'overview' ? t('detail.tab_overview') : tab === 'milestones' ? t('detail.tab_milestones') : t('detail.tab_team')}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <motion.div
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">{t('detail.project_details')}</h3>
                  <p className="text-gray-300 leading-relaxed">{project.description}</p>
                  {project.region && (
                    <div className="mt-4 text-sm text-gray-400">
                      <span className="font-medium text-gray-300">{t('detail.region')}:</span> {project.region}
                    </div>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-gray-400">{t('detail.budget')}</div>
                      <div className="text-amber-400 font-bold">{project.budget.toLocaleString()} π</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-gray-400">{t('detail.collected')}</div>
                      <div className="text-emerald-400 font-bold">{(project.raised || 0).toLocaleString()} π</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-gray-400">{t('detail.votes_for')}</div>
                      <div className="text-blue-400 font-bold">{project.votes_for || 0}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-gray-400">{t('detail.votes_against')}</div>
                      <div className="text-red-400 font-bold">{project.votes_against || 0}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'milestones' && (
                <motion.div
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">{t('detail.milestones_title')}</h3>
                  {milestones.length > 0 ? (
                    <div className="space-y-4">
                      {milestones.map((m, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              m.completed ? 'bg-emerald-500' : 'bg-slate-700'
                            }`}
                          >
                            {m.completed ? (
                              <span className="text-white text-xs">✓</span>
                            ) : (
                              <span className="text-gray-400 text-xs">{i + 1}</span>
                            )}
                          </div>
                          <div>
                            <div className={`font-medium ${m.completed ? 'text-emerald-400' : 'text-white'}`}>
                              {m.title}
                            </div>
                            <div className="text-sm text-gray-400">{m.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">{t('detail.no_milestones')}</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'team' && (
                <motion.div
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">{t('detail.team_title')}</h3>
                  {team.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {team.map((member, i) => (
                        <div
                          key={i}
                          className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3"
                        >
                          <span className="text-2xl">{member.avatar}</span>
                          <div>
                            <div className="font-medium text-white">{member.name}</div>
                            <div className="text-sm text-gray-400">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">{t('detail.no_team')}</p>
                  )}
                </motion.div>
              )}

              {/* Recent Votes */}
              {votes.length > 0 && (
                <motion.div
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {t('detail.recent_votes')} ({votes.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {votes.slice(0, 10).map((v) => (
                      <div key={v.id} className="flex items-center gap-2 text-sm">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            v.vote_type === 'for'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {v.vote_type === 'for' ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-400 truncate">{v.pi_uid.slice(0, 8)}...</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {t('detail.weight')}: {v.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voting */}
              {project.status === 'voting' && (
                <motion.div
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">🗳️ {t('detail.vote_title')}</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400">{t('detail.vote_for')}: {project.votes_for || 0}</span>
                      <span className="text-red-400">{t('detail.vote_against')}: {project.votes_against || 0}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${votePercentage}%` }} />
                      <div className="h-full bg-red-500" style={{ width: `${100 - votePercentage}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 text-center">
                      {project.voter_count || 0} {t('detail.voters')}
                      {project.deadline && ` • ${t('detail.deadline')}: ${project.deadline}`}
                    </div>
                  </div>
                  {user && !voted ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote('for')}
                        className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
                      >
                        {t('detail.vote_for')}
                      </button>
                      <button
                        onClick={() => handleVote('against')}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition-colors"
                      >
                        {t('detail.vote_against')}
                      </button>
                    </div>
                  ) : voted ? (
                    <div className="text-center text-emerald-400 text-sm py-2">{t('detail.vote_recorded')}</div>
                  ) : (
                    <div className="text-center text-gray-400 text-sm py-2">{t('detail.login_to_vote')}</div>
                  )}
                </motion.div>
              )}

              {/* Funding */}
              {(project.status === 'funding' || project.status === 'approved') && (
                <motion.div
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">{t('detail.funding_title')}</h3>
                  <div className="space-y-3 mb-4">
                    <div className="text-2xl font-bold text-amber-400">
                      {(project.raised || 0).toLocaleString()} π
                    </div>
                    <div className="text-sm text-gray-400">
                      {t('detail.funding_goal')} {project.budget.toLocaleString()} π {t('detail.funding_goal_suffix')}
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                        style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400">{fundingPercentage.toFixed(0)}% {t('detail.funding_reached')}</div>
                  </div>
                  {user ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                        placeholder={t('detail.amount_placeholder')}
                      />
                      <button
                        onClick={handleContribute}
                        disabled={contributing}
                        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-medium hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-50"
                      >
                        {contributing ? t('detail.contributing') : t('detail.contribute_pi')}
                      </button>
                      <PiPaymentButton
                        amount={parseFloat(contributionAmount) || 10}
                        projectId={project.id}
                        memo={`${t('detail.memo')} ${project.title}`}
                        onSuccess={() => loadProject(project.id)}
                        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:from-purple-500 hover:to-indigo-500 transition-all"
                      >
                        {t('detail.pay_with_pi')}
                      </PiPaymentButton>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 text-sm py-2">{t('detail.login_to_contribute')}</div>
                  )}
                </motion.div>
              )}

              {/* Info */}
              <motion.div
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">{t('detail.info_title')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('detail.category')}</span>
                    <span className="text-white">{getCategoryLabel(project.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('detail.created_on')}</span>
                    <span className="text-white">
                      {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {project.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('detail.deadline')}</span>
                      <span className="text-white">{project.deadline}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('detail.budget')}</span>
                    <span className="text-white">{project.budget.toLocaleString()} π</span>
                  </div>
                  {project.quorum && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('detail.quorum')}</span>
                      <span className="text-white">{(project.quorum * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Social Share */}
          <div className="mt-6 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <SocialShare
              title={project.title}
              description={project.description?.slice(0, 100)}
              url={window.location.href}
            />
          </div>

          {/* Comments Section */}
          <Comments projectId={project.id} />
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}