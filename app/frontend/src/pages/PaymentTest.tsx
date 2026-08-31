import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@metagptx/web-sdk';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PiPaymentButton from '@/components/PiPaymentButton';
import { getCurrentUser, subscribe, isInPiBrowser, type PiUser } from '@/lib/pi-sdk';
import { t, useI18nRerender } from '@/lib/i18n';

let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

interface TesterRow {
  tester: string;
  amount: number;
  network: string | null;
  completed_at: string | null;
}

interface TestStats {
  unique_testers: number;
  completed_payments: number;
  total_amount: number;
  required_testers: number;
  requirement_met: boolean;
  testers: TesterRow[];
}

interface PaymentRow {
  payment_id: string;
  txid: string | null;
  amount: number;
  purpose: string | null;
  status: string | null;
  network: string | null;
  completed_at: string | null;
}

/** Unwrap the web-sdk response envelope. */
function unwrap<T>(response: unknown): T | null {
  if (!response || typeof response !== 'object') return null;
  const envelope = response as { data?: unknown };
  return (envelope.data !== undefined ? envelope.data : response) as T;
}

const TEST_AMOUNTS = [0.1, 0.5, 1.0];

export default function PaymentTest() {
  useI18nRerender();
  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
  const [amount, setAmount] = useState<number>(0.1);
  const [stats, setStats] = useState<TestStats | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [serverReady, setServerReady] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => subscribe(() => setUser(getCurrentUser())), []);

  const loadConfig = useCallback(async () => {
    try {
      const res = await getClient().apiCall.invoke({
        url: '/api/v1/pi-pay/config',
        method: 'GET',
      });
      const data = unwrap<{ server_ready: boolean }>(res);
      setServerReady(Boolean(data?.server_ready));
    } catch {
      setServerReady(null);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res = await getClient().apiCall.invoke({
        url: '/api/v1/pi-pay/test-stats',
        method: 'GET',
      });
      const data = unwrap<TestStats>(res);
      if (data) setStats(data);
    } catch {
      /* stats are informational only */
    }
  }, []);

  const loadHistory = useCallback(async () => {
    if (!getCurrentUser()) {
      setPayments([]);
      return;
    }
    try {
      const res = await getClient().apiCall.invoke({
        url: '/api/v1/pi-pay/my-payments',
        method: 'GET',
      });
      const data = unwrap<{ items: PaymentRow[] }>(res);
      setPayments(data?.items ?? []);
    } catch {
      setPayments([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadConfig(), loadStats(), loadHistory()]);
    setLoading(false);
  }, [loadConfig, loadStats, loadHistory]);

  useEffect(() => {
    void refresh();
  }, [refresh, user]);

  const handleSuccess = async () => {
    setError('');
    setMessage(t('pay.success'));
    await refresh();
  };

  const handleError = (msg: string) => {
    setMessage('');
    setError(msg);
  };

  const progress = stats
    ? Math.min(100, Math.round((stats.unique_testers / Math.max(1, stats.required_testers)) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">{t('pay.title')}</h1>
          <p className="text-slate-400">{t('pay.subtitle')}</p>
        </header>

        {!isInPiBrowser() && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
            {t('pay.browser_warn')}
          </div>
        )}

        {serverReady === false && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
            {t('pay.server_not_ready')}
          </div>
        )}
        {serverReady === true && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-200">
            {t('pay.server_ready')}
          </div>
        )}

        {/* Payment panel */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
          {!user ? (
            <p className="text-slate-300">{t('pay.login_required')}</p>
          ) : (
            <>
              <div className="space-y-3">
                <span className="block text-sm font-medium text-slate-300">
                  {t('pay.amount_label')}
                </span>
                <div className="flex flex-wrap gap-3">
                  {TEST_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value)}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all border ${
                        amount === value
                          ? 'bg-indigo-500 text-white border-indigo-400'
                          : 'bg-slate-900 text-slate-200 border-white/10 hover:border-indigo-400'
                      }`}
                    >
                      {value} π
                    </button>
                  ))}
                </div>
              </div>

              <PiPaymentButton
                amount={amount}
                purpose="payment_test"
                memo={`Atlasphere payment test ${amount} Pi`}
                onSuccess={handleSuccess}
                onError={handleError}
                className="w-full sm:w-auto"
              >
                {`${t('pay.pay_now')} ${amount} π`}
              </PiPaymentButton>

              {message && (
                <p className="text-emerald-300 text-sm font-medium">{message}</p>
              )}
              {error && <p className="text-red-300 text-sm font-medium">{error}</p>}
            </>
          )}
        </section>

        {/* Developer requirement progress */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t('pay.progress_title')}</h2>
            <button
              onClick={() => void refresh()}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('pay.refresh')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{t('pay.testers')}</p>
              <p className="text-2xl font-bold text-white">
                {stats?.unique_testers ?? 0}
                <span className="text-sm font-normal text-slate-400">
                  {' '}/ {stats?.required_testers ?? 5} {t('pay.required')}
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{t('pay.completed')}</p>
              <p className="text-2xl font-bold text-white">{stats?.completed_payments ?? 0}</p>
            </div>
            <div className="rounded-xl bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{t('pay.total')}</p>
              <p className="text-2xl font-bold text-amber-400">{stats?.total_amount ?? 0} π</p>
            </div>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className={stats?.requirement_met ? 'text-emerald-300' : 'text-slate-400'}>
            {stats?.requirement_met ? t('pay.requirement_met') : t('pay.requirement_pending')}
          </p>

          {(stats?.testers?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-300">{t('pay.testers_list')}</h3>
              <ul className="space-y-1">
                {stats?.testers.map((row, index) => (
                  <li
                    key={`${row.tester}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-2 text-sm"
                  >
                    <span className="text-slate-200">{row.tester}</span>
                    <span className="text-amber-400">{row.amount} π</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Personal history */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
          <h2 className="text-xl font-semibold">{t('pay.history')}</h2>
          {payments.length === 0 ? (
            <p className="text-slate-400 text-sm">{t('pay.no_history')}</p>
          ) : (
            <ul className="space-y-2">
              {payments.map((row) => (
                <li
                  key={row.payment_id}
                  className="rounded-lg bg-slate-900/70 px-3 py-2 text-sm flex flex-wrap items-center justify-between gap-2"
                >
                  <span className="font-mono text-xs text-slate-400 break-all">{row.payment_id}</span>
                  <span className="text-slate-200">{row.amount} π</span>
                  <span
                    className={
                      row.status === 'completed'
                        ? 'text-emerald-300'
                        : row.status === 'cancelled' || row.status === 'error'
                        ? 'text-red-300'
                        : 'text-amber-300'
                    }
                  >
                    {row.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* How it works */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-2">
          <h2 className="text-xl font-semibold">{t('pay.how_title')}</h2>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 text-sm">
            <li>{t('pay.how_1')}</li>
            <li>{t('pay.how_2')}</li>
            <li>{t('pay.how_3')}</li>
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}