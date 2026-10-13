import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Code2, Key, BarChart3, Globe, Lock, Zap } from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  description: string;
  auth: 'api_key' | 'oauth' | 'public';
  rateLimit: string;
  example: string;
}

const endpoints: ApiEndpoint[] = [
  { method: 'GET', path: '/api/v1/eco/climate-data', description: 'Données climatiques agrégées en temps réel (AQI, CO2, température, humidité)', auth: 'api_key', rateLimit: '1000/h', example: '{\n  "region": "paris",\n  "metrics": ["aqi", "co2", "temperature"],\n  "period": "24h"\n}' },
  { method: 'GET', path: '/api/v1/eco/predictions', description: 'Prédictions IA des risques climatiques (inondations, canicules, sécheresses)', auth: 'api_key', rateLimit: '500/h', example: '{\n  "region": "ile-de-france",\n  "type": "heatwave",\n  "horizon": "7d"\n}' },
  { method: 'GET', path: '/api/v1/eco/datasets', description: 'Catalogue des datasets environnementaux disponibles sur l\'EcoMarket', auth: 'public', rateLimit: '2000/h', example: '{\n  "category": "air",\n  "min_datapoints": 100000,\n  "region": "france"\n}' },
  { method: 'POST', path: '/api/v1/eco/datasets/purchase', description: 'Acheter un dataset avec paiement en Pi', auth: 'oauth', rateLimit: '50/h', example: '{\n  "dataset_id": "ds_abc123",\n  "payment_method": "pi",\n  "license": "research"\n}' },
  { method: 'GET', path: '/api/v1/eco/leaderboard', description: 'Classement écologique mondial ou par région', auth: 'public', rateLimit: '2000/h', example: '{\n  "region": "all",\n  "limit": 100,\n  "category": "transport"\n}' },
  { method: 'GET', path: '/api/v1/eco/sensors/aggregate', description: 'Données agrégées et anonymisées de tous les capteurs IoT par zone', auth: 'api_key', rateLimit: '500/h', example: '{\n  "zone": "48.8566,2.3522,10km",\n  "sensor_type": "air_quality",\n  "granularity": "1h"\n}' },
  { method: 'POST', path: '/api/v1/eco/reports/generate', description: 'Générer un rapport environnemental PDF personnalisé', auth: 'oauth', rateLimit: '10/h', example: '{\n  "type": "monthly",\n  "include": ["carbon", "air", "water"],\n  "format": "pdf"\n}' },
];

const pricing = [
  { name: 'Chercheur', price: '0 Pi/mois', requests: '1 000 requêtes/jour', features: ['Données publiques', 'Leaderboard', 'Catalogue datasets'], color: 'border-emerald-500/30' },
  { name: 'Institution', price: '100 Pi/mois', requests: '50 000 requêtes/jour', features: ['Données temps réel', 'Prédictions IA', 'Capteurs agrégés', 'Rapports PDF', 'Support email'], color: 'border-cyan-500/30' },
  { name: 'Entreprise', price: '500 Pi/mois', requests: 'Illimité', features: ['Accès complet', 'SLA 99.9%', 'Données brutes', 'Webhook temps réel', 'Account manager', 'Audit RGPD'], color: 'border-amber-500/30' },
];

export default function EcoApi() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const methodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-500/20 text-emerald-300';
      case 'POST': return 'bg-blue-500/20 text-blue-300';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Code2 className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">API EcoChain</h1>
              <p className="text-sm text-gray-400">Documentation pour chercheurs et institutions</p>
            </div>
          </div>
          <button
            onClick={() => setShowRequestForm(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Key className="w-4 h-4" />
            Demander une clé API
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Globe className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">7</p>
            <p className="text-xs text-gray-400">Endpoints</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <BarChart3 className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">50M+</p>
            <p className="text-xs text-gray-400">Points de données</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Lock className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">AES-256</p>
            <p className="text-xs text-gray-400">Chiffrement</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">&lt;100ms</p>
            <p className="text-xs text-gray-400">Latence moyenne</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Endpoints */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-bold text-white mb-4">Endpoints Disponibles</h2>
            {endpoints.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEndpoint(ep)}
                className={`w-full text-left bg-slate-900/60 border rounded-xl p-4 transition-all hover:border-cyan-500/30 ${selectedEndpoint === ep ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${methodColor(ep.method)}`}>{ep.method}</span>
                  <code className="text-sm text-white font-mono">{ep.path}</code>
                </div>
                <p className="text-xs text-gray-400">{ep.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>Auth : {ep.auth === 'public' ? '🔓 Public' : ep.auth === 'api_key' ? '🔑 API Key' : '🔐 OAuth'}</span>
                  <span>Rate : {ep.rateLimit}</span>
                </div>
              </button>
            ))}

            {/* Code Example */}
            {selectedEndpoint && (
              <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-5 mt-4">
                <h3 className="text-sm font-semibold text-white mb-3">Exemple de requête</h3>
                <pre className="text-xs text-cyan-300 font-mono overflow-x-auto whitespace-pre-wrap bg-black/30 rounded-lg p-4">
{`curl -X ${selectedEndpoint.method} \\
  "https://api.atlaspherepi.eco${selectedEndpoint.path}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${selectedEndpoint.example}'`}
                </pre>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Tarification API</h2>
            <div className="space-y-4">
              {pricing.map((plan) => (
                <div key={plan.name} className={`bg-slate-900/60 border rounded-xl p-5 ${plan.color}`}>
                  <h3 className="font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-lg font-bold text-cyan-400 mb-1">{plan.price}</p>
                  <p className="text-xs text-gray-400 mb-3">{plan.requests}</p>
                  <ul className="space-y-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-center gap-1">
                        <span className="text-emerald-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRequestForm(false)}>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">Demande de clé API</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Nom de l'organisation" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                <input type="email" placeholder="Email professionnel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                  <option value="">Type d'utilisation</option>
                  <option value="research">Recherche académique</option>
                  <option value="ngo">ONG / Association</option>
                  <option value="enterprise">Entreprise</option>
                  <option value="government">Gouvernement</option>
                </select>
                <textarea placeholder="Décrivez votre cas d'usage..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setShowRequestForm(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Annuler</button>
                <button onClick={() => setShowRequestForm(false)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium transition-colors">Soumettre</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}