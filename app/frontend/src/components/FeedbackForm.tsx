import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('bug');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!message.trim()) return;
    
    // Store feedback locally (in production, send to backend)
    const feedback = {
      type,
      message,
      rating,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
    };
    
    const existingFeedback = JSON.parse(localStorage.getItem('atlasphere_feedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('atlasphere_feedback', JSON.stringify(existingFeedback));
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setMessage('');
      setRating(0);
    }, 2000);
  };

  return (
    <>
      {/* Floating feedback button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Donner un feedback"
      >
        💬
      </motion.button>

      {/* Feedback modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-white mb-2">Merci pour votre feedback !</h3>
                  <p className="text-gray-400 text-sm">Votre retour nous aide à améliorer Atlasphere.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white">💬 Feedback Beta</h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors text-xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    <label className="text-sm text-gray-300 mb-2 block">Note globale</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-transform hover:scale-125 ${
                            star <= rating ? 'opacity-100' : 'opacity-30'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="mb-4">
                    <label className="text-sm text-gray-300 mb-2 block">Type de feedback</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">🐛 Bug / Erreur</SelectItem>
                        <SelectItem value="feature">💡 Suggestion de fonctionnalité</SelectItem>
                        <SelectItem value="ux">🎨 Amélioration UX/Design</SelectItem>
                        <SelectItem value="performance">⚡ Performance</SelectItem>
                        <SelectItem value="other">📝 Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="mb-5">
                    <label className="text-sm text-gray-300 mb-2 block">Votre message</label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Décrivez votre feedback en détail..."
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                  >
                    Envoyer le Feedback
                  </Button>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Page actuelle : {window.location.pathname}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}