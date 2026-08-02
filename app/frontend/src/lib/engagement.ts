// --- Notification Preferences ---

export interface NotificationPreference {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
  channels: { push: boolean; email: boolean; inApp: boolean };
}

export function getNotificationPreferences(): NotificationPreference[] {
  return [
    { id: 'votes', category: 'governance', label: 'Votes & Propositions', description: 'Nouvelles propositions, résultats de votes, deadlines', icon: '🗳️', enabled: true, channels: { push: true, email: true, inApp: true } },
    { id: 'eco', category: 'ecochain', label: 'EcoChain AI', description: 'Récompenses ECO, alertes capteurs, prédictions', icon: '🌿', enabled: true, channels: { push: true, email: false, inApp: true } },
    { id: 'guilds', category: 'social', label: 'Guildes & Défis', description: 'Défis de guilde, nouveaux membres, victoires', icon: '🛡️', enabled: true, channels: { push: true, email: false, inApp: true } },
    { id: 'seasons', category: 'gamification', label: 'Saisons & Missions', description: 'Nouvelles missions, fin de saison, récompenses', icon: '🌊', enabled: true, channels: { push: true, email: true, inApp: true } },
    { id: 'treasury', category: 'governance', label: 'Trésorerie', description: 'Allocations, dépenses, votes budget', icon: '💰', enabled: false, channels: { push: false, email: true, inApp: true } },
    { id: 'market', category: 'ecochain', label: 'EcoMarket', description: 'Nouveaux datasets, achats, ventes de vos données', icon: '🛒', enabled: true, channels: { push: false, email: false, inApp: true } },
    { id: 'anomalies', category: 'ecochain', label: 'Anomalies IoT', description: 'Pics de pollution, consommation anormale, fuites', icon: '🚨', enabled: true, channels: { push: true, email: true, inApp: true } },
    { id: 'carbon', category: 'ecochain', label: 'Crédits Carbone', description: 'Nouveaux crédits disponibles, compensations', icon: '🌱', enabled: false, channels: { push: false, email: false, inApp: true } },
    { id: 'social', category: 'social', label: 'Messages & Communauté', description: 'Nouveaux messages, réponses forum, mentions', icon: '💬', enabled: true, channels: { push: true, email: false, inApp: true } },
    { id: 'badges', category: 'gamification', label: 'Badges & Niveaux', description: 'Nouveaux badges débloqués, montée de niveau', icon: '🏅', enabled: true, channels: { push: true, email: false, inApp: true } },
  ];
}

// --- Custom Dashboard Widgets ---

export interface DashboardWidget {
  id: string;
  title: string;
  icon: string;
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
  category: string;
  order: number;
}

export function getDefaultWidgets(): DashboardWidget[] {
  return [
    { id: 'eco-score', title: 'Score Écologique', icon: '🌍', size: 'medium', enabled: true, category: 'eco', order: 0 },
    { id: 'wallet', title: 'Portefeuille', icon: '💰', size: 'small', enabled: true, category: 'finance', order: 1 },
    { id: 'weekly-goals', title: 'Objectifs Semaine', icon: '🎯', size: 'medium', enabled: true, category: 'goals', order: 2 },
    { id: 'notifications', title: 'Notifications Récentes', icon: '🔔', size: 'small', enabled: true, category: 'social', order: 3 },
    { id: 'guild-status', title: 'Ma Guilde', icon: '🛡️', size: 'small', enabled: true, category: 'social', order: 4 },
    { id: 'season-progress', title: 'Progression Saison', icon: '🌊', size: 'medium', enabled: true, category: 'gamification', order: 5 },
    { id: 'leaderboard', title: 'Classement', icon: '🏆', size: 'small', enabled: false, category: 'social', order: 6 },
    { id: 'climate-alerts', title: 'Alertes Climat', icon: '⚠️', size: 'small', enabled: true, category: 'eco', order: 7 },
    { id: 'recent-votes', title: 'Votes Récents', icon: '🗳️', size: 'medium', enabled: false, category: 'governance', order: 8 },
    { id: 'carbon-offset', title: 'Compensation Carbone', icon: '🌱', size: 'small', enabled: false, category: 'eco', order: 9 },
    { id: 'sensors', title: 'Mes Capteurs', icon: '📡', size: 'small', enabled: true, category: 'eco', order: 10 },
    { id: 'achievements', title: 'Derniers Badges', icon: '🏅', size: 'small', enabled: false, category: 'gamification', order: 11 },
  ];
}

// --- Engagement Rewards System ---

export interface EngagementAction {
  id: string;
  action: string;
  description: string;
  xpReward: number;
  ecoReward: number;
  icon: string;
  category: 'daily' | 'weekly' | 'milestone' | 'special';
  repeatable: boolean;
  cooldown?: string;
  completed: boolean;
  progress?: number;
  target?: number;
}

export interface EngagementStreak {
  current: number;
  longest: number;
  multiplier: number;
  nextMilestone: number;
  milestoneReward: number;
}

export interface EngagementLevel {
  level: number;
  title: string;
  xp: number;
  xpNext: number;
  icon: string;
  perks: string[];
}

export function getEngagementActions(): EngagementAction[] {
  return [
    // Daily
    { id: 'ea1', action: 'Connexion quotidienne', description: 'Connectez-vous chaque jour', xpReward: 10, ecoReward: 5, icon: '☀️', category: 'daily', repeatable: true, cooldown: '24h', completed: true },
    { id: 'ea2', action: 'Partager une mesure capteur', description: 'Envoyez au moins 1 donnée capteur', xpReward: 15, ecoReward: 8, icon: '📡', category: 'daily', repeatable: true, cooldown: '24h', completed: true },
    { id: 'ea3', action: 'Réagir à un post communauté', description: 'Likez ou commentez un post', xpReward: 5, ecoReward: 2, icon: '💬', category: 'daily', repeatable: true, cooldown: '24h', completed: false },
    { id: 'ea4', action: 'Consulter le dashboard climat', description: 'Vérifiez votre score écologique', xpReward: 5, ecoReward: 3, icon: '🌍', category: 'daily', repeatable: true, cooldown: '24h', completed: false },
    // Weekly
    { id: 'ea5', action: 'Voter sur une proposition', description: 'Participez à au moins 1 vote', xpReward: 50, ecoReward: 25, icon: '🗳️', category: 'weekly', repeatable: true, cooldown: '7d', completed: false },
    { id: 'ea6', action: 'Compléter un défi de guilde', description: 'Terminez un défi avec votre guilde', xpReward: 100, ecoReward: 50, icon: '🛡️', category: 'weekly', repeatable: true, cooldown: '7d', completed: false },
    { id: 'ea7', action: 'Acheter un crédit carbone', description: 'Compensez au moins 1 tonne CO2', xpReward: 75, ecoReward: 30, icon: '🌱', category: 'weekly', repeatable: true, cooldown: '7d', completed: false },
    { id: 'ea8', action: 'Inviter un ami', description: 'Parrainez un nouveau Pionnier', xpReward: 200, ecoReward: 100, icon: '👥', category: 'weekly', repeatable: true, cooldown: '7d', completed: false },
    // Milestones
    { id: 'ea9', action: '7 jours consécutifs', description: 'Streak de 7 jours', xpReward: 150, ecoReward: 75, icon: '🔥', category: 'milestone', repeatable: false, completed: true, progress: 14, target: 7 },
    { id: 'ea10', action: '30 jours consécutifs', description: 'Streak de 30 jours', xpReward: 500, ecoReward: 250, icon: '💎', category: 'milestone', repeatable: false, completed: false, progress: 14, target: 30 },
    { id: 'ea11', action: '100 votes cumulés', description: 'Votez 100 fois au total', xpReward: 300, ecoReward: 150, icon: '🏛️', category: 'milestone', repeatable: false, completed: false, progress: 67, target: 100 },
    { id: 'ea12', action: 'Niveau 10 atteint', description: 'Atteignez le niveau 10 d\'engagement', xpReward: 1000, ecoReward: 500, icon: '⭐', category: 'milestone', repeatable: false, completed: false, progress: 7, target: 10 },
    // Special
    { id: 'ea13', action: 'Premier crédit carbone', description: 'Achetez votre premier crédit', xpReward: 250, ecoReward: 100, icon: '🎉', category: 'special', repeatable: false, completed: true },
    { id: 'ea14', action: 'Créer une guilde', description: 'Fondez votre propre guilde', xpReward: 500, ecoReward: 200, icon: '👑', category: 'special', repeatable: false, completed: false },
  ];
}

export function getEngagementStreak(): EngagementStreak {
  return { current: 14, longest: 21, multiplier: 1.4, nextMilestone: 21, milestoneReward: 300 };
}

export function getEngagementLevel(): EngagementLevel {
  return {
    level: 7,
    title: 'Éco-Stratège',
    xp: 3450,
    xpNext: 5000,
    icon: '🧠',
    perks: ['Multiplicateur XP x1.4', 'Badge exclusif Niv.7', 'Accès votes prioritaires', 'Bonus ECO +20%'],
  };
}

export function getLevelProgression(): { level: number; title: string; icon: string; xpRequired: number }[] {
  return [
    { level: 1, title: 'Novice Vert', icon: '🌱', xpRequired: 0 },
    { level: 2, title: 'Éco-Curieux', icon: '🔍', xpRequired: 100 },
    { level: 3, title: 'Contributeur', icon: '🤝', xpRequired: 300 },
    { level: 4, title: 'Éco-Actif', icon: '⚡', xpRequired: 600 },
    { level: 5, title: 'Gardien', icon: '🛡️', xpRequired: 1000 },
    { level: 6, title: 'Champion', icon: '🏆', xpRequired: 1800 },
    { level: 7, title: 'Éco-Stratège', icon: '🧠', xpRequired: 3000 },
    { level: 8, title: 'Maître Vert', icon: '🌿', xpRequired: 5000 },
    { level: 9, title: 'Légende', icon: '🌟', xpRequired: 8000 },
    { level: 10, title: 'Architecte Planétaire', icon: '🌍', xpRequired: 12000 },
  ];
}