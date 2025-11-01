// src/interfaces/project.ts

export interface Task {
  id: number;
  name: string;
  assignee: string;
  priority: "Thấp" | "Trung Bình" | "Cao";
  startDate: string;
  endDate: string;
  progress: "Đúng tiến độ" | "Trễ hạn" | "Có rủi ro";
  status: "To do" | "In Progress" | "Pending" | "Done";
}

export interface Member {
  id: number;
  name: string;
  role: string;
  initials: string;
  color: string;
  email?: string;
  joinDate?: string;
}

// Basic project interface (used in project list)
export interface ProjectBasic {
  id: number;
  name: string;
  ownerId: number; // ID của user là project owner
}

// Full project interface (with tasks/members, used in project detail)
export interface Project {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "On Hold";
  members: Member[];
  tasks: Task[];
  ownerId: number; // ID của user là project owner
}

// Validation constants
export const PROJECT_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 0,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

export type TaskStatus = "To do" | "In Progress" | "Pending" | "Done";
export type TaskPriority = "Thấp" | "Trung Bình" | "Cao";
export type TaskProgress = "Đúng tiến độ" | "Trễ hạn" | "Có rủi ro";
