import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAPIBaseURL } from '@/lib/config';
import { getCurrentUser } from '@/lib/pi-sdk';

interface Comment {
  id: number;
  project_id: number;
  content: string;
  pi_uid: string;
  pi_username: string;
  parent_id: number | null;
  likes: number;
  created_at: string;
}

interface CommentsProps {
  projectId: number;
}

export default function Comments({ projectId }: CommentsProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = getCurrentUser();

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = encodeURIComponent(JSON.stringify({ project_id: projectId }));
      const url = `${getAPIBaseURL()}/api/v1/entities/comments?query=${query}`;
      console.log('[Comments] Loading:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setComments(data.items || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load comments';
      console.error('[Comments] Load failed:', msg);
      setError(msg);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    setError(null);
    try {
      const url = `${getAPIBaseURL()}/api/v1/entities/comments`;
      console.log('[Comments] Submitting:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          content: newComment.trim(),
          pi_uid: user.uid,
          pi_username: user.username,
          user_id: user.uid,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      setNewComment('');
      await loadComments();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to post comment';
      console.error('[Comments] Submit failed:', msg);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: number, currentLikes: number) => {
    try {
      const url = `${getAPIBaseURL()}/api/v1/entities/comments/${commentId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: currentLikes + 1 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await loadComments();
    } catch (err) {
      console.error('[Comments] Like failed:', err);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const url = `${getAPIBaseURL()}/api/v1/entities/comments/${commentId}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await loadComments();
    } catch (err) {
      console.error('[Comments] Delete failed:', err);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white mb-4">
        💬 {t('comments.title', 'Discussion')} ({comments.length})
      </h3>

      {error && (
        <div className="mb-3 text-xs text-red-400 bg-red-950/30 border border-red-800/50 rounded-lg p-2">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comments.placeholder', 'Share your thoughts...')}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {submitting ? '⏳...' : t('comments.post', 'Post Comment')}
          </button>
        </form>
      ) : (
        <div className="text-center text-gray-400 text-sm py-2 mb-4">
          {t('comments.login_required', 'Connectez-vous pour participer à la discussion')}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 text-sm py-4">⏳...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-4">
          {t('comments.no_comments', 'Aucun commentaire pour le moment')}
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/40 flex items-center justify-center text-xs text-indigo-300 font-semibold">
                    {comment.pi_username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">@{comment.pi_username}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                {user?.uid === comment.pi_uid && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.content}</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => handleLike(comment.id, comment.likes)}
                  className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  👍 {comment.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}