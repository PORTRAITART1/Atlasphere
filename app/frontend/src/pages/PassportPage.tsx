import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/pi-sdk';
import { fetchPassport, PassportData, LEVEL_COLORS } from '@/lib/passport';
import { MOCK_PASSPORT } from '@/data/passport.mock';

import { PassportHeader } from '@/components/passport/PassportHeader';
import { MetricCard } from '@/components/passport/MetricCard';
import { ScoreBreakdown } from '@/components/passport/ScoreBreakdown';
import { RecommendationPanel } from '@/components/passport/RecommendationPanel';
import { EvidenceList } from '@/components/passport/EvidenceList';
import { AppAssociationList } from '@/components/passport/AppAssociationList';
import { ActivityTimeline } from '@/components/passport/ActivityTimeline';

const LEVEL_LABELS: Record<string, string> = {
  novice: 'Novice', active: 'Active', verified: 'Verified',
  trusted: 'Trusted', pioneer: 'Pioneer', flagship: 'Flagship',
};

const MOCK_RECOMMENDATIONS = [
  { id: '1', title: 'Participer à un vote', description: 'Votez sur une proposition active pour gagner des points de gouvernance.', impact: '+10 pts' },
  { id: '2', title: 'Financer un projet', description: 'Contribuez à un projet pour augmenter votre score de contribution.', impact: '+20 pts' },
];

const MOCK_EVIDENCE = [
  { id: '1', type: 'KYC', title: 'Vérification Pi Network', date: '29/04/2026', verified: true },
  { id: '2', type: 'Contribution', title: 'Financement de 5 projets', date: '01/10/2026', verified: true },
];

const MOCK_APPS = [
  { id: '1', name: 'Atlasphere', role: 'Membre', since: 'Avril 2026' },
];

const MOCK_ACTIVITIES = [
  { id: '1', type: 'Vote', description: 'A voté sur "Pi Neural Grid"', date: '25/10/2026' },
  { id: '2', type: 'Contribution', description: 'A financé "Gaia Protocol"', date: '20/10/2026' },
  { id: '3', type: 'Proposition', description: 'A créé "AtlasPulse"', date: '15/10/2026' },
];

export default function PassportPage() {
  const [data, setData] = useState<PassportData | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user?.uid) { setData(MOCK_PASSPORT); setIsMock(true); return; }
    fetchPassport(user.uid).then((d) => {
      if (d) setData(d); else { setData(MOCK_PASSPORT); setIsMock(true); }
    });
  }, []);

  if (!data) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement…</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {isMock && <div className="mb-4 p-2 bg-amber-600/30 text-amber-300 rounded text-sm text-center">Mode démo (profil non connecté)</div>}

        <PassportHeader
          username={data.username}
          score={data.score}
          level={LEVEL_LABELS[data.level]}
          kycVerified={data.kyc_verified}
        />

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <MetricCard label="Votes" value={String(data.votes_cast)} icon="🗳️" />
          <MetricCard label="Projets financés" value={String(data.projects_funded)} icon="💎" />
          <MetricCard label="KYC" value={data.kyc_verified ? 'Vérifié' : 'Non vérifié'} icon="✅" />
          <MetricCard label="Niveau" value={LEVEL_LABELS[data.level]} icon="🏆" />
        </section>

        <section className="mb-8">
          <ScoreBreakdown breakdown={data.breakdown} weights={data.weights} />
        </section>

        <section className="mb-8">
          <RecommendationPanel recommendations={MOCK_RECOMMENDATIONS} />
        </section>

        <section className="mb-8">
          <EvidenceList evidence={MOCK_EVIDENCE} />
        </section>

        <section className="mb-8">
          <AppAssociationList associations={MOCK_APPS} />
        </section>

        <section className="mb-8">
          <ActivityTimeline activities={MOCK_ACTIVITIES} />
        </section>
      </div>
    </div>
  );
}
