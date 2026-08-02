// --- IPFS Decentralized Storage ---

export interface IPFSFile {
  id: string;
  name: string;
  cid: string;
  size: string;
  type: 'sensor-data' | 'eco-nft' | 'report' | 'certificate' | 'dataset';
  uploadedAt: string;
  pinned: boolean;
  accessCount: number;
}

export function getIPFSFiles(): IPFSFile[] {
  return [
    { id: 'f1', name: 'air-quality-paris-2026-07.json', cid: 'QmX7b3...kF9a2', size: '2.4 MB', type: 'sensor-data', uploadedAt: '2026-07-28', pinned: true, accessCount: 142 },
    { id: 'f2', name: 'eco-nft-certificate-001.json', cid: 'QmR4c8...pL7m1', size: '156 KB', type: 'eco-nft', uploadedAt: '2026-07-25', pinned: true, accessCount: 89 },
    { id: 'f3', name: 'carbon-offset-report-q2.pdf', cid: 'QmT9d2...nK3b5', size: '4.8 MB', type: 'report', uploadedAt: '2026-07-20', pinned: false, accessCount: 56 },
    { id: 'f4', name: 'biodiversity-dataset-ile-de-france.csv', cid: 'QmW1e6...jH8c4', size: '12.1 MB', type: 'dataset', uploadedAt: '2026-07-15', pinned: true, accessCount: 234 },
    { id: 'f5', name: 'water-quality-certificate.json', cid: 'QmY5f3...mN2d7', size: '98 KB', type: 'certificate', uploadedAt: '2026-07-10', pinned: false, accessCount: 31 },
    { id: 'f6', name: 'energy-consumption-monthly.json', cid: 'QmZ8g1...oP4e9', size: '1.7 MB', type: 'sensor-data', uploadedAt: '2026-07-05', pinned: true, accessCount: 178 },
  ];
}

export interface IPFSStats {
  totalFiles: number;
  totalSize: string;
  pinnedFiles: number;
  totalAccess: number;
  storageUsed: number;
  storageMax: number;
}

export function getIPFSStats(): IPFSStats {
  return { totalFiles: 47, totalSize: '234 MB', pinnedFiles: 32, totalAccess: 4521, storageUsed: 234, storageMax: 1000 };
}

// --- Referral / Parrainage ---

export interface Referral {
  id: string;
  username: string;
  joinedAt: string;
  level: number;
  ecoEarned: number;
  active: boolean;
}

export interface ReferralStats {
  code: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  pendingRewards: number;
  tier: string;
  nextTier: string;
  nextTierRequirement: number;
  bonusMultiplier: number;
}

export function getReferralStats(): ReferralStats {
  return {
    code: 'ECO-PIONEER-7X9K',
    totalReferrals: 23,
    activeReferrals: 18,
    totalEarned: 1150,
    pendingRewards: 75,
    tier: 'Ambassadeur',
    nextTier: 'Champion',
    nextTierRequirement: 50,
    bonusMultiplier: 1.5,
  };
}

export function getReferrals(): Referral[] {
  return [
    { id: 'r1', username: 'GreenPioneer42', joinedAt: '2026-07-28', level: 5, ecoEarned: 120, active: true },
    { id: 'r2', username: 'EcoWarrior_FR', joinedAt: '2026-07-25', level: 3, ecoEarned: 85, active: true },
    { id: 'r3', username: 'ClimateHero99', joinedAt: '2026-07-20', level: 7, ecoEarned: 210, active: true },
    { id: 'r4', username: 'PiEcologist', joinedAt: '2026-07-15', level: 2, ecoEarned: 45, active: false },
    { id: 'r5', username: 'SolarPunk_Dev', joinedAt: '2026-07-10', level: 4, ecoEarned: 95, active: true },
    { id: 'r6', username: 'OceanGuard', joinedAt: '2026-07-05', level: 6, ecoEarned: 180, active: true },
    { id: 'r7', username: 'BioDiversity_X', joinedAt: '2026-06-28', level: 1, ecoEarned: 20, active: false },
    { id: 'r8', username: 'ZeroWaste_Life', joinedAt: '2026-06-20', level: 8, ecoEarned: 290, active: true },
  ];
}

// --- ONG Partners ---

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  impact: string;
  piContributed: number;
  membersInvolved: number;
  website: string;
  verified: boolean;
}

export function getPartners(): Partner[] {
  return [
    { id: 'p1', name: 'GreenPeace Digital', logo: '🌊', category: 'Océans', description: 'Protection des écosystèmes marins via données satellitaires et IA', impact: '12 000 tonnes de plastique retirées', piContributed: 45000, membersInvolved: 3200, website: '#', verified: true },
    { id: 'p2', name: 'Carbon Zero Alliance', logo: '🌱', category: 'Carbone', description: 'Compensation carbone certifiée par blockchain', impact: '50 000 tonnes CO2 compensées', piContributed: 78000, membersInvolved: 5100, website: '#', verified: true },
    { id: 'p3', name: 'BioWatch Foundation', logo: '🦋', category: 'Biodiversité', description: 'Surveillance de la biodiversité via capteurs IoT communautaires', impact: '200 espèces suivies en temps réel', piContributed: 23000, membersInvolved: 1800, website: '#', verified: true },
    { id: 'p4', name: 'Solar4All', logo: '☀️', category: 'Énergie', description: 'Démocratisation de l\'énergie solaire dans les pays en développement', impact: '15 000 foyers équipés', piContributed: 92000, membersInvolved: 4500, website: '#', verified: true },
    { id: 'p5', name: 'AquaPure Network', logo: '💧', category: 'Eau', description: 'Accès à l\'eau potable et monitoring qualité en temps réel', impact: '500 000 personnes servies', piContributed: 61000, membersInvolved: 2900, website: '#', verified: true },
    { id: 'p6', name: 'UrbanForest DAO', logo: '🌳', category: 'Reforestation', description: 'Reforestation urbaine décentralisée et vérifiable', impact: '1.2 million d\'arbres plantés', piContributed: 110000, membersInvolved: 7800, website: '#', verified: true },
  ];
}

// --- Eco Ads (opt-in) ---

export interface EcoAd {
  id: string;
  brand: string;
  title: string;
  description: string;
  rewardEco: number;
  type: 'video' | 'survey' | 'action' | 'article';
  duration: string;
  category: string;
  completed: boolean;
}

export function getEcoAds(): EcoAd[] {
  return [
    { id: 'ad1', brand: 'EcoVolta', title: 'Découvrez les batteries solaires portables', description: 'Regardez une vidéo de 30s sur les nouvelles batteries solaires', rewardEco: 15, type: 'video', duration: '30s', category: 'Énergie', completed: false },
    { id: 'ad2', brand: 'GreenMobility', title: 'Sondage mobilité durable', description: 'Répondez à 5 questions sur vos habitudes de transport', rewardEco: 25, type: 'survey', duration: '2 min', category: 'Transport', completed: false },
    { id: 'ad3', brand: 'BioMarket', title: 'Testez l\'app anti-gaspillage', description: 'Téléchargez et essayez l\'app pendant 5 minutes', rewardEco: 50, type: 'action', duration: '5 min', category: 'Alimentation', completed: true },
    { id: 'ad4', brand: 'CleanTech Weekly', title: 'Article sur l\'hydrogène vert', description: 'Lisez un article sur les avancées de l\'hydrogène', rewardEco: 10, type: 'article', duration: '3 min', category: 'Innovation', completed: false },
    { id: 'ad5', brand: 'ReforestNow', title: 'Plantez un arbre virtuel', description: 'Participez au challenge reforestation digitale', rewardEco: 30, type: 'action', duration: '1 min', category: 'Nature', completed: false },
  ];
}

export interface EcoAdStats {
  totalEarned: number;
  adsCompleted: number;
  optIn: boolean;
  weeklyLimit: number;
  weeklyCompleted: number;
}

export function getEcoAdStats(): EcoAdStats {
  return { totalEarned: 485, adsCompleted: 34, optIn: true, weeklyLimit: 10, weeklyCompleted: 3 };
}

// --- User Profile ---

export interface UserProfile {
  username: string;
  avatar: string;
  joinedAt: string;
  level: number;
  title: string;
  xp: number;
  xpNext: number;
  ecoBalance: number;
  piBalance: number;
  reputation: number;
  badges: number;
  totalBadges: number;
  proposals: number;
  votes: number;
  contributions: number;
  nfts: number;
  referrals: number;
  streak: number;
  guild: string;
  guildRole: string;
  carbonOffset: number;
  dataShared: number;
}

export function getUserProfile(): UserProfile {
  return {
    username: 'EcoPioneer_Alpha',
    avatar: '🌍',
    joinedAt: '2026-03-15',
    level: 7,
    title: 'Éco-Stratège',
    xp: 3450,
    xpNext: 5000,
    ecoBalance: 2840,
    piBalance: 156.7,
    reputation: 892,
    badges: 18,
    totalBadges: 42,
    proposals: 5,
    votes: 67,
    contributions: 12,
    nfts: 8,
    referrals: 23,
    streak: 14,
    guild: 'Les Gardiens Verts',
    guildRole: 'Vice-Capitaine',
    carbonOffset: 4.2,
    dataShared: 1247,
  };
}