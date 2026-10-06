// AtlaspherePi API Service - Version locale (fetch direct)
// Ce fichier remplace les appels SDK MetagptX par des appels fetch() natifs

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ============================================
// Helper fetchAPI - Remplace getClient()
// ============================================
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = \\\\;
  console.log('[API]', options?.method || 'GET', url);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(\API error: \ \\);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
