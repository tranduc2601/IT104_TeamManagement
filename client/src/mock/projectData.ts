import type { Task, Member, Project } from '../interfaces/project';

// Dữ liệu mẫu cho task
export const initialTasks: Task[] = [
  { 
    id: 1, 
    name: 'Soạn tháo đề cương dự án', 
    assignee: 'An Nguyễn', 
    priority: 'Thấp', 
    startDate: '02 - 24', 
    endDate: '02 - 27', 
    progress: 'Đúng tiến độ', 
    status: 'To do' 
  },
  { 
    id: 2, 
    name: 'Soạn tháo đề cương dự án', 
    assignee: 'An Nguyễn', 
    priority: 'Trung Bình', 
    startDate: '02 - 24', 
    endDate: '02 - 27', 
    progress: 'Có rủi ro', 
    status: 'To do' 
  },
  { 
    id: 3, 
    name: 'Soạn tháo đề cương dự án', 
    assignee: 'An Nguyễn', 
    priority: 'Cao', 
    startDate: '02 - 24', 
    endDate: '02 - 27', 
    progress: 'Trễ hạn', 
    status: 'To do' 
  },
  { 
    id: 4, 
    name: 'Lên lịch họp kickoff', 
    assignee: 'An Nguyễn', 
    priority: 'Trung Bình', 
    startDate: '02 - 24', 
    endDate: '02 - 27', 
    progress: 'Có rủi ro', 
    status: 'In Progress' 
  },
  { 
    id: 5, 
    name: 'Thiết kế UI trang đăng nhập', 
    assignee: 'Bách Nguyễn', 
    priority: 'Cao', 
    startDate: '02 - 25', 
    endDate: '02 - 28', 
    progress: 'Đúng tiến độ', 
    status: 'In Progress' 
  },
  { 
    id: 6, 
    name: 'Xây dựng API đăng nhập', 
    assignee: 'An Nguyễn', 
    priority: 'Cao', 
    startDate: '02 - 26', 
    endDate: '03 - 01', 
    progress: 'Trễ hạn', 
    status: 'Pending' 
  },
  { 
    id: 7, 
    name: 'Test hệ thống trước demo', 
    assignee: 'Bách Nguyễn', 
    priority: 'Thấp', 
    startDate: '02 - 20', 
    endDate: '02 - 23', 
    progress: 'Đúng tiến độ', 
    status: 'Done' 
  },
];

export const members: Member[] = [
  { 
    id: 1, 
    name: 'An Nguyễn', 
    role: 'Project owner', 
    initials: 'AN', 
    color: '#007bff' 
  },
  { 
    id: 2, 
    name: 'Bách Nguyễn', 
    role: 'Frontend developer', 
    initials: 'BA', 
    color: '#8b5cf6' 
  },
  { 
    id: 3, 
    name: 'Cường Trần', 
    role: 'Backend developer', 
    initials: 'CT', 
    color: '#10b981' 
  },
  { 
    id: 4, 
    name: 'Dung Lê', 
    role: 'UI/UX Designer', 
    initials: 'DL', 
    color: '#f59e0b' 
  },
];

export const mockProject: Project = {
  id: 1,
  name: 'Xây dựng website thương mại điện tử',
  description: 'Dự án nhằm phát triển một nền tảng thương mại điện tử với các tính năng như giỏ hàng, thanh toán và quản lý sản phẩm.',
  thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  startDate: '2025-02-01',
  endDate: '2025-12-31',
  status: 'Active',
  members: members,
  tasks: initialTasks,
  ownerId: 1, // An Nguyễn is the owner
};

// Các hàm helper để làm việc với mock data
export const getTasksByStatus = (status: string): Task[] => {
  return initialTasks.filter(task => task.status === status);
};

export const getMemberById = (id: number): Member | undefined => {
  return members.find(member => member.id === id);
};

export const getTaskById = (id: number): Task | undefined => {
  return initialTasks.find(task => task.id === id);
};