import React from 'react';

interface PassportHeaderProps {
  username: string;
  score: number;
  level: string;
  kycVerified: boolean;
  onRefresh?: () => void;
}

export function PassportHeader({ username, score, level, kycVerified, onRefresh }: PassportHeaderProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Passeport Atlasphere</h1>
        <p className="text-gray-400 text-sm">@{username} • {kycVerified ? '✅ KYC Validé' : '⚠️ KYC en attente'}</p>
      </div>
      <div className="text-right">
        <p className="text-4xl font-bold text-indigo-400">{score}/100</p>
        <p className="text-sm text-gray-400 uppercase tracking-wider">{level}</p>
        {onRefresh && <button onClick={onRefresh} className="text-xs text-indigo-400 mt-1 hover:underline">Rafraîchir</button>}
      </div>
    </div>
  );
}
