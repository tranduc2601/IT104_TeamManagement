import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-black text-white py-3 px-6 flex items-center justify-between font-[Poppins]">
      <h1 className="text-lg font-semibold">Quản Lý Dự Án</h1>
      <nav className="flex items-center space-x-6 text-sm">
        <Link to="/projects" className="hover:text-[#0D6EFD] transition-colors">
          Dự Án
        </Link>
        <Link to="/tasks" className="hover:text-[#0D6EFD] transition-colors">
          Nhiệm Vụ Cá Nhân
        </Link>
        <Link to="/login" className="hover:text-[#0D6EFD] transition-colors">
          Đăng Xuất
        </Link>
      </nav>
    </header>
  )
}

export default Header
