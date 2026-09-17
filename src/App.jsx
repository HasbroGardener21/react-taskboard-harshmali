import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import TaskBoard from './pages/TaskBoard'
import TaskDetails from './pages/TaskDetails'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import { useState, useEffect } from 'react'

function AppRoutes() {
  const { token, user } = useAuth()
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <AppProvider token={token} userId={user?.id}>
      <Routes>
        <Route
          path="/"
          element={token
            ? <TaskBoard toggleTheme={toggleTheme} theme={theme} />
            : <Navigate to="/login" />}
        />
        <Route
          path="/task/:id"
          element={token ? <TaskDetails /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={token && user?.role === 'admin'
            ? <AdminDashboard />
            : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </AppProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App