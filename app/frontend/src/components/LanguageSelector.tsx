import { useState, useEffect, useRef } from 'react';
import { getLocale, setLocale, subscribeI18n, locales, localeNames, localeFlags, type Locale } from '@/lib/i18n';

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Locale>(getLocale());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeI18n(() => setCurrentLang(getLocale()));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (locale: Locale) => {
    setLocale(locale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-gray-300 hover:text-white hover:border-indigo-500/30 transition-all"
        aria-label="Select language"
      >
        <span>{localeFlags[currentLang]}</span>
        <span className="hidden sm:inline">{currentLang.toUpperCase()}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleSelect(locale)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                locale === currentLang
                  ? 'bg-indigo-600/20 text-indigo-300'
                  : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}