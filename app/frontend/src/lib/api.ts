// Atlasphere API Service - Version locale (fetch direct)
// Remplace les appels SDK MetagptX par des appels fetch() natifs

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ============================================
// Helper fetchAPI - Remplace getClient()
// ============================================
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = API_BASE_URL + endpoint;
  console.log('[API]', options?.method || 'GET', url);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('API error: ' + response.status + ' ' + response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============================================
// Types (inchangés)
// ============================================
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

  const url = '/api/v1/entities/projects/all' + (searchParams.toString() ? '?' + searchParams.toString() : '');
  return await fetchAPI<ProjectListResponse>(url);
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

  const url = '/api/v1/entities/projects' + (searchParams.toString() ? '?' + searchParams.toString() : '');
  return await fetchAPI<ProjectListResponse>(url);
}

export async function fetchProjectById(id: number): Promise<Project | null> {
  try {
    const url = '/api/v1/entities/projects/all?query=' + encodeURIComponent(JSON.stringify({ id }));
    const data = await fetchAPI<ProjectListResponse>(url);
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
  return await fetchAPI<Project>('/api/v1/entities/projects', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      status: data.status || 'voting',
      raised: 0,
      votes_for: 0,
      votes_against: 0,
      voter_count: 0,
    }),
  });
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  return await fetchAPI<Project>('/api/v1/entities/projects/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
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

  const url = '/api/v1/entities/votes/all' + (searchParams.toString() ? '?' + searchParams.toString() : '');
  return await fetchAPI<VoteListResponse>(url);
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

  const url = '/api/v1/entities/votes' + (searchParams.toString() ? '?' + searchParams.toString() : '');
  return await fetchAPI<VoteListResponse>(url);
}

export async function createVote(data: {
  project_id: number;
  vote_type: string;
  weight: number;
  pi_uid: string;
}): Promise<Vote> {
  return await fetchAPI<Vote>('/api/v1/entities/votes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
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

  const url = '/api/v1/entities/contributions/all' + (searchParams.toString() ? '?' + searchParams.toString() : '');
  return await fetchAPI<ContributionListResponse>(url);
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

  const url = '/api/v1/entities/contributions' + (searchParams.toString() ? '?' + searchParams.toString() : '');
  return await fetchAPI<ContributionListResponse>(url);
}

export async function createContribution(data: {
  project_id: number;
  amount: number;
  transaction_id?: string;
  payment_id?: string;
  status?: string;
  pi_uid: string;
}): Promise<Contribution> {
  return await fetchAPI<Contribution>('/api/v1/entities/contributions', {
    method: 'POST',
    body: JSON.stringify({ ...data, status: data.status || 'completed' }),
  });
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

  const url = '/api/v1/entities/notifications' + (searchParams.toString() ? '?' + searchParams.toString() : '');
  return await fetchAPI<NotificationListResponse>(url);
}

export async function markNotificationRead(id: number): Promise<void> {
  await fetchAPI<void>('/api/v1/entities/notifications/' + id, {
    method: 'PUT',
    body: JSON.stringify({ read: true }),
  });
}

export async function markAllNotificationsRead(ids: number[]): Promise<void> {
  await fetchAPI<void>('/api/v1/entities/notifications/batch', {
    method: 'PUT',
    body: JSON.stringify({
      items: ids.map((id) => ({ id, updates: { read: true } })),
    }),
  });
}

// ============ HELPERS (inchangés) ============

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

// ============================================
// Convenience API object - Version locale
// ============================================
export const api = {
  async listAll(entity: string, params?: { query?: string; sort?: string; skip?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    searchParams.set('limit', String(params?.limit || 2000));

    const url = '/api/v1/entities/' + entity + '/all?' + searchParams.toString();
    return await fetchAPI<{ items: Record<string, unknown>[]; total: number; skip: number; limit: number }>(url);
  },
  async listMy(entity: string, params?: { query?: string; sort?: string; skip?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    searchParams.set('limit', String(params?.limit || 2000));

    const url = '/api/v1/entities/' + entity + '?' + searchParams.toString();
    return await fetchAPI<{ items: Record<string, unknown>[]; total: number; skip: number; limit: number }>(url);
  },
  async get(entity: string, id: number) {
    return await fetchAPI<Record<string, unknown>>('/api/v1/entities/' + entity + '/' + id);
  },
  async create(entity: string, data: Record<string, unknown>) {
    return await fetchAPI<Record<string, unknown>>('/api/v1/entities/' + entity, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(entity: string, id: number, data: Record<string, unknown>) {
    return await fetchAPI<Record<string, unknown>>('/api/v1/entities/' + entity + '/' + id, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async remove(entity: string, id: number) {
    await fetchAPI<void>('/api/v1/entities/' + entity + '/' + id, {
      method: 'DELETE',
    });
  },
};