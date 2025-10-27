import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'

const App = () => {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
      <ToastContainer />
    </ToastProvider>
  )
}

export default App
