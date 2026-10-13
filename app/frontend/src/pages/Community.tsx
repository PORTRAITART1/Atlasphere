import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getForumPosts, addReply, addPost, reactToPost, type ForumPost } from '@/lib/community';
import { MessagesSquare, ThumbsUp, Flame, Brain, Heart, Pin, Eye, Plus, Send } from 'lucide-react';

export default function Community() {
  const [category, setCategory] = useState('all');
  const [posts, setPosts] = useState<ForumPost[]>(getForumPosts());
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('general');

  const categories = [
    { id: 'all', label: 'Tous', icon: '📋' },
    { id: 'general', label: 'Général', icon: '💬' },
    { id: 'education', label: 'Éducation', icon: '📚' },
    { id: 'technology', label: 'Technologie', icon: '💻' },
    { id: 'social', label: 'Social', icon: '🤝' },
    { id: 'environment', label: 'Environnement', icon: '🌍' },
  ];

  const handleFilter = (cat: string) => {
    setCategory(cat);
    setPosts(getForumPosts(cat));
  };

  const handleReply = (postId: string) => {
    const content = replyInput[postId]?.trim();
    if (!content) return;
    addReply(postId, content);
    setReplyInput((prev) => ({ ...prev, [postId]: '' }));
    setPosts(getForumPosts(category));
  };

  const handleReact = (postId: string, reaction: 'like' | 'fire' | 'think' | 'heart') => {
    reactToPost(postId, reaction);
    setPosts(getForumPosts(category));
  };

  const handleNewPost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    addPost(newTitle.trim(), newContent.trim(), newCategory);
    setNewTitle('');
    setNewContent('');
    setShowNewPost(false);
    setPosts(getForumPosts(category));
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessagesSquare className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Communauté</h1>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau sujet
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${category === cat.id ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {/* Post Header */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{post.authorAvatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.pinned && <Pin className="w-3.5 h-3.5 text-yellow-400" />}
                      <h2
                        className="text-lg font-semibold text-white hover:text-indigo-300 cursor-pointer transition-colors"
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      >
                        {post.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                      <span>•</span>
                      <span>{post.replies.length} réponses</span>
                    </div>
                    {(expandedPost === post.id || post.content.length < 200) && (
                      <p className="text-sm text-gray-300 mt-3 whitespace-pre-line">{post.content}</p>
                    )}
                  </div>
                </div>

                {/* Reactions */}
                <div className="flex items-center gap-2 mt-4 ml-11">
                  <button onClick={() => handleReact(post.id, 'like')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 text-xs transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />{post.reactions.like}
                  </button>
                  <button onClick={() => handleReact(post.id, 'fire')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-orange-400 text-xs transition-colors">
                    <Flame className="w-3.5 h-3.5" />{post.reactions.fire}
                  </button>
                  <button onClick={() => handleReact(post.id, 'think')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-purple-400 text-xs transition-colors">
                    <Brain className="w-3.5 h-3.5" />{post.reactions.think}
                  </button>
                  <button onClick={() => handleReact(post.id, 'heart')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-pink-400 text-xs transition-colors">
                    <Heart className="w-3.5 h-3.5" />{post.reactions.heart}
                  </button>
                </div>
              </div>

              {/* Replies (expanded) */}
              {expandedPost === post.id && (
                <div className="border-t border-white/5 bg-white/[0.02]">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="p-4 ml-8 border-b border-white/5 last:border-0">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{reply.authorAvatar}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium text-gray-300">{reply.author}</span>
                            <span>•</span>
                            <span>{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{reply.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{reply.reactions.like}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><Flame className="w-3 h-3" />{reply.reactions.fire}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Reply Input */}
                  <div className="p-4 ml-8 flex gap-2">
                    <input
                      type="text"
                      value={replyInput[post.id] || ''}
                      onChange={(e) => setReplyInput((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleReply(post.id)}
                      placeholder="Écrire une réponse..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                      onClick={() => handleReply(post.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewPost(false)}>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">Nouveau sujet</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Titre du sujet"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ForumPost['category'])}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="general">Général</option>
                  <option value="education">Éducation</option>
                  <option value="technology">Technologie</option>
                  <option value="social">Social</option>
                  <option value="environment">Environnement</option>
                </select>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Contenu de votre message..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowNewPost(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
                    Annuler
                  </button>
                  <button onClick={handleNewPost} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}