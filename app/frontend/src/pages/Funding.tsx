import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProposals, type Proposal } from '@/lib/store';
import { getCurrentUser, contributePI, subscribe } from '@/lib/pi-sdk';

export default function Funding() {
  const [user, setUser] = useState(getCurrentUser());
  const [contributedIds, setContributedIds] = useState<Set<string>>(new Set());
  const proposals = getProposals();
  const fundingProposals = proposals.filter((p) => p.status === 'funding' || p.status === 'approved');

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  const handleContribute = async (proposal: Proposal, amount: number) => {
    if (!user) return;
    const success = await contributePI(amount);
    if (success) {
      proposal.fundingRaised += amount;
      proposal.contributors += 1;
      setContributedIds(new Set([...contributedIds, proposal.id]));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Financement Participatif</h1>
          <p className="text-gray-400">Contribuez en Pi aux projets approuvés par la communauté</p>
        </div>

        {/* Banner */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <img
            src="https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-24/pgid75yaagsq/illustration-crowdfunding-growth.png"
            alt="Crowdfunding"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-950/40 flex items-center px-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Investissez dans l&apos;Avenir</h2>
              <p className="text-gray-300 text-sm max-w-md">Chaque Pi investi soutient un projet qui change la vie des Pionniers dans le monde entier.</p>
            </div>
          </div>
        </div>

        {/* Funding Projects */}
        <div className="space-y-6">
          {fundingProposals.map((p) => {
            const percentage = p.fundingGoal > 0 ? (p.fundingRaised / p.fundingGoal) * 100 : 0;
            const hasContributed = contributedIds.has(p.id);

            return (
              <div key={p.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{p.authorAvatar}</span>
                      <Link to={`/proposal/${p.id}`} className="text-lg font-semibold text-white hover:text-indigo-300 transition-colors">
                        {p.title}
                      </Link>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-400 font-medium">{p.fundingRaised.toLocaleString()} π collectés</span>
                        <span className="text-gray-400">Objectif: {p.fundingGoal.toLocaleString()} π</span>
                      </div>
                      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all" style={{ width: `${Math.min(percentage, 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{p.contributors} contributeurs</span>
                        <span>{percentage.toFixed(0)}% atteint</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[160px]">
                    {user && !hasContributed ? (
                      <>
                        <button
                          onClick={() => handleContribute(p, 10)}
                          className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
                        >
                          Contribuer 10 π
                        </button>
                        <button
                          onClick={() => handleContribute(p, 50)}
                          className="px-4 py-2 rounded-lg bg-amber-700 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                        >
                          Contribuer 50 π
                        </button>
                        <button
                          onClick={() => handleContribute(p, 100)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-medium hover:from-amber-500 hover:to-amber-400 transition-all"
                        >
                          Contribuer 100 π
                        </button>
                      </>
                    ) : hasContributed ? (
                      <div className="text-center text-amber-400 text-sm py-2">✓ Merci pour votre contribution !</div>
                    ) : (
                      <div className="text-center text-gray-400 text-sm py-2">Connectez-vous pour contribuer</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {fundingProposals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">💰</div>
            <p className="text-gray-400">Aucun projet en phase de financement pour le moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}