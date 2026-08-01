import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getConversations, getMessages, sendMessage, type Conversation, type Message } from '@/lib/messaging';
import { Send, Users, MessageCircle, ArrowLeft } from 'lucide-react';

export default function Messages() {
  const [conversations] = useState<Conversation[]>(getConversations());
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConv) {
      setMessages(getMessages(activeConv.id));
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;
    const msg = sendMessage(activeConv.id, input.trim());
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString('fr-FR', { weekday: 'short' });
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 light:from-gray-50 light:via-white light:to-indigo-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Messagerie</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-[70vh]">
          {/* Conversation List */}
          <div className={`border-r border-white/10 overflow-y-auto ${activeConv ? 'hidden lg:block' : ''}`}>
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
              <p className="text-sm text-gray-400">{conversations.length} discussions</p>
            </div>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 ${activeConv?.id === conv.id ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500' : ''}`}
              >
                <div className="text-2xl flex-shrink-0">{conv.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white text-sm truncate">{conv.name}</span>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatTime(conv.lastMessage.timestamp)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {conv.type === 'group' && <Users className="w-3 h-3 text-gray-500" />}
                    <p className="text-xs text-gray-400 truncate">{conv.lastMessage?.content || 'Aucun message'}</p>
                  </div>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-indigo-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-2 flex flex-col ${!activeConv ? 'hidden lg:flex' : 'flex'}`}>
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  <button onClick={() => setActiveConv(null)} className="lg:hidden text-gray-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-2xl">{activeConv.avatar}</span>
                  <div>
                    <h3 className="font-semibold text-white">{activeConv.name}</h3>
                    <p className="text-xs text-gray-400">
                      {activeConv.type === 'group' ? `${activeConv.participants.length} membres` : 'En ligne'}
                    </p>
                  </div>
                  {activeConv.projectId && (
                    <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                      Projet lié
                    </span>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.senderId === 'me' ? 'justify-end' : ''}`}>
                      {msg.senderId !== 'me' && <span className="text-lg flex-shrink-0 mt-1">{msg.senderAvatar}</span>}
                      <div className={`max-w-[70%] ${msg.senderId === 'me' ? 'bg-indigo-600/40' : 'bg-white/5'} rounded-2xl px-4 py-2`}>
                        {msg.senderId !== 'me' && activeConv.type === 'group' && (
                          <p className="text-xs text-indigo-300 font-medium mb-0.5">{msg.senderName}</p>
                        )}
                        <p className="text-sm text-white/90">{msg.content}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{formatTime(msg.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Écrire un message..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400">Sélectionnez une conversation</h3>
                  <p className="text-sm text-gray-500 mt-2">Choisissez une discussion pour commencer à échanger</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}