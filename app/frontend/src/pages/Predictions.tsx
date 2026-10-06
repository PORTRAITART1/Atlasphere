import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getClimatePredictions, getSeverityColor, type ClimatePrediction } from '@/lib/eco-data';
import { createClient } from '@metagptx/web-sdk';

// Lazy client for AI predictions
let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

const TYPE_ICONS: Record<string, string> = {
  flood: '🌊',
  heatwave: '🔥',
  drought: '🏜️',
  storm: '⛈️',
  pollution: '🏭',
  cold: '❄️',
};

function PredictionCard({ prediction }: { prediction: ClimatePrediction }) {
  const [expanded, setExpanded] = useState(false);
  const severityClass = getSeverityColor(prediction.severity);
  const icon = TYPE_ICONS[prediction.type] || '⚠️';

  return (
    <div className={`border rounded-xl p-5 transition-all cursor-pointer ${severityClass}`} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-white">{prediction.title}</h3>
            <p className="text-xs text-gray-400">{prediction.region} • {prediction.timeframe}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${severityClass}`}>
            {prediction.severity === 'low' ? 'Faible' : prediction.severity === 'medium' ? 'Moyen' : prediction.severity === 'high' ? 'Élevé' : 'Critique'}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-300 mb-3">{prediction.description}</p>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">Probabilité :</span>
          <span className="text-xs font-bold text-white">{Math.round(prediction.probability * 100)}%</span>
        </div>
        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"
            style={{ width: `${prediction.probability * 100}%` }}
          />
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <p className="text-xs font-medium text-emerald-400 mb-2">📋 Recommandations :</p>
          <ul className="space-y-1">
            {prediction.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Généré le {new Date(prediction.generatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Predictions() {
  const predictions = getClimatePredictions();
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiAnalysis = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const result = await getClient().ai.gentxt({
        model: 'deepseek-v4-pro',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en climatologie et environnement pour l'application Atlasphere EcoChain AI. Tu analyses les risques climatiques et donnes des recommandations personnalisées. Réponds en français, de manière concise et actionnable. Utilise des emojis pour rendre la réponse plus lisible.`,
          },
          { role: 'user', content: aiQuery },
        ],
      });
      setAiResponse(result.content || 'Aucune réponse générée.');
    } catch (err) {
      console.error('[EcoChain] AI prediction error:', err);
      setAiResponse('❌ Erreur lors de la génération de la prédiction. Veuillez réessayer.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🤖 Prédictions IA Climatiques
          </h1>
          <p className="text-sm text-gray-400 mt-1">Alertes et analyses prédictives alimentées par l'intelligence artificielle</p>
        </div>

        {/* AI Query Section */}
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
            🧠 Demandez à l'IA EcoChain
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Quels sont les risques de sécheresse dans ma région cet été ?"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiAnalysis()}
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
            />
            <button
              onClick={handleAiAnalysis}
              disabled={aiLoading || !aiQuery.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {aiLoading ? '⏳' : '🔍 Analyser'}
            </button>
          </div>

          {aiResponse && (
            <div className="mt-4 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-indigo-400 mb-2 font-medium">💡 Analyse IA :</p>
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{aiResponse}</div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {['Risques d\'inondation cette semaine ?', 'Comment réduire mon empreinte carbone ?', 'Qualité de l\'air prévisions 7 jours'].map((q) => (
              <button
                key={q}
                onClick={() => { setAiQuery(q); }}
                className="text-xs bg-indigo-500/10 text-indigo-300 px-3 py-1.5 rounded-full hover:bg-indigo-500/20 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Predictions List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            ⚠️ Alertes Actives
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">{predictions.length}</span>
          </h2>
        </div>

        <div className="space-y-3">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">ℹ️ Comment fonctionnent les prédictions ?</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Notre moteur d'IA analyse en continu les données environnementales collectées par la communauté Atlasphere,
            combinées aux données satellites et stations météo. Les modèles de machine learning identifient les patterns
            et génèrent des alertes préventives avec un taux de précision de 85%+. Plus vous partagez de données via
            votre EcoWallet, plus les prédictions sont précises pour votre zone géographique.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}