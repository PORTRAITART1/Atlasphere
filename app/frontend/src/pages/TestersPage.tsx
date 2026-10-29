import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/pi-sdk';

export default function TestersPage() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.uid) setUid(user.uid);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Guide des Testeurs Atlasphere</h1>
        <p className="text-gray-400 mb-8">
          Merci de participer aux tests de paiement Mainnet. Voici les étapes à suivre.
        </p>

        {uid && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-400">Votre UID Pi :</p>
            <p className="font-mono text-indigo-300 select-all break-all">{uid}</p>
          </div>
        )}

        <div className="space-y-6">
          <section className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">📋 Étape 1 : Se connecter</h2>
            <p className="text-gray-300 mb-2">Ouvrez Atlasphere dans Pi Browser et cliquez sur "Connect Pi".</p>
            <p className="text-gray-400 text-sm">Si vous voyez votre UID ci-dessus, la connexion est réussie.</p>
          </section>

          <section className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">💳 Étape 2 : Tester un paiement</h2>
            <p className="text-gray-300 mb-2">Allez sur la page "Funding" et choisissez un projet à financer.</p>
            <p className="text-gray-400 text-sm">Effectuez un petit paiement (ex: 0.01 Pi) et vérifiez que la transaction est approuvée.</p>
          </section>

          <section className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">🐛 Étape 3 : Signaler un bug</h2>
            <p className="text-gray-300 mb-2">Si vous rencontrez une erreur, notez :</p>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
              <li>La page concernée</li>
              <li>Le message d'erreur (si visible)</li>
              <li>Votre UID</li>
            </ul>
            <p className="text-gray-400 text-sm mt-2">Envoyez ces informations à l'équipe Atlasphere.</p>
          </section>
        </div>

        <p className="text-center text-gray-500 text-xs mt-10">
          Merci pour votre aide ! — L'équipe Atlasphere
        </p>
      </div>
    </div>
  );
}
