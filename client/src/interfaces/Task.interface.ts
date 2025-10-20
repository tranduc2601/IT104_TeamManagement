export type TaskStatus = "todo" | "inprogress" | "pending" | "done";

export interface Task {
  id: number;
  name: string;
  assignee: string;
  startDate: string;
  endDate: string;
  progress: string;
  priority: string;
  status: TaskStatus;
}
