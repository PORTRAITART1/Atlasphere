import { useState, useRef } from 'react';
import { createClient } from '@metagptx/web-sdk';

let _client: ReturnType<typeof createClient> | null = null;
function getClient() { if (!_client) _client = createClient(); return _client; }

interface AIAssistantProps {
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  fundingGoal: string;
  onApplySuggestion: (field: string, value: string) => void;
}

type AssistantMode = 'improve-title' | 'enrich-description' | 'suggest-milestones' | 'estimate-budget';

export default function AIAssistant({
  title,
  description,
  fullDescription,
  category,
  fundingGoal,
  onApplySuggestion,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [activeMode, setActiveMode] = useState<AssistantMode | null>(null);
  const abortRef = useRef(false);

  const categoryLabels: Record<string, string> = {
    education: 'Éducation',
    commerce: 'Commerce',
    technology: 'Technologie',
    social: 'Social',
    environment: 'Environnement',
  };

  const modes: { id: AssistantMode; label: string; icon: string; description: string }[] = [
    { id: 'improve-title', label: 'Améliorer le Titre', icon: '✨', description: 'Suggestions de titres plus percutants' },
    { id: 'enrich-description', label: 'Enrichir la Description', icon: '📝', description: 'Rendre la description plus convaincante' },
    { id: 'suggest-milestones', label: 'Suggérer des Jalons', icon: '🎯', description: 'Jalons réalistes pour votre projet' },
    { id: 'estimate-budget', label: 'Estimer le Budget', icon: '💰', description: 'Budget basé sur des projets similaires' },
  ];

  const buildPrompt = (mode: AssistantMode): string => {
    const context = `
Contexte du projet:
- Titre: ${title || '(non renseigné)'}
- Résumé: ${description || '(non renseigné)'}
- Description complète: ${fullDescription || '(non renseigné)'}
- Catégorie: ${categoryLabels[category] || category}
- Budget demandé: ${fundingGoal ? `${fundingGoal} Pi` : '(non renseigné)'}
`;

    switch (mode) {
      case 'improve-title':
        return `Tu es un expert en rédaction de propositions pour une plateforme de gouvernance décentralisée (Atlasphere) sur Pi Network. 
${context}
Propose 3 titres alternatifs plus percutants et professionnels pour ce projet. Pour chaque titre, explique brièvement pourquoi il est efficace. Réponds en français.`;

      case 'enrich-description':
        return `Tu es un expert en rédaction de propositions pour une plateforme de gouvernance décentralisée (Atlasphere) sur Pi Network.
${context}
Réécris et enrichis la description complète du projet pour la rendre plus convaincante, structurée et professionnelle. Inclus:
- Un paragraphe d'introduction captivant
- Les objectifs clairs
- L'impact attendu sur la communauté Pi
- Le plan d'exécution résumé
Réponds en français.`;

      case 'suggest-milestones':
        return `Tu es un expert en gestion de projets pour une plateforme de gouvernance décentralisée (Atlasphere) sur Pi Network.
${context}
Propose 4-5 jalons réalistes et mesurables pour ce projet. Pour chaque jalon, indique:
- Le titre du jalon
- La durée estimée
- Les livrables attendus
- Le pourcentage du budget alloué
Réponds en français.`;

      case 'estimate-budget':
        return `Tu es un expert en estimation budgétaire pour une plateforme de gouvernance décentralisée (Atlasphere) sur Pi Network.
${context}
Basé sur des projets similaires dans la catégorie "${categoryLabels[category] || category}", propose:
- Un budget total recommandé en Pi (avec justification)
- La répartition détaillée par poste de dépense
- Des conseils pour optimiser le budget
- Comparaison avec des projets similaires déjà financés
Réponds en français.`;
    }
  };

  const handleGenerate = async (mode: AssistantMode) => {
    setActiveMode(mode);
    setResponse('');
    setLoading(true);
    abortRef.current = false;

    const prompt = buildPrompt(mode);

    try {
      await getClient().ai.gentxt({
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant IA spécialisé dans l\'aide à la rédaction de propositions pour Atlasphere, une plateforme de gouvernance décentralisée sur Pi Network. Tu fournis des conseils pratiques, concis et actionnables en français.',
          },
          { role: 'user', content: prompt },
        ],
        model: 'deepseek-v3.2',
        stream: true,
        onChunk: (chunk) => {
          if (!abortRef.current && chunk.content) {
            setResponse((prev) => prev + chunk.content);
          }
        },
        onComplete: () => {
          setLoading(false);
        },
        onError: (error) => {
          setLoading(false);
          setResponse(`Erreur: ${error?.message || 'Une erreur est survenue. Veuillez réessayer.'}`);
        },
        timeout: 60_000,
      });
    } catch {
      setLoading(false);
      setResponse('Erreur: Impossible de contacter l\'assistant IA. Veuillez réessayer.');
    }
  };

  const handleApply = () => {
    if (!response || !activeMode) return;

    switch (activeMode) {
      case 'improve-title': {
        const titleMatch = response.match(/[«""]([^»""]+)[»""]/);
        if (titleMatch) {
          onApplySuggestion('title', titleMatch[1]);
        }
        break;
      }
      case 'enrich-description':
        onApplySuggestion('fullDescription', response);
        break;
      case 'estimate-budget': {
        const budgetMatch = response.match(/(\d[\d\s]*)\s*Pi/);
        if (budgetMatch) {
          onApplySuggestion('fundingGoal', budgetMatch[1].replace(/\s/g, ''));
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-300 font-medium hover:from-purple-600/30 hover:to-indigo-600/30 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-xl">🤖</span>
        <span>Assistant IA - Aide à la Rédaction</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Assistant Panel */}
      {isOpen && (
        <div className="mt-3 bg-slate-800/80 border border-purple-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm">
              🤖
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Assistant Atlasphere</h3>
              <p className="text-gray-400 text-xs">Propulsé par IA - Aide à la rédaction de propositions</p>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleGenerate(mode.id)}
                disabled={loading}
                className={`p-3 rounded-lg border text-left transition-all ${
                  activeMode === mode.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-700 bg-slate-900/50 hover:border-purple-500/50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{mode.icon}</span>
                  <span className="text-white text-sm font-medium">{mode.label}</span>
                </div>
                <p className="text-gray-400 text-xs">{mode.description}</p>
              </button>
            ))}
          </div>

          {/* Response Area */}
          {(response || loading) && (
            <div className="mt-4 space-y-3">
              <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                {loading && !response && (
                  <div className="flex items-center gap-2 text-purple-300">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm">L&apos;assistant réfléchit...</span>
                  </div>
                )}
                {response && (
                  <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {response}
                  </div>
                )}
                {loading && response && (
                  <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" />
                )}
              </div>

              {/* Action Buttons */}
              {!loading && response && (
                <div className="flex gap-2">
                  {(activeMode === 'improve-title' || activeMode === 'enrich-description' || activeMode === 'estimate-budget') && (
                    <button
                      type="button"
                      onClick={handleApply}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors"
                    >
                      Appliquer la suggestion
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setResponse('');
                      setActiveMode(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-700 text-gray-300 text-sm font-medium hover:bg-slate-600 transition-colors"
                  >
                    Effacer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Helper Text */}
          {!response && !loading && (
            <p className="text-gray-500 text-xs text-center mt-2">
              💡 Remplissez d&apos;abord les champs du formulaire, puis utilisez l&apos;assistant pour améliorer votre proposition.
            </p>
          )}
        </div>
      )}
    </div>
  );
}