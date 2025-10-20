import type { Task } from "../interfaces/Task.interface";

export const mockTasks: Task[] = [
  {
    id: 1,
    name: "Thiết kế UI trang đăng nhập",
    assignee: "Nguyễn Văn A",
    startDate: "2025-10-01",
    endDate: "2025-10-05",
    progress: "Đúng tiến độ",
    priority: "Cao",
    status: "todo",
  },
  {
    id: 2,
    name: "Xây dựng API đăng nhập",
    assignee: "Trần Thị B",
    startDate: "2025-10-02",
    endDate: "2025-10-06",
    progress: "Trễ hạn",
    priority: "Trung bình",
    status: "inprogress",
  },
  {
    id: 3,
    name: "Tối ưu component Dashboard",
    assignee: "Phạm Văn C",
    startDate: "2025-10-03",
    endDate: "2025-10-07",
    progress: "Có rủi ro",
    priority: "Thấp",
    status: "pending",
  },
  {
    id: 4,
    name: "Test hệ thống trước demo",
    assignee: "Lê Thị D",
    startDate: "2025-10-05",
    endDate: "2025-10-09",
    progress: "Hoàn thành",
    priority: "Cao",
    status: "done",
  },
];
