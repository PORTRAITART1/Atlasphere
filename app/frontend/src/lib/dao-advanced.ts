// --- Quadratic Voting ---

export interface QuadraticVote {
  proposalId: string;
  voterId: string;
  credits: number; // tokens spent
  votes: number; // effective votes = sqrt(credits)
  direction: 'for' | 'against';
}

export interface QuadraticProposal {
  id: string;
  title: string;
  category: string;
  votesFor: number;
  votesAgainst: number;
  creditsSpent: number;
  totalVoters: number;
  deadline: string;
  status: 'active' | 'passed' | 'rejected';
}

export function getQuadraticProposals(): QuadraticProposal[] {
  return [
    { id: 'qp1', title: 'Financer 50 stations de recharge solaire', category: 'energy', votesFor: 142, votesAgainst: 38, creditsSpent: 28400, totalVoters: 312, deadline: '2026-08-15', status: 'active' },
    { id: 'qp2', title: 'Créer un réseau de pistes cyclables connectées', category: 'transport', votesFor: 98, votesAgainst: 22, creditsSpent: 15200, totalVoters: 187, deadline: '2026-08-10', status: 'active' },
    { id: 'qp3', title: 'Programme de reforestation urbaine - 10 000 arbres', category: 'biodiversity', votesFor: 215, votesAgainst: 12, creditsSpent: 52000, totalVoters: 456, deadline: '2026-08-20', status: 'active' },
    { id: 'qp4', title: 'Subventionner les panneaux solaires résidentiels', category: 'energy', votesFor: 178, votesAgainst: 45, creditsSpent: 34600, totalVoters: 289, deadline: '2026-07-30', status: 'passed' },
    { id: 'qp5', title: 'Interdire les plastiques à usage unique dans les marchés', category: 'waste', votesFor: 67, votesAgainst: 89, creditsSpent: 18900, totalVoters: 234, deadline: '2026-07-28', status: 'rejected' },
  ];
}

export function calculateQuadraticCost(votes: number): number {
  return votes * votes;
}

export function calculateQuadraticVotes(credits: number): number {
  return Math.floor(Math.sqrt(credits));
}

// --- Committees / Sub-DAOs ---

export interface Committee {
  id: string;
  name: string;
  icon: string;
  description: string;
  members: number;
  proposals: number;
  budget: number;
  lead: string;
  color: string;
}

export function getCommittees(): Committee[] {
  return [
    { id: 'energy', name: 'Comité Énergie', icon: '⚡', description: 'Transition énergétique, solaire, éolien, efficacité', members: 1247, proposals: 34, budget: 15000, lead: 'SolarPioneer', color: 'from-yellow-500/20 to-orange-500/20' },
    { id: 'transport', name: 'Comité Transport', icon: '🚲', description: 'Mobilité douce, transports en commun, véhicules électriques', members: 892, proposals: 28, budget: 12000, lead: 'BikeCommuter', color: 'from-blue-500/20 to-cyan-500/20' },
    { id: 'biodiversity', name: 'Comité Biodiversité', icon: '🌳', description: 'Reforestation, protection espèces, corridors écologiques', members: 1056, proposals: 22, budget: 18000, lead: 'TreeHugger', color: 'from-green-500/20 to-emerald-500/20' },
    { id: 'water', name: 'Comité Eau', icon: '💧', description: 'Qualité de l\'eau, économie, assainissement, nappes phréatiques', members: 678, proposals: 15, budget: 8000, lead: 'OceanGuard', color: 'from-cyan-500/20 to-blue-500/20' },
    { id: 'waste', name: 'Comité Déchets', icon: '♻️', description: 'Zéro déchet, recyclage, économie circulaire, compostage', members: 534, proposals: 19, budget: 6000, lead: 'ZeroWasteLife', color: 'from-purple-500/20 to-pink-500/20' },
  ];
}

// --- Treasury ---

export interface TreasuryAllocation {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TreasuryTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  approvedBy: string;
}

export function getTreasuryBalance(): { total: number; allocated: number; available: number } {
  return { total: 125000, allocated: 89000, available: 36000 };
}

export function getTreasuryAllocations(): TreasuryAllocation[] {
  return [
    { category: 'Énergie', amount: 25000, percentage: 28, color: 'bg-yellow-500' },
    { category: 'Transport', amount: 18000, percentage: 20, color: 'bg-blue-500' },
    { category: 'Biodiversité', amount: 22000, percentage: 25, color: 'bg-green-500' },
    { category: 'Eau', amount: 12000, percentage: 13, color: 'bg-cyan-500' },
    { category: 'Déchets', amount: 8000, percentage: 9, color: 'bg-purple-500' },
    { category: 'Réserve', amount: 4000, percentage: 5, color: 'bg-gray-500' },
  ];
}

export function getTreasuryTransactions(): TreasuryTransaction[] {
  return [
    { id: 't1', type: 'income', amount: 5000, description: 'Contributions mensuelles des Pionniers', category: 'general', date: '2026-08-01', approvedBy: 'Communauté' },
    { id: 't2', type: 'expense', amount: 3200, description: 'Financement stations solaires (tranche 2)', category: 'energy', date: '2026-07-30', approvedBy: 'Comité Énergie' },
    { id: 't3', type: 'income', amount: 2500, description: 'Vente de crédits carbone', category: 'carbon', date: '2026-07-28', approvedBy: 'DAO' },
    { id: 't4', type: 'expense', amount: 1800, description: 'Achat 500 arbres pour reforestation', category: 'biodiversity', date: '2026-07-27', approvedBy: 'Comité Biodiversité' },
    { id: 't5', type: 'expense', amount: 900, description: 'Infrastructure pistes cyclables', category: 'transport', date: '2026-07-25', approvedBy: 'Comité Transport' },
    { id: 't6', type: 'income', amount: 8000, description: 'Subvention municipale partenariat', category: 'general', date: '2026-07-22', approvedBy: 'Admin' },
  ];
}

// --- IoT Anomaly Detection ---

export interface IoTAnomaly {
  id: string;
  sensorType: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  value: number;
  threshold: number;
  unit: string;
  detectedAt: string;
  region: string;
  recommendation: string;
  acknowledged: boolean;
}

export function getIoTAnomalies(): IoTAnomaly[] {
  return [
    { id: 'a1', sensorType: 'air_quality', severity: 'critical', title: 'Pic PM2.5 détecté', description: 'Concentration PM2.5 à 3x la normale dans votre quartier', value: 156, threshold: 50, unit: 'µg/m³', detectedAt: '2026-08-01T09:45:00Z', region: 'Paris 11e', recommendation: 'Fermez les fenêtres, évitez les activités extérieures', acknowledged: false },
    { id: 'a2', sensorType: 'energy', severity: 'warning', title: 'Consommation anormale', description: 'Votre consommation électrique est 40% supérieure à la moyenne', value: 4.2, threshold: 3.0, unit: 'kWh/h', detectedAt: '2026-08-01T08:30:00Z', region: 'Domicile', recommendation: 'Vérifiez les appareils en veille et le chauffage', acknowledged: false },
    { id: 'a3', sensorType: 'water', severity: 'info', title: 'Fuite potentielle détectée', description: 'Consommation d\'eau continue détectée pendant la nuit (0h-5h)', value: 12, threshold: 2, unit: 'L/h', detectedAt: '2026-07-31T05:00:00Z', region: 'Domicile', recommendation: 'Vérifiez les robinets et la chasse d\'eau', acknowledged: true },
    { id: 'a4', sensorType: 'noise', severity: 'warning', title: 'Niveau sonore élevé', description: 'Bruit nocturne supérieur aux normes OMS (>55 dB) pendant 3h', value: 68, threshold: 55, unit: 'dB', detectedAt: '2026-07-31T02:00:00Z', region: 'Quartier', recommendation: 'Signalez à la mairie via l\'app', acknowledged: true },
  ];
}

// --- Guilds ---

export interface Guild {
  id: string;
  name: string;
  icon: string;
  description: string;
  members: number;
  maxMembers: number;
  level: number;
  xp: number;
  xpNext: number;
  ecoScore: number;
  rank: number;
  challenges: number;
  wins: number;
  leader: string;
  region: string;
  tags: string[];
}

export function getGuilds(): Guild[] {
  return [
    { id: 'g1', name: 'Les Gardiens Verts', icon: '🌿', description: 'Guilde de quartier dédiée à la reforestation urbaine et jardins partagés', members: 47, maxMembers: 50, level: 8, xp: 7200, xpNext: 8000, ecoScore: 892, rank: 1, challenges: 12, wins: 9, leader: 'GreenMaster', region: 'Paris 11e', tags: ['reforestation', 'jardins', 'urbain'] },
    { id: 'g2', name: 'Cyclistes Solidaires', icon: '🚲', description: 'Promotion du vélo comme transport principal, ateliers réparation', members: 35, maxMembers: 40, level: 6, xp: 4800, xpNext: 6000, ecoScore: 756, rank: 2, challenges: 10, wins: 7, leader: 'BikeCommuter', region: 'Lyon', tags: ['vélo', 'mobilité', 'atelier'] },
    { id: 'g3', name: 'Océan Protectors', icon: '🐋', description: 'Nettoyage des plages, protection marine, sensibilisation', members: 28, maxMembers: 35, level: 5, xp: 3600, xpNext: 5000, ecoScore: 678, rank: 3, challenges: 8, wins: 5, leader: 'OceanGuard', region: 'Marseille', tags: ['océan', 'plage', 'marine'] },
    { id: 'g4', name: 'Zéro Déchet Squad', icon: '♻️', description: 'Réduction des déchets, compostage collectif, troc', members: 42, maxMembers: 50, level: 7, xp: 5900, xpNext: 7000, ecoScore: 834, rank: 4, challenges: 11, wins: 8, leader: 'ZeroWasteLife', region: 'Bordeaux', tags: ['zéro déchet', 'compost', 'troc'] },
    { id: 'g5', name: 'Solar Pioneers', icon: '☀️', description: 'Installation solaire collective, partage d\'énergie entre voisins', members: 22, maxMembers: 30, level: 4, xp: 2800, xpNext: 4000, ecoScore: 612, rank: 5, challenges: 6, wins: 4, leader: 'SolarPioneer', region: 'Toulouse', tags: ['solaire', 'énergie', 'partage'] },
  ];
}

// --- Seasons & Events ---

export interface Season {
  id: string;
  name: string;
  theme: string;
  icon: string;
  startDate: string;
  endDate: string;
  active: boolean;
  rewards: { tier: string; reward: string; threshold: number }[];
}

export interface SeasonMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  ecoReward: number;
  progress: number;
  target: number;
  unit: string;
  category: string;
  expires: string;
  completed: boolean;
}

export function getCurrentSeason(): Season {
  return {
    id: 's3',
    name: 'Saison 3 — Été Vert',
    theme: 'Biodiversité & Eau',
    icon: '🌊',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    active: true,
    rewards: [
      { tier: 'Bronze', reward: '500 ECO + Badge Été Vert', threshold: 1000 },
      { tier: 'Argent', reward: '1500 ECO + NFT Exclusif', threshold: 3000 },
      { tier: 'Or', reward: '5000 ECO + Titre "Champion d\'Été"', threshold: 7000 },
      { tier: 'Diamant', reward: '15000 ECO + Accès VIP Saison 4', threshold: 15000 },
    ],
  };
}

export function getSeasonMissions(): SeasonMission[] {
  return [
    { id: 'sm1', title: 'Économiser 500L d\'eau', description: 'Réduisez votre consommation d\'eau cette semaine', xpReward: 200, ecoReward: 50, progress: 320, target: 500, unit: 'litres', category: 'water', expires: '2026-08-07', completed: false },
    { id: 'sm2', title: 'Planter 3 arbres', description: 'Participez à une action de plantation', xpReward: 500, ecoReward: 150, progress: 2, target: 3, unit: 'arbres', category: 'biodiversity', expires: '2026-08-15', completed: false },
    { id: 'sm3', title: 'Partager 10 mesures capteur', description: 'Contribuez des données environnementales', xpReward: 100, ecoReward: 30, progress: 10, target: 10, unit: 'mesures', category: 'data', expires: '2026-08-05', completed: true },
    { id: 'sm4', title: '7 jours sans voiture', description: 'Utilisez uniquement des transports verts', xpReward: 350, ecoReward: 100, progress: 5, target: 7, unit: 'jours', category: 'transport', expires: '2026-08-08', completed: false },
    { id: 'sm5', title: 'Recruter 2 membres guilde', description: 'Invitez des amis à rejoindre votre guilde', xpReward: 250, ecoReward: 75, progress: 1, target: 2, unit: 'membres', category: 'social', expires: '2026-08-10', completed: false },
  ];
}

// --- Carbon Credits ---

export interface CarbonCredit {
  id: string;
  title: string;
  type: 'reforestation' | 'renewable' | 'efficiency' | 'transport' | 'waste';
  tonnes: number;
  pricePerTonne: number;
  verified: boolean;
  verifier: string;
  origin: string;
  vintage: string;
  available: number;
  sold: number;
  rating: number;
}

export function getCarbonCredits(): CarbonCredit[] {
  return [
    { id: 'cc1', title: 'Reforestation Amazonie - Lot 2026', type: 'reforestation', tonnes: 500, pricePerTonne: 8, verified: true, verifier: 'Gold Standard', origin: 'Brésil', vintage: '2026', available: 320, sold: 180, rating: 4.9 },
    { id: 'cc2', title: 'Parc Éolien Offshore Bretagne', type: 'renewable', tonnes: 1200, pricePerTonne: 12, verified: true, verifier: 'VCS Verra', origin: 'France', vintage: '2026', available: 800, sold: 400, rating: 4.7 },
    { id: 'cc3', title: 'Efficacité Énergétique Bâtiments', type: 'efficiency', tonnes: 300, pricePerTonne: 6, verified: true, verifier: 'Plan Vivo', origin: 'France', vintage: '2025', available: 150, sold: 150, rating: 4.5 },
    { id: 'cc4', title: 'Mobilité Verte Urbaine Lyon', type: 'transport', tonnes: 200, pricePerTonne: 10, verified: true, verifier: 'Communauté DAO', origin: 'France', vintage: '2026', available: 180, sold: 20, rating: 4.3 },
    { id: 'cc5', title: 'Méthanisation Déchets Agricoles', type: 'waste', tonnes: 450, pricePerTonne: 7, verified: true, verifier: 'Gold Standard', origin: 'France', vintage: '2026', available: 300, sold: 150, rating: 4.6 },
  ];
}

export function getUserCarbonOffset(): { totalOffset: number; credits: number; rank: string } {
  return { totalOffset: 12.5, credits: 8, rank: 'Compensateur Argent' };
}