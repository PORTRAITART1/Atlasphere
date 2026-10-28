import React from 'react';

interface AppAssociation { id: string; name: string; role: string; since: string; }
interface AppAssociationListProps { associations: AppAssociation[]; }

export function AppAssociationList({ associations }: AppAssociationListProps) {
  if (!associations || associations.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Applications associées</h2>
        <p className="text-gray-400 text-sm">Aucune application associée.</p>
      </div>
    );
  }
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Applications associées</h2>
      <div className="space-y-2">
        {associations.map((app) => (
          <div key={app.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-slate-700/30">
            <span className="text-gray-200">{app.name}</span>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{app.role}</span><span>•</span><span>Depuis {app.since}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
