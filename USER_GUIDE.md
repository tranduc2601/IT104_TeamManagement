# Team Management - Hướng Dẫn Sử Dụng

## 🎯 Flow Người Dùng

### 1. Đăng Ký & Đăng Nhập
```
/register → Tạo tài khoản → /login → Nhập email/password → /projects
```

### 2. Quản Lý Dự Án
```
/projects → Danh sách dự án của user
  ├─ Thêm dự án mới (+Thêm Dự Án)
  ├─ Sửa dự án (Sửa)
  ├─ Xóa dự án (Xóa)  
  └─ Xem chi tiết (Chi tiết) → /projects/:id
```

### 3. Chi Tiết Dự Án
```
/projects/:id → Quản lý chi tiết dự án
  ├─ Thêm/Sửa/Xóa nhiệm vụ (Tasks)
  ├─ Quản lý thành viên (Members)
  └─ Theo dõi tiến độ
```

## 📁 Cấu Trúc Dữ Liệu

### LocalStorage Keys:
```javascript
{
  "users": [...],           // Danh sách user
  "currentUser": {...},     // User đang đăng nhập
  "projects": [...],        // Danh sách dự án (basic)
  "projects_full": [...]    // Dự án đầy đủ (tasks, members)
}
```

### User Object:
```typescript
{
  id: number
  fullName: string
  email: string
  password: string
}
```

### ProjectBasic Object:
```typescript
{
  id: number
  name: string
  ownerId: number  // ID của user tạo dự án
}
```

### Project (Full) Object:
```typescript
{
  id: number
  name: string
  description: string
  thumbnail: string
  startDate: string
  endDate: string
  status: "Active" | "Completed" | "On Hold"
  ownerId: number
  members: Member[]
  tasks: Task[]
}
```

## 🔧 Cách Sử Dụng

### Bước 1: Đăng Ký Tài Khoản
1. Vào `/register`
2. Nhập:
   - Họ và tên
   - Email
   - Mật khẩu (≥8 ký tự)
3. Click "Đăng ký"

### Bước 2: Đăng Nhập
1. Vào `/login`
2. Nhập email/password
3. Click "Đăng nhập"
4. → Tự động chuyển sang `/projects`

### Bước 3: Tạo Dự Án Mới
1. Tại `/projects`, click "+ Thêm Dự Án"
2. Nhập:
   - Tên dự án (3-100 ký tự, không trùng)
   - Mô tả (tùy chọn, max 500 ký tự)
3. Click "Lưu"
4. Dự án xuất hiện trong danh sách

### Bước 4: Xem Chi Tiết Dự Án
1. Click nút "Chi tiết" ở dự án muốn xem
2. → Chuyển sang `/projects/:id`
3. Bắt đầu:
   - Thêm nhiệm vụ (Tasks)
   - Thêm thành viên (Members)
   - Cập nhật tiến độ

## 🧪 Test Accounts (Auto-Created)

Khi chạy app lần đầu, 3 tài khoản test sẽ tự động được tạo:

| Email | Password | Projects |
|-------|----------|----------|
| an@test.com | 12345678 | 3 |
| bach@test.com | 12345678 | 2 |
| cuong@test.com | 12345678 | 1 |

## 🐛 Troubleshooting

### Không thấy dự án sau khi đăng nhập?
1. Check console (F12) → Xem logs
2. Check localStorage:
   ```js
   localStorage.getItem('currentUser')
   localStorage.getItem('projects')
   ```
3. Đảm bảo đã đăng nhập đúng tài khoản

### Modal không hoạt động?
1. Clear cache và reload (Ctrl+Shift+R)
2. Check console có lỗi không
3. Thử logout và login lại

### Dữ liệu bị mất sau reload?
1. Check localStorage có data không:
   ```js
   Object.keys(localStorage)
   ```
2. Đảm bảo không dùng incognito mode
3. Kiểm tra browser settings không block localStorage

### Reset toàn bộ:
```js
// Trong browser console
localStorage.clear()
location.reload()
```

## 📋 Checklist Tính Năng

### ✅ Đã Hoàn Thành:
- [x] Đăng ký, đăng nhập
- [x] Quản lý dự án (CRUD)
- [x] Chỉ hiển thị dự án của owner
- [x] Validation đầy đủ
- [x] Chi tiết dự án
- [x] Quản lý tasks
- [x] Quản lý members
- [x] LocalStorage persistence
- [x] Auto-init test data

### 🎯 Lưu Ý:
- Mỗi user chỉ thấy dự án của mình (theo `ownerId`)
- Tên dự án không được trùng (case-insensitive)
- Mọi thao tác đều lưu vào localStorage
- Reload trang không mất dữ liệu

## 🚀 Development

### Start Dev Server:
```bash
cd client
npm install
npm run dev
```

### Build Production:
```bash
npm run build
```

## 📝 Code Structure

```
client/src/
├── pages/
│   ├── Login.tsx              # Trang đăng nhập
│   ├── Register.tsx           # Trang đăng ký
│   ├── ProjectList.tsx        # Danh sách dự án
│   └── ProjectDetail.tsx      # Chi tiết dự án
├── components/
│   ├── LoginForm.tsx          # Form đăng nhập
│   ├── RegisterForm.tsx       # Form đăng ký
│   ├── ProjectModal.tsx       # Modal thêm/sửa dự án
│   └── modals/                # Các modal khác
├── hooks/
│   ├── useLoginForm.ts        # Hook xử lý login
│   └── useRegisterForm.ts     # Hook xử lý register
├── utils/
│   └── storage.ts             # LocalStorage helpers
├── interfaces/
│   └── project.ts             # TypeScript types
└── mock/
    └── initialProjects.ts     # Dữ liệu mẫu
```

## 🔐 Security Notes

⚠️ **QUAN TRỌNG**: Đây là demo app, chỉ dùng cho học tập.

- Mật khẩu lưu plaintext trong localStorage (KHÔNG an toàn)
- Không có authentication thật
- Production cần:
  - Backend API với authentication
  - Hash passwords (bcrypt)
  - JWT tokens
  - HTTPS
  - Database thay vì localStorage
