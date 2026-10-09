import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ClipboardList, CheckCircle2, Clock, Camera, FileText, TrendingUp } from 'lucide-react';
import { fetchAllProjects, type Project } from '@/lib/api';

interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  due_date: string;
  completed_at?: string;
  proof?: { type: 'photo' | 'document' | 'link'; url: string; label: string }[];
  budget: number;
  spent: number;
}

interface TrackedProject extends Project {
  milestones?: ProjectMilestone[];
  updates?: { date: string; text: string; author: string }[];
  author?: string;
  avatar?: string;
}

export default function ProjectTracking() {
  const [trackedProjects, setTrackedProjects] = useState<TrackedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<TrackedProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrackedProjects();
  }, []);

  const loadTrackedProjects = async () => {
    setLoading(true);
    try {
      // Fetch all projects from unified backend
      const result = await fetchAllProjects({ limit: 100 });
      
      if (result?.items && result.items.length > 0) {
        // Filter projects that have tracking data (milestones/updates)
        const tracked = result.items.filter(
          (p) => (p as any).milestones && ((p as any).milestones.length > 0 || (p as any).updates)
        ) as TrackedProject[];
        
        setTrackedProjects(tracked);
        if (tracked.length > 0) {
          setSelectedProject(tracked[0]);
        }
      } else {
        setTrackedProjects([]);
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Failed to load tracked projects:', err);
      setTrackedProjects([]);
      setSelectedProject(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'pending':
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      case 'pending':
      default:
        return 'À venir';
    }
  };

  const getCompletedMilestones = () => {
    if (!selectedProject?.milestones) return 0;
    return selectedProject.milestones.filter((m) => m.status === 'completed').length;
  };

  const getTotalBudgetSpent = () => {
    if (!selectedProject?.milestones) return 0;
    return selectedProject.milestones.reduce((sum, m) => sum + m.spent, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center text-gray-400">Chargement des projets suivis...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedProject || trackedProjects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Suivi des Projets Financés</h1>
          </div>
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-400">Aucun projet suivi avec jalons disponible pour le moment.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all ${
                selectedProject.id === p.id
                  ? 'bg-indigo-600/30 border-indigo-500 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span>{p.avatar || '📊'}</span>
              <span className="text-sm font-medium truncate">{p.title}</span>
            </button>
          ))}
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Financement Total</p>
            <p className="text-2xl font-bold text-white">{(selectedProject.budget || 0).toLocaleString()} π</p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Progression</p>
            <p className="text-2xl font-bold text-emerald-400">{selectedProject.progress || 0}%</p>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${selectedProject.progress || 0}%` }}
              />
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Jalons Complétés</p>
            <p className="text-2xl font-bold text-white">
              {getCompletedMilestones()}/{selectedProject.milestones?.length || 0}
            </p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Budget Utilisé</p>
            <p className="text-2xl font-bold text-yellow-400">{getTotalBudgetSpent().toLocaleString()} π</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestones Timeline */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Jalons du Projet
            </h2>
            {selectedProject.milestones && selectedProject.milestones.length > 0 ? (
              <div className="space-y-6">
                {selectedProject.milestones.map((ms, idx) => (
                  <div key={ms.id} className="relative pl-8">
                    {idx < (selectedProject.milestones?.length ?? 0) - 1 && (
                      <div
                        className={`absolute left-[9px] top-8 w-0.5 h-full ${
                          ms.status === 'completed' ? 'bg-emerald-500/50' : 'bg-white/10'
                        }`}
                      />
                    )}
                    <div className="absolute left-0 top-1">{getStatusIcon(ms.status)}</div>
                    <div
                      className={`bg-white/5 border rounded-xl p-4 ${
                        ms.status === 'in-progress' ? 'border-yellow-500/30' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{ms.title}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            ms.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : ms.status === 'in-progress'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {getStatusLabel(ms.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{ms.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                        <span>Échéance : {new Date(ms.due_date).toLocaleDateString('fr-FR')}</span>
                        {ms.completed_at && (
                          <span className="text-emerald-400">✓ {new Date(ms.completed_at).toLocaleDateString('fr-FR')}</span>
                        )}
                        <span>Budget : {ms.spent.toLocaleString()}/{ms.budget.toLocaleString()} π</span>
                      </div>
                      {ms.proof && ms.proof.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {ms.proof.map((p, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg">
                              {p.type === 'photo' ? (
                                <Camera className="w-3 h-3" />
                              ) : (
                                <FileText className="w-3 h-3" />
                              )}
                              {p.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Aucun jalon disponible</p>
            )}
          </div>

          {/* Updates Feed */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Mises à jour
            </h2>
            {selectedProject.updates && selectedProject.updates.length > 0 ? (
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
            ) : (
              <p className="text-gray-400 text-center py-8">Aucune mise à jour</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
