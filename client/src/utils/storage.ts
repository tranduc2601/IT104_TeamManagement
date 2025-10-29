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

// --- Projects persistence (simple localStorage-backed) ---
import type { Project } from "../interfaces/Project.interface";
// full project type (with tasks/members)
import type { Project as FullProject } from "../interfaces/project";

const PROJECTS_KEY = "projects";

export const getProjects = (): Project[] => {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
};

export const setProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (_e) {
    void _e;
  }
};

export const addProject = (name: string): Project => {
  const list = getProjects();
  const id = list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
  const newProject: Project = { id, name };
  list.push(newProject);
  setProjects(list);
  return newProject;
};

export const updateProject = (id: number, name: string): Project | null => {
  const list = getProjects();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], name };
  setProjects(list);
  return list[idx];
};

export const deleteProject = (id: number) => {
  const list = getProjects();
  const next = list.filter((p) => p.id !== id);
  setProjects(next);
};

// --- Full project persistence (projects with tasks/members) ---
const FULL_PROJECTS_KEY = "projects_full";

export const getFullProjects = (): FullProject[] => {
  try {
    const raw = localStorage.getItem(FULL_PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as FullProject[]) : [];
  } catch {
    return [];
  }
};

export const setFullProjects = (projects: FullProject[]) => {
  try {
    localStorage.setItem(FULL_PROJECTS_KEY, JSON.stringify(projects));
  } catch (_e) {
    void _e;
  }
};

export const getFullProjectById = (id: number): FullProject | null => {
  const list = getFullProjects();
  const p = list.find((x) => x.id === id);
  return p ?? null;
};

export const addFullProject = (project: FullProject) => {
  const list = getFullProjects();
  list.push(project);
  setFullProjects(list);
  return project;
};

export const updateFullProject = (project: FullProject) => {
  const list = getFullProjects();
  const idx = list.findIndex((p) => p.id === project.id);
  if (idx === -1) {
    list.push(project);
  } else {
    list[idx] = project;
  }
  setFullProjects(list);
  return project;
};

export const deleteFullProject = (id: number) => {
  const list = getFullProjects();
  const next = list.filter((p) => p.id !== id);
  setFullProjects(next);
};
