'use client'

import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const login = (userData, userType) => {
    // In a real app, you would validate credentials with an API
    const user = { ...userData, userType }
    localStorage.setItem('user', JSON.stringify(user))
    setCurrentUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('user')
    setCurrentUser(null)
  }

  const register = (userData, userType) => {
    // In a real app, you would send registration data to an API
    const user = { ...userData, userType }
    localStorage.setItem('user', JSON.stringify(user))
    setCurrentUser(user)
    return user
  }

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
