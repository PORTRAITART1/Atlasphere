import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@metagptx/web-sdk';
import { getCurrentUser } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';

let _client: ReturnType<typeof createClient> | null = null;
function getClient() { if (!_client) _client = createClient(); return _client; }

interface Comment {
  id: number;
  project_id: number;
  content: string;
  pi_uid: string;
  pi_username: string;
  parent_id: number | null;
  likes: number;
  created_at: string | null;
}

interface CommentsProps {
  projectId: number;
}

export default function Comments({ projectId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await getClient().apiCall.invoke({
        url: `/api/v1/entities/comments/all?query=${encodeURIComponent(JSON.stringify({ project_id: projectId }))}&sort=-created_at&limit=50`,
        method: 'GET',
      });
      if (response?.data?.items) {
        setComments(response.data.items);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      await getClient().apiCall.invoke({
        url: '/api/v1/entities/comments',
        method: 'POST',
        data: {
          project_id: projectId,
          content: newComment.trim(),
          pi_uid: user.uid,
          pi_username: user.username,
          parent_id: null,
          likes: 0,
        },
      });
      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: number) => {
    if (!replyContent.trim() || !user) return;

    setSubmitting(true);
    try {
      await getClient().apiCall.invoke({
        url: '/api/v1/entities/comments',
        method: 'POST',
        data: {
          project_id: projectId,
          content: replyContent.trim(),
          pi_uid: user.uid,
          pi_username: user.username,
          parent_id: parentId,
          likes: 0,
        },
      });
      setReplyTo(null);
      setReplyContent('');
      await loadComments();
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: number, currentLikes: number) => {
    try {
      await getClient().apiCall.invoke({
        url: `/api/v1/entities/comments/${commentId}`,
        method: 'PUT',
        data: { likes: currentLikes + 1 },
      });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
      );
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const topLevelComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: number) => comments.filter((c) => c.parent_id === parentId);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        💬 Discussion
        <span className="text-sm font-normal text-gray-400">({comments.length})</span>
      </h3>

      {/* New Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600/30 flex items-center justify-center text-sm shrink-0">
              {user.avatar || '🧑‍💻'}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Partagez votre avis sur ce projet..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 resize-none min-h-[80px]"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '...' : '💬 Commenter'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl text-center">
          <p className="text-gray-400 text-sm">Connectez-vous pour participer à la discussion</p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin text-2xl mb-2">⏳</div>
          <p className="text-gray-500 text-sm">{t('common.loading')}</p>
        </div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center py-8 bg-slate-800/20 rounded-xl border border-slate-700/20">
          <div className="text-3xl mb-2">🗨️</div>
          <p className="text-gray-400 text-sm">{t('comments.no_comments')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {topLevelComments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4"
              >
                {/* Comment Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center text-xs">
                    🧑‍💻
                  </div>
                  <span className="text-sm font-medium text-indigo-300">
                    @{comment.pi_username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>

                {/* Comment Content */}
                <p className="text-gray-300 text-sm ml-9 mb-3">{comment.content}</p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 ml-9">
                  <button
                    onClick={() => handleLike(comment.id, comment.likes)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-400 transition-colors"
                  >
                    👍 {comment.likes > 0 && comment.likes}
                  </button>
                  {user && (
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-xs text-gray-500 hover:text-indigo-400 transition-colors"
                    >
                      ↩️ Répondre
                    </button>
                  )}
                </div>

                {/* Reply Form */}
                {replyTo === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-9 mt-3"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Votre réponse..."
                        className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleReply(comment.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleReply(comment.id)}
                        disabled={!replyContent.trim() || submitting}
                        className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 disabled:opacity-50"
                      >
                        ↩️
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Replies */}
                {getReplies(comment.id).length > 0 && (
                  <div className="ml-9 mt-3 space-y-3 border-l-2 border-slate-700/50 pl-4">
                    {getReplies(comment.id).map((reply) => (
                      <div key={reply.id} className="bg-slate-800/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-purple-300">
                            @{reply.pi_username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{reply.content}</p>
                        <button
                          onClick={() => handleLike(reply.id, reply.likes)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-400 transition-colors mt-1"
                        >
                          👍 {reply.likes > 0 && reply.likes}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}