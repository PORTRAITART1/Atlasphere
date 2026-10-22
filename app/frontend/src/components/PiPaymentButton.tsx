import { useState } from 'react';
import { createPiPayment, getCurrentUser } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';

interface PiPaymentButtonProps {
  amount: number;
  projectId?: number;
  purpose: string;
  memo?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Nettoie un message d'erreur brut pour l'afficher proprement.
 * - Détecte "already_completed" → retourne un flag de succès
 * - Tronque les JSON trop longs
 */
function cleanErrorMessage(raw: string): { isSuccess: boolean; rawMessage: string } {
  // Cas 1 : paiement déjà complété (pas une vraie erreur)
  if (raw.includes('already_completed') || raw.includes('already completed')) {
    return { isSuccess: true, rawMessage: '' };
  }

  // Cas 2 : message d'erreur simple (pas de JSON)
  if (raw.length < 120 && !raw.includes('{')) {
    return { isSuccess: false, rawMessage: raw };
  }

  // Cas 3 : JSON détecté → extraire le champ "message" ou "detail"
  try {
    const jsonMatch = raw.match(/\{.*\}/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const msg =
        parsed?.detail ||
        parsed?.error_message ||
        parsed?.message ||
        parsed?.error;
      if (typeof msg === 'string') {
        // Récursif si le detail est lui-même un JSON
        if (msg.includes('{')) {
          return cleanErrorMessage(msg);
        }
        return { isSuccess: false, rawMessage: msg.slice(0, 120) };
      }
    }
  } catch {
    // Ignore parse errors
  }

  // Fallback : tronquer le message brut
  return {
    isSuccess: false,
    rawMessage: raw.length > 120 ? raw.slice(0, 117) + '...' : raw,
  };
}

export default function PiPaymentButton({
  amount,
  projectId,
  purpose,
  memo = 'Atlasphere contribution',
  onSuccess,
  onError,
  className = '',
  children,
}: PiPaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'approving' | 'completing' | 'done' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState<string>('');

  const handlePayment = async () => {
    setMessage('');
    const user = getCurrentUser();
    const jwt = localStorage.getItem('atlasphere_jwt');
    const piToken = localStorage.getItem('atlasphere_pi_token');
    setDebugInfo(`user=${user ? 'OK(' + user.username + ')' : 'NULL'} | uid=${user?.uid || 'NULL'} | jwt=${jwt ? 'OK' : 'NULL'} | piToken=${piToken ? 'OK' : 'NULL'}`);
    if (piToken) {
      try {
        const base = getAPIBaseURL();
        const res = await fetch(`${base}/api/v1/pi-auth/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: piToken })
        });
        const txt = await res.text();
        setDebugInfo(prev => prev + ` | EX=${res.status}: ${txt.substring(0, 150)}`);
      } catch (e: any) {
        setDebugInfo(prev => prev + ` | EX_ERR=${e.message}`);
      }
    }
    if (!user) {
      setStatus('error');
      setMessage(t('payment.login_required'));
      onError?.(t('payment.login_required'));
      return;
    }

    setIsProcessing(true);
    setStatus('approving');

    try {
      const success = await createPiPayment(amount, memo, {
        purpose,
        ...(projectId ? { project_id: String(projectId) } : {}),
      });

      if (success) {
        setStatus('done');
        setMessage(t('common.success'));
        onSuccess?.();
      } else {
        setStatus('error');
        setMessage(t('common.error'));
        onError?.(t('common.error'));
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      const cleaned = cleanErrorMessage(msg);
      if (cleaned.isSuccess) {
        setStatus('success');
        setMessage(t('common.success'));
        onSuccess?.();
      } else {
        setStatus('error');
        setMessage(cleaned.rawMessage || t('common.error'));
        onError?.(cleaned.rawMessage || t('common.error'));
      }
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setStatus((s) => (s === 'error' || s === 'success' ? 'idle' : s));
        setMessage('');
      }, 8000);
    }
  };

  const getButtonContent = () => {
    if (status === 'success') {
      return `✅ ${t('common.success')}`;
    }
    if (status === 'error') {
      return `❌ ${t('common.error')}`;
    }
    switch (status) {
      case 'approving':
        return `⏳ ${t('common.loading')}`;
      case 'completing':
        return `⏳ ${t('common.loading')}`;
      case 'done':
        return `✅ ${t('common.success')}`;
      default:
        return children || `${t('fund.contribute')} ${amount} π`;
    }
  };

  return (
    <div className="w-full">
      {debugInfo && (
        <div className="bg-red-600 text-white p-2 text-xs rounded mb-2 font-mono">
          DEBUG: {debugInfo}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={isProcessing || status === 'done' || status === 'success'}
        className={`w-full px-4 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 ${
          status === 'done' || status === 'success'
            ? 'bg-emerald-600 text-white'
            : status === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500'
        } ${className}`}
      >
        {getButtonContent()}
      </button>

      {message && (status === 'error' || status === 'success') && (
        <div
          className={`mt-2 text-xs break-words rounded-lg p-2 border ${
            status === 'success'
              ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/50'
              : 'text-red-400 bg-red-950/30 border-red-800/50'
          }`}
        >
          <strong>{status === 'success' ? '✅' : '❌'}</strong> {message}
        </div>
      )}
    </div>
  );
}