import { useState, useEffect } from 'react';
import { getThemePreference, setTheme, subscribeTheme } from '@/lib/theme';
import { Sun, Moon, Monitor } from 'lucide-react';

type ThemeOption = 'dark' | 'light' | 'system';

export default function ThemeToggle() {
  const [current, setCurrent] = useState<ThemeOption>(getThemePreference() as ThemeOption);

  useEffect(() => {
    return subscribeTheme(() => setCurrent(getThemePreference() as ThemeOption));
  }, []);

  const cycle = () => {
    const order: ThemeOption[] = ['dark', 'light', 'system'];
    const idx = order.indexOf(current);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
  };

  const icon = current === 'dark' ? <Moon className="w-4 h-4" /> : current === 'light' ? <Sun className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
      title={`Thème: ${current === 'dark' ? 'Sombre' : current === 'light' ? 'Clair' : 'Système'}`}
    >
      {icon}
    </button>
  );
}