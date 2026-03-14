import { createContext, useContext, useMemo, useState } from 'react'
import { API_ENDPOINTS, normalizeRole } from '../utils/apiConfig'
import { apiRequest } from '../utils/apiClient'

const AUTH_STORAGE_KEY = 'smart-parking-auth'

const AuthContext = createContext(null)

function getInitialAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return { user: null, token: null }
    const parsed = JSON.parse(raw)
    if (String(parsed?.token || '').startsWith('mock-token-')) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return { user: null, token: null }
    }
    return {
      user: parsed.user || null,
      token: parsed.token || null,
    }
  } catch {
    return { user: null, token: null }
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth)
  const [loading, setLoading] = useState(false)

  const login = async ({ email, password, expectedRole }) => {
    setLoading(true)
    try {
      const payload = await apiRequest(API_ENDPOINTS.auth.login, {
        method: 'POST',
        body: {
          email: email.trim().toLowerCase(),
          password,
        },
      })

      const backendUser = payload?.user || {}
      const mappedUser = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: normalizeRole(backendUser.role),
        vehicleNumber: backendUser.vehicleNumber || '',
        department: backendUser.department || '',
      }

      if (expectedRole && mappedUser.role !== expectedRole) {
        throw new Error(`This account is ${mappedUser.role}. Please select the correct role.`)
      }

      const token = payload?.jwtToken
      if (!token) {
        throw new Error('Token not returned by backend')
      }

      const next = { user: mappedUser, token }
      setAuth(next)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
      return next
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ name, email, password, vehicleNumber, department }) => {
    setLoading(true)
    try {
      const payload = await apiRequest(API_ENDPOINTS.auth.register, {
        method: 'POST',
        body: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          vehicleNumber: vehicleNumber.trim().toUpperCase(),
          department: department.trim(),
        },
      })

      const backendUser = payload?.user || {}
      const mappedUser = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: normalizeRole(backendUser.role),
        vehicleNumber: backendUser.vehicleNumber || '',
        department: backendUser.department || '',
      }

      const token = payload?.jwtToken
      if (!token) {
        throw new Error('Token not returned by backend')
      }

      const next = { user: mappedUser, token }
      setAuth(next)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
      return next
    } finally {
      setLoading(false)
    }
  }

  const refreshCurrentUser = async () => {
    if (!auth.token) return null

    const payload = await apiRequest(API_ENDPOINTS.auth.me, { token: auth.token })
    const backendUser = payload?.user
    if (!backendUser) return null

    const mappedUser = {
      id: backendUser._id || backendUser.id,
      name: backendUser.name,
      email: backendUser.email,
      role: normalizeRole(backendUser.role),
      vehicleNumber: backendUser.vehicleNumber || '',
      department: backendUser.department || '',
    }

    const next = { ...auth, user: mappedUser }
    setAuth(next)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
    return mappedUser
  }

  const logout = () => {
    setAuth({ user: null, token: null })
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token && auth.user),
      loading,
      login,
      register,
      refreshCurrentUser,
      logout,
    }),
    [auth, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
