// Pi Network SDK v2.0 Integration for PoliGov
// Aligned with @pinetwork-js/sdk and Pi Develop platform standards
// Reference: https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md
import { createClient } from '@metagptx/web-sdk';

const client = createClient();

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

/** Available SDK scopes */
export type APIScopes = ['username', 'payments'];

// --- PoliGov User Profile (extends Pi user with app-specific data) ---

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

// --- PiRC2 Subscription Types (Soroban Smart Contract) ---

export interface PiRC2Service {
  service_id: number;
  merchant: string;
  name: string;
  price: number; // in smallest token unit (1 Pi = 10000000)
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

// PiRC2 Contract on Pi Testnet
export const PIRC2_CONTRACT_ID = 'CCUF75B6W3HRJTJD6O7OXNI72HGJ7DERZ5MUNOMFMSK23ME5GUIKPFYV';
export const PI_TESTNET_RPC = 'https://rpc.testnet.minepi.com';
export const PI_NETWORK_PASSPHRASE = 'Pi Testnet';

// --- Declare Pi SDK global type (aligned with official SDK) ---
declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: APIScopes,
        onIncompletePaymentFound: (payment: APIPayment) => void
      ) => Promise<AuthResult>;
      createPayment: (
        paymentData: APIPartialPayment,
        callbacks: PaymentCallbacks
      ) => Promise<void>;
      openShareDialog: (title: string, sharingMessage: string) => void;
      openConversation: (conversationId: number) => void;
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
    console.log('[PoliGov] Pi SDK initialized', { sandbox: !isProduction });
  } else {
    console.log('[PoliGov] Pi SDK not available - running in standalone mode');
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
// Per Pi SDK spec, this is called when an unfinished payment is detected
function onIncompletePaymentFound(payment: APIPayment) {
  console.log('[PoliGov] Incomplete payment found:', payment.identifier, payment.status);
  // TODO: Resume incomplete payment via server-side completion
}

// Verify Pi token with backend and get/create profile
async function verifyWithBackend(accessToken: string): Promise<PiUser | null> {
  try {
    const response = await client.apiCall.invoke({
      url: '/api/v1/pi-auth/verify',
      method: 'POST',
      data: { access_token: accessToken },
    });

    if (response?.data) {
      const profile = response.data;
      return {
        uid: profile.pi_uid,
        username: profile.username,
        displayName: profile.display_name || profile.username,
        avatar: '🧑‍💻',
        reputation: profile.reputation || 0,
        votingPower: profile.voting_power || 1,
        piBalance: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        proposalsCreated: 0,
        votescast: 0,
        contributions: 0,
        badges: profile.badges || [],
        level: profile.level || 'bronze',
        piLocked: profile.pi_locked || 0,
        streakDays: profile.streak_days || 0,
        kycVerified: profile.kyc_verified || false,
        language: profile.language || 'fr',
      };
    }
  } catch (error) {
    console.warn('[PoliGov] Backend verification failed, using local profile:', error);
  }
  return null;
}

// Get profile from backend
async function fetchProfileFromBackend(): Promise<PiUser | null> {
  try {
    const response = await client.apiCall.invoke({
      url: '/api/v1/pi-auth/profile',
      method: 'GET',
    });

    if (response?.data) {
      const profile = response.data;
      return {
        uid: profile.pi_uid,
        username: profile.username,
        displayName: profile.display_name || profile.username,
        avatar: '🧑‍💻',
        reputation: profile.reputation || 0,
        votingPower: profile.voting_power || 1,
        piBalance: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        proposalsCreated: 0,
        votescast: 0,
        contributions: 0,
        badges: profile.badges || [],
        level: profile.level || 'bronze',
        piLocked: profile.pi_locked || 0,
        streakDays: profile.streak_days || 0,
        kycVerified: profile.kyc_verified || false,
        language: profile.language || 'fr',
      };
    }
  } catch {
    // Profile not found - user hasn't authenticated with Pi yet
  }
  return null;
}

// Authenticate with Pi Network (real SDK or sandbox simulation)
export async function authenticate(): Promise<PiUser> {
  // Ensure Pi SDK is initialized before authenticating
  initPiSdk();

  if (window.Pi) {
    // Real Pi SDK authentication inside Pi Browser
    try {
      const scopes: APIScopes = ['username', 'payments'];
      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

      // Store token for later use
      localStorage.setItem('poligov_pi_token', auth.accessToken);

      // Verify with backend and create/update profile
      const backendUser = await verifyWithBackend(auth.accessToken);

      if (backendUser) {
        currentUser = backendUser;
      } else {
        // Fallback to local user if backend fails
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
          language: 'fr'
        };
      }

      localStorage.setItem('poligov_user', JSON.stringify(currentUser));
      notifyListeners();
      return currentUser;
    } catch (error) {
      console.error('[PoliGov] Pi authentication failed:', error);
      throw error;
    }
  } else {
    // Sandbox simulation for development outside Pi Browser
    await new Promise((r) => setTimeout(r, 1200));

    // Try to fetch existing profile from backend
    const backendProfile = await fetchProfileFromBackend();

    if (backendProfile) {
      currentUser = backendProfile;
    } else {
      // Create sandbox user
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
    }

    localStorage.setItem('poligov_user', JSON.stringify(currentUser));
    notifyListeners();
    return currentUser;
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
  if (window.Pi) {
    // Real Pi payment with backend approval/completion
    try {
      await window.Pi.createPayment(
        { amount, memo, metadata },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            // Call backend to approve the payment
            try {
              await client.apiCall.invoke({
                url: '/api/v1/pi-payments/approve',
                method: 'POST',
                data: { payment_id: paymentId },
              });
              console.log('[PoliGov] Payment approved by server:', paymentId);
            } catch (err) {
              console.error('[PoliGov] Server approval failed:', err);
            }
            if (onApprove) await onApprove(paymentId);
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            // Call backend to complete the payment and record contribution
            try {
              await client.apiCall.invoke({
                url: '/api/v1/pi-payments/complete',
                method: 'POST',
                data: {
                  payment_id: paymentId,
                  txid,
                  project_id: parseInt(metadata.project_id || '0'),
                  amount,
                  pi_uid: currentUser?.uid || '',
                },
              });
              console.log('[PoliGov] Payment completed:', paymentId, txid);

              // Check quest progress after funding
              await checkQuestProgress('fund');
            } catch (err) {
              console.error('[PoliGov] Server completion failed:', err);
            }
            if (onComplete) await onComplete(paymentId, txid);
          },
          onCancel: (paymentId: string) => {
            console.log('[PoliGov] Payment cancelled:', paymentId);
          },
          onError: (error: Error) => {
            console.error('[PoliGov] Payment error:', error);
          }
        }
      );
      return true;
    } catch (error) {
      console.error('[PoliGov] Payment creation failed:', error);
      return false;
    }
  } else {
    // Sandbox simulation with backend recording
    await new Promise((r) => setTimeout(r, 800));
    const fakePaymentId = 'pay_' + Math.random().toString(36).slice(2, 12);
    const fakeTxid = 'tx_' + Math.random().toString(36).slice(2, 16);

    // Simulate server approval
    try {
      await client.apiCall.invoke({
        url: '/api/v1/pi-payments/approve',
        method: 'POST',
        data: { payment_id: fakePaymentId },
      });
    } catch {
      // In sandbox, approval might fail due to missing PI_API_KEY - that's OK
      console.log('[PoliGov] Sandbox: skipping server approval');
    }

    if (onApprove) await onApprove(fakePaymentId);
    await new Promise((r) => setTimeout(r, 500));

    // Complete payment and record contribution via backend
    try {
      await client.apiCall.invoke({
        url: '/api/v1/pi-payments/complete',
        method: 'POST',
        data: {
          payment_id: fakePaymentId,
          txid: fakeTxid,
          project_id: parseInt(metadata.project_id || '0'),
          amount,
          pi_uid: currentUser?.uid || '',
        },
      });
    } catch {
      // Fallback: record contribution directly
      console.log('[PoliGov] Sandbox: recording contribution directly');
      try {
        await client.apiCall.invoke({
          url: '/api/v1/entities/contributions',
          method: 'POST',
          data: {
            project_id: parseInt(metadata.project_id || '0'),
            amount,
            transaction_id: fakeTxid,
            payment_id: fakePaymentId,
            status: 'completed',
            pi_uid: currentUser?.uid || '',
          },
        });
      } catch (e) {
        console.error('[PoliGov] Failed to record contribution:', e);
      }
    }

    if (onComplete) await onComplete(fakePaymentId, fakeTxid);

    // Update local user state
    if (currentUser && currentUser.piBalance >= amount) {
      currentUser = {
        ...currentUser,
        piBalance: currentUser.piBalance - amount,
        contributions: currentUser.contributions + 1
      };
      localStorage.setItem('poligov_user', JSON.stringify(currentUser));
      notifyListeners();
    }

    // Check quest progress
    await checkQuestProgress('fund');

    return true;
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
    const response = await client.apiCall.invoke({
      url: '/api/v1/governance/vote',
      method: 'POST',
      data: {
        project_id: projectId,
        vote_type: voteType,
        pi_uid: currentUser.uid,
      },
    });

    if (response?.data) {
      // Update local user state
      currentUser = {
        ...currentUser,
        votescast: currentUser.votescast + 1,
        reputation: currentUser.reputation + 5,
      };
      localStorage.setItem('poligov_user', JSON.stringify(currentUser));
      notifyListeners();

      // Check quest progress
      await checkQuestProgress('vote');

      return {
        success: true,
        weight: response.data.weight,
        votesFor: response.data.project_votes_for,
        votesAgainst: response.data.project_votes_against,
        message: response.data.message,
      };
    }
    return { success: false, message: 'No response data' };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { detail?: string } } };
    const detail = err?.response?.data?.detail || 'Vote submission failed';
    return { success: false, message: detail };
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
    const response = await client.apiCall.invoke({
      url: `/api/v1/governance/reputation/${uid}`,
      method: 'GET',
    });

    if (response?.data) {
      return {
        reputation: response.data.reputation,
        level: response.data.level,
        votingPower: response.data.voting_power,
        votesCast: response.data.votes_cast,
        projectsFunded: response.data.projects_funded,
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
    const response = await client.apiCall.invoke({
      url: '/api/v1/quests/check-progress',
      method: 'POST',
      data: {
        pi_uid: currentUser.uid,
        action_type: actionType,
      },
    });

    if (response?.data?.newly_completed?.length > 0) {
      console.log('[PoliGov] Quests completed:', response.data.newly_completed);
    }
    return response?.data?.newly_completed || [];
  } catch {
    return [];
  }
}

export function logout() {
  currentUser = null;
  localStorage.removeItem('poligov_user');
  localStorage.removeItem('poligov_pi_token');
  notifyListeners();
}

// Legacy compatibility
export async function contributePI(amount: number): Promise<boolean> {
  return createPiPayment(
    amount,
    'PoliGov contribution',
    { type: 'donation' }
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
    localStorage.setItem('poligov_user', JSON.stringify(currentUser));
    notifyListeners();
    return true;
  }
  return false;
}

// Restore user from localStorage on load
export function restoreSession(): void {
  try {
    const saved = localStorage.getItem('poligov_user');
    if (saved) {
      currentUser = JSON.parse(saved);
      notifyListeners();
    }
  } catch {
    // ignore parse errors
  }
}

// Auto-authenticate when running inside Pi Browser
// This detects the Pioneer's Pi username automatically
export async function autoAuthenticate(): Promise<PiUser | null> {
  // If already authenticated, return current user
  if (currentUser) return currentUser;

  // Only auto-auth inside Pi Browser
  if (!isInPiBrowser()) {
    // Try to restore from localStorage
    restoreSession();
    return currentUser;
  }

  // Initialize Pi SDK first
  initPiSdk();

  try {
    const scopes: APIScopes = ['username', 'payments'];
    const auth = await window.Pi!.authenticate(scopes, onIncompletePaymentFound);

    // Store token
    localStorage.setItem('poligov_pi_token', auth.accessToken);

    // Verify with backend
    const backendUser = await verifyWithBackend(auth.accessToken);

    if (backendUser) {
      currentUser = backendUser;
    } else {
      // Use Pi SDK response directly
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
        language: 'fr'
      };
    }

    localStorage.setItem('poligov_user', JSON.stringify(currentUser));
    notifyListeners();
    console.log('[PoliGov] Auto-authenticated Pioneer:', currentUser.username);
    return currentUser;
  } catch (error) {
    console.warn('[PoliGov] Auto-authentication failed, user can authenticate manually:', error);
    // Restore from localStorage as fallback
    restoreSession();
    return currentUser;
  }
}

// --- Pi Social Features (Pi Browser native) ---

/** Open Pi Browser's native share dialog */
export function shareOnPi(title: string, message: string): void {
  if (window.Pi) {
    window.Pi.openShareDialog(title, message);
  } else {
    // Fallback: use Web Share API or copy to clipboard
    if (navigator.share) {
      navigator.share({ title, text: message }).catch(() => {});
    } else {
      navigator.clipboard.writeText(message).catch(() => {});
    }
  }
}

/** Open a Pi conversation (Pi Browser native messaging) */
export function openPiConversation(conversationId: number): void {
  if (window.Pi) {
    window.Pi.openConversation(conversationId);
  } else {
    console.log('[PoliGov] openConversation not available outside Pi Browser');
  }
}

/** Share a proposal on Pi Network */
export function shareProposal(proposalTitle: string, proposalId: number): void {
  const message = `🗳️ Découvrez cette proposition sur PoliGov: "${proposalTitle}" - Votez et participez à la gouvernance Pi! ${window.location.origin}/proposal/${proposalId}`;
  shareOnPi('PoliGov - Proposition', message);
}

/** Share a funding project on Pi Network */
export function shareFundingProject(projectTitle: string, projectId: number): void {
  const message = `💰 Projet à financer sur PoliGov: "${projectTitle}" - Contribuez avec vos Pi! ${window.location.origin}/proposal/${projectId}`;
  shareOnPi('PoliGov - Financement', message);
}

// --- PiRC2 Subscription Helpers ---

/** Convert Pi amount to smallest unit (7 decimals) */
export function piToStroops(piAmount: number): number {
  return Math.round(piAmount * 10_000_000);
}

/** Convert smallest unit to Pi amount */
export function stroopsToPi(stroops: number): number {
  return stroops / 10_000_000;
}

/** Format subscription period in human-readable format */
export function formatPeriod(periodSecs: number): string {
  const days = Math.round(periodSecs / 86400);
  if (days >= 365) return `${Math.round(days / 365)} an(s)`;
  if (days >= 30) return `${Math.round(days / 30)} mois`;
  if (days >= 7) return `${Math.round(days / 7)} semaine(s)`;
  return `${days} jour(s)`;
}

/** Check if a subscription is currently active */
export function isSubscriptionActive(subscription: PiRC2Subscription): boolean {
  return Date.now() / 1000 < subscription.service_end_ts;
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