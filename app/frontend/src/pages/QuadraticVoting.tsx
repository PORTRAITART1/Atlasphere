import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getQuadraticProposals, calculateQuadraticCost, calculateQuadraticVotes } from '@/lib/dao-advanced';
import { Vote, Calculator, TrendingUp, Info } from 'lucide-react';

export default function QuadraticVoting() {
  const proposals = getQuadraticProposals();
  const [credits, setCredits] = useState(10);
  const [showCalc, setShowCalc] = useState(false);
  const userCredits = 500;

  const votes = calculateQuadraticVotes(credits);
  const cost = calculateQuadraticCost(votes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Vote className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Gouvernance Quadratique</h1>
              <p className="text-sm text-gray-400">Vote pondéré — coût quadratique pour une démocratie plus juste</p>
            </div>
          </div>
          <button onClick={() => setShowCalc(!showCalc)} className="flex items-center gap-2 bg-purple-600/30 border border-purple-500/50 text-purple-300 px-4 py-2 rounded-xl text-sm hover:bg-purple-600/40 transition-colors">
            <Calculator className="w-4 h-4" />
            Calculateur
          </button>
        </div>

        {/* Explanation Banner */}
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <Info className="w-8 h-8 text-purple-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Comment ça marche ?</h3>
              <p className="text-sm text-gray-300 mb-3">
                Le vote quadratique empêche les "baleines" de dominer. Le coût augmente exponentiellement :
                <strong className="text-purple-300"> 1 vote = 1 crédit, 2 votes = 4 crédits, 5 votes = 25 crédits, 10 votes = 100 crédits</strong>.
                Ainsi, beaucoup de petits votants ont plus d'influence qu'un seul gros détenteur.
              </p>
              <div className="flex gap-4 text-xs">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">📐 Coût = Votes²</span>
                <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">⚖️ Plus équitable</span>
                <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">🛡️ Anti-concentration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator */}
        {showCalc && (
          <div className="bg-slate-900/60 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Prévisualisation du vote</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Crédits à dépenser</label>
                <input type="range" min={1} max={100} value={credits} onChange={(e) => setCredits(Number(e.target.value))} className="w-full accent-purple-500" />
                <p className="text-2xl font-bold text-white mt-2">{credits} crédits</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Votes effectifs</p>
                <p className="text-3xl font-bold text-purple-400">{votes}</p>
                <p className="text-xs text-gray-500 mt-1">√{credits} = {votes} votes</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Coût réel</p>
                <p className="text-3xl font-bold text-amber-400">{cost}</p>
                <p className="text-xs text-gray-500 mt-1">{votes}² = {cost} crédits</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <span>Vos crédits disponibles :</span>
              <span className="text-emerald-400 font-medium">{userCredits}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400">Propositions actives</p>
            <p className="text-2xl font-bold text-white">{proposals.filter((p) => p.status === 'active').length}</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400">Total votants</p>
            <p className="text-2xl font-bold text-white">{proposals.reduce((s, p) => s + p.totalVoters, 0)}</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400">Crédits dépensés</p>
            <p className="text-2xl font-bold text-purple-400">{(proposals.reduce((s, p) => s + p.creditsSpent, 0) / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400">Vos crédits</p>
            <p className="text-2xl font-bold text-emerald-400">{userCredits}</p>
          </div>
        </div>

        {/* Proposals */}
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const total = proposal.votesFor + proposal.votesAgainst;
            const forPct = total > 0 ? (proposal.votesFor / total) * 100 : 50;
            const isActive = proposal.status === 'active';
            return (
              <div key={proposal.id} className={`bg-slate-900/60 backdrop-blur-xl border rounded-xl p-5 transition-all ${isActive ? 'border-purple-500/20 hover:border-purple-500/40' : 'border-white/10 opacity-70'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{proposal.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${proposal.status === 'active' ? 'bg-purple-500/20 text-purple-300' : proposal.status === 'passed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {proposal.status === 'active' ? '🗳️ En cours' : proposal.status === 'passed' ? '✅ Adoptée' : '❌ Rejetée'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{proposal.totalVoters} votants • {proposal.creditsSpent.toLocaleString()} crédits dépensés</p>
                  </div>
                  {isActive && (
                    <span className="text-xs text-gray-400">Fin : {new Date(proposal.deadline).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400">Pour : {proposal.votesFor} votes</span>
                    <span className="text-red-400">Contre : {proposal.votesAgainst} votes</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden flex">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${forPct}%` }} />
                    <div className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all" style={{ width: `${100 - forPct}%` }} />
                  </div>
                </div>
                {isActive && (
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm font-medium hover:bg-emerald-600/30 transition-colors flex items-center justify-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Voter Pour
                    </button>
                    <button className="flex-1 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-xl text-sm font-medium hover:bg-red-600/30 transition-colors">
                      Voter Contre
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}