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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [, setLangTick] = useState(0);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
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

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const unreadMessages = getTotalUnread();

  const mainLinks = [
    { path: '/', label: t('nav.home'), icon: '🏠' },
    { path: '/proposals', label: t('nav.proposals'), icon: '📋' },
    { path: '/funding', label: t('nav.funding'), icon: '💎' },
    { path: '/community', label: t('nav.community'), icon: '💬' },
    { path: '/quests', label: t('nav.quests'), icon: '🎯' },
  ];

  const ecoLinks = [
    { path: '/eco-wallet', label: t('nav.eco.wallet'), icon: '🌿', desc: t('nav.eco.wallet_desc') },
    { path: '/climate', label: t('nav.eco.climate'), icon: '🌍', desc: t('nav.eco.climate_desc') },
    { path: '/eco-market', label: t('nav.eco.market'), icon: '🛒', desc: t('nav.eco.market_desc') },
    { path: '/predictions', label: t('nav.eco.predictions'), icon: '🤖', desc: t('nav.eco.predictions_desc') },
    { path: '/eco-nft', label: t('nav.eco.nft'), icon: '🎨', desc: t('nav.eco.nft_desc') },
    { path: '/eco-sensors', label: t('nav.eco.sensors'), icon: '📡', desc: t('nav.eco.sensors_desc') },
    { path: '/lifestyle', label: t('nav.eco.optimizer'), icon: '✨', desc: t('nav.eco.optimizer_desc') },
    { path: '/eco-leaderboard', label: t('nav.eco.leaderboard'), icon: '🏆', desc: t('nav.eco.leaderboard_desc') },
    { path: '/eco-premium', label: t('nav.eco.premium'), icon: '👑', desc: t('nav.eco.premium_desc') },
    { path: '/eco-api', label: t('nav.eco.api'), icon: '🔗', desc: t('nav.eco.api_desc') },
    { path: '/iot-anomalies', label: t('nav.eco.anomalies'), icon: '🚨', desc: t('nav.eco.anomalies_desc') },
    { path: '/carbon-credits', label: t('nav.eco.carbon'), icon: '🌱', desc: t('nav.eco.carbon_desc') },
  ];

  const daoLinks = [
    { path: '/quadratic-voting', label: t('nav.dao.quadratic'), icon: '📐', desc: t('nav.dao.quadratic_desc') },
    { path: '/committees', label: t('nav.dao.committees'), icon: '🏛️', desc: t('nav.dao.committees_desc') },
    { path: '/treasury', label: t('nav.dao.treasury'), icon: '💰', desc: t('nav.dao.treasury_desc') },
    { path: '/guilds', label: t('nav.dao.guilds'), icon: '🛡️', desc: t('nav.dao.guilds_desc') },
    { path: '/seasons', label: t('nav.dao.seasons'), icon: '🌊', desc: t('nav.dao.seasons_desc') },
    { path: '/delegation', label: t('nav.dao.delegation'), icon: '🤝', desc: t('nav.dao.delegation_desc') },
  ];

  const moreLinks = [
    { path: '/my-dashboard', label: t('nav.more.dashboard'), icon: '📊', desc: t('nav.more.dashboard_desc') },
    { path: '/rewards', label: t('nav.more.rewards'), icon: '🎁', desc: t('nav.more.rewards_desc') },
    { path: '/badges', label: t('nav.more.badges'), icon: '🏅', desc: t('nav.more.badges_desc') },
    { path: '/profile', label: t('nav.more.profile'), icon: '👤', desc: t('nav.more.profile_desc') },
    { path: '/referral', label: t('nav.more.referral'), icon: '👥', desc: t('nav.more.referral_desc') },
    { path: '/partners', label: t('nav.more.partners'), icon: '🤝', desc: t('nav.more.partners_desc') },
    { path: '/eco-ads', label: t('nav.more.ads'), icon: '📺', desc: t('nav.more.ads_desc') },
    { path: '/ipfs-storage', label: t('nav.more.ipfs'), icon: '💾', desc: t('nav.more.ipfs_desc') },
    { path: '/analytics', label: t('nav.more.analytics'), icon: '📈', desc: t('nav.more.analytics_desc') },
    { path: '/map', label: t('nav.more.map'), icon: '🗺️', desc: t('nav.more.map_desc') },
    { path: '/notification-settings', label: t('nav.more.notifications'), icon: '🔔', desc: t('nav.more.notifications_desc') },
    { path: '/marketing-download', label: t('nav.more.marketing'), icon: '📦', desc: t('nav.more.marketing_desc') },
    { path: '/settings', label: t('nav.more.settings'), icon: '⚙️', desc: t('nav.more.settings_desc') },
    { path: '/admin', label: t('nav.more.admin'), icon: '🛡️', desc: t('nav.more.admin_desc') },
  ];

  const isEcoActive = ecoLinks.some((l) => location.pathname === l.path);
  const isDaoActive = daoLinks.some((l) => location.pathname === l.path);
  const isMoreActive = moreLinks.some((l) => location.pathname === l.path);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/[0.06]" ref={navRef}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <img
                src="/assets/logo-atlasphere-transparent.png"
                alt="Atlasphere"
                className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
                style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(58%) saturate(600%) hue-rotate(2deg) brightness(103%) contrast(104%)' }}
              />
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
              Atlasphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {location.pathname === link.path && (
                  <span className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]" />
                )}
              </Link>
            ))}

            {/* Separator */}
            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* EcoChain Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('eco')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isEcoActive || activeDropdown === 'eco'
                    ? 'text-emerald-300 bg-emerald-500/10'
                    : 'text-gray-400 hover:text-emerald-300'
                }`}
              >
                <span className="text-xs">🌱</span>
                <span>EcoChain</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'eco' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'eco' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] bg-slate-800/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{t('nav.ecochain')} AI</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{t('nav.ecochain_desc')}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-0.5">
                      {ecoLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                            location.pathname === link.path
                              ? 'bg-emerald-500/15 text-emerald-200'
                              : 'text-gray-300 hover:bg-white/[0.04] hover:text-white'
                          }`}
                        >
                          <span className="text-base mt-0.5 shrink-0">{link.icon}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{link.label}</p>
                            <p className="text-[11px] text-gray-500 truncate">{link.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DAO Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('dao')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDaoActive || activeDropdown === 'dao'
                    ? 'text-purple-300 bg-purple-500/10'
                    : 'text-gray-400 hover:text-purple-300'
                }`}
              >
                <span className="text-xs">🏛️</span>
                <span>DAO</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'dao' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'dao' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-slate-800/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{t('nav.dao_desc')}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{t('nav.dao_decisions')}</p>
                    </div>
                    <div className="space-y-0.5">
                      {daoLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                            location.pathname === link.path
                              ? 'bg-purple-500/15 text-purple-200'
                              : 'text-gray-300 hover:bg-white/[0.04] hover:text-white'
                          }`}
                        >
                          <span className="text-base shrink-0">{link.icon}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{link.label}</p>
                            <p className="text-[11px] text-gray-500">{link.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* More Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('more')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isMoreActive || activeDropdown === 'more'
                    ? 'text-amber-300 bg-amber-500/10'
                    : 'text-gray-400 hover:text-amber-300'
                }`}
              >
                <span>{t('nav.more')}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'more' && (
                <div className="absolute top-full right-0 mt-2 w-[480px] bg-slate-800/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{t('nav.explore')}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{t('nav.explore_desc')}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-0.5">
                      {moreLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                            location.pathname === link.path
                              ? 'bg-amber-500/15 text-amber-200'
                              : 'text-gray-300 hover:bg-white/[0.04] hover:text-white'
                          }`}
                        >
                          <span className="text-base shrink-0">{link.icon}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{link.label}</p>
                            <p className="text-[11px] text-gray-500 truncate">{link.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="hidden sm:block">
              <GlobalSearch />
            </div>

            <Link
              to="/messages"
              className="relative p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              title={t('nav.messages')}
            >
              <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-slate-900">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>

            <LanguageSelector />
            <div className="hidden sm:block"><ThemeToggle /></div>
            <div className="hidden sm:block"><PushNotifications /></div>
            <NotificationBell />

            {user ? (
              <div className="flex items-center gap-1 sm:gap-1.5 ml-0.5 sm:ml-1">
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-amber-400 text-sm font-semibold">{user.piBalance.toFixed(1)}</span>
                  <span className="text-amber-500/70 text-sm">π</span>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1.5 rounded-xl hover:bg-white/[0.06] transition-all duration-200 group"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold ring-2 ring-indigo-500/30 group-hover:ring-indigo-400/50 transition-all">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-sm text-white font-medium leading-tight">@{user.username}</span>
                    <span className="text-[11px] text-indigo-400/80 leading-tight">
                      {user.kycVerified ? '✓ KYC' : ''} • Lv.{user.level}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="hidden sm:block p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
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
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 ml-0.5 sm:ml-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] shrink-0 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">{t('auth.connecting')}</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm sm:text-base font-bold">π</span>
                    <span>{t('nav.connect')}</span>
                  </>
                )}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition-all duration-200 ml-1"
              aria-label={t('nav.menu')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden pb-4 border-t border-white/[0.06] mt-2 pt-4 max-h-[80vh] overflow-y-auto">
            {/* Main links */}
            <div className="space-y-0.5 mb-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('nav.navigation')}</p>
              {mainLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-white/[0.08] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* EcoChain section */}
            <div className="space-y-0.5 mb-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">🌱 {t('nav.ecochain')} AI</p>
              <div className="grid grid-cols-2 gap-0.5">
                {ecoLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span className="truncate">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* DAO section */}
            <div className="space-y-0.5 mb-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-purple-400 uppercase tracking-widest">🏛️ {t('nav.dao_desc')}</p>
              {daoLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-purple-500/15 text-purple-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Social section */}
            <div className="space-y-0.5 mb-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest">💬 {t('nav.social')}</p>
              <Link to="/messages" className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === '/messages' ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>
                <span>💌</span>
                <span>{t('nav.messages')}</span>
                {unreadMessages > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadMessages}</span>}
              </Link>
              <Link to="/badges" className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === '/badges' ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>
                <span>🏅</span>
                <span>{t('nav.badges')}</span>
              </Link>
              <Link to="/project-tracking" className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === '/project-tracking' ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>
                <span>📋</span>
                <span>{t('nav.project_tracking')}</span>
              </Link>
            </div>

            {/* More section */}
            <div className="space-y-0.5 pt-3 border-t border-white/[0.06]">
              <p className="px-3 py-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest">⚡ {t('nav.more')}</p>
              <div className="grid grid-cols-2 gap-0.5">
                {moreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span className="truncate">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}