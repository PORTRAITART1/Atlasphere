import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  getCurrentUser,
  subscribe as subscribeToState,
  PiRC2Service,
  PiRC2Subscription,
  PIRC2_CONTRACT_ID,
  PI_TESTNET_RPC,
  stroopsToPi,
  formatPeriod,
  isSubscriptionActive,
  createPiPayment,
  shareOnPi,
} from '@/lib/pi-sdk';
import { Crown, Zap, Shield, Clock, CheckCircle2, XCircle, Share2, RefreshCw } from 'lucide-react';

// Atlasphere subscription services (aligned with PiRC2 smart contract spec)
const ATLASPHERE_SERVICES: PiRC2Service[] = [
  {
    service_id: 0,
    merchant: 'ATLASPHERE_MERCHANT_ADDRESS',
    name: 'Pioneer Basic',
    price: 10_000_000, // 1 Pi per period
    period_secs: 2_592_000, // 30 days
    trial_period_secs: 604_800, // 7 days trial
    approve_periods: 3,
    is_active: true,
    created_at: Date.now() / 1000,
  },
  {
    service_id: 1,
    merchant: 'ATLASPHERE_MERCHANT_ADDRESS',
    name: 'Pioneer Pro',
    price: 50_000_000, // 5 Pi per period
    period_secs: 2_592_000, // 30 days
    trial_period_secs: 604_800, // 7 days trial
    approve_periods: 6,
    is_active: true,
    created_at: Date.now() / 1000,
  },
  {
    service_id: 2,
    merchant: 'ATLASPHERE_MERCHANT_ADDRESS',
    name: 'Pioneer Elite',
    price: 100_000_000, // 10 Pi per period
    period_secs: 2_592_000, // 30 days
    trial_period_secs: 1_209_600, // 14 days trial
    approve_periods: 12,
    is_active: true,
    created_at: Date.now() / 1000,
  },
];

const PLAN_FEATURES: Record<number, string[]> = {
  0: [
    'Voting standard (1x poids)',
    'Créer jusqu\'à 3 propositions/mois',
    'Accès aux quêtes de base',
    'Badge Pioneer Basic',
  ],
  1: [
    'Voting amélioré (2x poids)',
    'Propositions illimitées',
    'Accès à toutes les quêtes',
    'Badge Pioneer Pro',
    'Priorité de modération',
    'Analytics de propositions',
  ],
  2: [
    'Voting premium (5x poids)',
    'Propositions illimitées',
    'Quêtes exclusives + récompenses bonus',
    'Badge Pioneer Elite',
    'Modération prioritaire',
    'Analytics avancés',
    'Accès API développeur',
    'Support prioritaire',
  ],
};

const PLAN_ICONS = [Zap, Crown, Shield];
const PLAN_COLORS = ['border-blue-500/30 bg-blue-950/20', 'border-purple-500/30 bg-purple-950/20', 'border-amber-500/30 bg-amber-950/20'];
const PLAN_BADGE_COLORS = ['bg-blue-600', 'bg-purple-600', 'bg-amber-600'];

export default function Subscriptions() {
  const [user, setUser] = useState(getCurrentUser());
  const [mySubscriptions, setMySubscriptions] = useState<PiRC2Subscription[]>([]);
  const [subscribing, setSubscribing] = useState<number | null>(null);

  useEffect(() => {
    const unsub = subscribeToState(() => setUser(getCurrentUser()));
    return unsub;
  }, []);

  // Load user's subscriptions (simulated - in production this queries the Soroban contract)
  useEffect(() => {
    const saved = localStorage.getItem('atlasphere_subscriptions');
    if (saved) {
      try {
        setMySubscriptions(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  const handleSubscribe = async (service: PiRC2Service, autoRenew: boolean) => {
    if (!user) return;
    setSubscribing(service.service_id);

    try {
      const piAmount = stroopsToPi(service.price);
      const hasTrial = service.trial_period_secs > 0;

      if (!hasTrial || autoRenew) {
        // Per PiRC2 spec: immediate payment for first period (no trial) or approval for auto-renew
        const success = await createPiPayment(
          hasTrial ? 0 : piAmount,
          `Atlasphere ${service.name} - Abonnement`,
          {
            type: 'subscription',
            service_id: service.service_id.toString(),
            auto_renew: autoRenew.toString(),
            contract_id: PIRC2_CONTRACT_ID,
          }
        );

        if (!success && !hasTrial) {
          setSubscribing(null);
          return;
        }
      }

      // Create subscription record (simulated - in production this calls the Soroban contract)
      const now = Math.floor(Date.now() / 1000);
      const newSub: PiRC2Subscription = {
        sub_id: mySubscriptions.length,
        subscriber: user.uid,
        service_id: service.service_id,
        price: service.price,
        period_secs: service.period_secs,
        trial_period_secs: service.trial_period_secs,
        trial_end_ts: hasTrial ? now + service.trial_period_secs : 0,
        auto_renew: autoRenew,
        service_end_ts: hasTrial
          ? now + service.trial_period_secs
          : now + service.period_secs,
        next_charge_ts: hasTrial
          ? now + service.trial_period_secs
          : now + service.period_secs,
        created_at: now,
      };

      const updated = [...mySubscriptions, newSub];
      setMySubscriptions(updated);
      localStorage.setItem('atlasphere_subscriptions', JSON.stringify(updated));
    } catch (error) {
      console.error('[Atlasphere] Subscription failed:', error);
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancel = (subId: number) => {
    // Per PiRC2 spec: cancel sets auto_renew = false, subscription remains active until service_end_ts
    const updated = mySubscriptions.map(sub =>
      sub.sub_id === subId ? { ...sub, auto_renew: false } : sub
    );
    setMySubscriptions(updated);
    localStorage.setItem('atlasphere_subscriptions', JSON.stringify(updated));
  };

  const handleToggleAutoRenew = (subId: number) => {
    // Per PiRC2 spec: toggle_auto_renew flips the flag
    const updated = mySubscriptions.map(sub => {
      if (sub.sub_id === subId) {
        return { ...sub, auto_renew: !sub.auto_renew };
      }
      return sub;
    });
    setMySubscriptions(updated);
    localStorage.setItem('atlasphere_subscriptions', JSON.stringify(updated));
  };

  const getActiveSubscription = (serviceId: number): PiRC2Subscription | undefined => {
    return mySubscriptions.find(
      sub => sub.service_id === serviceId && isSubscriptionActive(sub)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <Navbar />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Abonnements Atlasphere
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Débloquez des fonctionnalités avancées de gouvernance avec les abonnements récurrents Pi.
            Propulsé par le smart contract PiRC2 sur Soroban.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
              Contrat: {PIRC2_CONTRACT_ID.slice(0, 8)}...{PIRC2_CONTRACT_ID.slice(-4)}
            </Badge>
            <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
              RPC: {PI_TESTNET_RPC}
            </Badge>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ATLASPHERE_SERVICES.map((service, idx) => {
            const Icon = PLAN_ICONS[idx];
            const activeSub = getActiveSubscription(service.service_id);
            const isActive = !!activeSub;
            const inTrial = activeSub && activeSub.trial_end_ts > 0 && Date.now() / 1000 < activeSub.trial_end_ts;

            return (
              <Card key={service.service_id} className={`relative overflow-hidden border ${PLAN_COLORS[idx]} backdrop-blur-sm`}>
                {idx === 1 && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Populaire
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{service.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {service.trial_period_secs > 0 && (
                      <span className="block text-emerald-400 text-sm mb-1">
                        ✨ {formatPeriod(service.trial_period_secs)} d'essai gratuit
                      </span>
                    )}
                  </CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-white">{stroopsToPi(service.price)}</span>
                    <span className="text-slate-400 ml-1">π / {formatPeriod(service.period_secs)}</span>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <ul className="space-y-2">
                    {PLAN_FEATURES[service.service_id]?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* PiRC2 Technical Details */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500 mb-1">Détails PiRC2:</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-700">
                        Période: {formatPeriod(service.period_secs)}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-700">
                        Pré-approbation: {service.approve_periods} périodes
                      </Badge>
                      <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Auto-renouvellement
                      </Badge>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  {isActive ? (
                    <>
                      <Badge className={`${PLAN_BADGE_COLORS[idx]} text-white w-full justify-center py-1`}>
                        {inTrial ? '🎉 Période d\'essai' : '✅ Actif'}
                      </Badge>
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs border-slate-600 text-slate-300"
                          onClick={() => handleToggleAutoRenew(activeSub!.sub_id)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          {activeSub!.auto_renew ? 'Désactiver' : 'Activer'} renouvellement
                        </Button>
                        {activeSub!.auto_renew && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleCancel(activeSub!.sub_id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Annuler
                          </Button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 text-center">
                        Expire: {new Date(activeSub!.service_end_ts * 1000).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => handleSubscribe(service, true)}
                        disabled={!user || subscribing === service.service_id}
                      >
                        {subscribing === service.service_id
                          ? 'Souscription...'
                          : service.trial_period_secs > 0
                            ? 'Essai gratuit + Auto-renouvellement'
                            : 'S\'abonner (Auto-renouvellement)'}
                      </Button>
                      {service.trial_period_secs > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-slate-400"
                          onClick={() => handleSubscribe(service, false)}
                          disabled={!user || subscribing === service.service_id}
                        >
                          Essai uniquement (sans engagement)
                        </Button>
                      )}
                    </>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* PiRC2 Smart Contract Info */}
        <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              Comment fonctionnent les abonnements PiRC2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="text-white font-medium text-sm mb-1">Souscription</h4>
                <p className="text-xs text-slate-400">
                  Vous approuvez un nombre de périodes de paiement via le smart contract Soroban.
                  Aucun paiement immédiat si période d'essai.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="text-white font-medium text-sm mb-1">Approbation Token</h4>
                <p className="text-xs text-slate-400">
                  Le contrat reçoit une allowance (approve) pour {'{approve_periods}'} périodes.
                  Modèle non-custodial : vos Pi restent dans votre wallet.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="text-white font-medium text-sm mb-1">Facturation</h4>
                <p className="text-xs text-slate-400">
                  Le marchand appelle <code className="text-indigo-300">process()</code> pour charger les abonnés échus.
                  Pas de dérive : next_charge_ts avance exactement de period_secs.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-2xl mb-2">4️⃣</div>
                <h4 className="text-white font-medium text-sm mb-1">Contrôle Total</h4>
                <p className="text-xs text-slate-400">
                  Annulez à tout moment avec <code className="text-indigo-300">cancel()</code>.
                  L'accès reste actif jusqu'à service_end_ts.
                  Étendez avec <code className="text-indigo-300">extend_subscription()</code>.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-indigo-950/30 border border-indigo-500/20">
              <h4 className="text-indigo-300 font-medium text-sm mb-2">📋 Spécification Technique</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Réseau:</span>
                  <span className="text-white ml-1">Pi Testnet</span>
                </div>
                <div>
                  <span className="text-slate-500">Standard:</span>
                  <span className="text-white ml-1">PiRC2</span>
                </div>
                <div>
                  <span className="text-slate-500">Runtime:</span>
                  <span className="text-white ml-1">Soroban</span>
                </div>
                <div>
                  <span className="text-slate-500">Pattern:</span>
                  <span className="text-white ml-1">approve + transfer_from</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share */}
        <div className="text-center">
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white"
            onClick={() => shareOnPi(
              'Atlasphere Subscriptions',
              '🚀 Découvrez les abonnements Atlasphere propulsés par le smart contract PiRC2 sur Soroban! Gouvernance décentralisée pour tous les Pioneers. ' + window.location.href
            )}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager sur Pi
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}