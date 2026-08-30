import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { t, useI18nRerender } from '@/lib/i18n';

interface NetworkConfig {
  network: 'testnet' | 'mainnet';
  sandbox: boolean;
  piServerUrl: string;
  features: {
    smartContracts: boolean;
    a2uPayments: boolean;
    subscriptions: boolean;
  };
}

const CHECKLIST_ITEMS = [
  { id: 'kyc', key: 'set.cl_kyc', critical: true },
  { id: 'wallet', key: 'set.cl_wallet', critical: true },
  { id: 'apikey', key: 'set.cl_apikey', critical: true },
  { id: 'domain', key: 'set.cl_domain', critical: true },
  { id: 'tests', key: 'set.cl_tests', critical: true },
  { id: 'contracts', key: 'set.cl_contracts', critical: false },
  { id: 'review', key: 'set.cl_review', critical: false },
  { id: 'backup', key: 'set.cl_backup', critical: false },
  { id: 'rollback', key: 'set.cl_rollback', critical: false },
  { id: 'support', key: 'set.cl_support', critical: false },
];

export default function Settings() {
  useI18nRerender();

  const [config, setConfig] = useState<NetworkConfig>({
    network: 'testnet',
    sandbox: true,
    piServerUrl: 'https://api.testnet.minepi.com',
    features: {
      smartContracts: true,
      a2uPayments: true,
      subscriptions: true,
    },
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('atlasphere_network_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const toggleNetwork = () => {
    const newNetwork = config.network === 'testnet' ? 'mainnet' : 'testnet';
    setConfig({
      ...config,
      network: newNetwork,
      sandbox: newNetwork === 'testnet',
      piServerUrl: newNetwork === 'mainnet'
        ? 'https://api.mainnet.minepi.com'
        : 'https://api.testnet.minepi.com',
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
    localStorage.setItem('atlasphere_network_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const savedChecklist = localStorage.getItem('atlasphere_mainnet_checklist');
    return savedChecklist ? JSON.parse(savedChecklist) : {};
  });

  const toggleChecklist = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    localStorage.setItem('atlasphere_mainnet_checklist', JSON.stringify(updated));
  };

  const checklistProgress = Object.values(checklist).filter(Boolean).length;
  const criticalComplete = CHECKLIST_ITEMS
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
            <h1 className="text-3xl font-bold text-white mb-2">{t('set.title')}</h1>
            <p className="text-gray-400 mb-8">{t('set.subtitle')}</p>
          </motion.div>

          {/* Network Toggle */}
          <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                {t('set.network')}
                <Badge className={config.network === 'mainnet' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                  {config.network === 'mainnet' ? '🟢 Mainnet' : '🟡 Testnet'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">{t('set.mainnet_mode')}</p>
                  <p className="text-sm text-gray-400">
                    {config.network === 'mainnet'
                      ? t('set.mainnet_warn')
                      : t('set.sandbox_desc')}
                  </p>
                </div>
                <Switch
                  checked={config.network === 'mainnet'}
                  onCheckedChange={toggleNetwork}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-700/20 rounded-lg">
                  <p className="text-xs text-gray-400">{t('set.api_server')}</p>
                  <p className="text-sm text-white font-mono break-all">{config.piServerUrl}</p>
                </div>
                <div className="p-3 bg-slate-700/20 rounded-lg">
                  <p className="text-xs text-gray-400">{t('set.sandbox_mode')}</p>
                  <p className="text-sm text-white">{config.sandbox ? t('set.on') : t('set.off')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card className="bg-slate-800/60 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white">{t('set.flags')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'smartContracts' as const, label: t('set.f_contracts'), desc: t('set.f_contracts_d') },
                { key: 'a2uPayments' as const, label: t('set.f_a2u'), desc: t('set.f_a2u_d') },
                { key: 'subscriptions' as const, label: t('set.f_subs'), desc: t('set.f_subs_d') },
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
              <CardTitle className="text-white flex items-center justify-between gap-3">
                <span>{t('set.checklist')}</span>
                <Badge className={criticalComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                  {checklistProgress}/{CHECKLIST_ITEMS.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(checklistProgress / CHECKLIST_ITEMS.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {CHECKLIST_ITEMS.map((item) => (
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
                      {t(item.key)}
                    </span>
                    {item.critical && (
                      <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">
                        {t('set.critical')}
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
              <CardTitle className="text-white">{t('set.env')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 mb-3">
                <p className="text-amber-300 text-xs font-medium">{t('set.env_warn')}</p>
              </div>
              <pre className="bg-slate-900 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto">
{`# Pi Network
PI_API_KEY=${config.network === 'mainnet' ? 'mainnet_xxxxxxxx' : 'testnet_xxxxxxxx'}
DEVELOPER_PUBLIC_KEY=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
DEVELOPER_SECRET_SEED=SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

NODE_ENV=${config.network === 'mainnet' ? 'production' : 'development'}
NETWORK=${config.network === 'mainnet' ? 'Pi Network' : 'Pi Testnet'}
PI_SERVER_URL=${config.piServerUrl}

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
              {saved ? t('set.saved') : t('set.save')}
            </Button>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
}