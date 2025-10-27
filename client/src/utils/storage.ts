// Helper for simple client-side storage of users (demo only)
// In production replace calls here with API calls (axios/fetch) to your backend.
// Example (pseudo):
// // import axios from 'axios';
// export const addUser = async (user) => axios.post('/api/users', user);

export interface UserRecord {
  id: number;
  fullName: string;
  email: string;
  password: string;
}

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const getUsers = (): UserRecord[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) as UserRecord[] : [];
  } catch {
    return [];
  }
};

export const addUser = (user: Omit<UserRecord, 'id'>): UserRecord => {
  const list = getUsers();
  const id = list.length ? Math.max(...list.map(u => u.id)) + 1 : 1;
  const newUser: UserRecord = { id, ...user };
  list.push(newUser);
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  } catch (_e) {
    // best-effort write; ignore failures in demo environment
    // keep variable referenced for linters
    void _e;
  }
  return newUser;
};

export const findUserByEmail = (email: string): UserRecord | undefined => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const setCurrentUser = (user: UserRecord | null) => {
  try {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  } catch (_e) {
    // ignore write errors for demo
    void _e;
  }
};

export const getCurrentUser = (): UserRecord | null => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as UserRecord) : null;
  } catch (_e) {
    // parse error
    void _e;
    return null;
  }
};
