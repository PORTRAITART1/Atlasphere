// Atlasphere Data Store

export type ProposalStatus = 'voting' | 'approved' | 'funding' | 'funded' | 'completed' | 'rejected';
export type Category = 'education' | 'commerce' | 'technology' | 'social' | 'environment';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: Category;
  status: ProposalStatus;
  author: string;
  authorAvatar: string;
  createdAt: string;
  deadline: string;
  votesFor: number;
  votesAgainst: number;
  totalVoters: number;
  fundingGoal: number;
  fundingRaised: number;
  contributors: number;
  comments: Comment[];
  milestones: Milestone[];
  team: TeamMember[];
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
  likes: number;
}

export interface Milestone {
  title: string;
  description: string;
  completed: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface UserVote {
  proposalId: string;
  vote: 'for' | 'against';
  date: string;
}

export interface UserContribution {
  proposalId: string;
  amount: number;
  date: string;
}

const proposals: Proposal[] = [
  {
    id: '1',
    title: 'Pi Academy - Éducation Blockchain Gratuite',
    description: 'Plateforme éducative gratuite pour enseigner la blockchain et la crypto aux Pionniers débutants dans 10 langues.',
    fullDescription: 'Pi Academy est un projet éducatif ambitieux visant à créer une plateforme d\'apprentissage complète et gratuite pour tous les Pionniers. Le programme couvre les fondamentaux de la blockchain, la sécurité crypto, le développement dApps, et l\'économie décentralisée. Disponible en 10 langues avec des certifications on-chain.',
    category: 'education',
    status: 'voting',
    author: 'EduPioneer',
    authorAvatar: '👨‍🏫',
    createdAt: '2026-05-10',
    deadline: '2026-06-10',
    votesFor: 1847,
    votesAgainst: 234,
    totalVoters: 2081,
    fundingGoal: 50000,
    fundingRaised: 0,
    contributors: 0,
    comments: [
      { id: 'c1', author: 'CryptoLearner', avatar: '📚', text: 'Excellent projet ! L\'éducation est la clé de l\'adoption.', date: '2026-05-12', likes: 45 },
      { id: 'c2', author: 'DevPioneer', avatar: '💻', text: 'Je propose d\'ajouter un module sur le développement Pi Apps.', date: '2026-05-14', likes: 32 },
    ],
    milestones: [
      { title: 'Curriculum Design', description: 'Conception du programme éducatif complet', completed: true },
      { title: 'Platform Development', description: 'Développement de la plateforme web', completed: false },
      { title: 'Content Creation', description: 'Création du contenu en 10 langues', completed: false },
      { title: 'Beta Launch', description: 'Lancement beta avec 1000 étudiants', completed: false },
    ],
    team: [
      { name: 'Dr. Sarah Chen', role: 'Lead Educator', avatar: '👩‍🔬' },
      { name: 'Marco Silva', role: 'Platform Dev', avatar: '👨‍💻' },
      { name: 'Aisha Noor', role: 'Content Manager', avatar: '✍️' },
    ],
  },
  {
    id: '2',
    title: 'PiHealth - Télémédecine Communautaire',
    description: 'Application de télémédecine payable en Pi pour les communautés rurales sans accès aux soins.',
    fullDescription: 'PiHealth connecte les patients des zones rurales avec des médecins qualifiés via des consultations vidéo payées en Pi. Le projet inclut un système de dossiers médicaux décentralisé, des prescriptions numériques, et un programme de prévention santé communautaire.',
    category: 'social',
    status: 'funding',
    author: 'HealthDAO',
    authorAvatar: '🏥',
    createdAt: '2026-04-20',
    deadline: '2026-05-30',
    votesFor: 3421,
    votesAgainst: 156,
    totalVoters: 3577,
    fundingGoal: 75000,
    fundingRaised: 52340,
    contributors: 847,
    comments: [
      { id: 'c3', author: 'DrMedic', avatar: '👨‍⚕️', text: 'En tant que médecin, je suis prêt à contribuer bénévolement.', date: '2026-04-22', likes: 89 },
      { id: 'c4', author: 'RuralPioneer', avatar: '🌾', text: 'Ma communauté a désespérément besoin de cela !', date: '2026-04-25', likes: 67 },
    ],
    milestones: [
      { title: 'Medical Network', description: 'Recrutement de 50 médecins', completed: true },
      { title: 'App Development', description: 'Développement de l\'application mobile', completed: true },
      { title: 'Pilot Program', description: 'Programme pilote dans 5 villages', completed: false },
      { title: 'Full Launch', description: 'Lancement dans 20 pays', completed: false },
    ],
    team: [
      { name: 'Dr. James Okafor', role: 'Medical Director', avatar: '👨‍⚕️' },
      { name: 'Lin Wei', role: 'Tech Lead', avatar: '🧑‍💻' },
      { name: 'Fatima Al-Hassan', role: 'Community Outreach', avatar: '🤝' },
    ],
  },
  {
    id: '3',
    title: 'GreenPi - Reforestation Tokenisée',
    description: 'Chaque Pi investi plante un arbre réel. Suivi par satellite et certificats NFT de propriété d\'arbres.',
    fullDescription: 'GreenPi combine la puissance de Pi Network avec la reforestation mondiale. Chaque contribution en Pi finance la plantation d\'arbres réels, suivis par satellite. Les contributeurs reçoivent des NFTs représentant leurs arbres avec des mises à jour de croissance en temps réel. Objectif : 1 million d\'arbres en 2 ans.',
    category: 'environment',
    status: 'approved',
    author: 'EcoChain',
    authorAvatar: '🌳',
    createdAt: '2026-05-01',
    deadline: '2026-07-01',
    votesFor: 5234,
    votesAgainst: 312,
    totalVoters: 5546,
    fundingGoal: 100000,
    fundingRaised: 0,
    contributors: 0,
    comments: [
      { id: 'c5', author: 'GreenWarrior', avatar: '🌿', text: 'Brillant ! Combiner crypto et écologie, c\'est l\'avenir.', date: '2026-05-03', likes: 124 },
    ],
    milestones: [
      { title: 'Partnership', description: 'Partenariats avec ONG de reforestation', completed: true },
      { title: 'Satellite Integration', description: 'Intégration du suivi satellite', completed: true },
      { title: 'NFT System', description: 'Système de certificats NFT', completed: false },
      { title: 'First Planting', description: 'Première campagne de plantation', completed: false },
    ],
    team: [
      { name: 'Maria Santos', role: 'Project Lead', avatar: '🌍' },
      { name: 'Raj Patel', role: 'Satellite Tech', avatar: '🛰️' },
      { name: 'Kwame Asante', role: 'Field Operations', avatar: '🌱' },
    ],
  },
  {
    id: '4',
    title: 'PiCommerce SDK - Outils pour Marchands',
    description: 'Kit de développement pour intégrer les paiements Pi dans n\'importe quelle boutique en ligne en 5 minutes.',
    fullDescription: 'PiCommerce SDK est un ensemble d\'outils plug-and-play permettant à tout commerçant d\'accepter Pi en moins de 5 minutes. Inclut des plugins pour Shopify, WooCommerce, et une API REST universelle. Le SDK gère automatiquement la conversion, les remboursements, et la comptabilité.',
    category: 'commerce',
    status: 'funded',
    author: 'CommerceDAO',
    authorAvatar: '🛍️',
    createdAt: '2026-03-15',
    deadline: '2026-05-15',
    votesFor: 4567,
    votesAgainst: 189,
    totalVoters: 4756,
    fundingGoal: 60000,
    fundingRaised: 60000,
    contributors: 1234,
    comments: [
      { id: 'c6', author: 'ShopOwner', avatar: '🏪', text: 'Exactement ce dont mon e-commerce a besoin !', date: '2026-03-18', likes: 78 },
    ],
    milestones: [
      { title: 'API Design', description: 'Conception de l\'API REST', completed: true },
      { title: 'Core SDK', description: 'Développement du SDK principal', completed: true },
      { title: 'Plugins', description: 'Plugins Shopify et WooCommerce', completed: true },
      { title: 'Documentation', description: 'Documentation et tutoriels', completed: false },
    ],
    team: [
      { name: 'Alex Turner', role: 'Lead Developer', avatar: '⚡' },
      { name: 'Yuki Tanaka', role: 'API Architect', avatar: '🏗️' },
    ],
  },
  {
    id: '5',
    title: 'PiMesh - Internet Décentralisé',
    description: 'Réseau mesh communautaire offrant internet gratuit dans les zones non-connectées, alimenté par Pi.',
    fullDescription: 'PiMesh crée un réseau internet décentralisé utilisant des nœuds mesh communautaires. Les Pionniers qui partagent leur bande passante sont récompensés en Pi. Les utilisateurs dans les zones sans internet peuvent se connecter gratuitement via le réseau mesh local.',
    category: 'technology',
    status: 'voting',
    author: 'MeshNet',
    authorAvatar: '📡',
    createdAt: '2026-05-18',
    deadline: '2026-06-18',
    votesFor: 892,
    votesAgainst: 445,
    totalVoters: 1337,
    fundingGoal: 120000,
    fundingRaised: 0,
    contributors: 0,
    comments: [
      { id: 'c7', author: 'TechVision', avatar: '🔮', text: 'Ambitieux mais nécessaire. Le vrai web3 !', date: '2026-05-19', likes: 56 },
      { id: 'c8', author: 'Skeptic42', avatar: '🤔', text: 'Comment garantir la qualité du réseau ?', date: '2026-05-20', likes: 34 },
    ],
    milestones: [
      { title: 'Hardware Design', description: 'Conception des nœuds mesh', completed: false },
      { title: 'Protocol', description: 'Protocole de communication P2P', completed: false },
      { title: 'Pilot City', description: 'Déploiement dans une ville pilote', completed: false },
      { title: 'Scale Up', description: 'Extension à 10 villes', completed: false },
    ],
    team: [
      { name: 'Ivan Petrov', role: 'Network Engineer', avatar: '🔧' },
      { name: 'Amara Diop', role: 'Hardware Lead', avatar: '🔌' },
      { name: 'Carlos Ruiz', role: 'Community Manager', avatar: '📢' },
    ],
  },
  {
    id: '6',
    title: 'PiKids - Éducation Financière pour Enfants',
    description: 'Jeu éducatif gamifié enseignant la gestion financière et la crypto aux enfants de 8-14 ans.',
    fullDescription: 'PiKids est un jeu éducatif qui enseigne les concepts financiers de base et la cryptomonnaie aux enfants à travers des aventures interactives. Les enfants gèrent une ville virtuelle, prennent des décisions économiques, et apprennent la valeur de l\'épargne et de l\'investissement.',
    category: 'education',
    status: 'completed',
    author: 'KidsFinance',
    authorAvatar: '🎮',
    createdAt: '2026-01-10',
    deadline: '2026-04-10',
    votesFor: 6789,
    votesAgainst: 123,
    totalVoters: 6912,
    fundingGoal: 35000,
    fundingRaised: 35000,
    contributors: 2156,
    comments: [
      { id: 'c9', author: 'ParentPioneer', avatar: '👨‍👧', text: 'Mes enfants adorent ! Ils comprennent enfin la crypto.', date: '2026-04-15', likes: 234 },
    ],
    milestones: [
      { title: 'Game Design', description: 'Conception du jeu et des niveaux', completed: true },
      { title: 'Development', description: 'Développement complet du jeu', completed: true },
      { title: 'Testing', description: 'Tests avec 500 enfants', completed: true },
      { title: 'Launch', description: 'Lancement mondial', completed: true },
    ],
    team: [
      { name: 'Sophie Martin', role: 'Game Designer', avatar: '🎨' },
      { name: 'David Kim', role: 'Developer', avatar: '👨‍💻' },
    ],
  },
];

const userVotes: UserVote[] = [
  { proposalId: '1', vote: 'for', date: '2026-05-11' },
  { proposalId: '2', vote: 'for', date: '2026-04-21' },
  { proposalId: '3', vote: 'for', date: '2026-05-02' },
  { proposalId: '5', vote: 'against', date: '2026-05-19' },
];

const userContributions: UserContribution[] = [
  { proposalId: '2', amount: 150, date: '2026-04-25' },
  { proposalId: '4', amount: 75, date: '2026-03-20' },
  { proposalId: '6', amount: 50, date: '2026-02-15' },
];

export function getProposals(): Proposal[] {
  return proposals;
}

export function getProposalById(id: string): Proposal | undefined {
  return proposals.find((p) => p.id === id);
}

export function getProposalsByStatus(status: ProposalStatus): Proposal[] {
  return proposals.filter((p) => p.status === status);
}

export function getProposalsByCategory(category: Category): Proposal[] {
  return proposals.filter((p) => p.category === category);
}

export function getUserVotes(): UserVote[] {
  return userVotes;
}

export function getUserContributions(): UserContribution[] {
  return userContributions;
}

export function getCategoryLabel(cat: Category): string {
  const labels: Record<Category, string> = {
    education: '📚 Éducation',
    commerce: '🛍️ Commerce',
    technology: '💻 Technologie',
    social: '🤝 Social',
    environment: '🌍 Environnement',
  };
  return labels[cat];
}

export function getStatusLabel(status: ProposalStatus): string {
  const labels: Record<ProposalStatus, string> = {
    voting: '🗳️ En Vote',
    approved: '✅ Approuvé',
    funding: '💰 En Financement',
    funded: '🎉 Financé',
    completed: '🏆 Terminé',
    rejected: '❌ Rejeté',
  };
  return labels[status];
}

export function getStatusColor(status: ProposalStatus): string {
  const colors: Record<ProposalStatus, string> = {
    voting: 'bg-purple-100 text-purple-800',
    approved: 'bg-emerald-100 text-emerald-800',
    funding: 'bg-amber-100 text-amber-800',
    funded: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status];
}

export function getPlatformStats() {
  return {
    totalPioneers: 47832,
    totalProposals: proposals.length,
    totalFunded: proposals.filter((p) => p.status === 'funded' || p.status === 'completed').length,
    totalPiInvested: proposals.reduce((sum, p) => sum + p.fundingRaised, 0),
    totalVotesCast: proposals.reduce((sum, p) => sum + p.totalVoters, 0),
  };
}