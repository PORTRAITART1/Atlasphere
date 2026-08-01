// Theme management - Dark/Light mode with persistence

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

const STORAGE_KEY = 'atlasphere_theme';
let listeners: (() => void)[] = [];

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getThemePreference(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'dark';
}

export function getResolvedTheme(): ResolvedTheme {
  const pref = getThemePreference();
  if (pref === 'system') return getSystemTheme();
  return pref;
}

export function setTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme();
  listeners.forEach((fn) => fn());
}

export function applyTheme() {
  const resolved = getResolvedTheme();
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
}

export function subscribeTheme(fn: () => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

// Initialize on load
if (typeof window !== 'undefined') {
  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemePreference() === 'system') {
      applyTheme();
      listeners.forEach((fn) => fn());
    }
  });
}