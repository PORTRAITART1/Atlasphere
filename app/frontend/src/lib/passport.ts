export interface PassportData {
  pi_uid: string;
  username: string;
  score: number;
  level: string;
  voting_power: number;
  votes_cast: number;
  projects_funded: number;
  breakdown: Record<string, number>;
  weights: Record<string, number>;
  public_fields: string[];
}

export interface MyPassportData {
  pi_uid: string;
  username: string;
  score: number;
  level: string;
  voting_power: number;
  votes_cast: number;
  projects_funded: number;
  is_public: boolean;
}

export async function fetchMyPassport(): Promise<MyPassportData | null> {
  const token = localStorage.getItem('atlasphere_pi_token');
  if (!token) return null;
  try {
    const response = await fetch('/api/v1/pi-auth/passport/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return await response.json() as MyPassportData;
  } catch {
    return null;
  }
}

export async function setPassportVisibility(
  piUid: string,
  isPublic: boolean
): Promise<boolean> {
  const token = localStorage.getItem('atlasphere_pi_token');
  if (!token) return false;
  try {
    const response = await fetch('/api/v1/pi-auth/passport/visibility', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pi_uid: piUid, pi_access_token: token, is_public: isPublic }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchPassport(piUid: string): Promise<PassportData | null> {
  try {
    const r = await fetch(`/api/v1/pi-auth/passport/${encodeURIComponent(piUid)}`);
    if (!r.ok) return null;
    return await r.json() as PassportData;
  } catch {
    return null;
  }
}

export const LEVEL_COLORS: Record<string, string> = {
  novice: 'gray', active: 'blue', verified: 'green',
  trusted: 'teal', pioneer: 'purple', flagship: 'gold',
};
