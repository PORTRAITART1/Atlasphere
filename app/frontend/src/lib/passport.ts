export interface PassportData {
  pi_uid: string;
  username: string;
  score: number;
  level: 'novice' | 'active' | 'verified' | 'trusted' | 'pioneer' | 'flagship';
  breakdown: Record<string, number>;
  weights: Record<string, number>;
  votes_cast: number;
  projects_funded: number;
  kyc_verified: boolean;
}

export async function fetchPassport(piUid: string): Promise<PassportData | null> {
  try {
    const r = await fetch(`/api/v1/pi-auth/passport/${piUid}`);
    if (!r.ok) return null;
    const data = await r.json();
    if (data.detail) return null;
    return data as PassportData;
  } catch {
    return null;
  }
}

export const LEVEL_COLORS: Record<string, string> = {
  novice: 'gray', active: 'blue', verified: 'green',
  trusted: 'teal', pioneer: 'purple', flagship: 'gold',
};
