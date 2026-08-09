import { useState } from 'react';
import { createClient } from '@metagptx/web-sdk';
import { createPiPayment, getCurrentUser } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';

let _client: ReturnType<typeof createClient> | null = null;
function getClient() { if (!_client) _client = createClient(); return _client; }

interface PiPaymentButtonProps {
  amount: number;
  projectId: number;
  memo?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function PiPaymentButton({
  amount,
  projectId,
  memo = 'Atlasphere contribution',
  onSuccess,
  onError,
  className = '',
  children,
}: PiPaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'approving' | 'completing' | 'done' | 'error'>('idle');

  const handlePayment = async () => {
    const user = getCurrentUser();
    if (!user) {
      onError?.('Please connect with Pi Network first');
      return;
    }

    setIsProcessing(true);
    setStatus('approving');

    try {
      const success = await createPiPayment(
        amount,
        memo,
        { projectId: String(projectId), type: 'contribution' },
        // onReadyForServerApproval
        async (paymentId: string) => {
          setStatus('approving');
          try {
            await getClient().apiCall.invoke({
              url: '/api/v1/pi-payments/approve',
              method: 'POST',
              data: { payment_id: paymentId },
            });
          } catch (err) {
            console.error('Server approval failed:', err);
          }
        },
        // onReadyForServerCompletion
        async (paymentId: string, txid: string) => {
          setStatus('completing');
          try {
            await getClient().apiCall.invoke({
              url: '/api/v1/pi-payments/complete',
              method: 'POST',
              data: {
                payment_id: paymentId,
                txid,
                project_id: projectId,
                amount,
                pi_uid: user.uid,
              },
            });

            // Check quest progress after funding
            await getClient().apiCall.invoke({
              url: '/api/v1/quests/check-progress',
              method: 'POST',
              data: { pi_uid: user.uid, action_type: 'fund' },
            });

            setStatus('done');
            onSuccess?.();
          } catch (err) {
            console.error('Server completion failed:', err);
            setStatus('error');
            onError?.('Payment completion failed');
          }
        }
      );

      if (!success) {
        setStatus('error');
        onError?.('Payment was cancelled or failed');
      }
    } catch (error) {
      setStatus('error');
      onError?.('Payment failed');
    } finally {
      setIsProcessing(false);
      // Reset status after delay
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'approving':
        return `⏳ ${t('common.loading')}`;
      case 'completing':
        return `⏳ ${t('common.loading')}`;
      case 'done':
        return `✅ ${t('common.success')}`;
      case 'error':
        return `❌ ${t('common.error')}`;
      default:
        return children || `${t('fund.contribute')} ${amount} π`;
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing || status === 'done'}
      className={`px-4 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 ${
        status === 'done'
          ? 'bg-emerald-600 text-white'
          : status === 'error'
          ? 'bg-red-600 text-white'
          : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500'
      } ${className}`}
    >
      {getButtonContent()}
    </button>
  );
}