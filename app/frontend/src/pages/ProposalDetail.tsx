import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProposalById, getStatusLabel, getStatusColor, getCategoryLabel } from '@/lib/store';
import { getCurrentUser, castVote, contributePI, subscribe } from '@/lib/pi-sdk';

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const proposal = getProposalById(id || '');
  const [user, setUser] = useState(getCurrentUser());
  const [voted, setVoted] = useState(false);
  const [contributed, setContributed] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('10');
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'team'>('overview');

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  if (!proposal) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-gray-400 mb-4">Proposition introuvable</p>
            <Link to="/proposals" className="text-indigo-400 hover:text-indigo-300">← Retour aux propositions</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const votePercentage = proposal.totalVoters > 0 ? (proposal.votesFor / proposal.totalVoters) * 100 : 0;
  const fundingPercentage = proposal.fundingGoal > 0 ? (proposal.fundingRaised / proposal.fundingGoal) * 100 : 0;

  const handleVote = async (voteType: 'for' | 'against') => {
    if (!user) return;
    const success = await castVote();
    if (success) {
      setVoted(true);
      if (voteType === 'for') {
        proposal.votesFor += user.votingPower;
      } else {
        proposal.votesAgainst += user.votingPower;
      }
      proposal.totalVoters += 1;
    }
  };

  const handleContribute = async () => {
    if (!user) return;
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;
    const success = await contributePI(amount);
    if (success) {
      setContributed(true);
      proposal.fundingRaised += amount;
      proposal.contributors += 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/proposals" className="text-indigo-400 hover:text-indigo-300 text-sm mb-6 inline-block">← Retour aux propositions</Link>

        {/* Header */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
              {getStatusLabel(proposal.status)}
            </span>
            <span className="text-sm text-gray-400">{getCategoryLabel(proposal.category)}</span>
            <span className="text-xs text-gray-500 ml-auto">Créé le {proposal.createdAt}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{proposal.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{proposal.authorAvatar}</span>
            <span className="text-gray-300">{proposal.author}</span>
          </div>
          <p className="text-gray-400">{proposal.fullDescription}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
              {(['overview', 'comments', 'team'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'overview' ? 'Aperçu' : tab === 'comments' ? `Commentaires (${proposal.comments.length})` : 'Équipe'}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Jalons du Projet</h3>
                <div className="space-y-4">
                  {proposal.milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${m.completed ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        {m.completed ? <span className="text-white text-xs">✓</span> : <span className="text-gray-400 text-xs">{i + 1}</span>}
                      </div>
                      <div>
                        <div className={`font-medium ${m.completed ? 'text-emerald-400' : 'text-white'}`}>{m.title}</div>
                        <div className="text-sm text-gray-400">{m.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                {proposal.comments.map((c) => (
                  <div key={c.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{c.avatar}</span>
                      <span className="text-sm font-medium text-white">{c.author}</span>
                      <span className="text-xs text-gray-500 ml-auto">{c.date}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{c.text}</p>
                    <div className="mt-2 text-xs text-gray-500">❤️ {c.likes}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'team' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {proposal.team.map((t, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">{t.avatar}</span>
                    <div>
                      <div className="font-medium text-white">{t.name}</div>
                      <div className="text-sm text-gray-400">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting */}
            {proposal.status === 'voting' && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">🗳️ Vote</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Pour: {proposal.votesFor}</span>
                    <span className="text-red-400">Contre: {proposal.votesAgainst}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{ width: `${votePercentage}%` }} />
                    <div className="h-full bg-red-500" style={{ width: `${100 - votePercentage}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 text-center">{proposal.totalVoters} votants • Deadline: {proposal.deadline}</div>
                </div>
                {user && !voted ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleVote('for')} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors">
                      ✓ Pour
                    </button>
                    <button onClick={() => handleVote('against')} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition-colors">
                      ✗ Contre
                    </button>
                  </div>
                ) : voted ? (
                  <div className="text-center text-emerald-400 text-sm py-2">✓ Vote enregistré !</div>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-2">Connectez-vous pour voter</div>
                )}
              </div>
            )}

            {/* Funding */}
            {(proposal.status === 'funding' || proposal.status === 'approved') && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">💰 Financement</h3>
                <div className="space-y-3 mb-4">
                  <div className="text-2xl font-bold text-amber-400">{proposal.fundingRaised.toLocaleString()} π</div>
                  <div className="text-sm text-gray-400">sur {proposal.fundingGoal.toLocaleString()} π objectif</div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: `${Math.min(fundingPercentage, 100)}%` }} />
                  </div>
                  <div className="text-xs text-gray-400">{proposal.contributors} contributeurs</div>
                </div>
                {user && !contributed ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                      placeholder="Montant en Pi"
                    />
                    <button onClick={handleContribute} className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-medium hover:from-amber-500 hover:to-amber-400 transition-all">
                      Contribuer en Pi
                    </button>
                  </div>
                ) : contributed ? (
                  <div className="text-center text-amber-400 text-sm py-2">✓ Contribution enregistrée !</div>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-2">Connectez-vous pour contribuer</div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Informations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Catégorie</span><span className="text-white">{getCategoryLabel(proposal.category)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Créé le</span><span className="text-white">{proposal.createdAt}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Deadline</span><span className="text-white">{proposal.deadline}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Objectif</span><span className="text-white">{proposal.fundingGoal.toLocaleString()} π</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}