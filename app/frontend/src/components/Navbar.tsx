import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PiSDK } from '@/lib/pi-sdk';
import { getUser, setUser, subscribe as storeSubscribe, getCart } from '@/lib/store';
import { t, setLanguage, getLanguage, LANGUAGES, Language } from '@/lib/i18n';
import { ShoppingCart, User, Menu, X, Globe, LogOut } from 'lucide-react';

export default function Navbar() {
  const [user, setLocalUser] = useState(getUser());
  const [cartCount, setCartCount] = useState(getCart().length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLang] = useState(getLanguage());
  const location = useLocation();

  useEffect(() => {
    const unsub = storeSubscribe(() => {
      setLocalUser(getUser());
      setCartCount(getCart().length);
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const piUser = await PiSDK.authenticate();
      setUser(piUser);
    } catch (err) {
      console.error('Auth failed:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    PiSDK.logout();
    setUser(null);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLang(lang);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/marketplace', label: t('nav.marketplace') },
    { path: '/subscriptions', label: t('nav.subscriptions') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-amber-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">π</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">PiMarket</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-amber-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/seller"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/seller'
                    ? 'text-amber-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {t('nav.sell')}
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-purple-500/20">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-purple-500/30">
                {LANGUAGES.map(lang => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`text-gray-200 hover:bg-purple-500/20 cursor-pointer ${
                      getLanguage() === lang.code ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-purple-500/20">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-amber-500 text-xs text-gray-900">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-purple-500/20 gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-purple-500/30">
                  <DropdownMenuItem asChild className="text-gray-200 hover:bg-purple-500/20 cursor-pointer">
                    <Link to="/profile">{t('nav.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-200 hover:bg-purple-500/20 cursor-pointer">
                    <Link to="/seller">{t('nav.sell')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-red-500/20 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleLogin}
                disabled={loading}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white"
              >
                {loading ? t('common.loading') : t('nav.login')}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-purple-500/20 mt-2 pt-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  location.pathname === link.path ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/seller"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-gray-300"
              >
                {t('nav.sell')}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}