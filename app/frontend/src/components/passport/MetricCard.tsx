import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export function MetricCard({ label, value, icon, color = 'text-indigo-400' }: MetricCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
