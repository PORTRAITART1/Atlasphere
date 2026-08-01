import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCommittees } from '@/lib/dao-advanced';
import { Users, FileText, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Committees() {
  const committees = getCommittees();
  const totalMembers = committees.reduce((s, c) => s + c.members, 0);
  const totalProposals = committees.reduce((s, c) => s + c.proposals, 0);
  const totalBudget = committees.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-indigo-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Comités Thématiques</h1>
            <p className="text-sm text-gray-400">Sous-DAOs spécialisées — rejoignez un comité selon votre expertise</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Users className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{totalMembers.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Membres total</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <FileText className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{totalProposals}</p>
            <p className="text-xs text-gray-400">Propositions</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <Wallet className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{totalBudget.toLocaleString()} π</p>
            <p className="text-xs text-gray-400">Budget total</p>
          </div>
        </div>

        {/* Committees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {committees.map((committee) => (
            <div key={committee.id} className={`bg-gradient-to-br ${committee.color} backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{committee.icon}</span>
                <div>
                  <h3 className="font-bold text-white">{committee.name}</h3>
                  <p className="text-xs text-gray-400">Lead : @{committee.lead}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-4">{committee.description}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-black/20 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-white">{committee.members}</p>
                  <p className="text-xs text-gray-500">Membres</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-white">{committee.proposals}</p>
                  <p className="text-xs text-gray-500">Propositions</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-white">{(committee.budget / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500">Budget π</p>
                </div>
              </div>
              <button className="w-full py-2.5 bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2 group-hover:border-white/30">
                Rejoindre <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Delegation Info */}
        <div className="mt-8 bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">🔄 Délégation Automatique</h3>
          <p className="text-sm text-gray-300 mb-3">
            En rejoignant un comité, vos votes sur les propositions de cette thématique sont automatiquement
            délégués aux experts du comité. Vous pouvez toujours voter directement pour annuler la délégation.
          </p>
          <Link to="/delegation" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            Gérer mes délégations →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}