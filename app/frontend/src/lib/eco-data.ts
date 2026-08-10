// EcoChain AI - Data layer for environmental features in Atlasphere
// Manages ECO tokens, climate data, marketplace, and rewards

import { getCurrentUser } from '@/lib/pi-sdk';

// --- Types ---

export interface EcoTransaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer' | 'reward';
  amount: number;
  currency: 'ECO' | 'Pi';
  description: string;
  category: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface EcoReward {
  id: string;
  title: string;
  description: string;
  ecoAmount: number;
  icon: string;
  category: 'air' | 'energy' | 'transport' | 'waste' | 'water' | 'biodiversity';
  claimed: boolean;
  claimedAt?: string;
}

export interface ClimateData {
  airQualityIndex: number; // 0-500
  co2Level: number; // ppm
  temperature: number; // °C
  humidity: number; // %
  uvIndex: number;
  pollenLevel: 'low' | 'medium' | 'high';
  waterQuality: number; // 0-100
  noiseLevel: number; // dB
}

export interface EcoScore {
  total: number; // 0-1000
  breakdown: {
    transport: number;
    energy: number;
    waste: number;
    food: number;
    water: number;
  };
  rank: string;
  percentile: number;
}

export interface ClimateHistory {
  date: string;
  airQuality: number;
  co2: number;
  temperature: number;
}

export interface MarketDataset {
  id: string;
  title: string;
  description: string;
  category: 'air' | 'water' | 'energy' | 'biodiversity' | 'climate' | 'soil';
  provider: string;
  dataPoints: number;
  price: number; // in Pi
  rating: number;
  downloads: number;
  region: string;
  lastUpdated: string;
  tags: string[];
}

export interface ClimatePrediction {
  id: string;
  type: 'flood' | 'heatwave' | 'drought' | 'storm' | 'pollution' | 'cold';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  region: string;
  recommendations: string[];
  generatedAt: string;
}

// --- Mock Data Generators ---

export function getEcoBalance(): { eco: number; pi: number; totalEarned: number; streak: number } {
  return {
    eco: 2847.5,
    pi: getCurrentUser()?.piBalance || 1247.5,
    totalEarned: 5420,
    streak: 14,
  };
}

export function getEcoTransactions(): EcoTransaction[] {
  return [
    { id: '1', type: 'earn', amount: 25, currency: 'ECO', description: 'ecowallet.tx.air_data_shared', category: 'air', timestamp: '2026-07-31T08:30:00Z', status: 'completed' },
    { id: '2', type: 'earn', amount: 50, currency: 'ECO', description: 'ecowallet.tx.green_transport', category: 'transport', timestamp: '2026-07-30T14:20:00Z', status: 'completed' },
    { id: '3', type: 'spend', amount: 100, currency: 'ECO', description: 'ecowallet.tx.buy_biodiversity', category: 'biodiversity', timestamp: '2026-07-29T10:15:00Z', status: 'completed' },
    { id: '4', type: 'reward', amount: 200, currency: 'ECO', description: 'ecowallet.tx.streak_bonus', category: 'energy', timestamp: '2026-07-28T09:00:00Z', status: 'completed' },
    { id: '5', type: 'earn', amount: 15, currency: 'ECO', description: 'ecowallet.tx.co2_home', category: 'energy', timestamp: '2026-07-27T16:45:00Z', status: 'completed' },
    { id: '6', type: 'transfer', amount: 5, currency: 'Pi', description: 'ecowallet.tx.premium_sub', category: 'energy', timestamp: '2026-07-26T12:00:00Z', status: 'completed' },
    { id: '7', type: 'earn', amount: 30, currency: 'ECO', description: 'ecowallet.tx.water_report', category: 'water', timestamp: '2026-07-25T11:30:00Z', status: 'completed' },
    { id: '8', type: 'earn', amount: 75, currency: 'ECO', description: 'ecowallet.tx.neighborhood_cleanup', category: 'waste', timestamp: '2026-07-24T15:00:00Z', status: 'completed' },
  ];
}

export function getEcoRewards(): EcoReward[] {
  return [
    { id: '1', title: 'ecowallet.reward.air_sentinel', description: 'ecowallet.reward.air_sentinel_desc', ecoAmount: 50, icon: '🌬️', category: 'air', claimed: true, claimedAt: '2026-07-20' },
    { id: '2', title: 'ecowallet.reward.eco_mobility', description: 'ecowallet.reward.eco_mobility_desc', ecoAmount: 100, icon: '🚲', category: 'transport', claimed: true, claimedAt: '2026-07-18' },
    { id: '3', title: 'ecowallet.reward.water_guardian', description: 'ecowallet.reward.water_guardian_desc', ecoAmount: 75, icon: '💧', category: 'water', claimed: false },
    { id: '4', title: 'ecowallet.reward.zero_waste', description: 'ecowallet.reward.zero_waste_desc', ecoAmount: 200, icon: '♻️', category: 'waste', claimed: false },
    { id: '5', title: 'ecowallet.reward.green_energy', description: 'ecowallet.reward.green_energy_desc', ecoAmount: 150, icon: '⚡', category: 'energy', claimed: false },
    { id: '6', title: 'ecowallet.reward.biodiversity', description: 'ecowallet.reward.biodiversity_desc', ecoAmount: 120, icon: '🌳', category: 'biodiversity', claimed: false },
  ];
}

export function getClimateData(): ClimateData {
  return {
    airQualityIndex: 42,
    co2Level: 415,
    temperature: 28.5,
    humidity: 65,
    uvIndex: 7,
    pollenLevel: 'medium',
    waterQuality: 82,
    noiseLevel: 55,
  };
}

export function getEcoScore(): EcoScore {
  return {
    total: 742,
    breakdown: {
      transport: 85,
      energy: 72,
      waste: 90,
      food: 68,
      water: 78,
    },
    rank: 'Éco-Champion',
    percentile: 88,
  };
}

export function getClimateHistory(): ClimateHistory[] {
  const history: ClimateHistory[] = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      airQuality: Math.floor(30 + Math.random() * 60),
      co2: Math.floor(390 + Math.random() * 50),
      temperature: Math.round((22 + Math.random() * 12) * 10) / 10,
    });
  }
  return history;
}

export function getMarketDatasets(): MarketDataset[] {
  return [
    { id: '1', title: 'Qualité de l\'Air - Paris Métropole', description: 'Données PM2.5, PM10, NO2, O3 collectées par 500+ capteurs citoyens sur 12 mois', category: 'air', provider: 'EcoSensors Paris', dataPoints: 2400000, price: 15, rating: 4.8, downloads: 342, region: 'Île-de-France', lastUpdated: '2026-07-30', tags: ['PM2.5', 'NO2', 'urbain', 'temps réel'] },
    { id: '2', title: 'Biodiversité Marine - Méditerranée', description: 'Inventaire espèces marines, température eau, salinité - 6 mois de données', category: 'biodiversity', provider: 'OceanWatch Med', dataPoints: 850000, price: 25, rating: 4.6, downloads: 128, region: 'Méditerranée', lastUpdated: '2026-07-28', tags: ['marine', 'espèces', 'température'] },
    { id: '3', title: 'Consommation Énergétique Résidentielle', description: 'Données anonymisées de 10 000 foyers - consommation électrique et gaz', category: 'energy', provider: 'GreenHome Analytics', dataPoints: 5600000, price: 30, rating: 4.9, downloads: 567, region: 'France entière', lastUpdated: '2026-07-31', tags: ['électricité', 'gaz', 'résidentiel', 'smart meter'] },
    { id: '4', title: 'Qualité des Eaux Souterraines - Sahel', description: 'Analyses chimiques et bactériologiques de 200 puits au Sahel', category: 'water', provider: 'AquaData Africa', dataPoints: 120000, price: 10, rating: 4.4, downloads: 89, region: 'Afrique de l\'Ouest', lastUpdated: '2026-07-25', tags: ['souterrain', 'chimique', 'Sahel'] },
    { id: '5', title: 'Émissions CO2 Transport Urbain', description: 'Données GPS + émissions de 5000 véhicules en zone urbaine dense', category: 'climate', provider: 'MobilityTrack', dataPoints: 3200000, price: 20, rating: 4.7, downloads: 234, region: 'Lyon, Marseille, Toulouse', lastUpdated: '2026-07-29', tags: ['CO2', 'transport', 'GPS', 'urbain'] },
    { id: '6', title: 'Santé des Sols Agricoles - Beauce', description: 'Analyses NPK, pH, matière organique sur 500 parcelles agricoles', category: 'soil', provider: 'AgriSoil Lab', dataPoints: 450000, price: 18, rating: 4.5, downloads: 156, region: 'Centre-Val de Loire', lastUpdated: '2026-07-27', tags: ['sol', 'agriculture', 'NPK', 'pH'] },
  ];
}

export function getClimatePredictions(): ClimatePrediction[] {
  return [
    { id: '1', type: 'heatwave', severity: 'high', title: 'Vague de chaleur prévue', description: 'Températures supérieures à 38°C attendues pendant 5 jours consécutifs dans votre région.', probability: 0.82, timeframe: '3-8 août 2026', region: 'Sud de la France', recommendations: ['Hydratez-vous régulièrement', 'Évitez les activités extérieures entre 12h et 16h', 'Vérifiez vos voisins âgés', 'Utilisez des ventilateurs ou climatisation'], generatedAt: '2026-07-31T06:00:00Z' },
    { id: '2', type: 'pollution', severity: 'medium', title: 'Pic de pollution atmosphérique', description: 'Concentration élevée de PM2.5 et d\'ozone prévue due à la stagnation atmosphérique.', probability: 0.68, timeframe: '1-3 août 2026', region: 'Île-de-France', recommendations: ['Limitez les activités sportives en extérieur', 'Privilégiez les transports en commun', 'Fermez les fenêtres aux heures de pointe'], generatedAt: '2026-07-31T06:00:00Z' },
    { id: '3', type: 'storm', severity: 'medium', title: 'Orages violents possibles', description: 'Système orageux en formation avec risque de grêle et vents forts (>80 km/h).', probability: 0.55, timeframe: '5 août 2026', region: 'Massif Central', recommendations: ['Sécurisez les objets extérieurs', 'Évitez les zones boisées', 'Préparez un kit d\'urgence'], generatedAt: '2026-07-31T06:00:00Z' },
    { id: '4', type: 'drought', severity: 'high', title: 'Sécheresse prolongée', description: 'Déficit hydrique critique attendu. Les nappes phréatiques sont à 60% sous la normale saisonnière.', probability: 0.91, timeframe: 'Août-Septembre 2026', region: 'Sud-Ouest', recommendations: ['Réduisez votre consommation d\'eau de 30%', 'Arrosez uniquement le soir', 'Signalez les fuites d\'eau', 'Collectez l\'eau de pluie'], generatedAt: '2026-07-31T06:00:00Z' },
  ];
}

// --- ECO Token utilities ---

export function formatEco(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(amount);
}

export function getEcoLevel(totalEarned: number): { level: string; icon: string; nextThreshold: number } {
  if (totalEarned >= 10000) return { level: 'ecowallet.level.green_legend', icon: '🌍', nextThreshold: 20000 };
  if (totalEarned >= 5000) return { level: 'ecowallet.level.eco_champion', icon: '🏆', nextThreshold: 10000 };
  if (totalEarned >= 2000) return { level: 'ecowallet.level.nature_guardian', icon: '🌿', nextThreshold: 5000 };
  if (totalEarned >= 500) return { level: 'ecowallet.level.eco_citizen', icon: '🌱', nextThreshold: 2000 };
  return { level: 'ecowallet.level.green_beginner', icon: '🌾', nextThreshold: 500 };
}

export function getAirQualityLabel(aqi: number): { label: string; color: string; emoji: string } {
  if (aqi <= 50) return { label: 'Bon', color: 'text-green-400', emoji: '😊' };
  if (aqi <= 100) return { label: 'Modéré', color: 'text-yellow-400', emoji: '😐' };
  if (aqi <= 150) return { label: 'Mauvais pour sensibles', color: 'text-orange-400', emoji: '😷' };
  if (aqi <= 200) return { label: 'Mauvais', color: 'text-red-400', emoji: '🤢' };
  return { label: 'Dangereux', color: 'text-purple-400', emoji: '☠️' };
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
}

// --- IoT Sensors & Data Collection ---

export interface IoTSensor {
  id: string;
  name: string;
  type: 'air_quality' | 'energy' | 'water' | 'temperature' | 'noise' | 'solar';
  status: 'active' | 'inactive' | 'paused';
  lastReading: string;
  dataPoints: number;
  ecoEarned: number;
  location: string;
  accuracy: number;
}

export function getIoTSensors(): IoTSensor[] {
  return [
    { id: 's1', name: 'Capteur Air Salon', type: 'air_quality', status: 'active', lastReading: '2026-08-01T10:30:00Z', dataPoints: 12480, ecoEarned: 312, location: 'Domicile', accuracy: 94 },
    { id: 's2', name: 'Compteur Énergie', type: 'energy', status: 'active', lastReading: '2026-08-01T10:29:00Z', dataPoints: 8640, ecoEarned: 216, location: 'Domicile', accuracy: 98 },
    { id: 's3', name: 'Sonde Eau Jardin', type: 'water', status: 'active', lastReading: '2026-08-01T09:00:00Z', dataPoints: 4320, ecoEarned: 108, location: 'Jardin', accuracy: 91 },
    { id: 's4', name: 'Thermomètre Extérieur', type: 'temperature', status: 'paused', lastReading: '2026-07-30T18:00:00Z', dataPoints: 6720, ecoEarned: 168, location: 'Balcon', accuracy: 96 },
    { id: 's5', name: 'Panneau Solaire', type: 'solar', status: 'active', lastReading: '2026-08-01T10:28:00Z', dataPoints: 5040, ecoEarned: 252, location: 'Toit', accuracy: 99 },
  ];
}

export interface DataContribution {
  id: string;
  sensorId: string;
  dataPoints: number;
  anonymized: boolean;
  sharedAt: string;
  ecoReward: number;
  buyer?: string;
}

export function getDataContributions(): DataContribution[] {
  return [
    { id: 'dc1', sensorId: 's1', dataPoints: 2880, anonymized: true, sharedAt: '2026-07-31T00:00:00Z', ecoReward: 72, buyer: 'EcoSensors Paris' },
    { id: 'dc2', sensorId: 's2', dataPoints: 1440, anonymized: true, sharedAt: '2026-07-30T00:00:00Z', ecoReward: 36 },
    { id: 'dc3', sensorId: 's3', dataPoints: 720, anonymized: true, sharedAt: '2026-07-29T00:00:00Z', ecoReward: 18, buyer: 'AquaData Africa' },
    { id: 'dc4', sensorId: 's5', dataPoints: 1440, anonymized: true, sharedAt: '2026-07-28T00:00:00Z', ecoReward: 72, buyer: 'GreenHome Analytics' },
  ];
}

// --- Lifestyle Optimizer ---

export interface LifestyleRecommendation {
  id: string;
  category: 'transport' | 'energy' | 'food' | 'waste' | 'water';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  ecoSaving: number; // kg CO2 per month
  difficulty: 'easy' | 'medium' | 'hard';
  adopted: boolean;
  progress: number; // 0-100
}

export function getLifestyleRecommendations(): LifestyleRecommendation[] {
  return [
    { id: 'lr1', category: 'transport', title: 'Vélo pour trajets < 5km', description: 'Remplacez la voiture par le vélo pour les trajets courts. Économisez 2.6 kg CO2 par trajet.', impact: 'high', ecoSaving: 52, difficulty: 'medium', adopted: true, progress: 78 },
    { id: 'lr2', category: 'energy', title: 'Éteindre les appareils en veille', description: 'Les appareils en veille consomment 10% de votre électricité. Utilisez des multiprises avec interrupteur.', impact: 'medium', ecoSaving: 15, difficulty: 'easy', adopted: true, progress: 90 },
    { id: 'lr3', category: 'food', title: 'Réduire la viande rouge à 1x/semaine', description: 'La production de bœuf émet 27 kg CO2/kg. Remplacez par des légumineuses ou du poulet.', impact: 'high', ecoSaving: 40, difficulty: 'medium', adopted: false, progress: 35 },
    { id: 'lr4', category: 'waste', title: 'Compostage des déchets organiques', description: 'Compostez vos épluchures et restes alimentaires. Réduit les déchets de 30%.', impact: 'medium', ecoSaving: 12, difficulty: 'easy', adopted: true, progress: 100 },
    { id: 'lr5', category: 'water', title: 'Douche de 5 minutes max', description: 'Réduisez votre temps de douche. Économisez 60L d\'eau par douche raccourcie.', impact: 'medium', ecoSaving: 8, difficulty: 'easy', adopted: false, progress: 50 },
    { id: 'lr6', category: 'transport', title: 'Covoiturage domicile-travail', description: 'Partagez vos trajets avec des collègues. Divisez votre empreinte par 2 à 4.', impact: 'high', ecoSaving: 65, difficulty: 'medium', adopted: false, progress: 20 },
    { id: 'lr7', category: 'energy', title: 'Thermostat intelligent (-2°C)', description: 'Baissez le chauffage de 2°C. Économisez 14% sur votre facture et 300 kg CO2/an.', impact: 'high', ecoSaving: 25, difficulty: 'easy', adopted: true, progress: 100 },
    { id: 'lr8', category: 'food', title: 'Acheter local et de saison', description: 'Les produits importés parcourent en moyenne 3000 km. Privilégiez les circuits courts.', impact: 'medium', ecoSaving: 18, difficulty: 'medium', adopted: false, progress: 45 },
  ];
}

export interface WeeklyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: 'transport' | 'energy' | 'food' | 'waste' | 'water';
  ecoReward: number;
}

export function getWeeklyGoals(): WeeklyGoal[] {
  return [
    { id: 'wg1', title: 'Km en vélo', target: 30, current: 22, unit: 'km', category: 'transport', ecoReward: 50 },
    { id: 'wg2', title: 'Repas végétariens', target: 5, current: 3, unit: 'repas', category: 'food', ecoReward: 30 },
    { id: 'wg3', title: 'Jours sans voiture', target: 4, current: 4, unit: 'jours', category: 'transport', ecoReward: 40 },
    { id: 'wg4', title: 'Litres d\'eau économisés', target: 200, current: 145, unit: 'L', category: 'water', ecoReward: 25 },
  ];
}

// --- Leaderboard ---

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  ecoScore: number;
  region: string;
  badges: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export function getLeaderboard(region?: string): LeaderboardEntry[] {
  const all: LeaderboardEntry[] = [
    { rank: 1, username: 'GreenMaster', avatar: '🌍', ecoScore: 982, region: 'Paris', badges: 18, trend: 'stable', trendValue: 0 },
    { rank: 2, username: 'EcoWarrior42', avatar: '🌿', ecoScore: 956, region: 'Lyon', badges: 15, trend: 'up', trendValue: 3 },
    { rank: 3, username: 'SolarPioneer', avatar: '☀️', ecoScore: 934, region: 'Marseille', badges: 14, trend: 'up', trendValue: 1 },
    { rank: 4, username: 'BikeCommuter', avatar: '🚲', ecoScore: 912, region: 'Paris', badges: 12, trend: 'down', trendValue: 2 },
    { rank: 5, username: 'ZeroWasteLife', avatar: '♻️', ecoScore: 898, region: 'Bordeaux', badges: 13, trend: 'up', trendValue: 5 },
    { rank: 6, username: 'pioneer_dao', avatar: '🧑', ecoScore: 742, region: 'Paris', badges: 10, trend: 'up', trendValue: 8 },
    { rank: 7, username: 'OceanGuard', avatar: '🐋', ecoScore: 728, region: 'Nice', badges: 9, trend: 'stable', trendValue: 0 },
    { rank: 8, username: 'TreeHugger', avatar: '🌳', ecoScore: 715, region: 'Toulouse', badges: 11, trend: 'down', trendValue: 1 },
    { rank: 9, username: 'CleanAirFan', avatar: '🌬️', ecoScore: 698, region: 'Lille', badges: 8, trend: 'up', trendValue: 4 },
    { rank: 10, username: 'EcoNovice', avatar: '🌱', ecoScore: 650, region: 'Nantes', badges: 6, trend: 'up', trendValue: 12 },
  ];
  if (region && region !== 'all') return all.filter((e) => e.region.toLowerCase().includes(region.toLowerCase()));
  return all;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  target: number;
  current: number;
  unit: string;
  endsAt: string;
  reward: number;
  category: string;
}

export function getCommunityChallenge(): CommunityChallenge[] {
  return [
    { id: 'cc1', title: 'Défi Zéro Voiture Août', description: 'Collectivement, parcourons 100 000 km sans voiture ce mois-ci !', participants: 2847, target: 100000, current: 67500, unit: 'km', endsAt: '2026-08-31', reward: 500, category: 'transport' },
    { id: 'cc2', title: 'Plantation Communautaire', description: 'Plantons 10 000 arbres ensemble avant la fin de l\'été', participants: 1523, target: 10000, current: 7820, unit: 'arbres', endsAt: '2026-09-21', reward: 300, category: 'biodiversity' },
    { id: 'cc3', title: 'Économie d\'Eau Collective', description: 'Économisons 1 million de litres d\'eau en août', participants: 4210, target: 1000000, current: 420000, unit: 'litres', endsAt: '2026-08-31', reward: 200, category: 'water' },
  ];
}

// --- Premium Plans ---

export interface PremiumPlan {
  id: string;
  name: string;
  price: number; // Pi/month
  features: string[];
  popular: boolean;
  current: boolean;
}

export function getPremiumPlans(): PremiumPlan[] {
  return [
    { id: 'free', name: 'Gratuit', price: 0, features: ['Score écologique de base', 'Prédictions météo simples', '3 capteurs max', 'Leaderboard lecture seule', 'Récompenses ECO standard'], popular: false, current: true },
    { id: 'pro', name: 'Pro', price: 10, features: ['Analyses IA avancées', 'Prédictions détaillées 30 jours', 'Capteurs illimités', 'Lifestyle Optimizer personnalisé', 'Accès prioritaire EcoMarket', 'Badge Pro exclusif', 'Support prioritaire'], popular: true, current: false },
    { id: 'enterprise', name: 'Entreprise', price: 50, features: ['API accès complet', 'Données agrégées en temps réel', 'Dashboard personnalisé', 'Rapports mensuels PDF', 'Intégration IoT avancée', 'Account manager dédié', 'SLA 99.9%', 'Audit conformité RGPD'], popular: false, current: false },
  ];
}