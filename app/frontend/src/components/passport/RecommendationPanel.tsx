import React from 'react';

interface Recommendation { id: string; title: string; description: string; impact: string; action?: string; }
interface RecommendationPanelProps { recommendations: Recommendation[]; }

export function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Recommandations</h2>
        <p className="text-gray-400 text-sm">Aucune recommandation pour le moment.</p>
      </div>
    );
  }
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Recommandations</h2>
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-semibold text-white">{rec.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{rec.impact}</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{rec.description}</p>
            {rec.action && <button className="text-xs text-indigo-400 hover:underline">{rec.action} →</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
