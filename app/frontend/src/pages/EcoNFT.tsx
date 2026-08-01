import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/pi-sdk';

interface EcoNFTItem {
  id: string;
  title: string;
  description: string;
  category: 'air' | 'water' | 'energy' | 'biodiversity' | 'climate';
  dataPoints: number;
  mintDate: string;
  verified: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  owner: string;
  price?: number;
}

const MOCK_NFTS: EcoNFTItem[] = [
  {
    id: 'eco-nft-001',
    title: 'Sentinelle Urbaine #42',
    description: 'Certification de 30 jours de données qualité de l\'air collectées en zone urbaine dense (PM2.5, NO2, O3)',
    category: 'air',
    dataPoints: 86400,
    mintDate: '2026-07-15',
    verified: true,
    rarity: 'rare',
    image: '🌬️',
    owner: 'pioneer_dao',
  },
  {
    id: 'eco-nft-002',
    title: 'Gardien des Eaux #18',
    description: 'Analyses chimiques et bactériologiques de 5 points d\'eau sur 2 mois',
    category: 'water',
    dataPoints: 12000,
    mintDate: '2026-07-01',
    verified: true,
    rarity: 'epic',
    image: '💧',
    owner: 'pioneer_dao',
  },
  {
    id: 'eco-nft-003',
    title: 'Éco-Énergéticien #7',
    description: 'Données de consommation énergétique résidentielle sur 90 jours avec réduction de 25%',
    category: 'energy',
    dataPoints: 259200,
    mintDate: '2026-06-20',
    verified: true,
    rarity: 'legendary',
    image: '⚡',
    owner: 'pioneer_dao',
  },
  {
    id: 'eco-nft-004',
    title: 'Bio-Observateur #156',
    description: 'Inventaire photographique de 50 espèces locales avec géolocalisation',
    category: 'biodiversity',
    dataPoints: 5000,
    mintDate: '2026-07-25',
    verified: false,
    rarity: 'common',
    image: '🌳',
    owner: 'pioneer_dao',
  },
  {
    id: 'eco-nft-005',
    title: 'Climatologue Citoyen #33',
    description: 'Station météo personnelle : température, humidité, pression sur 6 mois',
    category: 'climate',
    dataPoints: 518400,
    mintDate: '2026-05-10',
    verified: true,
    rarity: 'epic',
    image: '🌡️',
    owner: 'eco_researcher_01',
    price: 15,
  },
  {
    id: 'eco-nft-006',
    title: 'Aqua-Sentinel #89',
    description: 'Monitoring continu de la qualité de l\'eau de rivière pendant 45 jours',
    category: 'water',
    dataPoints: 64800,
    mintDate: '2026-06-05',
    verified: true,
    rarity: 'rare',
    image: '🏞️',
    owner: 'green_pioneer_22',
    price: 8,
  },
];

const RARITY_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  common: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Commun' },
  rare: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Rare' },
  epic: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Épique' },
  legendary: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Légendaire' },
};

function NFTCard({ nft, onMint }: { nft: EcoNFTItem; onMint?: (id: string) => void }) {
  const rarity = RARITY_STYLES[nft.rarity];
  const user = getCurrentUser();
  const isOwner = nft.owner === (user?.username || 'pioneer_dao');

  return (
    <div className={`border rounded-2xl p-5 transition-all hover:scale-[1.02] ${rarity.border} ${rarity.bg}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{nft.image}</span>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rarity.text} ${rarity.bg} border ${rarity.border}`}>
            {rarity.label}
          </span>
          {nft.verified && (
            <span className="text-xs text-emerald-400 flex items-center gap-0.5">
              ✅ Vérifié
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm font-bold text-white mb-1">{nft.title}</h3>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{nft.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-black/20 rounded-lg p-2">
          <p className="text-xs text-gray-500">Points de données</p>
          <p className="text-xs font-bold text-white">{(nft.dataPoints / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-black/20 rounded-lg p-2">
          <p className="text-xs text-gray-500">Minté le</p>
          <p className="text-xs font-bold text-white">{new Date(nft.mintDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
        </div>
      </div>

      {/* Action */}
      {isOwner ? (
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
          <span className="text-xs text-gray-400">Vous possédez ce NFT</span>
          <button className="text-xs text-amber-400 hover:text-amber-300 font-medium">
            Mettre en vente
          </button>
        </div>
      ) : nft.price ? (
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
          <div>
            <span className="text-lg font-bold text-amber-400">{nft.price}</span>
            <span className="text-xs text-gray-400 ml-1">Pi</span>
          </div>
          <button
            onClick={() => onMint?.(nft.id)}
            className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg transition-all"
          >
            Acheter
          </button>
        </div>
      ) : (
        <div className="pt-3 border-t border-gray-700/30">
          <span className="text-xs text-gray-500">Non disponible à la vente</span>
        </div>
      )}
    </div>
  );
}

function MintSection({ onMint }: { onMint: () => void }) {
  return (
    <div className="bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-yellow-900/20 border border-amber-500/30 rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            🏗️ Minter un EcoNFT
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Certifiez vos données environnementales comme actif unique sur la blockchain Pi Network.
            Coût : <span className="text-amber-400 font-bold">5 Pi</span> par certification.
          </p>
          <ul className="mt-2 space-y-1">
            <li className="text-xs text-gray-400 flex items-center gap-1">✅ Preuve d'authenticité immuable</li>
            <li className="text-xs text-gray-400 flex items-center gap-1">✅ Revente possible sur EcoMarket</li>
            <li className="text-xs text-gray-400 flex items-center gap-1">✅ Boost de réputation +50 ECO</li>
          </ul>
        </div>
        <button
          onClick={onMint}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
        >
          🎨 Minter mes données
        </button>
      </div>
    </div>
  );
}

function TokenomicsSection() {
  const distribution = [
    { label: 'Récompenses utilisateurs', pct: 40, color: 'bg-emerald-500' },
    { label: 'Équipe & développement', pct: 20, color: 'bg-indigo-500' },
    { label: 'Partenaires chercheurs', pct: 15, color: 'bg-cyan-500' },
    { label: 'Réserve Pi Network', pct: 10, color: 'bg-amber-500' },
    { label: 'Marketing & adoption', pct: 10, color: 'bg-purple-500' },
    { label: 'Liquidité initiale', pct: 5, color: 'bg-pink-500' },
  ];

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-bold text-white mb-1">💰 Tokenomics ECO</h2>
      <p className="text-xs text-gray-400 mb-4">Supply totale : 1 000 000 000 ECO</p>

      <div className="flex h-4 rounded-full overflow-hidden mb-4">
        {distribution.map((d) => (
          <div key={d.label} className={`${d.color} transition-all`} style={{ width: `${d.pct}%` }} title={`${d.label}: ${d.pct}%`} />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {distribution.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${d.color}`} />
            <span className="text-xs text-gray-300">{d.label} ({d.pct}%)</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-700/50">
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-400">$0.50-$2</p>
          <p className="text-xs text-gray-400">Valeur ECO prévue</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-cyan-400">10M</p>
          <p className="text-xs text-gray-400">Utilisateurs cible</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-400">$50M</p>
          <p className="text-xs text-gray-400">Revenus annuels</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-400">$500M-$2B</p>
          <p className="text-xs text-gray-400">Market Cap</p>
        </div>
      </div>
    </div>
  );
}

export default function EcoNFT() {
  const [nfts, setNfts] = useState(MOCK_NFTS);
  const [filter, setFilter] = useState<'all' | 'mine' | 'market'>('all');

  const user = getCurrentUser();
  const username = user?.username || 'pioneer_dao';

  const filtered = nfts.filter((nft) => {
    if (filter === 'mine') return nft.owner === username;
    if (filter === 'market') return nft.price && nft.owner !== username;
    return true;
  });

  const handleMint = () => {
    const newNFT: EcoNFTItem = {
      id: `eco-nft-${Date.now()}`,
      title: `Éco-Collecteur #${Math.floor(Math.random() * 999)}`,
      description: 'Données environnementales fraîchement certifiées sur la blockchain Pi Network',
      category: 'climate',
      dataPoints: Math.floor(Math.random() * 100000) + 10000,
      mintDate: new Date().toISOString().split('T')[0],
      verified: true,
      rarity: ['common', 'rare', 'epic'][Math.floor(Math.random() * 3)] as 'common' | 'rare' | 'epic',
      image: ['🌍', '🌊', '🔬', '📡', '🛰️'][Math.floor(Math.random() * 5)],
      owner: username,
    };
    setNfts((prev) => [newNFT, ...prev]);
    alert(`🎉 EcoNFT "${newNFT.title}" minté avec succès !\n\nCoût : 5 Pi (simulé)\nBonus : +50 ECO`);
  };

  const handleBuy = (id: string) => {
    const nft = nfts.find((n) => n.id === id);
    if (nft) {
      alert(`🛒 Achat simulé : "${nft.title}" pour ${nft.price} Pi\n\nEn production, cela déclenchera un paiement Pi via le SDK.`);
      setNfts((prev) => prev.map((n) => n.id === id ? { ...n, owner: username, price: undefined } : n));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🎨 EcoNFT
          </h1>
          <p className="text-sm text-gray-400 mt-1">Certifiez vos données environnementales comme actifs uniques sur la blockchain</p>
        </div>

        <TokenomicsSection />
        <MintSection onMint={handleMint} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>
            Tous ({nfts.length})
          </button>
          <button onClick={() => setFilter('mine')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'mine' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>
            Mes NFTs ({nfts.filter((n) => n.owner === username).length})
          </button>
          <button onClick={() => setFilter('market')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'market' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>
            Marché ({nfts.filter((n) => n.price && n.owner !== username).length})
          </button>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onMint={handleBuy} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🎨</p>
            <p className="text-gray-400">Aucun NFT dans cette catégorie.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}