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
}

export type TaskStatus = "To do" | "In Progress" | "Pending" | "Done";
export type TaskPriority = "Thấp" | "Trung Bình" | "Cao";
export type TaskProgress = "Đúng tiến độ" | "Trễ hạn" | "Có rủi ro";
