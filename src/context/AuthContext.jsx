import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../api/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Keeping 'token' as the state variable name so App.jsx doesn't break
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  const login = async (email, password) => {
    try {
      setAuthLoading(true)
      setAuthError(null)
      const data = await loginUser(email, password)
      
      // Grab the specific accessToken from your new backend payload
      setToken(data.accessToken) 
      setUser(data.user)
      
      // Save both tokens for your dual-token auth flow
      localStorage.setItem('token', data.accessToken) 
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (email, password) => {
    try {
      setAuthLoading(true)
      setAuthError(null)
      const data = await registerUser(email, password)
      
      // Apply the same fix to registration
      setToken(data.accessToken)
      setUser(data.user)
      
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{
      token, user, authError, authLoading,
      login, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}