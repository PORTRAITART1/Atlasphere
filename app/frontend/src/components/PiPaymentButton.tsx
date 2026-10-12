import { useState } from 'react';
import { createPiPayment, getCurrentUser } from '@/lib/pi-sdk';
import { getAPIBaseURL } from '@/lib/config';
import { t } from '@/lib/i18n';

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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePayment = async () => {
    setErrorMessage('');
    const user = getCurrentUser();
    if (!user) {
      const msg = 'Please connect with Pi Network first';
      setStatus('error');
      setErrorMessage(msg);
      onError?.(msg);
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
            const url = `${getAPIBaseURL()}/api/pi-payments/approve`;
            console.log('[Payment] Approving:', url, 'paymentId:', paymentId);

            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ payment_id: paymentId }),
            });

            if (!response.ok) {
              const errText = await response.text().catch(() => '');
              throw new Error(`HTTP ${response.status}: ${errText}`);
            }
            console.log('[Payment] Approved OK');
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown approval error';
            console.error('[Payment] Server approval failed:', msg);
            setErrorMessage(`Approve: ${msg}`);
            throw err;
          }
        },
        // onReadyForServerCompletion
        async (paymentId: string, txid: string) => {
          setStatus('completing');
          try {
            const url = `${getAPIBaseURL()}/api/pi-payments/complete`;
            console.log('[Payment] Completing:', url, 'paymentId:', paymentId, 'txid:', txid);

            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payment_id: paymentId,
                txid,
                project_id: projectId,
                amount,
                pi_uid: user.uid,
              }),
            });

            if (!response.ok) {
              const errText = await response.text().catch(() => '');
              throw new Error(`HTTP ${response.status}: ${errText}`);
            }
            console.log('[Payment] Completed OK');
            setStatus('done');
            onSuccess?.();
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown completion error';
            console.error('[Payment] Server completion failed:', msg);
            setStatus('error');
            setErrorMessage(`Complete: ${msg}`);
            onError?.(msg);
          }
        }
      );

      if (!success) {
        const msg = 'Payment was cancelled or failed (SDK returned false)';
        setStatus('error');
        setErrorMessage(msg);
        onError?.(msg);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Payment failed';
      setStatus('error');
      setErrorMessage(msg);
      onError?.(msg);
    } finally {
      setIsProcessing(false);
      // Reset to idle after 8 seconds, but keep error message visible during error
      setTimeout(() => {
        setStatus((s) => (s === 'error' ? 'idle' : s));
        setErrorMessage('');
      }, 8000);
    }
  };

  const getButtonContent = () => {
    if (status === 'error' && errorMessage) {
      return `❌ ${errorMessage}`;
    }
    switch (status) {
      case 'approving':
        return `⏳ ${t('common.loading')} (approving)`;
      case 'completing':
        return `⏳ ${t('common.loading')} (completing)`;
      case 'done':
        return `✅ ${t('common.success')}`;
      case 'error':
        return `❌ ${t('common.error')}`;
      default:
        return children || `${t('fund.contribute')} ${amount} π`;
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePayment}
        disabled={isProcessing || status === 'done'}
        className={`w-full px-4 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 ${
          status === 'done'
            ? 'bg-emerald-600 text-white'
            : status === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500'
        } ${className}`}
      >
        {getButtonContent()}
      </button>

      {errorMessage && status === 'error' && (
        <div className="mt-2 text-xs text-red-400 break-words bg-red-950/30 border border-red-800/50 rounded-lg p-2">
          <strong>Erreur :</strong> {errorMessage}
        </div>
      )}
    </div>
  );
}