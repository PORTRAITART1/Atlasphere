import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProposalCard from '@/components/ProposalCard';
import { getProposals, getPlatformStats } from '@/lib/store';

export default function Index() {
  const stats = getPlatformStats();
  const proposals = getProposals();
  const featured = proposals.filter((p) => p.status === 'voting' || p.status === 'funding').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-24/pgieaoaaagtq/hero-governance-global-community.png"
            alt="PiPolis Governance"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-indigo-300">Gouvernance Décentralisée Active</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Construisez l&apos;Avenir de{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Pi Network
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Votez sur les projets communautaires, financez les initiatives locales, et participez 
              à la gouvernance décentralisée de l&apos;écosystème Pi avec des millions de Pionniers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/proposals"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25"
              >
                Explorer les Propositions
              </Link>
              <Link
                to="/create"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Soumettre un Projet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pionniers Actifs', value: stats.totalPioneers.toLocaleString(), icon: '👥' },
            { label: 'Projets Financés', value: stats.totalFunded.toString(), icon: '🏆' },
            { label: 'Pi Investis', value: `${(stats.totalPiInvested / 1000).toFixed(0)}K π`, icon: '💰' },
            { label: 'Votes Exprimés', value: stats.totalVotesCast.toLocaleString(), icon: '🗳️' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Comment ça fonctionne</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Proposer',
              description: 'Soumettez votre projet avec un plan détaillé, un budget en Pi, et une équipe.',
              image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-24/pgiealqaagra/illustration-global-projects.png',
            },
            {
              step: '02',
              title: 'Voter',
              description: 'La communauté vote. Le pouvoir de vote est pondéré par la réputation.',
              image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-24/pgiea7aaagta/illustration-community-voting.png',
            },
            {
              step: '03',
              title: 'Financer',
              description: 'Les projets approuvés reçoivent du financement participatif en Pi.',
              image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-24/pgid75yaagsq/illustration-crowdfunding-growth.png',
            },
          ].map((item) => (
            <div key={item.step} className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden group hover:border-indigo-500/30 transition-all">
              <div className="h-40 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="text-xs text-indigo-400 font-mono mb-2">ÉTAPE {item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Proposals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Propositions Actives</h2>
          <Link to="/proposals" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}