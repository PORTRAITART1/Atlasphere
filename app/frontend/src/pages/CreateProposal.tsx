import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { type Category } from '@/lib/store';

export default function CreateProposal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    category: 'technology' as Category,
    fundingGoal: '',
    deadline: '',
    teamMembers: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/proposals'), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 max-w-md">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Proposition Soumise !</h2>
            <p className="text-gray-400">Votre projet est maintenant en attente de vote par la communauté.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Créer une Proposition</h1>
        <p className="text-gray-400 mb-8">Soumettez votre projet à la communauté pour un vote et un financement.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Titre du Projet *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Ex: PiHealth - Télémédecine Communautaire"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Résumé Court *</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Description en une phrase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description Complète *</label>
              <textarea
                required
                rows={5}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="Décrivez votre projet en détail : objectifs, impact, plan d'exécution..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="education">📚 Éducation</option>
                  <option value="commerce">🛍️ Commerce</option>
                  <option value="technology">💻 Technologie</option>
                  <option value="social">🤝 Social</option>
                  <option value="environment">🌍 Environnement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Budget Demandé (Pi) *</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Deadline de Vote</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Membres de l&apos;Équipe</label>
                <input
                  type="text"
                  value={formData.teamMembers}
                  onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Noms séparés par des virgules"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25"
          >
            Soumettre la Proposition
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}