import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate, getCurrentUser } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';

export default function AuthCallback() {
  const [status, setStatus] = useState(t('auth.connecting'));
  const navigate = useNavigate();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      setStatus('Authentification Pi Network...');

      // Authenticate with Pi SDK
      await authenticate();

      const user = getCurrentUser();
      if (user) {
        setStatus(`${t('common.success')} @${user.username} !`);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setStatus(t('common.success'));
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error) {
      console.error('[Atlasphere] Auth callback error:', error);

      // Retry local Pi authentication once
      try {
        await authenticate();
        const user = getCurrentUser();
        if (user) {
          setStatus(`${t('common.success')} @${user.username} !`);
          setTimeout(() => navigate('/dashboard'), 1000);
          return;
        }
      } catch {
        // Local retry failed
      }

      setStatus('Redirection...');
      setTimeout(() => navigate('/'), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-300 text-lg">{status}</p>
        <p className="text-gray-500 text-sm mt-2">Atlasphere - Gouvernance Pi Network</p>
      </div>
    </div>
  );
}
