import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/pi-sdk';
import { getLocale, t, useI18nRerender } from '@/lib/i18n';

interface Comment {
  id: number;
  project_id: number;
  content: string;
  pi_uid: string;
  pi_username: string;
  parent_id: number | null;
  likes: number | null;
  created_at: string | null;
}

interface CommentsListResponse {
  items: Comment[];
  total: number;
  skip: number;
  limit: number;
}

interface CommentsProps {
  projectId: number;
}

function authHeaders(): HeadersInit {
  const jwt = localStorage.getItem('atlasphere_jwt');
  return {
    'Content-Type': 'application/json',
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };
}

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json() as { detail?: string };
    return body.detail || `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
}

export default function Comments({ projectId }: CommentsProps) {
  useI18nRerender();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = getCurrentUser();

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        query: JSON.stringify({ project_id: projectId }),
        sort: '-created_at',
        limit: '100',
      });
      const response = await fetch(`/api/v1/entities/comments/all?${params.toString()}`);
      if (!response.ok) throw new Error(await readError(response));
      const data = await response.json() as CommentsListResponse;
      setComments(data.items || []);
    } catch (loadError) {
      console.error('[Comments] Load failed:', loadError);
      setError(t('comments.load_error'));
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadComments();
  }, [projectId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = newComment.trim();
    if (!content || !user) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/entities/comments', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          project_id: projectId,
          content,
          pi_uid: user.uid,
          pi_username: user.username,
          likes: 0,
        }),
      });
      if (!response.ok) throw new Error(await readError(response));
      setNewComment('');
      await loadComments();
    } catch (submitError) {
      console.error('[Comments] Submit failed:', submitError);
      setError(t('comments.post_error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: number) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/v1/entities/comments/${commentId}/like`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error(await readError(response));
      await loadComments();
    } catch (likeError) {
      console.error('[Comments] Like failed:', likeError);
      setError(t('comments.like_error'));
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm(t('comments.delete_confirm'))) return;
    try {
      const response = await fetch(`/api/v1/entities/comments/${commentId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error(await readError(response));
      await loadComments();
    } catch (deleteError) {
      console.error('[Comments] Delete failed:', deleteError);
      setError(t('comments.delete_error'));
    }
  };

  return (
    <section className="mt-6 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5" aria-labelledby="discussion-title">
      <h3 id="discussion-title" className="text-lg font-semibold text-white mb-4">
        💬 {t('comments.title')} ({comments.length})
      </h3>

      {error && (
        <div className="mb-3 text-sm text-red-300 bg-red-950/30 border border-red-800/50 rounded-lg p-3" role="alert">
          {error}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder={t('comments.placeholder')}
            rows={3}
            maxLength={2000}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {submitting ? t('comments.posting') : t('comments.post')}
          </button>
        </form>
      ) : (
        <div className="text-center text-gray-400 text-sm py-2 mb-4">
          {t('comments.login_to_comment')}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 text-sm py-4">{t('common.loading')}</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-4">{t('comments.no_comments')}</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <article key={comment.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/40 flex items-center justify-center text-xs text-indigo-300 font-semibold">
                    {comment.pi_username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">@{comment.pi_username}</div>
                    <time className="text-xs text-gray-500">
                      {comment.created_at ? new Date(comment.created_at).toLocaleString(getLocale()) : ''}
                    </time>
                  </div>
                </div>
                {user?.uid === comment.pi_uid && (
                  <button onClick={() => handleDelete(comment.id)} className="text-xs text-red-400 hover:text-red-300" aria-label={t('comments.delete')}>
                    🗑️
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.content}</p>
              <button onClick={() => handleLike(comment.id)} disabled={!user} className="mt-2 text-xs text-gray-400 hover:text-indigo-400 disabled:opacity-50">
                👍 {comment.likes || 0}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
