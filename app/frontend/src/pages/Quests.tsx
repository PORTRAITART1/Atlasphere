import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@metagptx/web-sdk';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { getCurrentUser, subscribe } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';

let _client: ReturnType<typeof createClient> | null = null;
function getClient() { if (!_client) _client = createClient(); return _client; }

interface Quest {
  id: number;
  quest_id: string;
  title: string;
  description: string;
  quest_type: string;
  requirement_type: string;
  requirement_target: number;
  reward_reputation: number;
  reward_pi_amount: number;
  reward_badge: string | null;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

const questTypeColors: Record<string, string> = {
  daily: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  weekly: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  milestone: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  one_time: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const questTypeIcons: Record<string, string> = {
  daily: '📅',
  weekly: '📆',
  milestone: '🏆',
  one_time: '⭐',
};

export default function Quests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [user, setUser] = useState(getCurrentUser());
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  useEffect(() => {
    loadQuests();
  }, [user]);

  const loadQuests = async () => {
    setLoading(true);
    try {
      const piUid = user?.uid || '';
      const response = await getClient().apiCall.invoke({
        url: '/api/v1/quests/available',
        method: 'GET',
        data: { pi_uid: piUid },
      });
      if (response?.data?.quests) {
        setQuests(response.data.quests);
      }
    } catch (error) {
      console.error('Failed to load quests:', error);
      // Fallback mock data for demo
      setQuests([
        { id: 1, quest_id: 'first_vote', title: 'Premier Vote', description: 'Votez pour la première fois', quest_type: 'one_time', requirement_type: 'vote_count', requirement_target: 1, reward_reputation: 50, reward_pi_amount: 0, reward_badge: 'voter_bronze', progress: 0, completed: false, claimed: false },
        { id: 2, quest_id: 'daily_voter', title: 'Votant Quotidien', description: 'Votez au moins une fois aujourd\'hui', quest_type: 'daily', requirement_type: 'vote_count', requirement_target: 1, reward_reputation: 10, reward_pi_amount: 0, reward_badge: null, progress: 0, completed: false, claimed: false },
        { id: 3, quest_id: 'funder_10', title: 'Contributeur Bronze', description: 'Contribuez 10 π aux projets', quest_type: 'milestone', requirement_type: 'fund_amount', requirement_target: 10, reward_reputation: 50, reward_pi_amount: 0, reward_badge: 'funder_bronze', progress: 3, completed: false, claimed: false },
        { id: 4, quest_id: 'streak_7', title: 'Semaine Active', description: '7 jours consécutifs d\'activité', quest_type: 'weekly', requirement_type: 'streak_days', requirement_target: 7, reward_reputation: 100, reward_pi_amount: 0, reward_badge: 'streak_7', progress: 4, completed: false, claimed: false },
        { id: 5, quest_id: 'voter_10', title: 'Votant Actif', description: 'Votez sur 10 propositions', quest_type: 'milestone', requirement_type: 'vote_count', requirement_target: 10, reward_reputation: 150, reward_pi_amount: 0, reward_badge: 'voter_silver', progress: 7, completed: false, claimed: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (questId: string) => {
    if (!user) return;
    setClaiming(questId);
    try {
      await getClient().apiCall.invoke({
        url: '/api/v1/quests/claim',
        method: 'POST',
        data: { quest_id: questId, pi_uid: user.uid },
      });
      // Update local state
      setQuests(prev => prev.map(q =>
        q.quest_id === questId ? { ...q, claimed: true } : q
      ));
    } catch (error) {
      console.error('Failed to claim quest:', error);
    } finally {
      setClaiming(null);
    }
  };

  const filteredQuests = filter === 'all'
    ? quests
    : quests.filter(q => q.quest_type === filter);

  const getQuestTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      daily: t('quests.daily'),
      weekly: t('quests.weekly'),
      milestone: t('quests.milestone'),
      one_time: t('quests.one_time'),
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <PageTransition>
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              🎯 {t('quests.title')}
            </h1>
            <p className="text-gray-400">
              Complétez des quêtes pour gagner de la réputation et des badges
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            className="flex flex-wrap gap-2 justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {['all', 'daily', 'weekly', 'milestone', 'one_time'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/50 text-gray-400 hover:text-white border border-slate-700/50'
                }`}
              >
                {type === 'all' ? t('common.all') : `${questTypeIcons[type] || ''} ${getQuestTypeLabel(type)}`}
              </button>
            ))}
          </motion.div>

          {/* Quests Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-400">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuests.map((quest, i) => {
                const progressPercent = Math.min((quest.progress / quest.requirement_target) * 100, 100);
                return (
                  <motion.div
                    key={quest.quest_id}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-indigo-500/30 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Quest Type Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs border ${questTypeColors[quest.quest_type] || 'bg-slate-700 text-gray-300'}`}>
                        {questTypeIcons[quest.quest_type]} {getQuestTypeLabel(quest.quest_type)}
                      </span>
                      {quest.completed && !quest.claimed && (
                        <span className="text-emerald-400 text-xs font-medium animate-pulse">✓ Prête !</span>
                      )}
                      {quest.claimed && (
                        <span className="text-gray-500 text-xs">✓ {t('quests.claimed')}</span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-semibold text-white mb-1">{quest.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{t('quests.progress')}</span>
                        <span>{quest.progress}/{quest.requirement_target}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${quest.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                        />
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {quest.reward_reputation > 0 && (
                        <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">
                          +{quest.reward_reputation} ⭐
                        </span>
                      )}
                      {quest.reward_pi_amount > 0 && (
                        <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full">
                          +{quest.reward_pi_amount} π
                        </span>
                      )}
                      {quest.reward_badge && (
                        <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-full">
                          🏅 {quest.reward_badge}
                        </span>
                      )}
                    </div>

                    {/* Claim Button */}
                    {quest.completed && !quest.claimed && (
                      <button
                        onClick={() => handleClaim(quest.quest_id)}
                        disabled={claiming === quest.quest_id}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-sm hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50"
                      >
                        {claiming === quest.quest_id ? '...' : `🎁 ${t('quests.claim')}`}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
}