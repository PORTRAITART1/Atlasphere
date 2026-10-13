import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, subscribeI18n } from '@/lib/i18n';
import { getCurrentUser, subscribe, type PiUser } from '@/lib/pi-sdk';
import { fetchMyProjects, fetchMyVotes, fetchMyContributions } from '@/lib/api';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

interface ReputationBreakdown {
  category: string;
  points: number;
  icon: string;
  description: string;
}

export default function Reputation() {
  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
  const [, setLangTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reputationScore, setReputationScore] = useState(0);
  const [votingWeight, setVotingWeight] = useState(1.0);
  const [breakdown, setBreakdown] = useState<ReputationBreakdown[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [level, setLevel] = useState(1);
  const [nextLevelProgress, setNextLevelProgress] = useState(0);

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    loadReputationData();
  }, [user]);

  async function loadReputationData() {
    setLoading(true);
    try {
      const [projectsRes, votesRes, contribsRes] = await Promise.allSettled([
        fetchMyProjects({ limit: 100 }),
        fetchMyVotes({ limit: 100 }),
        fetchMyContributions({ limit: 100 }),
      ]);

      const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.items : [];
      const votes = votesRes.status === 'fulfilled' ? votesRes.value.items : [];
      const contribs = contribsRes.status === 'fulfilled' ? contribsRes.value.items : [];

      // Calculate reputation breakdown
      const proposalPoints = projects.length * 50;
      const votePoints = votes.length * 10;
      const contributionPoints = contribs.reduce((sum, c) => sum + Math.floor(c.amount * 5), 0);
      const consistencyPoints = Math.min(votes.length * 2, 100); // Max 100 for consistency
      const communityPoints = Math.min((projects.length + contribs.length) * 15, 200);

      const totalScore = proposalPoints + votePoints + contributionPoints + consistencyPoints + communityPoints;
      setReputationScore(totalScore);

      // Calculate level (every 200 points = 1 level)
      const calcLevel = Math.max(1, Math.floor(totalScore / 200) + 1);
      setLevel(calcLevel);
      setNextLevelProgress((totalScore % 200) / 200 * 100);

      // Voting weight based on reputation
      const weight = 1 + Math.min(totalScore / 500, 4); // Max 5x weight
      setVotingWeight(parseFloat(weight.toFixed(2)));

      setBreakdown([
        { category: 'Proposals Created', points: proposalPoints, icon: '📝', description: `${projects.length} proposals × 50 pts` },
        { category: 'Votes Cast', points: votePoints, icon: '🗳️', description: `${votes.length} votes × 10 pts` },
        { category: 'Contributions', points: contributionPoints, icon: '💰', description: `${contribs.length} contributions` },
        { category: 'Consistency', points: consistencyPoints, icon: '📅', description: 'Regular participation bonus' },
        { category: 'Community Impact', points: communityPoints, icon: '🌟', description: 'Projects + contributions impact' },
      ]);

      // Calculate badges
      const allBadges: Badge[] = [
        { id: 'first_vote', name: 'First Vote', icon: '🗳️', description: 'Cast your first vote', earned: votes.length >= 1, earnedAt: votes.length >= 1 ? votes[0]?.created_at || undefined : undefined },
        { id: 'voter_10', name: 'Active Voter', icon: '⚡', description: 'Cast 10 votes', earned: votes.length >= 10 },
        { id: 'voter_50', name: 'Democracy Champion', icon: '🏆', description: 'Cast 50 votes', earned: votes.length >= 50 },
        { id: 'first_proposal', name: 'Innovator', icon: '💡', description: 'Submit your first proposal', earned: projects.length >= 1, earnedAt: projects.length >= 1 ? projects[0]?.created_at || undefined : undefined },
        { id: 'proposal_5', name: 'Visionary', icon: '🔮', description: 'Submit 5 proposals', earned: projects.length >= 5 },
        { id: 'first_contribution', name: 'Supporter', icon: '🤝', description: 'Make your first contribution', earned: contribs.length >= 1, earnedAt: contribs.length >= 1 ? contribs[0]?.created_at || undefined : undefined },
        { id: 'contributor_10', name: 'Patron', icon: '👑', description: 'Make 10 contributions', earned: contribs.length >= 10 },
        { id: 'big_spender', name: 'Whale', icon: '🐋', description: 'Contribute 100+ π total', earned: contribs.reduce((s, c) => s + c.amount, 0) >= 100 },
        { id: 'level_5', name: 'Rising Star', icon: '⭐', description: 'Reach level 5', earned: calcLevel >= 5 },
        { id: 'level_10', name: 'Community Leader', icon: '🌟', description: 'Reach level 10', earned: calcLevel >= 10 },
        { id: 'early_adopter', name: 'Early Adopter', icon: '🚀', description: 'Join in the first month', earned: true, earnedAt: '2026-05-24T00:00:00Z' },
        { id: 'multi_talent', name: 'Multi-Talent', icon: '🎭', description: 'Vote, propose, and contribute', earned: votes.length > 0 && projects.length > 0 && contribs.length > 0 },
      ];
      setBadges(allBadges);
    } catch (err) {
      console.error('Failed to load reputation data:', err);
    } finally {
      setLoading(false);
    }
  }

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ⭐ {t('reputation.title') || 'Reputation System'}
          </h1>
          <p className="text-gray-400">
            {t('reputation.subtitle') || 'Your reputation determines your voting weight and community standing'}
          </p>
        </div>

        {/* Main Score Card */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(51,65,85)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${nextLevelProgress * 2.64} 264`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{reputationScore}</span>
                <span className="text-xs text-gray-400">points</span>
              </div>
            </div>

            {/* Level & Weight Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <span className="text-4xl">🏅</span>
                <div>
                  <p className="text-sm text-gray-400">Level</p>
                  <p className="text-3xl font-bold text-white">{level}</p>
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 inline-block">
                <p className="text-sm text-gray-400 mb-1">{t('reputation.voting_weight') || 'Voting Weight'}</p>
                <p className="text-2xl font-bold text-amber-400">{votingWeight}x</p>
                <p className="text-xs text-gray-500">Your votes count {votingWeight}x more</p>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Level {level}</span>
                  <span>Level {level + 1}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${nextLevelProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.floor(200 - (reputationScore % 200))} points to next level
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📊 {t('reputation.breakdown') || 'Score Breakdown'}</h2>
            <div className="space-y-4">
              {breakdown.map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="text-2xl w-8">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{item.category}</span>
                      <span className="text-sm font-medium text-indigo-400">+{item.points}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min((item.points / Math.max(reputationScore, 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Earn */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🚀 {t('reputation.how_to_earn') || 'How to Earn'}</h2>
            <div className="space-y-3">
              {[
                { action: 'Submit a proposal', points: '+50', icon: '📝' },
                { action: 'Cast a vote', points: '+10', icon: '🗳️' },
                { action: 'Contribute to a project', points: '+5 per π', icon: '💰' },
                { action: 'Complete a quest', points: '+25-100', icon: '🎯' },
                { action: 'Proposal gets approved', points: '+100', icon: '✅' },
                { action: 'Consistent daily activity', points: '+2/day', icon: '📅' },
              ].map((item) => (
                <div key={item.action} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-sm text-gray-300">{item.action}</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-400">{item.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">🏆 {t('reputation.badges') || 'Badges'} ({earnedBadges.length}/{badges.length})</h2>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-emerald-400 font-medium mb-3">✅ Earned</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center hover:scale-105 transition-transform"
                  >
                    <span className="text-3xl block mb-2">{badge.icon}</span>
                    <p className="text-sm font-medium text-white">{badge.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 font-medium mb-3">🔒 Locked</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-4 text-center opacity-50"
                  >
                    <span className="text-3xl block mb-2 grayscale">{badge.icon}</span>
                    <p className="text-sm font-medium text-gray-400">{badge.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {!user && (
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-6 text-center">
            <p className="text-white font-medium mb-2">Connect with Pi Network to track your reputation</p>
            <p className="text-sm text-gray-400">Your votes, proposals, and contributions all build your reputation score.</p>
          </div>
        )}

        {user && (
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/proposals" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
              🗳️ Vote on Proposals
            </Link>
            <Link to="/create" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors">
              📝 Create a Proposal
            </Link>
            <Link to="/funding" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm rounded-lg transition-colors">
              💰 Fund a Project
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}