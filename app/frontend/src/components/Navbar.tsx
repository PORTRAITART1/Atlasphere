import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, authenticate, logout, subscribe, type PiUser } from '@/lib/pi-sdk';
import { t, subscribeI18n } from '@/lib/i18n';
import LanguageSelector from '@/components/LanguageSelector';
import NotificationBell from '@/components/NotificationBell';

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
              src="/assets/logo-poligov.jpeg"
              alt="PoliGov Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              PoliGov
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
            <NotificationBell />

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-amber-400 text-sm font-medium">{user.piBalance.toFixed(1)} π</span>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-sm text-white font-medium leading-tight">@{user.username}</span>
                    <span className="text-xs text-indigo-400 leading-tight">
                      {user.kycVerified ? '✓ KYC' : ''} • Lv. {user.level}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors p-1"
                  title={t('nav.disconnect')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuth}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('auth.connecting')}</span>
                  </>
                ) : (
                  <>
                    <span>π</span>
                    <span>{t('nav.connect')}</span>
                  </>
                )}
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