// Badges & Achievements system

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'governance' | 'funding' | 'social' | 'eco' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0-100
  requirement: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  completedAt?: string;
}

const allBadges: Badge[] = [
  // Governance
  { id: 'first-vote', name: 'Premier Vote', description: 'Voter pour la première fois sur une proposition', icon: '🗳️', category: 'governance', rarity: 'common', unlocked: true, unlockedAt: '2026-05-15', progress: 100, requirement: '1 vote' },
  { id: 'voter-10', name: 'Citoyen Actif', description: 'Voter sur 10 propositions différentes', icon: '⚖️', category: 'governance', rarity: 'rare', unlocked: true, unlockedAt: '2026-06-20', progress: 100, requirement: '10 votes' },
  { id: 'voter-50', name: 'Sénateur', description: 'Voter sur 50 propositions', icon: '🏛️', category: 'governance', rarity: 'epic', unlocked: false, progress: 64, requirement: '50 votes (32/50)' },
  { id: 'proposer', name: 'Visionnaire', description: 'Soumettre votre première proposition', icon: '💡', category: 'governance', rarity: 'common', unlocked: true, unlockedAt: '2026-05-20', progress: 100, requirement: '1 proposition' },
  { id: 'proposer-5', name: 'Architecte', description: 'Soumettre 5 propositions approuvées', icon: '🏗️', category: 'governance', rarity: 'epic', unlocked: false, progress: 40, requirement: '5 propositions approuvées (2/5)' },
  { id: 'delegator', name: 'Diplomate', description: 'Déléguer vos votes à un autre Pionnier', icon: '🤝', category: 'governance', rarity: 'rare', unlocked: true, unlockedAt: '2026-07-01', progress: 100, requirement: '1 délégation' },

  // Funding
  { id: 'first-fund', name: 'Mécène', description: 'Contribuer au financement d\'un projet', icon: '💰', category: 'funding', rarity: 'common', unlocked: true, unlockedAt: '2026-05-25', progress: 100, requirement: '1 contribution' },
  { id: 'fund-100', name: 'Investisseur', description: 'Contribuer un total de 100 Pi', icon: '💎', category: 'funding', rarity: 'rare', unlocked: true, unlockedAt: '2026-06-15', progress: 100, requirement: '100 Pi contribués' },
  { id: 'fund-1000', name: 'Philanthrope', description: 'Contribuer un total de 1000 Pi', icon: '🏆', category: 'funding', rarity: 'epic', unlocked: false, progress: 45, requirement: '1000 Pi (450/1000)' },
  { id: 'fund-10000', name: 'Légende', description: 'Contribuer un total de 10000 Pi', icon: '👑', category: 'funding', rarity: 'legendary', unlocked: false, progress: 4, requirement: '10000 Pi (450/10000)' },

  // Social
  { id: 'first-comment', name: 'Communicant', description: 'Poster votre premier commentaire', icon: '💬', category: 'social', rarity: 'common', unlocked: true, unlockedAt: '2026-05-12', progress: 100, requirement: '1 commentaire' },
  { id: 'comments-50', name: 'Influenceur', description: 'Poster 50 commentaires constructifs', icon: '📢', category: 'social', rarity: 'rare', unlocked: false, progress: 72, requirement: '50 commentaires (36/50)' },
  { id: 'share-10', name: 'Ambassadeur', description: 'Partager 10 propositions sur les réseaux sociaux', icon: '🌐', category: 'social', rarity: 'rare', unlocked: false, progress: 30, requirement: '10 partages (3/10)' },
  { id: 'referral', name: 'Recruteur', description: 'Inviter 5 nouveaux Pionniers sur la plateforme', icon: '🎯', category: 'social', rarity: 'epic', unlocked: false, progress: 20, requirement: '5 invitations (1/5)' },

  // Eco
  { id: 'eco-first', name: 'Éco-Citoyen', description: 'Effectuer votre première action écologique', icon: '🌱', category: 'eco', rarity: 'common', unlocked: true, unlockedAt: '2026-07-10', progress: 100, requirement: '1 action éco' },
  { id: 'eco-nft', name: 'Collectionneur Vert', description: 'Posséder 5 EcoNFT certifiés', icon: '🎨', category: 'eco', rarity: 'rare', unlocked: false, progress: 60, requirement: '5 EcoNFT (3/5)' },
  { id: 'carbon-zero', name: 'Neutralité Carbone', description: 'Compenser 100% de votre empreinte carbone', icon: '♻️', category: 'eco', rarity: 'legendary', unlocked: false, progress: 15, requirement: '100% compensation' },

  // Special
  { id: 'early-adopter', name: 'Pionnier Alpha', description: 'Rejoindre Atlasphere pendant la phase beta', icon: '⭐', category: 'special', rarity: 'legendary', unlocked: true, unlockedAt: '2026-05-10', progress: 100, requirement: 'Inscription beta' },
  { id: 'streak-30', name: 'Infatigable', description: 'Se connecter 30 jours consécutifs', icon: '🔥', category: 'special', rarity: 'epic', unlocked: false, progress: 80, requirement: '30 jours (24/30)' },
  { id: 'all-quests', name: 'Maître des Quêtes', description: 'Compléter toutes les quêtes disponibles', icon: '🏅', category: 'special', rarity: 'legendary', unlocked: false, progress: 55, requirement: 'Toutes les quêtes (11/20)' },
];

export function getBadges(): Badge[] {
  return [...allBadges];
}

export function getUnlockedBadges(): Badge[] {
  return allBadges.filter((b) => b.unlocked);
}

export function getBadgesByCategory(category: Badge['category']): Badge[] {
  return allBadges.filter((b) => b.category === category);
}

export function getTotalXP(): number {
  return allBadges.filter((b) => b.unlocked).length * 100 + 
    allBadges.filter((b) => !b.unlocked).reduce((sum, b) => sum + Math.floor(b.progress * 0.5), 0);
}

export function getLevel(): { level: number; xp: number; nextLevelXp: number } {
  const totalXp = getTotalXP();
  const level = Math.floor(totalXp / 500) + 1;
  const xpInLevel = totalXp % 500;
  return { level, xp: xpInLevel, nextLevelXp: 500 };
}

export function getRarityColor(rarity: Badge['rarity']): string {
  switch (rarity) {
    case 'common': return 'text-gray-400 border-gray-500';
    case 'rare': return 'text-blue-400 border-blue-500';
    case 'epic': return 'text-purple-400 border-purple-500';
    case 'legendary': return 'text-yellow-400 border-yellow-500';
  }
}