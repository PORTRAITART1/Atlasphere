import { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';

type PermissionState = 'default' | 'granted' | 'denied';

export default function PushNotifications() {
  const [permission, setPermission] = useState<PermissionState>('default');
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission as PermissionState);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result as PermissionState);
      
      if (result === 'granted') {
        // Register for push notifications
        const registration = await navigator.serviceWorker?.ready;
        if (registration) {
          // In production, you'd subscribe to a push service here
          new Notification('Atlasphere', {
            body: 'Notifications activées ! Vous recevrez les alertes de votes, financements et messages.',
            icon: '/icons/icon-192.png',
          });
        }
      }
    } catch (err) {
      console.error('Push notification error:', err);
    }
  };

  const sendTestNotification = () => {
    if (permission !== 'granted') return;
    new Notification('🗳️ Nouveau vote', {
      body: 'La proposition "Pi Academy" a reçu 50 nouveaux votes !',
      icon: '/icons/icon-192.png',
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`p-2 rounded-lg border transition-all ${
          permission === 'granted'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            : permission === 'denied'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
        }`}
        title="Notifications Push"
      >
        {permission === 'granted' ? <BellRing className="w-4 h-4" /> : permission === 'denied' ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
      </button>

      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/20 p-4 z-50">
          <h3 className="text-sm font-semibold text-white mb-2">Notifications Push</h3>
          
          {permission === 'default' && (
            <div>
              <p className="text-xs text-gray-400 mb-3">
                Activez les notifications pour recevoir des alertes en temps réel sur les votes, financements et messages.
              </p>
              <button
                onClick={requestPermission}
                className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
              >
                Activer les notifications
              </button>
            </div>
          )}

          {permission === 'granted' && (
            <div>
              <p className="text-xs text-emerald-400 mb-3">✓ Notifications activées</p>
              <div className="space-y-2 text-xs text-gray-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-indigo-500" />
                  Nouveaux votes sur mes propositions
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-indigo-500" />
                  Contributions reçues
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-indigo-500" />
                  Messages privés
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-indigo-500" />
                  Mises à jour des projets suivis
                </label>
              </div>
              <button
                onClick={sendTestNotification}
                className="mt-3 w-full px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs rounded-lg transition-colors"
              >
                Envoyer une notification test
              </button>
            </div>
          )}

          {permission === 'denied' && (
            <div>
              <p className="text-xs text-red-400 mb-2">✗ Notifications bloquées</p>
              <p className="text-xs text-gray-400">
                Les notifications ont été refusées. Pour les réactiver, modifiez les permissions du site dans les paramètres de votre navigateur.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}