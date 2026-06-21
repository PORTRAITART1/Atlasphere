import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, authenticate, logout, subscribe, type PiUser } from '@/lib/pi-sdk';
import { t, subscribeI18n } from '@/lib/i18n';
import LanguageSelector from '@/components/LanguageSelector';

export default function Navbar() {
  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setLangTick] = useState(0);
  const location = useLocation();

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    try {
      await authenticate();
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/proposals', label: t('nav.proposals') },
    { path: '/funding', label: t('nav.funding') },
    { path: '/quests', label: `🎯 ${t('nav.quests')}` },
    { path: '/create', label: t('nav.create') },
    { path: '/dashboard', label: t('nav.dashboard') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/logo-polis.jpeg"
              alt="PolisGo Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              PolisGo
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-amber-400 text-sm font-medium">{user.piBalance.toFixed(1)} π</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{user.avatar}</span>
                  <span className="hidden sm:inline text-sm text-gray-300">{user.displayName}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  {t('nav.disconnect')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuth}
                disabled={loading}
                className="px-3 py-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                {loading ? t('auth.connecting') : `🔐 ${t('nav.connect')}`}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}