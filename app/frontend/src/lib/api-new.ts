// Service HTTP local conservé pour compatibilité avec les anciens modules.
// Les nouvelles API `/api/v1/*` doivent utiliser `client.apiCall.invoke`.

// GUARD: reject unresolved Atoms placeholders like $$backend_domain$$ or $$BACKEND_DOMAIN$$
// Also reject URLs without a protocol. Fall back to the production URL if needed.
function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!raw) return 'https://atlasphere.pub.atoms.world';
  if (/\$\$[a-z_]+\$\$/i.test(raw)) {
    console.warn('[api] Ignoring unresolved placeholder in VITE_API_BASE_URL:', raw, '-> falling back to https://atlasphere.pub.atoms.world');
    return 'https://atlasphere.pub.atoms.world';
  }
  if (!/^https?:\/\//i.test(raw)) {
    console.warn('[api] VITE_API_BASE_URL missing protocol:', raw, '-> falling back to https://atlasphere.pub.atoms.world');
    return 'https://atlasphere.pub.atoms.world';
  }
  return raw;
}
const API_BASE_URL = resolveApiBaseUrl();

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
