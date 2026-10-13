import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@metagptx/web-sdk';
import { CheckCircle2, MessageSquareQuote, Star, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { authenticate, getCurrentUser, isInPiBrowser, subscribe } from '@/lib/pi-sdk';
import { getLocale, t, useI18nRerender } from '@/lib/i18n';

const client = createClient();
const COMMENT_LIMIT = 600;

type Feedback = {
  id: number;
  pi_username: string;
  rating: number;
  comment: string;
  language: string;
  network: string | null;
  verified_payment: boolean;
  created_at: string | null;
};

type Summary = {
  total: number;
  verified_total: number;
  average_rating: number;
  positive_rate: number;
  distribution: Record<string, number>;
};

function unwrap<T>(response: unknown): T {
  const envelope = response as { data?: T };
  return (envelope?.data ?? response) as T;
}

function Stars({ value, onChange }: { value: number; onChange?: (value: number) => void }) {
  return (
    <div className="flex gap-1" role={onChange ? 'radiogroup' : undefined} aria-label={t('fb.rating_label')}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className="rounded-md p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-default"
          aria-label={`${star} ${t('fb.stars')}`}
          aria-checked={onChange ? value === star : undefined}
          role={onChange ? 'radio' : undefined}
        >
          <Star className={`h-6 w-6 ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
        </button>
      ))}
    </div>
  );
}

export default function PioneerFeedback() {
  useI18nRerender();
  const [, setAuthTick] = useState(0);
  const [items, setItems] = useState<Feedback[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [ownFeedback, setOwnFeedback] = useState<Feedback | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => subscribe(() => setAuthTick((value) => value + 1)), []);

  const loadPublic = useCallback(async () => {
    const [listResponse, summaryResponse] = await Promise.all([
      client.apiCall.invoke({
        url: '/api/v1/pi-feedback/list',
        method: 'GET',
        data: { verified_only: verifiedOnly, limit: 50 },
      }),
      client.apiCall.invoke({ url: '/api/v1/pi-feedback/summary', method: 'GET', data: {} }),
    ]);
    setItems(unwrap<{ items: Feedback[] }>(listResponse).items ?? []);
    setSummary(unwrap<Summary>(summaryResponse));
  }, [verifiedOnly]);

  const loadMine = useCallback(async () => {
    const token = localStorage.getItem('atlasphere_pi_token');
    if (!token) {
      setOwnFeedback(null);
      return;
    }
    const response = await client.apiCall.invoke({
      url: '/api/v1/pi-feedback/mine',
      method: 'POST',
      data: { pi_access_token: token },
    });
    const data = unwrap<{ submitted: boolean; feedback: Feedback | null }>(response);
    setOwnFeedback(data.feedback);
    if (data.feedback) {
      setRating(data.feedback.rating);
      setComment(data.feedback.comment);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadPublic(), loadMine()]);
    } catch {
      setError(t('fb.error'));
    } finally {
      setLoading(false);
    }
  }, [loadMine, loadPublic]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const connect = async () => {
    setAuthenticating(true);
    setError('');
    try {
      await authenticate();
      await loadMine();
    } catch {
      setError(t('fb.browser_warn'));
    } finally {
      setAuthenticating(false);
    }
  };

  const save = async () => {
    if (rating < 1) {
      setError(t('fb.rating_required'));
      return;
    }
    const token = localStorage.getItem('atlasphere_pi_token');
    if (!token) {
      setError(t('fb.login_required'));
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await client.apiCall.invoke({
        url: '/api/v1/pi-feedback/submit',
        method: 'POST',
        data: {
          pi_access_token: token,
          rating,
          comment,
          language: getLocale(),
          device_info: navigator.userAgent.slice(0, 120),
        },
      });
      const data = unwrap<{ created: boolean; feedback: Feedback }>(response);
      setOwnFeedback(data.feedback);
      setSuccess(data.created ? t('fb.thanks') : t('fb.updated'));
      await loadPublic();
    } catch {
      setError(t('fb.error'));
    } finally {
      setSaving(false);
    }
  };

  const metrics = [
    { label: t('fb.avg_rating'), value: summary?.total ? `${summary.average_rating.toFixed(1)}/5` : '—', icon: Star },
    { label: t('fb.positive_rate'), value: summary?.total ? `${summary.positive_rate}%` : '—', icon: MessageSquareQuote },
    { label: t('fb.total_reviews'), value: summary?.total ?? 0, icon: Users },
    { label: t('fb.verified_count'), value: summary?.verified_total ?? 0, icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold tracking-wide text-amber-400">ATLASPHERE × PI NETWORK</p>
          <h1 className="text-4xl font-bold tracking-tight text-white">{t('fb.title')}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400">{t('fb.subtitle')}</p>
        </header>

        <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label={t('fb.total_reviews')}>
          {metrics.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <Icon className="h-5 w-5 text-amber-400" />
              <p className="mt-4 text-2xl font-bold tabular-nums text-white">{value}</p>
              <p className="mt-1 text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-semibold text-white">{t('fb.wall_title')}</h2>
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
                {t('fb.verified_only')}
              </label>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-36 bg-slate-900" />)}</div>
            ) : items.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center text-slate-400">{t('fb.no_feedback')}</div>
            ) : (
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">@{item.pi_username}</p>
                        <Stars value={item.rating} />
                      </div>
                      {item.verified_payment && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {t('fb.verified_badge')}
                        </span>
                      )}
                    </div>
                    {item.comment && <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-300">{item.comment}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-xl border border-slate-800 bg-slate-900 p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold text-white">{ownFeedback ? t('fb.already_title') : t('fb.form_title')}</h2>
            {!getCurrentUser() ? (
              <div className="mt-5">
                <p className="text-sm leading-relaxed text-slate-400">{isInPiBrowser() ? t('fb.login_required') : t('fb.browser_warn')}</p>
                <Button onClick={connect} disabled={authenticating || !isInPiBrowser()} className="mt-5 w-full bg-amber-400 text-slate-950 hover:bg-amber-300">
                  {authenticating ? t('auth.connecting') : t('nav.connect')}
                </Button>
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-200">{t('fb.rating_label')}</p>
                  <Stars value={rating} onChange={setRating} />
                </div>
                <div>
                  <label htmlFor="feedback-comment" className="text-sm font-medium text-slate-200">{t('fb.comment_label')}</label>
                  <Textarea
                    id="feedback-comment"
                    value={comment}
                    maxLength={COMMENT_LIMIT}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder={t('fb.comment_placeholder')}
                    className="mt-2 min-h-32 border-slate-700 bg-slate-950 text-white placeholder:text-slate-600"
                  />
                  <p className="mt-1 text-right text-xs tabular-nums text-slate-500">{comment.length}/{COMMENT_LIMIT}</p>
                </div>
                {error && <p role="alert" className="rounded-lg bg-red-950/60 p-3 text-sm text-red-300">{error}</p>}
                {success && <p role="status" className="rounded-lg bg-emerald-950/60 p-3 text-sm text-emerald-300">{success}</p>}
                <Button onClick={save} disabled={saving} className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300">
                  {saving ? t('fb.sending') : ownFeedback ? t('fb.update') : t('fb.submit')}
                </Button>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
