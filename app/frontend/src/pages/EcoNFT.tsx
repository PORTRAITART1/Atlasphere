import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/pi-sdk';
import { t, getLocale, useI18nRerender } from '@/lib/i18n';

interface EcoNFTItem {
  id: string;
  titleKey: string;
  descKey: string;
  category: 'air' | 'water' | 'energy' | 'biodiversity' | 'climate';
  dataPoints: number;
  mintDate: string;
  verified: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  owner: string;
  price?: number;
}

const LOCALE_TAGS: Record<string, string> = {
  en: 'en-US',
  ar: 'ar',
  zh: 'zh-CN',
  ru: 'ru-RU',
  fr: 'fr-FR',
  pt: 'pt-BR',
  es: 'es-ES',
};

const MOCK_NFTS: EcoNFTItem[] = [
  {
    id: 'eco-nft-001',
    titleKey: 'nft.1t',
    descKey: 'nft.1d',
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
    titleKey: 'nft.2t',
    descKey: 'nft.2d',
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
    titleKey: 'nft.3t',
    descKey: 'nft.3d',
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
    titleKey: 'nft.4t',
    descKey: 'nft.4d',
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
    titleKey: 'nft.5t',
    descKey: 'nft.5d',
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
    titleKey: 'nft.6t',
    descKey: 'nft.6d',
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

const RARITY_STYLES: Record<string, { bg: string; text: string; border: string; labelKey: string }> = {
  common: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', labelKey: 'nft.r_common' },
  rare: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', labelKey: 'nft.r_rare' },
  epic: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', labelKey: 'nft.r_epic' },
  legendary: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', labelKey: 'nft.r_legendary' },
};

function NFTCard({ nft, onBuy }: { nft: EcoNFTItem; onBuy?: (id: string) => void }) {
  useI18nRerender();

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
            {t(rarity.labelKey)}
          </span>
          {nft.verified && (
            <span className="text-xs text-emerald-400 flex items-center gap-0.5">
              ✅ {t('nft.verified')}
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm font-bold text-white mb-1">{t(nft.titleKey)}</h3>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{t(nft.descKey)}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-black/20 rounded-lg p-2">
          <p className="text-xs text-gray-500">{t('nft.datapoints')}</p>
          <p className="text-xs font-bold text-white">{(nft.dataPoints / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-black/20 rounded-lg p-2">
          <p className="text-xs text-gray-500">{t('nft.minted_on')}</p>
          <p className="text-xs font-bold text-white">
            {new Date(nft.mintDate).toLocaleDateString(LOCALE_TAGS[getLocale()] || 'en-US', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>

      {/* Action */}
      {isOwner ? (
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-700/30">
          <span className="text-xs text-gray-400">{t('nft.you_own')}</span>
          <button className="text-xs text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap">
            {t('nft.list_sale')}
          </button>
        </div>
      ) : nft.price ? (
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
          <div>
            <span className="text-lg font-bold text-amber-400">{nft.price}</span>
            <span className="text-xs text-gray-400 ml-1">Pi</span>
          </div>
          <button
            onClick={() => onBuy?.(nft.id)}
            className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg transition-all"
          >
            {t('nft.buy')}
          </button>
        </div>
      ) : (
        <div className="pt-3 border-t border-gray-700/30">
          <span className="text-xs text-gray-500">{t('nft.not_for_sale')}</span>
        </div>
      )}
    </div>
  );
}

function MintSection({ onMint }: { onMint: () => void }) {
  useI18nRerender();

  return (
    <div className="bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-yellow-900/20 border border-amber-500/30 rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {t('nft.mint_title')}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {t('nft.mint_desc')} <span className="text-amber-400 font-bold">5 Pi</span> {t('nft.mint_desc_end')}
          </p>
          <ul className="mt-2 space-y-1">
            <li className="text-xs text-gray-400 flex items-center gap-1">✅ {t('nft.b1')}</li>
            <li className="text-xs text-gray-400 flex items-center gap-1">✅ {t('nft.b2')}</li>
            <li className="text-xs text-gray-400 flex items-center gap-1">✅ {t('nft.b3')}</li>
          </ul>
        </div>
        <button
          onClick={onMint}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
        >
          {t('nft.mint_cta')}
        </button>
      </div>
    </div>
  );
}

function TokenomicsSection() {
  useI18nRerender();

  const distribution = [
    { key: 'nft.d_rewards', pct: 40, color: 'bg-emerald-500' },
    { key: 'nft.d_team', pct: 20, color: 'bg-indigo-500' },
    { key: 'nft.d_partners', pct: 15, color: 'bg-cyan-500' },
    { key: 'nft.d_reserve', pct: 10, color: 'bg-amber-500' },
    { key: 'nft.d_marketing', pct: 10, color: 'bg-purple-500' },
    { key: 'nft.d_liquidity', pct: 5, color: 'bg-pink-500' },
  ];

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-bold text-white mb-1">{t('nft.tokenomics')}</h2>
      <p className="text-xs text-gray-400 mb-4">{t('nft.supply')}</p>

      <div className="flex h-4 rounded-full overflow-hidden mb-4">
        {distribution.map((d) => (
          <div key={d.key} className={`${d.color} transition-all`} style={{ width: `${d.pct}%` }} title={`${t(d.key)}: ${d.pct}%`} />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {distribution.map((d) => (
          <div key={d.key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${d.color} flex-shrink-0`} />
            <span className="text-xs text-gray-300">{t(d.key)} ({d.pct}%)</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-700/50">
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-400">$0.50-$2</p>
          <p className="text-xs text-gray-400">{t('nft.k_value')}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-cyan-400">10M</p>
          <p className="text-xs text-gray-400">{t('nft.k_users')}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-400">$50M</p>
          <p className="text-xs text-gray-400">{t('nft.k_revenue')}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-400">$500M-$2B</p>
          <p className="text-xs text-gray-400">{t('nft.k_mcap')}</p>
        </div>
      </div>
    </div>
  );
}

export default function EcoNFT() {
  useI18nRerender();

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
      titleKey: 'nft.new_t',
      descKey: 'nft.new_d',
      category: 'climate',
      dataPoints: Math.floor(Math.random() * 100000) + 10000,
      mintDate: new Date().toISOString().split('T')[0],
      verified: true,
      rarity: ['common', 'rare', 'epic'][Math.floor(Math.random() * 3)] as 'common' | 'rare' | 'epic',
      image: ['🌍', '🌊', '🔬', '📡', '🛰️'][Math.floor(Math.random() * 5)],
      owner: username,
    };
    setNfts((prev) => [newNFT, ...prev]);
    alert(`🎉 ${t('nft.new_t')} — ${t('nft.mint_ok')}\n\n${t('nft.mint_ok_detail')}`);
  };

  const handleBuy = (id: string) => {
    const nft = nfts.find((n) => n.id === id);
    if (nft) {
      alert(`🛒 ${t('nft.buy_sim')} "${t(nft.titleKey)}" — ${nft.price} Pi\n\n${t('nft.buy_sim_detail')}`);
      setNfts((prev) => prev.map((n) => n.id === id ? { ...n, owner: username, price: undefined } : n));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {t('nft.title')}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{t('nft.subtitle')}</p>
        </div>

        <TokenomicsSection />
        <MintSection onMint={handleMint} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>
            {t('nft.all')} ({nfts.length})
          </button>
          <button onClick={() => setFilter('mine')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'mine' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>
            {t('nft.mine')} ({nfts.filter((n) => n.owner === username).length})
          </button>
          <button onClick={() => setFilter('market')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'market' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>
            {t('nft.market')} ({nfts.filter((n) => n.price && n.owner !== username).length})
          </button>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onBuy={handleBuy} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🎨</p>
            <p className="text-gray-400">{t('nft.empty')}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}