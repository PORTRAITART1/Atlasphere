import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, authenticate, logout, subscribe, type PiUser } from '@/lib/pi-sdk';
import { t, subscribeI18n } from '@/lib/i18n';
import LanguageSelector from '@/components/LanguageSelector';
import NotificationBell from '@/components/NotificationBell';
import GlobalSearch from '@/components/GlobalSearch';
import ThemeToggle from '@/components/ThemeToggle';
import PushNotifications from '@/components/PushNotifications';
import { getTotalUnread } from '@/lib/messaging';

export default function Navbar() {
  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ecoDropdown, setEcoDropdown] = useState(false);
  const [, setLangTick] = useState(0);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setEcoDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setEcoDropdown(false);
  }, [location.pathname]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      await authenticate();
    } catch (err) {
      console.error('[Atlasphere] Authentication failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const unreadMessages = getTotalUnread();

  const mainLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/proposals', label: t('nav.proposals') },
    { path: '/funding', label: t('nav.funding') },
    { path: '/community', label: '💬 Communauté' },
    { path: '/quests', label: `🎯 ${t('nav.quests')}` },
  ];

  const ecoLinks = [
    { path: '/eco-wallet', label: '🌿 EcoWallet', desc: 'Portefeuille écologique' },
    { path: '/climate', label: '🌍 Climat', desc: 'Tableau de bord climatique' },
    { path: '/eco-market', label: '🛒 EcoMarket', desc: 'Marketplace données' },
    { path: '/predictions', label: '🤖 Prédictions', desc: 'IA & Prévisions' },
    { path: '/eco-nft', label: '🎨 EcoNFT', desc: 'NFT environnementaux' },
    { path: '/eco-sensors', label: '📡 Capteurs IoT', desc: 'Collecte & anonymisation' },
    { path: '/lifestyle', label: '✨ Optimizer', desc: 'Recommandations IA' },
    { path: '/eco-leaderboard', label: '🏆 Classement', desc: 'Leaderboard écologique' },
    { path: '/eco-premium', label: '👑 Premium', desc: 'Plans & abonnements' },
    { path: '/eco-api', label: '🔗 API', desc: 'Accès chercheurs' },
    { path: '/iot-anomalies', label: '🚨 Anomalies', desc: 'Détection intelligente' },
    { path: '/carbon-credits', label: '🌱 Carbone', desc: 'Crédits carbone' },
  ];

  const daoLinks = [
    { path: '/quadratic-voting', label: '📐 Vote Quadratique', desc: 'Gouvernance équitable' },
    { path: '/committees', label: '🏛️ Comités', desc: 'Sous-DAOs thématiques' },
    { path: '/treasury', label: '💰 Trésorerie', desc: 'Fonds communautaires' },
    { path: '/guilds', label: '🛡️ Guildes', desc: 'Équipes écologiques' },
    { path: '/seasons', label: '🌊 Saisons', desc: 'Événements & missions' },
  ];

  const secondaryLinks = [
    { path: '/dashboard', label: t('nav.dashboard') },
    { path: '/badges', label: '🏅 Badges' },
    { path: '/project-tracking', label: '📋 Suivi' },
    { path: '/admin', label: '🛡️ Admin' },
  ];

  const isEcoActive = ecoLinks.some((l) => location.pathname === l.path);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/logo-atlasphere-transparent.png"
              alt="Atlasphere Logo"
              className="w-10 h-10 object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(58%) saturate(600%) hue-rotate(2deg) brightness(103%) contrast(104%)' }}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent hidden sm:inline">
              Atlasphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainLinks.map((link) => (
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

            {/* EcoChain Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setEcoDropdown(!ecoDropdown)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isEcoActive
                    ? 'bg-emerald-600/20 text-emerald-300'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>🌱 EcoChain</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${ecoDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {ecoDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50">
                  {ecoLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex flex-col px-4 py-2.5 transition-colors ${
                        location.pathname === link.path
                          ? 'bg-emerald-600/15 text-emerald-300'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-sm font-medium">{link.label}</span>
                      <span className="text-xs text-gray-500">{link.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* DAO Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  daoLinks.some((l) => location.pathname === l.path)
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>🏛️ DAO</span>
                <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50 hidden group-hover:block">
                {daoLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex flex-col px-4 py-2.5 transition-colors ${
                      location.pathname === link.path
                        ? 'bg-purple-600/15 text-purple-300'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm font-medium">{link.label}</span>
                    <span className="text-xs text-gray-500">{link.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            {secondaryLinks.map((link) => (
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

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <GlobalSearch />
            <Link
              to="/messages"
              className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
              title="Messages"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <PushNotifications />
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('auth.connecting')}</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">π</span>
                    <span>{t('nav.connect')}</span>
                  </>
                )}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Menu"
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

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-slate-700/50 mt-2 pt-3">
            {/* Main links */}
            <div className="space-y-1 mb-3">
              <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</p>
              {mainLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-indigo-600/20 text-indigo-300'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* EcoChain section */}
            <div className="space-y-1 mb-3">
              <p className="px-3 py-1 text-xs font-semibold text-emerald-500 uppercase tracking-wider">🌱 EcoChain AI</p>
              {ecoLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-emerald-600/15 text-emerald-300'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social & Gamification */}
            <div className="space-y-1 mb-3">
              <p className="px-3 py-1 text-xs font-semibold text-purple-400 uppercase tracking-wider">💬 Social</p>
              <Link to="/messages" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${location.pathname === '/messages' ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                💌 Messages {unreadMessages > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">{unreadMessages}</span>}
              </Link>
              <Link to="/community" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${location.pathname === '/community' ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                💬 Communauté
              </Link>
              <Link to="/badges" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${location.pathname === '/badges' ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                🏅 Badges
              </Link>
              <Link to="/project-tracking" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${location.pathname === '/project-tracking' ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                📋 Suivi Projets
              </Link>
            </div>

            {/* Secondary links */}
            <div className="space-y-1 pt-2 border-t border-slate-700/50">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-indigo-600/20 text-indigo-300'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}