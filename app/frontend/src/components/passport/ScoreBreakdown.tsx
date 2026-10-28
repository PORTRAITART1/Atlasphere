import React from 'react';

interface ScoreBreakdownProps {
  breakdown: Record<string, number>;
  weights: Record<string, number>;
}

const LABELS: Record<string, string> = {
  governance: 'Gouvernance', community_trust: 'Confiance', contribution: 'Contribution',
  verification: 'Vérification', solohost_integration: 'Intégration', risk: 'Risque',
};

export function ScoreBreakdown({ breakdown, weights }: ScoreBreakdownProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Détail du score</h2>
      <div className="space-y-3">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{LABELS[key] || key}</span>
              <span className="text-gray-400">{value} / 100 (poids {weights[key] || 0}%)</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
