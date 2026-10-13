import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NETWORK_CONFIG_STORAGE_KEY = 'atlaspherepi_network_config';
const MAINNET_CHECKLIST_STORAGE_KEY = 'atlaspherepi_mainnet_checklist';

interface NetworkConfig {
  network: 'mainnet';
  sandbox: boolean;
  piServerUrl: string;
  features: {
    smartContracts: boolean;
    a2uPayments: boolean;
    subscriptions: boolean;
  };
}

export default function Settings() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<NetworkConfig>({
    network: 'mainnet',
    sandbox: false,
    piServerUrl: 'https://api.minepi.com',
    features: {
      smartContracts: true,
      a2uPayments: true,
      subscriptions: true,
    },
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem(NETWORK_CONFIG_STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig({
          ...parsedConfig,
          network: 'mainnet',
          sandbox: false,
          piServerUrl: 'https://api.minepi.com',
        });
      } catch {
        localStorage.removeItem(NETWORK_CONFIG_STORAGE_KEY);
      }
    }
  }, []);

  const enforceMainnet = () => {
    setConfig({
      ...config,
      network: 'mainnet',
      sandbox: false,
      piServerUrl: 'https://api.minepi.com',
    });
  };

  const toggleFeature = (feature: keyof NetworkConfig['features']) => {
    setConfig({
      ...config,
      features: {
        ...config.features,
        [feature]: !config.features[feature],
      },
    });
  };

  const saveConfig = () => {
    localStorage.setItem(NETWORK_CONFIG_STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const mainnetChecklist = [
    { id: 'kyc', label: 'KYC complété pour le compte développeur', critical: true },
    { id: 'wallet', label: 'Wallet Mainnet créé avec 2FA activé', critical: true },
    { id: 'apikey', label: 'API Key Mainnet générée et testée', critical: true },
    { id: 'domain', label: 'Domaine validé dans Developer Portal', critical: true },
    { id: 'tests', label: 'Tous les paiements Mainnet sont validés', critical: true },
    { id: 'contracts', label: 'Smart contracts validés par 10+ transactions', critical: false },
    { id: 'review', label: 'Code review par au moins 1 développeur', critical: false },
    { id: 'backup', label: 'Backup base de données configuré', critical: false },
    { id: 'rollback', label: 'Plan de rollback défini', critical: false },
    { id: 'support', label: 'Support client prêt (Discord/Telegram)', critical: false },
  ];

  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(MAINNET_CHECKLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const toggleChecklist = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    localStorage.setItem(MAINNET_CHECKLIST_STORAGE_KEY, JSON.stringify(updated));
  };

  const checklistProgress = Object.values(checklist).filter(Boolean).length;
  const criticalComplete = mainnetChecklist
    .filter((item) => item.critical)
    .every((item) => checklist[item.id]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title', '⚙️ Configuration Réseau')}</h1>
            <p className="text-gray-400 mb-8">{t('settings.description', 'Gérez la configuration Mainnet de Atlasphere')}</p>
          </motion.div>

          {/* Network Toggle */}
          <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                🌐 Réseau Pi Network
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  🟢 Mainnet
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Mode Mainnet</p>
                  <p className="text-sm text-gray-400">
                    ⚠️ Transactions en π réels — Soyez prudent !
                  </p>
                </div>
                <Switch
                  checked={true}
                  onCheckedChange={enforceMainnet}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-700/20 rounded-lg">
                  <p className="text-xs text-gray-400">Serveur API Pi</p>
                  <p className="text-sm text-white font-mono">{config.piServerUrl}</p>
                </div>
                <div className="p-3 bg-slate-700/20 rounded-lg">
                  <p className="text-xs text-gray-400">Mode Sandbox</p>
                  <p className="text-sm text-white">{config.sandbox ? 'Activé' : 'Désactivé'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white">🎛️ Feature Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'smartContracts' as const, label: 'Smart Contracts PiRC2', desc: 'Escrow, gouvernance on-chain' },
                { key: 'a2uPayments' as const, label: 'Paiements A2U', desc: 'Récompenses et remboursements automatiques' },
                { key: 'subscriptions' as const, label: 'Abonnements', desc: 'Paiements récurrents via PiRC2' },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{feature.label}</p>
                    <p className="text-xs text-gray-400">{feature.desc}</p>
                  </div>
                  <Switch
                    checked={config.features[feature.key]}
                    onCheckedChange={() => toggleFeature(feature.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Mainnet Checklist */}
          <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>✅ Checklist Go/No-Go Mainnet</span>
                <Badge className={criticalComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                  {checklistProgress}/{mainnetChecklist.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(checklistProgress / mainnetChecklist.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {mainnetChecklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/20 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.id] || false}
                      onChange={() => toggleChecklist(item.id)}
                      className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className={`text-sm ${checklist[item.id] ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {item.label}
                    </span>
                    {item.critical && (
                      <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">
                        Critique
                      </Badge>
                    )}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables Reference */}
          <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white">🔑 Variables d&apos;Environnement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 mb-3">
                <p className="text-amber-300 text-xs font-medium">⚠️ Sécurité : Ne jamais exposer vos clés réelles dans le code frontend. Les valeurs ci-dessous sont des exemples de format. Stockez vos vraies clés uniquement côté serveur (variables d'environnement backend).</p>
              </div>
              <pre className="bg-slate-900 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto">
{`# Pi Network (⚠️ EXEMPLES DE FORMAT — remplacez par vos vraies clés côté SERVEUR uniquement)
PI_API_KEY=mainnet_xxxxxxxx
DEVELOPER_PUBLIC_KEY=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
DEVELOPER_SECRET_SEED=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Réseau
NODE_ENV=${config.network === 'mainnet' ? 'production' : 'development'}
NETWORK=Pi Network
PI_SERVER_URL=${config.piServerUrl}

# Feature Flags
ENABLE_MAINNET=${config.network === 'mainnet'}
ENABLE_SMART_CONTRACTS=${config.features.smartContracts}
ENABLE_A2U_PAYMENTS=${config.features.a2uPayments}`}
              </pre>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveConfig}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8"
            >
              {saved ? '✅ Sauvegardé !' : '💾 Sauvegarder la Configuration'}
            </Button>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
}