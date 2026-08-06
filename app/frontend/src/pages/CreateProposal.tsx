import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import PageTransition from '@/components/PageTransition';
import { createProject } from '@/lib/api';
import { getCurrentUser } from '@/lib/pi-sdk';
import { t, subscribeI18n } from '@/lib/i18n';

type Category = 'education' | 'commerce' | 'technology' | 'social' | 'environment';

export default function CreateProposal() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    category: 'technology' as Category,
    fundingGoal: '',
    deadline: '',
    teamMembers: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [, setLang] = useState(0);

  useEffect(() => {
    return subscribeI18n(() => setLang((n) => n + 1));
  }, []);

  const handleApplySuggestion = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError(t('create.error_login'));
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Parse team members into JSON
      const teamArray = formData.teamMembers
        ? formData.teamMembers.split(',').map((name, i) => ({
            name: name.trim(),
            role: i === 0 ? 'Lead' : 'Membre',
            avatar: '👤',
          }))
        : [];

      await createProject({
        title: formData.title,
        description: formData.fullDescription || formData.description,
        category: formData.category,
        budget: parseFloat(formData.fundingGoal) || 0,
        deadline: formData.deadline || undefined,
        team: teamArray.length > 0 ? JSON.stringify(teamArray) : undefined,
        milestones: JSON.stringify([
          { title: 'Phase 1', description: 'Initial setup', completed: false },
          { title: 'Phase 2', description: 'Main development', completed: false },
          { title: 'Phase 3', description: 'Final delivery', completed: false },
        ]),
        status: 'voting',
      });

      setSubmitted(true);
      setTimeout(() => navigate('/proposals'), 2000);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(t('create.error_submit'));
    } finally {
      setSubmitting(false);
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
            >
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('create.login_required')}</h2>
              <p className="text-gray-400">{t('create.login_msg')}</p>
            </motion.div>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="text-center bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('create.submitted_title')}</h2>
            <p className="text-gray-400">{t('create.submitted_desc')}</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <PageTransition>
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">{t('create.title')}</h1>
            <p className="text-gray-400 mb-8">
              {t('create.subtitle')}
            </p>
          </motion.div>

          {error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* AI Assistant */}
          <div className="mb-6">
            <AIAssistant
              title={formData.title}
              description={formData.description}
              fullDescription={formData.fullDescription}
              category={formData.category}
              fundingGoal={formData.fundingGoal}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('create.label_title')}</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder={t('create.placeholder_title')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('create.label_summary')}</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder={t('create.placeholder_summary')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('create.label_description')}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder={t('create.placeholder_description')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('create.label_category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="education">{t('create.cat_education')}</option>
                    <option value="commerce">{t('create.cat_commerce')}</option>
                    <option value="technology">{t('create.cat_technology')}</option>
                    <option value="social">{t('create.cat_social')}</option>
                    <option value="environment">{t('create.cat_environment')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('create.label_budget')}</label>
                  <input
                    type="number"
                    required
                    value={formData.fundingGoal}
                    onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('create.label_deadline')}</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('create.label_team')}</label>
                  <input
                    type="text"
                    value={formData.teamMembers}
                    onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder={t('create.placeholder_team')}
                  />
                </div>
              </div>
            </motion.div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            >
              {submitting ? t('create.submitting') : t('create.submit')}
            </button>
          </form>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}