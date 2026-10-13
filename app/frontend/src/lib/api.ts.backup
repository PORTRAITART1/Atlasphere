// AtlaspherePi API Service - Connects frontend to real backend
import { createClient } from '@metagptx/web-sdk';

// Lazy-initialize client to avoid blocking on module load
let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

// Types matching backend schemas
export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  budget: number;
  raised: number | null;
  status: string | null;
  votes_for: number | null;
  votes_against: number | null;
  voter_count: number | null;
  milestones: string | null;
  team: string | null;
  region: string | null;
  deadline: string | null;
  escrow_contract_id: string | null;
  quorum: number | null;
  threshold: number | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  skip: number;
  limit: number;
}

export interface Vote {
  id: number;
  project_id: number;
  vote_type: string;
  weight: number;
  pi_uid: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface VoteListResponse {
  items: Vote[];
  total: number;
  skip: number;
  limit: number;
}

export interface Contribution {
  id: number;
  project_id: number;
  amount: number;
  transaction_id: string | null;
  payment_id: string | null;
  status: string | null;
  pi_uid: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ContributionListResponse {
  items: Contribution[];
  total: number;
  skip: number;
  limit: number;
}

export interface Notification {
  id: number;
  pi_uid: string;
  notification_type: string;
  title: string;
  body: string;
  data: string | null;
  read: boolean | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  skip: number;
  limit: number;
}

// ============ PROJECTS API ============

export async function fetchAllProjects(params?: {
  query?: Record<string, unknown>;
  sort?: string;
  skip?: number;
  limit?: number;
}): Promise<ProjectListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set('query', JSON.stringify(params.query));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));

  const url = `/api/v1/entities/projects/all${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await getClient().apiCall.invoke({ url, method: 'GET' });
  return response?.data as ProjectListResponse;
}

export async function fetchMyProjects(params?: {
  query?: Record<string, unknown>;
  sort?: string;
  skip?: number;
  limit?: number;
}): Promise<ProjectListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set('query', JSON.stringify(params.query));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));

  const url = `/api/v1/entities/projects${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await getClient().apiCall.invoke({ url, method: 'GET' });
  return response?.data as ProjectListResponse;
}

export async function fetchProjectById(id: number): Promise<Project | null> {
  try {
    const response = await getClient().apiCall.invoke({
      url: `/api/v1/entities/projects/all?query=${encodeURIComponent(JSON.stringify({ id }))}`,
      method: 'GET',
    });
    const data = response?.data as ProjectListResponse;
    return data?.items?.[0] || null;
  } catch {
    return null;
  }
}

export async function createProject(data: {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline?: string;
  team?: string;
  milestones?: string;
  status?: string;
}): Promise<Project> {
  const response = await getClient().apiCall.invoke({
    url: '/api/v1/entities/projects',
    method: 'POST',
    data: {
      ...data,
      status: data.status || 'voting',
      raised: 0,
      votes_for: 0,
      votes_against: 0,
      voter_count: 0,
    },
  });
  return response?.data as Project;
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  const response = await getClient().apiCall.invoke({
    url: `/api/v1/entities/projects/${id}`,
    method: 'PUT',
    data,
  });
  return response?.data as Project;
}

// ============ VOTES API ============

export async function fetchAllVotes(params?: {
  query?: Record<string, unknown>;
  sort?: string;
  skip?: number;
  limit?: number;
}): Promise<VoteListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set('query', JSON.stringify(params.query));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));

  const url = `/api/v1/entities/votes/all${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await getClient().apiCall.invoke({ url, method: 'GET' });
  return response?.data as VoteListResponse;
}

export async function fetchMyVotes(params?: {
  query?: Record<string, unknown>;
  sort?: string;
  skip?: number;
  limit?: number;
}): Promise<VoteListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set('query', JSON.stringify(params.query));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));

  const url = `/api/v1/entities/votes${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await getClient().apiCall.invoke({ url, method: 'GET' });
  return response?.data as VoteListResponse;
}

export async function createVote(data: {
  project_id: number;
  vote_type: string;
  weight: number;
  pi_uid: string;
}): Promise<Vote> {
  const response = await getClient().apiCall.invoke({
    url: '/api/v1/entities/votes',
    method: 'POST',
    data,
  });
  return response?.data as Vote;
}

// ============ CONTRIBUTIONS API ============

export async function fetchAllContributions(params?: {
  query?: Record<string, unknown>;
  sort?: string;
  skip?: number;
  limit?: number;
}): Promise<ContributionListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set('query', JSON.stringify(params.query));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));

  const url = `/api/v1/entities/contributions/all${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await getClient().apiCall.invoke({ url, method: 'GET' });
  return response?.data as ContributionListResponse;
}

export async function fetchMyContributions(params?: {
  query?: Record<string, unknown>;
  sort?: string;
  skip?: number;
  limit?: number;
}): Promise<ContributionListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set('query', JSON.stringify(params.query));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));

  const url = `/api/v1/entities/contributions${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await getClient().apiCall.invoke({ url, method: 'GET' });
  return response?.data as ContributionListResponse;
}

export async function createContribution(data: {
  project_id: number;
  amount: number;
  transaction_id?: string;
  payment_id?: string;
  status?: string;
  pi_uid: string;
}): Promise<Contribution> {
  const response = await getClient().apiCall.invoke({
    url: '/api/v1/entities/contributions',
    method: 'POST',
    data: { ...data, status: data.status || 'completed' },
  });
  return response?.data as Contribution;
}

// ============ NOTIFICATIONS API ============

export async function fetchMyNotifications(params?: {
  query?: Record<string, unknown>;
  sort?: string;
  skip?: number;
  limit?: number;
}): Promise<NotificationListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set('query', JSON.stringify(params.query));
  if (params?.sort) searchParams.set('sort', '-created_at');
  if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit || 20));

  const url = `/api/v1/entities/notifications${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await getClient().apiCall.invoke({ url, method: 'GET' });
  return response?.data as NotificationListResponse;
}

export async function markNotificationRead(id: number): Promise<void> {
  await getClient().apiCall.invoke({
    url: `/api/v1/entities/notifications/${id}`,
    method: 'PUT',
    data: { read: true },
  });
}

export async function markAllNotificationsRead(ids: number[]): Promise<void> {
  await getClient().apiCall.invoke({
    url: '/api/v1/entities/notifications/batch',
    method: 'PUT',
    data: {
      items: ids.map((id) => ({ id, updates: { read: true } })),
    },
  });
}

// ============ HELPERS ============

export function getStatusLabel(status: string | null): string {
  const map: Record<string, string> = {
    voting: '🗳️ En Vote',
    approved: '✅ Approuvé',
    funding: '💰 En Financement',
    funded: '🎉 Financé',
    completed: '🏆 Terminé',
    rejected: '❌ Rejeté',
  };
  return map[status || ''] || status || 'Inconnu';
}

export function getStatusColor(status: string | null): string {
  const map: Record<string, string> = {
    voting: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    funding: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    funded: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };
  return map[status || ''] || 'bg-gray-500/20 text-gray-400';
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    education: '📚 Éducation',
    commerce: '🛍️ Commerce',
    technology: '💻 Technologie',
    social: '🤝 Social',
    environment: '🌍 Environnement',
  };
  return map[category] || category;
}

export function parseMilestones(milestones: string | null): { title: string; description: string; completed: boolean }[] {
  if (!milestones) return [];
  try {
    return JSON.parse(milestones);
  } catch {
    return [];
  }
}

export function parseTeam(team: string | null): { name: string; role: string; avatar: string }[] {
  if (!team) return [];
  try {
    return JSON.parse(team);
  } catch {
    return [];
  }
}

// Convenience API object for generic CRUD operations
export const api = {
  async listAll(entity: string, params?: { query?: string; sort?: string; skip?: number; limit?: number }) {
    const res = await getClient().entities.list(entity, { ...params, limit: params?.limit || 2000 });
    return res as { items: Record<string, unknown>[]; total: number; skip: number; limit: number };
  },
  async listMy(entity: string, params?: { query?: string; sort?: string; skip?: number; limit?: number }) {
    const res = await getClient().entities.list(entity, { ...params, owned: true, limit: params?.limit || 2000 });
    return res as { items: Record<string, unknown>[]; total: number; skip: number; limit: number };
  },
  async get(entity: string, id: number) {
    return await getClient().entities.get(entity, id);
  },
  async create(entity: string, data: Record<string, unknown>) {
    return await getClient().entities.create(entity, data);
  },
  async update(entity: string, id: number, data: Record<string, unknown>) {
    return await getClient().entities.update(entity, id, data);
  },
  async remove(entity: string, id: number) {
    return await getClient().entities.delete(entity, id);
  },
};