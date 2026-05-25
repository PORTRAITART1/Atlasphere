// Pi Network SDK Simulation for PiPolis
export interface PiUser {
  uid: string;
  username: string;
  displayName: string;
  avatar: string;
  reputation: number;
  votingPower: number;
  piBalance: number;
  joinedDate: string;
  proposalsCreated: number;
  votescast: number;
  contributions: number;
  badges: string[];
}

let currentUser: PiUser | null = null;
const listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getCurrentUser(): PiUser | null {
  return currentUser;
}

export async function authenticate(): Promise<PiUser> {
  await new Promise((r) => setTimeout(r, 1200));
  currentUser = {
    uid: 'pioneer_' + Math.random().toString(36).slice(2, 10),
    username: 'pioneer_dao',
    displayName: 'Pioneer DAO',
    avatar: '🧑‍💻',
    reputation: 850,
    votingPower: 42,
    piBalance: 1247.5,
    joinedDate: '2024-03-15',
    proposalsCreated: 3,
    votescast: 28,
    contributions: 12,
    badges: ['Early Voter', 'Proposal Creator', 'Top Contributor', 'Community Builder'],
  };
  notifyListeners();
  return currentUser;
}

export function logout() {
  currentUser = null;
  notifyListeners();
}

export async function contributePI(amount: number): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 800));
  if (currentUser && currentUser.piBalance >= amount) {
    currentUser = { ...currentUser, piBalance: currentUser.piBalance - amount, contributions: currentUser.contributions + 1 };
    notifyListeners();
    return true;
  }
  return false;
}

export async function castVote(): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600));
  if (currentUser) {
    currentUser = { ...currentUser, votescast: currentUser.votescast + 1, reputation: currentUser.reputation + 5 };
    notifyListeners();
    return true;
  }
  return false;
}