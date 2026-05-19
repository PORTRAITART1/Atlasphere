// Pi Network SDK Simulation Layer
// Based on the official @pinetwork-js/sdk structure

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
  avatar?: string;
  reputation: number;
  piBalance: number;
  joinedDate: string;
}

export interface PiPayment {
  identifier: string;
  amount: number;
  memo: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdAt: string;
  txid?: string;
}

export interface PaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error) => void;
}

export interface PaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, unknown>;
}

// Simulated Pi SDK
class PiSDKSimulator {
  private initialized = false;
  private currentUser: PiUser | null = null;

  init({ version }: { version: string }) {
    if (version !== '2.0') {
      throw new Error('Unrecognized version number');
    }
    this.initialized = true;
  }

  async authenticate(): Promise<PiUser> {
    if (!this.initialized) {
      throw new Error('Pi Network SDK was not initialized. Call init() before any other method.');
    }

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    this.currentUser = {
      uid: 'pi_' + Math.random().toString(36).substring(2, 10),
      username: 'Pioneer_' + Math.floor(Math.random() * 10000),
      accessToken: 'sim_token_' + Date.now(),
      reputation: Math.floor(Math.random() * 50) + 50,
      piBalance: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
      joinedDate: '2024-03-14',
    };

    return this.currentUser;
  }

  getUser(): PiUser | null {
    return this.currentUser;
  }

  async createPayment(paymentData: PaymentData, callbacks: PaymentCallbacks): Promise<PiPayment> {
    if (!this.initialized) {
      throw new Error('Pi Network SDK was not initialized.');
    }

    const payment: PiPayment = {
      identifier: 'pay_' + Math.random().toString(36).substring(2, 12),
      amount: paymentData.amount,
      memo: paymentData.memo,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Simulate payment flow
    await new Promise(resolve => setTimeout(resolve, 800));
    callbacks.onReadyForServerApproval(payment.identifier);

    await new Promise(resolve => setTimeout(resolve, 1500));
    const txid = 'tx_' + Math.random().toString(36).substring(2, 16);
    payment.txid = txid;
    payment.status = 'completed';
    callbacks.onReadyForServerCompletion(payment.identifier, txid);

    return payment;
  }

  logout() {
    this.currentUser = null;
  }
}

export const PiSDK = new PiSDKSimulator();
PiSDK.init({ version: '2.0' });