import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDefaultWidgets, getEngagementStreak, getEngagementLevel, type DashboardWidget } from '@/lib/engagement';
import { getEcoScore, getEcoBalance, getWeeklyGoals } from '@/lib/eco-data';
import { getCurrentSeason as getSeason } from '@/lib/dao-advanced';
import { LayoutGrid, Settings2, Eye, EyeOff, GripVertical, Save, Check } from 'lucide-react';

function WidgetContent({ widgetId }: { widgetId: string }) {
  const ecoScore = getEcoScore();
  const balance = getEcoBalance();
  const goals = getWeeklyGoals();
  const streak = getEngagementStreak();
  const level = getEngagementLevel();
  const season = getSeason();

  switch (widgetId) {
    case 'eco-score':
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-emerald-400">{ecoScore.total}</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">{ecoScore.rank}</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {Object.entries(ecoScore.breakdown).map(([key, val]) => (
              <div key={key} className="text-center">
                <div className="h-12 bg-gray-700 rounded-sm overflow-hidden flex flex-col-reverse">
                  <div className="bg-emerald-500/60 rounded-sm" style={{ height: `${val}%` }} />
                </div>
                <span className="text-[10px] text-gray-500 capitalize">{key.slice(0, 4)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'wallet':
      return (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">ECO</span>
            <span className="text-sm font-bold text-emerald-400">{balance.eco}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Pi</span>
            <span className="text-sm font-bold text-amber-400">{balance.pi}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Streak</span>
            <span className="text-sm font-bold text-purple-400">{streak.current}j 🔥</span>
          </div>
        </div>
      );
    case 'weekly-goals':
      return (
        <div className="space-y-2">
          {goals.slice(0, 3).map((g) => {
            const pct = Math.min((g.current / g.target) * 100, 100);
            return (
              <div key={g.id}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-300">{g.title}</span>
                  <span className="text-gray-500">{g.current}/{g.target}</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    case 'guild-status':
      return (
        <div className="text-center">
          <span className="text-2xl">🌿</span>
          <p className="text-sm font-medium text-white mt-1">Les Gardiens Verts</p>
          <p className="text-xs text-gray-400">Rang #1 • Niv. 8</p>
          <p className="text-xs text-emerald-400 mt-1">Score: 892</p>
        </div>
      );
    case 'season-progress':
      return (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span>{season.icon}</span>
            <span className="text-sm text-white font-medium">{season.name}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '56%' }} />
          </div>
          <p className="text-xs text-gray-400">4 200 / 7 000 XP → Tier Or</p>
        </div>
      );
    case 'notifications':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs"><span>🗳️</span><span className="text-gray-300">Nouveau vote disponible</span></div>
          <div className="flex items-center gap-2 text-xs"><span>🌿</span><span className="text-gray-300">+25 ECO reçus</span></div>
          <div className="flex items-center gap-2 text-xs"><span>🛡️</span><span className="text-gray-300">Défi guilde terminé !</span></div>
        </div>
      );
    case 'climate-alerts':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs"><span>🚨</span><span className="text-red-300">Pic PM2.5 - Paris 11e</span></div>
          <div className="flex items-center gap-2 text-xs"><span>⚠️</span><span className="text-yellow-300">Conso énergie +40%</span></div>
        </div>
      );
    case 'leaderboard':
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-xs"><span className="text-gray-300">🥇 GreenMaster</span><span className="text-emerald-400">982</span></div>
          <div className="flex justify-between text-xs"><span className="text-gray-300">🥈 EcoWarrior42</span><span className="text-emerald-400">956</span></div>
          <div className="flex justify-between text-xs"><span className="text-indigo-300">6. Vous</span><span className="text-emerald-400">742</span></div>
        </div>
      );
    case 'sensors':
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-xs"><span className="text-gray-300">🌬️ Air Salon</span><span className="text-emerald-400">● Actif</span></div>
          <div className="flex justify-between text-xs"><span className="text-gray-300">⚡ Énergie</span><span className="text-emerald-400">● Actif</span></div>
          <div className="flex justify-between text-xs"><span className="text-gray-300">☀️ Solaire</span><span className="text-emerald-400">● Actif</span></div>
        </div>
      );
    default:
      return <p className="text-xs text-gray-500">Widget en cours de développement</p>;
  }
}

export default function CustomDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(getDefaultWidgets());
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const enabledWidgets = widgets.filter((w) => w.enabled).sort((a, b) => a.order - b.order);

  const toggleWidget = (id: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)));
  };

  const handleSave = () => {
    localStorage.setItem('atlasphere_dashboard_widgets', JSON.stringify(widgets));
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Mon Tableau de Bord</h1>
              <p className="text-sm text-gray-400">Personnalisez les informations affichées</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${editMode ? 'bg-amber-600/30 border border-amber-500/50 text-amber-300' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}`}
            >
              <Settings2 className="w-4 h-4" />
              {editMode ? 'Mode édition' : 'Personnaliser'}
            </button>
            {editMode && (
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors">
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                Sauvegarder
              </button>
            )}
          </div>
        </div>

        {/* Edit Panel */}
        {editMode && (
          <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-amber-300 mb-3">Widgets disponibles — cliquez pour activer/désactiver</h3>
            <div className="flex flex-wrap gap-2">
              {widgets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => toggleWidget(w.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${w.enabled ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'bg-white/5 border border-white/10 text-gray-500'}`}
                >
                  {w.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{w.icon} {w.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enabledWidgets.map((widget) => (
            <div
              key={widget.id}
              className={`bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-cyan-500/20 transition-all ${widget.size === 'large' ? 'sm:col-span-2 lg:col-span-2' : widget.size === 'medium' ? 'sm:col-span-1 lg:col-span-1' : ''} ${editMode ? 'ring-1 ring-amber-500/20' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>{widget.icon}</span>
                  {widget.title}
                </h3>
                {editMode && <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />}
              </div>
              <WidgetContent widgetId={widget.id} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}