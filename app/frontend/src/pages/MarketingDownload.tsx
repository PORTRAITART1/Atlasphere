import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Package, CheckCircle, Loader2, Image, FileText, AlertCircle } from 'lucide-react';

interface AssetItem {
  name: string;
  url: string;
  folder: string;
}

const MARKETING_ASSETS: AssetItem[] = [
  // Images marketing avec logo
  { name: 'branded-hero-governance-globe.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysajuaaajsq/branded-hero-governance-globe.png', folder: 'images' },
  { name: 'branded-community-voting.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysakiiaajsa/branded-community-voting.png', folder: 'images' },
  { name: 'branded-crowdfunding-pi.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysakyyaajra/branded-crowdfunding-pi.png', folder: 'images' },
  { name: 'branded-ecochain-ai.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysaljiaajta/branded-ecochain-ai.png', folder: 'images' },
  { name: 'branded-reputation-badges.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysalyyaajsq/branded-reputation-badges.png', folder: 'images' },
  { name: 'branded-pi-payments.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysamjiaajsa/branded-pi-payments.png', folder: 'images' },
  { name: 'branded-dao-governance.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysamziaajra/branded-dao-governance.png', folder: 'images' },
  { name: 'branded-quests-rewards.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysanoaaajqq/branded-quests-rewards.png', folder: 'images' },
  { name: 'branded-global-multilingual.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysan6qaajsq/branded-global-multilingual.png', folder: 'images' },
  { name: 'branded-beta-launch-cta.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysaopiaajsa/branded-beta-launch-cta.png', folder: 'images' },
  // Bannières avec logo
  { name: 'branded-banner-governance-flow.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tyscsgiaajrq/branded-banner-governance-flow.png', folder: 'banners' },
  { name: 'branded-banner-pi-payment.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tyscswyaajra/branded-banner-pi-payment.png', folder: 'banners' },
  { name: 'branded-banner-ecochain.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tyscthaaajta/branded-banner-ecochain.png', folder: 'banners' },
  { name: 'branded-banner-community-counter.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tysctxyaajsq/branded-banner-community-counter.png', folder: 'banners' },
  { name: 'branded-banner-main-hero.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tyscujaaajsa/branded-banner-main-hero.png', folder: 'banners' },
  { name: 'branded-banner-feature-grid.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tyscuyqaajra/branded-banner-feature-grid.png', folder: 'banners' },
  { name: 'branded-banner-testimonial.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tyscvjyaajqq/branded-banner-testimonial.png', folder: 'banners' },
  { name: 'branded-banner-urgency-mainnet.png', url: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-03/tyscvzyaajta/branded-banner-urgency-mainnet.png', folder: 'banners' },
];

const DOCS_ASSETS: AssetItem[] = [
  { name: 'MARKETING_PACK_ATLASPHERE.md', url: '/docs/MARKETING_PACK_ATLASPHERE.md', folder: 'docs' },
  { name: 'FEUILLE_DE_ROUTE_MAINNET.md', url: '/docs/FEUILLE_DE_ROUTE_MAINNET.md', folder: 'docs' },
  { name: 'MARKETING_ASSETS_URLS.md', url: '/docs/MARKETING_ASSETS_URLS.md', folder: 'docs' },
];

export default function MarketingDownload() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const downloadAll = async () => {
    setDownloading(true);
    setError('');
    setDone(false);
    setProgress(0);

    const allAssets = [...MARKETING_ASSETS, ...DOCS_ASSETS];
    setTotalFiles(allAssets.length);

    const zip = new JSZip();
    const imgFolder = zip.folder('marketing-pack/images');
    const bannerFolder = zip.folder('marketing-pack/banners');
    const docsFolder = zip.folder('marketing-pack/docs');

    let completed = 0;

    for (const asset of allAssets) {
      setCurrentFile(asset.name);
      try {
        const response = await fetch(asset.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();

        const folder = asset.folder === 'images' ? imgFolder :
                       asset.folder === 'banners' ? bannerFolder : docsFolder;
        folder?.file(asset.name, blob);
      } catch (err) {
        console.warn(`Erreur téléchargement ${asset.name}:`, err);
        // Continue avec les autres fichiers
      }

      completed++;
      setProgress(Math.round((completed / allAssets.length) * 100));
    }

    try {
      setCurrentFile('Création du ZIP...');
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'marketing-pack-atlasphere.zip');
      setDone(true);
    } catch (err) {
      setError('Erreur lors de la création du ZIP. Veuillez réessayer.');
      console.error(err);
    }

    setDownloading(false);
  };

  const downloadSingle = (asset: AssetItem) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const images = MARKETING_ASSETS.filter(a => a.folder === 'images');
  const banners = MARKETING_ASSETS.filter(a => a.folder === 'banners');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Package className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              Pack Marketing Atlasphere
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Téléchargez tous les visuels marketing avec le logo Atlasphere intégré.
            10 images + 8 bannières + documents marketing.
          </p>
        </div>

        {/* Download All Button */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <button
            onClick={downloadAll}
            disabled={downloading}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {downloading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : done ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Download className="w-6 h-6" />
            )}
            {downloading ? 'Téléchargement en cours...' : done ? 'ZIP téléchargé !' : 'Télécharger tout en ZIP'}
          </button>

          {downloading && (
            <div className="w-full max-w-md">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>{currentFile}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-amber-400 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1 text-center">
                {Math.round((progress / 100) * totalFiles)} / {totalFiles} fichiers
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/30 px-4 py-2 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Images Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Image className="w-6 h-6 text-purple-400" />
            Images Marketing ({images.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((asset) => (
              <div key={asset.name} className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all group">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm text-slate-300 truncate flex-1">{asset.name.replace('branded-', '').replace('.png', '')}</span>
                  <button
                    onClick={() => downloadSingle(asset)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Banners Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Image className="w-6 h-6 text-amber-400" />
            Bannières Publicitaires ({banners.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((asset) => (
              <div key={asset.name} className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 transition-all group">
                <div className="aspect-[21/9] relative overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm text-slate-300 truncate flex-1">{asset.name.replace('branded-banner-', '').replace('.png', '')}</span>
                  <button
                    onClick={() => downloadSingle(asset)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documents Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Documents Marketing ({DOCS_ASSETS.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DOCS_ASSETS.map((asset) => (
              <div key={asset.name} className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-emerald-500/50 transition-all">
                <FileText className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-medium text-sm mb-2">{asset.name}</h3>
                <button
                  onClick={() => downloadSingle(asset)}
                  className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Info */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="font-bold text-lg mb-3">📋 Guide d'utilisation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <p className="font-medium text-white mb-1">Pour Fireside :</p>
              <p>Hero Governance Globe + Beta Launch CTA</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Pour Corptime/Corpfm :</p>
              <p>Bannière Feature Grid</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Pour Chat Pi :</p>
              <p>Beta Launch CTA</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Pour Réseaux Sociaux :</p>
              <p>Main Hero, Community Counter, Urgency Mainnet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}