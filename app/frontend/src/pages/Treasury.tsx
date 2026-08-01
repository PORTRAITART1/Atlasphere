import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getTreasuryBalance, getTreasuryAllocations, getTreasuryTransactions } from '@/lib/dao-advanced';
import { Wallet, TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Treasury() {
  const balance = getTreasuryBalance();
  const allocations = getTreasuryAllocations();
  const transactions = getTreasuryTransactions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Wallet className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Trésorerie Communautaire</h1>
            <p className="text-sm text-gray-400">Fonds collectifs gérés par la DAO — transparence totale</p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border border-amber-500/30 rounded-2xl p-6">
            <p className="text-sm text-amber-300 mb-1">Solde Total</p>
            <p className="text-4xl font-bold text-white">{balance.total.toLocaleString()} π</p>
            <p className="text-xs text-gray-400 mt-1">≈ ${(balance.total * 35).toLocaleString()} USD</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-1">Alloué</p>
            <p className="text-3xl font-bold text-purple-400">{balance.allocated.toLocaleString()} π</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((balance.allocated / balance.total) * 100)}% du total</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-1">Disponible</p>
            <p className="text-3xl font-bold text-emerald-400">{balance.available.toLocaleString()} π</p>
            <p className="text-xs text-gray-500 mt-1">Pour nouvelles propositions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation Chart */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              Allocation par Catégorie
            </h2>
            <div className="space-y-3">
              {allocations.map((alloc) => (
                <div key={alloc.category} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${alloc.color}`} />
                  <span className="text-sm text-white flex-1">{alloc.category}</span>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${alloc.color}`} style={{ width: `${alloc.percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-400 w-20 text-right">{alloc.amount.toLocaleString()} π</span>
                  <span className="text-xs text-gray-500 w-10 text-right">{alloc.percentage}%</span>
                </div>
              ))}
            </div>

            {/* Vote on Budget */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-amber-300 mb-1">📊 Vote Budget Q4 2026</h3>
              <p className="text-xs text-gray-400 mb-3">La communauté vote sur la réallocation budgétaire chaque trimestre.</p>
              <button className="px-4 py-2 bg-amber-600/30 border border-amber-500/50 text-amber-300 rounded-xl text-sm hover:bg-amber-600/40 transition-colors">
                Participer au vote →
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Dernières Transactions</h2>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    {tx.type === 'income' ? (
                      <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} π
                    </span>
                  </div>
                  <p className="text-xs text-white mb-1">{tx.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(tx.date).toLocaleDateString('fr-FR')}</span>
                    <span>Par : {tx.approvedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}