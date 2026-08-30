// Atlasphere Data Store — all user-facing text is stored as i18n keys and
// resolved through t() at read time, so every locale renders natively.
import { t } from './i18n';

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

/** Build a milestone from a reusable i18n slug (ms.<slug>.t / ms.<slug>.d). */
function ms(slug: string, completed: boolean): Milestone {
  return { title: `ms.${slug}.t`, description: `ms.${slug}.d`, completed };
}

const proposals: Proposal[] = [
  {
    id: '1',
    title: 'p1.t',
    description: 'p1.d',
    fullDescription: 'p1.f',
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
      { id: 'c1', author: 'CryptoLearner', avatar: '📚', text: 'Education is the key to real adoption. Great initiative!', date: '2026-05-12', likes: 45 },
      { id: 'c2', author: 'DevPioneer', avatar: '💻', text: 'Please add a dedicated module on building Pi Apps.', date: '2026-05-14', likes: 32 },
    ],
    milestones: [ms('research', true), ms('build', false), ms('content', false), ms('launch', false)],
    team: [
      { name: 'Dr. Sarah Chen', role: 'Lead Educator', avatar: '👩‍🔬' },
      { name: 'Marco Silva', role: 'Platform Dev', avatar: '👨‍💻' },
      { name: 'Aisha Noor', role: 'Content Manager', avatar: '✍️' },
    ],
  },
  {
    id: '2',
    title: 'p2.t',
    description: 'p2.d',
    fullDescription: 'p2.f',
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
      { id: 'c3', author: 'DrMedic', avatar: '👨‍⚕️', text: 'As a physician I am ready to volunteer consultation hours.', date: '2026-04-22', likes: 89 },
      { id: 'c4', author: 'RuralPioneer', avatar: '🌾', text: 'My community desperately needs this service.', date: '2026-04-25', likes: 67 },
    ],
    milestones: [ms('partners', true), ms('build', true), ms('pilot', false), ms('scale', false)],
    team: [
      { name: 'Dr. James Okafor', role: 'Medical Director', avatar: '👨‍⚕️' },
      { name: 'Lin Wei', role: 'Tech Lead', avatar: '🧑‍💻' },
      { name: 'Fatima Al-Hassan', role: 'Community Outreach', avatar: '🤝' },
    ],
  },
  {
    id: '3',
    title: 'p3.t',
    description: 'p3.d',
    fullDescription: 'p3.f',
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
      { id: 'c5', author: 'GreenWarrior', avatar: '🌿', text: 'Combining crypto with real ecology is the way forward.', date: '2026-05-03', likes: 124 },
    ],
    milestones: [ms('partners', true), ms('integration', true), ms('build', false), ms('launch', false)],
    team: [
      { name: 'Maria Santos', role: 'Project Lead', avatar: '🌍' },
      { name: 'Raj Patel', role: 'Satellite Tech', avatar: '🛰️' },
      { name: 'Kwame Asante', role: 'Field Operations', avatar: '🌱' },
    ],
  },
  {
    id: '4',
    title: 'p4.t',
    description: 'p4.d',
    fullDescription: 'p4.f',
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
      { id: 'c6', author: 'ShopOwner', avatar: '🏪', text: 'Exactly what my online store needs to accept Pi.', date: '2026-03-18', likes: 78 },
    ],
    milestones: [ms('research', true), ms('build', true), ms('integration', true), ms('docs', false)],
    team: [
      { name: 'Alex Turner', role: 'Lead Developer', avatar: '⚡' },
      { name: 'Yuki Tanaka', role: 'API Architect', avatar: '🏗️' },
    ],
  },
  {
    id: '5',
    title: 'p5.t',
    description: 'p5.d',
    fullDescription: 'p5.f',
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
      { id: 'c7', author: 'TechVision', avatar: '🔮', text: 'Ambitious but necessary. This is real web3 infrastructure.', date: '2026-05-19', likes: 56 },
      { id: 'c8', author: 'Skeptic42', avatar: '🤔', text: 'How do you guarantee network quality at scale?', date: '2026-05-20', likes: 34 },
    ],
    milestones: [ms('research', false), ms('build', false), ms('pilot', false), ms('scale', false)],
    team: [
      { name: 'Ivan Petrov', role: 'Network Engineer', avatar: '🔧' },
      { name: 'Amara Diop', role: 'Hardware Lead', avatar: '🔌' },
      { name: 'Carlos Ruiz', role: 'Community Manager', avatar: '📢' },
    ],
  },
  {
    id: '6',
    title: 'p6.t',
    description: 'p6.d',
    fullDescription: 'p6.f',
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
      { id: 'c9', author: 'ParentPioneer', avatar: '👨‍👧', text: 'My kids love it and finally understand crypto basics.', date: '2026-04-15', likes: 234 },
    ],
    milestones: [ms('research', true), ms('build', true), ms('testing', true), ms('launch', true)],
    team: [
      { name: 'Sophie Martin', role: 'Game Designer', avatar: '🎨' },
      { name: 'David Kim', role: 'Developer', avatar: '👨‍💻' },
    ],
  },
  {
    id: '7',
    title: 'p7.t',
    description: 'p7.d',
    fullDescription: 'p7.f',
    category: 'commerce',
    status: 'voting',
    author: 'RemitDAO',
    authorAvatar: '💸',
    createdAt: '2026-08-04',
    deadline: '2026-09-04',
    votesFor: 7248,
    votesAgainst: 412,
    totalVoters: 7660,
    fundingGoal: 180000,
    fundingRaised: 0,
    contributors: 0,
    comments: [
      { id: 'c10', author: 'DiasporaPi', avatar: '🌍', text: 'I pay 8% in fees every month. A 1% Pi corridor changes everything.', date: '2026-08-06', likes: 312 },
      { id: 'c11', author: 'AgentLagos', avatar: '🏦', text: 'Ready to become a cash-out agent and stake Pi as guarantee.', date: '2026-08-09', likes: 187 },
    ],
    milestones: [ms('compliance', true), ms('build', false), ms('audit', false), ms('pilot', false), ms('scale', false)],
    team: [
      { name: 'Nadia Haddad', role: 'Payments Lead', avatar: '💱' },
      { name: 'Emeka Obi', role: 'Agent Network', avatar: '🤝' },
      { name: 'Sofia Rossi', role: 'Compliance Officer', avatar: '⚖️' },
    ],
  },
  {
    id: '8',
    title: 'p8.t',
    description: 'p8.d',
    fullDescription: 'p8.f',
    category: 'commerce',
    status: 'voting',
    author: 'CreditGuild',
    authorAvatar: '📊',
    createdAt: '2026-08-11',
    deadline: '2026-09-11',
    votesFor: 5906,
    votesAgainst: 1180,
    totalVoters: 7086,
    fundingGoal: 150000,
    fundingRaised: 0,
    contributors: 0,
    comments: [
      { id: 'c12', author: 'MarketSeller', avatar: '🧺', text: 'No bank will lend me 200 Pi of stock. My reputation should count.', date: '2026-08-13', likes: 264 },
      { id: 'c13', author: 'RiskAnalyst', avatar: '📉', text: 'Please publish the default model before the funding round opens.', date: '2026-08-15', likes: 141 },
    ],
    milestones: [ms('research', true), ms('build', false), ms('audit', false), ms('pilot', false), ms('scale', false)],
    team: [
      { name: 'Priya Nair', role: 'Credit Scoring', avatar: '🧮' },
      { name: 'Tomás Herrera', role: 'Smart Contracts', avatar: '⛓️' },
      { name: 'Grace Mwangi', role: 'Merchant Success', avatar: '🛒' },
    ],
  },
  {
    id: '9',
    title: 'p9.t',
    description: 'p9.d',
    fullDescription: 'p9.f',
    category: 'technology',
    status: 'funding',
    author: 'VaultDAO',
    authorAvatar: '🏛️',
    createdAt: '2026-07-02',
    deadline: '2026-09-30',
    votesFor: 8134,
    votesAgainst: 526,
    totalVoters: 8660,
    fundingGoal: 250000,
    fundingRaised: 118750,
    contributors: 2043,
    comments: [
      { id: 'c14', author: 'SolarInvestor', avatar: '☀️', text: 'Fractional solar revenue paid in Pi is a genuine yield source.', date: '2026-07-05', likes: 298 },
      { id: 'c15', author: 'AuditFirst', avatar: '🔍', text: 'Third-party asset audits must be public for every vault.', date: '2026-07-11', likes: 176 },
    ],
    milestones: [ms('compliance', true), ms('partners', true), ms('build', false), ms('audit', false), ms('launch', false)],
    team: [
      { name: 'Hassan Karim', role: 'Asset Manager', avatar: '🏗️' },
      { name: 'Elena Novak', role: 'Tokenization Lead', avatar: '🪙' },
      { name: 'Daniel Owusu', role: 'IoT Monitoring', avatar: '📡' },
    ],
  },
  {
    id: '10',
    title: 'p10.t',
    description: 'p10.d',
    fullDescription: 'p10.f',
    category: 'environment',
    status: 'approved',
    author: 'GridPioneers',
    authorAvatar: '⚡',
    createdAt: '2026-06-18',
    deadline: '2026-08-18',
    votesFor: 9412,
    votesAgainst: 388,
    totalVoters: 9800,
    fundingGoal: 200000,
    fundingRaised: 0,
    contributors: 0,
    comments: [
      { id: 'c16', author: 'RooftopSolar', avatar: '🔆', text: 'I export power for almost nothing. Selling to neighbours in Pi is fairer.', date: '2026-06-21', likes: 341 },
      { id: 'c17', author: 'CarbonAudit', avatar: '🌱', text: 'Linking each trade to the EcoChain carbon registry is the smart part.', date: '2026-06-27', likes: 205 },
    ],
    milestones: [ms('research', true), ms('integration', true), ms('build', false), ms('pilot', false), ms('scale', false)],
    team: [
      { name: 'Lucas Meyer', role: 'Energy Systems', avatar: '🔋' },
      { name: 'Ayaka Mori', role: 'Smart Metering', avatar: '📈' },
      { name: 'Zanele Dube', role: 'Community Grids', avatar: '🏘️' },
    ],
  },
];

const userVotes: UserVote[] = [
  { proposalId: '1', vote: 'for', date: '2026-05-11' },
  { proposalId: '2', vote: 'for', date: '2026-04-21' },
  { proposalId: '3', vote: 'for', date: '2026-05-02' },
  { proposalId: '5', vote: 'against', date: '2026-05-19' },
  { proposalId: '7', vote: 'for', date: '2026-08-06' },
  { proposalId: '10', vote: 'for', date: '2026-06-20' },
];

const userContributions: UserContribution[] = [
  { proposalId: '2', amount: 150, date: '2026-04-25' },
  { proposalId: '4', amount: 75, date: '2026-03-20' },
  { proposalId: '6', amount: 50, date: '2026-02-15' },
  { proposalId: '9', amount: 120, date: '2026-07-08' },
];

/** Resolve every i18n key of a proposal into the active locale. */
function localize(p: Proposal): Proposal {
  return {
    ...p,
    title: t(p.title),
    description: t(p.description),
    fullDescription: t(p.fullDescription),
    milestones: p.milestones.map((m) => ({
      ...m,
      title: t(m.title),
      description: t(m.description),
    })),
  };
}

export function getProposals(): Proposal[] {
  return proposals.map(localize);
}

export function getProposalById(id: string): Proposal | undefined {
  const found = proposals.find((p) => p.id === id);
  return found ? localize(found) : undefined;
}

export function getProposalsByStatus(status: ProposalStatus): Proposal[] {
  return proposals.filter((p) => p.status === status).map(localize);
}

export function getProposalsByCategory(category: Category): Proposal[] {
  return proposals.filter((p) => p.category === category).map(localize);
}

export function getUserVotes(): UserVote[] {
  return userVotes;
}

export function getUserContributions(): UserContribution[] {
  return userContributions;
}

export function getCategoryLabel(cat: Category): string {
  const keys: Record<Category, string> = {
    education: 'proposals.cat.education',
    commerce: 'proposals.cat.commerce',
    technology: 'proposals.cat.technology',
    social: 'proposals.cat.social',
    environment: 'proposals.cat.environment',
  };
  return t(keys[cat]);
}

export function getStatusLabel(status: ProposalStatus): string {
  const keys: Record<ProposalStatus, string> = {
    voting: 'proposals.filter.voting',
    approved: 'proposals.filter.approved',
    funding: 'proposals.filter.funding',
    funded: 'proposals.filter.funded',
    completed: 'proposals.filter.completed',
    rejected: 'status.rejected',
  };
  return t(keys[status]);
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