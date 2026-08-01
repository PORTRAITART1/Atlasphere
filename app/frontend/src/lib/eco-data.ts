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
    { id: '1', type: 'earn', amount: 25, currency: 'ECO', description: 'Données qualité air partagées', category: 'air', timestamp: '2026-07-31T08:30:00Z', status: 'completed' },
    { id: '2', type: 'earn', amount: 50, currency: 'ECO', description: 'Challenge transport vert complété', category: 'transport', timestamp: '2026-07-30T14:20:00Z', status: 'completed' },
    { id: '3', type: 'spend', amount: 100, currency: 'ECO', description: 'Achat dataset biodiversité', category: 'biodiversity', timestamp: '2026-07-29T10:15:00Z', status: 'completed' },
    { id: '4', type: 'reward', amount: 200, currency: 'ECO', description: 'Bonus streak 14 jours', category: 'energy', timestamp: '2026-07-28T09:00:00Z', status: 'completed' },
    { id: '5', type: 'earn', amount: 15, currency: 'ECO', description: 'Mesure CO2 domicile', category: 'energy', timestamp: '2026-07-27T16:45:00Z', status: 'completed' },
    { id: '6', type: 'transfer', amount: 5, currency: 'Pi', description: 'Abonnement Premium EcoChain', category: 'energy', timestamp: '2026-07-26T12:00:00Z', status: 'completed' },
    { id: '7', type: 'earn', amount: 30, currency: 'ECO', description: 'Rapport consommation eau', category: 'water', timestamp: '2026-07-25T11:30:00Z', status: 'completed' },
    { id: '8', type: 'earn', amount: 75, currency: 'ECO', description: 'Participation nettoyage quartier', category: 'waste', timestamp: '2026-07-24T15:00:00Z', status: 'completed' },
  ];
}

export function getEcoRewards(): EcoReward[] {
  return [
    { id: '1', title: 'Sentinelle de l\'Air', description: 'Partagez 10 mesures de qualité d\'air', ecoAmount: 50, icon: '🌬️', category: 'air', claimed: true, claimedAt: '2026-07-20' },
    { id: '2', title: 'Éco-Mobilité', description: 'Utilisez les transports verts 7 jours consécutifs', ecoAmount: 100, icon: '🚲', category: 'transport', claimed: true, claimedAt: '2026-07-18' },
    { id: '3', title: 'Gardien de l\'Eau', description: 'Réduisez votre consommation d\'eau de 20%', ecoAmount: 75, icon: '💧', category: 'water', claimed: false },
    { id: '4', title: 'Zéro Déchet', description: 'Recyclez 100% de vos déchets pendant 1 mois', ecoAmount: 200, icon: '♻️', category: 'waste', claimed: false },
    { id: '5', title: 'Énergie Verte', description: 'Réduisez votre empreinte carbone de 30%', ecoAmount: 150, icon: '⚡', category: 'energy', claimed: false },
    { id: '6', title: 'Bio-Diversité', description: 'Plantez 5 arbres ou plantes locales', ecoAmount: 120, icon: '🌳', category: 'biodiversity', claimed: false },
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
  if (totalEarned >= 10000) return { level: 'Légende Verte', icon: '🌍', nextThreshold: 20000 };
  if (totalEarned >= 5000) return { level: 'Éco-Champion', icon: '🏆', nextThreshold: 10000 };
  if (totalEarned >= 2000) return { level: 'Gardien Nature', icon: '🌿', nextThreshold: 5000 };
  if (totalEarned >= 500) return { level: 'Éco-Citoyen', icon: '🌱', nextThreshold: 2000 };
  return { level: 'Débutant Vert', icon: '🌾', nextThreshold: 500 };
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