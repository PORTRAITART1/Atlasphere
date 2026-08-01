import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getIoTAnomalies, type IoTAnomaly } from '@/lib/dao-advanced';
import { AlertTriangle, Bell, CheckCircle2, Shield, Activity } from 'lucide-react';

const SEVERITY_STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '🚨' },
  warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: '⚠️' },
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'ℹ️' },
};

export default function IoTAnomalies() {
  const [anomalies, setAnomalies] = useState(getIoTAnomalies());
  const [filter, setFilter] = useState('all');

  const acknowledge = (id: string) => {
    setAnomalies((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const filtered = filter === 'all' ? anomalies : anomalies.filter((a) => a.severity === filter);
  const unacknowledged = anomalies.filter((a) => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Détection d'Anomalies</h1>
              <p className="text-sm text-gray-400">Alertes intelligentes de vos capteurs IoT</p>
            </div>
          </div>
          {unacknowledged > 0 && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-xl">
              <Bell className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-sm text-red-300 font-medium">{unacknowledged} non lue(s)</span>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <Activity className="w-8 h-8 text-indigo-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">IA de Détection</h3>
              <p className="text-sm text-gray-300">
                Notre IA analyse en continu les données de vos capteurs et détecte automatiquement les anomalies :
                pics de pollution, consommation anormale, fuites, bruit excessif. Vous recevez des alertes instantanées avec des recommandations.
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'Toutes', count: anomalies.length },
            { id: 'critical', label: '🚨 Critiques', count: anomalies.filter((a) => a.severity === 'critical').length },
            { id: 'warning', label: '⚠️ Avertissements', count: anomalies.filter((a) => a.severity === 'warning').length },
            { id: 'info', label: 'ℹ️ Infos', count: anomalies.filter((a) => a.severity === 'info').length },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl border text-sm transition-all ${filter === f.id ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Anomalies List */}
        <div className="space-y-4">
          {filtered.map((anomaly: IoTAnomaly) => {
            const style = SEVERITY_STYLES[anomaly.severity];
            const overThreshold = ((anomaly.value - anomaly.threshold) / anomaly.threshold * 100).toFixed(0);
            return (
              <div key={anomaly.id} className={`${style.bg} border ${style.border} rounded-xl p-5 transition-all ${anomaly.acknowledged ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{style.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{anomaly.title}</h3>
                        {anomaly.acknowledged && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{anomaly.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span>📍 {anomaly.region}</span>
                        <span>📊 {anomaly.value} {anomaly.unit} (seuil: {anomaly.threshold})</span>
                        <span className={style.text}>+{overThreshold}% au-dessus</span>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">💡 Recommandation :</p>
                        <p className="text-sm text-white">{anomaly.recommendation}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-gray-500">{new Date(anomaly.detectedAt).toLocaleString('fr-FR')}</p>
                    {!anomaly.acknowledged && (
                      <button onClick={() => acknowledge(anomaly.id)} className="mt-2 px-3 py-1.5 bg-white/10 border border-white/20 text-white rounded-lg text-xs hover:bg-white/20 transition-colors">
                        Acquitter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Settings */}
        <div className="mt-8 bg-slate-900/60 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Paramètres d'Alerte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
              <span className="text-sm text-gray-300">Notifications push critiques</span>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
              <span className="text-sm text-gray-300">Alertes email quotidiennes</span>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
              <span className="text-sm text-gray-300">Seuil personnalisé PM2.5</span>
              <span className="text-sm text-white font-medium">50 µg/m³</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
              <span className="text-sm text-gray-300">Seuil consommation énergie</span>
              <span className="text-sm text-white font-medium">3.0 kWh/h</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}