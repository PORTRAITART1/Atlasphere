import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  'Comment réduire mon empreinte carbone ?',
  'Quel est mon score écologique ?',
  'Comment fonctionnent les crédits carbone ?',
  'Conseils pour économiser l\'eau',
];

const AI_RESPONSES: Record<string, string> = {
  'carbone': '🌍 Pour réduire votre empreinte carbone :\n\n1. **Transport** : Privilégiez le vélo ou les transports en commun (-2.6 kg CO2/trajet)\n2. **Alimentation** : Réduisez la viande rouge à 1x/semaine (-40 kg CO2/mois)\n3. **Énergie** : Baissez le chauffage de 2°C (-14% sur la facture)\n4. **Numérique** : Supprimez les emails inutiles et limitez le streaming HD\n\nVotre Lifestyle Optimizer peut vous donner des recommandations personnalisées !',
  'score': '📊 Votre score écologique actuel est de **742/1000** (rang : Éco-Champion, top 12%).\n\nDétail par catégorie :\n- Transport : 85/100 ✅\n- Déchets : 90/100 ✅\n- Eau : 78/100 🔄\n- Énergie : 72/100 🔄\n- Alimentation : 68/100 ⚠️\n\nConseil : Améliorez votre score alimentation en achetant local et de saison !',
  'crédit': '💚 Les **crédits carbone** permettent de compenser vos émissions résiduelles :\n\n1. Chaque crédit = 1 tonne de CO2 évitée ou absorbée\n2. Vérifiés par des organismes certifiés (Gold Standard, VCS Verra)\n3. Tokenisés sur la blockchain pour traçabilité\n4. Achetables en Pi sur notre marketplace\n\nVous avez déjà compensé 12.5 tonnes ! Continuez sur /carbon-credits.',
  'eau': '💧 Conseils pour économiser l\'eau :\n\n1. **Douche** : Limitez à 5 min (-60L/douche)\n2. **Vaisselle** : Remplissez le lave-vaisselle avant de lancer\n3. **Jardin** : Arrosez le soir (moins d\'évaporation)\n4. **Fuites** : Vérifiez le compteur la nuit (une fuite = 100L/jour !)\n5. **Récupération** : Installez un récupérateur d\'eau de pluie\n\nVotre capteur eau a détecté une consommation de 145L/jour. L\'objectif est 120L !',
  'default': '🌿 Je suis l\'EcoAssistant d\'Atlasphere ! Je peux vous aider avec :\n\n- Conseils pour réduire votre empreinte\n- Explication de votre score écologique\n- Informations sur les crédits carbone\n- Recommandations personnalisées\n- Questions sur les capteurs IoT\n\nQue souhaitez-vous savoir ?',
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('carbone') && !lower.includes('crédit')) return AI_RESPONSES['carbone'];
  if (lower.includes('score') || lower.includes('écologique')) return AI_RESPONSES['score'];
  if (lower.includes('crédit') || lower.includes('compens')) return AI_RESPONSES['crédit'];
  if (lower.includes('eau') || lower.includes('water')) return AI_RESPONSES['eau'];
  return AI_RESPONSES['default'];
}

export default function EcoChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: '🌿 Bonjour ! Je suis l\'EcoAssistant. Comment puis-je vous aider à réduire votre impact environnemental ?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              <div>
                <h3 className="text-sm font-bold text-white">EcoAssistant IA</h3>
                <p className="text-xs text-white/70">Powered by Atlasphere AI</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-200 border border-white/5'}`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-white/10 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Posez une question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button onClick={() => sendMessage(input)} disabled={!input.trim()} className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 rounded-xl flex items-center justify-center transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}