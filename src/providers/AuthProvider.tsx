'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role: 'admin' | 'customer'
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = 'payload_jwt'
const USER_KEY = 'payload_user'

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers as Record<string, string> }
  if (token) headers['Authorization'] = `JWT ${token}`
  const response = await fetch(`/api${endpoint}`, { ...options, headers })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || `API error: ${response.status}`)
  }
  return response.json()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
    if (!token) { setUser(null); setIsLoading(false); return }
    try {
      const res = await apiFetch<{ user: AuthUser }>('/users/me')
      setUser(res.user)
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setUser(null)
    } finally { setIsLoading(false) }
  }, [])

  useEffect(() => { refreshUser() }, [refreshUser])

  const login = async (email: string, password: string) => {
    setIsLoading(true); setError(null)
    try {
      const res = await apiFetch<{ user: AuthUser; token: string }>('/users/login', {
        method: 'POST', body: JSON.stringify({ email, password })
      })
      localStorage.setItem(TOKEN_KEY, res.token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.user))
      setUser(res.user)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion'
      setError(msg); throw err
    } finally { setIsLoading(false) }
  }

  const register = async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    setIsLoading(true); setError(null)
    try {
      const res = await apiFetch<{ doc: AuthUser; token: string }>('/users', {
        method: 'POST', body: JSON.stringify(data)
      })
      localStorage.setItem(TOKEN_KEY, res.token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.doc))
      setUser(res.doc)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur d'inscription"
      setError(msg); throw err
    } finally { setIsLoading(false) }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null); setError(null)
  }

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) throw new Error('Not authenticated')
    setIsLoading(true); setError(null)
    try {
      const updated = await apiFetch<AuthUser>(`/users/${user.id}`, {
        method: 'PATCH', body: JSON.stringify(data)
      })
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      setUser(updated)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de mise à jour'
      setError(msg); throw err
    } finally { setIsLoading(false) }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, register, logout, updateProfile, clearError: () => setError(null) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
