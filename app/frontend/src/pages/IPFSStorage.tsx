import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getIPFSFiles, getIPFSStats, type IPFSFile } from '@/lib/advanced-features';
import { HardDrive, Pin, Eye, Copy, ExternalLink, Search, Upload } from 'lucide-react';

export default function IPFSStorage() {
  const files = getIPFSFiles();
  const stats = getIPFSStats();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.cid.includes(search);
    const matchType = filterType === 'all' || f.type === filterType;
    return matchSearch && matchType;
  });

  const typeColors: Record<string, string> = {
    'sensor-data': 'bg-cyan-500/20 text-cyan-300',
    'eco-nft': 'bg-purple-500/20 text-purple-300',
    report: 'bg-amber-500/20 text-amber-300',
    certificate: 'bg-emerald-500/20 text-emerald-300',
    dataset: 'bg-blue-500/20 text-blue-300',
  };

  const typeLabels: Record<string, string> = {
    'sensor-data': '📡 Capteur',
    'eco-nft': '🎨 NFT',
    report: '📊 Rapport',
    certificate: '📜 Certificat',
    dataset: '📁 Dataset',
  };

  const handleCopy = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setCopied(cid);
    setTimeout(() => setCopied(null), 2000);
  };

  const storagePct = (stats.storageUsed / stats.storageMax) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <HardDrive className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Stockage Décentralisé IPFS</h1>
            <p className="text-sm text-gray-400">Vos données environnementales sur le réseau distribué</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.totalFiles}</p>
            <p className="text-xs text-gray-400">Fichiers</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">{stats.totalSize}</p>
            <p className="text-xs text-gray-400">Stocké</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{stats.pinnedFiles}</p>
            <p className="text-xs text-gray-400">Épinglés</p>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.totalAccess.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Accès totaux</p>
          </div>
        </div>

        {/* Storage Bar */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Espace utilisé</span>
            <span className="text-cyan-400">{stats.storageUsed} MB / {stats.storageMax} MB</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${storagePct}%` }} />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par nom ou CID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'sensor-data', 'eco-nft', 'report', 'certificate', 'dataset'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap border transition-all ${filterType === t ? 'bg-cyan-600/30 border-cyan-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              >
                {t === 'all' ? '📂 Tous' : typeLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Button */}
        <button className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium transition-colors">
          <Upload className="w-4 h-4" />
          Uploader sur IPFS
        </button>

        {/* Files List */}
        <div className="space-y-3">
          {filtered.map((file: IPFSFile) => (
            <div key={file.id} className="bg-slate-900/60 border border-white/10 rounded-xl p-4 hover:border-cyan-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-white truncate">{file.name}</h3>
                    {file.pinned && <Pin className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full ${typeColors[file.type]}`}>{typeLabels[file.type]}</span>
                    <span>{file.size}</span>
                    <span>{file.uploadedAt}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{file.accessCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(file.cid)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Copier CID"
                  >
                    {copied === file.cid ? <span className="text-xs text-emerald-400">✓</span> : <Copy className="w-4 h-4" />}
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Voir sur IPFS">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}