import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@metagptx/web-sdk';
import { authenticate, getCurrentUser, setCurrentUser, type PiUser } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';

export default function AuthCallback() {
  const [status, setStatus] = useState(t('auth.connecting'));
  const navigate = useNavigate();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Try Atoms Cloud login with a 3-second timeout
      const client = createClient();
      const loginPromise = client.auth.login();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout')), 3000)
      );

      let atomsUser: { username?: string; name?: string; email?: string } | null = null;
      try {
        await Promise.race([loginPromise, timeoutPromise]);
        // After successful login, get the real user profile from Atoms Cloud
        const meResponse = await client.auth.me();
        if (meResponse) {
          atomsUser = meResponse as { username?: string; name?: string; email?: string };
        }
      } catch {
        // Login timed out or failed - continue with sandbox auth
        console.log('[Atlasphere] Atoms Cloud login skipped (timeout or unavailable)');
      }

      setStatus('Authentification Pi Network...');

      // Authenticate with Pi SDK
      await authenticate();

      // If we got a real username from Atoms Cloud, override the sandbox username
      const user = getCurrentUser();
      if (user && atomsUser) {
        const realUsername = atomsUser.username || atomsUser.name || user.username;
        if (realUsername && realUsername !== user.username) {
          const updatedUser: PiUser = {
            ...user,
            username: realUsername,
            displayName: realUsername,
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('atlasphere_user', JSON.stringify(updatedUser));
        }
      }

      const finalUser = getCurrentUser();
      if (finalUser) {
        setStatus(`${t('common.success')} @${finalUser.username} !`);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setStatus(t('common.success'));
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error) {
      console.error('[Atlasphere] Auth callback error:', error);
      // Even on error, try to authenticate locally
      try {
        await authenticate();
        const user = getCurrentUser();
        if (user) {
          setStatus(`${t('common.success')} @${user.username} !`);
          setTimeout(() => navigate('/dashboard'), 1000);
          return;
        }
      } catch {
        // Final fallback
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