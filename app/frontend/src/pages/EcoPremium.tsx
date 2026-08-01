import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPremiumPlans } from '@/lib/eco-data';
import { createPiPayment } from '@/lib/pi-sdk';
import { Crown, Check, Zap, Shield, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function EcoPremium() {
  const plans = getPremiumPlans();
  const [processing, setProcessing] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (planId: string, price: number) => {
    if (price === 0) return;
    setProcessing(planId);
    try {
      await createPiPayment(price, `EcoChain Premium - ${planId}`, { planId, type: 'subscription' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full mb-4">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">EcoChain Premium</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Débloquez le potentiel complet</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Accédez aux analyses IA avancées, prédictions détaillées et outils professionnels pour maximiser votre impact écologique.
          </p>
        </div>

        {success && (
          <div className="max-w-md mx-auto mb-8 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
            <p className="text-emerald-300 font-medium">✓ Abonnement activé avec succès !</p>
          </div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-6 transition-all ${
                plan.popular
                  ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 scale-105'
                  : plan.current
                  ? 'border-emerald-500/30'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                  Populaire
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Plan actuel
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.price > 0 ? 'Pi/mois' : ''}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id, plan.price)}
                disabled={plan.current || processing === plan.id}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                  plan.current
                    ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                    : plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                } disabled:opacity-50`}
              >
                {processing === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Paiement...
                  </span>
                ) : plan.current ? (
                  'Plan actuel'
                ) : (
                  `Choisir ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Pourquoi passer Premium ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 text-center">
              <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">IA Avancée</h3>
              <p className="text-sm text-gray-400">Prédictions climatiques sur 30 jours avec 95% de précision. Alertes personnalisées en temps réel.</p>
            </div>
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 text-center">
              <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Capteurs Illimités</h3>
              <p className="text-sm text-gray-400">Connectez autant de capteurs IoT que vous voulez. Maximisez vos gains ECO sans limite.</p>
            </div>
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 text-center">
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Rapports Détaillés</h3>
              <p className="text-sm text-gray-400">Analyses approfondies de votre empreinte avec recommandations IA personnalisées chaque semaine.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}