import React from 'react';

interface Evidence { id: string; type: string; title: string; date: string; verified?: boolean; }
interface EvidenceListProps { evidence: Evidence[]; }

export function EvidenceList({ evidence }: EvidenceListProps) {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Preuves</h2>
        <p className="text-gray-400 text-sm">Aucune preuve enregistrée.</p>
      </div>
    );
  }
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Preuves</h2>
      <div className="space-y-2">
        {evidence.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-slate-700/30">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-gray-300">{item.type}</span>
              <span className="text-gray-200">{item.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{item.date}</span>
              {item.verified && <span className="text-green-400">✅</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
