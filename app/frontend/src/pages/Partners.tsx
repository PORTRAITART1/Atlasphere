import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPartners } from '@/lib/advanced-features';
import { Handshake, ExternalLink, Users, Coins } from 'lucide-react';

export default function Partners() {
  const partners = getPartners();
  const totalPi = partners.reduce((sum, p) => sum + p.piContributed, 0);
  const totalMembers = partners.reduce((sum, p) => sum + p.membersInvolved, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Handshake className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Partenaires & ONG</h1>
            <p className="text-sm text-gray-400">Organisations environnementales partenaires d'Atlasphere</p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{partners.length}</p>
            <p className="text-xs text-gray-400">Partenaires</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{(totalPi / 1000).toFixed(0)}K π</p>
            <p className="text-xs text-gray-400">Pi contribués</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{(totalMembers / 1000).toFixed(1)}K</p>
            <p className="text-xs text-gray-400">Membres impliqués</p>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{partner.logo}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                    {partner.verified && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">✓ Vérifié</span>}
                  </div>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{partner.category}</span>
                  <p className="text-sm text-gray-400 mt-2">{partner.description}</p>
                  <p className="text-xs text-emerald-400 mt-2 font-medium">🌍 Impact : {partner.impact}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <Coins className="w-3 h-3" />{(partner.piContributed / 1000).toFixed(0)}K π
                    </span>
                    <span className="flex items-center gap-1 text-xs text-cyan-400">
                      <Users className="w-3 h-3" />{partner.membersInvolved.toLocaleString()} membres
                    </span>
                    <button className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                      <ExternalLink className="w-3 h-3" /> Site
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-emerald-900/30 to-cyan-900/20 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Votre ONG souhaite rejoindre Atlasphere ?</h3>
          <p className="text-sm text-gray-400 mb-4">Accédez à des données environnementales vérifiées et à une communauté engagée</p>
          <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors">
            Devenir Partenaire
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}