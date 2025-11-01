import type { Project } from '../interfaces/project';
import { members } from './projectData';

// Dữ liệu mẫu cho dự án ban đầu
export const initialFullProjects: Project[] = [
  {
    id: 1,
    name: 'Website Thương mại Điện tử',
    description: 'Xây dựng nền tảng thương mại điện tử với các tính năng giỏ hàng, thanh toán và quản lý sản phẩm.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    startDate: '2025-02-01',
    endDate: '2025-12-31',
    status: 'Active',
    ownerId: 1, // An Nguyễn
    members: members,
    tasks: [],
  },
  {
    id: 2,
    name: 'Ứng dụng Quản lý Học tập',
    description: 'Phát triển ứng dụng mobile và web để quản lý tiến độ học tập, bài tập và điểm số.',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
    startDate: '2025-03-01',
    endDate: '2025-11-30',
    status: 'Active',
    ownerId: 1, // An Nguyễn
    members: [members[0], members[1]],
    tasks: [],
  },
  {
    id: 3,
    name: 'Hệ thống Quản lý Kho',
    description: 'Xây dựng hệ thống quản lý kho hàng với tính năng nhập/xuất, theo dõi tồn kho và báo cáo.',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
    startDate: '2025-01-15',
    endDate: '2025-10-15',
    status: 'Active',
    ownerId: 2, // Bách Nguyễn
    members: [members[1], members[2]],
    tasks: [],
  },
  {
    id: 4,
    name: 'Platform Mạng Xã hội',
    description: 'Phát triển nền tảng mạng xã hội cho cộng đồng với tính năng chia sẻ, kết bạn và nhắn tin.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: 'Active',
    ownerId: 3, // Cường Trần
    members: [members[2], members[3]],
    tasks: [],
  },
  {
    id: 5,
    name: 'App Đặt Lịch Khám Bệnh',
    description: 'Ứng dụng đặt lịch và quản lý hồ sơ khám bệnh trực tuyến.',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    startDate: '2025-02-15',
    endDate: '2025-09-15',
    status: 'On Hold',
    ownerId: 1, // An Nguyễn
    members: [members[0], members[3]],
    tasks: [],
  },
  {
    id: 6,
    name: 'Dashboard Phân tích Dữ liệu',
    description: 'Xây dựng dashboard để phân tích và trực quan hóa dữ liệu kinh doanh.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    startDate: '2025-01-01',
    endDate: '2025-08-31',
    status: 'Completed',
    ownerId: 2, // Bách Nguyễn
    members: [members[1], members[0]],
    tasks: [],
  },
];
