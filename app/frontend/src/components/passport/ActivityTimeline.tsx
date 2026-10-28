import React from 'react';

interface Activity { id: string; type: string; description: string; date: string; }
interface ActivityTimelineProps { activities: Activity[]; }

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Activité récente</h2>
        <p className="text-gray-400 text-sm">Aucune activité enregistrée.</p>
      </div>
    );
  }
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Activité récente</h2>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              {idx < activities.length - 1 && <div className="w-0.5 h-full bg-slate-700 my-1"></div>}
            </div>
            <div className="flex-1 pb-3">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-200">{activity.description}</p>
                <span className="text-xs text-gray-500 ml-2">{activity.date}</span>
              </div>
              <span className="text-xs text-gray-500">{activity.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
