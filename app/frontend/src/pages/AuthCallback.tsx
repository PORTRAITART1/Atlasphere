import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@metagptx/web-sdk';
import { authenticate, getCurrentUser } from '@/lib/pi-sdk';

export default function AuthCallback() {
  const [status, setStatus] = useState('Connexion en cours...');
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

      try {
        await Promise.race([loginPromise, timeoutPromise]);
      } catch {
        // Login timed out or failed - continue with sandbox auth
        console.log('[PoliGov] Atoms Cloud login skipped (timeout or unavailable)');
      }

      setStatus('Authentification Pi Network...');

      // Authenticate with Pi SDK (instant in sandbox mode)
      await authenticate();

      const user = getCurrentUser();
      if (user) {
        setStatus(`Bienvenue @${user.username} !`);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setStatus('Authentification réussie');
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error) {
      console.error('[PoliGov] Auth callback error:', error);
      // Even on error, try to authenticate locally
      try {
        await authenticate();
        const user = getCurrentUser();
        if (user) {
          setStatus(`Bienvenue @${user.username} !`);
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
        <p className="text-gray-500 text-sm mt-2">PoliGov - Gouvernance Pi Network</p>
      </div>
    </div>
  );
}