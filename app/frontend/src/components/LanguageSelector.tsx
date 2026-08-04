import { useState, useEffect, useRef, useCallback } from 'react';
import { getLocale, setLocale, subscribeI18n, locales, localeNames, localeFlags, type Locale } from '@/lib/i18n';

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Locale>(getLocale());
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeI18n(() => setCurrentLang(getLocale()));
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node;
    if (
      buttonRef.current && !buttonRef.current.contains(target) &&
      dropdownRef.current && !dropdownRef.current.contains(target)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside as EventListener);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
    };
  }, [isOpen, handleClickOutside]);

  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (locale: Locale) => {
    setLocale(locale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onTouchEnd={handleToggle}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-gray-300 hover:text-white hover:border-indigo-500/30 transition-all active:scale-95"
        aria-label="Select language"
        aria-expanded={isOpen}
        type="button"
      >
        <span className="text-base">{localeFlags[currentLang]}</span>
        <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleSelect(locale)}
                type="button"
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                  locale === currentLang
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white active:bg-slate-700'
                }`}
              >
                <span className="text-base">{localeFlags[locale]}</span>
                <span className="font-medium">{localeNames[locale]}</span>
                {locale === currentLang && (
                  <svg className="w-4 h-4 ml-auto text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}