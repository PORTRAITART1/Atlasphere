import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/pi-sdk';
import { fetchMyPassport, setPassportVisibility, type MyPassportData } from '@/lib/passport';

import { PassportHeader } from '@/components/passport/PassportHeader';
import { MetricCard } from '@/components/passport/MetricCard';
import { RecommendationPanel } from '@/components/passport/RecommendationPanel';
import { EvidenceList } from '@/components/passport/EvidenceList';
import { AppAssociationList } from '@/components/passport/AppAssociationList';
import { ActivityTimeline } from '@/components/passport/ActivityTimeline';

const LEVEL_LABELS: Record<string, string> = {
  novice: 'Novice',
  active: 'Active',
  verified: 'Verified',
  trusted: 'Trusted',
  pioneer: 'Pioneer',
  flagship: 'Flagship',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  diamond: 'Diamond',
  platinum: 'Platinum',
};

export default function PassportPage() {
  const [data, setData] = useState<MyPassportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const user = getCurrentUser();

    if (!user?.uid) {
      setError('Connectez-vous avec Pi pour consulter votre passeport.');
      return () => { active = false; };
    }

    fetchMyPassport().then((passport) => {
      if (!active) return;
      if (passport && passport.pi_uid === user.uid) setData(passport);
      else setError('Passeport indisponible. Vérifiez votre connexion Pi et réessayez.');
    });

    return () => { active = false; };
  }, []);

  const handleVisibilityChange = async () => {
    if (!data || savingVisibility) return;
    setSavingVisibility(true);
    setVisibilityMessage(null);
    const nextVisibility = !data.is_public;
    const saved = await setPassportVisibility(data.pi_uid, nextVisibility);
    setSavingVisibility(false);
    if (!saved) {
      setVisibilityMessage('Impossible d’enregistrer ce choix. Réauthentifiez-vous et réessayez.');
      return;
    }
    setData({ ...data, is_public: nextVisibility });
    setVisibilityMessage(nextVisibility
      ? 'Votre passeport public Testnet est activé.'
      : 'Votre passeport public Testnet est désactivé.');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-white">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-3">Passeport Atlasphere</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Chargement du passeport…
      </div>
    );
  }

  const levelLabel = LEVEL_LABELS[data.level] || data.level;
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <PassportHeader
          username={data.username}
          score={data.score}
          level={levelLabel}
        />

        <section className="mb-6 rounded-xl border border-slate-700 bg-slate-800/50 p-5">
          <h2 className="font-semibold text-white">Visibilité publique du passeport (Testnet)</h2>
          <p className="mt-2 text-sm text-gray-400">
            Si vous activez le partage, seuls votre nom Pi, votre score, votre niveau, votre pouvoir de vote, le nombre de votes et le nombre de projets financés seront publics. Aucune donnée KYC, adresse de portefeuille ou activité détaillée n’est publiée.
          </p>
          <button
            type="button"
            onClick={handleVisibilityChange}
            disabled={savingVisibility}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {savingVisibility ? 'Enregistrement…' : data.is_public ? 'Désactiver le partage public' : 'Activer le partage public'}
          </button>
          <span className="ml-3 text-sm text-gray-400">{data.is_public ? 'Actuellement public' : 'Actuellement privé'}</span>
          {visibilityMessage && <p className="mt-3 text-sm text-gray-300">{visibilityMessage}</p>}
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <MetricCard label="Votes" value={String(data.votes_cast)} icon="🗳️" />
          <MetricCard label="Projets financés" value={String(data.projects_funded)} icon="💎" />
          <MetricCard label="Pi verrouillés" value={`${data.pi_locked} π`} icon="🔒" />
          <MetricCard label="Niveau" value={levelLabel} icon="🏆" />
        </section>

        <section className="mb-8">
          <RecommendationPanel recommendations={[]} />
        </section>
        <section className="mb-8">
          <EvidenceList evidence={[]} />
        </section>
        <section className="mb-8">
          <AppAssociationList associations={[]} />
        </section>
        <section className="mb-8">
          <ActivityTimeline activities={[]} />
        </section>
      </div>
    </div>
  );
}
