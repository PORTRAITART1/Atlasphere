// Gestionnaire d'erreur global pour afficher les crashs à l'écran
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:20px;background:#1a1a2e;color:#ff6b6b;font-family:monospace;white-space:pre-wrap;font-size:14px;">
      <h2>🚨 Erreur JavaScript</h2>
      <p><strong>Message:</strong> ${event.message}</p>
      <p><strong>Fichier:</strong> ${event.filename}:${event.lineno}:${event.colno}</p>
      <p><strong>Stack:</strong> ${event.error ? event.error.stack : 'N/A'}</p>
    </div>`;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:20px;background:#1a1a2e;color:#ff6b6b;font-family:monospace;white-space:pre-wrap;font-size:14px;">
      <h2>🚨 Erreur de promesse non gérée</h2>
      <p><strong>Raison:</strong> ${event.reason}</p>
      <p><strong>Stack:</strong> ${event.reason && event.reason.stack ? event.reason.stack : 'N/A'}</p>
    </div>`;
  }
});

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadRuntimeConfig } from './lib/config.ts';
import './lib/i18n'; // Importe la configuration i18n

// Load runtime configuration before rendering the app
async function initializeApp() {
  // Prerendered blog pages are served as pure static HTML for SEO.
  // Intentionally skip React mounting so the crawler-facing markup stays
  // lightweight and self-contained — no client-side hydration needed.
  if (
    document
      .querySelector('meta[name="prerender-static-page"]')
      ?.getAttribute('content') === 'blog'
  ) {
    return;
  }

  try {
    await loadRuntimeConfig();
    console.log('Runtime configuration loaded successfully');
  } catch (error) {
    console.warn(
      'Failed to load runtime configuration, using defaults:',
      error
    );
  }

  // Render the app
  createRoot(document.getElementById('root')!).render(<App />);
}

// Initialize the app
initializeApp();
