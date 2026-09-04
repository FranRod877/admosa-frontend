import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authApi from '../api/authApi'
import { TOKEN_KEY, setUnauthorizedHandler } from '../api/http'
import type { Usuario } from '../types'

const USER_KEY = 'admosa_user'

interface AuthContextValue {
  usuario: Usuario | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function decodeJwtExpiration(token: string): number {
  const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const payload = JSON.parse(atob(payloadBase64)) as { exp: number }
  return payload.exp
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false
  try {
    return decodeJwtExpiration(token) * 1000 > Date.now()
  } catch {
    return false
  }
}

function readInitialUser(): Usuario | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const rawUser = localStorage.getItem(USER_KEY)
  if (!isTokenValid(token) || !rawUser) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    return null
  }
  return JSON.parse(rawUser) as Usuario
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => readInitialUser())

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUsuario(null)
  }

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.usuario))
    setUsuario(response.usuario)
  }

  const value = useMemo(
    () => ({ usuario, isAuthenticated: usuario !== null, login, logout }),
    [usuario],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}
