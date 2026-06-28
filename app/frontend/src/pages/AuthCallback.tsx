import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@metagptx/web-sdk';
import { authenticate, getCurrentUser } from '@/lib/pi-sdk';

const client = createClient();

export default function AuthCallback() {
  const [status, setStatus] = useState('Connexion en cours...');
  const navigate = useNavigate();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Complete the Atoms Cloud login flow
      await client.auth.login();
      setStatus('Authentification Pi Network...');

      // Now authenticate with Pi SDK (sandbox mode since we're outside Pi Browser)
      await authenticate();

      const user = getCurrentUser();
      if (user) {
        setStatus(`Bienvenue @${user.username} !`);
        // Redirect to dashboard after successful auth
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setStatus('Authentification réussie');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      console.error('[PoliGov] Auth callback error:', error);
      setStatus('Erreur d\'authentification. Redirection...');
      setTimeout(() => navigate('/'), 2000);
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
