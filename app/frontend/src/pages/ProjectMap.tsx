import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, subscribeI18n } from '@/lib/i18n';
import { api } from '@/lib/api';

interface MapProject {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  budget: number;
  raised?: number;
  lat: number;
  lng: number;
  city: string;
  country: string;
}

const categoryIcons: Record<string, string> = {
  education: '📚',
  commerce: '🏪',
  technology: '💻',
  social: '🤝',
  environment: '🌍',
};

const categoryColors: Record<string, string> = {
  education: 'bg-indigo-500',
  commerce: 'bg-amber-500',
  technology: 'bg-emerald-500',
  social: 'bg-pink-500',
  environment: 'bg-cyan-500',
};

// Simulated geo coordinates for projects
const geoLocations = [
  { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
  { lat: 33.5731, lng: -7.5898, city: 'Casablanca', country: 'Maroc' },
  { lat: 36.7538, lng: 3.0588, city: 'Alger', country: 'Algérie' },
  { lat: 14.6928, lng: -17.4467, city: 'Dakar', country: 'Sénégal' },
  { lat: 6.5244, lng: 3.3792, city: 'Lagos', country: 'Nigeria' },
  { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya' },
  { lat: 5.6037, lng: -0.187, city: 'Accra', country: 'Ghana' },
  { lat: 34.0209, lng: -6.8416, city: 'Rabat', country: 'Maroc' },
  { lat: 12.6392, lng: -8.0029, city: 'Bamako', country: 'Mali' },
  { lat: 9.0579, lng: 7.4951, city: 'Abuja', country: 'Nigeria' },
];

export default function ProjectMap() {
  const [, setLangTick] = useState(0);
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await api.listAll('projects');
      const items = (res.items || []).map((p: { id: number; title: string; description: string; category: string; status: string; budget: number; raised?: number }, i: number) => {
        const geo = geoLocations[i % geoLocations.length];
        return { ...p, ...geo };
      });
      setProjects(items);
    } catch (err) {
      console.error('Map load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  // Simple map visualization using CSS grid (no external map library needed)
  const mapWidth = 800;
  const mapHeight = 500;

  function projectToPosition(project: MapProject) {
    // Simple Mercator-like projection for Africa/Europe region
    const x = ((project.lng + 20) / 60) * mapWidth;
    const y = ((50 - project.lat) / 55) * mapHeight;
    return { x: Math.max(20, Math.min(mapWidth - 20, x)), y: Math.max(20, Math.min(mapHeight - 20, y)) };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🗺️ {t('map.title') || 'Carte des Projets'}
          </h1>
          <p className="text-gray-400">{t('map.subtitle') || 'Explorez les projets Atlasphere à travers le monde'}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Toutes catégories</option>
            <option value="education">📚 Éducation</option>
            <option value="commerce">🏪 Commerce</option>
            <option value="technology">💻 Technologie</option>
            <option value="social">🤝 Social</option>
            <option value="environment">🌍 Environnement</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Tous statuts</option>
            <option value="voting">🗳️ En vote</option>
            <option value="funding">💰 En financement</option>
            <option value="funded">✅ Financé</option>
            <option value="completed">🏆 Complété</option>
          </select>
          <span className="text-sm text-gray-400 flex items-center">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} affiché{filteredProjects.length > 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="bg-slate-800/40 rounded-xl p-20 animate-pulse flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 relative overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: '62.5%' }}>
                <div className="absolute inset-0">
                  {/* Grid lines */}
                  <svg className="w-full h-full absolute inset-0 opacity-10">
                    {[...Array(10)].map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="white" strokeWidth="0.5" />
                    ))}
                    {[...Array(12)].map((_, i) => (
                      <line key={`v${i}`} x1={`${i * 8.33}%`} y1="0" x2={`${i * 8.33}%`} y2="100%" stroke="white" strokeWidth="0.5" />
                    ))}
                  </svg>

                  {/* Project Markers */}
                  {filteredProjects.map((project) => {
                    const pos = projectToPosition(project);
                    const xPercent = (pos.x / mapWidth) * 100;
                    const yPercent = (pos.y / mapHeight) * 100;
                    return (
                      <motion.button
                        key={project.id}
                        className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-sm shadow-lg cursor-pointer ${categoryColors[project.category] || 'bg-gray-500'} ${selectedProject?.id === project.id ? 'ring-2 ring-white scale-125' : ''}`}
                        style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                        onClick={() => setSelectedProject(project)}
                        whileHover={{ scale: 1.3 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: Math.random() * 0.3 }}
                        title={project.title}
                      >
                        {categoryIcons[project.category] || '📍'}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-700/50">
                {Object.entries(categoryIcons).map(([cat, icon]) => (
                  <span key={cat} className="flex items-center gap-1 text-xs text-gray-400">
                    <span className={`w-3 h-3 rounded-full ${categoryColors[cat]}`} />
                    {icon} {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Project List / Detail */}
            <div className="space-y-4">
              {selectedProject ? (
                <motion.div
                  className="bg-slate-800/60 border border-indigo-500/30 rounded-xl p-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{categoryIcons[selectedProject.category]}</span>
                    <h3 className="text-white font-semibold">{selectedProject.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{selectedProject.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">📍 Localisation</span>
                      <span className="text-white">{selectedProject.city}, {selectedProject.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">📁 Catégorie</span>
                      <span className="text-white capitalize">{selectedProject.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">🔄 Statut</span>
                      <span className="text-white capitalize">{selectedProject.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">💰 Budget</span>
                      <span className="text-amber-400">{selectedProject.budget} π</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">📈 Collecté</span>
                      <span className="text-emerald-400">{selectedProject.raised || 0} π</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/proposal/${selectedProject.id}`}
                      className="flex-1 text-center px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
                    >
                      Voir le projet
                    </Link>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="px-3 py-2 rounded-lg bg-slate-700 text-gray-300 text-sm hover:bg-slate-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 text-center">
                  <p className="text-gray-400 text-sm">👆 Cliquez sur un marqueur pour voir les détails</p>
                </div>
              )}

              {/* Project list */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 max-h-[400px] overflow-y-auto">
                <h4 className="text-white font-medium text-sm mb-3">Tous les projets ({filteredProjects.length})</h4>
                <div className="space-y-2">
                  {filteredProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${selectedProject?.id === p.id ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-slate-800/30 hover:bg-slate-700/30'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{categoryIcons[p.category]}</span>
                        <span className="text-sm text-white flex-1 truncate">{p.title}</span>
                        <span className="text-xs text-gray-500">{p.city}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}