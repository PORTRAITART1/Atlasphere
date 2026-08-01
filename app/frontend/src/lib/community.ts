// Community / Forum data (simulated)

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: 'education' | 'technology' | 'social' | 'environment' | 'general';
  createdAt: string;
  replies: ForumReply[];
  reactions: { like: number; fire: number; think: number; heart: number };
  views: number;
  pinned: boolean;
}

export interface ForumReply {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  reactions: { like: number; fire: number; think: number; heart: number };
}

const forumPosts: ForumPost[] = [
  {
    id: 'fp-1',
    title: 'Comment maximiser votre score de réputation ?',
    content: 'Bonjour à tous ! Je partage mes astuces pour augmenter rapidement votre score de réputation sur Atlasphere. Voici les actions les plus efficaces :\n\n1. Votez régulièrement sur les propositions\n2. Commentez de manière constructive\n3. Complétez les quêtes quotidiennes\n4. Participez au financement des projets\n5. Déléguez vos votes quand vous ne pouvez pas participer',
    author: 'ReputationGuru',
    authorAvatar: '🏆',
    category: 'general',
    createdAt: '2026-07-28T10:00:00Z',
    replies: [
      { id: 'r1', author: 'NewPioneer', authorAvatar: '🌟', content: 'Merci pour ces conseils ! Je ne savais pas que la délégation comptait aussi.', createdAt: '2026-07-28T11:30:00Z', reactions: { like: 8, fire: 2, think: 0, heart: 3 } },
      { id: 'r2', author: 'VoteExpert', authorAvatar: '⚖️', content: 'J\'ajouterais : participez aux discussions de groupe sur les projets. Ça compte double !', createdAt: '2026-07-28T14:00:00Z', reactions: { like: 12, fire: 5, think: 1, heart: 2 } },
    ],
    reactions: { like: 45, fire: 12, think: 3, heart: 8 },
    views: 234,
    pinned: true,
  },
  {
    id: 'fp-2',
    title: 'Proposition : Intégrer l\'IA pour la modération communautaire',
    content: 'Je pense qu\'on devrait utiliser l\'IA pour aider à modérer les discussions et détecter le spam. Qu\'en pensez-vous ? L\'IA pourrait :\n- Filtrer les messages inappropriés\n- Résumer les longs fils de discussion\n- Suggérer des catégories pour les nouvelles propositions\n- Détecter les doublons',
    author: 'TechVisioneer',
    authorAvatar: '🤖',
    category: 'technology',
    createdAt: '2026-07-29T16:00:00Z',
    replies: [
      { id: 'r3', author: 'PrivacyAdvocate', authorAvatar: '🔒', content: 'Bonne idée mais attention à la vie privée. L\'IA ne devrait pas lire les messages privés.', createdAt: '2026-07-29T17:00:00Z', reactions: { like: 20, fire: 0, think: 8, heart: 1 } },
      { id: 'r4', author: 'DevMaster', authorAvatar: '💻', content: 'On pourrait commencer par un système de signalement assisté par IA, moins intrusif.', createdAt: '2026-07-29T18:30:00Z', reactions: { like: 15, fire: 3, think: 4, heart: 0 } },
      { id: 'r5', author: 'EduPioneer', authorAvatar: '👨‍🏫', content: 'Pour Pi Academy, on utilise déjà l\'IA pour résumer les cours. Ça marche très bien !', createdAt: '2026-07-30T09:00:00Z', reactions: { like: 10, fire: 7, think: 0, heart: 5 } },
    ],
    reactions: { like: 67, fire: 23, think: 15, heart: 4 },
    views: 456,
    pinned: false,
  },
  {
    id: 'fp-3',
    title: '🌍 Retour d\'expérience : Mon premier projet EcoChain financé',
    content: 'Je voulais partager mon expérience avec le financement de mon projet de reforestation locale via Atlasphere. En 2 semaines, on a atteint 80% de l\'objectif grâce à la communauté. Les étapes clés :\n\n1. Bien rédiger la proposition avec des objectifs clairs\n2. Partager sur les réseaux sociaux\n3. Répondre à TOUS les commentaires\n4. Publier des mises à jour régulières\n5. Remercier chaque contributeur personnellement',
    author: 'GreenPioneer',
    authorAvatar: '🌱',
    category: 'environment',
    createdAt: '2026-07-30T08:00:00Z',
    replies: [
      { id: 'r6', author: 'FundingExpert', authorAvatar: '💰', content: 'Excellent retour ! Le point 3 est crucial. Les projets qui répondent aux commentaires lèvent 3x plus.', createdAt: '2026-07-30T10:00:00Z', reactions: { like: 25, fire: 8, think: 2, heart: 6 } },
    ],
    reactions: { like: 89, fire: 34, think: 5, heart: 42 },
    views: 678,
    pinned: false,
  },
  {
    id: 'fp-4',
    title: 'Guide : Créer un Smart Contract Escrow efficace',
    content: 'Pour ceux qui veulent sécuriser leurs projets avec un escrow, voici un guide étape par étape. L\'escrow protège à la fois les contributeurs et les porteurs de projet en libérant les fonds par jalons.',
    author: 'ContractWizard',
    authorAvatar: '📜',
    category: 'education',
    createdAt: '2026-07-31T07:00:00Z',
    replies: [],
    reactions: { like: 23, fire: 11, think: 7, heart: 2 },
    views: 145,
    pinned: false,
  },
  {
    id: 'fp-5',
    title: 'Meetup Pionniers Paris - Août 2026',
    content: 'Qui serait intéressé par un meetup à Paris début août ? On pourrait discuter des projets en cours, faire du networking et peut-être même organiser un hackathon Pi ! Proposez vos dates et lieux préférés.',
    author: 'ParisNode',
    authorAvatar: '🗼',
    category: 'social',
    createdAt: '2026-07-31T12:00:00Z',
    replies: [
      { id: 'r7', author: 'CryptoMarie', authorAvatar: '👩‍💻', content: 'Je suis partante ! Le weekend du 9-10 août serait parfait pour moi.', createdAt: '2026-07-31T13:00:00Z', reactions: { like: 8, fire: 3, think: 0, heart: 4 } },
      { id: 'r8', author: 'BlockchainPaul', authorAvatar: '🧑‍💻', content: 'Station F serait un super lieu ! Ils ont des espaces événementiels.', createdAt: '2026-07-31T14:30:00Z', reactions: { like: 12, fire: 6, think: 0, heart: 2 } },
    ],
    reactions: { like: 34, fire: 18, think: 2, heart: 15 },
    views: 312,
    pinned: false,
  },
];

export function getForumPosts(category?: string): ForumPost[] {
  if (!category || category === 'all') return [...forumPosts];
  return forumPosts.filter((p) => p.category === category);
}

export function getForumPost(id: string): ForumPost | undefined {
  return forumPosts.find((p) => p.id === id);
}

export function addReply(postId: string, content: string): ForumReply | null {
  const post = forumPosts.find((p) => p.id === postId);
  if (!post) return null;
  const reply: ForumReply = {
    id: `reply-${Date.now()}`,
    author: 'Moi',
    authorAvatar: '🧑',
    content,
    createdAt: new Date().toISOString(),
    reactions: { like: 0, fire: 0, think: 0, heart: 0 },
  };
  post.replies.push(reply);
  return reply;
}

export function addPost(title: string, content: string, category: ForumPost['category']): ForumPost {
  const post: ForumPost = {
    id: `fp-${Date.now()}`,
    title,
    content,
    author: 'Moi',
    authorAvatar: '🧑',
    category,
    createdAt: new Date().toISOString(),
    replies: [],
    reactions: { like: 0, fire: 0, think: 0, heart: 0 },
    views: 0,
    pinned: false,
  };
  forumPosts.unshift(post);
  return post;
}

export function reactToPost(postId: string, reaction: keyof ForumPost['reactions']) {
  const post = forumPosts.find((p) => p.id === postId);
  if (post) post.reactions[reaction]++;
}