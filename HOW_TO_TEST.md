# Hướng Dẫn Test - Trang Quản Lý Dự Án

## ✅ Đã Sửa

### 1. **Không thể thêm dự án**
**Nguyên nhân**: User chưa đăng nhập hoặc chưa có user trong localStorage

**Giải pháp**:
- ✅ Tự động khởi tạo 3 test users khi app chạy
- ✅ Thêm validation và thông báo rõ ràng khi user chưa đăng nhập
- ✅ Thêm console.log để debug dễ dàng

### 2. **Không thể xem chi tiết dự án**
**Nguyên nhân**: ProjectDetail component đã được sửa ở lần trước

**Đã sửa**: ✅ Component ProjectDetail đã hoạt động đúng (xem FIX_PROJECT_DETAIL.md)

### 3. **Trang trống, không hiển thị gì**
**Nguyên nhân**: Không có user hoặc không có projects

**Giải pháp**:
- ✅ Hiển thị message "Vui lòng đăng nhập" nếu chưa login
- ✅ Hiển thị message "Chưa có dự án" nếu list rỗng
- ✅ Tự động init dữ liệu test

## 🧪 Hướng Dẫn Test

### Bước 1: Khởi động app
```bash
cd client
npm run dev
```
App sẽ chạy tại: `http://localhost:5173` hoặc `http://localhost:5174`

### Bước 2: Check console
Mở Browser Console (F12), bạn sẽ thấy:
```
🔧 Initializing test users...
✅ Created user: an@test.com
✅ Created user: bach@test.com
✅ Created user: cuong@test.com
🔧 Initializing test projects...
✅ Created project: Website Thương mại Điện tử (owner: 1)
✅ Created project: Ứng dụng Quản lý Học tập (owner: 1)
...
✨ Test data initialized!

📝 Test Accounts:
- an@test.com / 12345678 (3 projects)
- bach@test.com / 12345678 (2 projects)  
- cuong@test.com / 12345678 (1 project)
```

### Bước 3: Đăng nhập
1. Vào `/login`
2. Nhập:
   - Email: `an@test.com`
   - Password: `12345678`
3. Click "Đăng nhập"

### Bước 4: Xem danh sách dự án
- Tự động chuyển đến `/projects`
- Thấy 3 dự án của user "An Nguyễn"
- Console sẽ hiện:
  ```
  🔍 ProjectList - Current User: {id: 1, fullName: "An Nguyễn", ...}
  📦 ProjectList - Stored projects: [...]
  👤 Loading projects for user 1: [3 projects]
  ```

### Bước 5: Thêm dự án mới
1. Click "Thêm Dự Án"
2. Modal mở ra
3. Nhập:
   - Tên: `Dự án Test` (3-100 ký tự)
   - Mô tả: `Mô tả test` (tùy chọn, max 500 ký tự)
4. Click "Lưu"
5. Console sẽ hiện:
   ```
   💾 Saving project: {name: "Dự án Test", ...}
   ➕ Creating new project
   ✅ Project created: {id: 7, name: "Dự án Test", ownerId: 1}
   📋 Updated projects list: [4 projects]
   ✅ Full project created: {...}
   ```
6. Dự án mới xuất hiện trong danh sách

### Bước 6: Xem chi tiết dự án
1. Click nút "Chi tiết" ở bất kỳ dự án nào
2. URL thay đổi: `/projects/:id`
3. Trang hiển thị đầy đủ:
   - Thông tin dự án (tên, mô tả, thumbnail)
   - Danh sách nhiệm vụ (tasks)
   - Danh sách thành viên (members)
4. Console sẽ hiện:
   ```
   [ProjectDetail] Loading project ID: 1
   ✅ Project loaded from localStorage
   ```

### Bước 7: Test với user khác
1. Logout (nếu có chức năng) hoặc clear currentUser
2. Login với:
   - Email: `bach@test.com`
   - Password: `12345678`
3. Thấy 2 dự án của user "Bách Nguyễn"

## 🐛 Debug

### Nếu không thấy dự án:
1. Mở Console (F12)
2. Xem logs:
   - `🔍 ProjectList - Current User:` → Check có user không
   - `📦 ProjectList - Stored projects:` → Check có projects không
   - `👤 Loading projects for user X:` → Check filter có đúng không

### Nếu không thể thêm dự án:
1. Check console:
   - `❌ No current user` → Chưa đăng nhập
   - `💾 Saving project:` → Check data có đúng không
2. Check localStorage:
   ```js
   // Trong console
   localStorage.getItem('currentUser')
   localStorage.getItem('projects')
   localStorage.getItem('projects_full')
   ```

### Reset dữ liệu:
```js
// Trong browser console
localStorage.clear()
location.reload()
```

## 📁 Files Đã Thay Đổi

1. ✅ `client/src/pages/ProjectList.tsx`
   - Thêm debug logs
   - Thêm message khi list rỗng
   - Thêm warning khi chưa login

2. ✅ `client/src/initTestData.ts` (MỚI)
   - Auto-init test users
   - Auto-init test projects

3. ✅ `client/src/main.tsx`
   - Import initTestData

4. ✅ `TEST_USERS.js`
   - Script thủ công để tạo users

5. ✅ `HOW_TO_TEST.md` (tài liệu này)

## ✨ Tính Năng Đã Hoạt Động

- ✅ Đăng nhập với test accounts
- ✅ Hiển thị dự án theo owner
- ✅ Thêm dự án mới (với validation đầy đủ)
- ✅ Sửa dự án
- ✅ Xóa dự án (với modal xác nhận)
- ✅ Xem chi tiết dự án
- ✅ Navigation hoạt động
- ✅ Console logs để debug

## 🎯 Test Cases

### ✅ Test 1: Login và xem projects
- Login với `an@test.com` → Thấy 3 projects
- Login với `bach@test.com` → Thấy 2 projects
- Login với `cuong@test.com` → Thấy 1 project

### ✅ Test 2: Thêm project
- Click "Thêm Dự Án" → Modal mở
- Nhập tên (ít nhất 3 ký tự) → OK
- Nhập tên trùng → Lỗi "Tên dự án đã tồn tại"
- Nhập mô tả > 500 ký tự → Lỗi
- Lưu thành công → Project xuất hiện trong list

### ✅ Test 3: Xem chi tiết
- Click "Chi tiết" → Chuyển sang `/projects/:id`
- Trang hiển thị đầy đủ info
- Có thể thêm/sửa/xóa tasks
- Có thể quản lý members

### ✅ Test 4: Xóa project
- Click "Xóa" → Modal xác nhận
- Hiển thị tên project
- Click "Xóa" → Project bị xóa
- Click "Hủy" → Không xóa

## 🔐 Test Accounts

| Email | Password | Projects | User ID |
|-------|----------|----------|---------|
| an@test.com | 12345678 | 3 | 1 |
| bach@test.com | 12345678 | 2 | 2 |
| cuong@test.com | 12345678 | 1 | 3 |

## 📝 Notes

- Tất cả data lưu trong localStorage
- Auto-init chỉ chạy trong development mode
- Console logs có emoji để dễ phân biệt
- Mỗi user chỉ thấy projects của mình (theo ownerId)
