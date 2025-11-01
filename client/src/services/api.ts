import type { Project, Task, Member } from '../interfaces/project';

const API_BASE_URL = 'http://localhost:5000';

// Flag bật/tắt API (mặc định false = dùng localStorage)
export const USE_API = false;

// API Service
export const api = {
  // Lấy tất cả projects
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  // Lấy project theo ID
  getProjectById: async (id: number): Promise<Project | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Tạo project mới
  createProject: async (project: Omit<Project, 'id'>): Promise<Project | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Cập nhật project
  updateProject: async (id: number, project: Partial<Project>): Promise<Project | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to update project');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Xóa project
  deleteProject: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('API Error:', error);
      return false;
    }
  },

  // Thêm task vào project
  addTask: async (projectId: number, task: Task): Promise<Project | null> => {
    try {
      const project = await api.getProjectById(projectId);
      if (!project) return null;
      const updatedTasks = [...project.tasks, task];
      return await api.updateProject(projectId, { tasks: updatedTasks });
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Cập nhật task
  updateTask: async (projectId: number, taskId: number, updates: Partial<Task>): Promise<Project | null> => {
    try {
      const project = await api.getProjectById(projectId);
      if (!project) return null;

      const updatedTasks = project.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      );

      return await api.updateProject(projectId, { tasks: updatedTasks });
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Xóa task
  deleteTask: async (projectId: number, taskId: number): Promise<Project | null> => {
    try {
      const project = await api.getProjectById(projectId);
      if (!project) return null;
      const updatedTasks = project.tasks.filter((t) => t.id !== taskId);
      return await api.updateProject(projectId, { tasks: updatedTasks });
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Thêm member vào project
  addMember: async (projectId: number, member: Member): Promise<Project | null> => {
    try {
      const project = await api.getProjectById(projectId);
      if (!project) return null;
      const updatedMembers = [...project.members, member];
      return await api.updateProject(projectId, { members: updatedMembers });
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Cập nhật member
  updateMember: async (projectId: number, memberId: number, updates: Partial<Member>): Promise<Project | null> => {
    try {
      const project = await api.getProjectById(projectId);
      if (!project) return null;

      const updatedMembers = project.members.map((m) =>
        m.id === memberId ? { ...m, ...updates } : m
      );

      return await api.updateProject(projectId, { members: updatedMembers });
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Xóa member
  deleteMember: async (projectId: number, memberId: number): Promise<Project | null> => {
    try {
      const project = await api.getProjectById(projectId);
      if (!project) return null;
      const updatedMembers = project.members.filter((m) => m.id !== memberId);
      return await api.updateProject(projectId, { members: updatedMembers });
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },
};

// Helper chuyển đổi giữa localStorage và API
export const dataService = {
  async getProject(id: number): Promise<Project | null> {
    if (USE_API) {
      return await api.getProjectById(id);
    } else {
      const { getFullProjectById } = await import('../utils/storage');
      return getFullProjectById(id);
    }
  },

  async saveProject(project: Project): Promise<void> {
    if (USE_API) {
      await api.updateProject(project.id, project);
    } else {
      const { updateFullProject } = await import('../utils/storage');
      updateFullProject(project);
    }
  },
};
