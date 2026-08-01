// Messaging system - Private chat & project groups (simulated)

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
  projectId?: string;
}

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'EduPioneer',
    avatar: '👨‍🏫',
    participants: ['me', 'EduPioneer'],
    lastMessage: {
      id: 'm1', senderId: 'EduPioneer', senderName: 'EduPioneer', senderAvatar: '👨‍🏫',
      content: 'Merci pour ton vote sur Pi Academy ! Tu veux rejoindre l\'équipe ?',
      timestamp: '2026-07-31T14:30:00Z', read: false,
    },
    unreadCount: 2,
  },
  {
    id: 'conv-2',
    type: 'group',
    name: 'Équipe Pi Academy',
    avatar: '📚',
    participants: ['me', 'EduPioneer', 'CryptoLearner', 'DevMaster'],
    lastMessage: {
      id: 'm2', senderId: 'CryptoLearner', senderName: 'CryptoLearner', senderAvatar: '📖',
      content: 'Le module 3 est prêt pour la review !',
      timestamp: '2026-07-31T10:15:00Z', read: true,
    },
    unreadCount: 0,
    projectId: '1',
  },
  {
    id: 'conv-3',
    type: 'direct',
    name: 'GreenPioneer',
    avatar: '🌱',
    participants: ['me', 'GreenPioneer'],
    lastMessage: {
      id: 'm3', senderId: 'GreenPioneer', senderName: 'GreenPioneer', senderAvatar: '🌱',
      content: 'Tu as vu les résultats du Climate Dashboard ? Impressionnant !',
      timestamp: '2026-07-30T18:45:00Z', read: true,
    },
    unreadCount: 0,
  },
  {
    id: 'conv-4',
    type: 'group',
    name: 'Pi Commerce Hub',
    avatar: '🛒',
    participants: ['me', 'ShopPioneer', 'TradeExpert', 'MarketGuru'],
    lastMessage: {
      id: 'm4', senderId: 'TradeExpert', senderName: 'TradeExpert', senderAvatar: '📊',
      content: 'Nouveau partenariat confirmé avec 3 marchands locaux',
      timestamp: '2026-07-30T09:00:00Z', read: false,
    },
    unreadCount: 5,
    projectId: '3',
  },
];

const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    { id: 'm1-1', senderId: 'me', senderName: 'Moi', senderAvatar: '🧑', content: 'Salut ! J\'ai voté pour Pi Academy, super projet !', timestamp: '2026-07-31T14:00:00Z', read: true },
    { id: 'm1-2', senderId: 'EduPioneer', senderName: 'EduPioneer', senderAvatar: '👨‍🏫', content: 'Merci beaucoup ! On cherche des contributeurs.', timestamp: '2026-07-31T14:15:00Z', read: true },
    { id: 'm1-3', senderId: 'EduPioneer', senderName: 'EduPioneer', senderAvatar: '👨‍🏫', content: 'Merci pour ton vote sur Pi Academy ! Tu veux rejoindre l\'équipe ?', timestamp: '2026-07-31T14:30:00Z', read: false },
  ],
  'conv-2': [
    { id: 'm2-1', senderId: 'EduPioneer', senderName: 'EduPioneer', senderAvatar: '👨‍🏫', content: 'Bienvenue dans le groupe Pi Academy !', timestamp: '2026-07-29T09:00:00Z', read: true },
    { id: 'm2-2', senderId: 'DevMaster', senderName: 'DevMaster', senderAvatar: '💻', content: 'J\'ai terminé l\'intégration du module quiz.', timestamp: '2026-07-30T16:00:00Z', read: true },
    { id: 'm2-3', senderId: 'CryptoLearner', senderName: 'CryptoLearner', senderAvatar: '📖', content: 'Le module 3 est prêt pour la review !', timestamp: '2026-07-31T10:15:00Z', read: true },
  ],
  'conv-3': [
    { id: 'm3-1', senderId: 'GreenPioneer', senderName: 'GreenPioneer', senderAvatar: '🌱', content: 'Salut ! Tu participes au projet EcoChain ?', timestamp: '2026-07-30T17:00:00Z', read: true },
    { id: 'm3-2', senderId: 'me', senderName: 'Moi', senderAvatar: '🧑', content: 'Oui, je suis très intéressé par la partie Climate Dashboard.', timestamp: '2026-07-30T17:30:00Z', read: true },
    { id: 'm3-3', senderId: 'GreenPioneer', senderName: 'GreenPioneer', senderAvatar: '🌱', content: 'Tu as vu les résultats du Climate Dashboard ? Impressionnant !', timestamp: '2026-07-30T18:45:00Z', read: true },
  ],
  'conv-4': [
    { id: 'm4-1', senderId: 'ShopPioneer', senderName: 'ShopPioneer', senderAvatar: '🏪', content: 'Objectif : 10 marchands avant fin août', timestamp: '2026-07-28T10:00:00Z', read: true },
    { id: 'm4-2', senderId: 'MarketGuru', senderName: 'MarketGuru', senderAvatar: '📈', content: 'J\'ai contacté 5 boutiques dans ma ville', timestamp: '2026-07-29T14:00:00Z', read: true },
    { id: 'm4-3', senderId: 'TradeExpert', senderName: 'TradeExpert', senderAvatar: '📊', content: 'Nouveau partenariat confirmé avec 3 marchands locaux', timestamp: '2026-07-30T09:00:00Z', read: false },
  ],
};

export function getConversations(): Conversation[] {
  return [...mockConversations];
}

export function getMessages(conversationId: string): Message[] {
  return mockMessages[conversationId] || [];
}

export function sendMessage(conversationId: string, content: string): Message {
  const msg: Message = {
    id: `msg-${Date.now()}`,
    senderId: 'me',
    senderName: 'Moi',
    senderAvatar: '🧑',
    content,
    timestamp: new Date().toISOString(),
    read: true,
  };
  if (!mockMessages[conversationId]) mockMessages[conversationId] = [];
  mockMessages[conversationId].push(msg);
  const conv = mockConversations.find((c) => c.id === conversationId);
  if (conv) conv.lastMessage = msg;
  return msg;
}

export function getTotalUnread(): number {
  return mockConversations.reduce((sum, c) => sum + c.unreadCount, 0);
}