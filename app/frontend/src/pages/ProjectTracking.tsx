import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ClipboardList, CheckCircle2, Clock, Camera, FileText, TrendingUp } from 'lucide-react';

interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  completedAt?: string;
  proof?: { type: 'photo' | 'document' | 'link'; url: string; label: string }[];
  budget: number;
  spent: number;
}

interface TrackedProject {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: string;
  totalFunding: number;
  progress: number;
  milestones: ProjectMilestone[];
  updates: { date: string; text: string; author: string }[];
}

const trackedProjects: TrackedProject[] = [
  {
    id: '1',
    title: 'Pi Academy - Éducation Blockchain',
    author: 'EduPioneer',
    avatar: '👨‍🏫',
    category: 'education',
    totalFunding: 50000,
    progress: 65,
    milestones: [
      { id: 'ms1', title: 'Plateforme en ligne', description: 'Développement du site web éducatif', status: 'completed', dueDate: '2026-06-01', completedAt: '2026-05-28', proof: [{ type: 'link', url: '#', label: 'pi-academy.app' }], budget: 15000, spent: 14200 },
      { id: 'ms2', title: 'Modules 1-5', description: 'Création des 5 premiers modules de cours', status: 'completed', dueDate: '2026-07-01', completedAt: '2026-06-25', proof: [{ type: 'document', url: '#', label: 'Rapport modules.pdf' }, { type: 'photo', url: '#', label: 'Screenshots cours' }], budget: 20000, spent: 18500 },
      { id: 'ms3', title: 'Modules 6-10 + Quiz', description: 'Modules avancés avec système de quiz interactif', status: 'in-progress', dueDate: '2026-08-15', budget: 10000, spent: 4200 },
      { id: 'ms4', title: 'Certifications On-Chain', description: 'Système de certification blockchain', status: 'pending', dueDate: '2026-09-30', budget: 5000, spent: 0 },
    ],
    updates: [
      { date: '2026-07-30', text: 'Module 7 terminé ! Plus que 3 modules avant la certification.', author: 'EduPioneer' },
      { date: '2026-07-20', text: 'Nouveau partenariat avec l\'Université de Genève pour la validation des contenus.', author: 'EduPioneer' },
      { date: '2026-07-01', text: '500 étudiants inscrits en 1 mois ! Objectif dépassé de 200%.', author: 'CryptoLearner' },
    ],
  },
  {
    id: '3',
    title: 'Pi Commerce Hub',
    author: 'ShopPioneer',
    avatar: '🛒',
    category: 'commerce',
    totalFunding: 75000,
    progress: 40,
    milestones: [
      { id: 'ms5', title: 'MVP Marketplace', description: 'Plateforme de base avec listing produits', status: 'completed', dueDate: '2026-06-15', completedAt: '2026-06-10', proof: [{ type: 'link', url: '#', label: 'pi-commerce.app' }], budget: 25000, spent: 23000 },
      { id: 'ms6', title: 'Intégration Pi Payments', description: 'Paiements en Pi pour achats/ventes', status: 'in-progress', dueDate: '2026-08-01', budget: 20000, spent: 8000 },
      { id: 'ms7', title: 'App Mobile', description: 'Application mobile iOS/Android', status: 'pending', dueDate: '2026-10-01', budget: 20000, spent: 0 },
      { id: 'ms8', title: 'Réseau 50 marchands', description: 'Onboarding de 50 marchands locaux', status: 'pending', dueDate: '2026-11-01', budget: 10000, spent: 0 },
    ],
    updates: [
      { date: '2026-07-28', text: '12 marchands actifs ! Objectif intermédiaire de 15 pour fin juillet.', author: 'ShopPioneer' },
      { date: '2026-07-15', text: 'Première transaction réelle en Pi effectuée sur la plateforme !', author: 'TradeExpert' },
    ],
  },
];

export default function ProjectTracking() {
  const [selectedProject, setSelectedProject] = useState<TrackedProject>(trackedProjects[0]);

  const getStatusIcon = (status: ProjectMilestone['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'pending': return <div className="w-5 h-5 rounded-full border-2 border-gray-500" />;
    }
  };

  const getStatusLabel = (status: ProjectMilestone['status']) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'pending': return 'À venir';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Suivi des Projets Financés</h1>
        </div>

        {/* Project Selector */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {trackedProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all ${selectedProject.id === p.id ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <span>{p.avatar}</span>
              <span className="text-sm font-medium">{p.title}</span>
            </button>
          ))}
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Financement Total</p>
            <p className="text-2xl font-bold text-white">{selectedProject.totalFunding.toLocaleString()} π</p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Progression</p>
            <p className="text-2xl font-bold text-emerald-400">{selectedProject.progress}%</p>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${selectedProject.progress}%` }} />
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Jalons Complétés</p>
            <p className="text-2xl font-bold text-white">
              {selectedProject.milestones.filter((m) => m.status === 'completed').length}/{selectedProject.milestones.length}
            </p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Budget Utilisé</p>
            <p className="text-2xl font-bold text-yellow-400">
              {selectedProject.milestones.reduce((s, m) => s + m.spent, 0).toLocaleString()} π
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestones Timeline */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Jalons du Projet
            </h2>
            <div className="space-y-6">
              {selectedProject.milestones.map((ms, idx) => (
                <div key={ms.id} className="relative pl-8">
                  {idx < selectedProject.milestones.length - 1 && (
                    <div className={`absolute left-[9px] top-8 w-0.5 h-full ${ms.status === 'completed' ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                  )}
                  <div className="absolute left-0 top-1">{getStatusIcon(ms.status)}</div>
                  <div className={`bg-white/5 border rounded-xl p-4 ${ms.status === 'in-progress' ? 'border-yellow-500/30' : 'border-white/5'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{ms.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ms.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : ms.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-400'}`}>
                        {getStatusLabel(ms.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{ms.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Échéance : {new Date(ms.dueDate).toLocaleDateString('fr-FR')}</span>
                      {ms.completedAt && <span className="text-emerald-400">✓ {new Date(ms.completedAt).toLocaleDateString('fr-FR')}</span>}
                      <span>Budget : {ms.spent.toLocaleString()}/{ms.budget.toLocaleString()} π</span>
                    </div>
                    {ms.proof && ms.proof.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {ms.proof.map((p, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg">
                            {p.type === 'photo' ? <Camera className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            {p.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Updates Feed */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Mises à jour
            </h2>
            <div className="space-y-4">
              {selectedProject.updates.map((update, idx) => (
                <div key={idx} className="border-l-2 border-purple-500/50 pl-4 py-2">
                  <p className="text-sm text-white/90">{update.text}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>{update.author}</span>
                    <span>•</span>
                    <span>{new Date(update.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}