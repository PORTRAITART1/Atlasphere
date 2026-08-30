/**
 * Administrator access control for Atlasphere.
 *
 * The list of administrator Pi usernames is provided at build time through the
 * `VITE_ADMIN_USERNAMES` environment variable (comma separated, case-insensitive).
 * Example: VITE_ADMIN_USERNAMES="my_pi_username,second_admin"
 *
 * Keeping the list in the build configuration (instead of localStorage) prevents a
 * visitor from granting themselves administrator rights from the browser console.
 */

import { getCurrentUser } from '@/lib/pi-sdk';

/** Routes that must only be reachable by administrators. */
export const ADMIN_ONLY_PATHS = ['/settings', '/admin'];

/** Fallback administrators used when no environment configuration is provided. */
const DEFAULT_ADMIN_USERNAMES = ['atlasphere', 'atlasphere_admin'];

function parseAdminUsernames(): string[] {
  const raw = (import.meta.env.VITE_ADMIN_USERNAMES as string | undefined) || '';
  const parsed = raw
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter((name) => name.length > 0);

  return parsed.length > 0 ? parsed : DEFAULT_ADMIN_USERNAMES;
}

/** All configured administrator usernames, normalized to lowercase. */
export const ADMIN_USERNAMES = parseAdminUsernames();

/** Returns true when the given username belongs to an administrator. */
export function isAdminUsername(username?: string | null): boolean {
  if (!username) return false;
  return ADMIN_USERNAMES.includes(username.trim().toLowerCase());
}

/** Returns true when the currently authenticated Pioneer is an administrator. */
export function isAdminUser(): boolean {
  return isAdminUsername(getCurrentUser()?.username);
}