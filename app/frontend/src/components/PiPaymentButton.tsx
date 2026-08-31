import { useState } from 'react';
import { createPiPayment, getCurrentUser, isInPiBrowser } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';

interface PiPaymentButtonProps {
  amount: number;
  projectId?: number;
  /** Server-side whitelisted purpose. */
  purpose?: 'project_funding' | 'payment_test' | 'donation' | 'subscription' | 'premium';
  memo?: string;
  onSuccess?: (paymentId: string, txid: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Triggers a real Pi Network U2A payment.
 *
 * The component never records anything itself: approval, completion and the
 * business effect are handled exclusively by the Atlasphere server, which
 * re-reads the payment from the Pi Platform API before trusting it.
 */
export default function PiPaymentButton({
  amount,
  projectId,
  purpose = 'project_funding',
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
      onError?.(t('pay.err_login'));
      return;
    }
    if (!isInPiBrowser()) {
      onError?.(t('pay.err_browser'));
      return;
    }

    setIsProcessing(true);
    setStatus('approving');

    try {
      const metadata: Record<string, string> = { purpose };
      if (projectId) metadata.project_id = String(projectId);

      const success = await createPiPayment(
        amount,
        memo,
        metadata,
        async () => {
          setStatus('completing');
        },
        async (paymentId: string, txid: string) => {
          setStatus('done');
          onSuccess?.(paymentId, txid);
        }
      );

      if (!success) {
        setStatus('error');
        onError?.(t('pay.err_failed'));
      }
    } catch {
      setStatus('error');
      onError?.(t('pay.err_failed'));
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'approving':
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