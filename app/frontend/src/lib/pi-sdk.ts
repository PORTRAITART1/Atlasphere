// Pi Network SDK v2.0 Integration for Polis
// This module wraps the real Pi SDK with sandbox fallback

export interface PiUser {
  uid: string;
  username: string;
  displayName: string;
  avatar: string;
  reputation: number;
  votingPower: number;
  piBalance: number;
  joinedDate: string;
  proposalsCreated: number;
  votescast: number;
  contributions: number;
  badges: string[];
  level: string;
  piLocked: number;
  streakDays: number;
  kycVerified: boolean;
  language: string;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, string>;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => Promise<void>;
  onReadyForServerCompletion: (paymentId: string, txid: string) => Promise<void>;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
}

// Declare Pi SDK global type
declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox: boolean }) => void;
      authenticate: (scopes: string[], onIncompletePaymentFound: (payment: unknown) => void) => Promise<{ accessToken: string; user: { uid: string; username: string } }>;
      createPayment: (paymentData: PiPaymentData, callbacks: PiPaymentCallbacks) => Promise<unknown>;
    };
  }
}

let currentUser: PiUser | null = null;
const listeners: Set<() => void> = new Set();
let piSdkInitialized = false;

// Check if running inside Pi Browser
export function isInPiBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.Pi;
}

// Initialize Pi SDK
export function initPiSdk(): void {
  if (piSdkInitialized) return;

  if (window.Pi) {
    const isProduction = window.location.hostname.includes('.pi') || 
                         window.location.hostname.includes('mainnet');
    window.Pi.init({
      version: '2.0',
      sandbox: !isProduction
    });
    piSdkInitialized = true;
    console.log('[Polis] Pi SDK initialized', { sandbox: !isProduction });
  } else {
    console.log('[Polis] Pi SDK not available - running in standalone mode');
  }
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getCurrentUser(): PiUser | null {
  return currentUser;
}

export function setCurrentUser(user: PiUser | null): void {
  currentUser = user;
  notifyListeners();
}

// Handle incomplete payments found during authentication
function onIncompletePaymentFound(payment: unknown) {
  console.log('[Polis] Incomplete payment found:', payment);
  // TODO: Handle incomplete payment - send to server for completion
}

// Authenticate with Pi Network (real SDK or sandbox simulation)
export async function authenticate(): Promise<PiUser> {
  if (window.Pi) {
    // Real Pi SDK authentication
    try {
      const scopes = ['username', 'payments'];
      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

      // The access token should be verified server-side
      const piUser: PiUser = {
        uid: auth.user.uid,
        username: auth.user.username,
        displayName: auth.user.username,
        avatar: '🧑‍💻',
        reputation: 0,
        votingPower: 10,
        piBalance: 0, // Will be fetched from server
        joinedDate: new Date().toISOString().split('T')[0],
        proposalsCreated: 0,
        votescast: 0,
        contributions: 0,
        badges: [],
        level: 'bronze',
        piLocked: 0,
        streakDays: 0,
        kycVerified: false,
        language: 'fr'
      };

      currentUser = piUser;
      localStorage.setItem('polis_pi_token', auth.accessToken);
      localStorage.setItem('polis_user', JSON.stringify(piUser));
      notifyListeners();
      return piUser;
    } catch (error) {
      console.error('[Polis] Pi authentication failed:', error);
      throw error;
    }
  } else {
    // Sandbox simulation for development outside Pi Browser
    await new Promise((r) => setTimeout(r, 1200));
    currentUser = {
      uid: 'pioneer_' + Math.random().toString(36).slice(2, 10),
      username: 'pioneer_dao',
      displayName: 'Pioneer DAO',
      avatar: '🧑‍💻',
      reputation: 850,
      votingPower: 42,
      piBalance: 1247.5,
      joinedDate: '2024-03-15',
      proposalsCreated: 3,
      votescast: 28,
      contributions: 12,
      badges: ['Early Voter', 'Proposal Creator', 'Top Contributor', 'Community Builder'],
      level: 'silver',
      piLocked: 500,
      streakDays: 14,
      kycVerified: true,
      language: 'fr'
    };
    localStorage.setItem('polis_user', JSON.stringify(currentUser));
    notifyListeners();
    return currentUser;
  }
}

// Create a Pi payment (U2A - User to App)
export async function createPiPayment(
  amount: number,
  memo: string,
  metadata: Record<string, string>,
  onApprove: (paymentId: string) => Promise<void>,
  onComplete: (paymentId: string, txid: string) => Promise<void>
): Promise<boolean> {
  if (window.Pi) {
    // Real Pi payment
    try {
      await window.Pi.createPayment(
        { amount, memo, metadata },
        {
          onReadyForServerApproval: onApprove,
          onReadyForServerCompletion: onComplete,
          onCancel: (paymentId) => {
            console.log('[Polis] Payment cancelled:', paymentId);
          },
          onError: (error) => {
            console.error('[Polis] Payment error:', error);
          }
        }
      );
      return true;
    } catch (error) {
      console.error('[Polis] Payment creation failed:', error);
      return false;
    }
  } else {
    // Sandbox simulation
    await new Promise((r) => setTimeout(r, 800));
    const fakePaymentId = 'pay_' + Math.random().toString(36).slice(2, 12);
    const fakeTxid = 'tx_' + Math.random().toString(36).slice(2, 16);

    await onApprove(fakePaymentId);
    await new Promise((r) => setTimeout(r, 500));
    await onComplete(fakePaymentId, fakeTxid);

    if (currentUser && currentUser.piBalance >= amount) {
      currentUser = {
        ...currentUser,
        piBalance: currentUser.piBalance - amount,
        contributions: currentUser.contributions + 1
      };
      notifyListeners();
    }
    return true;
  }
}

export function logout() {
  currentUser = null;
  localStorage.removeItem('polis_user');
  localStorage.removeItem('polis_pi_token');
  notifyListeners();
}

// Legacy compatibility
export async function contributePI(amount: number): Promise<boolean> {
  return createPiPayment(
    amount,
    'Polis contribution',
    { type: 'donation' },
    async () => {},
    async () => {}
  );
}

export async function castVote(): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600));
  if (currentUser) {
    currentUser = {
      ...currentUser,
      votescast: currentUser.votescast + 1,
      reputation: currentUser.reputation + 5
    };
    notifyListeners();
    return true;
  }
  return false;
}

// Restore user from localStorage on load
export function restoreSession(): void {
  try {
    const saved = localStorage.getItem('polis_user');
    if (saved) {
      currentUser = JSON.parse(saved);
      notifyListeners();
    }
  } catch {
    // ignore parse errors
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  restoreSession();
  // Try to init Pi SDK after DOM is ready
  if (document.readyState === 'complete') {
    initPiSdk();
  } else {
    window.addEventListener('load', initPiSdk);
  }
}