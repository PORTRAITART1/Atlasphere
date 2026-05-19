import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SUBSCRIPTIONS, getUser } from '@/lib/store';
import { PiSDK } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';
import { Check, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, price: number, name: string) => {
    if (price === 0) {
      toast.success('You are on the Free plan!');
      return;
    }
    const user = getUser();
    if (!user) {
      toast.error('Please connect with Pi Network first');
      return;
    }
    setSubscribing(planId);
    try {
      await PiSDK.createPayment(
        { amount: price, memo: `Subscription: ${name}` },
        {
          onReadyForServerApproval: () => toast.info(t('payment.processing')),
          onReadyForServerCompletion: () => {
            toast.success(`Subscribed to ${name}!`);
            setSubscribing(null);
          },
          onCancel: () => {
            toast.info('Subscription cancelled');
            setSubscribing(null);
          },
          onError: () => {
            toast.error(t('payment.failed'));
            setSubscribing(null);
          },
        }
      );
    } catch {
      toast.error(t('payment.failed'));
      setSubscribing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('subscription.title')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('subscription.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTIONS.map(plan => (
            <Card
              key={plan.id}
              className={`bg-gray-800/50 border-purple-500/20 relative overflow-hidden ${
                plan.recommended ? 'border-amber-400/50 ring-1 ring-amber-400/30' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0">
                  <Badge className="bg-amber-500 text-gray-900 rounded-none rounded-bl-lg font-semibold">
                    <Zap className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-amber-400">{plan.price}</span>
                  <span className="text-amber-400">{t('common.pi')}</span>
                  <span className="text-gray-500 text-sm">{t('subscription.perMonth')}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id, plan.price, plan.name)}
                  disabled={subscribing === plan.id}
                  className={`w-full ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {subscribing === plan.id
                    ? t('payment.processing')
                    : plan.price === 0
                    ? t('subscription.current')
                    : t('subscription.subscribe')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Smart Contract Info */}
        <div className="mt-16 bg-gray-900/50 rounded-xl p-8 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Powered by Smart Contracts</h3>
          <p className="text-gray-400 mb-4">
            Subscriptions are managed by Soroban smart contracts on the Pi Network blockchain, ensuring transparent and automated billing cycles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-purple-300 font-medium mb-1">Auto-Renewal</h4>
              <p className="text-gray-500 text-sm">Token allowances enable non-custodial recurring charges</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-purple-300 font-medium mb-1">No Drift</h4>
              <p className="text-gray-500 text-sm">Billing advances from previous timestamp, not current time</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-purple-300 font-medium mb-1">Cancel Anytime</h4>
              <p className="text-gray-500 text-sm">Subscription remains active until current period ends</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}