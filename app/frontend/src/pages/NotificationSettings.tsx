import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getNotificationPreferences, type NotificationPreference } from '@/lib/engagement';
import { Bell, Mail, Smartphone, Monitor, Save, Check } from 'lucide-react';

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPreference[]>(getNotificationPreferences());
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'governance', label: '🏛️ Gouvernance' },
    { id: 'ecochain', label: '🌿 EcoChain' },
    { id: 'social', label: '💬 Social' },
    { id: 'gamification', label: '🎮 Gamification' },
  ];

  const filtered = filter === 'all' ? prefs : prefs.filter((p) => p.category === filter);

  const togglePref = (id: string) => {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const toggleChannel = (id: string, channel: 'push' | 'email' | 'inApp') => {
    setPrefs((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, channels: { ...p.channels, [channel]: !p.channels[channel] } } : p
      )
    );
  };

  const handleSave = () => {
    localStorage.setItem('atlasphere_notif_prefs', JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-indigo-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications Personnalisées</h1>
              <p className="text-sm text-gray-400">Choisissez exactement ce que vous voulez recevoir</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </button>
        </div>

        {/* Channel Legend */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 mb-6 flex items-center gap-6">
          <span className="text-sm text-gray-400">Canaux :</span>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-300">Push</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-300">Email</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-300">In-App</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${filter === cat.id ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Preferences List */}
        <div className="space-y-3">
          {filtered.map((pref) => (
            <div key={pref.id} className={`bg-slate-900/60 border rounded-xl p-5 transition-all ${pref.enabled ? 'border-indigo-500/20' : 'border-white/10 opacity-60'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pref.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{pref.label}</h3>
                    <p className="text-xs text-gray-400">{pref.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePref(pref.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${pref.enabled ? 'bg-indigo-500' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${pref.enabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              {pref.enabled && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-4">
                  <span className="text-xs text-gray-500">Canaux :</span>
                  <button
                    onClick={() => toggleChannel(pref.id, 'push')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-colors ${pref.channels.push ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                  >
                    <Smartphone className="w-3 h-3" /> Push
                  </button>
                  <button
                    onClick={() => toggleChannel(pref.id, 'email')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-colors ${pref.channels.email ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                  >
                    <Mail className="w-3 h-3" /> Email
                  </button>
                  <button
                    onClick={() => toggleChannel(pref.id, 'inApp')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-colors ${pref.channels.inApp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                  >
                    <Monitor className="w-3 h-3" /> In-App
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setPrefs((prev) => prev.map((p) => ({ ...p, enabled: true })))}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            Tout activer
          </button>
          <button
            onClick={() => setPrefs((prev) => prev.map((p) => ({ ...p, enabled: false })))}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            Tout désactiver
          </button>
          <button
            onClick={() => setPrefs((prev) => prev.map((p) => ({ ...p, channels: { push: p.enabled, email: false, inApp: p.enabled } })))}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            Mode silencieux (pas d'email)
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}