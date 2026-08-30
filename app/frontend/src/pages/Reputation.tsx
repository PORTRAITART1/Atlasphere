import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, useI18nRerender } from '@/lib/i18n';
import { getCurrentUser, subscribe, type PiUser } from '@/lib/pi-sdk';
import { fetchMyProjects, fetchMyVotes, fetchMyContributions } from '@/lib/api';

interface Badge {
  id: string;
  nameKey: string;
  icon: string;
  descKey: string;
  earned: boolean;
}

interface ReputationBreakdown {
  categoryKey: string;
  points: number;
  icon: string;
  /** Prefix rendered before the localized description (e.g. a count). */
  prefix?: string;
  descKey: string;
}

export default function Reputation() {
  useI18nRerender();

  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
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
        { categoryKey: 'rep.b_proposals', points: proposalPoints, icon: '📝', prefix: `${projects.length} `, descKey: 'rep.d_proposals' },
        { categoryKey: 'rep.b_votes', points: votePoints, icon: '🗳️', prefix: `${votes.length} `, descKey: 'rep.d_votes' },
        { categoryKey: 'rep.b_contribs', points: contributionPoints, icon: '💰', prefix: `${contribs.length} `, descKey: 'rep.d_contribs' },
        { categoryKey: 'rep.b_consistency', points: consistencyPoints, icon: '📅', descKey: 'rep.d_consistency' },
        { categoryKey: 'rep.b_impact', points: communityPoints, icon: '🌟', descKey: 'rep.d_impact' },
      ]);

      // Calculate badges
      const allBadges: Badge[] = [
        { id: 'first_vote', nameKey: 'rep.n1', icon: '🗳️', descKey: 'rep.dd1', earned: votes.length >= 1 },
        { id: 'voter_10', nameKey: 'rep.n2', icon: '⚡', descKey: 'rep.dd2', earned: votes.length >= 10 },
        { id: 'voter_50', nameKey: 'rep.n3', icon: '🏆', descKey: 'rep.dd3', earned: votes.length >= 50 },
        { id: 'first_proposal', nameKey: 'rep.n4', icon: '💡', descKey: 'rep.dd4', earned: projects.length >= 1 },
        { id: 'proposal_5', nameKey: 'rep.n5', icon: '🔮', descKey: 'rep.dd5', earned: projects.length >= 5 },
        { id: 'first_contribution', nameKey: 'rep.n6', icon: '🤝', descKey: 'rep.dd6', earned: contribs.length >= 1 },
        { id: 'contributor_10', nameKey: 'rep.n7', icon: '👑', descKey: 'rep.dd7', earned: contribs.length >= 10 },
        { id: 'big_spender', nameKey: 'rep.n8', icon: '🐋', descKey: 'rep.dd8', earned: contribs.reduce((s, c) => s + c.amount, 0) >= 100 },
        { id: 'level_5', nameKey: 'rep.n9', icon: '⭐', descKey: 'rep.dd9', earned: calcLevel >= 5 },
        { id: 'level_10', nameKey: 'rep.n10', icon: '🌟', descKey: 'rep.dd10', earned: calcLevel >= 10 },
        { id: 'early_adopter', nameKey: 'rep.n11', icon: '🚀', descKey: 'rep.dd11', earned: true },
        { id: 'multi_talent', nameKey: 'rep.n12', icon: '🎭', descKey: 'rep.dd12', earned: votes.length > 0 && projects.length > 0 && contribs.length > 0 },
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

  const earnActions = [
    { key: 'rep.e1', points: '+50', icon: '📝' },
    { key: 'rep.e2', points: '+10', icon: '🗳️' },
    { key: 'rep.e3', points: '+5 / π', icon: '💰' },
    { key: 'rep.e4', points: '+25-100', icon: '🎯' },
    { key: 'rep.e5', points: '+100', icon: '✅' },
    { key: 'rep.e6', points: `+2 ${t('rep.per_day')}`, icon: '📅' },
  ];

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
            ⭐ {t('rep.title')}
          </h1>
          <p className="text-gray-400">{t('rep.subtitle')}</p>
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
                <span className="text-xs text-gray-400">{t('rep.points')}</span>
              </div>
            </div>

            {/* Level & Weight Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <span className="text-4xl">🏅</span>
                <div>
                  <p className="text-sm text-gray-400">{t('rep.level')}</p>
                  <p className="text-3xl font-bold text-white">{level}</p>
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 inline-block">
                <p className="text-sm text-gray-400 mb-1">{t('rep.voting_weight')}</p>
                <p className="text-2xl font-bold text-amber-400">{votingWeight}x</p>
                <p className="text-xs text-gray-500">
                  {t('rep.weight_a')} {votingWeight}x {t('rep.weight_b')}
                </p>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{t('rep.level')} {level}</span>
                  <span>{t('rep.level')} {level + 1}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${nextLevelProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.floor(200 - (reputationScore % 200))} {t('rep.to_next')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📊 {t('rep.breakdown')}</h2>
            <div className="space-y-4">
              {breakdown.map((item) => (
                <div key={item.categoryKey} className="flex items-center gap-3">
                  <span className="text-2xl w-8">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{t(item.categoryKey)}</span>
                      <span className="text-sm font-medium text-indigo-400">+{item.points}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min((item.points / Math.max(reputationScore, 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.prefix || ''}{t(item.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Earn */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🚀 {t('rep.how_to_earn')}</h2>
            <div className="space-y-3">
              {earnActions.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-sm text-gray-300">{t(item.key)}</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-400 whitespace-nowrap">{item.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            🏆 {t('rep.badges')} ({earnedBadges.length}/{badges.length})
          </h2>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-emerald-400 font-medium mb-3">✅ {t('rep.earned')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center hover:scale-105 transition-transform"
                  >
                    <span className="text-3xl block mb-2">{badge.icon}</span>
                    <p className="text-sm font-medium text-white">{t(badge.nameKey)}</p>
                    <p className="text-xs text-gray-400 mt-1">{t(badge.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 font-medium mb-3">🔒 {t('rep.locked')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-4 text-center opacity-50"
                  >
                    <span className="text-3xl block mb-2 grayscale">{badge.icon}</span>
                    <p className="text-sm font-medium text-gray-400">{t(badge.nameKey)}</p>
                    <p className="text-xs text-gray-500 mt-1">{t(badge.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {!user && (
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-6 text-center">
            <p className="text-white font-medium mb-2">{t('rep.cta_title')}</p>
            <p className="text-sm text-gray-400">{t('rep.cta_desc')}</p>
          </div>
        )}

        {user && (
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/proposals" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors">
              🗳️ {t('rep.a_vote')}
            </Link>
            <Link to="/create" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors">
              📝 {t('rep.a_create')}
            </Link>
            <Link to="/funding" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm rounded-lg transition-colors">
              💰 {t('rep.a_fund')}
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}