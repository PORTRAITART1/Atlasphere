// Pi Network SDK v2.0 Integration for Atlasphere
// Aligned with @pinetwork-js/sdk and Pi Develop platform standards
// Reference: https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md
import { createClient } from '@metagptx/web-sdk';
import { getAPIBaseURL } from './config';

// --- Pi SDK Types (aligned with @pinetwork-js/api-typing) ---

/** Pi Network user object returned by authenticate() */
export interface APIUser {
  uid: string;
  username: string;
}

/** Payment data for createPayment() */
export interface APIPartialPayment {
  amount: number;
  memo: string;
  metadata: Record<string, string>;
}

/** Full payment object (returned on incomplete payment) */
export interface APIPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, string>;
  from_address: string;
  to_address: string;
  direction: 'user_to_app' | 'app_to_user';
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
  };
  transaction: {
    txid: string;
    verified: boolean;
  } | null;
  created_at: string;
}

/** Callbacks for payment lifecycle */
export interface PaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => Promise<void>;
  onReadyForServerCompletion: (paymentId: string, txid: string) => Promise<void>;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: APIPayment) => void;
}

/** Authentication result */
export interface AuthResult {
  accessToken: string;
  user: APIUser;
}

/** Available SDK scopes (per Pi SDK docs: payments, username, roles, wallet_address) */
export type APIScope = 'payments' | 'username' | 'roles' | 'wallet_address';
export type APIScopes = APIScope[];

// --- Atlasphere User Profile (extends Pi user with app-specific data) ---

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
  atlasphere_jwt?: string;  // JWT Atlasphere pour les appels API authentifiés
}

// --- PiRC2 Subscription Types (Soroban Smart Contract) ---

export interface PiRC2Service {
  service_id: number;
  merchant: string;
  name: string;
  price: number;
  period_secs: number;
  trial_period_secs: number;
  approve_periods: number;
  is_active: boolean;
  created_at: number;
}

export interface PiRC2Subscription {
  sub_id: number;
  subscriber: string;
  service_id: number;
  price: number;
  period_secs: number;
  trial_period_secs: number;
  trial_end_ts: number;
  auto_renew: boolean;
  service_end_ts: number;
  next_charge_ts: number;
  created_at: number;
}

export interface PiRC2ProcessResult {
  charged: number;
  failed: number;
  skipped: number;
  total: number;
}

// PiRC2 Contract configuration
export const PIRC2_CONTRACT_ID = 'CCUF75B6W3HRJTJD6O7OXNI72HGJ7DERZ5MUNOMFMSK23ME5GUIKPFYV';
export const PI_NETWORK_PASSPHRASE = 'Pi Testnet';

// --- Declare Pi SDK global type (aligned with official Pi SDK docs) ---
declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (
        scopes: APIScopes,
        onIncompletePaymentFound?: (payment: APIPayment) => void
      ) => Promise<AuthResult>;
      createPayment: (
        paymentData: APIPartialPayment,
        callbacks: PaymentCallbacks
      ) => Promise<void>;
      openShareDialog: (title: string, sharingMessage: string) => void;
      openConversation: (conversationId: number) => void;
      nativeFeaturesList: () => Promise<string[]>;
      requestPermission: (permission: string) => Promise<boolean>;
      copyText: (text: string) => void;
      openUrlInSystemBrowser: (url: string) => void;
      Ads?: {
        isAdReady: (adType: string) => Promise<boolean>;
        requestAd: (adType: string) => Promise<void>;
        showAd: (adType: string) => Promise<{ completed: boolean }>;
      };
    };
  }
}

let currentUser: PiUser | null = null;
const client = createClient();
const listeners: Set<() => void> = new Set();
let piSdkInitialized = false;

// Check if running inside Pi Browser
export function isInPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isPiBrowser = ua.includes('PiBrowser') || ua.includes('Pi Network');
  return isPiBrowser && !!window.Pi;
}

// Helper : retourne le header Authorization avec le JWT Atlasphere
function authHeaders(): Record<string, string> {
  const jwt = localStorage.getItem('atlasphere_jwt') || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwt}`,
  };
}

let _piInitPromise: Promise<void> | null = null;
let _atlasphereExchangePromise: Promise<string> | null = null;

export async function ensureAtlasphereJwt(): Promise<string> {
  const piAccessToken = localStorage.getItem('atlasphere_pi_token') || '';
  if (!piAccessToken) {
    throw new Error('Pi authentication is required');
  }

  if (!_atlasphereExchangePromise) {
    _atlasphereExchangePromise = fetch(`${getAPIBaseURL()}/api/v1/pi-auth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: piAccessToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          localStorage.removeItem('atlasphere_jwt');
          return piAccessToken;
        }
        const data = await response.json() as { atlasphere_jwt?: string };
        if (!data.atlasphere_jwt) throw new Error('Atlasphere token missing');
        localStorage.setItem('atlasphere_jwt', data.atlasphere_jwt);
        return data.atlasphere_jwt;
      })
      .catch(() => piAccessToken)
      .finally(() => {
        _atlasphereExchangePromise = null;
      });
  }

  return _atlasphereExchangePromise;
}

export async function initPiSdk(): Promise<void> {
  if (piSdkInitialized) return;

  if (!window.Pi) {
    console.error('[Atlasphere] Pi SDK not available');
    throw new Error('Pi SDK not available');
  }

  if (!_piInitPromise) {
    _piInitPromise = window.Pi.init({
      version: '2.0',
      sandbox: false
    }).then(() => {
      piSdkInitialized = true;
      console.log('[Atlasphere] Pi SDK initialized', { sandbox: false });
    });
  }

  await _piInitPromise;
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

async function postPiPaymentEndpoint<T>(
  path: '/approve' | '/complete' | '/cancel',
  data: Record<string, string>
): Promise<T> {
  const response = await fetch(`/api/v1/pi-pay${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await response.text();
  if (!response.ok) {
    let detail = body;
    try {
      const parsed = JSON.parse(body) as { detail?: string; message?: string };
      detail = parsed.detail || parsed.message || body;
    } catch {
      // Keep the raw response when the gateway does not return JSON.
    }
    throw new Error(detail || `Erreur serveur (${response.status})`);
  }

  return (body ? JSON.parse(body) : {}) as T;
}

// Handle incomplete payments found during authentication
async function onIncompletePaymentFound(payment: APIPayment) {
  console.log('[Atlasphere] Incomplete payment found:', payment.identifier, payment.status);

  try {
    if (payment.status.cancelled) {
      console.log('[Atlasphere] Payment was cancelled, skipping:', payment.identifier);
      return;
    }

    if (!payment.status.developer_approved) {
      console.log('[Atlasphere] Approving incomplete payment:', payment.identifier);

      const piAccessToken = localStorage.getItem('atlasphere_pi_token') || '';
      const approveResponse = await postPiPaymentEndpoint<Record<string, unknown>>('/approve', {
        payment_id: payment.identifier,
        pi_access_token: piAccessToken,
      });

      if (!approveResponse) {
        throw new Error('Le serveur n’a pas confirmé l’approbation du paiement.');
      }
    }

    if (payment.transaction?.verified && !payment.status.developer_completed) {
      console.log('[Atlasphere] Completing incomplete payment:', payment.identifier);

      const piAccessToken = localStorage.getItem('atlasphere_pi_token') || '';
      const completeResponse = await postPiPaymentEndpoint<Record<string, unknown>>('/complete', {
        payment_id: payment.identifier,
        txid: payment.transaction.txid,
        pi_access_token: piAccessToken,
      });

      if (!completeResponse) {
        throw new Error('Le serveur n’a pas confirmé la finalisation du paiement.');
      }

      console.log('[Atlasphere] Incomplete payment completed successfully:', payment.identifier);
    }
  } catch (error) {
    console.error('[Atlasphere] Failed to resume incomplete payment:', payment.identifier, error);
  }
}

// Verify Pi token with backend and get/create profile
async function verifyWithBackend(accessToken: string): Promise<PiUser | null> {
  try {
    // Note : la vérification initiale utilise le token Pi, pas le JWT
    const response = await fetch(`${getAPIBaseURL()}/api/v1/pi-auth/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
      console.warn('[Atlasphere] Backend verify failed:', response.status);
      return null;
    }

    const data = await response.json();
    if (data) {
      // ⭐ Stocker le JWT Atlasphere retourné par le backend
      if (data.atlasphere_jwt) {
        localStorage.setItem('atlasphere_jwt', data.atlasphere_jwt);
        console.log('[Atlasphere] JWT Atlasphere stocké');
      }

      return {
        uid: data.pi_uid,
        username: data.username,
        displayName: data.display_name || data.username,
        avatar: '🧑‍💻',
        reputation: data.reputation || 0,
        votingPower: data.voting_power || 1,
        piBalance: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        proposalsCreated: 0,
        votescast: 0,
        contributions: 0,
        badges: data.badges || [],
        level: data.level || 'bronze',
        piLocked: data.pi_locked || 0,
        streakDays: data.streak_days || 0,
        kycVerified: data.kyc_verified || false,
        language: data.language || 'en',
        atlasphere_jwt: data.atlasphere_jwt,
      };
    }
  } catch (error) {
    console.warn('[Atlasphere] Backend verification failed, using local profile:', error);
  }
  return null;
}

// Get profile from backend
async function fetchProfileFromBackend(): Promise<PiUser | null> {
  try {
    const response = await fetch(`${getAPIBaseURL()}/api/v1/pi-auth/profile`, {
      method: 'GET',
      headers: authHeaders(),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data) {
      return {
        uid: data.pi_uid,
        username: data.username,
        displayName: data.display_name || data.username,
        avatar: '🧑‍💻',
        reputation: data.reputation || 0,
        votingPower: data.voting_power || 1,
        piBalance: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        proposalsCreated: 0,
        votescast: 0,
        contributions: 0,
        badges: data.badges || [],
        level: data.level || 'bronze',
        piLocked: data.pi_locked || 0,
        streakDays: data.streak_days || 0,
        kycVerified: data.kyc_verified || false,
        language: data.language || 'en',
      };
    }
  } catch {
    // Profile not found
  }
  return null;
}

// Helper: race a promise against a timeout
function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(timeoutMsg)), ms)),
  ]);
}

// Authenticate with Pi Network using the real Pi SDK
export async function authenticate(): Promise<PiUser> {
  await initPiSdk();

  if (!isInPiBrowser() || !window.Pi) {
    throw new Error('Pi authentication requires Pi Browser and Pi SDK');
  }

  try {
    const scopes: APIScopes = ['username'];
    const auth = await withTimeout(
      window.Pi.authenticate(scopes, onIncompletePaymentFound),
      15000,
      'Pi authentication timeout'
    );

    // Note : on garde le token Pi pour la vérification initiale
    localStorage.setItem('atlasphere_pi_token', auth.accessToken);

    const backendUser = await verifyWithBackend(auth.accessToken);

    if (backendUser) {
      currentUser = backendUser;
    } else {
      currentUser = {
        uid: auth.user.uid,
        username: auth.user.username,
        displayName: auth.user.username,
        avatar: '🧑‍💻',
        reputation: 0,
        votingPower: 10,
        piBalance: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        proposalsCreated: 0,
        votescast: 0,
        contributions: 0,
        badges: [],
        level: 'bronze',
        piLocked: 0,
        streakDays: 0,
        kycVerified: false,
        language: 'en'
      };
    }

    localStorage.setItem('atlasphere_user', JSON.stringify(currentUser));
    notifyListeners();
    return currentUser;
  } catch (error) {
    console.error('[Atlasphere] Pi authentication failed:', error);
    throw error;
  }
}

// Create a Pi payment (U2A - User to App) with backend integration
export async function createPiPayment(
  amount: number,
  memo: string,
  metadata: Record<string, string>,
  onApprove?: (paymentId: string) => Promise<void>,
  onComplete?: (paymentId: string, txid: string) => Promise<void>
): Promise<boolean> {
  try {
    await initPiSdk();

    if (!isInPiBrowser() || !window.Pi) {
      throw new Error('Pi payment requires Pi Browser and Pi SDK');
    }

    const auth = await window.Pi.authenticate(
      ['payments', 'username'],
      onIncompletePaymentFound
    );
    localStorage.setItem('atlasphere_pi_token', auth.accessToken);

    const purpose = metadata.purpose
      || (metadata.type === 'contribution' ? 'project_funding' : metadata.type)
      || 'donation';
    const projectId = metadata.project_id || metadata.projectId;
    const normalizedMetadata: Record<string, string> = {
      ...metadata,
      purpose,
    };
    delete normalizedMetadata.type;
    delete normalizedMetadata.projectId;
    if (projectId) normalizedMetadata.project_id = projectId;

    let resolveLifecycle!: (completed: boolean) => void;
    let rejectLifecycle!: (error: Error) => void;
    const lifecycle = new Promise<boolean>((resolve, reject) => {
      resolveLifecycle = resolve;
      rejectLifecycle = reject;
    });

    const walletFlow = window.Pi.createPayment(
      { amount, memo, metadata: normalizedMetadata },
      {
        onReadyForServerApproval: async (paymentId: string) => {
          try {
            await postPiPaymentEndpoint('/approve', {
              payment_id: paymentId,
              pi_access_token: auth.accessToken,
            });

            console.log('[Atlasphere] Payment approved by server:', paymentId);
          } catch (err) {
            console.error('[Atlasphere] Server approval failed:', err);
            const error = err instanceof Error ? err : new Error(String(err));
            rejectLifecycle(error);
            throw error;
          }

          if (onApprove) await onApprove(paymentId);
        },

        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          try {
            await postPiPaymentEndpoint('/complete', {
              payment_id: paymentId,
              txid,
              pi_access_token: auth.accessToken,
            });

            console.log('[Atlasphere] Payment completed:', paymentId, txid);
            if (onComplete) await onComplete(paymentId, txid);
            resolveLifecycle(true);
          } catch (err) {
            console.error('[Atlasphere] Server completion failed:', err);
            const error = err instanceof Error ? err : new Error(String(err));
            rejectLifecycle(error);
            throw error;
          }
        },

        onCancel: (paymentId: string) => {
          console.log('[Atlasphere] Payment cancelled:', paymentId);
          void postPiPaymentEndpoint('/cancel', {
            payment_id: paymentId,
            reason: 'Cancelled by the Pioneer in Pi Wallet',
          }).catch((error) => {
            console.warn('[Atlasphere] Could not record payment cancellation:', error);
          });
          rejectLifecycle(new Error('Paiement annulé dans Pi Wallet.'));
        },

        onError: (error: Error) => {
          console.error('[Atlasphere] Payment error:', error);
          rejectLifecycle(error);
        }
      }
    );

    const [, completed] = await Promise.all([walletFlow, lifecycle]);
    return completed;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[Atlasphere] Payment creation failed:', msg);
    throw new Error(`createPiPayment: ${msg}`);
  }
}

// Submit a governance vote via backend
export async function submitGovernanceVote(projectId: number, voteType: 'for' | 'against' | 'abstain'): Promise<{
  success: boolean;
  weight?: number;
  votesFor?: number;
  votesAgainst?: number;
  message?: string;
}> {
  if (!currentUser) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const atlasphereJwt = await ensureAtlasphereJwt();
    const apiBase = getAPIBaseURL();
    const response = await fetch(`${apiBase}/api/v1/governance/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(atlasphereJwt ? { Authorization: `Bearer ${atlasphereJwt}` } : {}),
      },
      body: JSON.stringify({
        project_id: projectId,
        vote_type: voteType,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    if (data) {
      currentUser = {
        ...currentUser,
        votescast: currentUser.votescast + 1,
        reputation: currentUser.reputation + 5,
      };
      localStorage.setItem('atlasphere_user', JSON.stringify(currentUser));
      notifyListeners();

      await checkQuestProgress('vote');

      return {
        success: true,
        weight: Number(data.weight),
        votesFor: Number(data.project_votes_for),
        votesAgainst: Number(data.project_votes_against),
        message: String(data.message ?? ''),
      };
    }
    return { success: false, message: 'No response data' };
  } catch (error) {
    const apiError = error as {
      message?: string;
      response?: { status?: number; data?: { detail?: string } };
    };
    const detail = apiError.response?.data?.detail ?? apiError.message ?? 'Vote submission failed';
    const duplicate = apiError.response?.status === 409 || detail.toLowerCase().includes('already voted');
    return { success: false, message: duplicate ? 'already_voted' : detail };
  }
}

// Get user reputation from backend
export async function fetchReputation(piUid?: string): Promise<{
  reputation: number;
  level: string;
  votingPower: number;
  votesCast: number;
  projectsFunded: number;
} | null> {
  const uid = piUid || currentUser?.uid;
  if (!uid) return null;

  try {
    const response = await fetch(`${getAPIBaseURL()}/api/v1/governance/reputation/${uid}`, {
      method: 'GET',
      headers: authHeaders(),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data) {
      return {
        reputation: data.reputation,
        level: data.level,
        votingPower: data.voting_power,
        votesCast: data.votes_cast,
        projectsFunded: data.projects_funded,
      };
    }
  } catch {
    // Profile might not exist yet
  }
  return null;
}

// Check quest progress after an action
export async function checkQuestProgress(actionType: 'vote' | 'fund' | 'login' | 'proposal'): Promise<string[]> {
  if (!currentUser) return [];

  try {
    const response = await fetch(`${getAPIBaseURL()}/api/v1/quests/check-progress`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        pi_uid: currentUser.uid,
        action_type: actionType,
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (data?.newly_completed?.length > 0) {
      console.log('[Atlasphere] Quests completed:', data.newly_completed);
    }
    return data?.newly_completed || [];
  } catch {
    return [];
  }
}

export function logout() {
  currentUser = null;
  localStorage.removeItem('atlasphere_user');
  localStorage.removeItem('atlasphere_pi_token');
  localStorage.removeItem('atlasphere_jwt');
  notifyListeners();
}

// Legacy compatibility
export async function contributePI(amount: number): Promise<boolean> {
  return createPiPayment(
    amount,
    'Atlasphere contribution',
    { purpose: 'donation' }
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
    localStorage.setItem('atlasphere_user', JSON.stringify(currentUser));
    notifyListeners();
    return true;
  }
  return false;
}

// Restore user from localStorage on load
export function restoreSession(): void {
  try {
    const saved = localStorage.getItem('atlasphere_user');
    if (saved) {
      currentUser = JSON.parse(saved);
      notifyListeners();
    }
  } catch {
    // ignore parse errors
  }
}

// Auto-authenticate when running inside Pi Browser
export async function autoAuthenticate(): Promise<PiUser | null> {
  if (currentUser) return currentUser;

  if (!isInPiBrowser()) {
    restoreSession();
    return currentUser;
  }

  await initPiSdk();

  try {
    const scopes: APIScopes = ['payments', 'username', 'wallet_address'];
    const auth = await window.Pi!.authenticate(scopes, onIncompletePaymentFound);

    localStorage.setItem('atlasphere_pi_token', auth.accessToken);

    const backendUser = await verifyWithBackend(auth.accessToken);

    if (backendUser) {
      currentUser = backendUser;
    } else {
      currentUser = {
        uid: auth.user.uid,
        username: auth.user.username,
        displayName: auth.user.username,
        avatar: '🧑‍💻',
        reputation: 0,
        votingPower: 10,
        piBalance: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        proposalsCreated: 0,
        votescast: 0,
        contributions: 0,
        badges: [],
        level: 'bronze',
        piLocked: 0,
        streakDays: 0,
        kycVerified: false,
        language: 'en'
      };
    }

    localStorage.setItem('atlasphere_user', JSON.stringify(currentUser));
    notifyListeners();
    console.log('[Atlasphere] Auto-authenticated Pioneer:', currentUser.username);
    return currentUser;
  } catch (error) {
    console.warn('[Atlasphere] Auto-authentication failed:', error);
    restoreSession();
    return currentUser;
  }
}

// --- Pi Social Features ---

export function shareOnPi(title: string, message: string): void {
  if (window.Pi) {
    window.Pi.openShareDialog(title, message);
  } else {
    if (navigator.share) {
      navigator.share({ title, text: message }).catch(() => {});
    } else {
      navigator.clipboard.writeText(message).catch(() => {});
    }
  }
}

export function openPiConversation(conversationId: number): void {
  if (window.Pi) {
    window.Pi.openConversation(conversationId);
  } else {
    console.log('[Atlasphere] openConversation not available outside Pi Browser');
  }
}

export function shareProposal(proposalTitle: string, proposalId: number): void {
  const message = `🗳️ Découvrez cette proposition sur Atlasphere: "${proposalTitle}" - Votez et participez à la gouvernance Pi! ${window.location.origin}/proposal/${proposalId}`;
  shareOnPi('Atlasphere - Proposition', message);
}

export function shareFundingProject(projectTitle: string, projectId: number): void {
  const message = `💰 Projet à financer sur Atlasphere: "${projectTitle}" - Contribuez avec vos Pi! ${window.location.origin}/proposal/${projectId}`;
  shareOnPi('Atlasphere - Financement', message);
}

// --- PiRC2 Subscription Helpers ---

export function piToStroops(piAmount: number): number {
  return Math.round(piAmount * 10_000_000);
}

export function stroopsToPi(stroops: number): number {
  return stroops / 10_000_000;
}

export function formatPeriod(periodSecs: number): string {
  const days = Math.round(periodSecs / 86400);
  if (days >= 365) return `${Math.round(days / 365)} an(s)`;
  if (days >= 30) return `${Math.round(days / 30)} mois`;
  if (days >= 7) return `${Math.round(days / 7)} semaine(s)`;
  return `${days} jour(s)`;
}

export function isSubscriptionActive(subscription: PiRC2Subscription): boolean {
  return Date.now() / 1000 < subscription.service_end_ts;
}

// Initialize on module load
if (typeof window !== 'undefined') {
  restoreSession();
  if (document.readyState === 'complete') {
    void initPiSdk();
  } else {
    window.addEventListener('load', () => void initPiSdk());
  }
}