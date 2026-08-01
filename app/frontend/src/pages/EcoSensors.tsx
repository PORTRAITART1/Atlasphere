import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getIoTSensors, getDataContributions, type IoTSensor } from '@/lib/eco-data';
import { Wifi, WifiOff, Shield, Database, Zap, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

const TYPE_ICONS: Record<string, string> = {
  air_quality: '🌬️',
  energy: '⚡',
  water: '💧',
  temperature: '🌡️',
  noise: '🔊',
  solar: '☀️',
};

const TYPE_LABELS: Record<string, string> = {
  air_quality: 'Qualité Air',
  energy: 'Énergie',
  water: 'Eau',
  temperature: 'Température',
  noise: 'Bruit',
  solar: 'Solaire',
};

export default function EcoSensors() {
  const [sensors, setSensors] = useState<IoTSensor[]>(getIoTSensors());
  const contributions = getDataContributions();
  const [showAddModal, setShowAddModal] = useState(false);

  const totalDataPoints = sensors.reduce((s, sen) => s + sen.dataPoints, 0);
  const totalEcoEarned = sensors.reduce((s, sen) => s + sen.ecoEarned, 0);
  const activeSensors = sensors.filter((s) => s.status === 'active').length;

  const toggleSensor = (id: string) => {
    setSensors((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wifi className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Capteurs IoT & Données</h1>
              <p className="text-sm text-gray-400">Collectez, anonymisez et monétisez vos données environnementales</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter capteur
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Capteurs actifs</span>
            </div>
            <p className="text-2xl font-bold text-white">{activeSensors}/{sensors.length}</p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Points collectés</span>
            </div>
            <p className="text-2xl font-bold text-white">{(totalDataPoints / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-gray-400">Données partagées</span>
            </div>
            <p className="text-2xl font-bold text-white">{contributions.length}</p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">ECO gagnés</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{totalEcoEarned}</p>
          </div>
        </div>

        {/* Anonymization Banner */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/20 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <Shield className="w-10 h-10 text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Anonymisation AES-256</h3>
              <p className="text-sm text-gray-300">
                Toutes vos données sont automatiquement anonymisées avec un chiffrement AES-256 avant d'être partagées.
                Aucune information personnelle n'est transmise. Vous gardez le contrôle total sur ce que vous partagez.
              </p>
              <div className="flex gap-4 mt-3">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full">🔒 Chiffrement bout-en-bout</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">🛡️ Conforme RGPD</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">📊 Données agrégées uniquement</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sensors List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Mes Capteurs</h2>
            {sensors.map((sensor) => (
              <div key={sensor.id} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{TYPE_ICONS[sensor.type]}</span>
                    <div>
                      <h3 className="font-semibold text-white">{sensor.name}</h3>
                      <p className="text-xs text-gray-400">{TYPE_LABELS[sensor.type]} • {sensor.location}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleSensor(sensor.id)} className="text-gray-400 hover:text-white transition-colors">
                    {sensor.status === 'active' ? (
                      <ToggleRight className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-500" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Statut</p>
                    <p className={`text-xs font-medium ${sensor.status === 'active' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {sensor.status === 'active' ? '● Actif' : '⏸ Pause'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Points</p>
                    <p className="text-xs font-medium text-white">{(sensor.dataPoints / 1000).toFixed(1)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ECO gagnés</p>
                    <p className="text-xs font-medium text-emerald-400">{sensor.ecoEarned}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Précision</p>
                    <p className="text-xs font-medium text-cyan-400">{sensor.accuracy}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contributions History */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Données Partagées
            </h2>
            <div className="space-y-3">
              {contributions.map((c) => {
                const sensor = sensors.find((s) => s.id === c.sensorId);
                return (
                  <div key={c.id} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{sensor?.name || 'Capteur'}</span>
                      <span className="text-xs text-emerald-400 font-medium">+{c.ecoReward} ECO</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{c.dataPoints.toLocaleString()} points</span>
                      <span>•</span>
                      <span>{c.anonymized ? '🔒 Anonymisé' : ''}</span>
                    </div>
                    {c.buyer && (
                      <p className="text-xs text-cyan-400 mt-1">Acheté par : {c.buyer}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-xs text-emerald-300 font-medium">💡 Astuce</p>
              <p className="text-xs text-gray-400 mt-1">Plus vos capteurs sont actifs longtemps, plus vos données ont de valeur sur l'EcoMarket.</p>
            </div>
          </div>
        </div>

        {/* Add Sensor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">Ajouter un capteur</h2>
              <p className="text-sm text-gray-400 mb-4">Connectez un nouveau capteur IoT pour commencer à collecter des données environnementales.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Object.entries(TYPE_ICONS).map(([type, icon]) => (
                  <button key={type} className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-colors">
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm text-white">{TYPE_LABELS[type]}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-4">Capteurs compatibles : Xiaomi Air Monitor, Shelly Energy, Netatmo, Arduino + ESP32, etc.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Annuler</button>
                <button onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium transition-colors">Connecter</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}